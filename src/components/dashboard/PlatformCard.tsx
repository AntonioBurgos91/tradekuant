'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SparklineSVG } from './Sparkline';

interface PlatformData {
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
  sortino?: number;
  winRate?: number;
  lastUpdate: string;
}

interface PlatformCardLabels {
  return: string;
  equity: string;
  drawdown: string;
  copiers: string;
  sharpe: string;
  updated: string;
}

interface PlatformCardProps {
  platform: PlatformData;
  labels: PlatformCardLabels;
  sparklineData?: number[];
  isLoading?: boolean;
  className?: string;
}

export function PlatformCard({
  platform,
  labels,
  sparklineData,
  isLoading,
  className,
}: PlatformCardProps) {
  const isPositive = platform.return >= 0;

  // Format update time
  const formatLastUpdate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all hover:border-border hover:bg-card',
        className
      )}
    >
      {/* Top accent bar */}
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ background: platform.color }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
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
              <p
                className={cn(
                  'text-lg font-bold',
                  isPositive ? 'text-profit' : 'text-loss'
                )}
              >
                {isPositive ? '+' : ''}
                {platform.return.toFixed(2)}%
              </p>
            )}
            <p className="text-xs text-muted-foreground">{labels.return}</p>
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="mb-4 flex items-center justify-center rounded-lg bg-secondary/30 py-2 px-3">
            <SparklineSVG
              data={sparklineData}
              color={platform.color}
              width={200}
              height={32}
              className="w-full max-w-[200px]"
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="mb-1 text-xs text-muted-foreground">{labels.equity}</p>
            {isLoading ? (
              <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
            ) : (
              <p className="font-semibold">
                ${platform.equity.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="mb-1 text-xs text-muted-foreground">{labels.drawdown}</p>
            {isLoading ? (
              <div className="h-5 w-16 animate-pulse rounded bg-secondary" />
            ) : (
              <p className="font-semibold text-loss">
                {platform.drawdown.toFixed(1)}%
              </p>
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

        {/* Last Update */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {labels.updated}: {formatLastUpdate(platform.lastUpdate)}
          </span>
        </div>
      </div>
    </div>
  );
}
