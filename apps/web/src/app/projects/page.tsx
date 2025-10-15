import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Portfolio',
  description: 'Portfolio of professional projects and case studies',
};

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    contribution: 'Lead Developer',
  },
  {
    id: 2,
    title: 'Real-Time Analytics Dashboard',
    description:
      'Data visualization platform processing millions of events daily with real-time updates.',
    tags: ['Next.js', 'AWS Lambda', 'DynamoDB', 'WebSocket'],
    contribution: 'Backend & Infrastructure',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description:
      'Modern portfolio website with serverless contact form and Infrastructure as Code deployment.',
    tags: ['Next.js', 'Lambda', 'Terraform', 'CI/CD'],
    contribution: 'Solo Project',
  },
];

export default function Projects() {
  return (
    <main className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto px-4 py-4 container">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-bold text-2xl">
              Portfolio
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/projects" className="font-semibold text-primary">
                Projects
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Projects Section */}
      <section className="mx-auto px-4 py-20 container">
        <h1 className="mb-4 font-bold text-4xl">Projects</h1>
        <p className="mb-12 text-muted-foreground text-xl">
          A selection of projects I&apos;ve worked on, demonstrating technical skills and delivery
          discipline.
        </p>

        <div className="gap-8 grid max-w-4xl">
          {projects.map((project) => (
            <article
              key={project.id}
              className="p-6 border hover:border-primary border-border rounded-lg transition-colors"
            >
              <h2 className="mb-3 font-semibold text-2xl">{project.title}</h2>
              <p className="mb-4 text-muted-foreground">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary px-3 py-1 rounded-md text-secondary-foreground text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">My Role:</span> {project.contribution}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
