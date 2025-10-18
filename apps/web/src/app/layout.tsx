import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      <body
        className={cn(inter.className, 'font-sans antialiased max-w-screen-lg mx-auto')}
        suppressHydrationWarning
      >
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
