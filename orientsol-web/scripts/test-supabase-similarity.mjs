import { calculateDataSimilarity } from '../src/services/supabase/climateDatabaseService.ts';

// Test record 1: Jaén (UJA)
const jaenRecord = {
  id: 'hist-jaen',
  source: 'local_database',
  locationName: 'Jaén (UJA)',
  country: 'España',
  latitude: 37.78,
  longitude: -3.79,
  elevationM: 570,
  monthlyGdm0: [2.35, 3.25, 4.55, 5.85, 6.95, 7.85, 7.95, 7.15, 5.45, 3.85, 2.55, 2.05],
  monthlyTemperature: [8.5, 9.8, 12.5, 15.2, 19.5, 25.1, 28.5, 28.2, 23.5, 17.8, 12.2, 9.1],
  fetchedAt: new Date().toISOString(),
};

// Test record 2: Huerto Solar Jaén (same numerical data with tiny +/- 1% fluctuations, different name)
const jaenAlternativeName = {
  id: 'manual-solar-farm',
  source: 'manual_input',
  locationName: 'Parque Fotovoltaico Los Olivos',
  country: 'España',
  latitude: 37.79,
  longitude: -3.80,
  elevationM: 565,
  monthlyGdm0: [2.36, 3.26, 4.54, 5.86, 6.94, 7.86, 7.94, 7.16, 5.46, 3.84, 2.56, 2.06],
  monthlyTemperature: [8.6, 9.9, 12.4, 15.3, 19.6, 25.0, 28.6, 28.1, 23.6, 17.7, 12.3, 9.2],
  fetchedAt: new Date().toISOString(),
};

// Test record 3: Helsinki (Completely different cold climate)
const helsinkiRecord = {
  id: 'helsinki',
  source: 'external_api',
  locationName: 'Helsinki',
  country: 'Finlandia',
  latitude: 60.17,
  longitude: 24.94,
  elevationM: 25,
  monthlyGdm0: [0.35, 1.15, 2.45, 3.95, 5.25, 5.85, 5.45, 4.15, 2.35, 1.05, 0.45, 0.20],
  monthlyTemperature: [-5.0, -5.5, -2.0, 4.0, 10.5, 15.0, 18.5, 17.0, 12.0, 6.5, 1.5, -2.5],
  fetchedAt: new Date().toISOString(),
};

console.log('--- TEST DE SIMILITUD DE DATOS (REGLA DEL 90% SUPABASE) ---');

// 1. Similitud idéntica
const simSelf = calculateDataSimilarity(jaenRecord, jaenRecord);
console.log(`1. Jaén vs Jaén (Mismo registro): ${simSelf}%`);

// 2. Similitud con datos casi idénticos pero distinto nombre (debe ser > 90%)
const simSimilar = calculateDataSimilarity(jaenRecord, jaenAlternativeName);
console.log(`2. Jaén vs Parque Los Olivos (Mismos datos, distinto nombre): ${simSimilar}%`);
if (simSimilar >= 90.0) {
  console.log(`   ✓ DUPLICADO DETECTADO CORRECTAMENTE (≥90% coincidencia).`);
} else {
  console.error(`   ✗ ERROR: No detectó similitud ≥90% (${simSimilar}%).`);
}

// 3. Similitud con clima diferente (debe ser < 90%)
const simDifferent = calculateDataSimilarity(jaenRecord, helsinkiRecord);
console.log(`3. Jaén vs Helsinki (Clima completamente distinto): ${simDifferent}%`);
if (simDifferent < 90.0) {
  console.log(`   ✓ EMPLAZAMIENTO NUEVO ACEPTADO CORRECTAMENTE (<90% coincidencia).`);
} else {
  console.error(`   ✗ ERROR: Consideró duplicado erróneamente (${simDifferent}%).`);
}
