"""
Solar Gain and Performance Metrics comparison translated from OrientSol MATLAB code.
Original files:
- Ganancias_Gd_Anual.m, Ganancias_Bd_Anual.m, Ganancias_Dd_Anual.m, Ganancias_Rd_Anual.m
- Ganancias_Gd_Estacional.m, Ganancias_Bd_Estacional.m, etc.
- Ganancias_Gd_Polar.m, Ganancias_Gd_Azimutal.m, Ganancias_Gd_Horizontal.m, Ganancias_Gd_2Ejes.m
"""

from typing import Dict, Tuple, Union
import numpy as np


def compute_relative_gain(
    evaluated: Union[np.ndarray, float],
    baseline: Union[np.ndarray, float],
) -> Tuple[Union[np.ndarray, float], Union[np.ndarray, float]]:
    """
    Computes ratio and percentage gain:
        ratio = evaluated / baseline
        percent = (ratio - 1.0) * 100.0
    """
    e = np.asarray(evaluated, dtype=np.float64)
    b = np.asarray(baseline, dtype=np.float64)
    safe_b = np.where(np.abs(b) < 1e-6, 1e-6, b)
    ratio = e / safe_b
    percent = (ratio - 1.0) * 100.0
    if np.ndim(ratio) == 0:
        return float(ratio), float(percent)
    return ratio, percent


def compare_all_systems(
    gdm0: np.ndarray,
    gd_opt_annual: np.ndarray,
    gd_opt_seasonal: np.ndarray,
    gd_polar: np.ndarray,
    gd_azimuthal: np.ndarray,
    gd_horizontal: np.ndarray,
    gd_2axis: np.ndarray,
) -> Dict[str, Dict[str, Union[float, np.ndarray]]]:
    """
    Produces a unified comparative matrix of gains across all OrientSol solar configurations:
    - Fixed Horizontal (0°)
    - Fixed Optimal Annual Tilt (beta_opt)
    - Seasonal 4-Tilt Adjustments
    - 1-Axis Polar Tracking
    - 1-Axis Azimuthal Tracking
    - 1-Axis Horizontal (N-S) Tracking
    - 2-Axis Complete Tracking
    """
    mean_g0 = float(np.mean(gdm0))

    systems = {
        "horizontal": {"daily": gdm0, "annual_mean": mean_g0},
        "optimal_annual": {"daily": gd_opt_annual, "annual_mean": float(np.mean(gd_opt_annual))},
        "optimal_seasonal": {"daily": gd_opt_seasonal, "annual_mean": float(np.mean(gd_opt_seasonal))},
        "tracking_polar": {"daily": gd_polar, "annual_mean": float(np.mean(gd_polar))},
        "tracking_azimuthal": {"daily": gd_azimuthal, "annual_mean": float(np.mean(gd_azimuthal))},
        "tracking_horizontal": {"daily": gd_horizontal, "annual_mean": float(np.mean(gd_horizontal))},
        "tracking_2axis": {"daily": gd_2axis, "annual_mean": float(np.mean(gd_2axis))},
    }

    results = {}
    mean_opt_ann = systems["optimal_annual"]["annual_mean"]

    for name, data in systems.items():
        daily = data["daily"]
        annual_mean = data["annual_mean"]

        ratio_g0, pct_g0 = compute_relative_gain(daily, gdm0)
        ratio_opt, pct_opt = compute_relative_gain(daily, gd_opt_annual)

        ann_gain_g0 = ((annual_mean - mean_g0) / mean_g0) * 100.0
        ann_gain_opt = ((annual_mean - mean_opt_ann) / mean_opt_ann) * 100.0

        results[name] = {
            "annual_mean_kwh_m2": annual_mean,
            "annual_kwh_m2": annual_mean * 365.0,
            "gain_over_horizontal_pct": ann_gain_g0,
            "gain_over_optimal_annual_pct": ann_gain_opt,
            "monthly_gain_over_horizontal_pct": pct_g0,
            "monthly_gain_over_optimal_pct": pct_opt,
        }

    return results
