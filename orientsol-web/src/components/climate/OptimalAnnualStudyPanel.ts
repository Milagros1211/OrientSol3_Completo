import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import {
  renderInclinationEvolutionSvg,
  saveSvgChartLocally,
} from '@/components/charts/OptimalAnnualCharts';
import { renderOptimalAnnualGraphsWindow } from '@/components/charts/OptimalAnnualGraphsWindow';
import { renderEnergyCalculationPanel } from '@/components/energy/EnergyCalculationPanel';
import { exportOrientSolMasterExcel } from '@/components/export/masterExportService';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolPDFReport,
  showExportComponentChoiceModal,
} from '@/components/export/pdfReportGenerator';
import { solarSyncState } from '@/services/bridge/solarSyncState';
import { renderCaptureLossMapSection } from '@/components/climate/CaptureLossMapSection';
import { formatNum, formatInt, formatPercent } from '@/utils/formatters';

export type RadiationComponentType = 'global' | 'beam' | 'diffuse' | 'albedo' | 'all';
export type TableRadiationComponent = 'global' | 'beam' | 'diffuse' | 'albedo';

interface OptimalAnnualStudyProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  peakPowerKw?: number;
  onBack?: () => void;
  onExit?: () => void;
}

// Module-level state: decoupled table component and chart component
let stateTableComponent: TableRadiationComponent = 'global';
let stateChartComponent: RadiationComponentType = 'all';
let stateAngleX: number = 45;
let stateComparisonMode: boolean = true; // Shows Angle X alongside optimal
let stateShowAnglePicker: boolean = false;
let stateShowCharts: boolean = false;
let stateActiveChartTab: 'evolution' | 'monthly' = 'monthly';
let stateGridEnabled: boolean = true;
let stateShowEnergy: boolean = false;

/**
 * Computes the 91-point annual daily mean radiation curve across tilt angles 0° to 90°.
 */
export function getRadiationCurve91(
  res: SolarBridgeSimulationResult,
  component: RadiationComponentType
): number[] {
  const curve: number[] = [];
  for (let deg = 0; deg <= 90; deg++) {
    const vals = getMonthlyRadiationForAngle(res, component, deg);
    const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
    curve.push(mean);
  }
  return curve;
}

/**
 * Extracts the 12 monthly daily radiation values for a specific tilt angle (0 to 90 degrees)
 * for the selected radiation component (global, beam, diffuse, albedo, all).
 */
