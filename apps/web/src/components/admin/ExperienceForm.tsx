'use client';

import { useState, useEffect } from 'react';
import { Calendar, Building, MapPin, Briefcase, Plus, X } from 'lucide-react';

interface ExperienceFormData {
  title: string;
  summary: string;
  description: string;
  company: string;
  role: string;
  employment_type: 'full-time' | 'part-time' | 'internship' | 'freelance' | 'contract';
  location: string;
  team: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
  achievements: string[];
  tech: string[];
  media: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
    caption?: string;
  }>;
  slug: string;
}

interface ExperienceFormProps {
  initialData?: Partial<ExperienceFormData>;
  onSubmit: (data: ExperienceFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'contract', label: 'Contract' },
] as const;

export function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: '',
    summary: '',
    description: '',
    company: '',
    role: '',
    employment_type: 'full-time',
    location: '',
    team: '',
    start_date: '',
    end_date: 'present',
    responsibilities: [''],
    achievements: [''],
    tech: [''],
    media: [],
    slug: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        responsibilities: initialData.responsibilities?.length ? initialData.responsibilities : [''],
        achievements: initialData.achievements?.length ? initialData.achievements : [''],
        tech: initialData.tech?.length ? initialData.tech : [''],
      }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ExperienceFormData, value: any) => {
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

  const handleArrayFieldChange = (field: 'responsibilities' | 'achievements' | 'tech', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'responsibilities' | 'achievements' | 'tech') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'responsibilities' | 'achievements' | 'tech', index: number) => {
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
    if (!formData.company.trim()) errors.company = 'Company is required';
    if (!formData.role.trim()) errors.role = 'Role is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';

    const validResponsibilities = formData.responsibilities.filter(r => r.trim());
    if (validResponsibilities.length === 0) errors.responsibilities = 'At least one responsibility is required';

    const validTech = formData.tech.filter(t => t.trim());
    if (validTech.length === 0) errors.tech = 'At least one technology is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Clean up empty items from arrays
    const cleanData: ExperienceFormData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      achievements: formData.achievements.filter(a => a.trim()),
      tech: formData.tech.filter(t => t.trim()),
    };

    await onSubmit(cleanData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {initialData ? 'Edit Experience' : 'Add New Experience'}
          </h2>
          <p className="text-muted-foreground">
            Share your professional work experience
          </p>
        </div>

        {/* Basic Information */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Basic Information
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                Company *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    validationErrors.company ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                  disabled={isLoading}
                />
              </div>
              {validationErrors.company && (
                <p className="text-sm text-destructive mt-1">{validationErrors.company}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                Role *
              </label>
              <input
                id="role"
                type="text"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  validationErrors.role ? 'border-destructive' : 'border-input'
                }`}
                placeholder="e.g., Senior Software Engineer"
                disabled={isLoading}
              />
              {validationErrors.role && (
                <p className="text-sm text-destructive mt-1">{validationErrors.role}</p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label htmlFor="employment_type" className="block text-sm font-medium text-foreground mb-2">
                Employment Type *
              </label>
              <select
                id="employment_type"
                value={formData.employment_type}
                onChange={(e) => handleInputChange('employment_type', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                disabled={isLoading}
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    validationErrors.location ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="e.g., San Francisco, CA or Remote"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.location && (
                <p className="text-sm text-destructive mt-1">{validationErrors.location}</p>
              )}
            </div>

            {/* Team */}
            <div>
              <label htmlFor="team" className="block text-sm font-medium text-foreground mb-2">
                Team (Optional)
              </label>
              <input
                id="team"
                type="text"
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                placeholder="e.g., Platform Engineering Team"
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
                  placeholder="company-name-role"
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
            Duration
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
                End Date *
              </label>
              <select
                id="end_date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                disabled={isLoading}
              >
                <option value="present">Present</option>
                <option value="">Specific Date</option>
              </select>
              {formData.end_date !== 'present' && formData.end_date !== '' && (
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input mt-2"
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
        </div>

        {/* Summary and Description */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold">Description</h3>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Experience Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                validationErrors.title ? 'border-destructive' : 'border-input'
              }`}
              placeholder="e.g., Senior Software Engineer at Company"
              disabled={isLoading}
            />
            {validationErrors.title && (
              <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
            )}
          </div>

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
              placeholder="Brief summary of your role and key achievements (1-2 sentences)"
              disabled={isLoading}
            />
            {validationErrors.summary && (
              <p className="text-sm text-destructive mt-1">{validationErrors.summary}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Detailed Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
              rows={5}
              placeholder="Detailed description of your experience, projects, and impact"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Responsibilities */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold">Responsibilities</h3>

          <div className="space-y-3">
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                  placeholder="Describe a key responsibility"
                  disabled={isLoading}
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('responsibilities', index)}
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
              onClick={() => addArrayItem('responsibilities')}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Responsibility
            </button>
          </div>

          {validationErrors.responsibilities && (
            <p className="text-sm text-destructive">{validationErrors.responsibilities}</p>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-6 p-6 border rounded-lg border-border bg-card">
          <h3 className="text-lg font-semibold">Technologies</h3>

          <div className="space-y-3">
            {formData.tech.map((tech, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayFieldChange('tech', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent border-input"
                  placeholder="e.g., React, TypeScript, AWS"
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
              initialData ? 'Update Experience' : 'Create Experience'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}