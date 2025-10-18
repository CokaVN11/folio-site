'use client';

import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dock, DockIcon } from '@/components/ui/dock';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { navigationData } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';

export default function Navbar() {
  return (
    <div className="bottom-10 z-30 fixed inset-x-0 flex mx-auto mb-4 h-full max-h-14 origin-bottom">
      <div className="bottom-0 fixed inset-x-0 bg-background dark:bg-background to-transparent backdrop-blur-lg w-full h-16 [-webkit-mask-image:linear-gradient(to_top,black,transparent)]"></div>

      <Dock className="z-50 relative flex items-center bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] mx-auto px-1 h-full min-h-full transform-gpu pointer-events-auto dark:[border:1px_solid_rgba(255,255,255,.1)]">
        {/* Navigation Links */}
        {navigationData.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}

        {/* Separator */}
        <Separator orientation="vertical" className="py-2 h-full" />

        {/* Social Links */}
        {Object.entries(navigationData.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{social.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

        {/* Separator */}
        <Separator orientation="vertical" className="py-2 h-full" />

        {/* Theme Toggle */}
        <DockIcon>
          <AnimatedThemeToggler
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}
            aria-label="Toggle theme"
          />
        </DockIcon>
      </Dock>
    </div>
  );
}
