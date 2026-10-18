/**
 * OrientSol 4.0 - Security & Sanitization Utilities
 * Defenses against Cross-Site Scripting (XSS) and Formula Injection (CSV Injection).
 */

/**
 * Encodes special characters into safe HTML entities to prevent Cross-Site Scripting (XSS).
 * Handles string, number, or null/undefined gracefully.
 */
export function escapeHtml(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

/**
 * Sanitizes values for HTML attribute contexts (e.g. data-id="...", value="...").
 */
export function escapeAttr(value: any): string {
  return escapeHtml(value);
}

/**
 * Sanitizes cell values before exporting to CSV or Excel (.xlsx)
 * to prevent Formula / CSV Injection (CWE-1236).
 * Prepend a single quote (') if the text begins with dangerous formula triggers (=, +, -, @, |, %, tab, return).
 */
export function sanitizeForSpreadsheet(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (/^[=+@|\-%\t\r\n]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

import { securityAuditLogger } from '@/services/monitoring/securityAuditLogger';

/**
 * Strips internal stack traces, system paths, or credential details from error messages.
 * Logs the full error privately in the developer console while returning a friendly,
 * generic error message for user-facing UI notifications.
 */
export function formatSafeUserErrorMessage(error: any, fallbackSpanish: string, fallbackEnglish?: string): string {
  // 1. Log to centralized security audit logger (which redacts secrets and persists safely)
  try {
    securityAuditLogger.log({
      level: 'ERROR',
      category: 'SYSTEM',
      source: 'error-handler',
      message: typeof error === 'string' ? error : error?.message || 'Application error captured',
      metadata: { error: String(error) },
    });
  } catch (_) {
    console.error('[OrientSol Internal Error Trace]:', error);
  }


  const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
  const defaultMsg = isEn ? (fallbackEnglish || 'An unexpected error occurred. Please try again.') : fallbackSpanish;

  if (!error) return defaultMsg;

  const rawMsg = typeof error === 'string' ? error : error?.message || '';

  // If in local development mode, allow detailed error for developer diagnosis
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  if (isDev && rawMsg) {
    return rawMsg;
  }

  // 2. Filter out sensitive stack traces, DB connection strings, file paths, URLs, or secrets
  const lower = rawMsg.toLowerCase();
  if (
    lower.includes('postgres') ||
    lower.includes('supabase') ||
    lower.includes('pgrst') ||
    lower.includes('jwt') ||
    lower.includes('bearer') ||
    lower.includes('secret') ||
    lower.includes('apikey') ||
    lower.includes('api_key') ||
    lower.includes('token') ||
    lower.includes('password') ||
    lower.includes('at ') ||
    lower.includes('error:') ||
    lower.includes('webpack') ||
    lower.includes('node_modules') ||
    lower.includes('stack') ||
    lower.includes('http://') ||
    lower.includes('https://') ||
    lower.includes('.ts:') ||
    lower.includes('.js:') ||
    lower.includes('c:\\') ||
    lower.includes('/src/')
  ) {
    return defaultMsg;
  }

  // 3. Return clean, short message if it doesn't leak internals
  return rawMsg.length > 0 && rawMsg.length < 120 ? rawMsg : defaultMsg;
}


