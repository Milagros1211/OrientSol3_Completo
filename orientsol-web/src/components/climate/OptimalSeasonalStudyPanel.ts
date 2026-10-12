import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import {
  getMonthlyRadiationForAngle,
  type TableRadiationComponent,
} from '@/components/climate/OptimalAnnualStudyPanel';
import {
  showPdfGenerationNoticeModal,
  generateOrientSolPDFReport,
} from '@/components/export/pdfReportGenerator';
import { exportOrientSolMasterExcel } from '@/components/export/masterExportService';
import { renderEnergyCalculationPanel } from '@/components/energy/EnergyCalculationPanel';
import { renderOptimalSeasonalGraphsWindow } from '@/components/charts/OptimalSeasonalGraphsWindow';
import { renderCaptureLossMapSection } from '@/components/climate/CaptureLossMapSection';
import { solarSyncState } from '@/services/bridge/solarSyncState';
import * as XLSX from 'xlsx';

export type SeasonalRadiationComponent = 'global' | 'beam' | 'diffuse' | 'albedo' | 'all';

interface OptimalSeasonalStudyProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  peakPowerKw?: number;
}

// Module-level component state
let stateSeasonalComponent: SeasonalRadiationComponent = 'global';
let stateSeasonalShowEnergy: boolean = false;
let stateSeasonalShowGraphs: boolean = false;

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Seasonal order: Invierno (Dic, Ene, Feb), Primavera (Mar, Abr, May), Verano (Jun, Jul, Ago), Otoño (Sep, Oct, Nov)
const SEASONAL_MONTH_ORDER = [
  { season: 'winter', monthIdx: 11 }, // Diciembre
  { season: 'winter', monthIdx: 0 },  // Enero
  { season: 'winter', monthIdx: 1 },  // Febrero
  { season: 'spring', monthIdx: 2 },  // Marzo
  { season: 'spring', monthIdx: 3 },  // Abril
  { season: 'spring', monthIdx: 4 },  // Mayo
  { season: 'summer', monthIdx: 5 },  // Junio
  { season: 'summer', monthIdx: 6 },  // Julio
  { season: 'summer', monthIdx: 7 },  // Agosto
  { season: 'autumn', monthIdx: 8 },  // Septiembre
  { season: 'autumn', monthIdx: 9 },  // Octubre
  { season: 'autumn', monthIdx: 10 }, // Noviembre
];

/**
 * Notice modal for Albedo radiation
 */
