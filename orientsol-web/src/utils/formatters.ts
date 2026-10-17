/**
 * OrientSol 4.0 - Formatters Utility
 * Standardized European / Spanish number formatting:
 * - Dot (.) as thousands separator
 * - Comma (,) as decimal separator
 */

/**
 * Formats a numeric value with comma as decimal separator and dot as thousands separator.
 * @param val The number to format
 * @param decimals Number of decimal digits (default: 2)
 * @param useGrouping Whether to use dot thousands separator (default: true)
 */
export function formatNum(
  val: number | null | undefined,
  decimals: number = 2,
  useGrouping: boolean = true
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return decimals > 0 ? `0,${'0'.repeat(decimals)}` : '0';
  }

  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const parts = absVal.toFixed(decimals).split('.');

  if (useGrouping) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const formattedAbs = decimals > 0 ? `${parts[0]},${parts[1]}` : parts[0];
  return isNeg ? `-${formattedAbs}` : formattedAbs;
}

/**
 * Formats an integer with dot as thousands separator.
 * @example formatInt(1234567) => "1.234.567"
 */
export function formatInt(val: number | null | undefined): string {
  return formatNum(val ? Math.round(val) : 0, 0, true);
}

/**
 * Formats a decimal angle or single decimal value with comma.
 * @example formatAngle(35.7) => "35,7°"
 */
export function formatAngle(val: number | null | undefined, decimals: number = 1): string {
  if (val === null || val === undefined || isNaN(val)) return '0,0°';
  return `${formatNum(val, decimals, false)}°`;
}

/**
 * Formats a percentage with comma decimal and optional sign.
 * @example formatPercent(12.34, 1, true) => "+12,3%"
 * @example formatPercent(-1.99, 2) => "-1,99%"
 */
export function formatPercent(
  val: number | null | undefined,
  decimals: number = 1,
  includeSign: boolean = false
): string {
  if (val === null || val === undefined || isNaN(val)) return '0,0%';
  const numStr = formatNum(val, decimals, false);
  const sign = includeSign && val > 0 ? '+' : '';
  return `${sign}${numStr}%`;
}
