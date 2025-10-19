'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { JobData } from '@/data/generateJobs';
import { Badge } from '../ui/badge';
import { SparklesText } from '../ui/sparkles-text';

interface ExperienceSectionProps {
  work: JobData[];
}

export function ExperienceSection({ work }: ExperienceSectionProps) {
  return (
    <section id="experience" className="mx-auto w-full" aria-labelledby="experience-heading">
      <div className="flex flex-col justify-center items-center gap-2 mb-8 text-center">
        <Badge className="mx-auto max-w-fit">Experience</Badge>
        <SparklesText className="font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter">
          Career Journey
        </SparklesText>
        <p className="text-muted-foreground lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
          Through roles at several companies, I&apos;ve gradually grown my understanding of software
          engineering.
        </p>
      </div>

      {work.length > 0 ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="top-0 bottom-0 left-8 md:left-1/2 absolute bg-border w-0.5 md:-translate-x-px md:transform"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {work.map((job, index) => (
              <div
                key={job.slug}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="left-8 md:left-1/2 absolute bg-primary border-4 border-background rounded-full w-4 h-4 -translate-x-1/2 transform">
                  {job.featured && (
                    <div className="absolute inset-0 bg-primary rounded-full w-4 h-4 animate-pulse"></div>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 ml-16 md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                  }`}
                >
                  <Link href={job.href}>
                    <article className="group bg-card hover:shadow-lg p-6 border border-border rounded-lg transition-all duration-300">
                      {/* Date and Type Badges */}
                      <div
                        className={`flex items-center gap-2 mb-4 ${
                          index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                        }`}
                      >
                        <div className="inline-block bg-primary px-3 py-1 rounded-full font-medium text-primary-foreground text-sm">
                          {new Date(job.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </div>
                        {job.type && (
                          <span className="bg-secondary px-2 py-1 rounded font-medium text-secondary-foreground text-xs">
                            {job.type}
                          </span>
                        )}
                        {job.featured && (
                          <span className="bg-primary/10 px-2 py-1 rounded font-medium text-primary text-xs">
                            Key Role
                          </span>
                        )}
                      </div>

                      {/* Cover Image */}
                      {job.cover && (
                        <div className="relative mb-4 rounded-lg w-full h-48 overflow-hidden">
                          <Image
                            src={job.cover}
                            alt={`${job.company} - ${job.role}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      )}

                      {/* Company and Title */}
                      <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary text-2xl transition-colors">
                        {job.company}
                      </h3>

                      <p className="mb-3 font-medium text-primary">{job.role}</p>

                      {/* Location */}
                      {job.location && (
                        <p className="mb-3 text-muted-foreground text-sm">📍 {job.location}</p>
                      )}

                      {/* Summary */}
                      {job.summary && (
                        <p className="mb-4 text-muted-foreground line-clamp-3">{job.summary}</p>
                      )}

                      {/* Description (fallback if no summary) */}
                      {!job.summary && job.description && (
                        <p className="mb-4 text-muted-foreground line-clamp-3">{job.description}</p>
                      )}

                      {/* Technologies */}
                      {job.technologies && job.technologies.length > 0 && (
                        <div className="mb-4">
                          <div
                            className={`flex flex-wrap gap-2 ${
                              index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                            }`}
                          >
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
                        <div
                          className={`flex flex-wrap gap-2 ${
                            index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                          }`}
                        >
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-muted px-2 py-1 rounded text-muted-foreground text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  </Link>
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-muted-foreground">
            Professional experience entries will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
