import './style.css';
import {
  renderHeader,
  renderStatusBar,
  renderClimateIntegrationPanel,
  renderDualClimateLoaderPanel,
  renderPythonConsole,
  renderArchitectureOverview,
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
        <h3 class="panel-title">${isEn ? 'About OrientSol 3.0 & Academic Project' : 'Acerca de OrientSol 3.0 & Proyecto Académico'}</h3>
        <p class="panel-desc">${isEn ? 'Master Thesis in Renewable Energies — University of Jaén' : 'Trabajo Fin de Máster en Energías Renovables — Universidad de Jaén'}</p>
      </div>
    </div>

    <div class="about-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-top: 1rem;">
      <div class="result-card highlight-card">
        <h4 style="margin-bottom: 0.75rem; color: var(--solar-amber);">${isEn ? 'Academic Framework (TFM)' : 'Marco Académico (TFM)'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem;">
          <li><strong>${isEn ? 'Institution' : 'Institución'}:</strong> Universidad de Jaén (UJA)</li>
          <li><strong>${isEn ? 'Degree' : 'Titulación'}:</strong> Máster Universitario en Energías Renovables</li>
          <li><strong>${isEn ? 'Title' : 'Título'}:</strong> Desarrollo de un entorno software para optimización de posición y movimiento de superficies receptoras de radiación solar en un sistema fotovoltaico</li>
          <li><strong>${isEn ? 'Student' : 'Alumna'}:</strong> Karina Milagros Baldeón Zárate</li>
          <li><strong>${isEn ? 'Supervisors' : 'Directores'}:</strong> Dr. Leocadio Hontoria García &amp; Dra. Catalina Rus Casas</li>
          <li><strong>${isEn ? 'Department' : 'Departamento'}:</strong> Ingeniería Electrónica y Automática</li>
        </ul>
      </div>

      <div class="result-card">
        <h4 style="margin-bottom: 0.75rem; color: var(--accent-cyan);">${isEn ? 'Scientific Modernization from MATLAB (.m)' : 'Modernización Científica desde MATLAB (.m)'}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0.75rem;">
          ${isEn 
            ? 'OrientSol 3.0 is the complete web reimagining of the original desktop software developed in MATLAB/GUIDE (.m and .fig). All core solar geometry equations, radiation transposition, single and dual-axis tracking, and Osterwald cell thermal models now run client-side via WebAssembly (Pyodide + NumPy).'
            : 'OrientSol 3.0 es la evolución moderna en entorno web del software original desarrollado en MATLAB/GUIDE (.m y .fig). Toda la geometría solar, transposición de radiación difusa y directa, seguimiento a 1 y 2 ejes y el modelo energético de Osterwald se ejecutan en el cliente mediante WebAssembly (Pyodide + NumPy).'}
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-success">Vite + TypeScript</span>
          <span class="badge badge-neutral">NumPy 2.4.6 WASM</span>
          <span class="badge badge-source">Multiplatform Web/Win/Android</span>
        </div>
      </div>
    </div>
  `;

  // Attach architecture technical details inside About view
  const archPanel = renderArchitectureOverview();
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

    <button class="dual-tab-btn ${currentAppTab === 'satellite-apis' ? 'active' : ''}" data-app-tab="satellite-apis">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path>
      </svg>
      <span>${isEn ? 'Satellite Climate APIs' : 'APIs Climáticas Satelitales'}</span>
    </button>

    <button class="dual-tab-btn ${currentAppTab === 'console' ? 'active' : ''}" data-app-tab="console">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
      <span>${isEn ? 'Python WASM Console' : 'Consola Python (WASM)'}</span>
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

  // Tab 2: Satellite Climate APIs Panel
  const climateView = document.createElement('div');
  climateView.id = 'app-view-satellite-apis';
  climateView.className = `app-tab-view ${currentAppTab === 'satellite-apis' ? '' : 'hidden'}`;
  const climatePanel = renderClimateIntegrationPanel();
  climateView.appendChild(climatePanel);
  main.appendChild(climateView);

  // Tab 3: Interactive Python Console Panel
  const consoleView = document.createElement('div');
  consoleView.id = 'app-view-console';
  consoleView.className = `app-tab-view ${currentAppTab === 'console' ? '' : 'hidden'}`;
  const consolePanel = renderPythonConsole();
  consoleView.appendChild(consolePanel);
  main.appendChild(consoleView);

  // Tab 4: About OrientSol & TFM View
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
    'satellite-apis': climateView,
    console: consoleView,
    about: aboutView,
  };

  appTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      appTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = (tab.getAttribute('data-app-tab') || 'simulator') as typeof currentAppTab;
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

  // 5. Restore scroll smoothly
  if (prevScroll > 0) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: prevScroll, behavior: 'instant' });
    });
  }
}

// Initial mount
createApp();

// Reactively re-render whenever the user switches language
i18n.subscribe(() => {
  createApp();
});

// Register PWA Service Worker for offline and mobile execution
registerServiceWorker();

// Automatically start background loading of Pyodide runtime
pyodideService.initialize().catch((err) => {
  console.warn('[OrientSol] Pyodide background pre-load note:', err);
});
