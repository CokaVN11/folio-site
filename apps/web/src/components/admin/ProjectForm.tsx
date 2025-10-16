'use client';

import { useState, useEffect } from 'react';
import { Calendar, Briefcase, Globe, Star, Plus, X, Code, Package } from 'lucide-react';

interface ProjectFormData {
  title: string;
  summary: string;
  description: string;
  role: string;
  start_date: string;
  end_date: string;
  features: string[];
  deployment: {
    platform: string;
    storage?: string;
    ci_cd?: string;
    testing?: string;
    performance?: string;
  };
  achievements: string[];
  tech: string[];
  urls: {
    github?: string;
    live?: string;
    demo?: string;
    linkedin?: string;
    other?: string;
  };
  media: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
    caption?: string;
  }>;
  slug: string;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    summary: '',
    description: '',
    role: '',
    start_date: '',
    end_date: '',
    features: [''],
    deployment: {
      platform: '',
      storage: '',
      ci_cd: '',
      testing: '',
      performance: '',
    },
    achievements: [''],
    tech: [''],
    urls: {
      github: '',
      live: '',
      demo: '',
      linkedin: '',
      other: '',
    },
    media: [],
    slug: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        deployment: {
          ...prev.deployment,
          ...initialData.deployment,
        },
        urls: {
          ...prev.urls,
          ...initialData.urls,
        },
        features: initialData.features?.length ? initialData.features : [''],
        achievements: initialData.achievements?.length ? initialData.achievements : [''],
        tech: initialData.tech?.length ? initialData.tech : [''],
      }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDeploymentChange = (field: keyof ProjectFormData['deployment'], value: string) => {
    setFormData(prev => ({
      ...prev,
      deployment: { ...prev.deployment, [field]: value }
    }));
  };

  const handleUrlsChange = (field: keyof ProjectFormData['urls'], value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: { ...prev.urls, [field]: value }
    }));
  };

  const handleArrayFieldChange = (field: 'features' | 'achievements' | 'tech', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'features' | 'achievements' | 'tech') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'features' | 'achievements' | 'tech', index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    setFormData(prev => ({ ...prev, slug }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.summary.trim()) errors.summary = 'Summary is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) errors.features = 'At least one feature is required';

    const validTech = formData.tech.filter(t => t.trim());
    if (validTech.length === 0) errors.tech = 'At least one technology is required';

    // Validate URLs if provided
    if (formData.urls.github && !isValidUrl(formData.urls.github)) {
      errors.github = 'Please enter a valid URL';
    }
    if (formData.urls.live && !isValidUrl(formData.urls.live)) {
      errors.live = 'Please enter a valid URL';
    }
    if (formData.urls.demo && !isValidUrl(formData.urls.demo)) {
      errors.demo = 'Please enter a valid URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Clean up empty items from arrays
    const cleanData: ProjectFormData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      achievements: formData.achievements.filter(a => a.trim()),
      tech: formData.tech.filter(t => t.trim()),
      urls: Object.fromEntries(
        Object.entries(formData.urls).filter(([_, value]) => value.trim())
      ) as ProjectFormData['urls'],
    };

    // Clean up empty deployment fields
    const cleanDeployment = Object.fromEntries(
      Object.entries(cleanData.deployment).filter(([_, value]) => value.trim())
    );

    cleanData.deployment = cleanDeployment;

    await onSubmit(cleanData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {initialData ? 'Edit Project' : 'Add New Project'}
          </h2>
          <p className="text-muted-foreground">
            Showcase your portfolio projects and technical achievements
          </p>
        </div>

        {/* Basic Information */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Basic Information
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Project Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  validationErrors.title ? 'border-destructive' : 'border-input'
                }`}
                placeholder="e.g., E-commerce Platform, AI Chatbot"
                disabled={isLoading}
              />
              {validationErrors.title && (
                <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                Your Role
              </label>
              <input
                id="role"
                type="text"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="e.g., Lead Developer, Full-Stack Engineer"
                disabled={isLoading}
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
                URL Slug *
              </label>
              <div className="flex gap-2">
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    validationErrors.slug ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="project-name"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-3 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                  disabled={isLoading}
                >
                  Generate
                </button>
              </div>
              {validationErrors.slug && (
                <p className="text-sm text-destructive mt-1">{validationErrors.slug}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Project Timeline
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-foreground mb-2">
                Start Date *
              </label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  validationErrors.start_date ? 'border-destructive' : 'border-input'
                }`}
                disabled={isLoading}
              />
              {validationErrors.start_date && (
                <p className="text-sm text-destructive mt-1">{validationErrors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-foreground mb-2">
                End Date
              </label>
              <input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Summary and Description */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold">Project Description</h3>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-foreground mb-2">
              Summary *
            </label>
            <textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                validationErrors.summary ? 'border-destructive' : 'border-input'
              }`}
              rows={3}
              placeholder="Brief summary of the project and its purpose (1-2 sentences)"
              disabled={isLoading}
            />
            {validationErrors.summary && (
              <p className="text-sm text-destructive mt-1">{validationErrors.summary}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Detailed Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
              rows={5}
              placeholder="Detailed description of the project, challenges, and solutions"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold">Key Features</h3>

          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                  placeholder="Describe a key feature"
                  disabled={isLoading}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="p-2 border border-border rounded-md hover:bg-accent transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>

          {validationErrors.features && (
            <p className="text-sm text-destructive">{validationErrors.features}</p>
          )}
        </div>

        {/* Deployment */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Deployment & Infrastructure
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Platform */}
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-foreground mb-2">
                Platform *
              </label>
              <input
                id="platform"
                type="text"
                value={formData.deployment.platform}
                onChange={(e) => handleDeploymentChange('platform', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="e.g., AWS, DigitalOcean, Vercel"
                disabled={isLoading}
              />
            </div>

            {/* Storage */}
            <div>
              <label htmlFor="storage" className="block text-sm font-medium text-foreground mb-2">
                Storage
              </label>
              <input
                id="storage"
                type="text"
                value={formData.deployment.storage}
                onChange={(e) => handleDeploymentChange('storage', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="e.g., S3, Spaces, PostgreSQL"
                disabled={isLoading}
              />
            </div>

            {/* CI/CD */}
            <div>
              <label htmlFor="ci_cd" className="block text-sm font-medium text-foreground mb-2">
                CI/CD
              </label>
              <input
                id="ci_cd"
                type="text"
                value={formData.deployment.ci_cd}
                onChange={(e) => handleDeploymentChange('ci_cd', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="e.g., GitHub Actions, GitLab CI"
                disabled={isLoading}
              />
            </div>

            {/* Testing */}
            <div>
              <label htmlFor="testing" className="block text-sm font-medium text-foreground mb-2">
                Testing
              </label>
              <input
                id="testing"
                type="text"
                value={formData.deployment.testing}
                onChange={(e) => handleDeploymentChange('testing', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="e.g., Jest, Cypress, 90% coverage"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Performance */}
          <div>
            <label htmlFor="performance" className="block text-sm font-medium text-foreground mb-2">
              Performance Metrics
            </label>
            <textarea
              id="performance"
              value={formData.deployment.performance}
              onChange={(e) => handleDeploymentChange('performance', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
              rows={2}
              placeholder="e.g., <200ms response time, 99.9% uptime, handles 10k concurrent users"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technologies Used
          </h3>

          <div className="space-y-3">
            {formData.tech.map((tech, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayFieldChange('tech', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                  placeholder="e.g., React, TypeScript, Node.js"
                  disabled={isLoading}
                />
                {formData.tech.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tech', index)}
                    className="p-2 border border-border rounded-md hover:bg-accent transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('tech')}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Technology
            </button>
          </div>

          {validationErrors.tech && (
            <p className="text-sm text-destructive">{validationErrors.tech}</p>
          )}
        </div>

        {/* URLs */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold">Project Links</h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* GitHub */}
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-foreground mb-2">
                GitHub
              </label>
              <input
                id="github"
                type="url"
                value={formData.urls.github}
                onChange={(e) => handleUrlsChange('github', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  validationErrors.github ? 'border-destructive' : 'border-input'
                }`}
                placeholder="https://github.com/username/repo"
                disabled={isLoading}
              />
              {validationErrors.github && (
                <p className="text-sm text-destructive mt-1">{validationErrors.github}</p>
              )}
            </div>

            {/* Live Demo */}
            <div>
              <label htmlFor="live" className="block text-sm font-medium text-foreground mb-2">
                Live Site
              </label>
              <input
                id="live"
                type="url"
                value={formData.urls.live}
                onChange={(e) => handleUrlsChange('live', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  validationErrors.live ? 'border-destructive' : 'border-input'
                }`}
                placeholder="https://project-demo.com"
                disabled={isLoading}
              />
              {validationErrors.live && (
                <p className="text-sm text-destructive mt-1">{validationErrors.live}</p>
              )}
            </div>

            {/* Demo */}
            <div>
              <label htmlFor="demo" className="block text-sm font-medium text-foreground mb-2">
                Demo Link
              </label>
              <input
                id="demo"
                type="url"
                value={formData.urls.demo}
                onChange={(e) => handleUrlsChange('demo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  validationErrors.demo ? 'border-destructive' : 'border-input'
                }`}
                placeholder="https://demo.project.com"
                disabled={isLoading}
              />
              {validationErrors.demo && (
                <p className="text-sm text-destructive mt-1">{validationErrors.demo}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-2">
                LinkedIn Post
              </label>
              <input
                id="linkedin"
                type="url"
                value={formData.urls.linkedin}
                onChange={(e) => handleUrlsChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="https://linkedin.com/posts/..."
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                {initialData ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              initialData ? 'Update Project' : 'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}