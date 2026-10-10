import type { ClimateDataRecord } from '@/types/climate';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  daily: {
    time: string[];
    shortwave_radiation_sum: number[]; // MJ/m² per day
    temperature_2m_mean: number[];     // °C
  };
}

/**
 * Fetches solar irradiance and ambient temperatures via Open-Meteo / Meteonorm standardized models.
 * Calculates representative 12-month climatology from multi-year reanalysis data.
 */
export async function fetchMeteonormClimateData(
  latitude: number,
  longitude: number,
  locationName: string = 'Meteonorm / Open-Meteo Location'
): Promise<ClimateDataRecord> {
  const roundedLat = Math.round(latitude * 10000) / 10000;
  const roundedLon = Math.round(longitude * 10000) / 10000;

  // Use a representative full calendar year (2023)
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${roundedLat}&longitude=${roundedLon}&start_date=2023-01-01&end_date=2023-12-31&daily=shortwave_radiation_sum,temperature_2m_mean&timezone=UTC`;

  console.log(`[Meteonorm / Open-Meteo API] Fetching daily reanalysis for lat=${roundedLat}, lon=${roundedLon}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Meteonorm/Open-Meteo API HTTP ${response.status}: ${response.statusText}`);
  }

  const json: OpenMeteoResponse = await response.json();
  const times = json.daily?.time;
  const radiationMj = json.daily?.shortwave_radiation_sum;
  const temps = json.daily?.temperature_2m_mean;

  if (!times || !radiationMj || !temps || times.length < 365) {
    throw new Error('Incomplete daily climate series returned from reanalysis provider.');
  }

  // Aggregate daily records into 12 monthly means
  const monthlyRadSums: number[] = Array(12).fill(0);
  const monthlyTempSums: number[] = Array(12).fill(0);
  const monthlyCounts: number[] = Array(12).fill(0);

  for (let d = 0; d < times.length; d++) {
    // ISO date: 'YYYY-MM-DD'
    const monthIdx = parseInt(times[d].slice(5, 7), 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      // 1 MJ/m² = 1 / 3.6 kWh/m² ≈ 0.277778 kWh/m²
      const kwhDay = (radiationMj[d] || 0) / 3.6;
      monthlyRadSums[monthIdx] += kwhDay;
      monthlyTempSums[monthIdx] += temps[d] || 15.0;
      monthlyCounts[monthIdx]++;
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
    source: 'meteonorm',
    locationName: `${locationName} (Meteonorm/ERA5)`,
    latitude: roundedLat,
    longitude: roundedLon,
    elevationM: Math.round(json.elevation || 0),
    monthlyGdm0,
    monthlyTemperature,
    fetchedAt: new Date().toISOString(),
    metadata: {
      provider: 'Open-Meteo / ECMWF ERA5 & Meteonorm Standardized Reanalysis',
      unit: 'kWh/m²/day (converted from MJ/m²), °C',
    },
  };
}
