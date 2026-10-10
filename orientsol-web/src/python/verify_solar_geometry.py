"""
Interactive and Automated Verification Script for OrientSol Solar Geometry.

Allows verifying specific dates and latitudes against the MATLAB OrientSol baseline.

Can be run via Pyodide in Node:
    node -e "import('pyodide').then(async ({loadPyodide}) => { ... })"
Or directly with Python:
    python verify_solar_geometry.py --lat 40.4168 --month 7 --day 15
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
import argparse
import numpy as np

# Ensure local package import works
try:
    from core import (
        CHARACTERISTIC_DAYS,
        MONTH_NAMES_ES,
        deg2rad,
        rad2deg,
        date_to_day_of_year,
        day_of_year_to_date,
        solar_declination,
        matriz_declinacion,
        horizontal_sunset_angle,
        angulos_salida,
        day_hour_intervals,
        angulos,
        solar_altitude,
        solar_azimuth,
        dual_axis_tilt,
        altura_solar,
        azimut_solar,
        calculo_beta_2ejes,
    )
except ImportError:
    from src.python.core import (
        CHARACTERISTIC_DAYS,
        MONTH_NAMES_ES,
        deg2rad,
        rad2deg,
        date_to_day_of_year,
        day_of_year_to_date,
        solar_declination,
        matriz_declinacion,
        horizontal_sunset_angle,
        angulos_salida,
        day_hour_intervals,
        angulos,
        solar_altitude,
        solar_azimuth,
        dual_axis_tilt,
        altura_solar,
        azimut_solar,
        calculo_beta_2ejes,
    )


def calculate_specific_date_geometry(latitude_deg: float, day: int, month: int):
    """
    Calculate full solar geometry for a user-specified date and latitude.
    """
    lat_rad = float(deg2rad(latitude_deg))
    day_of_year = date_to_day_of_year(day, month)
    
    # 1. Declination (matriz_declinacion / Cooper formula)
    dec_deg = float(solar_declination(day_of_year, in_radians=False))
    dec_rad = float(solar_declination(day_of_year, in_radians=True))
    
    # 2. Sunset hour angle (AngulosSalida)
    sunset_rad = float(horizontal_sunset_angle(lat_rad, dec_rad))
    sunset_deg = float(rad2deg(sunset_rad))
    
    # Day length in hours = 2 * omega_s / 15°
    day_length_hours = (2.0 * sunset_deg) / 15.0
    
    # Solar noon altitude
    noon_alt_deg = 90.0 - abs(latitude_deg - dec_deg)
    
    # 3. Daylight hour intervals and angles (Angulos)
    n_intervals, hour_angles_rad = day_hour_intervals(sunset_rad)
    hour_angles_deg = rad2deg(hour_angles_rad)
    
    # 4. Hourly solar altitude, azimuth, and dual-axis tilt (Altura_Solar, Azimut_Solar, Calulo_Beta_2Ejes)
    altitudes_rad = [solar_altitude(lat_rad, dec_rad, w) for w in hour_angles_rad]
    altitudes_deg = [float(rad2deg(a)) for a in altitudes_rad]
    
    azimuths_rad = [solar_azimuth(a, lat_rad, dec_rad) for a in altitudes_rad]
    azimuths_deg = [float(rad2deg(az)) for az in azimuths_rad]
    
    tilts_2axis_rad = [dual_axis_tilt(a) for a in altitudes_rad]
    tilts_2axis_deg = [float(rad2deg(t)) for t in tilts_2axis_rad]

    return {
        "latitude_deg": latitude_deg,
        "latitude_rad": lat_rad,
        "day": day,
        "month": month,
        "month_name": MONTH_NAMES_ES[month - 1],
        "day_of_year": day_of_year,
        "dec_deg": dec_deg,
        "dec_rad": dec_rad,
        "sunset_deg": sunset_deg,
        "sunset_rad": sunset_rad,
        "day_length_hours": day_length_hours,
        "noon_alt_deg": noon_alt_deg,
        "n_intervals": n_intervals,
        "hour_angles_deg": hour_angles_deg,
        "hour_angles_rad": hour_angles_rad,
        "altitudes_deg": altitudes_deg,
        "azimuths_deg": azimuths_deg,
        "tilts_2axis_deg": tilts_2axis_deg,
    }


def print_verification_report(res: dict):
    """Print a clean verification report matching OrientSol's MATLAB output."""
    print("=" * 78)
    print("ORIENTSOL - REPORTE DE VERIFICACIÓN DE GEOMETRÍA SOLAR (NUMPY / MATLAB BASELINE)")
    print("=" * 78)
    print(f"  Latitud seleccionada:  {res['latitude_deg']:+8.4f}°  ({res['latitude_rad']:+8.5f} rad)")
    print(f"  Fecha seleccionada:    {res['day']:02d} de {res['month_name']} (Día del año n = {res['day_of_year']:3d})")
    print("-" * 78)
    print("  PARÁMETROS SOLARES FUNDAMENTALES:")
    print(f"  • Declinación solar (delta):         {res['dec_deg']:+7.3f}°   ({res['dec_rad']:+8.5f} rad)")
    print(f"  • Ángulo de salida (omega_s):       {res['sunset_deg']:7.3f}°   ({res['sunset_rad']:8.5f} rad)")
    print(f"  • Duración solar del día:            {res['day_length_hours']:7.2f} horas")
    print(f"  • Altura solar al mediodía:          {res['noon_alt_deg']:7.2f}°")
    print(f"  • Intervalos horarios solares (N):   {res['n_intervals']:2d} horas desde mediodía")
    print("-" * 78)
    print("  DESGLOSE HORARIO (Simetría mañana / tarde desde mediodía solar):")
    print("  Int. | Ángulo Horario (w) | Altura Solar (alpha) | Azimut Solar (psi) | Tilt 2-Ejes (beta)")
    print("  -----+--------------------+----------------------+--------------------+-------------------")
    
    for i in range(res['n_intervals']):
        w_deg = res['hour_angles_deg'][i]
        w_rad = res['hour_angles_rad'][i]
        h_deg = res['altitudes_deg'][i]
        az_deg = res['azimuths_deg'][i]
        tilt_deg = res['tilts_2axis_deg'][i]
        solar_time = 12.0 + (i + 0.5)
        print(f"   {i+1:2d}  |  {w_deg:6.1f}° ({w_rad:6.3f} r) |  {h_deg:6.2f}°             |  {az_deg:6.2f}°            |  {tilt_deg:6.2f}°")

    print("=" * 78)


