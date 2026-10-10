import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolEnergyPDFReport,
} from '@/components/export/pdfReportGenerator';
import * as XLSX from 'xlsx';

export interface EnergyCalculationProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  studyType?: 'annual' | 'seasonal';
  initialPeakKw?: number;
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
 * matching EXACTLY Figura 5.2.80 (Ayuda_Energia.m) in OrientSol 3.0
 */
export function showOsterwaldInfoModal(isEn: boolean): void {
  const existing = document.getElementById('matlab-ayuda-energia-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-ayuda-energia-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 680px; background: #ffffff; border: 1.5px solid #64748b; box-shadow: 0 12px 36px rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;">
      <div class="matlab-dialog-titlebar" style="background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%); border-bottom: 1px solid #cbd5e1; padding: 7px 12px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#ea580c"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ea580c" stroke-width="2"/>
          </svg>
          <span style="font-size: 13.5px; font-weight: 600; color: #1e293b; font-family: 'Segoe UI', Tahoma, sans-serif;">
            ${isEn ? 'Information and nomenclature of the Osterwald method' : 'Información y nomenclatura del método de Osterwald'}
          </span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button type="button" class="matlab-close-btn" aria-label="Cerrar" style="border: none; background: transparent; font-size: 18px; color: #64748b; cursor: pointer; padding: 0 4px; line-height: 1;">&times;</button>
        </div>
      </div>
      <div class="matlab-dialog-body" style="padding: 16px; background: #ffffff;">
        <!-- Top Section: Método de Osterwald -->
        <div style="border: 1.5px solid #3b82f6; border-radius: 3px; padding: 14px 18px; background: #ffffff; margin-bottom: 14px;">
          <div style="color: #ea580c; font-weight: bold; font-size: 15px; margin-bottom: 12px; font-family: 'Segoe UI', Tahoma, sans-serif;">
            ${isEn ? 'Osterwald method:' : 'Método de Osterwald:'}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <!-- Formula box with orange border -->
            <div style="border: 1.5px solid #f97316; padding: 9px 16px; background: #ffffff; font-family: 'Times New Roman', Times, serif; font-size: 17px; color: #0f172a; display: inline-flex; align-items: center;">
              <span>P<sub>M</sub> = P<sub>M,STC</sub> &middot; </span>
              <span style="display: inline-flex; flex-direction: column; align-items: center; margin: 0 5px; vertical-align: middle;">
                <span style="border-bottom: 1px solid #000; padding: 0 4px; line-height: 1.1;">G</span>
                <span style="line-height: 1.1;">G<sub>STC</sub></span>
              </span>
              <span>[1 - &gamma; &middot; (T<sub>c</sub> - 25)]</span>
            </div>
            <!-- Right side: donde Tc = Tamb + ... -->
            <div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; color: #0f172a; display: inline-flex; align-items: center;">
              <span>${isEn ? 'where' : 'donde'}&nbsp;&nbsp;T<sub>c</sub> = T<sub>amb</sub> &middot; </span>
              <span style="display: inline-flex; flex-direction: column; align-items: center; margin: 0 5px; vertical-align: middle;">
                <span style="border-bottom: 1px solid #000; padding: 0 4px; line-height: 1.1;">TONC - 20 &deg;C</span>
                <span style="line-height: 1.1;">800 Wm<sup>-2</sup></span>
              </span>
              <span>&middot; G</span>
            </div>
          </div>
          <!-- Integrated Energy equation -->
          <div style="margin-top: 14px; font-family: 'Times New Roman', Times, serif; font-size: 18px; color: #0f172a;">
            E = &int;<sub>t<sub>1</sub></sub><sup>t<sub>2</sub></sup> p(t) dt
          </div>
        </div>

        <!-- Bottom Section: Nomenclatura utilizada -->
        <div style="border: 1.5px solid #3b82f6; border-radius: 3px; padding: 14px 18px; background: #ffffff;">
          <div style="color: #2563eb; font-weight: bold; font-size: 15px; margin-bottom: 10px; font-family: 'Segoe UI', Tahoma, sans-serif;">
            ${isEn ? 'Nomenclature used:' : 'Nomenclatura utilizada:'}
          </div>
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 14.5px; line-height: 1.8; color: #1e293b;">
            <div>P<sub>M</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${isEn ? 'Maximum module power at maximum power point (W)' : 'Potencia máxima del módulo en el punto de máxima potencia (W)'}</div>
            <div>P<sub>M,STC</sub> &nbsp;= ${isEn ? 'Maximum cell power under standard test conditions (W)' : 'Potencia máxima de la célula en condiciones estándar (W)'}</div>
            <div>G &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${isEn ? 'Incident global irradiance (W/m²)' : 'Irradiancia global incidente (<sup>W</sup>/<sub>m<sup>2</sup></sub>)'}</div>
            <div>T<sub>c</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${isEn ? 'Cell temperature (°C)' : 'Temperatura de la célula (°C)'}</div>
            <div>&gamma; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${isEn ? 'Temperature coefficient of maximum cell power (°C⁻¹).' : 'Coeficiente de temperatura de la potencia máxima de la célula (°C⁻¹).'}</div>
            <div style="padding-left: 60px; color: #334155;">
              ${isEn
                ? 'For monocrystalline silicon it can range between -0.005 to -0.003 °C⁻¹. Good results are obtained with 0.0035°C⁻¹'
                : 'En silicio monocristalino puede oscilar entre -0,005 a -0,003 °C⁻¹. Se obtienen buenos resultdos con 0.0035°C⁻¹'}
            </div>
            <div>TONC &nbsp;&nbsp;&nbsp;&nbsp;= ${isEn ? 'Nominal operating cell temperature measured at 800 W/m² of' : 'Temperatura de operación nominal de la célula medida a 800 <sup>W</sup>/<sub>m<sup>2</sup></sub> de'}</div>
            <div style="padding-left: 60px; color: #334155;">
              ${isEn
                ? 'global irradiance and 20 °C ambient temperature. For monocrystalline silicon 47 °C can be used.'
                : 'irradiancia global y a 20 °C de temperatura ambiente. En silicio monocristalino puede usar 47 °C.'}
            </div>
          </div>
        </div>

        <!-- Action footer with Cerrar button on left matching Figura 5.2.80 -->
        <div style="margin-top: 14px; display: flex; justify-content: flex-start;">
          <button type="button" class="matlab-btn-default btn-ayuda-ok" style="min-width: 95px; padding: 6px 16px; font-size: 13.5px; background: #e2e8f0; color: #0f172a; border: 1px solid #94a3b8; border-radius: 3px; cursor: pointer; font-weight: 500;">
            ${isEn ? 'Close' : 'Cerrar'}
          </button>
        </div>
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

  // Default parameters matching MATLAB Energia_Osterwald.fig, initialized with peakPowerKw from above
  let statePeakKw: number = props.initialPeakKw ?? 5.0;
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

    const isSeasonal = studyType === 'seasonal';
    const optTiltAnnual = res.optimalAnnual?.optimalTiltDeg ?? 30;
    const seasonalData = res.seasonal;

    let studyColTitle = '';
    if (isSeasonal && seasonalData) {
      studyColTitle = isEn
        ? `Performed study (Inv: ${seasonalData.winterTiltDeg}° / P-O: ${seasonalData.springTiltDeg}° / Ver: ${seasonalData.summerTiltDeg}°)`
        : `Estudio realizado (Inv: ${seasonalData.winterTiltDeg}° / P-O: ${seasonalData.springTiltDeg}° / Ver: ${seasonalData.summerTiltDeg}°)`;
    } else {
      studyColTitle = isEn
        ? `Performed study (β = ${optTiltAnnual}°)`
        : `Estudio realizado (β = ${optTiltAnnual}°)`;
    }

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
                <span class="badge badge-source" style="margin-left: 0.75rem; font-size: 0.78rem;">${isSeasonal ? (isEn ? 'Seasonal Tilts' : 'Inclinación Estacional') : `β = ${optTiltAnnual}°`}</span>
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
                    <th class="th-ener-horiz">${isEn ? 'Horizontal surface (0°)' : 'Superficie horizontal (0°)'}</th>
                    <th class="th-ener-study">${studyColTitle}</th>
                    <th class="th-ener-gain">${isEn ? 'Gain (kWh)' : 'Ganancia (kWh)'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${months.map((monthName, idx) => {
                    const e0 = energyData.e0_mes[idx];
                    const e = energyData.e_mes[idx];
                    const g = energyData.ganancia_mes[idx];

                    const monthAngle = isSeasonal && seasonalData
                      ? (idx === 0 || idx === 1 || idx === 11 ? seasonalData.winterTiltDeg
                         : idx === 5 || idx === 6 || idx === 7 ? seasonalData.summerTiltDeg
                         : seasonalData.springTiltDeg)
                      : optTiltAnnual;

                    return `
                      <tr>
                        <td class="td-ener-month"><strong>${monthName}</strong></td>
                        <td class="td-num">${e0.toFixed(2)}</td>
                        <td class="td-num td-ener-study-val">
                          <strong>${e.toFixed(2)}</strong>
                          <span class="energy-angle-tag" style="font-size: 0.78rem; opacity: 0.85; margin-left: 5px;">(${monthAngle}°)</span>
                        </td>
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

    // 6. Generate PDF Report (Figura 5.2.83)
    const btnReport = container.querySelector<HTMLButtonElement>('#btn-energy-export-report');
    btnReport?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolEnergyPDFReport(res, energyData, statePeakKw, stateCoefTemp, stateTonc, studyTitle, isEn);
      });
    });
  }

  renderInternal();
  return container;
}

/**
 * Exports Energy Yield Table to Excel (.xlsx) strictly matching:
 * - Figura 5.2.82: Datos exportados de energía generada para la inclinación óptima anual
 */
async function exportEnergyToExcel(
  res: SolarBridgeSimulationResult,
  energyData: ReturnType<typeof calculateOsterwaldEnergy>,
  _peakKw: number,
  _coefTemp: number,
  _tonc: number,
  studyTitle: string,
  isEn: boolean
) {
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const data: any[][] = [];

  // Row 1 (Index 0): Jaén | Latitud | 37,7655556 | | Inclinación óptima anual (Figura 5.2.82)
  data[0] = [res.locationName, isEn ? 'Latitude' : 'Latitud', res.latitude, '', studyTitle];
  // Row 2 (Index 1): empty
  data[1] = [];
  // Row 3 (Index 2): Col B: ENERGÍA MEDIA MENSUAL (kWh/mes)
  data[2] = ['', isEn ? 'MEAN MONTHLY ENERGY (kWh/month)' : 'ENERGÍA MEDIA MENSUAL (kWh/mes)'];
  // Row 4 (Index 3): Col B: Plano horizo | Col C: Tipo de estu | Col D: Ganancias (kWh)
  data[3] = [
    '',
    isEn ? 'Horizontal plane' : 'Plano horizo',
    isEn ? 'Study type' : 'Tipo de estu',
    isEn ? 'Gains (kWh)' : 'Ganancias (kWh)',
  ];

  // Rows 5..16 (Index 4..15): Enero..Diciembre
  for (let i = 0; i < 12; i++) {
    data[4 + i] = [
      months[i],
      energyData.e0_mes[i],
      energyData.e_mes[i],
      energyData.ganancia_mes[i],
    ];
  }

  // Row 17 (Index 16): ANUAL
  data[16] = [
    isEn ? 'ANNUAL' : 'ANUAL',
    energyData.e0_anual,
    energyData.e_anual,
    energyData.ganancia_anual,
  ];

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
