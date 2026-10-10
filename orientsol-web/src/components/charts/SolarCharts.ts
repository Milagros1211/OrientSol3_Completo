import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getSurfaceDisplayName } from '@/i18n/surfaceTranslations';
import { themeManager } from '@/services/theme/themeManager';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Generates an SVG Bar Chart comparing monthly solar radiation across:
 * 1. Horizontal Plane Gdm(0)
 * 2. Optimal Annual Fixed Surface
 * 3. 12 Monthly Optimum Tilts
 */
export function renderRadiationChart(res: SolarBridgeSimulationResult, isEn: boolean): string {
  const months = isEn ? MONTHS_EN : MONTHS_ES;
  const width = 800;
  const height = 320;
  const padding = { top: 40, right: 30, bottom: 50, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const hGdm = res.horizontal.gdm0;
  const optGdm = res.optimalAnnual.monthlyDailyKwh;
  const monGdm = res.monthlyOptimum12.monthlyDailyKwh;

  const isDark = themeManager.isDark();
  const plotBg = isDark ? '#08131a' : '#ffffff';
  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const tickColor = isDark ? '#9ca3af' : '#475569';
  const monthLabelColor = isDark ? '#e5e7eb' : '#0f172a';
  const axisStroke = isDark ? '#4b5563' : '#94a3b8';

  const maxVal = Math.ceil(Math.max(...hGdm, ...optGdm, ...monGdm, 1.0) * 1.15);
  const yScale = (val: number) => padding.top + chartHeight - (val / maxVal) * chartHeight;

  // Gridlines
  const yTicks = 5;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = (maxVal / yTicks) * i;
    const y = yScale(val);
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${gridStroke}" stroke-dasharray="3,3" />
      <text x="${padding.left - 10}" y="${y + 4}" fill="${tickColor}" font-size="11" text-anchor="end" font-family="monospace">${val.toFixed(1)}</text>
    `;
  }).join('');

  const colWidth = chartWidth / 12;
  const barWidth = Math.max(colWidth * 0.22, 6);

  // Bars for each month
  const bars = months.map((month, idx) => {
    const colCenterX = padding.left + idx * colWidth + colWidth / 2;

    const hVal = hGdm[idx] || 0;
    const optVal = optGdm[idx] || 0;
    const monVal = monGdm[idx] || 0;

    const yH = yScale(hVal);
    const yOpt = yScale(optVal);
    const yMon = yScale(monVal);

    const x1 = colCenterX - barWidth * 1.5 - 2;
    const x2 = colCenterX - barWidth * 0.5;
    const x3 = colCenterX + barWidth * 0.5 + 2;

    return `
      <g class="chart-month-group" data-month="${month}">
        <!-- Bar 1: Horizontal -->
        <rect x="${x1}" y="${yH}" width="${barWidth}" height="${chartHeight - (yH - padding.top)}" fill="url(#grad-horizontal)" rx="3" class="chart-bar">
          <title>${month} - Horizontal: ${hVal.toFixed(2)} kWh/m²/d</title>
        </rect>
        <!-- Bar 2: Fijo Óptimo -->
        <rect x="${x2}" y="${yOpt}" width="${barWidth}" height="${chartHeight - (yOpt - padding.top)}" fill="url(#grad-optimal)" rx="3" class="chart-bar">
          <title>${month} - ${isEn ? 'Fixed Optimal' : 'Fijo Óptimo'}: ${optVal.toFixed(2)} kWh/m²/d</title>
        </rect>
        <!-- Bar 3: Óptimo Mensual -->
        <rect x="${x3}" y="${yMon}" width="${barWidth}" height="${chartHeight - (yMon - padding.top)}" fill="url(#grad-monthly)" rx="3" class="chart-bar">
          <title>${month} - ${isEn ? 'Monthly Optimum' : 'Óptimo Mensual'} (${res.monthlyOptimum12.optimalTiltsDeg[idx]}°): ${monVal.toFixed(2)} kWh/m²/d</title>
        </rect>
        <!-- X-Axis Month Label -->
        <text x="${colCenterX}" y="${height - 20}" fill="${monthLabelColor}" font-size="12" font-weight="600" text-anchor="middle">${month}</text>
      </g>
    `;
  }).join('');

  return `
    <div class="solar-chart-card">
      <div class="chart-header">
        <div>
          <h4>${isEn ? 'Monthly Solar Radiation by Surface' : 'Radiación Solar Mensual por Superficie'}</h4>
          <span class="chart-subtitle">${isEn ? 'Daily average irradiation on collector plane (kWh/m²/day)' : 'Recurso diario incidente sobre plano captador (kWh/m²/día)'}</span>
        </div>
        <div class="chart-legend-box">
          <span class="legend-item"><span class="legend-dot dot-horiz"></span>${isEn ? 'Horizontal (0°)' : 'Horizontal (0°)'}</span>
          <span class="legend-item"><span class="legend-dot dot-opt"></span>${isEn ? `Fixed Opt (${res.optimalAnnual.optimalTiltDeg}°)` : `Fijo Óptimo (${res.optimalAnnual.optimalTiltDeg}°)`}</span>
          <span class="legend-item"><span class="legend-dot dot-month"></span>${isEn ? '12 Monthly Optimums' : '12 Óptimos Mensuales'}</span>
        </div>
      </div>
      <div class="chart-svg-container">
        <svg viewBox="0 0 ${width} ${height}" class="solar-svg-chart" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="grad-horizontal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-optimal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#d97706" stop-opacity="0.65" />
            </linearGradient>
            <linearGradient id="grad-monthly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#34d399" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#059669" stop-opacity="0.65" />
            </linearGradient>
          </defs>
          <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" fill="${plotBg}" rx="4" stroke="${axisStroke}" stroke-width="0.8" />
          ${gridLines}
          <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="${axisStroke}" stroke-width="1.5" />
          <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="${axisStroke}" stroke-width="1.5" />
          ${bars}
        </svg>
      </div>
    </div>
  `;
}

/**
 * Generates an SVG Chart showing PV Energy Generation (kWh/month) on left axis
 * and Cell / Ambient Temperatures (°C) on right axis.
 */
export function renderEnergyAndTemperatureChart(res: SolarBridgeSimulationResult, isEn: boolean): string {
  const months = isEn ? MONTHS_EN : MONTHS_ES;
  const width = 800;
  const height = 320;
  const padding = { top: 40, right: 60, bottom: 50, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const energyKwh = res.energyYield.producida.osterwald.monthlyKwh;
  const cellTemp = res.temperatures.cellOperating.monthlyCellTempOptimalC;
  const ambTemp = res.temperatures.ambient.monthlyMeanC;

  const maxEnergy = Math.ceil(Math.max(...energyKwh, 100) * 1.15 / 100) * 100;
  const maxTemp = Math.ceil(Math.max(...cellTemp, 40) * 1.2 / 10) * 10;

  const isDark = themeManager.isDark();
  const plotBg = isDark ? '#08131a' : '#ffffff';
  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const monthLabelColor = isDark ? '#e5e7eb' : '#0f172a';
  const axisStroke = isDark ? '#4b5563' : '#94a3b8';

  const yEnergyScale = (val: number) => padding.top + chartHeight - (val / maxEnergy) * chartHeight;
  const yTempScale = (val: number) => padding.top + chartHeight - (val / maxTemp) * chartHeight;

  // Gridlines based on energy (left)
  const yTicks = 5;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const valEnergy = (maxEnergy / yTicks) * i;
    const y = yEnergyScale(valEnergy);
    const valTemp = (maxTemp / yTicks) * i;
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${gridStroke}" stroke-dasharray="3,3" />
      <text x="${padding.left - 10}" y="${y + 4}" fill="#059669" font-size="11" text-anchor="end" font-family="monospace">${Math.round(valEnergy)}</text>
      <text x="${width - padding.right + 10}" y="${y + 4}" fill="#dc2626" font-size="11" text-anchor="start" font-family="monospace">${Math.round(valTemp)}°C</text>
    `;
  }).join('');

  const colWidth = chartWidth / 12;
  const barWidth = colWidth * 0.45;

  // Energy bars
  const energyBars = months.map((month, idx) => {
    const colCenterX = padding.left + idx * colWidth + colWidth / 2;
    const val = energyKwh[idx] || 0;
    const y = yEnergyScale(val);
    const barH = chartHeight - (y - padding.top);

    return `
      <rect x="${colCenterX - barWidth / 2}" y="${y}" width="${barWidth}" height="${barH}" fill="url(#grad-energy)" rx="4" class="chart-bar">
        <title>${month}: ${Math.round(val)} kWh | T_cel: ${cellTemp[idx]?.toFixed(1)}°C</title>
      </rect>
      <text x="${colCenterX}" y="${height - 20}" fill="${monthLabelColor}" font-size="12" font-weight="600" text-anchor="middle">${month}</text>
    `;
  }).join('');

  // Temperature line points
  const cellPoints = months.map((_, idx) => {
    const x = padding.left + idx * colWidth + colWidth / 2;
    const y = yTempScale(cellTemp[idx] || 0);
    return `${x},${y}`;
  }).join(' ');

  const ambPoints = months.map((_, idx) => {
    const x = padding.left + idx * colWidth + colWidth / 2;
    const y = yTempScale(ambTemp[idx] || 0);
    return `${x},${y}`;
  }).join(' ');

  // Dots
  const dots = months.map((month, idx) => {
    const x = padding.left + idx * colWidth + colWidth / 2;
    const yCell = yTempScale(cellTemp[idx] || 0);
    const yAmb = yTempScale(ambTemp[idx] || 0);
    return `
      <circle cx="${x}" cy="${yCell}" r="4.5" fill="#f87171" stroke="#111827" stroke-width="2">
        <title>${month} - ${isEn ? 'Cell Temp' : 'Temp. Célula'}: ${cellTemp[idx]?.toFixed(1)}°C</title>
      </circle>
      <circle cx="${x}" cy="${yAmb}" r="3.5" fill="#60a5fa" stroke="#111827" stroke-width="1.5">
        <title>${month} - ${isEn ? 'Ambient Temp' : 'Temp. Ambiente'}: ${ambTemp[idx]?.toFixed(1)}°C</title>
      </circle>
    `;
  }).join('');

  return `
    <div class="solar-chart-card">
      <div class="chart-header">
        <div>
          <h4>${isEn ? 'Monthly PV Energy Yield & Temperature derating' : 'Producción de Energía FV y Comportamiento Térmico'}</h4>
          <span class="chart-subtitle">${isEn ? 'Net generation (kWh) vs Operating Cell Temp Tc and Ambient Temp Tamb (°C)' : 'Generación neta (kWh) vs Temp. de Célula Tc y Ambiente Tamb (°C)'}</span>
        </div>
        <div class="chart-legend-box">
          <span class="legend-item"><span class="legend-dot dot-energy"></span>${isEn ? 'PV Yield (kWh)' : 'Producción FV (kWh)'}</span>
          <span class="legend-item"><span class="legend-dot dot-cell"></span>${isEn ? 'Cell Temp Tc (°C)' : 'Temp. Célula Tc (°C)'}</span>
          <span class="legend-item"><span class="legend-dot dot-amb"></span>${isEn ? 'Ambient Tamb (°C)' : 'Temp. Ambiente (°C)'}</span>
        </div>
      </div>
      <div class="chart-svg-container">
        <svg viewBox="0 0 ${width} ${height}" class="solar-svg-chart" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="grad-energy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#047857" stop-opacity="0.6" />
            </linearGradient>
          </defs>
          <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" fill="${plotBg}" rx="4" stroke="${axisStroke}" stroke-width="0.8" />
          ${gridLines}
          <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="${axisStroke}" stroke-width="1.5" />
          <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="${axisStroke}" stroke-width="1.5" />
          ${energyBars}
          <!-- Temperature Lines -->
          <polyline points="${ambPoints}" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-dasharray="4,4" />
          <polyline points="${cellPoints}" fill="none" stroke="#f87171" stroke-width="3" />
          ${dots}
        </svg>
      </div>
    </div>
  `;
}

