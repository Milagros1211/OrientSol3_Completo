import type { ClimateDataRecord, ClimateSourceType } from '@/types/climate';
import { fetchNasaPowerClimateData } from './nasaPowerService';
import { fetchPvgisClimateData } from './pvgisService';
import { fetchMeteonormClimateData } from './meteonormService';
import { climateDatabaseService } from '../supabase/climateDatabaseService';

export interface UnifiedClimateRequest {
  source: ClimateSourceType;
  latitude: number;
  longitude: number;
  locationName?: string;
}

/**
 * Unified service to query climate and solar data across all supported providers:
 * - NASA POWER (Global Satellite & Reanalysis Climatology)
 * - PVGIS 5.3 (EU JRC Radiation Database)
 * - Meteonorm / Open-Meteo (Standardized Solar Radiation)
 * - Supabase Cloud Database (Custom or Organization Datasets)
 * - Local IDAE Database (Embedded Offline Baseline)
 */
export async function fetchUnifiedClimateData(req: UnifiedClimateRequest): Promise<ClimateDataRecord> {
  const { source, latitude, longitude, locationName = 'Punto Geográfico' } = req;
  const electronAPI = typeof window !== 'undefined' ? window.electronAPI : undefined;

  console.log(`[Climate Aggregator] Fetching from source: ${source} at (${latitude}, ${longitude})...`);

  try {
    let result: ClimateDataRecord;

    switch (source) {
      case 'nasa_power':
        result = await fetchNasaPowerClimateData(latitude, longitude, locationName);
        break;

      case 'pvgis':
        result = await fetchPvgisClimateData(latitude, longitude, locationName);
        break;

      case 'meteonorm':
        result = await fetchMeteonormClimateData(latitude, longitude, locationName);
        break;

      case 'supabase': {
        const match = await climateDatabaseService.findLocationByCoords(latitude, longitude);
        if (match) {
          result = match;
          break;
        }
        console.warn('[Climate Aggregator] No exact location found in Supabase table; falling back to offline cache.');
        const all = await climateDatabaseService.getClimateDatasets();
        result = all[0];
        break;
      }

      case 'local_database':
      default: {
        const match = await climateDatabaseService.findLocationByCoords(latitude, longitude, 1.0);
        if (match) {
          result = match;
          break;
        }
        const all = await climateDatabaseService.getClimateDatasets();
        result = all[0];
        break;
      }
    }

    // Auto-persist successfully fetched external data into Electron disk cache and localStorage
    if (electronAPI) {
      electronAPI.saveOfflineClimateRecord(result).catch((err) => {
        console.warn('[Offline Resilience] Error auto-caching to Electron disk:', err);
      });
    }

    return result;
  } catch (fetchError: any) {
    console.warn(
      `[Offline Resilience] External fetch from ${source} failed (${fetchError?.message || fetchError}).`
    );

    // If user specifically requested an external API (PVGIS, NASA, Meteonorm), propagate error
    if (source === 'pvgis' || source === 'nasa_power' || source === 'meteonorm') {
      throw fetchError;
    }

    // For local or generic lookups, fallback to local database / cache
    if (electronAPI) {
      try {
        const match = await electronAPI.getOfflineRecordByCoords(latitude, longitude, 2.0);
        if (match) {
          console.log(`[Offline Resilience] Recovered nearest cached dataset: ${match.locationName}`);
          return {
            ...match,
            metadata: { ...match.metadata, isOfflineFallback: true, originalError: fetchError?.message },
          };
        }
      } catch (err) {
        console.warn('[Offline Resilience] Could not read from Electron cache:', err);
      }
    }

    const offlineList = await climateDatabaseService.getClimateDatasets();
    if (offlineList.length > 0) {
      return {
        ...offlineList[0],
        metadata: { ...offlineList[0].metadata, isOfflineFallback: true, originalError: fetchError?.message },
      };
    }

    throw fetchError;
  }
}

