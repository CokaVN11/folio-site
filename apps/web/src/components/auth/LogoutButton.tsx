'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from '../../contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'default' | 'text' | 'ghost';
  showUserInfo?: boolean;
  className?: string;
}

export function LogoutButton({
  variant = 'default',
  showUserInfo = false,
  className = '',
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth();
  const { user, isAdmin } = useAdminAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles =
      'inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed';

    switch (variant) {
      case 'text':
        return `${baseStyles} text-muted-foreground hover:text-foreground`;
      case 'ghost':
        return `${baseStyles} text-foreground hover:bg-accent`;
      default:
        return `${baseStyles} bg-destructive text-destructive-foreground hover:bg-destructive/90`;
    }
  };

  if (showUserInfo && user) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Info */}
        <div className="text-sm">
          <div className="font-medium text-foreground">{user.username}</div>
          {isAdmin && <div className="text-xs text-green-600 dark:text-green-400">Admin</div>}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading || isLoggingOut}
          className={`${getButtonStyles()} ${className}`}
        >
          {isLoggingOut ? (
            <>
              <div className="w-3 h-3 mr-2 border rounded-full border-current/30 border-t-current animate-spin"></div>
              Signing out...
            </>
          ) : (
            'Sign out'
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading || isLoggingOut}
      className={`${getButtonStyles()} ${className}`}
    >
      {isLoggingOut ? (
        <>
          <div className="w-3 h-3 mr-2 border rounded-full border-current/30 border-t-current animate-spin"></div>
          Signing out...
        </>
      ) : (
        'Sign out'
      )}
    </button>
  );
}
