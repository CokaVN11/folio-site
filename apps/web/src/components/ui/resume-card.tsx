'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronRightIcon, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AvatarFallback } from './avatar';

interface ResumeCardProps {
  logoUrl?: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  location?: string;
  description?: React.ReactNode;
  className?: string;
  isExpandable?: boolean;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  location,
  description,
  className,
  isExpandable = true,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description && isExpandable) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && description && isExpandable) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={cn('group', className)}
    >
      <Link
        href={href || '#'}
        className="block cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${title} - ${subtitle || ''} - ${period}`}
        aria-expanded={isExpanded}
      >
        <Card className="flex sm:flex-row flex-col transition-all duration-300">
          {/* Logo/Avatar */}
          <div className="flex-shrink-0 m-auto border rounded-full size-12">
            {logoUrl && !imageError ? (
              <Image
                src={logoUrl}
                alt={altText}
                width={48}
                height={48}
                className="bg-muted dark:bg-muted/50 rounded-full size-12 object-contain"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 48px, 64px"
                priority={false}
                loading="lazy"
              />
            ) : (
              <AvatarFallback className="bg-muted dark:bg-muted/50 rounded-full size-12 sm:size-16">
                {altText.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </div>

          <div className="group flex-col flex-grow items-center ml-4">
            <CardHeader>
              <div className="flex justify-between items-center gap-x-2 text-base">
                <h3 className="inline-flex justify-center items-center font-semibold text-xs sm:text-sm leading-none">
                  {title}
                  {badges && (
                    <span className="inline-flex gap-x-1">
                      {badges.map((badge, index) => (
                        <Badge variant="secondary" className="text-xs align-middle" key={index}>
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  )}
                  <ChevronRightIcon
                    className={cn(
                      'size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100',
                      isExpanded ? 'rotate-90' : 'rotate-0'
                    )}
                  />
                </h3>
                <div className="tabular-nums text-muted-foreground text-xs sm:text-sm text-right">
                  {period}
                </div>
              </div>
              {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
            </CardHeader>
            {description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,

                  height: isExpanded ? 'auto' : 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-2 text-xs sm:text-sm"
              >
                {description}
              </motion.div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
