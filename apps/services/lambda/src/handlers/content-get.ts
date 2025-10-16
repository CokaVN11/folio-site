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
  notFoundResponse,
} from '../shared/responses.js';
import { requireAuthentication, isAdminUser } from '../services/auth.js';
import { VALID_SECTIONS } from '../schemas/content.js';
import {
  generateDescKey,
  parseJsonFromS3,
} from '../services/s3.js';

/**
 * Handle content retrieval for specific items
 *
 * Routes:
 * - GET /admin/{section}/{slug} - Get specific content (admin only)
 * - GET /public/{section}/{slug} - Public content view
 */
export async function handleContentGet(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('Content get event:', JSON.stringify(event, null, 2));

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

    // Get content
    const descKey = generateDescKey(section, slug);
    const content = await parseJsonFromS3<any>(descKey);

    if (!content) {
      return notFoundResponse(
        `${section.charAt(0).toUpperCase() + section.slice(1)} '${slug}' not found`,
        origin
      );
    }

    // For public endpoints, filter out sensitive information
    if (!isAdminEndpoint) {
      // Create a public-friendly version of the content
      const publicContent = {
        title: content.title,
        summary: content.summary,
        description: content.description,
        tech: content.tech,
        start_date: content.start_date,
        end_date: content.end_date,
        media: content.media,
        urls: content.urls,
        // Include section-specific fields
        ...(section === 'experience' && {
          company: content.company,
          role: content.role,
          location: content.location,
        }),
        ...(section === 'projects' && {
          role: content.role,
          features: content.features || [],
          deployment: content.deployment,
        }),
        ...(section === 'education' && {
          institution: content.institution,
          degree: content.degree,
          location: content.location,
        }),
        // Include metadata
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      };

      return successResponse(
        {
          section,
          slug,
          content: publicContent,
        },
        200,
        origin
      );
    }

    // Admin gets full content
    return successResponse(
      {
        section,
        slug,
        content,
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Error getting content:', error);

    return errorResponse(
      'Internal Server Error',
      500,
      'An error occurred retrieving the content',
      origin
    );
  }
}