import Navbar from '@/components/Navbar';
import {
  HeroSection,
  AboutSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
} from '@/components/sections';
import { BlurFade } from '@/components/ui/blur-fade';
import { RESUME, generatePersonSchema } from '@/data/resume';
import { Separator } from '@radix-ui/react-separator';

const BLUR_FADE_DELAY = 0.04;
export default async function Home() {
  const personSchema = generatePersonSchema(RESUME);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <main className="space-y-10 bg-background mx-auto px-4 md:px-2 py-6 sm:py-8 lg:py-10 max-w-2xl min-h-[100dvh] container">
        {/* Hero Section */}
        <HeroSection
          blurFadeDelay={BLUR_FADE_DELAY}
          personalInfo={{
            name: RESUME.name,
            tagline: RESUME.tagline,
            avatar: RESUME.avatar,
          }}
        />
        <AboutSection blurFadeDelay={BLUR_FADE_DELAY} summary={RESUME.summary} />

        <Separator className="bg-gradient-to-r from-transparent via-[#0070F3] to-transparent w-full h-1" />

        {/* Projects Section */}
        <BlurFade delay={BLUR_FADE_DELAY * 7} inView={true} direction="down">
          <ProjectsSection projects={RESUME.projects} />
        </BlurFade>

        <Separator className="bg-gradient-to-r from-transparent via-[#0070F3] to-transparent w-full h-1" />

        {/* Experience Section */}
        <BlurFade delay={BLUR_FADE_DELAY * 8} inView={true} direction="down">
          <ExperienceSection work={RESUME.work} />
        </BlurFade>

        <Separator className="bg-gradient-to-r from-transparent via-[#0070F3] to-transparent w-full h-1" />

        {/* Education Section */}
        <BlurFade delay={BLUR_FADE_DELAY * 5} inView={true} direction="down">
          <EducationSection education={RESUME.education} />
        </BlurFade>

        <Separator className="bg-gradient-to-r from-transparent via-[#0070F3] to-transparent w-full h-1" />
        {/* Skills Section */}
        <BlurFade delay={BLUR_FADE_DELAY * 6} inView={true} direction="down">
          <SkillsSection blurFadeDelay={BLUR_FADE_DELAY * 6} skills={RESUME.skills} />
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 16} inView={true} direction="up">
          {/* Contact Section */}
          <ContactSection />
        </BlurFade>
        {/* Dock Navigation */}
        <Navbar />
      </main>
    </>
  );
}
