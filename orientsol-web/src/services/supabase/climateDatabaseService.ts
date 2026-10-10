import {
  getSupabaseClient,
  isSupabaseConfigured,
  testSupabaseConnection,
} from './supabaseClient';
import type { ClimateDataRecord } from '@/types/climate';
import { LOCATIONS_DATABASE } from '@/database/locations';

const LOCAL_STORAGE_CACHE_KEY = 'orientsol_climate_datasets_cache';
const OFFLINE_SYNC_QUEUE_KEY = 'orientsol_supabase_offline_queue';

/** Days in each month for calculating monthly accumulated radiation <-> daily Gdm(0) */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface SimilarityResult {
  isDuplicate: boolean;
  similarityPct: number;
  matchedRecord?: ClimateDataRecord;
  message?: string;
}

export interface RegisterEmplacementResult {
  success: boolean;
  isDuplicate: boolean;
  isOffline: boolean;
  similarityPct?: number;
  matchedRecord?: ClimateDataRecord;
  message: string;
  record: ClimateDataRecord;
}

export interface SyncSummary {
  total: number;
  inserted: number;
  duplicates: number;
  errors: number;
  details: Array<{
    name: string;
    status: 'inserted' | 'duplicate' | 'error';
    message: string;
    similarityPct?: number;
  }>;
}

type DatabaseStateListener = () => void;

/**
 * Calculates similarity percentage (0 to 100%) between two climate data records
 * strictly based on numerical data (12-month Gdm0, 12-month Tamb, and geographic coordinates).
 */
export function calculateDataSimilarity(recA: ClimateDataRecord, recB: ClimateDataRecord): number {
  if (!recA || !recB) return 0;

  // 1. Monthly solar radiation similarity (50% weight)
  let radSimSum = 0;
  for (let m = 0; m < 12; m++) {
    const valA = recA.monthlyGdm0?.[m] ?? 0;
    const valB = recB.monthlyGdm0?.[m] ?? 0;
    const maxVal = Math.max(valA, valB, 0.1);
    const diff = Math.abs(valA - valB);
    const mSim = Math.max(0, 1 - diff / maxVal);
    radSimSum += mSim;
  }
  const radSim = radSimSum / 12;

  // 2. Monthly temperature similarity (30% weight)
  let tempSimSum = 0;
  for (let m = 0; m < 12; m++) {
    const valA = recA.monthlyTemperature?.[m] ?? 0;
    const valB = recB.monthlyTemperature?.[m] ?? 0;
    const diff = Math.abs(valA - valB);
    // 35°C typical annual regional variation window
    const mSim = Math.max(0, 1 - diff / 35.0);
    tempSimSum += mSim;
  }
  const tempSim = tempSimSum / 12;

  // 3. Geographic coordinates proximity (20% weight)
  const latDiff = Math.abs(recA.latitude - recB.latitude);
  const lonDiff = Math.abs(recA.longitude - recB.longitude);
  const coordDist = Math.hypot(latDiff, lonDiff);

  let coordSim = 1.0;
  if (coordDist > 0.05) {
    coordSim = Math.max(0, 1 - coordDist / 10.0);
  }

  // Combined score: 50% Gdm0 + 30% Tamb + 20% Coords
  const total = (radSim * 0.50 + tempSim * 0.30 + coordSim * 0.20) * 100;
  return Math.round(total * 10) / 10;
}

/**
 * Service to manage climate datasets in Supabase with automatic online ingestion,
 * offline caching, similarity duplicate detection (>=90%), and manual sync.
 */
export class ClimateDatabaseService {
  private static instance: ClimateDatabaseService | null = null;
  private listeners: Set<DatabaseStateListener> = new Set();

  public static getInstance(): ClimateDatabaseService {
    if (!ClimateDatabaseService.instance) {
      ClimateDatabaseService.instance = new ClimateDatabaseService();
    }
    return ClimateDatabaseService.instance;
  }

