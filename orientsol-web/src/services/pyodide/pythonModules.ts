// Core geometry
import constantsPy from '@/python/core/constants.py?raw';
import conversionsPy from '@/python/core/conversions.py?raw';
import declinationPy from '@/python/core/declination.py?raw';
import sunsetAnglesPy from '@/python/core/sunset_angles.py?raw';
import hourAnglesPy from '@/python/core/hour_angles.py?raw';
import solarPositionPy from '@/python/core/solar_position.py?raw';
import coreInitPy from '@/python/core/__init__.py?raw';
import verifySolarPy from '@/python/verify_solar_geometry.py?raw';

// Radiation decomposition & transposition
import extraterrestrialPy from '@/python/radiation/extraterrestrial.py?raw';
import horizontalDecompPy from '@/python/radiation/horizontal_decomposition.py?raw';
import hourlyRadiationPy from '@/python/radiation/hourly_radiation.py?raw';
import transpositionPy from '@/python/radiation/transposition.py?raw';
import radiationInitPy from '@/python/radiation/__init__.py?raw';
import testRadiationPy from '@/python/test_radiation_transposition.py?raw';

// Seasonal tilt optimization & Surface optimization
import seasonalOptimumPy from '@/python/optimization/seasonal_optimum.py?raw';
import monthlyOptimumPy from '@/python/optimization/monthly_optimum.py?raw';
import lossMapsPy from '@/python/optimization/loss_maps.py?raw';
import surfaceOptimizerPy from '@/python/optimization/surface_optimizer.py?raw';
import optimizationInitPy from '@/python/optimization/__init__.py?raw';
import testSurfaceAndLossMapsPy from '@/python/test_surface_and_loss_maps.py?raw';

// Solar tracking systems & comparative gains
import dualAxisPy from '@/python/tracking/dual_axis.py?raw';
import polarAxisPy from '@/python/tracking/polar_axis.py?raw';
import azimuthalAxisPy from '@/python/tracking/azimuthal_axis.py?raw';
import horizontalAxisPy from '@/python/tracking/horizontal_axis.py?raw';
import gainsPy from '@/python/tracking/gains.py?raw';
import trackingInitPy from '@/python/tracking/__init__.py?raw';
import testTrackingPy from '@/python/test_tracking_seasonal.py?raw';

// Photovoltaic energy and thermal models
import simplifiedEnergyPy from '@/python/energy/simplified.py?raw';
import osterwaldPy from '@/python/energy/osterwald.py?raw';
import temperaturesPy from '@/python/energy/temperatures.py?raw';
import energyYieldPy from '@/python/energy/energy_yield.py?raw';
import energyInitPy from '@/python/energy/__init__.py?raw';
import testEnergyPy from '@/python/test_energy_models.py?raw';

export interface VirtualFile {
  path: string;
  content: string;
}

export const EMBEDDED_PYTHON_MODULES: VirtualFile[] = [
  // Core solar geometry
  { path: '/orient/core/constants.py', content: constantsPy },
  { path: '/orient/core/conversions.py', content: conversionsPy },
  { path: '/orient/core/declination.py', content: declinationPy },
  { path: '/orient/core/sunset_angles.py', content: sunsetAnglesPy },
  { path: '/orient/core/hour_angles.py', content: hourAnglesPy },
  { path: '/orient/core/solar_position.py', content: solarPositionPy },
  { path: '/orient/core/__init__.py', content: coreInitPy },
  { path: '/orient/verify_solar_geometry.py', content: verifySolarPy },

  // Radiation decomposition and transposition
  { path: '/orient/radiation/extraterrestrial.py', content: extraterrestrialPy },
  { path: '/orient/radiation/horizontal_decomposition.py', content: horizontalDecompPy },
  { path: '/orient/radiation/hourly_radiation.py', content: hourlyRadiationPy },
  { path: '/orient/radiation/transposition.py', content: transpositionPy },
  { path: '/orient/radiation/__init__.py', content: radiationInitPy },
  { path: '/orient/test_radiation_transposition.py', content: testRadiationPy },

  // Surface Optimization & Loss Maps
  { path: '/orient/optimization/seasonal_optimum.py', content: seasonalOptimumPy },
  { path: '/orient/optimization/monthly_optimum.py', content: monthlyOptimumPy },
  { path: '/orient/optimization/loss_maps.py', content: lossMapsPy },
  { path: '/orient/optimization/surface_optimizer.py', content: surfaceOptimizerPy },
  { path: '/orient/optimization/__init__.py', content: optimizationInitPy },
  { path: '/orient/test_surface_and_loss_maps.py', content: testSurfaceAndLossMapsPy },

  // Solar tracking systems and gains
  { path: '/orient/tracking/dual_axis.py', content: dualAxisPy },
  { path: '/orient/tracking/polar_axis.py', content: polarAxisPy },
  { path: '/orient/tracking/azimuthal_axis.py', content: azimuthalAxisPy },
  { path: '/orient/tracking/horizontal_axis.py', content: horizontalAxisPy },
  { path: '/orient/tracking/gains.py', content: gainsPy },
  { path: '/orient/tracking/__init__.py', content: trackingInitPy },
  { path: '/orient/test_tracking_seasonal.py', content: testTrackingPy },

  // Photovoltaic energy and thermal models
  { path: '/orient/energy/simplified.py', content: simplifiedEnergyPy },
  { path: '/orient/energy/osterwald.py', content: osterwaldPy },
  { path: '/orient/energy/temperatures.py', content: temperaturesPy },
  { path: '/orient/energy/energy_yield.py', content: energyYieldPy },
  { path: '/orient/energy/__init__.py', content: energyInitPy },
  { path: '/orient/test_energy_models.py', content: testEnergyPy },
];
