"""
Solar radiation transposition models for inclined/tilted surfaces.
Translated from OrientSol MATLAB code:
- BhBeta.m (Hourly beam on tilted plane)
- DhBeta.m (Hourly diffuse on tilted plane)
- RhBeta.m (Hourly albedo / ground-reflected on tilted plane)
- GhBeta.m (Hourly global on tilted plane)
- BdBeta.m (Daily beam on tilted plane for 91 inclinations)
- DdBeta.m (Daily diffuse on tilted plane for 91 inclinations)
- RdBeta.m (Daily albedo on tilted plane for 91 inclinations)
- GdBeta.m (Daily global on tilted plane for 91 inclinations)
- Calculos_optimo.m (Annual optimal tilt angle determination)
"""

from typing import Dict, Tuple, Union
import numpy as np
try:
    from core.conversions import deg2rad
except (ImportError, ValueError):
    from core.conversions import deg2rad


def build_inclinations_array(lat_rad: float) -> np.ndarray:
    """
    Build the 91-element inclination angle vector (1° to 91° in radians)
    matching OrientSol MATLAB convention:
        if LAT_RAD < 0: n = n + (-1*2*pi/360)
        else: n = n + (1*2*pi/360)
    """
    step = deg2rad(1.0)
    if lat_rad < 0:
        return -step * np.arange(1, 92, dtype=np.float64)
    return step * np.arange(1, 92, dtype=np.float64)


