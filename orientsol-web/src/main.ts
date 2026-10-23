import './style.css';
import 'katex/dist/katex.min.css';
import {
  renderHeader,
  renderStatusBar,
  renderDualClimateLoaderPanel,
  renderPythonConsole,
  renderArchitectureOverview,
  renderCookieBanner,
} from '@/components';
import { pyodideService } from '@/services/pyodide';
import { i18n } from '@/i18n';
import { registerServiceWorker } from '@/sw-register';
import ujaLogo from '@/assets/uja-logo.png';
import ujaShield from '@/assets/uja-shield.png';

function renderAboutView(isEn: boolean): HTMLElement {
  const container = document.createElement('section');
  container.className = 'panel-card about-view-panel';
  container.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div>
        <h3 class="panel-title">${isEn ? 'About OrientSol 4.0 & Academic Project' : 'Acerca de OrientSol 4.0 & Proyecto Académico'}</h3>
        <p class="panel-desc">${isEn ? 'Master Thesis in Renewable Energies — University of Jaén' : 'Trabajo Fin de Máster en Energías Renovables — Universidad de Jaén'}</p>
      </div>
    </div>

    <!-- Institutional UJA Banner with Official Logos -->
    <div class="about-institution-banner">
      <div class="about-institution-content">
        <a href="https://www.ujaen.es" target="_blank" rel="noopener noreferrer" class="about-uja-logo-box" title="${isEn ? 'Visit University of Jaén website' : 'Visitar portal oficial de la Universidad de Jaén'}">
          <img src="${ujaLogo}" alt="Universidad de Jaén" class="about-uja-logo-img" />
        </a>
        <div class="about-institution-text">
          <h4>${isEn ? 'Universidad de Jaén (UJA) • Spain' : 'Universidad de Jaén (UJA) • España'}</h4>
          <p>${isEn ? "Master's Degree in Renewable Energy • Department of Electronic and Automatic Engineering" : 'Máster Universitario en Energías Renovables • Departamento de Ingeniería Electrónica y Automática'}</p>
          <div class="about-institution-tags">
            <span class="badge badge-source">EPS Jaén</span>
            <span class="badge badge-primary">TFM 2026</span>
            <span class="badge badge-success">${isEn ? 'Open-Source Academic Software' : 'Software Académico de Código Abierto'}</span>
          </div>
        </div>
      </div>
      <div class="about-institution-shield-box">
        <img src="${ujaShield}" alt="Escudo Oficial UJA" class="about-uja-shield-img" />
      </div>
    </div>

    <div class="about-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-top: 1.25rem;">
      <div class="result-card highlight-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <h4 style="margin: 0; color: var(--solar-amber);">${isEn ? 'Academic Framework (TFM)' : 'Marco Académico (TFM)'}</h4>
            <img src="${ujaShield}" alt="UJA" style="height: 32px; width: auto; object-fit: contain;" />
          </div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; padding: 0;">
            <li><strong>${isEn ? 'Institution' : 'Institución'}:</strong> Universidad de Jaén (UJA)</li>
            <li><strong>${isEn ? 'Degree' : 'Titulación'}:</strong> ${isEn ? "Master's Degree in Renewable Energy" : 'Máster Universitario en Energías Renovables'}</li>
            <li><strong>${isEn ? 'Title' : 'Título'}:</strong> ${isEn ? 'Development of a software environment for position and motion optimization of solar radiation receiving surfaces in a photovoltaic system' : 'Desarrollo de un entorno software para optimización de posición y movimiento de superficies receptoras de radiación solar en un sistema fotovoltaico'}</li>
            <li><strong>${isEn ? 'Student' : 'Alumna'}:</strong> Karina Milagros Baldeón Zárate</li>
            <li><strong>${isEn ? 'Supervisors' : 'Directores'}:</strong> Dr. Leocadio Hontoria García &amp; Dra. Catalina Rus Casas</li>
            <li><strong>${isEn ? 'Department' : 'Departamento'}:</strong> ${isEn ? 'Electronic and Automatic Engineering' : 'Ingeniería Electrónica y Automática'}</li>
          </ul>
        </div>
      </div>

      <div class="result-card">
        <h4 style="margin-bottom: 0.75rem; color: var(--accent-cyan);">${isEn ? 'Scientific Modernization from MATLAB (.m)' : 'Modernización Científica desde MATLAB (.m)'}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0.75rem;">
          ${isEn 
            ? 'OrientSol 4.0 is the complete web reimagining of the original desktop software developed in MATLAB/GUIDE (.m and .fig). All core solar geometry equations, radiation transposition, single and dual-axis tracking, and Osterwald cell thermal models now run client-side via WebAssembly (Pyodide + NumPy).'
            : 'OrientSol 4.0 es la evolución moderna en entorno web del software original desarrollado en MATLAB/GUIDE (.m y .fig). Toda la geometría solar, transposición de radiación difusa y directa, seguimiento a 1 y 2 ejes y el modelo energético de Osterwald se ejecutan en el cliente mediante WebAssembly (Pyodide + NumPy).'}
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-success">Vite + TypeScript</span>
          <span class="badge badge-neutral">NumPy 2.4.6 WASM</span>
          <span class="badge badge-source">${isEn ? 'Multiplatform Web/Win/Android' : 'Multiplataforma Web/Win/Android'}</span>
        </div>
      </div>
    </div>

    <!-- Bases de Datos Climáticas, Frecuencia de Actualización, Diferencias y Referencias -->
    <div id="meteorological-databases-card" class="result-card wide-card" style="margin-top: 1.25rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan, #0284c7);">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          <h4 style="margin: 0; color: var(--text-main);">
            ${isEn ? 'Meteorological & Radiative Databases: Update Frequency, Scientific Differences & Official URLs' : 'Bases de Datos Climáticas y Radiativas: Periodicidad de Actualización, Diferencias Científicas y URLs'}
          </h4>
        </div>
        <span class="badge badge-primary" style="font-size: 0.72rem; padding: 0.25rem 0.6rem;">
          ${isEn ? 'Scientific Data Providers' : 'Proveedores Científicos Homologados'}
        </span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 1rem; line-height: 1.5;">
        ${isEn
          ? 'OrientSol 4.0 connects to international meteorological databases and satellite APIs to extract incident solar radiation Gdm(0) and ambient temperatures. Below is the technical specification, methodological differences, official portal and API URLs for each provider:'
          : 'OrientSol 4.0 permite extraer y evaluar radiación solar incidente Gdm(0) y temperaturas ambientales desde bases de datos meteorológicas homologadas y APIs satelitales. A continuación se detallan sus diferencias metodológicas, cadencia de actualización, enlaces a sus portales y APIs oficiales:'}
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
        <!-- BD 1: PVGIS (Comisión Europea JRC) -->
        <div style="background: var(--bg-card); padding: 1.1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
              <div>
                <strong style="color: var(--text-main); font-size: 0.92rem; display: block;">${isEn ? 'PVGIS (European Commission - JRC)' : 'PVGIS (Comisión Europea - JRC)'}</strong>
                <span style="font-size: 0.72rem; color: #0284c7; font-weight: 600;">SARAH-3 / ERA5 Climatology</span>
              </div>
              <span class="badge badge-primary" style="font-size: 0.68rem; white-space: nowrap;">${isEn ? 'Monthly / 2-3 yrs (v5.x)' : 'Mensual / 2-3 años (v5.x)'}</span>
            </div>

            <!-- Direct URLs -->
            <div style="background: var(--bg-primary); padding: 0.45rem 0.65rem; border-radius: 4px; border: 1px solid var(--border-subtle); margin-bottom: 0.65rem; font-size: 0.72rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <div>
                <strong style="color: var(--text-main);">${isEn ? 'Official Portal:' : 'Portal Oficial:'}</strong>
                <a href="https://re.jrc.ec.europa.eu/pvg_tools/es/" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; margin-left: 0.3rem; word-break: break-all;">
                  re.jrc.ec.europa.eu/pvg_tools
                </a>
              </div>
              <div>
                <strong style="color: var(--text-main);">${isEn ? 'API Endpoint:' : 'API Endpoint:'}</strong>
                <a href="https://re.jrc.ec.europa.eu/api/v5_3/MRcalc" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; margin-left: 0.3rem; word-break: break-all;">
                  re.jrc.ec.europa.eu/api/v5_3/MRcalc
                </a>
              </div>
            </div>

            <p style="font-size: 0.77rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.5rem;">
              <strong>${isEn ? 'Key Methodological Differences:' : 'Diferencias Metodológicas Clave:'}</strong><br/>
              • <strong>${isEn ? 'Multi-Year Climatology (2005–2023):' : 'Climatología multianual (2005–2023):'}</strong> ${isEn
                ? 'Synthesizes normalized multi-decadal series (2005–2023 in PVGIS 5.3 SARAH-3, whereas previous PVGIS 5.2 covered up to 2020) from Meteosat satellites. It does not reflect a single isolated year, but the representative normative baseline for European solar engineering.'
                : 'Sintetiza series multianuales normalizadas (2005–2023 en PVGIS 5.3 con SARAH-3; la versión anterior 5.2 cubría hasta 2020) desde satélites Meteosat. No representa un año puntual, sino la base climática normativa representativa para ingeniería solar europea.'}<br/>
              • <strong>${isEn ? 'Digital Terrain Horizon:' : 'Horizonte y sombreado orográfico:'}</strong> ${isEn
                ? 'Incorporates automated terrain horizon masking (SRTM 90m DEM) to discount mountain shadows.'
                : 'Incorpora cálculo automático del perfil de horizonte y sombras orográficas (malla SRTM 90m).'}<br/>
              • <strong>${isEn ? 'Update Cadence:' : 'Cadencia de actualización:'}</strong> ${isEn
                ? 'Major algorithm releases every 2–3 years (v5.1 in 2020, v5.2 in 2022, v5.3 in 2024). Underlying ECMWF time series updated monthly.'
                : 'Versiones mayores cada 2–3 años (v5.1 en 2020, v5.2 en 2022, v5.3 en 2024 ampliando cobertura a 2023). Series subyacentes actualizadas mensualmente.'}
            </p>
          </div>
          <div style="font-size: 0.70rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.45rem; font-family: var(--font-mono); line-height: 1.35;">
            <strong>${isEn ? 'References:' : 'Referencias:'}</strong><br/>
            • Huld, T., et al. (2012). <em>A new solar radiation database for estimating PV performance in Europe and Africa</em>. Solar Energy, 86(6), 1803-1815.<br/>
            • Pfeifroth, U., et al. (2023). <em>Surface Radiation Data Set - Heliosat (SARAH-3)</em>. CM SAF. DOI: 10.5676/EUM_SAF_CM/SARAH/V003.
          </div>
        </div>

        <!-- BD 2: NASA POWER -->
        <div style="background: var(--bg-card); padding: 1.1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
              <div>
                <strong style="color: var(--text-main); font-size: 0.92rem; display: block;">NASA POWER (CERES / MERRA-2)</strong>
                <span style="font-size: 0.72rem; color: #d97706; font-weight: 600;">Global Satellite & Assimilated Reanalysis</span>
              </div>
              <span class="badge badge-warning" style="font-size: 0.68rem; white-space: nowrap;">${isEn ? 'Daily (NRT) / Monthly' : 'Diaria (NRT) / Mensual'}</span>
            </div>

            <!-- Direct URLs -->
            <div style="background: var(--bg-primary); padding: 0.45rem 0.65rem; border-radius: 4px; border: 1px solid var(--border-subtle); margin-bottom: 0.65rem; font-size: 0.72rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <div>
                <strong style="color: var(--text-main);">${isEn ? 'Official Portal:' : 'Portal Oficial:'}</strong>
                <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; margin-left: 0.3rem; word-break: break-all;">
                  power.larc.nasa.gov
                </a>
              </div>
              <div>
                <strong style="color: var(--text-main);">${isEn ? 'API Endpoint:' : 'API Endpoint:'}</strong>
                <a href="https://power.larc.nasa.gov/api/temporal/climatology/point" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; margin-left: 0.3rem; word-break: break-all;">
                  power.larc.nasa.gov/api/temporal/climatology
                </a>
              </div>
            </div>

            <p style="font-size: 0.77rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.5rem;">
              <strong>${isEn ? 'Key Methodological Differences:' : 'Diferencias Metodológicas Clave:'}</strong><br/>
              • <strong>${isEn ? 'Worldwide Coverage & Long Period:' : 'Cobertura global y serie muy extensa:'}</strong> ${isEn
                ? 'Integrates over 35 years of continuous observations (1984–present) based on CERES satellite instruments and Goddard GMAO MERRA-2 models.'
                : 'Integra más de 35 años de observaciones continuas (1984–presente) basadas en satélites CERES y modelos de asimilación GMAO MERRA-2.'}<br/>
              • <strong>${isEn ? 'Spatial Resolution:' : 'Resolución espacial:'}</strong> ${isEn
                ? 'Grid cell of 0.5° latitude x 0.625° longitude (~50 km). Evaluates free-horizon surface irradiance without micro-topography.'
                : 'Malla de 0,5° latitud x 0,625° longitud (~50 km). Evalúa irradiancia en superficie libre sin micro-relieve orográfico.'}<br/>
              • <strong>${isEn ? 'CORS Enabled:' : 'Acceso Web Directo:'}</strong> ${isEn
                ? 'Directly accessible from web clients (CORS enabled worldwide).'
                : 'Accesible directamente desde clientes web al tener cabeceras CORS habilitadas a nivel global.'}
            </p>
          </div>
          <div style="font-size: 0.70rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.45rem; font-family: var(--font-mono); line-height: 1.35;">
            <strong>${isEn ? 'References:' : 'Referencias:'}</strong><br/>
            • Stackhouse, P. W., et al. (2022). <em>The NASA Prediction of Worldwide Energy Resources (POWER) Project</em>. NASA Technical Reports.<br/>
            • Gelaro, R., et al. (2017). <em>The Modern-Era Retrospective Analysis for Research and Applications, Version 2 (MERRA-2)</em>. J. Climate, 30(14), 5419-5454.
          </div>
        </div>

        <!-- BD 3: Open-Meteo Historical Archive / ERA5 Reanalysis -->
        <div style="background: var(--bg-card); padding: 1.1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
              <div>
                <strong style="color: var(--text-main); font-size: 0.92rem; display: block;">${isEn ? 'Open-Meteo / ECMWF ERA5 (Reanalysis)' : 'Open-Meteo / ECMWF ERA5 (Reanálisis)'}</strong>
                <span style="font-size: 0.72rem; color: #059669; font-weight: 600;">High-Resolution Atmospheric Reanalysis</span>
              </div>
              <span class="badge badge-primary" style="font-size: 0.68rem; white-space: nowrap;">${isEn ? 'Daily / ERA5T (5 days)' : 'Diaria / ERA5T (5 días)'}</span>
            </div>

            <!-- Direct URLs -->
            <div style="background: var(--bg-primary); padding: 0.45rem 0.65rem; border-radius: 4px; border: 1px solid var(--border-subtle); margin-bottom: 0.65rem; font-size: 0.72rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <div>
                <strong style="color: var(--text-main);">${isEn ? 'Official Portal:' : 'Portal Oficial:'}</strong>
                <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; margin-left: 0.3rem; word-break: break-all;">
                  open-meteo.com
                </a>
              </div>
              <div>
                <strong style="color: var(--text-main);">${isEn ? 'API Endpoint:' : 'API Endpoint:'}</strong>
                <a href="https://archive-api.open-meteo.com/v1/archive" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; margin-left: 0.3rem; word-break: break-all;">
                  archive-api.open-meteo.com/v1/archive
                </a>
              </div>
            </div>

            <p style="font-size: 0.77rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.5rem;">
              <strong>${isEn ? 'Key Methodological Differences:' : 'Diferencias Metodológicas Clave:'}</strong><br/>
              • <strong>${isEn ? 'Single-Year Actual Weather:' : 'Meteorología de año específico:'}</strong> ${isEn
                ? 'Retrieves individual year-by-year reanalysis data (e.g. year 2023), reflecting exact historical cloudy days, Saharan dust haze, and specific heatwaves.'
                : 'Recupera datos año por año individual (ej. año 2023), reflejando la nubosidad, calimas y anomalías reales ocurridas en ese año concreto.'}<br/>
              • <strong>${isEn ? 'High Spatial Resolution:' : 'Resolución espacial elevada:'}</strong> ${isEn
                ? 'Malla global de 9 a 25 km (ERA5-Land), la más densa entre los modelos globales.'
                : 'Malla global de 9 a 25 km (ERA5-Land), la más densa entre los modelos atmosféricos globales.'}<br/>
              • <strong>${isEn ? 'Latency & Open Access:' : 'Latencia y acceso:'}</strong> ${isEn
                ? 'Near-zero latency (ERA5T updated within 5 days), free open-access without keys, fully CORS-compliant.'
                : 'Latencia muy baja (ERA5T disponible a los 5 días), acceso abierto sin cuotas y compatible con CORS.'}
            </p>
          </div>
          <div style="font-size: 0.70rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.45rem; font-family: var(--font-mono); line-height: 1.35;">
            <strong>${isEn ? 'References:' : 'Referencias:'}</strong><br/>
            • Hersbach, H., et al. (2020). <em>The ERA5 global reanalysis</em>. Q. J. R. Meteorol. Soc., 146(730), 1999-2049.<br/>
            • Zippenfenig, P. (2023). <em>Open-Meteo: Open-Source Weather API</em>. DOI: 10.5281/zenodo.7970649.
          </div>
        </div>
      </div>

      <!-- Comparative Matrix Table (PVGIS vs NASA POWER vs Open-Meteo) -->
      <div style="margin-top: 1.25rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-card);">
        <div style="padding: 0.65rem 1rem; background: rgba(2, 132, 199, 0.08); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
          <strong style="color: var(--text-main); font-size: 0.82rem;">
            ${isEn ? 'Direct Comparative Matrix: PVGIS vs NASA POWER vs Open-Meteo' : 'Matriz Comparativa Directa: PVGIS vs NASA POWER vs Open-Meteo'}
          </strong>
          <span style="font-size: 0.70rem; color: var(--text-muted); font-weight: 600;">
            ${isEn ? 'Methodological & Data Divergences' : 'Divergencias Metodológicas y de Datos'}
          </span>
        </div>
        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.74rem; line-height: 1.4; text-align: left;">
            <thead>
              <tr style="background: var(--bg-primary); border-bottom: 1px solid var(--border-subtle);">
                <th style="padding: 0.5rem 0.75rem; width: 22%; color: var(--text-main); font-weight: 700;">${isEn ? 'Parameter / Feature' : 'Parámetro / Característica'}</th>
                <th style="padding: 0.5rem 0.75rem; width: 26%; color: #0284c7; font-weight: 700;">PVGIS 5.3 (JRC)</th>
                <th style="padding: 0.5rem 0.75rem; width: 26%; color: #d97706; font-weight: 700;">NASA POWER</th>
                <th style="padding: 0.5rem 0.75rem; width: 26%; color: #059669; font-weight: 700;">Open-Meteo (ERA5)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Primary Model Type' : 'Tipo de Modelo Principal'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Geostationary Satellite (Meteosat CM SAF) + ERA5' : 'Satélite Geoestacionario (Meteosat CM SAF) + ERA5'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Polar Satellites (CERES) + MERRA-2 Assimilation' : 'Satélites Polares (CERES) + Asimilación MERRA-2'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Numerical Atmospheric Reanalysis (ECMWF ERA5-Land)' : 'Reanálisis Numérico Atmosférico (ECMWF ERA5-Land)'}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(2, 132, 199, 0.02);">
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Temporal Baseline' : 'Base Temporal'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Multi-year climatology (2005–2023, v5.3 SARAH-3; v5.2 was to 2020)' : 'Media climatológica multianual (2005–2023, v5.3 SARAH-3; v5.2 era hasta 2020)'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Multi-decade climatology (>35 yrs, 1984–present)' : 'Climatología multidecenal (>35 años, 1984–presente)'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Single-year historical time series (e.g., 2023)' : 'Serie anual específica año a año (ej. 2023)'}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Spatial Resolution' : 'Resolución Espacial'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">~5 km (0.05° x 0.05°)</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">~50 km (0.5° x 0.625°)</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">~9 a 25 km (0.1° x 0.1°)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(2, 132, 199, 0.02);">
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Terrain Horizon Shadowing' : 'Sombras de Horizonte / Relieve'}</td>
                <td style="padding: 0.5rem 0.75rem; color: #059669; font-weight: 600;">✓ ${isEn ? 'Included (SRTM 90m DEM)' : 'Incluido (MDE SRTM 90m)'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-dim);">${isEn ? 'Free horizontal surface' : 'Superficie libre (sin horizonte local)'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-dim);">${isEn ? 'Mean grid elevation (no micro-horizon)' : 'Elevación media de celda (sin micro-horizonte)'}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Typical Madrid June Gdm(0)' : 'Radiación Junio (Madrid, Gdm(0))'}</td>
                <td style="padding: 0.5rem 0.75rem; font-weight: 700; color: #0284c7;">7.46 – 7.56 kWh/m²·d</td>
                <td style="padding: 0.5rem 0.75rem; font-weight: 700; color: #d97706;">7.65 kWh/m²·d</td>
                <td style="padding: 0.5rem 0.75rem; font-weight: 700; color: #059669;">6.88 kWh/m²·d (año 2023)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(2, 132, 199, 0.02);">
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Web Browser Connectivity (CORS)' : 'Conectividad Web (CORS)'}</td>
                <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${isEn ? 'Direct on Desktop; via proxy / baseline in Web' : 'Directo en Escritorio; vía proxy / base en Web'}</td>
                <td style="padding: 0.5rem 0.75rem; color: #059669; font-weight: 600;">✓ ${isEn ? 'Direct Web CORS' : 'Directo Web con CORS'}</td>
                <td style="padding: 0.5rem 0.75rem; color: #059669; font-weight: 600;">✓ ${isEn ? 'Direct Web CORS' : 'Directo Web con CORS'}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--text-main);">${isEn ? 'Direct Portal / API Link' : 'Enlace Oficial Directo'}</td>
                <td style="padding: 0.5rem 0.75rem;">
                  <a href="https://re.jrc.ec.europa.eu/pvg_tools/es/" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; font-weight: 600;">
                    re.jrc.ec.europa.eu
                  </a>
                </td>
                <td style="padding: 0.5rem 0.75rem;">
                  <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer" style="color: #d97706; text-decoration: underline; font-weight: 600;">
                    power.larc.nasa.gov
                  </a>
                </td>
                <td style="padding: 0.5rem 0.75rem;">
                  <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" style="color: #059669; text-decoration: underline; font-weight: 600;">
                    open-meteo.com
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach architecture technical details inside About view
  const archPanel = renderArchitectureOverview(isEn);
  archPanel.style.marginTop = '1.5rem';
  container.appendChild(archPanel);

  return container;
}

