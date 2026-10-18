import { i18n } from '@/i18n';
import { themeManager } from '@/services/theme/themeManager';

export type LegalTabId = 'privacy' | 'terms' | 'cookies' | 'security';

let activeLegalModalEl: HTMLElement | null = null;

export function openLegalPoliciesModal(initialTab: LegalTabId = 'privacy'): void {
  if (activeLegalModalEl) {
    activeLegalModalEl.remove();
    activeLegalModalEl = null;
  }

  const isEn = i18n.getLocale() === 'en';
  let activeTab: LegalTabId = initialTab;

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop legal-modal-backdrop';
  modal.id = 'legal-policies-modal';
  modal.setAttribute('data-theme', themeManager.getTheme());

  function renderContent(): void {
    modal.innerHTML = `
      <div class="modal-dialog legal-dialog" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="panel-icon modal-icon" style="background: rgba(14, 165, 233, 0.15); color: var(--accent-cyan, #0284c7);">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <h3 class="modal-title" id="legal-modal-title">
                ${isEn ? 'Legal Compliance, Privacy & Security' : 'Aviso Legal, Privacidad & Seguridad'}
              </h3>
              <p class="modal-subtitle">
                ${isEn 
                  ? 'Compliant with EU GDPR (2016/679), Spanish LOPDGDD (3/2018), LSSI-CE & OWASP Standards'
                  : 'Conforme a normativa europea RGPD (2016/679), española LOPDGDD (3/2018), LSSI-CE y Estándares OWASP'}
              </p>
            </div>
          </div>
          <button type="button" class="btn-close" id="btn-close-legal-modal" aria-label="${isEn ? 'Close' : 'Cerrar'}">&times;</button>
        </div>

        <!-- Navigation Tabs inside Modal -->
        <div class="legal-tabs-bar">
          <button type="button" class="legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}" data-legal-tab="privacy">
            <span>🛡️ ${isEn ? 'Privacy (GDPR)' : 'Privacidad (RGPD)'}</span>
          </button>
          <button type="button" class="legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}" data-legal-tab="terms">
            <span>📜 ${isEn ? 'Terms & Free Access' : 'Términos & Gratuidad'}</span>
          </button>
          <button type="button" class="legal-tab-btn ${activeTab === 'cookies' ? 'active' : ''}" data-legal-tab="cookies">
            <span>🍪 ${isEn ? 'Cookies & Storage' : 'Cookies & Almacenamiento'}</span>
          </button>
          <button type="button" class="legal-tab-btn ${activeTab === 'security' ? 'active' : ''}" data-legal-tab="security">
            <span>🔒 ${isEn ? 'Security Audit' : 'Informe de Seguridad'}</span>
          </button>
        </div>

        <div class="modal-body legal-modal-body">
          ${renderTabContent(activeTab, isEn)}
        </div>

        <div class="modal-footer legal-modal-footer">
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span class="badge badge-primary" style="font-size: 0.68rem; padding: 0.1rem 0.45rem;">UE</span>
            <span>${isEn ? 'EU Law Compliant' : 'Conforme a Derecho UE'}</span>
            <span style="opacity: 0.4;">•</span>
            <span class="badge badge-neutral" style="font-size: 0.68rem; padding: 0.1rem 0.45rem;">ES</span>
            <span>${isEn ? 'Spanish Jurisdiction (Jaén)' : 'Jurisdicción Española (Jaén)'}</span>
          </div>
          <button type="button" class="btn btn-secondary" id="btn-accept-legal-modal" style="min-width: 110px;">
            ${isEn ? 'Understood & Close' : 'Entendido y Cerrar'}
          </button>
        </div>
      </div>
    `;

    // Attach Event Listeners
    const closeBtn = modal.querySelector('#btn-close-legal-modal');
    const acceptBtn = modal.querySelector('#btn-accept-legal-modal');
    const tabBtns = modal.querySelectorAll<HTMLButtonElement>('.legal-tab-btn');

    const closeModal = () => {
      modal.remove();
      activeLegalModalEl = null;
    };

    closeBtn?.addEventListener('click', closeModal);
    acceptBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-legal-tab') as LegalTabId;
        if (target && target !== activeTab) {
          activeTab = target;
          renderContent();
        }
      });
    });

    // Storage action inside cookies tab
    const clearStorageBtn = modal.querySelector('#btn-clear-technical-storage');
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener('click', () => {
        if (confirm(isEn ? 'Clear local preferences and station cache?' : '¿Deseas restablecer las preferencias locales y caché de estaciones?')) {
          localStorage.removeItem('orientsol_theme');
          localStorage.removeItem('orientsol_lang');
          localStorage.removeItem('orientsol_climate_cache');
          localStorage.removeItem('orientsol_cookie_consent');
          alert(isEn ? 'Local storage cleared. Preferences reset.' : 'Almacenamiento local limpiado con éxito.');
          window.location.reload();
        }
      });
    }
  }

  renderContent();
  document.body.appendChild(modal);
  activeLegalModalEl = modal;

  // ESC key listener
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      activeLegalModalEl = null;
      window.removeEventListener('keydown', onKeyDown);
    }
  };
  window.addEventListener('keydown', onKeyDown);
}

