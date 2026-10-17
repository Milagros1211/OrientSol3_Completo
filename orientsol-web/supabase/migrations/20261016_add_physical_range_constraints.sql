-- =============================================================================
-- Migración Supabase: Restricciones de integridad física y meteorológica
-- Aplicable a la tabla public.datos_mensuales (OrientSol 4.0)
-- =============================================================================

DO $$
BEGIN
  -- 1. Restricción de longitud y sanitización básica del nombre (<= 200 caracteres)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_nombre_longitud') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_nombre_longitud 
      CHECK (char_length(trim(nombre_emplazamiento)) >= 1 AND char_length(nombre_emplazamiento) <= 200);
  END IF;

  -- 2. Restricción de latitud geográfica [-90°, +90°]
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_latitud_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_latitud_rango 
      CHECK (latitud >= -90.0 AND latitud <= 90.0);
  END IF;

  -- 3. Restricción de longitud geográfica [-180°, +180°]
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_longitud_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_longitud_rango 
      CHECK (longitud >= -180.0 AND longitud <= 180.0);
  END IF;

  -- 4. Restricción de mes astronómico [1, 12]
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_mes_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_mes_rango 
      CHECK (mes >= 1 AND mes <= 12);
  END IF;

  -- 5. Restricción de radiación mensual admisible H_m(0) [0.0, 450.0 kWh/m²/mes]
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_radiacion_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_radiacion_rango 
      CHECK (radiacion_media >= 0.0 AND radiacion_media <= 450.0);
  END IF;

  -- 6. Restricción de temperatura media superficial [-90.0°C, +70.0°C]
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_temperatura_rango') THEN
    ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_temperatura_rango 
      CHECK (temp_media >= -90.0 AND temp_media <= 70.0);
  END IF;
END $$;

-- 7. Actualizar la política RLS de inserción con validaciones físicas (defensa en profundidad)
DROP POLICY IF EXISTS "Permitir insercion publica de datos_mensuales" ON public.datos_mensuales;
CREATE POLICY "Permitir insercion publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    char_length(trim(nombre_emplazamiento)) >= 1 AND
    char_length(nombre_emplazamiento) <= 200 AND
    latitud >= -90.0 AND latitud <= 90.0 AND
    longitud >= -180.0 AND longitud <= 180.0 AND
    mes >= 1 AND mes <= 12 AND
    radiacion_media >= 0.0 AND radiacion_media <= 450.0 AND
    temp_media >= -90.0 AND temp_media <= 70.0
  );
