import { MetadataRoute } from 'next';
import { getProject, getJobs } from '@/lib/content';
import { safeFormatDate } from '@/lib/utils/date';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectEntries, jobEntries] = await Promise.all([getProject(), getJobs()]);

  const baseUrl = 'https://portfolio.coka.id.vn';
  const currentDate = new Date();

  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/project`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/job`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...projectEntries.map((entry) => ({
      url: `${baseUrl}/project/${entry.slug}`,
      lastModified: new Date(safeFormatDate(entry.metadata.date)),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...jobEntries.map((entry) => ({
      url: `${baseUrl}/job/${entry.slug}`,
      lastModified: new Date(safeFormatDate(entry.metadata.date)),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return routes;
}