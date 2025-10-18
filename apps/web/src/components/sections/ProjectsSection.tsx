import type { Entry } from '@/lib/types';

interface StaticProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  contribution: string;
}

interface ProjectsSectionProps {
  projects: Entry[] | StaticProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="mx-auto px-4 py-16 container"
      aria-labelledby="projects-heading"
    >
      <h2 id="projects-heading" className="mb-8 font-bold text-3xl">
        Featured Projects
      </h2>
      <p className="mb-12 text-muted-foreground text-xl max-w-4xl">
        A selection of projects I&apos;ve worked on, demonstrating technical skills and delivery
        discipline.
      </p>

      <div className="gap-8 grid max-w-4xl">
        {projects.map((project) => {
          // Check if it's a static project or Entry
          const isStaticProject = 'id' in project;
          const title = isStaticProject ? project.title : project.metadata.title;
          const description = isStaticProject ? project.description : project.metadata.summary;
          const tags = isStaticProject ? project.tags : project.metadata.tech || [];
          const contribution = isStaticProject
            ? project.contribution
            : project.metadata.role || 'Contributor';
          const key = isStaticProject ? project.id : project.slug;

          return (
            <article
              key={key}
              className="p-6 border hover:border-primary border-border rounded-lg transition-colors"
            >
              <h3 className="mb-3 font-semibold text-2xl">{title}</h3>
              <p className="mb-4 text-muted-foreground">{description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-secondary px-3 py-1 rounded-md text-secondary-foreground text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">My Role:</span> {contribution}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
