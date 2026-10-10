import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { loadPyodide } from 'pyodide';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. NASA POWER API fetch test
async function testNasaPowerFetch(lat, lon) {
  console.log(`[API Test] 1. Consultando NASA POWER API para (${lat}, ${lon})...`);
  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN,T2M&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NASA POWER API HTTP ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();
  const rad = json.properties?.parameter?.ALLSKY_SFC_SW_DWN;
  const temp = json.properties?.parameter?.T2M;

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthlyGdm0 = months.map(m => Math.round(rad[m] * 100) / 100);
  const monthlyTemp = months.map(m => Math.round(temp[m] * 10) / 10);

  console.log(`✓ Datos NASA POWER recibidos correctamente:`);
  console.log(`  Gdm(0) [kWh/m²/día]:`, monthlyGdm0);
  console.log(`  Temp Amb [°C]:       `, monthlyTemp);
  return { monthlyGdm0, monthlyTemp };
}

// 2. Pyodide Bridge Execution Test
async function runSimulationInPyodide(lat, monthlyGdm0, monthlyTemp) {
  console.log(`\n[Bridge Test] 2. Inicializando Pyodide y NumPy para calcular con los datos de NASA POWER...`);
  const py = await loadPyodide();
  await py.loadPackage('numpy');

  const files = [
    'src/python/core/constants.py',
    'src/python/core/conversions.py',
    'src/python/core/declination.py',
    'src/python/core/sunset_angles.py',
    'src/python/core/hour_angles.py',
    'src/python/core/solar_position.py',
    'src/python/core/__init__.py',
    'src/python/radiation/extraterrestrial.py',
    'src/python/radiation/horizontal_decomposition.py',
    'src/python/radiation/hourly_radiation.py',
    'src/python/radiation/transposition.py',
    'src/python/radiation/__init__.py',
    'src/python/optimization/seasonal_optimum.py',
    'src/python/optimization/monthly_optimum.py',
    'src/python/optimization/loss_maps.py',
    'src/python/optimization/surface_optimizer.py',
    'src/python/optimization/__init__.py',
    'src/python/tracking/dual_axis.py',
    'src/python/tracking/polar_axis.py',
    'src/python/tracking/azimuthal_axis.py',
    'src/python/tracking/horizontal_axis.py',
    'src/python/tracking/gains.py',
    'src/python/tracking/__init__.py',
    'src/python/energy/temperatures.py',
    'src/python/energy/energy_yield.py',
    'src/python/energy/simplified.py',
    'src/python/energy/osterwald.py',
    'src/python/energy/__init__.py',
  ];

  const dirs = ['/orient', '/orient/core', '/orient/radiation', '/orient/optimization', '/orient/tracking', '/orient/energy'];
  for (const d of dirs) {
    try { py.FS.mkdir(d); } catch {}
  }
  for (const rel of files) {
    const full = path.join(rootDir, rel);
    py.FS.writeFile('/orient/' + rel.replace('src/python/', ''), fs.readFileSync(full, 'utf8'));
  }

  const pythonScript = `
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
from tracking.azimuthal_axis import simulate_azimuthal_axis_tracking
from tracking.horizontal_axis import simulate_horizontal_axis_tracking
from energy.simplified import calculate_simplified_energy
from energy.osterwald import calculate_osterwald_energy

lat_rad = float(deg2rad(${lat}))
gdm0 = np.array(${JSON.stringify(monthlyGdm0)}, dtype=np.float64)
temp = np.array(${JSON.stringify(monthlyTemp)}, dtype=np.float64)

# 1. Base Geometry
val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
ang_sal1, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
numero_n, matriz_angulos = angulos(ang_sal1)
numero_n2, matriz_angulos2 = angulos2(ang_salida)
alt_solar = altura_solar(lat_rad, val_decli, numero_n, matriz_angulos)
azim_solar = azimut_solar(alt_solar, lat_rad, val_decli, numero_n)

# 2. Horizontal Decomposition
val_bod = bod0(CHARACTERISTIC_DAYS, lat_rad, val_decli, ang_sal1)
val_bdm0, val_ddm0 = bdm0(val_bod, gdm0)
gh_mat, _ = gh0(matriz_angulos, ang_sal1, numero_n, gdm0)
dh_mat, _ = dh0(matriz_angulos, ang_sal1, numero_n, val_ddm0)
bh_mat = bh0(gh_mat, dh_mat, numero_n)

# 3. Transposition & Optimum
transp = transpose_to_inclined_surfaces(
    lat_rad=lat_rad,
    val_decli=val_decli,
    numero_n2=numero_n2,
    matriz_angulos2=matriz_angulos2,
    bh_matriz=bh_mat,
    dh_matriz=dh_mat,
    gh_matriz=gh_mat,
    val_bdm0=val_bdm0,
    val_ddm0=val_ddm0,
    datos_or_gdm0=gdm0,
    albedo=0.20,
)
opt_angle = int(transp["opt_angle_deg"])
gd_opt = transp["radiacion_global_opt"]
mean_g0 = float(np.mean(gdm0))
mean_opt = float(transp["media_global_opt"])

# 4. Seasonal
seas = optimize_seasonal_tilts(transp["gd_beta_total"], gdm0)

# 5. Tracking
res_2axis = simulate_dual_axis_tracking(lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, azim_solar, bh_mat, dh_mat, gh_mat, 0.20)
res_polar = simulate_polar_axis_tracking(lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, bh_mat, dh_mat, gh_mat, 0.20)

# 6. Energy
ost_opt = calculate_osterwald_energy(gd_opt, gdm0, temp, peak_power_kw=5.0)
ost_2ax = calculate_osterwald_energy(res_2axis["gd_daily"], gdm0, temp, peak_power_kw=5.0)

res = {
    "opt_tilt_deg": opt_angle,
    "mean_horizontal_kwh_day": round(mean_g0, 3),
    "mean_optimal_kwh_day": round(mean_opt, 3),
    "annual_gain_opt_pct": round(((mean_opt - mean_g0) / mean_g0) * 100.0, 2),
    "seasonal_tilts": {
        "winter": int(seas["seasons"]["winter"]["opt_angle_deg"]),
        "spring": int(seas["seasons"]["spring"]["opt_angle_deg"]),
        "summer": int(seas["seasons"]["summer"]["opt_angle_deg"]),
        "autumn": int(seas["seasons"]["autumn"]["opt_angle_deg"]),
    },
    "tracking_2axis_gain_pct": round(((res_2axis["media_gd"] - mean_g0) / mean_g0) * 100.0, 2),
    "tracking_polar_gain_pct": round(((res_polar["media_gd"] - mean_g0) / mean_g0) * 100.0, 2),
    "energy_5kwp_optimal_kwh_year": round(ost_opt["annual_energy_eval_kwh"], 1),
    "energy_5kwp_2axis_kwh_year": round(ost_2ax["annual_energy_eval_kwh"], 1),
}
json.dumps(res)
`;

  const outputStr = py.runPython(pythonScript);
  const result = JSON.parse(outputStr);
  console.log(`\n✓ Cálculo en Pyodide completado con éxito con los datos de NASA POWER:`);
  console.log(`  • Inclinación Óptima Anual:       ${result.opt_tilt_deg}° (+${result.annual_gain_opt_pct}% ganancia)`);
  console.log(`  • Radiación Media Horizontal:     ${result.mean_horizontal_kwh_day} kWh/m²/día`);
  console.log(`  • Radiación Media Inclinación:    ${result.mean_optimal_kwh_day} kWh/m²/día`);
  console.log(`  • Inclinaciones Estacionales:     Inv: ${result.seasonal_tilts.winter}°, Prim: ${result.seasonal_tilts.spring}°, Ver: ${result.seasonal_tilts.summer}°, Oto: ${result.seasonal_tilts.autumn}°`);
  console.log(`  • Ganancia Seg. 1 Eje Polar:      +${result.tracking_polar_gain_pct}%`);
  console.log(`  • Ganancia Seg. 2 Ejes Completo:  +${result.tracking_2axis_gain_pct}%`);
  console.log(`  • Prod. Osterwald 5 kWp (Fijo):   ${result.energy_5kwp_optimal_kwh_year} kWh/año`);
  console.log(`  • Prod. Osterwald 5 kWp (2 Ejes): ${result.energy_5kwp_2axis_kwh_year} kWh/año`);
}

async function main() {
  const lat = 40.4168; // Madrid
  const lon = -3.7038;
  const climate = await testNasaPowerFetch(lat, lon);
  await runSimulationInPyodide(lat, climate.monthlyGdm0, climate.monthlyTemp);
}

main().catch(err => {
  console.error('[Error]:', err);
  process.exit(1);
});
