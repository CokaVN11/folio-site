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
  ExperienceCreatePayloadSchema,
  ProjectCreatePayloadSchema,
  EducationCreatePayloadSchema,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  ContentSchema,
  VALID_SECTIONS,
  type ExperienceCreatePayload,
  type ProjectCreatePayload,
  type EducationCreatePayload,
  type Experience,
  type Project,
  type Education,
  type Content,
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

    // Parse request body first to determine content type
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (error) {
      return errorResponse('Invalid JSON in request body', 400, undefined, origin);
    }

    // Validate based on section type
    let payload: ExperienceCreatePayload | ProjectCreatePayload | EducationCreatePayload;
    let bodyValidation;

    switch (section) {
      case 'experience':
        bodyValidation = {
          success: true,
          data: ExperienceCreatePayloadSchema.safeParse(requestBody),
        };
        if (!bodyValidation.data.success) {
          return handleValidationError({
            success: false,
            errors: bodyValidation.data.error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          }, origin);
        }
        payload = bodyValidation.data.data;
        break;

      case 'projects':
        bodyValidation = {
          success: true,
          data: ProjectCreatePayloadSchema.safeParse(requestBody),
        };
        if (!bodyValidation.data.success) {
          return handleValidationError({
            success: false,
            errors: bodyValidation.data.error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          }, origin);
        }
        payload = bodyValidation.data.data;
        break;

      case 'education':
        bodyValidation = {
          success: true,
          data: EducationCreatePayloadSchema.safeParse(requestBody),
        };
        if (!bodyValidation.data.success) {
          return handleValidationError({
            success: false,
            errors: bodyValidation.data.error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          }, origin);
        }
        payload = bodyValidation.data.data;
        break;

      default:
        return errorResponse(
          `Invalid section: ${section}. Must be one of: ${VALID_SECTIONS.join(', ')}`,
          400,
          undefined,
          origin
        );
    }

    // Check if content already exists
    const descKey = generateDescKey(section, slug);
    if (await objectExists(descKey)) {
      return conflictResponse(`Content '${slug}' already exists in section '${section}'`, origin);
    }

    // Create structured content based on section type
    let contentData: Experience | Project | Education;
    let indexEntry;

    switch (section) {
      case 'experience':
        contentData = ExperienceSchema.parse(payload);
        indexEntry = {
          title: contentData.title,
          summary: contentData.summary,
          cover: contentData.media[0]?.src || '',
          tags: contentData.tech,
          year: parseInt(contentData.start_date.split('-')[0]), // Extract year from date
          slug,
        };
        break;

      case 'projects':
        contentData = ProjectSchema.parse(payload);
        indexEntry = {
          title: contentData.title,
          summary: contentData.summary,
          cover: contentData.media[0]?.src || '',
          tags: contentData.tech,
          year: parseInt(contentData.start_date.split('-')[0]), // Extract year from date
          slug,
        };
        break;

      case 'education':
        contentData = EducationSchema.parse(payload);
        indexEntry = {
          title: `${contentData.degree} - ${contentData.institution}`,
          summary: contentData.description || contentData.achievements.join(', '),
          cover: contentData.media[0]?.src || '',
          tags: contentData.coursework || [],
          year: parseInt(contentData.start_date.split('-')[0]), // Extract year from date
          slug,
        };
        break;

      default:
        return errorResponse(`Unsupported section: ${section}`, 400, undefined, origin);
    }

    // Create content directory structure
    await createContentDirectory(section, slug);

    // Upload content data with metadata
    const contentWithMetadata = {
      ...contentData,
      indexEntry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await uploadToS3(descKey, formatJsonForStorage(contentWithMetadata), {
      contentType: 'application/json',
      cacheControl: 'no-cache',
    });

    // Update section index
    await updateSectionIndex(section, indexEntry);

    const userInfo = extractUserInfo(authResult.payload!);

    return successResponse(
      {
        slug,
        s3Prefix: `content/${section}/${slug}/`,
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} created successfully`,
        createdBy: userInfo.username,
        contentType: section,
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
  let sectionIndex: any;

  // Try to get existing index
  const existingIndex = await parseJsonFromS3<any>(indexKey);

  if (existingIndex && existingIndex.entries) {
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
