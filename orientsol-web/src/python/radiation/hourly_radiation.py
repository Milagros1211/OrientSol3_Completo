"""
Hourly horizontal radiation components translated from OrientSol MATLAB code.
Original files: Gh0.m, Dh0.m, and Bh0.m
"""

from typing import Tuple, Union
import numpy as np


def gh0(
    matriz_angulos: np.ndarray,
    ang_sal1: np.ndarray,
    numero_n: np.ndarray,
    datos_or_gdm0: np.ndarray,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Direct translation of MATLAB function:
    function [Gh_matriz, matriz_rg] = Gh0(matriz_angulos, AngSal1, numeroN, DATOS)

    Calculates hourly global radiation on horizontal surface using the
    Collares-Pereira and Rabl (1979) correlation:
        a = 0.409 + 0.5016 * sin(omega_s - 1.047)
        b = 0.6609 - 0.4767 * sin(omega_s - 1.047)
        rg = (pi / 24) * (a + b * cos(w)) * (cos(w) - cos(ws)) / (sin(ws) - ws * cos(ws))
        Gh(0) = rg * Gdm(0)

    Fully vectorized using NumPy broadcasting.

    Parameters
    ----------
    matriz_angulos : np.ndarray
        Matrix of hour angles in radians (shape: (12, max_n)).
    ang_sal1 : np.ndarray
        Array of 12 sunset hour angles in radians (shape: (12,)).
    numero_n : np.ndarray
        Array of number of solar hour intervals per month (shape: (12,)).
    datos_or_gdm0 : np.ndarray
        Either full DATOS array (26 columns) or 12-element monthly Gdm0 vector [kWh/m²/day].

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        (Gh_matriz, matriz_rg) arrays of shape (12, max_n) [kWh/m²/h].
    """
    datos_arr = np.asarray(datos_or_gdm0, dtype=np.float64)
    if len(datos_arr) == 26:
        gdm0 = datos_arr[2:14]
    else:
        gdm0 = datos_arr

    angles = np.asarray(matriz_angulos, dtype=np.float64)
    ws = np.asarray(ang_sal1, dtype=np.float64)
    ws_col = ws[:, np.newaxis]

    # Collares-Pereira coefficients (1.047 rad ≈ 60°)
    a = 0.409 + (0.5016 * np.sin(ws_col - 1.047))
    b = 0.6609 - (0.4767 * np.sin(ws_col - 1.047))

    denom = np.sin(ws_col) - (ws_col * np.cos(ws_col))
    safe_denom = np.where(np.abs(denom) < 1e-12, 1e-12, denom)

    num = np.cos(angles) - np.cos(ws_col)
    cos_weight = a + (b * np.cos(angles))

    matriz_rg = (np.pi / 24.0) * cos_weight * (num / safe_denom)

    # Zero out hours outside numero_n
    max_n = angles.shape[1]
    col_indices = np.arange(max_n)[np.newaxis, :]
    valid_mask = col_indices < numero_n[:, np.newaxis]

    matriz_rg = np.where(valid_mask, np.maximum(matriz_rg, 0.0), 0.0)
    gh_matriz = matriz_rg * gdm0[:, np.newaxis]

    return gh_matriz, matriz_rg


def dh0(
    matriz_angulos: np.ndarray,
    ang_sal1: np.ndarray,
    numero_n: np.ndarray,
    val_ddm0: np.ndarray,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Direct translation of MATLAB function:
    function [Dh_matriz, matriz_rd] = Dh0(matriz_angulos, AngSal1, numeroN, Val_Ddm0)

    Calculates hourly diffuse radiation on horizontal surface using the
    Liu and Jordan (1960) correlation:
        rd = (pi / 24) * (cos(w) - cos(ws)) / (sin(ws) - ws * cos(ws))
        Dh(0) = rd * Ddm(0)

    Parameters
    ----------
    matriz_angulos : np.ndarray
        Matrix of hour angles in radians (shape: (12, max_n)).
    ang_sal1 : np.ndarray
        Array of 12 sunset hour angles in radians (shape: (12,)).
    numero_n : np.ndarray
        Array of number of solar hour intervals per month (shape: (12,)).
    val_ddm0 : np.ndarray
        Array of monthly diffuse daily irradiation Ddm0 [kWh/m²/day] (shape: (12,)).

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        (Dh_matriz, matriz_rd) arrays of shape (12, max_n) [kWh/m²/h].
    """
    angles = np.asarray(matriz_angulos, dtype=np.float64)
    ws = np.asarray(ang_sal1, dtype=np.float64)
    ddm0 = np.asarray(val_ddm0, dtype=np.float64)
    ws_col = ws[:, np.newaxis]

    denom = np.sin(ws_col) - (ws_col * np.cos(ws_col))
    safe_denom = np.where(np.abs(denom) < 1e-12, 1e-12, denom)
    num = np.cos(angles) - np.cos(ws_col)

    matriz_rd = (np.pi / 24.0) * (num / safe_denom)

    max_n = angles.shape[1]
    col_indices = np.arange(max_n)[np.newaxis, :]
    valid_mask = col_indices < numero_n[:, np.newaxis]

    matriz_rd = np.where(valid_mask, np.maximum(matriz_rd, 0.0), 0.0)
    dh_matriz = matriz_rd * ddm0[:, np.newaxis]

    return dh_matriz, matriz_rd


def bh0(
    gh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    numero_n: np.ndarray,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Bh_matriz = Bh0(Gh_matriz, Dh_matriz, numeroN)

    Calculates hourly beam radiation on horizontal surface:
        Bh(0) = Gh(0) - Dh(0)

    Parameters
    ----------
    gh_matriz : np.ndarray
        Hourly global irradiance matrix (shape: (12, max_n)).
    dh_matriz : np.ndarray
        Hourly diffuse irradiance matrix (shape: (12, max_n)).
    numero_n : np.ndarray
        Array of number of solar hour intervals per month (shape: (12,)).

    Returns
    -------
    np.ndarray
        Array of shape (12, max_n) containing Bh(0) in kWh/m²/h.
    """
    gh = np.asarray(gh_matriz, dtype=np.float64)
    dh = np.asarray(dh_matriz, dtype=np.float64)
    
    bh_matriz = gh - dh

    max_n = gh.shape[1]
    col_indices = np.arange(max_n)[np.newaxis, :]
    valid_mask = col_indices < numero_n[:, np.newaxis]

    return np.where(valid_mask, np.maximum(bh_matriz, 0.0), 0.0)
