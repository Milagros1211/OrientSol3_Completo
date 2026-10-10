-- =============================================================================
-- Esquema SQL para la base de datos Supabase: datos_mensuales (OrientSol 3.0)
-- Ejecuta este script en el "SQL Editor" de tu panel de Supabase (https://app.supabase.com)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.datos_mensuales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT DEFAULT 'España',
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  elevation_m NUMERIC,
  monthly_gdm0 NUMERIC[] NOT NULL,
  monthly_temperature NUMERIC[] NOT NULL,
  tonc NUMERIC DEFAULT 47.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.datos_mensuales ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (cualquier usuario anónimo puede leer los emplazamientos)
CREATE POLICY "Permitir lectura publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Política de inserción (permite ingresar nuevos emplazamientos desde OrientSol Web)
CREATE POLICY "Permitir insercion de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Índices de búsqueda para optimizar consultas por nombre y coordenadas
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_name ON public.datos_mensuales(name);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_coords ON public.datos_mensuales(latitude, longitude);
