import { generateProjects } from './generateProjects';
import { generateJobs } from './generateJobs';

export const RESUME = {
  // Personal Information
  name: 'Khanh Nguyen',
  initials: 'KN',
  title: 'Full-Stack Developer',
  tagline: "I'm a full stack developer, learning new things everyday to build better products.",
  avatar: '/avatar.jpg',
  url: 'https://portfolio.coka.id.vn',
  location: 'Ho Chi Minh City, Vietnam',
  description:
    'Full-stack developer specializing in modern web applications with React, Next.js, Vue.js, and scalable backend systems',
  email: 'nguyenckhanh71@gmail.com',
  telephone: '+84868750030',
  summary:
    "I'm a full-stack developer in Ho Chi Minh City building modern web apps end-to-end (React/Next.js, Vue, NestJS, Golang) with scalable data stacks and CI/CD. Recently I've shipped an AI-powered video search engine and a multi-role space-rental platform, freelanced on blockchain campaign platforms and Vue.js game features with international team collaboration.",

  // Contact & Social
  contact: {
    email: 'nguyenckhanh71@gmail.com',
    tel: '+84868750030',
    social: {
      GitHub: {
        name: 'GitHub',
        url: 'https://github.com/CokaVN11',
        navbar: true,
      },
      LinkedIn: {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/ngckhanh',
        navbar: true,
      },
    },
  },

  // Skills
  skills: [
    'React',
    'Next.js',
    'Vue.js',
    'TypeScript',
    'TailwindCSS',
    'NestJS',
    'FastAPI',
    'Golang',
    'Python',
    'Java',
    'Docker',
    'CI/CD',
    'GitHub Actions',
    'GitLab',
    'DigitalOcean',
    'PostgreSQL',
    'MongoDB',
    'DynamoDB',
    'Jest',
    'ESLint',
    'Prettier',
  ],

  // Work Experience
  work: await generateJobs(),

  // Education
  education: [
    {
      school: 'University of Science, VNUHCM (HCMUS)',
      href: 'https://hcmus.edu.vn',
      degree: "Bachelor's Degree of Information Technology",
      logoUrl: 'https://en.hcmus.edu.vn/wp-content/uploads/2022/07/Logo-01.png', // Remote option
      startDate: '2021',
      endDate: '2025',
    },
  ],

  // Projects
  projects: await generateProjects(),
};

/**
 * Generate Schema.org structured data for SEO
 */
export const generatePersonSchema = (data: typeof RESUME) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    url: data.url,
    jobTitle: data.title,
    description: data.description,
    email: data.email,
    telephone: data.telephone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.location.includes(',')
        ? data.location.split(',')[0].trim()
        : data.location,
      addressCountry: 'Vietnam',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: data.education[0]?.school,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ho Chi Minh City',
        addressCountry: 'Vietnam',
      },
    },
    knowsAbout: data.skills,
    sameAs: [data.contact.social.GitHub.url, data.contact.social.LinkedIn.url],
  };
};