let currentAppTab: 'simulator' | 'satellite-apis' | 'console' | 'about' = 'simulator';

function createApp() {
  const prevScroll = typeof window !== 'undefined' ? window.scrollY : 0;
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = '';
  const isEn = i18n.getLocale() === 'en';

  // 1. App Header with Language Switcher & WebAssembly Status
  const header = renderHeader();
  app.appendChild(header);

  // 2. Main Content Container
  const main = document.createElement('main');
  main.className = 'main-container';

  // 3. Primary Application Navigation Bar
  const navBar = document.createElement('nav');
  navBar.className = 'dual-tabs-bar app-main-nav';
  navBar.style.marginBottom = '1.25rem';
  navBar.innerHTML = `
    <button class="dual-tab-btn ${currentAppTab === 'simulator' ? 'active' : ''}" data-app-tab="simulator">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
      </svg>
      <span>${isEn ? 'Solar Simulator & Optimization' : 'Simulador & Optimización Solar'}</span>
    </button>

    <button class="dual-tab-btn ${currentAppTab === 'console' ? 'active' : ''}" data-app-tab="console">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${isEn ? 'Verification' : 'Verificación'}</span>
    </button>

    <button class="dual-tab-btn ${currentAppTab === 'about' ? 'active' : ''}" data-app-tab="about">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${isEn ? 'About OrientSol & TFM' : 'Acerca de OrientSol & TFM'}</span>
    </button>
  `;
  main.appendChild(navBar);

  // Tab 1: Core Solar Simulation & Optimization Panel (Primary Application View)
  const simView = document.createElement('div');
  simView.id = 'app-view-simulator';
  simView.className = `app-tab-view ${currentAppTab === 'simulator' ? '' : 'hidden'}`;
  const dualLoaderPanel = renderDualClimateLoaderPanel();
  simView.appendChild(dualLoaderPanel);
  main.appendChild(simView);

  // Tab 2: Interactive Python Console Panel (Verification)
  const consoleView = document.createElement('div');
  consoleView.id = 'app-view-console';
  consoleView.className = `app-tab-view ${currentAppTab === 'console' ? '' : 'hidden'}`;
  const consolePanel = renderPythonConsole();
  consoleView.appendChild(consolePanel);
  main.appendChild(consoleView);

  // Tab 3: About OrientSol & TFM View
  const aboutView = document.createElement('div');
  aboutView.id = 'app-view-about';
  aboutView.className = `app-tab-view ${currentAppTab === 'about' ? '' : 'hidden'}`;
  const aboutPanel = renderAboutView(isEn);
  aboutView.appendChild(aboutPanel);
  main.appendChild(aboutView);

  // Primary App Navigation Event Listeners
  const appTabs = navBar.querySelectorAll<HTMLButtonElement>('.dual-tab-btn');
  const appViews: Record<string, HTMLElement> = {
    simulator: simView,
    console: consoleView,
    about: aboutView,
  };

  appTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = (tab.getAttribute('data-app-tab') || 'simulator') as typeof currentAppTab;

      appTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      currentAppTab = targetTab;
      Object.entries(appViews).forEach(([key, viewEl]) => {
        if (key === targetTab) {
          viewEl.classList.remove('hidden');
        } else {
          viewEl.classList.add('hidden');
        }
      });
    });
  });

  app.appendChild(main);

  // 4. Status Bar Footer
  const footer = renderStatusBar();
  app.appendChild(footer);

  // 5. Technical Cookie & Privacy Notice Banner (AEPD & EU ePrivacy)
  renderCookieBanner();

  // 6. Restore scroll smoothly
  if (prevScroll > 0) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: prevScroll, behavior: 'instant' });
    });
  }
}

