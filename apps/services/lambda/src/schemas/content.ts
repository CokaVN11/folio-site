import { z } from 'zod';

/**
 * Allowed content sections
 */
export const VALID_SECTIONS = ['experience', 'projects', 'education'] as const;
export type ValidSection = (typeof VALID_SECTIONS)[number];

/**
 * Employment types for experience entries
 */
export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'internship', 'freelance', 'contract'] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

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
 * URL validation for different link types
 */
export const UrlSchema = z.string().url('Invalid URL format').max(500);

/**
 * URLs object for different link types
 */
export const UrlsSchema = z.object({
  github: UrlSchema.optional(),
  live: UrlSchema.optional(),
  demo: UrlSchema.optional(),
  linkedin: UrlSchema.optional(),
  other: UrlSchema.optional(),
});

export type Urls = z.infer<typeof UrlsSchema>;

/**
 * Deployment information schema
 */
export const DeploymentSchema = z.object({
  platform: z.string().max(200),
  storage: z.string().max(200).optional(),
  ci_cd: z.string().max(200).optional(),
  testing: z.string().max(200).optional(),
  performance: z.string().max(500).optional(),
});

export type Deployment = z.infer<typeof DeploymentSchema>;

/**
 * Date validation schema (ISO date string or "present")
 */
export const DateSchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  z.literal('present'),
]);

/**
 * Base content schema (shared fields)
 */
const BaseContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().min(1, 'Summary is required').max(1000),
  description: z.string().max(5000).optional(),
  tech: z.array(z.string().max(50)).max(20),
  start_date: DateSchema,
  end_date: DateSchema,
  media: z.array(MediaItemSchema).max(50),
  urls: UrlsSchema.optional(),
});

/**
 * Experience schema for work history
 */
export const ExperienceSchema = BaseContentSchema.extend({
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  employment_type: z.enum(EMPLOYMENT_TYPES),
  location: z.string().min(1, 'Location is required').max(200),
  team: z.string().max(200).optional(),
  responsibilities: z.array(z.string().max(500)).max(20),
  achievements: z.array(z.string().max(500)).max(20),
}).omit({ urls: true }); // Experience doesn't typically need project URLs

/**
 * Project schema for portfolio projects
 */
export const ProjectSchema = BaseContentSchema.extend({
  role: z.string().max(200).optional(),
  features: z.array(z.string().max(500)).max(20),
  deployment: DeploymentSchema.optional(),
  achievements: z.array(z.string().max(500)).max(20),
  client: z.string().max(200).optional(), // For client projects
});

/**
 * Education schema for academic background
 */
export const EducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(200),
  field: z.string().max(200).optional(),
  location: z.string().min(1, 'Location is required').max(200),
  start_date: DateSchema,
  end_date: DateSchema,
  gpa: z.string().max(20).optional(),
  achievements: z.array(z.string().max(500)).max(10),
  coursework: z.array(z.string().max(100)).max(20),
  description: z.string().max(2000).optional(),
  media: z.array(MediaItemSchema).max(20),
});

/**
 * Discriminated union for all content types
 */
export const ContentSchema = z.discriminatedUnion('section', [
  z.object({
    section: z.literal('experience'),
    data: ExperienceSchema,
  }),
  z.object({
    section: z.literal('projects'),
    data: ProjectSchema,
  }),
  z.object({
    section: z.literal('education'),
    data: EducationSchema,
  }),
]);

/**
 * Content creation payload schemas (separate for each type)
 */
export const ExperienceCreatePayloadSchema = ExperienceSchema.omit({ media: true }).extend({
  media: z.array(MediaItemSchema).max(50).optional(),
  slug: SlugSchema,
});

export const ProjectCreatePayloadSchema = ProjectSchema.omit({ media: true }).extend({
  media: z.array(MediaItemSchema).max(50).optional(),
  slug: SlugSchema,
});

export const EducationCreatePayloadSchema = EducationSchema.omit({ media: true }).extend({
  media: z.array(MediaItemSchema).max(20).optional(),
  slug: SlugSchema,
});

/**
 * Content edit payload schemas (partial updates allowed)
 */
export const ExperienceEditPayloadSchema = ExperienceCreatePayloadSchema.partial();
export const ProjectEditPayloadSchema = ProjectCreatePayloadSchema.partial();
export const EducationEditPayloadSchema = EducationCreatePayloadSchema.partial();

/**
 * Union types
 */
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Content = z.infer<typeof ContentSchema>;

export type ExperienceCreatePayload = z.infer<typeof ExperienceCreatePayloadSchema>;
export type ProjectCreatePayload = z.infer<typeof ProjectCreatePayloadSchema>;
export type EducationCreatePayload = z.infer<typeof EducationCreatePayloadSchema>;

export type ExperienceEditPayload = z.infer<typeof ExperienceEditPayloadSchema>;
export type ProjectEditPayload = z.infer<typeof ProjectEditPayloadSchema>;
export type EducationEditPayload = z.infer<typeof EducationEditPayloadSchema>;

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