function showAlbedoWarningModal(isEn: boolean) {
  const existing = document.getElementById('matlab-albedo-seasonal-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-albedo-seasonal-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 480px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Notice' : 'Aviso'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body">
        <div class="matlab-dialog-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#38bdf8" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="matlab-dialog-msg">
          ${
            isEn
              ? '<strong>Albedo Radiation Warning:</strong><br/>Gains with respect to the horizontal plane (0°) cannot be calculated because Rdm(0°) is zero on a flat ground surface.'
              : '<strong>Aviso de Radiación de Albedo:</strong><br/>Las ganancias respecto al plano horizontal (0°) no se pueden calcular debido a que Rdm(0°) es nula sobre la superficie horizontal.'
          }
        </div>
      </div>
      <div class="matlab-dialog-actions">
        <button type="button" class="matlab-btn-default btn-albedo-ok">OK</button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.querySelector('.btn-albedo-ok')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
}

/**
 * Modal to ask user whether to export only the active component or all components
 * matching MATLAB questdlg in Tabla_OptEstacional.m:
 * '¿Qué desea exportar a un fichero Excel?'
 * ['Sólo la componente visualizada', 'Todas las componentes']
 */
export function showSeasonalExcelExportModal(
  res: SolarBridgeSimulationResult,
  activeComponent: SeasonalRadiationComponent,
  isEn: boolean
) {
  const existing = document.getElementById('matlab-seasonal-excel-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-seasonal-excel-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 500px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Select Option' : 'Seleccione la opción deseada'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 1.5rem 1.25rem;">
        <div class="matlab-dialog-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#38bdf8" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="matlab-dialog-msg" style="font-size: 0.95rem; font-weight: 600; color: #f8fafc;">
          ${isEn ? 'What would you like to export to an Excel file?' : '¿Qué desea exportar a un fichero Excel?'}
        </div>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.25rem;">
        <button type="button" id="btn-export-single-comp" class="matlab-btn-default" style="font-size: 0.82rem; padding: 0.5rem 0.9rem;">
          ${isEn ? 'Only displayed component' : 'Sólo la componente visualizada'}
        </button>
        <button type="button" id="btn-export-all-comps" class="matlab-btn-default" style="font-size: 0.82rem; padding: 0.5rem 0.9rem; background: #0284c7; border-color: #38bdf8; color: #ffffff;">
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

  backdrop.querySelector('#btn-export-single-comp')?.addEventListener('click', () => {
    close();
    exportSeasonalExcelFile(res, activeComponent === 'all' ? 'global' : activeComponent, false, isEn);
  });

  backdrop.querySelector('#btn-export-all-comps')?.addEventListener('click', () => {
    close();
    exportSeasonalExcelFile(res, 'all', true, isEn);
  });

  document.body.appendChild(backdrop);
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * - Figura 5.2.90: Datos exportados de radiación para inclinación óptima estacional (I/III)
 * - Figura 5.2.91: Datos exportados de radiación para inclinación óptima estacional (II/III)
 * - Part III: Resumen (Gdm(Ópt), Temp, Ganancias s/ Horizontal e Inclinación óptima anual)
 */
function buildSeasonalComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean
): any[][] {
  const compLabel =
    comp === 'global'
      ? (isEn ? 'GLOBAL' : 'GLOBAL')
      : comp === 'beam'
      ? (isEn ? 'DIRECT' : 'DIRECTA')
      : comp === 'diffuse'
      ? (isEn ? 'DIFFUSE' : 'DIFUSA')
      : (isEn ? 'ALBEDO' : 'ALBEDO');

  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const isAlbedo = comp === 'albedo';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;

  const winterDeg = res.seasonal.winterTiltDeg;
  const springDeg = res.seasonal.springTiltDeg;
  const summerDeg = res.seasonal.summerTiltDeg;
  const autumnDeg = res.seasonal.autumnTiltDeg;
  const annualOptDeg = res.optimalAnnual.optimalTiltDeg;

  // Precalculate radiation matrices across all 91 degrees (0 to 90) for all 12 months
  const radAll91: number[][] = []; // [monthIdx][deg 0..90]
  for (let m = 0; m < 12; m++) {
    radAll91[m] = [];
  }
  for (let deg = 0; deg <= 90; deg++) {
    const vals = getMonthlyRadiationForAngle(res, comp, deg);
    for (let m = 0; m < 12; m++) {
      radAll91[m][deg] = vals[m];
    }
  }

  // Monthly optimal seasonal values
  // Invierno: Dic (11), Ene (0), Feb (1) at winterDeg
  // Primavera: Mar (2), Abr (3), May (4) at springDeg
  // Verano: Jun (5), Jul (6), Ago (7) at summerDeg
  // Otoño: Sep (8), Oct (9), Nov (10) at autumnDeg
  const radOptEst: number[] = new Array(12).fill(0);
  radOptEst[11] = radAll91[11][winterDeg];
  radOptEst[0] = radAll91[0][winterDeg];
  radOptEst[1] = radAll91[1][winterDeg];

  radOptEst[2] = radAll91[2][springDeg];
  radOptEst[3] = radAll91[3][springDeg];
  radOptEst[4] = radAll91[4][springDeg];

  radOptEst[5] = radAll91[5][summerDeg];
  radOptEst[6] = radAll91[6][summerDeg];
  radOptEst[7] = radAll91[7][summerDeg];

  radOptEst[8] = radAll91[8][autumnDeg];
  radOptEst[9] = radAll91[9][autumnDeg];
  radOptEst[10] = radAll91[10][autumnDeg];

  const radOptAnu: number[] = new Array(12).fill(0);
  for (let m = 0; m < 12; m++) {
    radOptAnu[m] = radAll91[m][annualOptDeg];
  }

  const rad0: number[] = new Array(12).fill(0);
  for (let m = 0; m < 12; m++) {
    rad0[m] = radAll91[m][0];
  }

  // Create a 65x100 2D array initialized to null
  const grid: any[][] = [];
  for (let r = 0; r <= 66; r++) {
    grid[r] = new Array(96).fill('');
  }

  // Row 1 (Index 0): Jaén | Latitud | 37.7656 | | Inclinación óptima estacional
  grid[0][0] = res.locationName;
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = res.latitude;
  grid[0][4] = isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional';

  // Row 3 (Index 2): Col B: RADIACIÓN GLOBAL DIARIA (kWh/m²/día)
  grid[2][1] = isEn
    ? `DAILY ${compLabel} RADIATION (kWh/m²/day)`
    : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;

  // Row 4 (Index 3): Col C..CN: Gdm(0º) to Gdm(90º)
  for (let deg = 0; deg <= 90; deg++) {
    grid[3][deg + 2] = `${compSym}(${deg}º)`;
  }

  // Helper for seasonal averages of 0..90 deg
  const calcSeasonMeanDeg = (mIndices: number[], deg: number) => {
    const s = mIndices.reduce((acc, mi) => acc + radAll91[mi][deg], 0);
    return s / mIndices.length;
  };

  // 1. INVIERNO (Rows 5 to 8, Index 4 to 7)
  const winterMonths = [11, 0, 1];
  grid[4][1] = months[11]; // Diciembre
  grid[5][0] = isEn ? 'Winter' : 'Invierno';
  grid[5][1] = months[0];  // Enero
  grid[6][1] = months[1];  // Febrero
  grid[7][1] = 'MEDIA(Inv)';

  // Fill values for winter
  for (let deg = 0; deg <= 90; deg++) {
    grid[4][deg + 2] = radAll91[11][deg];
    grid[5][deg + 2] = radAll91[0][deg];
    grid[6][deg + 2] = radAll91[1][deg];
    grid[7][deg + 2] = calcSeasonMeanDeg(winterMonths, deg);
  }

  // 2. PRIMAVERA (Rows 10 to 13, Index 9 to 12)
  const springMonths = [2, 3, 4];
  grid[9][1] = months[2]; // Marzo
  grid[10][0] = isEn ? 'Spring' : 'Primavera';
  grid[10][1] = months[3]; // Abril
  grid[11][1] = months[4]; // Mayo
  grid[12][1] = 'MEDIA(Pri)';

  for (let deg = 0; deg <= 90; deg++) {
    grid[9][deg + 2] = radAll91[2][deg];
    grid[10][deg + 2] = radAll91[3][deg];
    grid[11][deg + 2] = radAll91[4][deg];
    grid[12][deg + 2] = calcSeasonMeanDeg(springMonths, deg);
  }

  // 3. VERANO (Rows 15 to 18, Index 14 to 17)
  const summerMonths = [5, 6, 7];
  grid[14][1] = months[5]; // Junio
  grid[15][0] = isEn ? 'Summer' : 'Verano';
  grid[15][1] = months[6]; // Julio
  grid[16][1] = months[7]; // Agosto
  grid[17][1] = 'MEDIA(Ver)';

  for (let deg = 0; deg <= 90; deg++) {
    grid[14][deg + 2] = radAll91[5][deg];
    grid[15][deg + 2] = radAll91[6][deg];
    grid[16][deg + 2] = radAll91[7][deg];
    grid[17][deg + 2] = calcSeasonMeanDeg(summerMonths, deg);
  }

  // 4. OTOÑO (Rows 20 to 23, Index 19 to 22)
  const autumnMonths = [8, 9, 10];
  grid[19][1] = months[8]; // Septiembre
  grid[20][0] = isEn ? 'Autumn' : 'Otoño';
  grid[20][1] = months[9]; // Octubre
  grid[21][1] = months[10]; // Noviembre
  grid[22][1] = 'MEDIA(Oto)';

  for (let deg = 0; deg <= 90; deg++) {
    grid[19][deg + 2] = radAll91[8][deg];
    grid[20][deg + 2] = radAll91[9][deg];
    grid[21][deg + 2] = radAll91[10][deg];
    grid[22][deg + 2] = calcSeasonMeanDeg(autumnMonths, deg);
  }

  // 5. MED.ANUAL (Row 25, Index 24)
  grid[24][1] = 'MED.ANUAL';
  for (let deg = 0; deg <= 90; deg++) {
    let sumAnnual = 0;
    for (let m = 0; m < 12; m++) {
      sumAnnual += radAll91[m][deg];
    }
    grid[24][deg + 2] = sumAnnual / 12;
  }

  // =========================================================================
  // PARTE II: RADIACIÓN A LAS INCLINACIONES ÓPTIMAS ESTACIONALES (Figura 5.2.91)
  // Rows 27 to 47 (Index 26 to 46)
  // =========================================================================
  grid[26][1] = isEn
    ? `DAILY ${compLabel} RADIATION AT SEASONAL OPTIMAL TILTS`
    : `RADIACIÓN ${compLabel} A LAS INCLINACIONES ÓPTIMAS ESTACIONALES`;

  grid[27][1] = isEn ? 'Opt.Angle' : 'Áng.Óptimo';
  grid[27][3] = `${compSym}(${isEn ? 'Opt.Sea' : 'Ópt.Est'})`;

  // Invierno
  grid[28][2] = months[11];
  grid[28][3] = radOptEst[11];

  grid[29][0] = isEn ? 'Winter' : 'Invierno';
  grid[29][1] = winterDeg;
  grid[29][2] = months[0];
  grid[29][3] = radOptEst[0];

  grid[30][2] = months[1];
  grid[30][3] = radOptEst[1];

  grid[31][2] = 'MEDIA(Inv)';
  grid[31][3] = (radOptEst[11] + radOptEst[0] + radOptEst[1]) / 3;

  // Primavera
  grid[33][2] = months[2];
  grid[33][3] = radOptEst[2];

  grid[34][0] = isEn ? 'Spring' : 'Primavera';
  grid[34][1] = springDeg;
  grid[34][2] = months[3];
  grid[34][3] = radOptEst[3];

  grid[35][2] = months[4];
  grid[35][3] = radOptEst[4];

  grid[36][2] = 'MEDIA(Pri)';
  grid[36][3] = (radOptEst[2] + radOptEst[3] + radOptEst[4]) / 3;

  // Verano
  grid[38][2] = months[5];
  grid[38][3] = radOptEst[5];

  grid[39][0] = isEn ? 'Summer' : 'Verano';
  grid[39][1] = summerDeg;
  grid[39][2] = months[6];
  grid[39][3] = radOptEst[6];

  grid[40][2] = months[7];
  grid[40][3] = radOptEst[7];

  grid[41][2] = 'MEDIA(Ver)';
  grid[41][3] = (radOptEst[5] + radOptEst[6] + radOptEst[7]) / 3;

  // Otoño
  grid[43][2] = months[8];
  grid[43][3] = radOptEst[8];

  grid[44][0] = isEn ? 'Autumn' : 'Otoño';
  grid[44][1] = autumnDeg;
  grid[44][2] = months[9];
  grid[44][3] = radOptEst[9];

  grid[45][2] = months[10];
  grid[45][3] = radOptEst[10];

  grid[46][2] = 'MEDIA(Oto)';
  grid[46][3] = (radOptEst[8] + radOptEst[9] + radOptEst[10]) / 3;

  // =========================================================================
  // PARTE III: RESUMEN Y GANANCIAS (Rows 49 to 64, Index 48 to 63)
  // =========================================================================
  grid[48][0] = isEn ? 'SUMMARY' : 'RESUMEN';
  grid[48][4] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[48][5] = isEn ? 'Relative to:' : 'Respecto a:';

  grid[49][5] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[49][7] = isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual';

  grid[50][0] = isEn ? 'Month' : 'Mes';
  grid[50][1] = `${compSym}(${isEn ? 'Opt' : 'Ópt'})`;
  grid[50][2] = 'Temp.(ºC)';
  grid[50][5] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
  grid[50][6] = isEn ? 'Gain (%)' : 'Ganancia(%)';
  grid[50][7] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
  grid[50][8] = isEn ? 'Gain (%)' : 'Ganancia(%)';

  // Monthly values ordered standard Enero (0) to Diciembre (11) in Resumen
  const tempVals = res.temperatures.ambient.monthlyMeanC;
  const gana0FactorList: number[] = [];
  const gana0PctList: number[] = [];
  const ganaAnuFactorList: number[] = [];
  const ganaAnuPctList: number[] = [];

  for (let m = 0; m < 12; m++) {
    const rowIdx = 51 + m;
    const gOpt = radOptEst[m];
    const g0 = rad0[m];
    const gAnu = radOptAnu[m];
    const tVal = tempVals[m];

    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = gOpt;
    grid[rowIdx][2] = tVal;

    // Gains vs Horizontal
    if (isAlbedo) {
      grid[rowIdx][5] = '-';
      grid[rowIdx][6] = '-';
    } else {
      const fact0 = g0 > 0 ? gOpt / g0 : 1;
      const pct0 = g0 > 0 ? ((gOpt - g0) / g0) * 100 : 0;
      grid[rowIdx][5] = fact0;
      grid[rowIdx][6] = pct0;
      gana0FactorList.push(fact0);
      gana0PctList.push(pct0);
    }

    // Gains vs Annual Optimum
    const factAnu = gAnu > 0 ? gOpt / gAnu : 1;
    const pctAnu = gAnu > 0 ? ((gOpt - gAnu) / gAnu) * 100 : 0;
    grid[rowIdx][7] = factAnu;
    grid[rowIdx][8] = pctAnu;
    ganaAnuFactorList.push(factAnu);
    ganaAnuPctList.push(pctAnu);
  }

  // Row 64 (Index 63): MEDIA row in Resumen
  const meanOptEst = radOptEst.reduce((a, b) => a + b, 0) / 12;
  const meanTemp = tempVals.reduce((a, b) => a + b, 0) / 12;

  grid[63][0] = 'MEDIA';
  grid[63][1] = meanOptEst;
  grid[63][2] = meanTemp;

  if (isAlbedo) {
    grid[63][5] = '-';
    grid[63][6] = '-';
  } else {
    grid[63][5] = gana0FactorList.reduce((a, b) => a + b, 0) / 12;
    grid[63][6] = gana0PctList.reduce((a, b) => a + b, 0) / 12;
  }

  grid[63][7] = ganaAnuFactorList.reduce((a, b) => a + b, 0) / 12;
  grid[63][8] = ganaAnuPctList.reduce((a, b) => a + b, 0) / 12;

  return grid;
}

/**
 * Exports Excel workbook and triggers file download or save picker
 */
async function exportSeasonalExcelFile(
  res: SolarBridgeSimulationResult,
  selectedComp: SeasonalRadiationComponent,
  allComponents: boolean,
  isEn: boolean
) {
  const wb = XLSX.utils.book_new();

  if (allComponents) {
    const components: TableRadiationComponent[] = ['global', 'beam', 'diffuse', 'albedo'];
    const sheetNames = [
      isEn ? 'Sheet1_Global' : 'Hoja1_Global',
      isEn ? 'Sheet2_Direct' : 'Hoja2_Directa',
      isEn ? 'Sheet3_Diffuse' : 'Hoja3_Difusa',
      isEn ? 'Sheet4_Albedo' : 'Hoja4_Albedo',
    ];

    components.forEach((comp, idx) => {
      const data = buildSeasonalComponentSheet(res, comp, isEn);
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetNames[idx]);
    });
  } else {
    const comp = (selectedComp === 'all' ? 'global' : selectedComp) as TableRadiationComponent;
    const data = buildSeasonalComponentSheet(res, comp, isEn);
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, isEn ? 'Sheet1' : 'Hoja1');
  }

  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_OptEstacional_${cleanLoc}.xlsx`;

  // Write binary Excel buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Save via File System Access API if supported
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
      showSuccessExportNotice(isEn);
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    }
  }

  // Fallback download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  showSuccessExportNotice(isEn);
}

/**
 * Notice: 'Datos exportados satisfactoriamente en el directorio deseado'
 * matching msgbox in Tabla_OptEstacional.m
 */
function showSuccessExportNotice(isEn: boolean) {
  const existing = document.getElementById('matlab-seasonal-export-success');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-seasonal-export-success';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 480px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Notice' : 'Aviso'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 1.5rem 1.25rem; text-align: center;">
        <p class="matlab-dialog-msg" style="font-size: 0.95rem; color: #f8fafc; font-weight: 600;">
          ${
            isEn
              ? 'Data successfully exported to the desired directory'
              : 'Datos exportados satisfactoriamente en el directorio deseado'
          }
        </p>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: center; padding-bottom: 1.2rem;">
        <button type="button" class="matlab-btn-default btn-success-ok" style="min-width: 90px;">
          OK
        </button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.querySelector('.btn-success-ok')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
}

/**
 * Main component renderer for OrientSol 4.0 Inclinación Óptima Estacional
 * matching Figura 5.2.89 (Image 4)
 */
export function renderOptimalSeasonalStudyPanel(props: OptimalSeasonalStudyProps): HTMLElement {
  const { simulationResult: res, locationName, latitude } = props;
  const container = document.createElement('div');
  container.className = 'opt-seasonal-study-card';
  container.id = 'seasonal-study-window';

  function renderInternal() {
    const isEn = i18n.getLocale() === 'en';
    const t = i18n.t;

    const compActual: TableRadiationComponent =
      stateSeasonalComponent === 'all' ? 'global' : stateSeasonalComponent;
    const isAlbedo = compActual === 'albedo';

    const compTitle =
      compActual === 'global'
        ? (isEn ? 'Global' : 'global')
        : compActual === 'beam'
        ? (isEn ? 'Direct' : 'directa')
        : compActual === 'diffuse'
        ? (isEn ? 'Diffuse' : 'difusa')
        : (isEn ? 'Albedo' : 'albedo');

    const compSym = compActual === 'global' ? 'Gdm' : compActual === 'beam' ? 'Bdm' : compActual === 'diffuse' ? 'Ddm' : 'Rdm';

    const winterDeg = res.seasonal.winterTiltDeg;
    const springDeg = res.seasonal.springTiltDeg;
    const summerDeg = res.seasonal.summerTiltDeg;
    const autumnDeg = res.seasonal.autumnTiltDeg;
    const annualOptDeg = res.optimalAnnual.optimalTiltDeg;

    // Standard 7 tilt angles for display: 0, 15, 30, 45, 60, 75, 90
    const angles = [0, 15, 30, 45, 60, 75, 90];
    const radAngles: number[][] = angles.map((ang) => getMonthlyRadiationForAngle(res, compActual, ang));

    // Annual optimum values for each month
    const radAnnualOpt: number[] = getMonthlyRadiationForAngle(res, compActual, annualOptDeg);

    // Get optimal seasonal radiation for each month at its respective seasonal angle
    const radSeasonalOpt: number[] = new Array(12).fill(0);
    for (let m = 0; m < 12; m++) {
      let degForMonth = winterDeg;
      if (m === 2 || m === 3 || m === 4) degForMonth = springDeg;
      else if (m === 5 || m === 6 || m === 7) degForMonth = summerDeg;
      else if (m === 8 || m === 9 || m === 10) degForMonth = autumnDeg;
      radSeasonalOpt[m] = getMonthlyRadiationForAngle(res, compActual, degForMonth)[m];
    }

    // Gains calculation for each month
    const gainsHoriz: number[] = [];
    const gainsAnnual: number[] = [];
    for (let m = 0; m < 12; m++) {
      const gOpt = radSeasonalOpt[m];
      const g0 = radAngles[0][m];
      const gAnu = radAnnualOpt[m];

      const pct0 = g0 > 0 ? ((gOpt - g0) / g0) * 100 : 0;
      const pctAnu = gAnu > 0 ? ((gOpt - gAnu) / gAnu) * 100 : 0;

      gainsHoriz.push(pct0);
      gainsAnnual.push(pctAnu);
    }

    // Annual means
    const meanRadAngles = angles.map((_, aIdx) => {
      const arr = radAngles[aIdx];
      return arr.reduce((a, b) => a + b, 0) / 12;
    });
    const meanSeasonalOpt = radSeasonalOpt.reduce((a, b) => a + b, 0) / 12;
    const meanGainHoriz = gainsHoriz.reduce((a, b) => a + b, 0) / 12;
    const meanGainAnnual = gainsAnnual.reduce((a, b) => a + b, 0) / 12;

    container.innerHTML = `
      <div class="opt-seasonal-window-frame">
        <!-- 1. Top Window Header matching OrientSol 4.0 Figura 5.2.89 -->
        <div class="opt-seasonal-header-bar">
          <div class="opt-seasonal-header-left">
            <div class="opt-seasonal-meta-row">
              <span class="meta-label">
                <strong>${isEn ? 'City:' : 'Ciudad:'}</strong>
                <span class="meta-val meta-city" style="font-weight: 700; margin-left: 0.35rem;">${locationName}</span>
              </span>
              <span class="meta-label" style="margin-left: 2rem;">
                <strong>${isEn ? 'Latitude (°):' : 'Latitud (°):'}</strong>
                <span class="meta-val" style="font-weight: 700; margin-left: 0.35rem;">${latitude.toFixed(2)}°</span>
              </span>
            </div>
            <div class="opt-seasonal-study-title-row">
              <span class="meta-label">
                <strong>${isEn ? 'Study:' : 'Estudio:'}</strong>
                <span class="meta-val" style="font-weight: 600; margin-left: 0.35rem;">${isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional'}</span>
              </span>
            </div>
          </div>
          <div class="opt-seasonal-header-right">
            <div class="opt-matlab-brand-title">
              ORIENT<span style="color: #f59e0b;">SOL</span> <strong>4.0</strong>
            </div>
          </div>
        </div>

        <!-- 2. Controls Toolbar -->
        <div class="opt-seasonal-toolbar">
          <div class="seasonal-comp-select-group">
            <label for="seasonal-comp-select" class="seasonal-comp-label">
              ${isEn ? 'Select a component' : 'Seleccione una componente'}
            </label>
            <select id="seasonal-comp-select" class="form-select seasonal-comp-dropdown">
              <option value="global" ${stateSeasonalComponent === 'global' ? 'selected' : ''}>${t.results.compGlobal}</option>
              <option value="beam" ${stateSeasonalComponent === 'beam' ? 'selected' : ''}>${t.results.compBeam}</option>
              <option value="diffuse" ${stateSeasonalComponent === 'diffuse' ? 'selected' : ''}>${t.results.compDiffuse}</option>
              <option value="albedo" ${stateSeasonalComponent === 'albedo' ? 'selected' : ''}>${t.results.compAlbedo}</option>
              <option value="all" ${stateSeasonalComponent === 'all' ? 'selected' : ''}>${t.results.compAll}</option>
            </select>
          </div>

          <div class="seasonal-toolbar-actions">
            <button id="btn-seasonal-view-charts" class="btn-study-view-charts ${stateSeasonalShowGraphs ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              <span>${stateSeasonalShowGraphs ? (isEn ? 'Hide Charts' : 'Ocultar gráficas') : (isEn ? 'View Charts' : 'Ver gráficas')}</span>
            </button>
          </div>
        </div>

        <!-- 3. Table Title -->
        <div class="opt-seasonal-table-caption">
          ${isEn ? `Mean monthly daily ${compTitle} radiation (kWh/m²/day)` : `Radiación ${compTitle} media mensual (kWh/m²/día)`}
        </div>

        <!-- 4. Main Matrix Table matching Figura 5.2.89 -->
        <div class="opt-seasonal-table-wrap">
          <table class="opt-seasonal-table">
            <thead>
              <tr class="seasonal-top-th-row">
                <th rowspan="2" class="th-season-month">${isEn ? 'Month' : 'Mes'}</th>
                ${angles.map((ang) => `<th rowspan="2" class="th-ang-col">${compSym} (${ang}°)</th>`).join('')}
                <th rowspan="2" class="th-opt-angle-col">${isEn ? 'Optimal Angles (°)' : 'Ángulos óptimos (°)'}</th>
                <th rowspan="2" class="th-opt-rad-col">${compSym} ${isEn ? 'optimal' : 'óptimo'}</th>
                <th colspan="2" class="th-gains-super-col">${isEn ? 'Gains (%)' : 'Ganancias (%)'}</th>
              </tr>
              <tr class="seasonal-sub-th-row">
                <th class="th-gain-sub">${isEn ? 'Horizontal plane' : 'Plano horizontal'}</th>
                <th class="th-gain-sub">${isEn ? 'Optimal annual tilt' : 'Inclinación ópt. anual'}</th>
              </tr>
            </thead>
            <tbody>
              ${SEASONAL_MONTH_ORDER.map(({ season, monthIdx }) => {
                const monthName = isEn ? MONTH_NAMES_EN[monthIdx] : MONTH_NAMES_ES[monthIdx];
                const gOpt = radSeasonalOpt[monthIdx];
                const pctHoriz = gainsHoriz[monthIdx];
                const pctAnu = gainsAnnual[monthIdx];

                // Optimal angle display only in central month of each season
                let optAngleCell = '';
                if (season === 'winter' && monthIdx === 0) {
                  optAngleCell = `<strong class="text-season-winter" style="font-size: 1rem;">${winterDeg}</strong>`;
                } else if (season === 'spring' && monthIdx === 3) {
                  optAngleCell = `<strong class="text-season-spring" style="font-size: 1rem;">${springDeg}</strong>`;
                } else if (season === 'summer' && monthIdx === 6) {
                  optAngleCell = `<strong class="text-season-summer" style="font-size: 1rem;">${summerDeg}</strong>`;
                } else if (season === 'autumn' && monthIdx === 9) {
                  optAngleCell = `<strong class="text-season-autumn" style="font-size: 1rem;">${autumnDeg}</strong>`;
                }

                // Gdm óptimo text color based on season
                const optColorClass =
                  season === 'winter'
                    ? 'val-opt-winter'
                    : season === 'spring'
                    ? 'val-opt-spring'
                    : season === 'summer'
                    ? 'val-opt-summer'
                    : 'val-opt-autumn';

                const displayPctH = isAlbedo ? '-' : pctHoriz.toFixed(2);
                const displayPctAnu = pctAnu.toFixed(2);

                return `
                  <tr class="row-season-${season}">
                    <td class="td-month-badge badge-${season}">
                      <strong>${monthName}</strong>
                    </td>
                    ${angles.map((_, aIdx) => `<td class="td-num">${radAngles[aIdx][monthIdx].toFixed(2)}</td>`).join('')}
                    <td class="td-num td-opt-deg-cell">${optAngleCell}</td>
                    <td class="td-num td-opt-val ${optColorClass}"><strong>${gOpt.toFixed(2)}</strong></td>
                    <td class="td-num td-gain-h ${!isAlbedo && pctHoriz >= 0 ? 'text-gain-pos' : !isAlbedo ? 'text-gain-neg' : ''}">${displayPctH}</td>
                    <td class="td-num td-gain-anu ${pctAnu >= 0 ? 'text-gain-pos' : 'text-gain-neg'}">${displayPctAnu}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="seasonal-media-row">
                <td class="td-month-badge badge-media">
                  <strong>${isEn ? 'MEAN' : 'MEDIA'}</strong>
                </td>
                ${meanRadAngles.map((v) => `<td class="td-num"><strong>${v.toFixed(2)}</strong></td>`).join('')}
                <td class="td-num"></td>
                <td class="td-num td-opt-val highlight-media"><strong>${meanSeasonalOpt.toFixed(2)}</strong></td>
                <td class="td-num td-gain-h"><strong>${isAlbedo ? '-' : meanGainHoriz.toFixed(2)}</strong></td>
                <td class="td-num td-gain-anu"><strong>${meanGainAnnual.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- 5. Bottom Action Buttons matching MATLAB Figura 5.2.89 -->
        <div class="opt-study-footer-actions">
          <div class="footer-btn-left-group">
            <button id="btn-seasonal-volver" class="btn-study-foot btn-volver" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>${isEn ? 'Back' : 'Volver'}</span>
            </button>
            <button id="btn-seasonal-salir" class="btn-study-foot btn-salir" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>${isEn ? 'Exit' : 'Salir'}</span>
            </button>
          </div>

          <div class="footer-btn-right-group">
            <button id="btn-seasonal-goto-energy" class="btn-study-foot btn-energy ${stateSeasonalShowEnergy ? 'active' : ''}" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>${stateSeasonalShowEnergy ? (isEn ? 'Hide Energy Calculation' : 'Ocultar cálculo de energía') : t.results.energyCalcBtn}</span>
            </button>

            <button id="btn-seasonal-export-excel" class="btn-study-foot btn-excel" type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${t.results.exportExcelBtn}</span>
            </button>

            <button id="btn-seasonal-export-report" class="btn-study-foot btn-report" type="button">
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

        <!-- Mount point for CTE DB-HE4 Seasonal Capture Loss Map -->
        <div id="seasonal-loss-map-mount-point"></div>

        <!-- Mount point for Dedicated MATLAB Energy Calculation Window (Imagen 1 / Energia_Osterwald.m) -->
        <div id="opt-seasonal-energy-mount-point"></div>

        <!-- Mount point for Dedicated MATLAB Seasonal Graphs Window (Imagen 2) -->
        <div id="opt-seasonal-graphs-mount-point"></div>
      </div>
    `;

    // Hook CTE DB-HE4 Seasonal Capture Loss Map
    const lossMapMountPoint = container.querySelector<HTMLDivElement>('#seasonal-loss-map-mount-point');
    if (lossMapMountPoint) {
      lossMapMountPoint.innerHTML = '';
      const lossMapSection = renderCaptureLossMapSection({
        mode: 'seasonal',
        simulationResult: res,
        isEn,
      });
      lossMapMountPoint.appendChild(lossMapSection);
    }

    // Mount Graphs Panel if active
    const graphsMountPoint = container.querySelector<HTMLDivElement>('#opt-seasonal-graphs-mount-point');
    if (graphsMountPoint && stateSeasonalShowGraphs) {
      graphsMountPoint.innerHTML = '';
      const graphsWindow = renderOptimalSeasonalGraphsWindow({
        simulationResult: res,
        locationName,
        latitude,
        initialComponent: stateSeasonalComponent,
        onBack: () => {
          stateSeasonalShowGraphs = false;
          renderInternal();
          container.querySelector('.opt-seasonal-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        onExit: () => {
          stateSeasonalShowGraphs = false;
          renderInternal();
        },
      });
      graphsMountPoint.appendChild(graphsWindow);
    }

    // Mount Energy Panel if active
    const energyMountPoint = container.querySelector<HTMLDivElement>('#opt-seasonal-energy-mount-point');
    if (energyMountPoint && stateSeasonalShowEnergy) {
      energyMountPoint.innerHTML = '';
      const energyWindow = renderEnergyCalculationPanel({
        simulationResult: res,
        locationName,
        latitude,
        studyType: 'seasonal',
        initialPeakKw: props.peakPowerKw ?? 5.0,
        onClose: () => {
          stateSeasonalShowEnergy = false;
          renderInternal();
          container.querySelector('.opt-seasonal-footer-buttons')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
      });
      energyMountPoint.appendChild(energyWindow);
    }

    // Event Listeners
    // 1. Component Selector Dropdown
    const compSelect = container.querySelector<HTMLSelectElement>('#seasonal-comp-select');
    compSelect?.addEventListener('change', () => {
      const val = (compSelect.value || 'global') as SeasonalRadiationComponent;
      stateSeasonalComponent = val;
      if (val === 'albedo') {
        showAlbedoWarningModal(isEn);
      }
      renderInternal();
    });

    // 2. View Charts Action
    const btnViewCharts = container.querySelector<HTMLButtonElement>('#btn-seasonal-view-charts');
    btnViewCharts?.addEventListener('click', () => {
      stateSeasonalShowGraphs = !stateSeasonalShowGraphs;
      renderInternal();
      if (stateSeasonalShowGraphs) {
        setTimeout(() => {
          container.querySelector('#opt-seasonal-graphs-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });

    // 3. Salir Button
    const btnSalir = container.querySelector<HTMLButtonElement>('#btn-seasonal-salir');
    btnSalir?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Volver Button
    const btnVolver = container.querySelector<HTMLButtonElement>('#btn-seasonal-volver');
    btnVolver?.addEventListener('click', () => {
      const prevSection = document.querySelector('#opt-annual-study-mount-point') || document.querySelector('.results-header');
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 5. Toggle Energy Calculation Panel (Imagen 1 / Energia_Osterwald.m)
    const btnEnergy = container.querySelector<HTMLButtonElement>('#btn-seasonal-goto-energy');
    btnEnergy?.addEventListener('click', () => {
      stateSeasonalShowEnergy = !stateSeasonalShowEnergy;
      renderInternal();
      if (stateSeasonalShowEnergy) {
        setTimeout(() => {
          container.querySelector('#opt-seasonal-energy-mount-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });

    // 6. Export to Excel (Figures 5.2.90 & 5.2.91)
    const btnExportExcel = container.querySelector<HTMLButtonElement>('#btn-seasonal-export-excel');
    btnExportExcel?.addEventListener('click', () => {
      exportOrientSolMasterExcel(res, {
        activeStudyOp: 'seasonal',
        activeComponent: stateSeasonalComponent,
        isEn,
        peakPowerKw: solarSyncState.getPeakPowerKw(),
        performanceRatio: solarSyncState.getPerformanceRatio(),
        tonc: solarSyncState.getTonc(),
      });
    });

    // 7. Generate PDF Report (Figures 5.2.70, 5.2.71, 5.2.72, 5.2.74, 5.2.75)
    const btnExportReport = container.querySelector<HTMLButtonElement>('#btn-seasonal-export-report');
    btnExportReport?.addEventListener('click', () => {
      showPdfGenerationNoticeModal(isEn, () => {
        generateOrientSolPDFReport(res, isEn, 'seasonal', {
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
