import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { corsResponse, getOriginFromRequest } from '../shared/cors.js';
import {
  validatePathParameters,
  handleValidationError,
} from '../shared/validation.js';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '../shared/responses.js';
import { requireAuthentication, isAdminUser } from '../services/auth.js';
import { VALID_SECTIONS } from '../schemas/content.js';
import {
  generateSectionIndexKey,
  parseJsonFromS3,
  formatJsonForStorage,
  uploadToS3,
} from '../services/s3.js';

/**
 * Handle content listing for sections
 *
 * Routes:
 * - GET /admin/{section} - List content in section (admin only)
 * - GET /public/{section} - Public content listing
 */
export async function handleContentList(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('Content list event:', JSON.stringify(event, null, 2));

  const origin = getOriginFromRequest(event);
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  // Only allow GET
  if (method !== 'GET') {
    return errorResponse('Method Not Allowed', 405, undefined, origin);
  }

  // Check if this is an admin endpoint
  const isAdminEndpoint = path.startsWith('/admin/');

  // Admin endpoints require authentication
  if (isAdminEndpoint) {
    const authResult = await requireAuthentication(event);
    if (!authResult.authenticated) {
      return unauthorizedResponse(authResult.error, origin);
    }

    // Check if user is admin
    if (!isAdminUser(authResult.payload!)) {
      return forbiddenResponse('Admin access required', origin);
    }
  }

  try {
    // Validate path parameters
    const pathValidation = validatePathParameters(event, ['section']);
    if (!pathValidation.success) {
      return handleValidationError(pathValidation, origin);
    }

    const { section } = pathValidation.data;

    // Validate section
    if (!VALID_SECTIONS.includes(section as any)) {
      return errorResponse(
        `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}`,
        400,
        undefined,
        origin
      );
    }

    // Get section index
    const indexKey = generateSectionIndexKey(section);
    const sectionIndex = await parseJsonFromS3<any>(indexKey);

    if (!sectionIndex || !sectionIndex.entries) {
      return successResponse(
        {
          section,
          entries: [],
          total: 0,
          lastUpdated: null,
        },
        200,
        origin
      );
    }

    // For public endpoints, filter out sensitive information
    let entries = sectionIndex.entries;
    if (!isAdminEndpoint) {
      entries = entries.map((entry: any) => ({
        title: entry.title,
        summary: entry.summary,
        cover: entry.cover,
        tags: entry.tags,
        year: entry.year,
        slug: entry.slug,
      }));
    }

    // Sort entries by year (newest first) and then by title
    entries.sort((a: any, b: any) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      return a.title.localeCompare(b.title);
    });

    return successResponse(
      {
        section,
        entries,
        total: entries.length,
        lastUpdated: sectionIndex.lastUpdated,
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Error listing content:', error);

    return errorResponse(
      'Internal Server Error',
      500,
      'An error occurred listing the content',
      origin
    );
  }
}