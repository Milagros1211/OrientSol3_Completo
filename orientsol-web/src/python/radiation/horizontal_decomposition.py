"""
Horizontal solar radiation decomposition into beam and diffuse components.
Original file: Bdm0.m
"""

from typing import Tuple, Union
import numpy as np

ArrayLike = Union[float, int, np.ndarray]


def clearness_index(gdm0: ArrayLike, bod0_wh: ArrayLike) -> ArrayLike:
    """
    Monthly clearness index (Ktm) = Gdm0 / (Bod0 / 1000).
    gdm0: Global horizontal irradiation [kWh/m²/day]
    bod0_wh: Extraterrestrial horizontal irradiation [Wh/m²/day]
    """
    g = np.asarray(gdm0, dtype=np.float64)
    b_kwh = np.asarray(bod0_wh, dtype=np.float64) / 1000.0
    safe_b = np.where(b_kwh <= 1e-6, 1e-6, b_kwh)
    ktm = g / safe_b
    return np.clip(ktm, 0.0, 1.0)


def diffuse_fraction_liu_jordan(ktm: ArrayLike) -> ArrayLike:
    """
    Diffuse fraction correlation (Kdm) from OrientSol Bdm0.m:
    Kdm = 1 - (1.13 * Ktm)
    """
    k = np.asarray(ktm, dtype=np.float64)
    kdm = 1.0 - (1.13 * k)
    return np.clip(kdm, 0.0, 1.0)


def decompose_horizontal_radiation(
    gdm0: ArrayLike,
    bod0_wh: ArrayLike
) -> Tuple[ArrayLike, ArrayLike]:
    """
    Decompose global horizontal daily irradiation Gdm(0) into direct beam (Bdm0)
    and diffuse (Ddm0) components [kWh/m²/day].

    Parameters
    ----------
    gdm0 : float or np.ndarray
        Global horizontal irradiation in kWh/m²/day.
    bod0_wh : float or np.ndarray
        Extraterrestrial daily irradiation on horizontal plane in Wh/m²/day.

    Returns
    -------
    Tuple[ArrayLike, ArrayLike]
        (Bdm0, Ddm0) in kWh/m²/day.
    """
    g = np.asarray(gdm0, dtype=np.float64)
    ktm = clearness_index(g, bod0_wh)
    kdm = diffuse_fraction_liu_jordan(ktm)

    ddm0 = kdm * g
    bdm0 = g - ddm0

    if np.ndim(g) == 0:
        return float(bdm0), float(ddm0)
    return bdm0, ddm0


def bdm0(
    val_bod: np.ndarray,
    datos: np.ndarray
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Direct translation of MATLAB function:
    function [Val_Bdm0, Val_Ddm0] = Bdm0(Val_Bod, DATOS)

    Converts MATLAB 1-based indexing to Python 0-based indexing:
    In MATLAB: DATOS(i+2) for i=1:12 corresponds to indices 3:14 in MATLAB,
    which maps to indices [2:14] in Python.

    Parameters
    ----------
    val_bod : np.ndarray
        Array of 12 extraterrestrial radiation values in Wh/m²/day.
    datos : np.ndarray
        Either full DATOS array (26 columns from BBDD.xlsx) or 12-element monthly Gdm0 vector.

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        (Val_Bdm0, Val_Ddm0) arrays of shape (12,) in kWh/m²/day.
    """
    datos_arr = np.asarray(datos, dtype=np.float64)
    if len(datos_arr) == 26:
        gdm0 = datos_arr[2:14]  # Columns B3:AA3 mapping in 0-based indexing
    elif len(datos_arr) == 12:
        gdm0 = datos_arr
    else:
        raise ValueError(f"Expected DATOS of length 12 or 26, got {len(datos_arr)}")

    bod = np.asarray(val_bod, dtype=np.float64)
    val_bdm0, val_ddm0 = decompose_horizontal_radiation(gdm0, bod)
    return val_bdm0, val_ddm0
