export type Meta = {
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  role?: string;
  tech?: string[];
  featured?: boolean;
  draft?: boolean;
  location?: string;
  type?: string;
};

export type Entry = {
  slug: string;
  metadata: Meta;
  content: string;
};
