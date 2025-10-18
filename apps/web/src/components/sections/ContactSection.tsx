'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      setContactStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setContactStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <section
      id="contact"
      className="mx-auto px-4 py-20 container"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-2xl">
        <h2 id="contact-heading" className="mb-4 font-bold text-4xl">
          Get in Touch
        </h2>
        <p className="mb-12 text-muted-foreground text-xl">
          Have a project in mind or want to discuss opportunities? Send me a message!
        </p>

        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-sm">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="bg-background px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full"
              value={formData.name}
              onChange={handleInputChange('name')}
              disabled={contactStatus === 'submitting'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="bg-background px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={contactStatus === 'submitting'}
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 font-medium text-sm">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              className="bg-background px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full resize-none"
              value={formData.message}
              onChange={handleInputChange('message')}
              disabled={contactStatus === 'submitting'}
            />
          </div>

          <button
            type="submit"
            disabled={contactStatus === 'submitting'}
            className="bg-primary hover:opacity-90 disabled:opacity-50 px-6 py-3 rounded-md w-full text-primary-foreground transition-opacity"
          >
            {contactStatus === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>

          {contactStatus === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-800 dark:text-green-200">
                Message sent successfully! I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {contactStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
