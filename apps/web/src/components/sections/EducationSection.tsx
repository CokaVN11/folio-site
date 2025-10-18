'use client';

import { EducationCard, type EducationData } from '@/components/ui/education-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { School2 } from 'lucide-react';
import { AnimatedGradientText } from '../ui/animated-gradient-text';

interface EducationSectionProps {
  education: EducationData[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section className="w-full" aria-labelledby="education-heading">
      <div className="mx-auto">
        <div className="flex flex-col gap-y-4 sm:gap-y-6 min-h-0">
          <BlurFade delay={0.1} inView>
            <div>
              <AnimatedGradientText
                speed={1}
                colorFrom="#0070F3"
                colorTo="#38bdf8"
                className="font-bold text-3xl sm:text-4xl lg:text-5xl"
              >
                Education
              </AnimatedGradientText>
              {/* <Separator className="bg-gradient-to-r from-blue-400 to-purple-400 h-1"></Separator> */}
            </div>
          </BlurFade>

          {education.length > 0 ? (
            <div className="flex flex-col gap-y-6 sm:gap-y-8">
              {education.map((edu, index) => (
                <BlurFade key={edu.school} delay={0.3 + index * 0.1} inView>
                  <div className="hover:scale-[1.02] transition-all duration-300 transform">
                    <EducationCard education={edu} className="w-full" />
                  </div>
                </BlurFade>
              ))}
            </div>
          ) : (
            <BlurFade delay={0.3} inView>
              <div className="py-12 sm:py-16 text-center">
                <div className="mx-auto max-w-sm sm:max-w-md">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                      <School2 className="w-6 sm:w-8 h-6 sm:h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">
                    Education Information Coming Soon
                  </h3>
                  <p className="mx-auto max-w-xs text-muted-foreground text-sm sm:text-base">
                    Academic details and educational background will be displayed here.
                  </p>
                </div>
              </div>
            </BlurFade>
          )}
        </div>
      </div>
    </section>
  );
}
