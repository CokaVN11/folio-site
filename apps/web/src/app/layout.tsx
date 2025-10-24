import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo-utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents FOIT
  weight: ['400', '500', '600', '700'], // Only load needed weights
  preload: true, // Keep preloading
});

export const metadata: Metadata = generateSEOMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.variable, 'font-sans antialiased max-w-screen-lg mx-auto')}
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
        <Toaster />
      </body>
    </html>
  );
}
