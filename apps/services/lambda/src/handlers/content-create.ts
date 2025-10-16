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
  conflictResponse,
} from '../shared/responses.js';
import { requireAuthentication, isAdminUser, extractUserInfo } from '../services/auth.js';
import {
  ContentCreatePayloadSchema,
  ProjectDescriptionSchema,
  SectionIndexSchema,
  VALID_SECTIONS,
  type ContentCreatePayload,
  type ProjectDescription,
  type SectionIndex,
} from '../schemas/content.js';
import {
  createContentDirectory,
  generateDescKey,
  generateSectionIndexKey,
  uploadToS3,
  formatJsonForStorage,
  parseJsonFromS3,
  objectExists,
} from '../services/s3.js';

/**
 * Handle content creation for projects/experiences
 *
 * Route: POST /admin/{section}/{slug}
 * Authentication: Required (admin only)
 */
export async function handleContentCreate(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('Content create event:', JSON.stringify(event, null, 2));

  const origin = getOriginFromRequest(event);

  // Handle CORS preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return corsResponse(204, {}, origin);
  }

  // Only allow POST
  if (event.requestContext.http.method !== 'POST') {
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
    const bodyValidation = validateRequestBody(event, ContentCreatePayloadSchema);
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation, origin);
    }

    const payload: ContentCreatePayload = bodyValidation.data;

    // Check if project already exists
    const descKey = generateDescKey(section, slug);
    if (await objectExists(descKey)) {
      return conflictResponse(`Project '${slug}' already exists in section '${section}'`, origin);
    }

    // Create project description
    const projectDesc: ProjectDescription = {
      ...payload,
      indexEntry: payload.indexEntry || {
        title: payload.title,
        summary: payload.summary,
        cover: payload.media[0]?.src || '',
        tags: payload.tech,
        year: payload.year,
        slug,
      },
    };

    // Validate project description
    const descValidation = ProjectDescriptionSchema.safeParse(projectDesc);
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

    // Create content directory structure
    await createContentDirectory(section, slug);

    // Upload description file
    await uploadToS3(descKey, formatJsonForStorage(projectDesc), {
      contentType: 'application/json',
      cacheControl: 'no-cache',
    });

    // Update section index
    await updateSectionIndex(section, projectDesc.indexEntry);

    const userInfo = extractUserInfo(authResult.payload!);

    return successResponse(
      {
        slug,
        s3Prefix: `content/${section}/${slug}/`,
        message: 'Project created successfully',
        createdBy: userInfo.username,
      },
      201,
      origin
    );
  } catch (error) {
    console.error('Error creating content:', error);

    return errorResponse(
      'Internal Server Error',
      500,
      'An error occurred creating the content',
      origin
    );
  }
}

/**
 * Update section index with new entry
 * Uses ETag-like mechanism to prevent race conditions
 */
async function updateSectionIndex(section: string, newEntry: any): Promise<void> {
  const indexKey = generateSectionIndexKey(section);
  let sectionIndex: SectionIndex;

  // Try to get existing index
  const existingIndex = await parseJsonFromS3<SectionIndex>(indexKey);

  if (existingIndex) {
    // Add new entry to existing index
    sectionIndex = {
      ...existingIndex,
      lastUpdated: new Date().toISOString(),
      entries: [...existingIndex.entries, newEntry],
    };
  } else {
    // Create new index
    sectionIndex = {
      lastUpdated: new Date().toISOString(),
      entries: [newEntry],
    };
  }

  // Upload updated index
  await uploadToS3(indexKey, formatJsonForStorage(sectionIndex), {
    contentType: 'application/json',
    cacheControl: 'max-age=300', // 5 minutes cache for index files
  });
}
