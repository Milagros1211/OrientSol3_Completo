"""
Simplified Photovoltaic Energy Model translated from OrientSol MATLAB code.
Original file: Energia.m
"""

from typing import Dict, Union
import numpy as np

# Standard days per month for non-leap year
DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)


def calculate_simplified_energy(
    gdm_evaluated: Union[np.ndarray, list, float],
    gdm_horizontal: Union[np.ndarray, list, float],
    peak_power_kw: float,
    performance_ratio: float = 0.80,
) -> Dict[str, Union[float, np.ndarray]]:
    """
    Direct translation of MATLAB function in Energia.m:
        ENERGIA = RADIACION * POTENCIA * 365 * PR;
        ENERGIA_0 = RADIACION_0 * POTENCIA * 365 * PR;
        DIFERENCIA = ENERGIA - ENERGIA_0;

    Parameters
    ----------
    gdm_evaluated : array_like or float
        Daily global radiation for evaluated configuration [kWh/m²/day].
        Can be a scalar (annual mean) or a 12-element array (monthly means).
    gdm_horizontal : array_like or float
        Daily global radiation for horizontal surface [kWh/m²/day].
    peak_power_kw : float
        Installed PV peak power P_STC [kWp] (must be positive).
    performance_ratio : float, default 0.80
        System Performance Ratio PR (0.0 to 1.0).

    Returns
    -------
    dict
        Annual energies, monthly breakdown (if vectors provided), and net gains.
    """
    if peak_power_kw < 0:
        raise ValueError("Peak power must be positive.")
    if not (0.0 <= performance_ratio <= 1.0):
        raise ValueError("Performance ratio PR must be between 0.0 and 1.0.")

    g_eval = np.asarray(gdm_evaluated, dtype=np.float64)
    g_horiz = np.asarray(gdm_horizontal, dtype=np.float64)

    mean_eval = float(np.mean(g_eval))
    mean_horiz = float(np.mean(g_horiz))

    annual_energy_eval = mean_eval * peak_power_kw * 365.0 * performance_ratio
    annual_energy_horiz = mean_horiz * peak_power_kw * 365.0 * performance_ratio
    annual_gain_kwh = annual_energy_eval - annual_energy_horiz
    annual_gain_pct = ((annual_energy_eval - annual_energy_horiz) / (annual_energy_horiz if annual_energy_horiz > 0 else 1.0)) * 100.0

    result: Dict[str, Union[float, np.ndarray]] = {
        "model": "simplified_pr",
        "peak_power_kw": peak_power_kw,
        "performance_ratio": performance_ratio,
        "mean_daily_eval_kwh_m2": mean_eval,
        "mean_daily_horiz_kwh_m2": mean_horiz,
        "annual_energy_eval_kwh": annual_energy_eval,
        "annual_energy_horiz_kwh": annual_energy_horiz,
        "annual_gain_kwh": annual_gain_kwh,
        "annual_gain_pct": annual_gain_pct,
    }

    # Monthly breakdown if 12 monthly values are provided
    if g_eval.ndim == 1 and len(g_eval) == 12:
        monthly_eval_kwh = g_eval * peak_power_kw * DAYS_PER_MONTH * performance_ratio
        monthly_horiz_kwh = g_horiz * peak_power_kw * DAYS_PER_MONTH * performance_ratio
        monthly_gain_kwh = monthly_eval_kwh - monthly_horiz_kwh
        monthly_gain_pct = np.where(monthly_horiz_kwh > 0, ((monthly_eval_kwh / monthly_horiz_kwh) - 1.0) * 100.0, 0.0)

        result.update({
            "monthly_energy_eval_kwh": monthly_eval_kwh,
            "monthly_energy_horiz_kwh": monthly_horiz_kwh,
            "monthly_gain_kwh": monthly_gain_kwh,
            "monthly_gain_pct": monthly_gain_pct,
        })

    return result
