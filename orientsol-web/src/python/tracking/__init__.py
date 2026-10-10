"""
Solar Tracking Systems Module for OrientSol.

Provides translations of MATLAB files:
- 2-Axis Tracking: Bh_2Ejes.m, Dh_2Ejes.m, Rh_2Ejes.m, Gh_2Ejes.m, Bd_2Ejes.m, Gd_2Ejes.m
- 1-Axis Polar: Bh_EjePolar.m, Dh_EjePolar.m, Rh_EjePolar.m, Gh_EjePolar.m, Bd_EjePolar.m, Gd_EjePolar.m
- 1-Axis Azimuthal: Bh_EjeAzimutal.m, Dh_EjeAzimutal.m, Rh_EjeAzimutal.m, Gh_EjeAzimutal.m, Bd_EjeAzimutal.m, Gd_EjeAzimutal.m
- 1-Axis Horizontal: Bh_EjeHorizontal.m, Dh_EjeHorizontal.m, Rh_EjeHorizontal.m, Gh_EjeHorizontal.m, Bd_EjeHorizontal.m, Gd_EjeHorizontal.m
- Gain Calculations: Ganancias_*.m
"""

from .dual_axis import simulate_dual_axis_tracking, bh_2axis, dh_2axis, rh_2axis, gh_2axis
from .polar_axis import simulate_polar_axis_tracking
from .azimuthal_axis import simulate_azimuthal_axis_tracking
from .horizontal_axis import simulate_horizontal_axis_tracking
from .gains import compute_relative_gain, compare_all_systems

__all__ = [
    "simulate_dual_axis_tracking",
    "bh_2axis",
    "dh_2axis",
    "rh_2axis",
    "gh_2axis",
    "simulate_polar_axis_tracking",
    "simulate_azimuthal_axis_tracking",
    "simulate_horizontal_axis_tracking",
    "compute_relative_gain",
    "compare_all_systems",
]
