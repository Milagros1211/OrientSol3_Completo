# Solar Radiation Module (`radiation/`)

This module will contain irradiance calculations:
- `Bod0.m` -> `extraterrestrial.py`: Daily extraterrestrial irradiation on horizontal plane ($B_{od}(0)$).
- `Bdm0.m` -> `horizontal_decomposition.py`: Separation of global horizontal into beam ($B_{dm}(0)$) and diffuse ($D_{dm}(0)$) using Liu-Jordan clearness index ($K_t$).
- `Bh0.m`, `Dh0.m`, `Gh0.m` -> `hourly_radiation.py`: Hourly extraterrestrial, diffuse, and global irradiance components.
- `BdBeta.m`, `DhBeta.m`, `RhBeta.m`, `GdBeta.m` -> `tilted_surface.py`: Transposition of radiation to surface with tilt ($\beta$) and orientation ($\alpha$) including albedo reflection.
