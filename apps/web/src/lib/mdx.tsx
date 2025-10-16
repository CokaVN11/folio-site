'use client';

import { useEffect, useState } from 'react';

interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [Component, setComponent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMDX = async () => {
      try {
        // Basic MDX rendering - for static export we'll render HTML
        // This is a simplified approach that works with static export
        const processedContent = content
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          .replace(/^\* (.*$)/gm, '<li>$1</li>')
          .replace(/^- (.*$)/gm, '<li>$1</li>')
          .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/^/, '<p>')
          .replace(/$/, '</p>')
          .replace(/<li><\/li>/g, '<ul><li></li></ul>')
          .replace(/<\/ul><ul>/g, '')
          .replace(
            /<blockquote>/g,
            '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">'
          )
          .replace(
            /<h1>/g,
            '<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">'
          )
          .replace(
            /<h2>/g,
            '<h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">'
          )
          .replace(
            /<h3>/g,
            '<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">'
          )
          .replace(/<p>/g, '<p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">')
          .replace(
            /<code>/g,
            '<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">'
          )
          .replace(
            /<a href/g,
            '<a className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline" href'
          );

        setComponent({ html: processedContent });
      } catch (err) {
        console.error('MDX rendering error:', err);
        setError('Failed to render content');
      }
    };

    loadMDX();
  }, [content]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!Component) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: Component.html }}
    />
  );
}
