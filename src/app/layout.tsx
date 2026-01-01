import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { APP_NAME, APP_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - La K de Kuantificable | Trading Transparente`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Dashboard profesional de trading con métricas verificables de Bitget, Darwinex y eToro. Datos reales actualizados automáticamente desde APIs oficiales. Sin manipulación, 100% transparente.",
  keywords: [
    "trading",
    "copy trading",
    "cryptocurrency",
    "forex",
    "bitcoin",
    "ethereum",
    "bitget",
    "darwinex",
    "etoro",
    "trading metrics",
    "sharpe ratio",
    "performance dashboard",
    "trading transparente",
    "track record verificable",
    "métricas de trading",
    "inversión",
    "rentabilidad",
  ],
  authors: [{ name: "TradeKuant", url: APP_URL }],
  creator: "TradeKuant",
  publisher: "TradeKuant",
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: APP_URL,
    languages: {
      "es": APP_URL,
      "en": `${APP_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US", "de_DE", "fr_FR", "zh_CN"],
    url: APP_URL,
    title: `${APP_NAME} - La K de Kuantificable`,
    description: "Trading transparente y verificable. Métricas profesionales de múltiples plataformas actualizadas automáticamente.",
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "TradeKuant - Dashboard de Trading Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - La K de Kuantificable`,
    description: "Trading transparente y verificable. Métricas profesionales de múltiples plataformas.",
    images: [`${APP_URL}/og-image.png`],
    creator: "@tradekuant",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ErrorBoundary>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
