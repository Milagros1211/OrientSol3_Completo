-- =============================================================================
-- Esquema SQL oficial para la tabla "datos_mensuales" en Supabase (OrientSol 4.0)
-- Estructura normalizada por mes (12 filas por cada emplazamiento)
-- =============================================================================

-- 1. Definición de la tabla
CREATE TABLE IF NOT EXISTS public.datos_mensuales (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre_emplazamiento TEXT NOT NULL,
  latitud DOUBLE PRECISION NOT NULL,
  longitud DOUBLE PRECISION NOT NULL,
  mes BIGINT NOT NULL CHECK (mes >= 1 AND mes <= 12),
  radiacion_media DOUBLE PRECISION NOT NULL, -- Radiación mensual H_m(0) [kWh/m²/mes]
  temp_media DOUBLE PRECISION NOT NULL       -- Temperatura media mensual [°C]
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.datos_mensuales ENABLE ROW LEVEL SECURITY;

-- 3. Política de lectura pública (permite a OrientSol Web consultar los emplazamientos)
CREATE POLICY "Permitir lectura publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- 4. Política de inserción pública (permite registrar nuevos emplazamientos desde OrientSol Web)
CREATE POLICY "Permitir insercion publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- 5. Índices de optimización de búsqueda
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_emplazamiento ON public.datos_mensuales(nombre_emplazamiento);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_coords ON public.datos_mensuales(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_mes ON public.datos_mensuales(mes);
