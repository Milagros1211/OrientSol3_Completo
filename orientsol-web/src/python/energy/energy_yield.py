"""
Comprehensive Solar Energy Yield Module for OrientSol 3.0.
Calculates:
1. Energía Recibida (Incident Solar Resource on Collector Aperture)
2. Energía Producida (Photovoltaic Electricity Yield via Simplified and Osterwald Models)
3. Thermal and System Balance Losses

References:
- Energia.m
- Energia_Osterwald.m
- Energia_Osterwald_N.m
"""

from typing import Dict, List, Union
import numpy as np

DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)


def calculate_energy_yield(
    gdm_daily_kwh: Union[np.ndarray, List[float]],
    gdm_horizontal_kwh: Union[np.ndarray, List[float]],
    ambient_temp_c: Union[np.ndarray, List[float]],
    peak_power_kw: float = 5.0,
    performance_ratio: float = 0.80,
    temp_coefficient: float = -0.004,
    tonc: float = 47.0,
    module_efficiency: float = 0.20,
    surface_name: str = "superficie",
) -> Dict[str, Union[float, np.ndarray, Dict[str, Union[float, np.ndarray]]]]:
    """
    Computes complete solar energy balance:
    - Energía Recibida (kWh/m² and kWh over module area)
    - Energía Producida (Simplified PR model & Osterwald thermal model)
    - Cell temperatures & thermal losses
    """
    g_eval = np.asarray(gdm_daily_kwh, dtype=np.float64)
    g_horiz = np.asarray(gdm_horizontal_kwh, dtype=np.float64)
    t_amb = np.asarray(ambient_temp_c, dtype=np.float64)

    if len(g_eval) != 12 or len(g_horiz) != 12 or len(t_amb) != 12:
        raise ValueError("Inputs must have 12 monthly values.")

    # 1. ENERGÍA RECIBIDA (Solar Incident Irradiation)
    # Monthly incident irradiation [kWh/m²/month]
    h_monthly_kwh_m2 = g_eval * DAYS_PER_MONTH
    h_annual_kwh_m2 = float(np.sum(h_monthly_kwh_m2))

    # Collector aperture area from peak power: Area [m²] = P_peak / (G_stc * eta) = P_peak [kW] * 1000 / (1000 * eta)
    collector_area_m2 = float((peak_power_kw * 1000.0) / (1000.0 * module_efficiency))

    # Total incident solar energy over aperture [kWh/year]
    total_energy_received_kwh = float(h_annual_kwh_m2 * collector_area_m2)
    monthly_energy_received_kwh = h_monthly_kwh_m2 * collector_area_m2

    # 2. ENERGÍA PRODUCIDA - MODELO SIMPLIFICADO
    # Energia = Radiacion_Media * Potencia * 365 * PR
    mean_g_daily = float(np.mean(g_eval))
    energy_produced_simplified_kwh = float(mean_g_daily * peak_power_kw * 365.0 * performance_ratio)
    monthly_produced_simplified_kwh = g_eval * DAYS_PER_MONTH * peak_power_kw * performance_ratio

    # 3. ENERGÍA PRODUCIDA - MODELO OSTERWALD TÉRMICO
    # Equivalent continuous irradiance in W/m²
    g_wm2 = g_eval * (1000.0 / 24.0)
    g_wm2_horiz = g_horiz * (1000.0 / 24.0)

    # Operating cell temperature
    tonc_factor = (tonc - 20.0) / 800.0
    tc_monthly = t_amb + (tonc_factor * g_wm2)
    tc_horiz = t_amb + (tonc_factor * g_wm2_horiz)

    # Thermal derate factor: 1 + gamma * (Tc - 25)
    thermal_derate = 1.0 + (temp_coefficient * (tc_monthly - 25.0))
    thermal_derate_horiz = 1.0 + (temp_coefficient * (tc_horiz - 25.0))

    # Osterwald daily and monthly energy
    # P_daily = P_peak * G_eval * thermal_derate
    e_daily_osterwald = peak_power_kw * g_eval * thermal_derate * performance_ratio
    e_monthly_osterwald = e_daily_osterwald * DAYS_PER_MONTH
    energy_produced_osterwald_kwh = float(np.sum(e_monthly_osterwald))

    # Theoretical STC production (without thermal penalty)
    e_stc_nominal_monthly = peak_power_kw * g_eval * DAYS_PER_MONTH * performance_ratio
    e_stc_nominal_annual = float(np.sum(e_stc_nominal_monthly))

    # Thermal loss in kWh and %
    thermal_loss_kwh = float(e_stc_nominal_annual - energy_produced_osterwald_kwh)
    thermal_loss_pct = float((thermal_loss_kwh / e_stc_nominal_annual) * 100.0) if e_stc_nominal_annual > 0 else 0.0

    # System effective conversion efficiency
    effective_system_efficiency = float((energy_produced_osterwald_kwh / total_energy_received_kwh) * 100.0) if total_energy_received_kwh > 0 else 0.0

    return {
        "surface_name": surface_name,
        "peak_power_kw": peak_power_kw,
        "collector_area_m2": round(collector_area_m2, 2),
        "module_efficiency_stc_pct": round(module_efficiency * 100.0, 1),

        # Energía Recibida
        "recibida": {
            "mean_daily_kwh_m2": round(mean_g_daily, 3),
            "monthly_kwh_m2": [round(float(v), 2) for v in h_monthly_kwh_m2],
            "annual_kwh_m2": round(h_annual_kwh_m2, 1),
            "monthly_total_kwh": [round(float(v), 1) for v in monthly_energy_received_kwh],
            "annual_total_kwh": round(total_energy_received_kwh, 1),
        },

        # Energía Producida
        "producida": {
            "simplified": {
                "monthly_kwh": [round(float(v), 1) for v in monthly_produced_simplified_kwh],
                "annual_kwh": round(energy_produced_simplified_kwh, 1),
                "specific_yield_kwh_kwp": round(energy_produced_simplified_kwh / peak_power_kw, 1),
            },
            "osterwald": {
                "monthly_kwh": [round(float(v), 1) for v in e_monthly_osterwald],
                "annual_kwh": round(energy_produced_osterwald_kwh, 1),
                "specific_yield_kwh_kwp": round(energy_produced_osterwald_kwh / peak_power_kw, 1),
                "stc_nominal_annual_kwh": round(e_stc_nominal_annual, 1),
                "thermal_loss_kwh": round(thermal_loss_kwh, 1),
                "thermal_loss_pct": round(thermal_loss_pct, 2),
                "mean_cell_temp_c": round(float(np.mean(tc_monthly)), 1),
                "max_cell_temp_c": round(float(np.max(tc_monthly)), 1),
                "min_cell_temp_c": round(float(np.min(tc_monthly)), 1),
                "monthly_cell_temp_c": [round(float(v), 1) for v in tc_monthly],
            },
            "effective_system_efficiency_pct": round(effective_system_efficiency, 2),
        },
    }
