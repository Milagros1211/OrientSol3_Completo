# OrientSol 4.0: Entorno Web y Multiplataforma para Optimización Solar Fotovoltaica

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Sitio%20En%20Vivo-brightgreen?logo=github)](https://Milagros1211.github.io/OrientSol3_Completo/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Milagros1211%2FOrientSol3__Completo-blue?logo=github)](https://github.com/Milagros1211/OrientSol3_Completo)
[![Version](https://img.shields.io/badge/Versi%C3%B3n-4.0.0-blue.svg)](orientsol-web/package.json)
[![Security Audit](https://img.shields.io/badge/Security%20Audit-Grade%20A%2B%20(100%25)-brightgreen)](orientsol-web/supabase_schema.sql)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-TypeScript-646CFF?logo=vite)](https://vitejs.dev/)
[![Engine](https://img.shields.io/badge/WebAssembly-Pyodide%20%2B%20NumPy-F7931E?logo=webassembly)](https://pyodide.org/)
[![Multiplatform](https://img.shields.io/badge/Multiplatform-Web%20%7C%20Windows%20%7C%20Android-4CAF50)](https://capacitorjs.com/)

> **Enlace Permanente del Software en Vivo:**  
>  [https://Milagros1211.github.io/OrientSol3_Completo/](https://Milagros1211.github.io/OrientSol3_Completo/)

---

## Contexto Académico

- **Institución:** Universidad de Jaén (UJA) — Escuela Politécnica Superior.
- **Programa:** Máster Universitario en Energías Renovables.
- **Trabajo Fin de Máster (TFM):** *Desarrollo de un entorno software para optimización de posición y movimiento de superficies receptoras de radiación solar en un sistema fotovoltaico.*
- **Autora:** Karina Milagros Baldeón Zárate.
- **Directores del TFM:** Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas (Dpto. de Ingeniería Electrónica y Automática).

---

## ¿Qué es OrientSol 4.0?

**OrientSol 4.0** es la modernización y evolución web del software original desarrollado en **MATLAB/Octave (`.m` y `.fig`)**. Ha sido transformado en una suite de simulación solar abierta, interactiva y multiplataforma basada en tecnologías de vanguardia:

1. **Interfaz Web Responsiva y Bilingüe (ES / EN):** Funciona directamente en cualquier navegador moderno sin instalaciones ni licencias de software propietario.
2. **Motor Científico en el Navegador (WebAssembly + Pyodide + NumPy):** Ejecuta la formulación matemática solar en el cliente en milisegundos con total privacidad y alta precisión vectorizada.
3. **Estado de Traducción del Código Original (118 archivos MATLAB `.m`):**
   - **Algoritmos y Fórmulas Matemáticas (78 archivos `.m`):** **100% Traducidos y Verificados** a Python vectorizado y TypeScript (geometría solar, transposición Liu-Jordan, seguidores de 1 y 2 ejes, optimizaciones anual/estacional/mensual, mapas de pérdidas CTE DB-HE4 y modelos de energía de Osterwald).
   - **Ventanas Gráficas y Controladores GUIDE (40 archivos `.m`):** Sustituidos y modernizados por componentes web reactivos con renderizado SVG interactivo, tablas dinámicas y exportación segura.
   - *Detalle exhaustivo de correspondencias en:* [`orientsol-web/src/python/README.md`](orientsol-web/src/python/README.md).
4. **Arquitectura Híbrida de Datos:**
   - **APIs Satelitales en Tiempo Real:** NASA POWER, PVGIS y ERA5 / Open-Meteo.
   - **Base de Datos Histórica y Crowdsourcing en Supabase:** Almacenamiento seguro con clave primaria UUID v4, RLS y restricciones de integridad física.
   - **Carga Dual:** Formulario manual de 12 meses y subida de archivos digitales (`CSV` y `JSON`).
5. **Modelos de Simulación y Optimización Solar:**
   - **Inclinación Óptima Anual y Comparativa con Ángulo X:** Reproducción fiel y modernizada de la interfaz original de MATLAB (`Tabla_OptAnual.m` y `Tabla_OptAnual_IncliX.m`) en formato tabular interactivo. Permite visualizar las 7 inclinaciones fijas de referencia (0°, 15°, 30°, 45°, 60°, 75°, 90°), la inclinación óptima calculada ($\beta_{opt}$) y comparar en tiempo real contra cualquier ángulo seleccionado $X \in [1^\circ, 90^\circ]$ para todas las componentes solares (Global, Directa, Difusa, Albedo), desglosando factores y porcentajes de ganancia mensuales y anuales con exportación directa a Excel (CSV).
   - **Superficies Fijas:** Inclinación óptima anual, 4 posiciones estacionales y 12 posiciones mensuales.
   - **Seguimiento Solar:** Eje horizontal (N-S y E-O), eje polar, eje azimutal y seguimiento completo a 2 ejes.
   - **Generación Energética Fotovoltaica:** Modelo térmico de Osterwald con cálculo de temperatura de célula ($T_c$) y pérdidas térmicas.
   - **Mapas de Pérdidas de Captación:** Clasificación según normativa del Código Técnico de la Edificación (**CTE DB-HE4**).
6. **Seguridad Defensiva Certificada (Calificación A+):**
   - Blindaje contra SSRF (Electron), XSS (DOMPurify), Inyección CSV/Excel (CWE-1236), Hardening de Proxies y aislamiento RLS en Supabase.
7. **Distribución Multiplataforma:**
   - **Web / PWA:** Ejecución online y offline con Service Worker.
   - **Windows:** Aplicación nativa de escritorio con Electron (`.exe`).
   - **Android:** Aplicación móvil nativa con Capacitor (`.apk`).

---

## Guía de Plantillas y Formatos para la Carga de Emplazamientos (CSV / JSON)

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

## Ejecución y Desarrollo Local

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

## Estructura del Repositorio

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

## Licencia y Derechos de Autor

Desarrollado en el marco del **Máster Universitario en Energías Renovables** de la **Universidad de Jaén (UJA)**.  
Código abierto bajo licencia MIT.
