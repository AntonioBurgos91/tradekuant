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
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface EquityPoint {
  date: string;
  total: number;
  bitget?: number;
  darwinex?: number;
  etoro?: number;
}

interface DashboardData {
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
    lastUpdate: string;
  }[];
  monthlyReturns: { month: string; value: number }[];
  equityCurve: EquityPoint[];
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  vsLastMonth,
  isLoading,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  vsLastMonth?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-secondary" />
          ) : (
            <p className={`text-2xl font-bold ${
              trend === 'up' ? 'text-profit' :
              trend === 'down' ? 'text-loss' : 'text-foreground'
            }`}>
              {value}
            </p>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trendValue && trend && !isLoading && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-profit" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-loss" />
          )}
          <span className={trend === 'up' ? 'text-profit' : 'text-loss'}>
            {trendValue}
          </span>
          <span className="text-muted-foreground">{vsLastMonth}</span>
        </div>
      )}
    </div>
  );
}

function PlatformCard({
  platform,
  labels,
  isLoading,
}: {
  platform: DashboardData['platforms'][0];
  labels: {
    return: string;
    equity: string;
    drawdown: string;
    copiers: string;
    sharpe: string;
    updated: string;
  };
  isLoading?: boolean;
}) {
  const isPositive = platform.return >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all hover:border-border hover:bg-card">
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ background: platform.color }}
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
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

          <div className="text-right">
            {isLoading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-secondary" />
            ) : (
              <p className={`text-lg font-bold ${isPositive ? 'text-profit' : 'text-loss'}`}>
                {isPositive ? '+' : ''}{platform.return.toFixed(2)}%
              </p>
            )}
            <p className="text-xs text-muted-foreground">{labels.return}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="mb-1 text-xs text-muted-foreground">{labels.equity}</p>
            {isLoading ? (
              <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
            ) : (
              <p className="font-semibold">${platform.equity.toFixed(2)}</p>
            )}
          </div>

          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="mb-1 text-xs text-muted-foreground">{labels.drawdown}</p>
            {isLoading ? (
              <div className="h-5 w-16 animate-pulse rounded bg-secondary" />
            ) : (
              <p className="font-semibold text-loss">{platform.drawdown.toFixed(1)}%</p>
            )}
          </div>

          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="mb-1 text-xs text-muted-foreground">{labels.copiers}</p>
            {isLoading ? (
              <div className="h-5 w-12 animate-pulse rounded bg-secondary" />
            ) : (
              <p className="font-semibold">{platform.copiers}</p>
            )}
          </div>

          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="mb-1 text-xs text-muted-foreground">{labels.sharpe}</p>
            {isLoading ? (
              <div className="h-5 w-12 animate-pulse rounded bg-secondary" />
            ) : (
              <p className="font-semibold">{platform.sharpe.toFixed(2)}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {labels.updated}: {new Date(platform.lastUpdate).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function EquityCurveChart({
  title,
  subtitle,
  data,
  platforms,
  isLoading,
}: {
  title: string;
  subtitle: string;
  data: EquityPoint[];
  platforms: DashboardData['platforms'];
  isLoading?: boolean;
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(['bitget', 'darwinex', 'etoro'])
  );
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Get available years from data
  const availableYears = Array.from(
    new Set(data.map(d => d.date.substring(0, 4)))
  ).sort();

  // Filter data by year
  const filteredData = selectedYear === 'all'
    ? data
    : data.filter(d => d.date.startsWith(selectedYear));

  const togglePlatform = (slug: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(slug)) {
      if (newSelected.size > 1) {
        newSelected.delete(slug);
      }
    } else {
      newSelected.add(slug);
    }
    setSelectedPlatforms(newSelected);
  };

  if (isLoading || data.length === 0) {
    return (
      <div className="metric-card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="h-48 animate-pulse rounded-lg bg-secondary/30" />
      </div>
    );
  }

  // Calculate chart dimensions
  const width = 100;
  const height = 100;
  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values only for selected platforms
  const allValues = filteredData.flatMap(d => {
    const values: number[] = [];
    if (selectedPlatforms.has('bitget') && d.bitget) values.push(d.bitget);
    if (selectedPlatforms.has('darwinex') && d.darwinex) values.push(d.darwinex);
    if (selectedPlatforms.has('etoro') && d.etoro) values.push(d.etoro);
    return values;
  });
  const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.95 : 0;
  const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.02 : 100;
  const valueRange = maxValue - minValue || 1;

  // Generate paths for each platform
  const generatePath = (key: 'bitget' | 'darwinex' | 'etoro') => {
    if (filteredData.length === 0) return '';
    const points = filteredData
      .map((d, i) => {
        const x = padding.left + (i / Math.max(filteredData.length - 1, 1)) * chartWidth;
        const value = d[key] || 0;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
    return points;
  };

  const platformColors: Record<string, string> = {
    bitget: '#00C896',
    darwinex: '#3B82F6',
    etoro: '#69C53E',
  };

  return (
    <div className="metric-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Platform toggles */}
        {platforms.map((p) => (
          <button
            key={p.slug}
            onClick={() => togglePlatform(p.slug)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedPlatforms.has(p.slug)
                ? 'bg-opacity-100 text-white'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            }`}
            style={{
              backgroundColor: selectedPlatforms.has(p.slug) ? p.color : undefined,
            }}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                selectedPlatforms.has(p.slug) ? 'bg-white' : ''
              }`}
              style={{
                backgroundColor: selectedPlatforms.has(p.slug) ? undefined : p.color,
              }}
            />
            {p.name}
          </button>
        ))}

        {/* Year selector */}
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-secondary/30 p-1">
          <button
            onClick={() => setSelectedYear('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              selectedYear === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                selectedYear === year
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <line
              key={pct}
              x1={padding.left}
              y1={padding.top + (chartHeight * pct) / 100}
              x2={width - padding.right}
              y2={padding.top + (chartHeight * pct) / 100}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={0.2}
            />
          ))}

          {/* Platform lines */}
          {(['bitget', 'darwinex', 'etoro'] as const).map((key) => (
            selectedPlatforms.has(key) && (
              <path
                key={key}
                d={generatePath(key)}
                fill="none"
                stroke={platformColors[key]}
                strokeWidth={0.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-opacity"
              />
            )
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-[10px] text-muted-foreground">
          <span>${maxValue.toFixed(0)}</span>
          <span>${((maxValue + minValue) / 2).toFixed(0)}</span>
          <span>${minValue.toFixed(0)}</span>
        </div>

        {/* X-axis labels */}
        {filteredData.length > 0 && (
          <div className="absolute bottom-0 left-8 right-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{filteredData[0]?.date.slice(5)}</span>
            <span>{filteredData[Math.floor(filteredData.length / 2)]?.date.slice(5)}</span>
            <span>{filteredData[filteredData.length - 1]?.date.slice(5)}</span>
          </div>
        )}
      </div>

      {/* Stats for selected period */}
      {filteredData.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {(['bitget', 'darwinex', 'etoro'] as const).map((key) => {
            if (!selectedPlatforms.has(key)) return null;
            const startValue = filteredData[0]?.[key] || 0;
            const endValue = filteredData[filteredData.length - 1]?.[key] || 0;
            const change = startValue > 0 ? ((endValue - startValue) / startValue) * 100 : 0;
            const platform = platforms.find(p => p.slug === key);

            return (
              <div
                key={key}
                className="rounded-lg bg-secondary/30 p-2 text-center"
              >
                <p className="text-[10px] text-muted-foreground">{platform?.name}</p>
                <p className={`text-sm font-semibold ${change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MonthlyReturnsChart({
  title,
  subtitle,
  months,
  data,
  isLoading,
}: {
  title: string;
  subtitle: string;
  months: Record<string, string>;
  data: { month: string; value: number }[];
  isLoading?: boolean;
}) {
  const maxValue = Math.max(...data.map(m => Math.abs(m.value)), 1);

  return (
    <div className="metric-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle} (2024)</p>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-end justify-between gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="h-4 w-8 animate-pulse rounded bg-secondary" />
              <div className="h-20 w-full animate-pulse rounded bg-secondary" />
              <div className="h-3 w-6 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-end justify-between gap-2">
          {data.map((month) => {
            const height = maxValue > 0 ? (Math.abs(month.value) / maxValue) * 100 : 0;
            const isPositive = month.value >= 0;
            const monthLabel = months[month.month] || month.month;

            return (
              <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
                <span className={`text-xs font-medium ${isPositive ? 'text-profit' : 'text-loss'}`}>
                  {month.value !== 0 ? `${isPositive ? '+' : ''}${month.value}%` : '-'}
                </span>
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    isPositive ? 'bg-profit' : 'bg-loss'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-muted-foreground">{monthLabel}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard');
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
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="container-wide py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  {t.dashboard.live}
                </span>
              </div>
              <p className="text-muted-foreground">
                {t.dashboard.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
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

      {error && (
        <div className="container-wide py-4">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        </div>
      )}

      <div className="container-wide py-8">
        {/* Global Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t.dashboard.totalEquity}
            value={`€${global.totalEquity.toFixed(2)}`}
            subtitle={t.dashboard.portfolioValue}
            icon={DollarSign}
            trend="up"
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.totalReturn}
            value={`${global.totalReturn >= 0 ? '+' : ''}${global.totalReturn.toFixed(2)}%`}
            subtitle={t.dashboard.fromStart}
            icon={TrendingUp}
            trend={global.totalReturn >= 0 ? 'up' : 'down'}
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.maxDrawdown}
            value={`${global.maxDrawdown.toFixed(1)}%`}
            subtitle={t.dashboard.maxHistoric}
            icon={TrendingDown}
            trend="down"
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.copiers}
            value={global.totalCopiers.toString()}
            subtitle={`AUM: $${global.totalAUM.toLocaleString()}`}
            icon={Users}
            trend="up"
            isLoading={isLoading}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t.dashboard.sharpeRatio}
            value={global.sharpeRatio.toFixed(2)}
            subtitle={t.dashboard.riskAdjusted}
            icon={Target}
            trend="neutral"
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.sortinoRatio}
            value={global.sortinoRatio.toFixed(2)}
            subtitle={t.dashboard.downsideRisk}
            icon={Activity}
            trend="neutral"
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.winRate}
            value={`${global.winRate.toFixed(1)}%`}
            subtitle={t.dashboard.winningTrades}
            icon={Percent}
            trend="neutral"
            isLoading={isLoading}
          />
          <MetricCard
            title={t.dashboard.ytdReturn}
            value={`${global.ytdReturn >= 0 ? '+' : ''}${global.ytdReturn.toFixed(1)}%`}
            subtitle={t.dashboard.currentYear}
            icon={BarChart3}
            trend={global.ytdReturn >= 0 ? 'up' : 'down'}
            isLoading={isLoading}
          />
        </div>

        {/* Platforms */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t.dashboard.byPlatform}</h2>
              <p className="text-sm text-muted-foreground">
                {t.dashboard.individualMetrics}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                />
              ))
            )}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyReturnsChart
            title={t.dashboard.monthlyReturns}
            subtitle={t.dashboard.performanceByMonth}
            months={t.months}
            data={monthlyReturns}
            isLoading={isLoading}
          />

          <EquityCurveChart
            title={t.dashboard.equityCurve}
            subtitle={t.dashboard.capitalEvolution}
            data={equityCurve}
            platforms={platforms}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
