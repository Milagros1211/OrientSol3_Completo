"""Solar Tilt and Surface Optimization Module for OrientSol 4.0.

Covers:
- seasonal_optimum.py: 4 seasonal tilt adjustments
- monthly_optimum.py: 12 monthly tilt adjustments
- loss_maps.py: 2D Capture Loss Maps (CTE DB-HE4 compliant)
- surface_optimizer.py: Global surface optimization across all fixed and tracking systems
"""

from .seasonal_optimum import optimize_seasonal_tilts
from .monthly_optimum import optimize_monthly_tilts
from .loss_maps import generate_capture_loss_map
from .surface_optimizer import run_full_surface_optimization

__all__ = [
    "optimize_seasonal_tilts",
    "optimize_monthly_tilts",
    "generate_capture_loss_map",
    "run_full_surface_optimization",
]
