import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { renderEnergyCalculationPanel } from '@/components/energy/EnergyCalculationPanel';
import { renderTrackingDualAxisGraphsWindow } from '@/components/charts/TrackingDualAxisGraphsWindow';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolPDFReport,
} from '@/components/export/pdfReportGenerator';
import { exportOrientSolMasterExcel } from '@/components/export/masterExportService';
import { solarSyncState } from '@/services/bridge/solarSyncState';

export type TrackingDualComponent = 'global' | 'beam' | 'diffuse' | 'albedo' | 'all';

interface TrackingDualStudyProps {
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

let stateDualComponent: TrackingDualComponent = 'global';
let stateDualShowEnergy: boolean = false;
let stateDualShowGraphs: boolean = false;

/**
 * Renders OrientSol 3.0 - Seguimiento a dos ejes (Figura 6.3.19)
 */
export function renderTrackingDualAxisStudyPanel(props: TrackingDualStudyProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;
  const container = document.createElement('div');
  container.className = 'opt-tracking-study-card';
  container.id = 'tracking-dual-study-window';

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;

    const compActual = stateDualComponent === 'all' ? 'global' : stateDualComponent;
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

    const dualComps = res.tracking.dualAxis.components;
    const radDual = dualComps
      ? (dualComps[compActual as keyof typeof dualComps] || res.tracking.dualAxis.monthlyDailyKwh)
      : res.tracking.dualAxis.monthlyDailyKwh;

    const radAnnualOpt = res.optimalAnnual.monthlyDailyKwh;
    const radSeasonalOpt = res.seasonal.monthlyDailyKwh;
    const radPolar = res.tracking.polarAxis.monthlyDailyKwh;
    const radAzim = res.tracking.azimuthalAxis.monthlyDailyKwh;
    const radHorizTrack = res.tracking.horizontalAxis.monthlyDailyKwh;

    const calcGains = (target: number[]) =>
      radDual.map((d, i) => (target[i] > 0 ? ((d - target[i]) / target[i]) * 100 : 0));

    const gainsOverHoriz = calcGains(res.horizontal.gdm0);
    const gainsOverAnnual = calcGains(radAnnualOpt);
    const gainsOverSeasonal = calcGains(radSeasonalOpt);
    const gainsOverPolar = calcGains(radPolar);
    const gainsOverAzim = calcGains(radAzim);
    const gainsOverHorizTrack = calcGains(radHorizTrack);

    const meanHoriz = radHoriz.reduce((a, b) => a + b, 0) / 12;
    const meanDual = radDual.reduce((a, b) => a + b, 0) / 12;
    const meanGainHoriz = ((meanDual - (res.horizontal.gdm0.reduce((a, b) => a + b, 0) / 12)) / (res.horizontal.gdm0.reduce((a, b) => a + b, 0) / 12)) * 100;
    const meanGainAnnual = ((meanDual - res.optimalAnnual.annualMeanDailyKwh) / res.optimalAnnual.annualMeanDailyKwh) * 100;
    const meanGainSeasonal = ((meanDual - res.seasonal.annualMeanDailyKwh) / res.seasonal.annualMeanDailyKwh) * 100;
    const meanGainPolar = ((meanDual - res.tracking.polarAxis.annualMeanDailyKwh) / res.tracking.polarAxis.annualMeanDailyKwh) * 100;
    const meanGainAzim = ((meanDual - res.tracking.azimuthalAxis.annualMeanDailyKwh) / res.tracking.azimuthalAxis.annualMeanDailyKwh) * 100;
    const meanGainHorizTrack = ((meanDual - res.tracking.horizontalAxis.annualMeanDailyKwh) / res.tracking.horizontalAxis.annualMeanDailyKwh) * 100;

    // SVG Diagram of 2-Axis Tracking Panel matching Figura 6.3.19
    const dualDiagramSvg = `
      <svg viewBox="0 0 220 180" class="tracking-panel-illustration" style="width: 100%; max-width: 200px; height: auto;">
        <!-- Ground mount column & pedestal -->
        <rect x="104" y="110" width="12" height="40" fill="#334155" />
        <ellipse cx="110" cy="150" rx="30" ry="7" fill="#1e293b" />
        <!-- Dual Axis Turret / Gimbal -->
        <circle cx="110" cy="110" r="10" fill="#475569" stroke="#0f172a" stroke-width="1.5" />
        <!-- Horizontal Rotation Axle -->
        <line x1="25" y1="90" x2="195" y2="90" stroke="#1e293b" stroke-width="5" stroke-linecap="round" />
        <!-- Solar Collector Panel (Horizontal/Elevation Pivot) -->
        <polygon points="35,65 185,65 170,115 50,115" fill="#38bdf8" fill-opacity="0.85" stroke="#0284c7" stroke-width="2" />
        <!-- Cell lines -->
        <line x1="65" y1="65" x2="73" y2="115" stroke="#0369a1" stroke-width="1.2" />
        <line x1="95" y1="65" x2="98" y2="115" stroke="#0369a1" stroke-width="1.2" />
        <line x1="125" y1="65" x2="122" y2="115" stroke="#0369a1" stroke-width="1.2" />
        <line x1="155" y1="65" x2="147" y2="115" stroke="#0369a1" stroke-width="1.2" />
        <line x1="42" y1="90" x2="178" y2="90" stroke="#0369a1" stroke-width="1.2" />
        <!-- 1. Elevation Orange Arrow (Around horizontal axle) -->
        <path d="M 195,78 A 14,14 0 1,1 195,102" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
        <polygon points="190,105 197,100 197,110" fill="#ea580c" />
        <path d="M 25,102 A 14,14 0 1,1 25,78" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
        <polygon points="30,75 23,80 23,70" fill="#ea580c" />
        <!-- 2. Azimuth Orange Arrow (Around vertical pedestal) -->
        <path d="M 90,140 A 24,10 0 1,0 130,140" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
        <polygon points="86,138 94,133 93,145" fill="#ea580c" />
      </svg>
    `;

    container.innerHTML = `
      <div class="opt-tracking-window-frame">
        <!-- 1. Header Bar matching Figura 6.3.19 -->
        <div class="opt-tracking-header-bar">
          <div class="opt-tracking-header-left">
            <div class="opt-tracking-meta-row">
              <span class="meta-label"><strong>${isEn ? 'City:' : 'Ciudad:'}</strong> ${locationName}</span>
              <span class="meta-label" style="margin-left: 2rem;">
                <strong>${isEn ? 'Latitude (°):' : 'Latitud (°):'}</strong>
                <span style="color: #38bdf8; font-weight: 700;">${latitude.toFixed(2)}</span>
              </span>
            </div>
            <div class="opt-tracking-study-title-row">
              <span class="meta-label">
                <strong>${isEn ? 'Study:' : 'Estudio:'}</strong>
                <span style="color: #38bdf8; font-weight: 600;">${isEn ? 'Two-axis solar tracking' : 'Seguimiento a dos ejes'}</span>
              </span>
            </div>
          </div>
          <div class="opt-tracking-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>3.0</strong>
            </div>
          </div>
        </div>

        <!-- 2. Controls Toolbar -->
        <div class="opt-tracking-toolbar">
          <div class="tracking-comp-select-group">
            <label for="tracking-dual-comp-select" class="tracking-comp-label">
              ${isEn ? 'Select a component' : 'Seleccione una componente'}
            </label>
            <select id="tracking-dual-comp-select" class="form-select tracking-comp-dropdown">
              <option value="global" ${stateDualComponent === 'global' ? 'selected' : ''}>Global</option>
              <option value="beam" ${stateDualComponent === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
              <option value="diffuse" ${stateDualComponent === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
              <option value="albedo" ${stateDualComponent === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
              <option value="all" ${stateDualComponent === 'all' ? 'selected' : ''}>${isEn ? 'All' : 'Todas'}</option>
            </select>
          </div>

          <div class="tracking-toolbar-actions">
            <button id="btn-dual-view-charts" class="btn-study-view-charts ${stateDualShowGraphs ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              <span>${stateDualShowGraphs ? (isEn ? 'Hide charts' : 'Ocultar gráficas') : (isEn ? 'View charts' : 'Ver gráficas')}</span>
            </button>
          </div>
        </div>

        <!-- 3. Table Caption -->
        <div class="opt-tracking-table-caption">
          ${isEn ? `Mean monthly daily ${compLabel} radiation (kWh/m²/day)` : `Radiación ${compLabel} media mensual (kWh/m²/día)`}
        </div>

        <!-- 4. Main Matrix Table + Diagram Layout (Figura 6.3.19) -->
        <div class="opt-tracking-content-grid">
          <div class="opt-tracking-table-wrap">
            <table class="opt-tracking-table">
              <thead>
                <tr class="tracking-top-th-row">
                  <th rowspan="2" class="th-track-month">${isEn ? 'Month' : 'Mes'}</th>
                  <th rowspan="2" class="th-track-h0">${compSym} (0°)</th>
                  <th rowspan="2" class="th-track-opt">${compSym}</th>
                  <th rowspan="2" class="th-track-temp">${isEn ? 'Mean Temp' : 'Tª media'}</th>
                  <th colspan="6" class="th-track-gains-super">${isEn ? 'Gains (%)' : 'Ganancias (%)'}</th>
                </tr>
                <tr class="tracking-sub-th-row">
                  <th class="th-gain-sub">${isEn ? 'Horizontal plane' : 'Plano horizontal'}</th>
                  <th class="th-gain-sub">${isEn ? 'Annual opt. tilt' : 'Inclinación ópt. anual'}</th>
                  <th class="th-gain-sub">${isEn ? 'Seasonal opt. tilt' : 'Inclin. ópt. estacional'}</th>
                  <th class="th-gain-sub">${isEn ? 'Polar 1-axis' : 'Seg. a un eje polar'}</th>
                  <th class="th-gain-sub">${isEn ? 'Azimuthal 1-axis' : 'Seg. a un eje azimutal'}</th>
                  <th class="th-gain-sub">${isEn ? 'Horizontal 1-axis' : 'Seg. a un eje horizontal'}</th>
                </tr>
              </thead>
              <tbody>
                ${months.map((mName, i) => `
                  <tr>
                    <td class="td-track-month"><strong>${mName}</strong></td>
                    <td class="td-num">${radHoriz[i].toFixed(2)}</td>
                    <td class="td-num td-track-val"><strong>${radDual[i].toFixed(2)}</strong></td>
                    <td class="td-num td-track-temp">${tempMean[i].toFixed(1)}</td>
                    <td class="td-num">${gainsOverHoriz[i].toFixed(2)}</td>
                    <td class="td-num">${gainsOverAnnual[i].toFixed(2)}</td>
                    <td class="td-num">${gainsOverSeasonal[i].toFixed(2)}</td>
                    <td class="td-num">${gainsOverPolar[i].toFixed(2)}</td>
                    <td class="td-num">${gainsOverAzim[i].toFixed(2)}</td>
                    <td class="td-num">${gainsOverHorizTrack[i].toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="tracking-media-row">
                  <td class="td-track-month"><strong>${isEn ? 'MEAN' : 'MEDIA'}</strong></td>
                  <td class="td-num"><strong>${meanHoriz.toFixed(2)}</strong></td>
                  <td class="td-num td-track-val"><strong>${meanDual.toFixed(2)}</strong></td>
                  <td class="td-num td-track-temp"><strong>${tempAnnualMean.toFixed(1)}</strong></td>
                  <td class="td-num"><strong>${meanGainHoriz.toFixed(2)}</strong></td>
                  <td class="td-num"><strong>${meanGainAnnual.toFixed(2)}</strong></td>
                  <td class="td-num"><strong>${meanGainSeasonal.toFixed(2)}</strong></td>
                  <td class="td-num"><strong>${meanGainPolar.toFixed(2)}</strong></td>
                  <td class="td-num"><strong>${meanGainAzim.toFixed(2)}</strong></td>
                  <td class="td-num"><strong>${meanGainHorizTrack.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Illustration Sidebar -->
          <div class="opt-tracking-diagram-sidebar">
            ${dualDiagramSvg}
            <div class="tracking-diagram-caption">
              ${isEn ? 'Two-axis solar tracking with continuous azimuth and elevation tracking' : 'Seguimiento a dos ejes con orientación azimutal y elevación continua'}
            </div>
          </div>
        </div>

        <!-- 5. Footer Buttons matching Figura 6.3.19 -->
        <div class="opt-study-footer-actions">
          <div class="footer-btn-left-group">
            <button id="btn-dual-volver" class="btn-study-foot btn-volver" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>${isEn ? 'Back' : 'Volver'}</span>
            </button>
            <button id="btn-dual-salir" class="btn-study-foot btn-salir" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>${isEn ? 'Exit' : 'Salir'}</span>
            </button>
          </div>

          <div class="footer-btn-right-group">
            <button id="btn-dual-goto-energy" class="btn-study-foot btn-energy ${stateDualShowEnergy ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>${stateDualShowEnergy ? (isEn ? 'Hide energy calculation' : 'Ocultar cálculo de energía') : (isEn ? 'Energy calculation' : 'Cálculo de energía')}</span>
            </button>

            <button id="btn-dual-export-excel" class="btn-study-foot btn-excel" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${isEn ? 'Export to Excel' : 'Exportar a Excel'}</span>
            </button>

            <button id="btn-dual-export-report" class="btn-study-foot btn-report" type="button">
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

        <!-- Mount points for Dedicated Graphs Window and Energy Window -->
        <div id="opt-dual-graphs-mount-point"></div>
        <div id="opt-dual-energy-mount-point"></div>
      </div>
    `;

    // Mount Graphs Window if active
    const graphsMountPoint = container.querySelector<HTMLDivElement>('#opt-dual-graphs-mount-point');
    if (graphsMountPoint && stateDualShowGraphs) {
      graphsMountPoint.innerHTML = '';
      const graphsWindow = renderTrackingDualAxisGraphsWindow({
        simulationResult: res,
        locationName,
        latitude,
        initialComponent: stateDualComponent as any,
        onBack: () => {
          stateDualShowGraphs = false;
          renderInternal();
        },
        onExit: () => {
          stateDualShowGraphs = false;
          renderInternal();
          if (onExit) onExit();
        },
      });
      graphsMountPoint.appendChild(graphsWindow);
    }

    const energyMountPoint = container.querySelector<HTMLDivElement>('#opt-dual-energy-mount-point');
    if (energyMountPoint && stateDualShowEnergy) {
      energyMountPoint.innerHTML = '';
      const energyWindow = renderEnergyCalculationPanel({
        simulationResult: res,
        locationName,
        latitude,
        studyType: 'dual',
        initialPeakKw: props.peakPowerKw ?? 5.0,
        onClose: () => {
          stateDualShowEnergy = false;
          renderInternal();
        },
      });
      energyMountPoint.appendChild(energyWindow);
    }

    container.querySelector<HTMLSelectElement>('#tracking-dual-comp-select')?.addEventListener('change', (e) => {
      stateDualComponent = (e.target as HTMLSelectElement).value as TrackingDualComponent;
      renderInternal();
    });

    container.querySelector<HTMLButtonElement>('#btn-dual-goto-energy')?.addEventListener('click', () => {
      stateDualShowEnergy = !stateDualShowEnergy;
      renderInternal();
      if (stateDualShowEnergy) {
        setTimeout(() => {
          container.querySelector('#opt-dual-energy-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });

    container.querySelector<HTMLButtonElement>('#btn-dual-view-charts')?.addEventListener('click', () => {
      stateDualShowGraphs = !stateDualShowGraphs;
      renderInternal();
      if (stateDualShowGraphs) {
        setTimeout(() => {
          container.querySelector('#opt-dual-graphs-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });

    container.querySelector<HTMLButtonElement>('#btn-dual-volver')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    container.querySelector<HTMLButtonElement>('#btn-dual-salir')?.addEventListener('click', () => {
      if (onExit) onExit();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    container.querySelector<HTMLButtonElement>('#btn-dual-export-excel')?.addEventListener('click', () => {
      exportOrientSolMasterExcel(res, {
        activeStudyOp: 'dual',
        activeComponent: stateDualComponent,
        isEn,
        peakPowerKw: solarSyncState.getPeakPowerKw(),
        performanceRatio: solarSyncState.getPerformanceRatio(),
        tonc: solarSyncState.getTonc(),
      });
    });

    container.querySelector<HTMLButtonElement>('#btn-dual-export-report')?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolPDFReport(res, isEn, 'dual', {
          peakPowerKw: solarSyncState.getPeakPowerKw(),
          performanceRatio: solarSyncState.getPerformanceRatio(),
          tonc: solarSyncState.getTonc(),
        });
      });
    });
  }

  renderInternal();
  return container;
}
