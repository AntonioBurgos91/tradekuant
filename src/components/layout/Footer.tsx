import Link from 'next/link';
import { TrendingUp, ExternalLink } from 'lucide-react';

const footerLinks = {
  plataformas: [
    { name: 'Bitget', href: 'https://www.bitget.com', external: true },
    { name: 'Darwinex', href: 'https://www.darwinex.com', external: true },
    { name: 'eToro', href: 'https://www.etoro.com', external: true },
  ],
  recursos: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Estrategia', href: '/strategy' },
    { name: 'Métricas', href: '/dashboard#metrics' },
  ],
  legal: [
    { name: 'Términos de Uso', href: '/terms' },
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

      <div className="container-wide relative z-10">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
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
              Dashboard profesional de métricas de trading. Datos verificables de
              múltiples plataformas, actualizados automáticamente.
            </p>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Plataformas
            </h4>
            <ul className="space-y-3">
              {footerLinks.plataformas.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recursos
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

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
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
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 py-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} TradeKuant. La K de Kuantificable.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Datos actualizados diariamente
            </span>
          </div>
        </div>

        {/* Risk disclaimer */}
        <div className="border-t border-border/50 py-4">
          <p className="text-center text-[10px] leading-relaxed text-muted-foreground/60">
            <strong>Aviso de riesgo:</strong> El trading con apalancamiento conlleva un alto
            nivel de riesgo y puede no ser adecuado para todos los inversores. Los resultados
            pasados no garantizan rendimientos futuros. Invierte solo capital que puedas
            permitirte perder.
          </p>
        </div>
      </div>
    </footer>
  );
}
