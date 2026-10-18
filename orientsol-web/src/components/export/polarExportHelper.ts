import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle, type TableRadiationComponent } from '@/components/climate/OptimalAnnualStudyPanel';
import { exportOrientSolMasterExcel } from '@/components/export/masterExportService';
import { sanitizeForSpreadsheet } from '@/utils/security';

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
 * - Figura 5.2.96: Datos exportados de radiación para el seguimiento a un eje polar (I/II)
 * - Figura 5.2.97: Datos exportados de radiación para el seguimiento a un eje polar (II/II)
 * (MATLAB Tabla_EjePolar.m / Ganancias_Gd_Polar.m en OrientSol 3.0 TFM)
 */
export function buildPolarComponentSheet(
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
      : (isEn ? 'ALBEDO' : 'DE ALBEDO');

  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const isAlbedo = comp === 'albedo';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;

  // Radiation vectors for the active component
  // 1. Horizontal Plane 0°
  const rad0: number[] = comp === 'global'
    ? res.horizontal.gdm0
    : comp === 'beam'
    ? res.horizontal.bdm0
    : comp === 'diffuse'
    ? res.horizontal.ddm0
    : new Array(12).fill(0.0);

  // 2. Polar Axis Tracking
  const polarComps = res.tracking.polarAxis.components;
  const radPolar: number[] = polarComps
    ? (polarComps[comp as keyof typeof polarComps] || res.tracking.polarAxis.monthlyDailyKwh)
    : res.tracking.polarAxis.monthlyDailyKwh;

  // 3. Targets for Gains:
  // - Annual optimal tilt
  const annualOptDeg = res.optimalAnnual.optimalTiltDeg;
  const radAnnualOpt: number[] = getMonthlyRadiationForAngle(res, comp, annualOptDeg);

  // - Seasonal optimal tilt
  const winterDeg = res.seasonal.winterTiltDeg;
  const springDeg = res.seasonal.springTiltDeg;
  const summerDeg = res.seasonal.summerTiltDeg;
  const autumnDeg = res.seasonal.autumnTiltDeg;

  const radWinter = getMonthlyRadiationForAngle(res, comp, winterDeg);
  const radSpring = getMonthlyRadiationForAngle(res, comp, springDeg);
  const radSummer = getMonthlyRadiationForAngle(res, comp, summerDeg);
  const radAutumn = getMonthlyRadiationForAngle(res, comp, autumnDeg);

  // In OrientSol 3.0 (Ganancias_Gd_Polar.m):
  // Diciembre = Inv(1) [idx 11], Enero = Inv(2) [idx 0], Febrero = Inv(3) [idx 1]
  // Marzo = Pri(1) [idx 2], Abril = Pri(2) [idx 3], Mayo = Pri(3) [idx 4]
  // Junio = Ver(1) [idx 5], Julio = Ver(2) [idx 6], Agosto = Ver(3) [idx 7]
  // Septiembre = Oto(1) [idx 8], Octubre = Oto(2) [idx 9], Noviembre = Oto(3) [idx 10]
  const radSeasonalOpt: number[] = [
    radWinter[0],   // Ene
    radWinter[1],   // Feb
    radSpring[2],   // Mar
    radSpring[3],   // Abr
    radSpring[4],   // May
    radSummer[5],   // Jun
    radSummer[6],   // Jul
    radSummer[7],   // Ago
    radAutumn[8],   // Sep
    radAutumn[9],   // Oct
    radAutumn[10],  // Nov
    radWinter[11],  // Dic
  ];

  // - Azimuthal axis tracking
  const azimComps = res.tracking.azimuthalAxis.components;
  const radAzim: number[] = azimComps
    ? (azimComps[comp as keyof typeof azimComps] || res.tracking.azimuthalAxis.monthlyDailyKwh)
    : res.tracking.azimuthalAxis.monthlyDailyKwh;

  // - Horizontal axis tracking
  const horizTrackComps = res.tracking.horizontalAxis.components;
  const radHorizTrack: number[] = horizTrackComps
    ? (horizTrackComps[comp as keyof typeof horizTrackComps] || res.tracking.horizontalAxis.monthlyDailyKwh)
    : res.tracking.horizontalAxis.monthlyDailyKwh;

  // Temperature
  const tempMean: number[] = res.temperatures.ambient.monthlyMeanC;

  // Initialize empty grid 36 rows x 110 columns to accommodate angle sweep (1º to 90º)
  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 35; r++) {
    grid[r] = new Array(110).fill('');
  }

  // =========================================================================
  // PARTE I: FIGURA 5.2.96 (Rows 1 to 17, Index 0 to 16)
  // =========================================================================
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedDateTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // Row 1 (Index 0): Jaén | Latitud | 37,7655556 | | Seguimiento a un eje polar | | Timestamp
  grid[0][0] = sanitizeForSpreadsheet(res.locationName || (isEn ? 'Location' : 'Localidad'));
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = res.latitude != null ? res.latitude : 0;
  grid[0][4] = isEn ? 'Polar single-axis tracking' : 'Seguimiento a un eje polar';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Row 3 (Index 2): RADIACIÓN GLOBAL DIARIA (kWh/m²/día) | TEMPERATURA
  grid[2][1] = isEn
    ? `DAILY ${compLabel} RADIATION (kWh/m²/day)`
    : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;
  grid[2][5] = isEn ? 'TEMPERATURE' : 'TEMPERATURA';

  // Row 4 (Index 3): Gdm(0º) | Gdm(Seg. a un eje polar) | Temp.(ºC)
  grid[3][1] = `${compSym}(0º)`;
  grid[3][2] = `${compSym}(${isEn ? 'Polar track' : 'Seg. a un eje polar'})`;
  grid[3][5] = isEn ? 'Temp.(ºC)' : 'Temp.(ºC)';

  // Rows 5 to 16 (Index 4 to 15): Months
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = rad0[m];
    grid[rowIdx][2] = radPolar[m];
    grid[rowIdx][5] = tempMean[m];
  }

  // Row 17 (Index 16): MEDIA
  grid[16][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[16][1] = rad0.reduce((a, b) => a + b, 0) / 12;
  grid[16][2] = radPolar.reduce((a, b) => a + b, 0) / 12;
  grid[16][5] = tempMean.reduce((a, b) => a + b, 0) / 12;

  // Barrido continuo de ángulos 1º a 90º
  const angles91Data: number[][] = [];
  for (let deg = 0; deg <= 90; deg++) {
    angles91Data.push(getMonthlyRadiationForAngle(res, comp, deg));
  }
  const meanOf = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

  for (let deg = 1; deg <= 90; deg++) {
    const colIdx = 5 + deg;
    grid[3][colIdx] = `${compSym}(${deg}º)`;
  }
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    for (let deg = 1; deg <= 90; deg++) {
      const colIdx = 5 + deg;
      grid[rowIdx][colIdx] = Number(angles91Data[deg][m].toFixed(8));
    }
  }
  for (let deg = 1; deg <= 90; deg++) {
    const colIdx = 5 + deg;
    grid[16][colIdx] = Number(meanOf(angles91Data[deg]).toFixed(8));
  }

  // =========================================================================
  // PARTE II: FIGURA 5.2.97 (Rows 19 to 35, Index 18 to 34)
  // =========================================================================
  // Row 19 (Index 18): GANANCIAS
  grid[18][1] = isEn ? 'GAINS' : 'GANANCIAS';

  // Row 20 (Index 19): Respecto a:
  grid[19][1] = isEn ? 'Respect to:' : 'Respecto a:';

  // Row 21 (Index 20): Subheaders
  grid[20][1] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[20][4] = isEn ? 'Optimal annual tilt' : 'Inclinación óptima anual';
  grid[20][7] = isEn ? 'Optimal seasonal tilt' : 'Incl.  óptima estacional';
  grid[20][10] = isEn ? 'Azimuthal tracking' : 'Seg. a un eje azimutal';
  grid[20][13] = isEn ? 'Horizontal tracking' : 'Seg. a un eje horizontal';

  // Row 22 (Index 21): Fc.Ganancia | Ganancia(%)
  grid[21][1] = isEn ? 'Gain.Fact' : 'Fc.Ganancia';
  grid[21][2] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  grid[21][4] = isEn ? 'Gain.Fact' : 'Fc.Ganancia';
  grid[21][5] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  grid[21][7] = isEn ? 'Gain.Fact' : 'Fc.Ganancia';
  grid[21][8] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  grid[21][10] = isEn ? 'Gain.Fact' : 'Fc.Ganancia';
  grid[21][11] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  grid[21][13] = isEn ? 'Gain.Fact' : 'Fc.Ganancia';
  grid[21][14] = isEn ? 'Gain(%)' : 'Ganancia(%)';

  // Arrays to accumulate values for the MEDIA row
  const gana0Fact: number[] = [];
  const gana0Pct: number[] = [];
  const ganaAnuFact: number[] = [];
  const ganaAnuPct: number[] = [];
  const ganaEstFact: number[] = [];
  const ganaEstPct: number[] = [];
  const ganaAziFact: number[] = [];
  const ganaAziPct: number[] = [];
  const ganaHorFact: number[] = [];
  const ganaHorPct: number[] = [];

  // Rows 23 to 34 (Index 22 to 33): Monthly Gains
  for (let m = 0; m < 12; m++) {
    const rowIdx = 22 + m;
    grid[rowIdx][0] = months[m];

    const p = radPolar[m];

    // 1. Plano horizontal
    if (isAlbedo) {
      grid[rowIdx][1] = '-';
      grid[rowIdx][2] = '-';
    } else {
      const g0 = rad0[m];
      const fact = g0 > 0 ? p / g0 : 1;
      const pct = g0 > 0 ? ((p / g0) - 1) * 100 : 0;
      grid[rowIdx][1] = fact;
      grid[rowIdx][2] = pct;
      gana0Fact.push(fact);
      gana0Pct.push(pct);
    }

    // 2. Inclinación óptima anual
    const gAnu = radAnnualOpt[m];
    if (gAnu > 0) {
      const fact = p / gAnu;
      const pct = ((p / gAnu) - 1) * 100;
      grid[rowIdx][4] = fact;
      grid[rowIdx][5] = pct;
      ganaAnuFact.push(fact);
      ganaAnuPct.push(pct);
    } else {
      grid[rowIdx][4] = '-';
      grid[rowIdx][5] = '-';
    }

    // 3. Incl. óptima estacional
    const gEst = radSeasonalOpt[m];
    if (gEst > 0) {
      const fact = p / gEst;
      const pct = ((p / gEst) - 1) * 100;
      grid[rowIdx][7] = fact;
      grid[rowIdx][8] = pct;
      ganaEstFact.push(fact);
      ganaEstPct.push(pct);
    } else {
      grid[rowIdx][7] = '-';
      grid[rowIdx][8] = '-';
    }

    // 4. Seg. a un eje azimutal
    const gAzi = radAzim[m];
    if (gAzi > 0) {
      const fact = p / gAzi;
      const pct = ((p / gAzi) - 1) * 100;
      grid[rowIdx][10] = fact;
      grid[rowIdx][11] = pct;
      ganaAziFact.push(fact);
      ganaAziPct.push(pct);
    } else {
      grid[rowIdx][10] = '-';
      grid[rowIdx][11] = '-';
    }

    // 5. Seg. a un eje horizontal
    const gHor = radHorizTrack[m];
    if (gHor > 0) {
      const fact = p / gHor;
      const pct = ((p / gHor) - 1) * 100;
      grid[rowIdx][13] = fact;
      grid[rowIdx][14] = pct;
      ganaHorFact.push(fact);
      ganaHorPct.push(pct);
    } else {
      grid[rowIdx][13] = '-';
      grid[rowIdx][14] = '-';
    }
  }

  // Row 35 (Index 34): MEDIA row in Ganancias
  grid[34][0] = isEn ? 'MEAN' : 'MEDIA';

  if (isAlbedo) {
    grid[34][1] = '-';
    grid[34][2] = '-';
  } else {
    grid[34][1] = gana0Fact.reduce((a, b) => a + b, 0) / 12;
    grid[34][2] = gana0Pct.reduce((a, b) => a + b, 0) / 12;
  }

  if (ganaAnuFact.length === 12) {
    grid[34][4] = ganaAnuFact.reduce((a, b) => a + b, 0) / 12;
    grid[34][5] = ganaAnuPct.reduce((a, b) => a + b, 0) / 12;
  } else {
    grid[34][4] = '-';
    grid[34][5] = '-';
  }

  if (ganaEstFact.length === 12) {
    grid[34][7] = ganaEstFact.reduce((a, b) => a + b, 0) / 12;
    grid[34][8] = ganaEstPct.reduce((a, b) => a + b, 0) / 12;
  } else {
    grid[34][7] = '-';
    grid[34][8] = '-';
  }

  if (ganaAziFact.length === 12) {
    grid[34][10] = ganaAziFact.reduce((a, b) => a + b, 0) / 12;
    grid[34][11] = ganaAziPct.reduce((a, b) => a + b, 0) / 12;
  } else {
    grid[34][10] = '-';
    grid[34][11] = '-';
  }

  if (ganaHorFact.length === 12) {
    grid[34][13] = ganaHorFact.reduce((a, b) => a + b, 0) / 12;
    grid[34][14] = ganaHorPct.reduce((a, b) => a + b, 0) / 12;
  } else {
    grid[34][13] = '-';
    grid[34][14] = '-';
  }

  return grid;
}

export interface PolarExportOptions {
  activeComponent: TableRadiationComponent;
  exportMode: 'single' | 'all';
  isEn?: boolean;
  peakPowerKw?: number;
  tonc?: number;
}

/**
 * Creates and downloads the Excel workbook for Polar Single-Axis Tracking with master formatting.
 */
export async function exportPolarExcelWorkbook(
  res: SolarBridgeSimulationResult,
  options: PolarExportOptions
): Promise<void> {
  exportOrientSolMasterExcel(res, {
    activeStudyOp: 'polar',
    activeComponent: options.activeComponent,
    exportMode: options.exportMode,
    isEn: options.isEn,
    peakPowerKw: options.peakPowerKw,
    tonc: options.tonc,
  });
}

