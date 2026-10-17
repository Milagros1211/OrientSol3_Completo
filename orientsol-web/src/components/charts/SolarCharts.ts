import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getSurfaceDisplayName } from '@/i18n/surfaceTranslations';
import { themeManager } from '@/services/theme/themeManager';
import { formatNum } from '@/utils/formatters';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface ExportChartMetadata {
  title: string;
  subtitle?: string;
  locationName: string;
  latitude: number;
  fileNamePrefix: string;
  legendItems?: Array<{ label: string; color: string }>;
}

/**
 * Saves a given SVG chart locally as a high-resolution PNG or SVG vector file.
 * Handles both Dark Mode and Light Mode styles, adds clear descriptive header & watermark
 * with timestamp, and uses standard OS File Picker or direct download fallback.
 */
export async function saveSolarChartLocally(
  svgElement: SVGSVGElement,
  meta: ExportChartMetadata,
  isEn: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    }

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const fileTimestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const cleanLoc = (meta.locationName || 'Emplazamiento')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_');
    const fileNameBase = `OrientSol4_${meta.fileNamePrefix}_${cleanLoc}_${fileTimestamp}`;

    // Dimensions
    const scale = 2; // 2x High-DPI crisp export
    const vbWidth = svgElement.viewBox.baseVal?.width || 800;
    const vbHeight = svgElement.viewBox.baseVal?.height || 320;

    const hasLegend = Boolean(meta.legendItems && meta.legendItems.length > 0);
    const headerH = hasLegend ? 90 : 70;
    const footerH = 34;

    const canvasWidth = (vbWidth + 40) * scale;
    const canvasHeight = (headerH + vbHeight + footerH) * scale;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context');

    const isDark = themeManager.isDark();

    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();

    const pngBlob = await new Promise<Blob>((resolve) => {
      img.onload = () => {
        // 1. Background fill according to active theme
        ctx.fillStyle = isDark ? '#090e17' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Outer decorative card border
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(1 * scale, 1 * scale, canvas.width - 2 * scale, canvas.height - 2 * scale);

        // 3. Header title
        ctx.font = `bold ${16 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.fillText(meta.title, 25 * scale, 32 * scale);

        // 4. Subtitle and Location
        ctx.font = `normal ${11 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        const latHemi = meta.latitude >= 0 ? 'N' : 'S';
        const locDetail = `${meta.locationName} (${formatNum(Math.abs(meta.latitude), 2)}° ${latHemi})`;
        const subStr = meta.subtitle ? `${meta.subtitle} • ${locDetail}` : locDetail;
        ctx.fillText(subStr, 25 * scale, 52 * scale);

        // 5. Legend (if present)
        if (hasLegend && meta.legendItems) {
          let legX = 25 * scale;
          const legY = 72 * scale;
          ctx.font = `600 ${10 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

          for (const item of meta.legendItems) {
            // Draw color dot
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(legX + 4 * scale, legY - 3 * scale, 4 * scale, 0, Math.PI * 2);
            ctx.fill();

            // Draw label
            ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
            ctx.fillText(item.label, legX + 12 * scale, legY);
            legX += ctx.measureText(item.label).width + 24 * scale;
          }
        }

        // 6. Draw Chart SVG
        ctx.drawImage(img, 20 * scale, headerH * scale, vbWidth * scale, vbHeight * scale);

        // 7. Footer Divider & Watermark
        const footerY = (headerH + vbHeight + 10) * scale;
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';
        ctx.lineWidth = 1 * scale;
        ctx.beginPath();
        ctx.moveTo(25 * scale, footerY);
        ctx.lineTo(canvas.width - 25 * scale, footerY);
        ctx.stroke();

        ctx.font = `normal ${9.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
        const watermark = isEn
          ? `OrientSol 4.0 • Solar Radiation & PV Yield Simulation • Exported on ${dateFormatted} • Engine: Python 3.14 WASM`
          : `OrientSol 4.0 • Simulación de Radiación Solar y Rendimiento FV • Exportado el ${dateFormatted} • Motor: Python 3.14 WASM`;
        ctx.fillText(watermark, 25 * scale, (headerH + vbHeight + 24) * scale);

        URL.revokeObjectURL(svgUrl);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else resolve(svgBlob);
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        resolve(svgBlob);
      };
      img.src = svgUrl;
    });

    // 1. File System Access API
    if (typeof (window as any).showSaveFilePicker === 'function') {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `${fileNameBase}.png`,
          types: [
            {
              description: isEn ? 'PNG Image (*.png)' : 'Imagen PNG (*.png)',
              accept: { 'image/png': ['.png'] },
            },
            {
              description: isEn ? 'SVG Vector Graphic (*.svg)' : 'Gráfico Vectorial SVG (*.svg)',
              accept: { 'image/svg+xml': ['.svg'] },
            },
          ],
        });

        const chosenName: string = handle.name || `${fileNameBase}.png`;
        const writable = await handle.createWritable();
        if (chosenName.toLowerCase().endsWith('.svg')) {
          await writable.write(svgBlob);
        } else {
          await writable.write(pngBlob);
        }
        await writable.close();

        return {
          success: true,
          message: isEn ? `Chart saved locally as "${chosenName}"` : `Gráfico guardado en local como "${chosenName}"`,
        };
      } catch (err: any) {
        if (err.name === 'AbortError') return { success: false, message: '' };
        console.warn('showSaveFilePicker error, falling back to browser download:', err);
      }
    }

    // 2. Standard Browser Download fallback
    const downloadUrl = URL.createObjectURL(pngBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${fileNameBase}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

    return {
      success: true,
      message: isEn ? `Chart downloaded as "${fileNameBase}.png"` : `Gráfico descargado como "${fileNameBase}.png"`,
    };
  } catch (err: any) {
    console.error('saveSolarChartLocally error:', err);
    return {
      success: false,
      message: isEn ? `Error saving chart: ${err.message}` : `Error al guardar el gráfico: ${err.message}`,
    };
  }
}

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
        <div class="chart-title-area">
          <h4>${isEn ? 'Monthly Solar Radiation by Surface' : 'Radiación Solar Mensual por Superficie'}</h4>
          <span class="chart-subtitle">${isEn ? 'Daily average irradiation on collector plane (kWh/m²/day)' : 'Recurso diario incidente sobre plano captador (kWh/m²/día)'}</span>
        </div>
        <div class="chart-header-actions">
          <div class="chart-legend-box">
            <span class="legend-item"><span class="legend-dot dot-horiz"></span>${isEn ? 'Horizontal (0°)' : 'Horizontal (0°)'}</span>
            <span class="legend-item"><span class="legend-dot dot-opt"></span>${isEn ? `Fixed Opt (${res.optimalAnnual.optimalTiltDeg}°)` : `Fijo Óptimo (${res.optimalAnnual.optimalTiltDeg}°)`}</span>
            <span class="legend-item"><span class="legend-dot dot-month"></span>${isEn ? '12 Monthly Optimums' : '12 Óptimos Mensuales'}</span>
          </div>
          <button
            type="button"
            class="btn-save-solar-chart"
            id="btn-save-chart-radiation"
            title="${isEn ? 'Save chart locally' : 'Guardar gráfico en local'}"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>${isEn ? 'Save chart locally' : 'Guardar gráfico en local'}</span>
          </button>
        </div>
      </div>
      <div id="feedback-save-chart-radiation" class="chart-save-feedback hidden"></div>
      <div class="chart-svg-container">
        <svg id="svg-solar-radiation-chart" viewBox="0 0 ${width} ${height}" class="solar-svg-chart" preserveAspectRatio="xMidYMid meet">
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

  const isDark = themeManager.isDark();
  const plotBg = isDark ? '#08131a' : '#ffffff';
  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const monthLabelColor = isDark ? '#e5e7eb' : '#0f172a';
  const axisStroke = isDark ? '#4b5563' : '#94a3b8';

  const maxEnergy = Math.ceil(Math.max(...energyKwh, 100) * 1.15);
  const yEnergyScale = (val: number) => padding.top + chartHeight - (val / maxEnergy) * chartHeight;

  const maxTemp = Math.ceil(Math.max(...cellTemp, ...ambTemp, 30) * 1.15);
  const yTempScale = (val: number) => padding.top + chartHeight - (val / maxTemp) * chartHeight;

  // Gridlines & Axis Ticks
  const yTicks = 5;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const valE = Math.round((maxEnergy / yTicks) * i);
    const valT = Math.round((maxTemp / yTicks) * i);
    const yE = yEnergyScale(valE);

    return `
      <line x1="${padding.left}" y1="${yE}" x2="${width - padding.right}" y2="${yE}" stroke="${gridStroke}" stroke-dasharray="3,3" />
      <!-- Left Axis (Energy kWh) -->
      <text x="${padding.left - 10}" y="${yE + 4}" fill="#10b981" font-size="11" font-weight="600" text-anchor="end" font-family="monospace">${valE}</text>
      <!-- Right Axis (Temperature °C) -->
      <text x="${width - padding.right + 10}" y="${yE + 4}" fill="#f87171" font-size="11" font-weight="600" text-anchor="start" font-family="monospace">${valT}°C</text>
    `;
  }).join('');

  const colWidth = chartWidth / 12;
  const barWidth = Math.max(colWidth * 0.45, 12);

  // Bars for monthly energy
  const energyBars = months.map((month, idx) => {
    const colCenterX = padding.left + idx * colWidth + colWidth / 2;
    const valE = energyKwh[idx] || 0;
    const yE = yEnergyScale(valE);
    const barX = colCenterX - barWidth / 2;

    return `
      <g class="chart-energy-group" data-month="${month}">
        <rect x="${barX}" y="${yE}" width="${barWidth}" height="${chartHeight - (yE - padding.top)}" fill="url(#grad-energy)" rx="4" class="chart-bar">
          <title>${month} - ${isEn ? 'PV Yield' : 'Producción FV'}: ${valE} kWh</title>
        </rect>
        <text x="${colCenterX}" y="${height - 20}" fill="${monthLabelColor}" font-size="12" font-weight="600" text-anchor="middle">${month}</text>
      </g>
    `;
  }).join('');

  // Temperature Lines
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
        <div class="chart-title-area">
          <h4>${isEn ? 'Monthly PV Energy Yield & Temperature derating' : 'Producción de Energía FV y Comportamiento Térmico'}</h4>
          <span class="chart-subtitle">${isEn ? 'Net generation (kWh) vs Operating Cell Temp T<sub>C</sub> and Ambient Temp T<sub>amb</sub> (°C)' : 'Generación neta (kWh) vs Temp. de Célula T<sub>C</sub> y Ambiente T<sub>amb</sub> (°C)'}</span>
        </div>
        <div class="chart-header-actions">
          <div class="chart-legend-box">
            <span class="legend-item"><span class="legend-dot dot-energy"></span>${isEn ? 'PV Yield (kWh)' : 'Producción FV (kWh)'}</span>
            <span class="legend-item"><span class="legend-dot dot-cell"></span>${isEn ? 'Cell Temp T<sub>C</sub> (°C)' : 'Temp. Célula T<sub>C</sub> (°C)'}</span>
            <span class="legend-item"><span class="legend-dot dot-amb"></span>${isEn ? 'Ambient T<sub>amb</sub> (°C)' : 'Temp. Ambiente T<sub>amb</sub> (°C)'}</span>
          </div>
          <button
            type="button"
            class="btn-save-solar-chart"
            id="btn-save-chart-energy"
            title="${isEn ? 'Save chart locally' : 'Guardar gráfico en local'}"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>${isEn ? 'Save chart locally' : 'Guardar gráfico en local'}</span>
          </button>
        </div>
      </div>
      <div id="feedback-save-chart-energy" class="chart-save-feedback hidden"></div>
      <div class="chart-svg-container">
        <svg id="svg-solar-energy-chart" viewBox="0 0 ${width} ${height}" class="solar-svg-chart" preserveAspectRatio="xMidYMid meet">
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
        <div class="chart-title-area">
          <h4>${isEn ? 'Surface Performance Benchmark Ranking' : 'Comparativa y Ranking de Rendimiento de Superficies'}</h4>
          <span class="chart-subtitle">${isEn ? 'Annual collector irradiation (kWh/m²·year) and relative solar gain vs horizontal' : 'Irradiación anual acumulada (kWh/m²·año) y ganancia solar relativa respecto a horizontal'}</span>
        </div>
        <div class="chart-header-actions">
          <button
            type="button"
            class="btn-save-solar-chart"
            id="btn-save-chart-ranking"
            title="${isEn ? 'Save chart locally' : 'Guardar gráfico en local'}"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>${isEn ? 'Save chart locally' : 'Guardar gráfico en local'}</span>
          </button>
        </div>
      </div>
      <div id="feedback-save-chart-ranking" class="chart-save-feedback hidden"></div>
      <div class="chart-svg-container">
        <svg id="svg-surfaces-ranking-chart" viewBox="0 0 ${width} ${height}" class="solar-svg-chart" preserveAspectRatio="xMidYMid meet">
          ${bars}
        </svg>
      </div>
    </div>
  `;
}

/**
 * Attaches event listeners to the "Guardar gráfico en local" buttons on the 3 main solar charts.
 */
export function attachSolarChartsEventListeners(
  container: HTMLElement,
  res: SolarBridgeSimulationResult,
  isEn: boolean
): void {
  const setupBtn = (
    btnId: string,
    svgId: string,
    feedbackId: string,
    meta: ExportChartMetadata
  ) => {
    const btn = container.querySelector<HTMLButtonElement>(`#${btnId}`);
    const svgEl = container.querySelector<SVGSVGElement>(`#${svgId}`);
    const feedback = container.querySelector<HTMLElement>(`#${feedbackId}`);

    btn?.addEventListener('click', async () => {
      if (!svgEl) return;
      btn.disabled = true;
      btn.classList.add('loading');
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `
        <svg class="spinner-inline" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>${isEn ? 'Saving...' : 'Guardando...'}</span>
      `;

      try {
        const result = await saveSolarChartLocally(svgEl, meta, isEn);
        if (feedback) {
          if (result.success) {
            feedback.innerHTML = `
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#10b981" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>${result.message}</span>
            `;
            feedback.className = 'chart-save-feedback feedback-success';
            feedback.classList.remove('hidden');
            setTimeout(() => feedback?.classList.add('hidden'), 4500);
          } else if (result.message) {
            feedback.innerHTML = `
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ef4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>${result.message}</span>
            `;
            feedback.className = 'chart-save-feedback feedback-error';
            feedback.classList.remove('hidden');
            setTimeout(() => feedback?.classList.add('hidden'), 4500);
          }
        }
      } catch (err: any) {
        console.error('Error saving chart locally:', err);
      } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerHTML = originalHtml;
      }
    });
  };

  // 1. Radiación Solar Mensual por Superficie
  setupBtn('btn-save-chart-radiation', 'svg-solar-radiation-chart', 'feedback-save-chart-radiation', {
    title: isEn ? 'Monthly Solar Radiation by Surface' : 'Radiación Solar Mensual por Superficie',
    subtitle: isEn ? 'Daily average irradiation on collector plane (kWh/m²/day)' : 'Recurso diario incidente sobre plano captador (kWh/m²/día)',
    locationName: res.locationName,
    latitude: res.latitude,
    fileNamePrefix: 'Radiacion_Solar_Mensual_Superficies',
    legendItems: [
      { label: isEn ? 'Horizontal (0°)' : 'Horizontal (0°)', color: '#0284c7' },
      { label: isEn ? `Fixed Opt (${res.optimalAnnual.optimalTiltDeg}°)` : `Fijo Óptimo (${res.optimalAnnual.optimalTiltDeg}°)`, color: '#d97706' },
      { label: isEn ? '12 Monthly Optimums' : '12 Óptimos Mensuales', color: '#059669' },
    ],
  });

  // 2. Producción de Energía FV y Comportamiento Térmico
  setupBtn('btn-save-chart-energy', 'svg-solar-energy-chart', 'feedback-save-chart-energy', {
    title: isEn ? 'Monthly PV Energy Yield & Temperature Derating' : 'Producción de Energía FV y Comportamiento Térmico',
    subtitle: isEn ? 'Net generation (kWh) vs Operating Cell Temp TC and Ambient Temp Tamb (°C)' : 'Generación neta (kWh) vs Temp. de Célula TC y Ambiente Tamb (°C)',
    locationName: res.locationName,
    latitude: res.latitude,
    fileNamePrefix: 'Produccion_Energia_FV_Comportamiento_Termico',
    legendItems: [
      { label: isEn ? 'PV Yield (kWh)' : 'Producción FV (kWh)', color: '#059669' },
      { label: isEn ? 'Cell Temp TC (°C)' : 'Temp. Célula TC (°C)', color: '#f87171' },
      { label: isEn ? 'Ambient Tamb (°C)' : 'Temp. Ambiente Tamb (°C)', color: '#60a5fa' },
    ],
  });

  // 3. Comparativa y Ranking de Rendimiento de Superficies
  setupBtn('btn-save-chart-ranking', 'svg-surfaces-ranking-chart', 'feedback-save-chart-ranking', {
    title: isEn ? 'Surface Performance Benchmark Ranking' : 'Comparativa y Ranking de Rendimiento de Superficies',
    subtitle: isEn ? 'Annual collector irradiation (kWh/m²·year) and relative solar gain vs horizontal' : 'Irradiación anual acumulada (kWh/m²·año) y ganancia solar relativa respecto a horizontal',
    locationName: res.locationName,
    latitude: res.latitude,
    fileNamePrefix: 'Comparativa_Ranking_Rendimiento_Superficies',
  });
}
