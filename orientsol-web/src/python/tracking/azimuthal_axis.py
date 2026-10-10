"""
1-Axis Azimuthal Solar Tracking System models translated from OrientSol MATLAB code.
Original files:
- Bh_EjeAzimutal.m
- Dh_EjeAzimutal.m
- Rh_EjeAzimutal.m
- Gh_EjeAzimutal.m
- Bd_EjeAzimutal.m
- Dd_EjeAzimutal.m
- Rd_EjeAzimutal.m
- Gd_EjeAzimutal.m
"""

from typing import Dict, Union
import numpy as np


def simulate_azimuthal_axis_tracking(
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n: np.ndarray,
    matriz_angulos: np.ndarray,
    azimut_solar_mat: np.ndarray,
    bh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    gh_matriz: np.ndarray,
    albedo: float = 0.20,
) -> Dict[str, Union[np.ndarray, float]]:
    """
    Direct translation of OrientSol 1-Axis Azimuthal Tracking routines.
    Fixed tilt angle equal to latitude (beta = |lat_rad|), rotating to track solar azimuth.
    """
    max_lim = bh_matriz.shape[1]
    bh_azim = np.zeros((12, max_lim), dtype=np.float64)
    dh_azim = np.zeros((12, max_lim), dtype=np.float64)
    rh_azim = np.zeros((12, max_lim), dtype=np.float64)
    gh_azim = np.zeros((12, max_lim), dtype=np.float64)

    beta = abs(lat_rad)
    sin_b = np.sin(beta)
    cos_b = np.cos(beta)
    sin_lat = np.sin(lat_rad)
    cos_lat = np.cos(lat_rad)

    diffuse_factor = 0.5 * (1.0 + cos_b)
    albedo_factor = 0.5 * (1.0 - cos_b) * albedo

    for i in range(12):
        n_hours = int(numero_n[i])
        dec_i = val_decli[i]
        sin_dec = np.sin(dec_i)
        cos_dec = np.cos(dec_i)

        for j in range(n_hours):
            az = azimut_solar_mat[i, j]
            w = matriz_angulos[i, j]
            cos_az = np.cos(az)
            sin_az = np.sin(az)
            cos_w = np.cos(w)
            sin_w = np.sin(w)

            result1 = (sin_lat * cos_b - cos_lat * sin_b * cos_az) * sin_dec
            result2 = (cos_lat * cos_b + sin_lat * sin_b * cos_az) * cos_dec * cos_w
            result3 = cos_dec * sin_b * sin_az * sin_w

            cos_inc = result1 + result2 + result3
            cos_zen = (sin_dec * sin_lat) + (cos_dec * cos_lat * cos_w)

            if cos_zen > 1e-6 and cos_inc > 0:
                bh_azim[i, j] = (bh_matriz[i, j] * cos_inc) / cos_zen

            dh_azim[i, j] = dh_matriz[i, j] * diffuse_factor
            rh_azim[i, j] = gh_matriz[i, j] * albedo_factor
            gh_azim[i, j] = (bh_azim[i, j] + dh_azim[i, j] + rh_azim[i, j]) * 2.0

    # Daily totals
    bd_daily = 2.0 * np.sum(bh_azim, axis=1)
    dd_daily = 2.0 * np.sum(dh_azim, axis=1)
    rd_daily = 2.0 * np.sum(rh_azim, axis=1)
    gd_daily = np.sum(gh_azim, axis=1)

    return {
        "tracking_type": "azimuthal_axis",
        "fixed_beta": beta,
        "bh_hourly": bh_azim,
        "dh_hourly": dh_azim,
        "rh_hourly": rh_azim,
        "gh_hourly": gh_azim,
        "bd_daily": bd_daily,
        "dd_daily": dd_daily,
        "rd_daily": rd_daily,
        "gd_daily": gd_daily,
        "media_bd": float(np.mean(bd_daily)),
        "media_dd": float(np.mean(dd_daily)),
        "media_rd": float(np.mean(rd_daily)),
        "media_gd": float(np.mean(gd_daily)),
    }
