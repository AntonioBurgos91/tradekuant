'use client';

import { MetricCard } from '@/components/common/MetricCard';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Target,
  Percent,
  BarChart3,
} from 'lucide-react';
import type { MetricsCache } from '@/lib/db/types';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

interface MetricsGridProps {
  metrics: MetricsCache | null;
  currentEquity?: number;
  totalCopiers?: number;
}

export function MetricsGrid({ metrics, currentEquity, totalCopiers }: MetricsGridProps) {
  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Cargando..."
          value="--"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Equity */}
      {currentEquity && (
        <MetricCard
          title="Equity Total"
          value={formatCurrency(currentEquity)}
          change={metrics.total_return || undefined}
          changeLabel="retorno total"
          icon={<DollarSign className="h-4 w-4" />}
          trend={metrics.total_return && metrics.total_return > 0 ? 'up' : 'down'}
        />
      )}

      {/* Total Return */}
      <MetricCard
        title="Retorno Total"
        value={formatPercent(metrics.total_return || 0, 2, true)}
        icon={<TrendingUp className="h-4 w-4" />}
        trend={metrics.total_return && metrics.total_return > 0 ? 'up' : 'down'}
        description={`CAGR: ${formatPercent(metrics.cagr || 0, 2)}`}
      />

      {/* Max Drawdown */}
      <MetricCard
        title="Max Drawdown"
        value={formatPercent(metrics.max_drawdown || 0, 2)}
        icon={<TrendingDown className="h-4 w-4" />}
        trend="down"
        description="Máximo drawdown histórico"
      />

      {/* Copiers */}
      {totalCopiers !== undefined && (
        <MetricCard
          title="Copiadores"
          value={totalCopiers.toString()}
          icon={<Users className="h-4 w-4" />}
          description={`AUM: ${formatCurrency(metrics.total_aum || 0)}`}
        />
      )}

      {/* Sharpe Ratio */}
      <MetricCard
        title="Sharpe Ratio"
        value={(metrics.sharpe_ratio || 0).toFixed(2)}
        icon={<Target className="h-4 w-4" />}
        description="Ratio riesgo/retorno"
        trend={metrics.sharpe_ratio && metrics.sharpe_ratio > 1 ? 'up' : 'neutral'}
      />

      {/* Win Rate */}
      <MetricCard
        title="Win Rate"
        value={formatPercent(metrics.win_rate || 0, 1)}
        icon={<Percent className="h-4 w-4" />}
        description={`${metrics.winning_trades || 0}/${metrics.total_trades || 0} trades`}
        trend={metrics.win_rate && metrics.win_rate > 50 ? 'up' : 'neutral'}
      />

      {/* Profit Factor */}
      <MetricCard
        title="Profit Factor"
        value={(metrics.profit_factor || 0).toFixed(2)}
        icon={<BarChart3 className="h-4 w-4" />}
        description="Ganancia/Pérdida"
        trend={metrics.profit_factor && metrics.profit_factor > 1 ? 'up' : 'down'}
      />

      {/* Sortino Ratio */}
      <MetricCard
        title="Sortino Ratio"
        value={(metrics.sortino_ratio || 0).toFixed(2)}
        icon={<Activity className="h-4 w-4" />}
        description="Downside risk"
        trend={metrics.sortino_ratio && metrics.sortino_ratio > 1 ? 'up' : 'neutral'}
      />
    </div>
  );
}
