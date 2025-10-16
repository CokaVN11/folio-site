import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectEntry, getProject } from '@/lib/content';
import { MDXRenderer } from '@/lib/mdx';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const entries = await getProject();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getProjectEntry(slug);

  if (!entry) {
    return {
      title: 'Experience Not Found',
    };
  }

  return {
    title: `${entry.metadata.title} - Projects`,
    description: entry.metadata.summary,
    openGraph: {
      title: entry.metadata.title,
      description: entry.metadata.summary,
      images: entry.metadata.cover ? [{ url: entry.metadata.cover }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: entry.metadata.cover ? [entry.metadata.cover] : [],
    },
  };
}

export default async function ExpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getProjectEntry(slug);

  if (!entry) {
    notFound();
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: entry.metadata.title,
    description: entry.metadata.summary,
    datePublished: entry.metadata.date,
    image: entry.metadata.cover,
    keywords: entry.metadata.tags?.join(', '),
    author: {
      '@type': 'Person',
      name: 'Khanh Nguyen',
    },
    url: `https://portfolio.coka.id.vn/project/${entry.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorkSchema),
        }}
      />
      <article className="min-h-screen bg-background">
        <div className="container px-4 py-16 mx-auto max-w-4xl">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/project"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Header */}
          <header className="mb-12">
            {/* Cover Image */}
            {entry.metadata.cover && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={entry.metadata.cover}
                  alt={entry.metadata.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="text-center">
              <h1 className="mb-4 text-4xl md:text-5xl font-bold text-foreground">
                {entry.metadata.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-muted-foreground">
                {/* Date */}
                <time className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(entry.metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>

                {/* Role */}
                {entry.metadata.role && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {entry.metadata.role}
                  </span>
                )}
              </div>

              {/* Summary */}
              {entry.metadata.summary && (
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  {entry.metadata.summary}
                </p>
              )}

              {/* Technologies */}
              {entry.metadata.tech && entry.metadata.tech.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.metadata.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Topics
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {entry.metadata.featured && (
                <div className="mt-6">
                  <span className="px-3 py-1 text-sm font-medium bg-primary text-primary-foreground rounded-full">
                    Featured Project
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <MDXRenderer content={entry.content} />
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <Link
                href="/project"
                className="inline-flex items-center text-primary hover:underline"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to all projects
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