/**
 * Generates an SVG Horizontal Bar Chart ranking all 8 solar collector topologies.
 */
export function renderSurfacesRankingChart(res: SolarBridgeSimulationResult, isEn: boolean): string {
  const surfaces = [...res.surfaceComparison].sort((a, b) => b.annualRadiationKwhM2 - a.annualRadiationKwhM2);
  const width = 800;
  const barHeight = 24;
  const gap = 14;
  const padding = { top: 35, right: 140, bottom: 30, left: 240 };
  const height = padding.top + padding.bottom + surfaces.length * (barHeight + gap);

  const isDark = themeManager.isDark();
  const labelColor = isDark ? '#f3f4f6' : '#0f172a';
  const numColor = isDark ? '#e5e7eb' : '#0f172a';
  const unitColor = isDark ? '#9ca3af' : '#475569';

  const maxVal = Math.max(...surfaces.map((s) => s.annualRadiationKwhM2), 100);
  const chartWidth = width - padding.left - padding.right;

  const bars = surfaces.map((surf, idx) => {
    const y = padding.top + idx * (barHeight + gap);
    const bWidth = Math.max((surf.annualRadiationKwhM2 / maxVal) * chartWidth, 10);
    const isDual = surf.key === 'tracking_2axis_dual';
    const isOptFixed = surf.key === 'fixed_optimal_annual';

    let color = '#38bdf8';
    if (isDual) color = '#ec4899';
    else if (surf.category.includes('1')) color = '#a855f7';
    else if (isOptFixed) color = '#f59e0b';
    else if (surf.key === 'horizontal_plane') color = '#64748b';

    const gainText = surf.gainOverHorizontalPct > 0 ? `+${surf.gainOverHorizontalPct.toFixed(1)}%` : 'Base (0%)';
    const displayName = getSurfaceDisplayName(surf, isEn);

    return `
      <g class="ranking-row">
        <!-- Label Left -->
        <text x="${padding.left - 12}" y="${y + barHeight * 0.7}" fill="${labelColor}" font-size="12" font-weight="${isDual || isOptFixed ? '700' : '600'}" text-anchor="end">
          ${displayName}
        </text>
        <!-- Bar -->
        <rect x="${padding.left}" y="${y}" width="${bWidth}" height="${barHeight}" fill="${color}" rx="5" opacity="0.85">
          <title>${displayName}: ${Math.round(surf.annualRadiationKwhM2)} kWh/m²·${isEn ? 'yr' : 'año'} (${gainText})</title>
        </rect>
        <!-- Number Right -->
        <text x="${padding.left + bWidth + 10}" y="${y + barHeight * 0.7}" fill="${numColor}" font-size="12" font-weight="600" font-family="monospace">
          ${Math.round(surf.annualRadiationKwhM2)} <tspan fill="${unitColor}" font-size="11">kWh/m²</tspan>
          <tspan fill="${surf.gainOverHorizontalPct > 0 ? '#16a34a' : '#dc2626'}" font-size="11" font-weight="bold"> (${gainText})</tspan>
        </text>
      </g>
    `;
  }).join('');

  return `
    <div class="solar-chart-card">
      <div class="chart-header">
        <div>
          <h4>${isEn ? 'Surface Performance Benchmark Ranking' : 'Comparativa y Ranking de Rendimiento de Superficies'}</h4>
          <span class="chart-subtitle">${isEn ? 'Annual collector irradiation (kWh/m²·year) and relative solar gain vs horizontal' : 'Irradiación anual acumulada (kWh/m²·año) y ganancia solar relativa respecto a horizontal'}</span>
        </div>
      </div>
      <div class="chart-svg-container">
        <svg viewBox="0 0 ${width} ${height}" class="solar-svg-chart" preserveAspectRatio="xMidYMid meet">
          ${bars}
        </svg>
      </div>
    </div>
  `;
}
