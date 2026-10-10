"""Solar physical constants and characteristic days as defined in OrientSol."""

import numpy as np

# Solar Constant [W/m²]
SOLAR_CONSTANT_GSC = 1367.0

# Characteristic average days of the year (n) for each of the 12 months (OrientSol DIA_INTER)
# Jan 17, Feb 15, Mar 16, Apr 15, May 15, Jun 10, Jul 17, Aug 17, Sep 16, Oct 16, Nov 15, Dec 10
CHARACTERISTIC_DAYS = np.array(
    [17, 46, 75, 105, 135, 161, 198, 229, 259, 289, 319, 344],
    dtype=np.int32,
)

DAYS_IN_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)

MONTH_NAMES_ES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]
