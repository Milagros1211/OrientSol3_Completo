import { LOCATIONS_DATABASE, ALBEDO_DATABASE } from '@/database';
import type { LocationData } from '@/types/database';
import { i18n } from '@/i18n';
import { formatNum } from '@/utils/formatters';

export function renderLocationSelector(
  onSelect: (location: LocationData, albedo: number) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'panel-card';

  const t = i18n.t;
  const isEn = i18n.getLocale() === 'en';

  container.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div>
        <h3 class="panel-title">${t.location.title}</h3>
        <p class="panel-desc">${t.location.subtitle}</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="location-select" class="form-label">${t.location.selectLabel}</label>
        <select id="location-select" class="form-select">
          <optgroup label="${isEn ? 'Spain (Provincial Capitals)' : 'España (Capitales de Provincia)'}">
            ${LOCATIONS_DATABASE.filter((l) => l.region === 'spain')
              .map((l) => `<option value="${l.id}">${l.name} (${l.country}) - Lat: ${formatNum(l.latitude, 2)}°</option>`)
              .join('')}
          </optgroup>
          <optgroup label="${isEn ? 'Europe & World' : 'Europa y Mundo'}">
            ${LOCATIONS_DATABASE.filter((l) => l.region === 'europe')
              .map((l) => `<option value="${l.id}">${l.name} (${l.country}) - Lat: ${formatNum(l.latitude, 2)}°</option>`)
              .join('')}
          </optgroup>
        </select>
      </div>

      <div class="form-group">
        <label for="albedo-select" class="form-label">${t.location.albedoLabel} (&rho;<sub>g</sub>)</label>
        <select id="albedo-select" class="form-select">
          ${ALBEDO_DATABASE.map(
            (a) => `<option value="${a.albedo}" ${a.id === 'standard' ? 'selected' : ''}>
              ${formatNum(a.albedo, 2)} - ${isEn ? a.name : a.nameEs}
            </option>`
          ).join('')}
        </select>
      </div>
    </div>

    <div id="location-details-box" class="location-details-box">
      <!-- Populated dynamically -->
    </div>
  `;

  const locationSelect = container.querySelector('#location-select') as HTMLSelectElement;
  const albedoSelect = container.querySelector('#albedo-select') as HTMLSelectElement;
  const detailsBox = container.querySelector('#location-details-box') as HTMLDivElement;

  function updateDetails() {
    const locId = locationSelect.value;
    const selectedLoc = LOCATIONS_DATABASE.find((l) => l.id === locId) || LOCATIONS_DATABASE[0];
    const albedoVal = parseFloat(albedoSelect.value);
    const currT = i18n.t;

    const annualGdm0 = selectedLoc.monthlyGdm0.reduce((a, b) => a + b, 0) / 12;

    detailsBox.innerHTML = `
      <div class="meta-pills">
        <span class="meta-pill"><strong>${currT.location.latitude}:</strong> ${formatNum(selectedLoc.latitude, 4)}° N</span>
        <span class="meta-pill"><strong>${currT.externalClimate.annualGdm0}:</strong> ${formatNum(annualGdm0, 2)} kWh/m²/d</span>
        <span class="meta-pill"><strong>${currT.location.albedoLabel}:</strong> ${formatNum(albedoVal, 2)}</span>
      </div>
      <div class="mini-chart-summary">
        <span class="summary-label">${currT.common.appName} G<sub>dm</sub>(0) [kWh/m²/d]:</span>
        <div class="monthly-bars">
          ${selectedLoc.monthlyGdm0
            .map(
              (val, idx) => `
            <div class="monthly-bar-col" title="${currT.common.monthNamesShort[idx]}: ${val} kWh/m²">
              <div class="bar-fill" style="height: ${Math.round((val / 8.5) * 100)}%;"></div>
              <span class="bar-label">${currT.common.monthNamesShort[idx]}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    onSelect(selectedLoc, albedoVal);
  }

  locationSelect.addEventListener('change', updateDetails);
  albedoSelect.addEventListener('change', updateDetails);

  // Initial render
  setTimeout(updateDetails, 0);

  return container;
}
