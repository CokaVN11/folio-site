'use client';

import type { JobData } from '@/data/generateJobs';
import { ExperienceTimeline } from '@/components/ui/experience-timeline';
import { sortJobsByDate } from '@/lib/timeline-utils';
import { Badge } from '@/components/ui/badge';
import { SparklesText } from '@/components/ui/sparkles-text';

interface ExperienceSectionProps {
  work: JobData[];
}

export function ExperienceTimelineSection({ work }: ExperienceSectionProps) {
  // Sort jobs by date (newest first) and transform to timeline format
  const sortedJobs = sortJobsByDate(work);

  return (
    <section id="experience" className="bg-background w-full" aria-labelledby="experience-heading">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Section Header */}
        <div className="flex flex-col justify-center items-center gap-2 mb-8 text-center">
          <Badge className="mx-auto max-w-fit">Experience</Badge>
          <SparklesText className="font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter">
            Career Journey
          </SparklesText>
          <p className="text-muted-foreground lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
            Through roles at several companies, I&apos;ve gradually grown my understanding of
            software engineering.
          </p>
        </div>

        {/* Timeline Content */}
        {sortedJobs.length > 0 ? (
          <div className="relative">
            <ExperienceTimeline jobs={sortedJobs} />
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              Professional experience entries will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Export as ExperienceSection for backward compatibility
export { ExperienceTimelineSection as ExperienceSection };
