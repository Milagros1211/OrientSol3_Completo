import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';

export type RadiationComponentType = 'global' | 'beam' | 'diffuse' | 'albedo';

interface OptimalAnnualStudyProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
}

// Module-level state to remember selected angle X and component across re-renders
let stateComponent: RadiationComponentType = 'global';
let stateAngleX: number = 45;
let stateComparisonMode: boolean = true; // Shows Angle X alongside optimal
let stateShowAnglePicker: boolean = false;

/**
 * Extracts the 12 monthly daily radiation values for a specific tilt angle (0 to 90 degrees)
 * for the selected radiation component (global, beam, diffuse, albedo).
 */
export function getMonthlyRadiationForAngle(
  res: SolarBridgeSimulationResult,
  component: RadiationComponentType,
  angleDeg: number
): number[] {
  const comp91 = res.optimalAnnual.components91;
  const horizComp = res.optimalAnnual.horizontalComponents;

  // Horizontal plane (0 degrees)
  if (angleDeg === 0) {
    if (horizComp) {
      if (component === 'global') return horizComp.global;
      if (component === 'beam') return horizComp.beam;
      if (component === 'diffuse') return horizComp.diffuse;
      if (component === 'albedo') return horizComp.albedo;
    }
    if (component === 'global') return res.horizontal.gdm0;
    if (component === 'beam') return res.horizontal.bdm0;
    if (component === 'diffuse') return res.horizontal.ddm0;
    return new Array(12).fill(0.0);
  }

  // Tilted plane (1 to 90 degrees)
  const angleIdx = Math.max(0, Math.min(90, Math.round(angleDeg) - 1));

  if (comp91) {
    const matrix =
      component === 'global'
        ? comp91.global
        : component === 'beam'
        ? comp91.beam
        : component === 'diffuse'
        ? comp91.diffuse
        : comp91.albedo;

    if (matrix && matrix.length === 12) {
      return matrix.map((row) => (row && row[angleIdx] !== undefined ? row[angleIdx] : 0.0));
    }
  }

  // Safe fallback if components91 was not loaded (e.g. legacy cache)
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  if (Math.round(angleDeg) === optAngle) {
    return res.optimalAnnual.monthlyDailyKwh;
  }
  // Rough cosine / transposition fallback
  const factor = Math.cos(((angleDeg - optAngle) * Math.PI) / 180);
  return res.optimalAnnual.monthlyDailyKwh.map((v) => Math.max(0, Number((v * factor).toFixed(2))));
}

/**
 * Calculates monthly gain factors (Optimal / Base) and percentages ((Factor - 1) * 100)
 */
function calculateGains(optimalVals: number[], baseVals: number[]): { factors: number[]; pcts: number[] } {
  const factors: number[] = [];
  const pcts: number[] = [];

  for (let i = 0; i < 12; i++) {
    const b = baseVals[i] || 0.0001;
    const opt = optimalVals[i] || 0.0;
    const factor = b > 0.001 ? opt / b : 1.0;
    const pct = (factor - 1.0) * 100.0;
    factors.push(factor);
    pcts.push(pct);
  }

  return { factors, pcts };
}

/**
 * Exports the Optimal Annual study table directly to a CSV spreadsheet file.
 */
