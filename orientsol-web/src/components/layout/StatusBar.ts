import { pyodideService } from '@/services/pyodide';
import { i18n } from '@/i18n';

export function renderStatusBar(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'app-statusbar';

  const t = i18n.t;

  footer.innerHTML = `
    <div class="statusbar-left">
      <span class="status-item">
        <span class="status-indicator live"></span>
        <span id="footer-engine-info">Pyodide WASM Runtime</span>
      </span>
      <span class="status-separator">|</span>
      <span class="status-item" id="footer-db-info">${t.statusBar.offlineMode}</span>
    </div>
    <div class="statusbar-right">
      <span class="status-item" id="footer-exec-time">${t.statusBar.crossPlatform}</span>
      <span class="status-separator">|</span>
      <span class="status-item">TypeScript + Pyodide (WASM)</span>
    </div>
  `;

  pyodideService.subscribe((state) => {
    const engineInfo = footer.querySelector('#footer-engine-info');
    const execTime = footer.querySelector('#footer-exec-time');

    if (engineInfo) {
      const envBadge = state.environment === 'electron-offline'
        ? (i18n.getLocale() === 'es' ? 'Local Offline' : 'Local Offline')
        : (i18n.getLocale() === 'es' ? 'Web CDN' : 'Web CDN');

      if (state.status === 'ready') {
        engineInfo.textContent = `Python ${state.pythonVersion || '3.14'} WASM (${envBadge})`;
      } else if (state.status === 'loading') {
        engineInfo.textContent = `WASM (${state.loadProgress}%) [${envBadge}]...`;
      } else if (state.status === 'error') {
        engineInfo.textContent = `Error: ${state.error}`;
      }
    }

    if (execTime && state.lastExecutionTimeMs !== null) {
      execTime.textContent = `${i18n.getLocale() === 'es' ? 'Última ejecución' : 'Last run'}: ${state.lastExecutionTimeMs} ms`;
    }
  });

  return footer;
}
