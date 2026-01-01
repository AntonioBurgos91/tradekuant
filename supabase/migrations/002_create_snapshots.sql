-- =============================================
-- 002_create_snapshots.sql
-- Tabla de snapshots diarios de métricas
-- =============================================

CREATE TABLE snapshots (
  id SERIAL PRIMARY KEY,
  platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Métricas principales
  equity DECIMAL(14,2) NOT NULL,           -- Capital total (USD/EUR)
  daily_pnl DECIMAL(14,2) DEFAULT 0,       -- P&L del día
  total_pnl DECIMAL(14,2) DEFAULT 0,       -- P&L acumulado total
  total_pnl_percent DECIMAL(8,4) DEFAULT 0,-- P&L % desde inicio

  -- Drawdown
  peak_equity DECIMAL(14,2),               -- Máximo equity histórico
  drawdown DECIMAL(8,4) DEFAULT 0,         -- Drawdown actual %

  -- Copy trading
  copiers INT DEFAULT 0,                   -- Número de copiadores
  aum DECIMAL(14,2) DEFAULT 0,             -- Assets Under Management

  -- Metadatos
  source TEXT DEFAULT 'api',               -- 'api' o 'manual'
  notes TEXT,                              -- Notas opcionales
  raw_data JSONB,                          -- Datos raw de la API

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(platform_id, date)
);

-- Índices para performance
CREATE INDEX idx_snapshots_platform_date ON snapshots(platform_id, date DESC);
CREATE INDEX idx_snapshots_date ON snapshots(date DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_snapshots_updated_at
  BEFORE UPDATE ON snapshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
