'use client';

import BlurFadeText from '../ui/blur-fade-text';
import { BlurFade } from '../ui/blur-fade';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { TypingAnimation } from '../ui/typing-animation';

interface HeroSectionProps {
  personalInfo: {
    name: string;
    tagline: string;
    avatar: string;
  };
  blurFadeDelay: number;
}

export function HeroSection({ personalInfo, blurFadeDelay }: HeroSectionProps) {
  // Extract initials for avatar fallback
  const initials = personalInfo.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <section id="hero" className="mx-auto w-full container">
      <div className="space-y-6 sm:space-y-8 w-full">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col flex-1 space-y-2 sm:space-y-1.5 sm:text-left text-center">
            <TypingAnimation
              delay={blurFadeDelay}
              pauseDelay={5000}
              loop
              blinkCursor
              startOnView
              className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight tracking-tighter"
              words={[`Hi, I'm ${personalInfo.name} 🥤`]}
            />
            <BlurFadeText
              delay={blurFadeDelay + 0.05}
              className="max-w-none sm:max-w-md lg:max-w-lg text-sm sm:text-base lg:text-lg"
              text={personalInfo.tagline}
            />
          </div>
          <BlurFade delay={blurFadeDelay + 0.1}>
            <Avatar className="border size-20 sm:size-24 lg:size-28 xl:size-32">
              <AvatarImage
                alt={personalInfo.name}
                src={personalInfo.avatar}
                className="object-cover"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
