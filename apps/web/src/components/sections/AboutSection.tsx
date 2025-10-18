import { AnimatedGradientText } from '../ui/animated-gradient-text';
import { BlurFade } from '../ui/blur-fade';

interface AboutSectionProps {
  blurFadeDelay: number;
  summary: string;
}

export function AboutSection({ blurFadeDelay, summary }: AboutSectionProps) {
  return (
    <section id="about" className="w-full" aria-labelledby="about-heading">
      <div className="mx-auto">
        <BlurFade delay={blurFadeDelay * 3}>
          <div>
            <AnimatedGradientText
              speed={1}
              colorFrom="#0070F3"
              colorTo="#38bdf8"
              className="font-bold text-3xl sm:text-4xl lg:text-5xl"
            >
              About Me
            </AnimatedGradientText>
          </div>
        </BlurFade>

        <BlurFade delay={blurFadeDelay * 4}>
          <div className="dark:prose-invert max-w-none font-sans text-gray-600 dark:text-gray-300 text-base sm:text-lg text-justify text-pretty leading-relaxed prose prose-lg">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">{summary}</div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
