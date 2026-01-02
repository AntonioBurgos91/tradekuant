'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  vsLastMonth?: string;
  tooltip?: string;
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  vsLastMonth,
  tooltip,
  isLoading,
  className,
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={cn('metric-card group relative', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
              {title}
            </p>
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  aria-label="Ver ayuda"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>

                {/* Tooltip */}
                {showTooltip && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 sm:w-64"
                    role="tooltip"
                  >
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                      {tooltip}
                    </div>
                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-2 w-2 rotate-45 border-b border-r border-border bg-popover" />
                  </div>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-secondary" />
          ) : (
            <p
              className={cn(
                'text-2xl font-bold',
                trend === 'up' && 'text-profit',
                trend === 'down' && 'text-loss',
                trend === 'neutral' && 'text-foreground',
                !trend && 'text-foreground'
              )}
            >
              {value}
            </p>
          )}

          {subtitle && !isLoading && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {subtitle && isLoading && (
            <div className="mt-1 h-3 w-20 animate-pulse rounded bg-secondary/70" />
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trendValue && trend && !isLoading && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-profit" />
          ) : trend === 'down' ? (
            <ArrowDownRight className="h-3 w-3 text-loss" />
          ) : null}
          <span className={cn(
            trend === 'up' && 'text-profit',
            trend === 'down' && 'text-loss'
          )}>
            {trendValue}
          </span>
          {vsLastMonth && (
            <span className="text-muted-foreground">{vsLastMonth}</span>
          )}
        </div>
      )}
    </div>
  );
}
