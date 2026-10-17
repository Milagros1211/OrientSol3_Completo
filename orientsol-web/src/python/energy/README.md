# Módulo de Energía Fotovoltaica (`energy/`)

Este módulo implementa los modelos de conversión electrotérmica y cálculo de producción eléctrica anual a partir de la radiación incidente, temperatura ambiental y características del módulo solar.

---

## Archivos y Equivalencias con MATLAB

| Archivo Python | Scripts MATLAB Originales | Descripción del Modelo Fotovoltaico |
| :--- | :--- | :--- |
| `energy_yield.py` & `simplified.py` | `Energia.m` | **Modelo Energético Simplificado:** Estimación de producción anual a través del rendimiento global de la instalación (*Performance Ratio* $PR$): $E = P_{pico} \cdot \frac{G(\beta)}{G_{STC}} \cdot PR$. |
| `osterwald.py` | `Energia_Osterwald.m` | **Modelo Térmico de Osterwald:** Modelo riguroso que calcula la potencia instantánea considerando las pérdidas por temperatura: $P = P_{STC} \cdot \frac{G}{G_{STC}} \cdot [1 + \gamma \cdot (T_c - 25^\circ\text{C})]$, integrando mes a mes la energía generada. |
| `temperatures.py` | `Energia_Osterwald_N.m` | **Temperatura de Célula ($T_c$) y Perfiles Térmicos:** Cálculo de la temperatura de trabajo de los módulos fotovoltaicos en base a la TONC / NOCT ($45^\circ\text{C} - 48^\circ\text{C}$): $T_c = T_{amb} + \frac{TONC - 20}{800} \cdot G_h$, con evaluación de temperaturas medias y picos de operación. |

---

## Estado de Validación
- Verificado y probado con éxito en [`test_energy_models.py`](../test_energy_models.py). Producción calculada para instalación estándar de $5\text{ kWp}$ en Madrid:
  - Fija óptima anual ($31^\circ$): $7215\text{ kWh/año}$ (Simplificado) / $9080\text{ kWh/año}$ (Osterwald).
  - Seguimiento 2 ejes: $9501\text{ kWh/año}$ (Simplificado) / $11811\text{ kWh/año}$ (Osterwald).
