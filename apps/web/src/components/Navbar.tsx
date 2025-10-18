'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dock, DockIcon } from '@/components/ui/dock';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { navigationData } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { Drawer } from 'vaul';

function MobileNavigationDrawer() {
  const secondaryNavItems = {
    experience: navigationData.navbar[3], // Experience
    social: Object.entries(navigationData.social)
      .filter(([_, social]) => social.navbar)
      .map(([name, social]) => ({ name, ...social })),
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-10 sm:size-11 rounded-full flex flex-col items-center justify-center gap-1'
          )}
          aria-label="Open menu"
        >
          <Menu className="size-4 sm:size-5" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="right-0 bottom-10 left-0 z-50 fixed flex flex-col bg-background mt-24 border-t border-border rounded-t-[10px] outline-none h-fit">
          <div className="flex-1 bg-card p-4 rounded-t-[10px]">
            <div
              aria-hidden
              className="flex-shrink-0 bg-muted mx-auto mb-4 rounded-full w-12 h-1.5"
            />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="font-medium text-foreground">Menu</Drawer.Title>
            </div>
          </div>
          <Separator />
          <div className="bg-card mt-auto">
            <div className="flex flex-col justify-end gap-2 mx-auto max-w-md">
              {secondaryNavItems.experience && (
                <Link
                  href={secondaryNavItems.experience.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start gap-3 h-12 px-4 text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <secondaryNavItems.experience.icon className="size-5" />
                  <span>{secondaryNavItems.experience.label}</span>
                </Link>
              )}
              {secondaryNavItems.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start gap-3 h-12 px-4 text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <social.icon className="size-5" />
                  <span>{social.label}</span>
                </Link>
              ))}

              <AnimatedThemeToggler
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'w-full justify-start gap-3 h-12 px-4 text-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                label
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default function Navbar() {
  // Primary navigation items for mobile bottom nav
  const primaryMobileNav = navigationData.navbar.slice(0, 3); // Home, Projects, Contact

  return (
    <>
      {/* Mobile Layout */}
      <div className="sm:hidden bottom-0 z-30 fixed inset-x-0 flex mx-auto mb-4 h-full max-h-14 origin-bottom">
        <div className="bottom-0 fixed inset-x-0 bg-background/80 dark:bg-background/80 backdrop-blur-lg w-full h-16"></div>

        <div className="z-50 relative flex justify-around items-center bg-background/90 dark:bg-background/90 shadow-lg mx-auto px-2 border border-border/20 rounded-full h-14 min-h-full transform-gpu pointer-events-auto">
          {/* Primary Mobile Navigation */}
          {primaryMobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'size-10 sm:size-11 rounded-full flex flex-col items-center justify-center gap-1'
              )}
            >
              <item.icon className="size-4 sm:size-5" />
            </Link>
          ))}

          <MobileNavigationDrawer />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden bottom-10 z-30 fixed inset-x-0 sm:flex mx-auto mb-4 h-full max-h-14 origin-bottom">
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
    </>
  );
}
