import { AnimatedGradientText } from '../ui/animated-gradient-text';
import { BlurFade } from '../ui/blur-fade';

interface AboutSectionProps {
  blurFadeDelay: number;
  summary: string;
}

export function AboutSection({ blurFadeDelay, summary }: AboutSectionProps) {
  return (
    <section id="about" className="mx-auto w-full container" aria-labelledby="about-heading">
      <div className="mx-auto">
        <BlurFade delay={blurFadeDelay * 3}>
          <h2 id="about-heading">
            <AnimatedGradientText
              speed={1}
              colorFrom="#0070F3"
              colorTo="#38bdf8"
              className="font-bold text-3xl sm:text-4xl lg:text-5xl"
            >
              About Me
            </AnimatedGradientText>
          </h2>
        </BlurFade>

        <BlurFade delay={blurFadeDelay * 4}>
          <div className="dark:prose-invert max-w-none font-sans text-foreground text-base sm:text-lg text-justify text-pretty leading-relaxed prose prose-lg">
            <div className="backdrop-blur-sm">{summary}</div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
