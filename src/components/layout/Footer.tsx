'use client';

import Link from 'next/link';
import { TrendingUp, ExternalLink, Twitter, Youtube, Send, Instagram } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { NewsletterForm } from '@/components/common/NewsletterForm';

// Social media links
const socialLinks = [
  { name: 'Twitter', href: 'https://x.com/Tradekuant', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/@tradekuant', icon: Youtube },
  { name: 'Instagram', href: 'https://www.instagram.com/tradekuant', icon: Instagram },
  { name: 'Telegram', href: 'https://t.me/tradekuant', icon: Send },
];

// Links to copy trading profiles
const platformCopyLinks = [
  { name: 'Bitget Copy Trading', href: 'https://www.bitget.com/referral/register?from=referral&clacCode=NMURPAHH', color: '#00C896' },
  { name: 'Darwinex DARWIN', href: 'https://www.darwinex.com/darwin/PLACEHOLDER', color: '#3B82F6' },
  { name: 'eToro Portfolio', href: 'https://www.etoro.com/people/PLACEHOLDER', color: '#69C53E' },
];

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    plataformas: platformCopyLinks,
    recursos: [
      { name: t.nav.dashboard, href: '/dashboard' },
      { name: t.howToCopy.navLabel, href: '/como-copiar' },
      { name: t.nav.strategy, href: '/strategy' },
      { name: t.contact.title, href: '/contacto' },
    ],
    legal: [
      { name: t.footer.legalNotice, href: '/terms' },
      { name: t.footer.privacy, href: '/privacy' },
      { name: t.footer.risk, href: '/disclaimer' },
    ],
  };

  return (
    <footer className="relative border-t border-border/50 bg-card/30 overflow-hidden w-full">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

      <div className="container-wide relative z-10">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">
                  Trade<span className="text-primary">K</span>uant
                </span>
              </div>
            </Link>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.footer.description}
            </p>

            {/* Newsletter */}
            <NewsletterForm variant="compact" className="max-w-sm" />
          </div>

          {/* Copy Trading Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Copy Trading
            </h4>
            <ul className="space-y-3">
              {footerLinks.plataformas.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: link.color }}
                    />
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.resources}
            </h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.legal}
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.contact.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {t.contact.subtitle}
            </p>
            <a
              href="mailto:tradekuant@proton.me"
              className="text-sm text-primary hover:underline"
            >
              tradekuant@proton.me
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 py-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} TradeKuant. {t.footer.copyright}.
          </p>

          <div className="flex items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t.footer.updatedDaily}
            </span>
          </div>
        </div>

        {/* Risk disclaimer */}
        <div className="border-t border-border/50 py-4">
          <p className="text-center text-[10px] leading-relaxed text-muted-foreground/60">
            {t.footer.riskWarning}
          </p>
        </div>
      </div>
    </footer>
  );
}
