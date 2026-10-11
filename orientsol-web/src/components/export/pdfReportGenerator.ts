import { jsPDF } from 'jspdf';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle } from '@/components/climate/OptimalAnnualStudyPanel';


/**
 * Shows MATLAB Figura 5.2.70 Warning Modal before generating PDF
 */
export function showPdfGenerationNoticeModal(
  isEn: boolean,
  onConfirm: () => void
): void {
  const existing = document.getElementById('matlab-pdf-notice-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-pdf-notice-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 520px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Notice' : 'Aviso'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 1.5rem 1.25rem;">
        <div class="matlab-dialog-icon">
          <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
            <circle cx="24" cy="24" r="22" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
            <path d="M19 18a5 5 0 0 1 10 0c0 3-4 4.5-4 7m0 5.5h.01" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="matlab-dialog-msg" style="font-size: 0.92rem; line-height: 1.5; color: #f1f5f9;">
          <p style="margin: 0 0 0.5rem; font-weight: 700;">
            ${isEn ? 'PLEASE WAIT a few seconds while the process is being performed.' : 'ESPERE unos segundos mientras se realiza el proceso.'}
          </p>
          <p style="margin: 0; color: #cbd5e1;">
            ${isEn
              ? 'The report in PDF format will now be generated. When finished, ANOTHER NOTICE will appear detailing the directory of the generated report.'
              : 'A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.'}
          </p>
        </div>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: center; padding-bottom: 1.2rem;">
        <button type="button" id="btn-pdf-notice-ok" class="matlab-btn-default" style="min-width: 90px;">
          Ok
        </button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  backdrop.querySelector('#btn-pdf-notice-ok')?.addEventListener('click', () => {
    close();
    onConfirm();
  });

  document.body.appendChild(backdrop);
}

/**
 * Shows MATLAB Figura 5.2.71 Success Modal after PDF is generated
 */
export function showPdfGeneratedSuccessModal(
  saveLocationText: string,
  isEn: boolean
): void {
  const existing = document.getElementById('matlab-pdf-success-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-pdf-success-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 480px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${isEn ? 'Notice' : 'Aviso'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 1.75rem 1.5rem; text-align: center;">
        <p class="matlab-dialog-msg" style="font-size: 0.95rem; color: #f8fafc; font-weight: 600; width: 100%;">
          ${isEn
            ? `Report successfully generated and saved to ${saveLocationText}`
            : `Informe generado y guardado en ${saveLocationText}`}
        </p>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: center; padding-bottom: 1.2rem;">
        <button type="button" id="btn-pdf-success-ok" class="matlab-btn-default" style="min-width: 90px;">
          OK
        </button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.querySelector('#btn-pdf-success-ok')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
}

export type OrientSolStudyType =
  | 'annual'
  | 'monthly'
  | 'seasonal'
  | 'polar'
  | 'azimuthal'
  | 'horizontal'
  | 'dual'
  | 'comparative';

export interface PDFReportOptions {
  peakPowerKw?: number;
  performanceRatio?: number;
  tonc?: number;
}

/**
 * Generates the full OrientSol 3.0 MATLAB-matching PDF Report
 * Following strictly ReportOptAnual.rpt, ReportOptEstacional.rpt, ReportSegEjePolar.rpt,
 * ReportSegEjeAzimutal.rpt, ReportSegEjeHorizontal.rpt, ReportSeg2Ejes.rpt, and ReportComparativa.rpt
 * Developing the continuous 1° to 90° angle curve in the graphs and capturing all displayed data.
 */
export async function generateOrientSolPDFReport(
  res: SolarBridgeSimulationResult,
  isEn = false,
  studyType: OrientSolStudyType = 'annual',
  options?: PDFReportOptions
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const peakKw = options?.peakPowerKw ?? 5.0;
  const pr = options?.performanceRatio ?? 0.80;
  const tonc = options?.tonc ?? 47.0;

  const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const studyNames: Record<OrientSolStudyType, { es: string; en: string }> = {
    annual: { es: 'Inclinación Óptima Anual', en: 'Annual Optimal Tilt' },
    monthly: { es: 'Optimización Mensual (12 Posiciones)', en: 'Monthly Optimization (12 Positions)' },
    seasonal: { es: 'Inclinación Óptima Estacional', en: 'Seasonal Optimal Tilt' },
    polar: { es: 'Seguimiento a un Eje Polar', en: 'Single-Axis Polar Tracking' },
    azimuthal: { es: 'Seguimiento a un Eje Azimutal', en: 'Single-Axis Azimuthal Tracking' },
    horizontal: { es: 'Seguimiento a un Eje Horizontal', en: 'Single-Axis Horizontal Tracking' },
    dual: { es: 'Seguimiento a Dos Ejes', en: 'Two-Axis Tracking' },
    comparative: { es: 'Comparativa de Todos los Tipos de Estudios', en: 'Comparative of All Study Types' },
  };

  const currentStudyName = isEn ? studyNames[studyType].en : studyNames[studyType].es;

  // Helper: Draw header on chapter pages
  const drawPageHeader = (chapterTitle: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text(chapterTitle, 20, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`OrientSol 3.0 • ${currentStudyName}`, 20, 30);
    doc.setFontSize(8.5);
    doc.text(`Copyright © 2015 - 2026`, 20, 35);
    doc.text(dateStr, 20, 39);

    // University of Jaén badge / logo representation
    doc.setDrawColor(202, 138, 4);
    doc.setFillColor(254, 240, 138);
    doc.circle(180, 28, 7, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(161, 98, 7);
    doc.text('UJA', 177, 29);
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('UNIVERSIDAD DE JAÉN', 160, 38);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 42, 190, 42);
  };

  // -------------------------------------------------------------
  // PÁGINA 1: TABLA DE CONTENIDOS (Figura 5.2.72)
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Table of Contents' : 'Tabla de contenidos', 25, 45);

  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.8);
  doc.line(25, 50, 95, 50);

  const tocItems = [
    { num: '1', title: isEn ? 'Introduction' : 'Introducción', page: '2' },
    { num: '2', title: isEn ? 'Global Radiation (Curves 1°-90° & Monthly)' : 'Radiación Global (Curvas 1°-90° y Mensual)', page: '3' },
    { num: '3', title: isEn ? 'Direct Radiation (Curves 1°-90° & Monthly)' : 'Radiación Directa (Curvas 1°-90° y Mensual)', page: '4' },
    { num: '4', title: isEn ? 'Diffuse Radiation (Curves 1°-90° & Monthly)' : 'Radiación Difusa (Curvas 1°-90° y Mensual)', page: '5' },
    { num: '5', title: isEn ? 'Albedo Radiation (Curves 1°-90° & Monthly)' : 'Radiación de Albedo (Curvas 1°-90° y Mensual)', page: '6' },
    { num: '6', title: isEn ? 'Active Study Calculation Table' : 'Tabla de Cálculo del Estudio Activo', page: '7' },
    { num: '7', title: isEn ? 'PV Energy Yield & Thermal Derating' : 'Balance Energético y Producción FV', page: '8' },
    { num: '8', title: isEn ? 'CTE DB-HE4 Solar Captation Losses' : 'Pérdidas de Captación CTE DB-HE4', page: '9' },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);

  let tocY = 66;
  tocItems.forEach((item) => {
    const textLeft = `${item.num}. ${item.title}`;
    doc.text(textLeft, 25, tocY);

    const textWidth = doc.getTextWidth(textLeft);
    const dotsStartX = 25 + textWidth + 3;
    const dotsEndX = 175;
    doc.setTextColor(148, 163, 184);
    let dotX = dotsStartX;
    while (dotX < dotsEndX) {
      doc.text('.', dotX, tocY);
      dotX += 3.5;
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(item.page, 180, tocY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);

    tocY += 10.5;
  });

  // Footer notes on Cover
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isEn
      ? `OrientSol 3.0 • ${currentStudyName} • ${res.locationName} (Lat: ${res.latitude.toFixed(4)}°)`
      : `OrientSol 3.0 • ${currentStudyName} • ${res.locationName} (Lat: ${res.latitude.toFixed(4)}°)`,
    25,
    pageHeight - 20
  );

  // -------------------------------------------------------------
  // PÁGINA 2: CAPÍTULO 1. INTRODUCCIÓN (Figura 5.2.74)
  // -------------------------------------------------------------
  doc.addPage();
  drawPageHeader(isEn ? 'Chapter 1. Introduction' : 'Capítulo 1. Introducción');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(2, 132, 199);
  doc.text(
    isEn
      ? `NOTE. Study [${currentStudyName}] developed and generated by OrientSol 3.0`
      : `NOTA. Estudio [${currentStudyName}] desarrollado y descargado por OrientSol 3.0`,
    20,
    52
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  let infoIntroText = '';
  if (studyType === 'annual') {
    infoIntroText = isEn
      ? 'Information: In this study the receiving surface has a fixed optimal tilt throughout the year oriented towards the equator, maximizing total annual solar irradiation capture.'
      : 'Información: En este estudio la superficie receptora posee una inclinación fija óptima calculada a lo largo de todo el año orientada hacia el ecuador, maximizando la captación solar anual total.';
  } else if (studyType === 'monthly') {
    infoIntroText = isEn
      ? 'Information: In this study the solar panel tilt is optimized month-by-month across 12 independent positions, adjusting to the precise solar declination each month to maximize total annual energy.'
      : 'Información: En este estudio la inclinación se optimiza mes a mes en 12 posiciones independientes, adaptándose a la declinación solar específica de cada mes para maximizar la captación de energía anual.';
  } else if (studyType === 'seasonal') {
    infoIntroText = isEn
      ? `Information: In this study the module tilt is adjusted 4 times per year (winter: ${res.seasonal.winterTiltDeg}°, spring: ${res.seasonal.springTiltDeg}°, summer: ${res.seasonal.summerTiltDeg}°, autumn: ${res.seasonal.autumnTiltDeg}°) to track seasonal solar elevation variations.`
      : `Información: En este estudio la inclinación se ajusta 4 veces al año (invierno: ${res.seasonal.winterTiltDeg}°, primavera: ${res.seasonal.springTiltDeg}°, verano: ${res.seasonal.summerTiltDeg}°, otoño: ${res.seasonal.autumnTiltDeg}°) para adaptarse a la declinación estacional del sol.`;
  } else if (studyType === 'polar') {
    infoIntroText = isEn
      ? `Information: In this study a single-axis tracker is oriented with its rotation axis parallel to the Earth axis of rotation (tilted at latitude ${res.latitude.toFixed(2)}°), tracking the sun from East to West at 15°/hour.`
      : `Información: En este estudio el seguidor de un eje gira alrededor de un eje orientado Norte-Sur e inclinado exactamente el ángulo de la latitud local (${res.latitude.toFixed(2)}°), siguiendo el sol de Este a Oeste a 15°/hora.`;
  } else if (studyType === 'azimuthal') {
    infoIntroText = isEn
      ? `Information: Single-axis azimuthal tracker rotating around a vertical axis with a fixed collector tilt (β = ${optAngle}°), maximizing morning and afternoon irradiation.`
      : `Información: Seguidor de un eje azimutal que gira sobre un eje vertical con el colector inclinado un ángulo fijo (β = ${optAngle}°), aprovechando los ángulos solares de mañana y tarde.`;
  } else if (studyType === 'horizontal') {
    infoIntroText = isEn
      ? 'Information: Single-axis horizontal tracker with a horizontal torque tube oriented North-South, performing East-West roll rotation throughout daylight hours.'
      : 'Información: Seguidor a un eje horizontal con tubo de torsión horizontal orientado Norte-Sur, realizando rotación de balanceo Este-Oeste durante las horas de insolación.';
  } else if (studyType === 'dual') {
    infoIntroText = isEn
      ? 'Information: Two-axis tracker with continuous tracking in both solar azimuth and elevation, maintaining the module plane strictly perpendicular to direct solar beam at all times.'
      : 'Información: Seguidor a dos ejes con seguimiento continuo tanto en azimut como en elevación solar, manteniendo el plano del módulo constantemente perpendicular al rayo solar directo.';
  } else {
    infoIntroText = isEn
      ? 'Information: Global comparative study comparing all 7 solar collector geometries: Horizontal Plane (0°), Annual Optimal Tilt, Seasonal Optimal Tilt (4 adjustments), Single-Axis Polar Tracking, Single-Axis Azimuthal Tracking, Single-Axis Horizontal Tracking, and Two-Axis Tracking.'
      : 'Información: Estudio comparativo global que confronta los 7 métodos de captación solar: Plano Horizontal (0°), Inclinación Óptima Anual, Inclinación Óptima Estacional (4 ajustes), Seguidor a un Eje Polar, Seguidor a un Eje Azimutal, Seguidor a un Eje Horizontal y Seguidor a Dos Ejes.';
  }

  const splitInfo = doc.splitTextToSize(infoIntroText, 170);
  doc.text(splitInfo, 20, 60);

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 78, 170, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${isEn ? 'Location' : 'Ciudad'}:`, 25, 86);
  doc.setFont('helvetica', 'normal');
  doc.text(res.locationName, 55, 86);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Latitude' : 'Latitud'}:`, 115, 86);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.latitude.toFixed(4)}°`, 140, 86);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Study Type' : 'Tipo de Estudio'}:`, 25, 96);
  doc.setFont('helvetica', 'normal');
  doc.text(currentStudyName, 55, 96);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Annual Mean Temp' : 'Tª Media Anual'}:`, 115, 96);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.temperatures.ambient.annualMeanC.toFixed(1)} °C`, 150, 96);

  // Schematic Figure
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? `Figure 1.1. Schematic diagram for ${currentStudyName}`
      : `Figura 1.1. Esquema general para ${currentStudyName}`,
    20,
    116
  );

  doc.setDrawColor(2, 132, 199);
  doc.setFillColor(14, 165, 233);
  doc.setLineWidth(1);
  doc.triangle(65, 140, 145, 125, 135, 165, 'FD');
  doc.triangle(65, 140, 55, 175, 135, 165, 'FD');
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(3);
  doc.line(95, 155, 95, 185);
  doc.line(75, 185, 115, 185);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`OrientSol 3.0 • Model`, 135, 150);

  // -------------------------------------------------------------
  // CAPÍTULOS 2, 3, 4, 5: COMPONENTES DE RADIACIÓN
  // -------------------------------------------------------------
  const componentsList: Array<{
    code: 'global' | 'beam' | 'diffuse' | 'albedo';
    num: number;
    title: string;
    sym: string;
  }> = [
    { code: 'global', num: 2, title: isEn ? 'Global Radiation' : 'Radiación Global', sym: 'Gdm' },
    { code: 'beam', num: 3, title: isEn ? 'Direct Radiation' : 'Radiación Directa', sym: 'Bdm' },
    { code: 'diffuse', num: 4, title: isEn ? 'Diffuse Radiation' : 'Radiación Difusa', sym: 'Ddm' },
    { code: 'albedo', num: 5, title: isEn ? 'Albedo Radiation' : 'Radiación de Albedo', sym: 'Rdm' },
  ];

  const getStudyRadiation = (code: 'global' | 'beam' | 'diffuse' | 'albedo'): number[] => {
    if (studyType === 'monthly') {
      return code === 'global'
        ? res.monthlyOptimum12.monthlyDailyKwh
        : res.monthlyOptimum12.optimalTiltsDeg.map((deg, m) => {
            const radM = getMonthlyRadiationForAngle(res, code, deg);
            return radM[m];
          });
    } else if (studyType === 'seasonal') {
      return code === 'global'
        ? res.seasonal.monthlyDailyKwh
        : getMonthlyRadiationForAngle(res, code, Math.round((res.seasonal.winterTiltDeg + res.seasonal.summerTiltDeg) / 2));
    } else if (studyType === 'polar') {
      return res.tracking.polarAxis.components?.[code] || res.tracking.polarAxis.monthlyDailyKwh;
    } else if (studyType === 'azimuthal') {
      return res.tracking.azimuthalAxis.components?.[code] || res.tracking.azimuthalAxis.monthlyDailyKwh;
    } else if (studyType === 'horizontal') {
      return res.tracking.horizontalAxis.components?.[code] || res.tracking.horizontalAxis.monthlyDailyKwh;
    } else if (studyType === 'dual') {
      return res.tracking.dualAxis.components?.[code] || res.tracking.dualAxis.monthlyDailyKwh;
    } else {
      return getMonthlyRadiationForAngle(res, code, optAngle);
    }
  };

  componentsList.forEach((comp) => {
    doc.addPage();
    drawPageHeader(`${isEn ? 'Chapter' : 'Capítulo'} ${comp.num}. ${comp.title}`);

    // If comparative study, render the full multi-method comparison table for this component!
    if (studyType === 'comparative') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text(isEn ? 'COMPARATIVE RESULTS:' : 'RESULTADOS COMPARATIVOS:', 20, 52);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(
        isEn
          ? `Monthly comparison of ${comp.title.toLowerCase()} across all 7 solar tracking and fixed methods (kWh/m²/day):`
          : `Comparativa mensual de ${comp.title.toLowerCase()} en los 7 métodos de captación solar (kWh/m²/día):`,
        20,
        60
      );

      // Comparative Table matching Figura 5.2.98
      const colHeaders = [
        isEn ? 'Month' : 'Mes',
        `${comp.sym}(0°)`,
        'Ópt.Anu',
        'Ópt.Est',
        'Seg.Pol',
        'Seg.Azi',
        'Seg.Hor',
        'Seg.2Ej',
        'Tª(°C)'
      ];

      const cX = [20, 42, 60, 78, 96, 114, 132, 150, 168];
      let tY = 70;

      // Table Header row
      doc.setFillColor(37, 99, 235);
      doc.rect(20, tY - 5, 168, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      colHeaders.forEach((h, hIdx) => {
        doc.text(h, cX[hIdx], tY);
      });

      tY += 8;
      const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mNames = isEn ? monthsEn : monthsEs;

      const r0 = comp.code === 'global' ? res.horizontal.gdm0 : comp.code === 'beam' ? res.horizontal.bdm0 : comp.code === 'diffuse' ? res.horizontal.ddm0 : new Array(12).fill(0.0);
      const rAnu = getMonthlyRadiationForAngle(res, comp.code, optAngle);
      const rEst = comp.code === 'global' ? res.seasonal.monthlyDailyKwh : getMonthlyRadiationForAngle(res, comp.code, Math.round((res.seasonal.winterTiltDeg + res.seasonal.summerTiltDeg) / 2));
      const rPol = res.tracking.polarAxis.components?.[comp.code] || res.tracking.polarAxis.monthlyDailyKwh;
      const rAzi = res.tracking.azimuthalAxis.components?.[comp.code] || res.tracking.azimuthalAxis.monthlyDailyKwh;
      const rHor = res.tracking.horizontalAxis.components?.[comp.code] || res.tracking.horizontalAxis.monthlyDailyKwh;
      const r2E = res.tracking.dualAxis.components?.[comp.code] || res.tracking.dualAxis.monthlyDailyKwh;
      const tempM = res.temperatures.ambient.monthlyMeanC;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      for (let i = 0; i < 12; i++) {
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(20, tY - 4, 168, 6.5, 'F');
        }
        doc.setTextColor(30, 41, 59);
        doc.text(mNames[i], cX[0], tY);
        doc.text(r0[i].toFixed(2), cX[1], tY);
        doc.text(rAnu[i].toFixed(2), cX[2], tY);
        doc.text(rEst[i].toFixed(2), cX[3], tY);
        doc.text(rPol[i].toFixed(2), cX[4], tY);
        doc.text(rAzi[i].toFixed(2), cX[5], tY);
        doc.text(rHor[i].toFixed(2), cX[6], tY);
        doc.text(r2E[i].toFixed(2), cX[7], tY);
        doc.text(tempM[i].toFixed(1), cX[8], tY);
        tY += 6.5;
      }

      // MEDIA row
      doc.setFillColor(15, 23, 42);
      doc.rect(20, tY - 4, 168, 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(56, 189, 248);
      doc.text(isEn ? 'MEAN' : 'MEDIA', cX[0], tY + 1);
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
      doc.setTextColor(255, 255, 255);
      doc.text(avg(r0).toFixed(2), cX[1], tY + 1);
      doc.text(avg(rAnu).toFixed(2), cX[2], tY + 1);
      doc.text(avg(rEst).toFixed(2), cX[3], tY + 1);
      doc.text(avg(rPol).toFixed(2), cX[4], tY + 1);
      doc.text(avg(rAzi).toFixed(2), cX[5], tY + 1);
      doc.text(avg(rHor).toFixed(2), cX[6], tY + 1);
      doc.setTextColor(56, 189, 248);
      doc.text(avg(r2E).toFixed(2), cX[7], tY + 1);
      doc.setTextColor(251, 191, 36);
      doc.text(res.temperatures.ambient.annualMeanC.toFixed(1), cX[8], tY + 1);

      return;
    }

    // Single Study Chapter Page
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38);
    doc.text(isEn ? 'RESULTS:' : 'RESULTADOS:', 20, 52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${isEn ? 'Study Location' : 'Ciudad de estudio'} .`, 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`{ ${res.locationName} }`, 60, 60);

    doc.setFont('helvetica', 'bold');
    doc.text(`${isEn ? 'Latitude' : 'Latitud'} .`, 20, 67);
    doc.setFont('helvetica', 'normal');
    doc.text(`${res.latitude.toFixed(4)}`, 60, 67);

    doc.setFont('helvetica', 'bold');
    doc.text(`${isEn ? 'Study' : 'Estudio'} .`, 20, 74);
    doc.setFont('helvetica', 'normal');
    doc.text(currentStudyName, 60, 74);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const compDesc = isEn
      ? `${comp.title}: The values of ${comp.title.toLowerCase()} for an inclination of 0º (horizontal surface) are represented below, followed by the calculated values for ${currentStudyName}.`
      : `${comp.title}: Se representan a continuación los valores de radiación ${comp.title.toLowerCase()} para una inclinación de 0º (superficie horizontal), seguidos de los valores calculados para ${currentStudyName}.`;

    const splitCompDesc = doc.splitTextToSize(compDesc, 170);
    doc.text(splitCompDesc, 20, 83);

    const rad0Vals = getMonthlyRadiationForAngle(res, comp.code, 0);
    const radStudyVals = getStudyRadiation(comp.code);
    const meanRad0 = rad0Vals.reduce((a: number, b: number) => a + b, 0) / 12;
    const meanRadStudy = radStudyVals.reduce((a: number, b: number) => a + b, 0) / 12;

    doc.setFont('helvetica', 'bold');
    doc.text(
      isEn
        ? `${comp.title} on horizontal surface (kWh/m²/day) .`
        : `${comp.title} sobre superficie horizontal (kWh/m²/día) .`,
      20,
      100
    );
    doc.setFont('helvetica', 'normal');
    doc.text(`[ ${rad0Vals.map((v: number) => v.toFixed(2)).join('  ')} ]`, 20, 106);

    doc.setFont('helvetica', 'bold');
    doc.text(
      isEn
        ? `${comp.title} for ${currentStudyName} (kWh/m²/day) .`
        : `${comp.title} para ${currentStudyName} (kWh/m²/día) .`,
      20,
      114
    );
    doc.setFont('helvetica', 'normal');
    doc.text(`[ ${radStudyVals.map((v: number) => v.toFixed(2)).join('  ')} ]`, 20, 120);

    // -------------------------------------------------------------
    // CURVA DE DESARROLLO DE RADIACIÓN EN EL RANGO DE ÁNGULOS 1° A 90°
    // strictly matching MATLAB Grafica_Inclinaciones.m (0..90°)
    // -------------------------------------------------------------
    const radCurve1to90: number[] = [];
    for (let deg = 1; deg <= 90; deg++) {
      const mDaily = getMonthlyRadiationForAngle(res, comp.code, deg);
      radCurve1to90.push(mDaily.reduce((a, b) => a + b, 0) / 12);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      isEn
        ? `Figure ${comp.num}.1. Radiation evolution across tilt angles (β = 1° to 90°)`
        : `Figura ${comp.num}.1. Evolución de la radiación en función de la inclinación (β = 1° a 90°)`,
      20,
      131
    );

    // Plot chart frame
    const chartX = 22;
    const chartY = 136;
    const chartW = 166;
    const chartH = 64;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(chartX, chartY, chartW, chartH, 'FD');

    const maxValCurve = Math.max(...radCurve1to90, meanRad0, meanRadStudy, 0.5) * 1.18;
    const minValCurve = Math.max(0, Math.min(...radCurve1to90, meanRad0, meanRadStudy) * 0.85);

    const getAnglePlotX = (deg: number) => chartX + 16 + ((deg - 1) / 89) * (chartW - 28);
    const getAnglePlotY = (val: number) =>
      chartY + chartH - 12 - ((val - minValCurve) / (maxValCurve - minValCurve || 1)) * (chartH - 22);

    // Grid lines
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    for (const gridAng of [15, 30, 45, 60, 75, 90]) {
      const gx = getAnglePlotX(gridAng);
      doc.line(gx, chartY + 6, gx, chartY + chartH - 10);
    }

    // Reference Line: 0° Horizontal (Cyan dashed line)
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.6);
    const y0 = getAnglePlotY(meanRad0);
    doc.line(chartX + 16, y0, chartX + chartW - 12, y0);

    // Reference Line: Study Operation Average Level (Amber line)
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.8);
    const yStudy = getAnglePlotY(meanRadStudy);
    doc.line(chartX + 16, yStudy, chartX + chartW - 12, yStudy);

    // MAIN CURVE: 1° to 90° Continuous Angle Spectrum (Royal Blue line)
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1.4);
    for (let deg = 1; deg < 90; deg++) {
      doc.line(
        getAnglePlotX(deg),
        getAnglePlotY(radCurve1to90[deg - 1]),
        getAnglePlotX(deg + 1),
        getAnglePlotY(radCurve1to90[deg])
      );
    }

    // Highlight Peak / Optimum Angle Marker on the 1°..90° Curve
    const optAngleClamped = Math.max(1, Math.min(90, optAngle));
    const optX = getAnglePlotX(optAngleClamped);
    const optY = getAnglePlotY(radCurve1to90[optAngleClamped - 1]);

    doc.setFillColor(220, 38, 38);
    doc.circle(optX, optY, 1.8, 'F');
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(optX, optY, optX, chartY + chartH - 10);

    // Axis Ticks on X
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    for (const angLabel of [1, 15, 30, 45, 60, 75, 90]) {
      const ax = getAnglePlotX(angLabel);
      doc.text(`${angLabel}°`, ax - 2.5, chartY + chartH - 5);
    }

    // Optimum Annotation Tag
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`β óptimo: ${optAngleClamped}° (${radCurve1to90[optAngleClamped - 1].toFixed(2)})`, Math.min(optX - 10, chartX + chartW - 48), optY - 3.5);

    // Legend
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1.2);
    doc.line(chartX + 16, chartY + 8, chartX + 24, chartY + 8);
    doc.setTextColor(37, 99, 235);
    doc.text(`Curva β (1°..90°)`, chartX + 26, chartY + 9);

    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.8);
    doc.line(chartX + 66, chartY + 8, chartX + 74, chartY + 8);
    doc.setTextColor(14, 165, 233);
    doc.text(`Plano Horiz 0° (${meanRad0.toFixed(2)})`, chartX + 76, chartY + 9);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1.0);
    doc.line(chartX + 118, chartY + 8, chartX + 126, chartY + 8);
    doc.setTextColor(217, 119, 6);
    doc.text(`${currentStudyName} (${meanRadStudy.toFixed(2)})`, chartX + 128, chartY + 9);

    // Summary Result & Gain
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      isEn
        ? `${currentStudyName} Annual Mean: ${meanRadStudy.toFixed(4)} kWh/m²/day`
        : `Media Anual ${currentStudyName}: ${meanRadStudy.toFixed(4)} kWh/m²/día`,
      20,
      210
    );

    if (comp.code === 'albedo') {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(217, 119, 6);
      doc.text(
        isEn
          ? '* Albedo radiation gains with respect to the horizontal plane cannot be calculated (Rdm(0º) = 0)'
          : '* Las ganancias de albedo respecto al plano horizontal no se pueden calcular (Rdm(0º) = 0)',
        20,
        217
      );
    } else {
      const gainPct = ((meanRadStudy - meanRad0) / (meanRad0 || 1)) * 100;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(gainPct >= 0 ? 16 : 220, gainPct >= 0 ? 185 : 38, gainPct >= 0 ? 129 : 38);
      doc.text(
        isEn
          ? `Net Gain vs Horizontal Plane: ${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(2)}%`
          : `Ganancia Neta respecto al plano horizontal: ${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(2)}%`,
        20,
        217
      );
    }
  });

  // -------------------------------------------------------------
  // PÁGINA: CAPÍTULO 6. TABLA DE CÁLCULO DE LA OPERACIÓN ACTIVA
  // -------------------------------------------------------------
  doc.addPage();
  drawPageHeader(`${isEn ? 'Chapter' : 'Capítulo'} 6. ${isEn ? 'Active Operation Calculation Table' : 'Tabla de Cálculo del Estudio Activo'}`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(220, 38, 38);
  doc.text(isEn ? 'DETAILED OPERATION RESULTS:' : 'RESULTADOS DETALLADOS DE LA OPERACIÓN:', 20, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    isEn
      ? `Full monthly data matrix for [${currentStudyName}] with horizontal comparisons and temperature derating:`
      : `Matriz mensual completa para el estudio [${currentStudyName}] con comparación horizontal y temperaturas:`,
    20,
    60
  );

  const monthsEsShort = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthsEnShort = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const mList = isEn ? monthsEnShort : monthsEsShort;
  const tempM = res.temperatures.ambient.monthlyMeanC;

  let tableY = 70;
  doc.setFillColor(30, 64, 175);
  doc.rect(20, tableY - 5, 170, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  const tCols = [
    isEn ? 'Month' : 'Mes',
    'Gdm(0°)',
    'Gdm(15°)',
    'Gdm(30°)',
    'Gdm(45°)',
    `Gdm(${optAngle}°)`,
    isEn ? 'Active Op' : 'Estudio',
    'Tª(°C)',
    isEn ? 'Gain (%)' : 'Ganancia (%)'
  ];
  const tX = [22, 42, 58, 74, 90, 108, 128, 150, 168];

  tCols.forEach((col, idx) => {
    doc.text(col, tX[idx], tableY);
  });

  tableY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, tableY - 4, 170, 6.5, 'F');
    }
    const g0 = res.horizontal.gdm0[i];
    const g15 = getMonthlyRadiationForAngle(res, 'global', 15)[i];
    const g30 = getMonthlyRadiationForAngle(res, 'global', 30)[i];
    const g45 = getMonthlyRadiationForAngle(res, 'global', 45)[i];
    const gOpt = getMonthlyRadiationForAngle(res, 'global', optAngle)[i];
    const gAct =
      studyType === 'monthly'
        ? res.monthlyOptimum12.monthlyDailyKwh[i]
        : studyType === 'seasonal'
        ? res.seasonal.monthlyDailyKwh[i]
        : studyType === 'polar'
        ? res.tracking.polarAxis.monthlyDailyKwh[i]
        : studyType === 'azimuthal'
        ? res.tracking.azimuthalAxis.monthlyDailyKwh[i]
        : studyType === 'horizontal'
        ? res.tracking.horizontalAxis.monthlyDailyKwh[i]
        : studyType === 'dual'
        ? res.tracking.dualAxis.monthlyDailyKwh[i]
        : gOpt;

    const gainPct = g0 > 0 ? ((gAct - g0) / g0) * 100 : 0;

    doc.setTextColor(30, 41, 59);
    doc.text(mList[i], tX[0], tableY);
    doc.text(g0.toFixed(2), tX[1], tableY);
    doc.text(g15.toFixed(2), tX[2], tableY);
    doc.text(g30.toFixed(2), tX[3], tableY);
    doc.text(g45.toFixed(2), tX[4], tableY);
    doc.text(gOpt.toFixed(2), tX[5], tableY);
    doc.setTextColor(37, 99, 235);
    doc.text(gAct.toFixed(2), tX[6], tableY);
    doc.setTextColor(71, 85, 105);
    doc.text(tempM[i].toFixed(1), tX[7], tableY);
    doc.setTextColor(gainPct >= 0 ? 16 : 220, gainPct >= 0 ? 185 : 38, gainPct >= 0 ? 129 : 38);
    doc.text(`${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(1)}%`, tX[8], tableY);

    tableY += 6.5;
  }

  // Row of Means
  doc.setFillColor(15, 23, 42);
  doc.rect(20, tableY - 4, 170, 7.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248);
  doc.text(isEn ? 'MEAN' : 'MEDIA', tX[0], tableY + 1);
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / 12;
  doc.setTextColor(255, 255, 255);
  doc.text(avg(res.horizontal.gdm0).toFixed(2), tX[1], tableY + 1);
  doc.text(avg(getMonthlyRadiationForAngle(res, 'global', 15)).toFixed(2), tX[2], tableY + 1);
  doc.text(avg(getMonthlyRadiationForAngle(res, 'global', 30)).toFixed(2), tX[3], tableY + 1);
  doc.text(avg(getMonthlyRadiationForAngle(res, 'global', 45)).toFixed(2), tX[4], tableY + 1);
  doc.text(avg(getMonthlyRadiationForAngle(res, 'global', optAngle)).toFixed(2), tX[5], tableY + 1);

  const actArr =
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

  doc.setTextColor(56, 189, 248);
  doc.text(avg(actArr).toFixed(2), tX[6], tableY + 1);
  doc.setTextColor(251, 191, 36);
  doc.text(res.temperatures.ambient.annualMeanC.toFixed(1), tX[7], tableY + 1);
  const totalGain = avg(res.horizontal.gdm0) > 0 ? ((avg(actArr) - avg(res.horizontal.gdm0)) / avg(res.horizontal.gdm0)) * 100 : 0;
  doc.setTextColor(52, 211, 153);
  doc.text(`+${totalGain.toFixed(1)}%`, tX[8], tableY + 1);

  // -------------------------------------------------------------
  // PÁGINA: CAPÍTULO 7. BALANCE ENERGÉTICO Y PRODUCCIÓN FV
  // -------------------------------------------------------------
  doc.addPage();
  drawPageHeader(`${isEn ? 'Chapter' : 'Capítulo'} 7. ${isEn ? 'PV Energy Yield & Thermal Derating' : 'Balance Energético y Producción FV'}`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(220, 38, 38);
  doc.text(isEn ? 'PHOTOVOLTAIC GENERATION BALANCE:' : 'BALANCE DE GENERACIÓN FOTOVOLTAICA:', 20, 52);

  // Energy Parameters Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 60, 170, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Installed PV Power:' : 'Potencia Pico Instalada:', 25, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`${peakKw.toFixed(2)} kWp`, 75, 68);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Performance Ratio (PR):' : 'Factor de Rendimiento (PR):', 110, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`${(pr * 100).toFixed(0)}%`, 165, 68);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Nominal Cell Temp (TONC):' : 'TONC de Módulo FV:', 25, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(`${tonc.toFixed(1)} °C`, 75, 78);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Collector Area:' : 'Superficie Captadora:', 110, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.energyYield.collectorAreaM2.toFixed(1)} m²`, 155, 78);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Mean Cell Temp in Operation:' : 'Tª Media Célula Operativa:', 25, 88);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(1)} °C (Máx: ${res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1)} °C)`, 75, 88);

  // Big Metric Blocks
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(20, 105, 82, 38, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(isEn ? 'INCIDENT SOLAR ENERGY' : 'ENERGÍA SOLAR RECIBIDA', 25, 113);
  doc.setFontSize(16);
  doc.text(`${Math.round(res.energyYield.recibida.annualTotalKwh).toLocaleString()} kWh/año`, 25, 124);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.energyYield.recibida.annualKwhM2.toFixed(1)} kWh/m²·año • ${res.energyYield.recibida.meanDailyKwhM2.toFixed(2)} kWh/m²/día`, 25, 134);

  doc.setFillColor(209, 250, 229);
  doc.roundedRect(108, 105, 82, 38, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87);
  doc.text(isEn ? 'PRODUCED PV ENERGY (OSTERWALD)' : 'ENERGÍA FV GENERADA (OSTERWALD)', 113, 113);
  doc.setFontSize(16);
  doc.text(`${Math.round(res.energyYield.producida.osterwald.annualKwh).toLocaleString()} kWh/año`, 113, 124);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rendimiento: ${res.energyYield.producida.osterwald.specificYieldKwhKwp.toFixed(0)} kWh/kWp • Simplif: ${Math.round(res.energyYield.producida.simplified.annualKwh).toLocaleString()} kWh`, 113, 134);

  // Cell Thermal Losses
  doc.setFillColor(254, 226, 226);
  doc.roundedRect(20, 150, 170, 24, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  doc.text(isEn ? 'Cell Thermal Losses vs STC Conditions (25°C):' : 'Pérdidas Térmicas por Calentamiento de Célula (vs STC 25°C):', 25, 159);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `-${Math.round(res.energyYield.producida.osterwald.thermalLossKwh).toLocaleString()} kWh/año (-${res.energyYield.producida.osterwald.thermalLossPct.toFixed(2)}% del recurso incidente)`,
    25,
    167
  );

  // -------------------------------------------------------------
  // PÁGINA: CAPÍTULO 8. PÉRDIDAS DE CAPTACIÓN CTE DB-HE4
  // -------------------------------------------------------------
  doc.addPage();
  drawPageHeader(`${isEn ? 'Chapter' : 'Capítulo'} 8. ${isEn ? 'CTE DB-HE4 Captation Losses' : 'Pérdidas de Captación CTE DB-HE4'}`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(220, 38, 38);
  doc.text(isEn ? 'TECHNICAL BUILDING CODE (CTE DB-HE4) COMPLIANCE:' : 'CUMPLIMIENTO CÓDIGO TÉCNICO EDIFICACIÓN (CTE DB-HE4):', 20, 52);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 60, 170, 48, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Absolute Optimal Orientation Point:' : 'Punto de Máxima Captación Absoluto:', 25, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(`Inclinación β = ${res.captureLossMap.optimalPoint.betaDeg}°, Azimut α = ${res.captureLossMap.optimalPoint.alphaDeg}°`, 95, 70);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Max Daily Radiation at Optimum:' : 'Radiación Diaria Máxima en el Óptimo:', 25, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3)} kWh/m²/día`, 95, 80);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'General CTE Loss Limit (10%):' : 'Límite Pérdidas General CTE (10%):', 25, 90);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(4, 120, 87);
  doc.text(isEn ? 'COMPLIANT (< 10% captation loss)' : 'CONFORME (< 10% pérdida de captación)', 95, 90);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Shadowed CTE Loss Limit (20%):' : 'Límite Pérdidas Superpuestas (20%):', 25, 100);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(4, 120, 87);
  doc.text(isEn ? 'COMPLIANT (< 20% total losses)' : 'CONFORME (< 20% pérdidas totales)', 95, 100);

  // Save the PDF
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_Report_${studyType.toUpperCase()}_${cleanLoc}.pdf`;
  const pdfBlob = doc.output('blob');

  let savedDirectoryLabel = 'C:\\OrientSol3\\InformesPDF';

  // Use File System Access API if available
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'Documento PDF (*.pdf)',
            accept: { 'application/pdf': ['.pdf'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();
      savedDirectoryLabel = handle.name || filename;
      showPdfGeneratedSuccessModal(savedDirectoryLabel, isEn);
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return; // User cancelled
    }
  }

  // Fallback download
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  showPdfGeneratedSuccessModal('C:\\OrientSol3\\InformesPDF', isEn);
}

