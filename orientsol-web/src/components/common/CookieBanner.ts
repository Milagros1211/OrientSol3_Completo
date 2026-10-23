import { i18n } from '@/i18n';
import { openLegalPoliciesModal } from '@/components/modals/LegalPoliciesModal';

const STORAGE_KEY = 'orientsol_cookie_consent';

export function renderCookieBanner(): HTMLElement | null {
  // If user already gave consent or interacted with banner, don't show it again
  if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) {
    return null;
  }

  const isEn = i18n.getLocale() === 'en';

  const existing = document.getElementById('orientsol-cookie-banner');
  if (existing) {
    existing.remove();
  }

  const banner = document.createElement('aside');
  banner.id = 'orientsol-cookie-banner';
  banner.className = 'cookie-banner-container';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', isEn ? 'Cookie & Privacy Consent' : 'Consentimiento de Privacidad y Cookies');

  banner.innerHTML = `
    <div class="cookie-banner-content">
      <div class="cookie-banner-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      </div>
      <div class="cookie-banner-text-group">
        <p class="cookie-banner-title">
          <strong>${isEn ? 'Privacy Notice & Technical Storage' : 'Aviso de Privacidad & Almacenamiento Técnico'}</strong>
          <span class="cookie-badge">${isEn ? 'GDPR / LOPDGDD Compliant' : 'Conforme a RGPD y LOPDGDD'}</span>
        </p>
        <p class="cookie-banner-desc">
          ${isEn 
            ? 'OrientSol 4.0 uses only strictly necessary technical local storage (theme, language, and station cache for 100% offline calculations). <strong>We use ZERO advertising cookies, ZERO tracking pixels, and NO commercial profiling</strong>. Compliant with EU ePrivacy Directive & Spanish Law (Art. 22.2 LSSI-CE).'
            : 'OrientSol 4.0 utiliza únicamente almacenamiento local técnico estrictamente necesario (modo de color, idioma y caché meteorológica para operar 100% offline). <strong>No utilizamos cookies publicitarias, ni píxeles de seguimiento ni rastreo comercial</strong>. Conforme a la Directiva europea ePrivacy y al Art. 22.2 de la LSSI-CE.'}
        </p>
      </div>
    </div>
    <div class="cookie-banner-actions">
      <button type="button" class="btn cookie-btn-settings" id="cookie-btn-settings">
        ${isEn ? 'Configure / Details' : 'Configurar / Detalles'}
      </button>
      <button type="button" class="btn cookie-btn-essential" id="cookie-btn-essential">
        ${isEn ? 'Strictly Necessary Only' : 'Solo Técnicas'}
      </button>
      <button type="button" class="btn btn-primary cookie-btn-accept" id="cookie-btn-accept">
        ✓ ${isEn ? 'Accept All Technical' : 'Aceptar Técnicas'}
      </button>
    </div>
  `;

  const acceptBtn = banner.querySelector('#cookie-btn-accept');
  const essentialBtn = banner.querySelector('#cookie-btn-essential');
  const settingsBtn = banner.querySelector('#cookie-btn-settings');

  const dismiss = (consentType: string) => {
    localStorage.setItem(STORAGE_KEY, consentType);
    banner.classList.add('cookie-banner-hiding');
    setTimeout(() => {
      banner.remove();
    }, 250);
  };

  acceptBtn?.addEventListener('click', () => dismiss('accepted_all'));
  essentialBtn?.addEventListener('click', () => dismiss('essential_only'));
  settingsBtn?.addEventListener('click', () => {
    openLegalPoliciesModal('cookies');
  });

  document.body.appendChild(banner);
  return banner;
}
