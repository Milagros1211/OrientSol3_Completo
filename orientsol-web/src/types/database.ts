/**
 * Database schema and location types for OrientSol
 */

export interface LocationData {
  id: string;
  name: string;
  region: 'spain' | 'europe' | 'africa' | 'asia' | 'north_america' | 'south_america' | 'central_america' | 'custom';
  country: string;
  latitude: number; // Degrees decimal
  longitude?: number;
  elevationM?: number;
  /** Monthly global horizontal radiation [kWh/m2/day] (12 values) */
  monthlyGdm0: number[];
  /** Monthly average ambient temperature [°C] (12 values) */
  monthlyTempC: number[];
}

export interface AlbedoType {
  id: string;
  name: string;
  nameEs: string;
  albedo: number; // 0.05 to 1.00
  description: string;
}

export interface DatabaseState {
  locations: LocationData[];
  selectedLocationId: string | null;
  selectedAlbedoId: string;
  customLocation?: Partial<LocationData>;
}