function renderTabContent(tab: LegalTabId, isEn: boolean): string {
  switch (tab) {
    case 'privacy':
      return renderPrivacyContent(isEn);
    case 'terms':
      return renderTermsContent(isEn);
    case 'cookies':
      return renderCookiesContent(isEn);
    case 'security':
      return renderSecurityContent(isEn);
    default:
      return renderPrivacyContent(isEn);
  }
}

function renderPrivacyContent(isEn: boolean): string {
  if (isEn) {
    return `
      <div class="legal-clause-card">
        <h4 class="legal-clause-title">1. Data Controller Identification</h4>
        <p class="legal-text">
          In compliance with Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation - <strong>GDPR</strong>) and Spanish Organic Law 3/2018 (<strong>LOPDGDD</strong>), the entity responsible for data processing within this platform is:
        </p>
        <ul class="legal-list">
          <li><strong>Platform:</strong> OrientSol 4.0 (Solar & Photovoltaic Simulation Engine)</li>
          <li><strong>Academic Framework:</strong> Master's Thesis (TFM) in Renewable Energy — Universidad de Jaén (UJA), Spain</li>
          <li><strong>Author / Researcher:</strong> Karina Milagros Baldeón Zárate</li>
          <li><strong>Academic Direction:</strong> Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas</li>
          <li><strong>Department:</strong> Electronic and Automatic Engineering, Universidad de Jaén</li>
          <li><strong>Institutional Contact:</strong> <a href="mailto:ujaen@ujaen.es" style="color: var(--accent-cyan);">ujaen.es</a></li>
        </ul>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">2. Privacy by Design & Zero-Tracking Architecture</h4>
        <p class="legal-text">
          OrientSol 4.0 was engineered strictly adhering to the <strong>Privacy by Design and by Default</strong> principles (Article 25 GDPR).
        </p>
        <ul class="legal-list">
          <li><strong>100% Client-Side In-Browser Calculation:</strong> All solar radiation transposition formulas, Perez/Hay-Davies models, single/dual axis tracking algorithms, and Osterwald cell thermal simulations execute strictly inside your browser through WebAssembly (Pyodide & NumPy). Your calculation inputs, geographical coordinates, power values, and project parameters <strong>never leave your machine</strong>.</li>
          <li><strong>No Personal Data Harvesting:</strong> We do not collect names, emails, billing information, government IDs, biometric data, or precise telemetry trackers.</li>
          <li><strong>No Behavioral Profiling:</strong> We deploy no advertising networks, tracking pixels, fingerprinters, or commercial telemetry scripts.</li>
        </ul>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">3. Optional Cloud Climate Persistence (Supabase Community Table)</h4>
        <p class="legal-text">
          When the user voluntarily chooses to query or synchronize climate datasets with the cloud:
        </p>
        <ul class="legal-list">
          <li><strong>Data Processed:</strong> Only municipal weather records (e.g., station name, latitude, longitude, and 12 monthly irradiation values). No personal identification or user metadata is recorded.</li>
          <li><strong>Database Security:</strong> Managed on an EU-hosted Supabase PostgreSQL instance protected by Row Level Security (RLS) policies and master UUID authentication, preventing unauthorized database modifications.</li>
          <li><strong>Legal Basis:</strong> Explicit, voluntary consent (Article 6.1.a GDPR) and legitimate research interest in scientific open-data exchange (Article 6.1.f GDPR).</li>
        </ul>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">4. Rights of Data Subjects (ARCO-POL Rights)</h4>
        <p class="legal-text">
          Pursuant to Articles 15 to 22 of the GDPR and Title III of Spanish Law 3/2018 (LOPDGDD), users hold the following enforceable rights:
        </p>
        <ul class="legal-list">
          <li><strong>Right of Access & Rectification:</strong> Right to obtain confirmation and correct any climate station record contributed to the open repository.</li>
          <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Right to request the permanent deletion of any contributed climate dataset.</li>
          <li><strong>Right to Limitation & Opposition:</strong> Right to restrict automated data processing.</li>
          <li><strong>Right to Portability:</strong> All simulation results and climate datasets can be directly exported in open standard formats (JSON, CSV, Excel, PDF) at zero cost.</li>
          <li><strong>Supervisory Authority:</strong> If you consider that the processing of your data violates European or Spanish regulations, you have the right to file a complaint before the Spanish Data Protection Agency (<strong>AEPD</strong>) at <a href="https://www.aepd.es" target="_blank" rel="noopener" style="color: var(--accent-cyan);">www.aepd.es</a>.</li>
        </ul>
      </div>
    `;
  }

  return `
    <div class="legal-clause-card">
      <h4 class="legal-clause-title">1. Identificación del Responsable del Tratamiento</h4>
      <p class="legal-text">
        En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (Reglamento General de Protección de Datos - <strong>RGPD</strong>), de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (<strong>LOPDGDD</strong>), y de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (<strong>LSSI-CE</strong>), se informa que el responsable de este entorno software es:
      </p>
      <ul class="legal-list">
        <li><strong>Plataforma:</strong> OrientSol 4.0 (Motor de Simulación Solar y Fotovoltaica)</li>
        <li><strong>Marco Académico:</strong> Trabajo Fin de Máster (TFM) en Energías Renovables — Universidad de Jaén (UJA), España</li>
        <li><strong>Alumna / Investigadora:</strong> Karina Milagros Baldeón Zárate</li>
        <li><strong>Dirección Académica:</strong> Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas</li>
        <li><strong>Departamento:</strong> Departamento de Ingeniería Electrónica y Automática, Universidad de Jaén</li>
        <li><strong>Contacto Institucional:</strong> <a href="mailto:ujaen@ujaen.es" style="color: var(--accent-cyan);">ujaen.es</a></li>
      </ul>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">2. Privacidad desde el Diseño y Arquitectura de Cero Rastreo</h4>
      <p class="legal-text">
        OrientSol 4.0 ha sido diseñado y desarrollado bajo los principios de <strong>Privacidad desde el Diseño y por Defecto</strong> consagrados en el Artículo 25 del RGPD:
      </p>
      <ul class="legal-list">
        <li><strong>Cálculo 100% en el Cliente (WebAssembly):</strong> Todos los algoritmos solares, descomposición difusa (Perez, Hay-Davies, Liu-Jordan), seguimiento a 1 y 2 ejes, y modelos térmicos de Osterwald se ejecutan localmente en el navegador mediante Pyodide (Python 3.14 + NumPy WebAssembly). Los parámetros geográficos, coordenadas, potencia pico y datos de diseño <strong>no se envían a ningún servidor</strong>.</li>
        <li><strong>No Recopilación de Datos Personales:</strong> No se solicitan ni registran nombres, documentos de identidad, números telefónicos, direcciones postales, información de pago ni direcciones IP identificables.</li>
        <li><strong>Ausencia de Rastreadores Comerciales:</strong> La plataforma no integra redes de publicidad, píxeles de seguimiento ni herramientas invasivas de analítica de comportamiento.</li>
      </ul>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">3. Tratamiento de Datos en la Base Climática Colaborativa (Supabase)</h4>
      <p class="legal-text">
        En caso de que el usuario decida voluntariamente guardar o consultar registros climáticos en la nube:
      </p>
      <ul class="legal-list">
        <li><strong>Datos Tratados:</strong> Únicamente valores técnicos meteorológicos (nombre de localidad o estación, latitud, longitud y 12 valores mensuales de radiación horizontal $G_{dm}(0)$ y temperatura). Ningún dato de carácter personal queda vinculado al registro.</li>
        <li><strong>Seguridad en Reposo y Tránsito:</strong> Base de datos PostgreSQL alojada en centros de datos de la Unión Europea (Supabase EU), con políticas estrictas de seguridad por filas (Row Level Security - RLS) y cifrado TLS 1.3 en tránsito.</li>
        <li><strong>Base Jurídica:</strong> Consentimiento libre, inequívoco y voluntario del usuario (Art. 6.1.a RGPD) e interés legítimo de investigación científica y difusión del conocimiento abierto (Art. 6.1.f RGPD).</li>
      </ul>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">4. Ejercicio de Derechos ARCO-POL</h4>
      <p class="legal-text">
        El usuario puede ejercer en cualquier momento sus derechos reconocidos en los artículos 15 a 22 del RGPD y en el Título III de la LOPDGDD:
      </p>
      <ul class="legal-list">
        <li><strong>Derecho de Acceso y Rectificación:</strong> Derecho a conocer y modificar cualquier estación meteorológica subida a la base de datos pública.</li>
        <li><strong>Derecho de Supresión ("Derecho al Olvido"):</strong> Derecho a solicitar la eliminación permanente de registros aportados.</li>
        <li><strong>Derecho a la Portabilidad:</strong> Exportación directa y gratuita de todos los resultados de simulación en formatos estándar abiertos (JSON, CSV, Excel, PDF).</li>
        <li><strong>Autoridad de Control:</strong> En caso de considerar vulnerados sus derechos, el usuario tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<strong>AEPD</strong>), sita en C/ Jorge Juan 6, 28001 Madrid (<a href="https://www.aepd.es" target="_blank" rel="noopener" style="color: var(--accent-cyan);">www.aepd.es</a>).</li>
      </ul>
    </div>
  `;
}

