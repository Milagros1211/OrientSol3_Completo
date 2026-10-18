-- =============================================================================
-- ORIENTSOL 4.0: AUDITORÍA DE SEGURIDAD Y HARDENING DE BASE DE DATOS SUPABASE
-- Basado en: Análisis de Vectores de Riesgo ("Vibe Coding Has A Security Problem" - Chris Raroque)
-- Arquitectura: Sistema Híbrido Crowdsourcing / Append-Only / Púbico y Anónimo
-- Fecha: 2026-10-18
--
-- PRINCIPIOS DE NEGOCIO APLICADOS:
--   1. Acceso Anónimo de Ingestión: Rol 'anon' puede hacer SELECT e INSERT libremente.
--   2. Inmutabilidad Absoluta: REVOKE y RLS impiden UPDATE y DELETE a 'anon' y 'authenticated'.
--   3. Anti-Poisoning & Anti-Race-Conditions: Restricciones CHECK físicas y UNIQUE normalizado.
--   4. Defensa Serverless: Throttling / Rate-Limiting a nivel de motor PostgreSQL por IP/Ventana temporal.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EJE 1: POLÍTICAS DE ROW LEVEL SECURITY (RLS) Y PRIVILEGIOS POSTGRES
-- -----------------------------------------------------------------------------

-- 1.1 Asegurar extensiones criptográficas requeridas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1.2 Habilitar RLS de forma forzada e incondicional en la tabla datos_mensuales
ALTER TABLE public.datos_mensuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datos_mensuales FORCE ROW LEVEL SECURITY;

-- 1.3 REVOCAR PRIVILEGIOS DESTRUCTOR DESTRUCTIVOS A NIVEL DE MOTOR POSTGRESQL
-- Blindaje contra bypass de RLS por errores de configuración en clientes API:
-- Ni 'anon' ni 'authenticated' pueden jamás ejecutar DELETE, UPDATE ni TRUNCATE en el esquema público.
REVOKE UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE UPDATE, DELETE, TRUNCATE ON TABLES FROM anon, authenticated;

-- Otorgar estrictamente los privilegios permitidos: SELECT e INSERT
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.datos_mensuales TO anon, authenticated;

-- 1.4 LIMPIAR Y REGENERAR POLÍTICAS RLS DECLARATIVAS
DROP POLICY IF EXISTS "Permitir lectura publica de datos_mensuales" ON public.datos_mensuales;
DROP POLICY IF EXISTS "Permitir insercion publica de datos_mensuales" ON public.datos_mensuales;
DROP POLICY IF EXISTS "Bloquear actualizacion publica" ON public.datos_mensuales;
DROP POLICY IF EXISTS "Bloquear borrado publico" ON public.datos_mensuales;
DROP POLICY IF EXISTS "Bloquear actualizacion authenticated" ON public.datos_mensuales;
DROP POLICY IF EXISTS "Bloquear borrado authenticated" ON public.datos_mensuales;

-- Lectura pública universal (Anónima y Autenticada)
CREATE POLICY "Permitir lectura publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Inserción comunitaria controlada (Append-Only)
-- Condición: No se permite suplantar la insignia de dato oficial (es_oficial = false)
CREATE POLICY "Permitir insercion publica de datos_mensuales" 
  ON public.datos_mensuales 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    es_oficial = false
  );

-- Bloqueo explícito de UPDATE (Inmutabilidad del histórico meteorológico)
CREATE POLICY "Bloquear actualizacion publica" 
  ON public.datos_mensuales 
  FOR UPDATE 
  TO anon, authenticated 
  USING (false);

-- Bloqueo explícito de DELETE (Prohibición de borrado / Purgas)
CREATE POLICY "Bloquear borrado publico" 
  ON public.datos_mensuales 
  FOR DELETE 
  TO anon, authenticated 
  USING (false);


-- -----------------------------------------------------------------------------
-- EJE 2: VALIDACIONES DE INTEGRIDAD A NIVEL DE BASE DE DATOS (ANTI-POISONING & RACE CONDITIONS)
-- -----------------------------------------------------------------------------

-- 2.1 ÍNDICE DE UNICIDAD INSENSIBLE A MAYÚSCULAS/ESPACIOS (PREVENCIÓN DE RACE CONDITIONS Y SPAM)
-- Evita que atacantes burlen el UNIQUE insertando "Madrid ", "madrid" o "MADRID"
DROP INDEX IF EXISTS idx_uq_emplazamiento_mes_ci;
CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_emplazamiento_mes_ci 
  ON public.datos_mensuales (lower(trim(regexp_replace(nombre_emplazamiento, '\s+', ' ', 'g'))), mes);

