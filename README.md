# OrientSol 3.0: Entorno Web para Optimización Solar Fotovoltaica

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Sitio%20En%20Vivo-brightgreen?logo=github)](https://Milagros1211.github.io/OrientSol3_Completo/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Milagros1211%2FOrientSol3__Completo-blue?logo=github)](https://github.com/Milagros1211/OrientSol3_Completo)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-TypeScript-646CFF?logo=vite)](https://vitejs.dev/)
[![Engine](https://img.shields.io/badge/WebAssembly-Pyodide%20%2B%20NumPy-F7931E?logo=webassembly)](https://pyodide.org/)
[![Multiplatform](https://img.shields.io/badge/Multiplatform-Web%20%7C%20Windows%20%7C%20Android-4CAF50)](https://capacitorjs.com/)

> 🌐 **Enlace Permanente del Software en Vivo:**  
> 👉 [https://Milagros1211.github.io/OrientSol3_Completo/](https://Milagros1211.github.io/OrientSol3_Completo/)

---

## 📌 Contexto Académico

- **Institución:** Universidad de Jaén (UJA) — Escuela Politécnica Superior.
- **Programa:** Máster Universitario en Energías Renovables.
- **Trabajo Fin de Máster (TFM):** *Desarrollo de un entorno software para optimización de posición y movimiento de superficies receptoras de radiación solar en un sistema fotovoltaico.*
- **Autora:** Karina Milagros Baldeón Zárate.
- **Directores del TFM:** Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas (Dpto. de Ingeniería Electrónica y Automática).

---

## ☀️ ¿Qué es OrientSol 3.0?

**OrientSol 3.0** es la modernización y evolución web del software original desarrollado en **MATLAB/Octave (`.m` y `.fig`)**. Ha sido transformado en una suite de simulación solar abierta, interactiva y multiplataforma basada en tecnologías de vanguardia:

1. **Interfaz Web Responsiva y Bilingüe (ES / EN):** Funciona directamente en cualquier navegador moderno sin instalaciones ni licencias de software propietario.
2. **Motor Científico en el Navegador (WebAssembly + Pyodide + NumPy):** Ejecuta la formulación matemática solar en el cliente en milisegundos con total privacidad.
3. **Arquitectura Híbrida de Datos:**
   - **APIs Satelitales en Tiempo Real:** NASA POWER, PVGIS y Open-Meteo.
   - **Base de Datos Histórica:** Localidades españolas, albedos y días característicos.
   - **Carga Dual:** Formulario manual de 12 meses y subida de archivos digitales (`CSV` y `JSON`).
4. **Modelos de Simulación y Optimización Solar:**
   - **Inclinación Óptima Anual y Comparativa con Ángulo X:** Reproducción fiel y modernizada de la interfaz original de MATLAB (`Tabla_OptAnual.m` y `Tabla_OptAnual_IncliX.m`) en formato tabular interactivo. Permite visualizar las 7 inclinaciones fijas de referencia (0°, 15°, 30°, 45°, 60°, 75°, 90°), la inclinación óptima calculada ($\beta_{opt}$) y comparar en tiempo real contra cualquier ángulo seleccionado $X \in [1^\circ, 90^\circ]$ para todas las componentes solares (Global, Directa, Difusa, Albedo), desglosando factores y porcentajes de ganancia mensuales y anuales con exportación directa a Excel (CSV).
   - **Superficies Fijas:** Inclinación óptima anual, 4 posiciones estacionales y 12 posiciones mensuales.
   - **Seguimiento Solar:** Eje horizontal (N-S y E-O), eje polar, eje azimutal y seguimiento completo a 2 ejes.
   - **Generación Energética Fotovoltaica:** Modelo térmico de Osterwald con cálculo de temperatura de célula ($T_c$) y pérdidas térmicas.
   - **Mapas de Pérdidas de Captación:** Clasificación según normativa del Código Técnico de la Edificación (**CTE DB-HE4**).
5. **Distribución Multiplataforma:**
   - **Web / PWA:** Ejecución online y offline con Service Worker.
   - **Windows:** Aplicación nativa de escritorio con Electron (`.exe`).
   - **Android:** Aplicación móvil nativa con Capacitor (`.apk`).

---

## 📋 Guía de Plantillas y Formatos para la Carga de Emplazamientos (CSV / JSON)

OrientSol 3.0 incluye un motor universal de ingesta digital capaz de procesar archivos de climatología tanto para **un único emplazamiento** como para un **lote de múltiples emplazamientos simultáneos (Batch)**. Los archivos subidos se validan matemáticamente, se cargan en el motor de cálculo y se registran automáticamente en la base de datos de **Supabase** (tabla `datos_mensuales`) o en la caché offline si no hay conexión a Internet.

---

### 1. Formatos para Cargar un ÚNICO Emplazamiento

#### A. Formato CSV Individual (Vertical - Recomendado)
Este formato consta de cabeceras de metadatos precedidas por `#` y 12 filas con los datos de cada mes del año:

```csv
# OrientSol 3.0 - Plantilla de Climatología Individual
# Localidad: Jaén
# Pais: España
# Latitud: 37.7796
# Longitud: -3.7849
# Altitud: 570
# Albedo: 0.20
Mes,Gdm0_kWh_m2_dia,Temperatura_C
1,2.45,9.2
2,3.31,10.5
3,4.68,13.8
4,5.82,16.5
5,6.95,20.8
6,7.92,26.1
7,8.10,29.4
8,7.25,28.9
9,5.54,24.5
10,3.95,19.1
11,2.75,13.2
12,2.18,10.0
```

> **Significado de Columnas:**
> - `Mes`: Número del mes del 1 al 12.
> - `Gdm0_kWh_m2_dia`: Radiación solar global sobre superficie horizontal media diaria ($G_{dm}(0)$) en $\text{kWh/m}^2/\text{día}$. *(Si se introducen valores superiores a 25, OrientSol detecta automáticamente que es radiación acumulada mensual en $\text{kWh/m}^2/\text{mes}$ y la divide entre los días del mes para normalizarla).*
> - `Temperatura_C`: Temperatura media ambiental ($T_{amb}$) en grados Celsius ($^{\circ}\text{C}$).

---

#### B. Formato CSV Individual (Horizontal)
Distribución en filas horizontales compactas:

```csv
Mes,1,2,3,4,5,6,7,8,9,10,11,12
Gdm0,2.45,3.31,4.68,5.82,6.95,7.92,8.10,7.25,5.54,3.95,2.75,2.18
Tamb,9.2,10.5,13.8,16.5,20.8,26.1,29.4,28.9,24.5,19.1,13.2,10.0
```

---

#### C. Formato JSON Individual
Estructura en objeto JSON estándar:

```json
{
  "locationName": "Jaén",
  "country": "España",
  "latitude": 37.7796,
  "longitude": -3.7849,
  "elevationM": 570,
  "albedo": 0.20,
  "monthlyGdm0": [2.45, 3.31, 4.68, 5.82, 6.95, 7.92, 8.10, 7.25, 5.54, 3.95, 2.75, 2.18],
  "monthlyTemperature": [9.2, 10.5, 13.8, 16.5, 20.8, 26.1, 29.4, 28.9, 24.5, 19.1, 13.2, 10.0],
  "notes": "Instalación Solar Jaén - Entrada Individual"
}
```

---

### 2. Formatos para Cargar MÚLTIPLES Emplazamientos (Lote / Batch)

#### A. Formato CSV Multi-Emplazamiento (Lote Tabular)
Permite subir decenas o cientos de emplazamientos en un solo archivo delimitado por punto y coma `;` o coma `,`:

```csv
emplazamiento;pais;latitud;longitud;mes;radiacion_media;temp_media
Jaén;España;37.77;-3.78;1;2.45;9.2
Jaén;España;37.77;-3.78;2;3.31;10.5
Jaén;España;37.77;-3.78;3;4.68;13.8
Jaén;España;37.77;-3.78;4;5.82;16.5
Jaén;España;37.77;-3.78;5;6.95;20.8
Jaén;España;37.77;-3.78;6;7.92;26.1
Jaén;España;37.77;-3.78;7;8.10;29.4
Jaén;España;37.77;-3.78;8;7.25;28.9
Jaén;España;37.77;-3.78;9;5.54;24.5
Jaén;España;37.77;-3.78;10;3.95;19.1
Jaén;España;37.77;-3.78;11;2.75;13.2
Jaén;España;37.77;-3.78;12;2.18;10.0
Madrid;España;40.41;-3.70;1;2.14;6.1
Madrid;España;40.41;-3.70;2;3.15;7.9
Madrid;España;40.41;-3.70;3;4.48;11.2
Madrid;España;40.41;-3.70;4;5.51;13.5
Madrid;España;40.41;-3.70;5;6.62;17.8
Madrid;España;40.41;-3.70;6;7.54;23.3
Madrid;España;40.41;-3.70;7;7.78;27.8
Madrid;España;40.41;-3.70;8;6.84;26.7
Madrid;España;40.41;-3.70;9;5.25;22.0
Madrid;España;40.41;-3.70;10;3.52;15.9
Madrid;España;40.41;-3.70;11;2.36;10.1
Madrid;España;40.41;-3.70;12;1.84;6.9
```

---

#### B. Formato JSON Multi-Emplazamiento (Array de Objetos)
Un arreglo (`[]`) que contiene la lista de emplazamientos con sus 12 valores mensuales correspondientes:

```json
[
  {
    "locationName": "Jaén",
    "country": "España",
    "latitude": 37.7796,
    "longitude": -3.7849,
    "elevationM": 570,
    "monthlyGdm0": [2.45, 3.31, 4.68, 5.82, 6.95, 7.92, 8.10, 7.25, 5.54, 3.95, 2.75, 2.18],
    "monthlyTemperature": [9.2, 10.5, 13.8, 16.5, 20.8, 26.1, 29.4, 28.9, 24.5, 19.1, 13.2, 10.0]
  },
  {
    "locationName": "Madrid",
    "country": "España",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "elevationM": 667,
    "monthlyGdm0": [2.14, 3.15, 4.48, 5.51, 6.62, 7.54, 7.78, 6.84, 5.25, 3.52, 2.36, 1.84],
    "monthlyTemperature": [6.1, 7.9, 11.2, 13.5, 17.8, 23.3, 27.8, 26.7, 22.0, 15.9, 10.1, 6.9]
  }
]
```

---

### 3. Descarga Directa de Plantillas desde la Aplicación Web
Para facilitar la creación de tus archivos, la plataforma cuenta con botones de descarga directa en la pestaña **3. Subida Digital (CSV / JSON)**:
1. `Descargar Plantilla CSV`: Genera la plantilla individual `.csv`.
2. `Plantilla CSV (Lote Multi)`: Genera la plantilla de lote con múltiples ciudades `.csv`.
3. `Descargar Plantilla JSON`: Genera la plantilla individual `.json`.
4. `Plantilla JSON (Lote Multi)`: Genera el array con múltiples ciudades `.json`.

---

## 🌐 Cómo Activar el Hosting Permanente en GitHub Pages (Paso a Paso)

Tu aplicación web se aloja de forma **100% gratuita, permanente y sin límite de tiempo** en los servidores de GitHub Pages.

### Paso 1: Ir a la configuración de Pages en tu repositorio
Abre en tu navegador la siguiente dirección directa:  
👉 [https://github.com/Milagros1211/OrientSol3_Completo/settings/pages](https://github.com/Milagros1211/OrientSol3_Completo/settings/pages)

### Paso 2: Seleccionar la fuente de despliegue
En la sección **Build and deployment**:
1. En el desplegable **Source**, selecciona: **Deploy from a branch**.
2. En el desplegable **Branch**:
   - Selecciona la rama: **`gh-pages`**
   - Carpeta: **`/ (root)`**
3. Haz clic en el botón **Save**.

*(Nota: La rama `gh-pages` ya fue creada y subida al repositorio con la compilación optimizada del proyecto).*

### Paso 3: Confirmación y Acceso Permanente
En aproximadamente 60 segundos, verás un mensaje verde en la parte superior confirmando:
> *"Your site is live at https://Milagros1211.github.io/OrientSol3_Completo/"*

A partir de ese momento, el enlace quedará **activo de forma permanente las 24 horas del día**, listo para incluirlo en la memoria del TFM y para ser evaluado por el tribunal.

---

### 🔄 ¿Cómo actualizar el sitio web cuando hagas cambios en el código?

Siempre que realices mejoras en la aplicación, puedes volver a desplegar la versión actualizada ejecutando un solo comando desde tu terminal:

```powershell
# Desde la carpeta raíz del proyecto:
npm run deploy
```

Este comando recompila automáticamente la aplicación y actualiza la rama `gh-pages` en GitHub al instante.

---

## 📊 Estado de Cumplimiento de los Objetivos del TFM

En base al documento oficial aprobado: **`[Master EERR] FormatoPropuestaTFMKarinaBaldeon.pdf`**

### 1. Matriz de Objetivos de la Propuesta

| Objetivo / Requisito | Estado | Nivel | Detalle de Implementación |
|---|:---:|:---:|---|
| **Objetivo Principal:** Entorno web para adaptar y perfeccionar OrientSol 3.0 | ✅ Cumplido | 100% | Aplicación SPA/PWA con Vite, TypeScript, Pyodide (Python WASM) y diseño responsive. |
| **Obj. Sec. 1:** Ampliar y actualizar base de datos del programa | ✅ Cumplido | 90% | BBDD en `locations.ts`, `albedo.ts`, tablas IDAE y soporte para más de 50 estaciones. |
| **Obj. Sec. 2:** Arquitectura híbrida (APIs internacionales + BBDD local) | ✅ Cumplido | 100% | Conectores para NASA POWER, PVGIS y Open-Meteo con fallback a BBDD local. |
| **Obj. Sec. 3:** Carga dual (Manual + Subida de documentos externos) | ✅ Cumplido | 100% | Formulario de entrada manual de 12 meses y subida de archivos CSV/JSON con plantillas. |
| **Obj. Sec. 4.a:** Cálculo de Temperaturas (Máx, Mín, Medias y de Célula $T_c$) | ✅ Cumplido | 100% | Implementado en `temperatures.py` y visualizado en tarjetas métricas en tiempo real. |
| **Obj. Sec. 4.b:** Cálculo de Energía Recibida ($kWh/m^2$ y total) | ✅ Cumplido | 100% | Radiación global sobre superficie fija y seguidores en `energy_yield.py`. |
| **Obj. Sec. 4.c:** Cálculo de Energía Producida (Modelo Osterwald) | ✅ Cumplido | 100% | Modelo de Osterwald en `osterwald.py` con coeficientes $\gamma$, $T_{NOCT}$ y PR. |
| **Obj. Sec. 4.d:** Mapas de Pérdidas de Captación (Normativa CTE) | ✅ Cumplido | 100% | Matriz de inclinación y orientación con clasificación de zonas según CTE DB-HE4. |
| **Obj. Sec. 5:** Ejecutable multiplataforma (Windows y Android) | 🟡 Configurado | 85% | Código base listo en `electron/` (Windows) y `android/` (Capacitor). |
| **Obj. Sec. 6:** Interfaz web única sin requerir instalación | ✅ Cumplido | 100% | Funciona 100% en el navegador y alojada en GitHub Pages. |
| **Obj. Sec. 7:** Sistema bilingüe (Español e Inglés) | ✅ Cumplido | 100% | Soporte multilingüe en `src/i18n/` con selector reactivo y persistencia local. |

---

### 2. Tareas Pendientes para Completar el TFM (Checklist)

Para la finalización exitosa del Máster y la defensa ante el tribunal evaluador, restan las siguientes tareas:

```mermaid
graph LR
    T1["1. Hostear en Pages<br/>(1 clic en Settings)"] --> T2["2. Validación Cruzada<br/>(.m vs Web)"]
    T2 --> T3["3. Comparativa Externa<br/>(vs PVGIS / PVsyst)"]
    T3 --> T4["4. Binarios Release<br/>(.exe y .apk)"]
    T4 --> T5["5. Manual de Usuario"]
    T5 --> T6["6. Memoria Técnica UJA"]
```

1. [x] **Configurar Hosting Permanente:** Activar `gh-pages` en **Settings > Pages** de GitHub.
2. [ ] **Validación Numérica Cruzada (OrientSol .m vs. Web):**
   - Ejecutar los mismos casos de prueba en MATLAB (`Principal.m`) y en la aplicación Web.
   - Demostrar que los resultados de inclinación óptima y radiación coinciden cuantitativamente.
3. [ ] **Estudio Comparativo con Softwares Comercializados (Metodología Punto 4):**
   - Comparar los resultados de captación de OrientSol 3.0 frente a **PVGIS** y/o **PVsyst** para 2 o 3 ubicaciones (ej. Jaén, Madrid y una ubicación del hemisferio sur como Lima).
   - Elaborar la tabla de desviaciones para la memoria técnica.
4. [ ] **Generación de Binarios Release (Windows & Android):**
   - Generar el instalador `.exe` (`npm run build:win`) y el paquete `.apk` (`npm run build:apk`).
   - Publicar los archivos en la sección **Releases** del repositorio de GitHub.
5. [ ] **Manual de Usuario e Instalación (Metodología Punto 5):**
   - Redactar un manual con capturas de pantalla de la interfaz web, explicando el uso del simulador, la conexión satelital y la interpretación de los mapas de pérdidas CTE.
6. [ ] **Redacción de la Memoria Técnica Final (Metodología Punto 6):**
   - Redactar el documento final formal según la plantilla oficial del Máster en Energías Renovables de la Universidad de Jaén.

---

## 💻 Ejecución y Desarrollo Local

### Requisitos previos:
- [Node.js](https://nodejs.org/) v18 o superior.
- npm v9 o superior.

### Instalación de dependencias:
```bash
# Desde la carpeta raíz del proyecto:
npm install --prefix orientsol-web
```

### Iniciar servidor local de desarrollo:
```bash
npm run dev
```
Abre en tu navegador la dirección `http://localhost:5173`.

### Compilación y Despliegue:
```bash
# Compilar versión web para producción:
npm run build

# Desplegar directamente a GitHub Pages:
npm run deploy
```

### Ejecutar como Aplicación de Escritorio (Windows / Electron):
```bash
# Iniciar app de escritorio en modo desarrollo:
npm run app:desktop

# Empaquetar instalador .exe para Windows:
npm run --prefix orientsol-web build:win
```

### Compilar para Android (Capacitor):
```bash
# Sincronizar y generar paquete Android:
npm run --prefix orientsol-web cap:sync
# Abrir proyecto en Android Studio:
npm run --prefix orientsol-web cap:open:android
```

---

## 📂 Estructura del Repositorio

```text
├── .github/workflows/
│   └── deploy.yml               # Pipeline de integración continua (CI/CD)
├── orientsol-web/               # Aplicación OrientSol 3.0 (Web, Desktop y Móvil)
│   ├── src/
│   │   ├── components/          # Componentes de UI (Simulador, Gráficos, APIs, Consola)
│   │   ├── database/            # BBDD local de localidades españolas y albedos
│   │   ├── i18n/                # Sistema bilingüe (Español / Inglés)
│   │   ├── python/              # Motor científico solar en Python (Pyodide WebAssembly)
│   │   │   ├── core/            # Geometría solar (declinación, ángulos horarios, altura solar)
│   │   │   ├── radiation/       # Descomposición difusa y transposición a planos inclinados
│   │   │   ├── tracking/        # Algoritmos de seguimiento (1 eje horizontal, polar, azimutal y 2 ejes)
│   │   │   ├── energy/          # Modelo de Osterwald, temperaturas de célula y balances
│   │   │   └── optimization/    # Búsqueda de inclinación óptima y mapas de pérdidas CTE
│   │   ├── services/            # Servicios: WebAssembly, APIs NASA/PVGIS, Supabase
│   │   └── style.css            # Sistema de diseño, estética oscura solar y glassmorphism
│   ├── electron/                # Configuración de escritorio para Windows
│   ├── android/                 # Proyecto nativo para Android
│   ├── public/                  # Runtime de Pyodide WebAssembly y NumPy local
│   └── package.json             # Scripts y dependencias
├── README.md                    # Documentación principal del repositorio
└── package.json                 # Scripts de orquestación raíz
```

---

## 📜 Licencia y Derechos de Autor

Desarrollado en el marco del **Máster Universitario en Energías Renovables** de la **Universidad de Jaén (UJA)**.  
Código abierto bajo licencia MIT.
