"""
Solar Altitude (Elevation), Azimuth, and Dual-Axis Tilt translated from OrientSol MATLAB code.
Original files: Altura_Solar.m, Azimut_Solar.m, and Calulo_Beta_2Ejes.m
"""

from typing import Tuple, Union
import numpy as np


def solar_altitude(
    lat_rad: float,
    dec_rad: Union[float, np.ndarray],
    hour_angle_rad: Union[float, np.ndarray]
) -> Union[float, np.ndarray]:
    """
    Calculate solar altitude / elevation angle (alpha_s or h_s) in radians.
    
    sin(alpha_s) = sin(delta) * sin(phi) + cos(delta) * cos(phi) * cos(omega)
    """
    sin_alt = (
        np.sin(dec_rad) * np.sin(lat_rad)
        + np.cos(dec_rad) * np.cos(lat_rad) * np.cos(hour_angle_rad)
    )
    sin_alt_clipped = np.clip(sin_alt, -1.0, 1.0)
    alt = np.arcsin(sin_alt_clipped)
    return float(alt) if np.ndim(alt) == 0 else alt


def solar_azimuth(
    alt_rad: Union[float, np.ndarray],
    lat_rad: float,
    dec_rad: Union[float, np.ndarray]
) -> Union[float, np.ndarray]:
    """
    Calculate solar azimuth angle (psi_s or gamma_s) in radians,
    implementing the formula and boundary checks from OrientSol Azimut_Solar.m:

    cos(psi_s) = (sin(alpha_s) * sin(phi) - sin(delta)) / (cos(alpha_s) * cos(phi))
    """
    cos_alt = np.cos(alt_rad)
    cos_lat = np.cos(lat_rad)
    denominator = cos_alt * cos_lat

    # Avoid division by zero when the sun is exactly at zenith or latitude is at pole
    denom_safe = np.where(np.abs(denominator) < 1e-12, 1e-12, denominator)
    ratio = (np.sin(alt_rad) * np.sin(lat_rad) - np.sin(dec_rad)) / denom_safe

    # Default acos result
    is_valid = np.abs(ratio) <= 1.0
    azimuth = np.zeros_like(ratio, dtype=np.float64) if np.ndim(ratio) > 0 else 0.0

    tropic_rad = 23.45 * np.pi / 180.0
    if np.ndim(ratio) == 0:
        if is_valid:
            return float(np.arccos(np.clip(ratio, -1.0, 1.0)))
        decli = float(dec_rad)
        if lat_rad > 0:
            if lat_rad < tropic_rad:
                return 0.0 if decli < 0 else float(np.pi)
            return 0.0
        elif lat_rad < 0:
            if lat_rad > -tropic_rad:
                return 0.0 if decli < 0 else float(np.pi)
            return float(np.pi)
        return 0.0 if decli < 0 else float(np.pi)

    # Array handling
    valid_mask = np.abs(ratio) <= 1.0
    azimuth[valid_mask] = np.arccos(np.clip(ratio[valid_mask], -1.0, 1.0))

    # Boundary cases from Ec. (4.31) y Pág. 220 (PFC OrientSol):
    invalid_mask = ~valid_mask
    if np.any(invalid_mask):
        decli_arr = np.broadcast_to(dec_rad, ratio.shape)
        if lat_rad > 0:
            if lat_rad < tropic_rad:
                azimuth[invalid_mask] = np.where(decli_arr[invalid_mask] < 0, 0.0, np.pi)
            else:
                azimuth[invalid_mask] = 0.0
        elif lat_rad < 0:
            if lat_rad > -tropic_rad:
                azimuth[invalid_mask] = np.where(decli_arr[invalid_mask] < 0, 0.0, np.pi)
            else:
                azimuth[invalid_mask] = np.pi
        else:
            azimuth[invalid_mask] = np.where(decli_arr[invalid_mask] < 0, 0.0, np.pi)

    return azimuth


def dual_axis_tilt(
    alt_rad: Union[float, np.ndarray]
) -> Union[float, np.ndarray]:
    """
    Calculate dual-axis collector tilt angle beta_2ejes (zenith angle theta_z) in radians.
    Original file: Calulo_Beta_2Ejes.m:
        Beta_2Ejes = (pi/2) - AlturaSolar
    """
    beta = (np.pi / 2.0) - alt_rad
    return float(beta) if np.ndim(beta) == 0 else beta


