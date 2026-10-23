import { i18n } from '@/i18n';
import { escapeHtml } from '@/utils/security';
import { themeManager } from '@/services/theme/themeManager';

export interface DeepLinkActionDetails {
  actionType: 'REGISTER_CLIMATE' | 'SYNC_DATABASE' | 'CLEAR_DATA' | 'CONFIG_BACKEND';
  sourceUrl: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
}

export function promptDeepLinkActionConfirmation(
  details: DeepLinkActionDetails
): Promise<boolean> {
  return new Promise((resolve) => {
    const isEn = i18n.getLocale() === 'en';

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop deeplink-modal-backdrop';
    modal.id = 'deeplink-confirmation-modal';
    modal.setAttribute('data-theme', themeManager.getTheme());
    modal.style.zIndex = '10000';

    const paramEntries = Object.entries(details.parameters);

    modal.innerHTML = `
      <div class="modal-dialog audit-dialog" role="dialog" aria-modal="true" style="max-width: 560px; width: 92%;">
        <div class="modal-header" style="border-bottom: 1px solid var(--border-subtle); padding: 1rem 1.25rem;">
          <div class="modal-title-group">
            <div class="panel-icon modal-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.05rem; margin: 0; color: var(--text-main);">
                ${isEn ? 'Authorize External Link Action' : 'Autorización de Acción por Enlace Externo'}
              </h3>
              <p class="modal-subtitle" style="font-size: 0.8rem; margin: 0.2rem 0 0 0; color: var(--text-muted);">
                ${isEn
                  ? 'A deep link or external request is attempting to perform a sensitive action.'
                  : 'Un enlace externo (Deep Link) está solicitando ejecutar una acción en la aplicación.'}
              </p>
            </div>
          </div>
        </div>

        <div class="modal-body" style="padding: 1.25rem; font-size: 0.86rem; line-height: 1.5; color: var(--text-main);">
          <div class="result-card highlight-card" style="border-left: 4px solid #f59e0b; margin-bottom: 1rem; padding: 0.85rem;">
            <div style="font-weight: 600; margin-bottom: 0.25rem; color: #f59e0b;">${escapeHtml(details.title)}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(details.description)}</div>
          </div>

          <div style="font-size: 0.8rem; margin-bottom: 0.75rem;">
            <strong>${isEn ? 'Requested by Link:' : 'Enlace Origen:'}</strong>
            <code style="word-break: break-all; display: block; background: var(--bg-hover); padding: 0.35rem 0.5rem; border-radius: 4px; margin-top: 0.25rem; font-size: 0.75rem; color: var(--accent-cyan, #0284c7);">
              ${escapeHtml(details.sourceUrl)}
            </code>
          </div>

          ${paramEntries.length > 0 ? `
            <div style="margin-bottom: 1rem;">
              <strong style="font-size: 0.8rem; display: block; margin-bottom: 0.3rem;">
                ${isEn ? 'Parameters to be applied:' : 'Parámetros a aplicar:'}
              </strong>
              <div style="background: var(--bg-hover); padding: 0.5rem 0.75rem; border-radius: 4px; font-size: 0.76rem; font-family: var(--font-mono); max-height: 120px; overflow-y: auto;">
                ${paramEntries.map(([k, v]) => `<div><span style="color: var(--text-dim);">${escapeHtml(k)}:</span> <strong>${escapeHtml(String(v))}</strong></div>`).join('')}
              </div>
            </div>
          ` : ''}

          <p style="font-size: 0.78rem; color: var(--text-dim); margin: 0; line-height: 1.4;">
            ${isEn
              ? 'Security Notice: To protect your data, OrientSol never executes mutations without your explicit consent.'
              : 'Aviso de Seguridad: Para proteger tus datos, OrientSol nunca ejecuta modificaciones sin tu consentimiento expreso.'}
          </p>
        </div>

        <div class="modal-footer" style="padding: 0.85rem 1.25rem; display: flex; justify-content: flex-end; gap: 0.6rem; border-top: 1px solid var(--border-subtle);">
          <button type="button" class="btn btn-secondary" id="btn-reject-deeplink" style="font-size: 0.84rem; padding: 0.45rem 0.9rem;">
            ${isEn ? 'Cancel / Reject' : 'Cancelar / Rechazar'}
          </button>
          <button type="button" class="btn btn-primary" id="btn-confirm-deeplink" style="font-size: 0.84rem; padding: 0.45rem 1rem; background: #f59e0b; border-color: #f59e0b; color: #000; font-weight: 600;">
            ${isEn ? 'Authorize Action' : 'Autorizar Acción'}
          </button>
        </div>
      </div>
    `;

    function close(confirmed: boolean): void {
      modal.remove();
      resolve(confirmed);
    }

    modal.querySelector('#btn-confirm-deeplink')?.addEventListener('click', () => close(true));
    modal.querySelector('#btn-reject-deeplink')?.addEventListener('click', () => close(false));

    document.body.appendChild(modal);
  });
}
