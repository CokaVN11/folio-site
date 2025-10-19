'use client';

import type { ProjectData } from '@/data/generateProjects';
import { ProjectCard } from '@/components/ui/project-card';
import { Badge } from '@/components/ui/badge';
import { SparklesText } from '@/components/ui/sparkles-text';

interface ProjectsSectionProps {
  projects: ProjectData[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
      aria-labelledby="projects-heading"
    >
      <div className="flex flex-col justify-center items-center gap-2 mb-8 text-center">
        <Badge className="mx-auto max-w-fit">Featured Projects</Badge>
        <SparklesText className="font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter">
          Check out my latest work
        </SparklesText>
        <p className="text-muted-foreground lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
          I&apos;ve worked on a variety of projects, from simple websites to complex web
          applications. Here are a few of my favorites.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="justify-center sm:justify-normal gap-6 grid grid-cols-1 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              href={project.href}
              description={project.description}
              dates={`${new Date(project.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })} - ${new Date(project.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}`}
              tags={project.tags}
              image={project.cover}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-muted-foreground">Projects will appear here once added.</p>
        </div>
      )}
    </section>
  );
}
