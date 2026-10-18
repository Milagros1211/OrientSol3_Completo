import './style.css';
import {
  renderHeader,
  renderStatusBar,
  renderDualClimateLoaderPanel,
  renderPythonConsole,
  renderArchitectureOverview,
  openLegalPoliciesModal,
  renderCookieBanner,
  type LegalTabId,
} from '@/components';
import { pyodideService } from '@/services/pyodide';
import { i18n } from '@/i18n';
import { registerServiceWorker } from '@/sw-register';

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

    <div class="about-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-top: 1rem;">
      <div class="result-card highlight-card">
        <h4 style="margin-bottom: 0.75rem; color: var(--solar-amber);">${isEn ? 'Academic Framework (TFM)' : 'Marco Académico (TFM)'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem;">
          <li><strong>${isEn ? 'Institution' : 'Institución'}:</strong> Universidad de Jaén (UJA)</li>
          <li><strong>${isEn ? 'Degree' : 'Titulación'}:</strong> ${isEn ? "Master's Degree in Renewable Energy" : 'Máster Universitario en Energías Renovables'}</li>
          <li><strong>${isEn ? 'Title' : 'Título'}:</strong> ${isEn ? 'Development of a software environment for position and motion optimization of solar radiation receiving surfaces in a photovoltaic system' : 'Desarrollo de un entorno software para optimización de posición y movimiento de superficies receptoras de radiación solar en un sistema fotovoltaico'}</li>
          <li><strong>${isEn ? 'Student' : 'Alumna'}:</strong> Karina Milagros Baldeón Zárate</li>
          <li><strong>${isEn ? 'Supervisors' : 'Directores'}:</strong> Dr. Leocadio Hontoria García &amp; Dra. Catalina Rus Casas</li>
          <li><strong>${isEn ? 'Department' : 'Departamento'}:</strong> ${isEn ? 'Electronic and Automatic Engineering' : 'Ingeniería Electrónica y Automática'}</li>
        </ul>
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

    <!-- Bases de Datos Climáticas, Frecuencia de Actualización y Referencias -->
    <div class="result-card wide-card" style="margin-top: 1.25rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan, #0284c7);">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
        <h4 style="margin: 0; color: var(--text-main);">
          ${isEn ? 'Meteorological & Radiative Databases: Update Frequency & Scientific References' : 'Bases de Datos Climáticas y Radiativas: Periodicidad de Actualización y Referencias Científicas'}
        </h4>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 1rem; line-height: 1.5;">
        ${isEn
          ? 'OrientSol 4.0 connects to official meteorological databases and satellite APIs to extract incident solar radiation Gdm(0) and ambient temperatures. Below is the update cadence and formal bibliography for each provider:'
          : 'OrientSol 4.0 permite extraer y evaluar radiación solar incidente Gdm(0) y temperaturas ambientales desde bases de datos meteorológicas homologadas y APIs satelitales. A continuación se detalla cada cuánto se actualizan y sus referencias bibliográficas:'}
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 1rem;">
        <!-- BD 1: PVGIS (Comisión Europea JRC) -->
        <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; gap: 0.5rem;">
              <strong style="color: var(--text-main); font-size: 0.9rem;">🇪🇺 ${isEn ? 'PVGIS (European Commission - JRC)' : 'PVGIS (Comisión Europea - JRC)'}</strong>
              <span class="badge badge-primary" style="font-size: 0.7rem; white-space: nowrap;">${isEn ? 'Monthly / 2-3 yrs (v5.x)' : 'Mensual / 2-3 años (v5.x)'}</span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.5rem;">
              <strong>${isEn ? 'Update Frequency:' : 'Frecuencia de Actualización:'}</strong> 
              • <strong>${isEn ? 'ERA5 / SARAH-3 Reanalysis:' : 'Reanálisis ERA5 / SARAH-3:'}</strong> ${isEn
                ? 'ECMWF updates solar radiation and weather time series <strong>monthly</strong> (with a 2-3 month consolidation latency lag).'
                : 'El ECMWF actualiza las series de radiación y meteorología <strong>mensualmente</strong> (con un retardo de latencia de 2 a 3 meses para consolidación).'}<br/>
              • <strong>${isEn ? 'API & Algorithm Versions:' : 'Versiones de API y Algoritmos:'}</strong> ${isEn
                ? 'The JRC publishes major updates <strong>every 2 to 3 years</strong> (v5.1 in 2020, v5.2 in 2022, v5.3 in 2024).'
                : 'El JRC actualiza versiones mayores <strong>cada 2 a 3 años</strong> (v5.1 en 2020, v5.2 en 2022, v5.3 en 2024).'}
            </p>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.4rem; font-family: var(--font-mono); line-height: 1.35;">
            <strong>${isEn ? 'References:' : 'Referencias:'}</strong><br/>
            • Huld, T., et al. (2012). <em>A new solar radiation database for estimating PV performance in Europe and Africa</em>. Solar Energy, 86(6), 1803-1815. DOI: 10.1016/j.solener.2012.03.006.<br/>
            • Pfeifroth, U., et al. (2023). <em>Surface Radiation Data Set - Heliosat (SARAH) - Edition 3</em>. CM SAF. DOI: 10.5676/EUM_SAF_CM/SARAH/V003.<br/>
            • JRC (2024). <em>PVGIS API Non-interactive service</em>. European Commission.
          </div>
        </div>

        <!-- BD 2: NASA POWER -->
        <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; gap: 0.5rem;">
              <strong style="color: var(--text-main); font-size: 0.9rem;">🛰️ NASA POWER (CERES / MERRA-2)</strong>
              <span class="badge badge-warning" style="font-size: 0.7rem; white-space: nowrap;">${isEn ? 'Daily (NRT) / Monthly' : 'Diaria (NRT) / Mensual'}</span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.5rem;">
              <strong>${isEn ? 'Update Frequency:' : 'Frecuencia de Actualización:'}</strong>
              • <strong>${isEn ? 'Near Real-Time (NRT):' : 'Cuasi tiempo real (NRT):'}</strong> ${isEn
                ? '<strong>Daily</strong> automated updates (2-4 day latency).'
                : 'Actualización <strong>diaria</strong> (latencia 2-4 días).'}<br/>
              • <strong>${isEn ? 'MERRA-2 Assimilated Reanalysis:' : 'Reanálisis asimilado MERRA-2:'}</strong> ${isEn
                ? '<strong>Monthly</strong> consolidation with 1-month lag.'
                : 'Consolidación <strong>mensual</strong> con 1 mes de desfase.'}<br/>
              • <strong>${isEn ? 'Satellite Climatologies (POWER v2.x):' : 'Climatologías satelitales (POWER v2.x):'}</strong> ${isEn
                ? '<strong>Annual</strong> update synthesizing &gt;35 years of observations (1984–present).'
                : 'Actualización <strong>anual</strong> integrando &gt;35 años (1984–presente).'}<br/>
              • <strong>${isEn ? 'Retrieved Variables:' : 'Variables extraídas:'}</strong> ${isEn
                ? 'Daily global horizontal radiation <code>ALLSKY_SFC_SW_DWN</code> (kWh/m²/day) and 2m temperature <code>T2M</code> (°C).'
                : 'Radiación global horizontal diaria <code>ALLSKY_SFC_SW_DWN</code> (kWh/m²/día) y temperatura a 2m <code>T2M</code> (°C).'}
            </p>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.4rem; font-family: var(--font-mono); line-height: 1.35;">
            <strong>${isEn ? 'References:' : 'Referencias:'}</strong><br/>
            • Stackhouse, P. W., et al. (2022). <em>The NASA Prediction of Worldwide Energy Resources (POWER) Project</em>. NASA Technical Reports.<br/>
            • Gelaro, R., et al. (2017). <em>The Modern-Era Retrospective Analysis for Research and Applications, Version 2 (MERRA-2)</em>. J. Climate, 30(14), 5419-5454.
          </div>
        </div>

        <!-- BD 3: Open-Meteo Historical Archive / ERA5 Reanalysis -->
        <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; gap: 0.5rem;">
              <strong style="color: var(--text-main); font-size: 0.9rem;">🌐 ${isEn ? 'Open-Meteo / ECMWF ERA5 (Reanalysis)' : 'Open-Meteo / ECMWF ERA5 (Reanálisis)'}</strong>
              <span class="badge badge-primary" style="font-size: 0.7rem; white-space: nowrap;">${isEn ? 'Daily / ERA5T (5 days)' : 'Diaria / ERA5T (5 días)'}</span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.5rem;">
              <strong>${isEn ? 'Live API Queried:' : 'API Real Consultada:'}</strong> <code>archive-api.open-meteo.com</code> ${isEn
                ? '(ECMWF ERA5 / ERA5-Land global reanalysis, 9–25 km resolution).'
                : '(modelo reanálisis global ECMWF ERA5 / ERA5-Land, resolución espacial 9–25 km).'}<br/>
              • <strong>${isEn ? 'Update Frequency:' : 'Frecuencia de Actualización:'}</strong> ${isEn
                ? '<strong>ERA5T</strong> time series updated <strong>daily with 5-day latency</strong>. Final consolidated ERA5 archive updated <strong>monthly</strong> (2-3 months lag).'
                : 'Serie histórica <strong>ERA5T</strong> actualizada <strong>diariamente con 5 días de latencia</strong>. Archivo consolidado ERA5 definitivo actualizado <strong>mensualmente</strong> (desfase 2 a 3 meses).'}<br/>
              • <strong>${isEn ? 'Retrieved Variables & Unit Conversion:' : 'Variables extraídas y conversión:'}</strong>
                ${isEn
                  ? 'Daily incident solar radiation <code>shortwave_radiation_sum</code> (in MJ/m²/day, converted to kWh/m²/day by dividing by 3,6 and averaged to 12 monthly values for Gdm(0)), 2m temperature <code>temperature_2m_mean</code> (°C), and elevation (m).'
                  : 'Radiación diaria incidente <code>shortwave_radiation_sum</code> (en MJ/m²/día, convertida a kWh/m²/día dividiendo por 3,6 y promediada a 12 meses para Gdm(0)) y temperatura a 2m <code>temperature_2m_mean</code> (°C), además de altitud (m).'}<br/>
              • <em>${isEn ? 'Technical Note:' : 'Nota técnica:'}</em> ${isEn
                ? 'Open-access API with high availability and no restrictive quotas for global PV modeling.'
                : 'Acceso abierto de alta disponibilidad sin cuotas restrictivas para modelado fotovoltaico mundial.'}
            </p>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.4rem; font-family: var(--font-mono); line-height: 1.35;">
            <strong>${isEn ? 'References:' : 'Referencias:'}</strong><br/>
            • Hersbach, H., et al. (2020). <em>The ERA5 global reanalysis</em>. Quarterly Journal of the Royal Meteorological Society, 146(730), 1999-2049. DOI: 10.1002/qj.3803.<br/>
            • Zippenfenig, P. (2023). <em>Open-Meteo: Open-Source Weather API</em>. DOI: 10.5281/zenodo.7970649.<br/>
            • Muñoz-Sabater, J., et al. (2021). <em>ERA5-Land: a state-of-the-art global land surface dataset</em>. Earth System Science Data, 13(9), 4349-4383.
          </div>
        </div>
      </div>
    </div>

    <!-- Legal, Privacy (GDPR), Cookies & Terms Hub -->
    <div class="result-card wide-card" style="margin-top: 1.25rem; border: 1px solid rgba(14, 165, 233, 0.35); background: linear-gradient(to right, rgba(14, 165, 233, 0.03), transparent);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan, #0284c7);">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h4 style="margin: 0; color: var(--text-main);">
            ${isEn ? 'Legal Compliance, Privacy (GDPR), Cookies & Terms' : 'Aviso Legal, Privacidad (RGPD), Cookies & Términos de Servicio'}
          </h4>
        </div>
        <span class="badge badge-success">${isEn ? 'EU Law (GDPR) & Spanish Law' : 'Derecho UE (RGPD) y Ley Española'}</span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 1rem; line-height: 1.5;">
        ${isEn
          ? 'OrientSol 4.0 strictly complies with European Union General Data Protection Regulation (EU 2016/679), Spanish Organic Law 3/2018 (LOPDGDD), ePrivacy Directive 2002/58/EC, LSSI-CE, and Consumer Rights Law (TRLGDCU). Explore our full legal, privacy, and technical security audit documentation:'
          : 'OrientSol 4.0 cumple rigurosamente con el Reglamento General de Protección de Datos de la Unión Europea (RGPD 2016/679), la Ley Orgánica 3/2018 (LOPDGDD), la Directiva ePrivacy 2002/58/CE, la LSSI-CE y la Ley de Consumidores (TRLGDCU). Consulta la documentación legal y el informe de seguridad:'}
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;" id="about-legal-actions">
        <button type="button" class="btn btn-secondary legal-trigger-btn" data-tab="privacy" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
          🛡️ ${isEn ? 'Privacy Policy (GDPR)' : 'Política de Privacidad (RGPD)'}
        </button>
        <button type="button" class="btn btn-secondary legal-trigger-btn" data-tab="terms" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
          📜 ${isEn ? 'Terms & Free Open Access' : 'Términos & Gratuidad'}
        </button>
        <button type="button" class="btn btn-secondary legal-trigger-btn" data-tab="cookies" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
          🍪 ${isEn ? 'Cookie & Storage Policy' : 'Política de Cookies & Almacenamiento'}
        </button>
        <button type="button" class="btn btn-secondary legal-trigger-btn" data-tab="security" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
          🔒 ${isEn ? 'Security Audit Report' : 'Informe de Seguridad'}
        </button>
      </div>
    </div>
  `;

  // Attach legal button click handlers
  const legalTriggerBtns = container.querySelectorAll<HTMLButtonElement>('.legal-trigger-btn');
  legalTriggerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = (btn.getAttribute('data-tab') || 'privacy') as LegalTabId;
      openLegalPoliciesModal(tab);
    });
  });

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

// Automatically start background loading of Pyodide runtime
pyodideService.initialize().catch((err) => {
  console.warn('[OrientSol] Pyodide background pre-load note:', err);
});
