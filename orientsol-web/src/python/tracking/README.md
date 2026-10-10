# Solar Tracking Module (`tracking/`)

This module will contain algorithms for solar tracking geometries and energy gains:
- `Bd_2Ejes.m`, `Dd_2Ejes.m`, `Gd_2Ejes.m`, `Calulo_Beta_2Ejes.m` -> `dual_axis.py`: Complete 2-axis solar tracking.
- `Bd_EjePolar.m`, `Dd_EjePolar.m`, `Gd_EjePolar.m` -> `polar_axis.py`: 1-axis polar tracking with axis tilted at site latitude.
- `Bd_EjeAzimutal.m`, `Dd_EjeAzimutal.m`, `Gd_EjeAzimutal.m` -> `azimuthal_axis.py`: 1-axis vertical/azimuthal tracking with fixed inclination.
- `Bd_EjeHorizontal.m`, `Dd_EjeHorizontal.m`, `Gd_EjeHorizontal.m` -> `horizontal_axis.py`: 1-axis horizontal north-south tracking.
- `Ganancias_*.m` -> `gains.py`: Relative gain percentages over horizontal and fixed optimal systems.
