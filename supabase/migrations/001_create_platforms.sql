-- =============================================
-- 001_create_platforms.sql
-- Tabla de plataformas de trading
-- =============================================

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,           -- 'bitget', 'darwinex', 'etoro'
  name TEXT NOT NULL,                  -- 'Bitget', 'Darwinex', 'eToro'
  api_enabled BOOLEAN DEFAULT false,   -- true si tiene API automática
  profile_url TEXT,                    -- URL al perfil público
  color TEXT,                          -- Color para gráficos (#hex)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO platforms (slug, name, api_enabled, color) VALUES
  ('bitget', 'Bitget', true, '#00C896'),
  ('darwinex', 'Darwinex', true, '#1E3A5F'),
  ('etoro', 'eToro', false, '#69C53E');

-- Índices
CREATE INDEX idx_platforms_slug ON platforms(slug);
