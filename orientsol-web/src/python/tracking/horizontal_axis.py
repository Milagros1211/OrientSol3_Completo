"""
1-Axis Horizontal Solar Tracking System models translated from OrientSol MATLAB code.
Original files:
- Bh_EjeHorizontal.m
- Dh_EjeHorizontal.m
- Rh_EjeHorizontal.m
- Gh_EjeHorizontal.m
- Bd_EjeHorizontal.m
- Dd_EjeHorizontal.m
- Rd_EjeHorizontal.m
- Gd_EjeHorizontal.m
"""

from typing import Dict, Union
import numpy as np


def simulate_horizontal_axis_tracking(
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n: np.ndarray,
    matriz_angulos: np.ndarray,
    altura_solar_mat: np.ndarray,
    azimut_solar_mat: np.ndarray,
    bh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    gh_matriz: np.ndarray,
    albedo: float = 0.20,
) -> Dict[str, Union[np.ndarray, float]]:
    """
    Direct translation of OrientSol 1-Axis Horizontal (North-South) Tracking routines.
    Horizontal rotation axis aligned North-South, tilting East-West:
        alfa = pi/2 (90°)
        beta = arctan(sin(AzimutSolar) / tan(AlturaSolar))
    """
    max_lim = bh_matriz.shape[1]
    bh_horiz = np.zeros((12, max_lim), dtype=np.float64)
    dh_horiz = np.zeros((12, max_lim), dtype=np.float64)
    rh_horiz = np.zeros((12, max_lim), dtype=np.float64)
    gh_horiz = np.zeros((12, max_lim), dtype=np.float64)
    beta_horiz = np.zeros((12, max_lim), dtype=np.float64)

    sin_lat = np.sin(lat_rad)
    cos_lat = np.cos(lat_rad)
    alfa = np.pi / 2.0  # 90° orientation
    cos_alfa = np.cos(alfa)
    sin_alfa = np.sin(alfa)

    for i in range(12):
        n_hours = int(numero_n[i])
        dec_i = val_decli[i]
        sin_dec = np.sin(dec_i)
        cos_dec = np.cos(dec_i)

        for j in range(n_hours):
            az = azimut_solar_mat[i, j]
            h = altura_solar_mat[i, j]
            w = matriz_angulos[i, j]

            tan_h = np.tan(h)
            safe_tan_h = tan_h if abs(tan_h) > 1e-12 else 1e-12
            b = np.arctan(np.sin(az) / safe_tan_h)
            beta_horiz[i, j] = b

            sin_b = np.sin(b)
            cos_b = np.cos(b)
            cos_w = np.cos(w)
            sin_w = np.sin(w)

            result1 = ((sin_lat * cos_b) - (cos_lat * sin_b * cos_alfa)) * sin_dec
            result2 = ((cos_lat * cos_b) + (sin_lat * sin_b * cos_alfa)) * cos_dec * cos_w
            result3 = cos_dec * sin_b * sin_alfa * sin_w

            cos_inc = result1 + result2 + result3
            cos_zen = (sin_dec * sin_lat) + (cos_dec * cos_lat * cos_w)

            if cos_zen > 1e-6 and cos_inc > 0:
                bh_horiz[i, j] = (bh_matriz[i, j] * cos_inc) / cos_zen

            dh_horiz[i, j] = (dh_matriz[i, j] / 2.0) * (1.0 + cos_b)
            rh_horiz[i, j] = (gh_matriz[i, j] / 2.0) * (1.0 - cos_b) * albedo
            gh_horiz[i, j] = (bh_horiz[i, j] + dh_horiz[i, j] + rh_horiz[i, j]) * 2.0

    # Daily totals
    bd_daily = 2.0 * np.sum(bh_horiz, axis=1)
    dd_daily = 2.0 * np.sum(dh_horiz, axis=1)
    rd_daily = 2.0 * np.sum(rh_horiz, axis=1)
    gd_daily = np.sum(gh_horiz, axis=1)

    return {
        "tracking_type": "horizontal_axis",
        "beta_hourly": beta_horiz,
        "bh_hourly": bh_horiz,
        "dh_hourly": dh_horiz,
        "rh_hourly": rh_horiz,
        "gh_hourly": gh_horiz,
        "bd_daily": bd_daily,
        "dd_daily": dd_daily,
        "rd_daily": rd_daily,
        "gd_daily": gd_daily,
        "media_bd": float(np.mean(bd_daily)),
        "media_dd": float(np.mean(dd_daily)),
        "media_rd": float(np.mean(rd_daily)),
        "media_gd": float(np.mean(gd_daily)),
    }
