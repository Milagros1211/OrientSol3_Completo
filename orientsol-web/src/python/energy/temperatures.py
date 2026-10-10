"""
Temperature Modeling Module for OrientSol 3.0.
Calculates ambient temperature metrics (Maximum, Minimum, Mean) and
photovoltaic cell operating temperatures (NOCT / TONC model) across all surfaces.

References:
- Energia_Osterwald.m
- Energia_Osterwald_N.m
"""

from typing import Dict, List, Union
import numpy as np

DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)


def calculate_ambient_temperatures(
    ambient_temp_monthly: Union[np.ndarray, List[float]],
    diurnal_range_c: float = 10.0,
) -> Dict[str, Union[float, np.ndarray]]:
    """
    Computes ambient temperature metrics: Mean, Maximum and Minimum.

    Parameters
    ----------
    ambient_temp_monthly : array_like (12,)
        Monthly mean ambient temperatures [°C].
    diurnal_range_c : float, default 10.0
        Average diurnal temperature amplitude (Tmax - Tmin) [°C].

    Returns
    -------
    dict
        Ambient temperature statistics.
    """
    t_mean = np.asarray(ambient_temp_monthly, dtype=np.float64)
    if len(t_mean) != 12:
        raise ValueError("ambient_temp_monthly must have exactly 12 values.")

    half_range = diurnal_range_c / 2.0
    t_max_monthly = t_mean + half_range
    t_min_monthly = t_mean - half_range

    return {
        "monthly_mean_c": t_mean,
        "monthly_max_c": t_max_monthly,
        "monthly_min_c": t_min_monthly,
        "annual_mean_c": float(np.mean(t_mean)),
        "annual_max_c": float(np.max(t_max_monthly)),
        "annual_min_c": float(np.min(t_min_monthly)),
    }


def calculate_cell_operating_temperatures(
    gdm_daily_kwh: Union[np.ndarray, List[float]],
    ambient_temp_c: Union[np.ndarray, List[float]],
    tonc: float = 47.0,
    surface_name: str = "evaluated_surface",
) -> Dict[str, Union[float, np.ndarray, str]]:
    """
    Calculates monthly and extreme cell operating temperatures using NOCT (TONC) model:

    1. Equivalent Daily Irradiance [W/m²]:
       G = Gdm * (1000 / 24)

    2. Cell Operating Temperature [°C]:
       Tc = Temp_amb + (((TONC - 20) / 800) * G)

    Parameters
    ----------
    gdm_daily_kwh : array_like (12,)
        Monthly global daily solar radiation on the surface [kWh/m²/day].
    ambient_temp_c : array_like (12,)
        Monthly mean ambient temperatures [°C].
    tonc : float, default 47.0
        Nominal Operating Cell Temperature NOCT / TONC [°C].
    surface_name : str
        Identifier of the surface configuration.

    Returns
    -------
    dict
        Operating cell temperature statistics (mean, max, min).
    """
    g_arr = np.asarray(gdm_daily_kwh, dtype=np.float64)
    t_amb = np.asarray(ambient_temp_c, dtype=np.float64)

    if len(g_arr) != 12 or len(t_amb) != 12:
        raise ValueError("Both gdm_daily_kwh and ambient_temp_c must contain 12 monthly values.")

    # Equivalent continuous irradiance in W/m²
    g_wm2 = g_arr * (1000.0 / 24.0)

    # NOCT formula
    tonc_factor = (tonc - 20.0) / 800.0
    tc_monthly = t_amb + (tonc_factor * g_wm2)

    # Estimated peak cell temperature during midday solar peak (G_peak ~ 2.5 * G_avg)
    tc_peak_monthly = t_amb + 5.0 + (tonc_factor * (g_wm2 * 2.2))
    tc_min_monthly = t_amb - 5.0

    return {
        "surface_name": surface_name,
        "tonc_c": tonc,
        "monthly_cell_temp_c": tc_monthly,
        "monthly_cell_temp_peak_c": tc_peak_monthly,
        "mean_cell_temp_c": float(np.mean(tc_monthly)),
        "max_cell_temp_c": float(np.max(tc_peak_monthly)),
        "min_cell_temp_c": float(np.min(tc_min_monthly)),
    }


def compare_surface_temperatures(
    surfaces_radiation: Dict[str, Union[np.ndarray, List[float]]],
    ambient_temp_c: Union[np.ndarray, List[float]],
    tonc: float = 47.0,
) -> Dict[str, Dict[str, Union[float, np.ndarray]]]:
    """
    Computes and compares operating cell temperatures across multiple surfaces.
    """
    results = {}
    for name, g_arr in surfaces_radiation.items():
        results[name] = calculate_cell_operating_temperatures(
            gdm_daily_kwh=g_arr,
            ambient_temp_c=ambient_temp_c,
            tonc=tonc,
            surface_name=name,
        )
    return results
