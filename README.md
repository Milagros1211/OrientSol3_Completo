# OrientSol 4.0: Entorno Web y Multiplataforma para Optimización Solar Fotovoltaica

[![GitHub Releases](https://img.shields.io/badge/Release-v4.0.0%20Offline%20Apps-orange?logo=github)](https://github.com/Milagros1211/OrientSol4_Completo/releases)
[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Sitio%20En%20Vivo-brightgreen?logo=github)](https://Milagros1211.github.io/OrientSol4_Completo/)
[![CI/CD Build Multiplatform](https://img.shields.io/badge/GitHub%20Actions-Multiplatform%20Build-blue?logo=githubactions)](https://github.com/Milagros1211/OrientSol4_Completo/actions/workflows/build-offline-releases.yml)
[![Version](https://img.shields.io/badge/Versi%C3%B3n-4.0.0-blue.svg)](orientsol-web/package.json)
[![Security Audit](https://img.shields.io/badge/Security%20Audit-Grade%20A%2B%20(100%25)-brightgreen)](orientsol-web/supabase_schema.sql)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-TypeScript-646CFF?logo=vite)](https://vitejs.dev/)
[![Engine](https://img.shields.io/badge/WebAssembly-Pyodide%20%2B%20NumPy-F7931E?logo=webassembly)](https://pyodide.org/)
[![Multiplatform](https://img.shields.io/badge/Multiplatform-Windows%20%7C%20macOS%20%7C%20Android%20%7C%20Web-4CAF50)](https://capacitorjs.com/)

---

> 🎓 **Proyecto de Trabajo Fin de Máster (TFM)**  
> **Máster Universitario en Energías Renovables — Universidad de Jaén (UJA)**  
> **Autora:** Karina Milagros Baldeón Zárate | **Tutoría:** Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas  
> *Versión Final Académica (v4.0.0): modernización, validación y migración de OrientSol desde MATLAB hacia un entorno web y multiplataforma autónomo.*

---

## 🚀 Acceso Rápido y Descargas Oficiales (v4.0.0 - Versión TFM)

OrientSol 4.0 se encuentra disponible en formato **100% Offline** (sin necesidad de Internet ni licencias de MATLAB) para todas las plataformas, así como en versión Web:

| Plataforma | Tipo de Binario | Enlace de Descarga / Acceso | Estado |
| :--- | :--- | :--- | :--- |
| 🌐 **Web en Vivo (Online/PWA)** | Aplicación Web Progresiva | [🔗 Abrir OrientSol 4.0 Web](https://Milagros1211.github.io/OrientSol4_Completo/) | ✅ Operativo (Versión TFM) |
| 🪟 **Windows (10 / 11)** | Instalador `.exe` + Portable | [📥 Descargar para Windows (Releases)](https://github.com/Milagros1211/OrientSol4_Completo/releases/latest) | ✅ 100% Offline |
| 🍎 **macOS (Intel & Apple Silicon)** | Imagen de Disco `.dmg` + `.zip` | [📥 Descargar para macOS (Releases)](https://github.com/Milagros1211/OrientSol4_Completo/releases/latest) | ✅ 100% Offline |
| 🤖 **Android (Móviles & Tablets)** | Paquete de Instalación `.apk` | [📥 Descargar para Android (Releases)](https://github.com/Milagros1211/OrientSol4_Completo/releases/latest) | ✅ 100% Offline |

> 📦 **Descargas directas desde GitHub Actions:**  
> También puedes descargar los binarios recién generados en cualquier momento desde la sección de **Artifacts** de cada compilación en:  
> [🔗 Acceder a GitHub Actions Artifacts](https://github.com/Milagros1211/OrientSol4_Completo/actions/workflows/build-offline-releases.yml)

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
1. Entra a [https://Milagros1211.github.io/OrientSol4_Completo/](https://Milagros1211.github.io/OrientSol4_Completo/).
2. Si deseas instalarla en tu escritorio o pantalla de inicio, en Chrome/Edge haz clic en el icono de **"Instalar OrientSol"** en la barra de direcciones superior. En Safari iOS, pulsa **"Compartir" > "Añadir a pantalla de inicio"**.

---

---

## Guía de Plantillas y Formatos para la Carga de Emplazamientos (CSV / JSON)

OrientSol 4.0 incluye un motor universal de ingesta digital capaz de procesar archivos de climatología tanto para **un único emplazamiento** como para un **lote de múltiples emplazamientos simultáneos (Batch)**. Los archivos subidos se validan matemáticamente, se cargan en el motor de cálculo y se registran automáticamente en la base de datos de **Supabase** (tabla `datos_mensuales`) o en la caché offline si no hay conexión a Internet.

---

> **Campos que se guardan en Supabase (como emplazamiento no oficial, `es_oficial = false`):** nombre del emplazamiento, latitud, longitud y, para cada uno de los 12 meses, la radiación y la temperatura media. Las plantillas contienen únicamente esos campos; otros campos opcionales (país, altitud, albedo, notas) no se almacenan en la base de datos.

---

### 1. Formatos para Cargar un ÚNICO Emplazamiento

#### A. Formato CSV Individual (Vertical - Recomendado)
Este formato consta de cabeceras de metadatos precedidas por `#` y 12 filas con los datos de cada mes del año:

```csv
# OrientSol 4.0 - Plantilla de Climatología Individual
# Localidad: Jaén
# Latitud: 37.7796
# Longitud: -3.7849
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
# Localidad: Jaén
# Latitud: 37.7796
# Longitud: -3.7849
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
  "latitude": 37.7796,
  "longitude": -3.7849,
  "monthlyGdm0": [2.45, 3.31, 4.68, 5.82, 6.95, 7.92, 8.10, 7.25, 5.54, 3.95, 2.75, 2.18],
  "monthlyTemperature": [9.2, 10.5, 13.8, 16.5, 20.8, 26.1, 29.4, 28.9, 24.5, 19.1, 13.2, 10.0]
}
```

---

### 2. Formatos para Cargar MÚLTIPLES Emplazamientos (Lote / Batch)

#### A. Formato CSV Multi-Emplazamiento (Lote Tabular)
Permite subir decenas o cientos de emplazamientos en un solo archivo delimitado por punto y coma `;` o coma `,`:

```csv
# OrientSol 4.0 - Plantilla de Lote Multi-Emplazamiento (Batch)
# Formato: emplazamiento;latitud;longitud;mes;radiacion_media;temp_media
# Radiación: en kWh/m²/día (ej: 5.80) o mensual en kWh/m²/mes (se convierte automáticamente)
# Coordenadas: Latitud Sur (-) y Longitud Oeste (-)
emplazamiento;latitud;longitud;mes;radiacion_media;temp_media
Arequipa;-16.40;-71.54;1;6.35;15.2
Arequipa;-16.40;-71.54;2;5.95;15.1
Arequipa;-16.40;-71.54;3;6.10;15.0
Arequipa;-16.40;-71.54;4;6.42;14.6
Arequipa;-16.40;-71.54;5;6.28;13.8
Arequipa;-16.40;-71.54;6;6.05;13.1
Arequipa;-16.40;-71.54;7;6.18;12.9
Arequipa;-16.40;-71.54;8;6.65;13.4
Arequipa;-16.40;-71.54;9;7.10;14.2
Arequipa;-16.40;-71.54;10;7.35;14.8
Arequipa;-16.40;-71.54;11;7.20;15.0
Arequipa;-16.40;-71.54;12;6.70;15.3
Lima;-12.05;-77.04;1;5.82;22.4
Lima;-12.05;-77.04;2;6.12;23.1
Lima;-12.05;-77.04;3;5.65;22.6
Lima;-12.05;-77.04;4;4.78;20.8
Lima;-12.05;-77.04;5;3.62;18.7
Lima;-12.05;-77.04;6;2.85;17.2
Lima;-12.05;-77.04;7;2.60;16.5
Lima;-12.05;-77.04;8;2.72;16.3
Lima;-12.05;-77.04;9;3.15;16.8
Lima;-12.05;-77.04;10;3.95;18.0
Lima;-12.05;-77.04;11;4.68;19.4
Lima;-12.05;-77.04;12;5.25;21.1
```

---

#### B. Formato JSON Multi-Emplazamiento (Array de Objetos)
Un arreglo (`[]`) que contiene la lista de emplazamientos con sus 12 valores mensuales correspondientes:

```json
[
  {
    "locationName": "Santiago de Chile",
    "latitude": -33.4489,
    "longitude": -70.6693,
    "monthlyGdm0": [7.85, 7.12, 5.84, 4.15, 2.78, 2.15, 2.42, 3.25, 4.65, 6.10, 7.35, 8.02],
    "monthlyTemperature": [21.2, 20.4, 18.3, 14.8, 11.5, 9.2, 8.7, 10.1, 12.4, 15.1, 17.8, 20.1]
  },
  {
    "locationName": "Buenos Aires",
    "latitude": -34.6037,
    "longitude": -58.3816,
    "monthlyGdm0": [6.75, 5.92, 4.85, 3.55, 2.62, 2.10, 2.28, 2.95, 3.98, 5.12, 6.25, 6.85],
    "monthlyTemperature": [25.1, 23.9, 21.8, 17.9, 14.5, 11.7, 11.0, 12.8, 15.2, 18.2, 21.1, 23.6]
  },
  {
    "locationName": "Bogotá",
    "latitude": 4.7110,
    "longitude": -74.0721,
    "monthlyGdm0": [4.65, 4.52, 4.35, 4.10, 4.05, 4.20, 4.38, 4.45, 4.50, 4.18, 4.12, 4.40],
    "monthlyTemperature": [13.5, 13.8, 14.0, 14.2, 14.3, 14.0, 13.7, 13.7, 13.6, 13.6, 13.7, 13.4]
  },
  {
    "locationName": "Brasilia",
    "latitude": -15.7975,
    "longitude": -47.8919,
    "monthlyGdm0": [4.85, 5.10, 4.95, 5.25, 5.48, 5.52, 5.75, 6.15, 5.82, 5.15, 4.65, 4.72],
    "monthlyTemperature": [21.9, 22.0, 22.0, 21.7, 20.4, 19.3, 19.3, 21.1, 23.0, 23.1, 22.1, 21.9]
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

## 💻 Requisitos del Sistema, Instalación y Guía de Uso por Plataforma

OrientSol 4.0 está diseñado para funcionar de manera **100% autónoma y offline** tanto para usuarios finales (mediante instaladores y ejecutables directos sin necesidad de instalar entornos de desarrollo ni licencias de MATLAB) como para desarrolladores o investigadores que deseen ejecutar o compilar el código fuente.

---

### 1. 🪟 Windows (Windows 10 / Windows 11 de 64 bits)

#### A. ¿Qué necesitas para ejecutar la app en Windows?
* **Sistema Operativo:** Windows 10 o Windows 11 (edición de 64 bits).
* **Hardware mínimo recomendado:** Procesador Intel o AMD x64 de doble núcleo, 4 GB de memoria RAM y 350 MB de almacenamiento libre en disco.
* **Dependencias de software:** **Ninguna.** No necesitas tener instalado Node.js, Python, MATLAB ni librerías adicionales. El motor científico de cálculo (Pyodide WebAssembly y NumPy) ya viene empotrado en el ejecutable.
* **Conectividad:** 100% Offline para todos los módulos de cálculo astronómico, optimización y simulación. *(Solo requiere conexión a Internet si se desea consultar dinámicamente las bases de datos externas de PVGIS o NASA POWER).*

#### B. Paso a paso para usar el ejecutable (.exe):
1. **Descarga:** Accede a la sección de [Releases de GitHub](https://github.com/Milagros1211/OrientSol4_Completo/releases/latest) y descarga el instalador `OrientSol 4.0 Setup 4.0.0.exe` (con acceso directo en el escritorio) o la versión portable `OrientSol 4.0 4.0.0.exe` (que no requiere instalación).
2. **Desbloqueo de SmartScreen:** Al ejecutarlo por primera vez, Windows SmartScreen puede mostrar la ventana azul *"Windows protegió su PC"* (al tratarse de una aplicación académica de código abierto sin firma corporativa de pago). Haz clic en el enlace **"Más información"** y luego en el botón **"Ejecutar de todas formas"**.
3. **Arranque del simulador:** La aplicación abrirá su ventana principal al instante. En segundo plano, se inicializa automáticamente el hilo seguro de WebAssembly con Pyodide.
4. **Flujo de uso en la aplicación:**
   * **Paso 1 (Emplazamiento):** En la cabecera, selecciona una localidad española del catálogo de 114 estaciones, introduce coordenadas libres (Latitud/Longitud) o sube tu propio archivo de radiación en la pestaña *"Subida Digital (CSV / JSON)"*.
   * **Paso 2 (Módulo de Estudio):** Selecciona en la barra superior el análisis deseado: *Inclinación Fija Anual*, *Inclinación Estacional*, *Seguimiento Solar (1 o 2 ejes)*, *Pérdidas CTE DB-HE4* o *Modelo Energético de Osterwald*.
   * **Paso 3 (Ajuste de Parámetros):** Modifica el albedo ($\rho$), los ángulos de inclinación ($\beta$) y orientación ($\alpha$), o los coeficientes térmicos del panel.
   * **Paso 4 (Cálculo):** Pulsa el botón **"Calcular"**. Los resultados numéricos, tablas de radiación mensual y diagramas polares vectoriales en SVG se procesarán en milisegundos.
   * **Paso 5 (Exportación):** Utiliza los botones de descarga para exportar el informe técnico completo en **PDF**, las series de radiación en **CSV**, o la hoja de cálculo sanitizada en **Excel (.xlsx)**.

---

### 2. 🍎 macOS (macOS 12 Monterey o superior — Apple Silicon & Intel)

#### A. ¿Qué necesitas para ejecutar la app en macOS?
* **Sistema Operativo:** macOS 12 Monterey, macOS 13 Ventura, macOS 14 Sonoma o macOS 15 Sequoia.
* **Arquitectura:** Compatible de forma nativa con procesadores Apple Silicon (M1, M2, M3, M4) y procesadores Intel x86_64.
* **Hardware mínimo recomendado:** 4 GB de memoria RAM unificada y 400 MB de espacio disponible en disco.
* **Dependencias de software:** Ninguna adicional requerida (Pyodide y NumPy integrados en el bundle).

#### B. Paso a paso para usar el descargable (.dmg):
1. **Descarga:** Descarga la imagen de disco `OrientSol 4.0-4.0.0.dmg` desde [GitHub Releases](https://github.com/Milagros1211/OrientSol4_Completo/releases/latest).
2. **Instalación:** Haz doble clic en el archivo `.dmg` descargado y arrastra el icono de **OrientSol 4.0** a la carpeta **Aplicaciones** (`/Applications`).
3. **Desbloqueo de Gatekeeper:** La primera vez que abras la aplicación, macOS indicará que el desarrollador no ha sido verificado. Para autorizarla:
   * Haz clic derecho (o mantén pulsada la tecla `Ctrl` y haz clic) sobre **OrientSol 4.0** en tu carpeta Aplicaciones.
   * Selecciona **"Abrir"** en el menú contextual emergente.
   * En el cuadro de diálogo de confirmación de seguridad de macOS, pulsa **"Abrir"**. *(Solo tendrás que hacer esto la primera vez).*
4. **Uso del Simulador:** La app se ejecuta con aceleración gráfica Metal/Chromium nativa, lista para simular y exportar informes.

---

### 3. 🤖 Android (Smartphones y Tablets — Android 7.0 a 16)

#### A. ¿Qué necesitas para mantener la app en funcionamiento?
* **Sistema Operativo:** Android 7.0 (Nougat, API nivel 24) o cualquier versión superior hasta Android 16.
* **Almacenamiento:** Mínimo 200 MB de memoria interna libre.
* **Permisos del sistema:** Permiso de almacenamiento para guardar informes PDF y archivos exportados CSV/Excel generados por el simulador.
* **Conectividad:** Funciona 100% sin conexión (ideal para ingenieros y técnicos en instalaciones solares aisladas o en cubiertas sin cobertura móvil).

#### B. Paso a paso para usar la aplicación en Android (.apk):
1. **Descarga:** Descarga el paquete `OrientSol-Android-APK.zip` o `app-debug.apk` directamente en tu dispositivo Android o transfiérelo desde un PC mediante cable USB o Google Drive.
2. **Autorización de Fuentes Desconocidas:** Si Android bloquea la instalación por proceder de fuera de Google Play:
   * Accede a *Ajustes > Seguridad > Instalar aplicaciones desconocidas* (o pulsa *"Ajustes"* en el mensaje que aparece al tocar el archivo).
   * Activa la casilla *"Permitir desde esta fuente"* para tu navegador o gestor de archivos.
3. **Instalación:** Toca el archivo `.apk` y pulsa **"Instalar"**. Al finalizar, pulsa **"Abrir"**.
4. **Uso táctil optimizado:** La interfaz se adapta dinámicamente a la orientación de la pantalla (modo vertical para móviles y modo apaisado panorámico con gráficas expandidas en tablets).

---

### 4. 🌐 Navegador Web / PWA (Multiplataforma sin Instalación)

#### A. ¿Qué necesitas?
* Cualquier navegador web moderno con soporte para WebAssembly, Canvas y ES Modules:
  * Google Chrome / Chromium v90+
  * Mozilla Firefox v89+
  * Microsoft Edge v90+
  * Apple Safari (iOS / macOS) v15+
  * Opera, Brave, Vivaldi.

#### B. Paso a paso de uso:
1. Entra directamente a la dirección oficial: [https://Milagros1211.github.io/OrientSol4_Completo/](https://Milagros1211.github.io/OrientSol4_Completo/).
2. **Instalación opcional como PWA (Aplicación Web Progresiva):**
   * En **Google Chrome / Microsoft Edge:** Haz clic en el icono de instalación ⊕ ("Instalar OrientSol") en el extremo derecho de la barra de direcciones.
   * En **Safari (iPhone / iPad):** Pulsa el botón *"Compartir"* (icono con flecha hacia arriba) y selecciona *"Añadir a pantalla de inicio"*.
3. La aplicación se integrará con su propio icono en tu sistema y funcionará incluso cuando no dispongas de conexión a Internet gracias a su Service Worker.

---

### 5. 🛠️ Ejecución y Desarrollo Local desde Código Fuente (Para Desarrolladores)

Si deseas modificar el código fuente, ejecutar el servidor de desarrollo local o recompilar los binarios multiplataforma:

#### Requisitos previos de desarrollo:
* [Node.js](https://nodejs.org/) v18.0.0 o superior (recomendado v20+ LTS).
* Gestor de paquetes `npm` v9.0.0 o superior.
* Para compilar Android: Java JDK 21 y Android Studio con Android SDK configurado.

#### Instalación y arranque del entorno:
```bash
# 1. Clonar el repositorio:
git clone https://github.com/Milagros1211/OrientSol4_Completo.git
cd OrientSol4_Completo

# 2. Instalar dependencias del frontend web:
npm install --prefix orientsol-web

# 3. Iniciar servidor local de desarrollo con Hot Module Replacement (HMR):
npm run dev
# Abre en tu navegador la dirección: http://localhost:5173
```

#### Comandos de Compilación y Empaquetado Multiplataforma:
```bash
# Compilar versión web para distribución final:
npm run build

# Desplegar directamente la versión compilada a GitHub Pages:
npm run deploy

# Iniciar aplicación de escritorio en modo desarrollo con Electron:
npm run app:desktop

# Empaquetar instalador .exe y versión portable para Windows (x64):
npm run --prefix orientsol-web build:win

# Empaquetar instalador .dmg y .zip para macOS:
npm run --prefix orientsol-web build:mac

# Empaquetar para todas las plataformas de escritorio (Windows, macOS):
npm run --prefix orientsol-web build:all

# Sincronizar assets web y compilar APK para Android:
npm run --prefix orientsol-web cap:sync
cd orientsol-web/android && ./gradlew assembleDebug
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
