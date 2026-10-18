import { securityAuditLogger } from '@/services/monitoring/securityAuditLogger';
import { i18n } from '@/i18n';
import { escapeHtml } from '@/utils/security';
import { themeManager } from '@/services/theme/themeManager';

let activeAuditModalEl: HTMLElement | null = null;

export function openSecurityAuditModal(): void {
  if (activeAuditModalEl) {
    activeAuditModalEl.remove();
    activeAuditModalEl = null;
  }

  const isEn = i18n.getLocale() === 'en';
  let selectedLevel: string = 'ALL';
  let selectedCategory: string = 'ALL';
  let searchQuery: string = '';

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop audit-modal-backdrop';
  modal.id = 'security-audit-modal';
  modal.setAttribute('data-theme', themeManager.getTheme());

  function renderContent(): void {
    const counts = securityAuditLogger.getSummaryCounts();
    const allLogs = securityAuditLogger.getRecentLogs();

    const filteredLogs = allLogs.filter((evt) => {
      if (selectedLevel !== 'ALL' && evt.level !== selectedLevel) return false;
      if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMsg = evt.message.toLowerCase().includes(q);
        const matchSrc = evt.source.toLowerCase().includes(q);
        const matchCat = evt.category.toLowerCase().includes(q);
        return matchMsg || matchSrc || matchCat;
      }
      return true;
    });

    modal.innerHTML = `
      <div class="modal-dialog audit-dialog" role="dialog" aria-modal="true" aria-labelledby="audit-modal-title" style="max-width: 960px; width: 95%;">
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="panel-icon modal-icon" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div>
              <h3 class="modal-title" id="audit-modal-title">
                🛡️ ${isEn ? 'Security Monitoring & Audit Log' : 'Monitorización de Seguridad & Registro de Auditoría'}
              </h3>
              <p class="modal-subtitle">
                ${isEn 
                  ? 'Real-time telemetry, threat detection, and error logging with automatic secret redaction'
                  : 'Telemetría en tiempo real, detección de amenazas y registro de errores con redacción automática de secretos'}
              </p>
            </div>
          </div>
          <button type="button" class="btn-close" id="btn-close-audit-modal" aria-label="${isEn ? 'Close' : 'Cerrar'}">&times;</button>
        </div>

        <div class="modal-body audit-modal-body" style="padding: 1.25rem; max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
          <!-- Telemetry Destination Banner -->
          <div class="result-card highlight-card" style="margin-bottom: 0; border-left: 4px solid var(--accent-cyan, #0284c7); padding: 0.85rem;">
            <h4 style="margin: 0 0 0.4rem 0; font-size: 0.92rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
              <span>📍 ${isEn ? 'Where logs are stored & monitored' : 'Destino y Almacenamiento de los Registros'}</span>
            </h4>
            <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem;">
              <div>
                <strong>1. ${isEn ? 'Client Circular Buffer (localStorage):' : 'Búfer Circular Local (localStorage):'}</strong><br/>
                ${isEn 
                  ? 'Maintained in browser memory and local storage key <code>orientsol_audit_logs</code> (max 150 events).'
                  : 'Mantenido en memoria y en la clave <code>orientsol_audit_logs</code> (máximo 150 eventos con rotación).'}
              </div>
              <div>
                <strong>2. ${isEn ? 'Private Developer Console:' : 'Consola Privada del Desarrollador:'}</strong><br/>
                ${isEn 
                  ? 'Sanitized structured logs under <code>[OrientSol Audit]</code> tag with secrets stripped.'
                  : 'Salida estructurada bajo la etiqueta <code>[OrientSol Audit]</code> con datos sensibles ofuscados.'}
              </div>
              <div>
                <strong>3. ${isEn ? 'Secret Masking Engine:' : 'Motor de Ofuscación de Secretos:'}</strong><br/>
                ${isEn 
                  ? 'All JWTs, API keys, passwords, and tokens are scrubbed into <code>[REDACTED]</code> prior to persistence.'
                  : 'Tokens JWT, claves de API, contraseñas y encabezados se ofuscan a <code>[REDACTED]</code> antes de persistirse.'}
              </div>
              <div>
                <strong>4. ${isEn ? 'Database Layer (Supabase PostgreSQL):' : 'Capa de Base de Datos (Supabase):'}</strong><br/>
                ${isEn 
                  ? 'Anti-poisoning triggers & rate limits log violations directly into PostgreSQL server logs.'
                  : 'Triggers anti-envenenamiento y rate limiting registran violaciones directamente en logs de PostgreSQL.'}
              </div>
            </div>
          </div>

          <!-- Counter Stats Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
            <div class="result-card" style="text-align: center; padding: 0.6rem;">
              <div style="font-size: 1.25rem; font-weight: bold; color: var(--text-main);">${counts.total}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${isEn ? 'Total Events' : 'Total Eventos'}</div>
            </div>
            <div class="result-card" style="text-align: center; padding: 0.6rem; border-top: 3px solid #f59e0b;">
              <div style="font-size: 1.25rem; font-weight: bold; color: #f59e0b;">${counts.suspicious}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${isEn ? 'Suspicious Alerts' : 'Alertas Sospechosas'}</div>
            </div>
            <div class="result-card" style="text-align: center; padding: 0.6rem; border-top: 3px solid #ef4444;">
              <div style="font-size: 1.25rem; font-weight: bold; color: #ef4444;">${counts.error}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${isEn ? 'Errors' : 'Errores'}</div>
            </div>
            <div class="result-card" style="text-align: center; padding: 0.6rem; border-top: 3px solid #eab308;">
              <div style="font-size: 1.25rem; font-weight: bold; color: #eab308;">${counts.warn}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${isEn ? 'Warnings' : 'Advertencias'}</div>
            </div>
            <div class="result-card" style="text-align: center; padding: 0.6rem; border-top: 3px solid #3b82f6;">
              <div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">${counts.info}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${isEn ? 'Info / Health' : 'Informativos'}</div>
            </div>
          </div>

          <!-- Controls Bar: Filter, Search, and Export -->
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; background: var(--bg-card); padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              <select id="audit-filter-level" class="form-control" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; width: auto;">
                <option value="ALL" ${selectedLevel === 'ALL' ? 'selected' : ''}>${isEn ? 'All Levels' : 'Todos los Niveles'}</option>
                <option value="SUSPICIOUS" ${selectedLevel === 'SUSPICIOUS' ? 'selected' : ''}>⚠️ ${isEn ? 'Suspicious Only' : 'Solo Sospechosos'}</option>
                <option value="ERROR" ${selectedLevel === 'ERROR' ? 'selected' : ''}>❌ ${isEn ? 'Errors Only' : 'Solo Errores'}</option>
                <option value="WARN" ${selectedLevel === 'WARN' ? 'selected' : ''}>⚡ ${isEn ? 'Warnings Only' : 'Solo Advertencias'}</option>
                <option value="INFO" ${selectedLevel === 'INFO' ? 'selected' : ''}>ℹ️ ${isEn ? 'Info Only' : 'Solo Informativos'}</option>
              </select>

              <select id="audit-filter-category" class="form-control" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; width: auto;">
                <option value="ALL" ${selectedCategory === 'ALL' ? 'selected' : ''}>${isEn ? 'All Categories' : 'Todas las Categorías'}</option>
                <option value="INPUT_VALIDATION" ${selectedCategory === 'INPUT_VALIDATION' ? 'selected' : ''}>INPUT_VALIDATION</option>
                <option value="RATE_LIMIT" ${selectedCategory === 'RATE_LIMIT' ? 'selected' : ''}>RATE_LIMIT</option>
                <option value="CSP_VIOLATION" ${selectedCategory === 'CSP_VIOLATION' ? 'selected' : ''}>CSP_VIOLATION</option>
                <option value="DATABASE" ${selectedCategory === 'DATABASE' ? 'selected' : ''}>DATABASE</option>
                <option value="SYSTEM" ${selectedCategory === 'SYSTEM' ? 'selected' : ''}>SYSTEM</option>
              </select>

              <input
                type="text"
                id="audit-search-input"
                class="form-control"
                style="font-size: 0.8rem; padding: 0.35rem 0.6rem; width: 180px;"
                placeholder="${isEn ? 'Filter message/source...' : 'Filtrar mensaje/origen...'}"
                value="${escapeHtml(searchQuery)}"
              />
            </div>

            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-audit-json" style="font-size: 0.78rem; padding: 0.35rem 0.6rem;">
                📥 ${isEn ? 'Download JSON' : 'Descargar JSON'}
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-audit-logs" style="font-size: 0.78rem; padding: 0.35rem 0.6rem; color: #ef4444;">
                🗑️ ${isEn ? 'Clear' : 'Limpiar'}
              </button>
            </div>
          </div>

          <!-- Table of Events -->
          <div style="overflow-x: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); min-height: 240px; flex: 1; flex-shrink: 0; background: var(--bg-card);">
            <table class="legal-table" style="font-size: 0.8rem; margin: 0; width: 100%; min-width: 680px;">
              <thead>
                <tr>
                  <th style="width: 130px;">${isEn ? 'Timestamp' : 'Fecha / Hora'}</th>
                  <th style="width: 100px;">${isEn ? 'Severity' : 'Severidad'}</th>
                  <th style="width: 120px;">${isEn ? 'Category' : 'Categoría'}</th>
                  <th>${isEn ? 'Redacted Message & Details' : 'Mensaje Redactado & Detalles'}</th>
                  <th style="width: 100px;">${isEn ? 'Source' : 'Origen'}</th>
                </tr>
              </thead>
              <tbody>
                ${filteredLogs.length === 0
                  ? `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">${isEn ? 'No log entries match the current filter criteria.' : 'No hay registros que coincidan con los filtros seleccionados.'}</td></tr>`
                  : filteredLogs.map((evt) => {
                      const timeStr = new Date(evt.timestamp).toLocaleTimeString();
                      let badgeClass = 'badge-neutral';
                      let badgeIcon = 'ℹ️';
                      if (evt.level === 'SUSPICIOUS') {
                        badgeClass = 'badge-warning';
                        badgeIcon = '⚠️';
                      } else if (evt.level === 'ERROR') {
                        badgeClass = 'badge-danger';
                        badgeIcon = '❌';
                      } else if (evt.level === 'WARN') {
                        badgeClass = 'badge-warning';
                        badgeIcon = '⚡';
                      } else {
                        badgeClass = 'badge-success';
                        badgeIcon = '✓';
                      }

                      const metaJson = evt.metadata ? JSON.stringify(evt.metadata) : '';
                      return `
                        <tr>
                          <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); white-space: nowrap;">
                            ${timeStr}
                          </td>
                          <td>
                            <span class="badge ${badgeClass}" style="font-size: 0.7rem; font-weight: 600;">
                              ${badgeIcon} ${evt.level}
                            </span>
                          </td>
                          <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan, #0284c7);">
                            ${evt.category}
                          </td>
                          <td style="line-height: 1.4;">
                            <div style="font-weight: 500; color: var(--text-main);">${escapeHtml(evt.message)}</div>
                            ${metaJson ? `<pre style="font-size: 0.7rem; background: var(--bg-hover); padding: 0.25rem 0.4rem; border-radius: 3px; margin: 0.25rem 0 0 0; font-family: var(--font-mono); color: var(--text-dim); overflow-x: auto;">${escapeHtml(metaJson)}</pre>` : ''}
                          </td>
                          <td style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);">
                            ${escapeHtml(evt.source)}
                          </td>
                        </tr>
                      `;
                    }).join('')
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer" style="padding: 0.75rem 1.25rem; display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-primary" id="btn-close-audit-modal-footer">
            ${isEn ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    `;

    // Event listeners
    modal.querySelector('#btn-close-audit-modal')?.addEventListener('click', closeModal);
    modal.querySelector('#btn-close-audit-modal-footer')?.addEventListener('click', closeModal);

    modal.querySelector('#audit-filter-level')?.addEventListener('change', (e) => {
      selectedLevel = (e.target as HTMLSelectElement).value;
      renderContent();
    });

    modal.querySelector('#audit-filter-category')?.addEventListener('change', (e) => {
      selectedCategory = (e.target as HTMLSelectElement).value;
      renderContent();
    });

    modal.querySelector('#audit-search-input')?.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      renderContent();
    });

    modal.querySelector('#btn-export-audit-json')?.addEventListener('click', () => {
      const json = securityAuditLogger.exportLogsJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orientsol_audit_log_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    modal.querySelector('#btn-clear-audit-logs')?.addEventListener('click', () => {
      if (confirm(isEn ? 'Clear all local audit logs?' : '¿Vaciar todos los registros de auditoría locales?')) {
        securityAuditLogger.clearLogs();
        renderContent();
      }
    });
  }

  function closeModal(): void {
    modal.remove();
    activeAuditModalEl = null;
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  renderContent();
  document.body.appendChild(modal);
  activeAuditModalEl = modal;
}
