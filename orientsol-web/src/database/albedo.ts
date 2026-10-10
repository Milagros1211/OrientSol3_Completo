import type { AlbedoType } from '@/types/database';

/**
 * Standard ground reflectance (Albedo) table based on OrientSol database
 * (Corresponds to TablaAlbedoESP and CoeficienteCalculos.m validation range 0.05 - 1.00)
 */
export const ALBEDO_DATABASE: AlbedoType[] = [
  {
    id: 'standard',
    name: 'Standard Urban / Ground',
    nameEs: 'Suelo estándar / Urbano',
    albedo: 0.20,
    description: 'Valor estándar genérico recomendado por el IDAE (España) para cálculos generales.',
  },
  {
    id: 'asphalt',
    name: 'Asphalt / Dark Pavement',
    nameEs: 'Asfalto / Pavimento oscuro',
    albedo: 0.15,
    description: 'Carreteras, pistas de rodadura y aparcamientos con asfalto envejecido o nuevo.',
  },
  {
    id: 'concrete',
    name: 'Concrete / Light Stone',
    nameEs: 'Hormigón / Piedra clara',
    albedo: 0.30,
    description: 'Pavimentos de hormigón claro, baldosas y aceras urbanas.',
  },
  {
    id: 'grass',
    name: 'Green Grass / Vegetation',
    nameEs: 'Césped verde / Vegetación',
    albedo: 0.23,
    description: 'Campos de hierba verde, praderas y zonas verdes húmedas.',
  },
  {
    id: 'dry_soil',
    name: 'Dry Soil / Arid Field',
    nameEs: 'Suelo seco / Terreno árido',
    albedo: 0.28,
    description: 'Terrenos agrícolas secos, barbecho o suelo arcilloso típico mediterráneo.',
  },
  {
    id: 'white_sand',
    name: 'White Sand / Dune',
    nameEs: 'Arena blanca / Dunas',
    albedo: 0.40,
    description: 'Playas, canteras de arena clara o dunas costeras.',
  },
  {
    id: 'fresh_snow',
    name: 'Fresh Clean Snow',
    nameEs: 'Nieve recién caída',
    albedo: 0.80,
    description: 'Superficie de nieve fresca, alta reflectancia en entornos de montaña.',
  },
  {
    id: 'water',
    name: 'Deep Water Surface',
    nameEs: 'Agua profunda / Embalses',
    albedo: 0.07,
    description: 'Superficies de agua tranquila con incidencia solar no rasante (solar flotante).',
  },
];

export const DEFAULT_ALBEDO = 0.20;
