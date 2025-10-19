import type { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  openGraph?: {
    type?: 'website' | 'article' | 'profile';
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt: string;
    }>;
  };
}

const SITE_URL = 'https://portfolio.coka.id.vn';
const SITE_NAME = 'Khanh Nguyen - Full-Stack Developer Portfolio';
const AUTHOR_NAME = 'Khanh Nguyen';

const DEFAULT_META = {
  title: 'Khanh Nguyen - Full-Stack Developer | React & Next.js | Ho Chi Minh City',
  description:
    'Full-stack developer in Ho Chi Minh City, Vietnam. Building modern web applications with React, Next.js, Vue.js, and scalable backend systems. Available for freelance and remote projects.',
  keywords: [
    'full-stack developer',
    'web developer',
    'React developer',
    'Next.js developer',
    'Vue.js developer',
    'TypeScript developer',
    'NestJS developer',
    'software engineer',
    'Ho Chi Minh City',
    'Vietnam developer',
    'remote developer',
    'freelance developer',
  ],
};

/**
 * Generates metadata for pages with consistent SEO configuration
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const title = config.title || DEFAULT_META.title;
  const description = config.description || DEFAULT_META.description;
  const path = config.path || '';
  const keywords = config.keywords || DEFAULT_META.keywords;

  const url = `${SITE_URL}${path}`;
  const fullTitle = config.title ? `${title} | ${SITE_NAME}` : DEFAULT_META.title;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: AUTHOR_NAME }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
      googleBot: {
        index: !config.noIndex,
        follow: !config.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: config.openGraph?.type || 'website',
      images: config.openGraph?.images || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@khanhnguyen', // Add actual Twitter handle if available
    },
    alternates: {
      canonical: url,
    },
  };

  return metadata;
}

/**
 * Generates structured data (JSON-LD) for Person schema
 */
export function generatePersonSchema(data: {
  name: string;
  jobTitle: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  url: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    email: data.email,
    telephone: data.phone,
    address: data.address
      ? {
          '@type': 'PostalAddress',
          addressLocality: data.address,
        }
      : undefined,
    url: data.url,
    sameAs: data.sameAs || [],
    knowsAbout: [
      'React.js',
      'Next.js',
      'Vue.js',
      'TypeScript',
      'Node.js',
      'NestJS',
      'Web Development',
      'Software Engineering',
    ],
  };
}

/**
 * Generates structured data for ProfessionalService schema
 */
export function generateProfessionalServiceSchema(data: {
  name: string;
  description: string;
  url: string;
  email: string;
  phone?: string;
  address?: string;
  areasServed?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: data.name,
    description: data.description,
    url: data.url,
    email: data.email,
    telephone: data.phone,
    address: data.address
      ? {
          '@type': 'PostalAddress',
          addressLocality: data.address,
        }
      : undefined,
    areaServed: data.areasServed || ['Ho Chi Minh City', 'Vietnam', 'Remote'],
    knowsAbout: [
      'Web Application Development',
      'Full-Stack Development',
      'API Development',
      'Database Design',
      'Frontend Development',
      'Backend Development',
    ],
    serviceType: 'Web Development Services',
  };
}

/**
 * Generates structured data for Project/CreativeWork
 */
export function generateProjectSchema(data: {
  name: string;
  description: string;
  url: string;
  image?: string;
  technologies?: string[];
  dateCreated?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    dateCreated: data.dateCreated,
    programmingLanguage: data.technologies || [],
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    provider: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
  };
}

/**
 * Generates structured data for Article/BlogPost
 */
export function generateArticleSchema(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author || AUTHOR_NAME,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
  };
}