def altura_solar(
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n: np.ndarray,
    matriz_angulos: np.ndarray
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function AlturaSolar = Altura_Solar(LAT_RAD, Val_decli, numeroN, matriz_angulos)

    Calculates solar elevation in radians for 12 months and each daylight hour interval.

    Note on Indexing Conversion:
    - MATLAB 1-based months (1..12) -> Python 0-based indices [0..11].
    - MATLAB 1-based hours (1..numeroN(i)) -> Python 0-based indices [0..numero_n[i]-1].

    Parameters
    ----------
    lat_rad : float
        Latitude in radians.
    val_decli : np.ndarray
        Array of 12 declination values in radians (shape: (12,)).
    numero_n : np.ndarray
        Array of number of solar hour intervals per month (shape: (12,)).
    matriz_angulos : np.ndarray
        Matrix of hour angles in radians (shape: (12, max_n)).

    Returns
    -------
    np.ndarray
        Array of shape (12, max_n) with solar altitude angles in radians.
    """
    max_lim = int(np.max(numero_n)) if np.max(numero_n) > 0 else 1
    altura_solar_mat = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        for j in range(n_hours):
            sin_val = (
                np.sin(val_decli[i]) * np.sin(lat_rad)
                + np.cos(val_decli[i]) * np.cos(lat_rad) * np.cos(matriz_angulos[i, j])
            )
            altura_solar_mat[i, j] = np.arcsin(np.clip(sin_val, -1.0, 1.0))

    return altura_solar_mat


def azimut_solar(
    altura_solar_mat: np.ndarray,
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n: np.ndarray
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function AzimutSolar = Azimut_Solar(AlturaSolar, LAT_RAD, Val_decli, numeroN)

    Calculates solar azimuth in radians for 12 months and each daylight hour interval.

    Note on Indexing Conversion:
    - MATLAB 1-based months (1..12) -> Python 0-based indices [0..11].
    - MATLAB 1-based hours (1..numeroN(i)) -> Python 0-based indices [0..numero_n[i]-1].

    Parameters
    ----------
    altura_solar_mat : np.ndarray
        Matrix of shape (12, max_n) from altura_solar.
    lat_rad : float
        Latitude in radians.
    val_decli : np.ndarray
        Array of 12 declination values in radians (shape: (12,)).
    numero_n : np.ndarray
        Array of number of solar hour intervals per month (shape: (12,)).

    Returns
    -------
    np.ndarray
        Array of shape (12, max_n) with solar azimuth angles in radians.
    """
    max_lim = int(np.max(numero_n)) if np.max(numero_n) > 0 else 1
    azimut_solar_mat = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        for j in range(n_hours):
            h = altura_solar_mat[i, j]
            cos_product = np.cos(h) * np.cos(lat_rad)

            if abs(cos_product) < 1e-12:
                ratio = 0.0
            else:
                ratio = (np.sin(h) * np.sin(lat_rad) - np.sin(val_decli[i])) / cos_product

            if abs(ratio) <= 1.0:
                azimut_solar_mat[i, j] = np.arccos(np.clip(ratio, -1.0, 1.0))
            else:
                # Reglas exactas de la Ec. (4.31) y Pág. 220 (PFC OrientSol):
                # A las 12 horas o cruce cenital:
                tropic_rad = 23.45 * np.pi / 180.0
                decli = val_decli[i]
                if lat_rad > 0:  # Hemisferio Norte
                    if lat_rad < tropic_rad:  # Latitud tropical
                        azimut_solar_mat[i, j] = 0.0 if decli < 0 else np.pi
                    else:
                        azimut_solar_mat[i, j] = 0.0
                elif lat_rad < 0:  # Hemisferio Sur
                    if lat_rad > -tropic_rad:  # Latitud tropical
                        azimut_solar_mat[i, j] = 0.0 if decli < 0 else np.pi
                    else:
                        azimut_solar_mat[i, j] = np.pi
                else:  # Ecuador
                    azimut_solar_mat[i, j] = 0.0 if decli < 0 else np.pi

    return azimut_solar_mat


def calculo_beta_2ejes(
    altura_solar_mat: np.ndarray,
    numero_n: np.ndarray
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Beta_2Ejes = Calulo_Beta_2Ejes(AlturaSolar, numeroN)

    Calculates tracking collector tilt angle for dual-axis tracking (zenith angle).
    Beta_2Ejes = (pi/2) - AlturaSolar

    Parameters
    ----------
    altura_solar_mat : np.ndarray
        Matrix of solar altitudes (shape: (12, max_n)).
    numero_n : np.ndarray
        Array of hour intervals per month (shape: (12,)).

    Returns
    -------
    np.ndarray
        Matrix of collector tilt angles for dual-axis tracking in radians.
    """
    max_lim = int(np.max(numero_n)) if np.max(numero_n) > 0 else 1
    beta_2ejes = np.zeros((12, max_lim), dtype=np.float64)

    for i in range(12):
        n_hours = int(numero_n[i])
        for j in range(n_hours):
            beta_2ejes[i, j] = (np.pi / 2.0) - altura_solar_mat[i, j]

    return beta_2ejes