// Initial mount
createApp();

import { themeManager } from '@/services/theme/themeManager';

// Reactively re-render whenever the user switches language or theme
i18n.subscribe(() => {
  createApp();
});

themeManager.subscribe(() => {
  createApp();
});

// Register PWA Service Worker for offline and mobile execution
registerServiceWorker();

import { securityAuditLogger } from '@/services/monitoring/securityAuditLogger';
import { platformSecureStorage } from '@/services/storage/platformSecureStorage';
import { deepLinkSecurityManager } from '@/services/deeplink/deepLinkSecurityManager';

// Initialize Security Audit Logger and CSP violation monitoring
securityAuditLogger.init();

// Initialize Platform Secure Storage (Keystore on Android, Keychain on iOS)
platformSecureStorage.init().catch((err) => {
  console.warn('[OrientSol Secure Storage] Init warning:', err);
});

// Initialize Secure Deep Link Manager (OWASP Mobile M8 & CWE-939 mitigation)
deepLinkSecurityManager.init();



// Global Production Error Shield: Catch unhandled errors and log details privately
window.addEventListener('error', (event) => {
  // Ignore harmless browser layout notifications (W3C standard benign ResizeObserver loop)
  if (event.message && (
    event.message.includes('ResizeObserver loop') ||
    event.message.includes('ResizeObserver')
  )) {
    return;
  }

  securityAuditLogger.log({
    level: 'ERROR',
    category: 'SYSTEM',
    source: 'window.onerror',
    message: event.message || 'Unhandled script error',
    metadata: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    },
  });
});

window.addEventListener('unhandledrejection', (event) => {
  securityAuditLogger.log({
    level: 'ERROR',
    category: 'SYSTEM',
    source: 'window.unhandledrejection',
    message: String(event.reason?.message || event.reason || 'Unhandled promise rejection'),
    metadata: {
      reason: event.reason,
    },
  });
});

// Automatically start background loading of Pyodide runtime
pyodideService.initialize().catch((err) => {
  console.warn('[OrientSol] Pyodide background pre-load note:', err);
});


