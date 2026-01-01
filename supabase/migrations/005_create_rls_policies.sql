-- =============================================
-- 005_create_rls_policies.sql
-- Row Level Security políticas
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_metrics_cache ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS: Lectura pública
-- =============================================

CREATE POLICY "Public read platforms"
  ON platforms FOR SELECT
  USING (true);

CREATE POLICY "Public read snapshots"
  ON snapshots FOR SELECT
  USING (true);

CREATE POLICY "Public read trades"
  ON trades FOR SELECT
  USING (true);

CREATE POLICY "Public read metrics"
  ON metrics_cache FOR SELECT
  USING (true);

CREATE POLICY "Public read global_metrics"
  ON global_metrics_cache FOR SELECT
  USING (true);

-- =============================================
-- POLÍTICAS: Solo usuarios autenticados pueden escribir
-- =============================================

-- Platforms (solo lectura para todos, escritura deshabilitada)

-- Snapshots
CREATE POLICY "Auth insert snapshots"
  ON snapshots FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update snapshots"
  ON snapshots FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete snapshots"
  ON snapshots FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trades
CREATE POLICY "Auth insert trades"
  ON trades FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update trades"
  ON trades FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete trades"
  ON trades FOR DELETE
  USING (auth.role() = 'authenticated');

-- Metrics cache
CREATE POLICY "Auth insert metrics"
  ON metrics_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update metrics"
  ON metrics_cache FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete metrics"
  ON metrics_cache FOR DELETE
  USING (auth.role() = 'authenticated');

-- Global metrics cache
CREATE POLICY "Auth insert global_metrics"
  ON global_metrics_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update global_metrics"
  ON global_metrics_cache FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete global_metrics"
  ON global_metrics_cache FOR DELETE
  USING (auth.role() = 'authenticated');
