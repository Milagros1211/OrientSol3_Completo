# OrientSol Python Engine

This directory contains the Python calculation engine designed to run in the browser via **Pyodide** (WebAssembly) and natively in desktop runtimes.

> [!NOTE]
> Architecture strictly mirrors OrientSol's calculation pipeline while modernizing the code with vectorization, type hints, and clean scientific modularity.
>
> *No `.m` files are translated yet in this step, per project requirements.*

## Package Structure

```
src/python/
├── core/             # Solar geometry, astronomical angles, declination, sunrise/sunset
├── radiation/        # Extraterrestrial, horizontal, and tilted-plane irradiance models
├── tracking/         # Solar trackers: 2-axis, polar 1-axis, horizontal 1-axis, azimuth 1-axis
├── optimization/     # Optimal tilt algorithms: annual optimum & seasonal optimum (4 seasons)
├── energy/           # PV cell temperature, Osterwald models, and energy yield
└── bridge/           # JSON serialization bridge connecting TypeScript Pyodide to Python
```

## Module Mapping Roadmap

| MATLAB Script (.m) | Python Target Module | Status |
| :--- | :--- | :--- |
| `matriz_declinacion.m`, `Angulos.m`, `AngulosSalida.m`, `Altura_Solar.m`, `Azimut_Solar.m` | `core/` | Scaffolded (Pending translation) |
| `Bod0.m`, `Bdm0.m`, `Bh0.m`, `Dh0.m`, `Gh0.m`, `BdBeta.m`, `DhBeta.m`, `RhBeta.m`, `GdBeta.m` | `radiation/` | Scaffolded (Pending translation) |
| `Bd_2Ejes.m`, `Bd_EjePolar.m`, `Bd_EjeAzimutal.m`, `Bd_EjeHorizontal.m`, `Ganancias_*.m` | `tracking/` | Scaffolded (Pending translation) |
| `Calculos_optimo.m`, `Calculo_Optimo_Estacion.m`, `Bd_OptEstacional.m` | `optimization/` | Scaffolded (Pending translation) |
| `Energia.m`, `Energia_Osterwald.m`, `Energia_Osterwald_N.m` | `energy/` | Scaffolded (Pending translation) |
