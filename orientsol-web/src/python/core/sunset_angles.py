"""
Sunset and Sunrise hour angles translated from OrientSol MATLAB code.
Original file: AngulosSalida.m
"""

from typing import Tuple, Union
import numpy as np
from .constants import CHARACTERISTIC_DAYS
from .conversions import deg2rad
from .declination import solar_declination


def horizontal_sunset_angle(
    lat_rad: float,
    dec_rad: Union[float, np.ndarray]
) -> Union[float, np.ndarray]:
    """
    Calculate sunset hour angle on horizontal surface (omega_s) in radians.
    
    Implements the exact conditions from OrientSol AngulosSalida.m:
    - If |tan(delta)*tan(phi)| < 1: omega_s = acos(-tan(delta)*tan(phi))
    - Else: omega_s = pi (midnight sun)
    - If Northern Hemisphere (phi > 0) with delta < 0 and omega_s == pi -> omega_s = 0 (polar night)
    - If Southern Hemisphere (phi < 0) with delta > 0 and omega_s == pi -> omega_s = 0 (polar night)
    """
    dec = np.asarray(dec_rad, dtype=np.float64)
    tan_product = np.tan(dec) * np.tan(lat_rad)
    
    # Standard formula with clipping threshold
    inside_bounds = np.abs(tan_product) < 1.0
    
    omega_s = np.where(
        inside_bounds,
        np.arccos(np.clip(-tan_product, -1.0, 1.0)),
        np.pi
    )
    
    # Polar night corrections from MATLAB AngulosSalida.m
    if lat_rad > 0:
        polar_night = (dec < 0) & np.isclose(omega_s, np.pi)
        omega_s = np.where(polar_night, 0.0, omega_s)
    elif lat_rad < 0:
        polar_night = (dec > 0) & np.isclose(omega_s, np.pi)
        omega_s = np.where(polar_night, 0.0, omega_s)

    return float(omega_s) if omega_s.ndim == 0 else omega_s


def angulos_salida(
    lat_rad: float,
    dia_inter: Union[np.ndarray, list, None] = None
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Direct translation of MATLAB function:
    function [AngSal1, AngSalida] = AngulosSalida(LAT_RAD, DIA_INTER)

    Calculates:
    - AngSal1: 1D array of shape (12,) containing sunset hour angles on horizontal surface [rad]
    - AngSalida: 2D array of shape (12, 91) containing sunset hour angles for collector
      inclinations from 1° to 91° [rad].

    Note on Indexing Conversion:
    - MATLAB 1-based months (1..12) -> Python 0-based indices [0..11].
    - MATLAB 1-based inclinations (1..91) -> Python 0-based indices [0..90].

    Parameters
    ----------
    lat_rad : float
        Latitude in radians.
    dia_inter : np.ndarray or list, optional
        Array of 12 characteristic days (defaults to CHARACTERISTIC_DAYS).

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        (AngSal1, AngSalida)
    """
    if dia_inter is None:
        dia_inter = CHARACTERISTIC_DAYS
    else:
        dia_inter = np.asarray(dia_inter, dtype=np.float64)

    # 1. Build inclinations vector from 1° to 91° (matching MATLAB exactly)
    # MATLAB:
    #   if LAT_RAD < 0: n = n + (-1*2*pi/360)
    #   else: n = n + (1*2*pi/360)
    step_rad = deg2rad(1.0)
    if lat_rad < 0:
        inclinaciones = -step_rad * np.arange(1, 92, dtype=np.float64)
    else:
        inclinaciones = step_rad * np.arange(1, 92, dtype=np.float64)

    # 2. Declinations for each of the 12 characteristic days
    dec_rad = np.asarray(solar_declination(dia_inter, in_radians=True), dtype=np.float64)

    # 3. Compute AngSal1 (horizontal surface)
    ang_sal1 = np.zeros(12, dtype=np.float64)
    for j in range(12):
        ang_sal1[j] = horizontal_sunset_angle(lat_rad, dec_rad[j])

    # 4. Compute AngSal2 for each month and each inclination angle (12 x 91)
    # MATLAB: resultado = acos(-tan(dec_rad)*tan(LAT_RAD-inclinaciones(z)))
    ang_sal2 = np.zeros((12, 91), dtype=np.float64)
    for j in range(12):
        effective_lat = lat_rad - inclinaciones
        arg = -np.tan(dec_rad[j]) * np.tan(effective_lat)
        # Using real part of arccos for complex returns to match MATLAB acos()
        ang_sal2[j, :] = np.real(np.arccos(arg.astype(np.complex128)))

    # 5. Compute AngSalida = min(AngSal1, AngSal2)
    # MATLAB:
    #   AngSalida(u,v) = AngSal1(u);
    #   if AngSal2(u,v) < AngSal1(u): AngSalida(u,v) = AngSal2(u,v)
    ang_salida = np.minimum(ang_sal1[:, np.newaxis], ang_sal2)

    return ang_sal1, ang_salida
