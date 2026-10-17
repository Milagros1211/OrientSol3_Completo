-- =============================================================================
-- OrientSol 4.0: Arquitectura de Datos Abiertos Seguros (Open Source Crowdsourcing)
-- Permite inserción pública de nuevos datos climáticos pero previene sabotaje y destrucción
-- =============================================================================

-- 1. Añadir columnas de trazabilidad y autoría comunitaria
ALTER TABLE public.datos_mensuales 
  ADD COLUMN IF NOT EXISTS es_oficial BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS creado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Marcar los registros históricos existentes (las 114 ciudades base) como oficiales
UPDATE public.datos_mensuales 
SET es_oficial = true 
WHERE es_oficial = false AND id <= 3652;

-- 2. Restricciones de Integridad Física (Evita datos corruptos)
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

  -- 3. Evita spam de nombres repetidos y colisiones sobre el mismo mes
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_emplazamiento_mes') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT uq_emplazamiento_mes 
      UNIQUE (nombre_emplazamiento, mes);
  END IF;
END $$;

-- 4. Revocar permisos destructivos a nivel del motor PostgreSQL para anon
REVOKE UPDATE, DELETE, TRUNCATE ON public.datos_mensuales FROM anon;
GRANT SELECT, INSERT ON public.datos_mensuales TO anon, authenticated;

-- 5. Activar Row Level Security
ALTER TABLE public.datos_mensuales ENABLE ROW LEVEL SECURITY;

-- 6. Política 1: Lectura libre y pública para todo el mundo
DROP POLICY IF EXISTS "Permitir lectura publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir lectura publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- 7. Política 2: Inserción comunitaria abierta, pero NO destructiva y validada
DROP POLICY IF EXISTS "Permitir insercion publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir insercion publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    -- Los usuarios anónimos NO pueden marcar sus datos como oficiales
    es_oficial = false AND
    -- Longitud del nombre controlada
    char_length(trim(nombre_emplazamiento)) >= 1 AND
    char_length(nombre_emplazamiento) <= 200 AND
    -- Coordenadas reales
    latitud >= -90.0 AND latitud <= 90.0 AND
    longitud >= -180.0 AND longitud <= 180.0 AND
    mes >= 1 AND mes <= 12 AND
    -- Radiación y temperatura dentro de límites terrestres
    radiacion_media >= 0.0 AND radiacion_media <= 450.0 AND
    temp_media >= -90.0 AND temp_media <= 70.0
  );

-- 8. Política 3: BLOQUEO EXPLÍCITO DE MODIFICACIÓN Y BORRADO PARA ANON
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
