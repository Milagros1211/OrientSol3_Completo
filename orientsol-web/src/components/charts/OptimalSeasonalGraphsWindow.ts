import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import {
  getMonthlyRadiationForAngle,
  type TableRadiationComponent,
} from '@/components/climate/OptimalAnnualStudyPanel';
import { themeManager } from '@/services/theme/themeManager';

export type SeasonalGraphComponentChoice = 'global' | 'beam' | 'diffuse' | 'albedo' | 'all';

interface OptimalSeasonalGraphsProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  initialComponent?: SeasonalGraphComponentChoice;
  onBack?: () => void;
  onExit?: () => void;
}

const MONTH_NAMES_SHORT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export function renderOptimalSeasonalGraphsWindow(props: OptimalSeasonalGraphsProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;
  const container = document.createElement('div');
  container.className = 'opt-matlab-graphs-window';
  container.id = 'opt-seasonal-graphs-window';

  let selectedComponent: SeasonalGraphComponentChoice = props.initialComponent || 'global';
  let gridTopEnabled: boolean = true;
  let gridBottomEnabled: boolean = false;

  const winterDeg = res.seasonal.winterTiltDeg;
  const springDeg = res.seasonal.springTiltDeg;
  const summerDeg = res.seasonal.summerTiltDeg;
  const autumnDeg = res.seasonal.autumnTiltDeg;

  // Calculates 12-month array at respective seasonal angles
  function getSeasonalVector(comp: TableRadiationComponent): number[] {
    const vals: number[] = new Array(12).fill(0);
    for (let m = 0; m < 12; m++) {
      let deg = winterDeg;
      if (m === 2 || m === 3 || m === 4) deg = springDeg;
      else if (m === 5 || m === 6 || m === 7) deg = summerDeg;
      else if (m === 8 || m === 9 || m === 10) deg = autumnDeg;
      vals[m] = getMonthlyRadiationForAngle(res, comp, deg)[m];
    }
    return vals;
  }

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const isAll = selectedComponent === 'all';
    const isAlbedo = selectedComponent === 'albedo';

    const compKey = isAll ? 'global' : (selectedComponent as TableRadiationComponent);
    const rad0 = getMonthlyRadiationForAngle(res, compKey, 0);
    const radSeas = getSeasonalVector(compKey);

    const allData = {
      global: {
        rad0: getMonthlyRadiationForAngle(res, 'global', 0),
        radSeas: getSeasonalVector('global'),
      },
      beam: {
        rad0: getMonthlyRadiationForAngle(res, 'beam', 0),
        radSeas: getSeasonalVector('beam'),
      },
      diffuse: {
        rad0: getMonthlyRadiationForAngle(res, 'diffuse', 0),
        radSeas: getSeasonalVector('diffuse'),
      },
      albedo: {
        rad0: getMonthlyRadiationForAngle(res, 'albedo', 0),
        radSeas: getSeasonalVector('albedo'),
      },
    };

    const calcGainsPct = (seasArr: number[], zeroArr: number[]) =>
      seasArr.map((opt, i) => (zeroArr[i] > 0 ? ((opt - zeroArr[i]) / zeroArr[i]) * 100 : 0));

    const gainsPct = isAlbedo ? new Array(12).fill(0) : calcGainsPct(radSeas, rad0);
    const allGainsPct = {
      global: calcGainsPct(allData.global.radSeas, allData.global.rad0),
      beam: calcGainsPct(allData.beam.radSeas, allData.beam.rad0),
      diffuse: calcGainsPct(allData.diffuse.radSeas, allData.diffuse.rad0),
      albedo: new Array(12).fill(0),
    };

    const minVal = (arr: number[]) => Math.min(...arr);
    const meanVal = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const maxVal = (arr: number[]) => Math.max(...arr);

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
      ? (isEn ? 'Gains of all components for seasonal optimal tilt' : 'Ganancias de todas las componentes para la inclinación óptima estacional')
      : isEn
      ? `Gains of ${compName} radiation for seasonal optimal tilt`
      : `Ganancias de radiación ${compName} para la inclinación óptima estacional`;

    const isDark = themeManager.isDark();
    const plotBg = isDark ? '#0b171f' : '#ffffff';
    const plotBorder = isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8';
    const titleColor = isDark ? '#f8fafc' : '#0f172a';
    const labelColor = isDark ? '#cbd5e1' : '#1e293b';
    const tickColor = isDark ? '#94a3b8' : '#334155';
    const gridStroke = isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0';
    const zeroLineStroke = isDark ? '#ffffff' : '#0f172a';
    const legendBg = isDark ? 'rgba(15, 23, 42, 0.92)' : '#ffffff';
    const legendBorder = isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1';
    const legendText = isDark ? '#f8fafc' : '#0f172a';

    // -------------------------------------------------------------
    // SVG 1: Top Plot (Line Chart of Radiation vs Months)
    // -------------------------------------------------------------
    const plotW = 540;
    const plotH = 200;
    const pad = { top: 32, right: 90, bottom: 35, left: 45 };
    const innerW = plotW - pad.left - pad.right;
    const innerH = plotH - pad.top - pad.bottom;

    const maxRadiationY = isAll ? 8 : Math.ceil(Math.max(...radSeas, ...rad0, 1.0) * 1.15);
    const yTop = (v: number) => pad.top + innerH - (Math.min(v, maxRadiationY) / maxRadiationY) * innerH;
    const xMonth = (idx: number) => pad.left + (idx / 11) * innerW;

    let gridLinesTop = '';
    const yTicksCount = maxRadiationY <= 6 ? maxRadiationY : 4;
    for (let i = 0; i <= yTicksCount; i++) {
      const v = (maxRadiationY / yTicksCount) * i;
      const y = yTop(v);
      if (gridTopEnabled) {
        gridLinesTop += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + innerW}" y2="${y}" stroke="${gridStroke}" stroke-dasharray="2,3" />`;
      }
      gridLinesTop += `<text x="${pad.left - 6}" y="${y + 4}" fill="${tickColor}" font-size="10" text-anchor="end" font-family="monospace">${Math.round(v)}</text>`;
    }

    if (gridTopEnabled) {
      for (let i = 0; i < 12; i++) {
        const x = xMonth(i);
        gridLinesTop += `<line x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top + innerH}" stroke="${gridStroke}" stroke-dasharray="2,3" />`;
      }
    }

    const makeLineD = (arr: number[]) =>
      arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xMonth(i).toFixed(1)} ${yTop(v).toFixed(1)}`).join(' ');

    let topSeriesHtml = '';
    let topLegendHtml = '';

    if (!isAll) {
      const colorSeas =
        selectedComponent === 'beam'
          ? '#ef4444'
          : selectedComponent === 'diffuse'
          ? '#84cc16'
          : selectedComponent === 'albedo'
          ? '#f59e0b'
          : '#0284c7';

      const colorZero =
        selectedComponent === 'beam'
          ? '#f87171'
          : selectedComponent === 'diffuse'
          ? '#15803d'
          : selectedComponent === 'albedo'
          ? '#92400e'
          : '#0369a1';

      topSeriesHtml = `
        <path d="${makeLineD(radSeas)}" fill="none" stroke="${colorSeas}" stroke-width="2.6" stroke-linecap="round" />
        <path d="${makeLineD(rad0)}" fill="none" stroke="${colorZero}" stroke-width="2.6" stroke-linecap="round" />
      `;

      topLegendHtml = `
        <g transform="translate(${pad.left + innerW + 10}, ${pad.top + 5})">
          <rect x="0" y="0" width="76" height="42" fill="${legendBg}" stroke="${legendBorder}" rx="3" />
          <line x1="8" y1="14" x2="26" y2="14" stroke="${colorSeas}" stroke-width="2.5" />
          <text x="32" y="17" fill="${legendText}" font-size="10.5" font-weight="600">${isEn ? 'Opt. seas.' : 'Ópt. est.'}</text>
          <line x1="8" y1="30" x2="26" y2="30" stroke="${colorZero}" stroke-width="2.5" />
          <text x="32" y="33" fill="${legendText}" font-size="10.5" font-weight="600">0°</text>
        </g>
      `;
    } else {
      topSeriesHtml = `
        <path d="${makeLineD(allData.global.radSeas)}" fill="none" stroke="#0284c7" stroke-width="2.4" />
        <path d="${makeLineD(allData.global.rad0)}" fill="none" stroke="#0369a1" stroke-width="2.4" />
        <path d="${makeLineD(allData.beam.radSeas)}" fill="none" stroke="#ef4444" stroke-width="2.4" />
        <path d="${makeLineD(allData.beam.rad0)}" fill="none" stroke="#f87171" stroke-width="2.4" />
        <path d="${makeLineD(allData.diffuse.radSeas)}" fill="none" stroke="#d4ac0d" stroke-width="2.4" />
        <path d="${makeLineD(allData.diffuse.rad0)}" fill="none" stroke="#27ae60" stroke-width="2.4" />
        <path d="${makeLineD(allData.albedo.radSeas)}" fill="none" stroke="#e67e22" stroke-width="2.4" />
        <path d="${makeLineD(allData.albedo.rad0)}" fill="none" stroke="#7e5109" stroke-width="2.4" />
      `;

      topLegendHtml = `
        <g transform="translate(${pad.left + innerW + 8}, ${pad.top - 12})">
          <rect x="0" y="0" width="80" height="152" fill="${legendBg}" stroke="${legendBorder}" rx="3" />
          <line x1="6" y1="14" x2="22" y2="14" stroke="#0284c7" stroke-width="2.5" />
          <text x="26" y="17" fill="${legendText}" font-size="9.5" font-weight="600">Gdm(ópt)</text>
          <line x1="6" y1="32" x2="22" y2="32" stroke="#0369a1" stroke-width="2.5" />
          <text x="26" y="35" fill="${legendText}" font-size="9.5" font-weight="600">Gdm(0°)</text>
          <line x1="6" y1="50" x2="22" y2="50" stroke="#ef4444" stroke-width="2.5" />
          <text x="26" y="53" fill="${legendText}" font-size="9.5" font-weight="600">Bdm(ópt)</text>
          <line x1="6" y1="68" x2="22" y2="68" stroke="#f87171" stroke-width="2.5" />
          <text x="26" y="71" fill="${legendText}" font-size="9.5" font-weight="600">Bdm(0°)</text>
          <line x1="6" y1="86" x2="22" y2="86" stroke="#d4ac0d" stroke-width="2.5" />
          <text x="26" y="89" fill="${legendText}" font-size="9.5" font-weight="600">Ddm(ópt)</text>
          <line x1="6" y1="104" x2="22" y2="104" stroke="#27ae60" stroke-width="2.5" />
          <text x="26" y="107" fill="${legendText}" font-size="9.5" font-weight="600">Ddm(0°)</text>
          <line x1="6" y1="122" x2="22" y2="122" stroke="#e67e22" stroke-width="2.5" />
          <text x="26" y="125" fill="${legendText}" font-size="9.5" font-weight="600">Rdm(ópt)</text>
          <line x1="6" y1="140" x2="22" y2="140" stroke="#7e5109" stroke-width="2.5" />
          <text x="26" y="143" fill="${legendText}" font-size="9.5" font-weight="600">Rdm(0°)</text>
        </g>
      `;
    }

    const svgTopHtml = `
      <svg viewBox="0 0 ${plotW} ${plotH}" style="width: 100%; height: auto; background: ${plotBg}; border: 1px solid ${plotBorder}; border-radius: 4px;">
        <text x="${plotW / 2 - 20}" y="19" fill="${titleColor}" font-size="12" font-weight="700" text-anchor="middle">${topPlotTitle}</text>
        <text x="14" y="${plotH / 2}" fill="${labelColor}" font-size="10.5" font-weight="600" text-anchor="middle" transform="rotate(-90 14 ${plotH / 2})">${isEn ? 'Radiation' : 'Radiación'}</text>
        <text x="${pad.left + innerW / 2}" y="${plotH - 8}" fill="${labelColor}" font-size="10.5" font-weight="600" text-anchor="middle">${isEn ? 'Months' : 'Meses'}</text>

        ${gridLinesTop}
        ${topSeriesHtml}

        <rect x="${pad.left}" y="${pad.top}" width="${innerW}" height="${innerH}" fill="none" stroke="${plotBorder}" />

        ${MONTH_NAMES_SHORT.map((m, i) => {
          if (i % 2 === 1) {
            const x = xMonth(i);
            return `<text x="${x}" y="${pad.top + innerH + 15}" fill="${tickColor}" font-size="10" text-anchor="middle" font-family="monospace">${m}</text>`;
          }
          return '';
        }).join('')}

        ${topLegendHtml}
      </svg>
    `;

    // -------------------------------------------------------------
    // SVG 2: Bottom Plot (Bar Chart of Gains %)
    // -------------------------------------------------------------
    const bottomPlotW = 540;
    const bottomPlotH = 200;
    const bPad = { top: 32, right: 90, bottom: 35, left: 45 };
    const bInnerW = bottomPlotW - bPad.left - bPad.right;
    const bInnerH = bottomPlotH - bPad.top - bPad.bottom;

    const maxGainY = 100;
    const minGainY = 0;
    const yBottom = (v: number) => {
      const clamped = Math.max(minGainY, Math.min(maxGainY, v));
      return bPad.top + bInnerH - (clamped / maxGainY) * bInnerH;
    };

    let gridLinesBottom = '';
    const bTicks = [0, 50, 100];
    for (const v of bTicks) {
      const y = yBottom(v);
      if (gridBottomEnabled) {
        gridLinesBottom += `<line x1="${bPad.left}" y1="${y}" x2="${bPad.left + bInnerW}" y2="${y}" stroke="${gridStroke}" stroke-dasharray="2,3" />`;
      }
      gridLinesBottom += `<text x="${bPad.left - 6}" y="${y + 4}" fill="${tickColor}" font-size="10" text-anchor="end" font-family="monospace">${v}</text>`;
    }

    let bottomBarsHtml = '';
    let bottomLegendHtml = '';

    if (!isAll) {
      const colW = (bInnerW / 12) * 0.55;
      const singleColor = selectedComponent === 'beam' ? '#ef4444' : selectedComponent === 'diffuse' ? '#10b981' : '#0284c7';
      bottomBarsHtml = gainsPct
        .map((g, i) => {
          const x = bPad.left + (i / 11) * (bInnerW - colW);
          const y = yBottom(Math.max(0, g));
          const h = Math.abs(yBottom(0) - y);
          return `<rect x="${x}" y="${y}" width="${colW}" height="${h}" fill="${singleColor}" stroke="#0f172a" stroke-width="0.5" />`;
        })
        .join('');

      bottomLegendHtml = `
        <g transform="translate(${bPad.left + bInnerW + 10}, ${bPad.top + 10})">
          <rect x="0" y="0" width="76" height="26" fill="${legendBg}" stroke="${legendBorder}" rx="3" />
          <rect x="8" y="7" width="12" height="12" fill="${singleColor}" stroke="#0f172a" stroke-width="0.5" />
          <text x="26" y="17" fill="${legendText}" font-size="10" font-weight="600">${isEn ? 'Gain %' : 'Ganancia %'}</text>
        </g>
      `;
    } else {
      const monthSlotW = bInnerW / 12;
      const barW = Math.max(3, monthSlotW * 0.18);
      const gap = 1;

      bottomBarsHtml = '';
      for (let i = 0; i < 12; i++) {
        const slotX = bPad.left + i * monthSlotW + 4;
        const gG = allGainsPct.global[i];
        const gB = allGainsPct.beam[i];
        const gD = allGainsPct.diffuse[i];
        const gR = allGainsPct.albedo[i];

        const bars = [
          { val: gG, color: '#059669' },
          { val: gB, color: '#10b981' },
          { val: gD, color: '#84cc16' },
          { val: gR, color: '#eab308' },
        ];

        bars.forEach((b, bIdx) => {
          const bx = slotX + bIdx * (barW + gap);
          const y = yBottom(Math.max(0, b.val));
          const h = Math.abs(yBottom(0) - y);
          bottomBarsHtml += `<rect x="${bx}" y="${y}" width="${barW}" height="${h}" fill="${b.color}" stroke="#064e3b" stroke-width="0.4" />`;
        });
      }

      bottomLegendHtml = `
        <g transform="translate(${bPad.left + bInnerW + 8}, ${bPad.top + 5})">
          <rect x="0" y="0" width="76" height="84" fill="${legendBg}" stroke="${legendBorder}" rx="3" />
          <rect x="6" y="8" width="10" height="10" fill="#059669" />
          <text x="22" y="16" fill="${legendText}" font-size="9" font-weight="600">0° - G</text>
          <rect x="6" y="26" width="10" height="10" fill="#10b981" />
          <text x="22" y="34" fill="${legendText}" font-size="9" font-weight="600">0° - B</text>
          <rect x="6" y="44" width="10" height="10" fill="#84cc16" />
          <text x="22" y="52" fill="${legendText}" font-size="9" font-weight="600">0° - D</text>
          <rect x="6" y="62" width="10" height="10" fill="#eab308" />
          <text x="22" y="70" fill="${legendText}" font-size="9" font-weight="600">0° - R</text>
        </g>
      `;
    }

    const svgBottomHtml = `
      <svg viewBox="0 0 ${bottomPlotW} ${bottomPlotH}" style="width: 100%; height: auto; background: ${plotBg}; border: 1px solid ${plotBorder}; border-radius: 4px;">
        <text x="${bottomPlotW / 2 - 20}" y="19" fill="${titleColor}" font-size="12" font-weight="700" text-anchor="middle">${bottomPlotTitle}</text>
        <text x="14" y="${bottomPlotH / 2}" fill="${labelColor}" font-size="10.5" font-weight="600" text-anchor="middle" transform="rotate(-90 14 ${bottomPlotH / 2})">${isEn ? 'Gains (%)' : 'Ganancias (%)'}</text>
        <text x="${bPad.left + bInnerW / 2}" y="${bottomPlotH - 8}" fill="${labelColor}" font-size="10.5" font-weight="600" text-anchor="middle">${isEn ? 'Months' : 'Meses'}</text>

        ${gridLinesBottom}
        <line x1="${bPad.left}" y1="${yBottom(0)}" x2="${bPad.left + bInnerW}" y2="${yBottom(0)}" stroke="${zeroLineStroke}" stroke-width="1.2" />
        ${bottomBarsHtml}

        <rect x="${bPad.left}" y="${bPad.top}" width="${bInnerW}" height="${bInnerH}" fill="none" stroke="${plotBorder}" />

        ${MONTH_NAMES_SHORT.map((m, i) => {
          const x = bPad.left + (i + 0.5) * (bInnerW / 12);
          return `<text x="${x}" y="${bPad.top + bInnerH + 15}" fill="${tickColor}" font-size="10" text-anchor="middle" font-family="monospace">${m}</text>`;
        }).join('')}

        ${bottomLegendHtml}
      </svg>
    `;

    container.innerHTML = `
      <div class="opt-matlab-graphs-frame">
        <!-- 1. Header Bar -->
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
                <span style="color: #34d399; font-weight: 600;">${isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional'}</span>
              </span>
            </div>
          </div>
          <div class="opt-graphs-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>3.0</strong>
            </div>
          </div>
        </div>

        <!-- 2. Main Two-Column Layout -->
        <div class="opt-graphs-main-layout">
          <div class="opt-graphs-plots-col">
            <div class="matlab-plot-card">
              ${svgTopHtml}
              <div class="matlab-plot-footer">
                <label class="matlab-grid-toggle">
                  <input type="checkbox" id="chk-grid-top-seas" ${gridTopEnabled ? 'checked' : ''} />
                  <span>${isEn ? 'Enable grid' : 'Activar rejilla'}</span>
                </label>
              </div>
            </div>

            <div class="matlab-plot-card">
              ${svgBottomHtml}
              <div class="matlab-plot-footer">
                <label class="matlab-grid-toggle">
                  <input type="checkbox" id="chk-grid-bottom-seas" ${gridBottomEnabled ? 'checked' : ''} />
                  <span>${isEn ? 'Enable grid' : 'Activar rejilla'}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="opt-graphs-side-col">
            <div class="matlab-comp-picker-box">
              <label for="select-comp-graphs-seas" class="matlab-picker-label">
                ${isEn ? 'Select a component:' : 'Seleccione una componente:'}
              </label>
              <select id="select-comp-graphs-seas" class="matlab-picker-select">
                <option value="all" ${selectedComponent === 'all' ? 'selected' : ''}>${isEn ? 'All' : 'Todas'}</option>
                <option value="global" ${selectedComponent === 'global' ? 'selected' : ''}>${isEn ? 'Global' : 'Global'}</option>
                <option value="beam" ${selectedComponent === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
                <option value="diffuse" ${selectedComponent === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
                <option value="albedo" ${selectedComponent === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
              </select>

              <div class="seasonal-angles-badge-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px;">
                <div style="background: rgba(2, 132, 199, 0.15); border: 1px solid #0284c7; padding: 4px 6px; border-radius: 4px; font-size: 0.8rem; color: #38bdf8;">
                  <strong>Inv:</strong> ${winterDeg}°
                </div>
                <div style="background: rgba(22, 163, 74, 0.15); border: 1px solid #16a34a; padding: 4px 6px; border-radius: 4px; font-size: 0.8rem; color: #4ade80;">
                  <strong>Pri:</strong> ${springDeg}°
                </div>
                <div style="background: rgba(202, 138, 4, 0.15); border: 1px solid #ca8a04; padding: 4px 6px; border-radius: 4px; font-size: 0.8rem; color: #facc15;">
                  <strong>Ver:</strong> ${summerDeg}°
                </div>
                <div style="background: rgba(234, 88, 12, 0.15); border: 1px solid #ea580c; padding: 4px 6px; border-radius: 4px; font-size: 0.8rem; color: #fb923c;">
                  <strong>Oto:</strong> ${autumnDeg}°
                </div>
              </div>
            </div>

            <div class="matlab-stat-boxes-container">
              <div class="matlab-stat-frame frame-opt">
                <div class="stat-frame-title title-opt">${isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional'}</div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Maximum' : 'Máximo'}</span>
                  <strong>${maxVal(radSeas).toFixed(2)}</strong>
                </div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Minimum' : 'Mínimo'}</span>
                  <strong>${minVal(radSeas).toFixed(2)}</strong>
                </div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Mean' : 'Media'}</span>
                  <strong>${meanVal(radSeas).toFixed(2)}</strong>
                </div>
              </div>

              <div class="matlab-stat-frame frame-horiz">
                <div class="stat-frame-title title-horiz">${isEn ? 'Horizontal surface (0°)' : 'Superficie horizontal (0°)'}</div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Maximum' : 'Máximo'}</span>
                  <strong>${maxVal(rad0).toFixed(2)}</strong>
                </div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Minimum' : 'Mínimo'}</span>
                  <strong>${minVal(rad0).toFixed(2)}</strong>
                </div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Mean' : 'Media'}</span>
                  <strong>${meanVal(rad0).toFixed(2)}</strong>
                </div>
              </div>

              <div class="matlab-stat-frame frame-gain">
                <div class="stat-frame-title title-gain">${isEn ? 'Gain (%)' : 'Ganancia (%)'}</div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Maximum' : 'Máximo'}</span>
                  <strong>${maxVal(gainsPct).toFixed(2)} %</strong>
                </div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Minimum' : 'Mínimo'}</span>
                  <strong>${minVal(gainsPct).toFixed(2)} %</strong>
                </div>
                <div class="stat-frame-row">
                  <span>${isEn ? 'Mean' : 'Media'}</span>
                  <strong>${meanVal(gainsPct).toFixed(2)} %</strong>
                </div>
              </div>
            </div>

            <div class="matlab-graphs-actions-row">
              <button id="btn-seas-graphs-volver" class="matlab-btn-default flex-1" type="button">
                ${isEn ? 'Back' : 'Volver'}
              </button>
              <button id="btn-seas-graphs-salir" class="matlab-btn-default flex-1" type="button">
                ${isEn ? 'Exit' : 'Salir'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelector<HTMLSelectElement>('#select-comp-graphs-seas')?.addEventListener('change', (e) => {
      selectedComponent = (e.target as HTMLSelectElement).value as SeasonalGraphComponentChoice;
      renderInternal();
    });

    container.querySelector<HTMLInputElement>('#chk-grid-top-seas')?.addEventListener('change', (e) => {
      gridTopEnabled = (e.target as HTMLInputElement).checked;
      renderInternal();
    });

    container.querySelector<HTMLInputElement>('#chk-grid-bottom-seas')?.addEventListener('change', (e) => {
      gridBottomEnabled = (e.target as HTMLInputElement).checked;
      renderInternal();
    });

    container.querySelector<HTMLButtonElement>('#btn-seas-graphs-volver')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    container.querySelector<HTMLButtonElement>('#btn-seas-graphs-salir')?.addEventListener('click', () => {
      if (onExit) onExit();
    });
  }

  renderInternal();
  return container;
}
