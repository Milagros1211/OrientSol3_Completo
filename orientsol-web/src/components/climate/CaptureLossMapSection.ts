import type { SolarBridgeSimulationResult, MonthlyCaptureLossMap } from '../../services/bridge/solarCalculationBridge';

const MONTH_NAMES_ES: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_NAMES_EN: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface CaptureLossMapSectionProps {
  mode: 'annual' | 'monthly';
  simulationResult: SolarBridgeSimulationResult;
  isEn?: boolean;
  initialMonth?: number;
  onMonthChange?: (monthIndex: number, optimalBeta: number) => void;
}

export function renderCaptureLossMapSection(props: CaptureLossMapSectionProps): HTMLElement {
  const { mode, simulationResult: res, isEn = false, onMonthChange } = props;
  const container = document.createElement('div');
  container.className = 'capture-loss-map-section result-card wide-card';
  container.style.marginTop = '1.25rem';
  container.style.marginBottom = '1.25rem';

  let selectedMonthIdx = props.initialMonth ?? 0;

  const getCteClass = (loss: number) => {
    if (loss <= 10.0) return 'loss-cell-green';
    if (loss <= 20.0) return 'loss-cell-yellow';
    if (loss <= 40.0) return 'loss-cell-orange';
    return 'loss-cell-red';
  };

  function renderContent() {
    const lossMap = res.captureLossMap;
    if (!lossMap || !lossMap.betasDeg || !lossMap.alphasDeg) {
      container.innerHTML = `<div class="alert alert-warning">${isEn ? 'Capture loss map data is not available.' : 'Datos del mapa de pérdidas de captación no disponibles.'}</div>`;
      return;
    }

    let currentBetas = lossMap.betasDeg;
    let currentAlphas = lossMap.alphasDeg;
    let currentLossMatrix = lossMap.lossPercentageMatrix;
    let currentRadMatrix = lossMap.radiationMatrixKwhM2Day;
    let currentOptPoint = lossMap.optimalPoint;
    let currentCteZones = lossMap.cteZones;

    if (mode === 'monthly' && lossMap.monthlyMaps && lossMap.monthlyMaps.length === 12) {
      const mMap: MonthlyCaptureLossMap = lossMap.monthlyMaps[selectedMonthIdx];
      currentLossMatrix = mMap.lossPercentageMatrix;
      currentRadMatrix = mMap.radiationMatrixKwhM2Day;
      currentOptPoint = {
        betaDeg: mMap.optimalPoint.betaDeg,
        alphaDeg: mMap.optimalPoint.alphaDeg,
        maxDailyRadiationKwh: mMap.optimalPoint.maxDailyRadiationKwh,
        maxAnnualRadiationKwhM2: mMap.optimalPoint.maxDailyRadiationKwh * 365,
      };
      currentCteZones = mMap.cteZones;
    }

    const monthNames: string[] = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ES;
    const titleText = mode === 'annual'
      ? (isEn ? 'Capture Loss Map (CTE DB-HE4) — Annual Global Radiation' : 'Mapa de Pérdidas de Captación (CTE DB-HE4) — Inclinación Óptima Anual')
      : (isEn ? 'Capture Loss Map (CTE DB-HE4) — Monthly Optimization' : 'Mapa de Pérdidas de Captación (CTE DB-HE4) — Optimizaciones Mensuales');

    const optBadgeText = mode === 'annual'
      ? (isEn
          ? `Optimal: β = ${currentOptPoint.betaDeg}°, α = ${currentOptPoint.alphaDeg}° | ${currentOptPoint.maxDailyRadiationKwh.toFixed(2)} kWh/m²/day`
          : `Óptimo Anual: β = ${currentOptPoint.betaDeg}°, α = ${currentOptPoint.alphaDeg}° | ${currentOptPoint.maxDailyRadiationKwh.toFixed(2)} kWh/m²/día`)
      : (isEn
          ? `Month Optimum (${monthNames[selectedMonthIdx]}): β = ${currentOptPoint.betaDeg}°, α = ${currentOptPoint.alphaDeg}° | ${currentOptPoint.maxDailyRadiationKwh.toFixed(2)} kWh/m²/day`
          : `Óptimo del mes (${monthNames[selectedMonthIdx]}): β = ${currentOptPoint.betaDeg}°, α = ${currentOptPoint.alphaDeg}° | ${currentOptPoint.maxDailyRadiationKwh.toFixed(2)} kWh/m²/día`);

    const monthSelectorHtml = mode === 'monthly'
      ? `
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-top: 0.5rem; flex-wrap: wrap;">
          <label for="loss-map-month-select" style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">
            ${isEn ? 'Select Month for Capture Map:' : 'Seleccionar mes para el mapa de captación:'}
          </label>
          <select id="loss-map-month-select" class="form-select form-select-sm loss-map-month-dropdown" style="width: auto; min-width: 170px; font-weight: 600;">
            ${monthNames.map((name: string, i: number) => `
              <option value="${i}" ${i === selectedMonthIdx ? 'selected' : ''}>
                ${i + 1}. ${name} (β = ${lossMap.monthlyMaps ? lossMap.monthlyMaps[i].optimalPoint.betaDeg : 0}°)
              </option>
            `).join('')}
          </select>
          <span style="font-size: 0.76rem; color: var(--text-dim);">
            ${isEn ? 'Displays CTE losses and highlights optimum for the selected month' : 'Muestra pérdidas CTE y ángulo óptimo del mes seleccionado'}
          </span>
        </div>
      `
      : '';

    container.innerHTML = `
      <div class="result-card-header" style="flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <div>
          <h4 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan, #0284c7);">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            ${titleText}
          </h4>
          <p style="font-size: 0.78rem; color: var(--text-dim); margin: 0.25rem 0 0 0;">
            ${isEn
              ? 'Evaluated component: Global solar radiation (Gdm) on tilted and oriented surface, based on Liu-Jordan & Klein.'
              : 'Componente evaluada: Radiación solar Global (Gdm) sobre superficie inclinada y orientada, según Liu-Jordan & Klein.'}
          </p>
        </div>
        <span class="badge badge-success" style="font-size: 0.82rem; padding: 0.4rem 0.75rem;">${optBadgeText}</span>
      </div>

      ${monthSelectorHtml}

      <div class="cte-legend-bar" style="margin-top: 0.75rem;">
        <div class="cte-legend-item">
          <span class="cte-color-box box-green"></span>
          <span>${isEn ? 'General CTE (loss ≤ 10%):' : 'Límite General CTE (Pérdida ≤ 10%):'} <strong>${currentCteZones.generalPctCompliant}%</strong></span>
        </div>
        <div class="cte-legend-item">
          <span class="cte-color-box box-yellow"></span>
          <span>${isEn ? 'Superposition (loss ≤ 20%):' : 'Superposición CTE (Pérdida ≤ 20%):'} <strong>${currentCteZones.superpositionPctCompliant}%</strong></span>
        </div>
        <div class="cte-legend-item">
          <span class="cte-color-box box-orange"></span>
          <span>${isEn ? 'Arch. Integration (loss ≤ 40%):' : 'Integración Arquitectónica (Pérdida ≤ 40%):'} <strong>${currentCteZones.integrationPctCompliant}%</strong></span>
        </div>
        <div class="cte-legend-item">
          <span class="cte-color-box box-red"></span>
          <span>${isEn ? 'Non-compliant (> 40%)' : 'No conforme (> 40%)'}</span>
        </div>
      </div>

      <div class="loss-map-container" style="margin-top: 0.75rem; max-height: 480px; overflow: auto; border: 1px solid var(--border-subtle); border-radius: 6px;">
        <table class="loss-map-matrix-table" style="font-size: 0.76rem;">
          <thead>
            <tr>
              <th class="corner-th">β \\ α</th>
              ${currentAlphas.map((a) => `<th>${a > 0 ? '+' : ''}${a}°</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${currentBetas
              .map((b, i_b) => {
                const cells = currentAlphas
                  .map((a, i_a) => {
                    const loss = currentLossMatrix[i_b][i_a];
                    const rad = currentRadMatrix[i_b][i_a];
                    const cls = getCteClass(loss);
                    const isOptimalCell = Math.abs(b - currentOptPoint.betaDeg) < 0.01 && Math.abs(a - currentOptPoint.alphaDeg) < 0.01;
                    const optStyle = isOptimalCell
                      ? 'border: 2px solid var(--accent-cyan, #0284c7) !important; box-shadow: inset 0 0 8px rgba(2, 132, 199, 0.4); font-weight: 800; transform: scale(1.08);'
                      : '';
                    const starText = isOptimalCell ? ' ★' : '';
                    return `<td class="${cls}" style="${optStyle}" title="β=${b}°, α=${a}°: Pérdida ${loss.toFixed(1)}% (${rad.toFixed(2)} kWh/m²/d)">${loss.toFixed(0)}%${starText}</td>`;
                  })
                  .join('');
                return `<tr><td class="row-header-beta">${b}°</td>${cells}</tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    // Attach Month Selector listener if present
    if (mode === 'monthly') {
      const monthSelect = container.querySelector<HTMLSelectElement>('#loss-map-month-select');
      monthSelect?.addEventListener('change', () => {
        selectedMonthIdx = parseInt(monthSelect.value, 10) || 0;
        const newOptBeta = lossMap.monthlyMaps ? lossMap.monthlyMaps[selectedMonthIdx].optimalPoint.betaDeg : 0;
        if (onMonthChange) {
          onMonthChange(selectedMonthIdx, newOptBeta);
        }
        renderContent();
      });
    }
  }

  renderContent();
  return container;
}
