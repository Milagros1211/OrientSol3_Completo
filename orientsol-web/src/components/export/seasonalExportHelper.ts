import * as XLSX from 'xlsx';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle, type TableRadiationComponent } from '@/components/climate/OptimalAnnualStudyPanel';
import { createEnergyWorksheet } from '@/components/export/energyExportHelper';

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Builds the Excel sheet data strictly conforming to:
 * - Figura 5.2.90: Datos exportados de radiación para inclinación óptima estacional (I/III)
 * - Figura 5.2.91: Datos exportados de radiación para inclinación óptima estacional (II/III)
 * - Figura 5.2.92: Datos exportados de radiación para inclinación óptima estacional (III/III)
 * (MATLAB Tabla_OptEstacional.m en OrientSol 3.0 PFC)
 */
export function buildSeasonalComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
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

  // Monthly optimal seasonal radiation values:
  // Invierno: Diciembre (11), Enero (0), Febrero (1) at winterDeg
  // Primavera: Marzo (2), Abril (3), Mayo (4) at springDeg
  // Verano: Junio (5), Julio (6), Agosto (7) at summerDeg
  // Otoño: Septiembre (8), Octubre (9), Noviembre (10) at autumnDeg
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

  // Initialize a 65-row by 96-column grid
  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 64; r++) {
    grid[r] = new Array(94).fill('');
  }

  // =========================================================================
  // PARTE I: FIGURA 5.2.90 (Rows 1 to 25, Index 0 to 24)
  // =========================================================================
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedDateTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // Row 1 (Index 0): Jaén | Latitud | 37.7655556 | | Inclinación óptima estacional | | Timestamp
  grid[0][0] = res.locationName;
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = Number(res.latitude.toFixed(7));
  grid[0][4] = isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Row 3 (Index 2): RADIACIÓN GLOBAL DIARIA (kWh/m²/dia)
  grid[2][1] = isEn
    ? `DAILY ${compLabel} RADIATION (kWh/m²/day)`
    : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/dia)`;

  // Row 4 (Index 3): Column C..CN: Gdm(0º) to Gdm(90º)
  for (let deg = 0; deg <= 90; deg++) {
    grid[3][deg + 2] = `${compSym}(${deg}º)`;
  }

  const calcSeasonMeanDeg = (mIndices: number[], deg: number) => {
    const s = mIndices.reduce((acc, mi) => acc + radAll91[mi][deg], 0);
    return Number((s / mIndices.length).toFixed(8));
  };

  // 1. INVIERNO (Rows 5 to 8, Index 4 to 7)
  const winterMonths = [11, 0, 1];
  grid[4][1] = months[11]; // Diciembre
  grid[5][0] = isEn ? 'Winter' : 'Invierno';
  grid[5][1] = months[0];  // Enero
  grid[6][1] = months[1];  // Febrero
  grid[7][1] = 'MEDIA(Inv)';

  for (let deg = 0; deg <= 90; deg++) {
    grid[4][deg + 2] = Number(radAll91[11][deg].toFixed(8));
    grid[5][deg + 2] = Number(radAll91[0][deg].toFixed(8));
    grid[6][deg + 2] = Number(radAll91[1][deg].toFixed(8));
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
    grid[9][deg + 2] = Number(radAll91[2][deg].toFixed(8));
    grid[10][deg + 2] = Number(radAll91[3][deg].toFixed(8));
    grid[11][deg + 2] = Number(radAll91[4][deg].toFixed(8));
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
    grid[14][deg + 2] = Number(radAll91[5][deg].toFixed(8));
    grid[15][deg + 2] = Number(radAll91[6][deg].toFixed(8));
    grid[16][deg + 2] = Number(radAll91[7][deg].toFixed(8));
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
    grid[19][deg + 2] = Number(radAll91[8][deg].toFixed(8));
    grid[20][deg + 2] = Number(radAll91[9][deg].toFixed(8));
    grid[21][deg + 2] = Number(radAll91[10][deg].toFixed(8));
    grid[22][deg + 2] = calcSeasonMeanDeg(autumnMonths, deg);
  }

  // 5. MED.ANUAL (Row 25, Index 24)
  grid[24][1] = 'MED.ANUAL';
  for (let deg = 0; deg <= 90; deg++) {
    let sumAnnual = 0;
    for (let m = 0; m < 12; m++) {
      sumAnnual += radAll91[m][deg];
    }
    grid[24][deg + 2] = Number((sumAnnual / 12).toFixed(8));
  }

  // =========================================================================
  // PARTE II: FIGURA 5.2.91 (Rows 27 to 47, Index 26 to 46)
  // =========================================================================
  grid[26][2] = isEn
    ? `DAILY ${compLabel} RADIATION AT SEASONAL OPTIMAL TILTS`
    : `RADIACIÓN ${compLabel} A LAS INCLINACIONES ÓPTIMAS ESTACIONALES`;

  grid[27][1] = isEn ? 'Opt.Angle' : 'Áng.Óptimo';
  grid[27][3] = `${compSym}(${isEn ? 'Opt.Sea' : 'Ópt.Est'})`;

  // Invierno
  grid[28][2] = months[11];
  grid[28][3] = Number(radOptEst[11].toFixed(8));

  grid[29][0] = isEn ? 'Winter' : 'Invierno';
  grid[29][1] = winterDeg;
  grid[29][2] = months[0];
  grid[29][3] = Number(radOptEst[0].toFixed(8));

  grid[30][2] = months[1];
  grid[30][3] = Number(radOptEst[1].toFixed(8));

  grid[31][2] = 'MEDIA(Inv)';
  grid[31][3] = Number(((radOptEst[11] + radOptEst[0] + radOptEst[1]) / 3).toFixed(8));

  // Primavera
  grid[33][2] = months[2];
  grid[33][3] = Number(radOptEst[2].toFixed(8));

  grid[34][0] = isEn ? 'Spring' : 'Primavera';
  grid[34][1] = springDeg;
  grid[34][2] = months[3];
  grid[34][3] = Number(radOptEst[3].toFixed(8));

  grid[35][2] = months[4];
  grid[35][3] = Number(radOptEst[4].toFixed(8));

  grid[36][2] = 'MEDIA(Pri)';
  grid[36][3] = Number(((radOptEst[2] + radOptEst[3] + radOptEst[4]) / 3).toFixed(8));

  // Verano
  grid[38][2] = months[5];
  grid[38][3] = Number(radOptEst[5].toFixed(8));

  grid[39][0] = isEn ? 'Summer' : 'Verano';
  grid[39][1] = summerDeg;
  grid[39][2] = months[6];
  grid[39][3] = Number(radOptEst[6].toFixed(8));

  grid[40][2] = months[7];
  grid[40][3] = Number(radOptEst[7].toFixed(8));

  grid[41][2] = 'MEDIA(Ver)';
  grid[41][3] = Number(((radOptEst[5] + radOptEst[6] + radOptEst[7]) / 3).toFixed(8));

  // Otoño
  grid[43][2] = months[8];
  grid[43][3] = Number(radOptEst[8].toFixed(8));

  grid[44][0] = isEn ? 'Autumn' : 'Otoño';
  grid[44][1] = autumnDeg;
  grid[44][2] = months[9];
  grid[44][3] = Number(radOptEst[9].toFixed(8));

  grid[45][2] = months[10];
  grid[45][3] = Number(radOptEst[10].toFixed(8));

  grid[46][2] = 'MEDIA(Oto)';
  grid[46][3] = Number(((radOptEst[8] + radOptEst[9] + radOptEst[10]) / 3).toFixed(8));

  // =========================================================================
  // PARTE III: FIGURA 5.2.92 (Rows 49 to 64, Index 48 to 63)
  // =========================================================================
  grid[48][0] = isEn ? 'SUMMARY' : 'RESUMEN';
  grid[48][4] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[48][5] = isEn ? 'Relative to:' : 'Respecto a:';

  grid[49][5] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[49][7] = isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual';

  grid[50][2] = `${compSym}(${isEn ? 'Opt' : 'Ópt'})`;
  grid[50][3] = 'Temp.(ºC)';
  grid[50][5] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
  grid[50][6] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  grid[50][7] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
  grid[50][8] = isEn ? 'Gain(%)' : 'Ganancia(%)';

  const tempVals = res.temperatures.ambient.monthlyMeanC;
  const gana0FactorList: number[] = [];
  const gana0PctList: number[] = [];
  const ganaAnuFactorList: number[] = [];
  const ganaAnuPctList: number[] = [];

  // Monthly values from Enero (0) to Diciembre (11)
  for (let m = 0; m < 12; m++) {
    const rowIdx = 51 + m;
    const gOpt = radOptEst[m];
    const g0 = rad0[m];
    const gAnu = radOptAnu[m];
    const tVal = tempVals[m];

    grid[rowIdx][0] = months[m];
    grid[rowIdx][2] = Number(gOpt.toFixed(8));
    grid[rowIdx][3] = Number(tVal.toFixed(1));

    // Gains vs Horizontal
    if (isAlbedo) {
      grid[rowIdx][5] = '-';
      grid[rowIdx][6] = '-';
    } else {
      const fact0 = g0 > 0 ? gOpt / g0 : 1;
      const pct0 = g0 > 0 ? ((gOpt - g0) / g0) * 100 : 0;
      grid[rowIdx][5] = Number(fact0.toFixed(8));
      grid[rowIdx][6] = Number(pct0.toFixed(8));
      gana0FactorList.push(fact0);
      gana0PctList.push(pct0);
    }

    // Gains vs Annual Optimum
    const factAnu = gAnu > 0 ? gOpt / gAnu : 1;
    const pctAnu = gAnu > 0 ? ((gOpt - gAnu) / gAnu) * 100 : 0;
    grid[rowIdx][7] = Number(factAnu.toFixed(8));
    grid[rowIdx][8] = Number(pctAnu.toFixed(8));
    ganaAnuFactorList.push(factAnu);
    ganaAnuPctList.push(pctAnu);
  }

  // Row 64 (Index 63): MEDIA row in Resumen
  const meanOptEst = radOptEst.reduce((a, b) => a + b, 0) / 12;
  const meanTemp = tempVals.reduce((a, b) => a + b, 0) / 12;

  grid[63][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[63][2] = Number(meanOptEst.toFixed(8));
  grid[63][3] = Number(meanTemp.toFixed(8));

  if (isAlbedo) {
    grid[63][5] = '-';
    grid[63][6] = '-';
  } else {
    grid[63][5] = Number((gana0FactorList.reduce((a, b) => a + b, 0) / 12).toFixed(8));
    grid[63][6] = Number((gana0PctList.reduce((a, b) => a + b, 0) / 12).toFixed(8));
  }

  grid[63][7] = Number((ganaAnuFactorList.reduce((a, b) => a + b, 0) / 12).toFixed(8));
  grid[63][8] = Number((ganaAnuPctList.reduce((a, b) => a + b, 0) / 12).toFixed(8));

  return grid;
}

export interface ExportSeasonalWorkbookOptions {
  activeComponent?: TableRadiationComponent;
  exportMode?: 'single' | 'all';
  isEn?: boolean;
  peakPowerKw?: number;
  tonc?: number;
}

/**
 * Exports complete Excel workbook with Figures 5.2.90, 5.2.91, 5.2.92 + Osterwald Energy Yield sheet.
 */
export async function exportSeasonalExcelWorkbook(
  res: SolarBridgeSimulationResult,
  options: ExportSeasonalWorkbookOptions = {}
): Promise<void> {
  const isEn = options.isEn ?? false;
  const mode = options.exportMode ?? 'single';
  const activeComp = options.activeComponent ?? 'global';
  const peakKw = options.peakPowerKw ?? 5.0;
  const tonc = options.tonc ?? 47.0;

  const wb = XLSX.utils.book_new();

  if (mode === 'all') {
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
    const data = buildSeasonalComponentSheet(res, activeComp, isEn);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const sheetName =
      activeComp === 'global'
        ? (isEn ? 'Sheet1_Global' : 'Hoja1_Global')
        : activeComp === 'beam'
        ? (isEn ? 'Sheet2_Direct' : 'Hoja2_Directa')
        : activeComp === 'diffuse'
        ? (isEn ? 'Sheet3_Diffuse' : 'Hoja3_Difusa')
        : (isEn ? 'Sheet4_Albedo' : 'Hoja4_Albedo');
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // Pestaña dedicada a la Energía Generada según Figura 5.2.82 de OrientSol 3.0
  const energyWs = createEnergyWorksheet(res, {
    studyTitle: isEn ? 'Seasonal optimal tilt' : 'Inclinación óptima estacional',
    studyDailyRad: res.seasonal.monthlyDailyKwh,
    isEn,
    peakPowerKw: peakKw,
    tonc,
  });
  XLSX.utils.book_append_sheet(wb, energyWs, isEn ? 'Energy_Yield' : 'Energia_Generada');

  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_OptEstacional_${cleanLoc}.xlsx`;

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
