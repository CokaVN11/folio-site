import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto px-4 py-4 container">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Portfolio</h1>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/projects" className="hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto px-4 py-20 container">
        <div className="max-w-4xl">
          <h2 className="mb-6 font-bold text-5xl">
            Hi, I&apos;m <span className="text-primary">Your Name</span>
          </h2>
          <p className="mb-8 text-muted-foreground text-xl">
            Full-stack developer specializing in modern web applications with serverless
            architectures. I build fast, scalable, and user-friendly solutions.
          </p>
          <div className="flex gap-4">
            <Link
              href="/contact"
              className="bg-primary hover:opacity-90 px-6 py-3 rounded-md text-primary-foreground transition-opacity"
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="hover:bg-accent px-6 py-3 border border-border rounded-md transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mx-auto px-4 py-16 container">
        <h3 className="mb-8 font-bold text-3xl">Core Skills</h3>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 border border-border rounded-lg">
            <h4 className="mb-2 font-semibold text-xl">Frontend</h4>
            <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h4 className="mb-2 font-semibold text-xl">Backend</h4>
            <p className="text-muted-foreground">AWS Lambda, API Gateway, DynamoDB</p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h4 className="mb-2 font-semibold text-xl">DevOps</h4>
            <p className="text-muted-foreground">Terraform, GitHub Actions, CI/CD</p>
          </div>
        </div>
      </section>
    </main>
  );
}
