'use client';

import Link from 'next/link';
import BlurFadeText from '../ui/blur-fade-text';
import { BlurFade } from '../ui/blur-fade';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface HeroSectionProps {
  blurFadeDelay: number;
}

export function HeroSection({ blurFadeDelay }: HeroSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8 mx-auto px-4 w-full container">
      <div className="flex sm:flex-row flex-col justify-between items-center gap-4 sm:gap-6">
        <div className="flex flex-col flex-1 space-y-2 sm:space-y-1.5 sm:text-left text-center">
          <BlurFadeText
            delay={blurFadeDelay}
            className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight tracking-tighter"
            yOffset={8}
            text={`Hi, I'm Khanh Nguyen 🥤`}
          />
          <BlurFadeText
            delay={blurFadeDelay + 0.05}
            className="max-w-none sm:max-w-md lg:max-w-lg xl:max-w-xl text-sm sm:text-base lg:text-lg"
            text={`I'm a full stack developer, learning new things everyday to build better products.`}
          />
        </div>
        <BlurFade delay={blurFadeDelay + 0.1}>
          <Avatar className="border size-20 sm:size-24 lg:size-28 xl:size-32">
            <AvatarImage alt="Khanh Nguyen" src="/avatar.jpg" className="object-cover" />
            <AvatarFallback>KN</AvatarFallback>
          </Avatar>
        </BlurFade>
      </div>
    </div>
  );
}
