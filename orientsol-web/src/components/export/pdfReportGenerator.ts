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

/**
 * Generates the full OrientSol 3.0 MATLAB-matching PDF Report
 * Following strictly Figuras 5.2.72, 5.2.74, 5.2.75
 */
export async function generateOrientSolPDFReport(
  res: SolarBridgeSimulationResult,
  isEn = false
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Helper: Draw header on chapter pages
  const drawPageHeader = (chapterTitle: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(chapterTitle, 20, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('OrientSol 3.0', 20, 30);
    doc.setFontSize(9);
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
    { num: '1', title: isEn ? 'Introduction' : 'Introducción', page: '1' },
    { num: '2', title: isEn ? 'Global Radiation' : 'Radiación Global', page: '3' },
    { num: '3', title: isEn ? 'Direct Radiation' : 'Radiación Directa', page: '5' },
    { num: '4', title: isEn ? 'Diffuse Radiation' : 'Radiación Difusa', page: '7' },
    { num: '5', title: isEn ? 'Albedo Radiation' : 'Radiación de Albedo', page: '9' },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);

  let tocY = 70;
  tocItems.forEach((item) => {
    const textLeft = `${item.num}. ${item.title}`;
    doc.text(textLeft, 25, tocY);

    // Dotted leader line
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

    tocY += 12;
  });

  // Footer notes on Cover
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isEn
      ? `OrientSol 3.0 • Study developed for ${res.locationName} (Lat: ${res.latitude.toFixed(4)}°)`
      : `OrientSol 3.0 • Estudio desarrollado para ${res.locationName} (Lat: ${res.latitude.toFixed(4)}°)`,
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
      ? 'NOTE. Study developed and generated by OrientSol 3.0'
      : 'NOTA.  Estudio desarrollado y descargado por el programa OrientSol 3.0',
    20,
    52
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const infoIntroText = isEn
    ? 'Information: In this type of study the receiving surface is oriented towards the South (in the Northern hemisphere) or towards the North (in the Southern hemisphere). The inclination is fixed throughout the year for the best possible angle. To do this, the tilt angle that maximizes annual energy capture is calculated.'
    : 'Información:  En este tipo de estudio la superficie receptora está orientada hacia el Sur (en el caso del hemisferio Norte) o hacia el Norte (en el caso del hemisferio Sur). La inclinación es fija durante todo el año para el mejor ángulo posible. Para ello, se calcula aquella inclinación que maximiza la captación energética anual.';

  const splitInfo = doc.splitTextToSize(infoIntroText, 170);
  doc.text(splitInfo, 20, 60);

  // Location summary box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 78, 170, 26, 3, 3, 'FD');

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
  doc.text(`${isEn ? 'Optimal Tilt' : 'Inclinación Óptima'}:`, 25, 96);
  doc.setFont('helvetica', 'normal');
  doc.text(`${optAngle}°`, 55, 96);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Annual Mean Temp' : 'Tª Media Anual'}:`, 115, 96);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.temperatures.ambient.annualMeanC.toFixed(1)} °C`, 150, 96);

  // Figura 1.1 Diagram
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? 'Figure 1.1. General diagram of annual optimal tilt'
      : 'Figura 1.1. Esquema general de una inclinación óptima anual',
    20,
    116
  );

  // Solar collector drawing (clean vector blueprint)
  doc.setDrawColor(2, 132, 199);
  doc.setFillColor(14, 165, 233);
  doc.setLineWidth(1);
  // Panel plane in perspective
  doc.triangle(65, 140, 145, 125, 135, 165, 'FD');
  doc.triangle(65, 140, 55, 175, 135, 165, 'FD');

  // Support pole and base
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(3);
  doc.line(95, 155, 95, 185);
  doc.line(75, 185, 115, 185);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`β = ${optAngle}°`, 140, 150);

  // -------------------------------------------------------------
  // CAPÍTULOS 2, 3, 4, 5: COMPONENTES DE RADIACIÓN (Figura 5.2.75)
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

  componentsList.forEach((comp) => {
    doc.addPage();
    drawPageHeader(`${isEn ? 'Chapter' : 'Capítulo'} ${comp.num}. ${comp.title}`);

    // RESULTADOS: en rojo
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
    doc.text(`${isEn ? 'Optimal tilt' : 'Ángulo óptimo'} .`, 20, 74);
    doc.setFont('helvetica', 'normal');
    doc.text(`${optAngle}`, 60, 74);

    // Explanatory paragraph matching Figura 5.2.75
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const compDesc = isEn
      ? `${comp.title}: The values of ${comp.title.toLowerCase()} for an inclination of 0º, that is, of a horizontal receiving surface, are represented below. Secondly, the values for the optimal angle are shown.`
      : `${comp.title}: Se representa a continuación los valores de radiación ${comp.title.toLowerCase()} para una inclinación de 0º, esto es, de una superficie receptora horizontal. En segundo lugar se muestran los valores para el ángulo óptimo.`;

    const splitCompDesc = doc.splitTextToSize(compDesc, 170);
    doc.text(splitCompDesc, 20, 83);

    // 12-month array string
    const rad0Vals = getMonthlyRadiationForAngle(res, comp.code, 0);
    const radOptVals = getMonthlyRadiationForAngle(res, comp.code, optAngle);
    const meanRad0 = rad0Vals.reduce((a, b) => a + b, 0) / 12;
    const meanRadOpt = radOptVals.reduce((a, b) => a + b, 0) / 12;

    doc.setFont('helvetica', 'bold');
    doc.text(
      isEn
        ? `${comp.title} on horizontal surface (kWh/m²/day) .`
        : `${comp.title} sobre superficie horizontal (kWh/m²/día) .`,
      20,
      100
    );
    doc.setFont('helvetica', 'normal');
    doc.text(`[ ${rad0Vals.map((v) => v.toFixed(2)).join('  ')} ]`, 20, 106);

    doc.setFont('helvetica', 'bold');
    doc.text(`${isEn ? 'Annual mean (kWh/m²/day)' : 'Media anual (kWh/m²/día)'} .`, 20, 114);
    doc.setFont('helvetica', 'normal');
    doc.text(`${meanRad0.toFixed(4)}`, 75, 114);

    // Figure 2.1 / 3.1 / 4.1 / 5.1 plot
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      isEn
        ? `Figure ${comp.num}.1. ${comp.title} on horizontal surface and optimal tilt`
        : `Figura ${comp.num}.1. ${comp.title} sobre superficie horizontal e inclinación óptima`,
      20,
      126
    );

    // Mini Chart Frame
    const chartX = 25;
    const chartY = 132;
    const chartW = 160;
    const chartH = 65;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(chartX, chartY, chartW, chartH, 'FD');

    // Axes and plot curves
    const maxVal = Math.max(...rad0Vals, ...radOptVals, 1.0) * 1.2;
    const getPlotX = (mIdx: number) => chartX + 10 + (mIdx / 11) * (chartW - 20);
    const getPlotY = (val: number) => chartY + chartH - 10 - (val / maxVal) * (chartH - 20);

    // Plot 0 deg curve (Cyan/Blue)
    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(1.2);
    for (let i = 0; i < 11; i++) {
      doc.line(getPlotX(i), getPlotY(rad0Vals[i]), getPlotX(i + 1), getPlotY(rad0Vals[i + 1]));
    }

    // Plot Optimal curve (Amber/Orange)
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1.4);
    for (let i = 0; i < 11; i++) {
      doc.line(getPlotX(i), getPlotY(radOptVals[i]), getPlotX(i + 1), getPlotY(radOptVals[i + 1]));
    }

    // Legend
    doc.setFontSize(8);
    doc.setDrawColor(2, 132, 199);
    doc.line(chartX + 15, chartY + 10, chartX + 25, chartY + 10);
    doc.setTextColor(2, 132, 199);
    doc.text(`${comp.sym}(0º) [${isEn ? 'Horiz' : 'Horizontal'}]`, chartX + 28, chartY + 11);

    doc.setDrawColor(217, 119, 6);
    doc.line(chartX + 75, chartY + 10, chartX + 85, chartY + 10);
    doc.setTextColor(217, 119, 6);
    doc.text(`${comp.sym}(${optAngle}º) [${isEn ? 'Optimum' : 'Óptimo'}]`, chartX + 88, chartY + 11);

    // Months labels on X axis
    doc.setTextColor(100, 116, 139);
    for (let i = 0; i < 12; i += 2) {
      doc.text(String(i + 1), getPlotX(i) - 1, chartY + chartH - 4);
    }

    // Results table on optimal tilt
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      isEn
        ? `Annual Optimal Tilt (${optAngle}°) Mean: ${meanRadOpt.toFixed(4)} kWh/m²/day`
        : `Media Inclinación Óptima (${optAngle}°): ${meanRadOpt.toFixed(4)} kWh/m²/día`,
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
      const gainPct = ((meanRadOpt - meanRad0) / (meanRad0 || 1)) * 100;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(16, 185, 129);
      doc.text(
        isEn
          ? `Net Gain vs Horizontal Plane: +${gainPct.toFixed(2)}%`
          : `Ganancia Neta respecto al plano horizontal: +${gainPct.toFixed(2)}%`,
        20,
        217
      );
    }
  });

  // Save the PDF
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `OrientSol3_Informe_${cleanLoc}.pdf`;
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
