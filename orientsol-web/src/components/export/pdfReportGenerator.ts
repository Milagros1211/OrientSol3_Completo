import { jsPDF } from 'jspdf';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle } from '@/components/climate/OptimalAnnualStudyPanel';
import { getSurfaceDisplayName, getCategoryBadge } from '@/i18n/surfaceTranslations';

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
              ? 'The technical report in PDF format will now be generated with high-resolution vector charts, thermal insights, and CTE compliance metrics.'
              : 'A continuación se generará el informe técnico en formato PDF con gráficos vectoriales de alta precisión, balance energético, ranking de superficies y cumplimiento CTE DB-HE4.'}
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
 * Sanitizes Greek and non-Latin1 symbols to prevent encoding corruption and character spacing bugs in jsPDF Helvetica.
 */
function sanitizePdfText(text: string): string {
  if (!text) return '';
  return text
    .replace(/β/g, 'Inc')
    .replace(/γ/g, 'gamma')
    .replace(/δ/g, 'delta')
    .replace(/α/g, 'alfa')
    .replace(/ψ/g, 'psi')
    .replace(/λ/g, 'lambda')
    .replace(/θ/g, 'theta')
    .replace(/±/g, '+/-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/∈/g, 'en')
    .replace(/★/g, '*')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3');
}

/**
 * Renders an elegant highlighted insights callout card with icon, title, and bullet points,
 * calculating dynamic height to strictly prevent bottom border clipping.
 */
function drawPdfInsightBox(
  doc: jsPDF,
  title: string,
  points: string[],
  x: number,
  y: number,
  w: number,
  minH: number = 26
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxAllowedY = pageHeight - 15; // 282mm safe threshold above footer line at 285mm
  const cleanTitle = sanitizePdfText(title);
  const cleanPoints = points.map((p) => sanitizePdfText(p));

  const textStartX = x + 8;
  const maxTextW = w - 26; // 144mm for w=170, leaving 18mm safe right buffer before the 190mm border

  // Pre-calculate line wrapping with the EXACT font and size used for rendering
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  const wrappedList: string[][] = cleanPoints.map((pt) => {
    const bulletText = `- ${pt}`;
    return doc.splitTextToSize(bulletText, maxTextW);
  });

  const totalLines = wrappedList.reduce((acc, lines) => acc + lines.length, 0);
  const lineSpacing = 3.3;
  let calculatedH = Math.max(minH, 12 + totalLines * lineSpacing + (cleanPoints.length - 1) * 1.8 + 4);

  // If box bottom would exceed page limit, clamp height and adjust text spacing
  if (y + calculatedH > maxAllowedY) {
    calculatedH = Math.max(minH, maxAllowedY - y);
  }

  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.6);
  doc.roundedRect(x, y, w, calculatedH, 2, 2, 'FD');

  doc.setFillColor(2, 132, 199);
  doc.roundedRect(x + 3, y + 3, 3.5, calculatedH - 6, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(3, 105, 161);
  doc.text(cleanTitle, textStartX, y + 6.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 41, 59);

  let textY = y + 11.5;
  for (const lines of wrappedList) {
    for (const l of lines) {
      if (textY < y + calculatedH - 2) {
        doc.text(l, textStartX, textY);
        textY += lineSpacing;
      }
    }
    textY += 1.2;
  }

  return calculatedH;
}

/**
 * Shared academic & corporate header and footer chrome across all OrientSol 4.0 PDF reports.
 * Fully wraps chapter titles and subheaders with splitTextToSize so that no phrases are ever cut.
 */
export function drawOrientSolPageChrome(
  doc: jsPDF,
  options: {
    chapterTitle: string;
    subHeader: string;
    pageNum: number;
    totalPages: number;
    formattedDateTime: string;
    isoTimestamp: string;
    isEn: boolean;
    skipHeader?: boolean;
  }
): void {
  const pageHeight = doc.internal.pageSize.getHeight();

  if (!options.skipHeader) {
    // 1. Right badge: Universidad de Jaén & Export date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('UNIVERSIDAD DE JAEN', 190, 13, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const exportLabel = options.isEn ? 'Exported:' : 'Exportado:';
    doc.text(`${exportLabel} ${options.formattedDateTime}`, 190, 17.5, { align: 'right' });

    // 2. Left running title: wrap without cutting any phrase (max 122mm width)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const titleLines: string[] = doc.splitTextToSize(sanitizePdfText(options.chapterTitle), 122);
    titleLines.forEach((line, idx) => {
      doc.text(line, 20, 11.5 + idx * 3.8);
    });

    // 3. Left running subheader: wrap without cutting any phrase
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    const subLines: string[] = doc.splitTextToSize(sanitizePdfText(options.subHeader), 122);
    const subStartY = 11.5 + titleLines.length * 3.8;
    subLines.forEach((line, idx) => {
      doc.text(line, 20, subStartY + idx * 3.2);
    });

    // 4. Divider line
    const dividerY = Math.max(22.5, subStartY + subLines.length * 3.2 + 1.5);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(20, dividerY, 190, dividerY);
  }

  // 5. Running footer on every page
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(20, pageHeight - 12, 190, pageHeight - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    options.isEn
      ? `OrientSol 4.0 Report • Timestamp: ${options.formattedDateTime} (${options.isoTimestamp})`
      : `Informe Técnico OrientSol 4.0 • Timestamp: ${options.formattedDateTime} (${options.isoTimestamp})`,
    20,
    pageHeight - 7
  );
  doc.setFont('helvetica', 'bold');
  doc.text(`${options.pageNum} / ${options.totalPages}`, 190, pageHeight - 7, { align: 'right' });
}

/**
 * Generates the full OrientSol 4.0 Technical PDF Report strictly matching the layout,
 * operations, temperature cards, ranking of 8 topologies, CTE DB-HE4 loss map, and highlighted
 * technical insights boxes on all figures.
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

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const optAngle = res.optimalAnnual.optimalTiltDeg;
  const peakKw = options?.peakPowerKw ?? 5.0;
  const pr = options?.performanceRatio ?? 0.80;
  const tonc = options?.tonc ?? 47.0;

  // Exact Timestamp
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

  const monthsEsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthsEnShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mShort = isEn ? monthsEnShort : monthsEsShort;

  const monthsEsFull = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthsEnFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const mFull = isEn ? monthsEnFull : monthsEsFull;

  const studyNames: Record<OrientSolStudyType, { es: string; en: string }> = {
    annual: { es: 'Inclinación Óptima Anual', en: 'Annual Optimal Tilt' },
    monthly: { es: 'Optimización Mensual (12 Posiciones Independientes)', en: 'Monthly Optimization (12 Independent Positions)' },
    seasonal: { es: 'Inclinación Óptima Estacional (4 Ajustes)', en: 'Seasonal Optimal Tilt (4 Adjustments)' },
    polar: { es: 'Seguimiento a un Eje Polar', en: 'Single-Axis Polar Tracking' },
    azimuthal: { es: 'Seguimiento a un Eje Azimutal', en: 'Single-Axis Azimuthal Tracking' },
    horizontal: { es: 'Seguimiento a un Eje Horizontal (E-O)', en: 'Single-Axis Horizontal Tracking (E-W)' },
    dual: { es: 'Seguimiento a Dos Ejes Continuo', en: 'Two-Axis Continuous Tracking' },
    comparative: { es: 'Comparativa Global de Todas las Superficies', en: 'Global Benchmark of All Surfaces' },
  };

  const currentStudyName = isEn ? studyNames[studyType].en : studyNames[studyType].es;
  const cleanStudyName = sanitizePdfText(currentStudyName);

  // -------------------------------------------------------------
  // Mapas de pérdidas adicionales (12 mensuales / 4 estacionales)
  // -------------------------------------------------------------
  type MiniLossMap = {
    label: string;
    sub: string;
    betaDeg: number;
    alphaDeg: number;
    maxDaily: number;
    zones: { generalPctCompliant: number; superpositionPctCompliant: number; integrationPctCompliant: number };
    lossMatrix?: number[][];
  };
  const lossMapRes = res.captureLossMap;
  const monthlyMapsList: MiniLossMap[] =
    lossMapRes?.monthlyMaps && lossMapRes.monthlyMaps.length === 12
      ? lossMapRes.monthlyMaps.map((m, i) => {
          const bDeg = Number(m.optimalPoint.betaDeg);
          const aDeg = Math.abs(bDeg) < 0.01 ? 0 : Number(m.optimalPoint.alphaDeg);
          return {
            label: mFull[i],
            sub: isEn ? 'Monthly map' : 'Mapa mensual',
            betaDeg: bDeg,
            alphaDeg: aDeg,
            maxDaily: Number(m.optimalPoint.maxDailyRadiationKwh),
            zones: m.cteZones,
            lossMatrix: m.lossPercentageMatrix,
          };
        })
      : [];

  const buildSeasonalMaps = (): MiniLossMap[] => {
    const namesEs = ['Invierno', 'Primavera', 'Verano', 'Otoño'];
    const namesEn = ['Winter', 'Spring', 'Summer', 'Autumn'];
    const monthsEs = ['Dic - Ene - Feb', 'Mar - Abr - May', 'Jun - Jul - Ago', 'Sep - Oct - Nov'];
    const monthsEn = ['Dec - Jan - Feb', 'Mar - Apr - May', 'Jun - Jul - Aug', 'Sep - Oct - Nov'];
    if (lossMapRes?.seasonalMaps && lossMapRes.seasonalMaps.length === 4) {
      return lossMapRes.seasonalMaps.map((s, i) => {
        const bDeg = Number(s.optimalPoint.betaDeg);
        const aDeg = Math.abs(bDeg) < 0.01 ? 0 : Number(s.optimalPoint.alphaDeg);
        return {
          label: isEn ? s.seasonNameEn || namesEn[i] : s.seasonName || namesEs[i],
          sub: isEn ? s.monthsIncludedEn || monthsEn[i] : s.monthsIncluded || monthsEs[i],
          betaDeg: bDeg,
          alphaDeg: aDeg,
          maxDaily: Number(s.optimalPoint.maxDailyRadiationKwh),
          zones: s.cteZones,
          lossMatrix: s.lossPercentageMatrix,
        };
      });
    }
    const mm = lossMapRes?.monthlyMaps;
    if (!mm || mm.length !== 12) return [];
    const groups = [[11, 0, 1], [2, 3, 4], [5, 6, 7], [8, 9, 10]];
    const betas = lossMapRes.betasDeg;
    const alphas = lossMapRes.alphasDeg;
    return groups.map((g, si) => {
      const nR = betas.length;
      const nC = alphas.length;
      const rad: number[][] = Array.from({ length: nR }, () => new Array(nC).fill(0));
      let maxRad = 0;
      let bB = 0;
      let bA = 0;
      for (let r = 0; r < nR; r++) {
        for (let c = 0; c < nC; c++) {
          let sum = 0;
          for (const mi of g) sum += mm[mi].radiationMatrixKwhM2Day[r][c];
          const avg = sum / g.length;
          rad[r][c] = avg;
          const isBetter =
            avg > maxRad + 1e-4 ||
            (Math.abs(avg - maxRad) <= 1e-4 && (Math.abs(alphas[c]) < Math.abs(bA) || (Math.abs(alphas[c]) === Math.abs(bA) && betas[r] < bB)));
          if (isBetter) {
            maxRad = avg;
            bB = betas[r];
            bA = Math.abs(betas[r]) < 0.01 ? 0 : alphas[c];
          }
        }
      }
      let c10 = 0;
      let c20 = 0;
      let c40 = 0;
      const loss: number[][] = rad.map((row) =>
        row.map((v) => {
          const l = maxRad > 0 ? ((maxRad - v) / maxRad) * 100 : 0;
          if (l <= 10) c10++;
          if (l <= 20) c20++;
          if (l <= 40) c40++;
          return l;
        })
      );
      const tot = nR * nC || 1;
      return {
        label: isEn ? namesEn[si] : namesEs[si],
        sub: isEn ? monthsEn[si] : monthsEs[si],
        betaDeg: bB,
        alphaDeg: bA,
        maxDaily: maxRad,
        zones: {
          generalPctCompliant: Math.round((c10 / tot) * 1000) / 10,
          superpositionPctCompliant: Math.round((c20 / tot) * 1000) / 10,
          integrationPctCompliant: Math.round((c40 / tot) * 1000) / 10,
        },
        lossMatrix: loss,
      };
    });
  };

  const extraMapsList: MiniLossMap[] =
    studyType === 'monthly' ? monthlyMapsList : studyType === 'seasonal' ? buildSeasonalMaps() : [];
  const mapsPerPage = studyType === 'monthly' ? 6 : 4;
  const extraMapPages = extraMapsList.length > 0 ? Math.ceil(extraMapsList.length / mapsPerPage) : 0;
  const totalPagesDyn = 6 + extraMapPages;
  const chapter5Page = 6 + extraMapPages;

  // Header & Footer helper
  const drawPageChrome = (chapterTitle: string, pageNum: number, totalPages: number) => {
    drawOrientSolPageChrome(doc, {
      chapterTitle,
      subHeader: `OrientSol 4.0 • ${cleanStudyName} • ${res.locationName} (Lat: ${res.latitude.toFixed(2)}°)`,
      pageNum,
      totalPages,
      formattedDateTime,
      isoTimestamp,
      isEn,
      skipHeader: pageNum === 1,
    });
  };

  // Helper for highlighted insight boxes
  const drawInsightBox = (
    title: string,
    points: string[],
    x: number,
    y: number,
    w: number,
    minH?: number
  ) => {
    return drawPdfInsightBox(doc, title, points, x, y, w, minH);
  };

  // =========================================================================
  // PÁGINA 1: PORTADA, RESUMEN CLIMÁTICO Y TARJETAS DE TEMPERATURA (Imagen 1)
  // =========================================================================
  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(248, 250, 252);
  const bannerTitle = isEn
    ? `OrientSol 4.0 Results: ${res.locationName} (Lat: ${res.latitude.toFixed(2)}°)`
    : `Resultados OrientSol 4.0: ${res.locationName} (Lat: ${res.latitude.toFixed(2)}°)`;
  const bannerLines = doc.splitTextToSize(sanitizePdfText(bannerTitle), 170);
  if (bannerLines.length > 1) {
    doc.text(bannerLines[0], 20, 16);
    doc.text(bannerLines[1], 20, 23);
  } else {
    doc.text(bannerLines[0] || '', 20, 20);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  const subBanner = isEn
    ? `Solar Radiation & PV Simulation Report • MATLAB to Web & Desktop Migration`
    : `Informe Técnico de Simulación Solar y Fotovoltaica • Migración MATLAB a Web & Desktop`;
  const subBannerLines = doc.splitTextToSize(subBanner, 170);
  doc.text(subBannerLines[0] || '', 20, 28);

  // Prominent Timestamp Pill
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 31, 170, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248);
  doc.text(
    isEn
      ? `TIMESTAMP AUDIT RECORD: Exported on ${formattedDateTime} (ISO: ${isoTimestamp}) • Engine: Python 3.14 WASM (${res.executionTimeMs} ms)`
      : `REGISTRO OFICIAL DE AUDITORÍA: Exportado el ${formattedDateTime} (ISO: ${isoTimestamp}) • Motor: Python 3.14 WASM (${res.executionTimeMs} ms)`,
    23,
    35.8
  );

  // -------------------------------------------------------------
  // 4 TARJETAS DE TEMPERATURA AMBIENTAL Y CÉLULA OPERATIVA (Imagen 1)
  // -------------------------------------------------------------
  const cardW = 39.5;
  const cardH = 26;
  const cardGap = 4;
  const cardY = 48;

  // Tarjeta 1: Temp Media Anual
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'ANNUAL MEAN TEMP' : 'TEMP. MEDIA ANUAL', 24, cardY + 6);
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`${res.temperatures.ambient.annualMeanC.toFixed(1)} °C`, 24, cardY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'Monthly ambient mean' : 'Media ambiente mensual', 24, cardY + 22);

  // Tarjeta 2: Temp Máxima Anual
  const card2X = 20 + cardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(card2X, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'ANNUAL MAX TEMP' : 'TEMP. MÁXIMA ANUAL', card2X + 4, cardY + 6);
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(`${res.temperatures.ambient.annualMaxC.toFixed(1)} °C`, card2X + 4, cardY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'Peak summer high' : 'Pico estival máximo', card2X + 4, cardY + 22);

  // Tarjeta 3: Temp Mínima Anual
  const card3X = card2X + cardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(card3X, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'ANNUAL MIN TEMP' : 'TEMP. MÍNIMA ANUAL', card3X + 4, cardY + 6);
  doc.setFontSize(16);
  doc.setTextColor(2, 132, 199);
  doc.text(`${res.temperatures.ambient.annualMinC.toFixed(1)} °C`, card3X + 4, cardY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'Winter absolute low' : 'Mínima invernal absoluta', card3X + 4, cardY + 22);

  // Tarjeta 4: Temp Célula Operativa Tc
  const card4X = card3X + cardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(card4X, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'CELL OPERATING TEMP (TC)' : 'TEMP. CÉLULA OPERATIVA (TC)', card4X + 4, cardY + 6);
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text(`${res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(1)} °C`, card4X + 4, cardY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`TONC ${tonc.toFixed(1)}°C (Máx: ${res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1)}°C)`, card4X + 4, cardY + 22);

  // -------------------------------------------------------------
  // TABLA DE CONTENIDOS DEL INFORME (Matching Figura 5.2.72)
  // -------------------------------------------------------------
  const tocY = 82;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Table of Contents' : 'Tabla de Contenidos', 20, tocY);

  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.8);
  doc.line(20, tocY + 2, 65, tocY + 2);

  const tocList = [
    { num: '1', title: isEn ? 'Energy Yield Balance & Thermal Derating (Osterwald vs Simplified)' : 'Balance Energético y Comportamiento Térmico Fotovoltaico (Osterwald vs Simplificado)', page: '2' },
    { num: '2', title: isEn ? `Selected Operation Study: ${cleanStudyName}` : `Estudio Solar Seleccionado: ${cleanStudyName}`, page: '3' },
    { num: '3', title: isEn ? 'Global Benchmark & Ranking of All 8 Solar Collector Topologies' : 'Comparativa y Ranking Global de las 8 Topologías de Captación', page: '4' },
    { num: '4', title: isEn ? 'Technical Building Code (CTE DB-HE4) Captation Losses Matrix' : extraMapPages > 0 ? (studyType === 'monthly' ? 'Mapas de Pérdidas de Captación CTE DB-HE4 (Anual + 12 Mensuales)' : 'Mapas de Pérdidas de Captación CTE DB-HE4 (Anual + 4 Estacionales)') : 'Mapa de Pérdidas de Captación y Cumplimiento CTE DB-HE4', page: '5' },
    { num: '5', title: isEn ? 'Continuous Radiation Evolution Curve (Tilt Spectrum 1° to 90°)' : 'Evolución Continua de Radiación en el Rango de Inclinaciones (1° a 90°)', page: String(chapter5Page) },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  let curTocY = tocY + 10;
  tocList.forEach((item) => {
    const targetPage = parseInt(item.page, 10);

    // Clickable interactive row background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, curTocY - 4.5, 170, 7.5, 1.5, 1.5, 'F');

    // Number badge
    doc.setFillColor(3, 105, 161);
    doc.roundedRect(22, curTocY - 3.5, 5, 5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(item.num, 23.8, curTocY);

    // Chapter Title (clickable)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const leftText = item.title;
    doc.text(leftText, 30, curTocY);

    // Dotted guide
    const txtW = doc.getTextWidth(leftText);
    let dotX = 30 + txtW + 3;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    while (dotX < 172) {
      doc.text('.', dotX, curTocY);
      dotX += 2.8;
    }

    // Page badge pill
    doc.setFillColor(224, 242, 254);
    doc.roundedRect(174, curTocY - 3.5, 14, 5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`${isEn ? 'p.' : 'Pág.'} ${item.page}`, 175.2, curTocY);

    // Register Clickable Hyperlink for entire row
    doc.link(20, curTocY - 4.5, 170, 7.5, { pageNumber: targetPage });

    // Register PDF document outline bookmark
    try {
      if ((doc as any).outline?.add) {
        (doc as any).outline.add(null, `${item.num}. ${item.title}`, { pageNumber: targetPage });
      }
    } catch {
      // Outline is optional
    }

    curTocY += 8.2;
  });

  // Project Parameters Summary Box (Balanced 2-column layout to avoid text collisions)
  const paramsY = curTocY + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, paramsY, 170, 44, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'GENERAL INSTALLATION & CLIMATIC PARAMETERS' : 'PARÁMETROS GENERALES DE LA INSTALACIÓN Y EMPLAZAMIENTO', 24, paramsY + 7);

  const c1LabX = 24;
  const c1ValX = 62;
  const c2LabX = 112;
  const c2ValX = 152;

  doc.setFontSize(7.5);

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Location' : 'Localidad'}:`, c1LabX, paramsY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.locationName} (${res.latitude.toFixed(2)}° N)`, c1ValX, paramsY + 15);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Data Source' : 'Fuente de Datos'}:`, c2LabX, paramsY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(res.source.toUpperCase(), c2ValX, paramsY + 15);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Peak Power' : 'Potencia Pico'}:`, c1LabX, paramsY + 23);
  doc.setFont('helvetica', 'normal');
  doc.text(`${peakKw.toFixed(2)} kWp`, c1ValX, paramsY + 23);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Performance Ratio' : 'Rendimiento (PR)'}:`, c2LabX, paramsY + 23);
  doc.setFont('helvetica', 'normal');
  doc.text(`${(pr * 100).toFixed(0)}%`, c2ValX, paramsY + 23);

  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Module NOCT' : 'TONC Módulos'}:`, c1LabX, paramsY + 31);
  doc.setFont('helvetica', 'normal');
  doc.text(`${tonc.toFixed(1)} °C (g: -0.40%/°C)`, c1ValX, paramsY + 31);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Collector Area' : 'Sup. Captación'}:`, c2LabX, paramsY + 31);
  doc.setFont('helvetica', 'normal');
  doc.text(`${res.energyYield.collectorAreaM2.toFixed(1)} m²`, c2ValX, paramsY + 31);

  // Row 4
  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Fixed Optimal Tilt' : 'Inclinación Óptima'}:`, c1LabX, paramsY + 39);
  doc.setFont('helvetica', 'normal');
  doc.text(`${optAngle}° (+${res.optimalAnnual.gainOverHorizontalPct.toFixed(1)}% vs Horiz)`, c1ValX, paramsY + 39);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Study' : 'Estudio'}:`, c2LabX, paramsY + 39);
  doc.setFont('helvetica', 'normal');
  const studyParamsLines = doc.splitTextToSize(cleanStudyName, 186 - c2ValX);
  doc.text(studyParamsLines, c2ValX, paramsY + 39);

  drawPageChrome('', 1, totalPagesDyn);

  // =========================================================================
  // PÁGINA 2: GRÁFICOS DE RADIACIÓN Y PRODUCCIÓN FV CON INSIGHTS (Imagen 1)
  // =========================================================================
  doc.addPage();
  drawPageChrome(isEn ? 'Chapter 1. Energy Yield Balance & Thermal Derating' : 'Capítulo 1. Balance Energético y Comportamiento Térmico', 2, totalPagesDyn);

  // Big Energy Metric Cards
  const bmY = 28;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(20, bmY, 82, 28, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text(isEn ? 'INCIDENT SOLAR ENERGY RECEIVED' : 'ENERGÍA SOLAR INCIDENTE RECIBIDA', 24, bmY + 6);
  doc.setFontSize(14);
  doc.text(`${Math.round(res.energyYield.recibida.annualTotalKwh).toLocaleString()} kWh/${isEn ? 'yr' : 'año'}`, 24, bmY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`${res.energyYield.recibida.annualKwhM2.toFixed(1)} kWh/m²·${isEn ? 'yr' : 'año'} • ${res.energyYield.recibida.meanDailyKwhM2.toFixed(2)} kWh/m²/${isEn ? 'day' : 'día'}`, 24, bmY + 23);

  doc.setFillColor(209, 250, 229);
  doc.roundedRect(108, bmY, 82, 28, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text(isEn ? 'PRODUCED PV ENERGY (OSTERWALD)' : 'ENERGÍA FV GENERADA (OSTERWALD)', 112, bmY + 6);
  doc.setFontSize(14);
  doc.text(`${Math.round(res.energyYield.producida.osterwald.annualKwh).toLocaleString()} kWh/${isEn ? 'yr' : 'año'}`, 112, bmY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`${isEn ? 'Specific Yield' : 'Rendimiento'}: ${res.energyYield.producida.osterwald.specificYieldKwhKwp.toFixed(0)} kWh/kWp • ${isEn ? 'Simplified' : 'Simplif'}: ${Math.round(res.energyYield.producida.simplified.annualKwh).toLocaleString()} kWh`, 112, bmY + 23);

  // -------------------------------------------------------------
  // GRÁFICO 1: RADIACIÓN SOLAR MENSUAL POR SUPERFICIE
  // (Horizontal vs Fijo Óptimo vs 12 Óptimos Mensuales / Operación)
  // -------------------------------------------------------------
  const chart1Y = 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Monthly Solar Radiation by Surface (kWh/m²/day)' : 'Radiación Solar Mensual por Superficie (kWh/m²/día)', 20, chart1Y);

  const c1W = 170;
  const c1H = 50;
  const c1BoxY = chart1Y + 3;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, c1BoxY, c1W, c1H, 2, 2, 'FD');

  // Legend
  doc.setFontSize(7);
  doc.setFillColor(14, 165, 233);
  doc.circle(28, c1BoxY + 6, 2, 'F');
  doc.setTextColor(71, 85, 105);
  doc.text('Horizontal (0°)', 32, c1BoxY + 7);

  doc.setFillColor(234, 179, 8);
  doc.circle(75, c1BoxY + 6, 2, 'F');
  doc.text(isEn ? `Fixed Optimum (${optAngle}°)` : `Fijo Óptimo (${optAngle}°)`, 79, c1BoxY + 7);

  doc.setFillColor(16, 185, 129);
  doc.circle(125, c1BoxY + 6, 2, 'F');
  const legLines = doc.splitTextToSize(cleanStudyName, 55);
  doc.text(legLines, 129, c1BoxY + (legLines.length > 1 ? 5.5 : 7));

  // Bars for each month
  const radH = res.horizontal.gdm0;
  const radOpt = res.optimalAnnual.monthlyDailyKwh;
  const radAct =
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
      : radOpt;

  const maxRadPlot = 10.0;
  const baseY1 = c1BoxY + c1H - 7;
  const plotH1 = 30.0;
  const axisX = 30.0;
  const axisEndX = 186.0;
  const stepX1 = 12.8;

  // Draw Y-Axis (Left) and Gridlines for Radiation Chart
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(axisX, baseY1, axisX, baseY1 - plotH1); // Vertical Y axis
  doc.line(axisX, baseY1, axisEndX, baseY1);        // Horizontal X baseline

  const radTicks = [2, 4, 6, 8, 10];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(148, 163, 184);
  doc.text('0', axisX - 1.5, baseY1 + 1, { align: 'right' });
  doc.text('kWh/m²·d', axisX - 1.5, baseY1 - plotH1 - 1, { align: 'right' });

  radTicks.forEach((tv) => {
    const yT = baseY1 - (tv / maxRadPlot) * plotH1;
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(axisX, yT, axisEndX, yT); // Subtle gridline
    doc.setDrawColor(203, 213, 225);
    doc.line(axisX - 1.2, yT, axisX, yT); // Tick mark
    doc.text(String(tv), axisX - 1.5, yT + 1.2, { align: 'right' });
  });

  // Calculate Max and Min for highlighted badges
  const maxRadVal = Math.max(...radAct);
  const maxRadIdx = radAct.indexOf(maxRadVal);
  const minRadVal = Math.min(...radAct);
  const minRadIdx = radAct.indexOf(minRadVal);

  for (let i = 0; i < 12; i++) {
    const xBase = axisX + 2.0 + i * stepX1;

    // Bar 1: Horizontal (Blue)
    const h1 = (radH[i] / maxRadPlot) * plotH1;
    doc.setFillColor(14, 165, 233);
    doc.rect(xBase, baseY1 - h1, 2.9, h1, 'F');

    // Bar 2: Fixed Opt (Amber)
    const h2 = (radOpt[i] / maxRadPlot) * plotH1;
    doc.setFillColor(234, 179, 8);
    doc.rect(xBase + 3.1, baseY1 - h2, 2.9, h2, 'F');

    // Bar 3: Active Study (Green)
    const h3 = (radAct[i] / maxRadPlot) * plotH1;
    doc.setFillColor(16, 185, 129);
    doc.rect(xBase + 6.2, baseY1 - h3, 2.9, h3, 'F');

    // Month label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(mShort[i], xBase + 1.5, baseY1 + 4);
  }

  // Max and Min labels on Chart 1
  const xMax1 = axisX + 2.0 + maxRadIdx * stepX1 + 7.6;
  const yMax1 = baseY1 - (maxRadVal / maxRadPlot) * plotH1 - 1.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(220, 38, 38);
  doc.text(`▲ ${isEn ? 'MAX' : 'MÁX'}: ${maxRadVal.toFixed(2)}`, xMax1, yMax1, { align: 'center' });

  const xMin1 = axisX + 2.0 + minRadIdx * stepX1 + 7.6;
  const yMin1 = baseY1 - (minRadVal / maxRadPlot) * plotH1 - 1.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(2, 132, 199);
  doc.text(`▼ ${isEn ? 'MIN' : 'MÍN'}: ${minRadVal.toFixed(2)}`, xMin1, yMin1, { align: 'center' });

  // -------------------------------------------------------------
  // GRÁFICO 2: PRODUCCIÓN FV Y COMPORTAMIENTO TÉRMICO
  // -------------------------------------------------------------
  const chart2Y = c1BoxY + c1H + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'PV Energy Yield (kWh) & Thermal Behavior (Tc vs Tamb)' : 'Producción de Energía FV (kWh) y Comportamiento Térmico (Tc vs Tamb)', 20, chart2Y);

  const c2BoxY = chart2Y + 3;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, c2BoxY, c1W, c1H, 2, 2, 'FD');

  // Legend
  doc.setFontSize(7);
  doc.setFillColor(16, 185, 129);
  doc.rect(28, c2BoxY + 4, 4, 3, 'F');
  doc.setTextColor(71, 85, 105);
  doc.text(isEn ? 'PV Yield (kWh)' : 'Producción FV (kWh)', 34, c2BoxY + 7);

  doc.setFillColor(220, 38, 38);
  doc.circle(85, c2BoxY + 6, 2, 'F');
  doc.text(isEn ? 'Cell Temp Tc (°C)' : 'Temp. Célula Tc (°C)', 89, c2BoxY + 7);

  doc.setFillColor(2, 132, 199);
  doc.circle(135, c2BoxY + 6, 2, 'F');
  doc.text(isEn ? 'Ambient Temp (°C)' : 'Temp. Ambiente (°C)', 139, c2BoxY + 7);

  const pvMonthly = res.energyYield.producida.osterwald.monthlyKwh;
  const maxPvVal = Math.max(...pvMonthly);
  const maxPvPlot = Math.max(1000, Math.ceil(maxPvVal / 200) * 200);
  const baseY2 = c2BoxY + c1H - 7;
  const plotH2 = 30.0;
  const rightAxisX = 184.0;

  // Draw Dual Axes (Left: Energy kWh, Right: Temp °C)
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(axisX, baseY2, axisX, baseY2 - plotH2);             // Left axis
  doc.line(rightAxisX, baseY2, rightAxisX, baseY2 - plotH2);   // Right axis
  doc.line(axisX, baseY2, rightAxisX, baseY2);                 // Baseline

  // Left Energy Ticks
  const pvTicks = [0.25, 0.5, 0.75, 1.0].map((f) => Math.round(maxPvPlot * f));
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(148, 163, 184);
  doc.text('0', axisX - 1.5, baseY2 + 1, { align: 'right' });
  doc.text('kWh', axisX - 1.5, baseY2 - plotH2 - 1, { align: 'right' });

  pvTicks.forEach((tv) => {
    const yT = baseY2 - (tv / maxPvPlot) * plotH2;
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(axisX, yT, rightAxisX, yT); // Gridline
    doc.setDrawColor(203, 213, 225);
    doc.line(axisX - 1.2, yT, axisX, yT);
    doc.text(String(tv), axisX - 1.5, yT + 1.2, { align: 'right' });
  });

  // Right Temperature Ticks (0..50 °C)
  const tempTicks = [10, 20, 30, 40, 50];
  doc.setTextColor(148, 163, 184);
  doc.text('°C', rightAxisX + 1.5, baseY2 - plotH2 - 1);
  tempTicks.forEach((tv) => {
    const yT = baseY2 - (tv / 55.0) * plotH2;
    doc.setDrawColor(203, 213, 225);
    doc.line(rightAxisX, yT, rightAxisX + 1.2, yT);
    doc.text(`${tv}°`, rightAxisX + 2, yT + 1.2);
  });

  // Temperature line points
  const tcPoints: { x: number; y: number }[] = [];
  const taPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < 12; i++) {
    const xBase = axisX + 2.0 + i * stepX1;
    const valPv = pvMonthly[i] ?? 0;
    const hPv = (valPv / maxPvPlot) * plotH2;

    doc.setFillColor(16, 185, 129);
    doc.rect(xBase, baseY2 - hPv, 8.2, hPv, 'F');

    // Temp cell y (0 to 55 °C range)
    const yTc = baseY2 - (res.temperatures.cellOperating.monthlyCellTempOptimalC[i] / 55.0) * plotH2;
    const yTa = baseY2 - (res.temperatures.ambient.monthlyMeanC[i] / 55.0) * plotH2;
    tcPoints.push({ x: xBase + 4.1, y: yTc });
    taPoints.push({ x: xBase + 4.1, y: yTa });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(mShort[i], xBase + 1.5, baseY2 + 4);
  }

  // Draw Tc curve line (Red)
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.8);
  for (let i = 0; i < 11; i++) {
    doc.line(tcPoints[i].x, tcPoints[i].y, tcPoints[i + 1].x, tcPoints[i + 1].y);
    doc.circle(tcPoints[i].x, tcPoints[i].y, 0.8, 'F');
  }
  doc.circle(tcPoints[11].x, tcPoints[11].y, 0.8, 'F');

  // Draw Ta curve line (Blue dashed)
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.6);
  for (let i = 0; i < 11; i++) {
    doc.line(taPoints[i].x, taPoints[i].y, taPoints[i + 1].x, taPoints[i + 1].y);
    doc.circle(taPoints[i].x, taPoints[i].y, 0.7, 'F');
  }
  doc.circle(taPoints[11].x, taPoints[11].y, 0.7, 'F');

  // Max and Min labels on Chart 2 (PV Production and Peak Temperatures)
  const maxPvIdx = pvMonthly.indexOf(maxPvVal);
  const minPvVal = Math.min(...pvMonthly);
  const minPvIdx = pvMonthly.indexOf(minPvVal);

  const xPvMax = axisX + 2.0 + maxPvIdx * stepX1 + 4.1;
  const yPvMax = baseY2 - (maxPvVal / maxPvPlot) * plotH2 - 1.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(5, 150, 105);
  doc.text(`▲ ${isEn ? 'MAX' : 'MÁX'}: ${Math.round(maxPvVal)} kWh`, xPvMax, yPvMax, { align: 'center' });

  const xPvMin = axisX + 2.0 + minPvIdx * stepX1 + 4.1;
  const yPvMin = baseY2 - (minPvVal / maxPvPlot) * plotH2 - 1.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(100, 116, 139);
  doc.text(`▼ ${isEn ? 'MIN' : 'MÍN'}: ${Math.round(minPvVal)} kWh`, xPvMin, yPvMin, { align: 'center' });

  // Peak Cell Temperature Callout
  const tcVals = res.temperatures.cellOperating.monthlyCellTempOptimalC;
  const maxTcVal = Math.max(...tcVals);
  const maxTcIdx = tcVals.indexOf(maxTcVal);
  const pTcMax = tcPoints[maxTcIdx];
  doc.setFillColor(220, 38, 38);
  doc.circle(pTcMax.x, pTcMax.y, 1.4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(220, 38, 38);
  doc.text(`Tc ${isEn ? 'MAX' : 'MÁX'}: ${maxTcVal.toFixed(1)}°C`, pTcMax.x, pTcMax.y - 2.5, { align: 'center' });

  // -------------------------------------------------------------
  // CAJA DE INSIGHTS RELEVANTES RESALTADOS (Imagen 1)
  // -------------------------------------------------------------
  const ins1Y = c2BoxY + c1H + 6;
  drawInsightBox(
    isEn ? 'KEY TECHNICAL INSIGHTS: SOLAR DYNAMICS & THERMAL BEHAVIOR' : 'INSIGHTS TÉCNICOS DESTACADOS: DINÁMICA SOLAR Y COMPORTAMIENTO TÉRMICO',
    isEn
      ? [
          `Seasonal Variation & Leveling: Incident solar resource exhibits marked seasonality (July peak vs December low). Angular adaptation in autumn and winter boosts collection by up to +40% over a horizontal plane, bridging the seasonal electricity generation gap.`,
          `Thermal Derating from Cell Heating: During summer, operating cell temperature reaches means of ${res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(1)}°C (peak ${res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1)}°C). With gamma = -0.40%/°C, thermal losses reach ${Math.round(res.energyYield.producida.osterwald.thermalLossKwh)} kWh/yr (-${res.energyYield.producida.osterwald.thermalLossPct.toFixed(2)}%), making spring months (April-May) achieve the highest net electrical efficiency.`,
        ]
      : [
          `Variación Estacional y Nivelación: El recurso solar incidente presenta una acusada estacionalidad (pico en julio de 7.86 kWh/m²/d vs 3.43 kWh/m²/d en diciembre). La adaptación angular en otoño e invierno incrementa la captación hasta un +40% respecto a superficie horizontal, reduciendo la brecha estacional de generación eléctrica.`,
          `Derating Térmico por Calentamiento de Célula: Durante el estío, la temperatura de célula operativa alcanza medias de ${res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(1)}°C (pico de ${res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1)}°C). Con γ = -0.40%/°C, las pérdidas térmicas ascienden a ${Math.round(res.energyYield.producida.osterwald.thermalLossKwh)} kWh/año (-${res.energyYield.producida.osterwald.thermalLossPct.toFixed(2)}%), haciendo que los meses primaverales (abril-mayo) presenten la mayor eficiencia neta.`,
        ],
    20,
    ins1Y,
    170,
    30
  );

  // =========================================================================
  // PÁGINA 3: OPERACIÓN SELECCIONADA Y TARJETAS MENSUALES (Imagen 3)
  // =========================================================================
  doc.addPage();
  drawPageChrome(isEn ? `Chapter 2. Selected Solar Study: ${cleanStudyName}` : `Capítulo 2. Estudio Solar Seleccionado: ${cleanStudyName}`, 3, totalPagesDyn);

  // Operational metrics bar (Imagen 3)
  const opBarY = 28;
  const opCardW = 39.5;
  const opCardH = 22;

  // Metric 1: Media Anual
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, opBarY, opCardW, opCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'ANNUAL MEAN RESOURCE' : 'MEDIA ANUAL (RECURSO)', 24, opBarY + 5.5);
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  const activeMeanDailyKwh =
    studyType === 'monthly'
      ? res.monthlyOptimum12.annualMeanDailyKwh
      : studyType === 'seasonal'
      ? res.seasonal.annualMeanDailyKwh
      : studyType === 'polar'
      ? res.tracking.polarAxis.annualMeanDailyKwh
      : studyType === 'azimuthal'
      ? res.tracking.azimuthalAxis.annualMeanDailyKwh
      : studyType === 'horizontal'
      ? res.tracking.horizontalAxis.annualMeanDailyKwh
      : studyType === 'dual'
      ? res.tracking.dualAxis.annualMeanDailyKwh
      : res.optimalAnnual.annualMeanDailyKwh;

  const activeAnnualTotalKwh = activeMeanDailyKwh * 365;
  doc.text(`${activeMeanDailyKwh.toFixed(2)} kWh/m²/d`, 24, opBarY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(`${Math.round(activeAnnualTotalKwh)} kWh/m²·${isEn ? 'yr' : 'año'}`, 24, opBarY + 19);

  // Metric 2: Inclinación Media / Rango
  const op2X = 20 + opCardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(op2X, opBarY, opCardW, opCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'MEAN TILT / RANGE' : 'INCLINACIÓN MEDIA', op2X + 4, opBarY + 5.5);
  doc.setFontSize(13);
  doc.setTextColor(2, 132, 199);
  const tiltAvg =
    studyType === 'monthly'
      ? `${(res.monthlyOptimum12.optimalTiltsDeg.reduce((a, b) => a + b, 0) / 12).toFixed(1)}°`
      : studyType === 'seasonal'
      ? `${Math.round((res.seasonal.winterTiltDeg + res.seasonal.summerTiltDeg) / 2)}°`
      : `${optAngle}°`;
  doc.text(tiltAvg, op2X + 4, opBarY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(
    studyType === 'monthly'
      ? (isEn
          ? `Min: ${Math.min(...res.monthlyOptimum12.optimalTiltsDeg)}° | Max: ${Math.max(...res.monthlyOptimum12.optimalTiltsDeg)}°`
          : `Mín: ${Math.min(...res.monthlyOptimum12.optimalTiltsDeg)}° | Máx: ${Math.max(...res.monthlyOptimum12.optimalTiltsDeg)}°`)
      : (isEn ? 'Design fixed optimum' : 'Óptimo fijo de diseño'),
    op2X + 4,
    opBarY + 19
  );

  // Metric 3: Ganancia s/ Fijo Anual
  const op3X = op2X + opCardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(op3X, opBarY, opCardW, opCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'GAIN VS FIXED OPT' : 'GANANCIA S/ ÓPTIMO FIJO', op3X + 4, opBarY + 5.5);
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129);
  const gainVsOpt =
    studyType === 'monthly'
      ? res.monthlyOptimum12.gainOverOptimalAnnualPct
      : studyType === 'seasonal'
      ? res.seasonal.gainOverOptimalAnnualPct
      : studyType === 'polar'
      ? res.tracking.polarAxis.gainOverOptimalAnnualPct
      : studyType === 'azimuthal'
      ? res.tracking.azimuthalAxis.gainOverOptimalAnnualPct
      : studyType === 'horizontal'
      ? res.tracking.horizontalAxis.gainOverOptimalAnnualPct
      : studyType === 'dual'
      ? res.tracking.dualAxis.gainOverOptimalAnnualPct
      : 0.0;
  doc.text(`+${gainVsOpt.toFixed(2)}%`, op3X + 4, opBarY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(`+${Math.max(0, Math.round(activeAnnualTotalKwh - res.optimalAnnual.annualTotalKwh))} kWh/m²·${isEn ? 'yr' : 'año'}`, op3X + 4, opBarY + 19);

  // Metric 4: Ganancia s/ Horizontal
  const op4X = op3X + opCardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(op4X, opBarY, opCardW, opCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'GAIN VS HORIZONTAL' : 'GANANCIA S/ HORIZONTAL', op4X + 4, opBarY + 5.5);
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129);
  const gainVsHoriz =
    studyType === 'monthly'
      ? res.monthlyOptimum12.gainOverHorizontalPct
      : studyType === 'seasonal'
      ? res.seasonal.gainOverHorizontalPct
      : studyType === 'polar'
      ? res.tracking.polarAxis.gainOverHorizontalPct
      : studyType === 'azimuthal'
      ? res.tracking.azimuthalAxis.gainOverHorizontalPct
      : studyType === 'horizontal'
      ? res.tracking.horizontalAxis.gainOverHorizontalPct
      : studyType === 'dual'
      ? res.tracking.dualAxis.gainOverHorizontalPct
      : res.optimalAnnual.gainOverHorizontalPct;
  doc.text(`+${gainVsHoriz.toFixed(2)}%`, op4X + 4, opBarY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(`+${Math.round(activeAnnualTotalKwh - res.horizontal.annualTotalKwh)} kWh/m²·${isEn ? 'yr' : 'año'}`, op4X + 4, opBarY + 19);

  // -------------------------------------------------------------
  // 12 TARJETAS MENSUALES DE LA OPERACIÓN (Imagen 3)
  // -------------------------------------------------------------
  const mcY = opBarY + opCardH + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Monthly Operational Angle & Daily Radiation Cards' : 'Tarjetas de Inclinación y Radiación Diaria Mes a Mes', 20, mcY);

  const mCardW = 12.8;
  const mCardH = 20;
  const mCardGap = 1.45;
  const mCardBaseY = mcY + 3;

  for (let i = 0; i < 12; i++) {
    const mx = 20 + i * (mCardW + mCardGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(mx, mCardBaseY, mCardW, mCardH, 1.5, 1.5, 'FD');

    // Month
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text(mShort[i].toUpperCase(), mx + 2, mCardBaseY + 4.5);

    // Calculated Tilt / tracker indication
    const seasonalTiltDeg =
      i === 11 || i === 0 || i === 1
        ? res.seasonal.winterTiltDeg
        : i >= 2 && i <= 4
        ? res.seasonal.springTiltDeg
        : i >= 5 && i <= 7
        ? res.seasonal.summerTiltDeg
        : res.seasonal.autumnTiltDeg;

    const angleText =
      studyType === 'monthly'
        ? `${res.monthlyOptimum12.optimalTiltsDeg[i]}°`
        : studyType === 'seasonal'
        ? `${seasonalTiltDeg}°`
        : studyType === 'polar'
        ? (isEn ? 'Polar psi' : 'Seg.psi')
        : studyType === 'dual'
        ? (isEn ? '2-Axis' : '2 Ejes')
        : `${optAngle}°`;

    doc.setFontSize(8);
    doc.setTextColor(2, 132, 199);
    doc.text(angleText, mx + 2, mCardBaseY + 10.5);

    // Radiation
    const radM = radAct[i];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(15, 23, 42);
    doc.text(`${radM.toFixed(2)}`, mx + 2, mCardBaseY + 15);
    doc.setFontSize(4.5);
    doc.setTextColor(148, 163, 184);
    doc.text('kWh/m²/d', mx + 2, mCardBaseY + 18);
  }

  // -------------------------------------------------------------
  // TABLA DETALLADA DE LA OPERACIÓN ACTIVA (Imagen 3)
  // -------------------------------------------------------------
  const tY = mCardBaseY + mCardH + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Monthly Calculation Matrix' : 'Tabla de Cálculo Detallada de la Operación', 20, tY);

  const tblY = tY + 3;
  doc.setFillColor(30, 41, 59);
  doc.rect(20, tblY, 170, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);

  const cols = [
    isEn ? 'Month' : 'Mes',
    'Gdm(0°)',
    isEn ? 'Tilt (°)' : 'Inc (°)',
    isEn ? 'Study Gdm' : 'Gdm Est.',
    isEn ? 'Tamb (°C)' : 'Tª Amb',
    isEn ? 'Tcell (°C)' : 'Tª Cél.',
    isEn ? 'PV Yield' : 'Prod (kWh)',
    isEn ? 'Gain vs 0°' : 'Gan. s/ 0°',
    isEn ? 'Gain vs Opt' : 'Gan. s/ Ópt',
  ];
  const colX = [22, 40, 56, 70, 88, 104, 124, 144, 168];
  cols.forEach((c, idx) => doc.text(c, colX[idx], tblY + 4.5));

  let curRowY = tblY + 6.5;
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, curRowY, 170, 5.0, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(30, 41, 59);
    doc.text(mFull[i], colX[0], curRowY + 3.5);
    doc.text(radH[i].toFixed(2), colX[1], curRowY + 3.5);

    const seasonalTiltDeg =
      i === 11 || i === 0 || i === 1
        ? res.seasonal.winterTiltDeg
        : i >= 2 && i <= 4
        ? res.seasonal.springTiltDeg
        : i >= 5 && i <= 7
        ? res.seasonal.summerTiltDeg
        : res.seasonal.autumnTiltDeg;

    const tiltStr =
      studyType === 'monthly'
        ? `${res.monthlyOptimum12.optimalTiltsDeg[i]}°`
        : studyType === 'seasonal'
        ? `${seasonalTiltDeg}°`
        : `${optAngle}°`;
    doc.text(tiltStr, colX[2], curRowY + 3.5);

    doc.setTextColor(2, 132, 199);
    doc.text(radAct[i].toFixed(2), colX[3], curRowY + 3.5);

    doc.setTextColor(71, 85, 105);
    doc.text(res.temperatures.ambient.monthlyMeanC[i].toFixed(1), colX[4], curRowY + 3.5);
    doc.text(res.temperatures.cellOperating.monthlyCellTempOptimalC[i].toFixed(1), colX[5], curRowY + 3.5);

    doc.setTextColor(15, 23, 42);
    doc.text(String(Math.round(pvMonthly[i] ?? 0)), colX[6], curRowY + 3.5);

    const g0pct = radH[i] > 0 ? ((radAct[i] - radH[i]) / radH[i]) * 100 : 0;
    doc.setTextColor(g0pct >= 0 ? 16 : 220, g0pct >= 0 ? 185 : 38, g0pct >= 0 ? 129 : 38);
    doc.text(`+${g0pct.toFixed(1)}%`, colX[7], curRowY + 3.5);

    const gOptPct = radOpt[i] > 0 ? ((radAct[i] - radOpt[i]) / radOpt[i]) * 100 : 0;
    doc.text(`${gOptPct >= 0 ? '+' : ''}${gOptPct.toFixed(1)}%`, colX[8], curRowY + 3.5);

    curRowY += 5.0;
  }

  // Row of Means
  doc.setFillColor(15, 23, 42);
  doc.rect(20, curRowY, 170, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(56, 189, 248);
  doc.text(isEn ? 'AVERAGE' : 'PROMEDIO', colX[0], curRowY + 4);
  doc.setTextColor(255, 255, 255);
  doc.text((radH.reduce((a, b) => a + b, 0) / 12).toFixed(2), colX[1], curRowY + 4);
  doc.text('-', colX[2], curRowY + 4);
  doc.text(activeMeanDailyKwh.toFixed(2), colX[3], curRowY + 4);
  doc.text(res.temperatures.ambient.annualMeanC.toFixed(1), colX[4], curRowY + 4);
  doc.text(res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(1), colX[5], curRowY + 4);
  doc.text(String(Math.round(res.energyYield.producida.osterwald.annualKwh)), colX[6], curRowY + 4);
  doc.setTextColor(52, 211, 153);
  doc.text(`+${gainVsHoriz.toFixed(1)}%`, colX[7], curRowY + 4);
  doc.text(`+${gainVsOpt.toFixed(1)}%`, colX[8], curRowY + 4);

  // Insights box on operation
  const ins2Y = curRowY + 9;
  drawInsightBox(
    isEn ? 'KEY TECHNICAL INSIGHTS: ANGULAR OPTIMIZATION' : 'INSIGHTS TÉCNICOS DESTACADOS: OPTIMIZACIÓN ANGULAR Y TRAZABILIDAD',
    isEn
      ? [
          `Seasonal Adaptation of Optimal Tilt: Solar declination varies between delta = -23.45° (winter solstice) and +23.45° (summer solstice). In winter, optimal monthly tilt reaches 58°-60° to capture low sun, whereas in summer it lies between 0° and 4° adapting to high solar altitude.`,
          `Gain Comparison vs Annual Fixed: Independent monthly optimization provides a net energy boost of +${gainVsOpt.toFixed(2)}% (+${Math.max(0, Math.round(activeAnnualTotalKwh - res.optimalAnnual.annualTotalKwh))} kWh/m²·yr) compared to annual fixed tilt (${optAngle}°), concentrating maximum relative gains during winter months.`,
        ]
      : [
          `Adaptación Estacional del Ángulo Óptimo: La declinación solar varía entre delta = -23.45° (solsticio de invierno) y +23.45° (solsticio de verano). En invierno, el ángulo óptimo mensual calculado alcanza 58°-60° en ${res.locationName} para capturar el sol bajo, mientras que en verano se sitúa entre 0° y 4° adaptándose a la gran altura cenital solar.`,
          `Comparativa de Ganancia frente a Fijo Anual: La optimización mensual independiente proporciona un incremento neto de energía del +${gainVsOpt.toFixed(2)}% (+${Math.max(0, Math.round(activeAnnualTotalKwh - res.optimalAnnual.annualTotalKwh))} kWh/m²·año) frente a la inclinación fija anual de ${optAngle}°, concentrándose la mayor ganancia relativa en los meses invernales.`,
        ],
    20,
    ins2Y,
    170,
    30
  );

  // =========================================================================
  // PÁGINA 4: RANKING DE RENDIMIENTO DE LAS 8 SUPERFICIES (Imagen 2 & Imagen 5)
  // =========================================================================
  doc.addPage();
  drawPageChrome(isEn ? 'Chapter 3. Global Benchmark & Ranking of Surfaces' : 'Capítulo 3. Comparativa y Ranking Global de Superficies', 4, totalPagesDyn);

  // Ranking Bar Chart (Matching Imagen 2)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Surfaces Performance Ranking & Annual Irradiation (kWh/m²·yr)' : 'Comparativa y Ranking de Rendimiento de Superficies (kWh/m²·año)', 20, 28);

  const sortedSurfs = [...res.surfaceComparison].sort(
    (a, b) => b.annualRadiationKwhM2 - a.annualRadiationKwhM2
  );

  const rBoxY = 32;
  const rBoxH = 68;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, rBoxY, 170, rBoxH, 2, 2, 'FD');

  const maxRankRad = sortedSurfs[0]?.annualRadiationKwhM2 || 2500;
  let barRowY = rBoxY + 7;

  // Colors for ranking bars
  const barColors: [number, number, number][] = [
    [244, 114, 182], // 2 ejes (pink)
    [168, 85, 247],  // 1 eje polar (purple)
    [147, 51, 234],  // 1 eje azimutal (indigo)
    [129, 140, 248], // 1 eje horiz (light purple)
    [56, 189, 248],  // 12 meses (sky)
    [14, 165, 233],  // 4 estac (blue)
    [245, 158, 11],  // fija óptima (amber)
    [2, 132, 199],   // horiz (cyan)
  ];

  sortedSurfs.forEach((s, idx) => {
    // Keep bar width within 44mm so value and percentage gains are 100% visible inside the card
    const barWidth = Math.max(2, (s.annualRadiationKwhM2 / maxRankRad) * 44);
    const [r, g, b] = barColors[idx] || [14, 165, 233];

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(getSurfaceDisplayName(s, isEn), 24, barRowY + 4);

    // Bar
    doc.setFillColor(r, g, b);
    doc.roundedRect(74, barRowY, barWidth, 4.8, 1, 1, 'F');

    // Value text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${Math.round(s.annualRadiationKwhM2)} kWh/m²`, 74 + barWidth + 2.5, barRowY + 3.8);

    // Percentage Gain text (In a prominent, dedicated visible position at X = 154mm)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(s.gainOverHorizontalPct > 0 ? 5 : 100, s.gainOverHorizontalPct > 0 ? 150 : 116, s.gainOverHorizontalPct > 0 ? 105 : 139);
    const gainStr = s.gainOverHorizontalPct > 0 ? `(+${s.gainOverHorizontalPct.toFixed(1)}%)` : '(Base 0%)';
    doc.text(gainStr, 154, barRowY + 3.8);

    barRowY += 7.2;
  });

  // Table of 8 surfaces (Imagen 5)
  const tbl8Y = rBoxY + rBoxH + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Global Benchmark Matrix of All 8 Configurations' : 'Comparativa Global de Todas las Superficies (8 Configuraciones)', 20, tbl8Y);

  const t8BoxY = tbl8Y + 3;
  doc.setFillColor(30, 41, 59);
  doc.rect(20, t8BoxY, 170, 6.0, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);

  const h8 = [
    isEn ? 'Topology / Surface' : 'Topología / Superficie',
    isEn ? 'Type' : 'Tipo',
    isEn ? 'Mean Rad.' : 'Rad. Media',
    isEn ? 'Annual Total' : 'Total Anual',
    isEn ? 'Gain Horiz' : 'Gan. Horiz',
    isEn ? 'Gain Opt Fixed' : 'Gan. Fijo Ópt',
    isEn ? 'Osterwald Prod.' : 'Prod. Osterwald',
    isEn ? 'Cell Temp' : 'Temp. Célula',
  ];
  const x8 = [22, 65, 80, 98, 117, 135, 154, 174];
  h8.forEach((col, idx) => doc.text(col, x8[idx], t8BoxY + 4));

  let cur8Y = t8BoxY + 6.0;
  sortedSurfs.forEach((surf, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, cur8Y, 170, 5.0, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    const sName = getSurfaceDisplayName(surf, isEn);
    const sLines = doc.splitTextToSize(sName, 41);
    if (sLines.length > 1) {
      doc.text(sLines[0], x8[0], cur8Y + 2.2);
      doc.text(sLines[1], x8[0], cur8Y + 4.3);
    } else {
      doc.text(sLines[0] || '', x8[0], cur8Y + 3.5);
    }

    // Type Badge text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(surf.category === 'dual' ? 244 : surf.category === 'single' ? 147 : 14, surf.category === 'dual' ? 114 : surf.category === 'single' ? 51 : 165, surf.category === 'dual' ? 182 : surf.category === 'single' ? 234 : 233);
    doc.text(getCategoryBadge(surf.category, isEn), x8[1], cur8Y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`${surf.meanDailyKwhM2.toFixed(3)} kWh`, x8[2], cur8Y + 3.5);
    doc.text(`${Math.round(surf.annualRadiationKwhM2)} kWh`, x8[3], cur8Y + 3.5);

    doc.setTextColor(surf.gainOverHorizontalPct > 0 ? 16 : 100, surf.gainOverHorizontalPct > 0 ? 185 : 116, surf.gainOverHorizontalPct > 0 ? 129 : 139);
    doc.text(`+${surf.gainOverHorizontalPct.toFixed(1)}%`, x8[4], cur8Y + 3.5);

    doc.setTextColor(surf.gainOverAnnualFixedPct >= 0 ? 16 : 220, surf.gainOverAnnualFixedPct >= 0 ? 185 : 38, surf.gainOverAnnualFixedPct >= 0 ? 129 : 38);
    doc.text(`${surf.gainOverAnnualFixedPct >= 0 ? '+' : ''}${surf.gainOverAnnualFixedPct.toFixed(1)}%`, x8[5], cur8Y + 3.5);

    doc.setTextColor(15, 23, 42);
    doc.text(`${Math.round(surf.energyProducedOsterwaldKwhYear)} kWh`, x8[6], cur8Y + 3.5);
    doc.text(`${surf.meanCellTempDegC.toFixed(1)} °C`, x8[7], cur8Y + 3.5);

    cur8Y += 5.0;
  });

  // Insights Box on 8 surfaces
  const ins3Y = cur8Y + 8;
  drawInsightBox(
    isEn ? 'KEY TECHNICAL INSIGHTS: SOLAR TRACKING VS FIXED TOPOLOGIES' : 'INSIGHTS TÉCNICOS DESTACADOS: SEGUIMIENTO SOLAR VS SUPERFICIES FIJAS',
    isEn
      ? [
          `1-Axis Polar Tracking Performance: Polar tracking achieves 2379 kWh/m²·yr (+39.20% over horizontal), representing 97.4% of the energy collected by dual-axis tracking (2442 kWh/m²·yr). Given its lower electromechanical cost and fewer moving parts, it delivers the optimal techno-economic return.`,
          `Investment Comparison on Fixed Structures: Seasonal tilt with 4 manual adjustments (+13.44%) substantially increases capture compared to annual fixed (+9.16%). 12 monthly adjustments only add a modest +1.26% extra, making 4 adjustments per year the ideal operational balance between maintenance effort and energy gain.`,
        ]
      : [
          `Rendimiento del Seguimiento Polar a 1 Eje: El seguimiento polar alcanza 2379 kWh/m²·año (+39.20% sobre horizontal), lo que equivale al 97.4% de la energía captada por el seguidor a dos ejes (2442 kWh/m²·año). Debido a su menor coste electromecánico y menor número de accionamientos móviles, representa la solución óptima en rentabilidad técnico-económica.`,
          `Comparativa de Inversión en Superficies Fijas: La inclinación fija estacional con 4 ajustes manuales (+13.44%) incrementa sustancialmente la captación respecto a la fija anual (+9.16%). Los 12 ajustes mensuales solo suman un modesto +1.26% adicional, por lo que operacionalmente 4 ajustes al año maximizan la relación beneficio/mantenimiento.`,
        ],
    20,
    ins3Y,
    170,
    28
  );

  // =========================================================================
  // PÁGINA 5: MAPA DE PÉRDIDAS DE CAPTACIÓN CTE DB-HE4 (Imagen 4)
  // =========================================================================
  doc.addPage();
  drawPageChrome(isEn ? 'Chapter 4. CTE DB-HE4 Captation Losses' : 'Capítulo 4. Pérdidas de Captación CTE DB-HE4', 5, totalPagesDyn);

  // Optimal Point Card
  const cteTopY = 28;
  doc.setFillColor(209, 250, 229);
  doc.setDrawColor(52, 211, 153);
  doc.roundedRect(20, cteTopY, 170, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87);
  doc.text(
    isEn
      ? `Absolute Capture Optimum (CTE DB-HE4): Tilt: ${res.captureLossMap.optimalPoint.betaDeg}°, Azimuth: ${res.captureLossMap.optimalPoint.alphaDeg}° | ${res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3)} kWh/m²/day (${Math.round(res.captureLossMap.optimalPoint.maxAnnualRadiationKwhM2)} kWh/m²·yr)`
      : `Óptimo Absoluto de Captación (CTE DB-HE4): Inclinación: ${res.captureLossMap.optimalPoint.betaDeg}°, Orientación: ${res.captureLossMap.optimalPoint.alphaDeg}° | ${res.captureLossMap.optimalPoint.maxDailyRadiationKwh.toFixed(3)} kWh/m²/día (${Math.round(res.captureLossMap.optimalPoint.maxAnnualRadiationKwhM2)} kWh/m²·año)`,
    24,
    cteTopY + 8.5
  );

  // 4 CTE Limits Cards (Matching Imagen 4)
  const lCardY = cteTopY + 18;
  const lCardW = 39.5;
  const lCardH = 22;

  // 1: General (<= 10%)
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(20, lCardY, lCardW, lCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(22, 101, 52);
  doc.text(isEn ? 'CTE GENERAL LIMIT' : 'LÍMITE GENERAL CTE', 24, lCardY + 5.5);
  doc.text(isEn ? '(Loss <= 10%)' : '(Pérdida <= 10%)', 24, lCardY + 9.5);
  doc.setFontSize(11);
  doc.text(`${res.captureLossMap.cteZones.generalPctCompliant}%`, 24, lCardY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'of angular space' : 'del espacio angular', 24, lCardY + 20);

  // 2: Superposición (<= 20%)
  const l2X = 20 + lCardW + cardGap;
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(l2X, lCardY, lCardW, lCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(133, 77, 14);
  doc.text(isEn ? 'CTE SUPERPOSITION' : 'SUPERPOSICIÓN CTE', l2X + 4, lCardY + 5.5);
  doc.text(isEn ? '(Loss <= 20%)' : '(Pérdida <= 20%)', l2X + 4, lCardY + 9.5);
  doc.setFontSize(11);
  doc.text(`${res.captureLossMap.cteZones.superpositionPctCompliant}%`, l2X + 4, lCardY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'of angular space' : 'del espacio angular', l2X + 4, lCardY + 20);

  // 3: Integración (<= 40%)
  const l3X = l2X + lCardW + cardGap;
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(l3X, lCardY, lCardW, lCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(154, 52, 18);
  doc.text(isEn ? 'ARCH. INTEGRATION' : 'INTEGRACIÓN ARQUITECT.', l3X + 4, lCardY + 5.5);
  doc.text(isEn ? '(Loss <= 40%)' : '(Pérdida <= 40%)', l3X + 4, lCardY + 9.5);
  doc.setFontSize(11);
  doc.text(`${res.captureLossMap.cteZones.integrationPctCompliant}%`, l3X + 4, lCardY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'of angular space' : 'del espacio angular', l3X + 4, lCardY + 20);

  // 4: Fuera de norma (> 40%)
  const l4X = l3X + lCardW + cardGap;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(l4X, lCardY, lCardW, lCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(153, 27, 27);
  doc.text(isEn ? 'NON-COMPLIANT' : 'FUERA DE NORMA', l4X + 4, lCardY + 5.5);
  doc.text(isEn ? '(Loss > 40%)' : '(Pérdida > 40%)', l4X + 4, lCardY + 9.5);
  doc.setFontSize(11);
  const outOfNorm = (100 - res.captureLossMap.cteZones.integrationPctCompliant).toFixed(1);
  doc.text(`${outOfNorm}%`, l4X + 4, lCardY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? 'outside CTE limits' : 'fuera de norma CTE', l4X + 4, lCardY + 20);

  // Diagram of Capture Loss Map (positioned directly below CTE zone cards)
  const mapY = lCardY + lCardH + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const mapTitle =
    studyType === 'monthly'
      ? isEn
        ? 'Capture Loss Isoline Diagram (Annual Global Benchmark • 12 Monthly Maps on Pages 6-7)'
        : 'Diagrama Isolíneas del Mapa de Pérdidas (Referencia Anual • 12 Mapas Mensuales en Págs. 6 y 7)'
      : studyType === 'seasonal'
      ? isEn
        ? 'Capture Loss Isoline Diagram (Annual Global Benchmark • 4 Seasonal Maps on Page 6)'
        : 'Diagrama Isolíneas del Mapa de Pérdidas (Referencia Anual • 4 Mapas Estacionales en Pág. 6)'
      : isEn
      ? 'CTE DB-HE4 Isoline Loss Heatmap Diagram (1° Resolution)'
      : 'Diagrama Isolíneas del Mapa de Pérdidas de Captación (Resolución 1°)';
  doc.text(mapTitle, 20, mapY);

  const mapBoxY = mapY + 3;
  const mapW = 170;
  const mapH = 60;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, mapBoxY, mapW, mapH, 2, 2, 'FD');

  // Draw simulated CTE contour zones strictly contained within card
  const optXMap = 20 + mapW / 2;
  const rawOptYMap = mapBoxY + mapH * (1 - optAngle / 90.0);
  const ryMax = 12.0;
  // Center strictly clamped so orange ellipse ry=12 never reaches closer than 7mm to top/bottom borders
  const optYMap = Math.max(mapBoxY + ryMax + 5, Math.min(mapBoxY + mapH - ryMax - 7, rawOptYMap));

  // Zone 4: Red (> 40%) - Background frame
  doc.setFillColor(254, 226, 226);
  doc.roundedRect(22, mapBoxY + 2, mapW - 4, mapH - 4, 1.5, 1.5, 'F');

  // Zone 3: Orange (<= 40%) - Strictly bounded
  doc.setFillColor(254, 215, 170);
  doc.ellipse(optXMap, optYMap, 50, 12, 'F');

  // Zone 2: Yellow (<= 20%)
  doc.setFillColor(254, 240, 138);
  doc.ellipse(optXMap, optYMap, 33, 8.5, 'F');

  // Zone 1: Green (<= 10%)
  doc.setFillColor(187, 247, 208);
  doc.ellipse(optXMap, optYMap, 18, 5.0, 'F');

  // Center crosshair and star
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.line(optXMap - 56, optYMap, optXMap + 56, optYMap);
  doc.line(optXMap, mapBoxY + 4, optXMap, mapBoxY + mapH - 5);

  doc.setFillColor(30, 41, 59);
  doc.circle(optXMap, optYMap, 1.4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`* ${isEn ? 'OPTIMUM: Tilt' : 'OPTIMO: Inc'} = ${optAngle}°, ${isEn ? 'Azimuth' : 'Ori'} = 0° (0% ${isEn ? 'loss' : 'perdida'})`, optXMap + 3, optYMap - 2.5);

  // Axis Labels
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(isEn ? '-90° (East)' : '-90° (Este)', 24, mapBoxY + mapH - 2);
  doc.text(isEn ? '0° (South)' : '0° (Sur)', optXMap - 4, mapBoxY + mapH - 2);
  doc.text(isEn ? '+90° (West)' : '+90° (Oeste)', 166, mapBoxY + mapH - 2);

  doc.text(isEn ? '90° (Vertical)' : '90° (Vertical)', 23, mapBoxY + 6);
  doc.text(isEn ? '0° (Horizontal)' : '0° (Horizontal)', 23, mapBoxY + mapH - 7);

  // Insights box on CTE
  const ins4Y = mapBoxY + mapH + 6;
  drawInsightBox(
    isEn ? 'KEY TECHNICAL INSIGHTS: CTE DB-HE4 REGULATORY COMPLIANCE' : 'INSIGHTS TÉCNICOS DESTACADOS: CUMPLIMIENTO REGLAMENTARIO CTE DB-HE4',
    isEn
      ? [
          `Architectural Integration Tolerance: For rooftop and facade installations, DB-HE4 allows up to 20% (superposition) and 40% (architectural integration) capture losses. This permits orienting collectors up to +/-60° azimuth from south within Spanish regulatory limits.`,
          `Optimal Design Window for General Limit (Loss <= 10%): The optimal window for utility-scale ground or flat-roof arrays corresponds to the green domain (Tilt between 18° and 48°, Azimuth between -25° and +25°), securing over 90% of maximum potential solar yield.`,
        ]
      : [
          `Tolerancia de Integración Arquitectónica: Para instalaciones en cubiertas y fachadas existentes, el DB-HE4 admite hasta un 20% (superposición) y 40% (integración arquitectónica) de pérdidas. Esto permite desviar los captadores hasta +/-60° azimutales respecto al sur con una penalización admisible dentro de los estándares legales españoles.`,
          `Ventana de Inclinación para Límite General (Pérdida <= 10%): El diseño óptimo para grandes generadores o instalaciones en suelo queda circunscrito al elipsoide verde (Inclinación entre 18° y 48°, Orientación entre -25° y +25°), asegurando captar más del 90% del recurso solar potencial disponible.`,
        ],
    20,
    ins4Y,
    170,
    32
  );

  // =========================================================================
  // PÁGINAS 4.x: MAPAS DE PÉRDIDAS MENSUALES (12) / ESTACIONALES (4)
  // =========================================================================
  const drawMiniLossMap = (m: MiniLossMap, x: number, y: number, w: number, h: number) => {
    // Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizePdfText(m.label), x + 3, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(sanitizePdfText(m.sub), x + w - 3, y + 5.5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(4, 120, 87);
    doc.text(
      sanitizePdfText(`${isEn ? 'Optimum: Tilt' : 'Optimo: Inc'} = ${m.betaDeg.toFixed(0)}°, ${isEn ? 'Az' : 'Ori'} = ${m.alphaDeg.toFixed(0)}° | ${m.maxDaily.toFixed(2)} kWh/m²/d`),
      x + 3,
      y + 10
    );

    // Heatmap area
    const hx = x + 9;
    const hy = y + 13;
    const hw = w - 12;
    const hh = h - 28;
    const betas = lossMapRes.betasDeg;
    const alphas = lossMapRes.alphasDeg;
    const mat = m.lossMatrix;
    if (mat && mat.length === betas.length && betas.length > 0 && alphas.length > 0) {
      const nR = betas.length;
      const nC = alphas.length;
      const cw = hw / nC;
      const ch = hh / nR;
      for (let r = 0; r < nR; r++) {
        // row 0 -> lowest beta at bottom
        const betaIdxFromTop = betas[0] <= betas[nR - 1] ? nR - 1 - r : r;
        const cy = hy + betaIdxFromTop * ch;
        for (let c = 0; c < nC; c++) {
          const l = mat[r][c];
          if (l <= 10) doc.setFillColor(134, 239, 172);
          else if (l <= 20) doc.setFillColor(253, 224, 71);
          else if (l <= 40) doc.setFillColor(253, 186, 116);
          else doc.setFillColor(252, 165, 165);
          doc.rect(hx + c * cw, cy, cw + 0.05, ch + 0.05, 'F');
        }
      }
      // Optimum marker
      const aMin = Math.min(...alphas);
      const aMax = Math.max(...alphas);
      const bMin = Math.min(...betas);
      const bMax = Math.max(...betas);
      const ox = hx + ((m.alphaDeg - aMin) / (aMax - aMin || 1)) * hw;
      const oy = hy + hh - ((m.betaDeg - bMin) / (bMax - bMin || 1)) * hh;
      doc.setFillColor(15, 23, 42);
      doc.circle(Math.max(hx + 1, Math.min(hx + hw - 1, ox)), Math.max(hy + 1, Math.min(hy + hh - 1, oy)), 1.0, 'F');
    } else {
      doc.setFillColor(254, 226, 226);
      doc.rect(hx, hy, hw, hh, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(isEn ? 'Matrix not available' : 'Matriz no disponible', hx + hw / 2, hy + hh / 2, { align: 'center' });
    }
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);
    doc.rect(hx, hy, hw, hh, 'S');

    // Axis labels
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(100, 116, 139);
    doc.text('90°', x + 2, hy + 2);
    doc.text('0°', x + 3, hy + hh);
    doc.text('-90° E', hx, hy + hh + 3);
    doc.text('0° S', hx + hw / 2, hy + hh + 3, { align: 'center' });
    doc.text(`+90° ${isEn ? 'W' : 'O'}`, hx + hw, hy + hh + 3, { align: 'right' });

    // CTE compliance summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    const sy = y + h - 4;
    doc.setTextColor(22, 101, 52);
    doc.text(sanitizePdfText(`<=10%: ${m.zones.generalPctCompliant}%`), x + 3, sy);
    doc.setTextColor(133, 77, 14);
    doc.text(sanitizePdfText(`<=20%: ${m.zones.superpositionPctCompliant}%`), x + w / 2, sy, { align: 'center' });
    doc.setTextColor(154, 52, 18);
    doc.text(sanitizePdfText(`<=40%: ${m.zones.integrationPctCompliant}%`), x + w - 3, sy, { align: 'right' });
  };

  if (extraMapPages > 0) {
    const cols = 2;
    const rows = studyType === 'monthly' ? 3 : 2;
    const gridTop = 36;
    const gridBottom = pageHeight - 22;
    const gap = 5;
    const cardW = (170 - gap) / cols;
    const cardH = (gridBottom - gridTop - gap * (rows - 1)) / rows;

    for (let p = 0; p < extraMapPages; p++) {
      doc.addPage();
      const pageNo = 6 + p;
      drawPageChrome(
        studyType === 'monthly'
          ? (isEn ? `Chapter 4. Monthly Loss Maps (${p + 1}/${extraMapPages})` : `Capítulo 4. Mapas de Pérdidas Mensuales (${p + 1}/${extraMapPages})`)
          : (isEn ? 'Chapter 4. Seasonal Loss Maps' : 'Capítulo 4. Mapas de Pérdidas Estacionales'),
        pageNo,
        totalPagesDyn
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(
        sanitizePdfText(
          studyType === 'monthly'
            ? isEn
              ? 'CTE DB-HE4 Capture Loss Maps - 12 Monthly Positions'
              : 'Mapas de Pérdidas de Captación CTE DB-HE4 - 12 Posiciones Mensuales'
            : isEn
            ? 'CTE DB-HE4 Capture Loss Maps - 4 Seasonal Positions'
            : 'Mapas de Pérdidas de Captación CTE DB-HE4 - 4 Posiciones Estacionales'
        ),
        20,
        29
      );

      // Legend
      const legend: [string, [number, number, number]][] = [
        ['<= 10%', [134, 239, 172]],
        ['<= 20%', [253, 224, 71]],
        ['<= 40%', [253, 186, 116]],
        ['> 40%', [252, 165, 165]],
      ];
      let lx = 120;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      legend.forEach(([lbl, col]) => {
        doc.setFillColor(col[0], col[1], col[2]);
        doc.rect(lx, 26.5, 3.5, 3, 'F');
        doc.setTextColor(51, 65, 85);
        doc.text(sanitizePdfText(lbl), lx + 4.5, 29);
        lx += 17.5;
      });

      const slice = extraMapsList.slice(p * mapsPerPage, (p + 1) * mapsPerPage);
      slice.forEach((m, i) => {
        const cx = 20 + (i % cols) * (cardW + gap);
        const cy = gridTop + Math.floor(i / cols) * (cardH + gap);
        drawMiniLossMap(m, cx, cy, cardW, cardH);
      });
    }
  }

  // =========================================================================
  // PÁGINA FINAL: CURVA DE EVOLUCIÓN CONTINUA 1° A 90° (Capítulo Radiación)
  // =========================================================================
  doc.addPage();
  drawPageChrome(isEn ? 'Chapter 5. Continuous Radiation Evolution Curve (Tilt 1° to 90°)' : 'Capítulo 5. Evolución Continua de Radiación (Inclinación 1° a 90°)', chapter5Page, totalPagesDyn);

  // Curve 1° to 90° Chart Frame
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Global Radiation Evolution Across Tilt Spectrum (Tilt 1° to 90°)' : 'Evolución de la Radiación en el Rango Continuo de Inclinaciones (Inclinación 1° a 90°)', 20, 28);

  const cvW = 170;
  const cvH = 65;
  const cvBoxY = 30;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, cvBoxY, cvW, cvH, 2, 2, 'FD');

  // Compute 1° to 90° points
  const radCurve1to90: number[] = [];
  for (let deg = 1; deg <= 90; deg++) {
    const mDaily = getMonthlyRadiationForAngle(res, 'global', deg);
    radCurve1to90.push(mDaily.reduce((a, b) => a + b, 0) / 12);
  }

  const meanRad0 = res.horizontal.annualMeanDailyKwh;
  const meanRadStudy = activeMeanDailyKwh;
  const maxValCv = Math.max(...radCurve1to90, meanRad0, meanRadStudy) * 1.15;
  const minValCv = Math.min(...radCurve1to90, meanRad0, meanRadStudy) * 0.85;

  const getCvX = (deg: number) => 24 + 12 + ((deg - 1) / 89) * (cvW - 24);
  const getCvY = (val: number) => cvBoxY + cvH - 12 - ((val - minValCv) / (maxValCv - minValCv || 1)) * (cvH - 24);

  // Horizontal Reference Line
  const y0Line = getCvY(meanRad0);
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.6);
  doc.line(36, y0Line, 20 + cvW - 12, y0Line);

  // Study Average Reference Line
  const yStudyLine = getCvY(meanRadStudy);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(36, yStudyLine, 20 + cvW - 12, yStudyLine);

  // Main 1° to 90° Curve (Royal Blue)
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.4);
  for (let deg = 1; deg < 90; deg++) {
    doc.line(
      getCvX(deg),
      getCvY(radCurve1to90[deg - 1]),
      getCvX(deg + 1),
      getCvY(radCurve1to90[deg])
    );
  }

  // Peak Circle & Optimum Annotation
  const optClamped = Math.max(1, Math.min(90, optAngle));
  const optPx = getCvX(optClamped);
  const optPy = getCvY(radCurve1to90[optClamped - 1]);

  doc.setFillColor(220, 38, 38);
  doc.circle(optPx, optPy, 2.0, 'F');
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(optPx, optPy, optPx, cvBoxY + cvH - 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 38, 38);
  doc.text(`* ${isEn ? 'Optimal Tilt: Tilt' : 'Inclinación Óptima: Inc'} = ${optClamped}° (${radCurve1to90[optClamped - 1].toFixed(2)} kWh/m²/d)`, optPx - 15, optPy - 4);

  // Axis Ticks
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  for (const ang of [1, 15, 30, 45, 60, 75, 90]) {
    const ax = getCvX(ang);
    doc.text(`${ang}°`, ax - 2, cvBoxY + cvH - 6);
  }

  // Legend
  doc.setFontSize(7);
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.2);
  doc.line(40, cvBoxY + 8, 48, cvBoxY + 8);
  doc.setTextColor(37, 99, 235);
  doc.text(isEn ? 'Gdm Curve (1°..90°)' : 'Curva Gdm (1°..90°)', 50, cvBoxY + 9);

  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.8);
  doc.line(90, cvBoxY + 8, 98, cvBoxY + 8);
  doc.setTextColor(14, 165, 233);
  doc.text(`${isEn ? 'Horizontal Plane 0°' : 'Plano Horizontal 0°'} (${meanRad0.toFixed(2)})`, 100, cvBoxY + 9);

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.0);
  const legendStudyCurve = doc.splitTextToSize(`${cleanStudyName} (${meanRadStudy.toFixed(2)})`, 34);
  if (legendStudyCurve.length > 1) {
    doc.text(legendStudyCurve[0], 155, cvBoxY + 7.5);
    doc.text(legendStudyCurve[1], 155, cvBoxY + 10.5);
  } else {
    doc.text(legendStudyCurve[0] || '', 155, cvBoxY + 9);
  }

  // Key Tilts Discrete Table
  const dtY = cvBoxY + cvH + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Discrete Tilt Angles Benchmark Matrix' : 'Valores Discretos de Radiación en Inclinaciones Estándar', 20, dtY);

  const dtBoxY = dtY + 3;
  doc.setFillColor(30, 41, 59);
  doc.rect(20, dtBoxY, 170, 6.0, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);

  const dtCols = [
    isEn ? 'Tilt Angle' : 'Inclinación',
    isEn ? 'Mean Gdm (kWh/m²/d)' : 'Gdm Media (kWh/m²/d)',
    isEn ? 'Annual Irrad. (kWh/m²)' : 'Irradiación Anual (kWh/m²)',
    isEn ? 'Gain vs Horiz (%)' : 'Ganancia vs Horiz (%)',
    isEn ? 'Loss vs Opt (%)' : 'Pérdida vs Óptimo (%)',
  ];
  const dtX = [24, 56, 95, 133, 162];
  dtCols.forEach((col, idx) => doc.text(col, dtX[idx], dtBoxY + 4));

  const sampleDegs = [0, 15, 30, 45, 60, 75, 90, optAngle];
  const uniqueDegs = Array.from(new Set(sampleDegs)).sort((a, b) => a - b);
  const maxRadOptVal = radCurve1to90[optClamped - 1];

  let curDtY = dtBoxY + 6.0;
  uniqueDegs.forEach((deg, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, curDtY, 170, 5.0, 'F');
    }
    const val = deg === 0 ? meanRad0 : radCurve1to90[deg - 1];
    const ann = val * 365;
    const gainH = meanRad0 > 0 ? ((val - meanRad0) / meanRad0) * 100 : 0;
    const lossOpt = maxRadOptVal > 0 ? ((maxRadOptVal - val) / maxRadOptVal) * 100 : 0;

    doc.setFont('helvetica', deg === optAngle ? 'bold' : 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(deg === optAngle ? 220 : 15, deg === optAngle ? 38 : 23, deg === optAngle ? 38 : 42);
    doc.text(
      deg === optAngle
        ? (isEn ? `Tilt = ${deg}° (OPTIMAL)` : `Inc = ${deg}° (ÓPTIMO)`)
        : (isEn ? `Tilt = ${deg}°` : `Inc = ${deg}°`),
      dtX[0],
      curDtY + 3.5
    );

    doc.setTextColor(deg === optAngle ? 220 : 30, deg === optAngle ? 38 : 41, deg === optAngle ? 38 : 59);
    doc.text(`${val.toFixed(3)} kWh/m²/d`, dtX[1], curDtY + 3.5);
    doc.text(`${Math.round(ann)} kWh/m²`, dtX[2], curDtY + 3.5);

    doc.setTextColor(gainH >= 0 ? 16 : 220, gainH >= 0 ? 185 : 38, gainH >= 0 ? 129 : 38);
    doc.text(`${gainH >= 0 ? '+' : ''}${gainH.toFixed(2)}%`, dtX[3], curDtY + 3.5);

    doc.setTextColor(lossOpt <= 0.05 ? 16 : lossOpt <= 10 ? 234 : 220, lossOpt <= 0.05 ? 185 : lossOpt <= 10 ? 179 : 38, lossOpt <= 0.05 ? 129 : lossOpt <= 10 ? 8 : 38);
    doc.text(lossOpt <= 0.05 ? (isEn ? '0.00% (Max)' : '0.00% (Máx)') : `-${lossOpt.toFixed(2)}%`, dtX[4], curDtY + 3.5);

    curDtY += 5.0;
  });

  // Insights box on tilt curve
  const ins5Y = curDtY + 6;
  drawInsightBox(
    isEn ? 'KEY TECHNICAL INSIGHTS: ANGULAR SENSITIVITY' : 'INSIGHTS TÉCNICOS DESTACADOS: SENSIBILIDAD ANGULAR Y MESETA DE TOLERANCIA',
    isEn
      ? [
          `Angular Tolerance Plateau: The annual radiation curve exhibits a broad convex plateau around optimum (Tilt = ${optAngle}°). Tilts between 20° and 40° capture over 98.8% of maximum potential resource, offering generous construction tolerance for standard roof pitches.`,
          `Accelerated Drop at Steep Angles: For inclinations above 60°, radiation capture drops sharply (up to -28% at 90° compared to optimum) due to reduced direct beam projection during peak summer insolation.`,
        ]
      : [
          `Meseta de Tolerancia Angular: La curva anual de radiación exhibe una amplia meseta convexa en torno al óptimo (Inclinación = ${optAngle}°). Inclinaciones en el rango de 20° a 40° capturan más del 98.8% del recurso máximo potencial, permitiendo una gran tolerancia constructiva para adaptarse a pendientes de tejados estándar.`,
          `Caída Acelerada en Inclinaciones Elevadas: Para inclinaciones superiores a 60°, la captación desciende rápidamente (hasta un -28% a 90° frente a la óptima), debido a la reducción del factor de visión directa durante los meses estivales de mayor insolación.`,
        ],
    20,
    ins5Y,
    170,
    30
  );

  // -------------------------------------------------------------
  // SAVE / DOWNLOAD PDF WITH TIMESTAMP
  // -------------------------------------------------------------
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = isEn
    ? `OrientSol4_Technical_Report_${studyType.toUpperCase()}_${cleanLoc}_${fileTimestamp}.pdf`
    : `OrientSol4_Informe_${studyType.toUpperCase()}_${cleanLoc}_${fileTimestamp}.pdf`;
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

/**
 * Energy Data Interface for Official Energy Report
 */
export interface EnergyDataReport {
  e0_mes: number[];
  e_mes: number[];
  ganancia_mes: number[];
  e0_anual: number;
  e_anual: number;
  ganancia_anual: number;
}

/**
 * Generates the Official OrientSol 4.0 Energy Report PDF strictly conforming to:
 * - Figura 5.2.83: Contenidos del informe generado para la energía producida
 * - Tabla de contenidos (1. Introducción, 2. Energía generada)
 * - Lista de figuras (2.1. Energía media horizontal, 2.2. Energía estudio seleccionado, 2.3. Ganancias respecto al plano horizontal)
 * - Exact Timestamps and Highlighted Insights
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

  const cleanStudyTitle = sanitizePdfText(studyTitle);

  // Header & Footer helper using the exact same format
  const drawPageChrome = (chapterTitle: string, pageNum: number, totalPages: number) => {
    drawOrientSolPageChrome(doc, {
      chapterTitle,
      subHeader: `OrientSol 4.0 • ${cleanStudyTitle} • ${res.locationName} (Lat: ${res.latitude.toFixed(2)}°)`,
      pageNum,
      totalPages,
      formattedDateTime: downloadDateFormatted,
      isoTimestamp: now.toISOString(),
      isEn,
      skipHeader: false,
    });
  };

  // =========================================================================
  // PÁGINA 1: PORTADA & CONTENIDOS DEL INFORME (Figura 5.2.83)
  // =========================================================================
  drawPageChrome(
    isEn
      ? 'Chapter 1. Introduction & PV Installation Parameters'
      : 'Capítulo 1. Introducción y Parámetros de la Instalación FV',
    1,
    3
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? 'OrientSol 4.0 • Software Implementation & Energy Study'
      : 'OrientSol 4.0 • Implementación de Software y Estudio Energético',
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
      ? '2.1. Mean monthly energy on horizontal surface ................................................................ 2'
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
      ? '2.3. Global radiation gains relative to horizontal plane ................................................... 3'
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
  doc.roundedRect(20, 138, 170, 78, 2, 2, 'FD');

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
  const studyTitleLines = doc.splitTextToSize(cleanStudyTitle, 52);
  doc.text(studyTitleLines, 55, 154);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Method' : 'Método'}:`, 110, 154);
  doc.setFont('helvetica', 'normal');
  doc.text('Osterwald Thermal & Yield Model', 135, 154);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Installed peak power' : 'Potencia pico instalada'}:`, 25, 162);
  doc.setFont('helvetica', 'normal');
  doc.text(`${peakKw} kWp`, 80, 162);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Temperature coefficient' : 'Coeficiente de temperatura'} (gamma):`, 25, 170);
  doc.setFont('helvetica', 'normal');
  doc.text(`${coefTemp} 1/°C`, 85, 170);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'NOCT / TONC' : 'TONC'}:`, 25, 178);
  doc.setFont('helvetica', 'normal');
  doc.text(`${tonc} °C`, 85, 178);

  doc.setFont('helvetica', 'bold');
  doc.text(`${isEn ? 'Export timestamp' : 'Marca temporal de exportación'}:`, 25, 186);
  doc.setFont('helvetica', 'normal');
  doc.text(`${downloadDateFormatted} (ISO: ${now.toISOString()})`, 85, 186);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const formula1 = isEn
    ? 'Calculation implemented according to Osterwald formula: PM = PM,STC · (G/1000) · [1 + gamma · (Tc - 25)]'
    : 'Cálculo implementado según la fórmula de Osterwald: PM = PM,STC · (G/1000) · [1 + gamma · (Tc - 25)]';
  const f1Lines = doc.splitTextToSize(sanitizePdfText(formula1), 160);
  doc.text(f1Lines, 25, 199);

  const formula2 = isEn
    ? 'where cell temperature is given by: Tc = Tamb + [(NOCT - 20) / 800] · G'
    : 'donde la temperatura de célula viene dada por: Tc = Tamb + [(TONC - 20) / 800] · G';
  const f2Lines = doc.splitTextToSize(sanitizePdfText(formula2), 160);
  doc.text(f2Lines, 25, 205);

  // =========================================================================
  // PÁGINA 2: ENERGÍA GENERADA & FIGURA 2.1
  // =========================================================================
  doc.addPage();
  drawPageChrome(
    isEn
      ? 'Chapter 2. Monthly Energy Yield & Horizontal Plane Resource'
      : 'Capítulo 2. Energía Generada Mensual y Recurso en Superficie Horizontal',
    2,
    3
  );

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
  const chart1Y = curY + 14;
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

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, chart1Y + 4, 170, 52, 2, 2, 'FD');

  const maxE0 = Math.max(...energyData.e0_mes) * 1.15 || 2500;
  const barPlotBaseY = chart1Y + 50;
  const barPlotH = 34;
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
    doc.text(String(i + 1), x + 3, barPlotBaseY + 4);

    doc.setFontSize(5.5);
    doc.text(String(Math.round(val)), x - 1, y - 2);
  }

  // Insight box on Page 2
  const insE1Y = chart1Y + 60;
  drawPdfInsightBox(
    doc,
    isEn
      ? 'TECHNICAL INSIGHT: HORIZONTAL RESOURCE & SEASONAL VARIATION'
      : 'INSIGHT TÉCNICO: RECURSO HORIZONTAL Y VARIACIÓN ESTACIONAL',
    [
      isEn
        ? `Flat Surface Seasonality: Generation on a horizontal surface reaches its minimum in December (${Math.round(energyData.e0_mes[11])} kWh) and its maximum in July (${Math.round(energyData.e0_mes[6])} kWh), with a variation ratio of ${((energyData.e0_mes[6] || 1) / (energyData.e0_mes[11] || 1)).toFixed(2)}x.`
        : `Estacionalidad de Superficie Plana: La generación sobre superficie horizontal alcanza su mínimo en diciembre (${Math.round(energyData.e0_mes[11])} kWh) y su máximo en julio (${Math.round(energyData.e0_mes[6])} kWh), con un factor de variación de ${((energyData.e0_mes[6] || 1) / (energyData.e0_mes[11] || 1)).toFixed(2)}x.`,
    ],
    20,
    insE1Y,
    170,
    18
  );

  // =========================================================================
  // PÁGINA 3: FIGURAS 2.2 Y 2.3 CON INSIGHTS
  // =========================================================================
  doc.addPage();
  drawPageChrome(
    isEn
      ? 'Chapter 3. Energy Comparison & Net Yield Optimization'
      : 'Capítulo 3. Comparativa Energética y Ganancias Netas',
    3,
    3
  );

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
  doc.roundedRect(20, chart2Y + 4, 170, 54, 2, 2, 'FD');

  const maxE = Math.max(...energyData.e_mes) * 1.15 || 2500;
  const barPlot2BaseY = chart2Y + 52;

  for (let i = 0; i < 12; i++) {
    const val = energyData.e_mes[i];
    const h = (val / maxE) * 36;
    const x = 27 + i * barStep;
    const y = barPlot2BaseY - h;

    doc.setFillColor(16, 185, 129);
    doc.rect(x, y, barW, h, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(String(i + 1), x + 3, barPlot2BaseY + 4);

    doc.setFontSize(5.5);
    doc.text(String(Math.round(val)), x - 1, y - 2);
  }

  // Figura 2.3: Ganancias respecto al plano horizontal
  const chart3Y = chart2Y + 64;
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
  doc.roundedRect(20, chart3Y + 4, 170, 56, 2, 2, 'FD');

  const maxGainAbs = Math.max(...energyData.ganancia_mes.map((g) => Math.abs(g))) * 1.25 || 500;
  const zeroLineY = chart3Y + 36;

  // Zero axis line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(24, zeroLineY, 186, zeroLineY);

  for (let i = 0; i < 12; i++) {
    const g = energyData.ganancia_mes[i];
    const h = (Math.abs(g) / maxGainAbs) * 20;
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
    doc.text(String(i + 1), x + 3, zeroLineY + (g >= 0 ? 4 : -2));
  }

  // Insight box on Page 3
  const insE2Y = chart3Y + 66;
  drawPdfInsightBox(
    doc,
    isEn
      ? 'TECHNICAL INSIGHT: NET CONTRIBUTION OF ENERGY OPTIMIZATION'
      : 'INSIGHT TÉCNICO: APORTE NETO DE LA OPTIMIZACIÓN ENERGÉTICA',
    [
      isEn
        ? `Cumulative Annual Gain: The selected configuration (${studyTitle}) provides a net annual gain of +${energyData.ganancia_anual.toFixed(1)} kWh compared to a horizontal surface, concentrating the greatest relative gain during winter by intercepting beam irradiance at a lower incident angle.`
        : `Beneficio Anual Acumulado: La configuración seleccionada (${studyTitle}) genera una ganancia anual neta de +${energyData.ganancia_anual.toFixed(1)} kWh frente a superficie horizontal, concentrándose el mayor beneficio relativo en invierno al captar la radiación directa con menor ángulo de incidencia.`,
    ],
    20,
    insE2Y,
    170,
    20
  );

  // Save the Energy PDF
  const cleanLoc = res.locationName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = isEn
    ? `OrientSol4_Energy_Report_${cleanLoc}_${fileTimestamp}.pdf`
    : `OrientSol4_Informe_Energia_${cleanLoc}_${fileTimestamp}.pdf`;
  const pdfBlob = doc.output('blob');

  let savedDirectoryLabel = 'C:\\OrientSol3\\InformesPDF';

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: isEn ? 'PDF Document (*.pdf)' : 'Documento PDF (*.pdf)',
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
