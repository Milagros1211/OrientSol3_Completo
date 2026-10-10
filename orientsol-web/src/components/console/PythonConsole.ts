import { pyodideService } from '@/services/pyodide';
import { i18n } from '@/i18n';

export function renderPythonConsole(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'panel-card python-console-panel';

  const isEn = i18n.getLocale() === 'en';

  container.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon python-icon" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="panel-title-group">
        <h3 class="panel-title">${isEn ? 'Scientific Verification & Engine Validation' : 'Verificación de Algoritmos y Motores de Cálculo'}</h3>
        <p class="panel-desc">
          ${isEn 
            ? 'Interactive verification suite for OrientSol 3.0 algorithms: solar geometry, radiation transposition, tracking systems, and Osterwald cell thermal models.'
            : 'Módulos verificados: <code>matriz_declinacion</code>, <code>AngulosSalida</code>, <code>Angulos</code>, <code>Altura_Solar</code>, <code>Azimut_Solar</code>, <code>Calculo_Beta_2Ejes</code>, <code>Osterwald</code>.'}
        </p>
      </div>
      <div class="panel-actions">
        <button id="run-py-btn" class="btn btn-primary" type="button" style="background: #059669; border-color: #10b981;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          ${isEn ? 'Run Verification' : 'Ejecutar Verificación'}
        </button>
      </div>
    </div>

    <!-- Quick test interactive controls -->
    <div class="verification-controls-bar">
      <div class="quick-control-group">
        <label for="test-lat-input" class="quick-label">${isEn ? 'Latitude (°)' : 'Latitud (°)'}</label>
        <input type="number" id="test-lat-input" class="quick-input" value="40.4168" step="0.0001" min="-90" max="90" title="Latitud decimal (Norte positivo, Sur negativo)">
      </div>
      <div class="quick-control-group">
        <label for="test-day-input" class="quick-label">${isEn ? 'Day (1-31)' : 'Día (1-31)'}</label>
        <input type="number" id="test-day-input" class="quick-input" value="15" min="1" max="31">
      </div>
      <div class="quick-control-group">
        <label for="test-month-select" class="quick-label">${isEn ? 'Month' : 'Mes'}</label>
        <select id="test-month-select" class="quick-input quick-select">
          <option value="1">${isEn ? '01 - January' : '01 - Enero'}</option>
          <option value="2">${isEn ? '02 - February' : '02 - Febrero'}</option>
          <option value="3">${isEn ? '03 - March' : '03 - Marzo'}</option>
          <option value="4">${isEn ? '04 - April' : '04 - Abril'}</option>
          <option value="5">${isEn ? '05 - May' : '05 - Mayo'}</option>
          <option value="6">${isEn ? '06 - June' : '06 - Junio'}</option>
          <option value="7" selected>${isEn ? '07 - July' : '07 - Julio'}</option>
          <option value="8">${isEn ? '08 - August' : '08 - Agosto'}</option>
          <option value="9">${isEn ? '09 - September' : '09 - Septiembre'}</option>
          <option value="10">${isEn ? '10 - October' : '10 - Octubre'}</option>
          <option value="11">${isEn ? '11 - November' : '11 - Noviembre'}</option>
          <option value="12">${isEn ? '12 - December' : '12 - Diciembre'}</option>
        </select>
      </div>
      <div class="quick-control-buttons">
        <button id="quick-verify-btn" class="btn btn-secondary" type="button">
          ${isEn ? 'Solar Geometry' : 'Geometría Solar'}
        </button>
        <button id="quick-baseline-btn" class="btn btn-secondary" type="button">
          ${isEn ? '12-Month Baseline' : 'Baseline 12 Meses'}
        </button>
        <button id="quick-radiation-btn" class="btn btn-secondary" type="button">
          ${isEn ? 'Radiation & Transposition' : 'Radiación & Transposición'}
        </button>
        <button id="quick-tracking-btn" class="btn btn-secondary" type="button">
          ${isEn ? 'Tracking & Seasonal' : 'Seguimiento & Estacional'}
        </button>
        <button id="quick-energy-btn" class="btn btn-primary" type="button" style="background: #0d9488; border-color: #14b8a6;">
          ${isEn ? 'PV Energy & Osterwald' : 'Energía FV & Osterwald'}
        </button>
      </div>
    </div>

    <!-- Interactive Terminal Output View (Full Width) -->
    <div class="console-layout single-terminal">
      <div class="code-output-container full-width-terminal">
        <div class="code-output-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="output-title">${isEn ? 'Interactive Verification Terminal (stdout & stderr)' : 'Terminal Interactiva de Verificación (stdout & stderr)'}</span>
            <span id="output-timing" class="output-timing">0 ms</span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="btn-clear-terminal" class="btn btn-sm btn-ghost" type="button" style="font-size: 0.75rem; padding: 0.2rem 0.5rem; color: #94a3b8;">
              ${isEn ? 'Clear' : 'Limpiar'}
            </button>
          </div>
        </div>
        <pre id="py-output-log" class="code-output-log" style="min-height: 420px; max-height: 600px; font-size: 0.85rem; line-height: 1.55;">${
          isEn
            ? "Click any verification button above or 'Run Verification' to execute the scientific engine tests interactively..."
            : "Haga clic en cualquiera de los botones superiores o 'Ejecutar Verificación' para validar los módulos matemáticos en tiempo real..."
        }</pre>
      </div>
    </div>
  `;

  const runBtn = container.querySelector('#run-py-btn') as HTMLButtonElement;
  const quickVerifyBtn = container.querySelector('#quick-verify-btn') as HTMLButtonElement;
  const quickBaselineBtn = container.querySelector('#quick-baseline-btn') as HTMLButtonElement;
  const quickRadiationBtn = container.querySelector('#quick-radiation-btn') as HTMLButtonElement;
  const quickTrackingBtn = container.querySelector('#quick-tracking-btn') as HTMLButtonElement;
  const quickEnergyBtn = container.querySelector('#quick-energy-btn') as HTMLButtonElement;
  const btnClear = container.querySelector('#btn-clear-terminal') as HTMLButtonElement;

  const latInput = container.querySelector('#test-lat-input') as HTMLInputElement;
  const dayInput = container.querySelector('#test-day-input') as HTMLInputElement;
  const monthSelect = container.querySelector('#test-month-select') as HTMLSelectElement;

  const outputLog = container.querySelector('#py-output-log') as HTMLPreElement;
  const timingBadge = container.querySelector('#output-timing') as HTMLSpanElement;

  // Track the current active test generator
  let activeScriptGenerator = () => {
    const lat = parseFloat(latInput.value) || 40.4168;
    const day = parseInt(dayInput.value, 10) || 15;
    const month = parseInt(monthSelect.value, 10) || 7;
    return `
import sys
sys.path.insert(0, '/orient')
import verify_solar_geometry as vsg

res = vsg.calculate_specific_date_geometry(latitude_deg=${lat}, day=${day}, month=${month})
vsg.print_verification_report(res)
`;
  };

  async function executeCode(codeToRun: string) {
    runBtn.disabled = true;
    quickVerifyBtn.disabled = true;
    quickBaselineBtn.disabled = true;
    quickRadiationBtn.disabled = true;
    quickTrackingBtn.disabled = true;
    quickEnergyBtn.disabled = true;

    runBtn.innerHTML = `<span class="spinner-sm"></span> ${isEn ? 'Verifying...' : 'Verificando...'}`;
    outputLog.textContent = isEn
      ? 'Initializing Pyodide and running verification suite in Python WASM...\n'
      : 'Inicializando Pyodide y ejecutando verificación de algoritmos en Python WASM...\n';
    timingBadge.textContent = isEn ? 'Computing...' : 'Calculando...';

    try {
      const res = await pyodideService.runPython(codeToRun);
      timingBadge.textContent = `${res.executionTimeMs} ms`;

      if (res.success) {
        outputLog.textContent = res.stdout || (isEn ? '(Successful execution without stdout)' : '(Ejecución exitosa sin salida en stdout)');
        if (res.stderr) {
          outputLog.textContent += `\n[stderr]:\n${res.stderr}`;
        }
      } else {
        outputLog.textContent = `❌ ${isEn ? 'Execution Error' : 'Error en ejecución'}:\n${res.error}\n\n${res.stderr}`;
      }
    } catch (err: unknown) {
      outputLog.textContent = `❌ ${isEn ? 'Engine Error' : 'Error al invocar motor'}: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      runBtn.disabled = false;
      quickVerifyBtn.disabled = false;
      quickBaselineBtn.disabled = false;
      quickRadiationBtn.disabled = false;
      quickTrackingBtn.disabled = false;
      quickEnergyBtn.disabled = false;
      runBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        ${isEn ? 'Run Verification' : 'Ejecutar Verificación'}
      `;
    }
  }

  // 1. Quick verify single date
  quickVerifyBtn.addEventListener('click', () => {
    activeScriptGenerator = () => {
      const lat = parseFloat(latInput.value) || 40.4168;
      const day = parseInt(dayInput.value, 10) || 15;
      const month = parseInt(monthSelect.value, 10) || 7;
      return `
import sys
sys.path.insert(0, '/orient')
import verify_solar_geometry as vsg

res = vsg.calculate_specific_date_geometry(latitude_deg=${lat}, day=${day}, month=${month})
vsg.print_verification_report(res)
`;
    };
    executeCode(activeScriptGenerator());
  });

  // 2. Quick verify 12-month baseline
  quickBaselineBtn.addEventListener('click', () => {
    activeScriptGenerator = () => {
      const lat = parseFloat(latInput.value) || 40.4168;
      return `
import sys
sys.path.insert(0, '/orient')
import verify_solar_geometry as vsg

vsg.verify_matlab_12months_baseline(latitude_deg=${lat})
`;
    };
    executeCode(activeScriptGenerator());
  });

  // 3. Quick verify radiation decomposition & transposition
  quickRadiationBtn.addEventListener('click', () => {
    activeScriptGenerator = () => {
      const lat = parseFloat(latInput.value) || 40.4168;
      return `
import sys
sys.path.insert(0, '/orient')

import test_radiation_transposition as trt
trt.run_full_radiation_test(latitude_deg=${lat}, city_name="Localidad (Lat: ${lat}°)")
`;
    };
    executeCode(activeScriptGenerator());
  });

  // 4. Quick verify tracking systems and seasonal optimization
  quickTrackingBtn.addEventListener('click', () => {
    activeScriptGenerator = () => {
      const lat = parseFloat(latInput.value) || 40.4168;
      return `
import sys
sys.path.insert(0, '/orient')

import test_tracking_seasonal as tts
tts.run_full_tracking_seasonal_test(latitude_deg=${lat}, city_name="Localidad (Lat: ${lat}°)")
`;
    };
    executeCode(activeScriptGenerator());
  });

  // 5. Quick verify PV energy and Osterwald thermal models
  quickEnergyBtn.addEventListener('click', () => {
    activeScriptGenerator = () => {
      const lat = parseFloat(latInput.value) || 40.4168;
      return `
import sys
sys.path.insert(0, '/orient')

import test_energy_models as tem
tem.run_full_energy_test(latitude_deg=${lat}, city_name="Localidad (Lat: ${lat}°)", peak_power_kw=5.0, performance_ratio=0.80)
`;
    };
    executeCode(activeScriptGenerator());
  });

  // Main Run Button
  runBtn.addEventListener('click', () => {
    executeCode(activeScriptGenerator());
  });

  // Clear Terminal
  btnClear.addEventListener('click', () => {
    outputLog.textContent = isEn
      ? 'Terminal cleared. Click any verification button to execute tests.'
      : 'Terminal limpiada. Haga clic en cualquier botón de verificación para ejecutar pruebas.';
    timingBadge.textContent = '0 ms';
  });

  return container;
}
