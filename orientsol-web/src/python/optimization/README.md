# Solar Optimization Module (`optimization/`)

This module will contain optimization algorithms for collector tilt:
- `Calculos_optimo.m` -> `annual_optimum.py`: Discretized search over 0° to 90° for maximum annual global radiation $\beta_{opt}$.
- `Calculo_Optimo_Estacion.m` -> `seasonal_optimum.py`: Multi-seasonal optimization for Winter, Spring, Summer, Autumn tilts.
- `Bd_OptEstacional.m`, `Dd_OptEstacional.m`, `Rd_OptEstacional.m` -> `seasonal_radiation.py`: Radiation integration with seasonal tilt adjustments.
