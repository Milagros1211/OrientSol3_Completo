"""
Solar Radiation Decomposition and Transposition Module for OrientSol.

Provides translated MATLAB functions:
- Bod0.m            -> bod0, extraterrestrial_daily_radiation, eccentricity_factor
- Bdm0.m            -> bdm0, decompose_horizontal_radiation, clearness_index, diffuse_fraction_liu_jordan
- Gh0.m             -> gh0
- Dh0.m             -> dh0
- Bh0.m             -> bh0
- BhBeta.m          -> bh_beta
- DhBeta.m          -> dh_beta
- RhBeta.m          -> rh_beta
- GhBeta.m          -> gh_beta
- BdBeta.m          -> bd_beta
- DdBeta.m          -> dd_beta
- RdBeta.m          -> rd_beta
- GdBeta.m          -> gd_beta
- Calculos_optimo.m -> calculos_optimo
- High-level pipeline -> transpose_to_inclined_surfaces
"""

from .extraterrestrial import (
    eccentricity_factor,
    extraterrestrial_daily_radiation,
    bod0,
)
from .horizontal_decomposition import (
    clearness_index,
    diffuse_fraction_liu_jordan,
    decompose_horizontal_radiation,
    bdm0,
)
from .hourly_radiation import (
    gh0,
    dh0,
    bh0,
)
from .transposition import (
    build_inclinations_array,
    bh_beta,
    dh_beta,
    rh_beta,
    gh_beta,
    bd_beta,
    dd_beta,
    rd_beta,
    gd_beta,
    calculos_optimo,
    transpose_to_inclined_surfaces,
)

__all__ = [
    "eccentricity_factor",
    "extraterrestrial_daily_radiation",
    "bod0",
    "clearness_index",
    "diffuse_fraction_liu_jordan",
    "decompose_horizontal_radiation",
    "bdm0",
    "gh0",
    "dh0",
    "bh0",
    "build_inclinations_array",
    "bh_beta",
    "dh_beta",
    "rh_beta",
    "gh_beta",
    "bd_beta",
    "dd_beta",
    "rd_beta",
    "gd_beta",
    "calculos_optimo",
    "transpose_to_inclined_surfaces",
]
