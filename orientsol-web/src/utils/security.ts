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
