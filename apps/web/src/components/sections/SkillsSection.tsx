'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import {
  Database,
  Cloud,
  Code2,
  Palette,
  Terminal,
  Brackets,
  Server,
  Cpu,
  HardDrive,
  Smartphone,
  Globe,
  Lock,
  Zap,
  Package,
  Layers,
  Workflow,
  Sparkles,
  Command,
  FileCode,
  Icon,
} from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedGradientText } from '../ui/animated-gradient-text';
import { Separator } from '@radix-ui/react-separator';

// TODO(human): Add beautiful spring animations and interactive hover effects

const technologies = [
  { name: 'React', icon: Icons.react, color: 'text-cyan-500' },
  { name: 'TypeScript', icon: Icons.typescript, color: 'text-blue-500' },
  { name: 'Next.js', icon: Icons.nextjs, color: 'text-gray-800 dark:text-white' },
  { name: 'Tailwind CSS', icon: Icons.tailwindcss, color: 'text-cyan-400' },
  // { name: 'PostgreSQL', icon: Icons.postgresql, color: 'text-blue-600' },
  // { name: 'MongoDB', icon: Icons.mongodb, color: 'text-green-500' },
  // { name: 'Docker', icon: Icons.docker, color: 'text-blue-500' },
  // { name: 'AWS', icon: Icons.aws, color: 'text-orange-500' },
  // { name: 'Git', icon: Icons.git, color: 'text-red-500' },
  // { name: 'Python', icon: Icons.python, color: 'text-blue-400' },
  // { name: 'JavaScript', icon: Icons.javascript, color: 'text-yellow-500' },
  // { name: 'HTML5', icon: Icons.html5, color: 'text-orange-600' },
  // { name: 'CSS3', icon: Icons.css3, color: 'text-blue-500' },
  // { name: 'VS Code', icon: Icons.vscode, color: 'text-blue-600' },
  // { name: 'Figma', icon: Icons.figma, color: 'text-purple-500' },
  // { name: 'Linux', icon: Linux, color: 'text-gray-700 dark:text-gray-300' },
  // { name: 'REST API', icon: Icons.api, color: 'text-green-500' },
  { name: 'Database', icon: Database, color: 'text-indigo-500' },
  { name: 'Cloud', icon: Cloud, color: 'text-sky-500' },
  { name: 'Web Development', icon: Code2, color: 'text-pink-500' },
  { name: 'UI/UX Design', icon: Palette, color: 'text-purple-600' },
  { name: 'Terminal', icon: Terminal, color: 'text-gray-600 dark:text-gray-400' },
  { name: 'Frontend', icon: Brackets, color: 'text-blue-500' },
  { name: 'Backend', icon: Server, color: 'text-green-600' },
  { name: 'Performance', icon: Cpu, color: 'text-red-600' },
  { name: 'Storage', icon: HardDrive, color: 'text-gray-500' },
  { name: 'Mobile', icon: Smartphone, color: 'text-indigo-600' },
  { name: 'Web3', icon: Globe, color: 'text-teal-500' },
  { name: 'Security', icon: Lock, color: 'text-red-500' },
  { name: 'Optimization', icon: Zap, color: 'text-yellow-400' },
  { name: 'Package Manager', icon: Package, color: 'text-cyan-600' },
  { name: 'Architecture', icon: Layers, color: 'text-purple-500' },
  { name: 'DevOps', icon: Workflow, color: 'text-orange-600' },
  { name: 'Animation', icon: Sparkles, color: 'text-yellow-500' },
  { name: 'CLI', icon: Command, color: 'text-gray-700 dark:text-gray-300' },
  { name: 'Full Stack', icon: FileCode, color: 'text-blue-600' },
];

const firstRow = technologies.slice(0, technologies.length / 2);
const secondRow = technologies.slice(technologies.length / 2);

