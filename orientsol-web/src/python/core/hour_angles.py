"""
Discretization of daylight hours into angular intervals translated from OrientSol MATLAB code.
Original files: Angulos.m and Angulos2.m
"""

from typing import Tuple, Union
import numpy as np
from .conversions import deg2rad


def day_hour_intervals(
    sunset_angle_rad: float
) -> Tuple[int, np.ndarray]:
    """
    Compute daylight hour intervals for a single sunset angle.
    Returns (n_intervals, central_hour_angles_rad).
    """
    step_rad = deg2rad(15.0)  # 15° per hour in radians
    s = -deg2rad(7.5)         # -7.5° starting reference

    cont = float(sunset_angle_rad)
    n = 0
    while cont > step_rad:
        cont -= step_rad
        n += 1

    if n == 0:
        return 0, np.empty(0, dtype=np.float64)

    # Hourly midpoint angles: 7.5°, 22.5°, 37.5°, ... up to n intervals
    angles = s + step_rad * np.arange(1, n + 1, dtype=np.float64)
    return n, angles


def angulos(
    ang_sal1: Union[np.ndarray, list]
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Direct translation of MATLAB function:
    function [numeroN, matriz_angulos] = Angulos(AngSal1)

    Calculates:
    - numeroN: Number of solar hourly intervals from noon for each month (shape: (12,))
    - matriz_angulos: Midpoint hour angles in radians for each interval (shape: (12, max_n))

    Note on Indexing Conversion:
    - MATLAB 1-based months (1..12) -> Python 0-based indices [0..11].
    - MATLAB 1-based intervals (1..n) -> Python 0-based indices [0..n-1].

    Parameters
    ----------
    ang_sal1 : np.ndarray or list
        Array of 12 sunset hour angles in radians.

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        (numeroN, matriz_angulos)
    """
    angles_input = np.asarray(ang_sal1, dtype=np.float64)
    if len(angles_input) != 12:
        raise ValueError(f"Expected 12 monthly sunset angles, got {len(angles_input)}")

    numero_n = np.zeros(12, dtype=np.int32)
    temp_angles_list = []

    for i in range(12):
        n_count, hour_angs = day_hour_intervals(angles_input[i])
        numero_n[i] = n_count
        temp_angles_list.append(hour_angs)

    max_n = int(np.max(numero_n)) if len(numero_n) > 0 and np.max(numero_n) > 0 else 1
    matriz_angulos = np.zeros((12, max_n), dtype=np.float64)

    for i in range(12):
        n = numero_n[i]
        if n > 0:
            matriz_angulos[i, :n] = temp_angles_list[i]

    return numero_n, matriz_angulos


def angulos2(
    ang_salida: np.ndarray
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Direct translation of MATLAB function:
    function [numeroN2, matriz_angulos2] = Angulos2(AngSalida)

    Extends Angulos across all 91 collector inclination angles:
    - numeroN2: shape (12, 91)
    - matriz_angulos2: shape (12, 91, max_n)

    Note on Indexing Conversion:
    - Months: 0..11 (MATLAB 1..12)
    - Inclinations: 0..90 (MATLAB 1..91)
    - Intervals: 0..n-1 (MATLAB 1..n)

    Parameters
    ----------
    ang_salida : np.ndarray
        Array of shape (12, 91) containing sunset hour angles.

    Returns
    -------
    Tuple[np.ndarray, np.ndarray]
        (numeroN2, matriz_angulos2)
    """
    if ang_salida.shape != (12, 91):
        raise ValueError(f"Expected shape (12, 91) for AngSalida, got {ang_salida.shape}")

    numero_n2 = np.zeros((12, 91), dtype=np.int32)
    all_angles = {}

    for i in range(12):
        for k in range(91):
            n_count, hour_angs = day_hour_intervals(ang_salida[i, k])
            numero_n2[i, k] = n_count
            all_angles[(i, k)] = hour_angs

    max_n = int(np.max(numero_n2)) if np.max(numero_n2) > 0 else 1
    matriz_angulos2 = np.zeros((12, 91, max_n), dtype=np.float64)

    for i in range(12):
        for k in range(91):
            n = numero_n2[i, k]
            if n > 0:
                matriz_angulos2[i, k, :n] = all_angles[(i, k)]

    return numero_n2, matriz_angulos2
