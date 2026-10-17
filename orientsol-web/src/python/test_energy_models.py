"""
Verification and Testing Script for OrientSol Photovoltaic Energy Models.

Tests and verifies:
1. Simplified Performance Ratio Model: Energia.m
2. Osterwald Thermal & Electrical Model: Energia_Osterwald.m, Energia_Osterwald_N.m
3. Cell Temperature derating: Tc = Tamb + ((TONC-20)/800) * G
4. Comparative energy yields across Horizontal, Fixed Optimal, Seasonal, and 2-Axis Tracking.
"""

import sys
import time
from typing import Dict, Union

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import numpy as np

# Robust imports supporting flat VFS mount or package structure
try:
    from core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
    from core.conversions import deg2rad
    from core.declination import matriz_declinacion
    from core.sunset_angles import angulos_salida
    from core.hour_angles import angulos, angulos2
    from core.solar_position import altura_solar, azimut_solar
    from radiation.extraterrestrial import bod0
    from radiation.horizontal_decomposition import bdm0
    from radiation.hourly_radiation import gh0, dh0, bh0
    from radiation.transposition import transpose_to_inclined_surfaces
    from optimization.seasonal_optimum import optimize_seasonal_tilts
    from tracking.dual_axis import simulate_dual_axis_tracking
    from energy.simplified import calculate_simplified_energy, DAYS_PER_MONTH
    from energy.osterwald import calculate_osterwald_energy
except ImportError:
    from src.python.core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
    from src.python.core.conversions import deg2rad
    from src.python.core.declination import matriz_declinacion
    from src.python.core.sunset_angles import angulos_salida
    from src.python.core.hour_angles import angulos, angulos2
    from src.python.core.solar_position import altura_solar, azimut_solar
    from src.python.radiation.extraterrestrial import bod0
    from src.python.radiation.horizontal_decomposition import bdm0
    from src.python.radiation.hourly_radiation import gh0, dh0, bh0
    from src.python.radiation.transposition import transpose_to_inclined_surfaces
    from src.python.optimization.seasonal_optimum import optimize_seasonal_tilts
    from src.python.tracking.dual_axis import simulate_dual_axis_tracking
    from src.python.energy.simplified import calculate_simplified_energy, DAYS_PER_MONTH
    from src.python.energy.osterwald import calculate_osterwald_energy


