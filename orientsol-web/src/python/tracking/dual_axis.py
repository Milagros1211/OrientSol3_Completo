"""
Dual-Axis (2-Axis) Solar Tracking System models translated from OrientSol MATLAB code.
Original files:
- Bh_2Ejes.m
- Dh_2Ejes.m
- Rh_2Ejes.m
- Gh_2Ejes.m
- Bd_2Ejes.m
- Dd_2Ejes.m
- Rd_2Ejes.m
- Gd_2Ejes.m
"""

from typing import Dict, Tuple, Union
import numpy as np


def bh_2axis(
    lat_rad: float,
    beta_2axis: np.ndarray,
    azimut_solar: np.ndarray,
    val_decli: np.ndarray,
    matriz_angulos: np.ndarray,
    bh_matriz: np.ndarray,
    numero_n: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Bh2Ejes = Bh_2Ejes(LAT_RAD, Beta_2Ejes, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN)

    Calculates hourly beam radiation for 2-axis solar tracker [kWh/m²/h].
    """
    max_lim = int(np.max(numero_n)) if np.max(numero_n) > 0 else 1
    bh_2axis_mat = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        dec_i = val_decli[i]
        sin_dec = np.sin(dec_i)
        cos_dec = np.cos(dec_i)
        sin_lat = np.sin(lat_rad)
        cos_lat = np.cos(lat_rad)

        for j in range(n_hours):
            b = beta_2axis[i, j]
            az = azimut_solar[i, j]
            w = matriz_angulos[i, j]

            sin_b = np.sin(b)
            cos_b = np.cos(b)
            cos_az = np.cos(az)
            sin_az = np.sin(az)
            cos_w = np.cos(w)
            sin_w = np.sin(w)

            result1 = (sin_lat * cos_b - cos_lat * sin_b * cos_az) * sin_dec
            result2 = (cos_lat * cos_b + sin_lat * sin_b * cos_az) * cos_dec * cos_w
            result3 = cos_dec * sin_b * sin_az * sin_w

            cos_ang_incid = result1 + result2 + result3
            cos_ang_zenit = (sin_dec * sin_lat) + (cos_dec * cos_lat * cos_w)

            if cos_ang_zenit > 1e-6 and cos_ang_incid > 0:
                bh_2axis_mat[i, j] = (bh_matriz[i, j] * cos_ang_incid) / cos_ang_zenit
            else:
                bh_2axis_mat[i, j] = 0.0

    return bh_2axis_mat


def dh_2axis(
    beta_2axis: np.ndarray,
    dh_matriz: np.ndarray,
    numero_n: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Dh2Ejes = Dh_2Ejes(Beta_2Ejes, Dh_matriz, numeroN)
    """
    max_lim = dh_matriz.shape[1]
    dh_2axis_mat = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        for j in range(n_hours):
            dh_2axis_mat[i, j] = (dh_matriz[i, j] / 2.0) * (1.0 + np.cos(beta_2axis[i, j]))

    return dh_2axis_mat


def rh_2axis(
    beta_2axis: np.ndarray,
    gh_matriz: np.ndarray,
    numero_n: np.ndarray,
    albedo: float = 0.20,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Rh2Ejes = Rh_2Ejes(Beta_2Ejes, Gh_matriz, numeroN, COEF)
    """
    max_lim = gh_matriz.shape[1]
    rh_2axis_mat = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        for j in range(n_hours):
            rh_2axis_mat[i, j] = (gh_matriz[i, j] / 2.0) * (1.0 - np.cos(beta_2axis[i, j])) * albedo

    return rh_2axis_mat


def gh_2axis(
    bh_2axis_mat: np.ndarray,
    dh_2axis_mat: np.ndarray,
    rh_2axis_mat: np.ndarray,
    numero_n: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Gh2Ejes = Gh_2Ejes(Bh2Ejes, Dh2Ejes, Rh2Ejes, numeroN)
    """
    max_lim = bh_2axis_mat.shape[1]
    gh_2axis_mat = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        for j in range(n_hours):
            gh_2axis_mat[i, j] = (bh_2axis_mat[i, j] + dh_2axis_mat[i, j] + rh_2axis_mat[i, j]) * 2.0

    return gh_2axis_mat


def simulate_dual_axis_tracking(
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
    Simulates complete dual-axis solar tracking (2 Ejes).
    """
    # Tilt angle beta_2axis = (pi/2) - solar_altitude
    beta_2axis = (np.pi / 2.0) - altura_solar_mat

    bh_2ax = bh_2axis(lat_rad, beta_2axis, azimut_solar_mat, val_decli, matriz_angulos, bh_matriz, numero_n)
    dh_2ax = dh_2axis(beta_2axis, dh_matriz, numero_n)
    rh_2ax = rh_2axis(beta_2axis, gh_matriz, numero_n, albedo)
    gh_2ax = gh_2axis(bh_2ax, dh_2ax, rh_2ax, numero_n)

    # Daily integrations (Bd_2Ejes, Dd_2Ejes, Rd_2Ejes, Gd_2Ejes)
    bd_daily = 2.0 * np.sum(bh_2ax, axis=1)
    dd_daily = 2.0 * np.sum(dh_2ax, axis=1)
    rd_daily = 2.0 * np.sum(rh_2ax, axis=1)
    gd_daily = np.sum(gh_2ax, axis=1)

    return {
        "tracking_type": "2_axis",
        "beta_hourly": beta_2axis,
        "bh_hourly": bh_2ax,
        "dh_hourly": dh_2ax,
        "rh_hourly": rh_2ax,
        "gh_hourly": gh_2ax,
        "bd_daily": bd_daily,
        "dd_daily": dd_daily,
        "rd_daily": rd_daily,
        "gd_daily": gd_daily,
        "media_bd": float(np.mean(bd_daily)),
        "media_dd": float(np.mean(dd_daily)),
        "media_rd": float(np.mean(rd_daily)),
        "media_gd": float(np.mean(gd_daily)),
    }
