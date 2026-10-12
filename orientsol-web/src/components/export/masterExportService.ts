import * as XLSX from 'xlsx';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle } from '@/components/climate/OptimalAnnualStudyPanel';

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
 * Generates and downloads a comprehensive Excel (.xlsx) workbook capturing ALL displayed
 * data, energy calculations, active study operation tables, and the complete 1° to 90°
 * inclination radiation development curves.
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

  // Timestamp of download / export
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

  // =========================================================================
  // HOJA 1: RESUMEN GENERAL & BALANCE ENERGÉTICO
  // =========================================================================
  const summaryData: (string | number)[][] = [
    ['ORIENTSOL 4.0 - ' + (isEn ? 'SIMULATION REPORT & ENERGY BALANCE' : 'INFORME DE SIMULACIÓN Y BALANCE ENERGÉTICO')],
    [isEn ? 'DOWNLOAD TIMESTAMP' : 'REGISTRO DE DESCARGA'],
    [isEn ? 'Download Date & Time' : 'Fecha y Hora de Descarga', formattedDateTime],
    [isEn ? 'ISO Timestamp' : 'Marca Temporal ISO', isoTimestamp],
    [],
    [isEn ? 'GENERAL PROJECT DATA' : 'DATOS GENERALES DEL PROYECTO'],
    [isEn ? 'Location' : 'Localidad / Ciudad', res.locationName],
    [isEn ? 'Latitude (°)' : 'Latitud (°)', Number(res.latitude.toFixed(4))],
    [isEn ? 'Longitude (°)' : 'Longitud (°)', Number(res.longitude.toFixed(4))],
    [isEn ? 'Download Date & Time' : 'Fecha y Hora de Descarga', formattedDateTime],
    [isEn ? 'Climate Data Source' : 'Fuente de Datos Climáticos', res.source.toUpperCase()],
    [isEn ? 'Execution Engine' : 'Motor de Simulación', 'Python 3.14 (Pyodide WebAssembly)'],
    [isEn ? 'Execution Time' : 'Tiempo de Cálculo', `${res.executionTimeMs} ms`],
    [],
    [isEn ? 'PHOTOVOLTAIC SYSTEM PARAMETERS' : 'PARÁMETROS DE LA INSTALACIÓN FOTOVOLTAICA'],
    [isEn ? 'Installed Peak Power (kWp)' : 'Potencia Pico Instalada (kWp)', peakKw],
    [isEn ? 'Performance Ratio (PR)' : 'Factor de Rendimiento (PR)', `${(pr * 100).toFixed(1)}%`],
    [isEn ? 'NOCT / TONC (°C)' : 'TONC de los Módulos (°C)', tonc],
    [isEn ? 'Power Temp Coef γ (%/°C)' : 'Coeficiente de Temperatura γ (%/°C)', '-0.40%/°C'],
    [],
    [isEn ? 'TEMPERATURE SUMMARY (°C)' : 'RESUMEN DE TEMPERATURAS AMBIENTE Y DE CÉLULA (°C)'],
    [isEn ? 'Annual Mean Ambient Temp (°C)' : 'Temperatura Media Anual Ambiente (°C)', Number(res.temperatures.ambient.annualMeanC.toFixed(2))],
    [isEn ? 'Annual Max Ambient Temp (°C)' : 'Temperatura Máxima Anual Ambiente (°C)', Number(res.temperatures.ambient.annualMaxC.toFixed(2))],
    [isEn ? 'Annual Min Ambient Temp (°C)' : 'Temperatura Mínima Anual Ambiente (°C)', Number(res.temperatures.ambient.annualMinC.toFixed(2))],
    [isEn ? 'Mean Operating Cell Temp (°C)' : 'Temperatura Media Operativa de Célula (°C)', Number(res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(2))],
    [isEn ? 'Max Operating Cell Temp (°C)' : 'Temperatura Máxima de Célula (°C)', Number(res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(2))],
    [],
    [isEn ? 'ENERGY BALANCE: RECEIVED VS PRODUCED' : 'BALANCE ENERGÉTICO: ENERGÍA RECIBIDA VS PRODUCIDA'],
    [isEn ? 'Estimated Collector Area (m²)' : 'Superficie de Captación Estimada (m²)', Number(res.energyYield.collectorAreaM2.toFixed(2))],
    [isEn ? 'Annual Incident Solar Radiation (kWh/yr)' : 'Energía Solar Recibida Total (kWh/año)', Math.round(res.energyYield.recibida.annualTotalKwh)],
    [isEn ? 'Annual Specific Irradiation (kWh/m²·yr)' : 'Irradiación Anual por Superficie (kWh/m²·año)', Number(res.energyYield.recibida.annualKwhM2.toFixed(2))],
    [isEn ? 'Daily Mean Incident Resource (kWh/m²/day)' : 'Recurso Medio Diario Incidente (kWh/m²/día)', Number(res.energyYield.recibida.meanDailyKwhM2.toFixed(3))],
    [isEn ? 'PV Generation - Osterwald Model (kWh/yr)' : 'Energía FV Producida - Modelo Osterwald (kWh/año)', Math.round(res.energyYield.producida.osterwald.annualKwh)],
    [isEn ? 'Specific Yield (kWh/kWp)' : 'Productividad Específica (kWh/kWp)', Math.round(res.energyYield.producida.osterwald.specificYieldKwhKwp)],
    [isEn ? 'Cell Thermal Losses vs STC (kWh/yr)' : 'Pérdidas Térmicas por Temperatura de Célula (kWh/año)', -Math.round(res.energyYield.producida.osterwald.thermalLossKwh)],
    [isEn ? 'Cell Thermal Losses (%)' : 'Pérdidas Térmicas Relativas (%)', `-${res.energyYield.producida.osterwald.thermalLossPct.toFixed(2)}%`],
    [isEn ? 'PV Generation - Simplified Model (kWh/yr)' : 'Energía FV Producida - Modelo Simplificado (kWh/año)', Math.round(res.energyYield.producida.simplified.annualKwh)],
    [],
    [isEn ? 'CTE DB-HE4 CAPTATION LOSSES' : 'MAPA DE PÉRDIDAS DE CAPTACIÓN (CTE DB-HE4)'],
    [isEn ? 'Optimal Point Tilt β (°)' : 'Inclinación Óptima β (°)', res.captureLossMap.optimalPoint.betaDeg],
    [isEn ? 'Optimal Point Azimuth α (°)' : 'Azimut Óptimo α (°)', res.captureLossMap.optimalPoint.alphaDeg],
    [isEn ? 'Max Daily Radiation at Optimum (kWh/m²/day)' : 'Radiación Diaria Máxima en el Óptimo (kWh/m²/día)', Number(res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3))],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, isEn ? 'General_Summary' : 'Resumen_General');

  // =========================================================================
  // HOJA 2: TABLA DETALLADA DE LA OPERACIÓN ACTIVA
  // =========================================================================
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const tempVals = res.temperatures.ambient.monthlyMeanC;
  const activeTableData: (string | number)[][] = [];

  const studyTitles: Record<string, string> = {
    annual: isEn ? 'Annual Optimal Tilt' : 'Inclinación Óptima Anual',
    monthly: isEn ? 'Monthly Optimization (12 Positions)' : 'Optimización Mensual (12 Posiciones Independientes)',
    seasonal: isEn ? 'Seasonal Optimal Tilt' : 'Inclinación Óptima Estacional',
    polar: isEn ? 'Single-Axis Polar Tracking' : 'Seguimiento a un Eje Polar',
    azimuthal: isEn ? 'Single-Axis Azimuthal Tracking' : 'Seguimiento a un Eje Azimutal',
    horizontal: isEn ? 'Single-Axis Horizontal Tracking' : 'Seguimiento a un Eje Horizontal',
    dual: isEn ? 'Two-Axis Tracking' : 'Seguimiento a Dos Ejes',
    comparative: isEn ? 'Comparative Study of All Models' : 'Comparativa de Todos los Modelos',
  };

  activeTableData.push([
    res.locationName,
    isEn ? 'Latitude' : 'Latitud',
    Number(res.latitude.toFixed(4)),
    '',
    studyTitles[activeOp] || activeOp,
    isEn ? `Component: ${activeComp}` : `Componente: ${activeComp}`
  ]);
  activeTableData.push([
    isEn ? 'Download Date & Time:' : 'Fecha y hora de descarga:',
    formattedDateTime,
    '',
    isEn ? 'ISO Timestamp:' : 'Marca temporal ISO:',
    isoTimestamp,
  ]);
  activeTableData.push([]);

  if (activeOp === 'annual') {
    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)', 'Gdm (15°)', 'Gdm (30°)', 'Gdm (45°)', 'Gdm (60°)', 'Gdm (75°)', 'Gdm (90°)',
      `Gdm Ópt (${optAngle}°)`,
      isEn ? 'Mean Temp (°C)' : 'Tª media (°C)',
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
        Number(factor.toFixed(4)),
        Number(pct.toFixed(2)),
      ]);
    }
  } else if (activeOp === 'monthly') {
    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)',
      isEn ? 'Optimal Angle (°)' : 'Ángulo Óptimo (°)',
      'Gdm Óptimo',
      isEn ? 'Mean Temp (°C)' : 'Tª media (°C)',
      isEn ? 'Gain vs Horiz (Factor)' : 'Ganancia s/ Horiz (Factor)',
      isEn ? 'Gain vs Horiz (%)' : 'Ganancia s/ Horiz (%)',
    ]);
    const r0 = res.horizontal.gdm0;
    const rOpt = res.monthlyOptimum12.monthlyDailyKwh;
    const tilts = res.monthlyOptimum12.optimalTiltsDeg;
    for (let i = 0; i < 12; i++) {
      const g0 = r0[i];
      const gOpt = rOpt[i];
      const factor = g0 > 0 ? gOpt / g0 : 1;
      const pct = (factor - 1) * 100;
      activeTableData.push([
        months[i],
        Number(g0.toFixed(2)),
        tilts[i],
        Number(gOpt.toFixed(2)),
        Number(tempVals[i].toFixed(1)),
        Number(factor.toFixed(4)),
        Number(pct.toFixed(2)),
      ]);
    }
  } else if (activeOp === 'seasonal') {
    activeTableData.push([
      isEn ? 'Month' : 'Mes',
      'Gdm (0°)', 'Gdm (15°)', 'Gdm (30°)', 'Gdm (45°)', 'Gdm (60°)', 'Gdm (75°)', 'Gdm (90°)',
      isEn ? 'Optimal Angle (°)' : 'Ángulo Óptimo (°)',
      'Gdm Óptimo',
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
        Number(getMonthlyRadiationForAngle(res, 'global', 15)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 30)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 45)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 60)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 75)[i].toFixed(2)),
        Number(getMonthlyRadiationForAngle(res, 'global', 90)[i].toFixed(2)),
        seasonTilts[i],
        Number(gOpt.toFixed(2)),
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
      'Gdm',
      isEn ? 'Mean Temp (°C)' : 'Tª media (°C)',
      isEn ? 'Gain Horiz (%)' : 'Plano horizontal (%)',
      isEn ? 'Gain Annual Opt (%)' : 'Inclinación ópt. anual (%)',
      isEn ? 'Gain Seasonal Opt (%)' : 'Inclin. ópt. estacional (%)',
      isEn ? 'Gain Azimuthal (%)' : 'Seg. a un eje azimutal (%)',
      isEn ? 'Gain Horizontal (%)' : 'Seg. a un eje horizontal (%)',
    ]);

    for (let i = 0; i < 12; i++) {
      const p = radStudy[i];
      const g0 = res.horizontal.gdm0[i];
      const gAnn = res.optimalAnnual.monthlyDailyKwh[i];
      const gSeas = res.seasonal.monthlyDailyKwh[i];
      const gAz = res.tracking.azimuthalAxis.monthlyDailyKwh[i];
      const gHz = res.tracking.horizontalAxis.monthlyDailyKwh[i];

      activeTableData.push([
        months[i],
        Number(g0.toFixed(2)),
        Number(p.toFixed(2)),
        Number(tempVals[i].toFixed(1)),
        Number((g0 > 0 ? ((p - g0) / g0) * 100 : 0).toFixed(2)),
        Number((gAnn > 0 ? ((p - gAnn) / gAnn) * 100 : 0).toFixed(2)),
        Number((gSeas > 0 ? ((p - gSeas) / gSeas) * 100 : 0).toFixed(2)),
        Number((gAz > 0 ? ((p - gAz) / gAz) * 100 : 0).toFixed(2)),
        Number((gHz > 0 ? ((p - gHz) / gHz) * 100 : 0).toFixed(2)),
      ]);
    }
  }

  const wsActive = XLSX.utils.aoa_to_sheet(activeTableData);
  XLSX.utils.book_append_sheet(wb, wsActive, isEn ? 'Active_Study_Table' : 'Tabla_Operacion_Activa');

  // =========================================================================
  // HOJA 3: CURVAS DE INCLINACIÓN 1° A 90° (DESARROLLO COMPLETO DE ÁNGULOS)
  // =========================================================================
  const anglesSheetData: (string | number)[][] = [
    [isEn ? 'RADIATION DEVELOPMENT ACROSS TILT ANGLES 1° TO 90°' : 'DESARROLLO DE RADIACIÓN EN EL RANGO DE ÁNGULOS 1° A 90°'],
    [isEn ? 'Download Date & Time:' : 'Fecha y hora de descarga:', formattedDateTime, '', isEn ? 'ISO Timestamp:' : 'Marca temporal ISO:', isoTimestamp],
    [res.locationName, `Latitud: ${res.latitude.toFixed(4)}°`, `Óptimo Anual: Inc = ${optAngle}°`],
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
  // HOJA 4: COMPARATIVA DE TODOS LOS MODELOS (7 TOPOLOGÍAS DE CAPTACIÓN)
  // =========================================================================
  const compSheetData: (string | number)[][] = [
    [isEn ? 'BENCHMARK COMPARISON OF ALL 7 SOLAR CAPTURE METHODS' : 'COMPARATIVA DE TODOS LOS 7 MÉTODOS DE CAPTACIÓN SOLAR'],
    [isEn ? 'Download Date & Time:' : 'Fecha y hora de descarga:', formattedDateTime, '', isEn ? 'ISO Timestamp:' : 'Marca temporal ISO:', isoTimestamp],
    [],
    [
      isEn ? 'Month' : 'Mes',
      'Plano Horiz (0°)',
      `Óptimo Anual (${optAngle}°)`,
      'Óptimo Estacional (4 pos)',
      'Seg. 1 Eje Polar',
      'Seg. 1 Eje Azimutal',
      'Seg. 1 Eje Horizontal',
      'Seg. 2 Ejes Continuo',
      'Tª Media (°C)',
    ],
  ];

  for (let i = 0; i < 12; i++) {
    compSheetData.push([
      months[i],
      Number(res.horizontal.gdm0[i].toFixed(2)),
      Number(res.optimalAnnual.monthlyDailyKwh[i].toFixed(2)),
      Number(res.seasonal.monthlyDailyKwh[i].toFixed(2)),
      Number(res.tracking.polarAxis.monthlyDailyKwh[i].toFixed(2)),
      Number(res.tracking.azimuthalAxis.monthlyDailyKwh[i].toFixed(2)),
      Number(res.tracking.horizontalAxis.monthlyDailyKwh[i].toFixed(2)),
      Number(res.tracking.dualAxis.monthlyDailyKwh[i].toFixed(2)),
      Number(tempVals[i].toFixed(1)),
    ]);
  }

  // Row of Means
  const avgArr = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  compSheetData.push([
    isEn ? 'ANNUAL MEAN' : 'MEDIA ANUAL',
    Number(avgArr(res.horizontal.gdm0).toFixed(3)),
    Number(avgArr(res.optimalAnnual.monthlyDailyKwh).toFixed(3)),
    Number(avgArr(res.seasonal.monthlyDailyKwh).toFixed(3)),
    Number(avgArr(res.tracking.polarAxis.monthlyDailyKwh).toFixed(3)),
    Number(avgArr(res.tracking.azimuthalAxis.monthlyDailyKwh).toFixed(3)),
    Number(avgArr(res.tracking.horizontalAxis.monthlyDailyKwh).toFixed(3)),
    Number(avgArr(res.tracking.dualAxis.monthlyDailyKwh).toFixed(3)),
    Number(res.temperatures.ambient.annualMeanC.toFixed(2)),
  ]);

  const wsComp = XLSX.utils.aoa_to_sheet(compSheetData);
  XLSX.utils.book_append_sheet(wb, wsComp, isEn ? 'Models_Comparative' : 'Comparativa_Modelos');

  // Download File with Default Timestamp in Filename
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_${activeOp.toUpperCase()}_Completo_${cleanLoc}_${fileTimestamp}.xlsx`;
  XLSX.writeFile(wb, filename);
}
