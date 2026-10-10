import type { ClimateDataRecord } from '@/types/climate';

interface NasaPowerResponse {
  properties: {
    parameter: {
      ALLSKY_SFC_SW_DWN: Record<string, number>;
      T2M: Record<string, number>;
    };
  };
  geometry: {
    coordinates: [number, number, number];
  };
  header: {
    title: string;
  };
}

const NASA_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Fetches 12-month solar climatology and ambient temperatures from NASA POWER API.
 * Free, globally available, no API key required, fully CORS enabled.
 */
export async function fetchNasaPowerClimateData(
  latitude: number,
  longitude: number,
  locationName: string = 'NASA POWER Location'
): Promise<ClimateDataRecord> {
  const roundedLat = Math.round(latitude * 10000) / 10000;
  const roundedLon = Math.round(longitude * 10000) / 10000;

  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN,T2M&community=RE&longitude=${roundedLon}&latitude=${roundedLat}&format=JSON`;

  console.log(`[NASA POWER API] Querying climatology for lat=${roundedLat}, lon=${roundedLon}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA POWER API HTTP ${response.status}: ${response.statusText}`);
  }

  const json: NasaPowerResponse = await response.json();
  const radMap = json.properties?.parameter?.ALLSKY_SFC_SW_DWN;
  const tempMap = json.properties?.parameter?.T2M;

  if (!radMap || !tempMap) {
    throw new Error('NASA POWER response missing required solar radiation or temperature parameters.');
  }

  const monthlyGdm0: number[] = [];
  const monthlyTemperature: number[] = [];

  for (const m of NASA_MONTHS) {
    const valRad = radMap[m];
    const valTemp = tempMap[m];

    if (typeof valRad !== 'number' || valRad < 0) {
      throw new Error(`Invalid NASA radiation value for month ${m}: ${valRad}`);
    }
    monthlyGdm0.push(Math.round(valRad * 100) / 100);
    monthlyTemperature.push(typeof valTemp === 'number' ? Math.round(valTemp * 10) / 10 : 15.0);
  }

  const elevation = json.geometry?.coordinates?.[2];

  return {
    source: 'nasa_power',
    locationName: `${locationName} (NASA POWER)`,
    latitude: roundedLat,
    longitude: roundedLon,
    elevationM: typeof elevation === 'number' ? Math.round(elevation) : undefined,
    monthlyGdm0,
    monthlyTemperature,
    fetchedAt: new Date().toISOString(),
    metadata: {
      provider: 'NASA Langley Research Center POWER Project',
      parameter: 'ALLSKY_SFC_SW_DWN (kWh/m²/day), T2M (°C)',
    },
  };
}