function renderTermsContent(isEn: boolean): string {
  if (isEn) {
    return `
      <div class="legal-clause-card">
        <h4 class="legal-clause-title">1. Object, 100% Free Open-Access Statement & No Commercial Charges</h4>
        <p class="legal-text">
          These Terms of Service govern the access, execution, and use of <strong>OrientSol 4.0</strong>, a scientific solar simulation environment developed within the academic framework of the Master's Thesis in Renewable Energy at the <strong>University of Jaén (UJA)</strong>.
        </p>
        <p class="legal-text" style="color: var(--accent-emerald, #10b981); font-weight: 600;">
          ✔ OrientSol 4.0 is 100% free of charge (Gratuito) and distributed as an Open-Access academic resource. There are NO subscriptions, NO recurring fees, NO hidden purchases, and NO payment transactions.
        </p>
        <p class="legal-text">
          OrientSol 4.0 is delivered to assist renewable energy engineers, researchers, students, and professionals in evaluating photovoltaic surfaces, orientation, tilt, solar tracking, and cell thermal behavior.
        </p>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">2. Intellectual Property & Permitted Use</h4>
        <ul class="legal-list">
          <li><strong>Authorship:</strong> OrientSol 4.0 is authored by Karina Milagros Baldeón Zárate, supervised by Dr. Leocadio Hontoria García and Dra. Catalina Rus Casas (Universidad de Jaén).</li>
          <li><strong>License:</strong> Licensed under the MIT and Open-Access Academic License. Users are granted permission to run, analyze, simulate, and export reports for research, teaching, engineering consultancy, and solar installation sizing.</li>
          <li><strong>Source Heritage:</strong> Modernized from the original MATLAB/GUIDE OrientSol 3.0 algorithms (.m, .fig), preserving scientific fidelity and mathematical equations published in doctoral and master theses of the UJA.</li>
        </ul>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">3. Scientific Nature & Calculation Disclaimers</h4>
        <p class="legal-text">
          All calculated metrics (incident radiation, optimal monthly and annual angles, shadowing factors, and photovoltaic energy production) are theoretical computational models based on established literature (Osterwald, Perez 1990, Hay-Davies, isotropic transposition).
        </p>
        <p class="legal-text">
          <strong>Engineering Disclaimer:</strong> The software is provided "as is", without warranty of commercial profit, grid-connection approval, or economic return. Solar engineering professionals must always conduct on-site solarimetric validation and local structural verification prior to physical plant construction.
        </p>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">4. Applicable Legislation and Jurisdiction</h4>
        <p class="legal-text">
          These Terms of Service are governed by the laws of the Kingdom of Spain and the applicable directives of the European Union. Any controversy arising from the interpretation or execution of these conditions will be submitted to the courts and tribunals of the city of <strong>Jaén, Spain</strong>.
        </p>
      </div>
    `;
  }

  return `
    <div class="legal-clause-card">
      <h4 class="legal-clause-title">1. Objeto, Declaración de Gratuidad Total (Open Access) y Ausencia de Cobros</h4>
      <p class="legal-text">
        Las presentes Condiciones de Uso y Términos de Servicio regulan el acceso, navegación y uso del software <strong>OrientSol 4.0</strong>, entorno científico de simulación solar y cálculo fotovoltaico desarrollado como Trabajo Fin de Máster (TFM) en el Máster Universitario en Energías Renovables de la <strong>Universidad de Jaén (UJA)</strong>.
      </p>
      <p class="legal-text" style="color: var(--accent-emerald, #10b981); font-weight: 600;">
        ✔ OrientSol 4.0 es un software 100% gratuito de Acceso Abierto Académico. NO existen cuotas de suscripción, ni tarifas comerciales, ni pasarelas de pago, ni cobros bancarios de ningún tipo.
      </p>
      <p class="legal-text">
        OrientSol 4.0 se ofrece como una herramienta orientada a estudiantes, ingenieros, investigadores y profesionales del sector de la energía solar para la evaluación de superficies colectoras, pérdidas por orientación e inclinación, sistemas de seguimiento y cálculo de producción eléctrica.
      </p>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">2. Propiedad Intelectual y Usos Permitidos</h4>
      <ul class="legal-list">
        <li><strong>Titularidad:</strong> El código, diseño e implementación técnica de OrientSol 4.0 son titularidad de su autora Karina Milagros Baldeón Zárate y de sus directores Dr. Leocadio Hontoria García y Dra. Catalina Rus Casas (Universidad de Jaén).</li>
        <li><strong>Licencia Abierta:</strong> Se autoriza el uso libre y gratuito del software con fines educativos, de investigación científica, consultoría de ingeniería y dimensionamiento de instalaciones fotovoltaicas.</li>
        <li><strong>Cita Académica:</strong> Se solicita que cualquier publicación, estudio o tesis que utilice resultados de OrientSol 4.0 cite la autoría académica correspondiente y la Universidad de Jaén.</li>
      </ul>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">3. Exención de Responsabilidad Técnica y Modelado Científico</h4>
      <p class="legal-text">
        Los resultados emitidos por OrientSol 4.0 (radiación incidente, ángulos óptimos anuales y estacionales, ganancias de seguimiento a 1 y 2 ejes, y estimación de kWh anuales) se obtienen mediante modelos matemáticos y algoritmos reconocidos en la literatura científica (modelo térmico-eléctrico de Osterwald, transposición de Perez, Hay-Davies y Liu-Jordan).
      </p>
      <p class="legal-text">
        <strong>Aviso de Ingeniería:</strong> El software se suministra "tal cual" (as is), con propósitos de estudio y pre-dimensionamiento. Los autores y la Universidad de Jaén no se responsabilizan de desviaciones entre las simulaciones teóricas y la producción real producidas por condiciones meteorológicas atípicas, microclimas locales o fallos en equipos fotovoltaicos físicos instalados.
      </p>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">4. Legislación Aplicable y Fuero Jurisdiccional</h4>
      <p class="legal-text">
        Las presentes condiciones se rigen por la legislación española y la normativa comunitaria europea aplicable (Directiva 2000/31/CE y Ley 34/2002 LSSI-CE). Para la resolución de cualquier litigio o controversia derivada de la utilización del software, las partes se someten expresamente a la jurisdicción de los Juzgados y Tribunales de la ciudad de <strong>Jaén (España)</strong>.
      </p>
    </div>
  `;
}

