'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/auth/LogoutButton';
import { Image, Computer, NotebookPen } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, user } = useAdminAuth();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (isAuthenticated && !isAdmin) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Don't render the dashboard if redirecting
  if (!isAuthenticated || (isAuthenticated && !isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 rounded-full border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xl font-bold transition-opacity text-primary hover:opacity-80"
              >
                Portfolio
              </Link>
              <h1 className="text-lg font-semibold text-muted-foreground">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
              <LogoutButton showUserInfo={false} />
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage your portfolio content and settings</p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Manage Content */}
            <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <NotebookPen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Manage Content</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Create and edit portfolio projects, experience, and other content
              </p>
              <button
                disabled
                className="w-full px-4 py-2 rounded-md cursor-not-allowed bg-muted text-muted-foreground"
              >
                Coming Soon
              </button>
            </div>

            {/* Upload Media */}
            <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-green-100 rounded-lg dark:bg-green-900">
                  <Image className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upload Media</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Upload images, videos, and other media for your portfolio
              </p>
              <button
                disabled
                className="w-full px-4 py-2 rounded-md cursor-not-allowed bg-muted text-muted-foreground"
              >
                Coming Soon
              </button>
            </div>

            {/* API Status */}
            <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-purple-100 rounded-lg dark:bg-purple-900">
                  <Computer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">API Status</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Check the status of your backend services and API endpoints
              </p>
              <button
                disabled
                className="w-full px-4 py-2 rounded-md cursor-not-allowed bg-muted text-muted-foreground"
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Your Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-xs font-medium">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Groups</p>
                <p className="font-medium">{user?.groups?.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
