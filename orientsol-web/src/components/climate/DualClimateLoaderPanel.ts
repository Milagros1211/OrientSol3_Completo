import { hybridClimateManager } from '@/services/hybrid';
import {
  executeSolarSimulationFromClimateData,
  type SolarBridgeSimulationResult,
} from '@/services/bridge/solarCalculationBridge';
import { solarSyncState } from '@/services/bridge/solarSyncState';
import { generateSampleCSV, generateSampleJSON } from '@/services/hybrid/climateFileParser';
import type { ClimateDataRecord } from '@/types/climate';
import { climateDatabaseService, formatEmplacementNameWithSuffix } from '@/services/supabase';
import { fetchUnifiedClimateData } from '@/services/external';
import { i18n } from '@/i18n';
import {
  renderRadiationChart,
  renderEnergyAndTemperatureChart,
  renderSurfacesRankingChart,
} from '@/components/charts/SolarCharts';
import { copyReportToClipboard } from '@/components/export/reportExporter';
import { getSurfaceDisplayName, getCategoryBadge } from '@/i18n/surfaceTranslations';
import { pyodideService } from '@/services/pyodide';
import {
  renderOptimalAnnualStudyPanel,
} from '@/components/climate/OptimalAnnualStudyPanel';
import { renderOptimalMonthlyStudyPanel } from '@/components/climate/OptimalMonthlyStudyPanel';
import { renderOptimalSeasonalStudyPanel } from '@/components/climate/OptimalSeasonalStudyPanel';
import { renderTrackingPolarStudyPanel } from '@/components/climate/TrackingPolarStudyPanel';
import { renderTrackingAzimuthalStudyPanel } from '@/components/climate/TrackingAzimuthalStudyPanel';
import { renderTrackingHorizontalStudyPanel } from '@/components/climate/TrackingHorizontalStudyPanel';
import { renderTrackingDualAxisStudyPanel } from '@/components/climate/TrackingDualAxisStudyPanel';
import { renderComparativeStudyPanel } from '@/components/climate/ComparativeStudyPanel';

// Module-level caches to preserve state across language toggles (ES <-> EN)
let cachedLastSimulationResult: SolarBridgeSimulationResult | null = null;
let cachedActiveRecord: ClimateDataRecord | null = null;
let cachedActiveTab: 'historical' | 'manual' | 'upload' | 'api' = 'historical';
let cachedActiveStudyOp: 'annual' | 'monthly' | 'seasonal' | 'polar' | 'azimuthal' | 'horizontal' | 'dual' | 'comparative' = 'annual';

/**
 * Renders the banner indicating whether online upload to Supabase is permitted or in offline cache mode.
 */
function renderSupabaseUploadBannerHtml(isEn: boolean): string {
  const isOnline = climateDatabaseService.isOnline();
  const isConfigured = climateDatabaseService.isConfigured();
  const isAllowed = isOnline && isConfigured;

  if (isAllowed) {
    return `
      <div class="supabase-upload-indicator online">
        <span class="status-indicator-dot online"></span>
        <div class="indicator-text-block">
          <strong>${isEn ? '🟢 Online Supabase Upload: PERMITTED' : '🟢 Carga Online a Supabase: PERMITIDA'}</strong>
          <span class="indicator-sub">${isEn ? 'Connected to table: ' : 'Conectado a la tabla: '}<code>datos_mensuales</code>. ${isEn ? 'New emplacements are automatically stored in the cloud.' : 'Los nuevos emplazamientos se guardan automáticamente en la nube.'}</span>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="supabase-upload-indicator offline">
        <span class="status-indicator-dot offline"></span>
        <div class="indicator-text-block">
          <strong>${isEn ? '🔴 Online Supabase Upload: NOT PERMITTED (Offline Mode)' : '🔴 Carga Online a Supabase: NO PERMITIDA (Modo Offline)'}</strong>
          <span class="indicator-sub">${isEn ? 'No Supabase connection detected. New emplacements will be safely saved in local cache.' : 'Sin conexión activa a Supabase. El emplazamiento se guardará en la caché local para sincronizarlo después.'}</span>
        </div>
      </div>
    `;
  }
}

