export type ExportTargetType = 'excel' | 'pdf';
export type ExportComponentChoice = 'single' | 'all';

export interface ShowExportChoiceModalOptions {
  exportType: ExportTargetType;
  activeComponent?: string;
  isEn?: boolean;
  onConfirm: (mode: ExportComponentChoice) => void;
}

/**
 * Universal interactive prompt dialog matching OrientSol 3.0 / MATLAB Figura 5.2.65.
 * Prompts the user before exporting to Excel or PDF whether to export only the current
 * analyzed component or the complete analysis of all radiation components.
 */
export function showExportComponentChoiceModal(options: ShowExportChoiceModalOptions): void {
  const { exportType, activeComponent = 'global', isEn = false, onConfirm } = options;

  const existing = document.getElementById('matlab-export-choice-modal');
  if (existing) existing.remove();

  const compLabel =
    activeComponent === 'beam'
      ? (isEn ? 'Direct' : 'Directa')
      : activeComponent === 'diffuse'
      ? (isEn ? 'Diffuse' : 'Difusa')
      : activeComponent === 'albedo'
      ? (isEn ? 'Albedo' : 'Albedo')
      : (isEn ? 'Global' : 'Global');

  const titleText = isEn ? 'Select the desired option' : 'Seleccione la opción deseada';
  const msgText =
    exportType === 'excel'
      ? (isEn ? 'What would you like to export to an Excel file?' : '¿Qué desea exportar a un fichero Excel?')
      : (isEn ? 'What would you like to export in the PDF report?' : '¿Qué desea exportar en el informe PDF?');

  const singleBtnText = isEn
    ? `Only analyzed component (${compLabel})`
    : `Sólo la componente analizada (${compLabel})`;

  const allBtnText = isEn
    ? 'All components analysis'
    : 'El análisis de todas las componentes';

  const backdrop = document.createElement('div');
  backdrop.id = 'matlab-export-choice-modal';
  backdrop.className = 'matlab-modal-backdrop';

  backdrop.innerHTML = `
    <div class="matlab-dialog-box" role="dialog" aria-modal="true" style="max-width: 540px;">
      <div class="matlab-dialog-titlebar">
        <span class="matlab-title-text">${titleText}</span>
        <button type="button" class="matlab-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="matlab-dialog-body" style="padding: 1.5rem 1.25rem;">
        <div class="matlab-dialog-icon">
          <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
            <circle cx="24" cy="24" r="22" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
            <path d="M19 18a5 5 0 0 1 10 0c0 3-4 4.5-4 7m0 5.5h.01" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="matlab-dialog-msg" style="flex: 1;">
          <p style="margin: 0; font-weight: 700; font-size: 1rem; color: var(--text-main, #0f172a);">
            ${msgText}
          </p>
          <p style="margin: 0.35rem 0 0; font-size: 0.84rem; color: var(--text-muted, #475569);">
            ${isEn
              ? (exportType === 'excel'
                  ? 'Option "All components" creates separate sheets with the full calculation matrix for Global, Direct, Diffuse, and Albedo.'
                  : 'Option "All components" replicates the complete calculation matrix, monthly cards, and engineering insights across dedicated pages for all 4 components.')
              : (exportType === 'excel'
                  ? 'La opción "Todas las componentes" generará hojas completas de cálculo para Global, Directa, Difusa y Albedo.'
                  : 'La opción "Todas las componentes" copiará el análisis completo, tarjetas mensuales e insights en páginas dedicadas para las 4 componentes.')}
          </p>
        </div>
      </div>
      <div class="matlab-dialog-actions" style="justify-content: center; gap: 1rem; padding: 0.85rem 1.25rem 1.25rem;">
        <button type="button" id="btn-choice-single" class="matlab-btn-default" style="font-weight: 600; padding: 0.6rem 1.25rem;">
          ${singleBtnText}
        </button>
        <button type="button" id="btn-choice-all" class="matlab-btn-primary" style="font-weight: 700; padding: 0.6rem 1.35rem;">
          ${allBtnText}
        </button>
      </div>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.querySelector('.matlab-close-btn')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', onKey);
    }
  };
  window.addEventListener('keydown', onKey);

  backdrop.querySelector('#btn-choice-single')?.addEventListener('click', () => {
    close();
    window.removeEventListener('keydown', onKey);
    onConfirm('single');
  });

  backdrop.querySelector('#btn-choice-all')?.addEventListener('click', () => {
    close();
    window.removeEventListener('keydown', onKey);
    onConfirm('all');
  });

  document.body.appendChild(backdrop);
}
