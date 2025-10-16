import Link from 'next/link';
import Image from 'next/image';
import { getJobs } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Journey - Coka Portfolio',
  description:
    'Professional journey and work experience in software engineering, frontend development, and technology.',
  openGraph: {
    title: 'Career Journey - Coka Portfolio',
    description:
      'Professional journey and work experience in software engineering, frontend development, and technology.',
    url: '/job',
    type: 'website',
  },
};

export default async function JobPage() {
  const entries = await getJobs();

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-16 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Career Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My professional journey through various roles and companies, showcasing growth and
            expertise in software engineering.
          </p>
        </div>

        {/* Timeline */}
        {entries.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:transform md:-translate-x-px"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {entries.map((entry, index) => (
                <div
                  key={entry.slug}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 w-4 h-4 bg-primary rounded-full border-4 border-background transform -translate-x-1/2 md:left-1/2">
                    {entry.metadata.featured && (
                      <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 ml-16 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                    }`}
                  >
                    <Link href={`/job/${entry.slug}`}>
                      <article className="group p-6 border rounded-lg hover:shadow-lg transition-all duration-300 border-border bg-card">
                        {/* Date Badge */}
                        <div
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary text-primary-foreground mb-4 ${
                            index % 2 === 0 ? 'md:float-right' : 'md:float-left'
                          }`}
                        >
                          {new Date(entry.metadata.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </div>

                        {/* Cover Image */}
                        {entry.metadata.cover && (
                          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={entry.metadata.cover}
                              alt={entry.metadata.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="mb-2 text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {entry.metadata.title}
                        </h2>

                        {/* Role */}
                        {entry.metadata.role && (
                          <p className="mb-3 text-primary font-medium">{entry.metadata.role}</p>
                        )}

                        {/* Summary */}
                        {entry.metadata.summary && (
                          <p className="mb-4 text-muted-foreground line-clamp-3">
                            {entry.metadata.summary}
                          </p>
                        )}

                        {/* Technologies */}
                        {entry.metadata.tech && entry.metadata.tech.length > 0 && (
                          <div className="mb-4">
                            <div
                              className={`flex flex-wrap gap-2 ${
                                index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                              }`}
                            >
                              {entry.metadata.tech.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                          <div
                            className={`flex flex-wrap gap-2 ${
                              index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                            }`}
                          >
                            {entry.metadata.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Featured Badge */}
                        {entry.metadata.featured && (
                          <div className="mt-4">
                            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                              Key Role
                            </span>
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
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No job entries found yet.</p>
            <Link href="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
