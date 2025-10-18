import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, PlusIcon } from 'lucide-react';
import { Highlighter } from './highlighter';

type ContactInfoProps = React.ComponentProps<'div'> & {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ContactCardProps = React.ComponentProps<'div'> & {
  // Content props
  title?: string;
  description?: string;
  contactInfo?: ContactInfoProps[];
  formSectionClassName?: string;
};

export function ContactCard({
  title = 'Get in Touch',
  description = '',
  contactInfo,
  className,
  formSectionClassName,
  children,
  ...props
}: ContactCardProps) {
  return (
    <div
      className={cn(
        'bg-card border relative grid h-full w-full shadow md:grid-cols-2 lg:grid-cols-3',
        className
      )}
      {...props}
    >
      <PlusIcon className="-top-3 -left-3 absolute w-6 h-6 text-muted-foreground/30" />
      <PlusIcon className="-top-3 -right-3 absolute w-6 h-6 text-muted-foreground/30" />
      <PlusIcon className="-bottom-3 -left-3 absolute w-6 h-6 text-muted-foreground/30" />
      <PlusIcon className="-right-3 -bottom-3 absolute w-6 h-6 text-muted-foreground/30" />
      <div className="flex flex-col justify-between lg:col-span-2">
        <div className="relative space-y-4 md:p-8 px-4 py-6 sm:py-8 h-full">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">{title}</h1>
          <p className="max-w-xl text-muted-foreground text-sm md:text-base lg:text-lg">
            {description}
          </p>
          <div className="gap-2 sm:gap-4 grid md:grid md:grid-cols-2">
            {contactInfo?.map((info, index) => (
              <ContactInfo key={index} {...info} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'bg-muted/40 flex h-full w-full items-center border-t p-5 md:col-span-1 md:border-t-0 md:border-l',
          formSectionClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value, className, ...props }: ContactInfoProps) {
  return (
    <div className={cn('flex items-center gap-3 py-3', className)} {...props}>
      <div className="bg-muted/40 p-3 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">
          {label === 'Email' ? (
            <Highlighter action="underline" color="#FF9800">
              {value}
            </Highlighter>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );
}
