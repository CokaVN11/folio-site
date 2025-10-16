import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '../providers/AppProviders';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio - Professional Portfolio Website',
  description:
    'Full-stack developer portfolio showcasing projects and skills with serverless architecture',
  keywords: ['portfolio', 'web development', 'full-stack', 'serverless', 'AWS'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Portfolio - Professional Portfolio Website',
    description: 'Full-stack developer portfolio showcasing projects and skills',
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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
