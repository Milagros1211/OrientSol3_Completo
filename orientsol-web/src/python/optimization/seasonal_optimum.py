"""
Seasonal Solar Tilt Optimization Module translated from OrientSol MATLAB code.
Original files:
- Calculo_Optimo_Estacion.m
- Bd_OptEstacional.m
- Dd_OptEstacional.m
- Rd_OptEstacional.m
"""

from typing import Dict, Tuple, Union
import numpy as np


def optimize_seasonal_tilts(
    gd_beta_total: np.ndarray,
    datos_or_gdm0: np.ndarray,
    bd_beta_total: Union[np.ndarray, None] = None,
    dd_beta_total: Union[np.ndarray, None] = None,
    rd_beta_total: Union[np.ndarray, None] = None,
) -> Dict[str, Union[Dict[str, Union[int, float, np.ndarray]], np.ndarray, float]]:
    """
    Direct translation of MATLAB function:
    function [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, ...] = Calculo_Optimo_Estacion(GdBetaTotal, DATOS)

    Calculates optimal tilt angle for each of the 4 seasons:
    - Winter (Invierno): December, January, February (indices [11, 0, 1])
    - Spring (Primavera): March, April, May (indices [2, 3, 4])
    - Summer (Verano): June, July, August (indices [5, 6, 7])
    - Autumn (Otoño): September, October, November (indices [8, 9, 10])

    Returns
    -------
    Dict containing optimal angles, seasonal averages, and reconstructed 12-month vectors.
    """
    datos_arr = np.asarray(datos_or_gdm0, dtype=np.float64)
    gdm0 = datos_arr[2:14] if len(datos_arr) == 26 else datos_arr

    # Season month indices in Python 0-based indexing
    season_indices = {
        "winter": [11, 0, 1],  # Dic, Ene, Feb
        "spring": [2, 3, 4],   # Mar, Abr, May
        "summer": [5, 6, 7],   # Jun, Jul, Ago
        "autumn": [8, 9, 10],  # Sep, Oct, Nov
    }

    seasonal_results = {}
    gd_opt_seasonal_12 = np.zeros(12, dtype=np.float64)
    bd_opt_seasonal_12 = np.zeros(12, dtype=np.float64)
    dd_opt_seasonal_12 = np.zeros(12, dtype=np.float64)
    rd_opt_seasonal_12 = np.zeros(12, dtype=np.float64)

    for season_name, month_idxs in season_indices.items():
        sub_gd = gd_beta_total[month_idxs, :]  # shape: (3, 91)
        media_angles = np.mean(sub_gd, axis=0)  # shape: (91,)

        best_idx = int(np.argmax(media_angles))
        best_angle = best_idx + 1  # 1-based degrees (1° to 91°)
        opt_mean = float(media_angles[best_idx])
        opt_values = sub_gd[:, best_idx]

        # Horizontal baseline check for this season
        h_baseline = gdm0[month_idxs]
        h_mean = float(np.mean(h_baseline))

        if opt_mean < h_mean:
            best_angle = 0
            opt_mean = h_mean
            opt_values = h_baseline

        seasonal_results[season_name] = {
            "opt_angle_deg": best_angle,
            "mean_daily_kwh": opt_mean,
            "monthly_daily_kwh": opt_values,
        }

        # Populate reconstructed 12-month global vector
        for idx_pos, m_idx in enumerate(month_idxs):
            gd_opt_seasonal_12[m_idx] = opt_values[idx_pos]

            # Populate beam, diffuse, albedo if available
            if best_angle == 0:
                if bd_beta_total is not None:
                    bd_opt_seasonal_12[m_idx] = bd_beta_total[m_idx, 0]
                if dd_beta_total is not None:
                    dd_opt_seasonal_12[m_idx] = dd_beta_total[m_idx, 0]
                if rd_beta_total is not None:
                    rd_opt_seasonal_12[m_idx] = 0.0
            else:
                b_idx = best_angle - 1
                if bd_beta_total is not None:
                    bd_opt_seasonal_12[m_idx] = bd_beta_total[m_idx, b_idx]
                if dd_beta_total is not None:
                    dd_opt_seasonal_12[m_idx] = dd_beta_total[m_idx, b_idx]
                if rd_beta_total is not None:
                    rd_opt_seasonal_12[m_idx] = rd_beta_total[m_idx, b_idx]

    annual_mean_seasonal = float(np.mean(gd_opt_seasonal_12))

    return {
        "seasons": seasonal_results,
        "gd_opt_seasonal": gd_opt_seasonal_12,
        "bd_opt_seasonal": bd_opt_seasonal_12,
        "dd_opt_seasonal": dd_opt_seasonal_12,
        "rd_opt_seasonal": rd_opt_seasonal_12,
        "annual_mean_kwh": annual_mean_seasonal,
    }
