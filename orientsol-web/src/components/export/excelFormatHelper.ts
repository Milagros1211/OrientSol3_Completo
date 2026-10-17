import * as XLSX from 'xlsx-js-style';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle, type TableRadiationComponent } from '@/components/climate/OptimalAnnualStudyPanel';
import { sanitizeForSpreadsheet } from '@/utils/security';
import { formatNum, formatInt } from '@/utils/formatters';

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Returns formatted timestamp strings for filename and cell headers.
 */
export function getExportFileTimestamp(): { fileTimestamp: string; formattedDateTime: string; isoTimestamp: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return {
    fileTimestamp: `${year}${month}${day}_${hours}${minutes}${seconds}`,
    formattedDateTime: `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    isoTimestamp: now.toISOString(),
  };
}

/**
 * Returns the standardized Excel filename conforming to:
 * OrientSol_[OPERACION]_[EMPLAZAMIENTO]_[COMPONENTE]_[TIMESTAMP].xlsx
 */
export function getStandardizedExcelFilename(
  opKey: string,
  locationName: string,
  compSuffix?: string,
  timestamp?: string
): string {
  const fileTimestamp = timestamp || getExportFileTimestamp().fileTimestamp;
  const cleanLoc = (locationName || 'Localidad').replace(/[^a-zA-Z0-9_-]/g, '_');

  const opTitles: Record<string, string> = {
    annual: 'OptAnual',
    monthly: 'OptMensual',
    seasonal: 'OptEstacional',
    polar: 'EjePolar',
    azimuthal: 'EjeAzimutal',
    horizontal: 'EjeHorizontal',
    dual: '2Ejes',
    comparative: 'Comparativa',
  };

  const opName = opTitles[opKey] || opKey.toUpperCase();
  const suffix = compSuffix ? `_${compSuffix}` : '';
  return `OrientSol_${opName}_${cleanLoc}${suffix}_${fileTimestamp}.xlsx`;
}

const MONTHS_LOWER = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

/**
 * Applies European / Spanish number formatting (comma decimal and dot thousands),
 * wrapped text, center alignment (middle and center), bold styling to non-data headers,
 * and auto-adjusts column widths and row heights.
 */
export function applySpanishNumberFormattingToWorksheet(ws: XLSX.WorkSheet): void {
  const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : null;
  const colWidths: number[] = [];

  for (const cellAddress in ws) {
    if (cellAddress.startsWith('!')) continue;
    const cell = (ws as any)[cellAddress];
    if (!cell) continue;

    const decoded = XLSX.utils.decode_cell(cellAddress);
    const r = decoded.r;
    const c = decoded.c;

    let isHeader = false;
    let textLen = 0;

    if (cell.t === 'n' && typeof cell.v === 'number') {
      if (Number.isInteger(cell.v)) {
        cell.z = '#,##0';
        cell.w = formatInt(cell.v);
      } else {
        const valStr = cell.v.toString();
        const parts = valStr.split('.');
        const decCount = parts.length > 1 ? Math.min(parts[1].length, 8) : 2;
        const zeros = '0'.repeat(Math.max(1, Math.min(decCount, 4)));
        cell.z = `#,##0.${zeros}`;
        cell.w = formatNum(cell.v, decCount, true);
      }
      textLen = cell.w ? cell.w.length : String(cell.v).length;
    } else if (cell.t === 's' && typeof cell.v === 'string') {
      const trimmed = cell.v.trim();
      textLen = trimmed.length;

      // Replace decimal dot in numeric patterns like "37.7656°", "80.0%", "4.52 kWh", etc.
      cell.v = cell.v.replace(/(\d+)\.(\d+)(%|°|\s*kWh|\s*kWp|\s*ms|)/g, (match: string, p1: string, p2: string, suffix: string) => {
        if (match.includes('/') || match.includes('-')) return match;
        return `${p1},${p2}${suffix}`;
      });

      const lower = trimmed.toLowerCase();
      const isMonth = MONTHS_LOWER.includes(lower);

      // Identify whether this string cell is a header, title, label or non-data text
      if (
        r === 0 || // Top title row
        r === 1 || // Metadata row
        r === 2 || // Subtitle / section row
        r === 3 || // Column headers
        r === 16 || // MEDIA / ANUAL row
        r === 18 || // GANANCIAS title
        r === 19 || // Subtitle
        r === 20 || // Model headers
        r === 21 || // Gain Factor / Gain(%) headers
        (c === 0 && !isMonth) || // First column labels (unless it is a data month name)
        lower.startsWith('orientsol') ||
        lower.startsWith('datos') ||
        lower.startsWith('resumen') ||
        lower.startsWith('balance') ||
        lower.startsWith('parámetros') ||
        lower.startsWith('parametros') ||
        lower.startsWith('punto') ||
        lower.startsWith('exigencias') ||
        lower.startsWith('cuadrícula') ||
        lower.startsWith('cuadricula') ||
        lower.startsWith('ranking') ||
        lower.startsWith('comparativa') ||
        lower.startsWith('límite') ||
        lower.startsWith('limite') ||
        lower.startsWith('sample') ||
        lower.startsWith('criterio') ||
        lower.startsWith('estudio') ||
        lower.includes('registro') ||
        lower.includes('marca temporal') ||
        lower.includes('timestamp') ||
        lower.includes('radiación') ||
        lower.includes('radiacion') ||
        lower.includes('temperatura') ||
        lower.includes('ganancia') ||
        lower.includes('pérdida') ||
        lower.includes('perdida') ||
        lower.includes('topología') ||
        lower.includes('topologia') ||
        lower.includes('superficie') ||
        lower.includes('óptim') ||
        lower.includes('optim') ||
        lower.includes('factor') ||
        lower.includes('producción') ||
        lower.includes('produccion') ||
        lower.includes('inclin') ||
        lower.includes('azimut') ||
        lower.includes('rendimiento') ||
        lower.includes('cumplimiento') ||
        lower.includes('conforme') ||
        lower.includes('fuera de norma') ||
        lower.includes('compliant') ||
        lower.includes('non-compliant')
      ) {
        isHeader = true;
      }
    }

    // Apply wrapped text, center alignment (both horizontally and vertically), and bold font for headers
    cell.s = {
      font: {
        name: 'Calibri',
        sz: isHeader && (r === 0 || r === 2) ? 11 : 10,
        bold: isHeader,
        color: { rgb: '000000' },
      },
      alignment: {
        wrapText: true,
        vertical: 'center',
        horizontal: 'center',
      },
    };

    if (c >= colWidths.length) {
      colWidths[c] = Math.max(12, Math.min(textLen + 3, 50));
    } else {
      colWidths[c] = Math.max(colWidths[c], Math.min(textLen + 3, 50));
    }
  }

  // Set !cols auto-fit
  if (range) {
    const finalCols = [];
    for (let c = 0; c <= range.e.c; c++) {
      const w = colWidths[c] || 12;
      finalCols.push({ wch: Math.max(w, 12) });
    }
    ws['!cols'] = finalCols;

    // Set !rows heights
    const finalRows = [];
    for (let r = 0; r <= range.e.r; r++) {
      if (r === 0) {
        finalRows.push({ hpt: 26 });
      } else if (r === 2 || r === 3 || r === 18 || r === 20 || r === 21) {
        finalRows.push({ hpt: 24 });
      } else {
        finalRows.push({ hpt: 19 });
      }
    }
    ws['!rows'] = finalRows;
  }
}

