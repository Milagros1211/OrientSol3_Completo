"""
Verification and Testing Script for OrientSol Radiative Decomposition and Transposition.

Tests and verifies:
1. Daily Extraterrestrial Irradiation: Bod0 (Bod0.m)
2. Horizontal Decomposition into Beam and Diffuse: Bdm0, Ddm0, Ktm, Kdm (Bdm0.m)
3. Hourly Radiative Components: Gh0, Dh0, Bh0 (Gh0.m, Dh0.m, Bh0.m)
4. Transposition to Inclined Surfaces across 91 angles: BdBeta, DdBeta, RdBeta, GdBeta
5. Determination of Annual Optimal Tilt: beta_opt and energy gain over horizontal
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
import time
from typing import Union
import numpy as np

# Handle imports whether executed directly or within package
try:
    from core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
    from core.conversions import deg2rad, rad2deg
    from core.declination import matriz_declinacion
    from core.sunset_angles import angulos_salida
    from core.hour_angles import angulos, angulos2
    from radiation.extraterrestrial import bod0
    from radiation.horizontal_decomposition import bdm0, decompose_horizontal_radiation, clearness_index
    from radiation.hourly_radiation import gh0, dh0, bh0
    from radiation.transposition import transpose_to_inclined_surfaces
except ImportError:
    from src.python.core.constants import CHARACTERISTIC_DAYS, MONTH_NAMES_ES
    from src.python.core.conversions import deg2rad, rad2deg
    from src.python.core.declination import matriz_declinacion
    from src.python.core.sunset_angles import angulos_salida
    from src.python.core.hour_angles import angulos, angulos2
    from src.python.radiation.extraterrestrial import bod0
    from src.python.radiation.horizontal_decomposition import bdm0, decompose_horizontal_radiation, clearness_index
    from src.python.radiation.hourly_radiation import gh0, dh0, bh0
    from src.python.radiation.transposition import transpose_to_inclined_surfaces


def run_full_radiation_test(
    latitude_deg: float = 40.4168,
    gdm0: Union[np.ndarray, list, None] = None,
    albedo: float = 0.20,
    city_name: str = "Madrid (España)",
):
    """
    Run complete verification of radiative decomposition and transposition pipeline.
    """
    if gdm0 is None:
        # Default Madrid global horizontal radiation [kWh/m2/day] from OrientSol BBDD.xlsx (Mean = 4.50 kWh/m2/day)
        gdm0 = np.array([2.00, 2.73, 4.48, 5.17, 6.58, 7.24, 7.32, 6.41, 4.97, 3.36, 2.15, 1.64])
    else:
        gdm0 = np.asarray(gdm0, dtype=np.float64)

    lat_rad = float(deg2rad(latitude_deg))

    print("=" * 86)
    print(f"ORIENTSOL - VERIFICACIÓN DE DESCOMPOSICIÓN RADIATIVA Y TRANSPOSICIÓN (NUMPY)")
    print("=" * 86)
    print(f"  Localidad: {city_name} | Latitud: {latitude_deg:+.4f}° ({lat_rad:+.5f} rad) | Albedo: {albedo:.2f}")
    print(f"  Radiación Global Horizontal Anual Media: {np.mean(gdm0):.3f} kWh/m²/día ({np.sum(gdm0)*365/12:.1f} kWh/m²/año)")
    print("-" * 86)

    t_start = time.perf_counter()

    # 1. Base Geometry
    val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
    ang_sal1, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
    numero_n, matriz_angulos = angulos(ang_sal1)
    numero_n2, matriz_angulos2 = angulos2(ang_salida)

    # 2. Extraterrestrial Radiation (Bod0.m)
    val_bod = bod0(CHARACTERISTIC_DAYS, lat_rad, val_decli, ang_sal1)

    # 3. Horizontal Beam and Diffuse Decomposition (Bdm0.m)
    val_bdm0, val_ddm0 = bdm0(val_bod, gdm0)
    ktm = clearness_index(gdm0, val_bod)

    # 4. Hourly Horizontal Components (Gh0.m, Dh0.m, Bh0.m)
    gh_matriz, matriz_rg = gh0(matriz_angulos, ang_sal1, numero_n, gdm0)
    dh_matriz, matriz_rd = dh0(matriz_angulos, ang_sal1, numero_n, val_ddm0)
    bh_matriz = bh0(gh_matriz, dh_matriz, numero_n)

    # 5. Transposition to 91 Inclined Surfaces and Annual Optimal Tilt (BdBeta, DhBeta, RhBeta, GhBeta, GdBeta, Calculos_optimo)
    results = transpose_to_inclined_surfaces(
        lat_rad=lat_rad,
        val_decli=val_decli,
        numero_n2=numero_n2,
        matriz_angulos2=matriz_angulos2,
        bh_matriz=bh_matriz,
        dh_matriz=dh_matriz,
        gh_matriz=gh_matriz,
        val_bdm0=val_bdm0,
        val_ddm0=val_ddm0,
        datos_or_gdm0=gdm0,
        albedo=albedo,
    )

    t_elapsed_ms = (time.perf_counter() - t_start) * 1000.0

    # Verification Table 1: Horizontal Decomposition
    print("\n[1. DESCOMPOSICIÓN HORIZONTAL ALL-SKY (Bdm0 y Ddm0)]")
    print("Mes | Bod0 (Wh/m²) | Gdm(0) (kWh/m²) | Ktm   | Ddm(0) (kWh/m²) | Bdm(0) (kWh/m²) | Comprobación G = B + D")
    print("----+--------------+-----------------+-------+-----------------+-----------------+------------------------")
    for m in range(12):
        name = MONTH_NAMES_ES[m][:3]
        bod = val_bod[m]
        g = gdm0[m]
        kt = ktm[m]
        d = val_ddm0[m]
        b = val_bdm0[m]
        balance = b + d
        diff = abs(balance - g)
        print(f"{name:3s} | {bod:12.1f} | {g:15.2f} | {kt:5.3f} | {d:15.2f} | {b:15.2f} | {balance:6.2f} (Delta={diff:.1e})")

    # Verification Table 2: Transposition Results at Optimal Angle
    opt_angle = results["opt_angle_deg"]
    mean_opt = results["media_global_opt"]
    rad_opt = results["radiacion_global_opt"]
    rad_bd_opt = results["radiacion_beam_opt"]
    rad_dd_opt = results["radiacion_diffuse_opt"]
    rad_rd_opt = results["radiacion_albedo_opt"]
    mean_g0 = np.mean(gdm0)
    gain_percent = ((mean_opt - mean_g0) / mean_g0) * 100.0

    print(f"\n[2. RESULTADOS DE TRANSPOSICIÓN A INCLINACIÓN ÓPTIMA ANUAL: beta = {opt_angle}°]")
    print(f"  • Inclinación óptima calculada:   {opt_angle}°")
    print(f"  • Radiación media anual horizontal: {mean_g0:.3f} kWh/m²/día")
    print(f"  • Radiación media a inclinación ópt.: {mean_opt:.3f} kWh/m²/día")
    print(f"  • Ganancia energética anual:        +{gain_percent:.2f}% sobre superficie horizontal")
    print("-" * 86)
    print("Mes | Gd(beta_opt) | Bd(beta_opt) | Dd(beta_opt) | Rd(beta_opt) | Ganancia Mensual vs Horizontal")
    print("----+--------------+--------------+--------------+--------------+--------------------------------")
    for m in range(12):
        name = MONTH_NAMES_ES[m][:3]
        g_opt = rad_opt[m]
        b_opt = rad_bd_opt[m]
        d_opt = rad_dd_opt[m]
        r_opt = rad_rd_opt[m]
        gain_m = ((g_opt - gdm0[m]) / gdm0[m]) * 100.0
        print(f"{name:3s} | {g_opt:12.2f} | {b_opt:12.2f} | {d_opt:12.2f} | {r_opt:12.2f} | {gain_m:+6.2f}%")

    # Verification Table 3: Multi-tilt Profile (10° increments from 10° to 90°)
    print(f"\n[3. PERFIL DE RADIACIÓN GLOBAL MEDIA ANUAL SEGÚN INCLINACIÓN (Calculos_optimo)]")
    tilts_10_90 = np.arange(10, 91, 10)
    media_rep = results["media_representar"]
    for t_idx, tilt in enumerate(tilts_10_90):
        val = media_rep[t_idx]
        star = " * (Cercano al optimo)" if abs(tilt - opt_angle) <= 5 else ""
        print(f"  Inclinación {tilt:2d}°: {val:.2f} kWh/m²/día{star}")

    print("-" * 86)
    print(f"✓ Pipeline de radiación ejecutado en {t_elapsed_ms:.2f} ms (Vectorización NumPy completa).")
    print("=" * 86)


if __name__ == "__main__":
    run_full_radiation_test(latitude_deg=40.4168, city_name="Madrid (España)")
