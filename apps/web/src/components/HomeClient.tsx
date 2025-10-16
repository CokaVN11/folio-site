'use client';

import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import { MobileNavigation } from './MobileNavigation';

interface HomeClientProps {
  className?: string;
}

export function HomeClient({ className = '' }: HomeClientProps) {
  return (
    <main className={`min-h-screen bg-background ${className}`}>
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Portfolio</h1>

            <div className="flex items-center gap-6">
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex gap-6">
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/project" className="transition-colors hover:text-primary">
                  Projects
                </Link>
                <Link href="/job" className="transition-colors hover:text-primary">
                  Career
                </Link>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
              </div>

              {/* Mobile Navigation */}
              <MobileNavigation />

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto">
        <div className="max-w-4xl">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
            Hi, I&apos;m <span className="text-primary">Khanh Nguyen</span>
          </h2>
          <p className="mb-4 text-xl text-muted-foreground">
            Full-stack developer specializing in modern web applications with React, Next.js,
            Vue.js, and scalable backend systems.
          </p>
          <div className="mb-6 text-center text-lg text-muted-foreground sm:text-left">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span>📍 Ho Chi Minh City, Vietnam</span>
              <span>📧 nguyenckhanh71@gmail.com</span>
              <span>📱 (+84)868 750 030</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:nguyenckhanh71@gmail.com"
              className="px-6 py-3 transition-opacity rounded-md bg-primary hover:opacity-90 text-primary-foreground"
            >
              Get in Touch
            </a>
            <Link
              href="/project"
              className="px-6 py-3 transition-colors border rounded-md hover:bg-accent border-border"
            >
              View Projects
            </Link>
            <Link
              href="/job"
              className="px-6 py-3 transition-colors border rounded-md hover:bg-accent border-border"
            >
              View Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="container px-4 py-16 mx-auto">
        <h3 className="mb-8 text-3xl font-bold">Education</h3>
        <div className="p-6 border rounded-lg border-border">
          <h4 className="mb-2 text-xl font-semibold text-primary">
            University of Science, VNUHCM (HCMUS)
          </h4>
          <p className="mb-2 text-lg text-foreground">Bachelor of Information Technology</p>
          <p className="mb-2 text-muted-foreground">GPA: 9.17/10 • Expected 2025</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded">
              Software Architecture
            </span>
            <span className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded">
              Software Testing
            </span>
            <span className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded">
              Algorithms
            </span>
            <span className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded">
              Java
            </span>
            <span className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded">
              IELTS 6.5
            </span>
          </div>
          <p className="text-muted-foreground">HCMC, Vietnam</p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container px-4 py-16 mx-auto">
        <h3 className="mb-8 text-3xl font-bold">Technical Skills</h3>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 sm:p-6 border rounded-lg border-border hover:shadow-md transition-shadow duration-300">
            <h4 className="mb-2 text-lg sm:text-xl font-semibold">Frontend</h4>
            <p className="text-sm sm:text-base text-muted-foreground">React, Next.js, Vue.js, TailwindCSS</p>
          </div>
          <div className="p-4 sm:p-6 border rounded-lg border-border hover:shadow-md transition-shadow duration-300">
            <h4 className="mb-2 text-lg sm:text-xl font-semibold">Backend</h4>
            <p className="text-sm sm:text-base text-muted-foreground">NestJS, FastAPI, Golang, Python, Java</p>
          </div>
          <div className="p-4 sm:p-6 border rounded-lg border-border hover:shadow-md transition-shadow duration-300">
            <h4 className="mb-2 text-lg sm:text-xl font-semibold">Cloud & DevOps</h4>
            <p className="text-sm sm:text-base text-muted-foreground">Docker, CI/CD, GitHub Actions, GitLab</p>
          </div>
          <div className="p-4 sm:p-6 border rounded-lg border-border hover:shadow-md transition-shadow duration-300">
            <h4 className="mb-2 text-lg sm:text-xl font-semibold">Developer Tools</h4>
            <p className="text-sm sm:text-base text-muted-foreground">Git, GitHub, GitLab, Webpack, Postman</p>
          </div>
        </div>
      </section>
    </main>
  );
}