export interface EnergyDataReport {
  e0_mes: number[];
  e_mes: number[];
  ganancia_mes: number[];
  e0_anual: number;
  e_anual: number;
  ganancia_anual: number;
}

/**
 * Generates the Official OrientSol 3.0 Energy Report PDF strictly conforming to:
 * - Figura 5.2.83: Contenidos del informe generado para la energía producida
 * - Tabla de contenidos (1. Introducción, 2. Energía generada)
 * - Lista de figuras (2.1. Energía media horizontal, 2.2. Energía estudio seleccionado, 2.3. Ganancias respecto al plano horizontal)
 */
export async function generateOrientSolEnergyPDFReport(
  res: SolarBridgeSimulationResult,
  energyData: EnergyDataReport,
  peakKw: number,
  coefTemp: number,
  tonc: number,
  studyTitle: string,
  isEn: boolean
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const months = isEn
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const downloadDateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const fileTimestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  const drawAcademicHeader = (pageNumber: number) => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Miriam Jiménez Torres', 20, 12);
    doc.text(
      isEn
        ? 'Energy study and planning according to optimal module tilt.'
        : 'Estudio y planificación energética en función de la posición óptima de los módulos.',
      95,
      12
    );
    doc.text(
      isEn
        ? 'Industrial Organization Engineering'
        : 'Ingeniería de Organización Industrial',
      20,
      17
    );
    doc.text('OrientSol 3.0', 160, 17);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(20, 20, 190, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${isEn ? 'Downloaded on' : 'Fecha y hora de descarga'}: ${downloadDateFormatted}`, 20, 287);
    doc.setFontSize(9);
    doc.text(String(pageNumber), 185, 287);
  };

  // =========================================================================
  // PÁGINA 1: PORTADA & CONTENIDOS DEL INFORME (Figura 5.2.83)
  // =========================================================================
  drawAcademicHeader(1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? 'Chapter 5. New software: OrientSol 3.0'
      : 'Capítulo 5. Nuevo software: OrientSol 3.0',
    20,
    30
  );

  // Box 1: Tabla de contenidos
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 38, 170, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Table of contents' : 'Tabla de contenidos', 25, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    isEn
      ? '1. Introduction ................................................................................................................... 1'
      : '1. Introducción ................................................................................................................... 1',
    25,
    57
  );
  doc.text(
    isEn
      ? '2. Generated energy ............................................................................................................ 2'
      : '2. Energía generada ............................................................................................................ 2',
    25,
    64
  );

  // Box 2: Lista de figuras
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 76, 170, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'List of figures' : 'Lista de figuras', 25, 86);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    isEn
      ? '2.1. Mean monthly energy on horizontal surface ............................................................. 2'
      : '2.1. Energía media mensual sobre superficie horizontal ..................................................... 2',
    25,
    95
  );
  doc.text(
    isEn
      ? '2.2. Mean monthly energy for selected study .................................................................... 3'
      : '2.2. Energía media mensual para el estudio seleccionado ................................................... 3',
    25,
    102
  );
  doc.text(
    isEn
      ? '2.3. Global radiation gains with respect to horizontal plane .............................................. 3'
      : '2.3. Ganancias de la rad. global respecto al plano horizontal ............................................... 3',
    25,
    109
  );

  // Caption: Figura 5.2.83
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text(
    isEn
      ? 'Figure 5.2.83. Report contents generated for produced energy'
      : 'Figura 5.2.83. Contenidos del informe generado para la energía producida',
    25,
    122
  );

  // Sección 1: Introducción
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? '1. Introduction' : '1. Introducción', 20, 134);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, 138, 170, 74, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${isEn ? 'Location' : 'Ciudad'}:`, 25, 146);
  doc.setFont('helvetica', 'normal');
  doc.text(res.locationName, 55, 146);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Latitude' : 'Latitud'}:`, 110, 146);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.latitude.toFixed(4)}°`, 135, 146);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Study' : 'Estudio'}:`, 25, 154);
  doc.setFont('helvetica', 'normal');
  doc.text(studyTitle, 55, 154);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Method' : 'Método'}:`, 110, 154);
  doc.setFont('helvetica', 'normal');
  doc.text('Osterwald Thermal & Yield Model', 135, 154);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Installed peak power' : 'Potencia pico instalada'}:`, 25, 162);
  doc.setFont('helvetica', 'normal');
  doc.text(`${peakKw} kWp`, 80, 162);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Temperature coefficient' : 'Coeficiente de temperatura'} (γ):`, 25, 170);
  doc.setFont('helvetica', 'normal');
  doc.text(`${coefTemp} 1/°C`, 85, 170);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'NOCT / TONC' : 'TONC'}:`, 25, 178);
  doc.setFont('helvetica', 'normal');
  doc.text(`${tonc} °C`, 85, 178);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Download timestamp' : 'Fecha y hora de descarga'}:`, 25, 186);
  doc.setFont('helvetica', 'normal');
  doc.text(downloadDateFormatted, 85, 186);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    isEn
      ? 'Calculation implemented according to Osterwald formula: PM = PM,STC · (G/1000) · [1 + γ · (Tc - 25)]'
      : 'Cálculo implementado según la fórmula de Osterwald: PM = PM,STC · (G/1000) · [1 + γ · (Tc - 25)]',
    25,
    199
  );
  doc.text(
    isEn
      ? 'where cell temperature is given by: Tc = Tamb + [(TONC - 20) / 800] · G'
      : 'donde la temperatura de célula viene dada por: Tc = Tamb + [(TONC - 20) / 800] · G',
    25,
    205
  );

  // =========================================================================
  // PÁGINA 2: ENERGÍA GENERADA & FIGURA 2.1
  // =========================================================================
  doc.addPage();
  drawAcademicHeader(2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? '2. Generated energy' : '2. Energía generada', 20, 30);

  // Monthly Energy Table
  const tableY = 36;
  doc.setFillColor(37, 99, 235);
  doc.rect(20, tableY, 170, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isEn ? 'Month' : 'Mes', 23, tableY + 5);
  doc.text(isEn ? 'Horizontal plane (kWh)' : 'Superficie horizontal (kWh)', 55, tableY + 5);
  doc.text(isEn ? 'Performed study (kWh)' : 'Estudio realizado (kWh)', 110, tableY + 5);
  doc.text(isEn ? 'Gain (kWh)' : 'Ganancia (kWh)', 160, tableY + 5);

  let curY = tableY + 7;
  for (let i = 0; i < 12; i++) {
    const isAlt = i % 2 === 1;
    if (isAlt) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, curY, 170, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(months[i], 23, curY + 4);
    doc.text(energyData.e0_mes[i].toFixed(2), 65, curY + 4);
    doc.text(energyData.e_mes[i].toFixed(2), 120, curY + 4);

    const g = energyData.ganancia_mes[i];
    if (g >= 0) doc.setTextColor(16, 185, 129);
    else doc.setTextColor(239, 68, 68);
    doc.text(`${g >= 0 ? '+' : ''}${g.toFixed(2)}`, 165, curY + 4);

    curY += 5.5;
  }

  // Annual total row
  doc.setFillColor(15, 23, 42);
  doc.rect(20, curY, 170, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isEn ? 'ANNUAL' : 'ANUAL', 23, curY + 4.5);
  doc.text(energyData.e0_anual.toFixed(1), 65, curY + 4.5);
  doc.text(energyData.e_anual.toFixed(1), 120, curY + 4.5);
  doc.text(`${energyData.ganancia_anual >= 0 ? '+' : ''}${energyData.ganancia_anual.toFixed(2)}`, 165, curY + 4.5);

  // Figura 2.1: Gráfica de energía horizontal
  const chart1Y = curY + 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? 'Figure 2.1. Mean monthly energy on horizontal surface'
      : 'Figura 2.1. Energía media mensual sobre superficie horizontal',
    20,
    chart1Y
  );

  // Vector chart box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, chart1Y + 4, 170, 68, 2, 2, 'FD');

  const maxE0 = Math.max(...energyData.e0_mes) * 1.15 || 2500;
  const barPlotBaseY = chart1Y + 62;
  const barPlotH = 46;
  const barW = 9;
  const barStep = 13;

  for (let i = 0; i < 12; i++) {
    const val = energyData.e0_mes[i];
    const h = (val / maxE0) * barPlotH;
    const x = 27 + i * barStep;
    const y = barPlotBaseY - h;

    doc.setFillColor(37, 99, 235);
    doc.rect(x, y, barW, h, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(String(i + 1), x + 3, barPlotBaseY + 5);

    doc.setFontSize(5.5);
    doc.text(String(Math.round(val)), x - 1, y - 2);
  }

  // =========================================================================
  // PÁGINA 3: FIGURAS 2.2 Y 2.3
  // =========================================================================
  doc.addPage();
  drawAcademicHeader(3);

  // Figura 2.2: Energía estudio seleccionado
  const chart2Y = 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? 'Figure 2.2. Mean monthly energy for selected study'
      : 'Figura 2.2. Energía media mensual para el estudio seleccionado',
    20,
    chart2Y
  );

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, chart2Y + 4, 170, 72, 2, 2, 'FD');

  const maxE = Math.max(...energyData.e_mes) * 1.15 || 2500;
  const barPlot2BaseY = chart2Y + 66;

  for (let i = 0; i < 12; i++) {
    const val = energyData.e_mes[i];
    const h = (val / maxE) * 50;
    const x = 27 + i * barStep;
    const y = barPlot2BaseY - h;

    doc.setFillColor(16, 185, 129);
    doc.rect(x, y, barW, h, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(String(i + 1), x + 3, barPlot2BaseY + 5);

    doc.setFontSize(5.5);
    doc.text(String(Math.round(val)), x - 1, y - 2);
  }

  // Figura 2.3: Ganancias respecto al plano horizontal
  const chart3Y = 120;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? 'Figure 2.3. Global radiation gains with respect to horizontal plane'
      : 'Figura 2.3. Ganancias de la rad. global respecto al plano horizontal',
    20,
    chart3Y
  );

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, chart3Y + 4, 170, 78, 2, 2, 'FD');

  const maxGainAbs = Math.max(...energyData.ganancia_mes.map((g) => Math.abs(g))) * 1.25 || 500;
  const zeroLineY = chart3Y + 50;

  // Zero axis line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(24, zeroLineY, 186, zeroLineY);

  for (let i = 0; i < 12; i++) {
    const g = energyData.ganancia_mes[i];
    const h = (Math.abs(g) / maxGainAbs) * 32;
    const x = 27 + i * barStep;

    if (g >= 0) {
      doc.setFillColor(16, 185, 129);
      doc.rect(x, zeroLineY - h, barW, h, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(16, 185, 129);
      doc.text(`+${Math.round(g)}`, x - 1, zeroLineY - h - 2);
    } else {
      doc.setFillColor(239, 68, 68);
      doc.rect(x, zeroLineY, barW, h, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(239, 68, 68);
      doc.text(`${Math.round(g)}`, x - 1, zeroLineY + h + 5);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(String(i + 1), x + 3, zeroLineY + (g >= 0 ? 5 : -3));
  }

  // Save the PDF
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_Informe_Energia_${cleanLoc}_${fileTimestamp}.pdf`;
  const pdfBlob = doc.output('blob');

  let savedDirectoryLabel = 'C:\\OrientSol3\\InformesPDF';

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'Documento PDF (*.pdf)',
            accept: { 'application/pdf': ['.pdf'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();
      savedDirectoryLabel = handle.name || filename;
      showPdfGeneratedSuccessModal(savedDirectoryLabel, isEn);
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  showPdfGeneratedSuccessModal('C:\\OrientSol3\\InformesPDF', isEn);
}