function exportOptimalAnnualTableToCSV(
  res: SolarBridgeSimulationResult,
  component: RadiationComponentType,
  angleX: number,
  isEn: boolean
) {
  const t = i18n.t;
  const MONTHS = t.common.monthNamesFull;
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const tempVals = res.temperatures.ambient.monthlyMeanC;

  const rad0 = getMonthlyRadiationForAngle(res, component, 0);
  const rad15 = getMonthlyRadiationForAngle(res, component, 15);
  const rad30 = getMonthlyRadiationForAngle(res, component, 30);
  const rad45 = getMonthlyRadiationForAngle(res, component, 45);
  const rad60 = getMonthlyRadiationForAngle(res, component, 60);
  const rad75 = getMonthlyRadiationForAngle(res, component, 75);
  const rad90 = getMonthlyRadiationForAngle(res, component, 90);
  const radOpt = getMonthlyRadiationForAngle(res, component, optAngle);
  const radX = getMonthlyRadiationForAngle(res, component, angleX);

  const gainsHoriz = calculateGains(radOpt, rad0);
  const gainsX = calculateGains(radOpt, radX);

  const compLabel =
    component === 'global' ? 'Gdm' : component === 'beam' ? 'Bdm' : component === 'diffuse' ? 'Ddm' : 'Rdm';

  const rows: string[][] = [
    [`OrientSol 3.0 - ${isEn ? 'Annual Optimal Tilt Study' : 'Estudio de Inclinación Óptima Anual'}`],
    [`${isEn ? 'Location' : 'Ciudad'}: ${res.locationName}`, `Lat: ${res.latitude.toFixed(2)}°`],
    [`${isEn ? 'Component' : 'Componente'}: ${component.toUpperCase()}`, `${isEn ? 'Unit' : 'Unidad'}: kWh/m²/day`],
    [`${isEn ? 'Optimal Tilt' : 'Inclinación Óptima'}: ${optAngle}°`, `${isEn ? 'Comparison Angle X' : 'Ángulo Comparativo X'}: ${angleX}°`],
    [],
    [
      isEn ? 'Month' : 'Mes',
      `${compLabel} (0°)`,
      `${compLabel} (15°)`,
      `${compLabel} (30°)`,
      `${compLabel} (45°)`,
      `${compLabel} (60°)`,
      `${compLabel} (75°)`,
      `${compLabel} (90°)`,
      `${compLabel} Ópt (${optAngle}°)`,
      `${compLabel} X (${angleX}°)`,
      `${isEn ? 'Mean Temp (°C)' : 'Tª media (°C)'}`,
      `${isEn ? 'Gain vs Horiz (Factor)' : 'Ganancia s/ Horiz (Factor)'}`,
      `${isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)'}`,
      `${isEn ? 'Gain vs Angle X (Factor)' : 'Ganancia s/ Ángulo X (Factor)'}`,
      `${isEn ? 'Gain vs Angle X (%)' : 'Ganancia s/ Ángulo X (%)'}`,
    ],
  ];

  for (let i = 0; i < 12; i++) {
    rows.push([
      MONTHS[i],
      rad0[i].toFixed(2),
      rad15[i].toFixed(2),
      rad30[i].toFixed(2),
      rad45[i].toFixed(2),
      rad60[i].toFixed(2),
      rad75[i].toFixed(2),
      rad90[i].toFixed(2),
      radOpt[i].toFixed(2),
      radX[i].toFixed(2),
      tempVals[i].toFixed(1),
      gainsHoriz.factors[i].toFixed(2),
      `${gainsHoriz.pcts[i] >= 0 ? '+' : ''}${gainsHoriz.pcts[i].toFixed(2)}%`,
      gainsX.factors[i].toFixed(2),
      `${gainsX.pcts[i] >= 0 ? '+' : ''}${gainsX.pcts[i].toFixed(2)}%`,
    ]);
  }

  // Row MEDIA / MEAN
  const meanOf = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  rows.push([
    isEn ? 'MEAN' : 'MEDIA',
    meanOf(rad0),
    meanOf(rad15),
    meanOf(rad30),
    meanOf(rad45),
    meanOf(rad60),
    meanOf(rad75),
    meanOf(rad90),
    meanOf(radOpt),
    meanOf(radX),
    meanOf(tempVals),
    meanOf(gainsHoriz.factors),
    `${Number(meanOf(gainsHoriz.pcts)) >= 0 ? '+' : ''}${meanOf(gainsHoriz.pcts)}%`,
    meanOf(gainsX.factors),
    `${Number(meanOf(gainsX.pcts)) >= 0 ? '+' : ''}${meanOf(gainsX.pcts)}%`,
  ]);

  const csvContent = '\uFEFF' + rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orientsol_inclinacion_optima_${res.locationName.toLowerCase().replace(/\s+/g, '_')}_${component}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Renders the full interactive OrientSol 3.0 "Inclinación Óptima Anual" study component.
 */
export function renderOptimalAnnualStudyPanel(props: OptimalAnnualStudyProps): HTMLElement {
  const { simulationResult: res, locationName, latitude } = props;
  const container = document.createElement('div');
  container.className = 'optimal-annual-study-container';
  container.id = 'optimal-annual-study-panel';

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const t = i18n.t;
    const MONTHS = t.common.monthNamesFull;
    const optAngle = res.optimalAnnual.optimalTiltDeg;
    const tempVals = res.temperatures.ambient.monthlyMeanC;
    const tempMeanAnnual = res.temperatures.ambient.annualMeanC;

    // Standard tilt angles matching MATLAB OrientSol: 0°, 15°, 30°, 45°, 60°, 75°, 90°
    const rad0 = getMonthlyRadiationForAngle(res, stateComponent, 0);
    const rad15 = getMonthlyRadiationForAngle(res, stateComponent, 15);
    const rad30 = getMonthlyRadiationForAngle(res, stateComponent, 30);
    const rad45 = getMonthlyRadiationForAngle(res, stateComponent, 45);
    const rad60 = getMonthlyRadiationForAngle(res, stateComponent, 60);
    const rad75 = getMonthlyRadiationForAngle(res, stateComponent, 75);
    const rad90 = getMonthlyRadiationForAngle(res, stateComponent, 90);

    // Optimal Angle and Angle X
    const radOpt = getMonthlyRadiationForAngle(res, stateComponent, optAngle);
    const radX = getMonthlyRadiationForAngle(res, stateComponent, stateAngleX);

    // Compute annual totals and daily means
    const meanOf = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const mean0 = meanOf(rad0);
    const mean15 = meanOf(rad15);
    const mean30 = meanOf(rad30);
    const mean45 = meanOf(rad45);
    const mean60 = meanOf(rad60);
    const mean75 = meanOf(rad75);
    const mean90 = meanOf(rad90);
    const meanOpt = meanOf(radOpt);
    const meanX = meanOf(radX);

    // Gains vs Horizontal
    const gainsHoriz = calculateGains(radOpt, rad0);
    const meanFactorHoriz = meanOf(gainsHoriz.factors);
    const meanPctHoriz = meanOf(gainsHoriz.pcts);

    // Gains vs Angle X
    const gainsX = calculateGains(radOpt, radX);
    const meanFactorX = meanOf(gainsX.factors);
    const meanPctX = meanOf(gainsX.pcts);

    const compSymbol =
      stateComponent === 'global' ? 'Gdm' : stateComponent === 'beam' ? 'Bdm' : stateComponent === 'diffuse' ? 'Ddm' : 'Rdm';

    const compLabelName =
      stateComponent === 'global'
        ? t.results.radGlobal
        : stateComponent === 'beam'
        ? t.results.radBeam
        : stateComponent === 'diffuse'
        ? t.results.radDiffuse
        : t.results.radAlbedo;

    const subtitleText = t.results.monthlyRadSubtitle.replace('{comp}', compLabelName);

    // Comparative statement between optimal angle and Angle X
    const diffPct = meanX > 0.001 ? ((meanOpt - meanX) / meanX) * 100.0 : 0.0;
    const diffAnnualKwh = (meanOpt - meanX) * 365.0;

    let comparisonNoticeHtml = '';
    if (stateAngleX === optAngle) {
      comparisonNoticeHtml = `
        <div class="opt-compare-banner banner-equal">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>
            <strong>${isEn ? 'Coincident Inclination:' : 'Inclinación Coincidente:'}</strong>
            <span>${t.results.compEqualMessage.replace('{beta}', String(optAngle))}</span>
          </div>
        </div>
      `;
    } else if (diffPct > 0) {
      comparisonNoticeHtml = `
        <div class="opt-compare-banner banner-better">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <div>
            <strong>${isEn ? 'Optimal Tilt Superiority:' : 'Ganancia del Ángulo Óptimo:'}</strong>
            <span>${t.results.compBetterMessage
              .replace('{optBeta}', String(optAngle))
              .replace('{pct}', diffPct.toFixed(2))
              .replace('{kwh}', String(Math.round(diffAnnualKwh)))
              .replace('{xBeta}', String(stateAngleX))}</span>
          </div>
        </div>
      `;
    } else {
      comparisonNoticeHtml = `
        <div class="opt-compare-banner banner-worse">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <div>
            <strong>${isEn ? 'Selected Angle Performance:' : 'Rendimiento Ángulo Seleccionado:'}</strong>
            <span>${t.results.compWorseMessage
              .replace('{xBeta}', String(stateAngleX))
              .replace('{pct}', Math.abs(diffPct).toFixed(2))
              .replace('{optBeta}', String(optAngle))}</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="result-card opt-study-card">
        <!-- 1. Header matching OrientSol 3.0 MATLAB Window -->
        <div class="opt-study-header">
          <div class="opt-study-meta">
            <div class="meta-item">
              <span class="meta-label">${isEn ? 'City / Location' : 'Ciudad'}:</span>
              <strong class="meta-val meta-city">${locationName}</strong>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isEn ? 'Latitude' : 'Latitud'} (°):</span>
              <strong class="meta-val">${latitude.toFixed(2)}°</strong>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isEn ? 'Study' : 'Estudio'}:</span>
              <span class="badge badge-source">${t.results.optAnnualStudyTitle}</span>
            </div>
          </div>
          <div class="opt-study-badge-opt">
            <span class="opt-badge-tag">${isEn ? 'ANNUAL OPTIMUM' : 'ÓPTIMO ANUAL'}</span>
            <span class="opt-badge-angle">β = ${optAngle}°</span>
          </div>
        </div>

        <!-- 2. Interactive Control Bar (Component selector, Angle X picker, Actions) -->
        <div class="opt-study-controls-bar">
          <div class="control-group-comp">
            <label for="opt-study-comp-select" class="comp-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
              </svg>
              <span>${t.results.selectComponent}</span>
            </label>
            <select id="opt-study-comp-select" class="select-comp-dropdown">
              <option value="global" ${stateComponent === 'global' ? 'selected' : ''}>${t.results.compGlobal}</option>
              <option value="beam" ${stateComponent === 'beam' ? 'selected' : ''}>${t.results.compBeam}</option>
              <option value="diffuse" ${stateComponent === 'diffuse' ? 'selected' : ''}>${t.results.compDiffuse}</option>
              <option value="albedo" ${stateComponent === 'albedo' ? 'selected' : ''}>${t.results.compAlbedo}</option>
            </select>
          </div>

          <div class="control-group-actions">
            <button id="btn-toggle-anglex" class="btn-study-action ${stateShowAnglePicker ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
              </svg>
              <span>${t.results.selectOtherAngleBtn} (β = ${stateAngleX}°)</span>
            </button>

            <button id="btn-scroll-charts" class="btn-study-action" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              <span>${t.results.viewChartsBtn}</span>
            </button>
          </div>
        </div>

        <!-- 3. Angle X Selection Drawer / Toolbar (When opened or active) -->
        <div id="anglex-picker-drawer" class="anglex-drawer ${stateShowAnglePicker ? 'visible' : ''}">
          <div class="anglex-drawer-inner">
            <div class="anglex-input-col">
              <label for="anglex-range-slider" class="anglex-label">
                <strong>${t.results.compareWithAngleX}</strong>
                <span class="anglex-badge-val" id="anglex-display-badge">${stateAngleX}°</span>
              </label>
              <div class="anglex-slider-row">
                <input
                  type="range"
                  id="anglex-range-slider"
                  class="anglex-slider"
                  min="1"
                  max="90"
                  step="1"
                  value="${stateAngleX}"
                />
                <input
                  type="number"
                  id="anglex-num-input"
                  class="anglex-number"
                  min="1"
                  max="90"
                  step="1"
                  value="${stateAngleX}"
                />
                <span class="anglex-deg-symbol">°</span>
              </div>
              <small class="anglex-hint">${t.results.angleRangeNotice}</small>
            </div>

            <!-- Quick Preset Angle Buttons -->
            <div class="anglex-presets-col">
              <span class="presets-label">${isEn ? 'Quick presets:' : 'Inclinaciones rápidas:'}</span>
              <div class="presets-btn-group">
                <button type="button" class="btn-preset-ang ${stateAngleX === 0 ? 'active' : ''}" data-angle="0">0° (Horiz)</button>
                <button type="button" class="btn-preset-ang ${stateAngleX === 15 ? 'active' : ''}" data-angle="15">15°</button>
                <button type="button" class="btn-preset-ang ${stateAngleX === 30 ? 'active' : ''}" data-angle="30">30°</button>
                <button type="button" class="btn-preset-ang ${stateAngleX === 45 ? 'active' : ''}" data-angle="45">45°</button>
                <button type="button" class="btn-preset-ang ${stateAngleX === 60 ? 'active' : ''}" data-angle="60">60°</button>
                <button type="button" class="btn-preset-ang ${stateAngleX === 90 ? 'active' : ''}" data-angle="90">90° (Vert)</button>
                <button type="button" class="btn-preset-ang ${stateAngleX === Math.round(latitude) ? 'active' : ''}" data-angle="${Math.round(latitude)}">Lat (${Math.round(latitude)}°)</button>
                <button type="button" class="btn-preset-ang btn-preset-opt ${stateAngleX === optAngle ? 'active' : ''}" data-angle="${optAngle}">Ópt (${optAngle}°)</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Subtitle and Comparative Banner -->
        <div class="opt-study-subhead">
          <h5 class="opt-study-subtitle">${subtitleText}</h5>
          ${comparisonNoticeHtml}
        </div>

        <!-- 5. Main Matrix Data Table -->
        <div class="opt-table-responsive-wrapper">
          <table class="opt-annual-matlab-table">
            <thead>
              <tr class="table-top-header-row">
                <th rowspan="2" class="th-month">${t.results.monthCol}</th>
                <th colspan="7" class="th-angles-group">${isEn ? 'Fixed Inclinations' : 'Inclinaciones Fijas'} (0°..90°)</th>
                <th rowspan="2" class="th-optimum">
                  <div class="th-opt-title">${compSymbol} ${isEn ? 'Optimal' : 'Óptimo'}</div>
                  <div class="th-opt-angle-tag">${optAngle}°</div>
                </th>
                ${
                  stateComparisonMode
                    ? `
                  <th rowspan="2" class="th-anglex">
                    <div class="th-anglex-title">${compSymbol} (${isEn ? 'Angle' : 'Ángulo'} X)</div>
                    <div class="th-anglex-angle-tag">${stateAngleX}°</div>
                  </th>
                `
                    : ''
                }
                <th rowspan="2" class="th-temp">${t.results.tempMeanCol}<br/><small>(°C)</small></th>
                <th colspan="2" class="th-gain-horiz">${t.results.gainHeader} <small>${isEn ? 'vs Horiz (0°)' : 's/ Horiz (0°)'}</small></th>
                ${
                  stateComparisonMode
                    ? `
                  <th colspan="2" class="th-gain-anglex">${t.results.gainHeader} <small>${isEn ? `vs Angle X (${stateAngleX}°)` : `s/ Ángulo X (${stateAngleX}°)`}</small></th>
                `
                    : ''
                }
              </tr>
              <tr class="table-sub-header-row">
                <!-- 7 standard angles -->
                <th>${compSymbol} (0°)</th>
                <th>${compSymbol} (15°)</th>
                <th>${compSymbol} (30°)</th>
                <th>${compSymbol} (45°)</th>
                <th>${compSymbol} (60°)</th>
                <th>${compSymbol} (75°)</th>
                <th>${compSymbol} (90°)</th>
                <!-- Gain subheaders -->
                <th class="th-sub-factor">${t.results.gainFactorSub}</th>
                <th class="th-sub-pct">${t.results.gainPctSub}</th>
                ${
                  stateComparisonMode
                    ? `
                  <th class="th-sub-factor-x">${t.results.gainFactorSub}</th>
                  <th class="th-sub-pct-x">${t.results.gainPctSub}</th>
                `
                    : ''
                }
              </tr>
            </thead>
            <tbody>
              ${MONTHS.map((monthName: string, idx: number) => {
                const g0 = rad0[idx];
                const g15 = rad15[idx];
                const g30 = rad30[idx];
                const g45 = rad45[idx];
                const g60 = rad60[idx];
                const g75 = rad75[idx];
                const g90 = rad90[idx];
                const gOpt = radOpt[idx];
                const gX = radX[idx];
                const temp = tempVals[idx];
                const factH = gainsHoriz.factors[idx];
                const pctH = gainsHoriz.pcts[idx];
                const factX = gainsX.factors[idx];
                const pctX = gainsX.pcts[idx];

                return `
                  <tr>
                    <td class="td-month-name"><strong>${monthName}</strong></td>
                    <td class="td-num">${g0.toFixed(2)}</td>
                    <td class="td-num">${g15.toFixed(2)}</td>
                    <td class="td-num">${g30.toFixed(2)}</td>
                    <td class="td-num">${g45.toFixed(2)}</td>
                    <td class="td-num">${g60.toFixed(2)}</td>
                    <td class="td-num">${g75.toFixed(2)}</td>
                    <td class="td-num">${g90.toFixed(2)}</td>
                    <td class="td-num td-col-opt"><strong>${gOpt.toFixed(2)}</strong></td>
                    ${stateComparisonMode ? `<td class="td-num td-col-anglex"><strong>${gX.toFixed(2)}</strong></td>` : ''}
                    <td class="td-num td-col-temp">${temp.toFixed(1)}</td>
                    <td class="td-num td-gain-factor">${factH.toFixed(2)}</td>
                    <td class="td-num td-gain-pct ${pctH >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">${pctH >= 0 ? '+' : ''}${pctH.toFixed(2)}</td>
                    ${
                      stateComparisonMode
                        ? `
                      <td class="td-num td-gain-factor-x">${factX.toFixed(2)}</td>
                      <td class="td-num td-gain-pct-x ${pctX >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">${pctX >= 0 ? '+' : ''}${pctX.toFixed(2)}</td>
                    `
                        : ''
                    }
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="table-media-row">
                <td class="td-media-label"><strong>${t.results.annualMeanRow}</strong></td>
                <td class="td-num"><strong>${mean0.toFixed(2)}</strong></td>
                <td class="td-num"><strong>${mean15.toFixed(2)}</strong></td>
                <td class="td-num"><strong>${mean30.toFixed(2)}</strong></td>
                <td class="td-num"><strong>${mean45.toFixed(2)}</strong></td>
                <td class="td-num"><strong>${mean60.toFixed(2)}</strong></td>
                <td class="td-num"><strong>${mean75.toFixed(2)}</strong></td>
                <td class="td-num"><strong>${mean90.toFixed(2)}</strong></td>
                <td class="td-num td-col-opt"><strong>${meanOpt.toFixed(2)}</strong></td>
                ${stateComparisonMode ? `<td class="td-num td-col-anglex"><strong>${meanX.toFixed(2)}</strong></td>` : ''}
                <td class="td-num td-col-temp"><strong>${tempMeanAnnual.toFixed(1)}</strong></td>
                <td class="td-num td-gain-factor"><strong>${meanFactorHoriz.toFixed(2)}</strong></td>
                <td class="td-num td-gain-pct ${meanPctHoriz >= 0 ? 'text-gain-pos' : 'text-gain-neg'}"><strong>${meanPctHoriz >= 0 ? '+' : ''}${meanPctHoriz.toFixed(2)}</strong></td>
                ${
                  stateComparisonMode
                    ? `
                  <td class="td-num td-gain-factor-x"><strong>${meanFactorX.toFixed(2)}</strong></td>
                  <td class="td-num td-gain-pct-x ${meanPctX >= 0 ? 'text-gain-pos' : 'text-gain-neg'}"><strong>${meanPctX >= 0 ? '+' : ''}${meanPctX.toFixed(2)}</strong></td>
                `
                    : ''
                }
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- 6. Comparative KPI Metric Badges (Annual Cumulative Totals) -->
        <div class="opt-comparative-kpi-grid">
          <div class="kpi-mini-card kpi-optimal">
            <span class="kpi-mini-title">${isEn ? `Optimal Tilt (β = ${optAngle}°)` : `Inclinación Óptima (β = ${optAngle}°)`}</span>
            <div class="kpi-mini-main">${meanOpt.toFixed(2)} <small>kWh/m²/d</small></div>
            <span class="kpi-mini-sub">${Math.round(meanOpt * 365).toLocaleString()} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>

          <div class="kpi-mini-card kpi-anglex">
            <span class="kpi-mini-title">${isEn ? `Selected Angle X (β = ${stateAngleX}°)` : `Ángulo Seleccionado X (β = ${stateAngleX}°)`}</span>
            <div class="kpi-mini-main">${meanX.toFixed(2)} <small>kWh/m²/d</small></div>
            <span class="kpi-mini-sub">${Math.round(meanX * 365).toLocaleString()} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>

          <div class="kpi-mini-card kpi-gain">
            <span class="kpi-mini-title">${isEn ? 'Net Gain (Optimal vs Angle X)' : 'Ganancia Neta (Óptimo vs Ángulo X)'}</span>
            <div class="kpi-mini-main text-gain">${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%</div>
            <span class="kpi-mini-sub">${diffAnnualKwh >= 0 ? '+' : ''}${Math.round(diffAnnualKwh)} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>

          <div class="kpi-mini-card kpi-horiz">
            <span class="kpi-mini-title">${isEn ? 'Gain over Horizontal (0°)' : 'Ganancia s/ Horizontal (0°)'}</span>
            <div class="kpi-mini-main" style="color: var(--accent-cyan);">+${meanPctHoriz.toFixed(2)}%</div>
            <span class="kpi-mini-sub">+${Math.round((meanOpt - mean0) * 365)} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>
        </div>

        <!-- 7. Action Button Footer matching OrientSol MATLAB window -->
        <div class="opt-study-footer-actions">
          <button id="btn-goto-energy" class="btn-study-foot" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span>${t.results.energyCalcBtn}</span>
          </button>

          <button id="btn-export-opt-excel" class="btn-study-foot btn-excel" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>${t.results.exportExcelBtn}</span>
          </button>

          <button id="btn-export-opt-report" class="btn-study-foot btn-report" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>${t.results.generateReportBtn}</span>
          </button>
        </div>
      </div>
    `;

    // Attach Event Listeners
    // 1. Component Dropdown Change
    const compSelect = container.querySelector<HTMLSelectElement>('#opt-study-comp-select');
    compSelect?.addEventListener('change', () => {
      stateComponent = (compSelect.value || 'global') as RadiationComponentType;
      renderInternal();
    });

    // 2. Toggle Angle X Drawer
    const btnToggleAngleX = container.querySelector<HTMLButtonElement>('#btn-toggle-anglex');
    btnToggleAngleX?.addEventListener('click', () => {
      stateShowAnglePicker = !stateShowAnglePicker;
      renderInternal();
    });

    // 3. Angle X Slider and Number Input
    const rangeSlider = container.querySelector<HTMLInputElement>('#anglex-range-slider');
    const numInput = container.querySelector<HTMLInputElement>('#anglex-num-input');
    const badgeVal = container.querySelector<HTMLElement>('#anglex-display-badge');

    const updateAngleX = (newAngle: number) => {
      const clamped = Math.max(1, Math.min(90, Math.round(newAngle)));
      stateAngleX = clamped;
      renderInternal();
    };

    rangeSlider?.addEventListener('input', () => {
      const val = parseInt(rangeSlider.value, 10) || 45;
      if (badgeVal) badgeVal.textContent = `${val}°`;
      if (numInput) numInput.value = String(val);
    });

    rangeSlider?.addEventListener('change', () => {
      updateAngleX(parseInt(rangeSlider.value, 10));
    });

    numInput?.addEventListener('change', () => {
      updateAngleX(parseInt(numInput.value, 10));
    });

    // 4. Quick Preset Buttons
    const presetBtns = container.querySelectorAll<HTMLButtonElement>('.btn-preset-ang');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const ang = parseInt(btn.getAttribute('data-angle') || '45', 10);
        updateAngleX(ang);
      });
    });

    // 5. Scroll to Charts
    const btnScrollCharts = container.querySelector<HTMLButtonElement>('#btn-scroll-charts');
    btnScrollCharts?.addEventListener('click', () => {
      const target = document.querySelector('.results-charts-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 6. Scroll to Energy Yield Section
    const btnGotoEnergy = container.querySelector<HTMLButtonElement>('#btn-goto-energy');
    btnGotoEnergy?.addEventListener('click', () => {
      const target = document.querySelector('.energy-models-grid');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 7. Export Table to Excel (CSV)
    const btnExportExcel = container.querySelector<HTMLButtonElement>('#btn-export-opt-excel');
    btnExportExcel?.addEventListener('click', () => {
      exportOptimalAnnualTableToCSV(res, stateComponent, stateAngleX, isEn);
    });

    // 8. Generate Report (PDF)
    const btnExportReport = container.querySelector<HTMLButtonElement>('#btn-export-opt-report');
    btnExportReport?.addEventListener('click', () => {
      const pdfBtn = document.querySelector<HTMLButtonElement>('#btn-export-pdf');
      if (pdfBtn) {
        pdfBtn.click();
      }
    });
  }

  // Initial internal render
  renderInternal();

  return container;
}
