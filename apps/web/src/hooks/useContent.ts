/**
 * React hooks for content management
 */

import { useState, useEffect, useCallback } from 'react';
import { contentApi, ApiResponse } from '../lib/api';

// Types for content data
export interface ContentIndex {
  section: string;
  entries: Array<{
    title: string;
    summary: string;
    cover: string;
    tags: string[];
    year: number;
    slug: string;
  }>;
  total: number;
  lastUpdated: string | null;
}

export interface ContentItem {
  section: string;
  slug: string;
  content: any; // Will be typed based on section
}

// Generic content list hook
export function useContentList(section: string, isAdmin = false) {
  const [data, setData] = useState<ContentIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = isAdmin
        ? await contentApi.list(section)
        : await contentApi.publicList(section);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch content');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [section, isAdmin]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchContent,
  };
}

// Generic content item hook
export function useContentItem(section: string, slug: string, isAdmin = false) {
  const [data, setData] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = isAdmin
        ? await contentApi.get(section, slug)
        : await contentApi.publicGet(section, slug);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch content');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [section, slug, isAdmin]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchContent,
  };
}

// Content creation hook
export function useCreateContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createContent = useCallback(async (section: string, slug: string, contentData: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await contentApi.create(section, slug, contentData);

      if (response.success) {
        setSuccess(response.message || 'Content created successfully');
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to create content');
        return { success: false };
      }
    } catch (err) {
      setError('Network error occurred');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createContent,
    isLoading,
    error,
    success,
    clearSuccess: () => setSuccess(null),
    clearError: () => setError(null),
  };
}

// Content update hook
export function useUpdateContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateContent = useCallback(async (section: string, slug: string, contentData: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await contentApi.update(section, slug, contentData);

      if (response.success) {
        setSuccess(response.message || 'Content updated successfully');
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to update content');
        return { success: false };
      }
    } catch (err) {
      setError('Network error occurred');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateContent,
    isLoading,
    error,
    success,
    clearSuccess: () => setSuccess(null),
    clearError: () => setError(null),
  };
}

// Content deletion hook
export function useDeleteContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const deleteContent = useCallback(async (section: string, slug: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await contentApi.delete(section, slug);

      if (response.success) {
        setSuccess('Content deleted successfully');
        return { success: true };
      } else {
        setError(response.error || 'Failed to delete content');
        return { success: false };
      }
    } catch (err) {
      setError('Network error occurred');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteContent,
    isLoading,
    error,
    success,
    clearSuccess: () => setSuccess(null),
    clearError: () => setError(null),
  };
}