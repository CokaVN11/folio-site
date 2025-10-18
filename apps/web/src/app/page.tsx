'use client';
import { getJobs, getProject } from '@/lib/content';
import Navbar from '@/components/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Define a type for static projects
interface StaticProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  contribution: string;
}

const staticProjects: StaticProject[] = [
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

export default async function Home() {
  // Fetch dynamic data
  const [jobs, projects] = await Promise.all([getJobs(), getProject()]);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Khanh Nguyen',
    url: 'https://portfolio.coka.id.vn',
    jobTitle: 'Full-Stack Developer',
    description:
      'Full-stack developer specializing in modern web applications with React, Next.js, Vue.js, and scalable backend systems',
    email: 'nguyenckhanh71@gmail.com',
    telephone: '+84868750030',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'Vietnam',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of Science, VNUHCM (HCMUS)',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ho Chi Minh City',
        addressCountry: 'Vietnam',
      },
    },
    knowsAbout: [
      'React',
      'Next.js',
      'Vue.js',
      'TypeScript',
      'TailwindCSS',
      'NestJS',
      'FastAPI',
      'Golang',
      'Python',
      'Java',
      'Docker',
      'CI/CD',
      'GitHub Actions',
      'GitLab',
      'DigitalOcean',
      'PostgreSQL',
      'MongoDB',
    ],
    sameAs: ['https://github.com/CokaVN11', 'https://linkedin.com/in/ngckhanh'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <main className="bg-background min-h-screen">
        {/* Hero Section */}
        <HeroSection
          onContactClick={(e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Education Section */}
        <EducationSection />

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <ProjectsSection projects={projects.length > 0 ? projects : staticProjects} />

        {/* Experience Section */}
        <ExperienceSection jobs={jobs} />

        {/* Contact Section */}
        <ContactSection />

        {/* Dock Navigation */}
        <Navbar />
      </main>
    </>
  );
}
