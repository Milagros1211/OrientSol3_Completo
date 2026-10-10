import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { renderComparativeGraphsWindow } from '@/components/charts/ComparativeGraphsWindow';
import { getMonthlyRadiationForAngle } from '@/components/climate/OptimalAnnualStudyPanel';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolPDFReport,
} from '@/components/export/pdfReportGenerator';
import * as XLSX from 'xlsx';

export type ComparativeRadiationComponent = 'global' | 'beam' | 'diffuse' | 'albedo';

interface ComparativeStudyProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
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

let stateCompComponent: ComparativeRadiationComponent = 'global';
let stateCompShowGraphs: boolean = false;

/**
 * Replicates OrientSol 3.0 - Comparativa de todos los tipos de estudios (Tabla_Comparativa.m)
 * Matching strictly Figura 5.2.98
 */
export function renderComparativeStudyPanel(props: ComparativeStudyProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;

  const container = document.createElement('div');
  container.className = 'opt-tracking-study-card comparative-study-panel';
  container.id = 'comparative-study-window';

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;

    const compActual = stateCompComponent;
    const compSym = compActual === 'global' ? 'Gdm' : compActual === 'beam' ? 'Bdm' : compActual === 'diffuse' ? 'Ddm' : 'Rdm';
    const compTitle = compActual === 'global' ? (isEn ? 'Global mean monthly radiation' : 'Radiación global media mensual')
      : compActual === 'beam' ? (isEn ? 'Direct mean monthly radiation' : 'Radiación directa media mensual')
      : compActual === 'diffuse' ? (isEn ? 'Diffuse mean monthly radiation' : 'Radiación difusa media mensual')
      : (isEn ? 'Albedo mean monthly radiation' : 'Radiación de albedo media mensual');

    // Radiation components for all 7 methods
    const rad0 = compActual === 'global' ? res.horizontal.gdm0
      : compActual === 'beam' ? res.horizontal.bdm0
      : compActual === 'diffuse' ? res.horizontal.ddm0
      : new Array(12).fill(0.0);

    const getComp = (compObj: { global?: number[]; beam?: number[]; diffuse?: number[]; albedo?: number[] } | undefined, fallback: number[]) => {
      if (compActual === 'global') return fallback;
      if (compObj && compObj[compActual]) return compObj[compActual]!;
      if (compActual === 'beam') return res.horizontal.bdm0;
      if (compActual === 'diffuse') return res.horizontal.ddm0;
      return new Array(12).fill(0.0);
    };

    const radOptAnnual = getMonthlyRadiationForAngle(res, compActual, res.optimalAnnual.optimalTiltDeg);
    const radOptSeasonal = compActual === 'global' ? res.seasonal.monthlyDailyKwh : getMonthlyRadiationForAngle(res, compActual, Math.round((res.seasonal.winterTiltDeg + res.seasonal.summerTiltDeg) / 2));
    const radPolar = getComp(res.tracking.polarAxis.components, res.tracking.polarAxis.monthlyDailyKwh);
    const radAzim = getComp(res.tracking.azimuthalAxis.components, res.tracking.azimuthalAxis.monthlyDailyKwh);
    const radHorizTrack = getComp(res.tracking.horizontalAxis.components, res.tracking.horizontalAxis.monthlyDailyKwh);
    const radDual = getComp(res.tracking.dualAxis.components, res.tracking.dualAxis.monthlyDailyKwh);
    const tempMean = res.temperatures.ambient.monthlyMeanC;

    // Averages (row MEDIA)
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
    const m0 = avg(rad0);
    const mOptAnnual = avg(radOptAnnual);
    const mOptSeasonal = avg(radOptSeasonal);
    const mPolar = avg(radPolar);
    const mAzim = avg(radAzim);
    const mHorizTrack = avg(radHorizTrack);
    const mDual = avg(radDual);
    const mTemp = res.temperatures.ambient.annualMeanC;

    container.innerHTML = `
      <!-- MATLAB Window Header matching Figura 5.2.98 -->
      <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <div>
          <div style="font-size: 0.95rem; color: #1e293b; margin-bottom: 0.35rem;">
            <span style="color: #64748b; font-weight: 600;">${isEn ? 'City:' : 'Ciudad:'}</span>
            <strong style="color: #0284c7; margin-left: 0.4rem;">${locationName}</strong>
            <span style="color: #64748b; font-weight: 600; margin-left: 2rem;">${isEn ? 'Latitude (°):' : 'Latitud (°):'}</span>
            <strong style="color: #0284c7; margin-left: 0.4rem;">${latitude.toFixed(2)}</strong>
          </div>
          <div style="font-size: 0.95rem; color: #1e293b;">
            <span style="color: #64748b; font-weight: 600;">${isEn ? 'Study:' : 'Estudio:'}</span>
            <strong style="color: #0284c7; margin-left: 0.4rem;">${isEn ? 'Comparative of all study types' : 'Comparativa de todos los tipos de estudios'}</strong>
          </div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 900; letter-spacing: 0.5px; color: #0284c7;">
          ORIENT<span style="color: #f59e0b;">SOL</span> 3.0
        </div>
      </div>

      <!-- Controls Row: Component Selector & View Graphs button -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.8rem;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="color: #0284c7; font-size: 0.95rem; font-weight: 700;">
            ${isEn ? 'Select a component' : 'Seleccione una componente'}
          </span>
          <select id="sel-comp-study" style="padding: 0.35rem 0.6rem; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; background: #ffffff; color: #1e293b; min-width: 140px;">
            <option value="global" ${compActual === 'global' ? 'selected' : ''}>${isEn ? 'Global' : 'Global'}</option>
            <option value="beam" ${compActual === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
            <option value="diffuse" ${compActual === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
            <option value="albedo" ${compActual === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
          </select>
        </div>

        <button type="button" id="btn-comp-view-graphs" style="padding: 0.45rem 1.6rem; background: #f1f5f9; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
          ${stateCompShowGraphs ? (isEn ? 'Hide Graphs' : 'Ocultar gráficas') : (isEn ? 'View Graphs' : 'Ver gráficas')}
        </button>
      </div>

      <!-- Subtitle -->
      <div style="color: #334155; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem;">
        ${compTitle} (kWh/m²/día)
      </div>

      <!-- 9-Column Comparative Table Matching Figura 5.2.98 -->
      <div style="overflow-x: auto; background: #ffffff; border: 1px solid #93c5fd; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);">
        <table class="comparative-results-table" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.88rem;">
          <thead>
            <tr style="background: #2563eb; color: #ffffff; border-bottom: 2px solid #1d4ed8;">
              <th style="padding: 0.65rem 0.8rem; background: #1e40af; border-right: 1px solid #3b82f6; text-align: left;">${isEn ? 'Month' : 'Mes'}</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (0°)</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (Inclinación óptima anual)</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (Inclinación óptima estacional)</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (Seguim. a un eje polar)</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (Seguim. a un eje azimutal)</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (Seguim. a un eje horizontal)</th>
              <th style="padding: 0.65rem 0.5rem; border-right: 1px solid #3b82f6;">${compSym} (Seguim. a dos ejes)</th>
              <th style="padding: 0.65rem 0.5rem; background: #1d4ed8;">${isEn ? 'Mean temperature' : 'Temperatura media'}</th>
            </tr>
          </thead>
          <tbody>
            ${months.map((mName, i) => `
              <tr style="border-bottom: 1px solid #e2e8f0; ${i % 2 === 0 ? 'background: #ffffff;' : 'background: #f8fafc;'} color: #1e293b;">
                <td style="padding: 0.45rem 0.8rem; text-align: left; font-weight: 700; background: #eff6ff; color: #1e40af; border-right: 1px solid #bfdbfe;">
                  ${mName}
                </td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0;">${rad0[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0; font-weight: 600;">${radOptAnnual[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0; font-weight: 600;">${radOptSeasonal[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0; font-weight: 600;">${radPolar[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0; font-weight: 600;">${radAzim[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0; font-weight: 600;">${radHorizTrack[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; border-right: 1px solid #e2e8f0; font-weight: 700; color: #0284c7;">${radDual[i].toFixed(2)}</td>
                <td style="padding: 0.45rem; color: #b45309; font-weight: 600; background: #fffbeb;">${tempMean[i].toFixed(1)}</td>
              </tr>
            `).join('')}
            <!-- MEDIA Row (Matching Figura 5.2.98 black/dark background) -->
            <tr style="background: #0f172a; color: #ffffff; font-weight: 800; border-top: 2px solid #0284c7;">
              <td style="padding: 0.55rem 0.8rem; text-align: left; text-transform: uppercase; color: #38bdf8; background: #0284c7;">
                ${isEn ? 'Mean' : 'MEDIA'}
              </td>
              <td style="padding: 0.55rem;">${m0.toFixed(2)}</td>
              <td style="padding: 0.55rem;">${mOptAnnual.toFixed(2)}</td>
              <td style="padding: 0.55rem;">${mOptSeasonal.toFixed(2)}</td>
              <td style="padding: 0.55rem;">${mPolar.toFixed(2)}</td>
              <td style="padding: 0.55rem;">${mAzim.toFixed(2)}</td>
              <td style="padding: 0.55rem;">${mHorizTrack.toFixed(2)}</td>
              <td style="padding: 0.55rem; color: #38bdf8;">${mDual.toFixed(2)}</td>
              <td style="padding: 0.55rem; color: #fbbf24;">${mTemp.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons Matching Figura 5.2.98 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 0.8rem;">
        <div style="display: flex; gap: 0.6rem;">
          <button type="button" id="btn-comp-exit" style="padding: 0.45rem 1.4rem; background: #e2e8f0; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; cursor: pointer;">
            ${isEn ? 'Exit' : 'Salir'}
          </button>
          <button type="button" id="btn-comp-back" style="padding: 0.45rem 1.4rem; background: #e2e8f0; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; cursor: pointer;">
            ${isEn ? 'Back' : 'Volver'}
          </button>
        </div>
        <div style="display: flex; gap: 0.6rem;">
          <button type="button" id="btn-comp-excel" style="padding: 0.45rem 1.4rem; background: #e2e8f0; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; cursor: pointer;">
            ${isEn ? 'Export to Excel' : 'Exportar a Excel'}
          </button>
          <button type="button" id="btn-comp-pdf" style="padding: 0.45rem 1.4rem; background: #e2e8f0; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; cursor: pointer;">
            ${isEn ? 'Generate Report' : 'Generar un informe'}
          </button>
        </div>
      </div>

      <!-- Graphs container when toggled -->
      <div id="comparative-graphs-slot" style="margin-top: 1.5rem;"></div>
    `;

    // Hook listeners
    const selComp = container.querySelector('#sel-comp-study') as HTMLSelectElement;
    selComp?.addEventListener('change', () => {
      stateCompComponent = selComp.value as ComparativeRadiationComponent;
      renderInternal();
    });

    const btnGraphs = container.querySelector('#btn-comp-view-graphs') as HTMLButtonElement;
    btnGraphs?.addEventListener('click', () => {
      stateCompShowGraphs = !stateCompShowGraphs;
      renderInternal();
    });

    const graphsSlot = container.querySelector('#comparative-graphs-slot') as HTMLElement;
    if (stateCompShowGraphs && graphsSlot) {
      graphsSlot.innerHTML = '';
      const graphsWindow = renderComparativeGraphsWindow({
        simulationResult: res,
        locationName,
        latitude,
        onBack: () => {
          stateCompShowGraphs = false;
          renderInternal();
        },
        onExit: () => {
          stateCompShowGraphs = false;
          renderInternal();
        }
      });
      graphsSlot.appendChild(graphsWindow);
    }

    container.querySelector('#btn-comp-back')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    container.querySelector('#btn-comp-exit')?.addEventListener('click', () => {
      if (onExit) onExit();
    });

    container.querySelector('#btn-comp-excel')?.addEventListener('click', () => {
      exportToExcel(isEn, months, rad0, radOptAnnual, radOptSeasonal, radPolar, radAzim, radHorizTrack, radDual, tempMean, m0, mOptAnnual, mOptSeasonal, mPolar, mAzim, mHorizTrack, mDual, mTemp, locationName, latitude);
    });

    container.querySelector('#btn-comp-pdf')?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolPDFReport(res, isEn, 'comparative');
      });
    });
  }

  function exportToExcel(
    isEn: boolean,
    months: string[],
    r0: number[],
    rAnu: number[],
    rEst: number[],
    rPol: number[],
    rAzi: number[],
    rHor: number[],
    r2E: number[],
    temp: number[],
    m0: number,
    mAnu: number,
    mEst: number,
    mPol: number,
    mAzi: number,
    mHor: number,
    m2E: number,
    mTemp: number,
    loc: string,
    lat: number
  ) {
    const data: any[] = [
      [isEn ? 'OrientSol 3.0 - Comparative Report of all solar tracking & fixed methods' : 'OrientSol 3.0 - Comparativa de todos los tipos de estudios'],
      [`${isEn ? 'Location' : 'Localización'}: ${loc}`, `${isEn ? 'Latitude' : 'Latitud'}: ${lat}°`],
      [],
      [
        isEn ? 'Month' : 'Mes',
        'Gdm (0°)',
        'Gdm (Inclinación óptima anual)',
        'Gdm (Inclinación óptima estacional)',
        'Gdm (Seguim. a un eje polar)',
        'Gdm (Seguim. a un eje azimutal)',
        'Gdm (Seguim. a un eje horizontal)',
        'Gdm (Seguim. a dos ejes)',
        isEn ? 'Mean Temp (°C)' : 'Temperatura media (°C)'
      ]
    ];

    for (let i = 0; i < 12; i++) {
      data.push([
        months[i],
        Number(r0[i].toFixed(2)),
        Number(rAnu[i].toFixed(2)),
        Number(rEst[i].toFixed(2)),
        Number(rPol[i].toFixed(2)),
        Number(rAzi[i].toFixed(2)),
        Number(rHor[i].toFixed(2)),
        Number(r2E[i].toFixed(2)),
        Number(temp[i].toFixed(1))
      ]);
    }

    data.push([
      isEn ? 'MEAN' : 'MEDIA',
      Number(m0.toFixed(2)),
      Number(mAnu.toFixed(2)),
      Number(mEst.toFixed(2)),
      Number(mPol.toFixed(2)),
      Number(mAzi.toFixed(2)),
      Number(mHor.toFixed(2)),
      Number(m2E.toFixed(2)),
      Number(mTemp.toFixed(2))
    ]);

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comparativa_Estudios');
    XLSX.writeFile(wb, `OrientSol3_Comparativa_Todos_Estudios_${loc}.xlsx`);
  }

  renderInternal();
  return container;
}
