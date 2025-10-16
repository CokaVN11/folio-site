'use client';

import { Computer, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/SettingsContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

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