export function getMonthlyRadiationForAngle(
  res: SolarBridgeSimulationResult,
  component: RadiationComponentType,
  angleDeg: number
): number[] {
  const actualComp = component === 'all' ? 'global' : component;
  const comp91 = res.optimalAnnual.components91;
  const horizComp = res.optimalAnnual.horizontalComponents;

  // Horizontal plane (0 degrees)
  if (angleDeg === 0) {
    if (horizComp) {
      if (actualComp === 'global') return horizComp.global;
      if (actualComp === 'beam') return horizComp.beam;
      if (actualComp === 'diffuse') return horizComp.diffuse;
      if (actualComp === 'albedo') return horizComp.albedo;
    }
    if (actualComp === 'global') return res.horizontal.gdm0;
    if (actualComp === 'beam') return res.horizontal.bdm0;
    if (actualComp === 'diffuse') return res.horizontal.ddm0;
    return new Array(12).fill(0.0);
  }

  // Tilted plane (1 to 90 degrees)
  const angleIdx = Math.max(0, Math.min(90, Math.round(angleDeg) - 1));

  if (comp91) {
    const matrix =
      actualComp === 'global'
        ? comp91.global
        : actualComp === 'beam'
        ? comp91.beam
        : actualComp === 'diffuse'
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
 * Shows MATLAB Figura 5.2.48 Warning Dialog for Albedo Radiation
 */
function showAlbedoWarningModal(isEn: boolean) {
  const existing = document.getElementById('matlab-albedo-warning-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-albedo-warning-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Warning' : 'Aviso'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body">
        <div class="matlab-dialog-icon">
          <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
            <path d="M24 4L2 42h44L24 4z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
            <path d="M24 16v14" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
            <circle cx="24" cy="35" r="2.5" fill="#ffffff"/>
          </svg>
        </div>
        <p class="matlab-dialog-msg">
          ${isEn
            ? 'Albedo radiation gains with respect to the horizontal plane cannot be calculated, since Rdm(0º) = 0'
            : 'Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0'}
        </p>
      </div>
      <div class="matlab-dialog-actions">
        <button type="button" class="matlab-btn-default btn-close-modal">OK</button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.querySelector('.btn-close-modal')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
}

/**
 * Shows MATLAB Figura 5.2.65 Choice Dialog for Excel Export
 */
export function showExcelExportModal(
  res: SolarBridgeSimulationResult,
  angleX: number,
  isEn: boolean,
  activeComponent: TableRadiationComponent = stateTableComponent
) {
  const existing = document.getElementById('matlab-excel-export-modal');
  if (existing) existing.remove();

  const compLabelName =
    activeComponent === 'global'
      ? (isEn ? 'Global' : 'Global')
      : activeComponent === 'beam'
      ? (isEn ? 'Direct' : 'Directa')
      : activeComponent === 'diffuse'
      ? (isEn ? 'Diffuse' : 'Difusa')
      : (isEn ? 'Albedo' : 'Albedo');

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-excel-export-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 530px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Select the desired option' : 'Seleccione la opción deseada'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body">
        <div class="matlab-dialog-icon">
          <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
            <circle cx="24" cy="24" r="22" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
            <path d="M19 18a5 5 0 0 1 10 0c0 3-4 4.5-4 7m0 5.5h.01" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="matlab-dialog-msg" style="font-weight: 600; font-size: 1rem;">
          ${isEn ? 'What would you like to export to an Excel file?' : '¿Qué desea exportar a un fichero Excel?'}
        </p>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: center; gap: 1rem; padding-bottom: 1.25rem;">
        <button type="button" id="btn-excel-export-single" class="matlab-btn-default" style="font-weight: 600; padding: 0.6rem 1.25rem;">
          ${isEn ? `Only analyzed component (${compLabelName})` : `Sólo la componente analizada (${compLabelName})`}
        </button>
        <button type="button" id="btn-excel-export-all" class="matlab-btn-primary" style="font-weight: 600; padding: 0.6rem 1.25rem;">
          ${isEn ? 'All components' : 'Todas las componentes'}
        </button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  backdrop.querySelector('#btn-excel-export-single')?.addEventListener('click', () => {
    close();
    exportOptimalAnnualToExcel(res, 'single', activeComponent, angleX, isEn);
  });

  backdrop.querySelector('#btn-excel-export-all')?.addEventListener('click', () => {
    close();
    exportOptimalAnnualToExcel(res, 'all', activeComponent, angleX, isEn);
  });

  document.body.appendChild(backdrop);
}

/**
 * Generates and saves the unified master Excel file (.xlsx) with all components,
 * Resumen_General, Ranking_Superficie, Energia_Generada, and Mapa_Perdidas.
 */
function exportOptimalAnnualToExcel(
  res: SolarBridgeSimulationResult,
  mode: 'single' | 'all',
  activeComponent: TableRadiationComponent,
  _angleX: number,
  isEn: boolean
) {
  exportOrientSolMasterExcel(res, {
    activeStudyOp: 'annual',
    activeComponent,
    exportMode: mode,
    isEn,
    peakPowerKw: solarSyncState.getPeakPowerKw(),
    performanceRatio: solarSyncState.getPerformanceRatio(),
    tonc: solarSyncState.getTonc(),
  });
}

/**
 * Renders the full interactive OrientSol 4.0 "Inclinación Óptima Anual" study component.
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
    const rad0 = getMonthlyRadiationForAngle(res, stateTableComponent, 0);
    const rad15 = getMonthlyRadiationForAngle(res, stateTableComponent, 15);
    const rad30 = getMonthlyRadiationForAngle(res, stateTableComponent, 30);
    const rad45 = getMonthlyRadiationForAngle(res, stateTableComponent, 45);
    const rad60 = getMonthlyRadiationForAngle(res, stateTableComponent, 60);
    const rad75 = getMonthlyRadiationForAngle(res, stateTableComponent, 75);
    const rad90 = getMonthlyRadiationForAngle(res, stateTableComponent, 90);

    // Optimal Angle and Angle X for current table component
    const radOpt = getMonthlyRadiationForAngle(res, stateTableComponent, optAngle);
    const radX = getMonthlyRadiationForAngle(res, stateTableComponent, stateAngleX);

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
    const isAlbedo = stateTableComponent === 'albedo';
    const gainsHoriz = calculateGains(radOpt, rad0);
    const meanFactorHoriz = mean0 > 0.001 ? meanOpt / mean0 : 1.0;
    const annualGainVsHorizPct = mean0 > 0.001 ? ((meanOpt - mean0) / mean0) * 100 : 0;
    const meanPctHoriz = meanOf(gainsHoriz.pcts);

    // Gains vs Angle X
    const gainsX = calculateGains(radOpt, radX);
    const meanFactorX = meanOf(gainsX.factors);
    const meanPctX = meanOf(gainsX.pcts);

    // Chart 91-point curves
    const radiationCurve91 = getRadiationCurve91(res, stateChartComponent);
    const allCurves = {
      global: getRadiationCurve91(res, 'global'),
      beam: getRadiationCurve91(res, 'beam'),
      diffuse: getRadiationCurve91(res, 'diffuse'),
      albedo: getRadiationCurve91(res, 'albedo'),
    };

    const compSymbol =
      stateTableComponent === 'global'
        ? 'Gdm'
        : stateTableComponent === 'beam'
        ? 'Bdm'
        : stateTableComponent === 'diffuse'
        ? 'Ddm'
        : 'Rdm';

    const compLabelName =
      stateTableComponent === 'global'
        ? t.results.radGlobal
        : stateTableComponent === 'beam'
        ? t.results.radBeam
        : stateTableComponent === 'diffuse'
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
              .replace('{pct}', formatNum(diffPct, 2))
              .replace('{kwh}', formatInt(Math.round(diffAnnualKwh)))
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
              .replace('{pct}', formatNum(Math.abs(diffPct), 2))
              .replace('{optBeta}', String(optAngle))}</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="result-card opt-study-card">
        <!-- 1. Header matching OrientSol 4.0 MATLAB Window -->
        <div class="opt-study-header">
          <div class="opt-study-meta">
            <div class="meta-item">
              <span class="meta-label">${isEn ? 'City / Location' : 'Ciudad'}:</span>
              <strong class="meta-val meta-city">${locationName}</strong>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isEn ? 'Latitude' : 'Latitud'} (°):</span>
              <strong class="meta-val">${formatNum(latitude, 2)}°</strong>
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

        <!-- 2. Interactive Control Bar (Top component selector: only global, beam, diffuse, albedo) -->
        <div class="opt-study-controls-bar">
          <div class="control-group-comp">
            <label for="opt-study-comp-select" class="comp-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="12" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
              </svg>
              <span>${t.results.selectComponent}</span>
            </label>
            <select id="opt-study-comp-select" class="select-comp-dropdown">
              <option value="global" ${stateTableComponent === 'global' ? 'selected' : ''}>${t.results.compGlobal}</option>
              <option value="beam" ${stateTableComponent === 'beam' ? 'selected' : ''}>${t.results.compBeam}</option>
              <option value="diffuse" ${stateTableComponent === 'diffuse' ? 'selected' : ''}>${t.results.compDiffuse}</option>
              <option value="albedo" ${stateTableComponent === 'albedo' ? 'selected' : ''}>${t.results.compAlbedo}</option>
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

            <button id="btn-toggle-charts-view" class="btn-study-view-charts ${stateShowCharts ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              <span>${stateShowCharts ? (isEn ? 'Hide Charts' : 'Ocultar gráficas') : t.results.viewChartsBtn}</span>
            </button>
          </div>
        </div>

        <!-- 3. Angle X Selection Drawer / Toolbar (When opened or active) -->
        ${stateShowAnglePicker ? `
        <div id="anglex-picker-drawer" class="anglex-drawer visible">
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
        ` : ''}

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

                // For Albedo radiation, display hyphens (-) matching MATLAB Figura 5.2.49
                const displayFactH = isAlbedo ? '-' : formatNum(factH, 2);
                const displayPctH = isAlbedo ? '-' : `${pctH >= 0 ? '+' : ''}${formatNum(pctH, 2)}`;

                return `
                  <tr>
                    <td class="td-month-name"><strong>${monthName}</strong></td>
                    <td class="td-num">${formatNum(g0, 2)}</td>
                    <td class="td-num">${formatNum(g15, 2)}</td>
                    <td class="td-num">${formatNum(g30, 2)}</td>
                    <td class="td-num">${formatNum(g45, 2)}</td>
                    <td class="td-num">${formatNum(g60, 2)}</td>
                    <td class="td-num">${formatNum(g75, 2)}</td>
                    <td class="td-num">${formatNum(g90, 2)}</td>
                    <td class="td-num td-col-opt"><strong>${formatNum(gOpt, 2)}</strong></td>
                    ${stateComparisonMode ? `<td class="td-num td-col-anglex"><strong>${formatNum(gX, 2)}</strong></td>` : ''}
                    <td class="td-num td-col-temp">${formatNum(temp, 1)}</td>
                    <td class="td-num td-gain-factor">${displayFactH}</td>
                    <td class="td-num td-gain-pct ${!isAlbedo && pctH >= 0 ? 'text-gain-pos' : !isAlbedo ? 'text-gain-neg' : ''}">${displayPctH}</td>
                    ${
                      stateComparisonMode
                        ? `
                      <td class="td-num td-gain-factor-x">${formatNum(factX, 2)}</td>
                      <td class="td-num td-gain-pct-x ${pctX >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">${pctX >= 0 ? '+' : ''}${formatNum(pctX, 2)}</td>
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
                <td class="td-num"><strong>${formatNum(mean0, 2)}</strong></td>
                <td class="td-num"><strong>${formatNum(mean15, 2)}</strong></td>
                <td class="td-num"><strong>${formatNum(mean30, 2)}</strong></td>
                <td class="td-num"><strong>${formatNum(mean45, 2)}</strong></td>
                <td class="td-num"><strong>${formatNum(mean60, 2)}</strong></td>
                <td class="td-num"><strong>${formatNum(mean75, 2)}</strong></td>
                <td class="td-num"><strong>${formatNum(mean90, 2)}</strong></td>
                <td class="td-num td-col-opt"><strong>${formatNum(meanOpt, 2)}</strong></td>
                ${stateComparisonMode ? `<td class="td-num td-col-anglex"><strong>${formatNum(meanX, 2)}</strong></td>` : ''}
                <td class="td-num td-col-temp"><strong>${formatNum(tempMeanAnnual, 1)}</strong></td>
                <td class="td-num td-gain-factor" title="${isEn ? 'Annual Resource Gain Factor' : 'Factor de ganancia anual del recurso'}"><strong>${isAlbedo ? '-' : formatNum(meanFactorHoriz, 2)}</strong></td>
                <td class="td-num td-gain-pct ${!isAlbedo && annualGainVsHorizPct >= 0 ? 'text-gain-pos' : !isAlbedo ? 'text-gain-neg' : ''}" title="${isEn ? `Annual Resource Gain: ${formatPercent(annualGainVsHorizPct, 2, true)} (Monthly unweighted avg: ${formatPercent(meanPctHoriz, 2, true)})` : `Ganancia anual del recurso: ${formatPercent(annualGainVsHorizPct, 2, true)} (Media mensual sin ponderar: ${formatPercent(meanPctHoriz, 2, true)})`}"><strong>${isAlbedo ? '-' : formatPercent(annualGainVsHorizPct, 2, true)}</strong></td>
                ${
                  stateComparisonMode
                    ? `
                  <td class="td-num td-gain-factor-x"><strong>${formatNum(meanFactorX, 2)}</strong></td>
                  <td class="td-num td-gain-pct-x ${meanPctX >= 0 ? 'text-gain-pos' : 'text-gain-neg'}"><strong>${formatPercent(meanPctX, 2, true)}</strong></td>
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
            <div class="kpi-mini-main">${formatNum(meanOpt, 2)} <small>kWh/m²/d</small></div>
            <span class="kpi-mini-sub">${formatInt(meanOpt * 365)} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>

          <div class="kpi-mini-card kpi-anglex">
            <span class="kpi-mini-title">${isEn ? `Selected Angle X (β = ${stateAngleX}°)` : `Ángulo Seleccionado X (β = ${stateAngleX}°)`}</span>
            <div class="kpi-mini-main">${formatNum(meanX, 2)} <small>kWh/m²/d</small></div>
            <span class="kpi-mini-sub">${formatInt(meanX * 365)} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>

          <div class="kpi-mini-card kpi-gain">
            <span class="kpi-mini-title">${isEn ? 'Net Gain (Optimal vs Angle X)' : 'Ganancia Neta (Óptimo vs Ángulo X)'}</span>
            <div class="kpi-mini-main text-gain">${diffPct >= 0 ? '+' : ''}${formatNum(diffPct, 2)}%</div>
            <span class="kpi-mini-sub">${diffAnnualKwh >= 0 ? '+' : ''}${formatInt(diffAnnualKwh)} kWh/m²·${isEn ? 'yr' : 'año'}</span>
          </div>

          <div class="kpi-mini-card kpi-horiz">
            <span class="kpi-mini-title">${isEn ? 'Gain over Horizontal (0°)' : 'Ganancia s/ Horizontal (0°)'}</span>
            <div class="kpi-mini-main" style="color: var(--accent-cyan);">${isAlbedo ? '-' : `${annualGainVsHorizPct >= 0 ? '+' : ''}${formatNum(annualGainVsHorizPct, 2)}%`}</div>
            <span class="kpi-mini-sub">${isAlbedo ? 'Rdm(0°) = 0' : `${(meanOpt - mean0) * 365 >= 0 ? '+' : ''}${formatInt((meanOpt - mean0) * 365)} kWh/m²·${isEn ? 'yr' : 'año'}`}</span>
          </div>
        </div>

        <!-- 6.1 Graphical Visualization Section matching MATLAB OrientSol 4.0 (Grafica_Inclinaciones.fig & Grafica_OptAnual.fig) -->
        ${stateShowCharts ? `
          <div id="opt-charts-panel" class="opt-charts-panel">
            <div class="opt-charts-header">
              <div class="opt-charts-tabs">
                <button
                  type="button"
                  id="btn-chart-tab-evolution"
                  class="opt-chart-tab-btn ${stateActiveChartTab === 'evolution' ? 'active' : ''}"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                  <span>${t.results.chartEvolutionTab}</span>
                </button>
                <button
                  type="button"
                  id="btn-chart-tab-monthly"
                  class="opt-chart-tab-btn ${stateActiveChartTab === 'monthly' ? 'active' : ''}"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="12" width="4" height="9"></rect>
                    <rect x="10" y="7" width="4" height="14"></rect>
                    <rect x="17" y="3" width="4" height="18"></rect>
                  </svg>
                  <span>${t.results.chartMonthlyTab}</span>
                </button>
              </div>

              <div class="opt-charts-controls">
                <label class="opt-grid-toggle">
                  <input type="checkbox" id="chk-chart-grid" ${stateGridEnabled ? 'checked' : ''} />
                  <span>${t.results.chartEnableGrid}</span>
                </label>
              </div>
            </div>

            <!-- Sub-view 1: Grafica_Inclinaciones (Figuras 5.2.57, 5.2.58, 5.2.59) -->
            ${stateActiveChartTab === 'evolution' ? `
              <div class="opt-chart-view opt-view-evolution">
                <!-- Top MATLAB Window Header -->
                <div class="opt-chart-view-intro">
                  <div class="opt-chart-title-block">
                    <h4 class="opt-chart-question">${t.results.chartHowVariesQuestion}</h4>
                    <span class="opt-chart-matlab-brand">ORIENT<strong>SOL 4.0</strong></span>
                  </div>

                  <!-- Component Selector with 'Todas' included -->
                  <div class="opt-chart-inline-toolbar">
                    <div class="opt-chart-comp-picker">
                      <label for="chart-comp-dropdown" class="chart-comp-label">
                        ${isEn ? 'Select a component:' : 'Seleccione una componente:'}
                      </label>
                      <select id="chart-comp-dropdown" class="form-select select-chart-comp">
                        <option value="global" ${stateChartComponent === 'global' ? 'selected' : ''}>${t.results.compGlobal}</option>
                        <option value="beam" ${stateChartComponent === 'beam' ? 'selected' : ''}>${t.results.compBeam}</option>
                        <option value="diffuse" ${stateChartComponent === 'diffuse' ? 'selected' : ''}>${t.results.compDiffuse}</option>
                        <option value="albedo" ${stateChartComponent === 'albedo' ? 'selected' : ''}>${t.results.compAlbedo}</option>
                        <option value="all" ${stateChartComponent === 'all' ? 'selected' : ''}>${t.results.compAll}</option>
                      </select>
                    </div>

                    <!-- Standalone Local Save Button -->
                    <div class="opt-chart-export-tools">
                      <button
                        type="button"
                        id="btn-save-chart-local"
                        class="btn btn-primary btn-sm btn-chart-save"
                        title="${t.results.saveChartLocalBtn}"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        <span>${t.results.saveChartLocalBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Live feedback banner for local saving -->
                <div id="chart-save-feedback" class="chart-save-feedback hidden"></div>

                <div class="opt-svg-wrapper">
                  ${renderInclinationEvolutionSvg({
                    radiationCurve: radiationCurve91,
                    allCurves,
                    component: stateChartComponent,
                    optimalAngle: optAngle,
                    selectedAngleX: stateAngleX,
                    gridEnabled: stateGridEnabled,
                    isEn,
                  })}
                </div>

                <!-- Bottom MATLAB controls matching Figure 5.2.57 & Figure 5.2.59 -->
                <div class="opt-chart-bottom-toolbar">
                  <button type="button" id="btn-chart-back" class="btn btn-secondary btn-sm btn-matlab-volver">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>${t.results.chartBackBtn}</span>
                  </button>

                  <label class="opt-grid-toggle">
                    <input type="checkbox" id="chk-chart-grid-bottom" ${stateGridEnabled ? 'checked' : ''} />
                    <span>${t.results.chartEnableGrid}</span>
                  </label>
                </div>

                <div class="opt-chart-note">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>${isEn
                    ? `Peak radiation occurs at β = ${optAngle}° with ${formatNum(meanOpt, 2)} kWh/m²/day. Horizontal plane (0°) yields ${formatNum(mean0, 2)} kWh/m²/day, and selected Angle X (β = ${stateAngleX}°) yields ${formatNum(meanX, 2)} kWh/m²/day.`
                    : `El punto de máxima captación se sitúa en β = ${optAngle}° con ${formatNum(meanOpt, 2)} kWh/m²/día. La superficie horizontal (0°) capta ${formatNum(mean0, 2)} kWh/m²/día, y el ángulo seleccionado X (β = ${stateAngleX}°) capta ${formatNum(meanX, 2)} kWh/m²/día.`
                  }</span>
                </div>
              </div>
            ` : `
              <!-- Sub-view 2: Dedicated MATLAB OrientSol 4.0 Gráficas Inclinación Óptima Anual (Figuras 5.2.99, 5.2.107, 5.2.108, 5.2.109, 5.2.110) -->
              <div id="matlab-opt-graphs-mount-point"></div>
            `}
          </div>
        ` : ''}

        <!-- 6.5 Mapa de Pérdidas de Captación (CTE DB-HE4) para Inclinación Óptima Anual -->
        <div id="annual-loss-map-mount-point"></div>

        <!-- 7. Action Button Footer matching OrientSol MATLAB window -->
        <div class="opt-study-footer-actions">
          <div class="footer-btn-left-group">
            <button id="btn-opt-volver" class="btn-study-foot btn-volver" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>${isEn ? 'Back' : 'Volver'}</span>
            </button>
            <button id="btn-opt-salir" class="btn-study-foot btn-salir" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>${isEn ? 'Exit' : 'Salir'}</span>
            </button>
          </div>

          <div class="footer-btn-right-group">
            <button id="btn-goto-energy" class="btn-study-foot btn-energy ${stateShowEnergy ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>${stateShowEnergy ? (isEn ? 'Hide Energy Calculation' : 'Ocultar cálculo de energía') : t.results.energyCalcBtn}</span>
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

        <!-- 8. Mount point for Dedicated MATLAB Energy Calculation Window (Imagen 1 / Energia_Osterwald.m) -->
        <div id="opt-energy-mount-point"></div>
      </div>
    `;

    // Mount Active Sub-Windows
    // 0.0 CTE DB-HE4 Capture Loss Map
    const lossMapMountPoint = container.querySelector<HTMLDivElement>('#annual-loss-map-mount-point');
    if (lossMapMountPoint) {
      lossMapMountPoint.innerHTML = '';
      const lossMapSection = renderCaptureLossMapSection({
        mode: 'annual',
        simulationResult: res,
        isEn,
      });
      lossMapMountPoint.appendChild(lossMapSection);
    }

    // 0.1 Dedicated MATLAB Graphs Window (Figuras 5.2.99 / 5.2.107 / 5.2.108 / 5.2.109 / 5.2.110)
    const graphsMountPoint = container.querySelector<HTMLDivElement>('#matlab-opt-graphs-mount-point');
    if (graphsMountPoint && stateShowCharts && stateActiveChartTab === 'monthly') {
      graphsMountPoint.innerHTML = '';
      const graphsWindow = renderOptimalAnnualGraphsWindow({
        simulationResult: res,
        locationName,
        latitude,
        onBack: () => {
          stateShowCharts = false;
          renderInternal();
          container.querySelector('.control-group-actions')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        onExit: () => {
          stateShowCharts = false;
          renderInternal();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      });
      graphsMountPoint.appendChild(graphsWindow);
    }

    // 0.2 Dedicated MATLAB Energy Calculation Window (Imagen 1 / Energia_Osterwald.m)
    const energyMountPoint = container.querySelector<HTMLDivElement>('#opt-energy-mount-point');
    if (energyMountPoint && stateShowEnergy) {
      energyMountPoint.innerHTML = '';
      const energyWindow = renderEnergyCalculationPanel({
        simulationResult: res,
        locationName,
        latitude,
        studyType: 'annual',
        initialPeakKw: props.peakPowerKw ?? 5.0,
        onClose: () => {
          stateShowEnergy = false;
          renderInternal();
          container.querySelector('.opt-study-footer-actions')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
      });
      energyMountPoint.appendChild(energyWindow);
    }

    // Attach Event Listeners
    // 1. Top Component Dropdown Change (Only global, beam, diffuse, albedo)
    const compSelect = container.querySelector<HTMLSelectElement>('#opt-study-comp-select');
    compSelect?.addEventListener('change', () => {
      const val = (compSelect.value || 'global') as TableRadiationComponent;
      stateTableComponent = val;
      stateChartComponent = val; // Synchronized
      if (val === 'albedo') {
        showAlbedoWarningModal(isEn);
      }
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

    // 5. Toggle and Scroll to Charts View (Figuras 5.2.99 / 5.2.107 / 5.2.108 / 5.2.109 / 5.2.110)
    const btnToggleCharts = container.querySelector<HTMLButtonElement>('#btn-toggle-charts-view');
    btnToggleCharts?.addEventListener('click', () => {
      stateShowCharts = !stateShowCharts;
      stateActiveChartTab = 'monthly';
      renderInternal();
      if (stateShowCharts) {
        setTimeout(() => {
          container.querySelector('#opt-charts-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });

    // 5.1 Chart Sub-tabs
    const btnTabEvolution = container.querySelector<HTMLButtonElement>('#btn-chart-tab-evolution');
    btnTabEvolution?.addEventListener('click', () => {
      stateActiveChartTab = 'evolution';
      renderInternal();
    });

    const btnTabMonthly = container.querySelector<HTMLButtonElement>('#btn-chart-tab-monthly');
    btnTabMonthly?.addEventListener('click', () => {
      stateActiveChartTab = 'monthly';
      renderInternal();
    });

    // 5.2 Grid Checkboxes (top and bottom)
    const chkGrid = container.querySelector<HTMLInputElement>('#chk-chart-grid');
    chkGrid?.addEventListener('change', () => {
      stateGridEnabled = chkGrid.checked;
      renderInternal();
    });

    const chkGridBottom = container.querySelector<HTMLInputElement>('#chk-chart-grid-bottom');
    chkGridBottom?.addEventListener('change', () => {
      stateGridEnabled = chkGridBottom.checked;
      renderInternal();
    });

    // 5.3 Inline Chart Component Dropdown (Evolution Tab)
    const chartCompDropdown = container.querySelector<HTMLSelectElement>('#chart-comp-dropdown');
    chartCompDropdown?.addEventListener('change', () => {
      const val = (chartCompDropdown.value || 'all') as RadiationComponentType;
      if (val === 'all') {
        stateChartComponent = 'all';
      } else {
        stateChartComponent = val;
        stateTableComponent = val as TableRadiationComponent; // Synchronized for non-'all'
        if (val === 'albedo') {
          showAlbedoWarningModal(isEn);
        }
      }
      renderInternal();
    });

    // 5.3.1 Inline Chart Component Dropdown (Monthly Tab)
    const chartCompDropdownMonthly = container.querySelector<HTMLSelectElement>('#chart-comp-dropdown-monthly');
    chartCompDropdownMonthly?.addEventListener('change', () => {
      const val = (chartCompDropdownMonthly.value || 'all') as RadiationComponentType;
      if (val === 'all') {
        stateChartComponent = 'all';
      } else {
        stateChartComponent = val;
        stateTableComponent = val as TableRadiationComponent;
        if (val === 'albedo') {
          showAlbedoWarningModal(isEn);
        }
      }
      renderInternal();
    });

    // 5.4 Standalone Local Save Action
    const btnSaveChart = container.querySelector<HTMLButtonElement>('#btn-save-chart-local');
    const saveFeedback = container.querySelector<HTMLElement>('#chart-save-feedback');
    btnSaveChart?.addEventListener('click', async () => {
      const svgEl = container.querySelector<SVGSVGElement>('#svg-inclination-evolution');
      if (!svgEl) return;

      const compName = stateChartComponent === 'all' ? (isEn ? 'All_Components' : 'Todas_Componentes') : stateChartComponent;
      const cleanLoc = locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `OrientSol3_Variacion_Radiacion_${cleanLoc}_${compName}`;

      btnSaveChart.disabled = true;
      btnSaveChart.classList.add('loading');

      const resSave = await saveSvgChartLocally(svgEl, fileName, isEn);

      btnSaveChart.disabled = false;
      btnSaveChart.classList.remove('loading');

      if (saveFeedback) {
        if (resSave.success) {
          saveFeedback.textContent = resSave.message || t.results.saveChartSuccess;
          saveFeedback.className = 'chart-save-feedback feedback-success';
          saveFeedback.classList.remove('hidden');
          setTimeout(() => saveFeedback?.classList.add('hidden'), 4500);
        } else if (resSave.message) {
          saveFeedback.textContent = resSave.message;
          saveFeedback.className = 'chart-save-feedback feedback-error';
          saveFeedback.classList.remove('hidden');
          setTimeout(() => saveFeedback?.classList.add('hidden'), 4500);
        }
      }
    });

    // 5.5 Chart "Volver" button
    const btnChartBack = container.querySelector<HTMLButtonElement>('#btn-chart-back');
    btnChartBack?.addEventListener('click', () => {
      const topTable = container.querySelector('.opt-table-responsive');
      if (topTable) {
        topTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 6. Toggle Dedicated Osterwald Energy Calculation Panel (Imagen 1 / Energia_Osterwald.m)
    const btnGotoEnergy = container.querySelector<HTMLButtonElement>('#btn-goto-energy');
    btnGotoEnergy?.addEventListener('click', () => {
      stateShowEnergy = !stateShowEnergy;
      renderInternal();
      if (stateShowEnergy) {
        setTimeout(() => {
          container.querySelector('#opt-energy-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });

    // 7. Export Table to Excel (Figura 5.2.65 modal -> Figura 5.2.68 layout)
    const btnExportExcel = container.querySelector<HTMLButtonElement>('#btn-export-opt-excel');
    btnExportExcel?.addEventListener('click', () => {
      showExcelExportModal(res, stateAngleX, isEn, stateTableComponent);
    });

    // 8. Generate Report (PDF)
    const btnExportReport = container.querySelector<HTMLButtonElement>('#btn-export-opt-report');
    btnExportReport?.addEventListener('click', () => {
      showExportComponentChoiceModal({
        exportType: 'pdf',
        activeComponent: stateTableComponent,
        isEn,
        onConfirm: (mode) => {
          showPdfGenerationNoticeModal(isEn, () => {
            generateOrientSolPDFReport(res, isEn, 'annual', {
              peakPowerKw: solarSyncState.getPeakPowerKw(),
              performanceRatio: solarSyncState.getPerformanceRatio(),
              tonc: solarSyncState.getTonc(),
              componentsMode: mode,
              activeComponent: stateTableComponent,
            });
          });
        },
      });
    });

    // 9. Volver & Salir actions
    container.querySelector<HTMLButtonElement>('#btn-opt-volver')?.addEventListener('click', () => {
      if (props.onBack) props.onBack();
    });
    container.querySelector<HTMLButtonElement>('#btn-opt-salir')?.addEventListener('click', () => {
      if (props.onExit) props.onExit();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial internal render
  renderInternal();

  return container;
}
