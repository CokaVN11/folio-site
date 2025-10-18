'use client';

import { ResumeCard } from '@/components/ui/resume-card';
import { cn } from '@/lib/utils';
import React from 'react';

export interface EducationData {
  school: string;
  href: string;
  degree: string;
  startDate?: string;
  endDate?: string;
  logoUrl?: string;
}

interface EducationCardProps {
  education: EducationData;
  className?: string;
}

export const EducationCard = ({ education, className }: EducationCardProps) => {
  const { school, degree, startDate, endDate, href, logoUrl } = education;

  return (
    <ResumeCard
      logoUrl={logoUrl}
      altText={school}
      title={school}
      subtitle={degree}
      href={href}
      period={startDate && endDate ? `${startDate} - ${endDate}` : ''}
      className={cn('education-card', className)}
    />
  );
};
