"""Photovoltaic Energy Generation and Thermal Models for OrientSol.

Provides translations of MATLAB files:
- Energia.m (Simplified Performance Ratio model)
- Energia_Osterwald.m, Energia_Osterwald_N.m (Osterwald thermal derating model)
- temperatures.py (Ambient and Cell Operating Temperatures)
- energy_yield.py (Comprehensive Energy Received vs Produced)
"""

from .simplified import calculate_simplified_energy, DAYS_PER_MONTH
from .osterwald import calculate_osterwald_energy
from .temperatures import (
    calculate_ambient_temperatures,
    calculate_cell_operating_temperatures,
    compare_surface_temperatures,
)
from .energy_yield import calculate_energy_yield

__all__ = [
    "calculate_simplified_energy",
    "calculate_osterwald_energy",
    "calculate_ambient_temperatures",
    "calculate_cell_operating_temperatures",
    "compare_surface_temperatures",
    "calculate_energy_yield",
    "DAYS_PER_MONTH",
]
