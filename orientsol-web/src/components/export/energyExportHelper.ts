import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import * as XLSX from 'xlsx';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface EnergyExportOptions {
  studyTitle?: string;
  studyDailyRad?: number[];
  isEn?: boolean;
  peakPowerKw?: number;
  tempCoefficient?: number;
  tonc?: number;
}

/**
 * Builds the exact Energy Yield data matrix matching OrientSol 3.0 (MATLAB Energia_Osterwald.m / Figura 5.2.82):
 * Row 1: [Location, 'Latitud', Latitude, '', Study Title]
 * Row 2: []
 * Row 3: ['', 'ENERGÍA MEDIA MENSUAL (kWh/mes)']
 * Row 4: ['', 'Plano horizontal', 'Tipo de estudio', 'Ganancias (kWh)']
 * Rows 5..16: [Month, E0_mes, E_mes, Ganancia_mes]
 * Row 17: ['ANUAL', E0_ANUAL, E_ANUAL, Ganancia_anu]
 */
export function buildEnergySheetData(
  res: SolarBridgeSimulationResult,
  options: EnergyExportOptions = {}
): (string | number)[][] {
  const isEn = options.isEn ?? false;
  const months = isEn ? MONTHS_EN : MONTHS_ES;
  const studyTitle = options.studyTitle ?? (isEn ? 'Annual optimal tilt' : 'Inclinación óptima anual');
  const studyDailyRad = options.studyDailyRad ?? res.optimalAnnual.monthlyDailyKwh;
  const rad0 = res.horizontal.gdm0;
  const tempAmb = res.temperatures.ambient.monthlyMeanC;

  // Defaults matching OrientSol 3.0 Osterwald module configuration
  const peakKw = options.peakPowerKw ?? 10.0;
  const coefTemp = options.tempCoefficient ?? -0.004;
  const tonc = options.tonc ?? 47.0;

  const e0Mes: number[] = [];
  const eMes: number[] = [];
  const gananciaMes: number[] = [];

  for (let i = 0; i < 12; i++) {
    const g0_Wm2 = (rad0[i] * 1000) / 24;
    const g_Wm2 = (studyDailyRad[i] * 1000) / 24;

    const tc0 = tempAmb[i] + (((tonc - 20) / 800) * g0_Wm2);
    const tc = tempAmb[i] + (((tonc - 20) / 800) * g_Wm2);

    const p0 = (peakKw * 1000) * (g0_Wm2 / 1000) * (1 + (coefTemp * (tc0 - 25)));
    const p = (peakKw * 1000) * (g_Wm2 / 1000) * (1 + (coefTemp * (tc - 25)));

    const e0Day = (p0 * 24) / 1000;
    const eDay = (p * 24) / 1000;

    const e0_m = e0Day * DAYS_PER_MONTH[i];
    const e_m = eDay * DAYS_PER_MONTH[i];

    e0Mes.push(e0_m);
    eMes.push(e_m);
    gananciaMes.push(e_m - e0_m);
  }

  const e0Anual = e0Mes.reduce((a, b) => a + b, 0);
  const eAnual = eMes.reduce((a, b) => a + b, 0);
  const gananciaAnual = eAnual - e0Anual;

  const sheetData: (string | number)[][] = [];

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedDateTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // Fila 1: Cabecera con emplazamiento, latitud, tipo de estudio y marca temporal
  sheetData.push([
    res.locationName,
    isEn ? 'Latitude' : 'Latitud',
    Number(res.latitude.toFixed(7)),
    '',
    studyTitle,
    '',
    isEn ? 'Export Timestamp:' : 'Marca temporal:',
    formattedDateTime,
  ]);

  // Fila 2: Vacía
  sheetData.push([]);

  // Fila 3: Título general del bloque de energía
  sheetData.push([
    '',
    isEn ? 'MONTHLY MEAN ENERGY (kWh/month)' : 'ENERGÍA MEDIA MENSUAL (kWh/mes)',
  ]);

  // Fila 4: Cabeceras de columnas
  sheetData.push([
    '',
    isEn ? 'Plano horizontal' : 'Plano horizontal',
    isEn ? 'Tipo de estudio' : 'Tipo de estudio',
    isEn ? 'Ganancias (kWh)' : 'Ganancias (kWh)',
  ]);

  // Filas 5 a 16: Los 12 meses
  for (let i = 0; i < 12; i++) {
    sheetData.push([
      months[i],
      Number(e0Mes[i].toFixed(6)),
      Number(eMes[i].toFixed(6)),
      Number(gananciaMes[i].toFixed(6)),
    ]);
  }

  // Fila 17: Totales Anuales
  sheetData.push([
    isEn ? 'ANNUAL' : 'ANUAL',
    Number(e0Anual.toFixed(4)),
    Number(eAnual.toFixed(4)),
    Number(gananciaAnual.toFixed(5)),
  ]);

  return sheetData;
}

/**
 * Creates an XLSX Worksheet pre-formatted with column widths matching Figura 5.2.82
 */
export function createEnergyWorksheet(
  res: SolarBridgeSimulationResult,
  options: EnergyExportOptions = {}
): XLSX.WorkSheet {
  const data = buildEnergySheetData(res, options);
  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 16 }, // A: Meses / Ciudad
    { wch: 22 }, // B: Plano horizontal
    { wch: 22 }, // C: Tipo de estudio
    { wch: 22 }, // D: Ganancias (kWh)
    { wch: 30 }, // E: Inclinación óptima anual
  ];

  return ws;
}
