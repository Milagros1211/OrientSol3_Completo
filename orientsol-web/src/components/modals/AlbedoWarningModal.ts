/**
 * MATLAB OrientSol 3.0 / 4.0 Albedo Warning Modal
 * Reproduces Figura 5.2.48:
 * "Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0"
 */

export function showAlbedoWarningModal(isEn: boolean = false) {
  const existing = document.getElementById('matlab-albedo-warning-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-albedo-warning-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 440px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background: #ece9d8;">
      <div class="matlab-dialog-titlebar" style="background: linear-gradient(to right, #0a246a, #a6caf0); color: #ffffff; padding: 4px 8px; display: flex; justify-content: space-between; align-items: center; font-family: Tahoma, sans-serif; font-size: 11px; font-weight: bold;">
        <span class="matlab-title-text">${isEn ? 'Warning' : 'Aviso'}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar" style="background: #ece9d8; border: 1px solid #7f9db9; font-size: 11px; font-weight: bold; width: 18px; height: 16px; line-height: 14px; text-align: center; cursor: pointer; color: #000;">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 16px 20px; display: flex; align-items: center; gap: 16px; background: #ece9d8;">
        <div class="matlab-dialog-icon" style="flex-shrink: 0;">
          <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
            <path d="M24 4L2 42h44L24 4z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
            <path d="M24 16v14" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
            <circle cx="24" cy="35" r="2.5" fill="#ffffff"/>
          </svg>
        </div>
        <p class="matlab-dialog-msg" style="margin: 0; font-family: Tahoma, 'Segoe UI', sans-serif; font-size: 12px; color: #000000; line-height: 1.45;">
          ${isEn
            ? 'Albedo gains relative to the horizontal plane cannot be calculated, as Rdm(0°) = 0'
            : 'Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0'}
        </p>
      </div>
      <div class="matlab-dialog-actions" style="padding: 10px 16px 14px; display: flex; justify-content: center; background: #ece9d8; border-top: 1px solid #d4d0c8;">
        <button type="button" class="matlab-btn-default btn-close-modal" style="min-width: 75px; padding: 4px 16px; font-family: Tahoma, sans-serif; font-size: 11px; cursor: pointer; background: #ece9d8; border: 1px solid #003c74; border-radius: 2px; box-shadow: inset 1px 1px 0 #fff, 1px 1px 2px rgba(0,0,0,0.2);">OK</button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.querySelector('.btn-close-modal')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Esc key to close
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', onKeyDown);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  document.body.appendChild(backdrop);
  (backdrop.querySelector('.btn-close-modal') as HTMLButtonElement)?.focus();
}
