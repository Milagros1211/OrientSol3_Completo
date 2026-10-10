import type { RadiationComponentType } from '@/components/climate/OptimalAnnualStudyPanel';

export interface InclinationEvolutionChartProps {
  radiationCurve: number[]; // 91 elements (angles 1° to 91°) + index 0 for 0° (length 91 or 92)
  component: RadiationComponentType;
  optimalAngle: number;
  selectedAngleX: number;
  gridEnabled: boolean;
  isEn: boolean;
}

export interface MonthlyOptimumChartProps {
  rad0: number[];
  radOpt: number[];
  radX: number[];
  gainsPct: number[]; // vs 0°
  component: RadiationComponentType;
  optimalAngle: number;
  selectedAngleX: number;
  gridEnabled: boolean;
  isEn: boolean;
}

const MONTHS_SHORT_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_SHORT_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Renders SVG Chart 1 (MATLAB Grafica_Inclinaciones.fig / 4th image):
 * "Evolución de la radiación en función de la inclinación" across 0° to 90°.
 */
export function renderInclinationEvolutionSvg(props: InclinationEvolutionChartProps): string {
  const { radiationCurve, component, optimalAngle, selectedAngleX, gridEnabled, isEn } = props;

  const width = 820;
  const height = 360;
  const padding = { top: 50, right: 60, bottom: 50, left: 65 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Build 91 data points for angles 0° to 90°
  const curvePoints: Array<{ angle: number; rad: number }> = [];
  for (let deg = 0; deg <= 90; deg++) {
    const val = deg === 0 ? radiationCurve[0] || 0 : radiationCurve[deg] || radiationCurve[deg - 1] || 0;
    curvePoints.push({ angle: deg, rad: val });
  }

  const radValues = curvePoints.map((p) => p.rad);
  const minRad = Math.max(0, Math.floor(Math.min(...radValues) * 0.85 * 10) / 10);
  const maxRad = Math.ceil(Math.max(...radValues, 1.0) * 1.15 * 10) / 10;
  const radSpan = Math.max(0.1, maxRad - minRad);

  const xScale = (deg: number) => padding.left + (deg / 90) * plotWidth;
  const yScale = (rad: number) => padding.top + plotHeight - ((rad - minRad) / radSpan) * plotHeight;

  // Gridlines
  let gridLinesSvg = '';
  if (gridEnabled) {
    // Y-ticks (radiation)
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const val = minRad + (radSpan / ySteps) * i;
      const y = yScale(val);
      gridLinesSvg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="3,3" />
        <text x="${padding.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" text-anchor="end" font-family="monospace">${val.toFixed(1)}</text>
      `;
    }
    // X-ticks (angles 0, 10, 20 ... 90)
    for (let deg = 0; deg <= 90; deg += 10) {
      const x = xScale(deg);
      gridLinesSvg += `
        <line x1="${x}" y1="${padding.top}" x2="${x}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
        <text x="${x}" y="${height - padding.bottom + 18}" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="monospace">${deg}°</text>
      `;
    }
  } else {
    // Basic axis ticks only
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const val = minRad + (radSpan / ySteps) * i;
      const y = yScale(val);
      gridLinesSvg += `
        <text x="${padding.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" text-anchor="end" font-family="monospace">${val.toFixed(1)}</text>
      `;
    }
    for (let deg = 0; deg <= 90; deg += 15) {
      const x = xScale(deg);
      gridLinesSvg += `
        <text x="${x}" y="${height - padding.bottom + 18}" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="monospace">${deg}°</text>
      `;
    }
  }

  // Build SVG path
  const pathD = curvePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.angle).toFixed(1)} ${yScale(p.rad).toFixed(1)}`)
    .join(' ');

  // Gradient area
  const areaD = `${pathD} L ${xScale(90).toFixed(1)} ${height - padding.bottom} L ${xScale(0).toFixed(1)} ${height - padding.bottom} Z`;

  // Optimal Angle point
  const optRad = curvePoints[optimalAngle]?.rad || 0;
  const optX = xScale(optimalAngle);
  const optY = yScale(optRad);

  // Selected Angle X point
  const angleXRad = curvePoints[selectedAngleX]?.rad || 0;
  const angleXX = xScale(selectedAngleX);
  const angleXY = yScale(angleXRad);

  const compSymbol =
    component === 'global' ? 'Gdm' : component === 'beam' ? 'Bdm' : component === 'diffuse' ? 'Ddm' : 'Rdm';

  const chartTitle = isEn
    ? 'Evolution of radiation as a function of inclination'
    : 'Evolución de la radiación en función de la inclinación';

  const xLabel = isEn ? 'Inclination (°)' : 'Inclinación (°)';
  const yLabel = isEn ? 'Radiation (kWh/m²/day)' : 'Radiación (kWh/m²/día)';

  return `
    <svg viewBox="0 0 ${width} ${height}" class="opt-svg-chart" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grad-curve-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.02" />
        </linearGradient>
        <filter id="glow-opt" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.8" />
        </filter>
        <filter id="glow-anglex" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#a855f7" flood-opacity="0.8" />
        </filter>
      </defs>

      <!-- Chart Title -->
      <text x="${width / 2}" y="28" fill="#f8fafc" font-size="16" font-weight="700" text-anchor="middle">
        ${chartTitle}
      </text>

      <!-- Grid and Axes -->
      ${gridLinesSvg}

      <!-- Main Axis Lines -->
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#475569" stroke-width="1.5" />
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#475569" stroke-width="1.5" />

      <!-- Axis Labels -->
      <text x="${width / 2}" y="${height - 12}" fill="#cbd5e1" font-size="13" font-weight="600" text-anchor="middle">
        ${xLabel}
      </text>
      <text transform="rotate(-90)" x="${-height / 2}" y="20" fill="#cbd5e1" font-size="13" font-weight="600" text-anchor="middle">
        ${yLabel}
      </text>

      <!-- Shaded Area Under Curve -->
      <path d="${areaD}" fill="url(#grad-curve-fill)" />

      <!-- Continuous Radiation Curve (Celeste / Cyan) -->
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Optimal Angle Indicator (Golden Marker) -->
      <line x1="${optX}" y1="${optY}" x2="${optX}" y2="${height - padding.bottom}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3" />
      <circle cx="${optX}" cy="${optY}" r="7" fill="#fbbf24" stroke="#ffffff" stroke-width="2" filter="url(#glow-opt)" />
      <g transform="translate(${optX}, ${Math.max(padding.top + 10, optY - 14)})">
        <rect x="-42" y="-18" width="84" height="20" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" stroke-width="1" />
        <text x="0" y="-4" fill="#fef08a" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">
          ${isEn ? 'Opt' : 'Ópt'}: ${optimalAngle}° (${optRad.toFixed(2)})
        </text>
      </g>

      <!-- Selected Angle X Indicator (Purple Marker) -->
      ${
        selectedAngleX !== optimalAngle
          ? `
        <line x1="${angleXX}" y1="${angleXY}" x2="${angleXX}" y2="${height - padding.bottom}" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4,3" />
        <circle cx="${angleXX}" cy="${angleXY}" r="6.5" fill="#c084fc" stroke="#ffffff" stroke-width="2" filter="url(#glow-anglex)" />
        <g transform="translate(${angleXX}, ${Math.max(padding.top + 10, angleXY - 14)})">
          <rect x="-40" y="-18" width="80" height="20" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#a855f7" stroke-width="1" />
          <text x="0" y="-4" fill="#e9d5ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">
            X: ${selectedAngleX}° (${angleXRad.toFixed(2)})
          </text>
        </g>
      `
          : ''
      }

      <!-- Legend in Corner -->
      <g transform="translate(${width - padding.right - 100}, ${padding.top + 10})">
        <rect x="0" y="0" width="95" height="30" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.15)" />
        <line x1="12" y1="15" x2="36" y2="15" stroke="#38bdf8" stroke-width="3" />
        <text x="44" y="19" fill="#f8fafc" font-size="12" font-weight="700" font-family="monospace">${compSymbol}</text>
      </g>
    </svg>
  `;
}

/**
 * Renders SVG Chart 2 (MATLAB Grafica_OptAnual.fig / 5th image):
 * Top Chart: Monthly Radiation: Optimal vs 0° vs Angle X.
 * Bottom Chart: Monthly Gains Bar Chart (%).
 */
export function renderMonthlyOptimumAndGainsSvg(props: MonthlyOptimumChartProps): string {
  const { rad0, radOpt, radX, gainsPct, component, optimalAngle, selectedAngleX, gridEnabled, isEn } = props;
  const months = isEn ? MONTHS_SHORT_EN : MONTHS_SHORT_ES;

  const width = 820;
  const height = 480;
  const padding = { top: 40, right: 40, bottom: 40, left: 65 };

  // Two subplots: top (radiations, h=200), bottom (gains, h=160)
  const topH = 190;
  const bottomH = 150;
  const gap = 50;

  const plotW = width - padding.left - padding.right;
  const topY0 = padding.top;
  const topY1 = topY0 + topH;
  const bottomY0 = topY1 + gap;
  const bottomY1 = bottomY0 + bottomH;

  // 1. Scales for Top Plot (Radiation)
  const maxRad = Math.ceil(Math.max(...rad0, ...radOpt, ...radX, 1.0) * 1.15 * 10) / 10;
  const yTopScale = (v: number) => topY1 - (v / maxRad) * topH;

  const xMonthScale = (idx: number) => padding.left + (idx + 0.5) * (plotW / 12);

  // Top Plot Grid
  let topGrid = '';
  if (gridEnabled) {
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = (maxRad / ticks) * i;
      const y = yTopScale(v);
      topGrid += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
        <text x="${padding.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${v.toFixed(1)}</text>
      `;
    }
  } else {
    for (let i = 0; i <= 4; i++) {
      const v = (maxRad / 4) * i;
      const y = yTopScale(v);
      topGrid += `<text x="${padding.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${v.toFixed(1)}</text>`;
    }
  }

  // Top Curves
  const optLine = radOpt.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xMonthScale(i).toFixed(1)} ${yTopScale(v).toFixed(1)}`).join(' ');
  const horizLine = rad0.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xMonthScale(i).toFixed(1)} ${yTopScale(v).toFixed(1)}`).join(' ');
  const xLine = radX.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xMonthScale(i).toFixed(1)} ${yTopScale(v).toFixed(1)}`).join(' ');

  // 2. Scales for Bottom Plot (Gains %)
  const minGain = Math.floor(Math.min(...gainsPct, 0) / 10) * 10;
  const maxGain = Math.ceil(Math.max(...gainsPct, 10) / 10) * 10;
  const gainSpan = Math.max(10, maxGain - minGain);
  const yGainScale = (pct: number) => bottomY1 - ((pct - minGain) / gainSpan) * bottomH;
  const zeroY = yGainScale(0);

  // Bottom Plot Bars
  const colW = plotW / 12;
  const barW = colW * 0.45;

  const gainBars = gainsPct
    .map((pct, idx) => {
      const cx = xMonthScale(idx);
      const bx = cx - barW / 2;
      const by = Math.min(yGainScale(pct), zeroY);
      const bh = Math.max(2, Math.abs(yGainScale(pct) - zeroY));
      const color = pct >= 0 ? '#10b981' : '#f87171';

      return `
        <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="1">
          <title>${months[idx]}: ${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%</title>
        </rect>
        <text x="${cx}" y="${pct >= 0 ? by - 4 : by + bh + 12}" fill="${color}" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">
          ${pct >= 0 ? '+' : ''}${Math.round(pct)}%
        </text>
      `;
    })
    .join('');

  // Bottom Grid and Month Labels
  let bottomGrid = `
    <line x1="${padding.left}" y1="${zeroY}" x2="${width - padding.right}" y2="${zeroY}" stroke="#64748b" stroke-width="1.5" />
  `;

  months.forEach((m, idx) => {
    const cx = xMonthScale(idx);
    bottomGrid += `
      <text x="${cx}" y="${bottomY1 + 18}" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="600">${m}</text>
    `;
  });

  const compLabel =
    component === 'global' ? 'Global' : component === 'beam' ? 'Directa' : component === 'diffuse' ? 'Difusa' : 'Albedo';

  const title1 = isEn
    ? `Monthly ${compLabel} Radiation (kWh/m²/day)`
    : `Radiación ${compLabel.toLowerCase()} (kWh/m²/día)`;

  const title2 = isEn
    ? `Annual Optimal Tilt Radiation Gains (%) vs Horizontal (0°)`
    : `Ganancias de radiación para la inclinación óptima anual (%) s/ Horizontal (0°)`;

  return `
    <svg viewBox="0 0 ${width} ${height}" class="opt-svg-chart" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
      <!-- SUBPLOT 1: Monthly Radiations -->
      <text x="${width / 2}" y="24" fill="#f8fafc" font-size="15" font-weight="700" text-anchor="middle">
        ${title1}
      </text>

      ${topGrid}
      <line x1="${padding.left}" y1="${topY1}" x2="${width - padding.right}" y2="${topY1}" stroke="#475569" stroke-width="1.2" />
      <line x1="${padding.left}" y1="${topY0}" x2="${padding.left}" y2="${topY1}" stroke="#475569" stroke-width="1.2" />

      <!-- Horizontal 0° Line (Dark Cyan / Teal) -->
      <path d="${horizLine}" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-dasharray="4,3" />
      ${rad0
        .map((v, i) => `<circle cx="${xMonthScale(i)}" cy="${yTopScale(v)}" r="3.5" fill="#0ea5e9" />`)
        .join('')}

      <!-- Angle X Line (Purple) -->
      ${
        selectedAngleX !== optimalAngle
          ? `
        <path d="${xLine}" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" />
        ${radX.map((v, i) => `<circle cx="${xMonthScale(i)}" cy="${yTopScale(v)}" r="3" fill="#a855f7" />`).join('')}
      `
          : ''
      }

      <!-- Optimal Angle Line (Glowing Cyan / Amber) -->
      <path d="${optLine}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
      ${radOpt
        .map((v, i) => `<circle cx="${xMonthScale(i)}" cy="${yTopScale(v)}" r="4.5" fill="#fbbf24" stroke="#ffffff" stroke-width="1.5" />`)
        .join('')}

      <!-- Top Legend -->
      <g transform="translate(${width - padding.right - 260}, ${topY0 + 6})">
        <rect x="0" y="0" width="250" height="26" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="12" cy="13" r="4" fill="#fbbf24" />
        <text x="20" y="17" fill="#fef08a" font-size="11" font-weight="700">${isEn ? 'Opt' : 'Ópt'}. (${optimalAngle}°)</text>
        
        <circle cx="95" cy="13" r="4" fill="#0ea5e9" />
        <text x="103" y="17" fill="#7dd3fc" font-size="11" font-weight="600">0° (Horiz)</text>

        ${
          selectedAngleX !== optimalAngle
            ? `
          <circle cx="178" cy="13" r="4" fill="#a855f7" />
          <text x="186" y="17" fill="#e9d5ff" font-size="11" font-weight="600">X (${selectedAngleX}°)</text>
        `
            : ''
        }
      </g>

      <!-- SUBPLOT 2: Gains Bar Chart (%) -->
      <text x="${width / 2}" y="${bottomY0 - 14}" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">
        ${title2}
      </text>

      ${bottomGrid}
      ${gainBars}
    </svg>
  `;
}
