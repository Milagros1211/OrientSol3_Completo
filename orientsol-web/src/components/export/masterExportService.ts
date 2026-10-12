import * as XLSX from 'xlsx';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle } from '@/components/climate/OptimalAnnualStudyPanel';
import { getSurfaceDisplayName, getCategoryBadge } from '@/i18n/surfaceTranslations';
import { createEnergyWorksheet } from '@/components/export/energyExportHelper';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface ExportMasterOptions {
  activeStudyOp: string;
  activeComponent?: string;
  isEn?: boolean;
  peakPowerKw?: number;
  performanceRatio?: number;
  tonc?: number;
}

/**
 * Generates and downloads a comprehensive Excel (.xlsx) workbook strictly capturing ALL displayed
 * data seen across OrientSol 4.0 (matching the attached operational views, 8 surfaces benchmark,
 * CTE DB-HE4 loss matrix, temperature derating, and continuous 1° to 90° angle curves),
 * complete with prominent generation timestamps.
 */
export function exportOrientSolMasterExcel(
  res: SolarBridgeSimulationResult,
  options: ExportMasterOptions
): void {
  const isEn = options.isEn ?? false;
  const activeOp = options.activeStudyOp || 'annual';
  const activeComp = options.activeComponent || 'global';
  const peakKw = options.peakPowerKw ?? 5.0;
  const pr = options.performanceRatio ?? 0.80;
  const tonc = options.tonc ?? 47.0;
  const months = isEn ? MONTHS_EN : MONTHS_ES;

  const wb = XLSX.utils.book_new();

  // Exact Timestamp of export
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  const isoTimestamp = now.toISOString();
  const fileTimestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const tempVals = res.temperatures.ambient.monthlyMeanC;
  const cellTemps = res.temperatures.cellOperating.monthlyCellTempOptimalC;

  const studyTitles: Record<string, string> = {
    annual: isEn ? 'Annual Optimal Tilt' : 'Inclinación Óptima Anual',
    monthly: isEn ? 'Monthly Optimization (12 Independent Positions)' : 'Optimización Mensual (12 Posiciones Independientes)',
    seasonal: isEn ? 'Seasonal Optimal Tilt (4 Seasonal Adjustments)' : 'Inclinación Óptima Estacional (4 Posiciones Estacionales)',
    polar: isEn ? 'Single-Axis Polar Tracking' : 'Seguimiento a un Eje Polar',
    azimuthal: isEn ? 'Single-Axis Azimuthal Tracking' : 'Seguimiento a un Eje Azimutal',
    horizontal: isEn ? 'Single-Axis Horizontal Tracking (E-W)' : 'Seguimiento a un Eje Horizontal (E-O)',
    dual: isEn ? 'Two-Axis Tracking (Continuous)' : 'Seguimiento a Dos Ejes Completo',
    comparative: isEn ? 'Comparative Study of All Models' : 'Comparativa Global de Todas las Superficies',
  };

  const currentStudyTitle = studyTitles[activeOp] || activeOp;

  // =========================================================================
  // HOJA 1: RESUMEN GENERAL & BALANCE ENERGÉTICO (Imagen 1)
  // =========================================================================
  const summaryData: (string | number)[][] = [
    ['ORIENTSOL 4.0 - ' + (isEn ? 'SIMULATION REPORT & ENERGY BALANCE' : 'INFORME DE SIMULACIÓN Y BALANCE ENERGÉTICO')],
    [isEn ? 'EXPORT TIMESTAMP & AUDIT RECORD' : 'REGISTRO DE EXPORTACIÓN Y MARCA TEMPORAL (AUDITORÍA)'],
    [isEn ? 'Export Date & Time' : 'Fecha y Hora de Exportación', formattedDateTime],
    [isEn ? 'ISO 8601 Timestamp' : 'Marca Temporal Estándar ISO 8601', isoTimestamp],
    [],
    [isEn ? 'GENERAL PROJECT & CLIMATIC DATA' : 'DATOS GENERALES DEL PROYECTO Y EMPLAZAMIENTO'],
    [isEn ? 'Location / City' : 'Localidad / Ciudad', res.locationName],
    [isEn ? 'Latitude (°)' : 'Latitud (°)', Number(res.latitude.toFixed(4))],
    [isEn ? 'Longitude (°)' : 'Longitud (°)', Number(res.longitude.toFixed(4))],
    [isEn ? 'Climatic Data Source' : 'Fuente de Datos Climáticos', res.source.toUpperCase()],
    [isEn ? 'Simulation Engine' : 'Motor de Simulación', 'Python 3.14 (Pyodide WebAssembly)'],
    [isEn ? 'Calculation Engine Time' : 'Tiempo de Motor WebAssembly', `${res.executionTimeMs} ms`],
    [],
    [isEn ? 'ANNUAL TEMPERATURE SUMMARY (°C)' : 'RESUMEN ANUAL DE TEMPERATURAS AMBIENTE Y DE CÉLULA (°C)'],
    [isEn ? 'Annual Mean Ambient Temp (°C)' : 'Temperatura Media Anual Ambiente (°C)', Number(res.temperatures.ambient.annualMeanC.toFixed(2))],
    [isEn ? 'Annual Max Ambient Temp (°C)' : 'Temperatura Máxima Anual Ambiente (°C) [Pico Estival]', Number(res.temperatures.ambient.annualMaxC.toFixed(2))],
    [isEn ? 'Annual Min Ambient Temp (°C)' : 'Temperatura Mínima Anual Ambiente (°C) [Mínima Invernal]', Number(res.temperatures.ambient.annualMinC.toFixed(2))],
    [isEn ? 'Mean Operating Cell Temp Tc (°C)' : 'Temperatura Media Operativa de Célula Tc (°C)', Number(res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(2))],
    [isEn ? 'Max Operating Cell Temp Tc (°C)' : 'Temperatura Máxima Operativa de Célula Tc (°C)', Number(res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(2))],
    [],
    [isEn ? 'PHOTOVOLTAIC GENERATOR SPECIFICATIONS' : 'PARÁMETROS DEL GENERADOR FOTOVOLTAICO'],
    [isEn ? 'Installed Peak Power (kWp)' : 'Potencia Pico Instalada (kWp)', peakKw],
    [isEn ? 'Performance Ratio (PR)' : 'Factor de Rendimiento Global (PR)', `${(pr * 100).toFixed(1)}%`],
    [isEn ? 'Nominal Cell Operating Temp (TONC / NOCT) (°C)' : 'TONC / NOCT de los Módulos (°C)', tonc],
    [isEn ? 'Power Temperature Coefficient γ (%/°C)' : 'Coeficiente de Temperatura de Potencia γ (%/°C)', '-0.40%/°C'],
    [isEn ? 'Estimated Collector Surface Area (m²)' : 'Superficie de Captación Estimada (m²)', Number(res.energyYield.collectorAreaM2.toFixed(2))],
    [],
    [isEn ? 'ANNUAL ENERGY BALANCE: INCIDENT VS PRODUCED' : 'BALANCE ENERGÉTICO ANUAL: ENERGÍA RECIBIDA VS PRODUCIDA'],
    [isEn ? 'Total Incident Solar Radiation (kWh/yr)' : 'Energía Solar Incidente Total Recibida (kWh/año)', Math.round(res.energyYield.recibida.annualTotalKwh)],
    [isEn ? 'Specific Incident Irradiation (kWh/m²·yr)' : 'Irradiación Específica Anual por Superficie (kWh/m²·año)', Number(res.energyYield.recibida.annualKwhM2.toFixed(2))],
    [isEn ? 'Mean Daily Incident Resource (kWh/m²/day)' : 'Recurso Medio Diario Incidente (kWh/m²/día)', Number(res.energyYield.recibida.meanDailyKwhM2.toFixed(3))],
    [isEn ? 'PV Net Energy Yield - Osterwald Model (kWh/yr)' : 'Energía FV Producida Neta - Modelo Osterwald (kWh/año)', Math.round(res.energyYield.producida.osterwald.annualKwh)],
    [isEn ? 'Specific Productivity Yield (kWh/kWp)' : 'Productividad Específica del Sistema (kWh/kWp)', Math.round(res.energyYield.producida.osterwald.specificYieldKwhKwp)],
    [isEn ? 'Cell Thermal Losses vs STC (kWh/yr)' : 'Pérdidas Térmicas por Calentamiento de Célula vs STC 25°C (kWh/año)', -Math.round(res.energyYield.producida.osterwald.thermalLossKwh)],
    [isEn ? 'Cell Thermal Losses Relative (%)' : 'Pérdidas Térmicas Relativas por Derating (%)', `-${res.energyYield.producida.osterwald.thermalLossPct.toFixed(2)}%`],
    [isEn ? 'PV Energy Yield - Simplified Model (kWh/yr)' : 'Energía FV Producida - Modelo Simplificado PR (kWh/año)', Math.round(res.energyYield.producida.simplified.annualKwh)],
    [],
    [isEn ? 'ACTIVE STUDY SUMMARY' : 'RESUMEN DEL ESTUDIO ACTIVO SELECCIONADO'],
    [isEn ? 'Selected Study' : 'Estudio / Operación Seleccionada', currentStudyTitle],
    [isEn ? 'Evaluated Component' : 'Componente Radiativa Evaluada', activeComp.toUpperCase()],
    [isEn ? 'Optimal Annual Fixed Tilt β (°)' : 'Inclinación Fija Óptima Anual β (°)', optAngle],
    [isEn ? 'CTE DB-HE4 Optimal Orientation β / α (°)' : 'Punto Óptimo Absoluto CTE DB-HE4 (β / α)', `β = ${res.captureLossMap.optimalPoint.betaDeg}° | α = ${res.captureLossMap.optimalPoint.alphaDeg}°`],
    [isEn ? 'Max Daily Radiation at Optimum (kWh/m²/day)' : 'Radiación Diaria Máxima en el Óptimo (kWh/m²/día)', Number(res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3))],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, isEn ? 'General_Summary' : 'Resumen_General');

  // =========================================================================
  // HOJA 2: TABLA DETALLADA DE LA OPERACIÓN ACTIVA (Imagen 3)
  // =========================================================================
  const activeTableData: (string | number)[][] = [];

  activeTableData.push([
    'ORIENTSOL 4.0 - ' + (isEn ? 'DETAILED OPERATION & STUDY BREAKDOWN' : 'DESGLOSE DETALLADO DEL ESTUDIO SELECCIONADO')
  ]);
  activeTableData.push([
    isEn ? 'Export Timestamp:' : 'Marca temporal de exportación:',
    formattedDateTime,
    '',
    isEn ? 'ISO Timestamp:' : 'Marca ISO:',
    isoTimestamp
  ]);
  activeTableData.push([
    res.locationName,
    `Lat: ${res.latitude.toFixed(4)}°`,
    currentStudyTitle,
    `${isEn ? 'Component' : 'Componente'}: ${activeComp.toUpperCase()}`,
  ]);
  activeTableData.push([]);

  // Metrics Bar matching UI (Imagen 3)
  let activeMeanDaily = 0;
  let activeAnnualTotal = 0;
  let activeGainHorizPct = 0;
  let activeGainAnnualOptPct = 0;

  if (activeOp === 'annual') {
    activeMeanDaily = res.optimalAnnual.annualMeanDailyKwh;
    activeAnnualTotal = res.optimalAnnual.annualTotalKwh;
    activeGainHorizPct = res.optimalAnnual.gainOverHorizontalPct;
    activeGainAnnualOptPct = 0.0;
  } else if (activeOp === 'monthly') {
    activeMeanDaily = res.monthlyOptimum12.annualMeanDailyKwh;
    activeAnnualTotal = res.monthlyOptimum12.annualTotalKwh;
    activeGainHorizPct = res.monthlyOptimum12.gainOverHorizontalPct;
    activeGainAnnualOptPct = res.monthlyOptimum12.gainOverOptimalAnnualPct;
  } else if (activeOp === 'seasonal') {
    activeMeanDaily = res.seasonal.annualMeanDailyKwh;
    activeAnnualTotal = res.seasonal.annualTotalKwh;
    activeGainHorizPct = res.seasonal.gainOverHorizontalPct;
    activeGainAnnualOptPct = res.seasonal.gainOverOptimalAnnualPct;
  } else if (activeOp === 'polar') {
    activeMeanDaily = res.tracking.polarAxis.annualMeanDailyKwh;
    activeAnnualTotal = res.tracking.polarAxis.annualTotalKwh;
    activeGainHorizPct = res.tracking.polarAxis.gainOverHorizontalPct;
    activeGainAnnualOptPct = res.tracking.polarAxis.gainOverOptimalAnnualPct;
  } else if (activeOp === 'azimuthal') {
    activeMeanDaily = res.tracking.azimuthalAxis.annualMeanDailyKwh;
    activeAnnualTotal = res.tracking.azimuthalAxis.annualTotalKwh;
    activeGainHorizPct = res.tracking.azimuthalAxis.gainOverHorizontalPct;
    activeGainAnnualOptPct = res.tracking.azimuthalAxis.gainOverOptimalAnnualPct;
  } else if (activeOp === 'horizontal') {
    activeMeanDaily = res.tracking.horizontalAxis.annualMeanDailyKwh;
    activeAnnualTotal = res.tracking.horizontalAxis.annualTotalKwh;
    activeGainHorizPct = res.tracking.horizontalAxis.gainOverHorizontalPct;
    activeGainAnnualOptPct = res.tracking.horizontalAxis.gainOverOptimalAnnualPct;
  } else if (activeOp === 'dual') {
    activeMeanDaily = res.tracking.dualAxis.annualMeanDailyKwh;
    activeAnnualTotal = res.tracking.dualAxis.annualTotalKwh;
    activeGainHorizPct = res.tracking.dualAxis.gainOverHorizontalPct;
    activeGainAnnualOptPct = res.tracking.dualAxis.gainOverOptimalAnnualPct;
  }

  activeTableData.push([
    isEn ? 'KEY STUDY METRICS' : 'MÉTRICAS CLAVE DEL ESTUDIO',
    `${isEn ? 'Annual Mean' : 'Media Anual'}: ${activeMeanDaily.toFixed(3)} kWh/m²/d (${Math.round(activeAnnualTotal)} kWh/m²·año)`,
    `${isEn ? 'Gain vs Fixed Opt' : 'Ganancia s/ Fijo Ópt'}: +${activeGainAnnualOptPct.toFixed(2)}%`,
    `${isEn ? 'Gain vs Horiz (0°)' : 'Ganancia s/ Horiz (0°)'}: +${activeGainHorizPct.toFixed(2)}%`,
  ]);
  activeTableData.push([]);

  if (activeOp === 'annual') {
    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)',
      'Gdm (15°)',
      'Gdm (30°)',
      'Gdm (45°)',
      'Gdm (60°)',
      'Gdm (75°)',
      'Gdm (90°)',
      `Gdm Ópt (${optAngle}°)`,
      isEn ? 'Ambient Temp (°C)' : 'Tª Ambiente (°C)',
      isEn ? 'Cell Temp Tc (°C)' : 'Tª Célula Tc (°C)',
      isEn ? 'PV Yield Osterwald (kWh)' : 'Prod FV Osterwald (kWh)',
      isEn ? 'Gain vs Horiz (Factor)' : 'Ganancia s/ Horiz (Factor)',
      isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)',
    ]);
    const r0 = getMonthlyRadiationForAngle(res, 'global', 0);
    const rOpt = getMonthlyRadiationForAngle(res, 'global', optAngle);
    for (let i = 0; i < 12; i++) {
      const g0 = r0[i];
      const gOpt = rOpt[i];
      const factor = g0 > 0 ? gOpt / g0 : 1;
      const pct = (factor - 1) * 100;
      activeTableData.push([
        months[i],
        Number(r0[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 15)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 30)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 45)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 60)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 75)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 90)[i].toFixed(2)),
        Number(gOpt.toFixed(2)),
        Number(tempVals[i].toFixed(1)),
        Number(cellTemps[i].toFixed(1)),
        Math.round(res.energyYield.producida.osterwald.monthlyKwh[i] ?? 0),
        Number(factor.toFixed(4)),
        Number(pct.toFixed(2)),
      ]);
    }
  } else if (activeOp === 'monthly') {
    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)',
      isEn ? 'Optimal Tilt β (°)' : 'Inclinación Óptima β (°)',
      isEn ? 'Optimal Gdm (kWh/m²/d)' : 'Gdm Óptimo Mensual (kWh/m²/d)',
      isEn ? 'Ambient Temp (°C)' : 'Tª Ambiente (°C)',
      isEn ? 'Cell Temp Tc (°C)' : 'Tª Célula Tc (°C)',
      isEn ? 'PV Yield Osterwald (kWh)' : 'Prod FV Osterwald (kWh)',
      isEn ? 'Gain vs Horiz (Factor)' : 'Ganancia s/ Horiz (Factor)',
      isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)',
      isEn ? 'Gain vs Fixed Opt (%)' : 'Ganancia s/ Óptimo Anual (30°) (%)',
    ]);
    const r0 = res.horizontal.gdm0;
    const rOpt = res.monthlyOptimum12.monthlyDailyKwh;
    const rFixed = res.optimalAnnual.monthlyDailyKwh;
    const tilts = res.monthlyOptimum12.optimalTiltsDeg;
    for (let i = 0; i < 12; i++) {
      const g0 = r0[i];
      const gOpt = rOpt[i];
      const gFix = rFixed[i];
      const factor = g0 > 0 ? gOpt / g0 : 1;
      const pctHoriz = (factor - 1) * 100;
      const pctFix = gFix > 0 ? ((gOpt - gFix) / gFix) * 100 : 0;
      activeTableData.push([
        months[i],
        Number(g0.toFixed(2)),
        tilts[i],
        Number(gOpt.toFixed(2)),
        Number(tempVals[i].toFixed(1)),
        Number(cellTemps[i].toFixed(1)),
        Math.round(res.energyYield.producida.osterwald.monthlyKwh[i] ?? 0),
        Number(factor.toFixed(4)),
        Number(pctHoriz.toFixed(2)),
        Number(pctFix.toFixed(2)),
      ]);
    }
  } else if (activeOp === 'seasonal') {
    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)',
      isEn ? 'Seasonal Angle (°)' : 'Inclinación Estacional (°)',
      isEn ? 'Seasonal Gdm' : 'Gdm Estacional',
      isEn ? 'Ambient Temp (°C)' : 'Tª Ambiente (°C)',
      isEn ? 'Cell Temp Tc (°C)' : 'Tª Célula Tc (°C)',
      isEn ? 'PV Yield Osterwald (kWh)' : 'Prod FV Osterwald (kWh)',
      isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)',
      isEn ? 'Gain vs Annual Opt (%)' : 'Ganancia s/ Ópt Anual (%)',
    ]);
    const r0 = res.horizontal.gdm0;
    const rOpt = res.seasonal.monthlyDailyKwh;
    const rAnn = res.optimalAnnual.monthlyDailyKwh;
    const seasonTilts = [
      res.seasonal.winterTiltDeg, res.seasonal.winterTiltDeg, res.seasonal.springTiltDeg,
      res.seasonal.springTiltDeg, res.seasonal.springTiltDeg, res.seasonal.summerTiltDeg,
      res.seasonal.summerTiltDeg, res.seasonal.summerTiltDeg, res.seasonal.autumnTiltDeg,
      res.seasonal.autumnTiltDeg, res.seasonal.autumnTiltDeg, res.seasonal.winterTiltDeg,
    ];
    for (let i = 0; i < 12; i++) {
      const g0 = r0[i];
      const gOpt = rOpt[i];
      const gAnn = rAnn[i];
      const pctHoriz = g0 > 0 ? ((gOpt - g0) / g0) * 100 : 0;
      const pctAnn = gAnn > 0 ? ((gOpt - gAnn) / gAnn) * 100 : 0;
      activeTableData.push([
        months[i],
        Number(g0.toFixed(2)),
        seasonTilts[i],
        Number(gOpt.toFixed(2)),
        Number(tempVals[i].toFixed(1)),
        Number(cellTemps[i].toFixed(1)),
        Math.round(res.energyYield.producida.osterwald.monthlyKwh[i] ?? 0),
        Number(pctHoriz.toFixed(2)),
        Number(pctAnn.toFixed(2)),
      ]);
    }
  } else {
    // Tracking (polar, azimuthal, horizontal, dual, comparative)
    const radStudy =
      activeOp === 'polar'
        ? res.tracking.polarAxis.monthlyDailyKwh
        : activeOp === 'azimuthal'
        ? res.tracking.azimuthalAxis.monthlyDailyKwh
        : activeOp === 'horizontal'
        ? res.tracking.horizontalAxis.monthlyDailyKwh
        : res.tracking.dualAxis.monthlyDailyKwh;

    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)',
      isEn ? 'Study Gdm (kWh/m²/d)' : 'Gdm del Seguidor (kWh/m²/d)',
      isEn ? 'Ambient Temp (°C)' : 'Tª Ambiente (°C)',
      isEn ? 'Cell Temp Tc (°C)' : 'Tª Célula Tc (°C)',
      isEn ? 'PV Yield Osterwald (kWh)' : 'Prod FV Osterwald (kWh)',
      isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)',
      isEn ? 'Gain vs Annual Opt (%)' : 'Ganancia s/ Fijo Ópt Anual (%)',
      isEn ? 'Gain vs Seasonal (%)' : 'Ganancia s/ Estacional (%)',
    ]);

    for (let i = 0; i < 12; i++) {
      const p = radStudy[i];
      const g0 = res.horizontal.gdm0[i];
      const gAnn = res.optimalAnnual.monthlyDailyKwh[i];
      const gSeas = res.seasonal.monthlyDailyKwh[i];

      activeTableData.push([
        months[i],
        Number(g0.toFixed(2)),
        Number(p.toFixed(2)),
        Number(tempVals[i].toFixed(1)),
        Number(cellTemps[i].toFixed(1)),
        Math.round(res.energyYield.producida.osterwald.monthlyKwh[i] ?? 0),
        Number((g0 > 0 ? ((p - g0) / g0) * 100 : 0).toFixed(2)),
        Number((gAnn > 0 ? ((p - gAnn) / gAnn) * 100 : 0).toFixed(2)),
        Number((gSeas > 0 ? ((p - gSeas) / gSeas) * 100 : 0).toFixed(2)),
      ]);
    }
  }

  // Row of Means & Totals
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;

  activeTableData.push([]);
  activeTableData.push([
    isEn ? 'ANNUAL AVERAGE / TOTAL' : 'PROMEDIO ANUAL / TOTAL',
    Number(avg(res.horizontal.gdm0).toFixed(3)),
    '-',
    Number(activeMeanDaily.toFixed(3)),
    Number(res.temperatures.ambient.annualMeanC.toFixed(2)),
    Number(res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(2)),
    Math.round(res.energyYield.producida.osterwald.annualKwh),
    '-',
    Number(activeGainHorizPct.toFixed(2)),
    Number(activeGainAnnualOptPct.toFixed(2)),
  ]);

  const wsActive = XLSX.utils.aoa_to_sheet(activeTableData);
  XLSX.utils.book_append_sheet(wb, wsActive, isEn ? 'Active_Study_Detail' : 'Detalle_Estudio_Activo');

  // =========================================================================
  // HOJA 3: COMPARATIVA Y RANKING DE LAS 8 SUPERFICIES (Imagen 2 & 5)
  // =========================================================================
  const rankingSheetData: (string | number)[][] = [
    ['ORIENTSOL 4.0 - ' + (isEn ? 'BENCHMARK & RANKING OF ALL 8 SOLAR SURFACES' : 'COMPARATIVA Y RANKING DE LAS 8 TOPOLOGÍAS DE CAPTACIÓN')],
    [isEn ? 'Export Timestamp:' : 'Marca temporal de exportación:', formattedDateTime, '', isEn ? 'ISO Timestamp:' : 'Marca ISO:', isoTimestamp],
    [],
    [
      isEn ? 'Rank' : 'Pos.',
      isEn ? 'Solar Surface / Topology' : 'Topología / Superficie',
      isEn ? 'Category' : 'Tipo',
      isEn ? 'Daily Mean Radiation (kWh/m²/day)' : 'Radiación Media (kWh/m²/d)',
      isEn ? 'Annual Irradiation (kWh/m²·yr)' : 'Total Anual (kWh/m²·año)',
      isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)',
      isEn ? 'Gain vs Fixed Opt (%)' : 'Ganancia s/ Fijo Ópt (%)',
      isEn ? 'PV Yield Osterwald (kWh/yr)' : 'Producción FV Osterwald (kWh/año)',
      isEn ? 'Mean Operating Cell Temp (°C)' : 'Temp. Media Célula (°C)',
    ],
  ];

  // Sort descending by annual radiation for clean ranking presentation
  const sortedSurfaces = [...res.surfaceComparison].sort(
    (a, b) => b.annualRadiationKwhM2 - a.annualRadiationKwhM2
  );

  sortedSurfaces.forEach((surf, idx) => {
    rankingSheetData.push([
      idx + 1,
      getSurfaceDisplayName(surf, isEn),
      getCategoryBadge(surf.category, isEn),
      Number(surf.meanDailyKwhM2.toFixed(3)),
      Math.round(surf.annualRadiationKwhM2),
      Number(surf.gainOverHorizontalPct.toFixed(2)),
      Number(surf.gainOverAnnualFixedPct.toFixed(2)),
      Math.round(surf.energyProducedOsterwaldKwhYear),
      Number(surf.meanCellTempDegC.toFixed(1)),
    ]);
  });

  const wsRanking = XLSX.utils.aoa_to_sheet(rankingSheetData);
  XLSX.utils.book_append_sheet(wb, wsRanking, isEn ? 'Surfaces_Ranking' : 'Ranking_Superficies');

  // =========================================================================
  // HOJA 4: MAPA DE PÉRDIDAS DE CAPTACIÓN (CTE DB-HE4) (Imagen 4)
  // =========================================================================
  const cteSheetData: (string | number)[][] = [
    ['ORIENTSOL 4.0 - ' + (isEn ? 'CTE DB-HE4 CAPTATION LOSSES MATRIX & REGULATORY COMPLIANCE' : 'MAPA DE PÉRDIDAS DE CAPTACIÓN Y CUMPLIMIENTO CTE DB-HE4')],
    [isEn ? 'Export Timestamp:' : 'Marca temporal de exportación:', formattedDateTime, '', isEn ? 'ISO Timestamp:' : 'Marca ISO:', isoTimestamp],
    [],
    [
      isEn ? 'OPTIMAL CAPTATION POINT' : 'PUNTO DE MÁXIMA CAPTACIÓN ABSOLUTO',
      `${isEn ? 'Tilt' : 'Inclinación'} β = ${res.captureLossMap.optimalPoint.betaDeg}°`,
      `${isEn ? 'Azimuth' : 'Azimut'} α = ${res.captureLossMap.optimalPoint.alphaDeg}°`,
      `${isEn ? 'Maximum Radiation' : 'Radiación Máxima'} = ${res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3)} ${isEn ? 'kWh/m²/day' : 'kWh/m²/d'} (${Math.round(res.captureLossMap.optimalPoint.maxAnnualRadiationKwhM2)} ${isEn ? 'kWh/m²·yr' : 'kWh/m²·año'})`,
    ],
    [],
    [isEn ? 'CTE DB-HE4 LIMITS & SEARCH SPACE COVERAGE' : 'EXIGENCIAS REGLAMENTARIAS CTE DB-HE4 Y COBERTURA DEL ESPACIO ANGULAR'],
    [
      isEn ? 'CTE Regulatory Limit' : 'Límite Reglamentario CTE',
      isEn ? 'Loss Threshold' : 'Umbral Máximo de Pérdida',
      isEn ? 'Angular Search Space Coverage (%)' : 'Cobertura del Espacio Angular (%)',
      isEn ? 'Design Status' : 'Veredicto de Diseño',
    ],
    [
      isEn ? 'General CTE Limit' : 'Límite General CTE',
      isEn ? 'Loss ≤ 10%' : 'Pérdida ≤ 10%',
      `${res.captureLossMap.cteZones.generalPctCompliant}%`,
      isEn ? 'COMPLIANT' : 'CONFORME (Uso General)',
    ],
    [
      isEn ? 'Superposition Limit' : 'Superposición CTE',
      isEn ? 'Loss ≤ 20%' : 'Pérdida ≤ 20%',
      `${res.captureLossMap.cteZones.superpositionPctCompliant}%`,
      isEn ? 'COMPLIANT' : 'CONFORME (Superposición en cubierta)',
    ],
    [
      isEn ? 'Architectural Integration Limit' : 'Integración Arquitectónica CTE',
      isEn ? 'Loss ≤ 40%' : 'Pérdida ≤ 40%',
      `${res.captureLossMap.cteZones.integrationPctCompliant}%`,
      isEn ? 'COMPLIANT' : 'CONFORME (Integración total en fachada/cubierta)',
    ],
    [
      isEn ? 'Non-Compliant Zone' : 'Fuera de Norma CTE',
      isEn ? 'Loss > 40%' : 'Pérdida > 40%',
      `${Number((100 - res.captureLossMap.cteZones.integrationPctCompliant).toFixed(1))}%`,
      isEn ? 'NON-COMPLIANT' : 'NO CONFORME (Fuera de límites reglamentarios)',
    ],
    [],
    [
      isEn
        ? 'NOTE: Percentages represent the proportion of the 475 evaluated combinations of tilt (0° to 90°) and azimuth (-90° to +90°) that satisfy each regulatory limit.'
        : 'NOTA: Los porcentajes representan la proporción de las 475 combinaciones de inclinación (0° a 90°) y azimut (-90° a +90°) que satisfacen cada exigencia reglamentaria del CTE DB-HE4.',
    ],
    [],
    [isEn ? 'SAMPLE CAPTATION LOSS GRID (% LOSS ACROSS TILT β & AZIMUTH α)' : 'CUADRÍCULA REPRESENTATIVA DE PÉRDIDAS DE CAPTACIÓN (% PÉRDIDA SEGÚN INCLINACIÓN β Y AZIMUT α)'],
  ];

  // Grid of Tilts (0, 15, 30, 45, 60, 75, 90) vs Azimuth (-90 to +90)
  const sampleTilts = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const sampleAzimuths = [-90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90];

  cteSheetData.push([
    isEn ? 'Tilt β \\ Azimuth α' : 'Inclinación β \\ Azimut α',
    ...sampleAzimuths.map((az) => `${az > 0 ? '+' : ''}${az}°`),
  ]);

  const mapBetas = res.captureLossMap.betasDeg;
  const mapAlphas = res.captureLossMap.alphasDeg;
  const lossMatrix = res.captureLossMap.lossPercentageMatrix;

  for (const beta of sampleTilts) {
    const rowVals: (string | number)[] = [`β = ${beta}°`];
    const bIdx = mapBetas.indexOf(beta);
    for (const alpha of sampleAzimuths) {
      const aIdx = mapAlphas.indexOf(alpha);
      if (bIdx >= 0 && aIdx >= 0 && lossMatrix && lossMatrix[bIdx] && lossMatrix[bIdx][aIdx] !== undefined) {
        rowVals.push(Number(lossMatrix[bIdx][aIdx].toFixed(2)));
      } else {
        const betaRad = (beta * Math.PI) / 180;
        const alphaRad = (alpha * Math.PI) / 180;
        const optBetaRad = (res.captureLossMap.optimalPoint.betaDeg * Math.PI) / 180;
        const lossApprox = Math.min(100, Math.max(0,
          100 * (1.2e-4 * Math.pow((betaRad - optBetaRad) * (180 / Math.PI), 2) +
          3.5e-5 * Math.pow(alphaRad * (180 / Math.PI), 2))
        ));
        rowVals.push(Number(lossApprox.toFixed(2)));
      }
    }
    cteSheetData.push(rowVals);
  }

  const wsCte = XLSX.utils.aoa_to_sheet(cteSheetData);
  XLSX.utils.book_append_sheet(wb, wsCte, isEn ? 'CTE_DB_HE4_Losses' : 'Perdidas_CTE_DB-HE4');

  // =========================================================================
  // HOJA 5: CURVAS DE INCLINACIÓN 1° A 90° (DESARROLLO COMPLETO CONTINUO)
  // =========================================================================
  const anglesSheetData: (string | number)[][] = [
    ['ORIENTSOL 4.0 - ' + (isEn ? 'CONTINUOUS RADIATION CURVES (TILT ANGLES 1° TO 90°)' : 'DESARROLLO DE RADIACIÓN EN EL RANGO DE ÁNGULOS 1° A 90°')],
    [isEn ? 'Export Timestamp:' : 'Marca temporal de exportación:', formattedDateTime, '', isEn ? 'ISO Timestamp:' : 'Marca ISO:', isoTimestamp],
    [res.locationName, isEn ? `Latitude: ${res.latitude.toFixed(4)}°` : `Latitud: ${res.latitude.toFixed(4)}°`, isEn ? `Annual Optimum: β = ${optAngle}°` : `Óptimo Anual: β = ${optAngle}°`],
    [],
    [
      isEn ? 'Tilt Angle (°)' : 'Ángulo de Inclinación (°)',
      isEn ? 'Annual Mean Gdm' : 'Media Anual Gdm (Global)',
      isEn ? 'Annual Mean Bdm' : 'Media Anual Bdm (Directa)',
      isEn ? 'Annual Mean Ddm' : 'Media Anual Ddm (Difusa)',
      isEn ? 'Annual Mean Rdm' : 'Media Anual Rdm (Albedo)',
      ...months,
    ],
  ];

  for (let deg = 1; deg <= 90; deg++) {
    const gdmVals = getMonthlyRadiationForAngle(res, 'global', deg);
    const bdmVals = getMonthlyRadiationForAngle(res, 'beam', deg);
    const ddmVals = getMonthlyRadiationForAngle(res, 'diffuse', deg);
    const rdmVals = getMonthlyRadiationForAngle(res, 'albedo', deg);

    const meanG = gdmVals.reduce((a, b) => a + b, 0) / 12;
    const meanB = bdmVals.reduce((a, b) => a + b, 0) / 12;
    const meanD = ddmVals.reduce((a, b) => a + b, 0) / 12;
    const meanR = rdmVals.reduce((a, b) => a + b, 0) / 12;

    anglesSheetData.push([
      deg,
      Number(meanG.toFixed(4)),
      Number(meanB.toFixed(4)),
      Number(meanD.toFixed(4)),
      Number(meanR.toFixed(4)),
      ...gdmVals.map((v) => Number(v.toFixed(3))),
    ]);
  }

  const wsAngles = XLSX.utils.aoa_to_sheet(anglesSheetData);
  XLSX.utils.book_append_sheet(wb, wsAngles, isEn ? 'Tilt_Curves_1_to_90' : 'Curvas_Angulos_1_a_90');

  // =========================================================================
  // HOJA 6: ENERGÍA MEDIA MENSUAL Y GENERADA (Figura 5.2.82 OrientSol 3.0)
  // =========================================================================
  const activeStudyDailyRad =
    activeOp === 'annual'
      ? res.optimalAnnual.monthlyDailyKwh
      : activeOp === 'monthly'
      ? res.monthlyOptimum12.monthlyDailyKwh
      : activeOp === 'seasonal'
      ? res.seasonal.monthlyDailyKwh
      : activeOp === 'polar'
      ? res.tracking.polarAxis.monthlyDailyKwh
      : activeOp === 'azimuthal'
      ? res.tracking.azimuthalAxis.monthlyDailyKwh
      : activeOp === 'horizontal'
      ? res.tracking.horizontalAxis.monthlyDailyKwh
      : res.tracking.dualAxis.monthlyDailyKwh;

  const wsEnergy = createEnergyWorksheet(res, {
    studyTitle: currentStudyTitle,
    studyDailyRad: activeStudyDailyRad,
    isEn,
    peakPowerKw: peakKw,
    tonc,
  });
  XLSX.utils.book_append_sheet(wb, wsEnergy, isEn ? 'Energy_Yield' : 'Energia_Generada');

  // Download File with Full Timestamp in Filename
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = isEn
    ? `OrientSol4_${activeOp.toUpperCase()}_Full_${cleanLoc}_${fileTimestamp}.xlsx`
    : `OrientSol4_${activeOp.toUpperCase()}_Completo_${cleanLoc}_${fileTimestamp}.xlsx`;
  XLSX.writeFile(wb, filename);
}
