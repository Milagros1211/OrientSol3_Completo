export function renderArchitectureOverview(): HTMLElement {
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
        <h3 class="panel-title">3. Arquitectura del Proyecto y Estructura OrientSol</h3>
        <p class="panel-desc">Estructura modular estándar para scripts Python, componentes UI y bases de datos</p>
      </div>
    </div>

    <div class="architecture-grid">
      <div class="arch-card">
        <div class="arch-card-header">
          <span class="arch-tag python-tag">src/python/</span>
          <h4>Motor de Cálculo Python (Pyodide)</h4>
        </div>
        <p class="arch-card-desc">Destinado a alojar la traducción matemática de los archivos <code>.m</code>:</p>
        <ul class="arch-list">
          <li><code>core/</code>: Geometría solar (declinación, ángulos de salida, altura, azimut)</li>
          <li><code>radiation/</code>: Descomposición radiativa (Bod0, Bdm0, Dh0, Bh0, GdBeta)</li>
          <li><code>tracking/</code>: Seguimiento solar (2 ejes, polar, horizontal, azimutal)</li>
          <li><code>optimization/</code>: Búsqueda de inclinación óptima anual y estacional</li>
          <li><code>energy/</code>: Modelo Osterwald, temperatura de célula y rendimiento FV</li>
          <li><code>bridge/</code>: Interfaz de comunicación y validación JSON con TypeScript</li>
        </ul>
      </div>

      <div class="arch-card">
        <div class="arch-card-header">
          <span class="arch-tag ui-tag">src/components/</span>
          <h4>Componentes de Interfaz de Usuario</h4>
        </div>
        <p class="arch-card-desc">Componentes web modulares construidos en TypeScript y CSS nativo:</p>
        <ul class="arch-list">
          <li><code>layout/</code>: Header, navegación lateral y barra de estado reactiva</li>
          <li><code>location/</code>: Selector de provincias españolas, ciudades y albedo</li>
          <li><code>console/</code>: Terminal interactiva en vivo conectada al motor WASM</li>
          <li><code>solar/</code>: Paneles de cálculo de radiación, ganancias y curvas solares</li>
          <li><code>common/</code>: Botones, insignias, tarjetas y diálogos de configuración</li>
        </ul>
      </div>

      <div class="arch-card">
        <div class="arch-card-header">
          <span class="arch-tag db-tag">src/database/</span>
          <h4>Configuración y Base de Datos</h4>
        </div>
        <p class="arch-card-desc">Migración y tipado de los datos de <code>BBDD.xlsx</code>:</p>
        <ul class="arch-list">
          <li><code>locations.ts</code>: Catálogo de localidades con radiación Gdm(0) y temperaturas</li>
          <li><code>albedo.ts</code>: Coeficientes de reflectancia según normativa IDAE</li>
          <li><code>solarConstants.ts</code>: Constante solar (1367 W/m²) y días característicos</li>
          <li><code>pvModules.ts</code>: Especificaciones de módulos fotovoltaicos comerciales</li>
        </ul>
      </div>
    </div>
  `;

  return container;
}