  public isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public subscribe(listener: DatabaseStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('[Supabase Service] Listener error:', err);
      }
    });
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
   * Searches for a location by coordinates with tolerance.
   */
  public async findLocationByCoords(latitude: number, longitude: number, toleranceDeg: number = 0.5): Promise<ClimateDataRecord | null> {
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
   * Fetches all climate datasets from Supabase (or offline cache if offline).
   */
  public async getClimateDatasets(): Promise<ClimateDataRecord[]> {
    const supabase = getSupabaseClient();

    if (supabase && this.isOnline()) {
      try {
        const { data, error } = await supabase
          .from('datos_mensuales')
          .select('*');

        if (!error && Array.isArray(data) && data.length > 0) {
          // Check if table contains monthly normalized rows (nombre_emplazamiento, mes, radiacion_media, temp_media)
          const isMonthlyRows = data.some((r: any) => r.nombre_emplazamiento !== undefined || r.mes !== undefined);

          let records: ClimateDataRecord[] = [];

          if (isMonthlyRows) {
            // Group rows by location name and coordinates
            const grouped = new Map<string, any[]>();
            for (const row of data) {
              const name = (row.nombre_emplazamiento || row.name || row.nombre || 'Emplazamiento').trim();
              const key = `${name.toLowerCase()}_${row.latitud ?? row.latitude ?? 0}_${row.longitud ?? row.longitude ?? 0}`;
              if (!grouped.has(key)) {
                grouped.set(key, []);
              }
              grouped.get(key)!.push(row);
            }

            for (const [, rows] of grouped.entries()) {
              const first = rows[0];
              const locName = (first.nombre_emplazamiento || first.name || first.nombre || 'Emplazamiento').trim();
              const lat = Number(first.latitud ?? first.latitude ?? 0);
              const lon = Number(first.longitud ?? first.longitude ?? 0);

              const monthlyGdm0 = new Array(12).fill(0);
              const monthlyTemp = new Array(12).fill(0);

              for (const r of rows) {
                const m = Number(r.mes);
                if (m >= 1 && m <= 12) {
                  const idx = m - 1;
                  const rawRad = Number(r.radiacion_media ?? r.gdm0 ?? 0);
                  const days = DAYS_IN_MONTH[idx];
                  // If rawRad > 15, it is monthly accumulated radiation (kWh/m²/mes); convert to daily average Gdm(0) (kWh/m²/día)
                  const dailyGdm0 = rawRad > 15 ? Number((rawRad / days).toFixed(2)) : rawRad;
                  monthlyGdm0[idx] = dailyGdm0;
                  monthlyTemp[idx] = Number(r.temp_media ?? r.temperatura ?? 0);
                }
              }

              records.push({
                id: `supabase-${locName.toLowerCase().replace(/\s+/g, '-')}`,
                source: 'supabase',
                locationName: locName,
                country: first.country || first.pais || 'España',
                latitude: lat,
                longitude: lon,
                monthlyGdm0,
                monthlyTemperature: monthlyTemp,
                fetchedAt: first.created_at || new Date().toISOString(),
                metadata: {
                  sourceTable: 'datos_mensuales',
                  totalMonthsRecorded: rows.length,
                },
              });
            }
          } else {
            // Fallback for wide format
            records = data.map((row: any) => ({
              id: row.id ? String(row.id) : `supabase-${(row.name || row.nombre || 'loc').toLowerCase().replace(/\s+/g, '-')}`,
              source: 'supabase',
              locationName: row.name || row.nombre || 'Ubicación Supabase',
              country: row.country || row.pais || 'España',
              latitude: Number(row.latitude ?? row.latitud ?? 0),
              longitude: Number(row.longitude ?? row.longitud ?? 0),
              elevationM: row.elevation_m != null ? Number(row.elevation_m) : undefined,
              monthlyGdm0: (row.monthly_gdm0 || row.gdm0 || []).map(Number),
              monthlyTemperature: (row.monthly_temperature || row.temperatura || []).map(Number),
              fetchedAt: row.created_at || new Date().toISOString(),
              metadata: { notes: row.notes, tonc: row.tonc },
            }));
          }

          if (records.length > 0) {
            this.saveToCache(records);
            return records;
          }
        }
      } catch (err) {
        console.warn('[Supabase Climate] Error fetching records from cloud:', err);
      }
    }

    // Fallback to offline localStorage cache
    const cached = this.getFromCache();
    if (cached && cached.length > 0) {
      return cached;
    }

    // Fallback to IDAE / OrientSol base records
    return this.getDefaultLocationsAsRecords();
  }

  /**
   * Checks whether an emplacement already exists with >= 90% data similarity.
   */
  public async findSimilarEmplacement(
    target: ClimateDataRecord,
    thresholdPct: number = 90.0
  ): Promise<SimilarityResult> {
    const allRecords = await this.getClimateDatasets();
    let highestSim = 0;
    let bestMatch: ClimateDataRecord | undefined = undefined;

    for (const existing of allRecords) {
      const sim = calculateDataSimilarity(target, existing);
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = existing;
      }
    }

    if (highestSim >= thresholdPct && bestMatch) {
      return {
        isDuplicate: true,
        similarityPct: highestSim,
        matchedRecord: bestMatch,
        message: `El emplazamiento ya ha sido registrado previamente con ${highestSim}% de coincidencia en datos numéricos con "${bestMatch.locationName}".`,
      };
    }

    return {
      isDuplicate: false,
      similarityPct: highestSim,
      matchedRecord: bestMatch,
    };
  }

  /**
   * Registers a new emplacement:
   * 1. Checks for data similarity >= 90% against existing records.
   * 2. If >= 90%, marks as duplicate and halts insertion.
   * 3. If < 90% and online, immediately inserts into Supabase.
   * 4. If < 90% and offline (or Supabase unconfigured), stores in offline sync queue.
   */
  public async registerEmplacement(record: ClimateDataRecord): Promise<RegisterEmplacementResult> {
    // 1. Duplicate check (>= 90% similarity in numerical data)
    const check = await this.findSimilarEmplacement(record, 90.0);
    if (check.isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        isOffline: !this.isOnline() || !this.isConfigured(),
        similarityPct: check.similarityPct,
        matchedRecord: check.matchedRecord,
        message: check.message!,
        record,
      };
    }

    // 2. Online insertion to Supabase
    const supabase = getSupabaseClient();
    if (supabase && this.isOnline()) {
      try {
        // Build 12 monthly rows matching the table: nombre_emplazamiento, latitud, longitud, mes, radiacion_media, temp_media
        const monthlyRows = [];
        for (let m = 1; m <= 12; m++) {
          const idx = m - 1;
          const days = DAYS_IN_MONTH[idx];
          const gdm0Daily = record.monthlyGdm0[idx] ?? 0;
          const radMensual = Number((gdm0Daily * days).toFixed(2));
          const tempMedia = Number((record.monthlyTemperature[idx] ?? 0).toFixed(2));

          monthlyRows.push({
            nombre_emplazamiento: record.locationName,
            latitud: record.latitude,
            longitud: record.longitude,
            mes: m,
            radiacion_media: radMensual,
            temp_media: tempMedia,
          });
        }

        const { error } = await supabase.from('datos_mensuales').insert(monthlyRows);
        if (!error) {
          const savedRecord: ClimateDataRecord = {
            ...record,
            id: `supabase-${record.locationName.toLowerCase().replace(/\s+/g, '-')}`,
            source: 'supabase',
          };

          // Cache locally
          const existing = this.getFromCache() || this.getDefaultLocationsAsRecords();
          this.saveToCache([savedRecord, ...existing.filter((r) => r.locationName !== savedRecord.locationName)]);
          this.notify();

          return {
            success: true,
            isDuplicate: false,
            isOffline: false,
            message: `✓ Emplazamiento "${record.locationName}" registrado con éxito en Supabase (12 meses en datos_mensuales).`,
            record: savedRecord,
          };
        } else {
          console.warn('[Supabase Insert Error]', error.message);
        }
      } catch (err: any) {
        console.warn('[Supabase Network/Insert Error]', err);
      }
    }

    // 3. Offline storage in sync queue
    this.addToOfflineQueue(record);
    this.notify();

    return {
      success: true,
      isDuplicate: false,
      isOffline: true,
      message: `💾 Modo Offline: Emplazamiento guardado en caché local (pendiente de sincronización con Supabase).`,
      record,
    };
  }

  // =========================================================================
  // OFFLINE QUEUE MANAGEMENT
  // =========================================================================

  public getOfflineQueue(): ClimateDataRecord[] {
    try {
      const raw = localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return [];
  }

  public addToOfflineQueue(record: ClimateDataRecord): void {
    const queue = this.getOfflineQueue();
    // Avoid exact duplicate additions to queue
    const exists = queue.some((r) => calculateDataSimilarity(r, record) >= 95.0);
    if (!exists) {
      queue.push({
        ...record,
        id: record.id || `offline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fetchedAt: new Date().toISOString(),
      });
      try {
        localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
      } catch {}
      this.notify();
    }
  }

  public removeFromOfflineQueue(idOrName: string): void {
    const queue = this.getOfflineQueue().filter((r) => r.id !== idOrName && r.locationName !== idOrName);
    try {
      localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch {}
    this.notify();
  }

  public clearOfflineQueue(): void {
    try {
      localStorage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
    } catch {}
    this.notify();
  }

  public getOfflineQueueCount(): number {
    return this.getOfflineQueue().length;
  }

  /**
   * Sincroniza la cola offline completa con Supabase:
   * - Compara cada registro con la base de datos de Supabase.
   * - Si encuentra datos iguales (>=90%), lo marca como ya registrado y lo retira de la cola.
   * - Si es nuevo (<90%), lo inserta en Supabase y lo retira de la cola.
   */
  public async syncOfflineQueue(): Promise<SyncSummary> {
    const queue = this.getOfflineQueue();
    const summary: SyncSummary = {
      total: queue.length,
      inserted: 0,
      duplicates: 0,
      errors: 0,
      details: [],
    };

    if (queue.length === 0) {
      return summary;
    }

    if (!this.isConfigured()) {
      throw new Error('Supabase no está configurado. Por favor, introduce la URL del proyecto y la Anon Key.');
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('No se pudo inicializar la conexión con Supabase.');
    }

    const test = await testSupabaseConnection();
    if (!test.ok) {
      throw new Error(`Fallo de conexión con Supabase: ${test.message}`);
    }

    // Fetch existing records from Supabase for similarity check
    const existingCloudRecords = await this.getClimateDatasets();
    const remainingQueue: ClimateDataRecord[] = [];

    for (const item of queue) {
      // Check similarity >= 90%
      let highestSim = 0;
      let matchedRecord: ClimateDataRecord | undefined = undefined;

      for (const existing of existingCloudRecords) {
        const sim = calculateDataSimilarity(item, existing);
        if (sim > highestSim) {
          highestSim = sim;
          matchedRecord = existing;
        }
      }

      if (highestSim >= 90.0 && matchedRecord) {
        // Already registered in Supabase
        summary.duplicates++;
        summary.details.push({
          name: item.locationName,
          status: 'duplicate',
          similarityPct: highestSim,
          message: `El emplazamiento "${item.locationName}" ya está registrado en Supabase (${highestSim}% coincidencia con "${matchedRecord.locationName}").`,
        });
        // Removed from queue
      } else {
        // Insert new record (12 monthly rows)
        try {
          const monthlyRows = [];
          for (let m = 1; m <= 12; m++) {
            const idx = m - 1;
            const days = DAYS_IN_MONTH[idx];
            const gdm0Daily = item.monthlyGdm0[idx] ?? 0;
            const radMensual = Number((gdm0Daily * days).toFixed(2));
            const tempMedia = Number((item.monthlyTemperature[idx] ?? 0).toFixed(2));

            monthlyRows.push({
              nombre_emplazamiento: item.locationName,
              latitud: item.latitude,
              longitud: item.longitude,
              mes: m,
              radiacion_media: radMensual,
              temp_media: tempMedia,
            });
          }

          const { error } = await supabase.from('datos_mensuales').insert(monthlyRows);
          if (!error) {
            summary.inserted++;
            summary.details.push({
              name: item.locationName,
              status: 'inserted',
              message: `✓ Emplazamiento "${item.locationName}" ingresado con éxito en Supabase (12 meses).`,
            });
            existingCloudRecords.push({ ...item, id: `supabase-${item.locationName.toLowerCase().replace(/\s+/g, '-')}` });
          } else {
            summary.errors++;
            summary.details.push({
              name: item.locationName,
              status: 'error',
              message: `Error al insertar: ${error?.message || 'Error desconocido'}`,
            });
            remainingQueue.push(item);
          }
        } catch (err: any) {
          summary.errors++;
          summary.details.push({
            name: item.locationName,
            status: 'error',
            message: `Fallo de red: ${err.message || String(err)}`,
          });
          remainingQueue.push(item);
        }
      }
    }

    // Update offline queue with only failed items (if any)
    try {
      localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(remainingQueue));
    } catch {}

    this.notify();
    return summary;
  }

  // =========================================================================
  // CACHE HELPERS
  // =========================================================================

  private saveToCache(records: ClimateDataRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(records));
    } catch {}
  }

  private getFromCache(): ClimateDataRecord[] | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
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
