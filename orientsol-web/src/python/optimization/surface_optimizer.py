"""
Global Surface Optimization and Comparative Engine for OrientSol 4.0.
Calculates and compares all solar collector topologies:
1. Fixed Surfaces:
   - Máxima Anual (single optimal annual tilt)
   - 4 Posiciones Estacionales (Winter, Spring, Summer, Autumn)
   - 12 Posiciones Mensuales (individual monthly optimal tilts)
2. Single-Axis Tracking:
   - Eje Horizontal (E-W)
   - Eje Azimutal (fixed tilt, azimuth tracking)
   - Eje Polar (polar axis tilted at latitude)
3. Dual-Axis Tracking:
   - 2 Ejes Completo (full altitude and azimuth tracking)

References:
- CoeficienteCalculos.m
- Tabla_Comparativa.m
- Ganancias_Gd_*.m
"""

from typing import Dict, List, Union
import numpy as np

from optimization.seasonal_optimum import optimize_seasonal_tilts
from optimization.monthly_optimum import optimize_monthly_tilts
from tracking.horizontal_axis import simulate_horizontal_axis_tracking
from tracking.azimuthal_axis import simulate_azimuthal_axis_tracking
from tracking.polar_axis import simulate_polar_axis_tracking
from tracking.dual_axis import simulate_dual_axis_tracking
from energy.energy_yield import calculate_energy_yield
from energy.temperatures import calculate_cell_operating_temperatures

DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)


