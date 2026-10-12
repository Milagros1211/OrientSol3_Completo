/**
 * Verification test for Hybrid Climate Manager and Dual Input (CSV / JSON / Manual)
 * and hand-off into the Pyodide Python calculation engine.
 */
import { loadPyodide } from 'pyodide';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Test CSV Vertical Parser
function parseVerticalCSV(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const startIndex = isNaN(parseFloat(lines[0].split(',')[0])) ? 1 : 0;
  const dataLines = lines.slice(startIndex, startIndex + 12);
  const gdm0 = [];
  const tamb = [];
  for (const row of dataLines) {
    const parts = row.split(',').map(p => parseFloat(p.trim().replace(',', '.')));
    gdm0.push(parts[1]);
    tamb.push(parts[2]);
  }
  return { gdm0, tamb };
}

// 2. Test JSON Parser
function parseJSON(jsonText) {
  const data = JSON.parse(jsonText);
  return {
    locationName: data.locationName,
    latitude: data.latitude,
    longitude: data.longitude,
    gdm0: data.monthlyGdm0,
    tamb: data.monthlyTemperature,
  };
}

async function run() {
  console.log('--- 1. Probando Parsers de Carga Dual (CSV / JSON) ---');
  const sampleCSV = `
# OrientSol 4.0 Dataset
# Localidad: Carmona Solar
# Latitud: 37.47
# Longitud: -5.64
Mes,Gdm0,Tamb
1,2.65,11.2
2,3.75,12.8
3,5.10,15.9
4,6.20,18.1
5,7.30,22.0
6,8.15,26.5
7,8.30,28.8
8,7.40,28.5
9,5.75,25.2
10,4.15,20.5
11,2.90,15.4
12,2.30,12.1
`;

  const parsedCSV = parseVerticalCSV(sampleCSV);
  console.log('✓ CSV parseado con éxito (12 meses):');
  console.log('  Gdm0:', parsedCSV.gdm0);
  console.log('  Tamb:', parsedCSV.tamb);

  const sampleJSON = JSON.stringify({
    locationName: 'Sevilla Norte',
    latitude: 37.45,
    longitude: -5.95,
    monthlyGdm0: [2.58, 3.62, 4.95, 6.05, 7.12, 8.01, 8.15, 7.28, 5.65, 4.02, 2.82, 2.24],
    monthlyTemperature: [11.0, 12.5, 15.6, 17.9, 21.8, 26.3, 28.2, 28.0, 25.0, 20.2, 15.1, 11.9],
  });

  const parsedJSON = parseJSON(sampleJSON);
  console.log('✓ JSON parseado con éxito:', parsedJSON.locationName);

  console.log('\n--- 2. Inicializando Pyodide y pasando dataset obtenido de la Carga Dual ---');
  const pyodideDir = path.join(__dirname, '../public/pyodide');
  const pyodide = await loadPyodide({ packageCacheDir: pyodideDir });
  await pyodide.loadPackage('numpy');

  // Mount Python source modules
  const pythonSrcDir = path.join(__dirname, '../src/python');
  function mountRecursive(localDir, virtualDir) {
    try { pyodide.FS.mkdir(virtualDir); } catch {}
    const entries = fs.readdirSync(localDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(localDir, entry.name);
      const vPath = `${virtualDir}/${entry.name}`;
      if (entry.isDirectory()) {
        mountRecursive(fullPath, vPath);
      } else if (entry.name.endsWith('.py')) {
        pyodide.FS.writeFile(vPath, fs.readFileSync(fullPath, 'utf-8'));
      }
    }
  }
  mountRecursive(pythonSrcDir, '/orient');

  // Execute Pyodide calculation using the parsed dataset
  const pyScript = `
import json, sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')

import numpy as np
from core.constants import CHARACTERISTIC_DAYS
from core.conversions import deg2rad
from core.declination import matriz_declinacion
from core.sunset_angles import angulos_salida
from core.hour_angles import angulos, angulos2
from core.solar_position import altura_solar, azimut_solar
from radiation.extraterrestrial import bod0
from radiation.horizontal_decomposition import bdm0, clearness_index
from radiation.hourly_radiation import gh0, dh0, bh0
from radiation.transposition import transpose_to_inclined_surfaces
from optimization.seasonal_optimum import optimize_seasonal_tilts
from tracking.dual_axis import simulate_dual_axis_tracking
from tracking.polar_axis import simulate_polar_axis_tracking
from energy.simplified import calculate_simplified_energy
from energy.osterwald import calculate_osterwald_energy

lat_deg = ${parsedJSON.latitude}
lat_rad = float(deg2rad(lat_deg))
gdm0 = np.array(${JSON.stringify(parsedJSON.gdm0)}, dtype=np.float64)
temp = np.array(${JSON.stringify(parsedJSON.tamb)}, dtype=np.float64)

val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
ang_sal1, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
numero_n, matriz_angulos = angulos(ang_sal1)
numero_n2, matriz_angulos2 = angulos2(ang_salida)

val_bod = bod0(CHARACTERISTIC_DAYS, lat_rad, val_decli, ang_sal1)
val_bdm0, val_ddm0 = bdm0(val_bod, gdm0)
alt_solar = altura_solar(lat_rad, val_decli, numero_n, matriz_angulos)
azim_solar = azimut_solar(alt_solar, lat_rad, val_decli, numero_n)
gh_mat, _ = gh0(matriz_angulos, ang_sal1, numero_n, gdm0)
dh_mat, _ = dh0(matriz_angulos, ang_sal1, numero_n, val_ddm0)
bh_mat = bh0(gh_mat, dh_mat, numero_n)

transp = transpose_to_inclined_surfaces(
    lat_rad=lat_rad, val_decli=val_decli, numero_n2=numero_n2,
    matriz_angulos2=matriz_angulos2, bh_matriz=bh_mat, dh_matriz=dh_mat,
    gh_matriz=gh_mat, val_bdm0=val_bdm0, val_ddm0=val_ddm0,
    datos_or_gdm0=gdm0, albedo=0.20
)

opt_beta = int(transp["opt_angle_deg"])
seasonal = optimize_seasonal_tilts(
    gd_beta_total=transp["gd_beta_total"],
    datos_or_gdm0=gdm0
)

polar = simulate_polar_axis_tracking(
    lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, bh_mat, dh_mat, gh_mat, 0.20
)

dual = simulate_dual_axis_tracking(
    lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, azim_solar, bh_mat, dh_mat, gh_mat, 0.20
)

oster = calculate_osterwald_energy(
    transp["radiacion_global_opt"],
    gdm0,
    temp,
    5.0,
    -0.004,
    47.0
)

json.dumps({
    "opt_beta": opt_beta,
    "opt_gain": round(((transp["media_global_opt"] - np.mean(gdm0)) / np.mean(gdm0)) * 100, 2),
    "seasonal_tilts": [
        int(seasonal["seasons"]["winter"]["opt_angle_deg"]),
        int(seasonal["seasons"]["spring"]["opt_angle_deg"]),
        int(seasonal["seasons"]["summer"]["opt_angle_deg"]),
        int(seasonal["seasons"]["autumn"]["opt_angle_deg"])
    ],
    "polar_gain": round(((polar["media_gd"] - np.mean(gdm0)) / np.mean(gdm0)) * 100, 2),
    "dual_gain": round(((dual["media_gd"] - np.mean(gdm0)) / np.mean(gdm0)) * 100, 2),
    "osterwald_annual_kwh": round(float(oster["annual_energy_eval_kwh"]), 1),
    "mean_cell_temp": round(float(oster["mean_cell_temp_eval_degc"]), 1)
})
`;

  const output = await pyodide.runPythonAsync(pyScript);
  const res = JSON.parse(output);

  console.log('\n✓ Resultados de Simulación OrientSol con el Dataset de Carga Dual:');
  console.log(`  • Inclinación Óptima Anual:       ${res.opt_beta}° (+${res.opt_gain}% ganancia)`);
  console.log(`  • Inclinaciones Estacionales:     Inv: ${res.seasonal_tilts[0]}°, Prim: ${res.seasonal_tilts[1]}°, Ver: ${res.seasonal_tilts[2]}°, Oto: ${res.seasonal_tilts[3]}°`);
  console.log(`  • Ganancia Seg. 1 Eje Polar:      +${res.polar_gain}%`);
  console.log(`  • Ganancia Seg. 2 Ejes Completo:  +${res.dual_gain}%`);
  console.log(`  • Generación Osterwald 5 kWp:     ${res.osterwald_annual_kwh} kWh/año`);
  console.log(`  • Temperatura Media de Célula:    ${res.mean_cell_temp} °C`);
}
run().catch(console.error);
