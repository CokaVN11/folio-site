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
  ExperienceEditPayloadSchema,
  ProjectEditPayloadSchema,
  EducationEditPayloadSchema,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  VALID_SECTIONS,
  type ExperienceEditPayload,
  type ProjectEditPayload,
  type EducationEditPayload,
  type Experience,
  type Project,
  type Education,
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

    // Parse request body first to determine content type
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (error) {
      return errorResponse('Invalid JSON in request body', 400, undefined, origin);
    }

    // Validate based on section type
    let updates: ExperienceEditPayload | ProjectEditPayload | EducationEditPayload;

    switch (section) {
      case 'experience':
        const expValidation = ExperienceEditPayloadSchema.safeParse(requestBody);
        if (!expValidation.success) {
          return handleValidationError({
            success: false,
            errors: expValidation.error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          }, origin);
        }
        updates = expValidation.data;
        break;

      case 'projects':
        const projValidation = ProjectEditPayloadSchema.safeParse(requestBody);
        if (!projValidation.success) {
          return handleValidationError({
            success: false,
            errors: projValidation.error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          }, origin);
        }
        updates = projValidation.data;
        break;

      case 'education':
        const eduValidation = EducationEditPayloadSchema.safeParse(requestBody);
        if (!eduValidation.success) {
          return handleValidationError({
            success: false,
            errors: eduValidation.error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          }, origin);
        }
        updates = eduValidation.data;
        break;

      default:
        return errorResponse(
          `Invalid section: ${section}. Must be one of: ${VALID_SECTIONS.join(', ')}`,
          400,
          undefined,
          origin
        );
    }

    // Check if content exists
    const descKey = generateDescKey(section, slug);
    if (!(await objectExists(descKey))) {
      return notFoundResponse(`${section} '${slug}' not found`, origin);
    }

    // Get existing content
    const existingContent = await parseJsonFromS3<any>(descKey);
    if (!existingContent) {
      return notFoundResponse(`Content not found for '${slug}'`, origin);
    }

    // Extract existing data based on section type
    let existingData: Experience | Project | Education;
    switch (section) {
      case 'experience':
        existingData = existingData as Experience;
        break;
      case 'projects':
        existingData = existingData as Project;
        break;
      case 'education':
        existingData = existingData as Education;
        break;
    }

    // Apply updates to existing content
    let updatedData: Experience | Project | Education;
    let updatedIndexEntry;

    switch (section) {
      case 'experience':
        updatedData = { ...existingData as Experience, ...updates } as Experience;
        updatedIndexEntry = {
          title: updatedData.title,
          summary: updatedData.summary,
          cover: updatedData.media[0]?.src || '',
          tags: updatedData.tech,
          year: parseInt(updatedData.start_date.split('-')[0]),
          slug: slug,
        };
        break;

      case 'projects':
        updatedData = { ...existingData as Project, ...updates } as Project;
        updatedIndexEntry = {
          title: updatedData.title,
          summary: updatedData.summary,
          cover: updatedData.media[0]?.src || '',
          tags: updatedData.tech,
          year: parseInt(updatedData.start_date.split('-')[0]),
          slug: slug,
        };
        break;

      case 'education':
        updatedData = { ...existingData as Education, ...updates } as Education;
        updatedIndexEntry = {
          title: `${updatedData.degree} - ${updatedData.institution}`,
          summary: updatedData.description || updatedData.achievements.join(', '),
          cover: updatedData.media[0]?.src || '',
          tags: updatedData.coursework || [],
          year: parseInt(updatedData.start_date.split('-')[0]),
          slug: slug,
        };
        break;
    }

    // Validate updated content
    let validationSuccess = true;
    let validationErrors: any[] = [];

    switch (section) {
      case 'experience':
        const expValidation = ExperienceSchema.safeParse(updatedData);
        if (!expValidation.success) {
          validationSuccess = false;
          validationErrors = expValidation.error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
        }
        break;

      case 'projects':
        const projValidation = ProjectSchema.safeParse(updatedData);
        if (!projValidation.success) {
          validationSuccess = false;
          validationErrors = projValidation.error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
        }
        break;

      case 'education':
        const eduValidation = EducationSchema.safeParse(updatedData);
        if (!eduValidation.success) {
          validationSuccess = false;
          validationErrors = eduValidation.error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
        }
        break;
    }

    if (!validationSuccess) {
      return handleValidationError({
        success: false,
        errors: validationErrors,
      }, origin);
    }

    // Handle slug change if requested
    let newSlug = slug;
    if (updates.slug && updates.slug !== slug) {
      // Validate new slug
      const newSlugKey = generateDescKey(section, updates.slug);
      if (await objectExists(newSlugKey)) {
        return errorResponse(
          `${section} with slug '${updates.slug}' already exists`,
          409,
          undefined,
          origin
        );
      }

      // Create new directory
      await createContentDirectory(section, updates.slug);

      // Move all files to new location
      await moveContentFiles(section, slug, updates.slug, updatedData);

      // Update slug in index entry
      updatedIndexEntry.slug = updates.slug;
      newSlug = updates.slug;
    }

    // Create content with metadata
    const contentWithMetadata = {
      ...updatedData,
      indexEntry: updatedIndexEntry,
      updatedAt: new Date().toISOString(),
    };

    // Upload updated content
    const finalDescKey = generateDescKey(section, newSlug);
    await uploadToS3(finalDescKey, formatJsonForStorage(contentWithMetadata), {
      contentType: 'application/json',
      cacheControl: 'no-cache',
    });

    // Update section index
    await updateSectionIndex(section, updatedIndexEntry, slug, newSlug);

    const userInfo = extractUserInfo(authResult.payload!);

    return successResponse(
      {
        updated: true,
        slug: newSlug,
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`,
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
 * Move content files from old slug to new slug
 */
async function moveContentFiles(
  section: string,
  oldSlug: string,
  newSlug: string,
  updatedData: Experience | Project | Education
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
  for (const media of updatedData.media) {
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
  originalSlug?: string,
  newSlug?: string
): Promise<void> {
  const { generateSectionIndexKey, uploadToS3, formatJsonForStorage, parseJsonFromS3 } =
    await import('../services/s3.js');

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

  // Update last modified timestamp
  existingIndex.lastUpdated = new Date().toISOString();

  // Upload updated index
  await uploadToS3(indexKey, formatJsonForStorage(existingIndex), {
    contentType: 'application/json',
    cacheControl: 'max-age=300',
  });
}
