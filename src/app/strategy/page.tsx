'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import {
  Target,
  Shield,
  TrendingUp,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Wallet,
  LineChart,
  PieChart,
} from 'lucide-react';

export default function StrategyPage() {
  const { t, dir } = useLanguage();

  const platformIcons = {
    bitget: Wallet,
    darwinex: LineChart,
    etoro: PieChart,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background" dir={dir}>
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container-wide relative py-16 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Target className="h-4 w-4" />
                TradeKuant
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
                {t.strategy.title}
              </h1>
              <p className="text-lg text-muted-foreground lg:text-xl">
                {t.strategy.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="border-b border-border/50 py-12 lg:py-16">
          <div className="container-wide">
            <div className="mx-auto max-w-3xl">
              <p className="text-center text-lg leading-relaxed text-muted-foreground">
                {t.strategy.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="border-b border-border/50 py-12 lg:py-16">
          <div className="container-wide">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
                  {t.strategy.philosophy.title}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {t.strategy.philosophy.description}
                </p>
                <ul className="space-y-3">
                  {t.strategy.philosophy.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                    <div className="mb-2 text-3xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Plataformas</div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                    <div className="mb-2 text-3xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoreo</div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                    <div className="mb-2 text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Transparente</div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                    <div className="mb-2 text-3xl font-bold text-primary">API</div>
                    <div className="text-sm text-muted-foreground">Verificable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="border-b border-border/50 py-12 lg:py-16">
          <div className="container-wide">
            <div className="mb-10 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
                {t.strategy.approach.title}
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {t.strategy.approach.description}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {(['bitget', 'darwinex', 'etoro'] as const).map((platform) => {
                const Icon = platformIcons[platform];
                const colors = {
                  bitget: 'from-green-500/10 to-green-500/5 border-green-500/20',
                  darwinex: 'from-orange-500/10 to-orange-500/5 border-orange-500/20',
                  etoro: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
                };
                return (
                  <div
                    key={platform}
                    className={`rounded-2xl border bg-gradient-to-b p-6 ${colors[platform]}`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold capitalize">{platform}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.strategy.approach[platform]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Risk Management Section */}
        <section className="border-b border-border/50 py-12 lg:py-16">
          <div className="container-wide">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 flex items-center justify-center lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl" />
                  <div className="relative rounded-2xl border border-border/50 bg-card p-8">
                    <Shield className="mb-4 h-16 w-16 text-primary" />
                    <div className="space-y-2">
                      <div className="h-2 w-32 rounded-full bg-primary/20" />
                      <div className="h-2 w-24 rounded-full bg-primary/10" />
                      <div className="h-2 w-28 rounded-full bg-primary/15" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
                  {t.strategy.risk.title}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {t.strategy.risk.description}
                </p>
                <ul className="space-y-3">
                  {t.strategy.risk.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Performance CTA Section */}
        <section className="py-12 lg:py-16">
          <div className="container-wide">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 text-center lg:p-12">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
                {t.strategy.performance.title}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                {t.strategy.performance.description}
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  {t.strategy.performance.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
