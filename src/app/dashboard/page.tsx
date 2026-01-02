'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  Target,
  Percent,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// Import all dashboard components
import { PeriodSelector, type Period } from '@/components/dashboard/PeriodSelector';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PlatformCard } from '@/components/dashboard/PlatformCard';
import { EquityCurveChart } from '@/components/dashboard/EquityCurveChart';
import { MonthlyReturnsChart } from '@/components/dashboard/MonthlyReturnsChart';
import { DrawdownChart } from '@/components/dashboard/DrawdownChart';
import { CollapsibleSection } from '@/components/dashboard/CollapsibleSection';
import { TradeHistory } from '@/components/dashboard/TradeHistory';

interface EquityPoint {
  date: string;
  total: number;
  bitget?: number;
  darwinex?: number;
  etoro?: number;
}

interface DrawdownPoint {
  date: string;
  drawdown: number;
}

interface DashboardData {
  period: Period;
  global: {
    totalEquity: number;
    totalReturn: number;
    maxDrawdown: number;
    totalCopiers: number;
    totalAUM: number;
    sharpeRatio: number;
    sortinoRatio: number;
    winRate: number;
    ytdReturn: number;
  };
  platforms: {
    id: number;
    name: string;
    slug: string;
    type: string;
    color: string;
    equity: number;
    return: number;
    copiers: number;
    aum: number;
    drawdown: number;
    sharpe: number;
    sortino: number;
    winRate: number;
    lastUpdate: string;
  }[];
  monthlyReturns: { month: string; value: number }[];
  equityCurve: EquityPoint[];
  drawdownCurve: DrawdownPoint[];
  sparklineData: Record<string, number[]>;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>('all');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (selectedPeriod: Period = period) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard?period=${selectedPeriod}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Error loading data');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const global = data?.global || {
    totalEquity: 0,
    totalReturn: 0,
    maxDrawdown: 0,
    totalCopiers: 0,
    totalAUM: 0,
    sharpeRatio: 0,
    sortinoRatio: 0,
    winRate: 0,
    ytdReturn: 0,
  };

  const platforms = data?.platforms || [];
  const monthlyReturns = data?.monthlyReturns || [];
  const equityCurve = data?.equityCurve || [];
  const drawdownCurve = data?.drawdownCurve || [];
  const sparklineData = data?.sparklineData || {};

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <div className="mb-2 flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2 sm:px-3 py-1 text-xs font-medium text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  {t.dashboard.live}
                </span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.dashboard.subtitle}
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-3">
              <button
                onClick={() => fetchData()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-card disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {t.dashboard.refresh}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center">
          <PeriodSelector
            selected={period}
            onChange={handlePeriodChange}
          />
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400 text-center">
            {error}
            <button
              onClick={() => fetchData()}
              className="ml-3 text-sm underline hover:no-underline"
            >
              {t.dashboard.retry || 'Reintentar'}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Global Metrics - Primary */}
        <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t.dashboard.totalEquity}
            value={`€${global.totalEquity.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            subtitle={t.dashboard.portfolioValue}
            icon={DollarSign}
            trend="up"
            tooltip={t.dashboard.tooltips?.totalEquity || 'Valor total actual de todas las cuentas de trading combinadas'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.totalReturn}
            value={`${global.totalReturn >= 0 ? '+' : ''}${global.totalReturn.toFixed(2)}%`}
            subtitle={t.dashboard.fromStart}
            icon={TrendingUp}
            trend={global.totalReturn >= 0 ? 'up' : 'down'}
            tooltip={t.dashboard.tooltips?.totalReturn || 'Rentabilidad acumulada desde el inicio de operaciones'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.maxDrawdown}
            value={`${global.maxDrawdown.toFixed(1)}%`}
            subtitle={t.dashboard.maxHistoric}
            icon={TrendingDown}
            trend="down"
            tooltip={t.dashboard.tooltips?.maxDrawdown || 'Mayor caida desde un maximo historico. Mide el riesgo maximo asumido.'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.copiers}
            value={global.totalCopiers.toString()}
            subtitle={`AUM: $${global.totalAUM.toLocaleString()}`}
            icon={Users}
            trend="up"
            tooltip={t.dashboard.tooltips?.copiers || 'Numero total de inversores copiando las estrategias en todas las plataformas'}
            isLoading={isLoading}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t.dashboard.sharpeRatio}
            value={global.sharpeRatio.toFixed(2)}
            subtitle={t.dashboard.riskAdjusted}
            icon={Target}
            trend="neutral"
            tooltip={t.dashboard.tooltips?.sharpeRatio || 'Rentabilidad ajustada al riesgo. Mayor de 1 es bueno, mayor de 2 es excelente.'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.sortinoRatio}
            value={global.sortinoRatio.toFixed(2)}
            subtitle={t.dashboard.downsideRisk}
            icon={Activity}
            trend="neutral"
            tooltip={t.dashboard.tooltips?.sortinoRatio || 'Similar a Sharpe pero solo considera la volatilidad negativa. Mas relevante para gestionar perdidas.'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.winRate}
            value={`${global.winRate.toFixed(1)}%`}
            subtitle={t.dashboard.winningTrades}
            icon={Percent}
            trend="neutral"
            tooltip={t.dashboard.tooltips?.winRate || 'Porcentaje de operaciones cerradas con beneficio.'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.ytdReturn}
            value={`${global.ytdReturn >= 0 ? '+' : ''}${global.ytdReturn.toFixed(1)}%`}
            subtitle={t.dashboard.currentYear}
            icon={BarChart3}
            trend={global.ytdReturn >= 0 ? 'up' : 'down'}
            tooltip={t.dashboard.tooltips?.ytdReturn || 'Rentabilidad acumulada en el año actual (Year-To-Date).'}
            isLoading={isLoading}
          />
        </div>

        {/* Platforms */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-center mb-2">{t.dashboard.byPlatform}</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t.dashboard.individualMetrics}
          </p>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <PlatformCard
                  key={i}
                  platform={{
                    id: i,
                    name: 'Loading...',
                    slug: '',
                    type: '',
                    color: '#666',
                    equity: 0,
                    return: 0,
                    copiers: 0,
                    aum: 0,
                    drawdown: 0,
                    sharpe: 0,
                    lastUpdate: new Date().toISOString(),
                  }}
                  labels={{
                    return: t.dashboard.return,
                    equity: t.dashboard.equity,
                    drawdown: t.dashboard.drawdown,
                    copiers: t.dashboard.copiers,
                    sharpe: 'Sharpe',
                    updated: t.dashboard.updated,
                  }}
                  isLoading={true}
                />
              ))
            ) : (
              platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  labels={{
                    return: t.dashboard.return,
                    equity: t.dashboard.equity,
                    drawdown: t.dashboard.drawdown,
                    copiers: t.dashboard.copiers,
                    sharpe: 'Sharpe',
                    updated: t.dashboard.updated,
                  }}
                  sparklineData={sparklineData[platform.slug]}
                />
              ))
            )}
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-center mb-2">{t.dashboard.performance || 'Rendimiento'}</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t.dashboard.historicalData || 'Datos historicos y evolucion'}
          </p>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
            <EquityCurveChart
              data={equityCurve}
              isLoading={isLoading}
            />
            <MonthlyReturnsChart
              data={monthlyReturns}
              isLoading={isLoading}
            />
          </div>

          {/* Drawdown Chart - Full Width */}
          <DrawdownChart
            data={drawdownCurve}
            isLoading={isLoading}
          />
        </section>

        {/* Trade History - Collapsible */}
        <section>
          <CollapsibleSection
            title={t.dashboard.tradeHistory?.title || 'Historial de Operaciones'}
            subtitle={t.dashboard.tradeHistory?.subtitle || 'Ultimas operaciones ejecutadas en todas las plataformas'}
            defaultOpen={false}
            showLabel={t.dashboard.tradeHistory?.show || 'Ver Operaciones'}
            hideLabel={t.dashboard.tradeHistory?.hide || 'Ocultar Operaciones'}
          >
            <TradeHistory
              showPlatform={true}
              itemsPerPage={10}
            />
          </CollapsibleSection>
        </section>
      </div>
    </div>
  );
}
