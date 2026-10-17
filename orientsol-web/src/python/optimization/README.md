# Módulo de Optimización Solar y Pérdidas (`optimization/`)

Este módulo implementa los algoritmos de optimización de orientación e inclinación para superficies fijas y el cálculo de matrices de pérdidas de captación.

---

## Archivos y Equivalencias con MATLAB

| Archivo Python | Scripts MATLAB Originales | Descripción del Algoritmo |
| :--- | :--- | :--- |
| `surface_optimizer.py` | `Calculos_optimo.m` | **Inclinación Óptima Anual ($\beta_{opt}$):** Búsqueda exhaustiva discretizada con paso de $1^\circ$ en el rango $[0^\circ, 90^\circ]$ para maximizar la captación anual total ($G_{anual}$). Devuelve ángulo óptimo, radiación mensual y factores de ganancia. |
| `seasonal_optimizer.py` | `Calculo_Optimo_Estacion.m`, `Bd_OptEstacional.m`, `Dd_OptEstacional.m`, `Rd_OptEstacional.m` | **Inclinación Óptima Estacional:** Optimización independiente para las 4 estaciones del año (Invierno, Primavera, Verano, Otoño), calculando la inclinación ideal de cada período y la ganancia acumulada. |
| `monthly_optimum.py` | *(Ampliación OrientSol 4.0)* | **Inclinación Óptima Mensual:** Determina el ángulo óptimo específico para cada uno de los 12 meses del año, simulando sistemas con ajuste manual mensual ($\approx +15\%$ de ganancia sobre plano horizontal). |
| `loss_maps.py` | *(Ampliación OrientSol 4.0)* | **Mapa de Pérdidas de Captación (CTE DB-HE4):** Genera una matriz bidimensional $(\beta \in [0^\circ, 90^\circ] \times \alpha \in [-90^\circ, +90^\circ])$ calculando el porcentaje de pérdidas respecto al óptimo anual y clasificándolo según los límites de la normativa española del Código Técnico de la Edificación. |

---

## Estado de Validación
- Verificado y probado con éxito en [`test_surface_and_loss_maps.py`](../test_surface_and_loss_maps.py). Ángulo óptimo anual obtenido para Madrid: $\beta_{opt} = 31^\circ$ (idéntico al resultado de MATLAB).
