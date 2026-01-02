'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Calendar, ArrowLeft, Clock, User, Share2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsletterForm } from '@/components/common/NewsletterForm';
import { notFound } from 'next/navigation';

// Blog post content database (in production, this would come from a CMS or database)
const blogPostsData: Record<string, Record<string, {
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: number;
  category: string;
}>> = {
  'que-es-copy-trading': {
    es: {
      title: 'Copy Trading: Qué es y cómo funciona',
      excerpt: 'Guía completa sobre copy trading, sus ventajas, riesgos y cómo empezar a replicar operaciones de traders experimentados.',
      date: '2024-12-15',
      readTime: 5,
      category: 'Educación',
      content: [
        'El copy trading es una estrategia de inversión que permite a los inversores replicar automáticamente las operaciones de traders experimentados en sus propias cuentas. Esta metodología democratiza el acceso a estrategias de trading profesionales.',
        '## Cómo funciona el Copy Trading',
        'Cuando un inversor decide copiar a un trader, cada operación que este realiza se replica proporcionalmente en la cuenta del copiador. Si el trader invierte el 5% de su capital en Bitcoin, el copiador también invertirá el 5% de su capital asignado.',
        '## Ventajas del Copy Trading',
        '- **Acceso a expertise**: Aprovecha la experiencia de traders profesionales sin necesidad de años de aprendizaje.',
        '- **Diversificación**: Copia a múltiples traders para diversificar tu riesgo.',
        '- **Transparencia**: Métricas verificables como las que ofrece TradeKuant permiten evaluar el rendimiento histórico.',
        '- **Automatización**: Las operaciones se ejecutan automáticamente, sin intervención manual.',
        '## Riesgos a considerar',
        'El copy trading, como toda inversión, conlleva riesgos. Los resultados pasados no garantizan rendimientos futuros. Es fundamental invertir solo capital que puedas permitirte perder y diversificar entre diferentes traders y plataformas.',
        '## TradeKuant y el Copy Trading',
        'TradeKuant opera en tres plataformas principales: Bitget (criptomonedas), Darwinex (forex y CFDs) y eToro (múltiples mercados). Esta diversificación permite a los copiadores distribuir su riesgo mientras mantienen exposición a diferentes mercados.',
      ],
    },
    en: {
      title: 'Copy Trading: What It Is and How It Works',
      excerpt: 'Complete guide on copy trading, its advantages, risks and how to start replicating trades from experienced traders.',
      date: '2024-12-15',
      readTime: 5,
      category: 'Education',
      content: [
        'Copy trading is an investment strategy that allows investors to automatically replicate the trades of experienced traders in their own accounts. This methodology democratizes access to professional trading strategies.',
        '## How Copy Trading Works',
        'When an investor decides to copy a trader, every trade they make is proportionally replicated in the copier\'s account. If the trader invests 5% of their capital in Bitcoin, the copier will also invest 5% of their allocated capital.',
        '## Advantages of Copy Trading',
        '- **Access to expertise**: Leverage the experience of professional traders without years of learning.',
        '- **Diversification**: Copy multiple traders to diversify your risk.',
        '- **Transparency**: Verifiable metrics like those offered by TradeKuant allow you to evaluate historical performance.',
        '- **Automation**: Trades are executed automatically, without manual intervention.',
        '## Risks to Consider',
        'Copy trading, like any investment, carries risks. Past results do not guarantee future returns. It is essential to invest only capital you can afford to lose and diversify among different traders and platforms.',
        '## TradeKuant and Copy Trading',
        'TradeKuant operates on three main platforms: Bitget (cryptocurrencies), Darwinex (forex and CFDs) and eToro (multiple markets). This diversification allows copiers to distribute their risk while maintaining exposure to different markets.',
      ],
    },
  },
  'gestion-riesgo-trading': {
    es: {
      title: 'Gestión de Riesgo: La Clave del Trading Exitoso',
      excerpt: 'Aprende las estrategias fundamentales de gestión de riesgo que TradeKuant utiliza para proteger el capital.',
      date: '2024-12-01',
      readTime: 7,
      category: 'Estrategia',
      content: [
        'La gestión de riesgo es el pilar fundamental de cualquier estrategia de trading exitosa. Sin un control adecuado del riesgo, incluso la mejor estrategia puede resultar en pérdidas significativas.',
        '## Principios de Gestión de Riesgo de TradeKuant',
        'TradeKuant aplica un conjunto riguroso de principios de gestión de riesgo en todas sus operaciones:',
        '### 1. Stop Loss en Todas las Operaciones',
        'Cada operación tiene un stop loss predefinido que limita la pérdida máxima posible. Esto protege el capital de movimientos adversos del mercado.',
        '### 2. Límite de Exposición por Operación',
        'Ninguna operación individual representa más de un porcentaje definido del capital total. Esto evita que una sola operación tenga un impacto devastador en la cartera.',
        '### 3. Diversificación Multi-Plataforma',
        'Operar en Bitget, Darwinex y eToro permite distribuir el riesgo entre diferentes mercados, activos y entornos regulatorios.',
        '### 4. Monitoreo Constante del Drawdown',
        'El drawdown máximo es monitoreado continuamente. Si se alcanza un umbral predefinido, se reducen las posiciones para proteger el capital restante.',
        '## Métricas Clave',
        'TradeKuant rastrea métricas como el Sharpe Ratio, Sortino Ratio y Max Drawdown para evaluar continuamente el perfil de riesgo-rentabilidad de la estrategia.',
      ],
    },
    en: {
      title: 'Risk Management: The Key to Successful Trading',
      excerpt: 'Learn the fundamental risk management strategies that TradeKuant uses to protect capital.',
      date: '2024-12-01',
      readTime: 7,
      category: 'Strategy',
      content: [
        'Risk management is the fundamental pillar of any successful trading strategy. Without adequate risk control, even the best strategy can result in significant losses.',
        '## TradeKuant\'s Risk Management Principles',
        'TradeKuant applies a rigorous set of risk management principles in all its operations:',
        '### 1. Stop Loss on All Trades',
        'Each trade has a predefined stop loss that limits the maximum possible loss. This protects capital from adverse market movements.',
        '### 2. Exposure Limit per Trade',
        'No single trade represents more than a defined percentage of total capital. This prevents a single trade from having a devastating impact on the portfolio.',
        '### 3. Multi-Platform Diversification',
        'Operating on Bitget, Darwinex and eToro allows distributing risk across different markets, assets and regulatory environments.',
        '### 4. Constant Drawdown Monitoring',
        'Maximum drawdown is continuously monitored. If a predefined threshold is reached, positions are reduced to protect remaining capital.',
        '## Key Metrics',
        'TradeKuant tracks metrics like Sharpe Ratio, Sortino Ratio and Max Drawdown to continuously evaluate the strategy\'s risk-return profile.',
      ],
    },
  },
  'diversificacion-plataformas': {
    es: {
      title: 'Diversificación entre Plataformas de Trading',
      excerpt: 'Por qué diversificar entre Bitget, Darwinex y eToro puede mejorar tu perfil de riesgo-rentabilidad.',
      date: '2024-11-20',
      readTime: 6,
      category: 'Estrategia',
      content: [
        'La diversificación es uno de los principios más importantes en la gestión de inversiones. TradeKuant aplica este principio no solo a nivel de activos, sino también a nivel de plataformas.',
        '## Por qué Diversificar entre Plataformas',
        'Cada plataforma de trading tiene características únicas que la hacen adecuada para diferentes tipos de operaciones:',
        '### Bitget: Criptomonedas',
        'Bitget ofrece acceso al mercado de criptomonedas con herramientas avanzadas de copy trading. TradeKuant aprovecha la volatilidad del mercado cripto con una gestión de riesgo estricta.',
        '### Darwinex: Forex y CFDs',
        'Darwinex destaca por su sistema de DARWIN que combina trading algorítmico con copy trading. TradeKuant gestiona un DARWIN enfocado en forex con un enfoque de swing trading.',
        '### eToro: Mercados Múltiples',
        'eToro ofrece acceso a acciones, ETFs, criptomonedas y más. Como Popular Investor, TradeKuant ofrece una cartera diversificada para inversores que buscan exposición a múltiples mercados.',
        '## Beneficios de la Diversificación Multi-Plataforma',
        '- **Reducción del riesgo de plataforma**: Si una plataforma tiene problemas técnicos, las otras siguen operando.',
        '- **Acceso a diferentes mercados**: Cada plataforma ofrece acceso a activos únicos.',
        '- **Optimización regulatoria**: Diferentes jurisdicciones y marcos regulatorios.',
        '- **Herramientas complementarias**: Cada plataforma tiene características únicas que mejoran la operativa global.',
      ],
    },
    en: {
      title: 'Diversification Across Trading Platforms',
      excerpt: 'Why diversifying across Bitget, Darwinex and eToro can improve your risk-return profile.',
      date: '2024-11-20',
      readTime: 6,
      category: 'Strategy',
      content: [
        'Diversification is one of the most important principles in investment management. TradeKuant applies this principle not only at the asset level, but also at the platform level.',
        '## Why Diversify Across Platforms',
        'Each trading platform has unique characteristics that make it suitable for different types of operations:',
        '### Bitget: Cryptocurrencies',
        'Bitget offers access to the cryptocurrency market with advanced copy trading tools. TradeKuant leverages crypto market volatility with strict risk management.',
        '### Darwinex: Forex and CFDs',
        'Darwinex stands out for its DARWIN system that combines algorithmic trading with copy trading. TradeKuant manages a DARWIN focused on forex with a swing trading approach.',
        '### eToro: Multiple Markets',
        'eToro offers access to stocks, ETFs, cryptocurrencies and more. As a Popular Investor, TradeKuant offers a diversified portfolio for investors seeking exposure to multiple markets.',
        '## Benefits of Multi-Platform Diversification',
        '- **Platform risk reduction**: If one platform has technical issues, the others continue operating.',
        '- **Access to different markets**: Each platform offers access to unique assets.',
        '- **Regulatory optimization**: Different jurisdictions and regulatory frameworks.',
        '- **Complementary tools**: Each platform has unique features that improve overall operations.',
      ],
    },
  },
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, language } = useLanguage();

  // Get slug synchronously for client component
  const slug = (params as unknown as { slug: string }).slug;
  const postData = blogPostsData[slug];

  if (!postData) {
    notFound();
  }

  const post = postData[language] || postData.es || postData.en;

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.blog.backToBlog}
          </Link>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString(language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t.blog.publishedBy}</p>
                <p className="text-xs text-muted-foreground">TradeKuant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          {post.content.map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-semibold mt-8 mb-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold mt-10 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={index} className="list-disc pl-6 my-4">
                  {paragraph.split('\n').map((item, i) => (
                    <li key={i} className="text-muted-foreground mb-2">
                      {item.replace('- ', '').split('**').map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                      )}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Risk Disclaimer */}
        <div className="mt-12 flex gap-4 p-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
          <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-500 mb-2">{t.howToCopy.disclaimer.title}</h3>
            <p className="text-sm text-muted-foreground">
              {t.footer.riskWarning}
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border/50 bg-secondary/20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
