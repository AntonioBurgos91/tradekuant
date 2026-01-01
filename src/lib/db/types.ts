/**
 * TypeScript types for database tables
 * Generated from Supabase schema
 */

export interface Database {
  public: {
    Tables: {
      platforms: {
        Row: Platform;
        Insert: Omit<Platform, 'id' | 'created_at'>;
        Update: Partial<Omit<Platform, 'id' | 'created_at'>>;
      };
      snapshots: {
        Row: Snapshot;
        Insert: Omit<Snapshot, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Snapshot, 'id' | 'created_at' | 'updated_at'>>;
      };
      trades: {
        Row: Trade;
        Insert: Omit<Trade, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Trade, 'id' | 'created_at' | 'updated_at'>>;
      };
      metrics_cache: {
        Row: MetricsCache;
        Insert: Omit<MetricsCache, 'id' | 'calculated_at'>;
        Update: Partial<Omit<MetricsCache, 'id' | 'calculated_at'>>;
      };
      global_metrics_cache: {
        Row: GlobalMetricsCache;
        Insert: Omit<GlobalMetricsCache, 'id' | 'calculated_at'>;
        Update: Partial<Omit<GlobalMetricsCache, 'id' | 'calculated_at'>>;
      };
    };
  };
}

export interface Platform {
  id: number;
  slug: 'bitget' | 'darwinex' | 'etoro';
  name: string;
  api_enabled: boolean;
  profile_url: string | null;
  color: string | null;
  created_at: string;
}

export interface Snapshot {
  id: number;
  platform_id: number;
  date: string; // ISO date string

  // Métricas principales
  equity: number;
  daily_pnl: number;
  total_pnl: number;
  total_pnl_percent: number;

  // Drawdown
  peak_equity: number | null;
  drawdown: number;

  // Copy trading
  copiers: number;
  aum: number;

  // Metadatos
  source: 'api' | 'manual';
  notes: string | null;
  raw_data: Record<string, unknown> | null;

  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: number;
  platform_id: number;

  // Identificación
  external_id: string | null;
  symbol: string;

  // Detalles
  side: 'long' | 'short';
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  leverage: number;

  // Resultados
  pnl: number | null;
  pnl_percent: number | null;
  fees: number;

  // Status
  status: 'open' | 'closed' | 'cancelled';

  // Timestamps
  opened_at: string;
  closed_at: string | null;

  // Metadatos
  notes: string | null;
  tags: string[] | null;
  raw_data: Record<string, unknown> | null;

  created_at: string;
  updated_at: string;
}

export interface MetricsCache {
  id: number;
  platform_id: number;
  period: 'all' | '1m' | '3m' | '6m' | '1y' | 'ytd';

  // Retorno
  total_return: number | null;
  cagr: number | null;
  avg_monthly_return: number | null;
  best_month: number | null;
  worst_month: number | null;
  positive_months: number | null;
  negative_months: number | null;

  // Riesgo
  max_drawdown: number | null;
  current_drawdown: number | null;
  volatility: number | null;

  // Ratios
  sharpe_ratio: number | null;
  sortino_ratio: number | null;
  calmar_ratio: number | null;
  profit_factor: number | null;

  // Trading
  total_trades: number | null;
  winning_trades: number | null;
  losing_trades: number | null;
  win_rate: number | null;
  avg_win: number | null;
  avg_loss: number | null;
  avg_trade_duration: string | null; // PostgreSQL interval as string

  // Copy trading
  current_copiers: number | null;
  total_aum: number | null;

  calculated_at: string;
}

export interface GlobalMetricsCache {
  id: number;
  period: 'all' | '1m' | '3m' | '6m' | '1y' | 'ytd';

  total_equity: number | null;
  total_pnl: number | null;
  total_return: number | null;
  combined_max_drawdown: number | null;
  total_copiers: number | null;
  total_aum: number | null;

  calculated_at: string;
}

// Helper types para frontend
export interface SnapshotWithPlatform extends Snapshot {
  platform: Platform;
}

export interface TradeWithPlatform extends Trade {
  platform: Platform;
}

export interface MetricsCacheWithPlatform extends MetricsCache {
  platform: Platform;
}
