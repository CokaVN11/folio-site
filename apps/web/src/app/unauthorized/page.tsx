'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/auth/LogoutButton';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-background sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Lock Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-muted">
          <Lock className="w-8 h-8 text-foreground" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            {user
              ? `Hi ${user.username}, you don't have admin privileges to access this area.`
              : 'You need to be logged in with admin privileges to access this area.'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {user && (
            <div className="flex justify-center">
              <LogoutButton showUserInfo />
            </div>
          )}

          <div className="space-y-2">
            <Link
              href="/"
              className="block w-full px-4 py-2 text-center transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Portfolio
            </Link>

            {!user && (
              <Link
                href="/admin/login"
                className="block w-full px-4 py-2 text-center transition-colors border rounded-md border-border hover:bg-accent"
              >
                Try Different Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
