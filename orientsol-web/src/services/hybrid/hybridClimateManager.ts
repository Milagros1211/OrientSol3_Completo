import { LOCATIONS_DATABASE } from '@/database/locations';
import { fetchUnifiedClimateData } from '@/services/external';
import { climateDatabaseService } from '@/services/supabase';
import { parseClimateCSV, parseClimateJSON, type ClimateParseResult } from './climateFileParser';
import type { ClimateDataRecord, ClimateSourceType } from '@/types/climate';
import type { LocationData } from '@/types/database';
import type { SolarBridgeSimulationParams } from '@/services/bridge/solarCalculationBridge';

export interface ManualClimateInput {
  locationName: string;
  country?: string;
  latitude: number;
  longitude?: number;
  elevationM?: number;
  albedo?: number;
  monthlyGdm0: number[];
  monthlyTemperature: number[];
  notes?: string;
}

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedRecord?: ClimateDataRecord;
}

/**
 * Hybrid Climate Manager for OrientSol 4.0.
 * Unifies:
 * 1. International APIs (NASA POWER, PVGIS, Meteonorm).
 * 2. Historical OrientSol 4.0 database (52 provinces & European cities).
 * 3. Dual Input: Manual Entry Form & Digital Document Upload (CSV/JSON).
 * 4. Data structures prepared for the Pyodide Python execution engine.
 */
export class HybridClimateManager {
  private static instance: HybridClimateManager | null = null;

  public static getInstance(): HybridClimateManager {
    if (!HybridClimateManager.instance) {
      HybridClimateManager.instance = new HybridClimateManager();
    }
    return HybridClimateManager.instance;
  }

  // --------------------------------------------------------------------------
  // 1. HISTORICAL ORIENTSOL 4.0 DATABASE
  // --------------------------------------------------------------------------

  /**
   * Returns all historical locations from the OrientSol database.
   */
  public getHistoricalLocations(): ClimateDataRecord[] {
    return LOCATIONS_DATABASE.map((loc) => this.locationDataToRecord(loc));
  }

