/**
 * Job Generator Utility
 * Syncs jobs from MDX content files to RESUME data structure
 */

import { getJobs } from '@/lib/content';
import type { Entry } from '@/lib/types';

export interface JobData {
  title: string;
  company: string;
  role: string;
  description: string;
  summary?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  technologies: string[];
  tags: string[];
  cover?: string;
  featured: boolean;
  href: string;
  slug: string;
  location?: string;
  type?: string; // full-time, part-time, contract, freelance, internship
}

/**
 * Transform MDX entry to job data structure
 */
function transformEntryToJob(entry: Entry): JobData {
  const { metadata, slug } = entry;

  // Extract company name from title or use as fallback
  const title = metadata.title || '';
  const company = title.replace(/^.*?\s*[-–]\s*/, '') || title; // Extract company after " - " or " – "

  // Extract role from title metadata or derive from title
  const role = metadata.role || title.split(' - ')[0] || title;

  // Generate description from summary or content
  let description = metadata.summary || '';

  // If no summary, extract from content (first 300 chars)
  if (!description && entry.content) {
    // Remove markdown and HTML tags for clean description
    const cleanContent = entry.content
      .replace(/^#.*$/gm, '') // Remove headers
      .replace(/\*\*.*?\*\*/g, '') // Remove bold/italic
      .replace(/`.*?`/g, '') // Remove inline code
      .replace(/\[.*?\]\(.*?\)/g, '$1') // Convert markdown links to plain text
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
      .replace(/\n{3,}/g, ' ') // Convert multiple newlines to space
      .trim();

    description = cleanContent.length > 300 ? cleanContent.substring(0, 300) + '...' : cleanContent;
  }

  return {
    title,
    company,
    role,
    description,
    summary: metadata.summary,
    date: metadata.date,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    technologies: metadata.tech || [],
    tags: metadata.tags || [],
    cover: metadata.cover,
    featured: metadata.featured || false,
    href: `/job/${slug}`,
    slug,
    // Additional fields that can be added to MDX frontmatter later
    location: metadata.location,
    type: metadata.type || extractJobType(title),
  };
}

/**
 * Extract job type from title (fallback)
 */
function extractJobType(title: string): string {
  const lowerTitle = title.toLowerCase();
  let jobType = 'full-time';
  if (lowerTitle.includes('intern')) jobType = 'internship';
  if (lowerTitle.includes('freelance')) jobType = 'freelance';
  if (lowerTitle.includes('contract')) jobType = 'contract';
  if (lowerTitle.includes('part-time')) jobType = 'part-time';
  return jobType[0].toUpperCase() + jobType.slice(1);
}

/**
 * Generate jobs array from MDX content
 */
export async function generateJobs(): Promise<JobData[]> {
  try {
    const contentJobs = await getJobs();

    // Transform each entry to job data
    const jobs = contentJobs.map(transformEntryToJob);

    // Sort by date descending (newest first)
    jobs.sort((a: JobData, b: JobData) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return jobs;
  } catch (error) {
    console.error('Error generating jobs from content:', error);
    return [];
  }
}

/**
 * Get featured jobs (first 3 or all if less than 3)
 */
export async function getFeaturedJobs(limit: number = 3): Promise<JobData[]> {
  const allJobs = await generateJobs();
  return allJobs.filter((j: JobData) => j.featured).slice(0, limit);
}

/**
 * Get jobs by technology stack
 */
export async function getJobsByTechnology(tech: string): Promise<JobData[]> {
  const allJobs = await generateJobs();
  return allJobs.filter((j: JobData) =>
    j.technologies.some((t: string) => t.toLowerCase().includes(tech.toLowerCase()))
  );
}

/**
 * Get jobs by tag
 */
export async function getJobsByTag(tag: string): Promise<JobData[]> {
  const allJobs = await generateJobs();
  return allJobs.filter((j: JobData) =>
    j.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

/**
 * Search jobs by title, company, description, or tags
 */
export async function searchJobs(query: string): Promise<JobData[]> {
  const allJobs = await generateJobs();
  const searchTerm = query.toLowerCase();

  return allJobs.filter(
    (job: JobData) =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.role.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
      job.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get jobs by type (full-time, internship, freelance, etc.)
 */
export async function getJobsByType(type: string): Promise<JobData[]> {
  const allJobs = await generateJobs();
  return allJobs.filter((j: JobData) => j.type?.toLowerCase().includes(type.toLowerCase()));
}

// Cache for generated jobs to avoid repeated async calls
let cachedJobs: JobData[] | null = null;

/**
 * Synchronous version for use in RESUME object - should be populated at build time
 * For now returns empty array, will be populated by build script
 */
export function getJobsSync(): JobData[] {
  if (cachedJobs) {
    return cachedJobs;
  }

  // Fallback empty array for development
  return [];
}

/**
 * Set cached jobs (used by build script)
 */
export function setCachedJobs(jobs: JobData[]): void {
  cachedJobs = jobs;
}
