/**
 * Project Generator Utility
 * Syncs projects from MDX content files to RESUME data structure
 */

import { getProject } from '@/lib/content';
import type { Entry } from '@/lib/types';

export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  contribution: string;
  featured: boolean;
  href: string;
  date: string;
  tags: string[];
  cover?: string;
  slug: string;
  role?: string;
  summary?: string;
}

/**
 * Transform MDX entry to project data structure
 */
function transformEntryToProject(entry: Entry): ProjectData {
  const { metadata, slug } = entry;

  // Generate description from summary or content
  let description = metadata.summary || '';

  // If no summary, extract from content (first 200 chars)
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

    description = cleanContent.length > 200 ? cleanContent.substring(0, 200) + '...' : cleanContent;
  }

  return {
    title: metadata.title,
    description,
    technologies: metadata.tech || [],
    contribution: metadata.role || 'Project Contributor',
    featured: metadata.featured || false,
    href: `/project/${slug}`,
    date: metadata.date,
    tags: metadata.tags || [],
    cover: metadata.cover,
    slug,
    role: metadata.role,
    summary: metadata.summary,
  };
}

/**
 * Generate projects array from MDX content
 */
export async function generateProjects(): Promise<ProjectData[]> {
  try {
    const contentProjects = await getProject();

    // Transform each entry to project data
    const projects = contentProjects.map(transformEntryToProject);

    // Sort by date descending (newest first)
    projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return projects;
  } catch (error) {
    console.error('Error generating projects from content:', error);
    return [];
  }
}

/**
 * Get featured projects (first 3 or all if less than 3)
 */
export async function getFeaturedProjects(limit: number = 3): Promise<ProjectData[]> {
  const projects = await generateProjects();
  return projects.filter((p) => p.featured).slice(0, limit);
}

/**
 * Get projects by technology stack
 */
export async function getProjectsByTechnology(tech: string): Promise<ProjectData[]> {
  const projects = await generateProjects();
  return projects.filter((p) =>
    p.technologies.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
  );
}

/**
 * Get projects by tag
 */
export async function getProjectsByTag(tag: string): Promise<ProjectData[]> {
  const projects = await generateProjects();
  return projects.filter((p) => p.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())));
}

/**
 * Search projects by title, description, or tags
 */
export async function searchProjects(query: string): Promise<ProjectData[]> {
  const projects = await generateProjects();
  const searchTerm = query.toLowerCase();

  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))
  );
}

// Cache for generated projects to avoid repeated async calls
let cachedProjects: ProjectData[] | null = null;

/**
 * Synchronous version for use in RESUME object - should be populated at build time
 * For now returns empty array, will be populated by build script
 */
export function getProjectsSync(): ProjectData[] {
  if (cachedProjects) {
    return cachedProjects;
  }

  // Fallback empty array for development
  return [];
}

/**
 * Set cached projects (used by build script)
 */
export function setCachedProjects(projects: ProjectData[]): void {
  cachedProjects = projects;
}
