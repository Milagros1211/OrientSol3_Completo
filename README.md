# OrientSol 3.0: Entorno Web para Optimización Solar Fotovoltaica

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://karin-baldeon.github.io/OrientSol3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-TypeScript-646CFF?logo=vite)](https://vitejs.dev/)
[![Engine](https://img.shields.io/badge/WebAssembly-Pyodide%20%2B%20NumPy-F7931E?logo=webassembly)](https://pyodide.org/)
[![Multiplatform](https://img.shields.io/badge/Multiplatform-Web%20%7C%20Windows%20%7C%20Android-4CAF50)](https://capacitorjs.com/)

---

## 📌 Contexto Académico

- **Institución:** Universidad de Jaén (UJA) — Escuela Politécnica Superior.
- **Programa:** Máster Universitario en Energías Renovables.
- **Trabajo Fin de Máster (TFM):** *Desarrollo de un entorno software para optimización de posición y movimiento de superficies receptoras de radiación solar en un sistema fotovoltaico.*
- **Autora:** Karina Milagros Baldeón Zárate.
- **Directores del TFM:** Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas (Dpto. de Ingeniería Electrónica y Automática).

---

## ☀️ ¿Qué es OrientSol 3.0?

**OrientSol 3.0** es la evolución y renovación integral del aplicativo original desarrollado en **MATLAB/Octave (`.m` y `.fig`)**. Ha sido transformado en una plataforma de software moderna, abierta y multiplataforma basada en tecnologías web de última generación:

1. **Interfaz Web Responsiva y Bilingüe (ES / EN):** Accesible desde cualquier navegador moderno sin necesidad de instalaciones pesadas ni licencias de software propietario.
2. **Motor de Cálculo Científico In-Browser (WebAssembly + Pyodide):** Ejecuta algoritmos matriciales de alta precisión con NumPy en Python compilado a WebAssembly en el cliente, garantizando cálculos instantáneos con privacidad total de datos.
3. **Arquitectura Híbrida de Datos:**
   - **APIs Meteorológicas Internacionales:** Integración en tiempo real con NASA POWER, PVGIS y Open-Meteo.
   - **Base de Datos Histórica:** Soporte de estaciones meteorológicas y valores de albedo de España y del mundo.
   - **Carga Dual de Datos:** Introducción manual o importación de documentos digitales externos (`CSV` y `JSON`).
4. **Modelos de Simulación y Optimización Solar:**
   - **Superficies Fijas:** Inclinación óptima anual, estacional (4 posiciones) y mensual (12 posiciones).
   - **Seguimiento Solar:** Eje horizontal (N-S y E-O), eje polar, eje azimutal y seguimiento completo a 2 ejes.
   - **Generación Energética Fotovoltaica:** Modelo térmico de Osterwald con cálculo de temperatura de célula ($T_c$) y pérdidas por coeficiente de temperatura.
   - **Mapas de Pérdidas de Captación:** Clasificación según el Código Técnico de la Edificación (**CTE DB-HE4**).
5. **Distribución Multiplataforma:**
   - **Web / PWA:** Ejecución online y offline inmediata via Service Worker.
   - **Windows:** Aplicación de escritorio nativa mediante Electron (`.exe`).
   - **Android:** Aplicación móvil nativa mediante Capacitor (`.apk`).

---

## 🚀 Despliegue en GitHub Pages

Este repositorio cuenta con un pipeline automatizado de integración y despliegue continuo (**CI/CD**) mediante **GitHub Actions** (`.github/workflows/deploy.yml`).

### Pasos para activar GitHub Pages en tu repositorio:

1. Crea el repositorio en GitHub y sube el código:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit of OrientSol 3.0 suite"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repositorio>.git
   git push -u origin main
   ```
2. En GitHub, dirígete a: **Settings** > **Pages**.
3. En la sección **Build and deployment > Source**, selecciona **GitHub Actions**.
4. ¡Listo! Cada vez que realices un `push` a la rama `main`, la aplicación se compilará y se publicará automáticamente en:
   ```
   https://<tu-usuario>.github.io/<tu-repositorio>/
   ```

---

## 💻 Ejecución y Desarrollo Local

### Requisitos previos:
- [Node.js](https://nodejs.org/) v18 o superior.
- npm v9 o superior.

### Instalación de dependencias:
```bash
# Desde la carpeta raíz:
cd orientsol-web
npm install
```

### Iniciar servidor de desarrollo:
```bash
npm run dev
```
Abre en tu navegador la dirección `http://localhost:5173`.

### Compilación para Producción (Web):
```bash
npm run build
npm run preview
```

### Ejecutar como Aplicación de Escritorio (Electron / Windows):
```bash
npm run app:desktop
# Para generar el instalador .exe:
npm run build:win
```

### Compilar para Android (Capacitor):
```bash
npm run build:apk
# O abrir en Android Studio:
npm run cap:open:android
```

---

## 📂 Estructura del Repositorio

```text
├── .github/workflows/
│   └── deploy.yml               # Pipeline de despliegue a GitHub Pages
├── orientsol-web/               # Entorno Web, Desktop y Móvil OrientSol 3.0
│   ├── src/
│   │   ├── components/          # Componentes modulares UI (Header, Paneles, Gráficos)
│   │   ├── database/            # BBDD local de localidades y albedos
│   │   ├── i18n/                # Sistema bilingüe (Español / Inglés)
│   │   ├── python/              # Algoritmos solares en Python (core, radiation, tracking, energy)
│   │   ├── services/            # Servicios: Pyodide WASM, APIs climáticas, Supabase
│   │   └── style.css            # Estilos modernos, diseño responsive y temas
│   ├── electron/                # Configuración nativa para Windows (Electron)
│   ├── android/                 # Proyecto nativo para Android (Capacitor)
│   ├── public/                  # Assets estáticos, WebAssembly Pyodide y NumPy wheel
│   └── package.json             # Scripts y dependencias del frontend
├── [Master EERR] FormatoPropuestaTFMKarinaBaldeon.pdf  # Propuesta oficial de TFM
├── *.m / *.fig / *.rpt          # Código fuente histórico original de OrientSol en MATLAB
└── package.json                 # Scripts de orquestación raíz
```

---

## 📜 Licencia y Derechos de Autor

Desarrollado en el marco del Máster Universitario en Energías Renovables de la **Universidad de Jaén**.  
Código abierto bajo licencia MIT.
