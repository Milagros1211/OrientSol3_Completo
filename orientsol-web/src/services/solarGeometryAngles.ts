/**
 * Solar Geometry Angles Calculation
 * Based on OrientSol 3.0 (Ec. 4.30, Ec. 4.31 and Page 220 of PFC Thesis)
 * Provides monthly computed tilt and orientation angles in degrees without Greek symbols.
 */

// Intermediate days of each month (DIA_INTER in OrientSol)
export const DIA_INTER = [17, 46, 75, 105, 135, 161, 198, 229, 259, 289, 319, 344];

/**
 * Solar declination for month i in degrees using Cooper's formula from OrientSol:
 * dec = 23.45 * sin(2*pi * (day + 284) / 365)
 */
export function getMonthlyDeclinationDeg(monthIdx: number): number {
  const day = DIA_INTER[monthIdx];
  return 23.45 * Math.sin((2 * Math.PI * (day + 284)) / 365);
}

/**
 * Solar azimuth at solar noon (12:00 solar) according to Ec. 4.31 and Page 220 of PFC OrientSol:
 * - Origin: 0° at South (positive in the afternoon to West, negative in the morning to East).
 * - At 12h:
 *   - Northern Hemisphere (lat >= 23.45°): 0.0°
 *   - Tropical North (0° < lat < 23.45°): 0.0° if declination < 0, else 180.0°
 *   - Southern Hemisphere (lat <= -23.45°): 180.0°
 *   - Tropical South (-23.45° < lat < 0°): 0.0° if declination < 0, else 180.0°
 */
export function getNoonAzimuthDeg(latDeg: number, monthIdx: number): number {
  const decli = getMonthlyDeclinationDeg(monthIdx);
  if (latDeg > 0) {
    if (latDeg < 23.45) {
      return decli < 0 ? 0.0 : 180.0;
    }
    return 0.0;
  } else if (latDeg < 0) {
    if (latDeg > -23.45) {
      return decli < 0 ? 0.0 : 180.0;
    }
    return 180.0;
  }
  return decli < 0 ? 0.0 : 180.0;
}

/**
 * Two-axis tracker tilt at solar noon (12:00 solar) according to Ec. 4.30:
 * sin(gamma_s) = sin(delta)*sin(phi) + cos(delta)*cos(phi) = cos(phi - delta)
 * gamma_s = 90° - |phi - delta|
 * Collector tilt beta = zenith angle theta_z = 90° - gamma_s = |phi - delta|
 */
export function getDualAxisNoonTiltDeg(latDeg: number, monthIdx: number): number {
  const decli = getMonthlyDeclinationDeg(monthIdx);
  return Math.abs(latDeg - decli);
}

/**
 * Orientation angle for fixed / polar surfaces:
 * Northern Hemisphere: 0.0° (facing South)
 * Southern Hemisphere: 180.0° (facing North)
 */
export function getFixedOrientationDeg(latDeg: number): number {
  return latDeg >= 0 ? 0.0 : 180.0;
}
