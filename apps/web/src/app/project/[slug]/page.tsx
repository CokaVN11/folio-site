import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectEntry, getProject } from '@/lib/content';
import { MDXRenderer } from '@/lib/mdx';

export const dynamic = 'force-static'; // Force static generation for all slugs
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
    title: `${entry.metadata.title} - Full-Stack Project | Khanh Nguyen Portfolio`,
    description:
      entry.metadata.summary ||
      `Full-stack development project: ${entry.metadata.title}. Built with ${entry.metadata.tech?.join(', ') || 'modern web technologies'}. Professional web development case study.`,
    keywords: [
      entry.metadata.title,
      ...(entry.metadata.tech || []),
      ...(entry.metadata.tags || []),
      'full-stack project',
      'web development',
      'case study',
      'portfolio project',
      'professional development',
      ...(entry.metadata.tech?.includes('React') ? ['React project'] : []),
      ...(entry.metadata.tech?.includes('Next.js') ? ['Next.js project'] : []),
      ...(entry.metadata.tech?.includes('Vue.js') ? ['Vue.js project'] : []),
      ...(entry.metadata.tech?.includes('NestJS') ? ['NestJS project'] : []),
      ...(entry.metadata.tech?.includes('TypeScript') ? ['TypeScript project'] : []),
    ].filter(Boolean),
    openGraph: {
      title: entry.metadata.title,
      description:
        entry.metadata.summary || `Full-stack development project: ${entry.metadata.title}`,
      images: entry.metadata.cover ? [{ url: entry.metadata.cover }] : [],
      type: 'article',
      url: `https://portfolio.coka.id.vn/project/${entry.slug}`,
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
    genre: 'Web Development',
    author: {
      '@type': 'Person',
      name: 'Khanh Nguyen',
      jobTitle: 'Full-Stack Developer',
      url: 'https://portfolio.coka.id.vn',
      sameAs: ['https://github.com/CokaVN11', 'https://linkedin.com/in/ngckhanh'],
    },
    creator: {
      '@type': 'Person',
      name: 'Khanh Nguyen',
    },
    publisher: {
      '@type': 'Person',
      name: 'Khanh Nguyen',
    },
    url: `https://portfolio.coka.id.vn/project/${entry.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://portfolio.coka.id.vn/project/${entry.slug}`,
    },
    programmingLanguage: entry.metadata.tech,
    about: entry.metadata.tags?.map((tag) => ({
      '@type': 'Thing',
      name: tag,
    })),
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Full-Stack Web Development',
        description: `Custom web development using ${entry.metadata.tech?.join(', ') || 'modern technologies'}`,
      },
      seller: {
        '@type': 'Person',
        name: 'Khanh Nguyen',
        jobTitle: 'Full-Stack Developer',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorkSchema),
        }}
      />
      <article className="bg-background min-h-screen">
        <div className="mx-auto px-4 py-16 max-w-4xl container">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="relative mb-8 rounded-lg w-full h-64 md:h-96 overflow-hidden">
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
              <h1 className="mb-4 font-bold text-foreground text-4xl md:text-5xl">
                {entry.metadata.title}
              </h1>

              <div className="flex flex-wrap justify-center items-center gap-4 mb-6 text-muted-foreground">
                {/* Date */}
                <time className="flex items-center">
                  <svg
                    className="mr-2 w-4 h-4"
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
                      className="mr-2 w-4 h-4"
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
                <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
                  {entry.metadata.summary}
                </p>
              )}

              {/* Technologies */}
              {entry.metadata.tech && entry.metadata.tech.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.metadata.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary px-3 py-1 rounded-full font-medium text-secondary-foreground text-sm"
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
                  <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Topics
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted px-3 py-1 rounded-full text-muted-foreground text-sm"
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
                  <span className="bg-primary px-3 py-1 rounded-full font-medium text-primary-foreground text-sm">
                    Featured Project
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="max-w-none prose prose-lg">
            <MDXRenderer content={entry.content} />
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <Link
                href="/project"
                className="inline-flex items-center text-primary hover:underline"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
