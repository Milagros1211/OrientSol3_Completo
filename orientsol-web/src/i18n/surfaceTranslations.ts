/**
 * Surface and Category translation utilities for OrientSol 4.0.
 * Ensures consistent multi-language presentation across tables, charts, and exported reports.
 */

export function getSurfaceDisplayName(
  surf: { key?: string; name: string },
  isEn: boolean
): string {
  if (!isEn) return surf.name;

  const key = surf.key || '';
  if (key === 'horizontal' || key === 'horizontal_plane') {
    return 'Horizontal Surface (beta = 0°)';
  }
  if (key === 'fixed_optimal_annual') {
    const match = surf.name.match(/beta\s*=\s*(\d+)/i);
    return match ? `Annual Optimal Fixed (beta = ${match[1]}°)` : 'Annual Optimal Fixed';
  }
  if (key === 'fixed_seasonal_4' || key === 'fixed_seasonal_4pos') {
    return 'Fixed 4 Seasonal Positions';
  }
  if (key === 'fixed_monthly_12' || key === 'fixed_monthly_12pos') {
    return 'Fixed 12 Monthly Positions';
  }
  if (key === 'tracking_1axis_horizontal' || key === 'tracking_1axis_horizontal_ew') {
    return 'Tracking 1-Axis Horizontal (E-W)';
  }
  if (key === 'tracking_1axis_azimuthal') {
    return 'Tracking 1-Axis Azimuthal';
  }
  if (key === 'tracking_1axis_polar') {
    return 'Tracking 1-Axis Polar';
  }
  if (key === 'tracking_2axis_dual') {
    return 'Full 2-Axis Tracking';
  }

  // Fallback pattern matching against Spanish titles
  const n = surf.name.toLowerCase();
  if (n.includes('horizontal') && (n.includes('beta = 0') || n.includes('0°'))) {
    return 'Horizontal Surface (beta = 0°)';
  }
  if (n.includes('óptima anual') || n.includes('optima anual')) {
    const match = surf.name.match(/beta\s*=\s*(\d+)/i);
    return match ? `Annual Optimal Fixed (beta = ${match[1]}°)` : 'Annual Optimal Fixed';
  }
  if (n.includes('estacionales')) {
    return 'Fixed 4 Seasonal Positions';
  }
  if (n.includes('mensuales')) {
    return 'Fixed 12 Monthly Positions';
  }
  if (n.includes('horizontal') && (n.includes('e-o') || n.includes('e-w'))) {
    return 'Tracking 1-Axis Horizontal (E-W)';
  }
  if (n.includes('azimutal')) {
    return 'Tracking 1-Axis Azimuthal';
  }
  if (n.includes('polar')) {
    return 'Tracking 1-Axis Polar';
  }
  if (n.includes('2 ejes') || n.includes('dual')) {
    return 'Full 2-Axis Tracking';
  }

  return surf.name;
}

export function getCategoryBadge(category: string, isEn: boolean): string {
  const cat = (category || '').toLowerCase();
  if (!isEn) {
    if (cat.includes('fij')) return 'FIJA';
    if (cat.includes('1')) return '1 EJE';
    if (cat.includes('2')) return '2 EJES';
    return category.toUpperCase();
  } else {
    if (cat.includes('fij')) return 'FIXED';
    if (cat.includes('1')) return '1-AXIS';
    if (cat.includes('2')) return '2-AXES';
    return category.toUpperCase();
  }
}
