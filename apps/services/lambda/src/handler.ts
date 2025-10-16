import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { corsResponse, getOriginFromRequest } from './shared/cors.js';
import { errorResponse } from './shared/responses.js';
import { handleContactSubmit } from './handlers/contact-submit.js';
import { handleContentCreate } from './handlers/content-create.js';
import { handleContentEdit } from './handlers/content-edit.js';
import { handleUploadUrl } from './handlers/upload-url.js';

/**
 * Main Lambda handler that routes requests to appropriate handlers
 *
 * Supported routes:
 * - POST /contact - Contact form submission (public)
 * - POST /admin/{section}/{slug} - Create content (admin only)
 * - PATCH /admin/{section}/{slug} - Edit content (admin only)
 * - POST /admin/uploads - Get upload URL (admin only)
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log(
    'Received event:',
    JSON.stringify(
      {
        method: event.requestContext.http.method,
        path: event.requestContext.http.path,
        routeKey: event.routeKey,
        userAgent: event.requestContext.http.userAgent,
        sourceIp: event.requestContext.http.sourceIp,
      },
      null,
      2
    )
  );

  const origin = getOriginFromRequest(event);
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  try {
    // Route to appropriate handler based on path and method
    if (method === 'POST' && path === '/contact') {
      return await handleContactSubmit(event);
    }

    if (method === 'POST' && path.startsWith('/admin/')) {
      // Extract section and slug from path like /admin/exp/2024-project
      const pathParts = path.split('/').filter(Boolean); // Remove empty strings
      if (pathParts.length === 3 && pathParts[0] === 'admin') {
        const [, section, slug] = pathParts;

        // Add path parameters to event for handlers to use
        event.pathParameters = { section, slug };
        return await handleContentCreate(event);
      }
    }

    if (method === 'PATCH' && path.startsWith('/admin/')) {
      // Extract section and slug from path like /admin/exp/2024-project
      const pathParts = path.split('/').filter(Boolean);
      if (pathParts.length === 3 && pathParts[0] === 'admin') {
        const [, section, slug] = pathParts;

        event.pathParameters = { section, slug };
        return await handleContentEdit(event);
      }
    }

    if (method === 'POST' && path === '/admin/uploads') {
      return await handleUploadUrl(event);
    }

    // Handle OPTIONS preflight for all paths
    if (method === 'OPTIONS') {
      return corsResponse(204, {}, origin);
    }

    // Route not found
    return errorResponse('Route not found', 404, `No handler for ${method} ${path}`, origin);
  } catch (error) {
    console.error('Unhandled error in main handler:', error);

    return errorResponse('Internal Server Error', 500, 'An unexpected error occurred', origin);
  }
}
