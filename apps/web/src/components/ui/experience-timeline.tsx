'use client';
import { useMotionValueEvent, useScroll, useTransform, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { JobData } from '@/data/generateJobs';
import {
  formatDateRange,
  formatTimelineDate,
  isPresentJob,
  isCurrentMonth,
} from '@/lib/timeline-utils';
import { Highlighter } from '@/components/ui/highlighter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './separator';
import Link from 'next/link';

interface ExperienceTimelineProps {
  jobs: JobData[];
}

export function ExperienceTimeline({ jobs }: ExperienceTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-4xl">
        {jobs.map((job, _) => (
          <div key={job.slug} className="flex justify-start md:gap-6 mt-8 first:mt-0">
            {/* Timeline dot and year - 1/4 width on desktop */}
            <div className="top-24 z-40 sticky flex md:flex-row flex-col items-center self-start w-full md:w-1/4">
              <div className="left-3 md:left-3 absolute flex justify-center items-center bg-background rounded-full w-10 h-10">
                <div id="timeline-dot" className="bg-[#0070F3] rounded-full w-4 h-4" />
              </div>
              <div className="hidden md:block md:pl-20 text-center">
                <h3 className="font-bold text-muted-foreground text-lg">
                  {isCurrentMonth(job) ? (
                    <Highlighter
                      color="#fbbf24"
                      strokeWidth={1}
                      animationDuration={800}
                      multiline={true}
                    >
                      {formatTimelineDate(job)}
                    </Highlighter>
                  ) : (
                    formatTimelineDate(job)
                  )}
                </h3>
                <p className="text-muted-foreground text-xs">{job.company}</p>
              </div>
            </div>

            {/* Job content - 3/4 width on desktop */}
            <div className="relative pr-4 pl-16 md:pl-4 md:w-3/4">
              {/* Mobile header */}
              <div className="md:hidden mb-4">
                <h3 className="font-bold text-muted-foreground text-xl">
                  {isCurrentMonth(job) ? (
                    <Highlighter
                      color="#fbbf24"
                      strokeWidth={1}
                      animationDuration={800}
                      multiline={false}
                    >
                      {formatTimelineDate(job)}
                    </Highlighter>
                  ) : (
                    formatTimelineDate(job)
                  )}
                </h3>
                <p className="text-muted-foreground text-sm">{job.company}</p>
              </div>

              {/* Job card */}
              <Link href={job.href}>
                <Card className="group relative hover:shadow-lg p-4 border hover:border-primary/20 border-border transition-all duration-300">
                  {/* Absolute positioned badges */}
                  {(job.featured || isPresentJob(job)) && (
                    <div className="top-0 right-0 z-10 absolute flex flex-col gap-2 -translate-y-1/2 translate-x-1/2">
                      {isPresentJob(job) && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 shadow-sm backdrop-blur-sm px-3 py-1.5 border-green-500/20 rounded-full font-medium text-green-600 dark:text-green-400 text-xs"
                        >
                          Present
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Job header */}
                  <CardHeader className="flex-1 p-0">
                    <CardTitle className="flex items-center gap-2 mb-2 w-full text-foreground group-hover:text-primary text-xl leading-tight transition-colors">
                      {job.role}
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-primary">{job.company}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2 p-0">
                    {/* Cover image */}
                    {job.cover && (
                      <div className="relative shadow-inner rounded-xl w-full h-56 overflow-hidden">
                        <Image
                          src={job.cover}
                          alt={`${job.company} - ${job.role}`}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 600px"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                      <span className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                        📅 {formatDateRange(job)}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                          📍 {job.location}
                        </span>
                      )}
                      {job.type && (
                        <Badge
                          variant="secondary"
                          className="px-3 py-1.5 rounded-lg font-medium text-xs"
                        >
                          {job.type}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {(job.summary || job.description) && (
                      <p className="text-muted-foreground text-sm leading-tight">
                        {job.summary || job.description}
                      </p>
                    )}

                    {/* Technologies */}
                    {job.technologies && job.technologies.length > 0 && (
                      <div className="pb-2">
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.slice(0, 3).map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="px-1.5 py-0.5 rounded-lg font-medium text-xs transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {job.technologies.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0.5 rounded-lg font-medium text-xs transition-colors"
                            >
                              +{job.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        ))}

        {/* Timeline line */}
        <div
          style={{
            height: height + 'px',
          }}
          className="top-0 left-8 md:left-8 absolute bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[0%] from-transparent via-[#0070F3]/20 to-[99%] to-transparent rounded-full w-[2px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="top-0 absolute inset-x-0 bg-gradient-to-t from-[#0070F3] from-[0%] via-[#38bdf8]/80 via-[10%] to-transparent rounded-full w-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