/**
 * Extracts and prepares all radiation reference vectors for a given component.
 */
function getStudyReferences(res: SolarBridgeSimulationResult, comp: TableRadiationComponent) {
  const isAlbedo = comp === 'albedo';
  const rad0: number[] = comp === 'global'
    ? res.horizontal.gdm0
    : comp === 'beam'
    ? res.horizontal.bdm0
    : comp === 'diffuse'
    ? res.horizontal.ddm0
    : new Array(12).fill(0.0);

  const annualOptDeg = res.optimalAnnual.optimalTiltDeg;
  const radAnnualOpt = getMonthlyRadiationForAngle(res, comp, annualOptDeg);

  const winterDeg = res.seasonal.winterTiltDeg;
  const springDeg = res.seasonal.springTiltDeg;
  const summerDeg = res.seasonal.summerTiltDeg;
  const autumnDeg = res.seasonal.autumnTiltDeg;

  const radWinter = getMonthlyRadiationForAngle(res, comp, winterDeg);
  const radSpring = getMonthlyRadiationForAngle(res, comp, springDeg);
  const radSummer = getMonthlyRadiationForAngle(res, comp, summerDeg);
  const radAutumn = getMonthlyRadiationForAngle(res, comp, autumnDeg);

  const radSeasonalOpt = [
    radWinter[0], radWinter[1], radSpring[2], radSpring[3], radSpring[4],
    radSummer[5], radSummer[6], radSummer[7], radAutumn[8], radAutumn[9],
    radAutumn[10], radWinter[11]
  ];

  const getCompTrack = (axis: { monthlyDailyKwh: number[]; components?: { global?: number[]; beam?: number[]; diffuse?: number[]; albedo?: number[] } }) => {
    if (comp === 'global') return axis.monthlyDailyKwh;
    if (axis.components && axis.components[comp]) return axis.components[comp]!;
    if (isAlbedo) return new Array(12).fill(0.0);
    const fallbackRatio = res.horizontal.gdm0.map((g0, i) => (g0 > 0 ? rad0[i] / g0 : 1));
    return axis.monthlyDailyKwh.map((val, i) => val * fallbackRatio[i]);
  };

  const radPolar = getCompTrack(res.tracking.polarAxis);
  const radAzim = getCompTrack(res.tracking.azimuthalAxis);
  const radHoriz = getCompTrack(res.tracking.horizontalAxis);
  const radDual = getCompTrack(res.tracking.dualAxis);

  return {
    isAlbedo,
    rad0,
    radAnnualOpt,
    radSeasonalOpt,
    radPolar,
    radAzim,
    radHoriz,
    radDual,
    tempMean: res.temperatures.ambient.monthlyMeanC,
  };
}

/**
 * Appends continuous tilt angle sweep columns (1º to 90º) into the component worksheet grid,
 * matching the MATLAB sweep structure for each month and annual media across all exportables.
 */
function fillTiltSweepColumns(
  grid: (string | number)[][],
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  compSym: string,
  startCol: number
): void {
  const angles91Data: number[][] = [];
  for (let deg = 0; deg <= 90; deg++) {
    angles91Data.push(getMonthlyRadiationForAngle(res, comp, deg));
  }
  const meanOf = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

  // Headers: Gdm(1º) .. Gdm(90º) at row 3 (Index 3, Row 4 in Excel)
  for (let deg = 1; deg <= 90; deg++) {
    const colIdx = startCol + deg - 1;
    grid[3][colIdx] = `${compSym}(${deg}º)`;
  }

  // 12 Months: rows 4..15 (Index 4..15, Rows 5..16 in Excel)
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    for (let deg = 1; deg <= 90; deg++) {
      const colIdx = startCol + deg - 1;
      grid[rowIdx][colIdx] = Number(angles91Data[deg][m].toFixed(8));
    }
  }

  // MEDIA: row 16 (Index 16, Row 17 in Excel)
  for (let deg = 1; deg <= 90; deg++) {
    const colIdx = startCol + deg - 1;
    grid[16][colIdx] = Number(meanOf(angles91Data[deg]).toFixed(8));
  }
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * MATLAB Tabla_OptAnual.m (Figura 5.2.68)
 */
