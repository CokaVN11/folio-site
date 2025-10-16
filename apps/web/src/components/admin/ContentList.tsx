'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, ChevronDown } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { useContentList } from '../../hooks/useContent';

interface ContentListProps {
  section: 'experience' | 'projects' | 'education';
  onCreateNew?: () => void;
  onEdit?: (slug: string) => void;
  onView?: (slug: string) => void;
}

export function ContentList({
  section,
  onCreateNew,
  onEdit,
  onView
}: ContentListProps) {
  const { data, isLoading, error, refetch } = useContentList(section, true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'recent'>('recent');
  const [filterTag, setFilterTag] = useState('');

  // Extract all available tags for filtering
  const availableTags = useMemo(() => {
    if (!data?.entries) return [];

    const allTags = data.entries.flatMap(item => item.tags || []);
    return Array.from(new Set(allTags)).sort();
  }, [data]);

  // Filter and sort content
  const filteredAndSortedContent = useMemo(() => {
    if (!data?.entries) return [];

    let filtered = data.entries.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = filterTag === '' || item.tags?.includes(filterTag);

      return matchesSearch && matchesTag;
    });

    // Sort content
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return b.year - a.year; // Default to year sort
      }
    });

    return filtered;
  }, [data, searchTerm, filterTag, sortBy]);

  const handleEdit = (slug: string) => {
    if (onEdit) {
      onEdit(slug);
    }
  };

  const handleView = (slug: string) => {
    if (onView) {
      onView(slug);
    }
  };

  const handleDelete = (slug: string) => {
    // Refresh the list after deletion
    refetch();
  };

  const formatSectionName = (section: string) => {
    switch (section) {
      case 'experience':
        return 'Experience';
      case 'projects':
        return 'Projects';
      case 'education':
        return 'Education';
      default:
        return section;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-muted-foreground">Loading {formatSectionName(section)}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">Failed to load content</p>
        <button
          onClick={refetch}
          className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {formatSectionName(section)}
          </h2>
          {data && (
            <p className="text-muted-foreground">
              {data.total} {data.total === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New {formatSectionName(section).slice(0, -1)}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="pl-10 pr-8 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        )}

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 pr-8 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
          >
            <option value="recent">Recently Added</option>
            <option value="year">Year (Newest First)</option>
            <option value="title">Title (A-Z)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedContent.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterTag ? 'No matching content found' : 'No content yet'}
          </p>
          {(searchTerm || filterTag) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTag('');
              }}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedContent.map((item) => (
            <ContentCard
              key={item.slug}
              item={item}
              section={section}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onEditComplete={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}