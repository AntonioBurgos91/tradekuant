'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { NewsletterForm } from '@/components/common/NewsletterForm';

// Example blog posts data
const blogPosts = [
  {
    slug: 'que-es-copy-trading',
    titleKey: 'copyTrading',
    date: '2024-12-15',
    readTime: 5,
    category: 'Education',
    image: '/blog/copy-trading.jpg',
  },
  {
    slug: 'gestion-riesgo-trading',
    titleKey: 'riskManagement',
    date: '2024-12-01',
    readTime: 7,
    category: 'Strategy',
    image: '/blog/risk-management.jpg',
  },
  {
    slug: 'diversificacion-plataformas',
    titleKey: 'diversification',
    date: '2024-11-20',
    readTime: 6,
    category: 'Strategy',
    image: '/blog/diversification.jpg',
  },
];

const blogContent: Record<string, Record<string, { title: string; excerpt: string }>> = {
  es: {
    copyTrading: {
      title: 'Copy Trading: Qué es y cómo funciona',
      excerpt: 'Guía completa sobre copy trading, sus ventajas, riesgos y cómo empezar a replicar operaciones de traders experimentados.',
    },
    riskManagement: {
      title: 'Gestión de Riesgo: La Clave del Trading Exitoso',
      excerpt: 'Aprende las estrategias fundamentales de gestión de riesgo que TradeKuant utiliza para proteger el capital.',
    },
    diversification: {
      title: 'Diversificación entre Plataformas de Trading',
      excerpt: 'Por qué diversificar entre Bitget, Darwinex y eToro puede mejorar tu perfil de riesgo-rentabilidad.',
    },
  },
  en: {
    copyTrading: {
      title: 'Copy Trading: What It Is and How It Works',
      excerpt: 'Complete guide on copy trading, its advantages, risks and how to start replicating trades from experienced traders.',
    },
    riskManagement: {
      title: 'Risk Management: The Key to Successful Trading',
      excerpt: 'Learn the fundamental risk management strategies that TradeKuant uses to protect capital.',
    },
    diversification: {
      title: 'Diversification Across Trading Platforms',
      excerpt: 'Why diversifying across Bitget, Darwinex and eToro can improve your risk-return profile.',
    },
  },
  de: {
    copyTrading: {
      title: 'Copy Trading: Was es ist und wie es funktioniert',
      excerpt: 'Vollständiger Leitfaden zum Copy Trading, seinen Vorteilen, Risiken und wie man anfängt.',
    },
    riskManagement: {
      title: 'Risikomanagement: Der Schlüssel zum erfolgreichen Trading',
      excerpt: 'Lernen Sie die grundlegenden Risikomanagement-Strategien, die TradeKuant verwendet.',
    },
    diversification: {
      title: 'Diversifikation über Trading-Plattformen',
      excerpt: 'Warum die Diversifikation über Bitget, Darwinex und eToro Ihr Risiko-Rendite-Profil verbessern kann.',
    },
  },
  fr: {
    copyTrading: {
      title: 'Copy Trading: Qu\'est-ce que c\'est et comment ça fonctionne',
      excerpt: 'Guide complet sur le copy trading, ses avantages, risques et comment commencer.',
    },
    riskManagement: {
      title: 'Gestion des Risques: La Clé du Trading Réussi',
      excerpt: 'Apprenez les stratégies fondamentales de gestion des risques que TradeKuant utilise.',
    },
    diversification: {
      title: 'Diversification entre Plateformes de Trading',
      excerpt: 'Pourquoi diversifier entre Bitget, Darwinex et eToro peut améliorer votre profil risque-rendement.',
    },
  },
  zh: {
    copyTrading: {
      title: '跟单交易：定义与运作方式',
      excerpt: '关于跟单交易的完整指南，包括其优势、风险以及如何开始复制经验丰富的交易者的交易。',
    },
    riskManagement: {
      title: '风险管理：成功交易的关键',
      excerpt: '了解TradeKuant用于保护资金的基本风险管理策略。',
    },
    diversification: {
      title: '跨交易平台的多元化',
      excerpt: '为什么在Bitget、Darwinex和eToro之间进行多元化可以改善您的风险回报状况。',
    },
  },
  ar: {
    copyTrading: {
      title: 'نسخ التداول: ما هو وكيف يعمل',
      excerpt: 'دليل شامل حول نسخ التداول، مزاياه، مخاطره وكيفية البدء في نسخ صفقات المتداولين ذوي الخبرة.',
    },
    riskManagement: {
      title: 'إدارة المخاطر: مفتاح التداول الناجح',
      excerpt: 'تعرف على استراتيجيات إدارة المخاطر الأساسية التي يستخدمها TradeKuant لحماية رأس المال.',
    },
    diversification: {
      title: 'التنويع عبر منصات التداول',
      excerpt: 'لماذا يمكن للتنويع بين Bitget و Darwinex و eToro تحسين ملف المخاطر والعوائد الخاص بك.',
    },
  },
};

export default function BlogPage() {
  const { t, language } = useLanguage();
  const content = blogContent[language] || blogContent.es;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex h-14 w-14 mx-auto mb-6 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {t.blog.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.blog.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl font-semibold mb-8">{t.blog.recentPosts}</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => {
            const postContent = content[post.titleKey];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-secondary/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString(language, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {postContent?.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {postContent?.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {t.blog.readMore}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-border/50 bg-secondary/20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
