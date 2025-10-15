'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
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

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto px-4 py-4 container">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-bold text-2xl">
              Portfolio
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/projects" className="hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/contact" className="font-semibold text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <section className="mx-auto px-4 py-20 container">
        <div className="max-w-2xl">
          <h1 className="mb-4 font-bold text-4xl">Get in Touch</h1>
          <p className="mb-12 text-muted-foreground text-xl">
            Have a project in mind or want to discuss opportunities? Send me a message!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={status === 'submitting'}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={status === 'submitting'}
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
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={status === 'submitting'}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-primary hover:opacity-90 disabled:opacity-50 px-6 py-3 rounded-md w-full text-primary-foreground transition-opacity"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-green-800 dark:text-green-200">
                  Message sent successfully! I&apos;ll get back to you soon.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