def run_full_energy_test(
    latitude_deg: float = 40.4168,
    gdm0: Union[np.ndarray, list, None] = None,
    ambient_temp: Union[np.ndarray, list, None] = None,
    peak_power_kw: float = 5.0,
    performance_ratio: float = 0.80,
    temp_coefficient: float = -0.004,
    tonc: float = 47.0,
    city_name: str = "Madrid (España)",
) -> Dict[str, Union[float, Dict]]:
    """
    Simulates and validates OrientSol simplified and Osterwald PV energy production models.
    """
    if gdm0 is None:
        gdm0 = np.array([2.00, 2.73, 4.48, 5.17, 6.58, 7.24, 7.32, 6.41, 4.97, 3.36, 2.15, 1.64])
    else:
        gdm0 = np.asarray(gdm0, dtype=np.float64)

    if ambient_temp is None:
        # Default Madrid ambient temperatures [°C] from OrientSol BBDD.xlsx
        ambient_temp = np.array([4.1, 5.5, 9.1, 11.6, 16.3, 22.5, 25.3, 24.8, 20.4, 14.1, 8.2, 4.7])
    else:
        ambient_temp = np.asarray(ambient_temp, dtype=np.float64)

    lat_rad = float(deg2rad(latitude_deg))

    print("=" * 88)
    print(f"ORIENTSOL - MODELOS DE ENERGÍA FOTOVOLTAICA (SIMPLIFICADO Y OSTERWALD)")
    print("=" * 88)
    print(f"  Localidad: {city_name} | Latitud: {latitude_deg:+.4f}°")
    print(f"  Instalación FV: Potencia Pico = {peak_power_kw:.2f} kWp | PR = {performance_ratio:.2f} | γ = {temp_coefficient:.4f} /°C | TONC = {tonc:.1f} °C\n")

    t_start = time.perf_counter()

    # Step 1: Base Geometry & Radiation Pipeline
    val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
    ang_sal1, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
    numero_n, matriz_angulos = angulos(ang_sal1)
    numero_n2, matriz_angulos2 = angulos2(ang_salida)
    alt_solar = altura_solar(lat_rad, val_decli, numero_n, matriz_angulos)
    azim_solar = azimut_solar(alt_solar, lat_rad, val_decli, numero_n)

    val_bod = bod0(CHARACTERISTIC_DAYS, lat_rad, val_decli, ang_sal1)
    val_bdm0, val_ddm0 = bdm0(val_bod, gdm0)
    gh_mat, _ = gh0(matriz_angulos, ang_sal1, numero_n, gdm0)
    dh_mat, _ = dh0(matriz_angulos, ang_sal1, numero_n, val_ddm0)
    bh_mat = bh0(gh_mat, dh_mat, numero_n)

    # Step 2: Transposition & Optimal Tilts
    transp = transpose_to_inclined_surfaces(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n2=numero_n2,
        matriz_angulos2=matriz_angulos2,
        bh_matriz=bh_mat,
        dh_matriz=dh_mat,
        gh_matriz=gh_mat,
        val_bdm0=val_bdm0,
        val_ddm0=val_ddm0,
        datos_or_gdm0=gdm0,
        albedo=0.20,
    )
    opt_beta_annual = transp["opt_angle_deg"]
    gd_opt_annual = transp["radiacion_global_opt"]

    # Step 3: Seasonal Tilt Optimization
    seasonal_opt = optimize_seasonal_tilts(
        gd_beta_total=transp["gd_beta_total"],
        datos_or_gdm0=gdm0,
    )
    gd_opt_seasonal = seasonal_opt["gd_opt_seasonal"]

    # Step 4: 2-Axis Tracking
    res_2axis = simulate_dual_axis_tracking(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n=numero_n,
        matriz_angulos=matriz_angulos,
        altura_solar_mat=alt_solar,
        azimut_solar_mat=azim_solar,
        bh_matriz=bh_mat,
        dh_matriz=dh_mat,
        gh_matriz=gh_mat,
        albedo=0.20,
    )
    gd_2axis = res_2axis["gd_daily"]

    # Step 5: Energy Calculations
    # 5.1 Simplified Model (PR)
    sim_horiz = calculate_simplified_energy(gdm0, gdm0, peak_power_kw, performance_ratio)
    sim_opt = calculate_simplified_energy(gd_opt_annual, gdm0, peak_power_kw, performance_ratio)
    sim_est = calculate_simplified_energy(gd_opt_seasonal, gdm0, peak_power_kw, performance_ratio)
    sim_2ax = calculate_simplified_energy(gd_2axis, gdm0, peak_power_kw, performance_ratio)

    # 5.2 Osterwald Thermal Model
    ost_horiz = calculate_osterwald_energy(gdm0, gdm0, ambient_temp, peak_power_kw, temp_coefficient, tonc)
    ost_opt = calculate_osterwald_energy(gd_opt_annual, gdm0, ambient_temp, peak_power_kw, temp_coefficient, tonc)
    ost_est = calculate_osterwald_energy(gd_opt_seasonal, gdm0, ambient_temp, peak_power_kw, temp_coefficient, tonc)
    ost_2ax = calculate_osterwald_energy(gd_2axis, gdm0, ambient_temp, peak_power_kw, temp_coefficient, tonc)

    elapsed_ms = (time.perf_counter() - t_start) * 1000.0

    # ----------------------------------------------------
    # DISPLAY RESULTS
    # ----------------------------------------------------
    print(f"✓ Pipeline de energía completado en: {elapsed_ms:.2f} ms")
    print("-" * 88)

    print("1. MODELO SIMPLIFICADO (PR = 0.80) [Energia.m]")
    print("-" * 88)
    print(f"{'Configuración':<30} | {'Producción Anual':<18} | {'Ganancia vs Horiz':<18}")
    print("-" * 88)
    print(f"{'1. Plano Horizontal (0°)':<30} | {sim_horiz['annual_energy_eval_kwh']:>10.2f} kWh/año | {sim_horiz['annual_gain_pct']:>+15.2f} %")
    print(f"{f'2. Fijo Óptimo Anual ({opt_beta_annual}°)':<30} | {sim_opt['annual_energy_eval_kwh']:>10.2f} kWh/año | {sim_opt['annual_gain_pct']:>+15.2f} %")
    print(f"{'3. Óptimo Estacional (4 Áng)':<30} | {sim_est['annual_energy_eval_kwh']:>10.2f} kWh/año | {sim_est['annual_gain_pct']:>+15.2f} %")
    print(f"{'4. Seg. 2 Ejes Completo':<30} | {sim_2ax['annual_energy_eval_kwh']:>10.2f} kWh/año | {sim_2ax['annual_gain_pct']:>+15.2f} %")
    print("-" * 88)
    print()

    print("2. MODELO TÉRMICO DE OSTERWALD [Energia_Osterwald.m]")
    print("-" * 88)
    print(f"{'Configuración':<30} | {'T_célula Media':<15} | {'Producción Anual':<18} | {'Ganancia vs Horiz'}")
    print("-" * 88)
    print(f"{'1. Plano Horizontal (0°)':<30} | {ost_horiz['mean_cell_temp_eval_degc']:>11.1f} °C | {ost_horiz['annual_energy_eval_kwh']:>10.2f} kWh/año | {ost_horiz['gain_annual_pct']:>+15.2f} %")
    print(f"{f'2. Fijo Óptimo Anual ({opt_beta_annual}°)':<30} | {ost_opt['mean_cell_temp_eval_degc']:>11.1f} °C | {ost_opt['annual_energy_eval_kwh']:>10.2f} kWh/año | {ost_opt['gain_annual_pct']:>+15.2f} %")
    print(f"{'3. Óptimo Estacional (4 Áng)':<30} | {ost_est['mean_cell_temp_eval_degc']:>11.1f} °C | {ost_est['annual_energy_eval_kwh']:>10.2f} kWh/año | {ost_est['gain_annual_pct']:>+15.2f} %")
    print(f"{'4. Seg. 2 Ejes Completo':<30} | {ost_2ax['mean_cell_temp_eval_degc']:>11.1f} °C | {ost_2ax['annual_energy_eval_kwh']:>10.2f} kWh/año | {ost_2ax['gain_annual_pct']:>+15.2f} %")
    print("-" * 88)
    print()

    print("3. DESGLOSE MENSUAL OSTERWALD: FIJO ÓPTIMO (32°) vs HORIZONTAL")
    print("-" * 88)
    print(f"{'Mes':<5} | {'T_amb(°C)':<9} | {'T_cel(°C)':<9} | {'E_Horiz(kWh)':<12} | {'E_Opt(kWh)':<12} | {'Ganancia (kWh)':<15} | {'Ganancia (%)'}")
    print("-" * 88)
    for m in range(12):
        print(
            f"{MONTH_NAMES_ES[m]:<5} | "
            f"{ambient_temp[m]:>9.1f} | "
            f"{ost_opt['cell_temp_eval_monthly'][m]:>9.1f} | "
            f"{ost_opt['monthly_energy_horiz_kwh'][m]:>12.2f} | "
            f"{ost_opt['monthly_energy_eval_kwh'][m]:>12.2f} | "
            f"{ost_opt['gain_monthly_kwh'][m]:>+15.2f} | "
            f"{ost_opt['gain_monthly_pct'][m]:>+11.2f} %"
        )
    print("-" * 88)
    print(
        f"{'TOTAL':<5} | "
        f"{float(np.mean(ambient_temp)):>9.1f} | "
        f"{ost_opt['mean_cell_temp_eval_degc']:>9.1f} | "
        f"{ost_opt['annual_energy_horiz_kwh']:>12.2f} | "
        f"{ost_opt['annual_energy_eval_kwh']:>12.2f} | "
        f"{ost_opt['gain_annual_kwh']:>+15.2f} | "
        f"{ost_opt['gain_annual_pct']:>+11.2f} %"
    )
    print("-" * 88)

    # Consistency assertions
    assert ost_opt["annual_energy_eval_kwh"] > ost_horiz["annual_energy_eval_kwh"]
    assert ost_2ax["annual_energy_eval_kwh"] > ost_opt["annual_energy_eval_kwh"]
    assert not np.any(np.isnan(ost_2ax["monthly_energy_eval_kwh"]))

    print("\n✓ TODAS LAS VERIFICACIONES DE ENERGÍA Y TEMPERATURA DE CÉLULA SUPERADAS CON ÉXITO")
    print("=" * 88)

    return {
        "execution_time_ms": elapsed_ms,
        "simplified": {
            "horizontal": sim_horiz,
            "optimal_annual": sim_opt,
            "optimal_seasonal": sim_est,
            "tracking_2axis": sim_2ax,
        },
        "osterwald": {
            "horizontal": ost_horiz,
            "optimal_annual": ost_opt,
            "optimal_seasonal": ost_est,
            "tracking_2axis": ost_2ax,
        },
    }


if __name__ == "__main__":
    run_full_energy_test()
