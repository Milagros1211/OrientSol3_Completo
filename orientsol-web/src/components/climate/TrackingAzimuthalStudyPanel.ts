import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { renderEnergyCalculationPanel } from '@/components/energy/EnergyCalculationPanel';
import { renderTrackingAzimuthalGraphsWindow } from '@/components/charts/TrackingAzimuthalGraphsWindow';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolPDFReport,
} from '@/components/export/pdfReportGenerator';
import * as XLSX from 'xlsx';

export type TrackingRadiationComponent = 'global' | 'beam' | 'diffuse' | 'albedo' | 'all';

interface TrackingStudyProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  peakPowerKw?: number;
  onBack?: () => void;
  onExit?: () => void;
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let stateAzimComponent: TrackingRadiationComponent = 'global';
let stateAzimShowEnergy: boolean = false;
let stateAzimShowGraphs: boolean = false;

/**
 * Renders OrientSol 3.0 - Seguimiento a un eje azimutal (Tabla_EjeAzimutal.m)
 */
export function renderTrackingAzimuthalStudyPanel(props: TrackingStudyProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;
  const container = document.createElement('div');
  container.className = 'opt-tracking-study-card';
  container.id = 'tracking-azimuthal-study-window';

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;

    const compActual = stateAzimComponent === 'all' ? 'global' : stateAzimComponent;
    const compSym = compActual === 'global' ? 'Gdm' : compActual === 'beam' ? 'Bdm' : compActual === 'diffuse' ? 'Ddm' : 'Rdm';
    const compLabel = compActual === 'global' ? (isEn ? 'Global' : 'global') : compActual === 'beam' ? (isEn ? 'Direct' : 'directa') : compActual === 'diffuse' ? (isEn ? 'Diffuse' : 'difusa') : (isEn ? 'Albedo' : 'albedo');

    const tempMean = res.temperatures.ambient.monthlyMeanC;
    const tempAnnualMean = res.temperatures.ambient.annualMeanC;

    const radHoriz = compActual === 'global'
      ? res.horizontal.gdm0
      : compActual === 'beam'
      ? res.horizontal.bdm0
      : compActual === 'diffuse'
      ? res.horizontal.ddm0
      : new Array(12).fill(0.0);

    const azimComps = res.tracking.azimuthalAxis.components;
    const radAzim = azimComps
      ? (azimComps[compActual as keyof typeof azimComps] || res.tracking.azimuthalAxis.monthlyDailyKwh)
      : res.tracking.azimuthalAxis.monthlyDailyKwh;

    const radAnnualOpt = res.optimalAnnual.monthlyDailyKwh;
    const radSeasonalOpt = res.seasonal.monthlyDailyKwh;
    const radPolar = res.tracking.polarAxis.monthlyDailyKwh;
    const radHorizTrack = res.tracking.horizontalAxis.monthlyDailyKwh;

    const calcGains = (target: number[]) =>
      radAzim.map((a, i) => (target[i] > 0 ? ((a - target[i]) / target[i]) * 100 : 0));

    const gainsOverHoriz = calcGains(res.horizontal.gdm0);
    const gainsOverAnnual = calcGains(radAnnualOpt);
    const gainsOverSeasonal = calcGains(radSeasonalOpt);
    const gainsOverPolar = calcGains(radPolar);
    const gainsOverHorizTrack = calcGains(radHorizTrack);

    const meanHoriz = radHoriz.reduce((a, b) => a + b, 0) / 12;
    const meanAzim = radAzim.reduce((a, b) => a + b, 0) / 12;
    const meanGainHoriz = ((meanAzim - (res.horizontal.gdm0.reduce((a, b) => a + b, 0) / 12)) / (res.horizontal.gdm0.reduce((a, b) => a + b, 0) / 12)) * 100;
    const meanGainAnnual = ((meanAzim - res.optimalAnnual.annualMeanDailyKwh) / res.optimalAnnual.annualMeanDailyKwh) * 100;
    const meanGainSeasonal = ((meanAzim - res.seasonal.annualMeanDailyKwh) / res.seasonal.annualMeanDailyKwh) * 100;
    const meanGainPolar = ((meanAzim - res.tracking.polarAxis.annualMeanDailyKwh) / res.tracking.polarAxis.annualMeanDailyKwh) * 100;
    const meanGainHorizTrack = ((meanAzim - res.tracking.horizontalAxis.annualMeanDailyKwh) / res.tracking.horizontalAxis.annualMeanDailyKwh) * 100;

    // SVG Diagram of Azimuthal Tracking (Vertical Axis rotation)
    const azimDiagramSvg = `
      <svg viewBox="0 0 220 180" class="tracking-panel-illustration" style="width: 100%; max-width: 200px; height: auto;">
        <!-- Base pedestal -->
        <rect x="85" y="145" width="50" height="15" fill="#334155" stroke="#0f172a" stroke-width="2" rx="3" />
        <rect x="100" y="75" width="20" height="70" fill="#64748b" stroke="#1e293b" stroke-width="2" />
        <!-- Rotating Azimuth turntable ring -->
        <ellipse cx="110" cy="115" rx="36" ry="12" fill="none" stroke="#f97316" stroke-width="3" stroke-dasharray="6,4" />
        <!-- Fixed-tilt frame atop vertical column -->
        <polygon points="40,65 180,65 160,25 20,25" fill="#38bdf8" fill-opacity="0.85" stroke="#0284c7" stroke-width="2" />
        <!-- Panel Grid Lines -->
        <line x1="68" y1="65" x2="48" y2="25" stroke="#0369a1" stroke-width="1.2" />
        <line x1="96" y1="65" x2="76" y2="25" stroke="#0369a1" stroke-width="1.2" />
        <line x1="124" y1="65" x2="104" y2="25" stroke="#0369a1" stroke-width="1.2" />
        <line x1="152" y1="65" x2="132" y2="25" stroke="#0369a1" stroke-width="1.2" />
        <line x1="30" y1="45" x2="170" y2="45" stroke="#0369a1" stroke-width="1.2" />
        <!-- Azimuth Rotation Arrow around base -->
        <path d="M 80,125 A 36,12 0 1,0 140,125" fill="none" stroke="#ea580c" stroke-width="3" />
        <polygon points="144,123 136,117 138,129" fill="#ea580c" />
      </svg>
    `;

    container.innerHTML = `
      <div class="opt-tracking-study-frame">
        <div class="opt-tracking-header-bar">
          <div class="opt-tracking-header-left">
            <div class="opt-tracking-meta-row">
              <span class="meta-label"><strong>${isEn ? 'City:' : 'Ciudad:'}</strong> ${locationName}</span>
              <span class="meta-label" style="margin-left: 2rem;">
                <strong>${isEn ? 'Latitude (°):' : 'Latitud (°):'}</strong>
                <span style="color: #38bdf8; font-weight: 700;">${latitude.toFixed(2)}</span>
              </span>
            </div>
            <div class="opt-tracking-study-row">
              <span class="meta-label">
                <strong>${isEn ? 'Study:' : 'Estudio:'}</strong>
                <span style="color: #f97316; font-weight: 600;">${isEn ? 'Single-axis azimuthal tracking' : 'Seguimiento a un eje azimutal'}</span>
              </span>
            </div>
          </div>
          <div class="opt-tracking-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>3.0</strong>
            </div>
          </div>
        </div>

        <div class="opt-tracking-toolbar">
          <div class="opt-tracking-comp-selector">
            <label for="tracking-azim-comp-select" class="tracking-comp-label">
              ${isEn ? 'Select a component' : 'Seleccione una componente'}
            </label>
            <select id="tracking-azim-comp-select" class="tracking-comp-dropdown">
              <option value="global" ${stateAzimComponent === 'global' ? 'selected' : ''}>${isEn ? 'Global' : 'Global'}</option>
              <option value="beam" ${stateAzimComponent === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
              <option value="diffuse" ${stateAzimComponent === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
              <option value="albedo" ${stateAzimComponent === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
            </select>
          </div>

          <button id="btn-azim-view-charts" class="btn-tracking-charts" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span>${isEn ? 'View charts' : 'Ver gráficas'}</span>
          </button>
        </div>

        <div class="opt-tracking-caption">
          ${isEn ? `Monthly average daily ${compLabel} radiation (kWh/m²/day)` : `Radiación ${compLabel} media mensual (kWh/m²/día)`}
        </div>

        <div class="opt-tracking-content-grid">
          <div class="opt-tracking-table-wrap">
            <table class="opt-tracking-table">
              <thead>
                <tr class="tracking-header-super">
                  <th rowspan="2" class="th-month">${isEn ? 'Month' : 'Mes'}</th>
                  <th rowspan="2" class="th-rad-0">${compSym} (0°)</th>
                  <th rowspan="2" class="th-rad-track">${compSym}</th>
                  <th rowspan="2" class="th-temp">${isEn ? 'Mean Tª' : 'Tª media'}</th>
                  <th colspan="5" class="th-gains-super">${isEn ? 'Gains (%)' : 'Ganancias (%)'}</th>
                </tr>
                <tr class="tracking-header-sub">
                  <th class="th-gain-sub">${isEn ? 'Horizontal' : 'Plano horizontal'}</th>
                  <th class="th-gain-sub">${isEn ? 'Annual opt.' : 'Inclinación ópt. anual'}</th>
                  <th class="th-gain-sub">${isEn ? 'Seasonal opt.' : 'Inclin. ópt. estacional'}</th>
                  <th class="th-gain-sub">${isEn ? 'Polar 1-axis' : 'Seg. a un eje polar'}</th>
                  <th class="th-gain-sub">${isEn ? 'Horiz. 1-axis' : 'Seg. a un eje horizontal'}</th>
                </tr>
              </thead>
              <tbody>
                ${months.map((mName, i) => {
                  const g0 = radHoriz[i];
                  const pVal = radAzim[i];
                  const tVal = tempMean[i];
                  const gHor = gainsOverHoriz[i];
                  const gAnn = gainsOverAnnual[i];
                  const gSeas = gainsOverSeasonal[i];
                  const gPol = gainsOverPolar[i];
                  const gHz = gainsOverHorizTrack[i];

                  return `
                    <tr class="tracking-row-month">
                      <td class="td-month-name">${mName}</td>
                      <td class="td-val-horiz">${g0.toFixed(2)}</td>
                      <td class="td-val-track">${pVal.toFixed(2)}</td>
                      <td class="td-val-temp">${tVal !== undefined ? tVal.toFixed(1) : '-'}</td>
                      <td class="td-gain-val ${gHor >= 0 ? 'gain-pos' : 'gain-neg'}">${gHor.toFixed(2)}</td>
                      <td class="td-gain-val ${gAnn >= 0 ? 'gain-pos' : 'gain-neg'}">${gAnn.toFixed(2)}</td>
                      <td class="td-gain-val ${gSeas >= 0 ? 'gain-pos' : 'gain-neg'}">${gSeas.toFixed(2)}</td>
                      <td class="td-gain-val ${gPol >= 0 ? 'gain-pos' : 'gain-neg'}">${gPol.toFixed(2)}</td>
                      <td class="td-gain-val ${gHz >= 0 ? 'gain-pos' : 'gain-neg'}">${gHz.toFixed(2)}</td>
                    </tr>
                  `;
                }).join('')}

                <tr class="tracking-row-media">
                  <td class="td-media-label">${isEn ? 'MEAN' : 'MEDIA'}</td>
                  <td class="td-media-val">${meanHoriz.toFixed(2)}</td>
                  <td class="td-media-val">${meanAzim.toFixed(2)}</td>
                  <td class="td-media-val">${tempAnnualMean !== undefined ? tempAnnualMean.toFixed(2) : '-'}</td>
                  <td class="td-media-val ${meanGainHoriz >= 0 ? 'gain-pos' : 'gain-neg'}">${meanGainHoriz.toFixed(2)}</td>
                  <td class="td-media-val ${meanGainAnnual >= 0 ? 'gain-pos' : 'gain-neg'}">${meanGainAnnual.toFixed(2)}</td>
                  <td class="td-media-val ${meanGainSeasonal >= 0 ? 'gain-pos' : 'gain-neg'}">${meanGainSeasonal.toFixed(2)}</td>
                  <td class="td-media-val ${meanGainPolar >= 0 ? 'gain-pos' : 'gain-neg'}">${meanGainPolar.toFixed(2)}</td>
                  <td class="td-media-val ${meanGainHorizTrack >= 0 ? 'gain-pos' : 'gain-neg'}">${meanGainHorizTrack.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="opt-tracking-diagram-sidebar">
            <div class="tracking-diagram-card">
              ${azimDiagramSvg}
              <div class="tracking-diagram-caption">
                <strong>${isEn ? 'Azimuthal 1-Axis' : 'Eje Azimutal'}</strong><br/>
                <span style="font-size: 0.8rem; opacity: 0.85;">${isEn ? 'Vertical axis tracking' : 'Giro continuo azimutal'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="opt-tracking-footer-buttons">
          <div class="footer-left-buttons">
            <button id="btn-azim-salir" class="btn-study-foot btn-salir" type="button">
              ${isEn ? 'Exit' : 'Salir'}
            </button>
            <button id="btn-azim-volver" class="btn-study-foot btn-volver" type="button">
              ${isEn ? 'Back' : 'Volver'}
            </button>
          </div>

          <div class="footer-right-buttons">
            <button id="btn-azim-goto-energy" class="btn-study-foot btn-energy" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>${isEn ? 'Energy calculation' : 'Cálculo de energía'}</span>
            </button>

            <button id="btn-azim-export-excel" class="btn-study-foot btn-excel" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${isEn ? 'Export to Excel' : 'Exportar a Excel'}</span>
            </button>

            <button id="btn-azim-export-report" class="btn-study-foot btn-report" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>${isEn ? 'Generate report' : 'Generar un informe'}</span>
            </button>
          </div>
        </div>

        <div id="opt-azim-graphs-mount-point"></div>
        <div id="opt-azim-energy-mount-point"></div>
      </div>
    `;

    const graphsMountPoint = container.querySelector<HTMLDivElement>('#opt-azim-graphs-mount-point');
    if (graphsMountPoint && stateAzimShowGraphs) {
      graphsMountPoint.innerHTML = '';
      const graphsWindow = renderTrackingAzimuthalGraphsWindow({
        simulationResult: res,
        locationName,
        latitude,
        initialComponent: stateAzimComponent as any,
        onBack: () => {
          stateAzimShowGraphs = false;
          renderInternal();
        },
        onExit: () => {
          stateAzimShowGraphs = false;
          renderInternal();
          if (onExit) onExit();
        },
      });
      graphsMountPoint.appendChild(graphsWindow);
    }

    const energyMountPoint = container.querySelector<HTMLDivElement>('#opt-azim-energy-mount-point');
    if (energyMountPoint && stateAzimShowEnergy) {
      energyMountPoint.innerHTML = '';
      const energyWindow = renderEnergyCalculationPanel({
        simulationResult: res,
        locationName,
        latitude,
        studyType: 'azimuthal',
        initialPeakKw: props.peakPowerKw ?? 5.0,
        onClose: () => {
          stateAzimShowEnergy = false;
          renderInternal();
        },
      });
      energyMountPoint.appendChild(energyWindow);
    }

    container.querySelector<HTMLSelectElement>('#tracking-azim-comp-select')?.addEventListener('change', (e) => {
      stateAzimComponent = (e.target as HTMLSelectElement).value as TrackingRadiationComponent;
      renderInternal();
    });

    container.querySelector<HTMLButtonElement>('#btn-azim-goto-energy')?.addEventListener('click', () => {
      stateAzimShowEnergy = !stateAzimShowEnergy;
      renderInternal();
      if (stateAzimShowEnergy) {
        setTimeout(() => {
          container.querySelector('#opt-azim-energy-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });

    container.querySelector<HTMLButtonElement>('#btn-azim-view-charts')?.addEventListener('click', () => {
      stateAzimShowGraphs = !stateAzimShowGraphs;
      renderInternal();
      if (stateAzimShowGraphs) {
        setTimeout(() => {
          container.querySelector('#opt-azim-graphs-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });

    container.querySelector<HTMLButtonElement>('#btn-azim-volver')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    container.querySelector<HTMLButtonElement>('#btn-azim-salir')?.addEventListener('click', () => {
      if (onExit) onExit();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    container.querySelector<HTMLButtonElement>('#btn-azim-export-excel')?.addEventListener('click', () => {
      exportAzimuthalTrackingToExcel(res, isEn);
    });

    container.querySelector<HTMLButtonElement>('#btn-azim-export-report')?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolPDFReport(res, isEn, 'azimuthal');
      });
    });
  }

  renderInternal();
  return container;
}

function exportAzimuthalTrackingToExcel(res: SolarBridgeSimulationResult, isEn: boolean) {
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const tempMean = res.temperatures.ambient.monthlyMeanC;
  const radHoriz = res.horizontal.gdm0;
  const radAzim = res.tracking.azimuthalAxis.monthlyDailyKwh;

  const data: any[][] = [];
  data[0] = [res.locationName, isEn ? 'Latitude' : 'Latitud', res.latitude, '', isEn ? 'Single-axis azimuthal tracking' : 'Seguimiento a un eje azimutal'];
  data[1] = [];
  data[2] = [
    isEn ? 'Month' : 'Mes',
    'Gdm (0°)',
    'Gdm',
    isEn ? 'Mean Temp (°C)' : 'Tª media (°C)',
    isEn ? 'Gain Horiz (%)' : 'Plano horizontal (%)',
    isEn ? 'Gain Annual Opt (%)' : 'Inclinación ópt. anual (%)',
    isEn ? 'Gain Seasonal Opt (%)' : 'Inclin. ópt. estacional (%)',
    isEn ? 'Gain Polar 1-Axis (%)' : 'Seg. a un eje polar (%)',
    isEn ? 'Gain Horizontal 1-Axis (%)' : 'Seg. a un eje horizontal (%)',
  ];

  for (let i = 0; i < 12; i++) {
    const a = radAzim[i];
    const g0 = radHoriz[i];
    const gAnn = res.optimalAnnual.monthlyDailyKwh[i];
    const gSeas = res.seasonal.monthlyDailyKwh[i];
    const gPol = res.tracking.polarAxis.monthlyDailyKwh[i];
    const gHz = res.tracking.horizontalAxis.monthlyDailyKwh[i];

    data[3 + i] = [
      months[i],
      g0,
      a,
      tempMean[i],
      g0 > 0 ? ((a - g0) / g0) * 100 : 0,
      gAnn > 0 ? ((a - gAnn) / gAnn) * 100 : 0,
      gSeas > 0 ? ((a - gSeas) / gSeas) * 100 : 0,
      gPol > 0 ? ((a - gPol) / gPol) * 100 : 0,
      gHz > 0 ? ((a - gHz) / gHz) * 100 : 0,
    ];
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, isEn ? 'Azimuthal_Tracking' : 'Seg_Eje_Azimutal');
  XLSX.writeFile(wb, `OrientSol3_Seg_Eje_Azimutal_${res.locationName.replace(/\s+/g, '_')}.xlsx`);
}