  /**
   * Searches historical database by city name or region.
   */
  public searchHistorical(query: string): ClimateDataRecord[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getHistoricalLocations();

    return LOCATIONS_DATABASE.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q)
    ).map((loc) => this.locationDataToRecord(loc));
  }

  /**
   * Retrieves a specific historical location by ID.
   */
  public getHistoricalLocationById(id: string): ClimateDataRecord | undefined {
    const loc = LOCATIONS_DATABASE.find((l) => l.id === id);
    return loc ? this.locationDataToRecord(loc) : undefined;
  }

  /**
   * Finds the closest historical station to given coordinates.
   */
  public findClosestHistorical(latitude: number, longitude: number): {
    record: ClimateDataRecord;
    distanceKm: number;
  } {
    let closest = LOCATIONS_DATABASE[0];
    let minDistance = Infinity;

    for (const loc of LOCATIONS_DATABASE) {
      const dLat = (loc.latitude - latitude) * 111.0;
      const dLon = ((loc.longitude ?? 0) - longitude) * 111.0 * Math.cos((latitude * Math.PI) / 180);
      const dist = Math.hypot(dLat, dLon);

      if (dist < minDistance) {
        minDistance = dist;
        closest = loc;
      }
    }

    return {
      record: this.locationDataToRecord(closest),
      distanceKm: Math.round(minDistance),
    };
  }

  /**
   * Fetches verified or custom datasets stored in the Supabase Cloud database
   * with automatic fallback to persistent disk cache and offline storage.
   */
  public async getCloudLocations(): Promise<ClimateDataRecord[]> {
    return await climateDatabaseService.getClimateDatasets();
  }

  // --------------------------------------------------------------------------
  // 2. INTERNATIONAL CLIMATE APIS & CLOUD DB
  // --------------------------------------------------------------------------

  /**
   * Fetches climate data from external APIs (NASA POWER, PVGIS, Meteonorm)
   * or Cloud Supabase with automated offline fallback.
   */
  public async fetchExternalOrCloud(
    source: ClimateSourceType,
    latitude: number,
    longitude: number,
    locationName?: string
  ): Promise<ClimateDataRecord> {
    return await fetchUnifiedClimateData({
      source,
      latitude,
      longitude,
      locationName: locationName || `Punto (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
    });
  }

  // --------------------------------------------------------------------------
  // 3. DUAL INPUT: MANUAL ENTRY VALIDATOR & NORMALIZER
  // --------------------------------------------------------------------------

  /**
   * Validates and normalizes manual user form input into a strict ClimateDataRecord.
   */
  public validateManualInput(input: ManualClimateInput): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Name & Coords
    const name = input.locationName?.trim() || 'Ubicación Manual';
    if (!input.locationName?.trim()) {
      warnings.push('No se proporcionó nombre de ubicación; asignado "Ubicación Manual".');
    }

    if (isNaN(input.latitude) || input.latitude < -90 || input.latitude > 90) {
      errors.push(`Latitud fuera de rango (-90° a +90°): ${input.latitude}`);
    }

    const lon = input.longitude ?? 0.0;
    if (isNaN(lon) || lon < -180 || lon > 180) {
      errors.push(`Longitud fuera de rango (-180° a +180°): ${lon}`);
    }

    // 2. Monthly Gdm0 (Radiation)
    if (!Array.isArray(input.monthlyGdm0) || input.monthlyGdm0.length !== 12) {
      errors.push(`Se requieren exactamente 12 valores mensuales de radiación Gdm(0) (recibidos: ${input.monthlyGdm0?.length ?? 0}).`);
    }

    const cleanGdm0: number[] = [];
    for (let i = 0; i < 12; i++) {
      const val = input.monthlyGdm0?.[i];
      if (typeof val !== 'number' || isNaN(val)) {
        errors.push(`Mes ${i + 1}: Valor de radiación no es un número válido.`);
      } else if (val < 0) {
        errors.push(`Mes ${i + 1}: La radiación no puede ser negativa (${val} kWh/m²/día).`);
      } else if (val > 15) {
        warnings.push(`Mes ${i + 1}: Valor de radiación inusualmente alto (${val} kWh/m²/día).`);
        cleanGdm0.push(val);
      } else {
        cleanGdm0.push(Number(val.toFixed(3)));
      }
    }

    // 3. Monthly Temperature
    const cleanTemp: number[] = [];
    if (!Array.isArray(input.monthlyTemperature) || input.monthlyTemperature.length !== 12) {
      warnings.push('No se proporcionaron 12 valores de temperatura; se utilizará estimación estándar.');
      cleanTemp.push(...[6.0, 7.5, 10.5, 13.0, 17.0, 22.0, 25.5, 25.0, 21.0, 16.0, 10.0, 6.5]);
    } else {
      for (let i = 0; i < 12; i++) {
        const t = input.monthlyTemperature[i];
        if (typeof t !== 'number' || isNaN(t)) {
          warnings.push(`Mes ${i + 1}: Temperatura inválida, asignado 15°C.`);
          cleanTemp.push(15.0);
        } else if (t < -50 || t > 60) {
          warnings.push(`Mes ${i + 1}: Temperatura extrema (${t}°C).`);
          cleanTemp.push(Number(t.toFixed(2)));
        } else {
          cleanTemp.push(Number(t.toFixed(2)));
        }
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings };
    }

    const record: ClimateDataRecord = {
      id: `manual-entry-${Date.now()}`,
      source: 'manual_input',
      locationName: name,
      country: input.country || 'Personalizado',
      latitude: input.latitude,
      longitude: lon,
      elevationM: input.elevationM ?? 500,
      monthlyGdm0: cleanGdm0,
      monthlyTemperature: cleanTemp,
      fetchedAt: new Date().toISOString(),
      metadata: {
        albedo: input.albedo ?? 0.20,
        notes: input.notes,
      },
    };

    return {
      isValid: true,
      errors: [],
      warnings,
      normalizedRecord: record,
    };
  }

  /**
   * Validates and sets manual data directly, throwing if invalid.
   */
  public setManualData(input: ManualClimateInput): ClimateDataRecord {
    const report = this.validateManualInput(input);
    if (!report.isValid || !report.normalizedRecord) {
      throw new Error(report.errors.join('; ') || 'Invalid manual input');
    }
    return report.normalizedRecord;
  }

  // --------------------------------------------------------------------------
  // 4. DUAL INPUT: DIGITAL DOCUMENT UPLOAD (CSV / JSON)
  // --------------------------------------------------------------------------

  /**
   * Parses uploaded file text (CSV, JSON, or TXT) into a verified ClimateDataRecord.
   */
  public parseUploadedDocument(fileContent: string, fileName: string): ClimateParseResult {
    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith('.json')) {
      return parseClimateJSON(fileContent, fileName);
    } else if (lowerName.endsWith('.csv') || lowerName.endsWith('.txt')) {
      return parseClimateCSV(fileContent, fileName);
    }

    // Attempt auto-detection: starts with { or [ -> JSON
    const trimmed = fileContent.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return parseClimateJSON(fileContent, fileName);
    }

    return parseClimateCSV(fileContent, fileName);
  }

  /**
   * Reads a browser File object and parses it into a ClimateDataRecord.
   */
  public async parseUploadedClimateFile(file: File): Promise<{ record: ClimateDataRecord; records?: ClimateDataRecord[] }> {
    const text = await file.text();
    const res = this.parseUploadedDocument(text, file.name);
    if (!res.success || !res.record) {
      throw new Error(res.error || 'Failed to parse file');
    }
    return { record: res.record, records: res.records };
  }

  // --------------------------------------------------------------------------
  // 5. PYTHON ENGINE BRIDGE PREPARATION
  // --------------------------------------------------------------------------

  /**
   * Converts any verified ClimateDataRecord into the exact parameters
   * expected by the Pyodide calculation bridge.
   */
  public prepareForPythonEngine(
    record: ClimateDataRecord,
    options?: {
      albedo?: number;
      peakPowerKw?: number;
      performanceRatio?: number;
      tempCoefficient?: number;
      tonc?: number;
    }
  ): SolarBridgeSimulationParams {
    const metaAlbedo = record.metadata?.albedo;
    const finalAlbedo = options?.albedo ?? (typeof metaAlbedo === 'number' ? metaAlbedo : 0.20);

    return {
      climateData: record,
      albedo: finalAlbedo,
      peakPowerKw: options?.peakPowerKw ?? 5.0,
      performanceRatio: options?.performanceRatio ?? 0.80,
      tempCoefficient: options?.tempCoefficient ?? -0.004,
      tonc: options?.tonc ?? 47.0,
    };
  }

  /**
   * Alias for prepareForPythonEngine.
   */
  public prepareForPythonBridge(
    record: ClimateDataRecord,
    options?: {
      albedo?: number;
      peakPowerKw?: number;
      performanceRatio?: number;
      tempCoefficient?: number;
      tonc?: number;
    }
  ): SolarBridgeSimulationParams {
    return this.prepareForPythonEngine(record, options);
  }

  /**
   * Helper converting internal database LocationData to unified ClimateDataRecord.
   */
  private locationDataToRecord(loc: LocationData): ClimateDataRecord {
    return {
      id: loc.id,
      source: 'local_database',
      locationName: loc.name,
      country: loc.country,
      latitude: loc.latitude,
      longitude: loc.longitude ?? 0.0,
      elevationM: loc.elevationM,
      monthlyGdm0: [...loc.monthlyGdm0],
      monthlyTemperature: [...loc.monthlyTempC],
      fetchedAt: new Date().toISOString(),
      metadata: { region: loc.region, isHistorical: true },
    };
  }
}

export const hybridClimateManager = HybridClimateManager.getInstance();