const SkillCard = ({
  iconComponent,
  name,
  color,
}: {
  iconComponent: React.ComponentType<{ className?: string; size?: number }>;
  name: string;
  color: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.figure
      className={cn(
        'relative w-28 sm:w-32 cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 py-2 px-3',
        // Enhanced contrast for both light and dark modes
        'border-gray-300/50 bg-white/90 backdrop-blur-xs shadow-sm',
        'dark:border-gray-600/60 dark:bg-gray-800/95 dark:shadow-lg',
        // Improved hover states with better contrast
        'hover:border-blue-500/50 hover:bg-blue-50/40 hover:shadow-md',
        'dark:hover:border-blue-400/60 dark:hover:bg-blue-900/40 dark:shadow-xl',
        // Focus styles for accessibility
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-background'
      )}
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        boxShadow:
          '0 4px 12px -2px rgba(59, 130, 246, 0.15), 0 2px 4px -1px rgba(59, 130, 246, 0.1)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Skill: ${name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsHovered(!isHovered);
        }
      }}
    >
      {/* Minimalist indicator line */}
      <motion.div
        className="top-0 right-0 left-0 absolute bg-gradient-to-r from-transparent via-blue-400/50 to-transparent h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Horizontal layout */}
      <div className="relative flex items-center gap-2">
        {/* Icon with subtle animation */}
        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
            opacity: isHovered ? 1 : 0.85,
          }}
          transition={{
            scale: { type: 'spring', stiffness: 500, damping: 20 },
            opacity: { duration: 0.15 },
          }}
        >
          {React.createElement(iconComponent, {
            className: cn('h-5 w-5 transition-colors duration-200', color),
            size: 20,
          })}
        </motion.div>

        {/* Clean typography */}
        <figcaption className="font-medium text-gray-700 dark:text-gray-200 text-xs truncate leading-tight">
          {name}
        </figcaption>
      </div>
    </motion.figure>
  );
};

export function SkillsSection({
  blurFadeDelay,
  skills,
}: {
  blurFadeDelay: number;
  skills: string[];
}) {
  return (
    <section
      id="skills"
      className="relative mx-auto mt-4 w-full overflow-hidden container"
      aria-labelledby="skills-heading"
    >
      <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <BlurFade delay={blurFadeDelay * 3}>
          <motion.div
            className="mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: blurFadeDelay * 0.1,
            }}
          >
            <AnimatedGradientText
              speed={1}
              colorFrom="#0070F3"
              colorTo="#38bdf8"
              className="font-bold text-3xl sm:text-4xl lg:text-5xl"
            >
              Technologies & Skills
            </AnimatedGradientText>
            <motion.p
              className="mx-auto max-w-xl text-gray-600 dark:text-gray-300 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: blurFadeDelay * 0.2 }}
            >
              Crafting digital experiences with modern tools and technologies
            </motion.p>
          </motion.div>
        </BlurFade>

        <div className="relative flex flex-col justify-center items-center backdrop-blur-sm rounded-2xl w-full overflow-hidden">
          {/* Enhanced gradient fade edges */}
          <div className="left-0 z-20 absolute inset-y-0 bg-gradient-to-r from-background via-background/70 to-transparent w-2 sm:w-4 pointer-events-none"></div>
          <div className="right-0 z-20 absolute inset-y-0 bg-gradient-to-l from-background via-background/70 to-transparent w-2 sm:w-4 pointer-events-none"></div>

          <motion.div
            className="z-10 relative w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: blurFadeDelay * 0.3 }}
          >
            <div className="overflow-hidden">
              <Marquee pauseOnHover className="[--duration:25s] [--gap:0.75rem]" reverse={false}>
                {firstRow.map((tech, index) => (
                  <motion.div
                    key={`first-${tech.name}-${index}`}
                    className="mx-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: blurFadeDelay * 0.4 + index * 0.02 }}
                  >
                    <SkillCard
                      iconComponent={
                        typeof tech.icon === 'function'
                          ? (props: { className?: string; size?: number }) => {
                              const Icon = tech.icon as React.ComponentType<any>;
                              return <Icon {...props} size={20} />;
                            }
                          : tech.icon
                      }
                      name={tech.name}
                      color={tech.color}
                    />
                  </motion.div>
                ))}
              </Marquee>
            </div>

            <div className="mt-1 sm:mt-2 overflow-hidden">
              <Marquee pauseOnHover className="[--duration:30s] [--gap:0.75rem]" reverse={true}>
                {secondRow.map((tech, index) => (
                  <motion.div
                    key={`second-${tech.name}-${index}`}
                    className="mx-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: blurFadeDelay * 0.5 + index * 0.02 }}
                  >
                    <SkillCard
                      iconComponent={
                        typeof tech.icon === 'function'
                          ? (props: { className?: string; size?: number }) => {
                              const Icon = tech.icon as React.ComponentType<any>;
                              return <Icon {...props} size={20} />;
                            }
                          : tech.icon
                      }
                      name={tech.name}
                      color={tech.color}
                    />
                  </motion.div>
                ))}
              </Marquee>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
