import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import {
  getMonthlyRadiationForAngle,
  type TableRadiationComponent,
} from '@/components/climate/OptimalAnnualStudyPanel';

export type GraphComponentChoice = 'global' | 'beam' | 'diffuse' | 'albedo' | 'all';

interface OptimalAnnualGraphsProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  initialComponent?: GraphComponentChoice;
  onBack?: () => void;
  onExit?: () => void;
}

const MONTH_NAMES_SHORT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export function renderOptimalAnnualGraphsWindow(props: OptimalAnnualGraphsProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;
  const container = document.createElement('div');
  container.className = 'opt-matlab-graphs-window';
  container.id = 'opt-annual-graphs-window';

  let selectedComponent: GraphComponentChoice = props.initialComponent || 'global';
  let gridTopEnabled: boolean = true;
  let gridBottomEnabled: boolean = false;

  const optAngle = res.optimalAnnual.optimalTiltDeg;

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';

    // Component data
    const isAll = selectedComponent === 'all';
    const isAlbedo = selectedComponent === 'albedo';

    // Radiation vectors for single component
    const compKey = isAll ? 'global' : (selectedComponent as TableRadiationComponent);
    const rad0 = getMonthlyRadiationForAngle(res, compKey, 0);
    const radOpt = getMonthlyRadiationForAngle(res, compKey, optAngle);

    // All components vectors
    const allData = {
      global: {
        rad0: getMonthlyRadiationForAngle(res, 'global', 0),
        radOpt: getMonthlyRadiationForAngle(res, 'global', optAngle),
      },
      beam: {
        rad0: getMonthlyRadiationForAngle(res, 'beam', 0),
        radOpt: getMonthlyRadiationForAngle(res, 'beam', optAngle),
      },
      diffuse: {
        rad0: getMonthlyRadiationForAngle(res, 'diffuse', 0),
        radOpt: getMonthlyRadiationForAngle(res, 'diffuse', optAngle),
      },
      albedo: {
        rad0: getMonthlyRadiationForAngle(res, 'albedo', 0),
        radOpt: getMonthlyRadiationForAngle(res, 'albedo', optAngle),
      },
    };

    // Calculate gains %
    const calcGainsPct = (optArr: number[], zeroArr: number[]) =>
      optArr.map((opt, i) => (zeroArr[i] > 0 ? ((opt - zeroArr[i]) / zeroArr[i]) * 100 : 0));

    const gainsPct = isAlbedo ? new Array(12).fill(0) : calcGainsPct(radOpt, rad0);

    const allGainsPct = {
      global: calcGainsPct(allData.global.radOpt, allData.global.rad0),
      beam: calcGainsPct(allData.beam.radOpt, allData.beam.rad0),
      diffuse: calcGainsPct(allData.diffuse.radOpt, allData.diffuse.rad0),
      albedo: new Array(12).fill(0), // Rdm(0)=0 -> neutral
    };

    // Statistics for stat boxes
    const minVal = (arr: number[]) => Math.min(...arr);
    const meanVal = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const maxVal = (arr: number[]) => Math.max(...arr);

    // Component display titles
    const compName =
      selectedComponent === 'global'
        ? (isEn ? 'global' : 'global')
        : selectedComponent === 'beam'
        ? (isEn ? 'direct' : 'directa')
        : selectedComponent === 'diffuse'
        ? (isEn ? 'diffuse' : 'difusa')
        : selectedComponent === 'albedo'
        ? (isEn ? 'albedo' : 'de albedo')
        : '';

    const topPlotTitle = isAll
      ? (isEn ? 'All radiation components' : 'Todas las componentes de la radiación')
      : isEn
      ? `${compName.charAt(0).toUpperCase() + compName.slice(1)} radiation (kWh/m²/day)`
      : `Radiación ${compName} (kWh/m²/día)`;

    const bottomPlotTitle = isAll
      ? (isEn ? 'Gains of all components for annual optimal tilt' : 'Ganancias de todas las componentes para la inclinación óptima anual')
      : isEn
      ? `Gains of ${compName} radiation for annual optimal tilt`
      : `Ganancias de radiación ${compName} para la inclinación óptima anual`;

    // -------------------------------------------------------------
    // SVG 1: Top Plot (Line Chart of Radiation vs Months)
    // -------------------------------------------------------------
    const plotW = 540;
    const plotH = 200;
    const pad = { top: 32, right: 90, bottom: 35, left: 45 };
    const innerW = plotW - pad.left - pad.right;
    const innerH = plotH - pad.top - pad.bottom;

    // Y scale
    const maxRadiationY = isAll
      ? 8
      : Math.ceil(Math.max(...radOpt, ...rad0, 1.0) * 1.15);
    const yTop = (v: number) => pad.top + innerH - (Math.min(v, maxRadiationY) / maxRadiationY) * innerH;
    const xMonth = (idx: number) => pad.left + (idx / 11) * innerW;

    // Grid Top
    let gridLinesTop = '';
    const yTicksCount = maxRadiationY <= 6 ? maxRadiationY : 4;
    for (let i = 0; i <= yTicksCount; i++) {
      const v = (maxRadiationY / yTicksCount) * i;
      const y = yTop(v);
      if (gridTopEnabled) {
        gridLinesTop += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + innerW}" y2="${y}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="2,3" />`;
      }
      gridLinesTop += `<text x="${pad.left - 6}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${Math.round(v)}</text>`;
    }

    if (gridTopEnabled) {
      for (let i = 0; i < 12; i++) {
        const x = xMonth(i);
        gridLinesTop += `<line x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top + innerH}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="2,3" />`;
      }
    }

    // Line paths generator
    const makeLineD = (arr: number[]) =>
      arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xMonth(i).toFixed(1)} ${yTop(v).toFixed(1)}`).join(' ');

    let topSeriesHtml = '';
    let topLegendHtml = '';

    if (!isAll) {
      // Colors matching MATLAB
      const colorOpt =
        selectedComponent === 'beam'
          ? '#ef4444' // Red
          : selectedComponent === 'diffuse'
          ? '#84cc16' // Lime
          : selectedComponent === 'albedo'
          ? '#f59e0b' // Amber/Orange
          : '#38bdf8'; // Light Cyan (Global)

      const colorZero =
        selectedComponent === 'beam'
          ? '#f87171' // Light Red / Pink
          : selectedComponent === 'diffuse'
          ? '#15803d' // Dark Green
          : selectedComponent === 'albedo'
          ? '#92400e' // Brown
          : '#0369a1'; // Dark Cyan (0°)

      topSeriesHtml = `
        <path d="${makeLineD(radOpt)}" fill="none" stroke="${colorOpt}" stroke-width="2.6" stroke-linecap="round" />
        <path d="${makeLineD(rad0)}" fill="none" stroke="${colorZero}" stroke-width="2.6" stroke-linecap="round" />
      `;

      topLegendHtml = `
        <g transform="translate(${pad.left + innerW + 10}, ${pad.top + 5})">
          <rect x="0" y="0" width="76" height="42" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.2)" rx="3" />
          <line x1="8" y1="14" x2="26" y2="14" stroke="${colorOpt}" stroke-width="2.5" />
          <text x="32" y="17" fill="#f8fafc" font-size="10.5" font-weight="600">${isEn ? 'Opt. ann.' : 'Ópt. anu.'}</text>
          <line x1="8" y1="30" x2="26" y2="30" stroke="${colorZero}" stroke-width="2.5" />
          <text x="32" y="33" fill="#f8fafc" font-size="10.5" font-weight="600">0°</text>
        </g>
      `;
    } else {
      // 8 curves for "Todas" (Figura 5.2.109 - Image 3)
      topSeriesHtml = `
        <!-- Gdm -->
        <path d="${makeLineD(allData.global.radOpt)}" fill="none" stroke="#5dade2" stroke-width="2.4" />
        <path d="${makeLineD(allData.global.rad0)}" fill="none" stroke="#1a5276" stroke-width="2.4" />
        <!-- Bdm -->
        <path d="${makeLineD(allData.beam.radOpt)}" fill="none" stroke="#e74c3c" stroke-width="2.4" />
        <path d="${makeLineD(allData.beam.rad0)}" fill="none" stroke="#f1948a" stroke-width="2.4" />
        <!-- Ddm -->
        <path d="${makeLineD(allData.diffuse.radOpt)}" fill="none" stroke="#d4ac0d" stroke-width="2.4" />
        <path d="${makeLineD(allData.diffuse.rad0)}" fill="none" stroke="#27ae60" stroke-width="2.4" />
        <!-- Rdm -->
        <path d="${makeLineD(allData.albedo.radOpt)}" fill="none" stroke="#e67e22" stroke-width="2.4" />
        <path d="${makeLineD(allData.albedo.rad0)}" fill="none" stroke="#7e5109" stroke-width="2.4" />
      `;

      topLegendHtml = `
        <g transform="translate(${pad.left + innerW + 8}, ${pad.top - 12})">
          <rect x="0" y="0" width="80" height="152" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.2)" rx="3" />
          <!-- Gdm -->
          <line x1="6" y1="14" x2="22" y2="14" stroke="#5dade2" stroke-width="2.5" />
          <text x="26" y="17" fill="#f8fafc" font-size="9.5" font-weight="600">Gdm(ópt)</text>
          <line x1="6" y1="32" x2="22" y2="32" stroke="#1a5276" stroke-width="2.5" />
          <text x="26" y="35" fill="#f8fafc" font-size="9.5" font-weight="600">Gdm(0°)</text>
          <!-- Bdm -->
          <line x1="6" y1="50" x2="22" y2="50" stroke="#e74c3c" stroke-width="2.5" />
          <text x="26" y="53" fill="#f8fafc" font-size="9.5" font-weight="600">Bdm(ópt)</text>
          <line x1="6" y1="68" x2="22" y2="68" stroke="#f1948a" stroke-width="2.5" />
          <text x="26" y="71" fill="#f8fafc" font-size="9.5" font-weight="600">Bdm(0°)</text>
          <!-- Ddm -->
          <line x1="6" y1="86" x2="22" y2="86" stroke="#d4ac0d" stroke-width="2.5" />
          <text x="26" y="89" fill="#f8fafc" font-size="9.5" font-weight="600">Ddm(ópt)</text>
          <line x1="6" y1="104" x2="22" y2="104" stroke="#27ae60" stroke-width="2.5" />
          <text x="26" y="107" fill="#f8fafc" font-size="9.5" font-weight="600">Ddm(0°)</text>
          <!-- Rdm -->
          <line x1="6" y1="122" x2="22" y2="122" stroke="#e67e22" stroke-width="2.5" />
          <text x="26" y="125" fill="#f8fafc" font-size="9.5" font-weight="600">Rdm(ópt)</text>
          <line x1="6" y1="140" x2="22" y2="140" stroke="#7e5109" stroke-width="2.5" />
          <text x="26" y="143" fill="#f8fafc" font-size="9.5" font-weight="600">Rdm(0°)</text>
        </g>
      `;
    }

    const topSvgHtml = `
      <svg viewBox="0 0 ${plotW} ${plotH}" class="matlab-plot-svg" id="svg-matlab-rad-top">
        <!-- Title -->
        <text x="${pad.left + innerW / 2}" y="18" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">
          ${topPlotTitle}
        </text>

        <!-- Plot Area Box -->
        <rect x="${pad.left}" y="${pad.top}" width="${innerW}" height="${innerH}" fill="#0b171f" stroke="rgba(255,255,255,0.3)" stroke-width="1" />

        <!-- Grid Lines & Ticks -->
        ${gridLinesTop}

        <!-- X Axis Month Ticks -->
        ${[1, 3, 5, 7, 9, 11].map((mIdx) => `
          <text x="${xMonth(mIdx)}" y="${pad.top + innerH + 16}" fill="#94a3b8" font-size="10" text-anchor="middle">${mIdx + 1}</text>
        `).join('')}

        <!-- Axis Labels -->
        <text x="${pad.left + innerW / 2}" y="${plotH - 4}" fill="#cbd5e1" font-size="11" text-anchor="middle">
          ${isEn ? 'Months' : 'Meses'}
        </text>
        <text transform="rotate(-90)" x="${-(pad.top + innerH / 2)}" y="14" fill="#cbd5e1" font-size="11" text-anchor="middle">
          ${isEn ? 'Radiation' : 'Radiación'}
        </text>

        <!-- Plot Series -->
        ${topSeriesHtml}

        <!-- Legend -->
        ${topLegendHtml}
      </svg>
    `;

    // -------------------------------------------------------------
    // SVG 2: Bottom Plot (Bar Chart of Gains %)
    // -------------------------------------------------------------
    const bPlotW = 540;
    const bPlotH = 190;
    const bPad = { top: 28, right: 90, bottom: 35, left: 45 };
    const bInnerW = bPlotW - bPad.left - bPad.right;
    const bInnerH = bPlotH - bPad.top - bPad.bottom;

    // Y scale: min to max %
    let minG = isAll ? -50 : Math.min(...gainsPct, -10);
    let maxG = isAll ? 100 : Math.max(...gainsPct, 50);
    minG = Math.floor(minG / 20) * 20;
    maxG = Math.ceil(maxG / 20) * 20;
    if (minG > -20) minG = -20;
    if (maxG < 60) maxG = 60;

    const spanG = Math.max(1, maxG - minG);
    const yBottom = (g: number) => bPad.top + bInnerH - ((g - minG) / spanG) * bInnerH;
    const zeroY = yBottom(0);

    // Grid Bottom
    let gridLinesBottom = '';
    const gTicks = [minG, 0, Math.round(maxG / 2), maxG];
    gTicks.forEach((gVal) => {
      const y = yBottom(gVal);
      if (gridBottomEnabled) {
        gridLinesBottom += `<line x1="${bPad.left}" y1="${y}" x2="${bPad.left + bInnerW}" y2="${y}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="2,3" />`;
      }
      gridLinesBottom += `<text x="${bPad.left - 6}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${gVal}</text>`;
    });

    if (gridBottomEnabled) {
      for (let i = 0; i < 12; i++) {
        const x = bPad.left + ((i + 0.5) / 12) * bInnerW;
        gridLinesBottom += `<line x1="${x}" y1="${bPad.top}" x2="${x}" y2="${bPad.top + bInnerH}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="2,3" />`;
      }
    }

    let bottomSeriesHtml = '';
    let bottomLegendHtml = '';

    const colWidth = bInnerW / 12;

    if (!isAll) {
      // Single component bars (Figura 5.2.99 / Figura 5.2.107)
      const barWidth = colWidth * 0.65;
      bottomSeriesHtml = gainsPct.map((pct, i) => {
        const cx = bPad.left + (i + 0.5) * colWidth;
        const bx = cx - barWidth / 2;
        const by = Math.min(yBottom(pct), zeroY);
        const bh = Math.max(1, Math.abs(yBottom(pct) - zeroY));
        const barFill = pct >= 0 ? '#0f766e' : '#b91c1c';

        return `
          <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${bh.toFixed(1)}" fill="${barFill}" stroke="#14b8a6" stroke-width="0.8" />
        `;
      }).join('');

      bottomLegendHtml = `
        <g transform="translate(${bPad.left + bInnerW + 10}, ${bPad.top + 8})">
          <rect x="0" y="0" width="60" height="26" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.2)" rx="3" />
          <rect x="8" y="7" width="14" height="12" fill="#0f766e" stroke="#14b8a6" stroke-width="0.8" />
          <text x="28" y="16" fill="#f8fafc" font-size="10.5" font-weight="600">0°</text>
        </g>
      `;
    } else {
      // Clustered bars for Todas (Figura 5.2.110 - Image 3)
      const barW = colWidth * 0.2;
      const compKeys: Array<'global' | 'beam' | 'diffuse' | 'albedo'> = ['global', 'beam', 'diffuse', 'albedo'];
      const compColors = ['#0f766e', '#15803d', '#a3e635', '#fef08a'];

      bottomSeriesHtml = Array.from({ length: 12 }).map((_, mIdx) => {
        const cx = bPad.left + (mIdx + 0.5) * colWidth;
        const startX = cx - (barW * 4) / 2;

        return compKeys.map((k, kIdx) => {
          const pct = allGainsPct[k][mIdx];
          const bx = startX + kIdx * barW;
          const by = Math.min(yBottom(pct), zeroY);
          const bh = Math.max(1, Math.abs(yBottom(pct) - zeroY));
          return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" fill="${compColors[kIdx]}" stroke="#0f172a" stroke-width="0.5" />`;
        }).join('');
      }).join('');

      bottomLegendHtml = `
        <g transform="translate(${bPad.left + bInnerW + 8}, ${bPad.top + 6})">
          <rect x="0" y="0" width="76" height="84" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.2)" rx="3" />
          <rect x="6" y="8" width="14" height="10" fill="#0f766e" />
          <text x="24" y="17" fill="#f8fafc" font-size="9" font-weight="600">0°- G</text>
          <rect x="6" y="26" width="14" height="10" fill="#15803d" />
          <text x="24" y="35" fill="#f8fafc" font-size="9" font-weight="600">0°- B</text>
          <rect x="6" y="44" width="14" height="10" fill="#a3e635" />
          <text x="24" y="53" fill="#f8fafc" font-size="9" font-weight="600">0°- D</text>
          <rect x="6" y="62" width="14" height="10" fill="#fef08a" />
          <text x="24" y="71" fill="#f8fafc" font-size="9" font-weight="600">0°- R</text>
        </g>
      `;
    }

    const bottomSvgHtml = `
      <svg viewBox="0 0 ${bPlotW} ${bPlotH}" class="matlab-plot-svg" id="svg-matlab-gain-bottom">
        <!-- Title -->
        <text x="${bPad.left + bInnerW / 2}" y="16" fill="#f8fafc" font-size="11.5" font-weight="700" text-anchor="middle">
          ${bottomPlotTitle}
        </text>

        <!-- Plot Area Box -->
        <rect x="${bPad.left}" y="${bPad.top}" width="${bInnerW}" height="${bInnerH}" fill="#0b171f" stroke="rgba(255,255,255,0.3)" stroke-width="1" />

        <!-- Zero line -->
        <line x1="${bPad.left}" y1="${zeroY}" x2="${bPad.left + bInnerW}" y2="${zeroY}" stroke="#ffffff" stroke-width="1" />

        <!-- Grid Lines & Ticks -->
        ${gridLinesBottom}

        <!-- X Axis Month Ticks -->
        ${MONTH_NAMES_SHORT.map((mName, mIdx) => `
          <text x="${bPad.left + (mIdx + 0.5) * colWidth}" y="${bPad.top + bInnerH + 15}" fill="#94a3b8" font-size="10" text-anchor="middle">${mName}</text>
        `).join('')}

        <!-- Axis Labels -->
        <text x="${bPad.left + bInnerW / 2}" y="${bPlotH - 4}" fill="#cbd5e1" font-size="11" text-anchor="middle">
          ${isEn ? 'Months' : 'Meses'}
        </text>
        <text transform="rotate(-90)" x="${-(bPad.top + bInnerH / 2)}" y="14" fill="#cbd5e1" font-size="11" text-anchor="middle">
          ${isEn ? 'Gains (%)' : 'Ganancias (%)'}
        </text>

        <!-- Plot Bars -->
        ${bottomSeriesHtml}

        <!-- Legend -->
        ${bottomLegendHtml}
      </svg>
    `;

    // -------------------------------------------------------------
    // Right Side: Controls and Stat Boxes (Figuras 5.2.99 / 5.2.108)
    // -------------------------------------------------------------
    const statBoxOptHtml = `
      <div class="matlab-stat-frame">
        <div class="stat-frame-title">${isEn ? 'Annual optimal tilt' : 'Inclinación ópt. anual'}</div>
        <div class="stat-frame-row"><span>${isEn ? 'min' : 'mínimo'}</span> <strong>${minVal(radOpt).toFixed(2)}</strong></div>
        <div class="stat-frame-row"><span>${isEn ? 'mean' : 'media'}</span> <strong>${meanVal(radOpt).toFixed(2)}</strong></div>
        <div class="stat-frame-row"><span>${isEn ? 'max' : 'máximo'}</span> <strong>${maxVal(radOpt).toFixed(2)}</strong></div>
      </div>
    `;

    const statBoxHorizHtml = `
      <div class="matlab-stat-frame">
        <div class="stat-frame-title">${isEn ? 'On horizontal plane' : 'Sobre plano horizontal'}</div>
        <div class="stat-frame-row"><span>${isEn ? 'min' : 'mínimo'}</span> <strong>${minVal(rad0).toFixed(2)}</strong></div>
        <div class="stat-frame-row"><span>${isEn ? 'mean' : 'media'}</span> <strong>${meanVal(rad0).toFixed(2)}</strong></div>
        <div class="stat-frame-row"><span>${isEn ? 'max' : 'máximo'}</span> <strong>${maxVal(rad0).toFixed(2)}</strong></div>
      </div>
    `;

    const statBoxGainHtml = `
      <div class="matlab-stat-frame" style="margin-top: 1.5rem;">
        <div class="stat-frame-title">${isEn ? 'Rel. horizontal plane' : 'Res. plano horizontal'}</div>
        <div class="stat-frame-row"><span>${isEn ? 'min' : 'mínimo'}</span> <strong>${isAlbedo ? '-' : minVal(gainsPct).toFixed(2)}</strong></div>
        <div class="stat-frame-row"><span>${isEn ? 'mean' : 'media'}</span> <strong>${isAlbedo ? '-' : meanVal(gainsPct).toFixed(2)}</strong></div>
        <div class="stat-frame-row"><span>${isEn ? 'max' : 'máximo'}</span> <strong>${isAlbedo ? '-' : maxVal(gainsPct).toFixed(2)}</strong></div>
      </div>
    `;

    container.innerHTML = `
      <div class="opt-matlab-graphs-frame">
        <!-- Window Title Bar -->
        <div class="opt-graphs-header-bar">
          <div class="opt-graphs-header-left">
            <div class="opt-graphs-meta-row">
              <span class="meta-label"><strong>${isEn ? 'City:' : 'Ciudad:'}</strong> ${locationName}</span>
              <span class="meta-label" style="margin-left: 2rem;">
                <strong>${isEn ? 'Latitude (°):' : 'Latitud (°):'}</strong>
                <span style="color: #38bdf8; font-weight: 700;">${latitude.toFixed(2)}</span>
              </span>
            </div>
            <div class="opt-graphs-study-row">
              <span class="meta-label">
                <strong>${isEn ? 'Study:' : 'Estudio:'}</strong>
                <span style="color: #60a5fa; font-weight: 600;">${isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual'}</span>
              </span>
            </div>
          </div>
          <div class="opt-graphs-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>3.0</strong>
            </div>
          </div>
        </div>

        <!-- Main Body: Plots Column (Left) + Controls Column (Right) -->
        <div class="opt-graphs-main-layout">
          <!-- Left: 2 Plots -->
          <div class="opt-graphs-plots-col">
            <!-- Top Plot -->
            <div class="matlab-plot-card">
              ${topSvgHtml}
              <div class="matlab-plot-footer">
                <label class="matlab-grid-toggle">
                  <input type="checkbox" id="chk-grid-top" ${gridTopEnabled ? 'checked' : ''} />
                  <span>${isEn ? 'Enable grid' : 'Activar rejilla'}</span>
                </label>
              </div>
            </div>

            <!-- Bottom Plot -->
            <div class="matlab-plot-card" style="margin-top: 1rem;">
              ${bottomSvgHtml}
              <div class="matlab-plot-footer">
                <label class="matlab-grid-toggle">
                  <input type="checkbox" id="chk-grid-bottom" ${gridBottomEnabled ? 'checked' : ''} />
                  <span>${isEn ? 'Enable grid' : 'Activar rejilla'}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Right: Component Selector & Stat Boxes -->
          <div class="opt-graphs-side-col">
            <!-- Component Selector -->
            <div class="matlab-comp-picker-box">
              <label for="select-graph-component" class="matlab-picker-label">
                ${isEn ? 'Select a component:' : 'Seleccione una componente:'}
              </label>
              <select id="select-graph-component" class="matlab-picker-select">
                <option value="global" ${selectedComponent === 'global' ? 'selected' : ''}>${isEn ? 'Global' : 'Global'}</option>
                <option value="beam" ${selectedComponent === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
                <option value="diffuse" ${selectedComponent === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
                <option value="albedo" ${selectedComponent === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
                <option value="all" ${selectedComponent === 'all' ? 'selected' : ''}>${isEn ? 'All' : 'Todas'}</option>
              </select>

              <div class="matlab-opt-angle-tag">
                ${isEn ? 'Optimal angle:' : 'Ángulo óptimo:'} <strong>${optAngle} °</strong>
              </div>
            </div>

            <!-- Stat Boxes (Hidden when Todas is selected) -->
            ${!isAll ? `
              <div class="matlab-stat-boxes-container">
                ${statBoxOptHtml}
                ${statBoxHorizHtml}
                ${statBoxGainHtml}
              </div>
            ` : ''}

            <!-- Bottom Action Buttons -->
            <div class="matlab-graphs-actions-row">
              <button type="button" id="btn-graphs-volver" class="matlab-btn-default" style="flex: 1;">
                ${isEn ? 'Back' : 'Volver'}
              </button>
              <button type="button" id="btn-graphs-salir" class="matlab-btn-default btn-salir" style="flex: 1;">
                ${isEn ? 'Exit' : 'Salir'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    // 1. Component Dropdown
    const compSelect = container.querySelector<HTMLSelectElement>('#select-graph-component');
    compSelect?.addEventListener('change', () => {
      selectedComponent = (compSelect.value || 'global') as GraphComponentChoice;
      renderInternal();
    });

    // 2. Grid Toggles
    const chkGridTop = container.querySelector<HTMLInputElement>('#chk-grid-top');
    chkGridTop?.addEventListener('change', () => {
      gridTopEnabled = Boolean(chkGridTop.checked);
      renderInternal();
    });

    const chkGridBottom = container.querySelector<HTMLInputElement>('#chk-grid-bottom');
    chkGridBottom?.addEventListener('change', () => {
      gridBottomEnabled = Boolean(chkGridBottom.checked);
      renderInternal();
    });

    // 3. Volver Button
    const btnVolver = container.querySelector<HTMLButtonElement>('#btn-graphs-volver');
    btnVolver?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    // 4. Salir Button
    const btnSalir = container.querySelector<HTMLButtonElement>('#btn-graphs-salir');
    btnSalir?.addEventListener('click', () => {
      if (onExit) onExit();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  renderInternal();
  return container;
}
