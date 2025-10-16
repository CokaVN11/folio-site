'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../contexts/AuthContext';
import { LoginForm } from '../../../components/auth/LoginForm';
import { PasswordResetForm } from '../../../components/auth/PasswordResetForm';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { isAuthenticated, isAdmin, requiresNewPassword } = useAdminAuth();
  const router = useRouter();

  // Redirect if already authenticated and admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/admin');
    } else if (isAuthenticated && !isAdmin) {
      // User is authenticated but not admin
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Don't render the login form if redirecting
  if ((isAuthenticated && isAdmin) || (isAuthenticated && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
              Portfolio
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            {requiresNewPassword ? 'Set New Password' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {requiresNewPassword
              ? 'Your account requires a new password for security'
              : 'Sign in to access the admin dashboard'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          {requiresNewPassword ? (
            <PasswordResetForm
              onSuccess={() => {
                // Navigation will be handled by the useEffect above
              }}
              onCancel={() => {
                // Clear the password reset state and return to login
                window.location.reload();
              }}
            />
          ) : (
            <LoginForm
              onSuccess={() => {
                // Navigation will be handled by the useEffect above
              }}
            />
          )}
        </div>

        {/* Back to Site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
