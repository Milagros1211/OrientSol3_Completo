"""
1-Axis Polar Solar Tracking System models translated from OrientSol MATLAB code.
Original files:
- Bh_EjePolar.m
- Dh_EjePolar.m
- Rh_EjePolar.m
- Gh_EjePolar.m
- Bd_EjePolar.m
- Dd_EjePolar.m
- Rd_EjePolar.m
- Gd_EjePolar.m
"""

from typing import Dict, Union
import numpy as np


def simulate_polar_axis_tracking(
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n: np.ndarray,
    matriz_angulos: np.ndarray,
    altura_solar_mat: np.ndarray,
    bh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    gh_matriz: np.ndarray,
    albedo: float = 0.20,
) -> Dict[str, Union[np.ndarray, float]]:
    """
    Direct translation of OrientSol 1-Axis Polar Tracking routines.
    Axis is tilted at latitude angle (beta = phi) and rotates following the sun.
    Angle of incidence: cos(theta) = cos(delta).
    """
    max_lim = bh_matriz.shape[1]
    bh_polar = np.zeros((12, max_lim), dtype=np.float64)
    dh_polar = np.zeros((12, max_lim), dtype=np.float64)
    rh_polar = np.zeros((12, max_lim), dtype=np.float64)
    gh_polar = np.zeros((12, max_lim), dtype=np.float64)
    beta_polar = np.zeros((12, max_lim), dtype=np.float64)

    sin_lat = np.sin(lat_rad)
    cos_lat = np.cos(lat_rad)
    tan_lat = np.tan(lat_rad)

    for i in range(12):
        n_hours = int(numero_n[i])
        dec_i = val_decli[i]
        sin_dec = np.sin(dec_i)
        cos_dec = np.cos(dec_i)

        for j in range(n_hours):
            w = matriz_angulos[i, j]
            h = altura_solar_mat[i, j]
            cos_zenit = (sin_dec * sin_lat) + (cos_dec * cos_lat * np.cos(w))

            # 1. Beam radiation (Bh_EjePolar.m): cos(theta) = cos(delta)
            if cos_zenit > 1e-6:
                bh_polar[i, j] = (bh_matriz[i, j] * cos_dec) / cos_zenit

            # 2. Dynamic tilt calculation for diffuse and reflected components (Dh_EjePolar.m / Rh_EjePolar.m)
            ang_zenit = np.arccos(np.clip(cos_zenit, -1.0, 1.0))
            cos_qk = (np.cos(ang_zenit) * cos_lat) + (np.sin(ang_zenit) * sin_lat)
            denom_qk = cos_qk * sin_lat

            safe_denom = denom_qk if abs(denom_qk) > 1e-12 else 1e-12
            alfa = np.arctan((np.sin(ang_zenit) * np.sin(h)) / safe_denom)
            cos_alfa = np.cos(alfa)
            safe_cos_alfa = cos_alfa if abs(cos_alfa) > 1e-12 else 1e-12
            beta = np.arctan(tan_lat / safe_cos_alfa)
            beta_polar[i, j] = beta

            # 3. Diffuse radiation (Dh_EjePolar.m)
            dh_polar[i, j] = (dh_matriz[i, j] / 2.0) * (1.0 + np.cos(beta))

            # 4. Reflected radiation (Rh_EjePolar.m)
            rh_polar[i, j] = (gh_matriz[i, j] / 2.0) * (1.0 - np.cos(beta)) * albedo

            # 5. Global hourly (Gh_EjePolar.m)
            gh_polar[i, j] = (bh_polar[i, j] + dh_polar[i, j] + rh_polar[i, j]) * 2.0

    # Daily totals
    bd_daily = 2.0 * np.sum(bh_polar, axis=1)
    dd_daily = 2.0 * np.sum(dh_polar, axis=1)
    rd_daily = 2.0 * np.sum(rh_polar, axis=1)
    gd_daily = np.sum(gh_polar, axis=1)

    return {
        "tracking_type": "polar_axis",
        "beta_hourly": beta_polar,
        "bh_hourly": bh_polar,
        "dh_hourly": dh_polar,
        "rh_hourly": rh_polar,
        "gh_hourly": gh_polar,
        "bd_daily": bd_daily,
        "dd_daily": dd_daily,
        "rd_daily": rd_daily,
        "gd_daily": gd_daily,
        "media_bd": float(np.mean(bd_daily)),
        "media_dd": float(np.mean(dd_daily)),
        "media_rd": float(np.mean(rd_daily)),
        "media_gd": float(np.mean(gd_daily)),
    }
