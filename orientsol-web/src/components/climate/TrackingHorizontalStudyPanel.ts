import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { renderEnergyCalculationPanel } from '@/components/energy/EnergyCalculationPanel';
import { renderTrackingHorizontalGraphsWindow } from '@/components/charts/TrackingHorizontalGraphsWindow';
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

let stateHorizComponent: TrackingRadiationComponent = 'global';
let stateHorizShowEnergy: boolean = false;
let stateHorizShowGraphs: boolean = false;

/**
 * Renders OrientSol 3.0 - Seguimiento a un eje horizontal (Tabla_EjeHorizontal.m)
 */
export function renderTrackingHorizontalStudyPanel(props: TrackingStudyProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;
  const container = document.createElement('div');
  container.className = 'opt-tracking-study-card';
  container.id = 'tracking-horizontal-study-window';

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;

    const compActual = stateHorizComponent === 'all' ? 'global' : stateHorizComponent;
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

    const horizComps = res.tracking.horizontalAxis.components;
    const radHorizTrack = horizComps
      ? (horizComps[compActual as keyof typeof horizComps] || res.tracking.horizontalAxis.monthlyDailyKwh)
      : res.tracking.horizontalAxis.monthlyDailyKwh;

    const radAnnualOpt = res.optimalAnnual.monthlyDailyKwh;
    const radSeasonalOpt = res.seasonal.monthlyDailyKwh;
    const radPolar = res.tracking.polarAxis.monthlyDailyKwh;
    const radAzim = res.tracking.azimuthalAxis.monthlyDailyKwh;

    const calcGains = (target: number[]) =>
      radHorizTrack.map((h, i) => (target[i] > 0 ? ((h - target[i]) / target[i]) * 100 : 0));

    const gainsOverHoriz = calcGains(res.horizontal.gdm0);
    const gainsOverAnnual = calcGains(radAnnualOpt);
    const gainsOverSeasonal = calcGains(radSeasonalOpt);
    const gainsOverPolar = calcGains(radPolar);
    const gainsOverAzim = calcGains(radAzim);

    const meanHoriz = radHoriz.reduce((a, b) => a + b, 0) / 12;
    const meanHorizTrack = radHorizTrack.reduce((a, b) => a + b, 0) / 12;
    const meanGainHoriz = ((meanHorizTrack - (res.horizontal.gdm0.reduce((a, b) => a + b, 0) / 12)) / (res.horizontal.gdm0.reduce((a, b) => a + b, 0) / 12)) * 100;
    const meanGainAnnual = ((meanHorizTrack - res.optimalAnnual.annualMeanDailyKwh) / res.optimalAnnual.annualMeanDailyKwh) * 100;
    const meanGainSeasonal = ((meanHorizTrack - res.seasonal.annualMeanDailyKwh) / res.seasonal.annualMeanDailyKwh) * 100;
    const meanGainPolar = ((meanHorizTrack - res.tracking.polarAxis.annualMeanDailyKwh) / res.tracking.polarAxis.annualMeanDailyKwh) * 100;
    const meanGainAzim = ((meanHorizTrack - res.tracking.azimuthalAxis.annualMeanDailyKwh) / res.tracking.azimuthalAxis.annualMeanDailyKwh) * 100;

    // SVG Diagram of Horizontal Axis Tracking (East-West rotating roll tracker)
    const horizDiagramSvg = `
      <svg viewBox="0 0 220 180" class="tracking-panel-illustration" style="width: 100%; max-width: 200px; height: auto;">
        <!-- Two support pillars -->
        <rect x="30" y="110" width="16" height="50" fill="#475569" stroke="#0f172a" stroke-width="2" rx="2" />
        <rect x="174" y="110" width="16" height="50" fill="#475569" stroke="#0f172a" stroke-width="2" rx="2" />
        <rect x="20" y="155" width="36" height="10" fill="#334155" rx="2" />
        <rect x="164" y="155" width="36" height="10" fill="#334155" rx="2" />
        <!-- Horizontal Torque Tube Axis -->
        <line x1="38" y1="115" x2="182" y2="115" stroke="#f97316" stroke-width="6" stroke-linecap="round" />
        <!-- Rotating Bearings -->
        <circle cx="38" cy="115" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
        <circle cx="182" cy="115" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
        <!-- Tilted PV Module Rows along horizontal torque tube -->
        <polygon points="50,90 170,90 160,135 40,135" fill="#0284c7" fill-opacity="0.85" stroke="#38bdf8" stroke-width="2" />
        <!-- Grid cells on PV collector -->
        <line x1="90" y1="90" x2="80" y2="135" stroke="#ffffff" stroke-width="1" stroke-opacity="0.6" />
        <line x1="130" y1="90" x2="120" y2="135" stroke="#ffffff" stroke-width="1" stroke-opacity="0.6" />
        <line x1="45" y1="112" x2="165" y2="112" stroke="#ffffff" stroke-width="1" stroke-opacity="0.6" />
        <!-- Rotation curvature arrow (East-West tracking roll) -->
        <path d="M 110,65 A 35,35 0 0,1 138,82" fill="none" stroke="#e11d48" stroke-width="3" marker-end="url(#arrow-h)" stroke-dasharray="4,2" />
        <!-- Text labels -->
        <text x="110" y="45" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Eje Horizontal N-S (Roll E-O)</text>
      </svg>
    `;

    container.innerHTML = `
      <div class="opt-tracking-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 0.6rem; margin-bottom: 1rem;">
        <div>
          <span style="font-size: 0.95rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
            ${isEn ? 'Study:' : 'Estudio:'}
          </span>
          <span style="font-size: 1.15rem; font-weight: 800; color: #0284c7; margin-left: 0.4rem;">
            ${isEn ? 'Single-Axis Horizontal Tracking' : 'Seguimiento a un eje horizontal'}
          </span>
          <div style="font-size: 0.88rem; color: #94a3b8; margin-top: 0.2rem;">
            <span>${isEn ? 'City:' : 'Ciudad:'} <strong style="color: #f8fafc;">${locationName}</strong></span>
            <span style="margin-left: 1.2rem;">${isEn ? 'Latitude:' : 'Latitud:'} <strong style="color: #38bdf8;">${latitude.toFixed(2)}°</strong></span>
            <span style="margin-left: 1.2rem;">${isEn ? 'Axis Orientation:' : 'Orientación de eje:'} <strong style="color: #f97316;">Horizontal E-O / N-S</strong></span>
          </div>
        </div>
        <div class="orientsol-brand-badge" style="font-size: 1.3rem; font-weight: 900; letter-spacing: 1px; color: #38bdf8;">
          ORIENT<span style="color: #f59e0b;">SOL</span> 3.0
        </div>
      </div>

      <div class="tracking-top-controls" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <label for="select-horiz-comp" style="font-weight: 700; font-size: 0.92rem; color: #cbd5e1;">
            ${isEn ? 'Select a component:' : 'Seleccione una componente:'}
          </label>
          <select id="select-horiz-comp" class="matlab-select" style="min-width: 140px; padding: 0.35rem 0.6rem; font-weight: 600;">
            <option value="global" ${stateHorizComponent === 'global' ? 'selected' : ''}>${isEn ? 'Global' : 'Global'}</option>
            <option value="beam" ${stateHorizComponent === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
            <option value="diffuse" ${stateHorizComponent === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
            <option value="albedo" ${stateHorizComponent === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
          </select>
        </div>
        <div>
          <button type="button" id="btn-horiz-graphs" class="btn-study-view-charts ${stateHorizShowGraphs ? 'active' : ''}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
            <span>${stateHorizShowGraphs ? (isEn ? 'Hide Charts' : 'Ocultar gráficas') : (isEn ? 'View Charts' : 'Ver gráficas')}</span>
          </button>
        </div>
      </div>

      <!-- Main Layout: Table on left, Illustration & Summary on right -->
      <div style="display: grid; grid-template-columns: 1fr 240px; gap: 1.2rem; align-items: start;">
        <div style="overflow-x: auto; background: #0f172a; border-radius: 8px; border: 1px solid #1e293b;">
          <div style="padding: 0.5rem 0.8rem; background: #1e293b; color: #94a3b8; font-size: 0.82rem; font-weight: 600; text-transform: uppercase;">
            ${isEn ? 'Mean Monthly Radiation' : 'Radiación media mensual'} (${compLabel}) - (kWh/m²/día)
          </div>
          <table class="matlab-results-table" style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: center;">
            <thead>
              <tr style="background: #1e293b; color: #e2e8f0; border-bottom: 2px solid #334155;">
                <th style="padding: 0.5rem; text-align: left;">${isEn ? 'Month' : 'Mes'}</th>
                <th style="padding: 0.5rem;">${compSym} (0°)</th>
                <th style="padding: 0.5rem; background: rgba(2, 132, 199, 0.2); color: #38bdf8;">${compSym} (Seg. horizontal)</th>
                <th style="padding: 0.5rem;">% Gan. 0°</th>
                <th style="padding: 0.5rem;">% Gan. Ópt. Anual</th>
                <th style="padding: 0.5rem;">% Gan. Ópt. Estac.</th>
                <th style="padding: 0.5rem;">% Gan. Seg. Polar</th>
                <th style="padding: 0.5rem;">% Gan. Seg. Azim.</th>
                <th style="padding: 0.5rem;">Tª Med (°C)</th>
              </tr>
            </thead>
            <tbody>
              ${months.map((mName, i) => `
                <tr style="border-bottom: 1px solid #1e293b; ${i % 2 === 0 ? 'background: #0b1120;' : 'background: #0f172a;'}">
                  <td style="padding: 0.45rem 0.6rem; text-align: left; font-weight: 600; color: #cbd5e1;">${mName}</td>
                  <td style="padding: 0.45rem;">${radHoriz[i].toFixed(2)}</td>
                  <td style="padding: 0.45rem; font-weight: 700; color: #38bdf8; background: rgba(2, 132, 199, 0.08);">${radHorizTrack[i].toFixed(2)}</td>
                  <td style="padding: 0.45rem; color: ${gainsOverHoriz[i] >= 0 ? '#10b981' : '#f43f5e'}; font-weight: 600;">
                    ${gainsOverHoriz[i] >= 0 ? '+' : ''}${gainsOverHoriz[i].toFixed(1)}%
                  </td>
                  <td style="padding: 0.45rem; color: ${gainsOverAnnual[i] >= 0 ? '#10b981' : '#f43f5e'}; font-weight: 600;">
                    ${gainsOverAnnual[i] >= 0 ? '+' : ''}${gainsOverAnnual[i].toFixed(1)}%
                  </td>
                  <td style="padding: 0.45rem; color: ${gainsOverSeasonal[i] >= 0 ? '#10b981' : '#f43f5e'}; font-weight: 600;">
                    ${gainsOverSeasonal[i] >= 0 ? '+' : ''}${gainsOverSeasonal[i].toFixed(1)}%
                  </td>
                  <td style="padding: 0.45rem; color: ${gainsOverPolar[i] >= 0 ? '#10b981' : '#f43f5e'}; font-weight: 600;">
                    ${gainsOverPolar[i] >= 0 ? '+' : ''}${gainsOverPolar[i].toFixed(1)}%
                  </td>
                  <td style="padding: 0.45rem; color: ${gainsOverAzim[i] >= 0 ? '#10b981' : '#f43f5e'}; font-weight: 600;">
                    ${gainsOverAzim[i] >= 0 ? '+' : ''}${gainsOverAzim[i].toFixed(1)}%
                  </td>
                  <td style="padding: 0.45rem; color: #f59e0b; font-weight: 600;">${tempMean[i].toFixed(1)}</td>
                </tr>
              `).join('')}
              <tr style="background: #1e293b; font-weight: 800; border-top: 2px solid #0284c7; color: #f8fafc;">
                <td style="padding: 0.55rem 0.6rem; text-align: left; text-transform: uppercase; color: #38bdf8;">${isEn ? 'Mean' : 'Media'}</td>
                <td style="padding: 0.55rem;">${meanHoriz.toFixed(2)}</td>
                <td style="padding: 0.55rem; color: #38bdf8;">${meanHorizTrack.toFixed(2)}</td>
                <td style="padding: 0.55rem; color: ${meanGainHoriz >= 0 ? '#10b981' : '#f43f5e'};">
                  ${meanGainHoriz >= 0 ? '+' : ''}${meanGainHoriz.toFixed(1)}%
                </td>
                <td style="padding: 0.55rem; color: ${meanGainAnnual >= 0 ? '#10b981' : '#f43f5e'};">
                  ${meanGainAnnual >= 0 ? '+' : ''}${meanGainAnnual.toFixed(1)}%
                </td>
                <td style="padding: 0.55rem; color: ${meanGainSeasonal >= 0 ? '#10b981' : '#f43f5e'};">
                  ${meanGainSeasonal >= 0 ? '+' : ''}${meanGainSeasonal.toFixed(1)}%
                </td>
                <td style="padding: 0.55rem; color: ${meanGainPolar >= 0 ? '#10b981' : '#f43f5e'};">
                  ${meanGainPolar >= 0 ? '+' : ''}${meanGainPolar.toFixed(1)}%
                </td>
                <td style="padding: 0.55rem; color: ${meanGainAzim >= 0 ? '#10b981' : '#f43f5e'};">
                  ${meanGainAzim >= 0 ? '+' : ''}${meanGainAzim.toFixed(1)}%
                </td>
                <td style="padding: 0.55rem; color: #f59e0b;">${tempAnnualMean.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sidebar illustration and tracker configuration info -->
        <div style="background: #0f172a; border-radius: 8px; border: 1px solid #1e293b; padding: 1rem; text-align: center;">
          <h4 style="margin: 0 0 0.8rem; font-size: 0.9rem; color: #38bdf8; text-transform: uppercase;">
            ${isEn ? 'Horizontal Tracker Setup' : 'Geometría del Seguidor'}
          </h4>
          ${horizDiagramSvg}
          <div style="margin-top: 1rem; text-align: left; font-size: 0.82rem; color: #94a3b8; line-height: 1.4;">
            <p style="margin: 0 0 0.4rem;">
              <strong style="color: #cbd5e1;">${isEn ? 'Axis Elevation:' : 'Elevación de eje:'}</strong> 0° (${isEn ? 'Horizontal' : 'Horizontal'})
            </p>
            <p style="margin: 0 0 0.4rem;">
              <strong style="color: #cbd5e1;">${isEn ? 'Tracking Range:' : 'Rango de giro:'}</strong> ±45° / ±60° ${isEn ? 'E-W roll' : 'balanceo E-O'}
            </p>
            <p style="margin: 0;">
              <strong style="color: #cbd5e1;">${isEn ? 'Annual Gain vs 0°:' : 'Ganancia anual vs 0°:'}</strong>
              <span style="color: #10b981; font-weight: bold;">+${meanGainHoriz.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons Bar -->
      <div class="opt-study-footer-actions">
        <div class="footer-btn-left-group">
          <button type="button" id="btn-horiz-back" class="btn-study-foot btn-volver">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>${isEn ? 'Back' : 'Volver'}</span>
          </button>
          <button type="button" id="btn-horiz-exit" class="btn-study-foot btn-salir">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>${isEn ? 'Exit' : 'Salir'}</span>
          </button>
        </div>
        <div class="footer-btn-right-group">
          <button type="button" id="btn-horiz-energy" class="btn-study-foot btn-energy ${stateHorizShowEnergy ? 'active' : ''}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>${stateHorizShowEnergy ? (isEn ? 'Hide Energy Calculation' : 'Ocultar cálculo de energía') : (isEn ? 'Energy Calculation' : 'Cálculo de energía')}</span>
          </button>
          <button type="button" id="btn-horiz-excel" class="btn-study-foot btn-excel">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>${isEn ? 'Export to Excel' : 'Exportar a Excel'}</span>
          </button>
          <button type="button" id="btn-horiz-pdf" class="btn-study-foot btn-report">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>${isEn ? 'Generate Report' : 'Generar un informe'}</span>
          </button>
        </div>
      </div>

      <!-- Optional Embedded Views -->
      <div id="horiz-extra-content-area" style="margin-top: 1.5rem;"></div>
    `;

    // Hook listeners
    const selComp = container.querySelector('#select-horiz-comp') as HTMLSelectElement;
    selComp?.addEventListener('change', () => {
      stateHorizComponent = selComp.value as TrackingRadiationComponent;
      renderInternal();
    });

    const extraArea = container.querySelector('#horiz-extra-content-area') as HTMLElement;

    const btnEnergy = container.querySelector('#btn-horiz-energy') as HTMLButtonElement;
    btnEnergy?.addEventListener('click', () => {
      stateHorizShowEnergy = !stateHorizShowEnergy;
      stateHorizShowGraphs = false;
      renderInternal();
    });

    const btnGraphs = container.querySelector('#btn-horiz-graphs') as HTMLButtonElement;
    btnGraphs?.addEventListener('click', () => {
      stateHorizShowGraphs = !stateHorizShowGraphs;
      stateHorizShowEnergy = false;
      renderInternal();
    });

    if (stateHorizShowEnergy && extraArea) {
      extraArea.innerHTML = '';
      const energyPanel = renderEnergyCalculationPanel({
        simulationResult: res,
        locationName,
        latitude,
        studyType: 'horizontal',
        onClose: () => {
          stateHorizShowEnergy = false;
          renderInternal();
        }
      });
      extraArea.appendChild(energyPanel);
    } else if (stateHorizShowGraphs && extraArea) {
      extraArea.innerHTML = '';
      const graphsWindow = renderTrackingHorizontalGraphsWindow({
        simulationResult: res,
        locationName,
        latitude,
        onBack: () => {
          stateHorizShowGraphs = false;
          renderInternal();
        },
        onExit: () => {
          stateHorizShowGraphs = false;
          renderInternal();
        }
      });
      extraArea.appendChild(graphsWindow);
    }

    container.querySelector('#btn-horiz-back')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    container.querySelector('#btn-horiz-exit')?.addEventListener('click', () => {
      if (onExit) onExit();
    });

    container.querySelector('#btn-horiz-excel')?.addEventListener('click', () => {
      exportToExcel(isEn, months, radHoriz, radHorizTrack, gainsOverHoriz, gainsOverAnnual, gainsOverSeasonal, gainsOverPolar, gainsOverAzim, tempMean, meanHoriz, meanHorizTrack, meanGainHoriz, meanGainAnnual, meanGainSeasonal, meanGainPolar, meanGainAzim, tempAnnualMean, locationName, latitude);
    });

    container.querySelector('#btn-horiz-pdf')?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolPDFReport(res, isEn, 'horizontal');
      });
    });
  }

  function exportToExcel(
    isEn: boolean,
    months: string[],
    radHoriz: number[],
    radHorizTrack: number[],
    gainsHoriz: number[],
    gainsAnu: number[],
    gainsEst: number[],
    gainsPol: number[],
    gainsAzi: number[],
    tempMean: number[],
    meanHoriz: number,
    meanHorizTrack: number,
    meanGainHoriz: number,
    meanGainAnu: number,
    meanGainEst: number,
    meanGainPol: number,
    meanGainAzi: number,
    tempAnnualMean: number,
    loc: string,
    lat: number
  ) {
    const data: any[] = [
      [isEn ? 'OrientSol 3.0 - Single-Axis Horizontal Tracking Report' : 'OrientSol 3.0 - Informe Seguimiento a un Eje Horizontal'],
      [`${isEn ? 'Location' : 'Localización'}: ${loc}`, `${isEn ? 'Latitude' : 'Latitud'}: ${lat}°`],
      [],
      [
        isEn ? 'Month' : 'Mes',
        'Gdm (0°)',
        'Gdm (Seg. Horizontal)',
        '% Gan. 0°',
        '% Gan. Ópt. Anual',
        '% Gan. Ópt. Estac.',
        '% Gan. Seg. Polar',
        '% Gan. Seg. Azimutal',
        isEn ? 'Mean Temp (°C)' : 'Tª Media (°C)'
      ]
    ];

    for (let i = 0; i < 12; i++) {
      data.push([
        months[i],
        Number(radHoriz[i].toFixed(2)),
        Number(radHorizTrack[i].toFixed(2)),
        Number(gainsHoriz[i].toFixed(1)),
        Number(gainsAnu[i].toFixed(1)),
        Number(gainsEst[i].toFixed(1)),
        Number(gainsPol[i].toFixed(1)),
        Number(gainsAzi[i].toFixed(1)),
        Number(tempMean[i].toFixed(1))
      ]);
    }

    data.push([
      isEn ? 'MEAN' : 'MEDIA',
      Number(meanHoriz.toFixed(2)),
      Number(meanHorizTrack.toFixed(2)),
      Number(meanGainHoriz.toFixed(1)),
      Number(meanGainAnu.toFixed(1)),
      Number(meanGainEst.toFixed(1)),
      Number(meanGainPol.toFixed(1)),
      Number(meanGainAzi.toFixed(1)),
      Number(tempAnnualMean.toFixed(1))
    ]);

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Seg_Eje_Horizontal');
    XLSX.writeFile(wb, `OrientSol3_Seguimiento_Eje_Horizontal_${loc}.xlsx`);
  }

  renderInternal();
  return container;
}
