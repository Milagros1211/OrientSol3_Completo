import { pyodideService } from '@/services/pyodide';
import { climateDatabaseService } from '@/services/supabase';
import { openSupabaseSyncModal } from '@/components/supabase/SupabaseSyncModal';
import { i18n } from '@/i18n';

export function renderHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'app-header';

  const t = i18n.t;
  const currentLocale = i18n.getLocale();
  const isEn = currentLocale === 'en';
  const queueCount = climateDatabaseService.getOfflineQueueCount();
  const isConfigured = climateDatabaseService.isConfigured();
  const isOnline = climateDatabaseService.isOnline();

  header.innerHTML = `
    <div class="header-brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      </div>
      <div>
        <h1 class="brand-title">${t.common.appName} <span class="brand-badge">${t.common.versionBadge}</span></h1>
        <p class="brand-subtitle">${t.common.subtitle}</p>
      </div>
    </div>
    <div class="header-actions">
      <!-- Supabase Connection & Offline Sync Pill -->
      <button id="supabase-sync-pill" class="runtime-pill status-supabase" type="button" title="${isEn ? 'Supabase Connection & Offline Sync' : 'Conexión y Sincronización Supabase'}">
        <span class="status-dot ${isConfigured && isOnline ? 'status-dot-active' : ''}"></span>
        <span id="supabase-status-text">
          ☁️ Supabase ${queueCount > 0 ? `<span class="pill-badge-counter">${queueCount}</span>` : ''}
        </span>
      </button>

      <!-- Language Switcher Toggle -->
      <div class="lang-switch-group" role="group" aria-label="${t.header.langSelect}">
        <button type="button" class="lang-btn ${currentLocale === 'es' ? 'active' : ''}" data-lang="es" title="${t.header.toggleSpanish}">
          <span class="flag-icon">🇪🇸</span> <span>ES</span>
        </button>
        <button type="button" class="lang-btn ${currentLocale === 'en' ? 'active' : ''}" data-lang="en" title="${t.header.toggleEnglish}">
          <span class="flag-icon">🇬🇧</span> <span>EN</span>
        </button>
      </div>

      <div id="pyodide-runtime-pill" class="runtime-pill status-loading">
        <span class="status-dot"></span>
        <span id="pyodide-status-text">${t.header.statusLoading.replace('{progress}', '0')}</span>
      </div>
      <a href="https://github.com" target="_blank" class="header-link" title="${t.common.docs}">
        ${t.common.docs}
      </a>
    </div>
  `;

  // Attach Supabase sync modal event
  const supabasePill = header.querySelector<HTMLButtonElement>('#supabase-sync-pill');
  supabasePill?.addEventListener('click', (e) => {
    e.preventDefault();
    openSupabaseSyncModal();
  });

  // Subscribe to Supabase database state updates (queue count, etc.)
  climateDatabaseService.subscribe(() => {
    const textEl = header.querySelector('#supabase-status-text');
    const dotEl = header.querySelector('#supabase-sync-pill .status-dot');
    if (!textEl) return;
    const count = climateDatabaseService.getOfflineQueueCount();
    const configured = climateDatabaseService.isConfigured();
    const online = climateDatabaseService.isOnline();
    textEl.innerHTML = `☁️ Supabase ${count > 0 ? `<span class="pill-badge-counter">${count}</span>` : ''}`;
    if (dotEl) {
      dotEl.className = `status-dot ${configured && online ? 'status-dot-active' : ''}`;
    }
  });

  // Attach language switcher events
  header.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetLang = btn.dataset.lang as 'es' | 'en';
      if (targetLang && targetLang !== i18n.getLocale()) {
        i18n.setLocale(targetLang);
      }
    });
  });

  // Subscribe to Pyodide service updates
  pyodideService.subscribe((state) => {
    const pill = header.querySelector('#pyodide-runtime-pill');
    const text = header.querySelector('#pyodide-status-text');
    if (!pill || !text) return;

    pill.className = `runtime-pill status-${state.status}`;
    const currT = i18n.t;
    if (state.status === 'idle') {
      text.textContent = currT.header.statusIdle;
    } else if (state.status === 'loading') {
      text.textContent = currT.header.statusLoading.replace('{progress}', String(state.loadProgress));
    } else if (state.status === 'ready') {
      text.textContent = currT.header.statusReady.replace('{version}', state.pythonVersion || '3.14');
    } else if (state.status === 'error') {
      text.textContent = currT.header.statusError;
    }
  });

  return header;
}
