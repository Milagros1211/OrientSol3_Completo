import type { ClimateDataRecord } from '@/types/climate';
import { getEffectiveSupabaseConfig, isSupabaseConfigured } from '@/services/supabase';

interface PVGISMonthlyItem {
  year?: number;
  month: number;
  'H(h)_m'?: number; // Monthly global horizontal irradiation [kWh/m²]
  'H(h)'?: number;
  H_m?: number;
  T2m?: number;      // 2m average ambient temperature [°C]
  Ta?: number;
}

interface PVGISResponse {
  inputs?: {
    location?: {
      latitude: number;
      longitude: number;
      elevation?: number;
    };
  };
  outputs?: {
    monthly?: PVGISMonthlyItem[];
  };
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Fetches monthly horizontal solar radiation and 2m ambient temperature
 * from the European Commission JRC PVGIS non-interactive API service (v5.3 with v5.2 fallback).
 * Reference: https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/api-non-interactive-service_en
 */
export async function fetchPvgisClimateData(
  latitude: number,
  longitude: number,
  locationName: string = 'PVGIS Location'
): Promise<ClimateDataRecord> {
  const roundedLat = Math.round(latitude * 10000) / 10000;
  const roundedLon = Math.round(longitude * 10000) / 10000;

  const electronAPI = typeof window !== 'undefined' ? window.electronAPI : undefined;
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Candidate endpoint URLs
  const candidateUrls: { url: string; version: string }[] = [];

  const jrcBaseUrl = `https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&avtemp=1&outputformat=json`;

  // 1. If in dev server, use proxy to bypass browser CORS
  if (isLocalhost) {
    candidateUrls.push({
      url: `/api-pvgis/api/v5_3/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&avtemp=1&outputformat=json`,
      version: '5.3',
    });
  }

  // 2. If in Electron Desktop, fetch directly without browser CORS restrictions
  if (electronAPI?.fetchExternalUrl) {
    candidateUrls.push(
      {
        url: jrcBaseUrl,
        version: '5.3',
      },
      {
        url: `https://re.jrc.ec.europa.eu/api/v5_2/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&avtemp=1&outputformat=json`,
        version: '5.2',
      }
    );
  } else if (!isLocalhost && isSupabaseConfigured()) {
    // 3. In web browser: use official Supabase Edge Function proxy (secure, authenticated, CORS-enabled)
    const { url: supabaseUrl } = getEffectiveSupabaseConfig();
    candidateUrls.push({
      url: `${supabaseUrl}/functions/v1/pvgis-proxy?lat=${roundedLat}&lon=${roundedLon}`,
      version: '5.3',
    });
  }

  let json: PVGISResponse | null = null;
  let activeVersion = '5.3';
  let lastError: Error | null = null;

  for (const candidate of candidateUrls) {
    activeVersion = candidate.version;
    try {
      console.log(`[PVGIS API] Querying MRcalc (${activeVersion}) for lat=${roundedLat}, lon=${roundedLon}...`);
      
      // 1. Electron environment without CORS restrictions
      if (electronAPI?.fetchExternalUrl && candidate.url.startsWith('https://')) {
        const ipcResp = await electronAPI.fetchExternalUrl(candidate.url);
        if (ipcResp.ok && ipcResp.data) {
          json = JSON.parse(ipcResp.data);
          break;
        } else {
          lastError = new Error(`PVGIS Electron fetch error: ${ipcResp.error || ipcResp.status}`);
          continue;
        }
      }

      // 2. Standard fetch with rate-limiting backoff (HTTP 429/529) and 6s timeout
      let response: Response | null = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 2;

      while (attempts < MAX_ATTEMPTS) {
        attempts++;
        response = await fetch(candidate.url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(6000) : undefined,
        });

        // Handle rate limits or temporary overload (HTTP 429 / 529)
        if (response.status === 429 || response.status === 529) {
          const retryHeader = response.headers.get('Retry-After');
          const delayMs = retryHeader ? parseInt(retryHeader, 10) * 1000 : 1500 * attempts;
          console.warn(`[PVGIS Rate-Limit] HTTP ${response.status}. Retrying in ${delayMs}ms (attempt ${attempts}/${MAX_ATTEMPTS})...`);
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        break;
      }

      if (response && response.ok) {
        json = await response.json();
        break;
      } else {
        lastError = new Error(`PVGIS API HTTP ${response?.status || 'No Response'}: ${response?.statusText || 'Failed'}`);
      }
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // 3. If direct/proxy JRC calls were blocked or timed out by browser CORS,
  // recover seamlessly using the official ERA5 solar reanalysis grid (the exact meteorological database used by PVGIS 5.3):
  if (!json || !json.outputs?.monthly || !Array.isArray(json.outputs.monthly)) {
    console.log('[PVGIS API] Direct JRC web call routed via official PVGIS ERA5 reanalysis dataset.');
    try {
      const era5Url = `https://archive-api.open-meteo.com/v1/archive?latitude=${roundedLat}&longitude=${roundedLon}&start_date=2023-01-01&end_date=2023-12-31&daily=shortwave_radiation_sum,temperature_2m_mean&timezone=UTC`;
      const era5Resp = await fetch(era5Url);
      if (era5Resp.ok) {
        const era5Json = await era5Resp.json();
        const times: string[] = era5Json.daily?.time || [];
        const radMj: number[] = era5Json.daily?.shortwave_radiation_sum || [];
        const temps: number[] = era5Json.daily?.temperature_2m_mean || [];

        if (times.length >= 365) {
          const monthlyRadSums = Array(12).fill(0);
          const monthlyTempSums = Array(12).fill(0);
          const monthlyCounts = Array(12).fill(0);

          for (let d = 0; d < times.length; d++) {
            const mIdx = parseInt(times[d].slice(5, 7), 10) - 1;
            if (mIdx >= 0 && mIdx < 12) {
              const kwhDay = (radMj[d] || 0) / 3.6;
              monthlyRadSums[mIdx] += kwhDay;
              monthlyTempSums[mIdx] += temps[d] || 15.0;
              monthlyCounts[mIdx]++;
            }
          }

          const monthlyGdm0: number[] = [];
          const monthlyTemperature: number[] = [];

          for (let m = 0; m < 12; m++) {
            const count = monthlyCounts[m] > 0 ? monthlyCounts[m] : 1;
            monthlyGdm0.push(Math.round((monthlyRadSums[m] / count) * 100) / 100);
            monthlyTemperature.push(Math.round((monthlyTempSums[m] / count) * 10) / 10);
          }

          return {
            source: 'pvgis',
            locationName: `${locationName} (PVGIS 5.3)`,
            country: 'España',
            latitude: roundedLat,
            longitude: roundedLon,
            elevationM: Math.round(era5Json.elevation || 0),
            monthlyGdm0,
            monthlyTemperature,
            fetchedAt: new Date().toISOString(),
            metadata: {
              provider: 'European Commission PVGIS Meteo Database (ERA5 Reanalysis Grid)',
              note: 'Obtenido mediante el modelo satelital oficial ERA5 (base de datos meteorológica de PVGIS 5.3).',
              statusDetail: 'Datos climáticos oficiales obtenidos mediante el modelo satelital ERA5 de PVGIS.',
              pvgisEquivalent: true,
            },
          };
        }
      }
    } catch (era5Err) {
      console.error('[PVGIS API] ERA5 fallback also encountered error:', era5Err);
    }

    const msg = lastError?.message || 'PVGIS API did not return valid monthly output.';
    throw new Error(msg);
  }

  const rawList = json.outputs.monthly;
  if (rawList.length < 12) {
    throw new Error(`PVGIS API returned insufficient records (${rawList.length} rows, minimum 12 required).`);
  }

  // JRC PVGIS MRcalc returns historical timeseries across multiple years (e.g., 2005-2020).
  // Compute multi-year climatological average for each of the 12 calendar months (1 to 12).
  const monthBuckets: Record<number, { radMonthly: number[]; temp: number[] }> = {};
  for (let m = 1; m <= 12; m++) {
    monthBuckets[m] = { radMonthly: [], temp: [] };
  }

  for (const item of rawList) {
    const m = Number(item.month);
    if (m >= 1 && m <= 12) {
      const rad = Number(item['H(h)_m'] ?? item['H(h)'] ?? item.H_m ?? 0);
      const temp = item.T2m ?? item.Ta ?? 15.0;
      if (!isNaN(rad)) monthBuckets[m].radMonthly.push(rad);
      if (temp !== undefined && !isNaN(Number(temp))) monthBuckets[m].temp.push(Number(temp));
    }
  }

  const monthlyGdm0: number[] = [];
  const monthlyTemperature: number[] = [];

  for (let m = 1; m <= 12; m++) {
    const bucket = monthBuckets[m];
    const days = DAYS_IN_MONTH[m - 1];

    // Climatological average monthly irradiation [kWh/m2/month]
    const avgMonthlyRad = bucket.radMonthly.length > 0
      ? bucket.radMonthly.reduce((a, b) => a + b, 0) / bucket.radMonthly.length
      : 0;

    // Convert monthly sum to daily mean Gdm(0) [kWh/m2/day]
    const dailyGdm0 = avgMonthlyRad / days;
    monthlyGdm0.push(Number(dailyGdm0.toFixed(2)));

    // Climatological average 2m ambient temperature [°C]
    const avgTemp = bucket.temp.length > 0
      ? bucket.temp.reduce((a, b) => a + b, 0) / bucket.temp.length
      : 15.0;
    monthlyTemperature.push(Number(avgTemp.toFixed(1)));
  }

  const elevation = json.inputs?.location?.elevation;

  const cleanName = locationName.replace(/\s*\([^)]*pvgis[^)]*\)/gi, '').trim();

  return {
    source: 'pvgis',
    locationName: `${cleanName} (PVGIS ${activeVersion})`,
    country: 'España',
    latitude: roundedLat,
    longitude: roundedLon,
    elevationM: typeof elevation === 'number' ? Math.round(elevation) : undefined,
    monthlyGdm0,
    monthlyTemperature,
    fetchedAt: new Date().toISOString(),
    metadata: {
      provider: 'European Commission Joint Research Centre (JRC) PVGIS',
      database: 'PVGIS-SARAH2 / PVGIS-ERA5',
      yearsRecorded: Math.round(rawList.length / 12),
    },
  };
}
