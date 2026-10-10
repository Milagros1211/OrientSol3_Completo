-- Esquema SQL para la base de datos Supabase de OrientSol 3
-- Ejecutar este script en el SQL Editor de tu panel de Supabase (https://app.supabase.com)

CREATE TABLE IF NOT EXISTS public.climate_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT DEFAULT 'España',
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  elevation_m NUMERIC,
  monthly_gdm0 NUMERIC[] NOT NULL,
  monthly_temperature NUMERIC[] NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.climate_locations ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (cualquier usuario puede consultar los datos climáticos)
CREATE POLICY "Permitir lectura publica de climate_locations" 
  ON public.climate_locations 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Política de inserción pública o para usuarios autenticados
CREATE POLICY "Permitir insercion de climate_locations" 
  ON public.climate_locations 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Indice para busquedas por nombre y coordenadas
CREATE INDEX IF NOT EXISTS idx_climate_locations_name ON public.climate_locations(name);
CREATE INDEX IF NOT EXISTS idx_climate_locations_coords ON public.climate_locations(latitude, longitude);