def run_full_surface_optimization(
    lat_rad: float,
    val_decli: np.ndarray,
    numero_n: np.ndarray,
    numero_n2: np.ndarray,
    matriz_angulos: np.ndarray,
    matriz_angulos2: np.ndarray,
    alt_solar: np.ndarray,
    azim_solar: np.ndarray,
    bh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    gh_matriz: np.ndarray,
    val_bdm0: np.ndarray,
    val_ddm0: np.ndarray,
    gdm0: np.ndarray,
    ambient_temp_c: np.ndarray,
    albedo: float = 0.20,
    peak_power_kw: float = 5.0,
    performance_ratio: float = 0.80,
    temp_coefficient: float = -0.004,
    tonc: float = 47.0,
) -> Dict[str, Union[Dict, List, float]]:
    """
    Executes end-to-end solar optimization across all surface architectures.
    """
    g0 = np.asarray(gdm0, dtype=np.float64)
    t_amb = np.asarray(ambient_temp_c, dtype=np.float64)
    mean_g0 = float(np.mean(g0))
    annual_g0 = float(np.sum(g0 * DAYS_PER_MONTH))

    # -------------------------------------------------------------------------
    # 1. FIXED SURFACES: TRANSPOSITION & OPTIMIZATION
    # -------------------------------------------------------------------------
    from radiation.transposition import transpose_to_inclined_surfaces
    transp = transpose_to_inclined_surfaces(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n2=numero_n2,
        matriz_angulos2=matriz_angulos2,
        bh_matriz=bh_matriz,
        dh_matriz=dh_matriz,
        gh_matriz=gh_matriz,
        val_bdm0=val_bdm0,
        val_ddm0=val_ddm0,
        datos_or_gdm0=g0,
        albedo=albedo,
    )

    gd_beta_total = transp["gd_beta_total"]

    # 1.1 Fixed Optimal Annual
    opt_annual_beta = int(transp["opt_angle_deg"])
    gd_opt_annual = np.asarray(transp["radiacion_global_opt"], dtype=np.float64)
    mean_opt_annual = float(transp["media_global_opt"])

    # 1.2 Fixed 4 Seasonal Positions
    seasonal_opt = optimize_seasonal_tilts(
        gd_beta_total=gd_beta_total,
        datos_or_gdm0=g0,
    )
    gd_seasonal = np.asarray(seasonal_opt["gd_opt_seasonal"], dtype=np.float64)
    mean_seasonal = float(seasonal_opt["annual_mean_kwh"])
    seasons = seasonal_opt["seasons"]

    # 1.3 Fixed 12 Monthly Positions
    monthly_opt = optimize_monthly_tilts(
        gd_beta_total=gd_beta_total,
        datos_or_gdm0=g0,
    )
    gd_monthly = np.asarray(monthly_opt["monthly_daily_kwh"], dtype=np.float64)
    mean_monthly = float(monthly_opt["annual_mean_daily_kwh"])

    # -------------------------------------------------------------------------
    # 2. SINGLE-AXIS TRACKING
    # -------------------------------------------------------------------------
    # 2.1 Horizontal Axis (E-W)
    track_horiz = simulate_horizontal_axis_tracking(
        lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, azim_solar, bh_matriz, dh_matriz, gh_matriz, albedo
    )
    gd_track_horiz = np.asarray(track_horiz["gd_daily"], dtype=np.float64)
    mean_track_horiz = float(track_horiz["media_gd"])

    # 2.2 Azimuthal Axis
    track_azim = simulate_azimuthal_axis_tracking(
        lat_rad, val_decli, numero_n, matriz_angulos, azim_solar, bh_matriz, dh_matriz, gh_matriz, albedo
    )
    gd_track_azim = np.asarray(track_azim["gd_daily"], dtype=np.float64)
    mean_track_azim = float(track_azim["media_gd"])

    # 2.3 Polar Axis
    track_polar = simulate_polar_axis_tracking(
        lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, bh_matriz, dh_matriz, gh_matriz, albedo
    )
    gd_track_polar = np.asarray(track_polar["gd_daily"], dtype=np.float64)
    mean_track_polar = float(track_polar["media_gd"])

    # -------------------------------------------------------------------------
    # 3. DUAL-AXIS TRACKING
    # -------------------------------------------------------------------------
    track_dual = simulate_dual_axis_tracking(
        lat_rad, val_decli, numero_n, matriz_angulos, alt_solar, azim_solar, bh_matriz, dh_matriz, gh_matriz, albedo
    )
    gd_track_dual = np.asarray(track_dual["gd_daily"], dtype=np.float64)
    mean_track_dual = float(track_dual["media_gd"])

    # -------------------------------------------------------------------------
    # 4. ENERGY YIELDS & TEMPERATURES ACROSS ALL 7 SURFACES
    # -------------------------------------------------------------------------
    surfaces = {
        "horizontal": {
            "name": "Superficie Horizontal (beta = 0°)",
            "category": "Fija",
            "gd_monthly": g0,
            "mean_daily": mean_g0,
        },
        "fixed_optimal_annual": {
            "name": f"Fija Óptima Anual (beta = {opt_annual_beta}°)",
            "category": "Fija",
            "gd_monthly": gd_opt_annual,
            "mean_daily": mean_opt_annual,
        },
        "fixed_seasonal_4": {
            "name": "Fija 4 Posiciones Estacionales",
            "category": "Fija",
            "gd_monthly": gd_seasonal,
            "mean_daily": mean_seasonal,
        },
        "fixed_monthly_12": {
            "name": "Fija 12 Posiciones Mensuales",
            "category": "Fija",
            "gd_monthly": gd_monthly,
            "mean_daily": mean_monthly,
        },
        "tracking_1axis_horizontal": {
            "name": "Seguimiento 1 Eje Horizontal (E-O)",
            "category": "1 Eje",
            "gd_monthly": gd_track_horiz,
            "mean_daily": mean_track_horiz,
        },
        "tracking_1axis_azimuthal": {
            "name": "Seguimiento 1 Eje Azimutal",
            "category": "1 Eje",
            "gd_monthly": gd_track_azim,
            "mean_daily": mean_track_azim,
        },
        "tracking_1axis_polar": {
            "name": "Seguimiento 1 Eje Polar",
            "category": "1 Eje",
            "gd_monthly": gd_track_polar,
            "mean_daily": mean_track_polar,
        },
        "tracking_2axis_dual": {
            "name": "Seguimiento 2 Ejes Completo",
            "category": "2 Ejes",
            "gd_monthly": gd_track_dual,
            "mean_daily": mean_track_dual,
        },
    }

    comparison_table = []
    energy_details = {}

    for key, item in surfaces.items():
        mean_d = item["mean_daily"]
        annual_irr = float(np.sum(item["gd_monthly"] * DAYS_PER_MONTH))
        gain_h_pct = float(((mean_d - mean_g0) / mean_g0) * 100.0)
        gain_opt_pct = float(((mean_d - mean_opt_annual) / mean_opt_annual) * 100.0)

        # Full energy received and produced
        energy_res = calculate_energy_yield(
            gdm_daily_kwh=item["gd_monthly"],
            gdm_horizontal_kwh=g0,
            ambient_temp_c=t_amb,
            peak_power_kw=peak_power_kw,
            performance_ratio=performance_ratio,
            temp_coefficient=temp_coefficient,
            tonc=tonc,
            surface_name=item["name"],
        )
        energy_details[key] = energy_res

        prod_ost = energy_res["producida"]["osterwald"]["annual_kwh"]
        prod_simp = energy_res["producida"]["simplified"]["annual_kwh"]
        e_recibida = energy_res["recibida"]["annual_total_kwh"]
        tc_mean = energy_res["producida"]["osterwald"]["mean_cell_temp_c"]

        comparison_table.append({
            "key": key,
            "name": item["name"],
            "category": item["category"],
            "mean_daily_kwh_m2": round(mean_d, 3),
            "annual_irradiation_kwh_m2": round(annual_irr, 1),
            "gain_over_horizontal_pct": round(gain_h_pct, 2),
            "gain_over_optimal_annual_pct": round(gain_opt_pct, 2),
            "energy_received_kwh_year": e_recibida,
            "energy_produced_osterwald_kwh_year": prod_ost,
            "energy_produced_simplified_kwh_year": prod_simp,
            "mean_cell_temp_c": tc_mean,
            # CamelCase aliases for TypeScript / UI bridge:
            "meanDailyKwhM2": round(mean_d, 3),
            "annualRadiationKwhM2": round(annual_irr, 1),
            "gainOverHorizontalPct": round(gain_h_pct, 2),
            "gainOverAnnualFixedPct": round(gain_opt_pct, 2),
            "energyProducedOsterwaldKwhYear": prod_ost,
            "energyProducedSimplifiedKwh": prod_simp,
            "meanCellTempDegC": tc_mean,
            "thermalLossPct": round(float(energy_res["producida"]["osterwald"].get("thermal_loss_pct", 0.0)), 2),
        })

    return {
        "fixed": {
            "optimal_annual": {
                "tilt_deg": opt_annual_beta,
                "daily_kwh": [round(float(v), 3) for v in gd_opt_annual],
                "annual_mean_daily": round(mean_opt_annual, 3),
                "annual_total_kwh": round(mean_opt_annual * 365.0, 1),
                "gain_over_horizontal_pct": round(((mean_opt_annual - mean_g0) / mean_g0) * 100.0, 2),
            },
            "seasonal_4": {
                "winter_tilt_deg": int(seasons["winter"]["opt_angle_deg"]),
                "spring_tilt_deg": int(seasons["spring"]["opt_angle_deg"]),
                "summer_tilt_deg": int(seasons["summer"]["opt_angle_deg"]),
                "autumn_tilt_deg": int(seasons["autumn"]["opt_angle_deg"]),
                "daily_kwh": [round(float(v), 3) for v in gd_seasonal],
                "annual_mean_daily": round(mean_seasonal, 3),
                "gain_over_horizontal_pct": round(((mean_seasonal - mean_g0) / mean_g0) * 100.0, 2),
                "gain_over_optimal_annual_pct": round(((mean_seasonal - mean_opt_annual) / mean_opt_annual) * 100.0, 2),
            },
            "monthly_12": monthly_opt,
        },
        "tracking": {
            "horizontal_axis": {
                "daily_kwh": [round(float(v), 3) for v in gd_track_horiz],
                "annual_mean_daily": round(mean_track_horiz, 3),
                "gain_over_horizontal_pct": round(((mean_track_horiz - mean_g0) / mean_g0) * 100.0, 2),
                "gain_over_optimal_annual_pct": round(((mean_track_horiz - mean_opt_annual) / mean_opt_annual) * 100.0, 2),
            },
            "azimuthal_axis": {
                "daily_kwh": [round(float(v), 3) for v in gd_track_azim],
                "annual_mean_daily": round(mean_track_azim, 3),
                "gain_over_horizontal_pct": round(((mean_track_azim - mean_g0) / mean_g0) * 100.0, 2),
                "gain_over_optimal_annual_pct": round(((mean_track_azim - mean_opt_annual) / mean_opt_annual) * 100.0, 2),
            },
            "polar_axis": {
                "daily_kwh": [round(float(v), 3) for v in gd_track_polar],
                "annual_mean_daily": round(mean_track_polar, 3),
                "gain_over_horizontal_pct": round(((mean_track_polar - mean_g0) / mean_g0) * 100.0, 2),
                "gain_over_optimal_annual_pct": round(((mean_track_polar - mean_opt_annual) / mean_opt_annual) * 100.0, 2),
            },
            "dual_axis": {
                "daily_kwh": [round(float(v), 3) for v in gd_track_dual],
                "annual_mean_daily": round(mean_track_dual, 3),
                "gain_over_horizontal_pct": round(((mean_track_dual - mean_g0) / mean_g0) * 100.0, 2),
                "gain_over_optimal_annual_pct": round(((mean_track_dual - mean_opt_annual) / mean_opt_annual) * 100.0, 2),
            },
        },
        "comparison_table": comparison_table,
        "energy_details": energy_details,
    }
