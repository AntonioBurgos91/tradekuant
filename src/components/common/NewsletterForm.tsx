'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function NewsletterForm({ variant = 'default', className = '' }: NewsletterFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus('loading');

    // Simulate API call - replace with actual newsletter API integration
    // Example: Mailchimp, ConvertKit, Resend, etc.
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, just show success (in production, integrate with actual service)
    setStatus('success');
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 text-primary ${className}`}>
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">{t.newsletter.success}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.placeholder}
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t.newsletter.subscribe
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-2">{t.newsletter.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t.newsletter.description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.placeholder}
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <Button type="submit" className="h-11" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {t.newsletter.subscribe}
        </Button>
      </form>
    </div>
  );
}
