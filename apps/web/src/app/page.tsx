import { HomeClient } from '../components/HomeClient';

export default function Home() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Khanh Nguyen',
    url: 'https://portfolio.coka.id.vn',
    jobTitle: 'Full-Stack Developer',
    description:
      'Full-stack developer specializing in modern web applications with React, Next.js, Vue.js, and scalable backend systems',
    email: 'nguyenckhanh71@gmail.com',
    telephone: '+84868750030',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'Vietnam',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of Science, VNUHCM (HCMUS)',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ho Chi Minh City',
        addressCountry: 'Vietnam',
      },
    },
    knowsAbout: [
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
    ],
    sameAs: ['https://github.com/CokaVN11', 'https://linkedin.com/in/ngckhanh'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <HomeClient />
    </>
  );
}
