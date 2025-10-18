'use client';

import Link from 'next/link';

interface HeroSectionProps {
  onContactClick: (e: React.MouseEvent) => void;
}

export function HeroSection({ onContactClick }: HeroSectionProps) {
  return (
    <header className="mx-auto px-4 py-20 container">
      <div className="max-w-4xl">
        <h1 className="mb-6 font-bold text-3xl sm:text-4xl md:text-5xl">
          Hi, I&apos;m <span className="text-primary">Khanh Nguyen</span>
        </h1>
        <p className="mb-4 text-muted-foreground text-xl">
          Full-stack developer specializing in modern web applications with React, Next.js, Vue.js,
          and scalable backend systems.
        </p>
        <div className="mb-6 text-muted-foreground text-lg sm:text-left text-center">
          <div className="flex sm:flex-row flex-col gap-1 sm:gap-4">
            <span>📍 Ho Chi Minh City, Vietnam</span>
            <span>📧 nguyenckhanh71@gmail.com</span>
            <span>📱 (+84)868 750 030</span>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-4">
          <a
            href="#contact"
            onClick={onContactClick}
            className="bg-primary hover:opacity-90 px-6 py-3 rounded-md text-primary-foreground transition-opacity"
          >
            Get in Touch
          </a>
          <Link
            href="#projects"
            className="hover:bg-accent px-6 py-3 border border-border rounded-md transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="#experience"
            className="hover:bg-accent px-6 py-3 border border-border rounded-md transition-colors"
          >
            View Experience
          </Link>
        </div>
      </div>
    </header>
  );
}
