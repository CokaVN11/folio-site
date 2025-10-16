'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: Theme;
  language: string;
  animations: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  setAnimations: (enabled: boolean) => void;
  effectiveTheme: 'light' | 'dark';
}

const SettingsContext = createContext<SettingsState | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'portfolio-settings';

const defaultSettings = {
  theme: 'system' as Theme,
  language: 'en',
  animations: true,
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettingsState] = useState(() => {
    // Prevent hydration mismatch by using default initial state
    return defaultSettings;
  });

  const [mounted, setMounted] = useState(false);

  // Calculate effective theme based on system preference
  const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') {
      if (typeof window === 'undefined') return 'light'; // SSR fallback
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettingsState({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    setMounted(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return; // Don't save on initial load or SSR

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }, [settings, mounted]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const effectiveTheme = getEffectiveTheme(settings.theme);
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || settings.theme !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const effectiveTheme = getEffectiveTheme(settings.theme);
      const root = document.documentElement;

      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme, mounted]);

  const setTheme = (theme: Theme) => {
    setSettingsState((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: string) => {
    setSettingsState((prev) => ({ ...prev, language }));
  };

  const setAnimations = (enabled: boolean) => {
    setSettingsState((prev) => ({ ...prev, animations: enabled }));
  };

  const value: SettingsState = {
    ...settings,
    effectiveTheme: getEffectiveTheme(settings.theme),
    setTheme,
    setLanguage,
    setAnimations,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Export a hook for theme-specific usage
export function useTheme() {
  const { theme, effectiveTheme, setTheme } = useSettings();
  return { theme, effectiveTheme, setTheme };
}
