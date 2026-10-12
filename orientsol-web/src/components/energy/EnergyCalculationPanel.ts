import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { solarSyncState } from '@/services/bridge/solarSyncState';
import { getDualAxisNoonTiltDeg, getNoonAzimuthDeg, getHorizontalTrackerDailyMeanTiltDeg } from '@/services/solarGeometryAngles';


export interface EnergyCalculationProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  studyType?: 'annual' | 'monthly' | 'seasonal' | 'polar' | 'azimuthal' | 'horizontal' | 'dual';
  initialPeakKw?: number;
  initialTonc?: number;
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
 * matching EXACTLY Figura 5.2.80 (Ayuda_Energia.m) in OrientSol 4.0
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
 * Renders the OrientSol 4.0 - Cálculo de la energía component matching Imagen 1
 */
export function renderEnergyCalculationPanel(props: EnergyCalculationProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, studyType = 'annual', onClose } = props;
  const container = document.createElement('div');
  container.className = 'opt-energy-study-card';
  container.id = 'energy-calculation-window';

  // Default parameters matching MATLAB Energia_Osterwald.fig, synchronized with global state & climate loader
  let statePeakKw: number = props.initialPeakKw ?? solarSyncState.getPeakPowerKw();
  let stateCoefTemp: number = solarSyncState.getCoefTemp();
  let stateTonc: number = props.initialTonc ?? solarSyncState.getTonc();

  // Radiation vectors
  const radHoriz = res.horizontal.gdm0;
  const radStudy =
    studyType === 'monthly'
      ? res.monthlyOptimum12.monthlyDailyKwh
      : studyType === 'seasonal'
      ? res.seasonal.monthlyDailyKwh
      : studyType === 'polar'
      ? res.tracking.polarAxis.monthlyDailyKwh
      : studyType === 'azimuthal'
      ? res.tracking.azimuthalAxis.monthlyDailyKwh
      : studyType === 'horizontal'
      ? res.tracking.horizontalAxis.monthlyDailyKwh
      : studyType === 'dual'
      ? res.tracking.dualAxis.monthlyDailyKwh
      : res.optimalAnnual.monthlyDailyKwh;

  const tempAmb = res.temperatures.ambient.monthlyMeanC;

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
    const studyTitle =
      studyType === 'monthly'
        ? (isEn ? 'Monthly optimization (12 independent angles)' : 'Optimización mensual (12 inclinaciones independientes)')
        : studyType === 'seasonal'
        ? (isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional')
        : studyType === 'polar'
        ? (isEn ? 'Polar single-axis tracking' : 'Seguimiento a un eje polar')
        : studyType === 'azimuthal'
        ? (isEn ? 'Azimuthal single-axis tracking' : 'Seguimiento a un eje azimutal')
        : studyType === 'horizontal'
        ? (isEn ? 'Horizontal single-axis tracking' : 'Seguimiento a un eje horizontal')
        : studyType === 'dual'
        ? (isEn ? 'Two-axis solar tracking' : 'Seguimiento a dos ejes')
        : (isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual');

    const isSeasonal = studyType === 'seasonal';
    const optTiltAnnual = res.optimalAnnual?.optimalTiltDeg ?? 30;
    const seasonalData = res.seasonal;

    let studyColTitle = '';
    let studyBadge = '';
    if (studyType === 'monthly') {
      studyColTitle = isEn
        ? `Performed study (12 Monthly Angles)`
        : `Estudio realizado (12 Inclinaciones Mensuales)`;
      studyBadge = isEn ? '12 Monthly Angles' : '12 Inclinaciones';
    } else if (isSeasonal && seasonalData) {
      studyColTitle = isEn
        ? `Performed study (Seasonal: ${seasonalData.winterTiltDeg.toFixed(1)}° / ${seasonalData.springTiltDeg.toFixed(1)}° / ${seasonalData.summerTiltDeg.toFixed(1)}° / ${seasonalData.autumnTiltDeg.toFixed(1)}°)`
        : `Estudio realizado (Estacional: ${seasonalData.winterTiltDeg.toFixed(1)}° / ${seasonalData.springTiltDeg.toFixed(1)}° / ${seasonalData.summerTiltDeg.toFixed(1)}° / ${seasonalData.autumnTiltDeg.toFixed(1)}°)`;
      studyBadge = isEn ? 'Seasonal Tilts' : 'Inclinación Estacional';
    } else if (studyType === 'polar') {
      studyColTitle = isEn
        ? `Performed study (Polar 1-axis)`
        : `Estudio realizado (Seg. 1 eje polar)`;
      studyBadge = isEn ? 'Polar 1-Axis' : 'Eje Polar';
    } else if (studyType === 'azimuthal') {
      studyColTitle = isEn
        ? `Performed study (Azimuthal 1-axis)`
        : `Estudio realizado (Seg. 1 eje azimutal)`;
      studyBadge = isEn ? 'Azimuthal 1-Axis' : 'Eje Azimutal';
    } else if (studyType === 'horizontal') {
      studyColTitle = isEn
        ? `Performed study (Horizontal 1-axis)`
        : `Estudio realizado (Seg. 1 eje horizontal)`;
      studyBadge = isEn ? 'Horizontal 1-Axis' : 'Eje Horizontal';
    } else if (studyType === 'dual') {
      studyColTitle = isEn
        ? `Performed study (2-axis tracking)`
        : `Estudio realizado (Seg. 2 ejes)`;
      studyBadge = isEn ? '2-Axis Tracking' : '2 Ejes';
    } else {
      studyColTitle = isEn
        ? `Performed study (Inc: ${Number(optTiltAnnual).toFixed(1)}° | Ori: ${latitude >= 0 ? '0.0°' : '180.0°'})`
        : `Estudio realizado (Inc: ${Number(optTiltAnnual).toFixed(1)}° | Ori: ${latitude >= 0 ? '0.0°' : '180.0°'})`;
      studyBadge = `Inc: ${Number(optTiltAnnual).toFixed(1)}° | Ori: ${latitude >= 0 ? '0.0°' : '180.0°'}`;
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
        <!-- 1. Header Bar matching OrientSol 4.0 Imagen 1 -->
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
                <span class="badge badge-source" style="margin-left: 0.75rem; font-size: 0.78rem;">${studyBadge}</span>
              </span>
            </div>
          </div>
          <div class="opt-energy-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>4.0</strong>
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
                    <th class="th-ener-angle">${isEn ? 'Considered angles (Inc | Ori)' : 'Ángulos considerados (Inc | Ori)'}</th>
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

                    let angleBadgeText = '';
                    const noonAzim = getNoonAzimuthDeg(latitude, idx);
                    const noonDualTilt = getDualAxisNoonTiltDeg(latitude, idx);
                    const fixedOri = latitude >= 0 ? 0.0 : 180.0;

                    if (studyType === 'monthly') {
                      const mDeg = res.monthlyOptimum12?.optimalTiltsDeg ? res.monthlyOptimum12.optimalTiltsDeg[idx] : optTiltAnnual;
                      angleBadgeText = `Inc: ${Number(mDeg).toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                    } else if (isSeasonal && seasonalData) {
                      if (idx === 11 || idx === 0 || idx === 1) {
                        angleBadgeText = `Inv: Inc: ${seasonalData.winterTiltDeg.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                      } else if (idx === 2 || idx === 3 || idx === 4) {
                        angleBadgeText = `Pri: Inc: ${seasonalData.springTiltDeg.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                      } else if (idx === 5 || idx === 6 || idx === 7) {
                        angleBadgeText = `Ver: Inc: ${seasonalData.summerTiltDeg.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                      } else {
                        angleBadgeText = `Oto: Inc: ${seasonalData.autumnTiltDeg.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                      }
                    } else if (studyType === 'polar') {
                      angleBadgeText = `Inc: ${latitude.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                    } else if (studyType === 'azimuthal') {
                      angleBadgeText = `Inc: ${latitude.toFixed(1)}° | Ori: ${noonAzim.toFixed(1)}°`;
                    } else if (studyType === 'horizontal') {
                      angleBadgeText = `Inc: ${getHorizontalTrackerDailyMeanTiltDeg(latitude, idx).toFixed(1)}° | Ori: 90.0°`;
                    } else if (studyType === 'dual') {
                      angleBadgeText = `Inc: ${noonDualTilt.toFixed(1)}° | Ori: ${noonAzim.toFixed(1)}°`;
                    } else {
                      angleBadgeText = `Inc: ${Number(optTiltAnnual).toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                    }

                    return `
                      <tr>
                        <td class="td-ener-month"><strong>${monthName}</strong></td>
                        <td class="td-ener-angle">
                          <span class="energy-angle-badge">${angleBadgeText}</span>
                        </td>
                        <td class="td-num">${e0.toFixed(2)}</td>
                        <td class="td-num td-ener-study-val">
                          <strong>${e.toFixed(2)}</strong>
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
                    <td class="td-ener-annual"><strong>${isEn ? 'ANNUAL TOTAL' : 'TOTAL ANUAL'}</strong></td>
                    <td class="td-ener-angle">
                      <span class="energy-angle-badge badge-annual">
                        ${(() => {
                          const fixedOri = latitude >= 0 ? 0.0 : 180.0;
                          const avgDualAzim = months.reduce((acc, _, idx) => acc + getNoonAzimuthDeg(latitude, idx), 0) / 12;
                          if (studyType === 'monthly') {
                            const avgMonthlyTilt = res.monthlyOptimum12?.optimalTiltsDeg
                              ? res.monthlyOptimum12.optimalTiltsDeg.reduce((a, b) => a + b, 0) / 12
                              : optTiltAnnual;
                            return `Inc: ${avgMonthlyTilt.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                          }
                          if (isSeasonal) {
                            const avgSeasonalTilt = seasonalData
                              ? (seasonalData.winterTiltDeg * 3 + seasonalData.springTiltDeg * 3 + seasonalData.summerTiltDeg * 3 + seasonalData.autumnTiltDeg * 3) / 12
                              : 30.0;
                            return `Inc: ${avgSeasonalTilt.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                          }
                          if (studyType === 'polar') {
                            return `Inc: ${latitude.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                          }
                          if (studyType === 'azimuthal') {
                            return `Inc: ${latitude.toFixed(1)}° | Ori: ${avgDualAzim.toFixed(1)}°`;
                          }
                          if (studyType === 'horizontal') {
                            const avgHorizTilt = months.reduce((acc, _, idx) => acc + getHorizontalTrackerDailyMeanTiltDeg(latitude, idx), 0) / 12;
                            return `Inc: ${avgHorizTilt.toFixed(1)}° | Ori: 90.0°`;
                          }
                          if (studyType === 'dual') {
                            const avgDualTilt = months.reduce((acc, _, idx) => acc + getDualAxisNoonTiltDeg(latitude, idx), 0) / 12;
                            return `Inc: ${avgDualTilt.toFixed(1)}° | Ori: ${avgDualAzim.toFixed(1)}°`;
                          }
                          return `Inc: ${Number(optTiltAnnual).toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                        })()}
                      </span>
                    </td>
                    <td class="td-num"><strong>${energyData.e0_anual.toFixed(1)}</strong></td>
                    <td class="td-num td-ener-study-val"><strong>${energyData.e_anual.toFixed(1)}</strong></td>
                    <td class="td-num td-ener-gain-val ${energyData.ganancia_anual >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">
                      <strong>${energyData.ganancia_anual >= 0 ? '+' : ''}${energyData.ganancia_anual.toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr class="table-media-row energy-media-row">
                    <td class="td-ener-annual"><strong>${isEn ? 'MEAN' : 'MEDIA'}</strong></td>
                    <td class="td-ener-angle">
                      <span class="energy-angle-badge badge-annual">
                        ${(() => {
                          const fixedOri = latitude >= 0 ? 0.0 : 180.0;
                          const avgDualAzim = months.reduce((acc, _, idx) => acc + getNoonAzimuthDeg(latitude, idx), 0) / 12;
                          if (studyType === 'monthly') {
                            const avgMonthlyTilt = res.monthlyOptimum12?.optimalTiltsDeg
                              ? res.monthlyOptimum12.optimalTiltsDeg.reduce((a, b) => a + b, 0) / 12
                              : optTiltAnnual;
                            return `Inc: ${avgMonthlyTilt.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                          }
                          if (isSeasonal) {
                            const avgSeasonalTilt = seasonalData
                              ? (seasonalData.winterTiltDeg * 3 + seasonalData.springTiltDeg * 3 + seasonalData.summerTiltDeg * 3 + seasonalData.autumnTiltDeg * 3) / 12
                              : 30.0;
                            return `Inc: ${avgSeasonalTilt.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                          }
                          if (studyType === 'polar') {
                            return `Inc: ${latitude.toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                          }
                          if (studyType === 'azimuthal') {
                            return `Inc: ${latitude.toFixed(1)}° | Ori: ${avgDualAzim.toFixed(1)}°`;
                          }
                          if (studyType === 'horizontal') {
                            const avgHorizTilt = months.reduce((acc, _, idx) => acc + getHorizontalTrackerDailyMeanTiltDeg(latitude, idx), 0) / 12;
                            return `Inc: ${avgHorizTilt.toFixed(1)}° | Ori: 90.0°`;
                          }
                          if (studyType === 'dual') {
                            const avgDualTilt = months.reduce((acc, _, idx) => acc + getDualAxisNoonTiltDeg(latitude, idx), 0) / 12;
                            return `Inc: ${avgDualTilt.toFixed(1)}° | Ori: ${avgDualAzim.toFixed(1)}°`;
                          }
                          return `Inc: ${Number(optTiltAnnual).toFixed(1)}° | Ori: ${fixedOri.toFixed(1)}°`;
                        })()}
                      </span>
                    </td>
                    <td class="td-num"><strong>${(energyData.e0_anual / 12).toFixed(1)}</strong></td>
                    <td class="td-num td-ener-study-val"><strong>${(energyData.e_anual / 12).toFixed(1)}</strong></td>
                    <td class="td-num td-ener-gain-val ${(energyData.ganancia_anual / 12) >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">
                      <strong>${(energyData.ganancia_anual / 12) >= 0 ? '+' : ''}${(energyData.ganancia_anual / 12).toFixed(2)}</strong>
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
        </div>
      </div>
    `;

    // Attach Event Listeners
    const potInput = container.querySelector<HTMLInputElement>('#input-energy-potencia');
    const gammaInput = container.querySelector<HTMLInputElement>('#input-energy-gamma');
    const toncInput = container.querySelector<HTMLInputElement>('#input-energy-tonc');

    // Real-time synchronization when typing into Energy Calculation inputs
    potInput?.addEventListener('input', () => {
      const v = parseFloat(potInput.value);
      if (!isNaN(v) && v > 0) {
        statePeakKw = v;
        solarSyncState.setPeakPowerKw(v, 'energy-panel');
      }
    });

    toncInput?.addEventListener('input', () => {
      const v = parseFloat(toncInput.value);
      if (!isNaN(v) && v > 0) {
        stateTonc = v;
        solarSyncState.setTonc(v, 'energy-panel');
      }
    });

    gammaInput?.addEventListener('input', () => {
      const v = parseFloat(gammaInput.value);
      if (!isNaN(v)) {
        stateCoefTemp = v;
        solarSyncState.setCoefTemp(v, 'energy-panel');
      }
    });

    // 1. Calculate Button
    const btnCalc = container.querySelector<HTMLButtonElement>('#btn-energy-calc-run');
    btnCalc?.addEventListener('click', () => {
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
      if (toncVal < 30 || toncVal > 65) {
        alert(isEn ? 'NOCT must be between 30 and 65 °C.' : 'La TONC debe estar comprendida entre 30 y 65 °C.');
        return;
      }

      statePeakKw = potVal;
      stateCoefTemp = gammaVal;
      stateTonc = toncVal;
      solarSyncState.setPeakPowerKw(potVal, 'energy-panel');
      solarSyncState.setTonc(toncVal, 'energy-panel');
      solarSyncState.setCoefTemp(gammaVal, 'energy-panel');

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
  }

  const handleExternalSync = (e: Event) => {
    const d = (e as CustomEvent).detail;
    if (!d || d.source === 'energy-panel') return;
    if (d.field === 'peakPowerKw') {
      statePeakKw = d.value;
      const pInp = container.querySelector<HTMLInputElement>('#input-energy-potencia');
      if (pInp && parseFloat(pInp.value) !== d.value) {
        pInp.value = d.value.toString();
      }
    } else if (d.field === 'tonc') {
      stateTonc = d.value;
      const tInp = container.querySelector<HTMLInputElement>('#input-energy-tonc');
      if (tInp && parseFloat(tInp.value) !== d.value) {
        tInp.value = d.value.toString();
      }
    }
  };
  window.addEventListener('orientsol:solar-params-updated', handleExternalSync);

  renderInternal();
  return container;
}


