'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* 404 Number */}
      <div className="relative mb-8">
        <span className="text-[150px] font-bold leading-none text-muted/20 sm:text-[200px]">
          404
        </span>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Página no encontrada
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Puede que el enlace esté roto o la dirección sea incorrecta.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </Button>
        </div>
      </div>

      {/* Helpful Links */}
      <div className="mt-12 grid gap-4 text-center sm:grid-cols-3">
        <Link
          href="/dashboard"
          className="group rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/50 hover:bg-card"
        >
          <p className="font-medium group-hover:text-primary">Dashboard</p>
          <p className="text-sm text-muted-foreground">Ver métricas de trading</p>
        </Link>
        <Link
          href="/strategy"
          className="group rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/50 hover:bg-card"
        >
          <p className="font-medium group-hover:text-primary">Estrategia</p>
          <p className="text-sm text-muted-foreground">Conoce mi enfoque</p>
        </Link>
        <Link
          href="/#features"
          className="group rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/50 hover:bg-card"
        >
          <p className="font-medium group-hover:text-primary">Características</p>
          <p className="text-sm text-muted-foreground">Qué ofrece TradeKuant</p>
        </Link>
      </div>
    </div>
  );
}
