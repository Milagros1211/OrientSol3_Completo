"""
Solar Capture Loss Map Module (Mapas de Pérdidas de Captación) for OrientSol 3.0.
Calculates irradiation and capture losses as a function of panel tilt (beta)
and orientation/azimuth (alpha), categorized according to CTE DB-HE4 limits.

References:
- CoeficienteCalculos.m
- BhBeta.m
- TablaSituacionesOptimas.png
"""

from typing import Dict, List, Tuple, Union
import numpy as np
from core.constants import CHARACTERISTIC_DAYS
from core.conversions import deg2rad
from core.declination import matriz_declinacion
from core.sunset_angles import angulos_salida
from core.hour_angles import angulos2

DAYS_PER_MONTH = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], dtype=np.int32)


def generate_capture_loss_map(
    lat_deg: float,
    gdm0: Union[np.ndarray, List[float]],
    val_bdm0: Union[np.ndarray, List[float]],
    val_ddm0: Union[np.ndarray, List[float]],
    bh_matriz: np.ndarray,
    dh_matriz: np.ndarray,
    gh_matriz: np.ndarray,
    albedo: float = 0.20,
    beta_step_deg: Union[int, float] = 5,
    alpha_step_deg: Union[int, float] = 7.5,
    alpha_range_deg: Tuple[int, int] = (-90, 90),
) -> Dict[str, Union[np.ndarray, List[float], float, int, Dict]]:
    """
    Computes 2D grid of annual solar irradiation and capture losses as a function of:
    - Tilt angle beta in [0..90] degrees
    - Azimuth angle alpha in [alpha_min..alpha_max] degrees (0 = South, -90 = East, +90 = West).

    Returns
    -------
    dict
        beta_grid, alpha_grid, radiation_matrix, loss_pct_matrix, cte_zones, and optimum point.
    """
    lat_rad = float(deg2rad(lat_deg))
    g0 = np.asarray(gdm0, dtype=np.float64)
    b0 = np.asarray(val_bdm0, dtype=np.float64)
    d0 = np.asarray(val_ddm0, dtype=np.float64)

    val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
    _, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
    numero_n2, matriz_angulos2 = angulos2(ang_salida)

    # Grid axes (half step for finer resolution)
    betas = np.arange(0, 90.0001, beta_step_deg, dtype=np.float64)
    alphas = np.arange(alpha_range_deg[0], alpha_range_deg[1] + 0.0001, alpha_step_deg, dtype=np.float64)

    n_betas = len(betas)
    n_alphas = len(alphas)    # 2D output matrices (annual mean daily radiation and loss percentage)
    radiation_annual_daily = np.zeros((n_betas, n_alphas), dtype=np.float64)
    # 3D output matrices for each of the 12 calendar months
    radiation_monthly = np.zeros((12, n_betas, n_alphas), dtype=np.float64)

    sin_phi = np.sin(lat_rad)
    cos_phi = np.cos(lat_rad)

    # Pre-calculate hour angle sines and cosines
    omega_rad = matriz_angulos2  # shape (12, 13)

    for i_b, beta_deg in enumerate(betas):
        beta_rad = np.radians(beta_deg)
        sin_beta = np.sin(beta_rad)
        cos_beta = np.cos(beta_rad)

        # Diffuse and Albedo components depend only on tilt beta
        diffuse_factor = (1.0 + cos_beta) / 2.0
        albedo_factor = albedo * ((1.0 - cos_beta) / 2.0)

        for i_a, alpha_deg in enumerate(alphas):
            alpha_rad = np.radians(alpha_deg)
            sin_alpha = np.sin(alpha_rad)
            cos_alpha = np.cos(alpha_rad)

            # Monthly daily transposed radiation accumulator
            g_daily_month = np.zeros(12, dtype=np.float64)

            beta_idx = int(round(beta_deg))
            for m in range(12):
                n_hrs = int(numero_n2[m, beta_idx])
                delta = val_decli[m]
                sin_delta = np.sin(delta)
                cos_delta = np.cos(delta)

                # Vectorized hour-angle calculation for month m and tilt beta
                n_pts = min(n_hrs, bh_matriz.shape[1], omega_rad.shape[2])
                if n_pts == 0:
                    continue

                omegas = omega_rad[m, beta_idx, :n_pts]

                # Direct cosine of incidence angle on inclined surface with azimuth alpha:
                # cos_theta = sin(delta)*sin(phi)*cos(beta)
                #           - sin(delta)*cos(phi)*sin(beta)*cos(alpha)
                #           + cos(delta)*cos(phi)*cos(beta)*cos(omega)
                #           + cos(delta)*sin(phi)*sin(beta)*cos(alpha)*cos(omega)
                #           + cos(delta)*sin(beta)*sin(alpha)*np.sin(omega)
                term1 = sin_delta * sin_phi * cos_beta
                term2 = -sin_delta * cos_phi * sin_beta * cos_alpha
                term3 = cos_delta * cos_phi * cos_beta * np.cos(omegas)
                term4 = cos_delta * sin_phi * sin_beta * cos_alpha * np.cos(omegas)
                term5 = cos_delta * sin_beta * sin_alpha * np.sin(omegas)

                cos_theta = term1 + term2 + term3 + term4 + term5

                # Sun zenith cosine on horizontal surface
                cos_theta_z = sin_phi * sin_delta + cos_phi * cos_delta * np.cos(omegas)
                safe_cos_tz = np.where(cos_theta_z > 0.01, cos_theta_z, 0.01)

                # Beam transposition ratio Rb = max(0, cos_theta) / cos_theta_z
                rb = np.where((cos_theta_z > 0.01) & (cos_theta > 0), cos_theta / safe_cos_tz, 0.0)

                # Hourly beam, diffuse, and ground reflected components
                bh_hourly = bh_matriz[m, :n_pts]
                dh_hourly = dh_matriz[m, :n_pts]
                gh_hourly = gh_matriz[m, :n_pts]

                bh_tilted = bh_hourly * rb
                dh_tilted = dh_hourly * diffuse_factor
                rh_tilted = gh_hourly * albedo_factor

                gh_tilted = bh_tilted + dh_tilted + rh_tilted

                # Total daily for month m (trapezoidal integration across daylight hours)
                g_daily_month[m] = float(np.sum(gh_tilted) * 2.0)

            # Annual daily mean radiation
            radiation_annual_daily[i_b, i_a] = float(np.mean(g_daily_month))
            for m in range(12):
                radiation_monthly[m, i_b, i_a] = g_daily_month[m]

    # Reference maximum (South-facing optimal tilt)
    max_radiation = float(np.max(radiation_annual_daily))
    opt_indices = np.unravel_index(np.argmax(radiation_annual_daily), radiation_annual_daily.shape)
    opt_beta_deg = float(betas[opt_indices[0]])
    opt_alpha_deg = float(alphas[opt_indices[1]])

    # Capture loss percentage matrix relative to the maximum:
    # Loss (%) = (1 - G / G_max) * 100
    loss_pct_matrix = np.where(
        max_radiation > 0,
        ((max_radiation - radiation_annual_daily) / max_radiation) * 100.0,
        0.0
    )

    # Classification according to Spanish CTE DB-HE4 regulatory limits
    # General limit: <= 10%, Superposition: <= 20%, Integration: <= 40%
    cte_general_compliant = loss_pct_matrix <= 10.0
    cte_superposition_compliant = loss_pct_matrix <= 20.0
    cte_integration_compliant = loss_pct_matrix <= 40.0

    total_cells = float(loss_pct_matrix.size)
    gen_pct = round(float(np.sum(cte_general_compliant) / total_cells * 100.0), 1)
    sup_pct = round(float(np.sum(cte_superposition_compliant) / total_cells * 100.0), 1)
    int_pct = round(float(np.sum(cte_integration_compliant) / total_cells * 100.0), 1)

    # Generate 12 independent monthly capture loss maps (CTE DB-HE4)
    MONTH_NAMES_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    monthly_maps = []
    for m in range(12):
        m_rad = radiation_monthly[m]
        max_rad_m = float(np.max(m_rad))
        opt_indices_m = np.unravel_index(np.argmax(m_rad), m_rad.shape)
        opt_beta_m = float(betas[opt_indices_m[0]])
        opt_alpha_m = float(alphas[opt_indices_m[1]])

        loss_pct_m = np.where(
            max_rad_m > 0,
            ((max_rad_m - m_rad) / max_rad_m) * 100.0,
            0.0
        )
        gen_pct_m = round(float(np.sum(loss_pct_m <= 10.0) / total_cells * 100.0), 1)
        sup_pct_m = round(float(np.sum(loss_pct_m <= 20.0) / total_cells * 100.0), 1)
        int_pct_m = round(float(np.sum(loss_pct_m <= 40.0) / total_cells * 100.0), 1)

        monthly_maps.append({
            "monthIndex": m,
            "monthName": MONTH_NAMES_ES[m],
            "optimalPoint": {
                "betaDeg": opt_beta_m,
                "alphaDeg": opt_alpha_m,
                "maxDailyRadiationKwh": round(max_rad_m, 3),
            },
            "radiationMatrixKwhM2Day": [[round(float(v), 3) for v in row] for row in m_rad],
            "lossPercentageMatrix": [[round(float(v), 2) for v in row] for row in loss_pct_m],
            "cteZones": {
                "generalPctCompliant": gen_pct_m,
                "superpositionPctCompliant": sup_pct_m,
                "integrationPctCompliant": int_pct_m,
            },
        })

    return {
        "betas_deg": [round(float(b), 1) if abs(b - round(b)) > 0.01 else int(round(b)) for b in betas],
        "alphas_deg": [round(float(a), 1) if abs(a - round(a)) > 0.01 else int(round(a)) for a in alphas],
        "radiation_matrix_kwh_m2_day": [[round(float(v), 3) for v in row] for row in radiation_annual_daily],
        "loss_percentage_matrix": [[round(float(v), 2) for v in row] for row in loss_pct_matrix],
        "optimal_point": {
            "beta_deg": opt_beta_deg,
            "alpha_deg": opt_alpha_deg,
            "max_daily_radiation_kwh": round(max_radiation, 3),
            "annual_irradiation_kwh_m2": round(max_radiation * 365.0, 1),
            "betaDeg": opt_beta_deg,
            "alphaDeg": opt_alpha_deg,
            "maxDailyRadiationKwh": round(max_radiation, 3),
            "maxAnnualRadiationKwhM2": round(max_radiation * 365.0, 1),
        },
        "cte_zones": {
            "generalPctCompliant": gen_pct,
            "superpositionPctCompliant": sup_pct,
            "integrationPctCompliant": int_pct,
            "general_pct_compliant": gen_pct,
            "superposition_pct_compliant": sup_pct,
            "integration_pct_compliant": int_pct,
        },
        "cte_limits": {
            "optimal_threshold_pct": 5.0,
            "general_limit_pct": 10.0,
            "superposition_limit_pct": 20.0,
            "architectural_integration_limit_pct": 40.0,
        },
        "monthly_maps": monthly_maps,
        "monthlyMaps": monthly_maps,
    }
