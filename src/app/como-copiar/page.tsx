'use client';

import { useLanguage } from '@/lib/i18n';
import { ExternalLink, DollarSign, HelpCircle } from 'lucide-react';

// Bitget referral link
const BITGET_REFERRAL_LINK = 'https://www.bitget.com/referral/register?from=referral&clacCode=NMURPAHH';

const platforms = [
  {
    id: 'bitget',
    name: 'Bitget',
    color: '#00C896',
    minCapital: '$100 USD',
    type: 'Copy Trading Crypto',
    link: BITGET_REFERRAL_LINK,
    hasBonus: true,
    steps: {
      es: ['Regístrate en Bitget con nuestro enlace', 'Deposita mínimo $100 USD', 'Busca "TradeKuant" y activa el copy'],
      en: ['Sign up on Bitget with our link', 'Deposit minimum $100 USD', 'Search "TradeKuant" and activate copy'],
      de: ['Registriere dich bei Bitget über unseren Link', 'Zahle mindestens $100 USD ein', 'Suche "TradeKuant" und aktiviere Copy'],
      fr: ['Inscrivez-vous sur Bitget via notre lien', 'Déposez minimum $100 USD', 'Recherchez "TradeKuant" et activez la copie'],
      zh: ['通过我们的链接注册Bitget', '存入至少$100美元', '搜索"TradeKuant"并激活跟单'],
      ar: ['سجل في Bitget عبر رابطنا', 'أودع $100 دولار كحد أدنى', 'ابحث عن "TradeKuant" وفعّل النسخ'],
    },
  },
  {
    id: 'darwinex',
    name: 'Darwinex',
    color: '#3B82F6',
    minCapital: '€500 EUR',
    type: 'DARWIN Index',
    link: 'https://www.darwinex.com/darwin/PLACEHOLDER', // TODO: Reemplazar PLACEHOLDER con ID real
    steps: {
      es: ['Crea tu cuenta en Darwinex', 'Deposita mínimo €500 EUR', 'Busca el DARWIN de TradeKuant e invierte'],
      en: ['Create your Darwinex account', 'Deposit minimum €500 EUR', 'Find TradeKuant DARWIN and invest'],
      de: ['Erstelle dein Darwinex-Konto', 'Zahle mindestens €500 EUR ein', 'Finde den TradeKuant DARWIN und investiere'],
      fr: ['Créez votre compte Darwinex', 'Déposez minimum €500 EUR', 'Trouvez le DARWIN TradeKuant et investissez'],
      zh: ['创建您的Darwinex账户', '存入至少€500欧元', '找到TradeKuant DARWIN并投资'],
      ar: ['أنشئ حسابك في Darwinex', 'أودع €500 يورو كحد أدنى', 'ابحث عن DARWIN TradeKuant واستثمر'],
    },
  },
  {
    id: 'etoro',
    name: 'eToro',
    color: '#69C53E',
    minCapital: '$200 USD',
    type: 'Popular Investor',
    link: 'https://www.etoro.com/people/PLACEHOLDER', // TODO: Reemplazar PLACEHOLDER con ID real
    steps: {
      es: ['Crea tu cuenta en eToro', 'Deposita mínimo $200 USD', 'Busca "TradeKuant" y copia el portafolio'],
      en: ['Create your eToro account', 'Deposit minimum $200 USD', 'Search "TradeKuant" and copy the portfolio'],
      de: ['Erstelle dein eToro-Konto', 'Zahle mindestens $200 USD ein', 'Suche "TradeKuant" und kopiere das Portfolio'],
      fr: ['Créez votre compte eToro', 'Déposez minimum $200 USD', 'Recherchez "TradeKuant" et copiez le portefeuille'],
      zh: ['创建您的eToro账户', '存入至少$200美元', '搜索"TradeKuant"并复制投资组合'],
      ar: ['أنشئ حسابك في eToro', 'أودع $200 دولار كحد أدنى', 'ابحث عن "TradeKuant" وانسخ المحفظة'],
    },
  },
];

export default function ComocopiarPage() {
  const { t, language } = useLanguage();
  const howToCopy = t.howToCopy;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {howToCopy.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {howToCopy.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              id={platform.id}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 scroll-mt-24"
            >
              {/* Platform Header */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: platform.color }}
              />

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${platform.color}20` }}
                >
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{platform.name}</h2>
                  <p className="text-sm text-muted-foreground">{platform.type}</p>
                </div>
              </div>

              {/* Bonus Badge for Bitget */}
              {'hasBonus' in platform && platform.hasBonus && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400 font-medium">
                    {howToCopy.bitgetBonus || '🎁 Regístrate con nuestro enlace y obtén hasta $6,200 USDT en bonos'}
                  </p>
                </div>
              )}

              {/* Min Capital */}
              <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-secondary/50">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{howToCopy.minCapital}</p>
                  <p className="font-semibold">{platform.minCapital}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4 mb-6">
                {platform.steps[language as keyof typeof platform.steps]?.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: platform.color }}
              >
                {howToCopy.copyOn} {platform.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border/50 bg-secondary/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <HelpCircle className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">{howToCopy.faq.title}</h2>
            <p className="text-muted-foreground">{howToCopy.faq.subtitle}</p>
          </div>

          <div className="space-y-6">
            {howToCopy.faq.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
