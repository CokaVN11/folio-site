import { ReactNode } from 'react';
import { SettingsProvider } from '../contexts/SettingsContext';
import { AuthProvider } from '../contexts/AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Main provider wrapper that combines all context providers
 * Order matters: SettingsProvider first, then AuthProvider
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SettingsProvider>
      <AuthProvider>{children}</AuthProvider>
    </SettingsProvider>
  );
}
