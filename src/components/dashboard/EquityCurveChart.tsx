'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// Platform configuration
const PLATFORMS = {
  bitget: { name: 'Bitget', color: '#00C896' },
  darwinex: { name: 'Darwinex', color: '#3B82F6' },
  etoro: { name: 'eToro', color: '#69C53E' },
} as const;

type PlatformKey = keyof typeof PLATFORMS;

interface EquityCurveDataPoint {
  date: string;
  bitget?: number;
  darwinex?: number;
  etoro?: number;
  total?: number;
}

interface EquityCurveChartProps {
  data: EquityCurveDataPoint[];
  isLoading?: boolean;
  className?: string;
}

// Custom tooltip component
interface TooltipEntry {
  value?: number;
  color?: string;
  dataKey?: string;
  name?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(entry.value || 0)}
            </span>
          </div>
        ))}
        <div className="mt-2 border-t border-border pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Total</span>
            <span className="text-xs font-bold text-primary">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom legend component
function CustomLegend({
  payload,
  hiddenPlatforms,
  onToggle,
}: {
  payload?: Array<{ value: string; color: string; dataKey: string }>;
  hiddenPlatforms: Set<string>;
  onToggle: (platform: string) => void;
}) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {payload.map((entry) => {
        const isHidden = hiddenPlatforms.has(entry.dataKey);
        return (
          <button
            key={entry.value}
            onClick={() => onToggle(entry.dataKey)}
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all',
              'hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
              isHidden ? 'opacity-40' : 'opacity-100'
            )}
          >
            <div
              className={cn('h-2.5 w-2.5 rounded-full transition-opacity')}
              style={{ backgroundColor: entry.color }}
            />
            <span className={cn(isHidden && 'line-through')}>{entry.value}</span>
          </button>
        );
      })}
    </div>
  );
}

export function EquityCurveChart({ data, isLoading, className }: EquityCurveChartProps) {
  const { t } = useLanguage();
  const [hiddenPlatforms, setHiddenPlatforms] = useState<Set<string>>(new Set());

  // Get available platforms from data
  const availablePlatforms = useMemo(() => {
    if (!data || data.length === 0) return [];
    const platforms: PlatformKey[] = [];
    const sample = data[0];
    if (sample.bitget !== undefined) platforms.push('bitget');
    if (sample.darwinex !== undefined) platforms.push('darwinex');
    if (sample.etoro !== undefined) platforms.push('etoro');
    return platforms;
  }, [data]);

  const togglePlatform = (platform: string) => {
    setHiddenPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  };

  // Format date for display
  const formatXAxis = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  // Format currency for Y axis
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="mb-4 space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-48 animate-pulse rounded bg-secondary/30" />
        </div>
        <div className="h-[300px] animate-pulse rounded-lg bg-secondary/20" />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <h3 className="mb-1 text-lg font-semibold">{t.dashboard.equityCurve}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t.dashboard.charts?.equitySubtitle || 'Evolución del capital'}</p>
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          {t.dashboard.noData || 'No hay datos disponibles'}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t.dashboard.equityCurve}</h3>
        <p className="text-sm text-muted-foreground">{t.dashboard.charts?.equitySubtitle || 'Evolución del capital combinado'}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {availablePlatforms.map((platform) => (
              <linearGradient
                key={`gradient-${platform}`}
                id={`gradient-${platform}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={PLATFORMS[platform].color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={PLATFORMS[platform].color}
                  stopOpacity={0.05}
                />
              </linearGradient>
            ))}
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
            tickFormatter={formatYAxis}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dx={-10}
            width={50}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            content={(props) => (
              <CustomLegend
                payload={props.payload?.map((p) => ({
                  value: p.value as string,
                  color: p.color as string,
                  dataKey: p.dataKey as string,
                }))}
                hiddenPlatforms={hiddenPlatforms}
                onToggle={togglePlatform}
              />
            )}
          />

          {availablePlatforms.map((platform) => (
            <Area
              key={platform}
              type="monotone"
              dataKey={platform}
              name={PLATFORMS[platform].name}
              stroke={PLATFORMS[platform].color}
              strokeWidth={2}
              fill={`url(#gradient-${platform})`}
              fillOpacity={1}
              hide={hiddenPlatforms.has(platform)}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
