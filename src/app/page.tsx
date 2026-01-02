'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  BarChart3,
  Zap,
  CheckCircle2,
  Users,
  LineChart,
  Lock,
  RefreshCw,
} from 'lucide-react';

// Platform data
const PLATFORMS_DATA = [
  { name: 'Bitget', color: '#10B981', return: '+16.92%' },
  { name: 'Darwinex', color: '#3B82F6', return: '+6.17%' },
  { name: 'eToro', color: '#22C55E', return: '+5.07%' },
];

const STATS_DATA = [
  { key: 'totalReturn', value: '+228.15%' },
  { key: 'maxDrawdown', value: '-8.5%' },
  { key: 'sharpeRatio', value: '2.34' },
  { key: 'winRate', value: '68.4%' },
];

const FEATURE_ICONS = [TrendingUp, Shield, RefreshCw, LineChart, Users, Lock];

export default function Home() {
  const { t, dir } = useLanguage();

  const FEATURES = [
    { icon: TrendingUp, ...t.features.metrics },
    { icon: Shield, ...t.features.transparent },
    { icon: RefreshCw, ...t.features.updates },
    { icon: LineChart, ...t.features.charts },
    { icon: Users, ...t.features.multiPlatform },
    { icon: Lock, ...t.features.openSource },
  ];

  const PLATFORMS = [
    { name: 'Bitget', color: '#10B981', ...t.platforms.bitget },
    { name: 'Darwinex', color: '#3B82F6', ...t.platforms.darwinex },
    { name: 'eToro', color: '#22C55E', ...t.platforms.etoro },
  ];

  const getStatLabel = (key: string) => {
    switch (key) {
      case 'totalReturn': return t.stats.totalReturn;
      case 'maxDrawdown': return t.stats.maxDrawdown;
      case 'sharpeRatio': return t.stats.sharpeRatio;
      case 'winRate': return t.stats.winRate;
      default: return key;
    }
  };

  const getStatSublabel = (key: string) => {
    switch (key) {
      case 'totalReturn': return t.stats.fromStart;
      case 'maxDrawdown': return t.stats.historic;
      case 'sharpeRatio': return t.stats.riskAdjusted;
      case 'winRate': return t.stats.operations;
      default: return '';
    }
  };

  return (
    <div className="flex flex-col" dir={dir}>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="hero-glow absolute left-1/2 top-1/4 -translate-x-1/2" />
        <div className="hero-glow absolute right-0 top-1/2 opacity-50" />

        <div className="container-wide relative z-10 flex min-h-screen flex-col items-center justify-center py-20 pt-32">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{t.hero.badge}</span>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Trade<span className="text-gradient-primary">K</span>uant
          </h1>

          <p className="mb-4 text-center text-xl text-muted-foreground sm:text-2xl">
            {t.hero.tagline}
          </p>

          <p className="mb-10 max-w-2xl text-center text-lg text-muted-foreground/80">
            {t.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              >
                {t.hero.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 border-border/50 px-8 text-base font-semibold hover:bg-secondary"
              >
                {t.hero.learnMore}
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {STATS_DATA.map((stat, i) => (
              <div
                key={stat.key}
                className="stats-card text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {getStatLabel(stat.key)}
                </p>
                <p className={`text-2xl font-bold sm:text-3xl ${
                  stat.value.startsWith('+') ? 'text-profit' :
                  stat.value.startsWith('-') ? 'text-loss' : 'text-foreground'
                }`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">{getStatSublabel(stat.key)}</p>
              </div>
            ))}
          </div>

          {/* Platform badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS_DATA.map((platform) => (
              <div
                key={platform.name}
                className="platform-badge"
                style={{
                  background: `${platform.color}15`,
                  color: platform.color,
                  borderColor: `${platform.color}30`,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: platform.color }}
                />
                {platform.name}
                <span className="font-semibold">{platform.return}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <span className="text-xs uppercase tracking-widest">{t.hero.scroll}</span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-muted-foreground/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative border-t border-border/50">
        <div className="absolute inset-0 grid-pattern opacity-50" />

        <div className="container-wide relative z-10 section-padding">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
              {t.features.title}
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.features.subtitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.features.description}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <feature.icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="border-t border-border/50">
        <div className="container-wide section-padding">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
              {t.platforms.title}
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.platforms.subtitle}
            </h2>
            <p className="text-muted-foreground">
              {t.platforms.description}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 transition-all hover:border-border"
              >
                <div
                  className="absolute left-0 top-0 h-1 w-full"
                  style={{ background: platform.color }}
                />

                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: `${platform.color}15` }}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: platform.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <p className="text-xs text-muted-foreground">{platform.type}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {platform.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border/50">
        <div className="hero-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

        <div className="container-wide relative z-10 section-padding">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>

            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.cta.title}
            </h2>

            <p className="mb-10 max-w-xl text-lg text-muted-foreground">
              {t.cta.description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 gap-2 bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  {t.cta.button}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground/60">
              {t.cta.note}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
