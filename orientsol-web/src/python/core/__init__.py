"""
Solar Geometry and Astronomy Core Module for OrientSol.

Provides translations of MATLAB lowest-level functions:
- matriz_declinacion.m -> matriz_declinacion, solar_declination
- AngulosSalida.m      -> angulos_salida, horizontal_sunset_angle
- Angulos.m            -> angulos, day_hour_intervals
- Angulos2.m           -> angulos2
- Altura_Solar.m       -> altura_solar, solar_altitude
- Azimut_Solar.m       -> azimut_solar, solar_azimuth
- Calulo_Beta_2Ejes.m  -> calculo_beta_2ejes, dual_axis_tilt
"""

from .constants import (
    SOLAR_CONSTANT_GSC,
    CHARACTERISTIC_DAYS,
    DAYS_IN_MONTH,
    MONTH_NAMES_ES,
)
from .conversions import (
    deg2rad,
    rad2deg,
    date_to_day_of_year,
    day_of_year_to_date,
)
from .declination import (
    solar_declination,
    matriz_declinacion,
)
from .sunset_angles import (
    horizontal_sunset_angle,
    angulos_salida,
)
from .hour_angles import (
    day_hour_intervals,
    angulos,
    angulos2,
)
from .solar_position import (
    solar_altitude,
    solar_azimuth,
    dual_axis_tilt,
    altura_solar,
    azimut_solar,
    calculo_beta_2ejes,
)

__all__ = [
    "SOLAR_CONSTANT_GSC",
    "CHARACTERISTIC_DAYS",
    "DAYS_IN_MONTH",
    "MONTH_NAMES_ES",
    "deg2rad",
    "rad2deg",
    "date_to_day_of_year",
    "day_of_year_to_date",
    "solar_declination",
    "matriz_declinacion",
    "horizontal_sunset_angle",
    "angulos_salida",
    "day_hour_intervals",
    "angulos",
    "angulos2",
    "solar_altitude",
    "solar_azimuth",
    "dual_axis_tilt",
    "altura_solar",
    "azimut_solar",
    "calculo_beta_2ejes",
]
