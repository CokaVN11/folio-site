import Link from 'next/link';
import Image from 'next/image';
import { getProject } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience - Coka Portfolio',
  description:
    'Collection of projects and experiences in frontend development, UI/UX design, and full-stack engineering.',
  openGraph: {
    title: 'Experience - Coka Portfolio',
    description:
      'Collection of projects and experiences in frontend development, UI/UX design, and full-stack engineering.',
    url: '/exp',
    type: 'website',
  },
};

export default async function ExpPage() {
  const entries = await getProject();

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-16 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Experience</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my work in frontend development, UI/UX design, and
            full-stack engineering.
          </p>
        </div>

        {/* Experience Grid */}
        {entries.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {entries.map((entry) => (
              <article
                key={entry.slug}
                className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border"
              >
                <Link href={`/exp/${entry.slug}`}>
                  <div className="flex flex-col md:flex-row">
                    {/* Cover Image */}
                    {entry.metadata.cover && (
                      <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                        <Image
                          src={entry.metadata.cover}
                          alt={entry.metadata.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-6">
                      {/* Title and Date */}
                      <div className="mb-3">
                        <h2 className="mb-2 text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {entry.metadata.title}
                        </h2>
                        <time className="text-sm text-muted-foreground">
                          {new Date(entry.metadata.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>

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
                          <div className="flex flex-wrap gap-2">
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
                        <div className="flex flex-wrap gap-2">
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
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No experience entries found yet.</p>
            <Link href="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
