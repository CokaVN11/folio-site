import { z } from 'zod';

/**
 * Allowed file extensions for uploads
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi'];
export const ALLOWED_EXTENSIONS = [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS];

/**
 * Allowed MIME types
 */
export const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
];

/**
 * File size limits (in bytes)
 */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_SIZE = Math.max(MAX_IMAGE_SIZE, MAX_VIDEO_SIZE);

/**
 * Upload request payload schema
 */
export const UploadRequestPayloadSchema = z.object({
  section: z.enum(['exp', 'job']),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug is too long')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Filename contains invalid characters'),
  contentType: z
    .string()
    .refine(
      (type) => ALLOWED_MIME_TYPES.includes(type),
      `Content type must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`
    ),
  fileSize: z
    .number()
    .positive('File size must be positive')
    .max(MAX_FILE_SIZE, `File size exceeds maximum limit of ${MAX_FILE_SIZE} bytes`),
});

export type UploadRequestPayload = z.infer<typeof UploadRequestPayloadSchema>;

/**
 * Upload response schema
 */
export const UploadResponseSchema = z.object({
  url: z.string().url(),
  key: z.string(),
  expiresAt: z.string().datetime(),
  message: z.string(),
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;

/**
 * Helper function to validate file extension
 */
export function isValidFileExtension(filename: string): boolean {
  const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return ALLOWED_EXTENSIONS.includes(extension);
}

/**
 * Helper function to get file type from MIME type
 */
export function getFileType(contentType: string): 'image' | 'video' | 'unknown' {
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  return 'unknown';
}

/**
 * Helper function to get size limit for file type
 */
export function getSizeLimitForType(contentType: string): number {
  const fileType = getFileType(contentType);
  return fileType === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
}
