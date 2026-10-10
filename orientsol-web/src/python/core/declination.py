"""
Solar Declination calculations translated from OrientSol MATLAB code.
Original file: matriz_declinacion.m
"""

from typing import Union
import numpy as np
from .constants import CHARACTERISTIC_DAYS
from .conversions import deg2rad


def solar_declination(
    day_of_year: Union[int, float, np.ndarray],
    in_radians: bool = True
) -> Union[float, np.ndarray]:
    """
    Calculate solar declination angle (delta) using Cooper's formula (Cooper, 1969),
    as implemented in OrientSol's matriz_declinacion.m:
    
        dec_deg = 23.45 * sin(2 * pi * (n + 284) / 365)
        dec_rad = dec_deg * (2 * pi / 360)

    Parameters
    ----------
    day_of_year : int, float, or np.ndarray
        Day of the year n (1 to 365).
    in_radians : bool, optional
        If True (default), returns declination in radians. If False, returns in degrees.

    Returns
    -------
    float or np.ndarray
        Solar declination angle.
    """
    n = np.asarray(day_of_year, dtype=np.float64)
    # Cooper formula (degrees)
    dec_deg = 23.45 * np.sin(2.0 * np.pi * (n + 284.0) / 365.0)
    
    if in_radians:
        dec_rad = deg2rad(dec_deg)
        return float(dec_rad) if dec_rad.ndim == 0 else dec_rad
    return float(dec_deg) if dec_deg.ndim == 0 else dec_deg


def matriz_declinacion(
    dia_inter: Union[np.ndarray, list, None] = None
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function decli_result = matriz_declinacion(DIA_INTER)

    Computes monthly solar declination in radians for the 12 characteristic days.
    Converts MATLAB 1-based indexing [1..12] to Python 0-based indexing [0..11].

    Parameters
    ----------
    dia_inter : np.ndarray or list, optional
        Array of 12 characteristic days. Defaults to CHARACTERISTIC_DAYS:
        [17, 46, 75, 105, 135, 161, 198, 229, 259, 289, 319, 344]

    Returns
    -------
    np.ndarray
        1D array of 12 declination values in radians (float64).
    """
    if dia_inter is None:
        dia_inter = CHARACTERISTIC_DAYS
    else:
        dia_inter = np.asarray(dia_inter, dtype=np.float64)

    return np.asarray(solar_declination(dia_inter, in_radians=True), dtype=np.float64)
