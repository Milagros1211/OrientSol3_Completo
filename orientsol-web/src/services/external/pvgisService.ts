import type { ClimateDataRecord } from '@/types/climate';

interface PVGISMonthlyItem {
  year?: number;
  month: number;
  'H(h)_m': number; // Monthly global horizontal irradiation [kWh/m²]
  T2m: number;      // 2m average ambient temperature [°C]
}

interface PVGISResponse {
  inputs: {
    location: {
      latitude: number;
      longitude: number;
      elevation?: number;
    };
  };
  outputs: {
    monthly: PVGISMonthlyItem[];
  };
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Fetches monthly horizontal solar radiation and temperature from the EU PVGIS 5.3 API.
 */
export async function fetchPvgisClimateData(
  latitude: number,
  longitude: number,
  locationName: string = 'PVGIS Location'
): Promise<ClimateDataRecord> {
  const roundedLat = Math.round(latitude * 10000) / 10000;
  const roundedLon = Math.round(longitude * 10000) / 10000;

  const url = `https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&outputformat=json`;

  console.log(`[PVGIS API] Querying radiation for lat=${roundedLat}, lon=${roundedLon}...`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PVGIS API HTTP ${response.status}: ${response.statusText}`);
    }

    const json: PVGISResponse = await response.json();
    const monthlyList = json.outputs?.monthly;

    if (!monthlyList || !Array.isArray(monthlyList) || monthlyList.length < 12) {
      throw new Error('PVGIS API did not return expected 12-month data.');
    }

    // Sort by month (1 to 12)
    const sorted = [...monthlyList].sort((a, b) => a.month - b.month).slice(0, 12);

    const monthlyGdm0: number[] = [];
    const monthlyTemperature: number[] = [];

    for (let i = 0; i < 12; i++) {
      const item = sorted[i];
      const monthlyTotal = item['H(h)_m']; // kWh/m2 per month
      const days = DAYS_IN_MONTH[i];
      const dailyMean = monthlyTotal / days;

      monthlyGdm0.push(Math.round(dailyMean * 100) / 100);
      monthlyTemperature.push(Math.round(item.T2m * 10) / 10);
    }

    const elevation = json.inputs?.location?.elevation;

    return {
      source: 'pvgis',
      locationName: `${locationName} (PVGIS 5.3)`,
      latitude: roundedLat,
      longitude: roundedLon,
      elevationM: typeof elevation === 'number' ? Math.round(elevation) : undefined,
      monthlyGdm0,
      monthlyTemperature,
      fetchedAt: new Date().toISOString(),
      metadata: {
        provider: 'European Commission Joint Research Centre (JRC) PVGIS',
        database: 'PVGIS-SARAH2 / PVGIS-ERA5',
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
      throw new Error(
        `PVGIS API blocked by browser CORS policy or network restriction. Try NASA POWER for direct client-side requests.`
      );
    }
    throw err;
  }
}
