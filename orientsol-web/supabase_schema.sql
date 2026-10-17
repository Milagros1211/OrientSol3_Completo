-- =============================================================================
-- Esquema SQL oficial para la tabla "datos_mensuales" en Supabase (OrientSol 4.0)
-- Estructura normalizada por mes (12 filas por cada emplazamiento)
-- Incluye Primary Key UUID, RLS seguro para Open Source y restricciones físicas
-- =============================================================================

-- 1. Habilitar extensión pgcrypto para generación de UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Definición de la tabla
CREATE TABLE IF NOT EXISTS public.datos_mensuales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_emplazamiento TEXT NOT NULL,
  latitud DOUBLE PRECISION NOT NULL,
  longitud DOUBLE PRECISION NOT NULL,
  mes BIGINT NOT NULL,
  radiacion_media DOUBLE PRECISION NOT NULL, -- Radiación mensual H_m(0) [kWh/m²/mes]
  temp_media DOUBLE PRECISION NOT NULL,      -- Temperatura media mensual [°C]
  es_oficial BOOLEAN NOT NULL DEFAULT false, -- Identificador de fuente oficial vs comunidad
  creado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  -- Restricción de unicidad anti-spam y anti-colisión
  CONSTRAINT uq_emplazamiento_mes UNIQUE (nombre_emplazamiento, mes),

  -- Restricciones de integridad física y meteorológica (CWE-20 / CWE-1284)
  CONSTRAINT chk_nombre_longitud CHECK (char_length(trim(nombre_emplazamiento)) >= 1 AND char_length(nombre_emplazamiento) <= 200),
  CONSTRAINT chk_latitud_rango CHECK (latitud >= -90.0 AND latitud <= 90.0),
  CONSTRAINT chk_longitud_rango CHECK (longitud >= -180.0 AND longitud <= 180.0),
  CONSTRAINT chk_mes_rango CHECK (mes >= 1 AND mes <= 12),
  CONSTRAINT chk_radiacion_rango CHECK (radiacion_media >= 0.0 AND radiacion_media <= 450.0),
  CONSTRAINT chk_temperatura_rango CHECK (temp_media >= -90.0 AND temp_media <= 70.0)
);

-- 3. Revocar permisos destructivos para el rol público (anon) a nivel de motor
REVOKE UPDATE, DELETE, TRUNCATE ON public.datos_mensuales FROM anon;
GRANT SELECT, INSERT ON public.datos_mensuales TO anon, authenticated;

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.datos_mensuales ENABLE ROW LEVEL SECURITY;

-- 5. Política de lectura pública (cualquiera puede consultar los emplazamientos)
DROP POLICY IF EXISTS "Permitir lectura publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir lectura publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- 6. Política de inserción comunitaria abierta pero no destructiva
DROP POLICY IF EXISTS "Permitir insercion publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir insercion publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    es_oficial = false AND
    char_length(trim(nombre_emplazamiento)) >= 1 AND
    char_length(nombre_emplazamiento) <= 200 AND
    latitud >= -90.0 AND latitud <= 90.0 AND
    longitud >= -180.0 AND longitud <= 180.0 AND
    mes >= 1 AND mes <= 12 AND
    radiacion_media >= 0.0 AND radiacion_media <= 450.0 AND
    temp_media >= -90.0 AND temp_media <= 70.0
  );

-- 7. Bloqueo explícito de actualización y borrado para anon
DROP POLICY IF EXISTS "Bloquear actualizacion publica" ON public.datos_mensuales;
CREATE POLICY "Bloquear actualizacion publica" 
  ON public.datos_mensuales 
  FOR UPDATE 
  TO anon 
  USING (false);

DROP POLICY IF EXISTS "Bloquear borrado publico" ON public.datos_mensuales;
CREATE POLICY "Bloquear borrado publico" 
  ON public.datos_mensuales 
  FOR DELETE 
  TO anon 
  USING (false);

-- 8. Índices de optimización de búsqueda
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_emplazamiento ON public.datos_mensuales(nombre_emplazamiento);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_coords ON public.datos_mensuales(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_mes ON public.datos_mensuales(mes);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_oficial ON public.datos_mensuales(es_oficial);
