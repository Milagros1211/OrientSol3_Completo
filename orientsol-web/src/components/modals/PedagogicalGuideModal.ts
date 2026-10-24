/**
 * OrientSol 4.0 - Pedagogical Guide Modal
 * Provides in-depth, didactic explanations and pedagogical audit verdicts
 * for the 3 climate tabs (Official Catalog, Manual Entry, and File Import).
 */

import { escapeHtml } from '@/utils/security';
import { themeManager } from '@/services/theme/themeManager';

let activePedagogicalModalEl: HTMLElement | null = null;

export function openPedagogicalGuideModal(
  tabKey: 'historical' | 'manual' | 'upload',
  isEn: boolean = false
): void {
  if (activePedagogicalModalEl) {
    activePedagogicalModalEl.remove();
    activePedagogicalModalEl = null;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop pedagogical-modal-backdrop';
  modal.id = 'pedagogical-guide-modal';
  modal.setAttribute('data-theme', themeManager.getTheme());

  const getContent = () => {
    switch (tabKey) {
      case 'historical':
        return {
          title: isEn
            ? 'Pedagogical Guide: Official Catalog & Data Provenance'
            : 'Guía Didáctica: Catálogo Oficial (114 Estaciones) y Origen de Datos',
          subtitle: isEn
            ? 'Didactic audit, scientific methodology, and physical meaning of official meteorological records'
            : 'Auditoría didáctica, metodología científica y significado físico de los registros oficiales',
          badge: isEn ? 'Audit: 100% Didactic & Verified ✓' : 'Auditoría: 100% Didáctico y Verificado ✓',
          sections: [
            {
              heading: isEn ? '1. Provenance of Official Climate Records' : '1. Procedencia de los Registros Climáticos Oficiales',
              content: isEn
                ? 'The OrientSol official catalog contains 114 reference stations across Spain and regions of Latin America. These records are normalized from the Official Solar Radiation Atlas of Spain (AEMET/CEDEX) and multi-year homogenized ground radiometric campaigns. They represent the official meteorological benchmark for photovoltaic and solar thermal feasibility studies.'
                : 'El catálogo oficial de OrientSol integra 114 estaciones de referencia distribuidas por la península ibérica, archipiélagos y regiones de Iberoamérica. Proceden de los datos normalizados del Atlas de Radiación Solar de España (AEMET/CEDEX) y series multianuales de estaciones radiométricas terrestres. Constituyen la base oficial de referencia para el cálculo de instalaciones solares según el CTE (Código Técnico de la Edificación).',
            },
            {
              heading: isEn ? '2. Physical Variables Explained' : '2. Variables Físicas Clave en Cada Registro',
              content: isEn
                ? `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>G<sub>dm</sub>(0) [kWh/m²·day]:</strong> Monthly average daily global solar irradiation received on a horizontal surface. It accounts for both direct sunlight and atmospheric diffuse radiation.</li>
                    <li><strong>T<sub>amb</sub> [°C]:</strong> Monthly average 24-hour ambient dry-bulb temperature, used by the PV temperature derating model (NOCT / TONC).</li>
                    <li><strong>Latitude & Longitude:</strong> Precise geographic coordinates necessary for extraterrestrial solar geometry (declination &delta;, solar hour angle &omega;<sub>s</sub>, extraterrestrial radiation G<sub>0d</sub>).</li>
                  </ul>`
                : `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>G<sub>dm</sub>(0) [kWh/m²·día]:</strong> Irradiación solar global media diaria sobre superficie horizontal para cada mes del año. Integra la radiación directa del disco solar y la difusa dispersada por la atmósfera.</li>
                    <li><strong>T<sub>amb</sub> [°C]:</strong> Temperatura media mensual del aire en sombra, fundamental para calcular las pérdidas térmicas en los módulos fotovoltaicos mediante el modelo TONC/NOCT.</li>
                    <li><strong>Latitud y Longitud [°]:</strong> Coordenadas geográficas imprescindibles para la trigonometría astronómica: declinación solar (&delta;), ángulo horario de puesta del sol (&omega;<sub>s</sub>) e irradiación extraterrestre diaria (G<sub>0d</sub>).</li>
                  </ul>`,
            },
            {
              heading: isEn ? '3. Understanding Tags: [ORIENTSOL] vs [LOCAL CACHE]' : '3. Significado de las Etiquetas: [ORIENTSOL] vs [CACHÉ LOCAL]',
              content: isEn
                ? `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong style="color: #0284c7;">[ORIENTSOL]:</strong> Stations hosted in the official cloud database (Supabase) or compiled in the core canonical catalog. Fully verified and shared.</li>
                    <li><strong style="color: #d97706;">[LOCAL CACHE]:</strong> Custom user-uploaded files or offline records stored in your browser's private local storage. They remain fully available for calculation even without internet connection.</li>
                  </ul>`
                : `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong style="color: #0284c7;">[ORIENTSOL]:</strong> Emplazamientos oficiales verificados alojados en la nube (Supabase) o en el catálogo canónico del sistema. Son públicos y accesibles por cualquier usuario.</li>
                    <li><strong style="color: #d97706;">[CACHÉ LOCAL]:</strong> Emplazamientos importados por ti o guardados mientras no tenías conexión a Internet. Se almacenan de forma segura en tu navegador y están listos para calcular en cualquier momento.</li>
                  </ul>`,
            },
            {
              heading: isEn ? '4. Step-by-Step Simulation Flow' : '4. Flujo Didáctico para Simular',
              content: isEn
                ? 'Type your city name in the search box, click on the dropdown match or press "Select Station". The 12-month table updates instantly below. Then, adjust your system parameters (Peak Power, PR, Albedo) and click <strong>"Execute with Python Motor (Pyodide)"</strong> to compute the optimal tilt and monthly energy yield.'
                : 'Escribe el nombre de tu ciudad en el buscador asistido, selecciona el resultado en la lista desplegable o pulsa «Seleccionar Estación». La tabla de 12 meses se actualizará de inmediato. Ajusta los parámetros del generador fotovoltaico (Potencia Pico, PR, Albedo) y haz clic en <strong>«Ejecutar en Motor Python (Pyodide)»</strong> para obtener la inclinación óptima y la energía producida.',
            },
          ],
        };

      case 'manual':
        return {
          title: isEn
            ? 'Pedagogical Guide: Manual Entry, Solar Physics & Albedo'
            : 'Guía Didáctica: Entrada Manual, Geometría Solar y Física del Albedo',
          subtitle: isEn
            ? 'Understanding custom input parameters, ground reflectance, and physical validation ranges'
            : 'Fundamento teórico de los parámetros introducidos, reflectividad del terreno y límites físicos',
          badge: isEn ? 'Audit: 100% Didactic & Verified ✓' : 'Auditoría: 100% Didáctico y Verificado ✓',
          sections: [
            {
              heading: isEn ? '1. Why are Coordinates Essential?' : '1. ¿Por qué son indispensables las Coordenadas Geográficas?',
              content: isEn
                ? 'Solar irradiation on an inclined collector depends directly on the position of the sun in the celestial dome. Knowing the exact Latitude (&phi;) and Longitude (&lambda;) allows OrientSol to compute the solar hour angle, solar declination (&delta;), solar noon time, and extraterrestrial daily radiation (G<sub>0d</sub>) through astronomical algorithms.'
                : 'La irradiación solar recibida por un colector inclinado depende directamente de la trayectoria astronómica del Sol en la bóveda celeste. Conocer la Latitud (&phi;) y Longitud (&lambda;) exactas permite a OrientSol calcular matemáticamente la declinación solar (&delta;), la hora de salida y puesta del sol, el ángulo cenital y la radiación extraterrestre diaria (G<sub>0d</sub>) para cada día medio mensual según la metodología de Liu-Jordan.',
            },
            {
              heading: isEn ? '2. What is Ground Albedo (ρ_g)?' : '2. ¿Qué es el Albedo del Terreno (ρ_g) y qué valor asignar?',
              content: isEn
                ? `<p style="margin: 0 0 0.4rem 0;">The ground albedo (&rho;<sub>g</sub>) represents the fraction of global solar radiation reflected by the surrounding ground towards an inclined photovoltaic surface:</p>
                  <table style="width: 100%; font-size: 0.72rem; border-collapse: collapse; margin-top: 0.35rem;">
                    <thead><tr style="background: rgba(2, 132, 199, 0.1);"><th style="padding: 0.25rem 0.5rem; text-align: left;">Surface Type</th><th style="padding: 0.25rem 0.5rem; text-align: right;">Typical Albedo (ρ_g)</th></tr></thead>
                    <tbody>
                      <tr><td style="padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">Ordinary grass / soil (OrientSol standard)</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold; border-bottom: 1px solid var(--border-subtle);">0.20</td></tr>
                      <tr><td style="padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">Asphalt / Dark roofing</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold; border-bottom: 1px solid var(--border-subtle);">0.15</td></tr>
                      <tr><td style="padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">Light concrete / White gravel</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold; border-bottom: 1px solid var(--border-subtle);">0.30 – 0.35</td></tr>
                      <tr><td style="padding: 0.2rem 0.5rem;">Fresh snow cover</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold;">0.60 – 0.80</td></tr>
                    </tbody>
                  </table>`
                : `<p style="margin: 0 0 0.4rem 0;">El albedo del terreno (&rho;<sub>g</sub>) es el coeficiente adimensional que mide la fracción de radiación solar global reflejada por el entorno hacia la superficie inclinada del panel:</p>
                  <table style="width: 100%; font-size: 0.72rem; border-collapse: collapse; margin-top: 0.35rem;">
                    <thead><tr style="background: rgba(2, 132, 199, 0.1);"><th style="padding: 0.25rem 0.5rem; text-align: left;">Tipo de Terreno Circundante</th><th style="padding: 0.25rem 0.5rem; text-align: right;">Albedo Recomendado (ρ_g)</th></tr></thead>
                    <tbody>
                      <tr><td style="padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">Suelo común / Vegetación (Estándar OrientSol)</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold; border-bottom: 1px solid var(--border-subtle);">0,20</td></tr>
                      <tr><td style="padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">Asfalto / Cubierta oscura</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold; border-bottom: 1px solid var(--border-subtle);">0,15</td></tr>
                      <tr><td style="padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">Hormigón claro / Grava blanca</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold; border-bottom: 1px solid var(--border-subtle);">0,30 – 0,35</td></tr>
                      <tr><td style="padding: 0.2rem 0.5rem;">Nieve fresca persistente</td><td style="padding: 0.2rem 0.5rem; text-align: right; font-weight: bold;">0,60 – 0,80</td></tr>
                    </tbody>
                  </table>`,
            },
            {
              heading: isEn ? '3. Physical Plausibility Ranges' : '3. Rangos de Coherencia Física Auditados',
              content: isEn
                ? 'To ensure scientific validity and protect against calculation errors, OrientSol enforces strict bounds: G<sub>dm</sub>(0) must lie between 0.05 and 14.0 kWh/m²·d (cannot exceed extraterrestrial ceiling G<sub>0d</sub>), and ambient temperature T<sub>amb</sub> between -50°C and 65°C.'
                : 'Para garantizar la validez científica y evitar errores de simulación, OrientSol valida en tiempo real que la irradiación horizontal G<sub>dm</sub>(0) se encuentre en el rango [0,05 a 14,0 kWh/m²·día] (nunca puede superar el techo extraterrestre G<sub>0d</sub>), y que la temperatura ambiente esté en el intervalo [-50°C a +65°C].',
            },
            {
              heading: isEn ? '4. Dual Saving Action: Local vs Cloud' : '4. Acciones de Guardado: Aplicar vs Guardar en Supabase',
              content: isEn
                ? 'Clicking <strong>"Apply Manual Data"</strong> loads the dataset directly into the local motor memory. If you click <strong>"Save to Supabase"</strong>, the station is permanently registered in the official database (datos_mensuales) and will become available in the catalog under [ORIENTSOL].'
                : 'Al pulsar <strong>«Aplicar Datos Manuales»</strong> los datos se inyectan de inmediato en la tarjeta activa para simular localmente. Si pulsas <strong>«Guardar en Supabase»</strong>, el emplazamiento se registra de forma persistente en la nube (tabla datos_mensuales) y pasará a formar parte del catálogo general bajo la etiqueta [ORIENTSOL].',
            },
          ],
        };

      case 'upload':
        return {
          title: isEn
            ? 'Pedagogical Guide: Digital File Import, Formats & Dual Sync'
            : 'Guía Didáctica: Importación Digital CSV/JSON y Sincronización Dual',
          subtitle: isEn
            ? 'File formatting rules, multi-station batch structure, and direct in-tab calculation'
            : 'Estructura de archivos, procesamiento de lotes multi-estación y cálculo directo en pestaña',
          badge: isEn ? 'Audit: 100% Didactic & Verified ✓' : 'Auditoría: 100% Didáctico y Verificado ✓',
          sections: [
            {
              heading: isEn ? '1. Supported File Formats (CSV & JSON)' : '1. Formatos Compatibles (CSV y JSON)',
              content: isEn
                ? 'You can import solar measurements using standard UTF-8 text files (.csv, .json, .txt). Both decimal points (.) and decimal commas (,) are automatically recognized. You can download pre-formatted single-station or multi-station batch templates directly using the buttons above the dropzone.'
                : 'Puedes importar tus mediciones solares mediante archivos de texto estándar UTF-8 (.csv, .json, .txt). El analizador automático detecta tanto puntos decimales (.) como comas decimales (,). Recomendamos descargar las plantillas de ejemplo (individual o lote multi-estación) mediante los botones situados sobre la zona de arrastre.',
            },
            {
              heading: isEn ? '2. Required File Structure' : '2. Estructura Requerida de las Mediciones',
              content: isEn
                ? `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>Location Name:</strong> Name of the facility, city, or year (e.g. <em>Lima2025</em>).</li>
                    <li><strong>Coordinates:</strong> Latitude and Longitude in decimal degrees (e.g. Lat: -12.046, Lon: -77.042).</li>
                    <li><strong>12 Monthly G<sub>dm</sub>(0) values:</strong> January through December in kWh/m²·day.</li>
                    <li><strong>12 Monthly T<sub>amb</sub> values:</strong> Ambient temperature in °C.</li>
                  </ul>`
                : `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>Nombre del Emplazamiento:</strong> Identificador de la estación, localidad o año de medición (ej. <em>Lima2025</em>, <em>Sevilla</em>).</li>
                    <li><strong>Coordenadas Geográficas:</strong> Latitud y Longitud en grados decimales (ej. Lat: 37.389, Lon: -5.984).</li>
                    <li><strong>12 Valores de G<sub>dm</sub>(0):</strong> Irradiación diaria de Enero a Diciembre en kWh/m²·día.</li>
                    <li><strong>12 Valores de T<sub>amb</sub>:</strong> Temperatura ambiente media mensual en °C.</li>
                  </ul>`,
            },
            {
              heading: isEn ? '3. Multi-Station Batch Processing' : '3. Procesamiento de Lotes Multi-Estación',
              content: isEn
                ? 'If your file contains multiple stations (e.g. Arequipa, Cusco, Piura), OrientSol will read and validate all of them simultaneously. Clickable station pills will appear immediately below, allowing you to switch between stations with a single click.'
                : 'Si tu archivo contiene múltiples emplazamientos en un solo documento (ej. un lote con Arequipa, Cusco y Piura), OrientSol los procesará y validará todos en bloque. Aparecerán botones (pills) de selección rápida para alternar entre estaciones con un solo clic.',
            },
            {
              heading: isEn ? '4. Direct In-Tab Calculation' : '4. Selección y Cálculo Directo en esta Misma Pestaña 3',
              content: isEn
                ? 'You do NOT need to leave Tab 3 to simulate! Right after file upload or cloud saving, the station selector and quick-pills appear directly below the dropzone. Selecting any station updates the active table and allows immediate calculation with the Python motor in the bottom bar.'
                : '¡No necesitas abandonar la Pestaña 3 para calcular! Inmediatamente tras cargar el archivo o sincronizarlo con la nube, el selector de texto y las píldoras interactivas se muestran aquí mismo. Al elegir cualquier emplazamiento, se actualiza la tarjeta activa y puedes pulsar directamente «Ejecutar en Motor Python (Pyodide)» en la barra inferior.',
            },
          ],
        };
    }
  };

  const data = getContent();

  modal.innerHTML = `
    <div class="modal-dialog pedagogical-dialog" role="dialog" aria-modal="true" aria-labelledby="pedagogical-modal-title" style="max-width: 760px; width: 94%; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35); background: var(--bg-card, #ffffff); border: 1.5px solid var(--border-subtle, #cbd5e1); animation: modalFadeIn 0.25s ease-out;">
      <!-- Header -->
      <div class="modal-header" style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(14, 165, 233, 0.02)); padding: 1.15rem 1.4rem; border-bottom: 1.5px solid var(--border-subtle, #cbd5e1); display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(2, 132, 199, 0.15); color: #0284c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.1rem;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <h3 id="pedagogical-modal-title" style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--text-main, #0f172a);">
                ${escapeHtml(data.title)}
              </h3>
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px;">
                ${escapeHtml(data.badge)}
              </span>
            </div>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.76rem; color: var(--text-muted, #64748b); line-height: 1.4;">
              ${escapeHtml(data.subtitle)}
            </p>
          </div>
        </div>
        <button type="button" class="btn-close-pedagogical" aria-label="${isEn ? 'Close' : 'Cerrar'}" style="background: transparent; border: none; font-size: 1.35rem; color: var(--text-muted, #64748b); cursor: pointer; padding: 0.2rem 0.45rem; line-height: 1; border-radius: 6px; transition: all 0.2s;">
          &times;
        </button>
      </div>

      <!-- Body with rounded pedagogical concept cards -->
      <div class="modal-body" style="padding: 1.25rem 1.4rem; max-height: 68vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.85rem;">
        ${data.sections
          .map(
            (s) => `
            <div class="pedagogical-section-card" style="background: var(--bg-primary, rgba(248, 250, 252, 0.75)); border: 1px solid var(--border-subtle, #e2e8f0); border-left: 3.5px solid #0284c7; border-radius: 10px; padding: 0.85rem 1rem;">
              <h4 style="margin: 0 0 0.35rem 0; font-size: 0.86rem; font-weight: 700; color: #0284c7;">
                ${escapeHtml(s.heading)}
              </h4>
              <div style="font-size: 0.76rem; color: var(--text-main, #334155); line-height: 1.55;">
                ${s.content}
              </div>
            </div>
          `
          )
          .join('')}
      </div>

      <!-- Footer -->
      <div class="modal-footer" style="padding: 0.85rem 1.4rem; border-top: 1px solid var(--border-subtle, #cbd5e1); background: var(--bg-card, #ffffff); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
        <span style="font-size: 0.72rem; color: var(--text-muted, #64748b); display: flex; align-items: center; gap: 0.35rem;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10b981" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${isEn ? 'Pedagogical Quality Assured for University Defense (TFM)' : 'Calidad pedagógica auditada para defensa de tribunal de TFM'}
        </span>
        <button type="button" class="btn btn-primary btn-close-pedagogical" style="padding: 0.4rem 1.1rem; font-size: 0.82rem; font-weight: 700; border-radius: 8px;">
          ${isEn ? 'Understood' : 'Entendido'}
        </button>
      </div>
    </div>
  `;

  const close = () => {
    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.remove();
      if (activePedagogicalModalEl === modal) activePedagogicalModalEl = null;
    }, 200);
  };

  modal.querySelectorAll('.btn-close-pedagogical').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', onKeyDown);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  document.body.appendChild(modal);
  activePedagogicalModalEl = modal;
}
