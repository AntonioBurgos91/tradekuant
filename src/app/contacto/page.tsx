'use client';

import { useLanguage } from '@/lib/i18n';
import { Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { NewsletterForm } from '@/components/common/NewsletterForm';

export default function ContactoPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex h-16 w-16 mx-auto mb-6 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t.contact.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Email Card */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex h-12 w-12 mb-6 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t.contact.email}</h2>
            <p className="text-muted-foreground text-sm mb-4">
              {t.contact.subtitle}
            </p>
            <a
              href="mailto:tradekuant@proton.me"
              className="text-lg font-medium text-primary hover:underline"
            >
              tradekuant@proton.me
            </a>
          </div>

          {/* Newsletter Card */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-4 p-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">{t.howToCopy.disclaimer.title}</h3>
              <p className="text-sm text-muted-foreground">
                {t.contact.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
