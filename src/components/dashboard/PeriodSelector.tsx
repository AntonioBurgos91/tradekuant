'use client';

import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type Period = '1m' | '3m' | '6m' | '1y' | 'ytd' | 'all';

interface PeriodSelectorProps {
  selected: Period;
  onChange: (period: Period) => void;
  className?: string;
}

const periods: Period[] = ['1m', '3m', '6m', '1y', 'ytd', 'all'];

export function PeriodSelector({ selected, onChange, className }: PeriodSelectorProps) {
  const { t } = useLanguage();

  const labels: Record<Period, string> = {
    '1m': t.dashboard.periodSelector?.['1m'] || '1M',
    '3m': t.dashboard.periodSelector?.['3m'] || '3M',
    '6m': t.dashboard.periodSelector?.['6m'] || '6M',
    '1y': t.dashboard.periodSelector?.['1y'] || '1Y',
    'ytd': t.dashboard.periodSelector?.['ytd'] || 'YTD',
    'all': t.dashboard.periodSelector?.['all'] || 'All',
  };

  return (
    <div className={cn('flex items-center justify-center gap-1 rounded-lg bg-secondary/30 p-1', className)}>
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
            selected === period
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          )}
        >
          {labels[period]}
        </button>
      ))}
    </div>
  );
}
