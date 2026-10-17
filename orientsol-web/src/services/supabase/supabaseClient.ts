import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'orientsol_supabase_url';
const STORAGE_KEY_KEY = 'orientsol_supabase_anon_key';

const DEFAULT_SUPABASE_URL = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_REDACTED_ANON_KEY';

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the effective Supabase URL and Anon Key.
 * Prioritizes build-time environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
 * Falls back to localStorage, and finally to default verified credentials.
 */
export function getEffectiveSupabaseConfig(): { url: string; key: string } {
  let envUrl = '';
  let envKey = '';

  try {
    if (typeof import.meta.env.VITE_SUPABASE_URL === 'string') {
      envUrl = import.meta.env.VITE_SUPABASE_URL.trim();
    }
  } catch {}

  try {
    if (typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string') {
      envKey = import.meta.env.VITE_SUPABASE_ANON_KEY.trim();
    }
  } catch {}

  // If valid environment variables were injected at build time, ALWAYS use them!
  if (
    envUrl.length > 0 &&
    !envUrl.includes('tu-proyecto') &&
    !envUrl.includes('placeholder') &&
    envKey.length > 0 &&
    !envKey.includes('tu-anon-key') &&
    !envKey.includes('placeholder')
  ) {
    return { url: envUrl, key: envKey };
  }

  // Fallback to localStorage if any
  let storageUrl = '';
  let storageKey = '';
  try {
    if (typeof localStorage !== 'undefined') {
      storageUrl = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
      storageKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
    }
  } catch {}

  const url = storageUrl || envUrl || DEFAULT_SUPABASE_URL;
  const key = storageKey || envKey || DEFAULT_SUPABASE_ANON_KEY;

  return { url, key };
}

/**
 * Checks whether Supabase URL and Anon Key are configured and valid.
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = getEffectiveSupabaseConfig();
  return (
    url.length > 0 &&
    !url.includes('tu-proyecto') &&
    !url.includes('placeholder') &&
    key.length > 0 &&
    !key.includes('tu-anon-key') &&
    !key.includes('placeholder')
  );
}

/**
 * Returns the Supabase client singleton, or null if unconfigured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, key } = getEffectiveSupabaseConfig();

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.error('[Supabase Client] Error initializing client:', err);
      return null;
    }
  }

  return clientInstance;
}

/**
 * Saves new Supabase credentials to localStorage and re-initializes client.
 */
export function setSupabaseCredentials(url: string, key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    }
  } catch {}

  // Invalidate previous client instance
  clientInstance = null;
}

/**
 * Clears user-saved Supabase credentials from localStorage.
 */
export function clearSupabaseCredentials(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_URL);
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
  } catch {}

  clientInstance = null;
}

/**
 * Tests the connection to the configured Supabase database.
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; count?: number }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: 'Supabase no está configurado (falta URL o Clave Anon).',
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      message: 'No se pudo inicializar el cliente de Supabase.',
    };
  }

  try {
    const { count, error } = await supabase
      .from('datos_mensuales')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        ok: false,
        message: `Error al consultar la tabla datos_mensuales: ${error.message}`,
      };
    }

    return {
      ok: true,
      message: `Conexión exitosa con Supabase (${count ?? 0} emplazamientos registrados).`,
      count: count ?? 0,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: `Fallo de red o conexión: ${err.message || String(err)}`,
    };
  }
}
