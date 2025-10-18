interface SkillCategory {
  title: string;
  skills: string;
}

export function SkillsSection() {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend',
      skills: 'React, Next.js, Vue.js, TailwindCSS',
    },
    {
      title: 'Backend',
      skills: 'NestJS, FastAPI, Golang, Python, Java',
    },
    {
      title: 'Cloud & DevOps',
      skills: 'Docker, CI/CD, GitHub Actions, GitLab',
    },
    {
      title: 'Developer Tools',
      skills: 'Git, GitHub, GitLab, Webpack, Postman',
    },
  ];

  return (
    <section className="mx-auto px-4 py-16 container" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="mb-8 font-bold text-3xl">
        Technical Skills
      </h2>
      <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((category, index) => (
          <div
            key={category.title}
            className="hover:shadow-md p-4 sm:p-6 border border-border rounded-lg transition-shadow duration-300"
          >
            <h3 className="mb-2 font-semibold text-lg sm:text-xl">{category.title}</h3>
            <p className="text-muted-foreground text-sm sm:text-base">{category.skills}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
