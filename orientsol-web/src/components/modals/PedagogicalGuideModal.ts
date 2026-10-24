/**
 * OrientSol 4.0 - Pedagogical Guide Modal
 * Provides in-depth, didactic explanations and theoretical guidance
 * for all 4 climate ingestion tabs (Official Catalog, Manual Entry, File Import, and Satellite APIs).
 */

import { escapeHtml } from '@/utils/security';
import { themeManager } from '@/services/theme/themeManager';

let activePedagogicalModalEl: HTMLElement | null = null;

export function openPedagogicalGuideModal(
  tabKey: 'historical' | 'manual' | 'upload' | 'api',
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
            ? 'Pedagogical Guide: Official Catalog & Climate Variables'
            : 'Guía Didáctica: Catálogo Oficial (114 Estaciones) y Variables Físicas',
          subtitle: isEn
            ? 'Scientific methodology, physical meaning, and practical guidance for official meteorological records'
            : 'Metodología científica, significado físico y guía práctica de los registros oficiales',
          badge: isEn ? 'Official Benchmark Catalog' : 'Catálogo Oficial de Referencia',
          sections: [
            {
              heading: isEn ? '1. Key Physical Variables in Each Record' : '1. Variables Físicas Clave en Cada Registro',
              content: isEn
                ? `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>G<sub>dm</sub>(0) [kWh/m²·day]:</strong> Monthly average daily global solar irradiation received on a horizontal surface. It accounts for both direct sunlight and atmospheric diffuse radiation.</li>
                    <li><strong>T<sub>amb</sub> [°C]:</strong> Monthly average 24-hour ambient dry-bulb temperature, used by the PV temperature derating model (NOCT / TONC).</li>
                    <li><strong>Latitude & Longitude [°]:</strong> Precise geographic coordinates necessary for extraterrestrial solar geometry (declination &delta;, solar hour angle &omega;<sub>s</sub>, extraterrestrial radiation G<sub>0d</sub>).</li>
                  </ul>`
                : `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>G<sub>dm</sub>(0) [kWh/m²·día]:</strong> Irradiación solar global media diaria sobre superficie horizontal para cada mes del año. Integra la radiación directa del disco solar y la difusa dispersada por la atmósfera.</li>
                    <li><strong>T<sub>amb</sub> [°C]:</strong> Temperatura media mensual del aire en sombra, fundamental para calcular las pérdidas térmicas en los módulos fotovoltaicos mediante el modelo TONC/NOCT.</li>
                    <li><strong>Latitud y Longitud [°]:</strong> Coordenadas geográficas imprescindibles para la trigonometría astronómica: declinación solar (&delta;), ángulo horario de puesta del sol (&omega;<sub>s</sub>) e irradiación extraterrestre diaria (G<sub>0d</sub>).</li>
                  </ul>`,
            },
            {
              heading: isEn ? '2. Understanding Tags: [ORIENTSOL] vs [LOCAL CACHE]' : '2. Significado de las Etiquetas: [ORIENTSOL] vs [CACHÉ LOCAL]',
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
              heading: isEn ? '3. Step-by-Step Simulation Flow' : '3. Flujo Didáctico para Simular',
              content: isEn
                ? 'Type your city name in the search box, click on the dropdown match or press "Select Station". The 12-month table updates instantly below. Then, adjust your system parameters (Peak Power, PR, Albedo) and click <strong>"Run Calculation Engine"</strong> to compute the optimal tilt and monthly energy yield.'
                : 'Escribe el nombre de tu ciudad en el buscador asistido, selecciona el resultado en la lista desplegable o pulsa «Seleccionar Estación». La tabla de 12 meses se actualizará de inmediato. Ajusta los parámetros del generador fotovoltaico (Potencia Pico, PR, Albedo) y haz clic en <strong>«Ejecutar Motor de Cálculo»</strong> para obtener la inclinación óptima y la energía producida.',
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
          badge: isEn ? 'Solar Geometry & Physics' : 'Física y Geometría Solar',
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
                ? 'Clicking <strong>"Apply Manual Data"</strong> loads the dataset directly into the local calculation engine memory. If you click <strong>"Save to Supabase"</strong>, the station is permanently registered in the official database (datos_mensuales) and will become available in the catalog under [ORIENTSOL].'
                : 'Al pulsar <strong>«Aplicar Datos Manuales»</strong> los datos se inyectan de inmediato en la tarjeta activa para simular con el motor de cálculo. Si pulsas <strong>«Guardar en Supabase»</strong>, el emplazamiento se registra de forma persistente en la nube (tabla datos_mensuales) y pasará a formar parte del catálogo general bajo la etiqueta [ORIENTSOL].',
            },
          ],
        };

      case 'upload':
        return {
          title: isEn
            ? 'Pedagogical Guide: Digital File Import, Formats & Dual Sync'
            : 'Guía Didáctica: Importación Digital CSV/JSON y Sincronización Dual',
          subtitle: isEn
            ? 'File formatting rules, multi-station batch structure, and direct in-place calculation'
            : 'Estructura de archivos, procesamiento de lotes multi-estación y cálculo directo in situ',
          badge: isEn ? 'Standard Digital Formats' : 'Formatos Digitales Normalizados',
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
              heading: isEn ? '4. Instant Direct Selection & Simulation' : '4. Selección Inmediata y Simulación Directa In Situ',
              content: isEn
                ? 'No need to leave this section to calculate! The station selector and interactive quick-pills appear directly below the dropzone. Selecting any station instantly updates the active dataset, allowing you to run the calculation engine on the spot.'
                : '¡Puedes calcular directamente sin necesidad de cambiar de sección! Inmediatamente tras cargar o sincronizar tu archivo, el selector de texto y las píldoras interactivas aparecen aquí mismo. Al elegir cualquier emplazamiento, se actualiza la tarjeta activa y puedes pulsar directamente «Ejecutar Motor de Cálculo» en la barra inferior.',
            },
          ],
        };

      case 'api':
        return {
          title: isEn
            ? 'Pedagogical Guide: Satellite Solar Databases (PVGIS, NASA & Open-Meteo)'
            : 'Guía Didáctica: Redes Satelitales y Reanálisis (PVGIS, NASA y Open-Meteo)',
          subtitle: isEn
            ? 'Atmospheric radiative transfer models, orbital sensors, and global solar exploration'
            : 'Modelos de transferencia radiativa, sensores orbitales y exploración solar global',
          badge: isEn ? 'Global Satellite Networks' : 'Redes Satelitales Globales',
          sections: [
            {
              heading: isEn ? '1. Understanding Satellite Radiometric Networks' : '1. Fundamento de las Redes Satelitales Disponibles',
              content: isEn
                ? `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>PVGIS 5.3 (EU Joint Research Centre):</strong> Highly accurate solar radiation database for Europe, Africa, parts of Asia and the Americas, primarily based on geostationary Meteosat SARAH2/SARAH3 and CMSAF sensors.</li>
                    <li><strong>NASA POWER:</strong> Global coverage from the NASA Langley Research Center, combining satellite observations (CERES, MODIS) with Goddard Earth Observing System (GEOS) models.</li>
                    <li><strong>Open-Meteo (ECMWF ERA5):</strong> State-of-the-art climate reanalysis combining atmospheric physics with millions of worldwide observations, providing continuous hourly and monthly means.</li>
                  </ul>`
                : `<ul style="margin: 0; padding-left: 1.15rem; line-height: 1.6;">
                    <li><strong>PVGIS 5.3 (Comisión Europea - JRC):</strong> Estándar europeo de referencia para energía solar. Emplea las bases satelitales SARAH/SARAH2 y modelos CMSAF sobre satélites geoestacionarios Meteosat, con altísima fidelidad en Europa, África y América.</li>
                    <li><strong>NASA POWER (NASA Langley Research Center):</strong> Cobertura global integral basada en sensores orbitales (CERES, MODIS) combinados con modelos de asimilación atmosférica GEOS de la NASA.</li>
                    <li><strong>Open-Meteo (ECMWF ERA5 Reanálisis):</strong> El reanálisis meteorológico más avanzado del Centro Europeo de Previsiones Meteorológicas, con malla global física continua.</li>
                  </ul>`,
            },
            {
              heading: isEn ? '2. How Satellites Measure Ground Radiation' : '2. ¿Cómo miden la radiación solar los satélites espaciales?',
              content: isEn
                ? 'Geostationary satellites do not carry pyranometers on the ground; instead, optical and infrared radiometers measure the solar reflectance (albedo) of clouds and aerosols. Radiative transfer algorithms compute atmospheric absorption and cloud optical depth to calculate the exact global horizontal irradiance G<sub>dm</sub>(0) reaching ground level. This provides solar data anywhere on Earth, including offshore and remote locations.'
                : 'Los satélites geoestacionarios no disponen de piranómetros en la superficie; en su lugar, sus radiómetros ópticos e infrarrojos miden la reflectividad de las nubes y aerosoles en el tope de la atmósfera. Mediante modelos matemáticos de transferencia radiativa (como el modelo Heliosat), el sistema deduce la atenuación de la luz y calcula con precisión la radiación global en plano horizontal G<sub>dm</sub>(0) que alcanza el suelo. Esto permite diseñar sistemas fotovoltaicos en islas, desiertos o zonas rurales sin estaciones terrestres.',
            },
            {
              heading: isEn ? '3. Step-by-Step Satellite Query Flow' : '3. Flujo Práctico de Consulta e Ingesta',
              content: isEn
                ? 'Select your preferred data source, pick a preset city or enter custom Latitude and Longitude. Press <strong>"Fetch Satellite Climate"</strong> to download the 12-month series through our secure edge proxy. The results immediately feed the active table for calculations. Press <strong>"Save to Supabase"</strong> to store it in the cloud catalog under [ORIENTSOL].'
                : 'Selecciona el proveedor satelital deseado, elige una ciudad predefinida o introduce las coordenadas exactas de tu proyecto. Pulsa <strong>«Consultar Climatología»</strong> para descargar la serie mensual mediante el proxy seguro. Los datos alimentan de inmediato la tarjeta activa para simular con el motor de cálculo. Pulsa <strong>«Guardar en Supabase»</strong> para conservarlo en la nube bajo la etiqueta [ORIENTSOL].',
            },
            {
              heading: isEn ? '4. Connectivity & Operational Limits' : '4. Conexión a Internet y Seguridad de Acceso',
              content: isEn
                ? 'Satellite API queries require an active Internet connection to contact European and American space servers. When working offline, use the Official Catalog, the Manual Form, or previously cached files.'
                : 'La consulta satelital requiere conexión a Internet para enlazar con los centros de datos de la Comisión Europea y la NASA. Si estás en campo sin cobertura, puedes utilizar el Catálogo Oficial, la Entrada Manual o tus archivos locales previamente guardados.',
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
              <span class="badge" style="background: rgba(2, 132, 199, 0.15); color: #0284c7; border: 1px solid rgba(2, 132, 199, 0.3); font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px;">
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
      <div class="modal-footer" style="padding: 0.85rem 1.4rem; border-top: 1px solid var(--border-subtle, #cbd5e1); background: var(--bg-card, #ffffff); display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap;">
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
