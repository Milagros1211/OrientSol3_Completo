import { i18n } from '@/i18n';

export function renderArchitectureOverview(isEn?: boolean): HTMLElement {
  const isEnglish = isEn ?? (i18n.getLocale() === 'en');
  const container = document.createElement('div');
  container.className = 'panel-card';

  container.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </div>
      <div>
        <h3 class="panel-title">${isEnglish ? 'Project Architecture & OrientSol Structure' : 'Arquitectura del Proyecto y Estructura OrientSol'}</h3>
        <p class="panel-desc">${isEnglish ? 'Standard modular structure for Python calculation engines, UI components, and databases' : 'Estructura modular estándar para scripts Python, componentes UI y bases de datos'}</p>
      </div>
    </div>

    <div class="architecture-grid">
      <div class="arch-card">
        <div class="arch-card-header">
          <span class="arch-tag python-tag">src/python/</span>
          <h4>${isEnglish ? 'Python Calculation Engine (Pyodide)' : 'Motor de Cálculo Python (Pyodide)'}</h4>
        </div>
        <p class="arch-card-desc">${isEnglish ? 'Hosts the mathematical translation of original .m and .fig scripts:' : 'Destinado a alojar la traducción matemática de los archivos <code>.m</code>:'}</p>
        <ul class="arch-list">
          <li><code>core/</code>: ${isEnglish ? 'Solar geometry (declination, sunset angles, solar altitude, azimuth)' : 'Geometría solar (declinación, ángulos de salida, altura, azimut)'}</li>
          <li><code>radiation/</code>: ${isEnglish ? 'Radiative decomposition (Bod0, Bdm0, Dh0, Bh0, GdBeta)' : 'Descomposición radiativa (Bod0, Bdm0, Dh0, Bh0, GdBeta)'}</li>
          <li><code>tracking/</code>: ${isEnglish ? 'Solar tracking models (2-axis, polar, horizontal, azimuthal)' : 'Seguimiento solar (2 ejes, polar, horizontal, azimutal)'}</li>
          <li><code>optimization/</code>: ${isEnglish ? 'Annual and seasonal optimal tilt optimization routines' : 'Búsqueda de inclinación óptima anual y estacional'}</li>
          <li><code>energy/</code>: ${isEnglish ? 'Osterwald model, operating cell temperature, and PV yield' : 'Modelo Osterwald, temperatura de célula y rendimiento FV'}</li>
          <li><code>bridge/</code>: ${isEnglish ? 'Communication interface and JSON data validation with TypeScript' : 'Interfaz de comunicación y validación JSON con TypeScript'}</li>
        </ul>
      </div>

      <div class="arch-card">
        <div class="arch-card-header">
          <span class="arch-tag ui-tag">src/components/</span>
          <h4>${isEnglish ? 'User Interface Components' : 'Componentes de Interfaz de Usuario'}</h4>
        </div>
        <p class="arch-card-desc">${isEnglish ? 'Modular web components built with native TypeScript and CSS tokens:' : 'Componentes web modulares construidos en TypeScript y CSS nativo:'}</p>
        <ul class="arch-list">
          <li><code>layout/</code>: ${isEnglish ? 'Header, language switcher, and reactive status bar' : 'Header, navegación lateral y barra de estado reactiva'}</li>
          <li><code>climate/</code>: ${isEnglish ? 'Dual climate loader, manual lock form, satellite APIs, and tracking panels' : 'Cargador híbrido, formulario manual blindado, APIs satelitales y paneles de seguimiento'}</li>
          <li><code>console/</code>: ${isEnglish ? 'Interactive verification suite and engine mathematical validation' : 'Suite interactiva de verificación y validación matemática de motores'}</li>
          <li><code>charts/</code>: ${isEnglish ? 'Vector radiation charts, energy yields, and 8-surface rankings' : 'Paneles de cálculo de radiación, ganancias y curvas solares'}</li>
          <li><code>export/</code>: ${isEnglish ? 'High-resolution PDF report generator and multi-sheet Excel exporter' : 'Generador de informes PDF de alta resolución y exportador Excel multitable'}</li>
        </ul>
      </div>

      <div class="arch-card">
        <div class="arch-card-header">
          <span class="arch-tag db-tag">src/database/</span>
          <h4>${isEnglish ? 'Configuration & Meteorological Databases' : 'Configuración y Base de Datos'}</h4>
        </div>
        <p class="arch-card-desc">${isEnglish ? 'Type-safe migration and integration of BBDD datasets and cloud storage:' : 'Migración y tipado de los datos de <code>BBDD.xlsx</code>:'}</p>
        <ul class="arch-list">
          <li><code>locations.ts</code>: ${isEnglish ? 'Historical database with monthly Gdm(0) radiation and ambient temperatures' : 'Catálogo de localidades con radiación Gdm(0) y temperaturas'}</li>
          <li><code>supabase/</code>: ${isEnglish ? 'Cloud sync for custom emplacements with anti-duplicate validation' : 'Sincronización en la nube para emplazamientos personalizados'}</li>
          <li><code>solarConstants.ts</code>: ${isEnglish ? 'Solar constant (1367 W/m², WMO/WRC standard) and characteristic days' : 'Constante solar (1367 W/m², estándar OMM/WRC) y días característicos'}</li>
          <li><code>pvModules.ts</code>: ${isEnglish ? 'Commercial PV module specifications and temperature coefficients' : 'Especificaciones de módulos fotovoltaicos comerciales'}</li>
        </ul>
      </div>
    </div>
  `;

  return container;
}
