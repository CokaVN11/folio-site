import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { ContactPayloadSchema, type ContactMessage } from './dto.js';
import { corsResponse, handlePreflight } from './cors.js';
import { saveContactMessage } from './ddb.js';

/**
 * Lambda handler for contact form submissions
 *
 * Validates input, saves to DynamoDB, and returns appropriate responses
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return handlePreflight();
  }

  // Only allow POST
  if (event.requestContext.http.method !== 'POST') {
    return corsResponse(405, {
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    // Parse and validate request body
    if (!event.body) {
      return corsResponse(400, {
        error: 'Bad Request',
        message: 'Request body is required',
      });
    }

    const body = JSON.parse(event.body);
    const validationResult = ContactPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return corsResponse(400, {
        error: 'Validation Error',
        message: 'Invalid request data',
        details: validationResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
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
    return corsResponse(201, {
      message: 'Contact message received successfully',
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Error processing request:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return corsResponse(400, {
        error: 'Bad Request',
        message: 'Invalid JSON in request body',
      });
    }

    // Generic error response
    return corsResponse(500, {
      error: 'Internal Server Error',
      message: 'An error occurred processing your request',
    });
  }
}