export function buildAnnualComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
  const isAlbedo = comp === 'albedo';
  const compLabel = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const compTitle = comp === 'global'
    ? (isEn ? 'DAILY GLOBAL RADIATION (kWh/m²/day)' : 'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)')
    : comp === 'beam'
    ? (isEn ? 'DAILY DIRECT RADIATION (kWh/m²/day)' : 'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)')
    : comp === 'diffuse'
    ? (isEn ? 'DAILY DIFFUSE RADIATION (kWh/m²/day)' : 'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)')
    : (isEn ? 'DAILY ALBEDO RADIATION (kWh/m²/day)' : 'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)');

  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const tempVals = res.temperatures.ambient.monthlyMeanC;

  const angles91Data: number[][] = [];
  for (let deg = 0; deg <= 90; deg++) {
    angles91Data.push(getMonthlyRadiationForAngle(res, comp, deg));
  }

  const rad0 = angles91Data[0];
  const radOpt = getMonthlyRadiationForAngle(res, comp, optAngle);

  const meanOf = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const meanOpt = meanOf(radOpt);
  const meanTemp = meanOf(tempVals);

  const sheetData: (string | number)[][] = [];

  // Fila 1: Cabecera
  sheetData.push([
    sanitizeForSpreadsheet(res.locationName),
    isEn ? 'Latitude' : 'Latitud',
    Number(res.latitude.toFixed(7)),
    '',
    isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual',
    '',
    optAngle,
  ]);

  // Fila 2: Vacía
  sheetData.push([]);

  // Fila 3: Título del bloque de radiación en Col B
  sheetData.push(['', compTitle]);

  // Fila 4: Cabecera de columnas 0º a 90º
  const angleHeaders: string[] = [''];
  for (let deg = 0; deg <= 90; deg++) {
    angleHeaders.push(`${compLabel}(${deg}º)`);
  }
  sheetData.push(angleHeaders);

  // Filas 5 a 16: 12 Meses
  for (let m = 0; m < 12; m++) {
    const rowVals: (string | number)[] = [months[m]];
    for (let deg = 0; deg <= 90; deg++) {
      rowVals.push(Number(angles91Data[deg][m].toFixed(8)));
    }
    sheetData.push(rowVals);
  }

  // Fila 17: MEDIA
  const mediaRow: (string | number)[] = [isEn ? 'MEAN' : 'MEDIA'];
  for (let deg = 0; deg <= 90; deg++) {
    mediaRow.push(Number(meanOf(angles91Data[deg]).toFixed(8)));
  }
  sheetData.push(mediaRow);

  // Fila 18: Vacía
  sheetData.push([]);

  // Fila 19: GANANCIAS
  sheetData.push([
    '', '', '', '',
    isEn ? 'GAINS' : 'GANANCIAS',
    isEn ? 'Respect to:' : 'Respecto a:'
  ]);

  // Fila 20: Plano horizontal
  sheetData.push(['', '', '', '', '', isEn ? 'Horizontal plane' : 'Plano horizontal']);

  // Fila 21: Subcabeceras
  sheetData.push([
    '',
    isEn ? `${compLabel}(Opt.)` : `${compLabel}(Ópt.)`,
    isEn ? 'Temp.(°C)' : 'Temp.(ºC)',
    '', '',
    isEn ? 'Gain Factor' : 'Fc.Ganancia',
    isEn ? 'Gain(%)' : 'Ganancia(%)'
  ]);

  const factorList: number[] = [];
  const pctList: number[] = [];

  // Filas 22 a 33: 12 Meses
  for (let m = 0; m < 12; m++) {
    const g0 = rad0[m];
    const gOpt = radOpt[m];
    const fact = isAlbedo ? 1 : (g0 > 0 ? gOpt / g0 : 1);
    const pct = isAlbedo ? 0 : (g0 > 0 ? ((gOpt / g0) - 1) * 100 : 0);
    factorList.push(fact);
    pctList.push(pct);

    sheetData.push([
      months[m],
      Number(gOpt.toFixed(8)),
      Number(tempVals[m].toFixed(1)),
      '', '',
      isAlbedo ? '-' : Number(fact.toFixed(8)),
      isAlbedo ? '-' : Number(pct.toFixed(7)),
    ]);
  }

  // Fila 34: MEDIA
  sheetData.push([
    isEn ? 'MEAN' : 'MEDIA',
    Number(meanOpt.toFixed(8)),
    Number(meanTemp.toFixed(1)),
    '', '',
    isAlbedo ? '-' : Number(meanOf(factorList).toFixed(8)),
    isAlbedo ? '-' : Number(meanOf(pctList).toFixed(7)),
  ]);

  return sheetData;
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * MATLAB Tabla_EjeAzimutal.m
 */