export function renderDualClimateLoaderPanel(): HTMLElement {
  const container = document.createElement('section');
  container.className = 'panel-card dual-climate-panel';
  const t = i18n.t;
  const isEn = i18n.getLocale() === 'en';
  const MONTH_NAMES = t.common.monthNamesShort;
  const currentActiveRecordInit: ClimateDataRecord = cachedActiveRecord || hybridClimateManager.getHistoricalLocations()[0];

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
      <button class="dual-tab-btn ${cachedActiveTab === 'historical' ? 'active' : ''}" data-tab="historical">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>${t.hybridLoader.tabHistorical}</span>
      </button>

      <button class="dual-tab-btn ${cachedActiveTab === 'manual' ? 'active' : ''}" data-tab="manual">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>${t.hybridLoader.tabManual}</span>
      </button>

      <button class="dual-tab-btn ${cachedActiveTab === 'upload' ? 'active' : ''}" data-tab="upload">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>${t.hybridLoader.tabUpload}</span>
      </button>

      <button class="dual-tab-btn ${cachedActiveTab === 'api' ? 'active' : ''}" data-tab="api">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path>
        </svg>
        <span>${isEn ? '4. Satellite Climate APIs (PVGIS / NASA)' : '4. APIs Climáticas Satelitales (PVGIS / NASA)'}</span>
      </button>
    </div>

    <!-- TAB 1: HISTORICAL DATABASE & SUPABASE SEARCH -->
    <div id="tab-content-historical" class="dual-tab-content ${cachedActiveTab === 'historical' ? '' : 'hidden'}">
      <div class="historical-search-row">
        <div class="form-group flex-1" style="position: relative;">
          <label for="hist-search-input" class="form-label">
            ${t.hybridLoader.historicalLabel}
            <span class="search-hint-sub">${isEn ? '(Search case-insensitive: Supabase & Cache)' : '(Búsqueda case-insensitive: Supabase & Caché)'}</span>
          </label>
          <div class="search-input-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              id="hist-search-input"
              class="form-input search-text-input"
              value="${currentActiveRecordInit.locationName}"
              placeholder="${isEn ? 'Search location (Spanish/English letters only)...' : 'Buscar emplazamiento (solo letras castellano/inglés)...'}"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <!-- Live Suggestions / Similarities Dropdown -->
          <div id="hist-suggestions-dropdown" class="suggestions-dropdown hidden" role="listbox"></div>
        </div>
        <button id="btn-use-historical" class="btn btn-primary" style="align-self: flex-end;">
          <span>${t.hybridLoader.selectStation}</span>
        </button>
      </div>

      <!-- NOT FOUND ALERT BANNER -->
      <div id="hist-not-found-banner" class="search-not-found-banner hidden"></div>
    </div>

    <!-- TAB 2: MANUAL FORM -->
    <div id="tab-content-manual" class="dual-tab-content ${cachedActiveTab === 'manual' ? '' : 'hidden'}">
      <div id="manual-upload-permission-box">${renderSupabaseUploadBannerHtml(isEn)}</div>
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
        <input type="hidden" id="manual-elev" value="0" />
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
      <div id="file-upload-permission-box">${renderSupabaseUploadBannerHtml(isEn)}</div>
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
          <button id="btn-download-csv-multi-template" class="btn btn-secondary">${isEn ? 'Sample Batch CSV (Multi)' : 'Plantilla CSV (Lote Multi)'}</button>
          <button id="btn-download-json-template" class="btn btn-secondary">${t.hybridLoader.sampleJsonBtn}</button>
          <button id="btn-download-json-multi-template" class="btn btn-secondary">${isEn ? 'Sample Batch JSON (Multi)' : 'Plantilla JSON (Lote Multi)'}</button>
        </div>
      </div>
    </div>

    <!-- TAB 4: SATELLITE CLIMATE APIS -->
    <div id="tab-content-api" class="dual-tab-content ${cachedActiveTab === 'api' ? '' : 'hidden'}">
      <div class="climate-controls-grid">
        <div class="form-group">
          <label for="api-source-select" class="form-label">${isEn ? 'Data Source' : 'Fuente de Datos'}</label>
          <select id="api-source-select" class="form-select">
            <option value="pvgis">${isEn ? 'PVGIS 5.3 API (European Commission JRC)' : 'PVGIS 5.3 API (Comisión Europea JRC)'}</option>
            <option value="nasa">${isEn ? 'NASA POWER API (Global Satellite Climatology)' : 'NASA POWER API (Climatología Satelital Global)'}</option>
            <option value="meteonorm">${isEn ? 'Meteonorm / Open-Meteo Reanalysis (ERA5)' : 'Meteonorm / Open-Meteo Reanalysis (ERA5)'}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="api-city-preset-select" class="form-label">${isEn ? 'City Preset' : 'Preajuste de Ciudad'}</label>
          <select id="api-city-preset-select" class="form-select">
            <option value="0">Madrid (España)</option>
            <option value="1">Barcelona (España)</option>
            <option value="2">Sevilla (España)</option>
            <option value="3">Valencia (España)</option>
            <option value="4">Bilbao (España)</option>
            <option value="5">Santa Cruz de Tenerife (España)</option>
            <option value="6">Jaén (España)</option>
            <option value="7">Roma (Italia)</option>
            <option value="8">Atenas (Grecia)</option>
            <option value="custom">${isEn ? 'Custom Coordinates...' : 'Coordenadas Personalizadas...'}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="api-input-lat" class="form-label">${t.location.latitude} [°]</label>
          <input type="number" id="api-input-lat" class="form-input" step="0.0001" value="40.4168" />
        </div>

        <div class="form-group">
          <label for="api-input-lon" class="form-label">${t.location.longitude} [°]</label>
          <input type="number" id="api-input-lon" class="form-input" step="0.0001" value="-3.7038" />
        </div>
      </div>

      <div class="climate-actions-row">
        <button id="btn-fetch-satellite-api" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M21 21v-5h-5"></path>
          </svg>
          <span>${isEn ? 'Fetch Satellite Climate' : 'Consultar Climatología'}</span>
        </button>

        <button id="btn-save-api-to-supabase" class="btn btn-secondary" disabled>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>${isEn ? 'Save to Supabase' : 'Guardar en Supabase'}</span>
        </button>
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
        <label>${t.hybridLoader.toncLabel}: <input type="number" id="sim-tonc" class="form-input input-compact" value="47.0" step="0.5" min="30.0" max="65.0" /></label>
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
    api: container.querySelector('#tab-content-api') as HTMLElement,
  };

  const histSearchInput = container.querySelector('#hist-search-input') as HTMLInputElement;
  const histSuggestionsDropdown = container.querySelector('#hist-suggestions-dropdown') as HTMLDivElement;
  const histNotFoundBanner = container.querySelector('#hist-not-found-banner') as HTMLDivElement;
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
  const downloadCsvMultiBtn = container.querySelector('#btn-download-csv-multi-template') as HTMLButtonElement;
  const downloadJsonBtn = container.querySelector('#btn-download-json-template') as HTMLButtonElement;
  const downloadJsonMultiBtn = container.querySelector('#btn-download-json-multi-template') as HTMLButtonElement;

  // Tab 4: Satellite Climate APIs Queries
  const apiSourceSelect = container.querySelector('#api-source-select') as HTMLSelectElement;
  const apiCitySelect = container.querySelector('#api-city-preset-select') as HTMLSelectElement;
  const apiLatInput = container.querySelector('#api-input-lat') as HTMLInputElement;
  const apiLonInput = container.querySelector('#api-input-lon') as HTMLInputElement;
  const apiFetchBtn = container.querySelector('#btn-fetch-satellite-api') as HTMLButtonElement;
  const apiSaveBtn = container.querySelector('#btn-save-api-to-supabase') as HTMLButtonElement;

  const activeCard = container.querySelector('#active-dataset-card') as HTMLElement;
  const simBtn = container.querySelector('#btn-run-hybrid-simulation') as HTMLButtonElement;
  const simPeakKw = container.querySelector('#sim-peak-kw') as HTMLInputElement;
  const simPr = container.querySelector('#sim-pr') as HTMLInputElement;
  const simAlbedo = container.querySelector('#sim-albedo') as HTMLInputElement;
  const simTonc = container.querySelector('#sim-tonc') as HTMLInputElement;
  const statusBar = container.querySelector('#hybrid-status-bar') as HTMLElement;
  const resultsContainer = container.querySelector('#hybrid-simulation-results') as HTMLElement;

  // Initialize values from synchronized global state
  if (simPeakKw) simPeakKw.value = solarSyncState.getPeakPowerKw().toString();
  if (simTonc) simTonc.value = solarSyncState.getTonc().toString();

  // Real-time synchronization when typing into Climate Simulation Bar
  simPeakKw?.addEventListener('input', () => {
    const v = parseFloat(simPeakKw.value);
    if (!isNaN(v) && v > 0) {
      solarSyncState.setPeakPowerKw(v, 'sim-panel');
    }
  });

  simTonc?.addEventListener('input', () => {
    const v = parseFloat(simTonc.value);
    if (!isNaN(v) && v > 0) {
      solarSyncState.setTonc(v, 'sim-panel');
    }
  });

  // Listen to parameter updates coming from EnergyCalculationPanel
  window.addEventListener('orientsol:solar-params-updated', (e: Event) => {
    const d = (e as CustomEvent).detail;
    if (!d || d.source === 'sim-panel') return;
    if (d.field === 'peakPowerKw' && simPeakKw && parseFloat(simPeakKw.value) !== d.value) {
      simPeakKw.value = d.value.toString();
    } else if (d.field === 'tonc' && simTonc && parseFloat(simTonc.value) !== d.value) {
      simTonc.value = d.value.toString();
    }
  });

  let currentActiveRecord: ClimateDataRecord = currentActiveRecordInit;

  // Tab switching
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.getAttribute('data-tab') as 'historical' | 'manual' | 'upload' | 'api';
      cachedActiveTab = tabKey;
      Object.entries(tabContents).forEach(([key, el]) => {
        if (key === tabKey) el?.classList.remove('hidden');
        else el?.classList.add('hidden');
      });
    });
  });

  // Listen to external navigation triggers (e.g., from top navigation bar)
  const handleSwitchClimateTab = (e: Event) => {
    const customEvt = e as CustomEvent<'historical' | 'manual' | 'upload' | 'api'>;
    const targetKey = customEvt.detail;
    const btn = container.querySelector<HTMLButtonElement>(`.dual-tab-btn[data-tab="${targetKey}"]`);
    if (btn) {
      btn.click();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  window.addEventListener('orientsol:switch-climate-tab', handleSwitchClimateTab);

  // Satellite API City Presets
  const API_CITY_PRESETS = [
    { name: 'Madrid (España)', lat: 40.4168, lon: -3.7038 },
    { name: 'Barcelona (España)', lat: 41.3879, lon: 2.1699 },
    { name: 'Sevilla (España)', lat: 37.3891, lon: -5.9845 },
    { name: 'Valencia (España)', lat: 39.4699, lon: -0.3763 },
    { name: 'Bilbao (España)', lat: 43.263, lon: -2.935 },
    { name: 'Santa Cruz de Tenerife (España)', lat: 28.4636, lon: -16.2518 },
    { name: 'Jaén (España)', lat: 37.7796, lon: -3.7849 },
    { name: 'Roma (Italia)', lat: 41.9028, lon: 12.4964 },
    { name: 'Atenas (Grecia)', lat: 37.9838, lon: 23.7275 },
  ];

  apiCitySelect?.addEventListener('change', () => {
    const val = apiCitySelect.value;
    if (val !== 'custom') {
      const idx = parseInt(val, 10);
      const preset = API_CITY_PRESETS[idx];
      if (preset) {
        apiLatInput.value = preset.lat.toFixed(4);
        apiLonInput.value = preset.lon.toFixed(4);
      }
    }
  });

  // Fetch Satellite Climate Data Handler
  apiFetchBtn?.addEventListener('click', async () => {
    const sourceKey = apiSourceSelect.value;
    const actualSource = sourceKey === 'nasa' ? 'nasa_power' : (sourceKey as any);
    const lat = parseFloat(apiLatInput.value);
    const lon = parseFloat(apiLonInput.value);

    let locationName = 'Coordenadas Personalizadas';
    if (apiCitySelect.value !== 'custom') {
      const idx = parseInt(apiCitySelect.value, 10);
      locationName = API_CITY_PRESETS[idx]?.name || locationName;
    }

    const srcName = actualSource === 'nasa_power' ? 'NASA POWER' : actualSource.toUpperCase();
    setStatus(isEn ? `Fetching data from ${srcName}...` : `Consultando datos climáticos desde ${srcName}...`, 'info');
    apiFetchBtn.disabled = true;

    try {
      const record = await fetchUnifiedClimateData({
        source: actualSource,
        latitude: lat,
        longitude: lon,
        locationName,
      });

      renderActiveRecord(record);
      apiSaveBtn.disabled = false;
      if (record.metadata?.pvgisEquivalent) {
        setStatus(
          isEn
            ? `✓ PVGIS Climate Data: Meteorological dataset retrieved successfully via PVGIS official ERA5 model for "${record.locationName}". Ready to calculate with Python motor.`
            : `✓ Datos climáticos oficiales PVGIS 5.3 (ERA5) obtenidos con éxito para "${record.locationName}". Listo para ejecutar en motor Python.`,
          'success'
        );
      } else {
        setStatus(
          isEn
            ? `✓ Satellite data retrieved successfully from ${srcName} for "${record.locationName}". Ready to calculate with Pyodide below.`
            : `✓ Datos satelitales obtenidos con éxito desde ${srcName} para "${record.locationName}". Listo para calcular con Pyodide en la barra inferior.`,
          'success'
        );
      }
    } catch (err: any) {
      console.error('[API Fetch Error]', err);
      setStatus(`Error al consultar API: ${err.message || String(err)}`, 'error');
    } finally {
      apiFetchBtn.disabled = false;
    }
  });

  // Save Satellite API Record to Supabase with Required [DB + Timestamp] Suffix
  apiSaveBtn?.addEventListener('click', async () => {
    if (!currentActiveRecord) return;

    apiSaveBtn.disabled = true;
    setStatus(isEn ? 'Registering dataset in Supabase...' : 'Registrando emplazamiento en Supabase...', 'info');

    try {
      const formattedName = formatEmplacementNameWithSuffix(currentActiveRecord.locationName, currentActiveRecord.source);
      const recordToSave: ClimateDataRecord = {
        ...currentActiveRecord,
        locationName: formattedName,
      };

      const reg = await climateDatabaseService.registerEmplacement(recordToSave);
      if (reg.isDuplicate) {
        setStatus(
          isEn
            ? `⚠️ Emplacement already registered (${reg.similarityPct}% match with "${reg.matchedRecord?.locationName}").`
            : `⚠️ El emplazamiento ya ha sido registrado previamente (${reg.similarityPct}% de coincidencia con "${reg.matchedRecord?.locationName}").`,
          'warning'
        );
      } else {
        renderActiveRecord(recordToSave);
        await updateSearchableStations();
        setStatus(
          isEn
            ? `✓ Emplacement "${formattedName}" successfully saved to Supabase (12 monthly records in datos_mensuales).`
            : `✓ Emplazamiento "${formattedName}" guardado con éxito en Supabase (12 registros mensuales en datos_mensuales).`,
          'success'
        );
      }
    } catch (err: any) {
      setStatus(`Error al guardar en Supabase: ${err.message || String(err)}`, 'error');
    } finally {
      apiSaveBtn.disabled = false;
    }
  });

  function setStatus(msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    statusBar.textContent = msg;
    statusBar.className = `climate-status-bar status-${type}`;
  }

  function renderActiveRecord(record: ClimateDataRecord) {
    currentActiveRecord = record;
    cachedActiveRecord = record;
    const annualG = record.monthlyGdm0.reduce((a, b) => a + b, 0) / 12;
    const annualT = record.monthlyTemperature.reduce((a, b) => a + b, 0) / 12;

    const countryTag = record.country && typeof record.country === 'string' && record.country.trim() && !record.locationName.includes(record.country)
      ? ` (${record.country})`
      : '';

    activeCard.innerHTML = `
      <div class="active-record-badge-bar">
        <div class="record-title-box">
          <h4>${record.locationName}${countryTag}</h4>
          <span class="badge badge-source">${record.source.toUpperCase()}</span>
          ${record.metadata?.pvgisEquivalent ? `<span class="badge badge-warning" title="Base satelital ERA5 (Reanálisis oficial de PVGIS)">ERA5 PVGIS</span>` : ''}
          ${record.metadata?.rawFormat ? `<span class="badge badge-neutral">${record.metadata.rawFormat}</span>` : ''}
        </div>
        <div class="record-meta-pills">
          <span><strong>${t.location.latitude}:</strong> ${record.latitude.toFixed(3)}°</span>
          <span><strong>${t.location.longitude}:</strong> ${record.longitude.toFixed(3)}°</span>
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

  // 1. Historical & Supabase Station Live Similarity Search Actions
  let allSearchableStations: ClimateDataRecord[] = [];

  const getBaseKey = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/_?versionoriginal/gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();

  const updateSearchableStations = async () => {
    const isOnline = Boolean(typeof navigator !== 'undefined' ? navigator.onLine : true) && climateDatabaseService.isOnline();
    const historicalList = hybridClimateManager.getHistoricalLocations();

    if (!isOnline) {
      // OFFLINE: Solo mostrar estaciones de la memoria caché local (OrientSol 3.0)
      allSearchableStations = historicalList.map((h) => ({
        ...h,
        source: 'local_database' as const,
      }));
      return;
    }

    // ONLINE: Solo debe aparecer una por ciudad (prioridad máxima a Supabase)
    let supabaseList: ClimateDataRecord[] = [];
    try {
      supabaseList = await climateDatabaseService.getClimateDatasets();
    } catch (e) {
      console.warn('[OrientSol] Could not fetch Supabase datasets for search:', e);
    }

    const seenBaseKeys = new Set<string>();
    const merged: ClimateDataRecord[] = [];

    // 1. Agregar registros de Supabase (máxima prioridad online)
    for (const rec of supabaseList) {
      const baseKey = getBaseKey(rec.locationName);
      if (!seenBaseKeys.has(baseKey)) {
        seenBaseKeys.add(baseKey);
        merged.push(rec);
      }
    }

    // 2. Solo agregar de la caché histórica aquellas ciudades que NO existan en Supabase
    for (const rec of historicalList) {
      const baseKey = getBaseKey(rec.locationName);
      if (!seenBaseKeys.has(baseKey)) {
        seenBaseKeys.add(baseKey);
        merged.push(rec);
      }
    }

    allSearchableStations = merged;
  };

  // Pre-load and re-sync on network state changes & database updates
  updateSearchableStations();
  climateDatabaseService.subscribe(() => {
    updateSearchableStations().then(() => {
      if (histSearchInput && histSearchInput.value.trim()) {
        performSearch(histSearchInput.value.trim());
      }
    });
  });
  window.addEventListener('online', () => {
    updateSearchableStations().then(() => {
      if (histSearchInput && histSearchInput.value.trim()) {
        performSearch(histSearchInput.value.trim());
      }
    });
  });
  window.addEventListener('offline', () => {
    updateSearchableStations().then(() => {
      if (histSearchInput && histSearchInput.value.trim()) {
        performSearch(histSearchInput.value.trim());
      }
    });
  });

  function showNotFoundBanner(queryText: string) {
    histSuggestionsDropdown.classList.add('hidden');
    histNotFoundBanner.innerHTML = `
      <div class="search-alert-box alert-warning-box">
        <div class="alert-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f59e0b" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="alert-content-wrap">
          <p class="alert-text-msg">
            ${isEn
              ? `The location "<strong>${queryText}</strong>" is not saved in cache or in the database. If you wish, please fill in the manual entry.`
              : `El emplazamiento "<strong>${queryText}</strong>" no está guardado ni en caché ni en la base de datos. Si deseas, llena la introducción manual.`}
          </p>
          <button type="button" id="btn-goto-manual-tab" class="btn btn-secondary btn-sm" style="margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            <span>✍️ ${isEn ? 'Go to Manual Entry (Tab 2)' : 'Llenar Introducción Manual (Pestaña 2)'}</span>
          </button>
        </div>
      </div>
    `;
    histNotFoundBanner.classList.remove('hidden');

    const gotoBtn = histNotFoundBanner.querySelector<HTMLButtonElement>('#btn-goto-manual-tab');
    gotoBtn?.addEventListener('click', () => {
      const manualTabBtn = container.querySelector<HTMLButtonElement>('.dual-tab-btn[data-tab="manual"]');
      manualTabBtn?.click();
      if (manualName && queryText) {
        manualName.value = queryText;
      }
    });
  }

  function hideNotFoundBanner() {
    histNotFoundBanner.classList.add('hidden');
    histNotFoundBanner.innerHTML = '';
  }

  function selectLocation(loc: ClimateDataRecord) {
    histSearchInput.value = loc.locationName;
    histSuggestionsDropdown.classList.add('hidden');
    hideNotFoundBanner();
    renderActiveRecord(loc);
    const sourceTag = loc.source === 'supabase' || (Boolean(loc.id) && loc.id!.startsWith('supabase-')) ? 'SUPABASE' : 'ORIENTSOL 3.0';
    setStatus(
      isEn
        ? `Loaded station: ${loc.locationName} (${loc.country}) [${sourceTag}].`
        : `Cargada estación: ${loc.locationName} (${loc.country}) [${sourceTag}].`,
      'success'
    );
  }

  function performSearch(queryText: string) {
    const q = queryText.trim().toLowerCase();
    if (!q) {
      histSuggestionsDropdown.classList.add('hidden');
      hideNotFoundBanner();
      return;
    }

    // Filter case-insensitive similarity
    const rawMatches = allSearchableStations.filter((s) => {
      const name = s.locationName.toLowerCase();
      const country = (s.country || '').toLowerCase();
      return name.includes(q) || country.includes(q);
    });

    // Deduplicate matches so that only 1 station per city is displayed
    const seenMatchKeys = new Set<string>();
    const matches: ClimateDataRecord[] = [];
    for (const m of rawMatches) {
      const key = getBaseKey(m.locationName);
      if (!seenMatchKeys.has(key)) {
        seenMatchKeys.add(key);
        matches.push(m);
      }
    }

    if (matches.length > 0) {
      hideNotFoundBanner();
      histSuggestionsDropdown.innerHTML = `
        <div class="suggestions-header">
          <span>${isEn ? 'Similarities Found' : 'Similitudes Halladas'}: <strong>${matches.length}</strong></span>
          <span class="suggestions-hint">${isEn ? 'Click to select' : 'Haz clic para seleccionar'}</span>
        </div>
        <div class="suggestions-list">
          ${matches
            .map((m) => {
              const isSupabase = m.source === 'supabase' || (Boolean(m.id) && m.id!.startsWith('supabase-'));
              const badgeClass = isSupabase ? 'badge-supabase' : 'badge-historical';
              const badgeText = isSupabase ? 'SUPABASE' : 'ORIENTSOL 3.0';
              const annualG = m.monthlyGdm0.reduce((a, b) => a + b, 0) / 12;
              return `
                <div class="suggestion-item" data-id="${m.id || m.locationName}" role="option">
                  <div class="suggestion-main">
                    <span class="suggestion-name"><strong>${m.locationName}</strong></span>
                    <span class="suggestion-country">(${m.country})</span>
                    <span class="suggestion-pill ${badgeClass}">${badgeText}</span>
                  </div>
                  <div class="suggestion-meta">
                    <span>Lat: ${m.latitude.toFixed(2)}°</span>
                    <span>Lon: ${m.longitude.toFixed(2)}°</span>
                    <span>G<sub>dm</sub>(0): ${annualG.toFixed(2)} kWh/m²/d</span>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
      histSuggestionsDropdown.classList.remove('hidden');

      histSuggestionsDropdown.querySelectorAll<HTMLElement>('.suggestion-item').forEach((item) => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          const found = allSearchableStations.find((s) => s.id === id || s.locationName === id);
          if (found) {
            selectLocation(found);
          }
        });
      });
    } else {
      // No similarities found!
      showNotFoundBanner(queryText.trim());
    }
  }

  // Input event: case-insensitive only letters in Spanish/English
  histSearchInput.addEventListener('input', (e) => {
    const inp = e.target as HTMLInputElement;
    const raw = inp.value;
    // Allow only Spanish/English letters (a-z, A-Z, áéíóúüñ ÁÉÍÓÚÜÑ) and whitespace
    const sanitized = raw.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    if (sanitized !== raw) {
      inp.value = sanitized;
    }
    performSearch(sanitized);
  });

  const handleSaveOrSelectAction = () => {
    const raw = histSearchInput.value.trim();
    const q = raw.toLowerCase();
    if (!q) {
      return;
    }

    // Strict matching check
    const exact = allSearchableStations.find((s) => s.locationName.trim().toLowerCase() === q);
    const partial = !exact && allSearchableStations.find((s) => s.locationName.trim().toLowerCase().startsWith(q));
    const toSelect = exact || partial;

    if (!toSelect) {
      // EN CASO DE NO HALLARLO:
      // ASI PONGAS ENTER PARA GUARDAR NO DEBE DEJARTE HACER ABSOLUTAMENTE NADA.
      // SOLO MOSTRARTE EL MENSAJE DE QUE EL EMPLAZAMIENTO NO ESTA GUARDADO NI EN CACHE NI EN LA BASE DE DATOS Y QUE SI DESEAS LLENA LA INTRODUCCION MANUAL.
      showNotFoundBanner(raw);
      histSearchInput.classList.add('input-error-shake');
      setTimeout(() => histSearchInput.classList.remove('input-error-shake'), 600);
      return;
    }

    // Found: load and select
    selectLocation(toSelect);
  };

  histSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSaveOrSelectAction();
    }
  });

  useHistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSaveOrSelectAction();
  });

  // Close suggestions if user clicks outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      histSuggestionsDropdown.classList.add('hidden');
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

  validateManualBtn.addEventListener('click', async () => {
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

      // Register in Supabase (Online auto-insert or Offline queue with >=90% duplicate detection)
      const reg = await climateDatabaseService.registerEmplacement(rec);
      if (reg.isDuplicate) {
        setStatus(
          isEn
            ? `⚠️ Emplacement already registered (${reg.similarityPct}% data match with "${reg.matchedRecord?.locationName}").`
            : `⚠️ El emplazamiento ya ha sido registrado previamente (${reg.similarityPct}% de coincidencia en datos ingresados con "${reg.matchedRecord?.locationName}").`,
          'warning'
        );
      } else {
        const uploadPermissionStatus = reg.isOffline
          ? (isEn ? '🔴 Online upload NOT permitted (Offline Mode) → Emplacement safely stored in local cache.' : '🔴 Carga Online a Supabase: NO PERMITIDA (Modo Offline) → Emplazamiento guardado en caché local para sincronizarlo después.')
          : (isEn ? '🟢 Online upload PERMITTED → Emplacement successfully inserted into datos_mensuales.' : '🟢 Carga Online a Supabase: PERMITIDA → Emplazamiento registrado exitosamente en la tabla datos_mensuales.');
        setStatus(`${uploadPermissionStatus} ${reg.message}`, 'success');
      }
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
      .then(async ({ record, records }) => {
        renderActiveRecord(record);

        const listToRegister = records && records.length > 0 ? records : [record];
        let dupsCount = 0;
        let newCount = 0;

        for (const item of listToRegister) {
          const reg = await climateDatabaseService.registerEmplacement(item);
          if (reg.isDuplicate) dupsCount++;
          else newCount++;
        }

        // Refresh searchable stations so imported locations are immediately searchable
        updateSearchableStations();

        if (listToRegister.length > 1) {
          setStatus(
            isEn
              ? `Batch file loaded: ${listToRegister.length} locations imported (${newCount} new, ${dupsCount} already registered).`
              : `Archivo de lote cargado: ${listToRegister.length} emplazamientos importados (${newCount} nuevos, ${dupsCount} ya registrados).`,
            newCount > 0 ? 'success' : 'warning'
          );
        } else {
          const reg = await climateDatabaseService.registerEmplacement(record);
          if (reg.isDuplicate) {
            setStatus(
              isEn
                ? `⚠️ File loaded, but emplacement was already registered (${reg.similarityPct}% data match with "${reg.matchedRecord?.locationName}").`
                : `⚠️ Archivo cargado, pero el emplazamiento ya estaba registrado (${reg.similarityPct}% de coincidencia con "${reg.matchedRecord?.locationName}").`,
              'warning'
            );
          } else {
            const uploadPermissionStatus = reg.isOffline
              ? (isEn ? '🔴 Online upload NOT permitted (Offline Mode) → Saved in local cache.' : '🔴 Carga Online a Supabase: NO PERMITIDA (Modo Offline) → Guardado en caché local.')
              : (isEn ? '🟢 Online upload PERMITTED → Emplacement inserted into datos_mensuales.' : '🟢 Carga Online a Supabase: PERMITIDA → Emplazamiento registrado en datos_mensuales.');
            setStatus(`${uploadPermissionStatus} ${reg.message}`, 'success');
          }
        }
      })
      .catch((err: any) => {
        console.error('[Upload Error]', err);
        setStatus(`Error de lectura: ${err.message}`, 'error');
      });
  }

  // Subscribe to Supabase connection state changes to keep online upload banners updated
  climateDatabaseService.subscribe(() => {
    const box1 = container.querySelector('#manual-upload-permission-box');
    const box2 = container.querySelector('#file-upload-permission-box');
    const bannerHtml = renderSupabaseUploadBannerHtml(isEn);
    if (box1) box1.innerHTML = bannerHtml;
    if (box2) box2.innerHTML = bannerHtml;
  });

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
    const csv = generateSampleCSV(false);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_climatica_individual_orientsol.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  downloadCsvMultiBtn?.addEventListener('click', () => {
    const csv = generateSampleCSV(true);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_lote_multi_emplazamientos.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  downloadJsonBtn.addEventListener('click', () => {
    const json = generateSampleJSON(false);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_climatica_individual_orientsol.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  downloadJsonMultiBtn?.addEventListener('click', () => {
    const json = generateSampleJSON(true);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_lote_multi_emplazamientos.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // 4. Run Pyodide Simulation Bridge
  simBtn.addEventListener('click', async () => {
    if (!currentActiveRecord) {
      setStatus(isEn ? 'No active climate dataset available.' : 'No hay dataset meteorológico activo.', 'error');
      return;
    }

    const peakKw = parseFloat(simPeakKw.value) || solarSyncState.getPeakPowerKw();
    const pr = parseFloat(simPr.value) || 0.80;
    const albedo = parseFloat(simAlbedo.value) || 0.20;
    const tonc = parseFloat(simTonc?.value) || solarSyncState.getTonc();

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
        tonc,
      });

      const result = await executeSolarSimulationFromClimateData(params);
      const elapsed = Math.round(performance.now() - startTime);

      cachedLastSimulationResult = result;
      cachedActiveRecord = currentActiveRecord;

      setStatus(
        isEn
          ? `✓ Simulation completed in ${elapsed}ms via Python WebAssembly engine.`
          : `✓ Simulación finalizada en ${elapsed}ms con el motor Python en WebAssembly.`,
        'success'
      );
      renderResults(result, true);
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

  function renderResults(res: SolarBridgeSimulationResult, shouldScroll: boolean = false) {
    resultsContainer.classList.remove('hidden');

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
          <span class="temp-stat-sub">${isEn ? `NOCT / TONC ${(parseFloat(simTonc?.value) || 47.0).toFixed(1)}°C Model (Max: ${res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1)}°C)` : `Modelo TONC ${(parseFloat(simTonc?.value) || 47.0).toFixed(1)}°C (Máx: ${res.temperatures.cellOperating.maxCellTempOptimalC.toFixed(1)}°C)`}</span>
        </div>
      </div>

      <!-- 2. GRÁFICOS VISUALES INTERACTIVOS (SVG) -->
      <div id="app-solar-charts" class="results-charts-section">
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

      <!-- 2. SELECTOR DE OPERACIÓN / ESTUDIO (ORIENTSOL 3.0) -->
      <div class="operation-selector-container">
        <div class="operation-selector-header">
          <label for="study-operation-select" class="operation-selector-label">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span>${isEn ? 'Solar Operation & Study Mode:' : 'Operación & Estudio Solar a visualizar:'}</span>
          </label>
          <span class="operation-selector-hint">
            ${isEn
              ? 'Select an optimization or tracking model to view its detailed calculation table, graphics, and energy analysis.'
              : 'Seleccione el modelo de optimización o seguimiento para ver su tabla de cálculo detallada, gráficas y balance energético.'}
          </span>
        </div>
        <div class="operation-dropdown-wrap">
          <select id="study-operation-select" class="form-select operation-dropdown-select">
            <option value="annual" ${cachedActiveStudyOp === 'annual' ? 'selected' : ''}>
              ${isEn ? '1. Annual optimal tilt' : '1. Inclinación óptima anual'}
            </option>
            <option value="monthly" ${cachedActiveStudyOp === 'monthly' ? 'selected' : ''}>
              ${isEn ? '2. Monthly optimization (12 independent positions)' : '2. Optimización mensual (12 posiciones independientes)'}
            </option>
            <option value="seasonal" ${cachedActiveStudyOp === 'seasonal' ? 'selected' : ''}>
              ${isEn ? '3. Seasonal optimal tilt' : '3. Inclinación óptima estacional'}
            </option>
            <option value="polar" ${cachedActiveStudyOp === 'polar' ? 'selected' : ''}>
              ${isEn ? '4. Single-axis polar tracking' : '4. Seg. 1 eje polar'}
            </option>
            <option value="azimuthal" ${cachedActiveStudyOp === 'azimuthal' ? 'selected' : ''}>
              ${isEn ? '5. Single-axis azimuthal tracking' : '5. Seg. 1 eje azimutal'}
            </option>
            <option value="horizontal" ${cachedActiveStudyOp === 'horizontal' ? 'selected' : ''}>
              ${isEn ? '6. Single-axis horizontal tracking' : '6. Seg. 1 eje horizontal'}
            </option>
            <option value="dual" ${cachedActiveStudyOp === 'dual' ? 'selected' : ''}>
              ${isEn ? '7. Two-axis tracking' : '7. Seg. a dos ejes'}
            </option>
            <option value="comparative" ${cachedActiveStudyOp === 'comparative' ? 'selected' : ''}>
              ${isEn ? '8. Comparative study of all models' : '8. Comparativa de todos los tipos de estudios'}
            </option>
          </select>
        </div>
      </div>

      <!-- Mount point for Active Solar Study Operation -->
      <div id="active-study-mount-point"></div>

      <!-- 3. BALANCE ENERGÉTICO: ENERGÍA RECIBIDA VS ENERGÍA PRODUCIDA -->
      <div class="result-card wide-card" style="margin-bottom: 1.25rem;">
        <div class="result-card-header">
          <h4>${t.results.energyBalanceTitle}</h4>
          <span id="energy-balance-header-badge" class="badge badge-neutral">${simPeakKw.value} kWp | PR=${(parseFloat(simPr.value) * 100).toFixed(0)}%</span>
        </div>
        <div class="energy-models-grid">
          <div class="energy-box">
            <span class="energy-title">${t.results.solarReceivedTitle}</span>
            <div id="solar-received-annual-val" class="energy-val-large" style="color: #fbbf24;">
              ${Math.round(res.energyYield.recibida.annualTotalKwh).toLocaleString()} <small>kWh/${isEn ? 'yr' : 'año'}</small>
            </div>
            <div class="energy-details" style="display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
              <span>${t.results.collectorArea}</span>
              <div style="display: inline-flex; align-items: center; gap: 6px;">
                <input
                  type="number"
                  id="input-collector-area-interactive"
                  class="form-input form-input-sm"
                  style="width: 78px; text-align: right; padding: 2px 6px; font-weight: 700; height: 28px; border-radius: 4px; border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); cursor: not-allowed;"
                  value="${(res.energyYield.collectorAreaM2 ?? 25.0).toFixed(1)}"
                  min="0.1"
                  step="0.5"
                  disabled
                />
                <strong>m²</strong>
                <button
                  type="button"
                  id="btn-edit-save-area"
                  class="btn btn-sm"
                  style="padding: 2px 10px; font-size: 0.78rem; font-weight: 600; height: 28px; border-radius: 4px; background: #0284c7; color: #ffffff; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;"
                  title="${isEn ? 'Edit / Save & Calculate Area' : 'Editar / Guardar y Calcular Metraje'}"
                >
                  <span id="btn-edit-save-area-label">${isEn ? 'Edit' : 'Editar'}</span>
                </button>
              </div>
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
            <div id="solar-produced-annual-val" class="energy-val-large" style="color: #34d399;">
              ${Math.round(res.energyYield.producida.osterwald.annualKwh ?? 0).toLocaleString()} <small>kWh/${isEn ? 'yr' : 'año'}</small>
            </div>
            <div class="energy-details">
              <span>${t.results.osterwaldModel}</span>
              <strong>${(res.energyYield.producida.osterwald.specificYieldKwhKwp ?? 0).toFixed(0)} kWh/kWp</strong>
            </div>
            <div class="energy-details">
              <span>${t.results.cellThermalLosses}</span>
              <strong id="solar-thermal-losses-val" style="color: #f87171;">-${Math.abs(res.energyYield.producida.osterwald.thermalLossKwh ?? 0).toFixed(0)} kWh (-${Math.abs(res.energyYield.producida.osterwald.thermalLossPct ?? 0).toFixed(2)}%)</strong>
            </div>
            <div class="energy-row-track">
              <span>${t.results.simplifiedModel}</span>
              <strong id="solar-produced-simplified-val">${Math.round(res.energyYield.producida.simplified.annualKwh ?? 0).toLocaleString()} kWh/${isEn ? 'yr' : 'año'}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. COMPARATIVA GLOBAL DE SUPERFICIES (8 TOPOLOGÍAS COMPLETAS) -->
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
                  <td><strong>${getSurfaceDisplayName(surf, isEn)}</strong></td>
                  <td><span class="category-badge ${getBadgeClass(surf.category)}">${getCategoryBadge(surf.category, isEn)}</span></td>
                  <td>${(surf.meanDailyKwhM2 ?? 0).toFixed(3)} kWh/m²/d</td>
                  <td>${Math.round(surf.annualRadiationKwhM2 ?? 0).toLocaleString()} kWh/m²</td>
                  <td class="${(surf.gainOverHorizontalPct ?? 0) > 0 ? 'text-gain' : ''}">
                    ${(surf.gainOverHorizontalPct ?? 0) >= 0 ? '+' : ''}${(surf.gainOverHorizontalPct ?? 0).toFixed(2)}%
                  </td>
                  <td class="${(surf.gainOverAnnualFixedPct ?? 0) > 0 ? 'text-gain' : ''}">
                    ${(surf.gainOverAnnualFixedPct ?? 0) >= 0 ? '+' : ''}${(surf.gainOverAnnualFixedPct ?? 0).toFixed(2)}%
                  </td>
                  <td class="cell-val-osterwald">
                    ${Math.round(surf.energyProducedOsterwaldKwhYear ?? 0).toLocaleString()} kWh/${isEn ? 'yr' : 'año'}
                  </td>
                  <td class="cell-val-temp">
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

    const currentPeakKw = parseFloat(simPeakKw.value) || solarSyncState.getPeakPowerKw();

    // Dynamic Study Operation Mount Manager (Prevents Endless HTML)
    const mountStudyOperation = (op: typeof cachedActiveStudyOp) => {
      cachedActiveStudyOp = op;
      const mountPoint = resultsContainer.querySelector<HTMLDivElement>('#active-study-mount-point');
      if (!mountPoint) return;
      mountPoint.innerHTML = '';

      if (op === 'annual') {
        const p = renderOptimalAnnualStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
          onExit: () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
        });
        mountPoint.appendChild(p);
      } else if (op === 'monthly') {
        const p = renderOptimalMonthlyStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
          onExit: () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
        });
        mountPoint.appendChild(p);
      } else if (op === 'seasonal') {
        const p = renderOptimalSeasonalStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
        });
        mountPoint.appendChild(p);
      } else if (op === 'polar') {
        const p = renderTrackingPolarStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        });
        mountPoint.appendChild(p);
      } else if (op === 'azimuthal') {
        const p = renderTrackingAzimuthalStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        });
        mountPoint.appendChild(p);
      } else if (op === 'horizontal') {
        const p = renderTrackingHorizontalStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        });
        mountPoint.appendChild(p);
      } else if (op === 'dual') {
        const p = renderTrackingDualAxisStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          peakPowerKw: currentPeakKw,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        });
        mountPoint.appendChild(p);
      } else if (op === 'comparative') {
        const p = renderComparativeStudyPanel({
          simulationResult: res,
          locationName: res.locationName,
          latitude: res.latitude,
          onBack: () => {
            resultsContainer.querySelector('.operation-selector-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        });
        mountPoint.appendChild(p);
      }
    };

    mountStudyOperation(cachedActiveStudyOp);

    // Wire operation dropdown select change
    const opSelect = resultsContainer.querySelector<HTMLSelectElement>('#study-operation-select');
    opSelect?.addEventListener('change', () => {
      const targetOp = (opSelect.value || 'annual') as typeof cachedActiveStudyOp;
      mountStudyOperation(targetOp);
    });

    // Wire Interactive Collector Area Input & Edit/Save Button
    const areaInput = resultsContainer.querySelector<HTMLInputElement>('#input-collector-area-interactive');
    const btnEditSave = resultsContainer.querySelector<HTMLButtonElement>('#btn-edit-save-area');
    const labelEditSave = resultsContainer.querySelector<HTMLSpanElement>('#btn-edit-save-area-label');

    const baseArea = res.energyYield?.collectorAreaM2 ?? 25.0;
    const baseRecibida = res.energyYield?.recibida?.annualTotalKwh ?? 45166;
    const baseOsterwald = res.energyYield?.producida?.osterwald?.annualKwh ?? 7265;
    const baseSimp = res.energyYield?.producida?.simplified?.annualKwh ?? 7215;
    const baseTherm = res.energyYield?.producida?.osterwald?.thermalLossKwh ?? -38;
    const baseThermPct = Math.abs(res.energyYield?.producida?.osterwald?.thermalLossPct ?? 0.53);
    const basePotKw = parseFloat(simPeakKw.value) || 5.0;
    const prPct = (parseFloat(simPr.value) * 100).toFixed(0);
    const unitRadM2 = res.energyYield?.recibida?.annualKwhM2 ?? (baseArea > 0 ? baseRecibida / baseArea : 1806.6);

    const applyAreaRecalculation = (newArea: number) => {
      if (newArea <= 0 || isNaN(newArea)) return;
      const ratio = baseArea > 0 ? newArea / baseArea : 1.0;
      const newRecibida = Math.round(newArea * unitRadM2);
      const newOsterwald = Math.round(baseOsterwald * ratio);
      const newSimp = Math.round(baseSimp * ratio);
      const newTherm = Math.round(baseTherm * ratio);
      const newPotKw = (basePotKw * ratio).toFixed(1);

      // 1. Update Energía Solar Recibida
      const elRecibida = resultsContainer.querySelector<HTMLElement>('#solar-received-annual-val');
      if (elRecibida) {
        elRecibida.innerHTML = `${newRecibida.toLocaleString()} <small>kWh/${isEn ? 'yr' : 'año'}</small>`;
      }

      // 2. Update Energía Solar Producida (Osterwald)
      const elProducida = resultsContainer.querySelector<HTMLElement>('#solar-produced-annual-val');
      if (elProducida) {
        elProducida.innerHTML = `${newOsterwald.toLocaleString()} <small>kWh/${isEn ? 'yr' : 'año'}</small>`;
      }

      // 3. Update Modelo Simplificado
      const elSimp = resultsContainer.querySelector<HTMLElement>('#solar-produced-simplified-val');
      if (elSimp) {
        elSimp.innerHTML = `${newSimp.toLocaleString()} kWh/${isEn ? 'yr' : 'año'}`;
      }

      // 4. Update Pérdidas Térmicas Célula
      const elTherm = resultsContainer.querySelector<HTMLElement>('#solar-thermal-losses-val');
      if (elTherm) {
        elTherm.innerHTML = `-${Math.abs(newTherm).toFixed(0)} kWh (-${baseThermPct.toFixed(2)}%)`;
      }

      // 5. Update Header Badge (Potencia Pico equivalente)
      const elBadge = resultsContainer.querySelector<HTMLElement>('#energy-balance-header-badge');
      if (elBadge) {
        elBadge.textContent = `${newPotKw} kWp | PR=${prPct}%`;
      }

      // 6. Persist changes in res.energyYield
      if (res.energyYield) {
        res.energyYield.collectorAreaM2 = newArea;
        if (res.energyYield.recibida) {
          res.energyYield.recibida.annualTotalKwh = newRecibida;
        }
        if (res.energyYield.producida?.osterwald) {
          res.energyYield.producida.osterwald.annualKwh = newOsterwald;
          res.energyYield.producida.osterwald.thermalLossKwh = newTherm;
        }
        if (res.energyYield.producida?.simplified) {
          res.energyYield.producida.simplified.annualKwh = newSimp;
        }
      }
    };

    let isEditingArea = false;
    btnEditSave?.addEventListener('click', () => {
      if (!isEditingArea) {
        // Switch to Edit Mode
        isEditingArea = true;
        if (areaInput) {
          areaInput.disabled = false;
          areaInput.style.cursor = 'text';
          areaInput.style.borderColor = '#0284c7';
          areaInput.style.background = 'rgba(2, 132, 199, 0.08)';
          areaInput.focus();
          areaInput.select();
        }
        if (btnEditSave) {
          btnEditSave.style.background = '#059669'; // Emerald Save
        }
        if (labelEditSave) {
          labelEditSave.textContent = isEn ? 'Save & Calculate' : 'Guardar y Calcular';
        }
      } else {
        // Save and Calculate
        isEditingArea = false;
        const enteredVal = parseFloat(areaInput?.value || '') || baseArea;
        if (areaInput) {
          areaInput.disabled = true;
          areaInput.style.cursor = 'not-allowed';
          areaInput.style.borderColor = 'var(--border-subtle)';
          areaInput.style.background = 'var(--bg-card)';
          areaInput.value = enteredVal.toFixed(1);
        }
        if (btnEditSave) {
          btnEditSave.style.background = '#0284c7'; // Primary Blue
        }
        if (labelEditSave) {
          labelEditSave.textContent = isEn ? 'Edit' : 'Editar';
        }
        applyAreaRecalculation(enteredVal);
      }
    });

    // Support Enter key inside input to save and calculate
    areaInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnEditSave?.click();
      }
    });

    // Real-time recalculation as user types
    areaInput?.addEventListener('input', () => {
      const liveVal = parseFloat(areaInput.value);
      if (!isNaN(liveVal) && liveVal > 0) {
        applyAreaRecalculation(liveVal);
      }
    });

    // Event Listeners for Summary Copy
    const copyBtn = resultsContainer.querySelector<HTMLButtonElement>('#btn-copy-summary');
    const copyLabel = resultsContainer.querySelector<HTMLSpanElement>('#copy-btn-label');

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

    if (shouldScroll) {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Initial render with current station
  renderActiveRecord(currentActiveRecord);

  if (cachedLastSimulationResult) {
    // If we already have simulation results computed, render them immediately in the selected language!
    renderResults(cachedLastSimulationResult, false);
  } else {
    // Auto-run simulation ONLY ONCE when Pyodide runtime is ready if results have not yet been produced
    const autoUnsub = pyodideService.subscribe((state) => {
      if (state.status === 'ready' && !cachedLastSimulationResult) {
        setTimeout(() => {
          if (!cachedLastSimulationResult) {
            console.log('[OrientSol] Auto-triggering initial simulation for immediate full results');
            simBtn.click();
          }
        }, 150);
        autoUnsub();
      }
    });
  }

  return container;
}
