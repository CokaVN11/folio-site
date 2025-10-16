'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/auth/LogoutButton';
import { Image, Computer, NotebookPen, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ContentList } from '../../components/admin/ContentList';
import { ContentModal } from '../../components/admin/ContentModal';
import { ExperienceForm } from '../../components/admin/ExperienceForm';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { contentApi } from '../../lib/api';

type ContentType = 'experience' | 'projects' | 'education';
type ModalMode = 'create' | 'edit' | 'view';

interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
  section: ContentType;
  slug?: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, user } = useAdminAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>('experience');
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    section: 'experience'
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const openModal = (mode: ModalMode, section: ContentType, slug?: string) => {
    setModalState({ isOpen: true, mode, section, slug });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create', section: 'experience' });
  };

  const handleContentAction = (action: 'create' | 'edit' | 'view', section: ContentType, slug?: string) => {
    openModal(action, section, slug);
  };

  const refreshContent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderModalContent = () => {
    const { mode, section, slug } = modalState;

    switch (section) {
      case 'experience':
        return (
          <ExperienceForm
            mode={mode}
            slug={slug}
            onSuccess={refreshContent}
            onCancel={closeModal}
          />
        );
      case 'projects':
        return (
          <ProjectForm
            mode={mode}
            slug={slug}
            onSuccess={refreshContent}
            onCancel={closeModal}
          />
        );
      case 'education':
        return (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Education Management</h3>
            <p className="text-muted-foreground">Education content management coming soon...</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'experience' as ContentType, label: 'Experience', icon: NotebookPen },
    { id: 'projects' as ContentType, label: 'Projects', icon: Computer },
    { id: 'education' as ContentType, label: 'Education', icon: Plus }
  ];

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
            <h2 className="mb-2 text-3xl font-bold text-foreground">Content Management</h2>
            <p className="text-muted-foreground">Manage your portfolio content, experience, and projects</p>
          </div>

          {/* Content Management Tabs */}
          <div className="bg-card border border-border rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <ContentList
                section={activeTab}
                onCreateNew={() => handleContentAction('create', activeTab)}
                onEdit={(slug) => handleContentAction('edit', activeTab, slug)}
                onView={(slug) => handleContentAction('view', activeTab, slug)}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

            {/* Statistics */}
            <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                View analytics and usage statistics for your portfolio
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

      {/* Content Modal */}
      {modalState.isOpen && (
        <ContentModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={`${modalState.mode.charAt(0).toUpperCase() + modalState.mode.slice(1)} ${modalState.section.charAt(0).toUpperCase() + modalState.section.slice(1)}`}
          size="xl"
        >
          {renderModalContent()}
        </ContentModal>
      )}
    </div>
  );
}