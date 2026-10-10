# Photovoltaic Energy Module (`energy/`)

This module will contain PV power and energy production models:
- `Energia.m` -> `pv_yield.py`: Base energy calculation from incident radiation.
- `Energia_Osterwald.m` -> `osterwald_model.py`: Thermal model incorporating ambient temperature, NOCT (Nominal Operating Cell Temperature), irradiance, and temperature power loss coefficient $\gamma$.
- `Energia_Osterwald_N.m` -> `osterwald_extended.py`: Multi-technology PV evaluation with loss factors.
