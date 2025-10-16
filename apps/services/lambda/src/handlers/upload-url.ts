import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { corsResponse, getOriginFromRequest } from '../shared/cors.js';
import { validateRequestBody, handleValidationError } from '../shared/validation.js';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '../shared/responses.js';
import { requireAuthentication, isAdminUser, extractUserInfo } from '../services/auth.js';
import {
  UploadRequestPayloadSchema,
  isValidFileExtension,
  getFileType,
  getSizeLimitForType,
  type UploadRequestPayload,
} from '../schemas/upload.js';
import { generatePresignedPutUrl, generateContentKey } from '../services/s3.js';

/**
 * Handle pre-signed URL generation for file uploads
 *
 * Route: POST /admin/uploads
 * Authentication: Required (admin only)
 */
export async function handleUploadUrl(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('Upload URL event:', JSON.stringify(event, null, 2));

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

    // Validate request body
    const bodyValidation = validateRequestBody(event, UploadRequestPayloadSchema);
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation, origin);
    }

    const { section, slug, filename, contentType, fileSize } = bodyValidation.data;

    // Additional validation checks
    const validationErrors = validateUploadRequest({
      filename,
      contentType,
      fileSize,
    });

    if (validationErrors.length > 0) {
      return handleValidationError(
        {
          success: false,
          errors: validationErrors,
        },
        origin
      );
    }

    // Generate S3 key
    const key = generateContentKey(section, slug, filename);

    // Generate pre-signed PUT URL (valid for 1 hour)
    const uploadUrl = await generatePresignedPutUrl(key, contentType, 3600);

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const userInfo = extractUserInfo(authResult.payload!);

    return successResponse(
      {
        url: uploadUrl,
        key,
        expiresAt: expiresAt.toISOString(),
        message: 'Pre-signed URL generated successfully',
        requestedBy: userInfo.username,
        fileInfo: {
          filename,
          contentType,
          fileSize,
          section,
          slug,
          type: getFileType(contentType),
        },
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Error generating upload URL:', error);

    return errorResponse(
      'Internal Server Error',
      500,
      'An error occurred generating the upload URL',
      origin
    );
  }
}

/**
 * Additional validation for upload requests
 */
interface ValidationRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

function validateUploadRequest(
  request: ValidationRequest
): Array<{ field: string; message: string }> {
  const errors: Array<{ field: string; message: string }> = [];

  const { filename, contentType, fileSize } = request;

  // Validate file extension
  if (!isValidFileExtension(filename)) {
    errors.push({
      field: 'filename',
      message:
        'Invalid file extension. Allowed: .jpg, .jpeg, .png, .gif, .webp, .avif, .mp4, .webm, .mov, .avi',
    });
  }

  // Validate MIME type
  const fileType = getFileType(contentType);
  if (fileType === 'unknown') {
    errors.push({
      field: 'contentType',
      message: 'Invalid content type. Must be a valid image or video format.',
    });
  }

  // Validate file size based on type
  const sizeLimit = getSizeLimitForType(contentType);
  if (fileSize > sizeLimit) {
    const sizeMB = Math.round(sizeLimit / (1024 * 1024));
    errors.push({
      field: 'fileSize',
      message: `File size exceeds ${fileType} limit of ${sizeMB}MB`,
    });
  }

  // Validate filename doesn't contain path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    errors.push({
      field: 'filename',
      message: 'Filename cannot contain path traversal characters',
    });
  }

  // Validate filename length
  if (filename.length > 255) {
    errors.push({
      field: 'filename',
      message: 'Filename is too long (max 255 characters)',
    });
  }

  return errors;
}
