import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { corsResponse, handlePreflight, getOriginFromRequest } from '../shared/cors.js';
import { validateRequestBody, handleValidationError } from '../shared/validation.js';
import { successResponse, errorResponse } from '../shared/responses.js';
import { ContactPayloadSchema, type ContactMessage } from '../schemas/contact.js';
import { saveContactMessage } from '../services/ddb.js';

/**
 * Handle contact form submissions
 *
 * Route: POST /contact
 * Authentication: None (public endpoint)
 * CORS: Limited to site origin
 */
export async function handleContactSubmit(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('Contact submit event:', JSON.stringify(event, null, 2));

  const origin = getOriginFromRequest(event);

  // Handle CORS preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return handlePreflight(origin);
  }

  // Only allow POST
  if (event.requestContext.http.method !== 'POST') {
    return errorResponse('Method Not Allowed', 405, undefined, origin);
  }

  try {
    // Validate request body
    const validationResult = validateRequestBody(event, ContactPayloadSchema);
    if (!validationResult.success) {
      return handleValidationError(validationResult, origin);
    }

    // Create contact message
    const contactMessage: ContactMessage = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      ip: event.requestContext.http.sourceIp,
      ...validationResult.data,
    };

    // Save to DynamoDB
    await saveContactMessage(contactMessage);

    // Return success response
    return successResponse(
      {
        message: 'Contact message received successfully',
        id: contactMessage.id,
        createdAt: contactMessage.timestamp,
      },
      201,
      origin
    );
  } catch (error) {
    console.error('Error processing contact request:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return errorResponse('Bad Request', 400, 'Invalid JSON in request body', origin);
    }

    // Generic error response
    return errorResponse(
      'Internal Server Error',
      500,
      'An error occurred processing your request',
      origin
    );
  }
}
