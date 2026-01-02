'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface DrawdownDataPoint {
  date: string;
  drawdown: number;
}

interface DrawdownChartProps {
  data: DrawdownDataPoint[];
  isLoading?: boolean;
  className?: string;
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value as number;

  // Format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-sm font-medium text-foreground">{formatDate(label || '')}</p>
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="text-sm font-semibold text-red-500">
          {value.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export function DrawdownChart({ data, isLoading, className }: DrawdownChartProps) {
  const { t } = useLanguage();

  // Format date for X axis
  const formatXAxis = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  // Calculate max drawdown
  const maxDrawdown = data.length > 0
    ? Math.min(...data.map(d => d.drawdown))
    : 0;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="mb-4 space-y-2">
          <div className="h-5 w-40 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-56 animate-pulse rounded bg-secondary/30" />
        </div>
        <div className="h-[250px] animate-pulse rounded-lg bg-secondary/20" />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <h3 className="mb-1 text-lg font-semibold">
          {t.dashboard.drawdownChart?.title || 'Drawdown Historico'}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {t.dashboard.drawdownChart?.subtitle || 'Periodos de perdida desde maximos'}
        </p>
        <div className="flex h-[250px] items-center justify-center text-muted-foreground">
          {t.dashboard.noData || 'No hay datos disponibles'}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {t.dashboard.drawdownChart?.title || 'Drawdown Historico'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.drawdownChart?.subtitle || 'Periodos de perdida desde maximos'}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Max:</span>
          <span className="text-sm font-semibold text-red-500">
            {maxDrawdown.toFixed(2)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.5}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            dy={10}
          />

          <YAxis
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dx={-10}
            width={50}
            domain={['auto', 0]}
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={0}
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />

          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#EF4444"
            strokeWidth={2}
            fill="url(#drawdownGradient)"
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Info */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <span>{t.dashboard.drawdownChart?.explanation || 'Caida desde el maximo historico'}</span>
      </div>
    </div>
  );
}