export function buildAzimuthalComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
  const compLabel = comp === 'global' ? 'GLOBAL' : comp === 'beam' ? 'DIRECTA' : comp === 'diffuse' ? 'DIFUSA' : 'ALBEDO';
  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const refs = getStudyReferences(res, comp);

  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 35; r++) {
    grid[r] = new Array(110).fill('');
  }

  const { formattedDateTime } = getExportFileTimestamp();

  // Fila 1: Cabecera
  grid[0][0] = sanitizeForSpreadsheet(res.locationName);
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = Number(res.latitude.toFixed(7));
  grid[0][4] = isEn ? 'Azimuthal single-axis tracking' : 'Seguimiento a un eje azimutal';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Fila 3: RADIACIÓN GLOBAL DIARIA | TEMPERATURA
  grid[2][1] = isEn ? `DAILY ${compLabel} RADIATION (kWh/m²/day)` : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;
  grid[2][5] = isEn ? 'TEMPERATURE' : 'TEMPERATURA';

  // Fila 4: Gdm(0º) | Gdm(Seg. a un eje azimutal) | Temp.(ºC)
  grid[3][1] = `${compSym}(0º)`;
  grid[3][2] = `${compSym}(${isEn ? 'Azimuthal track' : 'Seg. a un eje azimutal'})`;
  grid[3][5] = 'Temp.(ºC)';

  // Filas 5 a 16: Meses
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = Number(refs.rad0[m].toFixed(8));
    grid[rowIdx][2] = Number(refs.radAzim[m].toFixed(8));
    grid[rowIdx][5] = Number(refs.tempMean[m].toFixed(1));
  }

  // Fila 17: MEDIA
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  grid[16][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[16][1] = Number(avg(refs.rad0).toFixed(8));
  grid[16][2] = Number(avg(refs.radAzim).toFixed(8));
  grid[16][5] = Number(avg(refs.tempMean).toFixed(1));

  // Barrido continuo de ángulos 1º a 90º
  fillTiltSweepColumns(grid, res, comp, compSym, 6);

  // =========================================================================
  // GANANCIAS (Rows 19..35)
  // =========================================================================
  grid[18][1] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[19][1] = isEn ? 'Respect to:' : 'Respecto a:';

  grid[20][1] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[20][4] = isEn ? 'Optimal annual tilt' : 'Inclinación óptima anual';
  grid[20][7] = isEn ? 'Optimal seasonal tilt' : 'Incl.  óptima estacional';
  grid[20][10] = isEn ? 'Polar tracking' : 'Seg. a un eje polar';
  grid[20][13] = isEn ? 'Horizontal tracking' : 'Seg. a un eje horizontal';

  for (let c of [1, 4, 7, 10, 13]) {
    grid[21][c] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
    grid[21][c + 1] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  }

  const fact0: number[] = [], pct0: number[] = [];
  const factAnu: number[] = [], pctAnu: number[] = [];
  const factEst: number[] = [], pctEst: number[] = [];
  const factPol: number[] = [], pctPol: number[] = [];
  const factHor: number[] = [], pctHor: number[] = [];

  for (let m = 0; m < 12; m++) {
    const rowIdx = 22 + m;
    grid[rowIdx][0] = months[m];
    const p = refs.radAzim[m];

    // vs Plano horizontal
    if (refs.isAlbedo) {
      grid[rowIdx][1] = '-'; grid[rowIdx][2] = '-';
    } else {
      const g0 = refs.rad0[m];
      const f = g0 > 0 ? p / g0 : 1;
      const pc = g0 > 0 ? ((p / g0) - 1) * 100 : 0;
      grid[rowIdx][1] = Number(f.toFixed(8));
      grid[rowIdx][2] = Number(pc.toFixed(7));
      fact0.push(f); pct0.push(pc);
    }

    // vs Inclinación óptima anual
    const gAnu = refs.radAnnualOpt[m];
    if (gAnu > 0) {
      const f = p / gAnu; const pc = ((p / gAnu) - 1) * 100;
      grid[rowIdx][4] = Number(f.toFixed(8)); grid[rowIdx][5] = Number(pc.toFixed(7));
      factAnu.push(f); pctAnu.push(pc);
    } else { grid[rowIdx][4] = '-'; grid[rowIdx][5] = '-'; }

    // vs Inclinación óptima estacional
    const gEst = refs.radSeasonalOpt[m];
    if (gEst > 0) {
      const f = p / gEst; const pc = ((p / gEst) - 1) * 100;
      grid[rowIdx][7] = Number(f.toFixed(8)); grid[rowIdx][8] = Number(pc.toFixed(7));
      factEst.push(f); pctEst.push(pc);
    } else { grid[rowIdx][7] = '-'; grid[rowIdx][8] = '-'; }

    // vs Eje Polar
    const gPol = refs.radPolar[m];
    if (gPol > 0) {
      const f = p / gPol; const pc = ((p / gPol) - 1) * 100;
      grid[rowIdx][10] = Number(f.toFixed(8)); grid[rowIdx][11] = Number(pc.toFixed(7));
      factPol.push(f); pctPol.push(pc);
    } else { grid[rowIdx][10] = '-'; grid[rowIdx][11] = '-'; }

    // vs Eje Horizontal
    const gHor = refs.radHoriz[m];
    if (gHor > 0) {
      const f = p / gHor; const pc = ((p / gHor) - 1) * 100;
      grid[rowIdx][13] = Number(f.toFixed(8)); grid[rowIdx][14] = Number(pc.toFixed(7));
      factHor.push(f); pctHor.push(pc);
    } else { grid[rowIdx][13] = '-'; grid[rowIdx][14] = '-'; }
  }

  // Fila 35: MEDIA
  grid[34][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[34][1] = refs.isAlbedo ? '-' : Number(avg(fact0).toFixed(8));
  grid[34][2] = refs.isAlbedo ? '-' : Number(avg(pct0).toFixed(7));
  grid[34][4] = factAnu.length === 12 ? Number(avg(factAnu).toFixed(8)) : '-';
  grid[34][5] = pctAnu.length === 12 ? Number(avg(pctAnu).toFixed(7)) : '-';
  grid[34][7] = factEst.length === 12 ? Number(avg(factEst).toFixed(8)) : '-';
  grid[34][8] = pctEst.length === 12 ? Number(avg(pctEst).toFixed(7)) : '-';
  grid[34][10] = factPol.length === 12 ? Number(avg(factPol).toFixed(8)) : '-';
  grid[34][11] = pctPol.length === 12 ? Number(avg(pctPol).toFixed(7)) : '-';
  grid[34][13] = factHor.length === 12 ? Number(avg(factHor).toFixed(8)) : '-';
  grid[34][14] = pctHor.length === 12 ? Number(avg(pctHor).toFixed(7)) : '-';

  return grid;
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * MATLAB Tabla_EjeHorizontal.m
 */
export function buildHorizontalComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
  const compLabel = comp === 'global' ? 'GLOBAL' : comp === 'beam' ? 'DIRECTA' : comp === 'diffuse' ? 'DIFUSA' : 'ALBEDO';
  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const refs = getStudyReferences(res, comp);

  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 35; r++) {
    grid[r] = new Array(110).fill('');
  }

  const { formattedDateTime } = getExportFileTimestamp();

  // Fila 1: Cabecera
  grid[0][0] = sanitizeForSpreadsheet(res.locationName);
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = Number(res.latitude.toFixed(7));
  grid[0][4] = isEn ? 'Horizontal single-axis tracking' : 'Seguimiento a un eje horizontal';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Fila 3: RADIACIÓN GLOBAL DIARIA | TEMPERATURA
  grid[2][1] = isEn ? `DAILY ${compLabel} RADIATION (kWh/m²/day)` : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;
  grid[2][5] = isEn ? 'TEMPERATURE' : 'TEMPERATURA';

  // Fila 4: Gdm(0º) | Gdm(Seg. a un eje horizontal) | Temp.(ºC)
  grid[3][1] = `${compSym}(0º)`;
  grid[3][2] = `${compSym}(${isEn ? 'Horizontal track' : 'Seg. a un eje horizontal'})`;
  grid[3][5] = 'Temp.(ºC)';

  // Filas 5 a 16: Meses
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = Number(refs.rad0[m].toFixed(8));
    grid[rowIdx][2] = Number(refs.radHoriz[m].toFixed(8));
    grid[rowIdx][5] = Number(refs.tempMean[m].toFixed(1));
  }

  // Fila 17: MEDIA
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  grid[16][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[16][1] = Number(avg(refs.rad0).toFixed(8));
  grid[16][2] = Number(avg(refs.radHoriz).toFixed(8));
  grid[16][5] = Number(avg(refs.tempMean).toFixed(1));

  // Barrido continuo de ángulos 1º a 90º
  fillTiltSweepColumns(grid, res, comp, compSym, 6);

  // =========================================================================
  // GANANCIAS (Rows 19..35)
  // =========================================================================
  grid[18][1] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[19][1] = isEn ? 'Respect to:' : 'Respecto a:';

  grid[20][1] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[20][4] = isEn ? 'Optimal annual tilt' : 'Inclinación óptima anual';
  grid[20][7] = isEn ? 'Optimal seasonal tilt' : 'Incl.  óptima estacional';
  grid[20][10] = isEn ? 'Polar tracking' : 'Seg. a un eje polar';
  grid[20][13] = isEn ? 'Azimuthal tracking' : 'Seg. a un eje azimutal';

  for (let c of [1, 4, 7, 10, 13]) {
    grid[21][c] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
    grid[21][c + 1] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  }

  const fact0: number[] = [], pct0: number[] = [];
  const factAnu: number[] = [], pctAnu: number[] = [];
  const factEst: number[] = [], pctEst: number[] = [];
  const factPol: number[] = [], pctPol: number[] = [];
  const factAzi: number[] = [], pctAzi: number[] = [];

  for (let m = 0; m < 12; m++) {
    const rowIdx = 22 + m;
    grid[rowIdx][0] = months[m];
    const p = refs.radHoriz[m];

    // vs Plano horizontal
    if (refs.isAlbedo) {
      grid[rowIdx][1] = '-'; grid[rowIdx][2] = '-';
    } else {
      const g0 = refs.rad0[m];
      const f = g0 > 0 ? p / g0 : 1;
      const pc = g0 > 0 ? ((p / g0) - 1) * 100 : 0;
      grid[rowIdx][1] = Number(f.toFixed(8)); grid[rowIdx][2] = Number(pc.toFixed(7));
      fact0.push(f); pct0.push(pc);
    }

    // vs Inclinación óptima anual
    const gAnu = refs.radAnnualOpt[m];
    if (gAnu > 0) {
      const f = p / gAnu; const pc = ((p / gAnu) - 1) * 100;
      grid[rowIdx][4] = Number(f.toFixed(8)); grid[rowIdx][5] = Number(pc.toFixed(7));
      factAnu.push(f); pctAnu.push(pc);
    } else { grid[rowIdx][4] = '-'; grid[rowIdx][5] = '-'; }

    // vs Inclinación óptima estacional
    const gEst = refs.radSeasonalOpt[m];
    if (gEst > 0) {
      const f = p / gEst; const pc = ((p / gEst) - 1) * 100;
      grid[rowIdx][7] = Number(f.toFixed(8)); grid[rowIdx][8] = Number(pc.toFixed(7));
      factEst.push(f); pctEst.push(pc);
    } else { grid[rowIdx][7] = '-'; grid[rowIdx][8] = '-'; }

    // vs Eje Polar
    const gPol = refs.radPolar[m];
    if (gPol > 0) {
      const f = p / gPol; const pc = ((p / gPol) - 1) * 100;
      grid[rowIdx][10] = Number(f.toFixed(8)); grid[rowIdx][11] = Number(pc.toFixed(7));
      factPol.push(f); pctPol.push(pc);
    } else { grid[rowIdx][10] = '-'; grid[rowIdx][11] = '-'; }

    // vs Eje Azimutal
    const gAzi = refs.radAzim[m];
    if (gAzi > 0) {
      const f = p / gAzi; const pc = ((p / gAzi) - 1) * 100;
      grid[rowIdx][13] = Number(f.toFixed(8)); grid[rowIdx][14] = Number(pc.toFixed(7));
      factAzi.push(f); pctAzi.push(pc);
    } else { grid[rowIdx][13] = '-'; grid[rowIdx][14] = '-'; }
  }

  // Fila 35: MEDIA
  grid[34][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[34][1] = refs.isAlbedo ? '-' : Number(avg(fact0).toFixed(8));
  grid[34][2] = refs.isAlbedo ? '-' : Number(avg(pct0).toFixed(7));
  grid[34][4] = factAnu.length === 12 ? Number(avg(factAnu).toFixed(8)) : '-';
  grid[34][5] = pctAnu.length === 12 ? Number(avg(pctAnu).toFixed(7)) : '-';
  grid[34][7] = factEst.length === 12 ? Number(avg(factEst).toFixed(8)) : '-';
  grid[34][8] = pctEst.length === 12 ? Number(avg(pctEst).toFixed(7)) : '-';
  grid[34][10] = factPol.length === 12 ? Number(avg(factPol).toFixed(8)) : '-';
  grid[34][11] = pctPol.length === 12 ? Number(avg(pctPol).toFixed(7)) : '-';
  grid[34][13] = factAzi.length === 12 ? Number(avg(factAzi).toFixed(8)) : '-';
  grid[34][14] = pctAzi.length === 12 ? Number(avg(pctAzi).toFixed(7)) : '-';

  return grid;
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * MATLAB Tabla_2Ejes.m
 */
export function buildDualAxisComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
  const compLabel = comp === 'global' ? 'GLOBAL' : comp === 'beam' ? 'DIRECTA' : comp === 'diffuse' ? 'DIFUSA' : 'ALBEDO';
  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const refs = getStudyReferences(res, comp);

  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 35; r++) {
    grid[r] = new Array(110).fill('');
  }

  const { formattedDateTime } = getExportFileTimestamp();

  // Fila 1: Cabecera
  grid[0][0] = sanitizeForSpreadsheet(res.locationName);
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = Number(res.latitude.toFixed(7));
  grid[0][4] = isEn ? 'Two-axis tracking' : 'Seguimiento a dos ejes';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Fila 3: RADIACIÓN GLOBAL DIARIA | TEMPERATURA
  grid[2][1] = isEn ? `DAILY ${compLabel} RADIATION (kWh/m²/day)` : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;
  grid[2][5] = isEn ? 'TEMPERATURE' : 'TEMPERATURA';

  // Fila 4: Gdm(0º) | Gdm(Seg. a dos ejes) | Temp.(ºC)
  grid[3][1] = `${compSym}(0º)`;
  grid[3][2] = `${compSym}(${isEn ? 'Two-axis track' : 'Seg. a dos ejes'})`;
  grid[3][5] = 'Temp.(ºC)';

  // Filas 5 a 16: Meses
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = Number(refs.rad0[m].toFixed(8));
    grid[rowIdx][2] = Number(refs.radDual[m].toFixed(8));
    grid[rowIdx][5] = Number(refs.tempMean[m].toFixed(1));
  }

  // Fila 17: MEDIA
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  grid[16][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[16][1] = Number(avg(refs.rad0).toFixed(8));
  grid[16][2] = Number(avg(refs.radDual).toFixed(8));
  grid[16][5] = Number(avg(refs.tempMean).toFixed(1));

  // Barrido continuo de ángulos 1º a 90º
  fillTiltSweepColumns(grid, res, comp, compSym, 6);

  // =========================================================================
  // GANANCIAS (Rows 19..35)
  // =========================================================================
  grid[18][1] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[19][1] = isEn ? 'Respect to:' : 'Respecto a:';

  grid[20][1] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[20][4] = isEn ? 'Optimal annual tilt' : 'Inclinación óptima anual';
  grid[20][7] = isEn ? 'Optimal seasonal tilt' : 'Incl.  óptima estacional';
  grid[20][10] = isEn ? 'Polar tracking' : 'Seg. a un eje polar';
  grid[20][13] = isEn ? 'Azimuthal tracking' : 'Seg. a un eje azimutal';
  grid[20][16] = isEn ? 'Horizontal tracking' : 'Seg. a un eje horizontal';

  for (let c of [1, 4, 7, 10, 13, 16]) {
    grid[21][c] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
    grid[21][c + 1] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  }

  const fact0: number[] = [], pct0: number[] = [];
  const factAnu: number[] = [], pctAnu: number[] = [];
  const factEst: number[] = [], pctEst: number[] = [];
  const factPol: number[] = [], pctPol: number[] = [];
  const factAzi: number[] = [], pctAzi: number[] = [];
  const factHor: number[] = [], pctHor: number[] = [];

  for (let m = 0; m < 12; m++) {
    const rowIdx = 22 + m;
    grid[rowIdx][0] = months[m];
    const p = refs.radDual[m];

    // vs Plano horizontal
    if (refs.isAlbedo) {
      grid[rowIdx][1] = '-'; grid[rowIdx][2] = '-';
    } else {
      const g0 = refs.rad0[m];
      const f = g0 > 0 ? p / g0 : 1;
      const pc = g0 > 0 ? ((p / g0) - 1) * 100 : 0;
      grid[rowIdx][1] = Number(f.toFixed(8)); grid[rowIdx][2] = Number(pc.toFixed(7));
      fact0.push(f); pct0.push(pc);
    }

    // vs Inclinación óptima anual
    const gAnu = refs.radAnnualOpt[m];
    if (gAnu > 0) {
      const f = p / gAnu; const pc = ((p / gAnu) - 1) * 100;
      grid[rowIdx][4] = Number(f.toFixed(8)); grid[rowIdx][5] = Number(pc.toFixed(7));
      factAnu.push(f); pctAnu.push(pc);
    } else { grid[rowIdx][4] = '-'; grid[rowIdx][5] = '-'; }

    // vs Inclinación óptima estacional
    const gEst = refs.radSeasonalOpt[m];
    if (gEst > 0) {
      const f = p / gEst; const pc = ((p / gEst) - 1) * 100;
      grid[rowIdx][7] = Number(f.toFixed(8)); grid[rowIdx][8] = Number(pc.toFixed(7));
      factEst.push(f); pctEst.push(pc);
    } else { grid[rowIdx][7] = '-'; grid[rowIdx][8] = '-'; }

    // vs Eje Polar
    const gPol = refs.radPolar[m];
    if (gPol > 0) {
      const f = p / gPol; const pc = ((p / gPol) - 1) * 100;
      grid[rowIdx][10] = Number(f.toFixed(8)); grid[rowIdx][11] = Number(pc.toFixed(7));
      factPol.push(f); pctPol.push(pc);
    } else { grid[rowIdx][10] = '-'; grid[rowIdx][11] = '-'; }

    // vs Eje Azimutal
    const gAzi = refs.radAzim[m];
    if (gAzi > 0) {
      const f = p / gAzi; const pc = ((p / gAzi) - 1) * 100;
      grid[rowIdx][13] = Number(f.toFixed(8)); grid[rowIdx][14] = Number(pc.toFixed(7));
      factAzi.push(f); pctAzi.push(pc);
    } else { grid[rowIdx][13] = '-'; grid[rowIdx][14] = '-'; }

    // vs Eje Horizontal
    const gHor = refs.radHoriz[m];
    if (gHor > 0) {
      const f = p / gHor; const pc = ((p / gHor) - 1) * 100;
      grid[rowIdx][16] = Number(f.toFixed(8)); grid[rowIdx][17] = Number(pc.toFixed(7));
      factHor.push(f); pctHor.push(pc);
    } else { grid[rowIdx][16] = '-'; grid[rowIdx][17] = '-'; }
  }

  // Fila 35: MEDIA
  grid[34][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[34][1] = refs.isAlbedo ? '-' : Number(avg(fact0).toFixed(8));
  grid[34][2] = refs.isAlbedo ? '-' : Number(avg(pct0).toFixed(7));
  grid[34][4] = factAnu.length === 12 ? Number(avg(factAnu).toFixed(8)) : '-';
  grid[34][5] = pctAnu.length === 12 ? Number(avg(pctAnu).toFixed(7)) : '-';
  grid[34][7] = factEst.length === 12 ? Number(avg(factEst).toFixed(8)) : '-';
  grid[34][8] = pctEst.length === 12 ? Number(avg(pctEst).toFixed(7)) : '-';
  grid[34][10] = factPol.length === 12 ? Number(avg(factPol).toFixed(8)) : '-';
  grid[34][11] = pctPol.length === 12 ? Number(avg(pctPol).toFixed(7)) : '-';
  grid[34][13] = factAzi.length === 12 ? Number(avg(factAzi).toFixed(8)) : '-';
  grid[34][14] = pctAzi.length === 12 ? Number(avg(pctAzi).toFixed(7)) : '-';
  grid[34][16] = factHor.length === 12 ? Number(avg(factHor).toFixed(8)) : '-';
  grid[34][17] = pctHor.length === 12 ? Number(avg(pctHor).toFixed(7)) : '-';

  return grid;
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * MATLAB Tabla_Comparativa.m (Rows 1..17) + Complete GANANCIAS Evaluation Block (Rows 19..35)
 */
export function buildComparativeComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
  const compLabel = comp === 'global' ? 'GLOBAL' : comp === 'beam' ? 'DIRECTA' : comp === 'diffuse' ? 'DIFUSA' : 'ALBEDO';
  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const refs = getStudyReferences(res, comp);

  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 35; r++) {
    grid[r] = new Array(120).fill('');
  }

  const { formattedDateTime } = getExportFileTimestamp();

  // Fila 1: Cabecera
  grid[0][0] = sanitizeForSpreadsheet(res.locationName);
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = Number(res.latitude.toFixed(7));
  grid[0][4] = isEn ? 'Comparative Study of All Solar Models' : 'Comparativa de todos los tipos de estudios';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Fila 3: RADIACIÓN GLOBAL DIARIA | TEMPERATURA
  grid[2][1] = isEn ? `DAILY ${compLabel} RADIATION (kWh/m²/day)` : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;
  grid[2][14] = isEn ? 'TEMPERATURE' : 'TEMPERATURA';

  // Fila 4: Cabeceras de columnas exactamente como en MATLAB Tabla_Comparativa.m
  grid[3][0] = isEn ? 'Month' : 'Meses';
  grid[3][1] = `${compSym}(0º)`;
  grid[3][2] = `${compSym}(${isEn ? 'Annual Opt' : 'Inclin. ópt. anual'})`;
  grid[3][4] = `${compSym}(${isEn ? 'Seasonal Opt' : 'Inc. ópt. estacional'})`;
  grid[3][6] = `${compSym}(${isEn ? 'Polar track' : 'Seg. eje polar'})`;
  grid[3][8] = `${compSym}(${isEn ? 'Azimuthal track' : 'Seg. eje azimutal'})`;
  grid[3][10] = `${compSym}(${isEn ? 'Horizontal track' : 'Seg. eje horizontal'})`;
  grid[3][12] = `${compSym}(${isEn ? 'Two-axis track' : 'Seg. a dos ejes'})`;
  grid[3][14] = 'Temp.(ºC)';

  // Filas 5 a 16: Meses
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = Number(refs.rad0[m].toFixed(8));
    grid[rowIdx][2] = Number(refs.radAnnualOpt[m].toFixed(8));
    grid[rowIdx][4] = Number(refs.radSeasonalOpt[m].toFixed(8));
    grid[rowIdx][6] = Number(refs.radPolar[m].toFixed(8));
    grid[rowIdx][8] = Number(refs.radAzim[m].toFixed(8));
    grid[rowIdx][10] = Number(refs.radHoriz[m].toFixed(8));
    grid[rowIdx][12] = Number(refs.radDual[m].toFixed(8));
    grid[rowIdx][14] = Number(refs.tempMean[m].toFixed(1));
  }

  // Fila 17: MEDIA
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  grid[16][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[16][1] = Number(avg(refs.rad0).toFixed(8));
  grid[16][2] = Number(avg(refs.radAnnualOpt).toFixed(8));
  grid[16][4] = Number(avg(refs.radSeasonalOpt).toFixed(8));
  grid[16][6] = Number(avg(refs.radPolar).toFixed(8));
  grid[16][8] = Number(avg(refs.radAzim).toFixed(8));
  grid[16][10] = Number(avg(refs.radHoriz).toFixed(8));
  grid[16][12] = Number(avg(refs.radDual).toFixed(8));
  grid[16][14] = Number(avg(refs.tempMean).toFixed(1));

  // Barrido continuo de ángulos 1º a 90º
  fillTiltSweepColumns(grid, res, comp, compSym, 15);

  // =========================================================================
  // GANANCIAS (Rows 19..35): Evaluación de factor de radiancia y porcentaje vs Plano Horizontal
  // =========================================================================
  grid[18][1] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[19][1] = isEn ? 'Respect to: Horizontal plane' : 'Respecto a: Plano horizontal';

  grid[20][1] = isEn ? 'Optimal annual tilt' : 'Inclinación óptima anual';
  grid[20][4] = isEn ? 'Optimal seasonal tilt' : 'Incl.  óptima estacional';
  grid[20][7] = isEn ? 'Polar tracking' : 'Seg. a un eje polar';
  grid[20][10] = isEn ? 'Azimuthal tracking' : 'Seg. a un eje azimutal';
  grid[20][13] = isEn ? 'Horizontal tracking' : 'Seg. a un eje horizontal';
  grid[20][16] = isEn ? 'Two-axis tracking' : 'Seg. a dos ejes';

  for (let c of [1, 4, 7, 10, 13, 16]) {
    grid[21][c] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
    grid[21][c + 1] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  }

  const factAnu: number[] = [], pctAnu: number[] = [];
  const factEst: number[] = [], pctEst: number[] = [];
  const factPol: number[] = [], pctPol: number[] = [];
  const factAzi: number[] = [], pctAzi: number[] = [];
  const factHor: number[] = [], pctHor: number[] = [];
  const factDual: number[] = [], pctDual: number[] = [];

  for (let m = 0; m < 12; m++) {
    const rowIdx = 22 + m;
    grid[rowIdx][0] = months[m];
    const g0 = refs.rad0[m];

    if (refs.isAlbedo || g0 <= 0) {
      for (let c of [1, 4, 7, 10, 13, 16]) {
        grid[rowIdx][c] = '-'; grid[rowIdx][c + 1] = '-';
      }
    } else {
      const calcGain = (val: number, arrF: number[], arrP: number[], col: number) => {
        const f = val / g0;
        const pc = ((val / g0) - 1) * 100;
        grid[rowIdx][col] = Number(f.toFixed(8));
        grid[rowIdx][col + 1] = Number(pc.toFixed(7));
        arrF.push(f);
        arrP.push(pc);
      };

      calcGain(refs.radAnnualOpt[m], factAnu, pctAnu, 1);
      calcGain(refs.radSeasonalOpt[m], factEst, pctEst, 4);
      calcGain(refs.radPolar[m], factPol, pctPol, 7);
      calcGain(refs.radAzim[m], factAzi, pctAzi, 10);
      calcGain(refs.radHoriz[m], factHor, pctHor, 13);
      calcGain(refs.radDual[m], factDual, pctDual, 16);
    }
  }

  // Fila 35: MEDIA
  grid[34][0] = isEn ? 'MEAN' : 'MEDIA';
  if (refs.isAlbedo) {
    for (let c of [1, 4, 7, 10, 13, 16]) {
      grid[34][c] = '-'; grid[34][c + 1] = '-';
    }
  } else {
    grid[34][1] = Number(avg(factAnu).toFixed(8)); grid[34][2] = Number(avg(pctAnu).toFixed(7));
    grid[34][4] = Number(avg(factEst).toFixed(8)); grid[34][5] = Number(avg(pctEst).toFixed(7));
    grid[34][7] = Number(avg(factPol).toFixed(8)); grid[34][8] = Number(avg(pctPol).toFixed(7));
    grid[34][10] = Number(avg(factAzi).toFixed(8)); grid[34][11] = Number(avg(pctAzi).toFixed(7));
    grid[34][13] = Number(avg(factHor).toFixed(8)); grid[34][14] = Number(avg(pctHor).toFixed(7));
    grid[34][16] = Number(avg(factDual).toFixed(8)); grid[34][17] = Number(avg(pctDual).toFixed(7));
  }

  return grid;
}

