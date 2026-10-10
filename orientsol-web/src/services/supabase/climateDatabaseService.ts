import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import type { ClimateDataRecord, SupabaseClimateRow } from '@/types/climate';
import { LOCATIONS_DATABASE } from '@/database/locations';

const LOCAL_STORAGE_CACHE_KEY = 'orientsol_climate_datasets_cache';

/**
 * Service to manage manual climate datasets stored in Supabase with offline caching.
 */
export class ClimateDatabaseService {
  private static instance: ClimateDatabaseService | null = null;

  public static getInstance(): ClimateDatabaseService {
    if (!ClimateDatabaseService.instance) {
      ClimateDatabaseService.instance = new ClimateDatabaseService();
    }
    return ClimateDatabaseService.instance;
  }

  /**
   * Returns true if Supabase URL and anon key are configured.
   */
  public isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  /**
   * Fetches all climate datasets from Supabase, falling back to Electron disk cache,
   * localStorage, or default IDAE datasets in offline scenarios.
   */
  public async getClimateDatasets(): Promise<ClimateDataRecord[]> {
    const supabase = getSupabaseClient();
    const electronAPI = typeof window !== 'undefined' ? window.electronAPI : undefined;

    if (supabase) {
      try {
        console.log('[Supabase Climate] Fetching climate datasets from Supabase table: climate_locations...');
        const { data, error } = await supabase
          .from('climate_locations')
          .select('*')
          .order('name', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          const records: ClimateDataRecord[] = data.map((row: SupabaseClimateRow) => ({
            id: row.id || `supabase-${row.name.toLowerCase().replace(/\s+/g, '-')}`,
            source: 'supabase',
            locationName: row.name,
            country: row.country || 'España',
            latitude: row.latitude,
            longitude: row.longitude,
            elevationM: row.elevation_m,
            monthlyGdm0: row.monthly_gdm0,
            monthlyTemperature: row.monthly_temperature,
            fetchedAt: new Date().toISOString(),
            metadata: { is_verified: row.is_verified, notes: row.notes },
          }));

          // Cache in localStorage and Electron offline disk storage
          this.saveToCache(records);
          if (electronAPI) {
            for (const rec of records) {
              await electronAPI.saveOfflineClimateRecord(rec).catch(() => {});
            }
          }
          return records;
        } else if (error) {
          console.warn('[Supabase Climate] Query returned error, falling back to offline cache:', error.message);
        }
      } catch (err) {
        console.warn('[Supabase Climate] Network or execution error:', err);
      }
    } else {
      console.log('[Supabase Climate] Supabase is unconfigured, using offline/local datasets.');
    }

    // Fallback 1: Electron Persistent Disk Cache
    if (electronAPI) {
      try {
        const electronCached = await electronAPI.getOfflineClimateCache();
        if (Array.isArray(electronCached) && electronCached.length > 0) {
          console.log(`[Offline Resilience] Loaded ${electronCached.length} datasets from Electron disk cache.`);
          return electronCached;
        }
      } catch (e) {
        console.warn('[Offline Resilience] Error querying Electron cache:', e);
      }
    }

    // Fallback 2: LocalStorage Cache
    const cached = this.getFromCache();
    if (cached && cached.length > 0) {
      return cached;
    }

    // Fallback 3: Default OrientSol / IDAE Locations Database
    return this.getDefaultLocationsAsRecords();
  }

  /**
   * Searches for a location by name or coordinates.
   */
  public async findLocationByCoords(latitude: number, longitude: number, toleranceDeg: number = 0.5): Promise<ClimateDataRecord | null> {
    const electronAPI = typeof window !== 'undefined' ? window.electronAPI : undefined;
    if (electronAPI) {
      try {
        const match = await electronAPI.getOfflineRecordByCoords(latitude, longitude, toleranceDeg);
        if (match) return match;
      } catch {
        // Fallback to in-memory search
      }
    }

    const all = await this.getClimateDatasets();
    let bestMatch: ClimateDataRecord | null = null;
    let minDistance = Infinity;

    for (const item of all) {
      const dist = Math.hypot(item.latitude - latitude, item.longitude - longitude);
      if (dist <= toleranceDeg && dist < minDistance) {
        minDistance = dist;
        bestMatch = item;
      }
    }

    return bestMatch;
  }

  /**
   * Saves or uploads a new manual climate dataset to Supabase (and caches locally).
   */
  public async saveManualClimateDataset(record: Omit<ClimateDataRecord, 'id' | 'fetchedAt'>): Promise<ClimateDataRecord> {
    const newRecord: ClimateDataRecord = {
      ...record,
      id: `manual-${Date.now()}`,
      source: 'supabase',
      fetchedAt: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload: SupabaseClimateRow = {
          name: record.locationName,
          country: record.country,
          latitude: record.latitude,
          longitude: record.longitude,
          elevation_m: record.elevationM,
          monthly_gdm0: record.monthlyGdm0,
          monthly_temperature: record.monthlyTemperature,
          notes: 'Saved from OrientSol Web',
        };

        const { data, error } = await supabase.from('climate_locations').insert([payload]).select();
        if (!error && data && data.length > 0) {
          newRecord.id = data[0].id;
          console.log('[Supabase Climate] Successfully persisted new record to Supabase:', newRecord.id);
        } else if (error) {
          console.warn('[Supabase Climate] Could not persist to Supabase:', error.message);
        }
      } catch (err) {
        console.warn('[Supabase Climate] Network error while saving to Supabase:', err);
      }
    }

    // Always update local cache and Electron disk storage so user doesn't lose data
    const existing = this.getFromCache() || this.getDefaultLocationsAsRecords();
    const updated = [newRecord, ...existing.filter((item) => item.locationName !== newRecord.locationName)];
    this.saveToCache(updated);

    const electronAPI = typeof window !== 'undefined' ? window.electronAPI : undefined;
    if (electronAPI) {
      electronAPI.saveOfflineClimateRecord(newRecord).catch((err) => {
        console.warn('[Electron Disk Cache] Error persisting record:', err);
      });
    }

    return newRecord;
  }

  /**
   * Fetches climate data for a specific location ID or returns the first available record.
   */
  public async fetchClimateData(locationId?: string): Promise<ClimateDataRecord | null> {
    const all = await this.getClimateDatasets();
    if (!locationId) return all[0] || null;
    const found = all.find((r) => r.id === locationId || r.locationName.toLowerCase().includes(locationId.toLowerCase()));
    return found || all[0] || null;
  }

  /**
   * Saves or persists a climate dataset record.
   */
  public async saveClimateData(record: ClimateDataRecord): Promise<ClimateDataRecord> {
    return this.saveManualClimateDataset(record);
  }

  private saveToCache(records: ClimateDataRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(records));
    } catch {
      // Storage quota or SSR
    }
  }

  private getFromCache(): ClimateDataRecord[] | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Ignore
    }
    return null;
  }

  private getDefaultLocationsAsRecords(): ClimateDataRecord[] {
    return LOCATIONS_DATABASE.map((loc) => ({
      id: loc.id,
      source: 'local_database',
      locationName: loc.name,
      country: loc.country,
      latitude: loc.latitude,
      longitude: loc.longitude || 0.0,
      elevationM: loc.elevationM,
      monthlyGdm0: loc.monthlyGdm0,
      monthlyTemperature: loc.monthlyTempC,
      fetchedAt: new Date().toISOString(),
      metadata: { region: loc.region },
    }));
  }
}

export const climateDatabaseService = ClimateDatabaseService.getInstance();
