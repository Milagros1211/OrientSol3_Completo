import './style.css';
import {
  renderHeader,
  renderStatusBar,
  renderLocationSelector,
  renderClimateIntegrationPanel,
  renderDualClimateLoaderPanel,
  renderPythonConsole,
  renderArchitectureOverview,
} from '@/components';
import { pyodideService } from '@/services/pyodide';
import { i18n } from '@/i18n';
import { registerServiceWorker } from '@/sw-register';
import type { LocationData } from '@/types/database';

function createApp() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = '';
  const t = i18n.t;

  // 1. App Header with Language Switcher
  const header = renderHeader();
  app.appendChild(header);

  // 2. Main Content Container
  const main = document.createElement('main');
  main.className = 'main-container';

  // Hero migration banner
  const heroBanner = document.createElement('section');
  heroBanner.className = 'hero-banner';
  heroBanner.innerHTML = `
    <div class="hero-content">
      <h2>${t.hero.title}</h2>
      <p>${t.hero.description}</p>
    </div>
    <div class="hero-stats">
      <div class="hero-stat-card">
        <span class="stat-number">192</span>
        <span class="stat-label">${t.hero.statMatlab}</span>
      </div>
      <div class="hero-stat-card">
        <span class="stat-number">0.27+</span>
        <span class="stat-label">${t.hero.statWasm}</span>
      </div>
      <div class="hero-stat-card">
        <span class="stat-number">100%</span>
        <span class="stat-label">${t.hero.statPlatform}</span>
      </div>
    </div>
  `;
  main.appendChild(heroBanner);

  // Location selector (Database integration)
  const locationSelector = renderLocationSelector((location: LocationData, albedo: number) => {
    console.log(`[OrientSol] Location: ${location.name}, Albedo: ${albedo}`);
  });
  main.appendChild(locationSelector);

  // Real-time Climate APIs (NASA POWER, PVGIS, Meteonorm) + Supabase + Pyodide Calculation Bridge
  const climatePanel = renderClimateIntegrationPanel();
  main.appendChild(climatePanel);

  // Hybrid Data Architecture & Dual Loading (Historical DB + Manual Entry + CSV/JSON Upload)
  const dualLoaderPanel = renderDualClimateLoaderPanel();
  main.appendChild(dualLoaderPanel);

  // Python in-browser console (Pyodide verification)
  const consolePanel = renderPythonConsole();
  main.appendChild(consolePanel);

  // Architecture overview
  const archPanel = renderArchitectureOverview();
  main.appendChild(archPanel);

  app.appendChild(main);

  // 3. Status Bar Footer
  const footer = renderStatusBar();
  app.appendChild(footer);
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
