'use client';

import { useState } from 'react';
import { Edit2, Trash2, Eye, ExternalLink, Calendar } from 'lucide-react';
import { useUpdateContent, useDeleteContent } from '../../hooks/useContent';

interface ContentCardProps {
  item: {
    title: string;
    summary: string;
    cover: string;
    tags: string[];
    year: number;
    slug: string;
  };
  section: 'experience' | 'projects' | 'education';
  onView?: (slug: string) => void;
  onEdit?: (slug: string) => void;
  onDelete?: (slug: string) => void;
  onEditComplete?: () => void;
}

export function ContentCard({
  item,
  section,
  onView,
  onEdit,
  onDelete,
  onEditComplete
}: ContentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item.slug);
    }
  };

  const handleDelete = async () => {
    const result = await deleteContent.deleteContent(section, item.slug);

    if (result.success) {
      setShowDeleteConfirm(false);
      if (onDelete) {
        onDelete(item.slug);
      }
    }
  };

  const handleView = () => {
    if (onView) {
      onView(item.slug);
    } else {
      // Open in new tab for public view
      window.open(`/projects/${item.slug}`, '_blank');
    }
  };

  const formatSectionName = (section: string) => {
    switch (section) {
      case 'experience':
        return 'Experience';
      case 'projects':
        return 'Project';
      case 'education':
        return 'Education';
      default:
        return section;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'experience':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'projects':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'education':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSectionColor(section)}`}>
                {formatSectionName(section)}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{item.year}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {item.summary}
            </p>
          </div>

          {/* Cover Image */}
          {item.cover && (
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover rounded-md border border-border"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                +{item.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleView}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
              title="View content"
            >
              <Eye className="w-4 h-4" />
              View
            </button>

            <a
              href={`/projects/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
              title="Edit content"
              disabled={updateContent.isLoading}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-destructive/20 text-destructive hover:bg-destruct/10 rounded-md transition-colors"
              title="Delete content"
              disabled={deleteContent.isLoading}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(updateContent.isLoading || deleteContent.isLoading) && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center p-6">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete {formatSectionName(section)}?
            </h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete "{item.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-2 border border-destructive/20 text-destructive hover:bg-destruct/10 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {updateContent.success && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center p-6">
          <div className="bg-card border border-green-500/20 text-green-700 dark:text-green-300 rounded-lg p-4 max-w-sm w-full">
            <p className="text-sm">{updateContent.success}</p>
          </div>
        </div>
      )}

      {deleteContent.success && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center p-6">
          <div className="bg-card border border-green-500/20 text-green-700 dark:text-green-300 rounded-lg p-4 max-w-sm w-full">
            <p className="text-sm">{deleteContent.success}</p>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(updateContent.error || deleteContent.error) && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center p-6">
          <div className="bg-card border border-destructive/20 text-destructive rounded-lg p-4 max-w-sm w-full">
            <p className="text-sm">
              {updateContent.error || deleteContent.error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}