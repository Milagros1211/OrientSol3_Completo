"""
Osterwald Photovoltaic Thermal & Energy Model translated from OrientSol MATLAB code.
Original files:
- Energia_Osterwald.m
- Energia_Osterwald_N.m
"""

from typing import Dict, Union
import numpy as np

DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)


def calculate_osterwald_energy(
    gdm_evaluated: Union[np.ndarray, list],
    gdm_horizontal: Union[np.ndarray, list],
    ambient_temperature: Union[np.ndarray, list],
    peak_power_kw: float,
    temp_coefficient: float = -0.004,
    tonc: float = 47.0,
) -> Dict[str, Union[float, np.ndarray]]:
    """
    Direct translation of OrientSol Osterwald model:

    1. Equivalent Irradiance [W/m²]:
       G = Gdm * (1000 / 24)

    2. Cell Operating Temperature [°C]:
       Tc = Temp_amb + (((TONC - 20) / 800) * G)

    3. Power Output [W]:
       P = (P_peak * 1000) * (G / 1000) * [1 + gamma * (Tc - 25)]

    4. Daily Energy [kWh/day]:
       E_daily = (P * 24) / 1000 = P_peak * Gdm * [1 + gamma * (Tc - 25)]

    5. Monthly Energy [kWh/month]:
       E_mes = E_daily * dias_mes

    6. Annual Energy [kWh/year]:
       E_anual = sum(E_mes)

    Parameters
    ----------
    gdm_evaluated : array_like (shape: (12,))
        Monthly daily global radiation for evaluated system [kWh/m²/day].
    gdm_horizontal : array_like (shape: (12,))
        Monthly daily global radiation on horizontal surface [kWh/m²/day].
    ambient_temperature : array_like (shape: (12,))
        Monthly mean ambient temperatures [°C].
    peak_power_kw : float
        Installed PV peak power [kWp] (P_peak >= 0).
    temp_coefficient : float, default -0.004
        Power temperature coefficient gamma [1/°C] (typically -0.005 to -0.003).
    tonc : float, default 47.0
        Nominal Operating Cell Temperature NOCT / TONC [°C] (typically 40 to 55°C).

    Returns
    -------
    dict
        Monthly and annual energy yields, cell temperatures, and comparative gains.
    """
    if peak_power_kw < 0:
        raise ValueError("Peak power must be positive.")
    if not (-0.006 <= temp_coefficient <= -0.002):
        # OrientSol warning threshold: [-0.005, -0.003]
        pass
    if not (35.0 <= tonc <= 60.0):
        # OrientSol warning threshold: [40, 55]
        pass

    g_eval = np.asarray(gdm_evaluated, dtype=np.float64)
    g_horiz = np.asarray(gdm_horizontal, dtype=np.float64)
    t_amb = np.asarray(ambient_temperature, dtype=np.float64)

    if len(g_eval) != 12 or len(g_horiz) != 12 or len(t_amb) != 12:
        raise ValueError("All radiation and temperature inputs must have 12 monthly values.")

    # 1. Equivalent Irradiances in W/m²
    g_wm2_eval = g_eval * (1000.0 / 24.0)
    g_wm2_horiz = g_horiz * (1000.0 / 24.0)

    # 2. Cell Operating Temperatures in °C
    tonc_factor = (tonc - 20.0) / 800.0
    tc_eval = t_amb + (tonc_factor * g_wm2_eval)
    tc_horiz = t_amb + (tonc_factor * g_wm2_horiz)

    # 3. Monthly Daily Power / Daily Energies in kWh/day
    # P (W) = (peak_power_kw * 1000) * (G / 1000) * (1 + gamma * (Tc - 25))
    # E_daily (kWh/day) = P * 24 / 1000
    thermal_derate_eval = 1.0 + (temp_coefficient * (tc_eval - 25.0))
    thermal_derate_horiz = 1.0 + (temp_coefficient * (tc_horiz - 25.0))

    e_daily_eval = peak_power_kw * g_eval * thermal_derate_eval
    e_daily_horiz = peak_power_kw * g_horiz * thermal_derate_horiz

    # 4. Monthly Energies in kWh/month
    e_mes_eval = e_daily_eval * DAYS_PER_MONTH
    e_mes_horiz = e_daily_horiz * DAYS_PER_MONTH

    # 5. Annual Energies in kWh/year
    e_anual_eval = float(np.sum(e_mes_eval))
    e_anual_horiz = float(np.sum(e_mes_horiz))

    # 6. Gains vs Horizontal
    gain_mes_kwh = e_mes_eval - e_mes_horiz
    gain_mes_pct = np.where(e_mes_horiz > 0, ((e_mes_eval / e_mes_horiz) - 1.0) * 100.0, 0.0)

    gain_anual_kwh = e_anual_eval - e_anual_horiz
    gain_anual_pct = ((e_anual_eval - e_anual_horiz) / (e_anual_horiz if e_anual_horiz > 0 else 1.0)) * 100.0

    return {
        "model": "osterwald_thermal",
        "peak_power_kw": peak_power_kw,
        "temp_coefficient": temp_coefficient,
        "tonc_degc": tonc,
        "mean_ambient_temp_degc": float(np.mean(t_amb)),
        "mean_cell_temp_eval_degc": float(np.mean(tc_eval)),
        "mean_cell_temp_horiz_degc": float(np.mean(tc_horiz)),
        "cell_temp_eval_monthly": tc_eval,
        "cell_temp_horiz_monthly": tc_horiz,
        "monthly_energy_eval_kwh": e_mes_eval,
        "monthly_energy_horiz_kwh": e_mes_horiz,
        "annual_energy_eval_kwh": e_anual_eval,
        "annual_energy_horiz_kwh": e_anual_horiz,
        "gain_monthly_kwh": gain_mes_kwh,
        "gain_monthly_pct": gain_mes_pct,
        "gain_annual_kwh": gain_anual_kwh,
        "gain_annual_pct": gain_anual_pct,
    }
