/**
 * Climate data types and interfaces for Supabase and external API integrations
 * (PVGIS, NASA POWER, Meteonorm / Open-Meteo).
 */

export type ClimateSourceType =
  | 'supabase'
  | 'pvgis'
  | 'nasa_power'
  | 'meteonorm'
  | 'local_database'
  | 'manual_input'
  | 'file_upload';

export interface ClimateDataRecord {
  id?: string;
  source: ClimateSourceType;
  locationName: string;
  country?: string;
  latitude: number;
  longitude: number;
  elevationM?: number;
  /** 12 monthly mean daily global horizontal radiation values [kWh/m²/day] */
  monthlyGdm0: number[];
  /** 12 monthly mean ambient temperatures [°C] */
  monthlyTemperature: number[];
  /** Optional 12 monthly direct normal or beam horizontal [kWh/m²/day] */
  monthlyBdm0?: number[];
  /** Optional 12 monthly diffuse horizontal [kWh/m²/day] */
  monthlyDdm0?: number[];
  /** Optional 12 monthly global radiation on optimal inclination plane [kWh/m²/day] */
  monthlyGdmOpt?: number[];
  /** Optional optimal inclination angle [°] from PVGIS */
  optimalTilt?: number;
  /** Retrieval timestamp (ISO string) */
  fetchedAt: string;
  /** Additional provider-specific metadata */
  metadata?: Record<string, any>;
}

export interface SupabaseClimateRow {
  id?: string;
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  monthly_gdm0: number[];
  monthly_temperature: number[];
  is_verified?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClimateFetchOptions {
  latitude: number;
  longitude: number;
  source?: ClimateSourceType;
  locationName?: string;
  timeoutMs?: number;
}

export interface CalculationBridgeOptions {
  climateData: ClimateDataRecord;
  albedo?: number;
  peakPowerKw?: number;
  performanceRatio?: number;
  tempCoefficient?: number;
  tonc?: number;
}
