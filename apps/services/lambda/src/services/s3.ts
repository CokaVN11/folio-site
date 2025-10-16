import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type {
  PutObjectCommandInput,
  GetObjectCommandInput,
  HeadObjectCommandInput,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({});
const CONTENT_BUCKET = process.env.CONTENT_BUCKET || process.env.SITE_BUCKET;

if (!CONTENT_BUCKET) {
  throw new Error('CONTENT_BUCKET or SITE_BUCKET environment variable is required');
}

/**
 * S3 utility functions for content management
 */

export interface S3PutOptions {
  contentType: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

/**
 * Upload content to S3
 */
export async function uploadToS3(
  key: string,
  body: string | Uint8Array,
  options: S3PutOptions
): Promise<void> {
  const params: PutObjectCommandInput = {
    Bucket: CONTENT_BUCKET,
    Key: key,
    Body: body,
    ContentType: options.contentType,
    Metadata: options.metadata,
    CacheControl: options.cacheControl,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

/**
 * Get object from S3
 */
export async function getFromS3(key: string): Promise<string | undefined> {
  const params: GetObjectCommandInput = {
    Bucket: CONTENT_BUCKET,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    if (response.Body) {
      return await response.Body.transformToString();
    }
  } catch (error) {
    // Return undefined if object doesn't exist
    return undefined;
  }
}

/**
 * Check if object exists in S3
 */
export async function objectExists(key: string): Promise<boolean> {
  const params: HeadObjectCommandInput = {
    Bucket: CONTENT_BUCKET,
    Key: key,
  };

  try {
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate pre-signed PUT URL for uploads
 */
export async function generatePresignedPutUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: CONTENT_BUCKET,
    Key: key,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate S3 key for content files
 */
export function generateContentKey(section: string, slug: string, filename: string): string {
  return `content/${section}/${slug}/${filename}`;
}

/**
 * Generate S3 key for project description file
 */
export function generateDescKey(section: string, slug: string): string {
  return `content/${section}/${slug}/desc.json`;
}

/**
 * Generate S3 key for section index file
 */
export function generateSectionIndexKey(section: string): string {
  return `content/${section}/index.json`;
}

/**
 * Create content directory structure (by creating empty marker objects)
 */
export async function createContentDirectory(section: string, slug: string): Promise<void> {
  // Create directory marker objects (empty objects with trailing slashes)
  const sectionDirKey = `content/${section}/`;
  const projectDirKey = `content/${section}/${slug}/`;

  try {
    // Create section directory marker if it doesn't exist
    if (!(await objectExists(sectionDirKey))) {
      await uploadToS3(sectionDirKey, '', {
        contentType: 'application/x-directory',
      });
    }

    // Create project directory marker
    await uploadToS3(projectDirKey, '', {
      contentType: 'application/x-directory',
    });
  } catch (error) {
    console.error('Error creating content directory:', error);
    throw error;
  }
}

/**
 * Helper function to ensure JSON content is properly formatted
 */
export function formatJsonForStorage(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

/**
 * Helper function to parse JSON from S3 with error handling
 */
export async function parseJsonFromS3<T>(key: string): Promise<T | undefined> {
  try {
    const content = await getFromS3(key);
    if (!content) return undefined;

    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error parsing JSON from S3 key ${key}:`, error);
    return undefined;
  }
}
