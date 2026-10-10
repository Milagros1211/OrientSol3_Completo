/**
 * Solar geometry, radiation, and calculation types for OrientSol
 */

export interface SolarAngles {
  declinationDeg: number[];    // Solar declination per month (12 values)
  sunsetHourAngleDeg: number[]; // Sunset hour angle per month (12 values)
  dayLengthHours: number[];    // Day length per month (12 values)
}

export type RadiationComponent = 'global' | 'direct' | 'diffuse' | 'reflected';

export type TrackingMode = 
  | 'fixed'
  | 'optimum_annual'
  | 'optimum_seasonal'
  | 'tracking_polar'
  | 'tracking_azimuthal'
  | 'tracking_horizontal'
  | 'tracking_2axis';

export interface MonthlyValues {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export interface RadiationDataset {
  /** Global horizontal monthly irradiance [kWh/m2/day] */
  Gdm0: number[];
  /** Beam / direct horizontal monthly irradiance [kWh/m2/day] */
  Bdm0: number[];
  /** Diffuse horizontal monthly irradiance [kWh/m2/day] */
  Ddm0: number[];
  /** Extraterrestrial daily irradiation [kWh/m2/day] */
  Bod0: number[];
}

export interface SeasonalTiltAngles {
  winter: number;
  spring: number;
  summer: number;
  autumn: number;
}

export interface GainComparison {
  trackingMode: TrackingMode;
  annualRadiationKwhM2: number;
  gainOverHorizontalPercent: number;
  gainOverOptAnnualPercent: number;
}

export interface PVModuleConfig {
  id: string;
  name: string;
  nominalPowerWp: number;
  vocV: number;
  iscA: number;
  vmpV: number;
  impA: number;
  tempCoeffPmpPercentPerC: number;
  noctDegC: number;
  areaM2: number;
}
