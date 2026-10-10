"""
Verification and Testing Script for OrientSol Solar Tracking & Seasonal Optimization.

Tests and verifies:
1. Complete 2-Axis Solar Tracking (Bh_2Ejes, Dh_2Ejes, Rh_2Ejes, Gh_2Ejes, Bd_2Ejes, Gd_2Ejes)
2. 1-Axis Polar Solar Tracking (Bh_EjePolar, Dh_EjePolar, Rh_EjePolar, Gh_EjePolar, Gd_EjePolar)
3. 1-Axis Azimuthal Solar Tracking (Bh_EjeAzimutal, Dh_EjeAzimutal, Rh_EjeAzimutal, Gh_EjeAzimutal, Gd_EjeAzimutal)
4. 1-Axis Horizontal Solar Tracking (Bh_EjeHorizontal, Dh_EjeHorizontal, Rh_EjeHorizontal, Gh_EjeHorizontal, Gd_EjeHorizontal)
5. 4-Season Tilt Optimization (Calculo_Optimo_Estacion, Bd_OptEstacional, Dd_OptEstacional, Rd_OptEstacional)
6. Unified Comparative Analysis of Gains (Ganancias_*.m)
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
import time
from typing import Dict, Union
import numpy as np

# Robust imports supporting flat VFS mount (/orient/...) or package import
try:
    from core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
    from core.conversions import deg2rad, rad2deg
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
    from tracking.polar_axis import simulate_polar_axis_tracking
    from tracking.azimuthal_axis import simulate_azimuthal_axis_tracking
    from tracking.horizontal_axis import simulate_horizontal_axis_tracking
    from tracking.gains import compare_all_systems
except ImportError:
    try:
        from src.python.core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
        from src.python.core.conversions import deg2rad, rad2deg
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
        from src.python.tracking.polar_axis import simulate_polar_axis_tracking
        from src.python.tracking.azimuthal_axis import simulate_azimuthal_axis_tracking
        from src.python.tracking.horizontal_axis import simulate_horizontal_axis_tracking
        from src.python.tracking.gains import compare_all_systems
    except ImportError:
        # Fallback for relative within subdirectories
        from core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
        from core.conversions import deg2rad, rad2deg
        from core.declination import matriz_declinacion
        from core.sunset_angles import angulos_salida
        from core.hour_angles import angulos, angulos2
        from core.solar_position import altura_solar, azimut_solar
        from radiation.extraterrestrial import bod0
        from radiation.horizontal_decomposition import decompose_horizontal_radiation
        from radiation.hourly_radiation import gh0, dh0, bh0
        from radiation.transposition import transpose_to_inclined_surfaces
        from optimization.seasonal_optimum import optimize_seasonal_tilts
        from tracking.dual_axis import simulate_dual_axis_tracking
        from tracking.polar_axis import simulate_polar_axis_tracking
        from tracking.azimuthal_axis import simulate_azimuthal_axis_tracking
        from tracking.horizontal_axis import simulate_horizontal_axis_tracking
        from tracking.gains import compare_all_systems


def run_full_tracking_seasonal_test(
    latitude_deg: float = 40.4168,
    gdm0: Union[np.ndarray, list, None] = None,
    albedo: float = 0.20,
    city_name: str = "Madrid (España)",
) -> Dict[str, Union[float, Dict]]:
    """
    Simulates and validates all OrientSol tracking and seasonal optimization models.
    """
    if gdm0 is None:
        # Default Madrid global horizontal radiation [kWh/m2/day] from OrientSol BBDD.xlsx
        gdm0 = np.array([2.14, 3.15, 4.48, 5.51, 6.62, 7.54, 7.78, 6.84, 5.25, 3.52, 2.36, 1.84])
    else:
        gdm0 = np.asarray(gdm0, dtype=np.float64)

    lat_rad = float(deg2rad(latitude_deg))

    print("=" * 88)
    print(f"ORIENTSOL - SEGUIMIENTO SOLAR (4 SISTEMAS) Y OPTIMIZACIÓN ESTACIONAL (NUMPY)")
    print("=" * 88)
    print(f"  Localidad: {city_name} | Latitud: {latitude_deg:+.4f}° ({lat_rad:+.5f} rad) | Albedo: {albedo:.2f}\n")

    t_start = time.perf_counter()

    # Step 1: Base Geometry
    val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
    ang_sal1, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
    numero_n, matriz_angulos = angulos(ang_sal1)
    numero_n2, matriz_angulos2 = angulos2(ang_salida)
    alt_solar = altura_solar(lat_rad, val_decli, numero_n, matriz_angulos)
    azim_solar = azimut_solar(alt_solar, lat_rad, val_decli, numero_n)

    # Step 2: Radiation Decomposition
    val_bod = bod0(CHARACTERISTIC_DAYS, lat_rad, val_decli, ang_sal1)
    val_bdm0, val_ddm0 = bdm0(val_bod, gdm0)
    gh_mat, _ = gh0(matriz_angulos, ang_sal1, numero_n, gdm0)
    dh_mat, _ = dh0(matriz_angulos, ang_sal1, numero_n, val_ddm0)
    bh_mat = bh0(gh_mat, dh_mat, numero_n)

    # Step 3: Fixed Transposition across 91 angles & Annual Optimum
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
        albedo=albedo,
    )

    opt_beta_annual = transp["opt_angle_deg"]
    gd_opt_annual = transp["radiacion_global_opt"]
    annual_opt_mean = transp["media_global_opt"]
    gd_beta_total = transp["gd_beta_total"]
    bd_beta_total = transp["bd_beta_total"]
    dd_beta_total = transp["dd_beta_total"]
    rd_beta_total = transp["rd_beta_total"]

    # Step 4: 4-Season Tilt Optimization
    seasonal_opt = optimize_seasonal_tilts(
        gd_beta_total=gd_beta_total,
        datos_or_gdm0=gdm0,
        bd_beta_total=bd_beta_total,
        dd_beta_total=dd_beta_total,
        rd_beta_total=rd_beta_total,
    )

    # Step 5: Solar Tracking Systems
    # 5.1 Dual-Axis Tracking (2 Ejes)
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
        albedo=albedo,
    )

    # 5.2 1-Axis Polar Tracking (Eje Polar)
    res_polar = simulate_polar_axis_tracking(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n=numero_n,
        matriz_angulos=matriz_angulos,
        altura_solar_mat=alt_solar,
        bh_matriz=bh_mat,
        dh_matriz=dh_mat,
        gh_matriz=gh_mat,
        albedo=albedo,
    )

    # 5.3 1-Axis Azimuthal Tracking (Eje Azimutal)
    res_azimuthal = simulate_azimuthal_axis_tracking(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n=numero_n,
        matriz_angulos=matriz_angulos,
        azimut_solar_mat=azim_solar,
        bh_matriz=bh_mat,
        dh_matriz=dh_mat,
        gh_matriz=gh_mat,
        albedo=albedo,
    )

    # 5.4 1-Axis Horizontal Tracking (Eje Horizontal N-S)
    res_horizontal = simulate_horizontal_axis_tracking(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n=numero_n,
        matriz_angulos=matriz_angulos,
        altura_solar_mat=alt_solar,
        azimut_solar_mat=azim_solar,
        bh_matriz=bh_mat,
        dh_matriz=dh_mat,
        gh_matriz=gh_mat,
        albedo=albedo,
    )

    # Step 6: Comparative Analysis across all systems
    comparison = compare_all_systems(
        gdm0=gdm0,
        gd_opt_annual=gd_opt_annual,
        gd_opt_seasonal=seasonal_opt["gd_opt_seasonal"],
        gd_polar=res_polar["gd_daily"],
        gd_azimuthal=res_azimuthal["gd_daily"],
        gd_horizontal=res_horizontal["gd_daily"],
        gd_2axis=res_2axis["gd_daily"],
    )

    elapsed_ms = (time.perf_counter() - t_start) * 1000.0

    # ----------------------------------------------------
    # DISPLAY RESULTS
    # ----------------------------------------------------
    print(f"✓ Pipeline completado en: {elapsed_ms:.2f} ms")
    print("-" * 88)

    # Seasonal Optimization Summary
    print("1. OPTIMIZACIÓN ESTACIONAL (4 INCLINACIONES POR AÑO)")
    print("-" * 88)
    seasons = seasonal_opt["seasons"]
    print(f"  • Invierno  (Dic, Ene, Feb): Ángulo Óptimo = {seasons['winter']['opt_angle_deg']:2d}° | Media = {seasons['winter']['mean_daily_kwh']:.3f} kWh/m²/día")
    print(f"  • Primavera (Mar, Abr, May): Ángulo Óptimo = {seasons['spring']['opt_angle_deg']:2d}° | Media = {seasons['spring']['mean_daily_kwh']:.3f} kWh/m²/día")
    print(f"  • Verano    (Jun, Jul, Ago): Ángulo Óptimo = {seasons['summer']['opt_angle_deg']:2d}° | Media = {seasons['summer']['mean_daily_kwh']:.3f} kWh/m²/día")
    print(f"  • Otoño     (Sep, Oct, Nov): Ángulo Óptimo = {seasons['autumn']['opt_angle_deg']:2d}° | Media = {seasons['autumn']['mean_daily_kwh']:.3f} kWh/m²/día")
    print(f"  ==> Media Anual Estacional: {seasonal_opt['annual_mean_kwh']:.3f} kWh/m²/día (vs Fijo Anual {opt_beta_annual}°: {annual_opt_mean:.3f} kWh/m²/día)")
    print()

    # Tracking & Systems Comparison Table
    print("2. TABLA COMPARATIVA DE RADIACIÓN GLOBAL DIARIA MENSUAL [kWh/m²/día]")
    print("-" * 88)
    header = f"{'Mes':<5} | {'Horiz(0°)':<9} | {'FijoOpt':<8} | {'Estac.':<8} | {'EjeHoriz':<8} | {'EjeAzi':<8} | {'EjePolar':<8} | {'2 Ejes':<8}"
    print(header)
    print("-" * 88)

    for m in range(12):
        row_str = (
            f"{MONTH_NAMES_ES[m]:<5} | "
            f"{gdm0[m]:>9.3f} | "
            f"{gd_opt_annual[m]:>8.3f} | "
            f"{seasonal_opt['gd_opt_seasonal'][m]:>8.3f} | "
            f"{res_horizontal['gd_daily'][m]:>8.3f} | "
            f"{res_azimuthal['gd_daily'][m]:>8.3f} | "
            f"{res_polar['gd_daily'][m]:>8.3f} | "
            f"{res_2axis['gd_daily'][m]:>8.3f}"
        )
        print(row_str)

    print("-" * 88)
    summary_row = (
        f"{'MEDIA':<5} | "
        f"{comparison['horizontal']['annual_mean_kwh_m2']:>9.3f} | "
        f"{comparison['optimal_annual']['annual_mean_kwh_m2']:>8.3f} | "
        f"{comparison['optimal_seasonal']['annual_mean_kwh_m2']:>8.3f} | "
        f"{comparison['tracking_horizontal']['annual_mean_kwh_m2']:>8.3f} | "
        f"{comparison['tracking_azimuthal']['annual_mean_kwh_m2']:>8.3f} | "
        f"{comparison['tracking_polar']['annual_mean_kwh_m2']:>8.3f} | "
        f"{comparison['tracking_2axis']['annual_mean_kwh_m2']:>8.3f}"
    )
    print(summary_row)
    print("-" * 88)
    print()

    # Annual Energy and Gains Ranking
    print("3. RANKING DE PRODUCCIÓN ENERGÉTICA ANUAL Y GANANCIAS")
    print("-" * 88)
    print(f"{'Configuración':<30} | {'Media Día':<11} | {'Total Anual':<13} | {'Ganancia vs Horiz':<18} | {'vs Fijo Óptimo'}")
    print("-" * 88)

    display_configs = [
        ("1. Superficie Horizontal (0°)", "horizontal"),
        (f"2. Fijo Óptimo Anual ({opt_beta_annual}°)", "optimal_annual"),
        ("3. Óptimo Estacional (4 Áng)", "optimal_seasonal"),
        ("4. Seg. 1 Eje Horizontal (N-S)", "tracking_horizontal"),
        ("5. Seg. 1 Eje Azimutal", "tracking_azimuthal"),
        ("6. Seg. 1 Eje Polar", "tracking_polar"),
        ("7. Seg. 2 Ejes Completo", "tracking_2axis"),
    ]

    for label, key in display_configs:
        cfg = comparison[key]
        print(
            f"{label:<30} | "
            f"{cfg['annual_mean_kwh_m2']:>8.3f} kWh | "
            f"{cfg['annual_kwh_m2']:>8.1f} kWh/m² | "
            f"{cfg['gain_over_horizontal_pct']:>+15.2f} % | "
            f"{cfg['gain_over_optimal_annual_pct']:>+12.2f} %"
        )
    print("-" * 88)

    # Physical Consistency Assertions
    mean_g0 = comparison["horizontal"]["annual_mean_kwh_m2"]
    mean_opt = comparison["optimal_annual"]["annual_mean_kwh_m2"]
    mean_est = comparison["optimal_seasonal"]["annual_mean_kwh_m2"]
    mean_2ax = comparison["tracking_2axis"]["annual_mean_kwh_m2"]

    assert mean_opt >= mean_g0, f"Error: Fixed optimal ({mean_opt}) must be >= horizontal ({mean_g0})"
    assert mean_est >= mean_opt - 1e-4, f"Error: Seasonal ({mean_est}) must be >= annual fixed optimum ({mean_opt})"
    assert mean_2ax > mean_opt, f"Error: 2-Axis tracking ({mean_2ax}) must exceed fixed optimal ({mean_opt})"
    assert not np.any(np.isnan(res_2axis["gd_daily"])), "Error: NaN detected in 2-axis tracking daily radiation"
    assert not np.any(np.isnan(res_polar["gd_daily"])), "Error: NaN detected in polar tracking daily radiation"
    assert not np.any(np.isnan(res_azimuthal["gd_daily"])), "Error: NaN detected in azimuthal tracking daily radiation"
    assert not np.any(np.isnan(res_horizontal["gd_daily"])), "Error: NaN detected in horizontal tracking daily radiation"

    print("\n✓ TODAS LAS VERIFICACIONES FÍSICAS Y NUMÉRICAS SUPERADAS CON ÉXITO")
    print("=" * 88)

    return {
        "execution_time_ms": elapsed_ms,
        "seasonal_optimization": seasonal_opt,
        "dual_axis": res_2axis,
        "polar_axis": res_polar,
        "azimuthal_axis": res_azimuthal,
        "horizontal_axis": res_horizontal,
        "comparison": comparison,
    }


if __name__ == "__main__":
    run_full_tracking_seasonal_test()
