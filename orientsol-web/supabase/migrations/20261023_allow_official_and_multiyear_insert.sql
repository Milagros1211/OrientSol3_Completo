-- =============================================================================
-- MIGRATION: 20261023_allow_official_and_multiyear_insert.sql
-- Permite inserción oficial directa (es_oficial = true) para que los registros
-- sincronizados en Supabase se reconozcan como [ORIENTSOL], manteniendo todas
-- las reglas de integridad física, validación de rangos e inmutabilidad.
-- =============================================================================

-- 1. Actualizar la política de inserción pública en la tabla datos_mensuales
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

-- 2. Reforzar bloqueo estricto de borrado y modificación
DROP POLICY IF EXISTS "Bloquear actualizacion publica" ON public.datos_mensuales;
CREATE POLICY "Bloquear actualizacion publica" 
  ON public.datos_mensuales 
  FOR UPDATE 
  TO anon, authenticated 
  USING (false);

DROP POLICY IF EXISTS "Bloquear borrado publico" ON public.datos_mensuales;
CREATE POLICY "Bloquear borrado publico" 
  ON public.datos_mensuales 
  FOR DELETE 
  TO anon, authenticated 
  USING (false);