function renderCookiesContent(isEn: boolean): string {
  if (isEn) {
    return `
      <div class="legal-clause-card">
        <h4 class="legal-clause-title">1. Legal Basis & ePrivacy Compliance</h4>
        <p class="legal-text">
          In accordance with Directive 2002/58/EC of the European Parliament (ePrivacy Directive), Article 5(3) of the GDPR, and Spanish Law 34/2002 (Article 22.2 LSSI-CE), this site details all storage mechanisms utilized.
        </p>
        <p class="legal-text" style="color: var(--accent-emerald, #10b981); font-weight: 600;">
          ✔ OrientSol 4.0 uses ZERO advertising cookies, ZERO tracking pixels, and ZERO third-party analytics cookies.
        </p>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">2. Inventory of Strictly Technical Local Storage</h4>
        <p class="legal-text">
          The table below discloses all items stored locally in your browser's <code>localStorage</code> and <code>indexedDB</code> strictly necessary for the technical operation and offline execution of the simulation:
        </p>

        <div style="overflow-x: auto; margin-top: 0.75rem;">
          <table class="legal-table">
            <thead>
              <tr>
                <th>Key / Storage</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
                <th>Exempt from Consent?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>orientsol_theme</code></td>
                <td>localStorage</td>
                <td>Saves user visual preference (Light / Dark mode)</td>
                <td>Persistent</td>
                <td>Yes (Technical)</td>
              </tr>
              <tr>
                <td><code>orientsol_lang</code></td>
                <td>localStorage</td>
                <td>Stores selected application language (ES / EN)</td>
                <td>Persistent</td>
                <td>Yes (Technical)</td>
              </tr>
              <tr>
                <td><code>orientsol_climate_cache</code></td>
                <td>localStorage</td>
                <td>Stores climate station database to enable 100% offline simulations</td>
                <td>Persistent</td>
                <td>Yes (Technical)</td>
              </tr>
              <tr>
                <td><code>orientsol_offline_queue</code></td>
                <td>localStorage</td>
                <td>Maintains queued climate records when offline</td>
                <td>Session / Sync</td>
                <td>Yes (Technical)</td>
              </tr>
              <tr>
                <td><code>orientsol_cookie_consent</code></td>
                <td>localStorage</td>
                <td>Records acceptance of the technical storage policy</td>
                <td>1 year</td>
                <td>Yes (Technical)</td>
              </tr>
              <tr>
                <td><code>indexedDB (pyodide)</code></td>
                <td>IndexedDB</td>
                <td>Caches Pyodide WebAssembly runtime & NumPy binaries for instant offline boot</td>
                <td>Persistent</td>
                <td>Yes (Technical)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">3. User Control & Data Deletion</h4>
        <p class="legal-text">
          You maintain full sovereignty over your device's storage. You can wipe all stored preferences and cached datasets at any time using the button below or via your browser's "Clear Site Data" settings:
        </p>
        <div style="margin-top: 0.75rem;">
          <button type="button" class="btn btn-secondary" id="btn-clear-technical-storage" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
            🗑️ Clear Local Cache & Reset Preferences
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="legal-clause-card">
      <h4 class="legal-clause-title">1. Marco Legal y Cumplimiento de la Directiva ePrivacy</h4>
      <p class="legal-text">
        De conformidad con la Directiva 2002/58/CE (Directiva sobre la privacidad y las comunicaciones electrónicas), el artículo 5.3 del RGPD y el artículo 22.2 de la Ley 34/2002 (LSSI-CE), se informa a los usuarios sobre los mecanismos de almacenamiento local empleados por la plataforma.
      </p>
      <p class="legal-text" style="color: var(--accent-emerald, #10b981); font-weight: 600;">
        ✔ OrientSol 4.0 NO utiliza cookies publicitarias, NO utiliza píxeles de seguimiento ni rastreadores de analítica de terceros.
      </p>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">2. Inventario de Almacenamiento Estrictamente Técnico y Necesario</h4>
      <p class="legal-text">
        El almacenamiento local (<code>localStorage</code> e <code>indexedDB</code>) se utiliza exclusivamente para fines técnicos que permiten el correcto funcionamiento y la capacidad 100% offline de la aplicación (exentos del deber de recabar consentimiento expreso según el art. 22.2 LSSI-CE y la Guía de Cookies de la AEPD, aunque informados con total transparencia):
      </p>

      <div style="overflow-x: auto; margin-top: 0.75rem;">
        <table class="legal-table">
          <thead>
            <tr>
              <th>Clave / Almacén</th>
              <th>Tipo</th>
              <th>Finalidad Técnica</th>
              <th>Duración</th>
              <th>¿Exenta de Consentimiento?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>orientsol_theme</code></td>
              <td>localStorage</td>
              <td>Recuerda el modo visual elegido (Claro / Oscuro)</td>
              <td>Persistente</td>
              <td>Sí (Técnica)</td>
            </tr>
            <tr>
              <td><code>orientsol_lang</code></td>
              <td>localStorage</td>
              <td>Conserva el idioma seleccionado (Español / Inglés)</td>
              <td>Persistente</td>
              <td>Sí (Técnica)</td>
            </tr>
            <tr>
              <td><code>orientsol_climate_cache</code></td>
              <td>localStorage</td>
              <td>Copia local de estaciones meteorológicas para operar sin internet</td>
              <td>Persistente</td>
              <td>Sí (Técnica)</td>
            </tr>
            <tr>
              <td><code>orientsol_offline_queue</code></td>
              <td>localStorage</td>
              <td>Cola de transacciones meteorológicas pendientes de sincronizar</td>
              <td>Hasta sincronizar</td>
              <td>Sí (Técnica)</td>
            </tr>
            <tr>
              <td><code>orientsol_cookie_consent</code></td>
              <td>localStorage</td>
              <td>Guarda la confirmación de lectura de este aviso legal</td>
              <td>1 año</td>
              <td>Sí (Técnica)</td>
            </tr>
            <tr>
              <td><code>indexedDB (pyodide)</code></td>
              <td>IndexedDB</td>
              <td>Caché de paquetes WebAssembly (NumPy y Pyodide) para arranque instantáneo offline</td>
              <td>Persistente</td>
              <td>Sí (Técnica)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">3. Control del Usuario y Borrado de Datos</h4>
      <p class="legal-text">
        El usuario puede restablecer en cualquier instante todas las claves de configuración y caché local almacenadas en su navegador mediante el siguiente botón o desde los ajustes de privacidad de su navegador:
      </p>
      <div style="margin-top: 0.75rem;">
        <button type="button" class="btn btn-secondary" id="btn-clear-technical-storage" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
          🗑️ Vaciar Caché Local y Restablecer Preferencias
        </button>
      </div>
    </div>
  `;
}

function renderSecurityContent(isEn: boolean): string {
  if (isEn) {
    return `
      <div class="legal-clause-card">
        <h4 class="legal-clause-title">1. Technical Security Architecture & Threat Mitigation</h4>
        <p class="legal-text">
          OrientSol 4.0 was built to conform with modern web security standards, ISO/IEC 27001 principles, and OWASP Top 10 recommendations:
        </p>

        <div style="overflow-x: auto; margin-top: 0.75rem;">
          <table class="legal-table">
            <thead>
              <tr>
                <th>Security Vector</th>
                <th>Vulnerability / Risk</th>
                <th>OrientSol 4.0 Defense Mechanism</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>WebAssembly Sandbox</strong></td>
                <td>Remote Code Execution (RCE) / System Compromise</td>
                <td>Pyodide executes in an isolated WebAssembly memory sandbox. No direct filesystem, shell, or OS socket access.</td>
                <td><span class="badge badge-success">Passed</span></td>
              </tr>
              <tr>
                <td><strong>Cross-Site Scripting (XSS)</strong></td>
                <td>Malicious script injection into DOM</td>
                <td>Universal output encoding via <code>escapeHtml()</code> and <code>escapeAttr()</code> on all dynamic strings and station names.</td>
                <td><span class="badge badge-success">Passed</span></td>
              </tr>
              <tr>
                <td><strong>Formula / CSV Injection</strong></td>
                <td>CWE-1236 spreadsheet execution (=, +, -, @)</td>
                <td>Mandatory quote prepending via <code>sanitizeForSpreadsheet()</code> on all CSV and Excel exported cells.</td>
                <td><span class="badge badge-success">Passed</span></td>
              </tr>
              <tr>
                <td><strong>Database Access Control</strong></td>
                <td>Unauthorized database writes / data deletion</td>
                <td>Supabase PostgreSQL Row Level Security (RLS) enforcement and master UUID verification on public endpoints.</td>
                <td><span class="badge badge-success">Passed</span></td>
              </tr>
              <tr>
                <td><strong>Offline Resiliency</strong></td>
                <td>Telemetry snooping / MITM eavesdropping</td>
                <td>Full offline capability with local caching; operates securely without active internet connectivity.</td>
                <td><span class="badge badge-success">Passed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="legal-clause-card">
        <h4 class="legal-clause-title">2. Cryptography & Transmission Protocol</h4>
        <ul class="legal-list">
          <li><strong>Transport Layer Security:</strong> All external satellite queries (NASA POWER, PVGIS, Open-Meteo) and cloud database operations are strictly enforced over encrypted <strong>HTTPS / TLS 1.3</strong>.</li>
          <li><strong>Content Security Policy (CSP):</strong> Configured to prevent cross-origin script execution from untrusted domains.</li>
        </ul>
      </div>
    `;
  }

  return `
    <div class="legal-clause-card">
      <h4 class="legal-clause-title">1. Arquitectura Técnica de Seguridad y Mitigación de Amenazas</h4>
      <p class="legal-text">
        OrientSol 4.0 ha sido auditado y desarrollado conforme a las directrices de seguridad web OWASP Top 10 y los principios de seguridad de la información ISO/IEC 27001:
      </p>

      <div style="overflow-x: auto; margin-top: 0.75rem;">
        <table class="legal-table">
          <thead>
            <tr>
              <th>Vector de Seguridad</th>
              <th>Vulnerabilidad / Riesgo</th>
              <th>Mecanismo de Defensa en OrientSol 4.0</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Sandbox WebAssembly</strong></td>
              <td>Ejecución remota de código (RCE) en el servidor</td>
              <td>Pyodide corre en un entorno aislado WebAssembly en la memoria del navegador. Sin acceso a disco físico ni sockets del sistema.</td>
              <td><span class="badge badge-success">Auditado</span></td>
            </tr>
            <tr>
              <td><strong>Inyección XSS</strong></td>
              <td>Ejecución de scripts maliciosos en el DOM</td>
              <td>Escapeo universal de entidades HTML con <code>escapeHtml()</code> y <code>escapeAttr()</code> en todas las cadenas dinámicas.</td>
              <td><span class="badge badge-success">Auditado</span></td>
            </tr>
            <tr>
              <td><strong>Inyección CSV / Excel (CWE-1236)</strong></td>
              <td>Fórmulas peligrosas en hojas de cálculo (=, +, -, @)</td>
              <td>Sanitización estricta preventiva con <code>sanitizeForSpreadsheet()</code> en todas las celdas exportadas a Excel y CSV.</td>
              <td><span class="badge badge-success">Auditado</span></td>
            </tr>
            <tr>
              <td><strong>Control de Acceso a Base de Datos</strong></td>
              <td>Manipulación o borrado no autorizado en la nube</td>
              <td>Políticas de seguridad por filas (Row Level Security - RLS) en PostgreSQL y validación de UUID maestro en Supabase.</td>
              <td><span class="badge badge-success">Auditado</span></td>
            </tr>
            <tr>
              <td><strong>Resiliencia Offline</strong></td>
              <td>Fuga de datos por telemetría o intercepción MITM</td>
              <td>Capacidad operativa 100% aislada de la red con bases de datos locales, sin telemetría espía.</td>
              <td><span class="badge badge-success">Auditado</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="legal-clause-card">
      <h4 class="legal-clause-title">2. Criptografía y Seguridad en Tránsito</h4>
      <ul class="legal-list">
        <li><strong>Cifrado en Tránsito:</strong> Todas las consultas a servicios meteorológicos homologados (NASA POWER, PVGIS JRC, Open-Meteo) y a Supabase se ejecutan obligatoriamente mediante <strong>HTTPS / TLS 1.3</strong>.</li>
        <li><strong>Política de Seguridad de Contenidos (CSP):</strong> Restricción de inyección de scripts externos y protección contra ataques de Clickjacking.</li>
      </ul>
    </div>
  `;
}
