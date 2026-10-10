"""
Extraterrestrial solar radiation on horizontal surfaces translated from OrientSol MATLAB code.
Original file: Bod0.m
"""

from typing import Union
import numpy as np
try:
    from core.constants import SOLAR_CONSTANT_GSC, CHARACTERISTIC_DAYS
    from core.conversions import deg2rad
    from core.declination import matriz_declinacion
    from core.sunset_angles import angulos_salida
except (ImportError, ValueError):
    from core.constants import SOLAR_CONSTANT_GSC, CHARACTERISTIC_DAYS
    from core.conversions import deg2rad
    from core.declination import matriz_declinacion
    from core.sunset_angles import angulos_salida

ArrayLike = Union[float, int, np.ndarray]


def eccentricity_factor(day_of_year: ArrayLike) -> ArrayLike:
    """
    Earth orbit eccentricity correction factor e0:
    e0 = 1 + 0.033 * cos(2 * pi * n / 365)
    """
    n = np.asarray(day_of_year, dtype=np.float64)
    return 1.0 + 0.033 * np.cos(2.0 * np.pi * n / 365.0)


def extraterrestrial_daily_radiation(
    lat_rad: float,
    dec_rad: ArrayLike,
    sunset_angle_rad: ArrayLike,
    day_of_year: ArrayLike,
    solar_constant: float = SOLAR_CONSTANT_GSC,
) -> ArrayLike:
    """
    Calculate daily extraterrestrial solar irradiation on horizontal plane [Wh/m²/day].

    Formula from OrientSol Bod0.m:
        e0 = 1 + 0.033 * cos(2 * pi * n / 365)
        Bod0 = (24 / pi) * B0 * e0 * cos(phi) * cos(delta) * (sin(omega_s) - omega_s * cos(omega_s))

    Parameters
    ----------
    lat_rad : float
        Latitude in radians.
    dec_rad : float or np.ndarray
        Solar declination in radians.
    sunset_angle_rad : float or np.ndarray
        Sunset hour angle on horizontal surface in radians (omega_s).
    day_of_year : int, float, or np.ndarray
        Day of the year n (1-365).
    solar_constant : float, optional
        Solar constant in W/m² (default: 1367.0 W/m²).

    Returns
    -------
    float or np.ndarray
        Daily extraterrestrial irradiation in Wh/m²/day.
    """
    e0 = eccentricity_factor(day_of_year)
    dec = np.asarray(dec_rad, dtype=np.float64)
    ws = np.asarray(sunset_angle_rad, dtype=np.float64)

    cos_lat = np.cos(lat_rad)
    cos_dec = np.cos(dec)
    geometric_term = np.sin(ws) - (ws * np.cos(ws))

    bod0 = (24.0 / np.pi) * solar_constant * e0 * cos_lat * cos_dec * geometric_term
    
    # Clip negative values if polar night occurs
    bod0 = np.maximum(bod0, 0.0)
    return float(bod0) if np.ndim(bod0) == 0 else bod0


def bod0(
    dia_inter: Union[np.ndarray, list, None] = None,
    lat_rad: float = 0.0,
    val_decli: Union[np.ndarray, list, None] = None,
    ang_sal1: Union[np.ndarray, list, None] = None,
) -> np.ndarray:
    """
    Direct translation of MATLAB function:
    function Val_Bod = Bod0(DIA_INTER, LAT_RAD, Val_decli, AngSal1)

    Calculates monthly extraterrestrial radiation on horizontal plane for 12 months [Wh/m²/day].
    Converts MATLAB 1-based indexing (1..12) to Python 0-based indexing [0..11].

    Parameters
    ----------
    dia_inter : np.ndarray or list, optional
        12 characteristic days (defaults to CHARACTERISTIC_DAYS).
    lat_rad : float
        Latitude in radians.
    val_decli : np.ndarray or list, optional
        12 declination angles in radians (auto-calculated if None).
    ang_sal1 : np.ndarray or list, optional
        12 sunset hour angles in radians (auto-calculated if None).

    Returns
    -------
    np.ndarray
        Array of shape (12,) containing Bod0 values in Wh/m²/day.
    """
    if dia_inter is None:
        dia_inter = CHARACTERISTIC_DAYS
    else:
        dia_inter = np.asarray(dia_inter, dtype=np.float64)

    if val_decli is None:
        val_decli = matriz_declinacion(dia_inter)
    else:
        val_decli = np.asarray(val_decli, dtype=np.float64)

    if ang_sal1 is None:
        ang_sal1, _ = angulos_salida(lat_rad, dia_inter)
    else:
        ang_sal1 = np.asarray(ang_sal1, dtype=np.float64)

    return np.asarray(
        extraterrestrial_daily_radiation(
            lat_rad=lat_rad,
            dec_rad=val_decli,
            sunset_angle_rad=ang_sal1,
            day_of_year=dia_inter,
            solar_constant=SOLAR_CONSTANT_GSC,
        ),
        dtype=np.float64,
    )
