export function EducationSection() {
  return (
    <section className="mx-auto px-4 py-16 container" aria-labelledby="education-heading">
      <h2 id="education-heading" className="mb-8 font-bold text-3xl">
        Education
      </h2>
      <div className="p-6 border border-border rounded-lg">
        <h3 className="mb-2 font-semibold text-primary text-xl">
          University of Science, VNUHCM (HCMUS)
        </h3>
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
  );
}
