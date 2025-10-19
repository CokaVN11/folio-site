import React from 'react';
import type { JobData } from '@/data/generateJobs';
import Image from 'next/image';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

/**
 * Transform JobData array to TimelineEntry array for the Timeline component
 * @param jobs - Array of job data from MDX content
 * @returns Array of timeline entries formatted for the Timeline component
 */
export function transformJobsToTimeline(jobs: JobData[]): TimelineEntry[] {
  return jobs.map((job) => ({
    title: getTimelineTitle(job),
    content: <TimelineJobContent job={job} />,
  }));
}

/**
 * Generate the timeline title for a job entry
 */
function getTimelineTitle(job: JobData): string {
  const formattedDate = formatTimelineTitle(job);

  // Use company name as primary title, with formatted date as context
  return `${formattedDate} • ${job.company}`;
}

/**
 * Format date for timeline title display (concise month-year format)
 * @param job - Job data with date information
 * @returns Formatted date string like "Jan 2024" or "Jan 2024 - Jun 2024"
 */
export function formatTimelineTitle(job: JobData): string {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  // Prefer date range if available
  if (job.startDate) {
    const start = formatDate(job.startDate);
    const end = job.endDate ? formatDate(job.endDate) : 'Present';

    if (start && end && start !== end) {
      return `${start} - ${end}`;
    } else if (end) {
      return end;
    }
  }

  // Fall back to single date
  return (
    formatDate(job.date) ||
    new Date(job.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  );
}

/**
 * Format simple month-year display for timeline sidebar
 * @param job - Job data with date information
 * @returns Simple formatted date like "Jan 2024"
 */
export function formatTimelineDate(job: JobData): string {
  // Use start date if available, otherwise fall back to main date
  const dateToUse = job.startDate || job.date;
  const date = new Date(dateToUse);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

/**
 * Check if a job is currently ongoing (present job)
 * @param job - Job data with date information
 * @returns Boolean indicating if job is currently ongoing
 */
export function isPresentJob(job: JobData): boolean {
  const now = new Date();

  if (job.endDate) {
    // Job has ended
    return new Date(job.endDate) >= now;
  }

  if (job.startDate) {
    // Job has start date, check if it has started and not ended
    const startDate = new Date(job.startDate);
    return startDate <= now && !job.endDate;
  }

  // Job has main date, check if it spans present time
  const mainDate = new Date(job.date);
  const startOfMonth = new Date(mainDate.getFullYear(), mainDate.getMonth(), 1);
  const endOfMonth = new Date(mainDate.getFullYear(), mainDate.getMonth() + 1, 0);

  return startOfMonth <= now && endOfMonth > now;
}

/**
 * Check if a job spans the current month
 * @param job - Job data with date information
 * @returns Boolean indicating if job covers current month
 */
export function isCurrentMonth(job: JobData): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (job.startDate && job.endDate) {
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    // Check if current month is within job duration
    return (
      ((startDate.getFullYear() === currentYear && startDate.getMonth() <= currentMonth) ||
        (endDate.getFullYear() === currentYear && endDate.getMonth() >= currentMonth) ||
        (startDate.getFullYear() < currentYear && endDate.getFullYear() > currentYear)) &&
      (startDate.getFullYear() < currentYear || startDate.getMonth() <= currentMonth) &&
      (endDate.getFullYear() > currentYear || endDate.getMonth() >= currentMonth)
    );
  }

  // Check if job's main date is in current month
  const jobDate = new Date(job.date);
  return jobDate.getFullYear() === currentYear && jobDate.getMonth() === currentMonth;
}

/**
 * Check if a job is recent (within last 3 months)
 * @param job - Job data with date information
 * @returns Boolean indicating if job is recent
 */
export function isRecentJob(job: JobData): boolean {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

  const jobDate = job.endDate ? new Date(job.endDate) : new Date(job.date);
  return jobDate >= threeMonthsAgo;
}

/**
 * Create rich content for timeline job entry
 */
function TimelineJobContent({ job }: { job: JobData }): React.ReactElement {
  return (
    <div className="space-y-4">
      {/* Job Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-semibold text-foreground text-lg">{job.role}</h4>
          <p className="font-medium text-primary">{job.company}</p>
        </div>
        {job.featured && (
          <span className="bg-primary/10 px-2 py-1 rounded font-medium text-primary text-xs">
            Key Role
          </span>
        )}
      </div>

      {/* Cover Image */}
      {job.cover && (
        <div className="relative rounded-lg w-full h-48 overflow-hidden">
          <Image
            src={job.cover}
            alt={`${job.company} - ${job.role}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
        <span className="flex items-center gap-1">📅 {formatDateRange(job)}</span>
        {job.location && <span className="flex items-center gap-1">📍 {job.location}</span>}
        {job.type && (
          <span className="bg-secondary px-2 py-1 rounded font-medium text-secondary-foreground text-xs">
            {job.type}
          </span>
        )}
      </div>

      {/* Description */}
      {(job.summary || job.description) && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {job.summary || job.description}
        </p>
      )}

      {/* Technologies */}
      {job.technologies && job.technologies.length > 0 && (
        <div>
          <h5 className="mb-2 font-medium text-foreground text-xs">Technologies</h5>
          <div className="flex flex-wrap gap-2">
            {job.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-secondary px-2 py-1 rounded font-medium text-secondary-foreground text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div>
          <h5 className="mb-2 font-medium text-foreground text-xs">Tags</h5>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="bg-muted px-2 py-1 rounded text-muted-foreground text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format date range for display
 */
export function formatDateRange(job: JobData): string {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const start = formatDate(job.startDate);
  const end = job.endDate ? formatDate(job.endDate) : 'Present';

  if (start && end && start !== end) {
    return `${start} - ${end}`;
  } else if (end) {
    return end;
  } else {
    return new Date(job.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }
}

/**
 * Sort jobs by date (newest first)
 */
export function sortJobsByDate(jobs: JobData[]): JobData[] {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Newest first
  });
}
