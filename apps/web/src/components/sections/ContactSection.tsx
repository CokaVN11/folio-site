'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { ContactPayloadSchema } from '@services/schemas/contact';
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactCard } from '@/components/ui/contact-card';
import { SparklesText } from '@/components/ui/sparkles-text';

type ContactFormData = z.infer<typeof ContactPayloadSchema>;

export function ContactSection() {
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting'>('idle');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactPayloadSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const handleContactSubmit = async (data: ContactFormData) => {
    setContactStatus('submitting');

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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error(message);
      toast.error('Failed to submit form');
    } finally {
      setContactStatus('idle');
    }
  };

  return (
    <section
      id="contact"
      className="mx-auto pb-14 sm:pb-20 w-full"
      aria-labelledby="contact-heading"
    >
      <ContactCard
        title="Get in Touch"
        description="Have a project in mind or want to discuss opportunities? Send me a message! I'll get back to you as soon as possible."
        contactInfo={[
          {
            icon: MailIcon,
            label: 'Email',
            value: 'nguyenckhanh71@gmail.com',
          },
          {
            icon: PhoneIcon,
            label: 'Phone',
            value: '(+84)868 750 030',
          },
          {
            icon: MapPinIcon,
            label: 'Location',
            value: 'Ho Chi Minh City, Vietnam',
          },
        ]}
        className="max-w-6xl"
      >
        <form
          onSubmit={form.handleSubmit(handleContactSubmit)}
          className="space-y-4 w-full"
          action="javascript:void(0)"
        >
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="John Doe"
                  aria-invalid={form.formState.errors.name ? 'true' : 'false'}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  aria-invalid={form.formState.errors.email ? 'true' : 'false'}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Controller
              name="message"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="message"
                  placeholder="Tell me about your project..."
                  className="min-h-[120px]"
                  aria-invalid={form.formState.errors.message ? 'true' : 'false'}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.message]} />
          </Field>

          <Button
            type="submit"
            disabled={contactStatus === 'submitting'}
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl w-full text-primary-foreground transition-all duration-200"
          >
            <SparklesText
              className="font-semibold text-xl"
              colors={{ first: '#0070F3', second: '#38bdf8' }}
            >
              <span>{contactStatus === 'submitting' ? 'Sending...' : 'Send Message'}</span>
            </SparklesText>
          </Button>
        </form>
      </ContactCard>
    </section>
  );
}
