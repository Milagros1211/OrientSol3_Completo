import { hybridClimateManager } from '@/services/hybrid';
import {
  executeSolarSimulationFromClimateData,
  type SolarBridgeSimulationResult,
} from '@/services/bridge/solarCalculationBridge';
import { generateSampleCSV, generateSampleJSON } from '@/services/hybrid/climateFileParser';
import type { ClimateDataRecord } from '@/types/climate';
import { i18n } from '@/i18n';
import {
  renderRadiationChart,
  renderEnergyAndTemperatureChart,
  renderSurfacesRankingChart,
} from '@/components/charts/SolarCharts';
import {
  exportToCSV,
  exportToPDF,
  copyReportToClipboard,
} from '@/components/export/reportExporter';
import { pyodideService } from '@/services/pyodide';

export function renderDualClimateLoaderPanel(): HTMLElement {
  const container = document.createElement('section');
  container.className = 'panel-card dual-climate-panel';
  const t = i18n.t;
  const isEn = i18n.getLocale() === 'en';
  const MONTH_NAMES = t.common.monthNamesShort;

  container.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon hybrid-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
          <path d="M12 12v9"></path>
          <path d="m8 17 4 4 4-4"></path>
        </svg>
      </div>
      <div>
        <h3 class="panel-title">${t.hybridLoader.title}</h3>
        <p class="panel-desc">${t.hybridLoader.subtitle}</p>
      </div>
    </div>

    <!-- Mode Navigation Tabs -->
    <div class="dual-tabs-bar">
      <button class="dual-tab-btn active" data-tab="historical">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>${t.hybridLoader.tabHistorical}</span>
      </button>

      <button class="dual-tab-btn" data-tab="manual">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>${t.hybridLoader.tabManual}</span>
      </button>

      <button class="dual-tab-btn" data-tab="upload">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>${t.hybridLoader.tabUpload}</span>
      </button>
    </div>

    <!-- TAB 1: HISTORICAL DATABASE -->
    <div id="tab-content-historical" class="dual-tab-content">
      <div class="historical-search-row">
        <div class="form-group flex-1">
          <label for="hist-select-station" class="form-label">${t.hybridLoader.historicalLabel}</label>
          <select id="hist-select-station" class="form-select">
            ${hybridClimateManager
              .getHistoricalLocations()
              .map(
                (loc) =>
                  `<option value="${loc.id}">
                    ${loc.locationName} (${loc.country}) — Lat: ${loc.latitude.toFixed(2)}°, Alt: ${loc.elevationM ?? 'N/D'} m
                  </option>`
              )
              .join('')}
          </select>
        </div>
        <button id="btn-use-historical" class="btn btn-primary" style="align-self: flex-end;">
          <span>${t.hybridLoader.selectStation}</span>
        </button>
      </div>
    </div>

    <!-- TAB 2: MANUAL FORM -->
    <div id="tab-content-manual" class="dual-tab-content hidden">
      <div class="manual-preset-row">
        <span class="manual-preset-label">${t.hybridLoader.manualPresetLabel}</span>
        <select id="manual-template-select" class="form-select select-compact">
          <option value="">${t.hybridLoader.manualPresetPlaceholder}</option>
          ${hybridClimateManager
            .getHistoricalLocations()
            .map((loc) => `<option value="${loc.id}">${loc.locationName} (${loc.country})</option>`)
            .join('')}
        </select>
        <button id="btn-apply-manual-template" class="btn btn-secondary btn-sm">${t.hybridLoader.loadTemplate}</button>
      </div>

      <div class="form-grid manual-meta-grid">
        <div class="form-group">
          <label class="form-label">${t.hybridLoader.locName}</label>
          <input type="text" id="manual-name" class="form-input" value="${isEn ? 'Custom Solar Facility' : 'Instalación Solar Personalizada'}" />
        </div>
        <div class="form-group">
          <label class="form-label">${t.location.latitude} [°]</label>
          <input type="number" id="manual-lat" class="form-input" step="0.001" value="37.389" />
        </div>
        <div class="form-group">
          <label class="form-label">${t.location.longitude} [°]</label>
          <input type="number" id="manual-lon" class="form-input" step="0.001" value="-5.984" />
        </div>
        <div class="form-group">
          <label class="form-label">${t.location.elevation} [m]</label>
          <input type="number" id="manual-elev" class="form-input" value="35" />
        </div>
        <div class="form-group">
          <label class="form-label">${t.location.albedoLabel} (&rho;<sub>g</sub>)</label>
          <input type="number" id="manual-albedo" class="form-input" step="0.01" min="0" max="1" value="0.20" />
        </div>
      </div>

      <div class="manual-table-container">
        <label class="form-label">Valores Mensuales: G<sub>dm</sub>(0) [kWh/m²/día] &amp; T<sub>amb</sub> [°C]</label>
        <div class="monthly-inputs-table-wrapper">
          <table class="manual-monthly-table">
            <thead>
              <tr>
                <th>Variable</th>
                ${MONTH_NAMES.map((m) => `<th>${m}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="row-label">G<sub>dm</sub>(0)</td>
                ${MONTH_NAMES.map(
                  (_, i) => `<td><input type="number" step="0.01" class="manual-g-input" data-month="${i}" value="${(2.5 + i * 0.4).toFixed(2)}" /></td>`
                ).join('')}
              </tr>
              <tr>
                <td class="row-label">T<sub>amb</sub> [°C]</td>
                ${MONTH_NAMES.map(
                  (_, i) => `<td><input type="number" step="0.1" class="manual-t-input" data-month="${i}" value="${(10 + i * 1.5).toFixed(1)}" /></td>`
                ).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="manual-actions-row">
        <button id="btn-validate-manual" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${t.hybridLoader.applyManualBtn}</span>
        </button>
      </div>
    </div>

    <!-- TAB 3: DIGITAL FILE UPLOAD -->
    <div id="tab-content-upload" class="dual-tab-content hidden">
      <div id="file-dropzone" class="file-dropzone">
        <div class="dropzone-icon">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <polyline points="9 15 12 12 15 15"></polyline>
          </svg>
        </div>
        <h4>${t.hybridLoader.dropzoneTitle}</h4>
        <p class="dropzone-hint">${t.hybridLoader.dropzoneHint}</p>
        <div class="dropzone-btn-group">
          <label class="btn btn-primary dropzone-file-btn">
            <span>${t.hybridLoader.selectFileBtn}</span>
            <input type="file" id="climate-file-input" accept=".csv,.json,.txt" style="display: none;" />
          </label>
          <button id="btn-download-csv-template" class="btn btn-secondary">${t.hybridLoader.sampleCsvBtn}</button>
          <button id="btn-download-json-template" class="btn btn-secondary">${t.hybridLoader.sampleJsonBtn}</button>
        </div>
      </div>
    </div>

    <!-- Active Dataset Preview Card -->
    <div id="active-dataset-card" class="active-dataset-card">
      <!-- Dynamically filled with active dataset -->
    </div>

    <!-- Simulation Launch Banner -->
    <div class="simulation-launch-bar">
      <div class="sim-config-group">
        <label>${t.hybridLoader.peakPowerLabel}: <input type="number" id="sim-peak-kw" class="form-input input-compact" value="5.0" step="0.5" min="0.1" /></label>
        <label>${t.hybridLoader.prLabel}: <input type="number" id="sim-pr" class="form-input input-compact" value="0.80" step="0.05" min="0.5" max="1.0" /></label>
        <label>${t.hybridLoader.albedoLabel}: <input type="number" id="sim-albedo" class="form-input input-compact" value="0.20" step="0.05" min="0.0" max="1.0" /></label>
      </div>
      <button id="btn-run-hybrid-simulation" class="btn btn-solar btn-lg">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>${t.hybridLoader.runSimulationBtn}</span>
      </button>
    </div>

    <!-- Live Status / Message Bar -->
    <div id="hybrid-status-bar" class="climate-status-bar status-info">
      ${isEn ? 'Select a historical station, complete the manual form, or upload a CSV/JSON file.' : 'Selecciona una fuente histórica, completa el formulario manual o sube un archivo CSV/JSON.'}
    </div>

    <!-- Simulation Results Area -->
    <div id="hybrid-simulation-results" class="simulation-results-container hidden">
      <!-- Dynamically filled on simulation -->
    </div>
  `;

  // Queries
  const tabButtons = container.querySelectorAll<HTMLButtonElement>('.dual-tab-btn');
  const tabContents = {
    historical: container.querySelector('#tab-content-historical') as HTMLElement,
    manual: container.querySelector('#tab-content-manual') as HTMLElement,
    upload: container.querySelector('#tab-content-upload') as HTMLElement,
  };

  const histSelect = container.querySelector('#hist-select-station') as HTMLSelectElement;
  const useHistBtn = container.querySelector('#btn-use-historical') as HTMLButtonElement;

  const manualName = container.querySelector('#manual-name') as HTMLInputElement;
  const manualLat = container.querySelector('#manual-lat') as HTMLInputElement;
  const manualLon = container.querySelector('#manual-lon') as HTMLInputElement;
  const manualElev = container.querySelector('#manual-elev') as HTMLInputElement;
  const manualAlbedo = container.querySelector('#manual-albedo') as HTMLInputElement;
  const manualTemplateSelect = container.querySelector('#manual-template-select') as HTMLSelectElement;
  const applyTemplateBtn = container.querySelector('#btn-apply-manual-template') as HTMLButtonElement;
  const validateManualBtn = container.querySelector('#btn-validate-manual') as HTMLButtonElement;

  const dropzone = container.querySelector('#file-dropzone') as HTMLElement;
  const fileInput = container.querySelector('#climate-file-input') as HTMLInputElement;
  const downloadCsvBtn = container.querySelector('#btn-download-csv-template') as HTMLButtonElement;
  const downloadJsonBtn = container.querySelector('#btn-download-json-template') as HTMLButtonElement;

  const activeCard = container.querySelector('#active-dataset-card') as HTMLElement;
  const simBtn = container.querySelector('#btn-run-hybrid-simulation') as HTMLButtonElement;
  const simPeakKw = container.querySelector('#sim-peak-kw') as HTMLInputElement;
  const simPr = container.querySelector('#sim-pr') as HTMLInputElement;
  const simAlbedo = container.querySelector('#sim-albedo') as HTMLInputElement;
  const statusBar = container.querySelector('#hybrid-status-bar') as HTMLElement;
  const resultsContainer = container.querySelector('#hybrid-simulation-results') as HTMLElement;

  let currentActiveRecord: ClimateDataRecord = hybridClimateManager.getHistoricalLocations()[0];

  // Tab switching
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.getAttribute('data-tab') as 'historical' | 'manual' | 'upload';
      Object.entries(tabContents).forEach(([key, el]) => {
        if (key === tabKey) el.classList.remove('hidden');
        else el.classList.add('hidden');
      });
    });
  });

  function setStatus(msg: string, type: 'info' | 'success' | 'error' = 'info') {
    statusBar.textContent = msg;
    statusBar.className = `climate-status-bar status-${type}`;
  }

  function renderActiveRecord(record: ClimateDataRecord) {
    currentActiveRecord = record;
    const annualG = record.monthlyGdm0.reduce((a, b) => a + b, 0) / 12;
    const annualT = record.monthlyTemperature.reduce((a, b) => a + b, 0) / 12;

    activeCard.innerHTML = `
      <div class="active-record-badge-bar">
        <div class="record-title-box">
          <h4>${record.locationName} (${record.country})</h4>
          <span class="badge badge-source">${record.source.toUpperCase()}</span>
          ${record.metadata?.rawFormat ? `<span class="badge badge-neutral">${record.metadata.rawFormat}</span>` : ''}
        </div>
        <div class="record-meta-pills">
          <span><strong>${t.location.latitude}:</strong> ${record.latitude.toFixed(3)}°</span>
          <span><strong>${t.location.longitude}:</strong> ${record.longitude.toFixed(3)}°</span>
          <span><strong>${t.location.elevation}:</strong> ${record.elevationM ?? 'N/D'} m</span>
          <span><strong>G<sub>dm</sub>(0):</strong> ${annualG.toFixed(2)} kWh/m²/d</span>
          <span><strong>T<sub>amb</sub>:</strong> ${annualT.toFixed(1)} °C</span>
        </div>
      </div>

      <div class="monthly-table-wrapper" style="margin-top: 0.75rem;">
        <table class="climate-monthly-table">
          <thead>
            <tr>
              <th>${isEn ? 'Month' : 'Mes'}</th>
              ${MONTH_NAMES.map((m) => `<th>${m}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="row-label">G<sub>dm</sub>(0) [kWh/m²/d]</td>
              ${record.monthlyGdm0.map((v) => `<td>${v.toFixed(2)}</td>`).join('')}
            </tr>
            <tr>
              <td class="row-label">T<sub>amb</sub> [°C]</td>
              ${record.monthlyTemperature.map((t) => `<td>${t.toFixed(1)}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // 1. Historical DB Actions
  useHistBtn.addEventListener('click', () => {
    const locId = histSelect.value;
    const rec = hybridClimateManager.getHistoricalLocationById(locId);
    if (rec) {
      renderActiveRecord(rec);
      setStatus(isEn ? `Loaded historical station: ${rec.locationName} (${rec.country}).` : `Cargada estación histórica: ${rec.locationName} (${rec.country}).`, 'success');
    }
  });

  // 2. Manual Form Actions
  applyTemplateBtn.addEventListener('click', () => {
    const locId = manualTemplateSelect.value;
    if (!locId) return;
    const rec = hybridClimateManager.getHistoricalLocationById(locId);
    if (!rec) return;

    manualName.value = `${rec.locationName} (Manual)`;
    manualLat.value = String(rec.latitude);
    manualLon.value = String(rec.longitude);
    manualElev.value = String(rec.elevationM ?? 0);

    const gInputs = container.querySelectorAll<HTMLInputElement>('.manual-g-input');
    const tInputs = container.querySelectorAll<HTMLInputElement>('.manual-t-input');
    gInputs.forEach((inp, idx) => {
      if (rec.monthlyGdm0[idx] !== undefined) inp.value = rec.monthlyGdm0[idx].toFixed(2);
    });
    tInputs.forEach((inp, idx) => {
      if (rec.monthlyTemperature[idx] !== undefined) inp.value = rec.monthlyTemperature[idx].toFixed(1);
    });

    setStatus(isEn ? `Template "${rec.locationName}" applied to form.` : `Plantilla "${rec.locationName}" aplicada al formulario.`, 'info');
  });

  validateManualBtn.addEventListener('click', () => {
    const gInputs = container.querySelectorAll<HTMLInputElement>('.manual-g-input');
    const tInputs = container.querySelectorAll<HTMLInputElement>('.manual-t-input');

    const gdm0: number[] = [];
    const temp: number[] = [];

    gInputs.forEach((inp) => gdm0.push(parseFloat(inp.value) || 0));
    tInputs.forEach((inp) => temp.push(parseFloat(inp.value) || 0));

    try {
      const rec = hybridClimateManager.setManualData({
        locationName: manualName.value.trim() || 'Estación Manual',
        latitude: parseFloat(manualLat.value) || 0,
        longitude: parseFloat(manualLon.value) || 0,
        elevationM: parseFloat(manualElev.value) || 0,
        country: 'Personalizado',
        albedo: parseFloat(manualAlbedo.value) || 0.20,
        monthlyGdm0: gdm0,
        monthlyTemperature: temp,
      });

      renderActiveRecord(rec);
      setStatus(isEn ? '✓ Manual dataset validated successfully.' : '✓ Dataset manual validado correctamente.', 'success');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`, 'error');
    }
  });

  // 3. File Upload Actions
  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setStatus(isEn ? `Reading file "${file.name}"...` : `Leyendo archivo "${file.name}"...`, 'info');

    hybridClimateManager
      .parseUploadedClimateFile(file)
      .then((record: ClimateDataRecord) => {
        renderActiveRecord(record);
        setStatus(
          isEn ? `✓ File "${file.name}" loaded successfully (${record.locationName}).` : `✓ Archivo "${file.name}" cargado con éxito (${record.locationName}).`,
          'success'
        );
      })
      .catch((err: any) => {
        console.error('[Upload Error]', err);
        setStatus(`Error de lectura: ${err.message}`, 'error');
      });
  }

  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-active');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-active'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-active');
    handleFiles(e.dataTransfer?.files || null);
  });

  downloadCsvBtn.addEventListener('click', () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_climatica_orientsol.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  downloadJsonBtn.addEventListener('click', () => {
    const json = generateSampleJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_climatica_orientsol.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // 4. Run Pyodide Simulation Bridge
  simBtn.addEventListener('click', async () => {
    if (!currentActiveRecord) {
      setStatus(isEn ? 'No active climate dataset available.' : 'No hay dataset meteorológico activo.', 'error');
      return;
    }

    const peakKw = parseFloat(simPeakKw.value) || 5.0;
    const pr = parseFloat(simPr.value) || 0.80;
    const albedo = parseFloat(simAlbedo.value) || 0.20;

    simBtn.disabled = true;
    simBtn.innerHTML = `
      <span class="spinner-sm"></span>
      <span>${t.hybridLoader.runningSimulationBtn}</span>
    `;
    setStatus(isEn ? 'Executing complete solar simulation with Python/NumPy engine...' : 'Ejecutando simulación solar completa con el motor Python/NumPy...', 'info');

    try {
      const startTime = performance.now();
      const params = hybridClimateManager.prepareForPythonBridge(currentActiveRecord, {
        peakPowerKw: peakKw,
        performanceRatio: pr,
        albedo,
      });

      const result = await executeSolarSimulationFromClimateData(params);
      const elapsed = Math.round(performance.now() - startTime);

      setStatus(
        isEn
          ? `✓ Simulation completed in ${elapsed}ms via Python WebAssembly engine.`
          : `✓ Simulación finalizada en ${elapsed}ms con el motor Python en WebAssembly.`,
        'success'
      );
      renderResults(result);
    } catch (err: any) {
      console.error('[OrientSol Hybrid Simulation] Error:', err);
      setStatus(`Error en la ejecución de Pyodide: ${err.message || String(err)}`, 'error');
    } finally {
      simBtn.disabled = false;
      simBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>${t.hybridLoader.runSimulationBtn}</span>
      `;
    }
  });

  function renderResults(res: SolarBridgeSimulationResult) {
    resultsContainer.classList.remove('hidden');

    const getCteClass = (loss: number) => {
      if (loss <= 10.0) return 'loss-cell-green';
      if (loss <= 20.0) return 'loss-cell-yellow';
      if (loss <= 40.0) return 'loss-cell-orange';
      return 'loss-cell-red';
    };

    const getBadgeClass = (category: string) => {
      if (category.includes('2')) return 'badge-2ejes';
      if (category.includes('1')) return 'badge-1eje';
      return 'badge-fija';
    };

    resultsContainer.innerHTML = `
      <div class="results-header">
        <div class="results-header-left">
          <div class="results-badge-row">
            <span class="badge badge-success">${t.results.pythonSuccess}</span>
            <span class="badge badge-neutral">${res.executionTimeMs} ms</span>
            <span class="badge badge-source">${res.source.toUpperCase()}</span>
          </div>
          <h3>${t.results.resultsFor.replace('{location}', res.locationName).replace('{lat}', res.latitude.toFixed(2))}</h3>
        </div>
        <div class="results-export-actions">
          <button id="btn-export-pdf" class="btn-export btn-export-pdf" type="button" title="${t.results.exportPdfBtn}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9V2h12v7"></path>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>${t.results.exportPdfBtn}</span>
          </button>
          <button id="btn-export-csv" class="btn-export btn-export-csv" type="button" title="${t.results.exportCsvBtn}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>${t.results.exportCsvBtn}</span>
          </button>
          <button id="btn-copy-summary" class="btn-export btn-export-copy" type="button" title="${t.results.exportCopyBtn}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span id="copy-btn-label">${t.results.exportCopyBtn}</span>
          </button>
        </div>
      </div>

      <!-- 1. RESUMEN DE TEMPERATURAS AMBIENTE Y DE CÉLULA -->
      <div class="temperatures-overview-grid">
        <div class="temp-stat-card">
          <span class="temp-stat-title">${t.results.tempMeanAnnual}</span>
          <div class="temp-stat-value temp-mean">${res.temperatures.ambient.annualMeanC.toFixed(1)} <small style="font-size:0.9rem">°C</small></div>
          <span class="temp-stat-sub">${t.results.tempMeanAnnualDesc}</span>
        </div>
        <div class="temp-stat-card">
          <span class="temp-stat-title">${t.results.tempMaxAnnual}</span>
          <div class="temp-stat-value temp-warm">${res.temperatures.ambient.annualMaxC.toFixed(1)} <small style="font-size:0.9rem">°C</small></div>
          <span class="temp-stat-sub">${t.results.tempMaxAnnualDesc}</span>
        </div>
        <div class="temp-stat-card">
          <span class="temp-stat-title">${t.results.tempMinAnnual}</span>
          <div class="temp-stat-value temp-cool">${res.temperatures.ambient.annualMinC.toFixed(1)} <small style="font-size:0.9rem">°C</small></div>
          <span class="temp-stat-sub">${t.results.tempMinAnnualDesc}</span>
        </div>
        <div class="temp-stat-card">
          <span class="temp-stat-title">${t.results.tempCellOperating}</span>
          <div class="temp-stat-value temp-cell">${res.temperatures.cellOperating.meanCellTempOptimalC.toFixed(1)} <small style="font-size:0.9rem">°C</small></div>
          <span class="temp-stat-sub">${t.results.tempCellOperatingDesc.replace('{max}', res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1))}</span>
        </div>
      </div>

      <!-- 2. GRÁFICOS VISUALES INTERACTIVOS (SVG) -->
      <div class="results-charts-section">
        <div class="charts-section-header">
          <div class="charts-badge-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
          </div>
          <div>
            <h4>${t.results.chartsTitle}</h4>
            <span class="charts-section-desc">
              ${isEn ? 'High-precision vector solar curves and monthly breakdowns generated by the WebAssembly engine' : 'Curvas solares vectoriales de alta precisión y desgloses mensuales generados por el motor WebAssembly'}
            </span>
          </div>
        </div>
        <div class="charts-grid-2col">
          ${renderRadiationChart(res, isEn)}
          ${renderEnergyAndTemperatureChart(res, isEn)}
        </div>
        <div class="chart-fullwidth-wrapper">
          ${renderSurfacesRankingChart(res, isEn)}
        </div>
      </div>

      <!-- 2. OPTIMIZACIÓN DE SUPERFICIES FIJAS (ANUAL, ESTACIONAL, MENSUAL) -->
      <div class="results-section-grid">
        <!-- 2.1 Fija Óptima Anual -->
        <div class="result-card highlight-card">
          <div class="result-card-header">
            <h4>${t.results.optAnnualTitle}</h4>
            <span class="tag-optimum">${res.optimalAnnual.optimalTiltDeg}°</span>
          </div>
          <div class="result-stat-main">
            <span class="stat-highlight">${res.optimalAnnual.annualMeanDailyKwh.toFixed(2)}</span>
            <span class="stat-unit">kWh/m²/día</span>
          </div>
          <div class="result-stat-sub">
            <span>${t.results.gainOverHoriz}</span>
            <strong class="text-gain">+${res.optimalAnnual.gainOverHorizontalPct.toFixed(2)}%</strong>
          </div>
          <div class="result-stat-sub">
            <span>${t.results.annualTotalRad}</span>
            <strong>${Math.round(res.optimalAnnual.annualTotalKwh)} kWh/m²·año</strong>
          </div>
        </div>

        <!-- 2.2 4 Posiciones Estacionales -->
        <div class="result-card">
          <div class="result-card-header">
            <h4>${t.results.seasonalTitle}</h4>
            <span class="text-gain">+${res.seasonal.gainOverOptimalAnnualPct.toFixed(2)}% ${t.results.vsFixed}</span>
          </div>
          <div class="seasonal-angles-list">
            <div class="seasonal-item">
              <span class="season-badge winter">${t.results.winter}</span>
              <strong class="season-deg">${res.seasonal.winterTiltDeg}°</strong>
              <span class="season-rad">${res.seasonal.winterMeanDailyKwh.toFixed(2)} kWh/m²/d</span>
            </div>
            <div class="seasonal-item">
              <span class="season-badge spring">${t.results.spring}</span>
              <strong class="season-deg">${res.seasonal.springTiltDeg}°</strong>
              <span class="season-rad">${res.seasonal.springMeanDailyKwh.toFixed(2)} kWh/m²/d</span>
            </div>
            <div class="seasonal-item">
              <span class="season-badge summer">${t.results.summer}</span>
              <strong class="season-deg">${res.seasonal.summerTiltDeg}°</strong>
              <span class="season-rad">${res.seasonal.summerMeanDailyKwh.toFixed(2)} kWh/m²/d</span>
            </div>
            <div class="seasonal-item">
              <span class="season-badge autumn">${t.results.autumn}</span>
              <strong class="season-deg">${res.seasonal.autumnTiltDeg}°</strong>
              <span class="season-rad">${res.seasonal.autumnMeanDailyKwh.toFixed(2)} kWh/m²/d</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.3 12 Posiciones Mensuales -->
      <div class="result-card wide-card" style="margin-bottom: 1.25rem;">
        <div class="result-card-header" style="margin-bottom: 0.5rem;">
          <h4>${t.results.monthlyTitle}</h4>
          <div>
            <span class="badge badge-neutral" style="margin-right: 0.5rem;">${t.results.monthlyDailyMean.replace('{mean}', res.monthlyOptimum12.annualMeanDailyKwh.toFixed(2))}</span>
            <span class="badge badge-success">${t.results.vsFixedAnnual.replace('{gain}', res.monthlyOptimum12.gainOverOptimalAnnualPct.toFixed(2)).replace('{gainHoriz}', res.monthlyOptimum12.gainOverHorizontalPct.toFixed(2))}</span>
          </div>
        </div>
        <div class="monthly-tilts-grid">
          ${res.monthlyOptimum12.optimalTiltsDeg
            .map(
              (deg, idx) => `
            <div class="monthly-tilt-badge">
              <span class="monthly-tilt-name">${MONTH_NAMES[idx]}</span>
              <span class="monthly-tilt-angle">${deg}°</span>
              <span class="monthly-tilt-rad">${res.monthlyOptimum12.monthlyDailyKwh[idx].toFixed(2)}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- 3. BALANCE ENERGÉTICO: ENERGÍA RECIBIDA VS ENERGÍA PRODUCIDA -->
      <div class="result-card wide-card" style="margin-bottom: 1.25rem;">
        <div class="result-card-header">
          <h4>${t.results.energyBalanceTitle}</h4>
          <span class="badge badge-neutral">${simPeakKw.value} kWp | PR=${(parseFloat(simPr.value) * 100).toFixed(0)}%</span>
        </div>
        <div class="energy-models-grid">
          <div class="energy-box">
            <span class="energy-title">${t.results.solarReceivedTitle}</span>
            <div class="energy-val-large" style="color: #fbbf24;">
              ${Math.round(res.energyYield.recibida.annualTotalKwh).toLocaleString()} <small>kWh/${isEn ? 'yr' : 'año'}</small>
            </div>
            <div class="energy-details">
              <span>${t.results.collectorArea}</span>
              <strong>${(res.energyYield.collectorAreaM2 ?? 0).toFixed(1)} m²</strong>
            </div>
            <div class="energy-details">
              <span>${t.results.annualIrradiationM2}</span>
              <strong>${(res.energyYield.recibida.annualKwhM2 ?? 0).toFixed(1)} kWh/m²·${isEn ? 'yr' : 'año'}</strong>
            </div>
            <div class="energy-row-track">
              <span>${t.results.dailyMeanResource}</span>
              <strong>${(res.energyYield.recibida.meanDailyKwhM2 ?? 0).toFixed(2)} kWh/m²/${isEn ? 'day' : 'día'}</strong>
            </div>
          </div>

          <div class="energy-box">
            <span class="energy-title">${t.results.solarProducedTitle}</span>
            <div class="energy-val-large" style="color: #34d399;">
              ${Math.round(res.energyYield.producida.osterwald.annualKwh ?? 0).toLocaleString()} <small>kWh/${isEn ? 'yr' : 'año'}</small>
            </div>
            <div class="energy-details">
              <span>${t.results.osterwaldModel}</span>
              <strong>${(res.energyYield.producida.osterwald.specificYieldKwhKwp ?? 0).toFixed(0)} kWh/kWp</strong>
            </div>
            <div class="energy-details">
              <span>${t.results.cellThermalLosses}</span>
              <strong style="color: #f87171;">-${(res.energyYield.producida.osterwald.thermalLossKwh ?? 0).toFixed(0)} kWh (-${(res.energyYield.producida.osterwald.thermalLossPct ?? 0).toFixed(2)}%)</strong>
            </div>
            <div class="energy-row-track">
              <span>${t.results.simplifiedModel}</span>
              <strong>${Math.round(res.energyYield.producida.simplified.annualKwh ?? 0).toLocaleString()} kWh/${isEn ? 'yr' : 'año'}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. MAPA DE PÉRDIDAS DE CAPTACIÓN (CTE DB-HE4) -->
      <div class="result-card wide-card" style="margin-bottom: 1.25rem;">
        <div class="result-card-header">
          <h4>${t.results.lossMapTitle}</h4>
          <span class="badge badge-success">${t.results.lossMapOptimal.replace('{beta}', String(res.captureLossMap.optimalPoint.betaDeg ?? 0)).replace('{alpha}', String(res.captureLossMap.optimalPoint.alphaDeg ?? 0)).replace('{rad}', (res.captureLossMap.optimalPoint.maxDailyRadiationKwh ?? 0).toFixed(2))}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.25rem;">
          ${t.results.lossMapSubtitle}
        </p>

        <div class="cte-legend-bar">
          <div class="cte-legend-item">
            <span class="cte-color-box box-green"></span>
            <span>${t.results.cteGeneral} <strong>${res.captureLossMap.cteZones.generalPctCompliant}%</strong> ${t.results.ofMap}</span>
          </div>
          <div class="cte-legend-item">
            <span class="cte-color-box box-yellow"></span>
            <span>${t.results.cteSuperposition} <strong>${res.captureLossMap.cteZones.superpositionPctCompliant}%</strong></span>
          </div>
          <div class="cte-legend-item">
            <span class="cte-color-box box-orange"></span>
            <span>${t.results.cteIntegration} <strong>${res.captureLossMap.cteZones.integrationPctCompliant}%</strong></span>
          </div>
          <div class="cte-legend-item">
            <span class="cte-color-box box-red"></span>
            <span>${t.results.cteNonCompliant}</span>
          </div>
        </div>

        <div class="loss-map-container">
          <table class="loss-map-matrix-table">
            <thead>
              <tr>
                <th class="corner-th">${t.results.tiltHeader}</th>
                ${res.captureLossMap.alphasDeg.map((a) => `<th>${a > 0 ? '+' : ''}${a}°</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${res.captureLossMap.betasDeg
                .map((b, i_b) => {
                  const cells = res.captureLossMap.alphasDeg
                    .map((a, i_a) => {
                      const loss = res.captureLossMap.lossPercentageMatrix[i_b][i_a];
                      const rad = res.captureLossMap.radiationMatrixKwhM2Day[i_b][i_a];
                      const cls = getCteClass(loss);
                      return `<td class="${cls}" title="&beta;=${b}°, &alpha;=${a}°: Pérdida ${loss.toFixed(1)}% (${rad.toFixed(2)} kWh/m²/d)">${loss.toFixed(0)}%</td>`;
                    })
                    .join('');
                  return `<tr><td class="row-header-beta">${b}°</td>${cells}</tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. COMPARATIVA GLOBAL DE SUPERFICIES (8 TOPOLOGÍAS COMPLETAS) -->
      <div class="result-card wide-card">
        <div class="result-card-header">
          <h4>${t.results.surfacesTableTitle}</h4>
          <span class="badge badge-neutral">${t.results.surfacesTableSubtitle}</span>
        </div>
        <div class="tracking-table-wrapper" style="margin-top: 0.75rem;">
          <table class="all-surfaces-table">
            <thead>
              <tr>
                <th>${t.results.thSurface}</th>
                <th>${t.results.thType}</th>
                <th>${t.results.thDailyRad}</th>
                <th>${t.results.thAnnualTotal}</th>
                <th>${t.results.thGainHoriz}</th>
                <th>${t.results.thGainFixedOpt}</th>
                <th>${t.results.thProdOsterwald}</th>
                <th>${t.results.thCellTemp}</th>
              </tr>
            </thead>
            <tbody>
              ${res.surfaceComparison
                .map(
                  (surf) => `
                <tr class="${surf.key === 'tracking_2axis_dual' ? 'highlight-row' : ''}">
                  <td><strong>${surf.name}</strong></td>
                  <td><span class="category-badge ${getBadgeClass(surf.category)}">${surf.category}</span></td>
                  <td>${(surf.meanDailyKwhM2 ?? 0).toFixed(3)} kWh/m²/d</td>
                  <td>${Math.round(surf.annualRadiationKwhM2 ?? 0).toLocaleString()} kWh/m²</td>
                  <td class="${(surf.gainOverHorizontalPct ?? 0) > 0 ? 'text-gain' : ''}">
                    ${(surf.gainOverHorizontalPct ?? 0) >= 0 ? '+' : ''}${(surf.gainOverHorizontalPct ?? 0).toFixed(2)}%
                  </td>
                  <td class="${(surf.gainOverAnnualFixedPct ?? 0) > 0 ? 'text-gain' : ''}">
                    ${(surf.gainOverAnnualFixedPct ?? 0) >= 0 ? '+' : ''}${(surf.gainOverAnnualFixedPct ?? 0).toFixed(2)}%
                  </td>
                  <td style="color: #34d399; font-weight: 600;">
                    ${Math.round(surf.energyProducedOsterwaldKwhYear ?? 0).toLocaleString()} kWh/${isEn ? 'yr' : 'año'}
                  </td>
                  <td style="color: #fbbf24;">
                    ${(surf.meanCellTempDegC ?? 0).toFixed(1)} °C
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Event Listeners for Export & Report Actions
    const pdfBtn = resultsContainer.querySelector<HTMLButtonElement>('#btn-export-pdf');
    const csvBtn = resultsContainer.querySelector<HTMLButtonElement>('#btn-export-csv');
    const copyBtn = resultsContainer.querySelector<HTMLButtonElement>('#btn-copy-summary');
    const copyLabel = resultsContainer.querySelector<HTMLSpanElement>('#copy-btn-label');

    pdfBtn?.addEventListener('click', () => {
      exportToPDF();
    });

    csvBtn?.addEventListener('click', () => {
      exportToCSV(res, {
        peakPowerKw: parseFloat(simPeakKw.value) || 5.0,
        performanceRatio: parseFloat(simPr.value) || 0.80,
        isEn,
      });
    });

    copyBtn?.addEventListener('click', async () => {
      const ok = await copyReportToClipboard(res, {
        peakPowerKw: parseFloat(simPeakKw.value) || 5.0,
        performanceRatio: parseFloat(simPr.value) || 0.80,
        isEn,
      });
      if (ok && copyLabel) {
        const originalText = copyLabel.textContent;
        copyLabel.textContent = t.results.exportCopied;
        setTimeout(() => {
          copyLabel.textContent = originalText;
        }, 2500);
      }
    });

    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Initial render with first historical station
  setTimeout(() => renderActiveRecord(currentActiveRecord), 0);

  // Auto-run simulation when Pyodide runtime is ready so the user immediately sees all calculation results
  const autoUnsub = pyodideService.subscribe((state) => {
    if (state.status === 'ready') {
      setTimeout(() => {
        if (!resultsContainer.hasChildNodes() || resultsContainer.classList.contains('hidden')) {
          console.log('[OrientSol] Auto-triggering initial simulation for immediate full results');
          simBtn.click();
        }
      }, 200);
      autoUnsub();
    }
  });

  return container;
}
