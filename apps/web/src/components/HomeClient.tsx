'use client';

import Link from 'next/link';
import { useAdminAuth } from '../contexts/AuthContext';
import { LogoutButton } from '../components/auth/LogoutButton';
import { ThemeToggle } from '../components/ThemeToggle';

interface HomeClientProps {
  className?: string;
}

export function HomeClient({ className = '' }: HomeClientProps) {
  const { isAuthenticated, isAdmin } = useAdminAuth();

  return (
    <main className={`min-h-screen bg-background ${className}`}>
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Portfolio</h1>

            <div className="flex items-center gap-6">
              {/* Navigation Links */}
              <div className="flex gap-6">
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/projects" className="transition-colors hover:text-primary">
                  Projects
                </Link>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Links */}
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="px-3 py-1 text-sm transition-colors rounded bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Admin
                      </Link>
                    )}
                    <LogoutButton variant="text" />
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="px-3 py-1 text-sm transition-colors border rounded border-border hover:bg-accent"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto">
        <div className="max-w-4xl">
          <h2 className="mb-6 text-5xl font-bold">
            Hi, I&apos;m <span className="text-primary">Coka</span>
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Full-stack developer specializing in modern web applications with serverless
            architectures. I build fast, scalable, and user-friendly solutions.
          </p>
          <div className="flex gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 transition-opacity rounded-md bg-primary hover:opacity-90 text-primary-foreground"
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 transition-colors border rounded-md hover:bg-accent border-border"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container px-4 py-16 mx-auto">
        <h3 className="mb-8 text-3xl font-bold">Core Skills</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 border rounded-lg border-border">
            <h4 className="mb-2 text-xl font-semibold">Frontend</h4>
            <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
          </div>
          <div className="p-6 border rounded-lg border-border">
            <h4 className="mb-2 text-xl font-semibold">Backend</h4>
            <p className="text-muted-foreground">AWS Lambda, API Gateway, DynamoDB</p>
          </div>
          <div className="p-6 border rounded-lg border-border">
            <h4 className="mb-2 text-xl font-semibold">DevOps</h4>
            <p className="text-muted-foreground">Terraform, GitHub Actions, CI/CD</p>
          </div>
        </div>
      </section>
    </main>
  );
}
