import { z } from 'zod';

/**
 * Allowed content sections
 */
export const VALID_SECTIONS = ['exp', 'job'] as const;
export type ValidSection = (typeof VALID_SECTIONS)[number];

/**
 * Safe slug validation (URL-friendly, no special characters)
 */
export const SlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(50, 'Slug is too long')
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  );

/**
 * Media item validation
 */
export const MediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string().min(1, 'Media source is required').max(255),
  alt: z.string().max(255).optional(),
  caption: z.string().max(500).optional(),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;

/**
 * Index entry validation (for section index.json)
 */
export const IndexEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().min(1, 'Summary is required').max(1000),
  cover: z.string().min(1, 'Cover image is required').max(255),
  tags: z.array(z.string().max(50)).max(10),
  year: z.number().int().min(1990).max(2030),
  slug: SlugSchema,
});

export type IndexEntry = z.infer<typeof IndexEntrySchema>;

/**
 * Project/Experience description validation (for desc.json)
 */
export const ProjectDescriptionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().min(1, 'Summary is required').max(1000),
  description: z.string().max(5000).optional(),
  tech: z.array(z.string().max(50)).max(20),
  year: z.number().int().min(1990).max(2030),
  client: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  duration: z.string().max(100).optional(),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  media: z.array(MediaItemSchema).max(50),
  indexEntry: IndexEntrySchema,
});

export type ProjectDescription = z.infer<typeof ProjectDescriptionSchema>;

/**
 * Section index validation (for section index.json)
 */
export const SectionIndexSchema = z.object({
  lastUpdated: z.string().datetime(),
  entries: z.array(IndexEntrySchema),
});

export type SectionIndex = z.infer<typeof SectionIndexSchema>;

/**
 * Content creation payload schema
 */
export const ContentCreatePayloadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().min(1, 'Summary is required').max(1000),
  description: z.string().max(5000).optional(),
  tech: z.array(z.string().max(50)).max(20),
  year: z.number().int().min(1990).max(2030),
  client: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  duration: z.string().max(100).optional(),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  media: z.array(MediaItemSchema).max(50),
  indexEntry: IndexEntrySchema.optional(),
});

export type ContentCreatePayload = z.infer<typeof ContentCreatePayloadSchema>;

/**
 * Content edit payload schema (partial updates allowed)
 */
export const ContentEditPayloadSchema = ContentCreatePayloadSchema.partial();

export type ContentEditPayload = z.infer<typeof ContentEditPayloadSchema>;

/**
 * Content creation response schema
 */
export const ContentCreateResponseSchema = z.object({
  slug: z.string(),
  s3Prefix: z.string(),
  message: z.string(),
});

export type ContentCreateResponse = z.infer<typeof ContentCreateResponseSchema>;

/**
 * Content edit response schema
 */
export const ContentEditResponseSchema = z.object({
  updated: z.boolean(),
  message: z.string(),
});

export type ContentEditResponse = z.infer<typeof ContentEditResponseSchema>;
