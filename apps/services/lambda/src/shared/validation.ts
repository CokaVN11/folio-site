import { z } from 'zod';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { validationErrorResponse } from './responses.js';

/**
 * Common validation utilities
 */

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Validate request body against a Zod schema
 */
export function validateRequestBody<T>(
  event: APIGatewayProxyEventV2,
  schema: z.ZodSchema<T>
): ValidationResult<T> | ValidationError {
  if (!event.body) {
    return {
      success: false,
      errors: [{ field: 'body', message: 'Request body is required' }],
    };
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    return {
      success: false,
      errors: [{ field: 'body', message: 'Invalid JSON in request body' }],
    };
  }

  const result = schema.safeParse(parsedBody);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Validate path parameters
 */
export function validatePathParameters(
  event: APIGatewayProxyEventV2,
  requiredParams: string[]
): ValidationResult<Record<string, string>> | ValidationError {
  const params = event.pathParameters || {};
  const errors: Array<{ field: string; message: string }> = [];

  for (const param of requiredParams) {
    if (!params[param]) {
      errors.push({
        field: param,
        message: `Path parameter '${param}' is required`,
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: params as Record<string, string>,
  };
}

/**
 * Validate query parameters
 */
export function validateQueryParameters<T>(
  event: APIGatewayProxyEventV2,
  schema: z.ZodSchema<T>
): ValidationResult<T> | ValidationError {
  const queryParameters = event.queryStringParameters || {};
  const result = schema.safeParse(queryParameters);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((err) => ({
        field: `query.${err.path.join('.')}`,
        message: err.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Helper to handle validation errors in Lambda handlers
 */
export function handleValidationError(error: ValidationError, origin?: string) {
  return validationErrorResponse('Invalid request data', error.errors, origin);
}
