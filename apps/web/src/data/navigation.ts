import { Home, Briefcase, User, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { Icons } from '@/components/ui/icons';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SocialItem {
  url: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  navbar: boolean;
}

export const navigationData = {
  navbar: [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '#projects',
      label: 'Projects',
      icon: Briefcase,
    },
    {
      href: '#experience',
      label: 'Experience',
      icon: User,
    },
    {
      href: '#contact',
      label: 'Contact',
      icon: Mail,
    },
  ] as NavItem[],

  social: {
    github: {
      url: 'https://github.com/CokaVN11',
      label: 'GitHub',
      icon: Icons.github,
      navbar: true,
    },
    linkedin: {
      url: 'https://linkedin.com/in/ngckhanh',
      label: 'LinkedIn',
      icon: Icons.linkedin,
      navbar: true,
    },
    email: {
      url: 'mailto:nguyenckhanh71@gmail.com',
      label: 'Email',
      icon: Icons.email,
      navbar: true,
    },
    website: {
      url: 'https://portfolio.coka.id.vn',
      label: 'Website',
      icon: ExternalLink,
      navbar: false,
    },
  } as Record<string, SocialItem>,
};
