"""Angle and date conversion utilities for OrientSol."""

from typing import Tuple, Union
import numpy as np
from .constants import DAYS_IN_MONTH

ArrayLike = Union[float, int, np.ndarray]


def deg2rad(deg: ArrayLike) -> ArrayLike:
    """Convert degrees to radians using OrientSol standard (deg * 2*pi / 360)."""
    return np.asarray(deg, dtype=np.float64) * (np.pi / 180.0)


def rad2deg(rad: ArrayLike) -> ArrayLike:
    """Convert radians to degrees."""
    return np.asarray(rad, dtype=np.float64) * (180.0 / np.pi)


def date_to_day_of_year(day: int, month: int) -> int:
    """
    Convert a calendar date (day of month, month 1-12) to the day of the year (n in [1, 365]).
    Uses the standard non-leap calendar adopted in OrientSol.
    """
    if not (1 <= month <= 12):
        raise ValueError(f"Month must be between 1 and 12, got {month}")
    max_days = int(DAYS_IN_MONTH[month - 1])
    if not (1 <= day <= max_days):
        raise ValueError(f"Day must be between 1 and {max_days} for month {month}, got {day}")

    cumulative_offsets = np.concatenate(([0], np.cumsum(DAYS_IN_MONTH)[:-1]))
    return int(cumulative_offsets[month - 1] + day)


def day_of_year_to_date(day_of_year: int) -> Tuple[int, int]:
    """
    Convert day of year (n in [1, 365]) to (day, month).
    """
    if not (1 <= day_of_year <= 365):
        raise ValueError(f"Day of year must be between 1 and 365, got {day_of_year}")

    cumulative = np.cumsum(DAYS_IN_MONTH)
    month_idx = int(np.searchsorted(cumulative, day_of_year))
    prev_days = 0 if month_idx == 0 else int(cumulative[month_idx - 1])
    day = day_of_year - prev_days
    return day, month_idx + 1
