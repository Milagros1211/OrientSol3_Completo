/**
 * Solar physical constants and characteristic days as defined in OrientSol
 */

/** Solar constant [W/m²] */
export const SOLAR_CONSTANT_GSC = 1367;

/**
 * Characteristic days of the year (n) for each of the 12 months,
 * used in OrientSol (DIA_INTER in MATLAB CoeficienteCalculos.m):
 * Jan 17, Feb 15 (day 46), Mar 16 (day 75), Apr 15 (day 105),
 * May 15 (day 135), Jun 10 (day 161), Jul 17 (day 198), Aug 17 (day 229),
 * Sep 16 (day 259), Oct 16 (day 289), Nov 15 (day 319), Dec 10 (day 344)
 */
export const CHARACTERISTIC_DAYS = [17, 46, 75, 105, 135, 161, 198, 229, 259, 289, 319, 344] as const;

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const;

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
