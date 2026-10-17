-- =============================================================================
-- MIGRACIÓN MAESTRA ORIENTSOL 4.0: IDENTIFICADOR ÚNICO (UUID) + RLS CROWDSOURCING
-- Fecha: 2026-10-17
-- Objetivos:
--   1. Convertir la clave primaria a UUID criptográfico (UUID v4) seguro e inenumerable.
--   2. Añadir columnas de autoría oficial y trazabilidad temporal.
--   3. Restringir unicidad (nombre_emplazamiento, mes) para prevenir spam y sobreescrituras.
--   4. Aplicar restricciones de integridad física (lat, lon, mes, rad, temp, nombre).
--   5. Revocar permisos destructivos (UPDATE, DELETE, TRUNCATE) para el rol anon.
--   6. Habilitar RLS con lectura libre, inserción comunitaria no destructiva y bloqueo de borrado/modificación.
-- =============================================================================

-- 1. Asegurar la extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Añadir nuevas columnas (UUID, es_oficial, creado_en) de forma segura
ALTER TABLE public.datos_mensuales 
  ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS es_oficial BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS creado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Generar UUIDs para cualquier fila existente y marcar datos actuales como oficiales
UPDATE public.datos_mensuales 
SET uuid_id = gen_random_uuid() 
WHERE uuid_id IS NULL;

UPDATE public.datos_mensuales 
SET es_oficial = true 
WHERE es_oficial = false;

-- 3. Transición segura de Clave Primaria (int8 -> UUID) si la columna actual no es UUID
DO $$
BEGIN
  -- Comprobar si la columna id actual es de tipo bigint/integer
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'datos_mensuales' 
      AND column_name = 'id' 
      AND data_type IN ('bigint', 'integer')
  ) THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT IF EXISTS datos_mensuales_pkey;
    ALTER TABLE public.datos_mensuales DROP COLUMN IF EXISTS id;
    ALTER TABLE public.datos_mensuales RENAME COLUMN uuid_id TO id;
    ALTER TABLE public.datos_mensuales ADD PRIMARY KEY (id);
  END IF;
END $$;

-- 4. Restricción de Unicidad Anti-Spam (Una ciudad no puede tener duplicado el mismo mes)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_emplazamiento_mes') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT uq_emplazamiento_mes 
      UNIQUE (nombre_emplazamiento, mes);
  END IF;
END $$;

-- 5. Restricciones de Integridad Física y Meteorológica (CWE-20 / CWE-1284)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_nombre_longitud') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_nombre_longitud 
      CHECK (char_length(trim(nombre_emplazamiento)) >= 1 AND char_length(nombre_emplazamiento) <= 200);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_latitud_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_latitud_rango 
      CHECK (latitud >= -90.0 AND latitud <= 90.0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_longitud_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_longitud_rango 
      CHECK (longitud >= -180.0 AND longitud <= 180.0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_mes_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_mes_rango 
      CHECK (mes >= 1 AND mes <= 12);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_radiacion_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_radiacion_rango 
      CHECK (radiacion_media >= 0.0 AND radiacion_media <= 450.0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_temperatura_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_temperatura_rango 
      CHECK (temp_media >= -90.0 AND temp_media <= 70.0);
  END IF;
END $$;

-- 6. Revocar permisos destructivos para usuarios anónimos a nivel de motor PostgreSQL
REVOKE UPDATE, DELETE, TRUNCATE ON public.datos_mensuales FROM anon;
GRANT SELECT, INSERT ON public.datos_mensuales TO anon, authenticated;

-- 7. Activar Row Level Security (RLS)
ALTER TABLE public.datos_mensuales ENABLE ROW LEVEL SECURITY;

-- 8. Política de Lectura Pública (Abierta para toda la comunidad)
DROP POLICY IF EXISTS "Permitir lectura publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir lectura publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- 9. Política de Inserción Abierta (Cualquiera puede aportar, pero NO como oficial y con datos validados)
DROP POLICY IF EXISTS "Permitir insercion publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir insercion publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    -- Un usuario anónimo jamás puede suplantar la etiqueta oficial
    es_oficial = false AND
    -- Validaciones de integridad física
    char_length(trim(nombre_emplazamiento)) >= 1 AND
    char_length(nombre_emplazamiento) <= 200 AND
    latitud >= -90.0 AND latitud <= 90.0 AND
    longitud >= -180.0 AND longitud <= 180.0 AND
    mes >= 1 AND mes <= 12 AND
    radiacion_media >= 0.0 AND radiacion_media <= 450.0 AND
    temp_media >= -90.0 AND temp_media <= 70.0
  );

-- 10. Bloqueo explícito de modificación y borrado para anon
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

-- 11. Índices de optimización de búsqueda y filtrado
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_emplazamiento ON public.datos_mensuales(nombre_emplazamiento);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_coords ON public.datos_mensuales(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_mes ON public.datos_mensuales(mes);
CREATE INDEX IF NOT EXISTS idx_datos_mensuales_oficial ON public.datos_mensuales(es_oficial);