/**
 * Builds the Excel sheet data strictly conforming to:
 * Monthly Optimization (12 Independent Monthly Tilts)
 */
export function buildMonthlyComponentSheet(
  res: SolarBridgeSimulationResult,
  comp: TableRadiationComponent,
  isEn: boolean = false
): (string | number)[][] {
  const compLabel = comp === 'global' ? 'GLOBAL' : comp === 'beam' ? 'DIRECTA' : comp === 'diffuse' ? 'DIFUSA' : 'ALBEDO';
  const compSym = comp === 'global' ? 'Gdm' : comp === 'beam' ? 'Bdm' : comp === 'diffuse' ? 'Ddm' : 'Rdm';
  const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const refs = getStudyReferences(res, comp);

  const tilts = res.monthlyOptimum12.optimalTiltsDeg;
  const radMonthlyOpt = tilts.map((t, idx) => getMonthlyRadiationForAngle(res, comp, t)[idx]);

  const grid: (string | number)[][] = [];
  for (let r = 0; r <= 35; r++) {
    grid[r] = new Array(110).fill('');
  }

  const { formattedDateTime } = getExportFileTimestamp();

  // Fila 1: Cabecera
  grid[0][0] = sanitizeForSpreadsheet(res.locationName);
  grid[0][1] = isEn ? 'Latitude' : 'Latitud';
  grid[0][2] = Number(res.latitude.toFixed(7));
  grid[0][4] = isEn ? 'Monthly Optimization (12 Independent Positions)' : 'Optimización Mensual (12 Posiciones Independientes)';
  grid[0][6] = isEn ? 'Export Timestamp:' : 'Marca temporal:';
  grid[0][7] = formattedDateTime;

  // Fila 3: RADIACIÓN GLOBAL DIARIA | TEMPERATURA
  grid[2][1] = isEn ? `DAILY ${compLabel} RADIATION (kWh/m²/day)` : `RADIACIÓN ${compLabel} DIARIA (kWh/m²/día)`;
  grid[2][5] = isEn ? 'TEMPERATURE' : 'TEMPERATURA';

  // Fila 4: Mes, Gdm(0º), Inclinación óptima mensual β (º), Gdm(Ópt. mensual), Temp.(ºC)
  grid[3][0] = isEn ? 'Month' : 'Mes';
  grid[3][1] = `${compSym}(0º)`;
  grid[3][2] = isEn ? 'Optimal tilt β (°)' : 'Inclinación óptima β (º)';
  grid[3][3] = `${compSym}(${isEn ? 'Monthly Opt' : 'Ópt. mensual'})`;
  grid[3][5] = 'Temp.(ºC)';

  // Filas 5 a 16: Meses
  for (let m = 0; m < 12; m++) {
    const rowIdx = 4 + m;
    grid[rowIdx][0] = months[m];
    grid[rowIdx][1] = Number(refs.rad0[m].toFixed(8));
    grid[rowIdx][2] = tilts[m];
    grid[rowIdx][3] = Number(radMonthlyOpt[m].toFixed(8));
    grid[rowIdx][5] = Number(refs.tempMean[m].toFixed(1));
  }

  // Fila 17: MEDIA
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  grid[16][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[16][1] = Number(avg(refs.rad0).toFixed(8));
  grid[16][2] = Number(avg(tilts).toFixed(1));
  grid[16][3] = Number(avg(radMonthlyOpt).toFixed(8));
  grid[16][5] = Number(avg(refs.tempMean).toFixed(1));

  // Barrido continuo de ángulos 1º a 90º
  fillTiltSweepColumns(grid, res, comp, compSym, 6);

  // =========================================================================
  // GANANCIAS (Rows 19..35)
  // =========================================================================
  grid[18][1] = isEn ? 'GAINS' : 'GANANCIAS';
  grid[19][1] = isEn ? 'Respect to:' : 'Respecto a:';

  grid[20][1] = isEn ? 'Horizontal plane' : 'Plano horizontal';
  grid[20][4] = isEn ? 'Optimal annual tilt' : 'Inclinación óptima anual';
  grid[20][7] = isEn ? 'Optimal seasonal tilt' : 'Incl.  óptima estacional';
  grid[20][10] = isEn ? 'Two-axis tracking' : 'Seg. a dos ejes';

  for (let c of [1, 4, 7, 10]) {
    grid[21][c] = isEn ? 'Gain Factor' : 'Fc.Ganancia';
    grid[21][c + 1] = isEn ? 'Gain(%)' : 'Ganancia(%)';
  }

  const fact0: number[] = [], pct0: number[] = [];
  const factAnu: number[] = [], pctAnu: number[] = [];
  const factEst: number[] = [], pctEst: number[] = [];
  const factDual: number[] = [], pctDual: number[] = [];

  for (let m = 0; m < 12; m++) {
    const rowIdx = 22 + m;
    grid[rowIdx][0] = months[m];
    const p = radMonthlyOpt[m];

    // vs Plano horizontal
    if (refs.isAlbedo) {
      grid[rowIdx][1] = '-'; grid[rowIdx][2] = '-';
    } else {
      const g0 = refs.rad0[m];
      const f = g0 > 0 ? p / g0 : 1;
      const pc = g0 > 0 ? ((p / g0) - 1) * 100 : 0;
      grid[rowIdx][1] = Number(f.toFixed(8)); grid[rowIdx][2] = Number(pc.toFixed(7));
      fact0.push(f); pct0.push(pc);
    }

    // vs Inclinación óptima anual
    const gAnu = refs.radAnnualOpt[m];
    if (gAnu > 0) {
      const f = p / gAnu; const pc = ((p / gAnu) - 1) * 100;
      grid[rowIdx][4] = Number(f.toFixed(8)); grid[rowIdx][5] = Number(pc.toFixed(7));
      factAnu.push(f); pctAnu.push(pc);
    } else { grid[rowIdx][4] = '-'; grid[rowIdx][5] = '-'; }

    // vs Inclinación óptima estacional
    const gEst = refs.radSeasonalOpt[m];
    if (gEst > 0) {
      const f = p / gEst; const pc = ((p / gEst) - 1) * 100;
      grid[rowIdx][7] = Number(f.toFixed(8)); grid[rowIdx][8] = Number(pc.toFixed(7));
      factEst.push(f); pctEst.push(pc);
    } else { grid[rowIdx][7] = '-'; grid[rowIdx][8] = '-'; }

    // vs Dos Ejes
    const gDual = refs.radDual[m];
    if (gDual > 0) {
      const f = p / gDual; const pc = ((p / gDual) - 1) * 100;
      grid[rowIdx][10] = Number(f.toFixed(8)); grid[rowIdx][11] = Number(pc.toFixed(7));
      factDual.push(f); pctDual.push(pc);
    } else { grid[rowIdx][10] = '-'; grid[rowIdx][11] = '-'; }
  }

  // Fila 35: MEDIA
  grid[34][0] = isEn ? 'MEAN' : 'MEDIA';
  grid[34][1] = refs.isAlbedo ? '-' : Number(avg(fact0).toFixed(8));
  grid[34][2] = refs.isAlbedo ? '-' : Number(avg(pct0).toFixed(7));
  grid[34][4] = factAnu.length === 12 ? Number(avg(factAnu).toFixed(8)) : '-';
  grid[34][5] = pctAnu.length === 12 ? Number(avg(pctAnu).toFixed(7)) : '-';
  grid[34][7] = factEst.length === 12 ? Number(avg(factEst).toFixed(8)) : '-';
  grid[34][8] = pctEst.length === 12 ? Number(avg(pctEst).toFixed(7)) : '-';
  grid[34][10] = factDual.length === 12 ? Number(avg(factDual).toFixed(8)) : '-';
  grid[34][11] = pctDual.length === 12 ? Number(avg(pctDual).toFixed(7)) : '-';

  return grid;
}
