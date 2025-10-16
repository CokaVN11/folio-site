import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { corsResponse, getOriginFromRequest } from '../shared/cors.js';
import {
  validateRequestBody,
  validatePathParameters,
  handleValidationError,
} from '../shared/validation.js';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '../shared/responses.js';
import { requireAuthentication, isAdminUser, extractUserInfo } from '../services/auth.js';
import {
  ContentEditPayloadSchema,
  ProjectDescriptionSchema,
  VALID_SECTIONS,
  type ContentEditPayload,
  type ProjectDescription,
} from '../schemas/content.js';
import {
  generateDescKey,
  uploadToS3,
  formatJsonForStorage,
  parseJsonFromS3,
  objectExists,
} from '../services/s3.js';

/**
 * Handle content editing for projects/experiences
 *
 * Route: PATCH /admin/{section}/{slug}
 * Authentication: Required (admin only)
 */
export async function handleContentEdit(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('Content edit event:', JSON.stringify(event, null, 2));

  const origin = getOriginFromRequest(event);

  // Handle CORS preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return corsResponse(204, {}, origin);
  }

  // Only allow PATCH
  if (event.requestContext.http.method !== 'PATCH') {
    return errorResponse('Method Not Allowed', 405, undefined, origin);
  }

  try {
    // Authenticate request
    const authResult = await requireAuthentication(event);
    if (!authResult.authenticated) {
      return unauthorizedResponse(authResult.error, origin);
    }

    // Check if user is admin
    if (!isAdminUser(authResult.payload!)) {
      return forbiddenResponse('Admin access required', origin);
    }

    // Validate path parameters
    const pathValidation = validatePathParameters(event, ['section', 'slug']);
    if (!pathValidation.success) {
      return handleValidationError(pathValidation, origin);
    }

    const { section, slug } = pathValidation.data;

    // Validate section
    if (!VALID_SECTIONS.includes(section as any)) {
      return errorResponse(
        `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}`,
        400,
        undefined,
        origin
      );
    }

    // Validate request body
    const bodyValidation = validateRequestBody(event, ContentEditPayloadSchema);
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation, origin);
    }

    const updates: ContentEditPayload = bodyValidation.data;

    // Check if project exists
    const descKey = generateDescKey(section, slug);
    if (!(await objectExists(descKey))) {
      return notFoundResponse(`Project '${slug}' not found in section '${section}'`, origin);
    }

    // Get existing project description
    const existingDesc = await parseJsonFromS3<ProjectDescription>(descKey);
    if (!existingDesc) {
      return notFoundResponse(`Project description not found for '${slug}'`, origin);
    }

    // Apply updates to existing description
    const updatedDesc: ProjectDescription = {
      ...existingDesc,
      ...updates,
      // Merge index entry if provided
      indexEntry: updates.indexEntry
        ? { ...existingDesc.indexEntry, ...updates.indexEntry }
        : existingDesc.indexEntry,
    };

    // Validate updated description
    const descValidation = ProjectDescriptionSchema.safeParse(updatedDesc);
    if (!descValidation.success) {
      return handleValidationError(
        {
          success: false,
          errors: descValidation.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        origin
      );
    }

    // Handle slug change if requested
    let newSlug = slug;
    const updatingSlug = updates.indexEntry?.slug;
    if (updatingSlug && updatingSlug !== slug) {
      // Validate new slug
      const newSlugKey = generateDescKey(section, updatingSlug);
      if (await objectExists(newSlugKey)) {
        return errorResponse(
          `Project with slug '${updatingSlug}' already exists`,
          409,
          undefined,
          origin
        );
      }

      // Create new directory
      await createContentDirectory(section, updatingSlug);

      // Move all files to new location
      await moveProjectFiles(section, slug, updatingSlug, updatedDesc);

      // Update slug in description
      updatedDesc.indexEntry.slug = updatingSlug;
      newSlug = updatingSlug;

      // Delete old directory (optional - you might want to keep it for backup)
      // await deleteProjectDirectory(section, slug);
    }

    // Upload updated description
    const finalDescKey = generateDescKey(section, newSlug);
    await uploadToS3(finalDescKey, formatJsonForStorage(updatedDesc), {
      contentType: 'application/json',
      cacheControl: 'no-cache',
    });

    // Update section index
    await updateSectionIndex(section, updatedDesc.indexEntry, slug);

    const userInfo = extractUserInfo(authResult.payload!);

    return successResponse(
      {
        updated: true,
        slug: newSlug,
        message: 'Project updated successfully',
        updatedBy: userInfo.username,
        updatedAt: new Date().toISOString(),
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Error editing content:', error);

    return errorResponse(
      'Internal Server Error',
      500,
      'An error occurred updating the content',
      origin
    );
  }
}

/**
 * Create content directory structure
 */
async function createContentDirectory(section: string, slug: string): Promise<void> {
  const { createContentDirectory } = await import('../services/s3.js');
  await createContentDirectory(section, slug);
}

/**
 * Move project files from old slug to new slug
 */
async function moveProjectFiles(
  section: string,
  oldSlug: string,
  newSlug: string,
  updatedDesc: ProjectDescription
): Promise<void> {
  const { getFromS3, uploadToS3, generateContentKey } = await import('../services/s3.js');

  // Move description file
  const oldDescKey = generateDescKey(section, oldSlug);
  const newDescKey = generateDescKey(section, newSlug);
  const descContent = await getFromS3(oldDescKey);
  if (descContent) {
    await uploadToS3(newDescKey, descContent, {
      contentType: 'application/json',
      cacheControl: 'no-cache',
    });
  }

  // Move media files (you might want to implement this based on your actual file structure)
  for (const media of updatedDesc.media) {
    const oldKey = generateContentKey(section, oldSlug, media.src);
    const newKey = generateContentKey(section, newSlug, media.src);

    // In a real implementation, you would use S3 CopyObject and then DeleteObject
    // For now, we'll assume media files are handled separately
    console.log(`Would move media file: ${oldKey} -> ${newKey}`);
  }
}

/**
 * Update section index with modified entry
 */
async function updateSectionIndex(
  section: string,
  updatedEntry: any,
  originalSlug?: string
): Promise<void> {
  const { generateSectionIndexKey, uploadToS3, formatJsonForStorage, parseJsonFromS3 } =
    await import('../services/s3.js');
  const { SectionIndexSchema } = await import('../schemas/content.js');

  const indexKey = generateSectionIndexKey(section);
  const existingIndex = await parseJsonFromS3<any>(indexKey);

  if (!existingIndex) {
    console.error('Section index not found');
    return;
  }

  // Find and update the entry
  let entryIndex = -1;
  if (originalSlug) {
    entryIndex = existingIndex.entries.findIndex((entry: any) => entry.slug === originalSlug);
  } else {
    entryIndex = existingIndex.entries.findIndex((entry: any) => entry.slug === updatedEntry.slug);
  }

  if (entryIndex !== -1) {
    existingIndex.entries[entryIndex] = updatedEntry;
  } else {
    // Entry not found, add it
    existingIndex.entries.push(updatedEntry);
  }

  // Validate updated index
  const indexValidation = SectionIndexSchema.safeParse(existingIndex);
  if (!indexValidation.success) {
    console.error('Invalid section index after update:', indexValidation.error);
    return;
  }

  // Upload updated index
  await uploadToS3(indexKey, formatJsonForStorage(existingIndex), {
    contentType: 'application/json',
    cacheControl: 'max-age=300',
  });
}
