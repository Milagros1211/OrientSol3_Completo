import type { PVModuleConfig } from '@/types/solar';

/**
 * Standard Photovoltaic Module Specifications database for OrientSol
 * Used in Osterwald and thermal energy calculations (Energia_Osterwald.m)
 */
export const PV_MODULE_DATABASE: PVModuleConfig[] = [
  {
    id: 'tier1-mono-550',
    name: 'Tier-1 High Efficiency Monocrystalline 550W',
    nominalPowerWp: 550,
    vocV: 49.8,
    iscA: 14.0,
    vmpV: 41.9,
    impA: 13.13,
    tempCoeffPmpPercentPerC: -0.34,
    noctDegC: 45,
    areaM2: 2.58,
  },
  {
    id: 'standard-mono-450',
    name: 'Commercial Monocrystalline PERC 450W',
    nominalPowerWp: 450,
    vocV: 41.5,
    iscA: 13.8,
    vmpV: 34.8,
    impA: 12.93,
    tempCoeffPmpPercentPerC: -0.35,
    noctDegC: 45,
    areaM2: 2.12,
  },
  {
    id: 'residential-mono-400',
    name: 'Residential All-Black 400W',
    nominalPowerWp: 400,
    vocV: 37.2,
    iscA: 13.6,
    vmpV: 31.0,
    impA: 12.9,
    tempCoeffPmpPercentPerC: -0.34,
    noctDegC: 44,
    areaM2: 1.95,
  },
  {
    id: 'classic-poly-330',
    name: 'Polycrystalline 72-Cell 330W (Legacy PFC)',
    nominalPowerWp: 330,
    vocV: 46.2,
    iscA: 9.25,
    vmpV: 37.5,
    impA: 8.8,
    tempCoeffPmpPercentPerC: -0.41,
    noctDegC: 47,
    areaM2: 1.94,
  },
  {
    id: 'classic-poly-250',
    name: 'Standard Polycrystalline 60-Cell 250W (OrientSol Original Default)',
    nominalPowerWp: 250,
    vocV: 37.8,
    iscA: 8.75,
    vmpV: 30.5,
    impA: 8.2,
    tempCoeffPmpPercentPerC: -0.43,
    noctDegC: 47,
    areaM2: 1.63,
  },
];

export const DEFAULT_PV_MODULE = PV_MODULE_DATABASE[0];
