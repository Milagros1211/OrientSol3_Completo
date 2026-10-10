import {
  climateDatabaseService,
  type SyncSummary,
} from '@/services/supabase/climateDatabaseService';
import {
  getEffectiveSupabaseConfig,
  setSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
} from '@/services/supabase/supabaseClient';
import { i18n } from '@/i18n';

let activeModalEl: HTMLElement | null = null;

export function openSupabaseSyncModal(): void {
  if (activeModalEl) {
    activeModalEl.remove();
  }

  const isEn = i18n.getLocale() === 'en';
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'supabase-sync-modal';

  const config = getEffectiveSupabaseConfig();
  const isOnline = climateDatabaseService.isOnline();
  const isConfigured = climateDatabaseService.isConfigured();
  const queue = climateDatabaseService.getOfflineQueue();

  modal.innerHTML = `
    <div class="modal-dialog supabase-dialog">
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="panel-icon modal-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          </div>
          <div>
            <h3 class="modal-title">${isEn ? 'Supabase Database & Offline Sync' : 'Base de Datos Supabase & Sincronización Offline'}</h3>
            <p class="modal-subtitle">${isEn ? 'Automatic cloud persistence & offline cache with >=90% duplicate detection' : 'Persistencia automática en la nube y caché offline con detección de duplicados (≥90%)'}</p>
          </div>
        </div>
        <button type="button" class="btn-close" id="btn-close-modal" aria-label="Close">&times;</button>
      </div>

      <div class="modal-body">
        <!-- 1. Connection Status Banner -->
        <div class="supabase-status-banner">
          <div class="status-indicator-col">
            <span class="status-label">${isEn ? 'Internet Connection:' : 'Conexión a Internet:'}</span>
            <span class="badge ${isOnline ? 'badge-success' : 'badge-neutral'}">
              ${isOnline ? (isEn ? '● Online' : '● En línea') : (isEn ? '○ Offline' : '○ Sin conexión')}
            </span>
          </div>
          <div class="status-indicator-col">
            <span class="status-label">${isEn ? 'Supabase Cloud:' : 'Nube Supabase:'}</span>
            <span id="supabase-cloud-badge" class="badge ${isConfigured ? 'badge-success' : 'badge-neutral'}">
              ${isConfigured ? (isEn ? '✓ Configured' : '✓ Configurado') : (isEn ? '⚠ Unconfigured' : '⚠ Sin configurar')}
            </span>
          </div>
          <div class="status-indicator-col">
            <span class="status-label">${isEn ? 'Offline Queue:' : 'Cola Offline:'}</span>
            <span id="supabase-queue-badge" class="badge ${queue.length > 0 ? 'badge-amber' : 'badge-neutral'}">
              ${queue.length} ${isEn ? 'pending' : 'pendientes'}
            </span>
          </div>
        </div>

        <!-- 2. Supabase Configuration Section -->
        <div class="modal-section-card">
          <h4 class="section-card-title">${isEn ? 'Supabase Project Credentials' : 'Credenciales del Proyecto Supabase'}</h4>
          <p class="section-card-desc">
            ${isEn
              ? 'Enter your Supabase project URL and public Anon Key (stored securely in local browser cache).'
              : 'Introduce la URL de tu proyecto Supabase y la clave pública Anon (se guardan de forma segura en tu navegador).'}
          </p>

          <div class="form-grid supabase-form-grid">
            <div class="form-group">
              <label for="input-supabase-url" class="form-label">${isEn ? 'Project URL (VITE_SUPABASE_URL)' : 'URL del Proyecto (VITE_SUPABASE_URL)'}</label>
              <input type="text" id="input-supabase-url" class="form-input" placeholder="https://xyzproject.supabase.co" value="${config.url}" />
            </div>
            <div class="form-group">
              <label for="input-supabase-key" class="form-label">${isEn ? 'Public Anon Key (VITE_SUPABASE_ANON_KEY)' : 'Clave Pública Anon (VITE_SUPABASE_ANON_KEY)'}</label>
              <input type="password" id="input-supabase-key" class="form-input" placeholder="PLACEHOLDER_TOKEN..." value="${config.key}" />
            </div>
          </div>

          <div class="supabase-actions-row">
            <button id="btn-save-credentials" type="button" class="btn btn-secondary btn-sm">
              ${isEn ? 'Save Credentials' : 'Guardar Credenciales'}
            </button>
            <button id="btn-test-connection" type="button" class="btn btn-primary btn-sm">
              ${isEn ? 'Test Connection' : 'Probar Conexión'}
            </button>
            <button id="btn-clear-credentials" type="button" class="btn btn-ghost btn-sm">
              ${isEn ? 'Clear' : 'Limpiar'}
            </button>
          </div>
          <div id="connection-test-feedback" class="connection-feedback-box hidden"></div>
        </div>

        <!-- 3. Offline Sync Queue Section -->
        <div class="modal-section-card">
          <div class="section-card-header-flex">
            <div>
              <h4 class="section-card-title">${isEn ? 'Offline Datasets Queue' : 'Cola de Emplazamientos Offline'}</h4>
              <p class="section-card-desc">
                ${isEn
                  ? 'Locations entered while offline or unconfigured. Synced locations with >=90% similarity in numerical data are detected as duplicates.'
                  : 'Emplazamientos ingresados en modo offline. Los datos con ≥90% de coincidencia numérica se detectan como ya registrados.'}
              </p>
            </div>
            ${queue.length > 0 ? `
              <div class="queue-actions-group">
                <button id="btn-trigger-sync" type="button" class="btn btn-solar btn-sm">
                  🚀 ${isEn ? 'Sync to Supabase Now' : 'Sincronizar a Supabase Ahora'}
                </button>
                <button id="btn-clear-queue" type="button" class="btn btn-ghost btn-sm" title="${isEn ? 'Discard queue' : 'Vaciar cola'}">
                  🗑️
                </button>
              </div>
            ` : ''}
          </div>

          <div id="offline-queue-container" class="offline-queue-wrapper">
            ${renderQueueItemsMarkup(queue, isEn)}
          </div>

          <div id="sync-results-box" class="sync-results-box hidden"></div>
        </div>
      </div>

      <div class="modal-footer">
        <span class="modal-footer-hint">
          ℹ️ ${isEn ? 'Duplicate Rule: At least 90% match in monthly solar & temperature curves.' : 'Regla de Integridad: Al menos 90% de coincidencia en curvas de radiación y temperatura.'}
        </span>
        <button type="button" class="btn btn-secondary" id="btn-modal-close-footer">${isEn ? 'Close' : 'Cerrar'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  activeModalEl = modal;

  // Prevent background scroll
  document.body.style.overflow = 'hidden';

  // Event handlers
  const closeModal = () => {
    modal.remove();
    activeModalEl = null;
    document.body.style.overflow = '';
  };

  modal.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);
  modal.querySelector('#btn-modal-close-footer')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Credential action handlers
  const urlInput = modal.querySelector<HTMLInputElement>('#input-supabase-url')!;
  const keyInput = modal.querySelector<HTMLInputElement>('#input-supabase-key')!;
  const feedbackBox = modal.querySelector<HTMLElement>('#connection-test-feedback')!;

  modal.querySelector('#btn-save-credentials')?.addEventListener('click', () => {
    const url = urlInput.value.trim();
    const key = keyInput.value.trim();
    setSupabaseCredentials(url, key);
    feedbackBox.className = 'connection-feedback-box feedback-success';
    feedbackBox.textContent = isEn ? '✓ Credentials saved successfully.' : '✓ Credenciales guardadas correctamente.';
    feedbackBox.classList.remove('hidden');
    updateCloudBadge();
  });

  modal.querySelector('#btn-test-connection')?.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const key = keyInput.value.trim();
    setSupabaseCredentials(url, key);

    feedbackBox.className = 'connection-feedback-box feedback-info';
    feedbackBox.textContent = isEn ? 'Testing connection to Supabase table climate_locations...' : 'Comprobando conexión con la tabla climate_locations...';
    feedbackBox.classList.remove('hidden');

    const result = await testSupabaseConnection();
    if (result.ok) {
      feedbackBox.className = 'connection-feedback-box feedback-success';
      feedbackBox.textContent = `✓ ${result.message}`;
    } else {
      feedbackBox.className = 'connection-feedback-box feedback-error';
      feedbackBox.textContent = `✗ ${result.message}`;
    }
    updateCloudBadge();
  });

  modal.querySelector('#btn-clear-credentials')?.addEventListener('click', () => {
    clearSupabaseCredentials();
    urlInput.value = '';
    keyInput.value = '';
    feedbackBox.className = 'connection-feedback-box feedback-info';
    feedbackBox.textContent = isEn ? 'Credentials cleared.' : 'Credenciales eliminadas.';
    feedbackBox.classList.remove('hidden');
    updateCloudBadge();
  });

  function updateCloudBadge() {
    const cloudBadge = modal.querySelector('#supabase-cloud-badge');
    if (cloudBadge) {
      const configured = climateDatabaseService.isConfigured();
      cloudBadge.className = `badge ${configured ? 'badge-success' : 'badge-neutral'}`;
      cloudBadge.textContent = configured
        ? (isEn ? '✓ Configured' : '✓ Configurado')
        : (isEn ? '⚠ Unconfigured' : '⚠ Sin configurar');
    }
  }

  // Queue actions
  const queueContainer = modal.querySelector<HTMLElement>('#offline-queue-container')!;
  const syncResultsBox = modal.querySelector<HTMLElement>('#sync-results-box')!;

  modal.querySelector('#btn-clear-queue')?.addEventListener('click', () => {
    if (confirm(isEn ? 'Clear all pending offline datasets?' : '¿Vaciar todos los emplazamientos pendientes de la cola offline?')) {
      climateDatabaseService.clearOfflineQueue();
      queueContainer.innerHTML = renderQueueItemsMarkup([], isEn);
      modal.querySelector('#btn-trigger-sync')?.remove();
      modal.querySelector('#btn-clear-queue')?.remove();
      const queueBadge = modal.querySelector('#supabase-queue-badge');
      if (queueBadge) queueBadge.textContent = `0 ${isEn ? 'pending' : 'pendientes'}`;
    }
  });

  modal.querySelector('#btn-trigger-sync')?.addEventListener('click', async () => {
    const syncBtn = modal.querySelector<HTMLButtonElement>('#btn-trigger-sync');
    if (syncBtn) {
      syncBtn.disabled = true;
      syncBtn.innerHTML = `⏳ ${isEn ? 'Syncing...' : 'Sincronizando...'}`;
    }

    try {
      const summary: SyncSummary = await climateDatabaseService.syncOfflineQueue();
      syncResultsBox.classList.remove('hidden');
      syncResultsBox.innerHTML = `
        <div class="sync-summary-header">
          <strong>${isEn ? 'Sync Completed' : 'Sincronización Completada'}:</strong>
          <span>${summary.inserted} ${isEn ? 'inserted' : 'insertados'}</span> |
          <span>${summary.duplicates} ${isEn ? 'already registered (>=90% match)' : 'ya registrados (≥90% coincidencia)'}</span>
          ${summary.errors > 0 ? `| <span style="color:#ef4444">${summary.errors} ${isEn ? 'errors' : 'errores'}</span>` : ''}
        </div>
        <ul class="sync-summary-list">
          ${summary.details
            .map(
              (d) => `
            <li class="sync-detail-${d.status}">
              ${d.status === 'inserted' ? '✓' : d.status === 'duplicate' ? 'ℹ' : '✗'} ${d.message}
            </li>
          `
            )
            .join('')}
        </ul>
      `;

      const newQueue = climateDatabaseService.getOfflineQueue();
      queueContainer.innerHTML = renderQueueItemsMarkup(newQueue, isEn);
      const queueBadge = modal.querySelector('#supabase-queue-badge');
      if (queueBadge) queueBadge.textContent = `${newQueue.length} ${isEn ? 'pending' : 'pendientes'}`;
    } catch (err: any) {
      syncResultsBox.classList.remove('hidden');
      syncResultsBox.innerHTML = `
        <div class="sync-summary-error">
          <strong>${isEn ? 'Sync Failed' : 'Fallo en la Sincronización'}:</strong> ${err.message || String(err)}
        </div>
      `;
    } finally {
      if (syncBtn) {
        syncBtn.disabled = false;
        syncBtn.innerHTML = `🚀 ${isEn ? 'Sync to Supabase Now' : 'Sincronizar a Supabase Ahora'}`;
      }
    }
  });
}

function renderQueueItemsMarkup(queue: any[], isEn: boolean): string {
  if (queue.length === 0) {
    return `
      <div class="empty-queue-msg">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" style="color: #10b981; margin-bottom: 0.5rem;">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <p>${isEn ? 'No offline datasets pending. Local cache is synchronized.' : 'No hay emplazamientos pendientes en cola offline. Todos los datos están sincronizados.'}</p>
      </div>
    `;
  }

  return `
    <div class="queue-list">
      ${queue
        .map((item, idx) => {
          const annualG = item.monthlyGdm0?.reduce((a: number, b: number) => a + b, 0) / 12 || 0;
          return `
          <div class="queue-item-card">
            <div class="queue-item-info">
              <strong>${idx + 1}. ${item.locationName} (${item.country || 'España'})</strong>
              <span class="queue-item-meta">
                Lat: ${item.latitude.toFixed(3)}°, Lon: ${item.longitude.toFixed(3)}° | Gdm(0): ${annualG.toFixed(2)} kWh/m²/d
              </span>
            </div>
            <span class="badge badge-amber">${isEn ? 'Pending Cloud Sync' : 'Pendiente de Subida'}</span>
          </div>
        `;
        })
        .join('')}
    </div>
  `;
}
