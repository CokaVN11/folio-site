'use client';

import { Computer, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
}

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun />;
      case 'dark':
        return <Moon />;
      default:
        return <Computer />; // system
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      default:
        return 'System theme';
    }
  };

  if (!mounted) {
    return (
      <div className={`p-2 rounded-md ${className}`}>
        <Computer />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md hover:bg-accent transition-colors ${className}`}
      title={`Current: ${getThemeLabel()}. Click to cycle themes.`}
      aria-label={`Toggle theme (current: ${getThemeLabel()})`}
    >
      {getThemeIcon()}
    </button>
  );
}
