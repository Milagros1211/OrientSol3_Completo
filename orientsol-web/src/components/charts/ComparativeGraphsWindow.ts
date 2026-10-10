import { i18n } from '@/i18n';
import type { SolarBridgeSimulationResult } from '@/services/bridge/solarCalculationBridge';
import { getMonthlyRadiationForAngle } from '@/components/climate/OptimalAnnualStudyPanel';

interface ComparativeGraphsProps {
  simulationResult: SolarBridgeSimulationResult;
  locationName: string;
  latitude: number;
  onBack?: () => void;
  onExit?: () => void;
}

export type RadiationComponent = 'global' | 'beam' | 'diffuse' | 'albedo';
export type GraphType = 'lines' | 'bars';

/**
 * Replicates OrientSol 3.0 - Gráficas para comparativa de todos los tipos de estudios
 * Following strictly Figura 5.2.109 (Líneas) and Figura 5.2.111 (Barras)
 */
export function renderComparativeGraphsWindow(props: ComparativeGraphsProps): HTMLElement {
  const { simulationResult: res, locationName, latitude, onBack, onExit } = props;

  const container = document.createElement('div');
  container.className = 'matlab-window-container comparative-graphs-window';
  container.style.cssText = `
    background: #f8fafc;
    color: #1e293b;
    border: 2px solid #94a3b8;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin-top: 1rem;
  `;

  let selectedComponent: RadiationComponent = 'global';
  let graphType: GraphType = 'lines';
  let showGrid: boolean = true;

  function render() {
    const isEn = i18n.getLocale() === 'en';

    // Retrieve the 7 series for the selected component
    const getCompValues = (
      componentsObj: { global?: number[]; beam?: number[]; diffuse?: number[]; albedo?: number[] } | undefined,
      fallback: number[]
    ): number[] => {
      if (selectedComponent === 'global') return fallback;
      if (componentsObj && componentsObj[selectedComponent]) return componentsObj[selectedComponent]!;
      if (selectedComponent === 'beam') return res.horizontal.bdm0;
      if (selectedComponent === 'diffuse') return res.horizontal.ddm0;
      return new Array(12).fill(0.0);
    };

    const s1_horiz = selectedComponent === 'global' ? res.horizontal.gdm0
      : selectedComponent === 'beam' ? res.horizontal.bdm0
      : selectedComponent === 'diffuse' ? res.horizontal.ddm0
      : new Array(12).fill(0.0);

    const s2_optAnnual = getMonthlyRadiationForAngle(res, selectedComponent, res.optimalAnnual.optimalTiltDeg);
    const s3_optSeasonal = selectedComponent === 'global' ? res.seasonal.monthlyDailyKwh : getMonthlyRadiationForAngle(res, selectedComponent, Math.round((res.seasonal.winterTiltDeg + res.seasonal.summerTiltDeg) / 2));
    const s4_polar = getCompValues(res.tracking.polarAxis.components, res.tracking.polarAxis.monthlyDailyKwh);
    const s5_azimuthal = getCompValues(res.tracking.azimuthalAxis.components, res.tracking.azimuthalAxis.monthlyDailyKwh);
    const s6_horizontal = getCompValues(res.tracking.horizontalAxis.components, res.tracking.horizontalAxis.monthlyDailyKwh);
    const s7_dual = getCompValues(res.tracking.dualAxis.components, res.tracking.dualAxis.monthlyDailyKwh);

    // Helper statistics: min, mean, max
    const getStats = (arr: number[]) => ({
      min: Math.min(...arr),
      med: arr.reduce((a, b) => a + b, 0) / 12,
      max: Math.max(...arr)
    });

    const statHoriz = getStats(s1_horiz);
    const statOptEstac = getStats(s3_optSeasonal);
    const statAzim = getStats(s5_azimuthal);
    const statDual = getStats(s7_dual);
    const statOptAnual = getStats(s2_optAnnual);
    const statPolar = getStats(s4_polar);
    const statEjeHoriz = getStats(s6_horizontal);

    const compLabel = selectedComponent === 'global' ? (isEn ? 'Global radiation' : 'Radiación global')
      : selectedComponent === 'beam' ? (isEn ? 'Direct radiation' : 'Radiación directa')
      : selectedComponent === 'diffuse' ? (isEn ? 'Diffuse radiation' : 'Radiación difusa')
      : (isEn ? 'Albedo radiation' : 'Radiación de albedo');

    container.innerHTML = `
      <!-- Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.6rem; margin-bottom: 1rem;">
        <div>
          <div style="font-size: 0.82rem; color: #64748b; font-weight: bold;">
            ${isEn ? 'Study:' : 'Estudio:'} <span style="color: #0284c7; font-size: 0.95rem;">${isEn ? 'Comparative of all study types' : 'Comparativa de todos los tipos de estudios'}</span>
          </div>
          <div style="font-size: 0.85rem; color: #475569; margin-top: 0.2rem;">
            <span>${isEn ? 'City:' : 'Ciudad:'} <strong style="color: #0284c7;">${locationName}</strong></span>
            <span style="margin-left: 1.5rem;">${isEn ? 'Latitude (°):' : 'Latitud (°):'} <strong style="color: #0284c7;">${latitude.toFixed(2)}</strong></span>
          </div>
        </div>
        <div style="font-size: 1.3rem; font-weight: 900; letter-spacing: 0.5px; color: #0284c7;">
          ORIENT<span style="color: #f59e0b;">SOL</span> 3.0
        </div>
      </div>

      <!-- Main Body: Canvas Chart on Left, Controls & Stat Cards on Right -->
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start;">
        
        <!-- Left: Canvas Graph -->
        <div style="background: #ffffff; border: 1px solid #94a3b8; border-radius: 4px; padding: 1rem; position: relative;">
          <div style="text-align: center; font-weight: bold; font-size: 1rem; color: #1e293b; margin-bottom: 0.5rem;">
            ${compLabel} (kWh/m²/día)
          </div>
          <div style="position: relative; width: 100%; height: 380px;">
            <canvas id="comparative-canvas" width="620" height="380" style="width: 100%; height: 100%; display: block;"></canvas>
          </div>
          <div style="margin-top: 0.6rem; display: flex; justify-content: flex-end; align-items: center;">
            <label style="font-size: 0.84rem; color: #334155; display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
              <input type="checkbox" id="chk-grid" ${showGrid ? 'checked' : ''} />
              ${isEn ? 'Enable grid' : 'Activar rejilla'}
            </label>
          </div>
        </div>

        <!-- Right: Control Panel & MATLAB Blue Stat Cards -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Component & Graph Type Selector Box -->
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.8rem 1rem;">
            <label for="comp-select" style="display: block; font-size: 0.86rem; color: #0284c7; font-weight: 700; margin-bottom: 0.35rem;">
              ${isEn ? 'Select a component:' : 'Seleccione una componente:'}
            </label>
            <select id="comp-select" style="width: 100%; padding: 0.4rem; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; color: #1e293b; background: white;">
              <option value="global" ${selectedComponent === 'global' ? 'selected' : ''}>${isEn ? 'Global' : 'Global'}</option>
              <option value="beam" ${selectedComponent === 'beam' ? 'selected' : ''}>${isEn ? 'Direct' : 'Directa'}</option>
              <option value="diffuse" ${selectedComponent === 'diffuse' ? 'selected' : ''}>${isEn ? 'Diffuse' : 'Difusa'}</option>
              <option value="albedo" ${selectedComponent === 'albedo' ? 'selected' : ''}>${isEn ? 'Albedo' : 'Albedo'}</option>
            </select>

            <div style="margin-top: 0.8rem; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.84rem; color: #334155; font-weight: 600;">
                ${isEn ? 'Chart type' : 'Tipo de gráfico'}
              </span>
              <div style="display: flex; gap: 0.8rem;">
                <label style="font-size: 0.84rem; display: flex; align-items: center; gap: 0.25rem; cursor: pointer; color: #1e293b;">
                  <input type="radio" name="chart-type" value="lines" ${graphType === 'lines' ? 'checked' : ''} />
                  ${isEn ? 'Lines' : 'Líneas'}
                </label>
                <label style="font-size: 0.84rem; display: flex; align-items: center; gap: 0.25rem; cursor: pointer; color: #1e293b;">
                  <input type="radio" name="chart-type" value="bars" ${graphType === 'bars' ? 'checked' : ''} />
                  ${isEn ? 'Bars' : 'Barras'}
                </label>
              </div>
            </div>
          </div>

          <!-- 7 Blue Stat Cards Grid (Replicating Figura 5.2.109 exactly) -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem; font-size: 0.76rem;">
            ${renderStatCard(isEn ? 'Horiz. Plane' : 'Plano Horiz', statHoriz)}
            ${renderStatCard(isEn ? 'Opt. Annual' : 'Ópt. anual', statOptAnual)}
            ${renderStatCard(isEn ? 'Opt. Seasonal' : 'Ópt estacio.', statOptEstac)}
            ${renderStatCard(isEn ? 'Polar Axis' : 'Eje polar', statPolar)}
            ${renderStatCard(isEn ? 'Azimuthal' : 'Eje azimutal', statAzim)}
            ${renderStatCard(isEn ? 'Horiz. Axis' : 'Eje horizonta', statEjeHoriz)}
            ${renderStatCard(isEn ? 'Dual-Axis' : 'A dos ejes', statDual, 'grid-column: span 2;')}
          </div>

          <!-- Bottom Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.5rem;">
            <button type="button" id="btn-comp-graphs-back" style="padding: 0.45rem 1.4rem; background: #e2e8f0; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; cursor: pointer;">
              ${isEn ? 'Back' : 'Volver'}
            </button>
            <button type="button" id="btn-comp-graphs-exit" style="padding: 0.45rem 1.4rem; background: #e2e8f0; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; font-weight: 600; cursor: pointer;">
              ${isEn ? 'Exit' : 'Salir'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Hook listeners
    const selComp = container.querySelector('#comp-select') as HTMLSelectElement;
    selComp?.addEventListener('change', () => {
      selectedComponent = selComp.value as RadiationComponent;
      render();
    });

    const radios = container.querySelectorAll('input[name="chart-type"]') as NodeListOf<HTMLInputElement>;
    radios.forEach((r) => {
      r.addEventListener('change', () => {
        if (r.checked) {
          graphType = r.value as GraphType;
          render();
        }
      });
    });

    const chkGrid = container.querySelector('#chk-grid') as HTMLInputElement;
    chkGrid?.addEventListener('change', () => {
      showGrid = chkGrid.checked;
      drawCanvasChart();
    });

    container.querySelector('#btn-comp-graphs-back')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    container.querySelector('#btn-comp-graphs-exit')?.addEventListener('click', () => {
      if (onExit) onExit();
    });

    // Draw the active chart
    drawCanvasChart();
  }

  function renderStatCard(title: string, s: { min: number; med: number; max: number }, customStyle = ''): string {
    return `
      <div style="background: #2563eb; color: #ffffff; border-radius: 4px; overflow: hidden; border: 1px solid #1d4ed8; ${customStyle}">
        <div style="background: #1e40af; padding: 0.25rem 0.4rem; font-weight: 700; text-align: center; border-bottom: 1px solid #1d4ed8; letter-spacing: 0.2px;">
          ${title}
        </div>
        <div style="padding: 0.35rem 0.5rem; display: flex; justify-content: space-between; background: #3b82f6; font-family: monospace;">
          <span>mín</span><strong>${s.min.toFixed(2)}</strong>
        </div>
        <div style="padding: 0.35rem 0.5rem; display: flex; justify-content: space-between; background: #2563eb; font-family: monospace;">
          <span>med</span><strong>${s.med.toFixed(2)}</strong>
        </div>
        <div style="padding: 0.35rem 0.5rem; display: flex; justify-content: space-between; background: #1d4ed8; font-family: monospace;">
          <span>máx</span><strong>${s.max.toFixed(2)}</strong>
        </div>
      </div>
    `;
  }

  function drawCanvasChart() {
    const canvas = container.querySelector('#comparative-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Padding
    const pL = 50;
    const pR = 120; // Room for right legend
    const pT = 20;
    const pB = 40;
    const chartW = w - pL - pR;
    const chartH = h - pT - pB;

    const getCompValues = (
      componentsObj: { global?: number[]; beam?: number[]; diffuse?: number[]; albedo?: number[] } | undefined,
      fallback: number[]
    ): number[] => {
      if (selectedComponent === 'global') return fallback;
      if (componentsObj && componentsObj[selectedComponent]) return componentsObj[selectedComponent]!;
      if (selectedComponent === 'beam') return res.horizontal.bdm0;
      if (selectedComponent === 'diffuse') return res.horizontal.ddm0;
      return new Array(12).fill(0.0);
    };

    const s1_horiz = selectedComponent === 'global' ? res.horizontal.gdm0
      : selectedComponent === 'beam' ? res.horizontal.bdm0
      : selectedComponent === 'diffuse' ? res.horizontal.ddm0
      : new Array(12).fill(0.0);

    const s2_optAnnual = getMonthlyRadiationForAngle(res, selectedComponent, res.optimalAnnual.optimalTiltDeg);
    const s3_optSeasonal = selectedComponent === 'global' ? res.seasonal.monthlyDailyKwh : getMonthlyRadiationForAngle(res, selectedComponent, Math.round((res.seasonal.winterTiltDeg + res.seasonal.summerTiltDeg) / 2));
    const s4_polar = getCompValues(res.tracking.polarAxis.components, res.tracking.polarAxis.monthlyDailyKwh);
    const s5_azimuthal = getCompValues(res.tracking.azimuthalAxis.components, res.tracking.azimuthalAxis.monthlyDailyKwh);
    const s6_horizontal = getCompValues(res.tracking.horizontalAxis.components, res.tracking.horizontalAxis.monthlyDailyKwh);
    const s7_dual = getCompValues(res.tracking.dualAxis.components, res.tracking.dualAxis.monthlyDailyKwh);

    const seriesData = [
      { name: '0°', color: '#06b6d4', data: s1_horiz },             // Cyan
      { name: 'Ópt.anual', color: '#84cc16', data: s2_optAnnual },      // Lime
      { name: 'Ópt.estacional', color: '#16a34a', data: s3_optSeasonal },// Forest Green
      { name: 'Seg.polar', color: '#fb923c', data: s4_polar },          // Coral
      { name: 'Seg.azimutal', color: '#eab308', data: s5_azimuthal },   // Golden
      { name: 'Seg.horizontal', color: '#dc2626', data: s6_horizontal },// Red
      { name: 'Seg.2ejes', color: '#1e3a8a', data: s7_dual }            // Navy
    ];

    // Determine max Y value
    let maxVal = 10;
    seriesData.forEach((s) => {
      s.data.forEach((v) => {
        if (v > maxVal) maxVal = Math.ceil(v);
      });
    });

    const xCoord = (mIdx: number) => pL + (mIdx / 11) * chartW;
    const yCoord = (val: number) => pT + chartH - (val / maxVal) * chartH;

    // Background axes box
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(pL, pT, chartW, chartH);

    // Optional Grid
    if (showGrid) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([3, 3]);

      // Horizontal grid lines
      for (let yVal = 0; yVal <= maxVal; yVal += 1) {
        const y = yCoord(yVal);
        ctx.beginPath();
        ctx.moveTo(pL, y);
        ctx.lineTo(pL + chartW, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let m = 0; m < 12; m++) {
        const x = xCoord(m);
        ctx.beginPath();
        ctx.moveTo(x, pT);
        ctx.lineTo(x, pT + chartH);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Y Axis labels & ticks
    ctx.fillStyle = '#000000';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let yVal = 0; yVal <= maxVal; yVal += (maxVal > 12 ? 2 : 1)) {
      const y = yCoord(yVal);
      ctx.fillText(yVal.toString(), pL - 6, y);
    }

    // Y Axis Title
    ctx.save();
    ctx.translate(14, pT + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Radiación', 0, 0);
    ctx.restore();

    // X Axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let m = 0; m < 12; m++) {
      const x = graphType === 'lines' ? xCoord(m) : pL + (m + 0.5) * (chartW / 12);
      ctx.fillText((m + 1).toString(), x, pT + chartH + 6);
    }
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Meses', pL + chartW / 2, pT + chartH + 22);

    // Plotting lines or bars
    if (graphType === 'lines') {
      seriesData.forEach((s) => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let m = 0; m < 12; m++) {
          const x = xCoord(m);
          const y = yCoord(s.data[m]);
          if (m === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    } else {
      // Clustered bars (Figura 5.2.111)
      const monthSlotW = chartW / 12;
      const barW = Math.max(1.8, (monthSlotW - 4) / 7);

      for (let m = 0; m < 12; m++) {
        const slotStart = pL + m * monthSlotW + 2;
        seriesData.forEach((s, sIdx) => {
          const barX = slotStart + sIdx * barW;
          const val = s.data[m];
          const barY = yCoord(val);
          const barH = pT + chartH - barY;

          ctx.fillStyle = s.color;
          ctx.fillRect(barX, barY, barW, barH);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(barX, barY, barW, barH);
        });
      }
    }

    // Right Legend (Matching MATLAB Legend exactly)
    const legX = pL + chartW + 12;
    let legY = pT + 10;
    const legItemH = 22;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(legX - 4, legY - 6, 102, seriesData.length * legItemH + 8);

    seriesData.forEach((s) => {
      // Draw indicator
      if (graphType === 'lines') {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(legX, legY + 5);
        ctx.lineTo(legX + 18, legY + 5);
        ctx.stroke();
      } else {
        ctx.fillStyle = s.color;
        ctx.fillRect(legX, legY, 16, 10);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(legX, legY, 16, 10);
      }

      // Draw label
      ctx.fillStyle = '#000000';
      ctx.font = '10.5px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.name, legX + 24, legY + 6);

      legY += legItemH;
    });
  }

  render();
  return container;
}
