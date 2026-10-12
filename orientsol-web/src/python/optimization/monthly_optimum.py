"""
Monthly Optimal Tilt Optimization (12 Monthly Positions) for OrientSol 4.0.
Calculates independent optimal tilt angle for each of the 12 calendar months.

Original mathematical reference:
- Calculos_optimo.m
- CoeficienteCalculos.m
"""

from typing import Dict, List, Union
import numpy as np

DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)
MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']


def optimize_monthly_tilts(
    gd_beta_total: np.ndarray,
    datos_or_gdm0: Union[np.ndarray, List[float]],
    bd_beta_total: Union[np.ndarray, None] = None,
    dd_beta_total: Union[np.ndarray, None] = None,
    rd_beta_total: Union[np.ndarray, None] = None,
) -> Dict[str, Union[List[int], List[float], float, np.ndarray, Dict]]:
    """
    Computes the 12 monthly optimal tilt angles from the transposed radiation matrix.

    Parameters
    ----------
    gd_beta_total : np.ndarray, shape (12, 91)
        Daily global radiation for each month across all tilt angles beta in [0..90] degrees.
    datos_or_gdm0 : array_like (12,)
        Monthly horizontal global radiation Gdm(0) baseline.

    Returns
    -------
    dict
        12 monthly optimal tilt angles, monthly radiation yields, and gains.
    """
    gd_mat = np.asarray(gd_beta_total, dtype=np.float64)
    g0_arr = np.asarray(datos_or_gdm0, dtype=np.float64)
    if len(g0_arr) == 26:
        g0_arr = g0_arr[2:14]

    if gd_mat.shape != (12, 91):
        raise ValueError(f"gd_beta_total must have shape (12, 91), got {gd_mat.shape}")

    optimal_tilts_deg: List[int] = []
    optimal_daily_gdm: List[float] = []
    optimal_monthly_h: List[float] = []

    # Vectorized / looped month by month optimal search
    for m in range(12):
        row = gd_mat[m, :]
        best_idx = int(np.argmax(row))  # 0..90
        best_val = float(row[best_idx])
        best_angle = best_idx + 1  # 1-based degrees: index 0 -> 1°, index 90 -> 91°

        # If horizontal 0° yields more or equal radiation, 0° is the optimum
        if float(g0_arr[m]) >= best_val:
            best_angle = 0
            best_val = float(g0_arr[m])

        optimal_tilts_deg.append(best_angle)
        optimal_daily_gdm.append(best_val)
        optimal_monthly_h.append(best_val * DAYS_PER_MONTH[m])

    annual_mean_daily_kwh = float(np.mean(optimal_daily_gdm))
    annual_total_kwh_m2 = float(np.sum(optimal_monthly_h))

    # Baseline comparison with horizontal
    horizontal_mean_daily = float(np.mean(g0_arr))
    horizontal_total = float(np.sum(g0_arr * DAYS_PER_MONTH))
    gain_over_horizontal_pct = float(((annual_mean_daily_kwh - horizontal_mean_daily) / horizontal_mean_daily) * 100.0)

    # Fixed annual optimal for reference
    annual_curve_by_tilt = np.mean(gd_mat, axis=0)
    opt_annual_angle = int(np.argmax(annual_curve_by_tilt))
    opt_annual_mean = float(annual_curve_by_tilt[opt_annual_angle])
    gain_over_annual_fixed_pct = float(((annual_mean_daily_kwh - opt_annual_mean) / opt_annual_mean) * 100.0)

    # Detailed month-by-month results
    months_detail = []
    for m in range(12):
        months_detail.append({
            "month_index": m,
            "month_name": MONTH_NAMES[m],
            "optimal_tilt_deg": optimal_tilts_deg[m],
            "daily_kwh_m2": round(optimal_daily_gdm[m], 3),
            "monthly_total_kwh_m2": round(optimal_monthly_h[m], 2),
            "horizontal_daily_kwh_m2": round(float(g0_arr[m]), 3),
            "gain_over_horizontal_pct": round(((optimal_daily_gdm[m] - float(g0_arr[m])) / float(g0_arr[m])) * 100.0, 2),
        })

    return {
        "optimal_tilts_deg": optimal_tilts_deg,
        "monthly_daily_kwh": [round(v, 3) for v in optimal_daily_gdm],
        "monthly_total_kwh_m2": [round(v, 2) for v in optimal_monthly_h],
        "annual_mean_daily_kwh": round(annual_mean_daily_kwh, 3),
        "annual_total_kwh_m2": round(annual_total_kwh_m2, 1),
        "gain_over_horizontal_pct": round(gain_over_horizontal_pct, 2),
        "gain_over_annual_fixed_pct": round(gain_over_annual_fixed_pct, 2),
        "reference_annual_fixed_tilt_deg": opt_annual_angle,
        "months_detail": months_detail,
    }
