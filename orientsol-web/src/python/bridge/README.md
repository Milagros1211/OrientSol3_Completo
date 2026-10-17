# Puente de Comunicación Python-TypeScript (`bridge/`)

Este módulo proporciona la interfaz de despacho y serialización para la ejecución del motor científico dentro de **Pyodide** (WebAssembly en el navegador) y en Electron (escritorio).

---

## Funcionalidades del Puente

1. **Protocolo de Mensajería Bidireccional:**
   - La capa de presentación en TypeScript (`solarCalculationBridge.ts`) envía los parámetros de cálculo en formato JSON estandarizado (latitud, radiación mensual $G_{dm}(0)$, temperatura mensual $T_{amb}$, albedo $\rho$, potencia pico, etc.).
   - El motor Python recibe el payload, valida los rangos de entrada, ejecuta los algoritmos vectorizados con NumPy y serializa los resultados a estructuras JSON puras listas para ser graficadas en la interfaz de usuario.

2. **Detección Condicional de Entorno Dual:**
   - Detecta automáticamente si se encuentra ejecutándose en modo **Web Online** (cargando recursos desde CDN de jsdelivr) o en modo **Desktop Offline (Electron)** (cargando los binarios WebAssembly de Pyodide y NumPy directamente desde el sistema de archivos local `file:///`).

3. **Resiliencia y Pruebas:**
   - Verificado con tests unitarios en [`scripts/test-api-bridge.mjs`](../../../scripts/test-api-bridge.mjs) y [`scripts/test-pyodide-env.mjs`](../../../scripts/test-pyodide-env.mjs).
