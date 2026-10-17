import * as XLSX from 'xlsx';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { type TableRadiationComponent } from '@/components/climate/OptimalAnnualStudyPanel';
import { getSurfaceDisplayName, getCategoryBadge } from '@/i18n/surfaceTranslations';
import { createEnergyWorksheet } from '@/components/export/energyExportHelper';
import { buildSeasonalComponentSheet } from '@/components/export/seasonalExportHelper';
import { buildPolarComponentSheet } from '@/components/export/polarExportHelper';
import { sanitizeForSpreadsheet } from '@/utils/security';
import { formatPercent, formatNum, formatInt, formatAngle } from '@/utils/formatters';
import {
  applySpanishNumberFormattingToWorksheet,
  getExportFileTimestamp,
  getStandardizedExcelFilename,
  buildAnnualComponentSheet,
  buildAzimuthalComponentSheet,
  buildHorizontalComponentSheet,
  buildDualAxisComponentSheet,
  buildComparativeComponentSheet,
  buildMonthlyComponentSheet,
} from '@/components/export/excelFormatHelper';



export interface ExportMasterOptions {
  activeStudyOp: string;
  activeComponent?: string;
  exportMode?: 'single' | 'all';
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

  const wb = XLSX.utils.book_new();

  // Exact Timestamp of export
  const { fileTimestamp, formattedDateTime, isoTimestamp } = getExportFileTimestamp();

  const optAngle = res.optimalAnnual.optimalTiltDeg;

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
  // HOJA 1..4: TABLA DETALLADA DE LA OPERACIÓN (FORMATO MATLAB .M)
  // =========================================================================
  function buildStudyTableData(compName: string): (string | number)[][] {
    const compType = (compName === 'beam' || compName === 'diffuse' || compName === 'albedo' ? compName : 'global') as TableRadiationComponent;
    if (activeOp === 'annual') {
      return buildAnnualComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'seasonal') {
      return buildSeasonalComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'polar') {
      return buildPolarComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'azimuthal') {
      return buildAzimuthalComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'horizontal') {
      return buildHorizontalComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'dual') {
      return buildDualAxisComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'comparative') {
      return buildComparativeComponentSheet(res, compType, isEn);
    }
    if (activeOp === 'monthly') {
      return buildMonthlyComponentSheet(res, compType, isEn);
    }
    return buildAnnualComponentSheet(res, compType, isEn);
  }

  // 1. Appending Primary Study Sheets (Hoja1..Hoja4) strictly conforming to MATLAB OrientSol 3.0
  if (options.exportMode === 'all') {
    const compConfigs = [
      { key: 'global', sheetName: isEn ? 'Hoja1_Global' : 'Hoja1_Global' },
      { key: 'beam', sheetName: isEn ? 'Hoja2_Direct' : 'Hoja2_Directa' },
      { key: 'diffuse', sheetName: isEn ? 'Hoja3_Diffuse' : 'Hoja3_Difusa' },
      { key: 'albedo', sheetName: isEn ? 'Hoja4_Albedo' : 'Hoja4_Albedo' },
    ];
    for (const compCfg of compConfigs) {
      const data = buildStudyTableData(compCfg.key);
      const ws = XLSX.utils.aoa_to_sheet(data);
      applySpanishNumberFormattingToWorksheet(ws);
      XLSX.utils.book_append_sheet(wb, ws, compCfg.sheetName);
    }
  } else {
    const data = buildStudyTableData(activeComp);
    const wsActive = XLSX.utils.aoa_to_sheet(data);
    applySpanishNumberFormattingToWorksheet(wsActive);
    const compLabel =
      activeComp === 'global'
        ? (isEn ? 'Global' : 'Global')
        : activeComp === 'beam'
        ? (isEn ? 'Direct' : 'Directa')
        : activeComp === 'diffuse'
        ? (isEn ? 'Diffuse' : 'Difusa')
        : (isEn ? 'Albedo' : 'Albedo');
    XLSX.utils.book_append_sheet(wb, wsActive, `Hoja1_${compLabel}`);
  }

  // 2. Appending Energia_Generada (Figura 5.2.82 / Energia_Osterwald.m)
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
  applySpanishNumberFormattingToWorksheet(wsEnergy);
  XLSX.utils.book_append_sheet(wb, wsEnergy, isEn ? 'Energy_Yield' : 'Energia_Generada');

