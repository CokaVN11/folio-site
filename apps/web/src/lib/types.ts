export type Meta = {
  title: string;
  date: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  role?: string;
  tech?: string[];
  featured?: boolean;
  draft?: boolean;
  location?: string;
  type?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
};

export type Entry = {
  slug: string;
  metadata: Meta;
  content: string;
};
