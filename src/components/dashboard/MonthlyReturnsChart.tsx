'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface MonthlyReturnDataPoint {
  month: string;
  value: number;
}

interface MonthlyReturnsChartProps {
  data: MonthlyReturnDataPoint[];
  isLoading?: boolean;
  className?: string;
}

// Colors
const POSITIVE_COLOR = '#10B981';
const NEGATIVE_COLOR = '#EF4444';

// Custom tooltip component
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value as number;
  const isPositive = value >= 0;

  // Format month label
  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-sm font-medium capitalize text-foreground">
        {formatMonth(label || '')}
      </p>
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR }}
        />
        <span
          className={cn(
            'text-sm font-semibold',
            isPositive ? 'text-emerald-500' : 'text-red-500'
          )}
        >
          {isPositive ? '+' : ''}{value.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export function MonthlyReturnsChart({ data, isLoading, className }: MonthlyReturnsChartProps) {
  const { t } = useLanguage();

  // Format month for X axis
  const formatXAxis = (month: string) => {
    const [, m] = month.split('-');
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return monthNames[parseInt(m) - 1] || m;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="mb-4 space-y-2">
          <div className="h-5 w-40 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-56 animate-pulse rounded bg-secondary/30" />
        </div>
        <div className="h-[300px] animate-pulse rounded-lg bg-secondary/20" />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <h3 className="mb-1 text-lg font-semibold">{t.dashboard.monthlyReturns}</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {t.dashboard.charts?.monthlySubtitle || 'Rendimiento mensual'}
        </p>
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          {t.dashboard.noData || 'No hay datos disponibles'}
        </div>
      </div>
    );
  }

  // Calculate average return
  const avgReturn = data.reduce((sum, d) => sum + d.value, 0) / data.length;
  const totalReturn = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t.dashboard.monthlyReturns}</h3>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.charts?.monthlySubtitle || 'Rendimiento mensual'}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Prom:</span>
            <span className={cn(
              'font-semibold',
              avgReturn >= 0 ? 'text-emerald-500' : 'text-red-500'
            )}>
              {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className={cn(
              'font-semibold',
              totalReturn >= 0 ? 'text-emerald-500' : 'text-red-500'
            )}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.5}
            vertical={false}
          />

          <XAxis
            dataKey="month"
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
            width={45}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.3 }} />

          <ReferenceLine
            y={0}
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />

          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: POSITIVE_COLOR }} />
          <span className="text-muted-foreground">{t.dashboard.charts?.positive || 'Positivo'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: NEGATIVE_COLOR }} />
          <span className="text-muted-foreground">{t.dashboard.charts?.negative || 'Negativo'}</span>
        </div>
      </div>
    </div>
  );
}
