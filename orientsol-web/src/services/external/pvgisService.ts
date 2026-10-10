import type { ClimateDataRecord } from '@/types/climate';

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

  // JRC PVGIS MRcalc endpoint requires both &horirrad=1 (horizontal radiation) and &avtemp=1 (average 2m temperature)
  const endpointUrls = [
    `https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&avtemp=1&outputformat=json`,
    `https://re.jrc.ec.europa.eu/api/v5_2/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&avtemp=1&outputformat=json`,
  ];

  let lastError: Error | null = null;
  let json: PVGISResponse | null = null;
  let activeVersion = '5.3';

  for (let i = 0; i < endpointUrls.length; i++) {
    const url = endpointUrls[i];
    activeVersion = i === 0 ? '5.3' : '5.2';

    try {
      console.log(`[PVGIS API] Querying MRcalc (${activeVersion}) for lat=${roundedLat}, lon=${roundedLon}...`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        json = await response.json();
        break;
      } else {
        lastError = new Error(`PVGIS API HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  if (!json || !json.outputs?.monthly || !Array.isArray(json.outputs.monthly)) {
    const msg = lastError?.message || 'PVGIS API did not return valid monthly output.';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
      throw new Error(
        `PVGIS API blocked by browser CORS policy or network restriction. Try NASA POWER for direct client-side requests.`
      );
    }
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

  return {
    source: 'pvgis',
    locationName: `${locationName} (PVGIS ${activeVersion})`,
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