def bh_beta(
    val_decli: np.ndarray,
    numero_n2: np.ndarray,
    lat_rad: float,
    matriz_angulos2: np.ndarray,
    bh_matriz: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function BhBetaTotal = BhBeta(Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz)

    Calculates hourly beam radiation on tilted surfaces for 91 angles [kWh/m²/h].
    Uses NumPy 3D tensor broadcasting:
        Cos_AngInciden = sin(dec)*sin(lat-beta) + cos(dec)*cos(lat-beta)*cos(w)
        Cos_AngZenital = sin(dec)*sin(lat) + cos(dec)*cos(lat)*cos(w)
        BhBetaTotal = (Bh_matriz * Cos_AngInciden) / Cos_AngZenital

    Returns
    -------
    np.ndarray
        Array of shape (12, 91, max_n) containing Bh(beta).
    """
    inclinaciones = build_inclinations_array(lat_rad)
    dec = np.asarray(val_decli, dtype=np.float64)[:, np.newaxis, np.newaxis]
    angles = np.asarray(matriz_angulos2, dtype=np.float64)  # (12, 91, max_n)
    bh = np.asarray(bh_matriz, dtype=np.float64)[:, np.newaxis, :]  # (12, 1, max_n)

    lat_minus_beta = (lat_rad - inclinaciones)[np.newaxis, :, np.newaxis]

    cos_w = np.cos(angles)
    cos_inc = np.sin(dec) * np.sin(lat_minus_beta) + np.cos(dec) * np.cos(lat_minus_beta) * cos_w
    cos_zen = np.sin(dec) * np.sin(lat_rad) + np.cos(dec) * np.cos(lat_rad) * cos_w

    # Geometric transposition factor rb = cos(theta) / cos(theta_z)
    safe_zen = np.where(cos_zen > 1e-6, cos_zen, 1e-6)
    rb = np.where((cos_zen > 1e-6) & (cos_inc > 0.0), cos_inc / safe_zen, 0.0)

    bh_beta_total = bh * rb

    # Mask valid daylight hours based on numeroN2
    max_n = angles.shape[2]
    k_indices = np.arange(max_n)[np.newaxis, np.newaxis, :]
    valid_mask = k_indices < numero_n2[:, :, np.newaxis]

    return np.where(valid_mask, np.maximum(bh_beta_total, 0.0), 0.0)


def dh_beta(
    numero_n2: np.ndarray,
    dh_matriz: np.ndarray,
    lat_rad: float = 0.0,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function DhBetaTotal = DhBeta(numeroN2, Dh_matriz)

    Calculates hourly diffuse radiation on tilted surfaces for 91 angles using
    Liu-Jordan isotropic model:
        DhBetaTotal = (Dh_matriz / 2) * (1 + cos(beta))

    Returns
    -------
    np.ndarray
        Array of shape (12, 91, max_n) containing Dh(beta) [kWh/m²/h].
    """
    inclinaciones = build_inclinations_array(lat_rad)
    dh = np.asarray(dh_matriz, dtype=np.float64)[:, np.newaxis, :]  # (12, 1, max_n)
    
    view_factor = 0.5 * (1.0 + np.cos(inclinaciones))[np.newaxis, :, np.newaxis]
    dh_beta_total = dh * view_factor

    max_n = dh_matriz.shape[1]
    k_indices = np.arange(max_n)[np.newaxis, np.newaxis, :]
    valid_mask = k_indices < numero_n2[:, :, np.newaxis]

    return np.where(valid_mask, np.maximum(dh_beta_total, 0.0), 0.0)


def rh_beta(
    numero_n2: np.ndarray,
    gh_matriz: np.ndarray,
    albedo: float = 0.20,
    lat_rad: float = 0.0,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function RhBetaTotal = RhBeta(numeroN2, Gh_matriz, COEF)

    Calculates hourly ground-reflected (albedo) radiation on tilted surfaces:
        RhBetaTotal = (Gh_matriz / 2) * (1 - cos(beta)) * albedo

    Returns
    -------
    np.ndarray
        Array of shape (12, 91, max_n) containing Rh(beta) [kWh/m²/h].
    """
    inclinaciones = build_inclinations_array(lat_rad)
    gh = np.asarray(gh_matriz, dtype=np.float64)[:, np.newaxis, :]  # (12, 1, max_n)

    ground_view_factor = 0.5 * (1.0 - np.cos(inclinaciones))[np.newaxis, :, np.newaxis]
    rh_beta_total = gh * ground_view_factor * albedo

    max_n = gh_matriz.shape[1]
    k_indices = np.arange(max_n)[np.newaxis, np.newaxis, :]
    valid_mask = k_indices < numero_n2[:, :, np.newaxis]

    return np.where(valid_mask, np.maximum(rh_beta_total, 0.0), 0.0)


def gh_beta(
    numero_n2: np.ndarray,
    bh_beta_total: np.ndarray,
    dh_beta_total: np.ndarray,
    rh_beta_total: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function GhBetaTotal = GhBeta(numeroN2, BhBetaTotal, DhBetaTotal, RhBetaTotal)

    GhBetaTotal = (BhBetaTotal + DhBetaTotal + RhBetaTotal) * 2

    Returns
    -------
    np.ndarray
        Array of shape (12, 91, max_n) containing Gh(beta) [kWh/m²/h].
    """
    total = (bh_beta_total + dh_beta_total + rh_beta_total) * 2.0

    max_n = bh_beta_total.shape[2]
    k_indices = np.arange(max_n)[np.newaxis, np.newaxis, :]
    valid_mask = k_indices < numero_n2[:, :, np.newaxis]

    return np.where(valid_mask, np.maximum(total, 0.0), 0.0)


def bd_beta(
    bh_beta_total: np.ndarray,
    numero_n2: np.ndarray,
    angulo_optimo: int,
    val_bdm0: np.ndarray,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    """
    Direct translation of MATLAB function:
    function [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo] = BdBeta(...)

    Integrates hourly beam into daily beam for all 91 angles:
        BdBetaTotal = 2 * sum(BhBetaTotal, axis=2)

    Returns
    -------
    Tuple[np.ndarray, np.ndarray, np.ndarray, float]
        (BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo)
    """
    bd_beta_total = 2.0 * np.sum(bh_beta_total, axis=2)
    media_bd = np.mean(bd_beta_total, axis=0)

    if angulo_optimo == 0:
        radiacion_bd_optima = np.asarray(val_bdm0, dtype=np.float64)
        media_bd_optimo = float(np.mean(radiacion_bd_optima))
    else:
        opt_idx = angulo_optimo - 1
        radiacion_bd_optima = bd_beta_total[:, opt_idx]
        media_bd_optimo = float(media_bd[opt_idx])

    return bd_beta_total, media_bd, radiacion_bd_optima, media_bd_optimo


def dd_beta(
    dh_beta_total: np.ndarray,
    numero_n2: np.ndarray,
    angulo_optimo: int,
    val_ddm0: np.ndarray,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    """
    Direct translation of MATLAB function:
    function [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo] = DdBeta(...)
    """
    dd_beta_total = 2.0 * np.sum(dh_beta_total, axis=2)
    media_dd = np.mean(dd_beta_total, axis=0)

    if angulo_optimo == 0:
        radiacion_dd_optima = np.asarray(val_ddm0, dtype=np.float64)
        media_dd_optimo = float(np.mean(radiacion_dd_optima))
    else:
        opt_idx = angulo_optimo - 1
        radiacion_dd_optima = dd_beta_total[:, opt_idx]
        media_dd_optimo = float(media_dd[opt_idx])

    return dd_beta_total, media_dd, radiacion_dd_optima, media_dd_optimo


def rd_beta(
    rh_beta_total: np.ndarray,
    numero_n2: np.ndarray,
    angulo_optimo: int,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    """
    Direct translation of MATLAB function:
    function [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo] = RdBeta(...)
    """
    rd_beta_total = 2.0 * np.sum(rh_beta_total, axis=2)
    media_rd = np.mean(rd_beta_total, axis=0)

    if angulo_optimo == 0:
        radiacion_rd_optima = np.zeros(12, dtype=np.float64)
        media_rd_optimo = 0.0
    else:
        opt_idx = angulo_optimo - 1
        radiacion_rd_optima = rd_beta_total[:, opt_idx]
        media_rd_optimo = float(media_rd[opt_idx])

    return rd_beta_total, media_rd, radiacion_rd_optima, media_rd_optimo


def gd_beta(
    numero_n2: np.ndarray,
    gh_beta_total: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function GdBetaTotal = GdBeta(numeroN2, GhBetaTotal)
    """
    return np.sum(gh_beta_total, axis=2)


def calculos_optimo(
    gd_beta_total: np.ndarray,
    datos_or_gdm0: np.ndarray,
) -> Tuple[np.ndarray, np.ndarray, int, np.ndarray, float]:
    """
    Direct translation of MATLAB function:
    function [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo] = Calculos_optimo(...)

    Determines the annual optimal inclination angle for solar collectors.

    Returns
    -------
    Tuple
        - Gdm_representar: Daily global radiation for angles [10°, 20°, ..., 90°] (shape: (12, 9))
        - media: Annual average daily global radiation for angles [10°, ..., 90°] (shape: (9,))
        - angulo_optimo: Annual optimal tilt angle in degrees (0 to 90)
        - Radiacion_optima: 12 monthly daily global radiation values for optimal angle [kWh/m²/day]
        - suma_angulo_optimo: Annual average daily global radiation for optimal angle [kWh/m²/day]
    """
    datos_arr = np.asarray(datos_or_gdm0, dtype=np.float64)
    gdm0 = datos_arr[2:14] if len(datos_arr) == 26 else datos_arr
    media0 = float(np.mean(gdm0))

    # Gdm_representar for angles 10°, 20°, ..., 90° (MATLAB index 10:10:90, which is index 9:10:89 in 0-based)
    angle_indices_10_90 = np.arange(9, 90, 10)  # [9, 19, 29, 39, 49, 59, 69, 79, 89] -> angles [10..90]
    gdm_representar = np.round(gd_beta_total[:, angle_indices_10_90], 2)
    media_representar = np.round(np.mean(gdm_representar, axis=0), 2)

    # Annual average across all 91 inclination angles (1° to 91°)
    suma_optimo = np.mean(gd_beta_total, axis=0)  # shape: (91,)

    max_val = float(np.max(suma_optimo))
    best_idx = int(np.argmax(suma_optimo))
    best_angle = best_idx + 1  # 1-based degrees: index 0 -> 1°, index 34 -> 35°, etc.

    radiacion_optima = gd_beta_total[:, best_idx]
    suma_angulo_optimo = max_val

    # If optimal angle yields less than horizontal, horizontal is chosen
    if suma_angulo_optimo < media0:
        best_angle = 0
        radiacion_optima = gdm0
        suma_angulo_optimo = media0

    return gdm_representar, media_representar, best_angle, radiacion_optima, suma_angulo_optimo


def transpose_to_inclined_surfaces(
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n2: np.ndarray,
    matriz_angulos2: np.ndarray,
    bh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    gh_matriz: np.ndarray,
    val_bdm0: np.ndarray,
    val_ddm0: np.ndarray,
    datos_or_gdm0: np.ndarray,
    albedo: float = 0.20,
) -> Dict[str, Union[np.ndarray, int, float]]:
    """
    High-level vectorized orchestration of the complete OrientSol transposition pipeline.
    Calculates hourly and daily components (beam, diffuse, albedo, global) across all 91 angles
    and solves for the optimal annual tilt.
    """
    # 1. Hourly tilted components
    bh_beta_total = bh_beta(val_decli, numero_n2, lat_rad, matriz_angulos2, bh_matriz)
    dh_beta_total = dh_beta(numero_n2, dh_matriz, lat_rad)
    rh_beta_total = rh_beta(numero_n2, gh_matriz, albedo, lat_rad)
    gh_beta_total = gh_beta(numero_n2, bh_beta_total, dh_beta_total, rh_beta_total)

    # 2. Daily tilted components
    gd_beta_total = gd_beta(numero_n2, gh_beta_total)

    # 3. Solve annual optimum
    gdm_rep, media_rep, opt_angle, rad_opt, sum_opt = calculos_optimo(gd_beta_total, datos_or_gdm0)

    # 4. Extract beam, diffuse, albedo at optimum
    bd_beta_tot, media_bd, rad_bd_opt, media_bd_opt = bd_beta(bh_beta_total, numero_n2, opt_angle, val_bdm0)
    dd_beta_tot, media_dd, rad_dd_opt, media_dd_opt = dd_beta(dh_beta_total, numero_n2, opt_angle, val_ddm0)
    rd_beta_tot, media_rd, rad_rd_opt, media_rd_opt = rd_beta(rh_beta_total, numero_n2, opt_angle)

    return {
        "opt_angle_deg": opt_angle,
        "media_global_opt": sum_opt,
        "radiacion_global_opt": rad_opt,
        "media_beam_opt": media_bd_opt,
        "radiacion_beam_opt": rad_bd_opt,
        "media_diffuse_opt": media_dd_opt,
        "radiacion_diffuse_opt": rad_dd_opt,
        "media_albedo_opt": media_rd_opt,
        "radiacion_albedo_opt": rad_rd_opt,
        "gd_beta_total": gd_beta_total,
        "bd_beta_total": bd_beta_tot,
        "dd_beta_total": dd_beta_tot,
        "rd_beta_total": rd_beta_tot,
        "gdm_representar": gdm_rep,
        "media_representar": media_rep,
    }
