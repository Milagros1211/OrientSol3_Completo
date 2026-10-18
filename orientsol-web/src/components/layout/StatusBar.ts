import { pyodideService } from '@/services/pyodide';
import { i18n } from '@/i18n';
import { openLegalPoliciesModal } from '@/components/modals/LegalPoliciesModal';
import { openSecurityAuditModal } from '@/components/modals/SecurityAuditModal';

export function renderStatusBar(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'app-statusbar';

  const t = i18n.t;
  const isEn = i18n.getLocale() === 'en';

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
      <button type="button" class="status-item status-link-btn" id="footer-audit-btn" title="${isEn ? 'Security Monitoring & Audit Logs' : 'Monitorización de Seguridad y Registro de Auditoría'}">
        🛡️ ${isEn ? 'Audit & Security' : 'Auditoría & Seguridad'}
      </button>
      <span class="status-separator">|</span>
      <button type="button" class="status-item status-link-btn" id="footer-legal-btn" title="${isEn ? 'Legal Notice, GDPR Privacy, Terms & Cookie Policy' : 'Aviso Legal, Privacidad RGPD, Términos y Política de Cookies'}">
        ⚖️ ${isEn ? 'Privacy & Legal (EU/GDPR)' : 'Privacidad & Legal (UE/RGPD)'}
      </button>
      <span class="status-separator">|</span>
      <span class="status-item">TypeScript + Pyodide (WASM)</span>
    </div>
  `;

  const auditBtn = footer.querySelector('#footer-audit-btn');
  auditBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openSecurityAuditModal();
  });

  const legalBtn = footer.querySelector('#footer-legal-btn');
  legalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openLegalPoliciesModal('privacy');
  });


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
