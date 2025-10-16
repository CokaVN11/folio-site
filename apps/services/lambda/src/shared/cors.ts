import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

/**
 * Get CORS headers based on environment
 * In production, this should be configured to allow only specific origins
 */
export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigin = origin || process.env.ALLOWED_ORIGIN || '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Max-Age': '300',
  };
}

/**
 * Create a CORS-enabled response
 */
export function corsResponse(
  statusCode: number,
  body: Record<string, unknown>,
  origin?: string
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      ...getCorsHeaders(origin),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

/**
 * Handle CORS preflight requests
 */
export function handlePreflight(origin?: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 204,
    headers: getCorsHeaders(origin),
    body: '',
  };
}

/**
 * Extract origin from request
 */
export function getOriginFromRequest(event: APIGatewayProxyEventV2): string | undefined {
  return event.headers?.origin || event.headers?.['origin'];
}
