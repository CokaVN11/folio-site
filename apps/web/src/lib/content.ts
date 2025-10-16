import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Entry, Meta } from './types';

const contentDirectory = path.join(process.cwd(), 'src', 'content');

async function readMDXFile(filePath: string): Promise<Entry> {
  const fileContents = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const slug = path.basename(filePath, '.mdx');
  const metadata = data as Meta;

  return {
    slug,
    metadata,
    content,
  };
}

export async function getProject(): Promise<Entry[]> {
  const projectDirectory = path.join(contentDirectory, 'project');

  try {
    const fileNames = await fs.readdir(projectDirectory);
    const mdxFiles = fileNames.filter((name) => name.endsWith('.mdx'));

    const entries = await Promise.all(
      mdxFiles.map((file) => readMDXFile(path.join(projectDirectory, file)))
    );

    // Filter out drafts and sort by date descending
    return entries
      .filter((entry) => !entry.metadata.draft)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  } catch (error) {
    console.error('Error reading project content:', error);
    return [];
  }
}

export async function getJobs(): Promise<Entry[]> {
  const jobDirectory = path.join(contentDirectory, 'job');

  try {
    const fileNames = await fs.readdir(jobDirectory);
    const mdxFiles = fileNames.filter((name) => name.endsWith('.mdx'));

    const entries = await Promise.all(
      mdxFiles.map((file) => readMDXFile(path.join(jobDirectory, file)))
    );

    // Filter out drafts and sort by date descending
    return entries
      .filter((entry) => !entry.metadata.draft)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  } catch (error) {
    console.error('Error reading job content:', error);
    return [];
  }
}

export async function getProjectEntry(slug: string): Promise<Entry | null> {
  try {
    const filePath = path.join(contentDirectory, 'project', `${slug}.mdx`);
    const entry = await readMDXFile(filePath);

    // Don't return draft entries
    if (entry.metadata.draft) {
      return null;
    }

    return entry;
  } catch (error) {
    console.error(`Error reading project entry ${slug}:`, error);
    return null;
  }
}

export async function getJobEntry(slug: string): Promise<Entry | null> {
  try {
    const filePath = path.join(contentDirectory, 'job', `${slug}.mdx`);
    const entry = await readMDXFile(filePath);

    // Don't return draft entries
    if (entry.metadata.draft) {
      return null;
    }

    return entry;
  } catch (error) {
    console.error(`Error reading job entry ${slug}:`, error);
    return null;
  }
}