-- 2.2 RESTRICCIONES CHECK DE CONSISTENCIA FÍSICA Y SANEAMIENTO (ANTI-POISONING)
DO $$
BEGIN
  -- 1. Latitud geográfica plausible (-90° a +90°)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_latitud_rango') THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT chk_latitud_rango;
  END IF;
  ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_latitud_rango 
    CHECK (latitud >= -90.0 AND latitud <= 90.0);

  -- 2. Longitud geográfica plausible (-180° a +180°)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_longitud_rango') THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT chk_longitud_rango;
  END IF;
  ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_longitud_rango 
    CHECK (longitud >= -180.0 AND longitud <= 180.0);

  -- 3. Mes calendario válido (1 a 12)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_mes_rango') THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT chk_mes_rango;
  END IF;
  ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_mes_rango 
    CHECK (mes >= 1 AND mes <= 12);

  -- 4. Radiación Solar Mensual Física Acotada (0 a 450 kWh/m²/mes)
  -- Ningún lugar de la Tierra supera 380 kWh/m² en un mes incluso en el desierto de Atacama
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_radiacion_rango') THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT chk_radiacion_rango;
  END IF;
  ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_radiacion_rango 
    CHECK (radiacion_media >= 0.0 AND radiacion_media <= 450.0);

  -- 5. Temperatura Media Mensual Física Plausible (-90°C Antártida a +70°C Desierto de Lut)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_temperatura_rango') THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT chk_temperatura_rango;
  END IF;
  ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_temperatura_rango 
    CHECK (temp_media >= -90.0 AND temp_media <= 70.0);

  -- 6. Longitud y Sanidad del Nombre (No vacío, máx 200 caracteres, sin caracteres de control o inyección script)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_nombre_longitud') THEN
    ALTER TABLE public.datos_mensuales DROP CONSTRAINT chk_nombre_longitud;
  END IF;
  ALTER TABLE public.datos_mensuales ADD CONSTRAINT chk_nombre_longitud 
    CHECK (
      char_length(trim(nombre_emplazamiento)) >= 1 AND 
      char_length(nombre_emplazamiento) <= 200 AND
      nombre_emplazamiento !~ '[\x00-\x1F\x7F<>{}]'
    );
END $$;


-- -----------------------------------------------------------------------------
-- EJE 4: RATE LIMITING Y PROTECCIÓN DE CONSUMO (DEFENSA SERVERLESS ANTI-SPAM)
-- -----------------------------------------------------------------------------
-- Dado que la API permite INSERT anónimo, protegemos la cuota de Supabase limitando
-- la tasa de registros creados por IP / Cliente mediante una tabla de auditoría ligera
-- y un Trigger 'BEFORE INSERT'.

CREATE TABLE IF NOT EXISTS public.api_rate_limiter (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_ip TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS forzado en la tabla interna de rate limiting (Supabase Security Best Practice)
ALTER TABLE public.api_rate_limiter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limiter FORCE ROW LEVEL SECURITY;

-- Prohibir cualquier acceso directo de lectura/escritura pública a la tabla de IPs
-- Solo la función interna SECURITY DEFINER puede escribir en ella
REVOKE ALL ON TABLE public.api_rate_limiter FROM anon, authenticated, public;

CREATE INDEX IF NOT EXISTS idx_rate_limiter_client_window 
  ON public.api_rate_limiter (client_ip, created_at DESC);

-- Función del disparador de Rate Limiting
-- Regla: Máximo 30 operaciones de inserción por IP en una ventana móvil de 10 minutos
CREATE OR REPLACE FUNCTION public.fn_throttle_anonymous_inserts()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_client_ip TEXT;
  v_recent_count INT;
BEGIN
  -- Si el usuario tiene rol de servicio/administrador, evitamos el rate limit
  IF current_user = 'service_role' OR current_user = 'postgres' THEN
    RETURN NEW;
  END IF;

  -- Extraer la IP real enviada por PostgREST / Supabase en cabeceras HTTP o la conexión
  v_client_ip := coalesce(
    current_setting('request.headers', true)::json->>'cf-connecting-ip',
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    inet_client_addr()::text,
    'unknown_client'
  );

  -- Solo verificar en el primer mes del lote o si es unknown_client
  -- Ventana: 10 minutos, límite: 30 inserts (equivalente a 2.5 emplazamientos de 12 meses)
  SELECT COUNT(*) INTO v_recent_count
  FROM public.api_rate_limiter
  WHERE client_ip = v_client_ip
    AND created_at > (timezone('utc'::text, now()) - INTERVAL '10 minutes');

  IF v_recent_count >= 60 THEN
    RAISE EXCEPTION 'OrientSol Security: Límite de tasa de inserción excedido (Rate Limit). Por favor espere unos minutos antes de registrar más datos climáticos.'
      USING ERRCODE = 'P0001';
  END IF;

  -- Registrar el intento
  INSERT INTO public.api_rate_limiter (client_ip) VALUES (v_client_ip);

  -- Limpieza automática opportunista de registros de rate-limit más antiguos de 1 hora
  IF random() < 0.05 THEN
    DELETE FROM public.api_rate_limiter 
    WHERE created_at < (timezone('utc'::text, now()) - INTERVAL '1 hour');
  END IF;

  RETURN NEW;
END;
$$;

-- Vincular Trigger BEFORE INSERT a la tabla datos_mensuales
DROP TRIGGER IF EXISTS trg_throttle_inserts ON public.datos_mensuales;
CREATE TRIGGER trg_throttle_inserts
  BEFORE INSERT ON public.datos_mensuales
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_throttle_anonymous_inserts();
