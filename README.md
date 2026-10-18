# OrientSol 4.0: Entorno Web y Multiplataforma para Optimización Solar Fotovoltaica

[![GitHub Releases](https://img.shields.io/badge/Release-v4.0.0%20Offline%20Apps-orange?logo=github)](https://github.com/Milagros1211/OrientSol3_Completo/releases)
[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Sitio%20En%20Vivo-brightgreen?logo=github)](https://Milagros1211.github.io/OrientSol3_Completo/)
[![CI/CD Build Multiplatform](https://img.shields.io/badge/GitHub%20Actions-Multiplatform%20Build-blue?logo=githubactions)](https://github.com/Milagros1211/OrientSol3_Completo/actions/workflows/build-offline-releases.yml)
[![Version](https://img.shields.io/badge/Versi%C3%B3n-4.0.0-blue.svg)](orientsol-web/package.json)
[![Security Audit](https://img.shields.io/badge/Security%20Audit-Grade%20A%2B%20(100%25)-brightgreen)](orientsol-web/supabase_schema.sql)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-TypeScript-646CFF?logo=vite)](https://vitejs.dev/)
[![Engine](https://img.shields.io/badge/WebAssembly-Pyodide%20%2B%20NumPy-F7931E?logo=webassembly)](https://pyodide.org/)
[![Multiplatform](https://img.shields.io/badge/Multiplatform-Windows%20%7C%20macOS%20%7C%20Android%20%7C%20Web-4CAF50)](https://capacitorjs.com/)

---

## 🚀 Acceso Rápido y Descargas Oficiales (v4.0.0)

OrientSol 4.0 se encuentra disponible en formato **100% Offline** (sin necesidad de Internet ni licencias de MATLAB) para todas las plataformas, así como en versión Web:

| Plataforma | Tipo de Binario | Enlace de Descarga / Acceso | Estado |
| :--- | :--- | :--- | :--- |
| 🌐 **Web en Vivo (Online/PWA)** | Aplicación Web Progresiva | [🔗 Abrir OrientSol 4.0 Web](https://Milagros1211.github.io/OrientSol3_Completo/) | ✅ En Producción |
| 🪟 **Windows (10 / 11)** | Instalador `.exe` + Portable | [📥 Descargar para Windows (Releases)](https://github.com/Milagros1211/OrientSol3_Completo/releases/latest) | ✅ 100% Offline |
| 🍎 **macOS (Intel & Apple Silicon)** | Imagen de Disco `.dmg` + `.zip` | [📥 Descargar para macOS (Releases)](https://github.com/Milagros1211/OrientSol3_Completo/releases/latest) | ✅ 100% Offline |
| 🤖 **Android (Móviles & Tablets)** | Paquete de Instalación `.apk` | [📥 Descargar para Android (Releases)](https://github.com/Milagros1211/OrientSol3_Completo/releases/latest) | ✅ 100% Offline |

> 📦 **Descargas directas desde GitHub Actions:**  
> También puedes descargar los binarios recién generados en cualquier momento desde la sección de **Artifacts** de cada compilación en:  
> [🔗 Acceder a GitHub Actions Artifacts](https://github.com/Milagros1211/OrientSol3_Completo/actions/workflows/build-offline-releases.yml)

---

## 📲 Guía Detallada de Instalación por Plataforma

### 🪟 1. Windows (10 / 11)
OrientSol para Windows incluye el entorno de ejecución científico empotrado (Pyodide WebAssembly + NumPy 2.4):
1. Descarga el archivo instalador `OrientSol 4.0 Setup 4.0.0.exe` o el ejecutable directo `OrientSol 4.0 4.0.0.exe`.
2. Haz doble clic para ejecutarlo.
3. *Aviso de seguridad (SmartScreen):* Al ser un ejecutable nuevo y de código abierto sin firma comercial de pago, Windows puede mostrar la ventana azul *"Windows protegió su PC"*. Haz clic en **"Más información"** y luego en **"Ejecutar de todas formas"**.
4. ¡Listo! La aplicación se iniciará de forma instantánea en modo ventana con aceleración por hardware.

### 🍎 2. macOS (macOS 12 Monterey o superior)
1. Descarga la imagen de disco `OrientSol 4.0-4.0.0.dmg`.
2. Haz doble clic en el archivo descargado para montarlo.
3. Arrastra el icono de **OrientSol 4.0** a la carpeta **Aplicaciones**.
4. *Aviso de Gatekeeper:* La primera vez que lo abras, si macOS indica que el desarrollador no ha sido verificado, haz clic derecho (o `Ctrl + clic`) sobre **OrientSol 4.0** en Aplicaciones y selecciona **"Abrir"** en el menú contextual, luego pulsa **"Abrir"** en el cuadro de diálogo.

### 🤖 3. Android (Smartphones y Tablets - Android 7.0 a 16)
La versión para Android está optimizada con diseño responsivo adaptativo tanto para teléfonos en vertical como para tablets en apaisado:
1. Descarga el paquete `OrientSol-Android-APK.zip` o `app-debug.apk` directamente en tu dispositivo o transfiérelo desde el PC.
2. Abre el archivo `.apk` descargado desde la barra de notificaciones o con tu explorador de archivos preferido.
3. Si el sistema te lo solicita, activa el permiso de **"Instalar aplicaciones de fuentes desconocidas"** para ese navegador o gestor de archivos en *Ajustes > Seguridad*.
4. Pulsa **"Instalar"** y luego abre **OrientSol 4.0**. Funciona de inmediato sin necesidad de datos móviles ni Wi-Fi.

### 🌐 4. Navegador Web / PWA (Multiplataforma)
1. Entra a [https://Milagros1211.github.io/OrientSol3_Completo/](https://Milagros1211.github.io/OrientSol3_Completo/).
2. Si deseas instalarla en tu escritorio o pantalla de inicio, en Chrome/Edge haz clic en el icono de **"Instalar OrientSol"** en la barra de direcciones superior. En Safari iOS, pulsa **"Compartir" > "Añadir a pantalla de inicio"**.

---

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

### Compilación y Despliegue Web:
```bash
# Compilar versión web para producción:
npm run build

# Desplegar directamente a GitHub Pages:
npm run deploy
```

### Compilar Aplicaciones de Escritorio Offline (Electron):
```bash
# Iniciar app de escritorio en modo desarrollo:
npm run app:desktop

# Empaquetar instalador .exe y portable para Windows (x64):
npm run --prefix orientsol-web build:win

# Empaquetar instalador .dmg y .zip para macOS:
npm run --prefix orientsol-web build:mac

# Empaquetar para todas las plataformas de escritorio (Windows, macOS, Linux):
npm run --prefix orientsol-web build:all
```

### Compilar para Android (Capacitor):
```bash
# Sincronizar assets web y Pyodide WASM al proyecto Android:
npm run --prefix orientsol-web cap:sync

# Compilar APK Debug directamente con Gradle:
cd orientsol-web/android && ./gradlew assembleDebug

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

---

## Marco Legal, Privacidad & Cumplimiento Normativo (UE y España)

OrientSol 4.0 cumple rigurosamente con la normativa europea y española de protección de datos, comercio electrónico y derechos de los consumidores:
* **Reglamento General de Protección de Datos (RGPD 2016/679):** Arquitectura Zero-Tracking con cálculo 100% en cliente (Pyodide WebAssembly) y preservación de derechos ARCO-POL.
* **Ley Orgánica 3/2018 (LOPDGDD):** Garantía de los derechos digitales y seguridad en reposo/tránsito.
* **Términos de Servicio y Declaración de Gratuidad Total:** Software libre sin cobros, compras integradas ni suscripciones comerciales.
* **Informe de Auditoría y Seguridad:** Aislamiento en sandbox WASM, prevención estricta de XSS y de inyección en fórmulas CSV/Excel (CWE-1236), y RLS en base de datos PostgreSQL.

Para consultar el marco legal íntegro, revisa el documento [LEGAL_POLICIES.md](file:///c:/Users/karin/Downloads/PFCOrientSol3/Programas%20fuente/OrientSol3_Completo/LEGAL_POLICIES.md).

---

## Licencia y Derechos de Autor

Desarrollado en el marco del **Máster Universitario en Energías Renovables** de la **Universidad de Jaén (UJA)**.  
Alumna: **Karina Milagros Baldeón Zárate**  
Directores: **Dr. Leocadio Hontoria García** & **Dra. Catalina Rus Casas**  
Código abierto bajo licencia MIT y Acceso Abierto Académico.
