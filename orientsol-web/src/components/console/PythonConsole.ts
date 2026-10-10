import { pyodideService } from '@/services/pyodide';

export function renderPythonConsole(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'panel-card python-console-panel';

  const defaultSnippet = `# Verificación interactiva de geometría solar en Pyodide (NumPy)
import sys
sys.path.insert(0, '/orient')

import verify_solar_geometry as vsg

# 1. Cálculo para fecha y latitud seleccionadas (Madrid, 15 de Julio)
latitud = 40.4168
dia = 15
mes = 7

res = vsg.calculate_specific_date_geometry(latitude_deg=latitud, day=dia, month=mes)
vsg.print_verification_report(res)

# 2. Verificación del pipeline completo de 12 meses (matriz_declinacion, AngulosSalida, Altura_Solar, Azimut_Solar)
vsg.verify_matlab_12months_baseline(latitude_deg=latitud)
`;

  container.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon python-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M11.9 1a6.8 6.8 0 0 0-6.8 6.8v2.3h6.8V11H4.2A3.2 3.2 0 0 0 1 14.2a3.2 3.2 0 0 0 3.2 3.2h1.4v-1.8a3.6 3.6 0 0 1 3.6-3.6h5.7a1.8 1.8 0 0 0 1.8-1.8V5.6A4.6 4.6 0 0 0 12.1 1zm-2 2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm2.2 10v-.9H6.4a1.8 1.8 0 0 0-1.8 1.8v5.6a4.6 4.6 0 0 0 4.6 4.6 6.8 6.8 0 0 0 6.8-6.8v-2.3H9.2v-.9h7.7a3.2 3.2 0 0 0 3.2-3.2 3.2 3.2 0 0 0-3.2-3.2h-1.4v1.8a3.6 3.6 0 0 1-3.6 3.6h-5.7zm2 8a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"/>
        </svg>
      </div>
      <div class="panel-title-group">
        <h3 class="panel-title">2. Verificación de Geometría Solar y Consola Pyodide</h3>
        <p class="panel-desc">Módulos traducidos: <code>matriz_declinacion</code>, <code>AngulosSalida</code>, <code>Angulos</code>, <code>Altura_Solar</code>, <code>Azimut_Solar</code>, <code>Calulo_Beta_2Ejes</code></p>
      </div>
      <div class="panel-actions">
        <button id="run-py-btn" class="btn btn-primary" type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Ejecutar Verificación en Pyodide
        </button>
      </div>
    </div>

    <!-- Quick test controls -->
    <div class="verification-controls-bar">
      <div class="quick-control-group">
        <label for="test-lat-input" class="quick-label">Latitud (°)</label>
        <input type="number" id="test-lat-input" class="quick-input" value="40.4168" step="0.0001" min="-90" max="90" title="Latitud decimal (Norte positivo, Sur negativo)">
      </div>
      <div class="quick-control-group">
        <label for="test-day-input" class="quick-label">Día (1-31)</label>
        <input type="number" id="test-day-input" class="quick-input" value="15" min="1" max="31">
      </div>
      <div class="quick-control-group">
        <label for="test-month-select" class="quick-label">Mes</label>
        <select id="test-month-select" class="quick-input quick-select">
          <option value="1">01 - Enero</option>
          <option value="2">02 - Febrero</option>
          <option value="3">03 - Marzo</option>
          <option value="4">04 - Abril</option>
          <option value="5">05 - Mayo</option>
          <option value="6">06 - Junio</option>
          <option value="7" selected>07 - Julio</option>
          <option value="8">08 - Agosto</option>
          <option value="9">09 - Septiembre</option>
          <option value="10">10 - Octubre</option>
          <option value="11">11 - Noviembre</option>
          <option value="12">12 - Diciembre</option>
        </select>
      </div>
      <div class="quick-control-buttons">
        <button id="quick-verify-btn" class="btn btn-secondary" type="button">
          Geometría Solar
        </button>
        <button id="quick-baseline-btn" class="btn btn-secondary" type="button">
          Baseline 12 Meses
        </button>
        <button id="quick-radiation-btn" class="btn btn-secondary" type="button">
          Radiación & Transposición
        </button>
        <button id="quick-tracking-btn" class="btn btn-secondary" type="button">
          Seguimiento & Estacional
        </button>
        <button id="quick-energy-btn" class="btn btn-primary" type="button">
          Energía FV & Osterwald
        </button>
      </div>
    </div>

    <div class="console-layout">
      <div class="code-editor-container">
        <div class="code-editor-header">
          <span class="editor-title">Editor Python (In-Browser Execution)</span>
          <span class="editor-lang">Python 3.14 + NumPy (WASM)</span>
        </div>
        <textarea id="py-code-input" class="code-editor-area" spellcheck="false">${defaultSnippet}</textarea>
      </div>

      <div class="code-output-container">
        <div class="code-output-header">
          <span class="output-title">Salida / Terminal (stdout & stderr)</span>
          <span id="output-timing" class="output-timing">0 ms</span>
        </div>
        <pre id="py-output-log" class="code-output-log">Haga clic en 'Ejecutar Verificación en Pyodide' o 'Verificar Fecha Seleccionada' para probar los módulos matemáticos traducidos...</pre>
      </div>
    </div>
  `;

  const runBtn = container.querySelector('#run-py-btn') as HTMLButtonElement;
  const quickVerifyBtn = container.querySelector('#quick-verify-btn') as HTMLButtonElement;
  const quickBaselineBtn = container.querySelector('#quick-baseline-btn') as HTMLButtonElement;
  const latInput = container.querySelector('#test-lat-input') as HTMLInputElement;
  const dayInput = container.querySelector('#test-day-input') as HTMLInputElement;
  const monthSelect = container.querySelector('#test-month-select') as HTMLSelectElement;

  const codeInput = container.querySelector('#py-code-input') as HTMLTextAreaElement;
  const outputLog = container.querySelector('#py-output-log') as HTMLPreElement;
  const timingBadge = container.querySelector('#output-timing') as HTMLSpanElement;

  async function executeCode(codeToRun?: string) {
    runBtn.disabled = true;
    quickVerifyBtn.disabled = true;
    quickBaselineBtn.disabled = true;
    
    runBtn.innerHTML = `<span class="spinner-sm"></span> Ejecutando...`;
    outputLog.textContent = 'Inicializando Pyodide y ejecutando verificación en Python...\n';
    timingBadge.textContent = 'Calculando...';

    try {
      const code = codeToRun || codeInput.value;
      const res = await pyodideService.runPython(code);

      timingBadge.textContent = `${res.executionTimeMs} ms`;

      if (res.success) {
        outputLog.textContent = res.stdout || '(Ejecución exitosa sin salida en stdout)';
        if (res.stderr) {
          outputLog.textContent += `\n[stderr]:\n${res.stderr}`;
        }
      } else {
        outputLog.textContent = `❌ Error en ejecución Python:\n${res.error}\n\n${res.stderr}`;
      }
    } catch (err: unknown) {
      outputLog.textContent = `❌ Error al invocar Pyodide: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      runBtn.disabled = false;
      quickVerifyBtn.disabled = false;
      quickBaselineBtn.disabled = false;
      runBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Ejecutar Verificación en Pyodide
      `;
    }
  }

  // Quick verify single date
  quickVerifyBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value) || 40.4168;
    const day = parseInt(dayInput.value, 10) || 15;
    const month = parseInt(monthSelect.value, 10) || 7;

    const script = `
import sys
sys.path.insert(0, '/orient')
import verify_solar_geometry as vsg

res = vsg.calculate_specific_date_geometry(latitude_deg=${lat}, day=${day}, month=${month})
vsg.print_verification_report(res)
`;
    codeInput.value = script.trim();
    executeCode(script);
  });

  // Quick verify 12-month baseline
  quickBaselineBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value) || 40.4168;
    const script = `
import sys
sys.path.insert(0, '/orient')
import verify_solar_geometry as vsg

vsg.verify_matlab_12months_baseline(latitude_deg=${lat})
`;
    codeInput.value = script.trim();
    executeCode(script);
  });

  // Quick verify radiation decomposition & transposition
  const quickRadiationBtn = container.querySelector('#quick-radiation-btn') as HTMLButtonElement;
  quickRadiationBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value) || 40.4168;
    const script = `
import sys
sys.path.insert(0, '/orient')

import test_radiation_transposition as trt
trt.run_full_radiation_test(latitude_deg=${lat}, city_name="Localidad (Lat: ${lat}°)")
`;
    codeInput.value = script.trim();
    executeCode(script);
  });

  // Quick verify tracking systems and seasonal optimization
  const quickTrackingBtn = container.querySelector('#quick-tracking-btn') as HTMLButtonElement;
  quickTrackingBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value) || 40.4168;
    const script = `
import sys
sys.path.insert(0, '/orient')

import test_tracking_seasonal as tts
tts.run_full_tracking_seasonal_test(latitude_deg=${lat}, city_name="Localidad (Lat: ${lat}°)")
`;
    codeInput.value = script.trim();
    executeCode(script);
  });

  // Quick verify PV energy and Osterwald thermal models
  const quickEnergyBtn = container.querySelector('#quick-energy-btn') as HTMLButtonElement;
  quickEnergyBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value) || 40.4168;
    const script = `
import sys
sys.path.insert(0, '/orient')

import test_energy_models as tem
tem.run_full_energy_test(latitude_deg=${lat}, city_name="Localidad (Lat: ${lat}°)", peak_power_kw=5.0, performance_ratio=0.80)
`;
    codeInput.value = script.trim();
    executeCode(script);
  });

  runBtn.addEventListener('click', () => executeCode());

  return container;
}
