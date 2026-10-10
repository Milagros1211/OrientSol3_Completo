import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolPDFReport,
} from '@/components/export/pdfReportGenerator';
import * as XLSX from 'xlsx';

interface EnergyCalculationProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  studyType?: 'annual' | 'seasonal';
  onClose?: () => void;
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Shows Osterwald Formula and Nomenclature help dialog
 * matching Ayuda_Energia.m in OrientSol 3.0
 */
export function showOsterwaldInfoModal(isEn: boolean): void {
  const existing = document.getElementById('matlab-ayuda-energia-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-ayuda-energia-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 620px; border-color: #059669;">
      <div class="matlab-dialog-titlebar" style="background: linear-gradient(90deg, #064e3b, #047857);">
        <span class="matlab-title-text">${isEn ? 'Osterwald Method Help' : 'Ayuda - Método Osterwald'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 1.5rem; color: #ecfdf5; font-size: 0.9rem; line-height: 1.6;">
        <h4 style="color: #34d399; margin: 0 0 0.75rem; font-size: 1.05rem;">
          ${isEn ? 'Formulas & Thermal Behavior' : 'Fórmulas y Comportamiento Térmico'}
        </h4>

        <div style="background: #022c22; padding: 1rem; border-radius: 6px; border: 1px solid rgba(52, 211, 153, 0.25); margin-bottom: 1rem; font-family: monospace; font-size: 0.88rem;">
          <p style="margin: 0 0 0.5rem; color: #a7f3d0;"><strong>1. Irradiancia media equivalente (W/m²):</strong><br/>G = Gdm · (1000 Wh / 1 kWh) · (1 día / 24 h) = Gdm · 1000 / 24</p>
          <p style="margin: 0 0 0.5rem; color: #a7f3d0;"><strong>2. Temperatura de célula (°C):</strong><br/>T<sub>c</sub> = T<sub>amb</sub> + [(TONC - 20) / 800] · G</p>
          <p style="margin: 0 0 0.5rem; color: #a7f3d0;"><strong>3. Potencia generada (W):</strong><br/>P = (P<sub>pico</sub> · 1000) · (G / 1000) · [1 + γ · (T<sub>c</sub> - 25)]</p>
          <p style="margin: 0; color: #a7f3d0;"><strong>4. Energía producida mensual (kWh):</strong><br/>E = (P · 24 / 1000) · días_mes</p>
        </div>

        <h4 style="color: #34d399; margin: 0 0 0.5rem; font-size: 1rem;">
          ${isEn ? 'Nomenclature & Parameters' : 'Nomenclatura y Parámetros'}
        </h4>
        <ul style="margin: 0; padding-left: 1.25rem; color: #cbd5e1; font-size: 0.86rem;">
          <li><strong>P<sub>pico</sub>:</strong> ${isEn ? 'Installed peak power under STC (kWp).' : 'Potencia pico instalada en condiciones estándar STC (kWp).'}</li>
          <li><strong>γ (1/°C):</strong> ${isEn ? 'Power temperature coefficient (-0.005 to -0.003 for monocrystalline silicon).' : 'Coeficiente de variación de potencia con la temperatura (-0.005 a -0.003 para silicio monocristalino).'}</li>
          <li><strong>TONC (°C):</strong> ${isEn ? 'Nominal Operating Cell Temperature (40 °C to 55 °C).' : 'Temperatura de Operación Nominal de la Célula (40 a 55 °C).'}</li>
          <li><strong>T<sub>amb</sub>:</strong> ${isEn ? 'Monthly mean ambient temperature (°C).' : 'Temperatura media ambiental mensual (°C).'}</li>
        </ul>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: flex-end; padding: 0.75rem 1.25rem; background: #021a15;">
        <button type="button" class="matlab-btn-default btn-ayuda-ok" style="background: #059669; border-color: #10b981; color: #ffffff;">
          OK
        </button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.querySelector('.btn-ayuda-ok')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
}

/**
 * Computes monthly energy yield via Osterwald model matching Energia_Osterwald.m
 */
export function calculateOsterwaldEnergy(
  radHorizontal: number[], // 12 monthly Gdm0 (kWh/m2/day)
  radStudy: number[],      // 12 monthly Gdm study (kWh/m2/day)
  tempAmb: number[],       // 12 monthly ambient temp (°C)
  peakPowerKw: number,
  coefTemp: number,
  tonc: number
) {
  const e0_mes: number[] = [];
  const e_mes: number[] = [];
  const ganancia_mes: number[] = [];

  for (let i = 0; i < 12; i++) {
    const g0_Wm2 = (radHorizontal[i] * 1000) / 24;
    const g_Wm2 = (radStudy[i] * 1000) / 24;

    const tc0 = tempAmb[i] + ((tonc - 20) / 800) * g0_Wm2;
    const tc = tempAmb[i] + ((tonc - 20) / 800) * g_Wm2;

    const p0 = peakPowerKw * 1000 * (g0_Wm2 / 1000) * (1 + coefTemp * (tc0 - 25));
    const p = peakPowerKw * 1000 * (g_Wm2 / 1000) * (1 + coefTemp * (tc - 25));

    const e0 = (p0 * 24) / 1000;
    const e = (p * 24) / 1000;

    const days = DAYS_IN_MONTH[i];
    const e0_m = e0 * days;
    const e_m = e * days;

    e0_mes.push(e0_m);
    e_mes.push(e_m);
    ganancia_mes.push(e_m - e0_m);
  }

  const e0_anual = e0_mes.reduce((a, b) => a + b, 0);
  const e_anual = e_mes.reduce((a, b) => a + b, 0);
  const ganancia_anual = e_anual - e0_anual;

  return {
    e0_mes,
    e_mes,
    ganancia_mes,
    e0_anual,
    e_anual,
    ganancia_anual,
  };
}

/**
 * Renders the OrientSol 3.0 - Cálculo de la energía component matching Imagen 1
 */
export function renderEnergyCalculationPanel(props: EnergyCalculationProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, studyType = 'annual', onClose } = props;
  const container = document.createElement('div');
  container.className = 'opt-energy-study-card';
  container.id = 'energy-calculation-window';

  // Default parameters matching MATLAB Energia_Osterwald.fig
  let statePeakKw: number = 10;
  let stateCoefTemp: number = -0.0035;
  let stateTonc: number = 47;

  // Radiation vectors
  const radHoriz = res.horizontal.gdm0;
  const radStudy =
    studyType === 'seasonal'
      ? res.seasonal.monthlyDailyKwh
      : res.optimalAnnual.monthlyDailyKwh;

  const tempAmb = res.temperatures.ambient.monthlyMeanC;

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
    const studyTitle =
      studyType === 'seasonal'
        ? (isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional')
        : (isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual');

    // Run Osterwald calculation
    const energyData = calculateOsterwaldEnergy(
      radHoriz,
      radStudy,
      tempAmb,
      statePeakKw,
      stateCoefTemp,
      stateTonc
    );

    container.innerHTML = `
      <div class="opt-energy-window-frame">
        <!-- 1. Header Bar matching OrientSol 3.0 Imagen 1 -->
        <div class="opt-energy-header-bar">
          <div class="opt-energy-header-left">
            <div class="opt-energy-meta-row">
              <span class="meta-label"><strong>${isEn ? 'City:' : 'Ciudad:'}</strong> ${locationName}</span>
              <span class="meta-label" style="margin-left: 2.5rem;">
                <strong>${isEn ? 'Latitude (°):' : 'Latitud (°):'}</strong>
                <span style="color: #38bdf8; font-weight: 700;">${latitude.toFixed(2)}</span>
              </span>
            </div>
            <div class="opt-energy-study-row">
              <span class="meta-label">
                <strong>${isEn ? 'Study:' : 'Estudio:'}</strong>
                <span style="color: #60a5fa; font-weight: 600;">${studyTitle}</span>
              </span>
            </div>
          </div>
          <div class="opt-energy-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>3.0</strong>
            </div>
          </div>
        </div>

        <!-- 2. Main Two-Column Layout -->
        <div class="opt-energy-main-grid">
          <!-- Left Column: Inputs Panel -->
          <div class="energy-inputs-panel">
            <div class="energy-inputs-card">
              <div class="energy-inputs-title-bar">
                ${isEn ? 'Enter the values and press Calculate' : 'Introduzca los valores y pulse Calcular'}
              </div>

              <div class="energy-input-row" style="margin-top: 1.25rem;">
                <label for="input-energy-potencia" class="energy-input-label">
                  ${isEn ? 'Installed peak power (kWp):' : 'Potencia pico instalada (kWp):'}
                </label>
                <input
                  type="number"
                  id="input-energy-potencia"
                  class="energy-input-box"
                  value="${statePeakKw}"
                  min="0.1"
                  step="0.5"
                />
              </div>

              <div class="energy-tech-subtitle">
                ${isEn ? 'For monocrystalline silicon technology' : 'Para tecnología de silicio monocristalino'}
              </div>

              <div class="energy-input-row">
                <label for="input-energy-gamma" class="energy-input-label">
                  <strong>&gamma;</strong> (1/°C):
                </label>
                <input
                  type="number"
                  id="input-energy-gamma"
                  class="energy-input-box"
                  value="${stateCoefTemp}"
                  min="-0.005"
                  max="-0.003"
                  step="0.0001"
                />
              </div>

              <div class="energy-input-row">
                <label for="input-energy-tonc" class="energy-input-label">
                  <strong>TONC</strong> (°C):
                </label>
                <input
                  type="number"
                  id="input-energy-tonc"
                  class="energy-input-box"
                  value="${stateTonc}"
                  min="40"
                  max="55"
                  step="1"
                />
              </div>

              <div class="energy-inputs-footer">
                <div class="energy-method-note">
                  <span>${isEn ? 'Method implemented: Osterwald' : 'Método implementado: Osterwald'}</span>
                  <button type="button" id="btn-energy-info" class="btn btn-sm btn-outline-cyan">
                    ${isEn ? 'Information' : 'Información'}
                  </button>
                </div>

                <button type="button" id="btn-energy-calc-run" class="btn-energy-calculate-primary">
                  ${isEn ? 'Calculate' : 'Calcular'}
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Monthly Energy Results Table -->
          <div class="energy-results-panel">
            <div class="energy-results-title">
              ${isEn ? 'Mean monthly energy (kWh)' : 'Energía media mensual (kWh)'}
            </div>

            <div class="energy-table-wrap">
              <table class="opt-energy-table">
                <thead>
                  <tr>
                    <th class="th-ener-month">${isEn ? 'Month' : 'Mes'}</th>
                    <th class="th-ener-horiz">${isEn ? 'Horizontal surface' : 'Superficie horizontal'}</th>
                    <th class="th-ener-study">${isEn ? 'Performed study' : 'Estudio realizado'}</th>
                    <th class="th-ener-gain">${isEn ? 'Gain (kWh)' : 'Ganancia (kWh)'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${months.map((monthName, idx) => {
                    const e0 = energyData.e0_mes[idx];
                    const e = energyData.e_mes[idx];
                    const g = energyData.ganancia_mes[idx];

                    return `
                      <tr>
                        <td class="td-ener-month"><strong>${monthName}</strong></td>
                        <td class="td-num">${e0.toFixed(2)}</td>
                        <td class="td-num td-ener-study-val"><strong>${e.toFixed(2)}</strong></td>
                        <td class="td-num td-ener-gain-val ${g >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">
                          ${g.toFixed(2)}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
                <tfoot>
                  <tr class="energy-annual-row">
                    <td class="td-ener-annual"><strong>${isEn ? 'ANNUAL' : 'ANUAL'}</strong></td>
                    <td class="td-num"><strong>${energyData.e0_anual.toFixed(1)}</strong></td>
                    <td class="td-num td-ener-study-val"><strong>${energyData.e_anual.toFixed(1)}</strong></td>
                    <td class="td-num td-ener-gain-val ${energyData.ganancia_anual >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">
                      <strong>${energyData.ganancia_anual.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- 3. Footer Action Buttons matching Imagen 1 -->
        <div class="opt-energy-footer-buttons">
          <div class="footer-btn-left-group">
            <button id="btn-energy-volver" class="btn-study-foot btn-volver" type="button">
              <span>${isEn ? 'Back' : 'Volver'}</span>
            </button>
            <button id="btn-energy-salir" class="btn-study-foot btn-salir" type="button">
              <span>${isEn ? 'Exit' : 'Salir'}</span>
            </button>
          </div>

          <div class="footer-btn-right-group">
            <button id="btn-energy-export-excel" class="btn-study-foot btn-excel" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${isEn ? 'Export to Excel' : 'Exportar a Excel'}</span>
            </button>

            <button id="btn-energy-export-report" class="btn-study-foot btn-report" type="button">
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
      </div>
    `;

    // Attach Event Listeners
    // 1. Calculate Button
    const btnCalc = container.querySelector<HTMLButtonElement>('#btn-energy-calc-run');
    btnCalc?.addEventListener('click', () => {
      const potInput = container.querySelector<HTMLInputElement>('#input-energy-potencia');
      const gammaInput = container.querySelector<HTMLInputElement>('#input-energy-gamma');
      const toncInput = container.querySelector<HTMLInputElement>('#input-energy-tonc');

      const potVal = parseFloat(potInput?.value || '');
      const gammaVal = parseFloat(gammaInput?.value || '');
      const toncVal = parseFloat(toncInput?.value || '');

      // Validation matching Energia_Osterwald.m lines 140-155
      if (isNaN(potVal) || isNaN(gammaVal) || isNaN(toncVal)) {
        alert(isEn ? 'Please make sure to enter ALL values CORRECTLY to calculate.' : 'Asegúrese de introducir TODOS los datos CORRECTAMENTE para calcular.');
        return;
      }
      if (potVal <= 0) {
        alert(isEn ? 'Installed peak power must be positive.' : 'La potencia pico instalada debe ser positiva.');
        return;
      }
      if (gammaVal < -0.005 || gammaVal > -0.003) {
        alert(isEn ? 'Temperature coefficient must be between -0.005 and -0.003 (1/°C).' : 'El coeficiente de temperatura debe estar comprendido entre -0.005 y -0.003.');
        return;
      }
      if (toncVal < 40 || toncVal > 55) {
        alert(isEn ? 'NOCT must be between 40 and 55 °C.' : 'La TONC debe estar comprendida entre 40 y 55 °C.');
        return;
      }

      statePeakKw = potVal;
      stateCoefTemp = gammaVal;
      stateTonc = toncVal;

      renderInternal();
    });

    // 2. Información Button
    const btnInfo = container.querySelector<HTMLButtonElement>('#btn-energy-info');
    btnInfo?.addEventListener('click', () => {
      showOsterwaldInfoModal(isEn);
    });

    // 3. Volver Button
    const btnVolver = container.querySelector<HTMLButtonElement>('#btn-energy-volver');
    btnVolver?.addEventListener('click', () => {
      if (onClose) {
        onClose();
      } else {
        const topStudy = document.querySelector('#opt-annual-study-panel') || document.querySelector('.results-header');
        topStudy?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 4. Salir Button
    const btnSalir = container.querySelector<HTMLButtonElement>('#btn-energy-salir');
    btnSalir?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Export to Excel
    const btnExcel = container.querySelector<HTMLButtonElement>('#btn-energy-export-excel');
    btnExcel?.addEventListener('click', () => {
      exportEnergyToExcel(res, energyData, statePeakKw, stateCoefTemp, stateTonc, studyTitle, isEn);
    });

    // 6. Generate PDF Report
    const btnReport = container.querySelector<HTMLButtonElement>('#btn-energy-export-report');
    btnReport?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolPDFReport(res, isEn);
      });
    });
  }

  renderInternal();
  return container;
}

/**
 * Exports Energy Yield Table to Excel (.xlsx)
 */
async function exportEnergyToExcel(
  res: SolarBridgeSimulationResult,
  energyData: ReturnType<typeof calculateOsterwaldEnergy>,
  peakKw: number,
  coefTemp: number,
  tonc: number,
  studyTitle: string,
  isEn: boolean
) {
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const data: any[][] = [];

  // Header metadata
  data.push([res.locationName, isEn ? 'Latitude' : 'Latitud', res.latitude, '', studyTitle]);
  data.push([]);
  data.push([isEn ? 'PV Peak Power (kWp)' : 'Potencia pico (kWp)', peakKw]);
  data.push(['γ (1/°C)', coefTemp]);
  data.push(['TONC (°C)', tonc]);
  data.push([isEn ? 'Method' : 'Método', 'Osterwald']);
  data.push([]);
  data.push([
    isEn ? 'Month' : 'Mes',
    isEn ? 'Horizontal surface (kWh)' : 'Superficie horizontal (kWh)',
    isEn ? 'Performed study (kWh)' : 'Estudio realizado (kWh)',
    isEn ? 'Gain (kWh)' : 'Ganancia (kWh)',
  ]);

  for (let i = 0; i < 12; i++) {
    data.push([
      months[i],
      energyData.e0_mes[i],
      energyData.e_mes[i],
      energyData.ganancia_mes[i],
    ]);
  }

  data.push([
    isEn ? 'ANNUAL' : 'ANUAL',
    energyData.e0_anual,
    energyData.e_anual,
    energyData.ganancia_anual,
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, isEn ? 'Energy_Yield' : 'Energia_Osterwald');

  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_Calculo_Energia_${cleanLoc}.xlsx`;

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'Libro de Excel (*.xlsx)',
            accept: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
