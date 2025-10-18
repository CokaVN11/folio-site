'use client';

import type { ProjectData } from '@/data/generateProjects';

interface ProjectsSectionProps {
  projects: ProjectData[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="mx-auto w-full" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="mb-8 font-bold text-3xl">
        Featured Projects
      </h2>
      <p className="mb-12 max-w-4xl text-muted-foreground text-xl">
        A selection of projects I&apos;ve worked on, demonstrating technical skills and delivery
        discipline.
      </p>

      {projects.length > 0 ? (
        <div className="gap-8 grid max-w-4xl">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group hover:shadow-md p-6 border hover:border-primary border-border rounded-lg transition-all duration-300"
            >
              {/* Project Header with Cover Image */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {project.cover && (
                      <img
                        src={project.cover}
                        alt={`${project.title} cover`}
                        className="rounded-md w-12 h-12 object-cover"
                      />
                    )}
                    <h3 className="font-semibold group-hover:text-primary text-2xl transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Project Date */}
                  {project.date && (
                    <p className="mb-2 text-muted-foreground text-sm">
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  )}
                </div>

                {project.featured && (
                  <span className="bg-primary/10 px-2 py-1 rounded font-medium text-primary text-xs">
                    Featured
                  </span>
                )}
              </div>

              {/* Project Description */}
              <p className="mb-4 text-muted-foreground">{project.description}</p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted px-2 py-1 rounded font-medium text-muted-foreground text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-secondary px-3 py-1 rounded-md text-secondary-foreground text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Role and Links */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Project Role/Contribution */}
                  {project.contribution && (
                    <p className="mb-2 text-muted-foreground text-sm">
                      <span className="font-semibold">Role:</span> {project.contribution}
                    </p>
                  )}

                  {/* Project Summary if available */}
                  {project.summary && project.summary !== project.description && (
                    <p className="text-muted-foreground text-sm">{project.summary}</p>
                  )}
                </div>

                {/* Project Links */}
                <div className="flex gap-3 ml-4">
                  {project.href && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-primary/80 text-sm whitespace-nowrap transition-colors"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.slug && (
                    <a
                      href={project.href || `/project/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-primary/80 text-sm whitespace-nowrap transition-colors"
                    >
                      Details →
                    </a>
                  )}
                </div>
              </div>
            </article>
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
