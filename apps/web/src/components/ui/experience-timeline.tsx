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
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { Highlighter } from '@/components/ui/highlighter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
          <div key={job.slug} className="flex justify-start md:gap-6 pt-8 md:pt-16">
            {/* Timeline dot and year - 1/4 width on desktop */}
            <div className="top-24 z-40 sticky flex md:flex-row flex-col items-center self-start w-full md:w-1/4">
              <div className="left-3 md:left-3 absolute flex justify-center items-center bg-background border-2 border-border rounded-full w-10 h-10">
                <div className="bg-primary rounded-full w-4 h-4" />
                {job.featured && (
                  <div className="absolute inset-0 bg-primary opacity-50 rounded-full w-4 h-4 animate-pulse"></div>
                )}
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
                <CardHeader className="flex-1 mb-6 p-0 pr-32">
                  <CardTitle className="mb-2 text-foreground group-hover:text-primary text-2xl leading-tight transition-colors">
                    {job.role}
                  </CardTitle>
                  <div className="font-medium text-primary text-lg">{job.company}</div>
                </CardHeader>

                <CardContent className="space-y-6 p-0">
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
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {job.summary || job.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {job.technologies && job.technologies.length > 0 && (
                    <div>
                      <h5 className="mb-3 font-medium text-foreground text-sm">Technologies</h5>
                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="px-3 py-1.5 rounded-lg font-medium text-xs transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Link to full details */}
                {job.href && (
                  <CardFooter className="p-0 pt-6 border-t border-border">
                    <a
                      href={job.href}
                      className="inline-flex items-center font-medium text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      View details →
                    </a>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        ))}

        {/* Timeline line */}
        <div
          style={{
            height: height + 'px',
          }}
          className="top-0 left-8 md:left-8 absolute bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[0%] from-transparent to-[99%] to-transparent via-border w-[2px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="top-0 absolute inset-x-0 bg-gradient-to-t from-[0%] from-primary via-[10%] via-primary/80 to-transparent rounded-full w-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