  // =========================================================================
  // HOJA AUDITORÍA: RESUMEN GENERAL & BALANCE ENERGÉTICO (OrientSol 4.0)
  // =========================================================================
  const summaryData: (string | number)[][] = [
    ['ORIENTSOL 4.0 - ' + (isEn ? 'SIMULATION REPORT & ENERGY BALANCE' : 'INFORME DE SIMULACIÓN Y BALANCE ENERGÉTICO')],
    [isEn ? 'EXPORT TIMESTAMP & AUDIT RECORD' : 'REGISTRO DE EXPORTACIÓN Y MARCA TEMPORAL (AUDITORÍA)'],
    [isEn ? 'Export Date & Time' : 'Fecha y Hora de Exportación', formattedDateTime],
    [isEn ? 'ISO 8601 Timestamp' : 'Marca Temporal Estándar ISO 8601', isoTimestamp],
    [],
    [isEn ? 'GENERAL PROJECT & CLIMATIC DATA' : 'DATOS GENERALES DEL PROYECTO Y EMPLAZAMIENTO'],
    [isEn ? 'Location / City' : 'Localidad / Ciudad', sanitizeForSpreadsheet(res.locationName)],
    [isEn ? 'Latitude (°)' : 'Latitud (°)', Number(res.latitude.toFixed(4))],
    [isEn ? 'Longitude (°)' : 'Longitud (°)', Number(res.longitude.toFixed(4))],
    [isEn ? 'Climatic Data Source' : 'Fuente de Datos Climáticos', sanitizeForSpreadsheet(res.source.toUpperCase())],
    [isEn ? 'Simulation Engine' : 'Motor de Simulación', 'Python 3.14 (Pyodide WebAssembly)'],
    [isEn ? 'Calculation Engine Time' : 'Tiempo de Motor WebAssembly', `${res.executionTimeMs} ms`],
    [],
    [isEn ? 'ANNUAL TEMPERATURE SUMMARY (°C)' : 'RESUMEN ANUAL DE TEMPERATURAS AMBIENTE Y DE CÉLULA (°C)'],
    [isEn ? 'Annual Mean Ambient Temp (°C)' : 'Temperatura Media Anual Ambiente (°C)', Number(res.temperatures.ambient.annualMeanC.toFixed(2))],
    [isEn ? 'Annual Max Ambient Temp (°C)' : 'Temperatura Máxima Anual Ambiente (°C) [Pico Estival]', Number(res.temperatures.ambient.annualMaxC.toFixed(2))],
    [isEn ? 'Annual Min Ambient Temp (°C)' : 'Temperatura Mínima Anual Ambiente (°C) [Mínima Invernal]', Number(res.temperatures.ambient.annualMinC.toFixed(2))],
    [isEn ? 'Mean Operating Cell Temp T_C (°C)' : 'Temperatura Media Operativa de Célula T_C (°C)', Number(res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(2))],
    [isEn ? 'Max Operating Cell Temp T_C (°C)' : 'Temperatura Máxima Operativa de Célula T_C (°C)', Number(res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(2))],
    [],
    [isEn ? 'PHOTOVOLTAIC GENERATOR SPECIFICATIONS' : 'PARÁMETROS DEL GENERADOR FOTOVOLTAICO'],
    [isEn ? 'Installed Peak Power (kWp)' : 'Potencia Pico Instalada (kWp)', peakKw],
    [isEn ? 'Performance Ratio (PR)' : 'Factor de Rendimiento Global (PR)', formatPercent(pr * 100, 1)],
    [isEn ? 'Nominal Cell Operating Temp (TONC / NOCT) (°C)' : 'TONC / NOCT de los Módulos (°C)', tonc],
    [isEn ? 'Power Temperature Coefficient gamma (%/°C)' : 'Coeficiente de Temperatura de Potencia gamma (%/°C)', '-0,40%/°C'],
    [isEn ? 'Estimated Collector Surface Area (m²)' : 'Superficie de Captación Estimada (m²)', Number(res.energyYield.collectorAreaM2.toFixed(2))],
    [],
    [isEn ? 'ANNUAL ENERGY BALANCE: INCIDENT VS PRODUCED' : 'BALANCE ENERGÉTICO ANUAL: ENERGÍA RECIBIDA VS PRODUCIDA'],
    [isEn ? 'Total Incident Solar Radiation (kWh/yr)' : 'Energía Solar Incidente Total Recibida (kWh/año)', Math.round(res.energyYield.recibida.annualTotalKwh)],
    [isEn ? 'Specific Incident Irradiation (kWh/m²·yr)' : 'Irradiación Específica Anual por Superficie (kWh/m²·año)', Number(res.energyYield.recibida.annualKwhM2.toFixed(2))],
    [isEn ? 'Mean Daily Incident Resource (kWh/m²/day)' : 'Recurso Medio Diario Incidente (kWh/m²/día)', Number(res.energyYield.recibida.meanDailyKwhM2.toFixed(3))],
    [isEn ? 'PV Net Energy Yield - Osterwald Model (kWh/yr)' : 'Energía FV Producida Neta - Modelo Osterwald (kWh/año)', Math.round(res.energyYield.producida.osterwald.annualKwh)],
    [isEn ? 'Specific Productivity Yield (kWh/kWp)' : 'Productividad Específica del Sistema (kWh/kWp)', Math.round(res.energyYield.producida.osterwald.specificYieldKwhKwp)],
    [isEn ? 'Cell Thermal Losses vs STC (kWh/yr)' : 'Pérdidas Térmicas por Calentamiento de Célula vs STC 25°C (kWh/año)', -Math.round(res.energyYield.producida.osterwald.thermalLossKwh)],
    [isEn ? 'Cell Thermal Losses Relative (%)' : 'Pérdidas Térmicas Relativas por Derating (%)', formatPercent(-res.energyYield.producida.osterwald.thermalLossPct, 2)],
    [isEn ? 'PV Energy Yield - Simplified Model (kWh/yr)' : 'Energía FV Producida - Modelo Simplificado PR (kWh/año)', Math.round(res.energyYield.producida.simplified.annualKwh)],
    [],
    [isEn ? 'ACTIVE STUDY SUMMARY' : 'RESUMEN DEL ESTUDIO ACTIVO SELECCIONADO'],
    [isEn ? 'Selected Study' : 'Estudio / Operación Seleccionada', currentStudyTitle],
    [isEn ? 'Evaluated Component' : 'Componente Radiativa Evaluada', activeComp.toUpperCase()],
    [isEn ? 'Optimal Annual Fixed Tilt β (°)' : 'Inclinación Fija Óptima Anual β (°)', optAngle],
    [isEn ? 'CTE DB-HE4 Optimal Orientation β / α (°)' : 'Punto Óptimo Absoluto CTE DB-HE4 (β / α)', `β = ${formatAngle(res.captureLossMap.optimalPoint.betaDeg, 1)} | α = ${formatAngle(res.captureLossMap.optimalPoint.alphaDeg, 1)}`],
    [isEn ? 'Max Daily Radiation at Optimum (kWh/m²/day)' : 'Radiación Diaria Máxima en el Óptimo (kWh/m²/día)', Number(res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3))],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  applySpanishNumberFormattingToWorksheet(wsSummary);
  XLSX.utils.book_append_sheet(wb, wsSummary, isEn ? 'General_Summary' : 'Resumen_General');

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
  applySpanishNumberFormattingToWorksheet(wsRanking);
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
      `${isEn ? 'Tilt' : 'Inclinación'} β = ${formatAngle(res.captureLossMap.optimalPoint.betaDeg, 1)}`,
      `${isEn ? 'Azimuth' : 'Azimut'} α = ${formatAngle(res.captureLossMap.optimalPoint.alphaDeg, 1)}`,
      `${isEn ? 'Maximum Radiation' : 'Radiación Máxima'} = ${formatNum(res.captureLossMap.optimalPoint.maxDailyRadiationKwh, 3)} ${isEn ? 'kWh/m²/day' : 'kWh/m²/d'} (${formatInt(Math.round(res.captureLossMap.optimalPoint.maxAnnualRadiationKwhM2))} ${isEn ? 'kWh/m²·yr' : 'kWh/m²·año'})`,
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
      formatPercent(res.captureLossMap.cteZones.generalPctCompliant, 1),
      isEn ? 'COMPLIANT' : 'CONFORME (Uso General)',
    ],
    [
      isEn ? 'Superposition Limit' : 'Superposición CTE',
      isEn ? 'Loss ≤ 20%' : 'Pérdida ≤ 20%',
      formatPercent(res.captureLossMap.cteZones.superpositionPctCompliant, 1),
      isEn ? 'COMPLIANT' : 'CONFORME (Superposición en cubierta)',
    ],
    [
      isEn ? 'Architectural Integration Limit' : 'Integración Arquitectónica CTE',
      isEn ? 'Loss ≤ 40%' : 'Pérdida ≤ 40%',
      formatPercent(res.captureLossMap.cteZones.integrationPctCompliant, 1),
      isEn ? 'COMPLIANT' : 'CONFORME (Integración total en fachada/cubierta)',
    ],
    [
      isEn ? 'Non-Compliant Zone' : 'Fuera de Norma CTE',
      isEn ? 'Loss > 40%' : 'Pérdida > 40%',
      formatPercent(100 - res.captureLossMap.cteZones.integrationPctCompliant, 1),
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
  applySpanishNumberFormattingToWorksheet(wsCte);
  XLSX.utils.book_append_sheet(wb, wsCte, isEn ? 'CTE_DB_HE4_Losses' : 'Perdidas_CTE_DB-HE4');



  // Standardized File Name: Operación + Emplazamiento + Componente + Timestamp
  const compSuffix = options.exportMode === 'all'
    ? (isEn ? 'All_Components' : 'Todas_las_componentes')
    : activeComp;
  const filename = getStandardizedExcelFilename(activeOp, res.locationName, compSuffix, fileTimestamp);
  XLSX.writeFile(wb, filename);
}
