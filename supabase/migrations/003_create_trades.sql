-- =============================================
-- 003_create_trades.sql
-- Tabla de operaciones individuales
-- =============================================

CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,

  -- Identificación
  external_id TEXT,                        -- ID de la plataforma
  symbol TEXT NOT NULL,                    -- 'BTC/USDT', 'AAPL', etc.

  -- Detalles de la operación
  side TEXT NOT NULL CHECK (side IN ('long', 'short')),
  entry_price DECIMAL(18,8) NOT NULL,
  exit_price DECIMAL(18,8),
  quantity DECIMAL(18,8) NOT NULL,
  leverage DECIMAL(4,2) DEFAULT 1,         -- 1 = sin apalancamiento

  -- Resultados
  pnl DECIMAL(14,2),                       -- Profit/Loss en USD
  pnl_percent DECIMAL(8,4),                -- Profit/Loss %
  fees DECIMAL(14,4) DEFAULT 0,            -- Comisiones pagadas

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),

  -- Timestamps
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,

  -- Metadatos
  notes TEXT,
  tags TEXT[],                             -- ['swing', 'btc', 'breakout']
  raw_data JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_trades_platform ON trades(platform_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_opened_at ON trades(opened_at DESC);
CREATE INDEX idx_trades_external_id ON trades(platform_id, external_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
