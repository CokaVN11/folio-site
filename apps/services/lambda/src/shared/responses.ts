import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { corsResponse } from './cors.js';

/**
 * Standard response creators for consistent API responses
 */

export function successResponse<T>(
  data: T,
  statusCode: number = 200,
  origin?: string
): APIGatewayProxyResultV2 {
  return corsResponse(
    statusCode,
    {
      success: true,
      data,
    },
    origin
  );
}

export function errorResponse(
  message: string,
  statusCode: number = 500,
  details?: unknown,
  origin?: string
): APIGatewayProxyResultV2 {
  const response: any = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  return corsResponse(statusCode, response, origin);
}

export function validationErrorResponse(
  message: string,
  details: unknown,
  origin?: string
): APIGatewayProxyResultV2 {
  return errorResponse('Validation Error', 400, details, origin);
}

export function notFoundResponse(
  message: string = 'Resource not found',
  origin?: string
): APIGatewayProxyResultV2 {
  return errorResponse(message, 404, undefined, origin);
}

export function unauthorizedResponse(
  message: string = 'Unauthorized',
  origin?: string
): APIGatewayProxyResultV2 {
  return errorResponse(message, 401, undefined, origin);
}

export function forbiddenResponse(
  message: string = 'Forbidden',
  origin?: string
): APIGatewayProxyResultV2 {
  return errorResponse(message, 403, undefined, origin);
}

export function methodNotAllowedResponse(
  message: string = 'Method Not Allowed',
  origin?: string
): APIGatewayProxyResultV2 {
  return errorResponse(message, 405, undefined, origin);
}

export function conflictResponse(message: string, origin?: string): APIGatewayProxyResultV2 {
  return errorResponse(message, 409, undefined, origin);
}
