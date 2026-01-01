-- =============================================
-- 004_create_metrics_cache.sql
-- Cache de métricas calculadas
-- =============================================

-- Cache de métricas por plataforma
CREATE TABLE metrics_cache (
  id SERIAL PRIMARY KEY,
  platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,

  -- Período
  period TEXT NOT NULL,                    -- 'all', '1m', '3m', '6m', '1y', 'ytd'

  -- Métricas de retorno
  total_return DECIMAL(10,4),              -- Retorno total %
  cagr DECIMAL(10,4),                      -- Compound Annual Growth Rate
  avg_monthly_return DECIMAL(10,4),        -- Retorno mensual promedio
  best_month DECIMAL(10,4),                -- Mejor mes %
  worst_month DECIMAL(10,4),               -- Peor mes %
  positive_months INT,                     -- Meses positivos
  negative_months INT,                     -- Meses negativos

  -- Métricas de riesgo
  max_drawdown DECIMAL(10,4),              -- Máximo drawdown %
  current_drawdown DECIMAL(10,4),          -- Drawdown actual %
  volatility DECIMAL(10,4),                -- Volatilidad (std dev)

  -- Métricas de ratio
  sharpe_ratio DECIMAL(10,4),              -- Sharpe ratio
  sortino_ratio DECIMAL(10,4),             -- Sortino ratio
  calmar_ratio DECIMAL(10,4),              -- Calmar ratio
  profit_factor DECIMAL(10,4),             -- Profit factor

  -- Métricas de trading
  total_trades INT,                        -- Total operaciones
  winning_trades INT,                      -- Operaciones ganadoras
  losing_trades INT,                       -- Operaciones perdedoras
  win_rate DECIMAL(6,4),                   -- Win rate %
  avg_win DECIMAL(14,2),                   -- Ganancia promedio
  avg_loss DECIMAL(14,2),                  -- Pérdida promedio
  avg_trade_duration INTERVAL,             -- Duración promedio

  -- Copy trading
  current_copiers INT,                     -- Copiadores actuales
  total_aum DECIMAL(14,2),                 -- AUM actual

  -- Timestamps
  calculated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(platform_id, period)
);

-- Métricas globales (todas las plataformas combinadas)
CREATE TABLE global_metrics_cache (
  id SERIAL PRIMARY KEY,
  period TEXT UNIQUE NOT NULL,

  -- Agregados de todas las plataformas
  total_equity DECIMAL(14,2),
  total_pnl DECIMAL(14,2),
  total_return DECIMAL(10,4),
  combined_max_drawdown DECIMAL(10,4),
  total_copiers INT,
  total_aum DECIMAL(14,2),

  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_metrics_cache_platform_period ON metrics_cache(platform_id, period);
CREATE INDEX idx_global_metrics_period ON global_metrics_cache(period);
