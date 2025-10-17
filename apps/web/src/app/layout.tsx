import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio.coka.id.vn'),
  title: 'Khanh Nguyen - Full-Stack Developer Portfolio',
  description:
    'Full-stack developer portfolio showcasing projects in React, Next.js, Vue.js, NestJS, and scalable web applications with modern tech stack',
  keywords: [
    'portfolio',
    'web development',
    'full-stack',
    'React',
    'Next.js',
    'Vue.js',
    'NestJS',
    'TypeScript',
    'Docker',
  ],
  authors: [{ name: 'Khanh Nguyen' }],
  creator: 'Khanh Nguyen',
  publisher: 'Khanh Nguyen',
  openGraph: {
    title: 'Khanh Nguyen - Full-Stack Developer Portfolio',
    description:
      'Full-stack developer portfolio showcasing projects in React, Next.js, Vue.js, NestJS, and scalable web applications',
    url: 'https://portfolio.coka.id.vn',
    siteName: 'Khanh Nguyen Portfolio',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
