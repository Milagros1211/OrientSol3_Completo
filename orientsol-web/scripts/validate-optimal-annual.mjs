// Cross-validation: OrientSol MATLAB (Tabla_OptAnual.fig, Jaén) vs Python WASM engine
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Jaén — BBDD.xlsx (MATLAB original)
const LAT = 37.765555555555558;
const GDM0 = [2.47, 3.18, 4.72, 5.34, 6.62, 7.18, 7.04, 6.22, 4.98, 3.77, 2.5, 2.1];
const ALBEDO = parseFloat(process.argv[2] ?? '0.2');

// Values printed in the MATLAB window (Tabla_OptAnual screenshot)
const MATLAB = {
  15: [3.04, 3.76, 5.18, 5.55, 6.56, 6.95, 6.89, 6.37, 5.42, 4.39, 2.97, 2.62],
  30: [3.53, 4.18, 5.49, 5.53, 6.3, 6.55, 6.54, 6.26, 5.61, 4.83, 3.38, 3.06],
  45: [3.82, 4.37, 5.5, 5.08, 5.51, 5.6, 5.65, 5.65, 5.38, 5.01, 3.61, 3.34],
  60: [3.91, 4.34, 5.23, 4.57, 4.74, 4.69, 4.78, 4.99, 5.01, 4.91, 3.65, 3.43],
  75: [3.78, 4.07, 4.68, 3.85, 3.74, 3.31, 3.41, 4.1, 4.39, 4.56, 3.5, 3.34],
  90: [3.43, 3.59, 3.89, 2.97, 2.44, 1.89, 1.99, 2.81, 3.56, 3.96, 3.15, 3.06],
  opt: 30,
};

const py = await loadPyodide();
await py.loadPackage('numpy');
const pyRoot = path.join(rootDir, 'src/python');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.py') ? [path.join(d, e.name)] : []);
for (const f of walk(pyRoot)) {
  const rel = path.relative(pyRoot, f).replace(/\\/g, '/');
  const parts = rel.split('/');
  let cur = '/orient';
  try { py.FS.mkdir(cur); } catch {}
  for (const p of parts.slice(0, -1)) { cur += '/' + p; try { py.FS.mkdir(cur); } catch {} }
  py.FS.writeFile('/orient/' + rel, fs.readFileSync(f, 'utf8'));
}

const out = await py.runPythonAsync(`
import sys, json
sys.path.insert(0, '/orient')
import numpy as np
from core.constants import CHARACTERISTIC_DAYS
from core.conversions import deg2rad
from core.declination import matriz_declinacion
from core.sunset_angles import angulos_salida
from core.hour_angles import angulos, angulos2
from radiation.extraterrestrial import bod0
from radiation.horizontal_decomposition import bdm0
from radiation.hourly_radiation import gh0, dh0, bh0
from radiation.transposition import transpose_to_inclined_surfaces
lat_rad = float(deg2rad(${LAT}))
gdm0 = np.array(${JSON.stringify(GDM0)})
vd = matriz_declinacion(CHARACTERISTIC_DAYS)
s1, sal = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
n1, m1 = angulos(s1)
n2, m2 = angulos2(sal)
vb = bod0(CHARACTERISTIC_DAYS, lat_rad, vd, s1)
b0, d0 = bdm0(vb, gdm0)
gh,_ = gh0(m1, s1, n1, gdm0); dh,_ = dh0(m1, s1, n1, d0); bh = bh0(gh, dh, n1)
t = transpose_to_inclined_surfaces(lat_rad, vd, n2, m2, bh, dh, gh, b0, d0, gdm0, ${ALBEDO})
g = t["gd_beta_total"]
json.dumps({"opt": int(t["opt_angle_deg"]), "g": g.tolist(), "curve": np.mean(g, axis=0).tolist()})
`);
const r = JSON.parse(out);
console.log(`Albedo=${ALBEDO}  Óptimo Python=${r.opt}°  Óptimo MATLAB=${MATLAB.opt}°`);
let maxErr = 0;
for (const ang of [15, 30, 45, 60, 75, 90]) {
  const pyv = r.g.map((row) => row[ang - 1]);
  const err = pyv.map((v, i) => Math.abs(v - MATLAB[ang][i]));
  maxErr = Math.max(maxErr, ...err);
  console.log(`${String(ang).padStart(2)}°  PY: ${pyv.map((v) => v.toFixed(2)).join(' ')}`);
  console.log(`     ML: ${MATLAB[ang].map((v) => v.toFixed(2)).join(' ')}   maxΔ=${Math.max(...err).toFixed(3)}`);
}
console.log('Curva media (cada 5°):', r.curve.filter((_, i) => (i + 1) % 5 === 0).map((v) => v.toFixed(2)).join(' '));
console.log(`MAX ABS ERROR = ${maxErr.toFixed(3)} kWh/m²/día`);
