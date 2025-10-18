'use client';

import Link from 'next/link';
import Navbar from './Navbar';
interface HomeClientProps {
  className?: string;
}

export function HomeClient({ className = '' }: HomeClientProps) {
  return (
    <main className={`min-h-screen bg-background pb-20 ${className}`}>
      {/* Navigation */}

      {/* Hero Section */}
      <section className="mx-auto px-4 py-20 container">
        <div className="max-w-4xl">
          <h2 className="mb-6 font-bold text-3xl sm:text-4xl md:text-5xl">
            Hi, I&apos;m <span className="text-primary">Khanh Nguyen</span>
          </h2>
          <p className="mb-4 text-muted-foreground text-xl">
            Full-stack developer specializing in modern web applications with React, Next.js,
            Vue.js, and scalable backend systems.
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
              href="mailto:nguyenckhanh71@gmail.com"
              className="bg-primary hover:opacity-90 px-6 py-3 rounded-md text-primary-foreground transition-opacity"
            >
              Get in Touch
            </a>
            <Link
              href="/project"
              className="hover:bg-accent px-6 py-3 border border-border rounded-md transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="/job"
              className="hover:bg-accent px-6 py-3 border border-border rounded-md transition-colors"
            >
              View Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="mx-auto px-4 py-16 container">
        <h3 className="mb-8 font-bold text-3xl">Education</h3>
        <div className="p-6 border border-border rounded-lg">
          <h4 className="mb-2 font-semibold text-primary text-xl">
            University of Science, VNUHCM (HCMUS)
          </h4>
          <p className="mb-2 text-foreground text-lg">Bachelor of Information Technology</p>
          <p className="mb-2 text-muted-foreground">GPA: 9.17/10 • Expected 2025</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-secondary px-2 py-1 rounded text-secondary-foreground text-sm">
              Software Architecture
            </span>
            <span className="bg-secondary px-2 py-1 rounded text-secondary-foreground text-sm">
              Software Testing
            </span>
            <span className="bg-secondary px-2 py-1 rounded text-secondary-foreground text-sm">
              Algorithms
            </span>
            <span className="bg-secondary px-2 py-1 rounded text-secondary-foreground text-sm">
              Java
            </span>
            <span className="bg-secondary px-2 py-1 rounded text-secondary-foreground text-sm">
              IELTS 6.5
            </span>
          </div>
          <p className="text-muted-foreground">HCMC, Vietnam</p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mx-auto px-4 py-16 container">
        <h3 className="mb-8 font-bold text-3xl">Technical Skills</h3>
        <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="hover:shadow-md p-4 sm:p-6 border border-border rounded-lg transition-shadow duration-300">
            <h4 className="mb-2 font-semibold text-lg sm:text-xl">Frontend</h4>
            <p className="text-muted-foreground text-sm sm:text-base">
              React, Next.js, Vue.js, TailwindCSS
            </p>
          </div>
          <div className="hover:shadow-md p-4 sm:p-6 border border-border rounded-lg transition-shadow duration-300">
            <h4 className="mb-2 font-semibold text-lg sm:text-xl">Backend</h4>
            <p className="text-muted-foreground text-sm sm:text-base">
              NestJS, FastAPI, Golang, Python, Java
            </p>
          </div>
          <div className="hover:shadow-md p-4 sm:p-6 border border-border rounded-lg transition-shadow duration-300">
            <h4 className="mb-2 font-semibold text-lg sm:text-xl">Cloud & DevOps</h4>
            <p className="text-muted-foreground text-sm sm:text-base">
              Docker, CI/CD, GitHub Actions, GitLab
            </p>
          </div>
          <div className="hover:shadow-md p-4 sm:p-6 border border-border rounded-lg transition-shadow duration-300">
            <h4 className="mb-2 font-semibold text-lg sm:text-xl">Developer Tools</h4>
            <p className="text-muted-foreground text-sm sm:text-base">
              Git, GitHub, GitLab, Webpack, Postman
            </p>
          </div>
        </div>
      </section>

      {/* Glassmorphism Dock Navigation */}
      <Navbar />
    </main>
  );
}
