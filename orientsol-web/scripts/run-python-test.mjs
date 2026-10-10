import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function run() {
  console.log('[Runner] Loading Pyodide runtime and NumPy...');
  const py = await loadPyodide();
  await py.loadPackage('numpy');
  console.log('[Runner] Pyodide and NumPy ready.');

  const files = [
    // Core geometry
    'src/python/core/constants.py',
    'src/python/core/conversions.py',
    'src/python/core/declination.py',
    'src/python/core/sunset_angles.py',
    'src/python/core/hour_angles.py',
    'src/python/core/solar_position.py',
    'src/python/core/__init__.py',
    'src/python/verify_solar_geometry.py',

    // Radiation decomposition & transposition
    'src/python/radiation/extraterrestrial.py',
    'src/python/radiation/horizontal_decomposition.py',
    'src/python/radiation/hourly_radiation.py',
    'src/python/radiation/transposition.py',
    'src/python/radiation/__init__.py',
    'src/python/test_radiation_transposition.py',

    // Seasonal tilt optimization & Surface optimization
    'src/python/optimization/seasonal_optimum.py',
    'src/python/optimization/monthly_optimum.py',
    'src/python/optimization/loss_maps.py',
    'src/python/optimization/surface_optimizer.py',
    'src/python/optimization/__init__.py',
    'src/python/test_surface_and_loss_maps.py',

    // Solar tracking systems & comparative gains
    'src/python/tracking/dual_axis.py',
    'src/python/tracking/polar_axis.py',
    'src/python/tracking/azimuthal_axis.py',
    'src/python/tracking/horizontal_axis.py',
    'src/python/tracking/gains.py',
    'src/python/tracking/__init__.py',
    'src/python/test_tracking_seasonal.py',

    // Energy models & temperatures
    'src/python/energy/simplified.py',
    'src/python/energy/osterwald.py',
    'src/python/energy/temperatures.py',
    'src/python/energy/energy_yield.py',
    'src/python/energy/__init__.py',
    'src/python/test_energy_models.py',
  ];

  const dirs = [
    '/orient',
    '/orient/core',
    '/orient/radiation',
    '/orient/optimization',
    '/orient/tracking',
    '/orient/energy',
  ];
  for (const dir of dirs) {
    try {
      py.FS.mkdir(dir);
    } catch {}
  }

  for (const rel of files) {
    const full = path.join(rootDir, rel);
    const content = fs.readFileSync(full, 'utf8');
    const dest = '/orient/' + rel.replace('src/python/', '');
    py.FS.writeFile(dest, content);
  }

  console.log('[Runner] Mounted all Python modules in Pyodide VFS.\n');

  const target = process.argv[2] ? process.argv[2].toLowerCase() : 'all';

  // Test 0: Base Solar Geometry (verify_solar_geometry.py)
  if (target === 'all' || target.includes('geo')) {
    console.log('--- TEST 0: GEOMETRÍA SOLAR (verify_solar_geometry.py) ---');
    py.runPython(`
import sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')

import verify_solar_geometry as vsg
res = vsg.calculate_specific_date_geometry(latitude_deg=40.4168, day=15, month=7)
vsg.print_verification_report(res)
vsg.verify_matlab_12months_baseline(latitude_deg=40.4168)
`);
  }

  // Test 1: Radiation & Transposition
  if (target === 'all' || target.includes('rad')) {
    console.log('--- TEST 1: RADIACIÓN Y TRANSPOSICIÓN ---');
    py.runPython(`
import sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')

import test_radiation_transposition as trt
trt.run_full_radiation_test(latitude_deg=40.4168, city_name="Madrid (España)")
`);
  }

  // Test 2: Tracking Systems & Seasonal Optimization
  if (target === 'all' || target.includes('track') || target.includes('opt')) {
    console.log('\n--- TEST 2: SEGUIMIENTO SOLAR (4 SISTEMAS) Y OPTIMIZACIÓN ESTACIONAL ---');
    py.runPython(`
import sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')

import test_tracking_seasonal as tts
tts.run_full_tracking_seasonal_test(latitude_deg=40.4168, city_name="Madrid (España)")
`);
  }

  // Test 3: PV Energy & Thermal Models
  if (target === 'all' || target.includes('ener')) {
    console.log('\n--- TEST 3: MODELOS DE ENERGÍA FV (SIMPLIFICADO Y OSTERWALD) ---');
    py.runPython(`
import sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')

import test_energy_models as tem
tem.run_full_energy_test(latitude_deg=40.4168, city_name="Madrid (España)")
`);
  }

  // Test 4: Expanded Surfaces, Loss Maps & Temperatures
  if (target === 'all' || target.includes('surf') || target.includes('loss')) {
    console.log('\n--- TEST 4: OPTIMIZACIÓN GLOBAL, MAPA DE PÉRDIDAS CTE Y TEMPERATURAS ---');
    py.runPython(`
import sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')

import test_surface_and_loss_maps as tsl
tsl.run_tests()
`);
  }
}

run().catch((err) => {
  console.error('[Runner Error]:', err);
  process.exit(1);
});
