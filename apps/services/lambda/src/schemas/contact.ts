import { z } from 'zod';

/**
 * Contact form payload schema
 * This schema is the contract between frontend and backend
 */
export const ContactPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

/**
 * Contact message stored in DynamoDB
 */
export interface ContactMessage extends ContactPayload {
  id: string;
  timestamp: string;
  ip?: string;
}

/**
 * Contact form response schema
 */
export const ContactResponseSchema = z.object({
  message: z.string(),
  id: z.string(),
});

export type ContactResponse = z.infer<typeof ContactResponseSchema>;