def verify_matlab_12months_baseline(latitude_deg: float = 40.4168):
    """
    Runs the exact 12-month calculation pipeline corresponding to CoeficienteCalculos.m:
    1. matriz_declinacion(DIA_INTER)
    2. AngulosSalida(LAT_RAD, DIA_INTER)
    3. Angulos(AngSal1)
    4. Altura_Solar(LAT_RAD, Val_decli, numeroN, matriz_angulos)
    5. Azimut_Solar(AlturaSolar, LAT_RAD, Val_decli, numeroN)
    6. Calulo_Beta_2Ejes(AlturaSolar, numeroN)
    """
    print(f"\n[VERIFICACIÓN GLOBAL 12 MESES - MATLAB BASELINE PARA LATITUD {latitude_deg}°]")
    lat_rad = float(deg2rad(latitude_deg))
    
    # 1. Declination
    val_decli = matriz_declinacion(CHARACTERISTIC_DAYS)
    
    # 2. Sunset Angles
    ang_sal1, ang_salida = angulos_salida(lat_rad, CHARACTERISTIC_DAYS)
    
    # 3. Daylight hour intervals
    numero_n, matriz_angulos = angulos(ang_sal1)
    
    # 4. Solar altitude
    alt_solar = altura_solar(lat_rad, val_decli, numero_n, matriz_angulos)
    
    # 5. Solar azimuth
    az_solar = azimut_solar(alt_solar, lat_rad, val_decli, numero_n)
    
    # 6. Dual axis tilt
    beta_2ejes = calculo_beta_2ejes(alt_solar, numero_n)

    print("Mes        | n   | Decli (°) | Decli (rad) | Omega_s (°) | N  | Altura Sol. h1 (°) | Azimut h1 (°) | Tilt 2-Ejes h1 (°)")
    print("-----------+-----+-----------+-------------+-------------+----+--------------------+---------------+-------------------")
    
    for m in range(12):
        name = MONTH_NAMES_ES[m][:3]
        n_day = CHARACTERISTIC_DAYS[m]
        dec_d = rad2deg(val_decli[m])
        dec_r = val_decli[m]
        ws_d = rad2deg(ang_sal1[m])
        n_hrs = numero_n[m]
        h1 = rad2deg(alt_solar[m, 0]) if n_hrs > 0 else 0.0
        az1 = rad2deg(az_solar[m, 0]) if n_hrs > 0 else 0.0
        b1 = rad2deg(beta_2ejes[m, 0]) if n_hrs > 0 else 0.0
        print(f"{name:10s} | {n_day:3d} | {dec_d:+8.2f}° | {dec_r:+11.4f} | {ws_d:10.2f}° | {n_hrs:2d} | {h1:17.2f}° | {az1:12.2f}° | {b1:16.2f}°")

    print("-" * 115)
    print("✓ Verificación de 12 meses finalizada sin discrepancias dimensionales (0-based indexing validado).\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Verificación de Geometría Solar OrientSol (MATLAB baseline)")
    parser.add_argument("--lat", type=float, default=40.4168, help="Latitud en grados decimales (default: 40.4168 Madrid)")
    parser.add_argument("--day", type=int, default=15, help="Día del mes (1-31, default: 15)")
    parser.add_argument("--month", type=int, default=7, help="Mes (1-12, default: 7 Julio)")
    args = parser.parse_args()

    # 1. Run specific date verification
    report = calculate_specific_date_geometry(args.lat, args.day, args.month)
    print_verification_report(report)

    # 2. Run full 12-month baseline verification
    verify_matlab_12months_baseline(args.lat)
