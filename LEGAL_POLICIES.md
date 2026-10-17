# OrientSol 4.0 — Legal Compliance, Privacy, Cookie & Refund Framework
**Conformidad Legal, Privacidad, Cookies, Reembolsos y Seguridad Técnica**

*Compliant with European Union Regulations (GDPR 2016/679, ePrivacy Directive 2002/58/EC, Consumer Rights Directive 2011/83/EU) and Spanish Law (LOPDGDD 3/2018, LSSI-CE 34/2002, TRLGDCU RD-Leg 1/2007).*

---

## 1. Identificación del Titular y Marco Académico / Data Controller Identification

* **Plataforma:** OrientSol 4.0 (Simulador y Optimizador Solar Fotovoltaico / Solar Simulation & PV Optimization Engine)
* **Marco Institucional:** Trabajo Fin de Máster (TFM) en Energías Renovables — Universidad de Jaén (UJA), España
* **Autora / Investigadora:** Karina Milagros Baldeón Zárate
* **Directores Académicos:** Dr. Leocadio Hontoria García & Dra. Catalina Rus Casas
* **Departamento:** Departamento de Ingeniería Electrónica y Automática, Escuela Politécnica Superior de Jaén
* **Contacto:** [Universidad de Jaén](https://www.ujaen.es)

---

## 2. Política de Privacidad (RGPD & LOPDGDD) / Privacy Policy

### 2.1 Principio de Privacidad desde el Diseño (Art. 25 RGPD)
OrientSol 4.0 se diseñó bajo una arquitectura **Zero-Data Collection / Zero-Tracking**:
1. **Computación 100% en Cliente:** Toda la física solar (geometría celeste, descomposición difusa mediante modelos de Perez, Hay-Davies, Liu-Jordan, seguimiento a 1 y 2 ejes, y producción eléctrica con el modelo térmico de Osterwald) se ejecuta exclusivamente en el navegador del usuario mediante WebAssembly (Pyodide + NumPy).
2. **Sin Fuga de Datos:** Las coordenadas geográficas (latitud, longitud), potencias pico, inclinaciones y resultados de simulación **no se transmiten a servidores remotos**.
3. **No Recolección de Datos de Carácter Personal:** La aplicación no recopila identificadores personales, nombres, correos electrónicos, datos bancarios ni direcciones IP.

### 2.2 Base de Datos Comunitaria Opcional (Supabase)
* El usuario puede voluntariamente consultar o aportar estaciones climáticas a la base de datos comunitaria (`datos_mensuales`).
* Dichos registros contienen exclusivamente variables técnico-meteorológicas (nombre de municipio o estación, coordenadas y 12 valores mensuales de $G_{dm}(0)$ y temperatura).
* La base de datos está alojada en la Unión Europea (Supabase EU) y protegida mediante políticas de **Seguridad por Filas (Row Level Security - RLS)** y comprobación de UUID maestro.
* **Base Jurídica:** Consentimiento explícito del usuario (Art. 6.1.a RGPD) e interés legítimo en la divulgación científica abierta (Art. 6.1.f RGPD).

### 2.3 Ejercicio de Derechos ARCO-POL
Cualquier usuario puede ejercer sus derechos de Acceso, Rectificación, Supresión ("Derecho al Olvido"), Limitación, Oposición y Portabilidad (Arts. 15-22 RGPD y Título III LOPDGDD). Las solicitudes o reclamaciones pueden dirigirse a la Secretaría Académica de la UJA o ante la **Agencia Española de Protección de Datos (AEPD)** en [www.aepd.es](https://www.aepd.es).

---

## 3. Términos de Servicio y Condiciones de Uso / Terms of Service

### 3.1 Naturaleza del Software y Licencia
* OrientSol 4.0 se distribuye como software científico, docente y de investigación de **Acceso Abierto (Open Access)** bajo licencia permisiva MIT.
* Se autoriza el uso libre para la docencia universitaria, la investigación académica, la consultoría técnica y el pre-dimensionamiento de sistemas solares fotovoltaicos.
* Toda publicación que incorpore resultados de OrientSol 4.0 deberá citar la autoría académica correspondiente y la Universidad de Jaén.

### 3.2 Exención de Responsabilidad Técnica (Disclaimer)
* Los modelos de cálculo implementados reproducen las ecuaciones científicas formuladas en la literatura solar internacional y en el software original en MATLAB de la Universidad de Jaén.
* El software se entrega "tal cual" (*as is*). Los autores y la Universidad de Jaén no asumen responsabilidad civil, mercantil o financiera sobre pérdidas energéticas, rendimientos garantizados o discrepancias de generación en proyectos fotovoltaicos comerciales no validados con instrumentación solarimétrica in situ.

### 3.3 Jurisdicción y Ley Aplicable
Las presentes condiciones se rigen por la legislación española y el Derecho de la Unión Europea. Para dirimir cualquier litigio, las partes se someten a los Juzgados y Tribunales de la ciudad de **Jaén (España)**.

---

## 4. Política de Cookies y Almacenamiento Local / Cookie & Storage Policy

Conforme a la Directiva europea ePrivacy 2002/58/CE, el artículo 5(3) del RGPD, el artículo 22.2 de la Ley 34/2002 (LSSI-CE) y las directrices de la AEPD:

> **Declaración de Cero Rastreo:** OrientSol 4.0 **NO** utiliza cookies publicitarias, **NO** utiliza rastreadores de terceros, **NO** utiliza píxeles de seguimiento ni analítica comercial.

### 4.1 Inventario de Almacenamiento Técnico Exento de Consentimiento Previo
El almacenamiento local en `localStorage` e `indexedDB` tiene carácter estrictamente técnico y funcional:

| Clave / Almacén | Tipo | Finalidad Técnica | Duración |
| :--- | :--- | :--- | :--- |
| `orientsol_theme` | `localStorage` | Almacena la preferencia visual (Modo Claro / Modo Oscuro) | Persistente |
| `orientsol_lang` | `localStorage` | Conserva el idioma seleccionado (Español / Inglés) | Persistente |
| `orientsol_climate_cache` | `localStorage` | Almacena las estaciones climáticas para operar 100% offline | Persistente |
| `orientsol_offline_queue` | `localStorage` | Cola transaccional para sincronización diferida | Hasta sincronizar |
| `orientsol_cookie_consent` | `localStorage` | Registra la confirmación del aviso de almacenamiento técnico | 1 año |
| `indexedDB (pyodide)` | `indexedDB` | Caché local de paquetes WASM (Pyodide & NumPy) para arranque instantáneo | Persistente |

El usuario puede vaciar la caché en cualquier momento desde el botón interactivo del modal legal o desde las opciones de configuración de su navegador.

---

## 5. Política de Reembolso y Desistimiento / Refund & Withdrawal Policy

### 5.1 Gratuidad Total
OrientSol 4.0 es una plataforma científica y docente de **libre acceso y gratuita**. No se efectúan cobros, suscripciones de pago ni transacciones comerciales.

### 5.2 Cumplimiento con la Directiva 2011/83/UE y el Real Decreto Legislativo 1/2007 (TRLGDCU)
En cumplimiento de la legislación europea y española de defensa de los consumidores:
1. **Derecho Legal de Desistimiento de 14 Días:** Si en el futuro se prestase cualquier servicio comercial o de pago, el consumidor europeo gozará del derecho irrenunciable a desistir del contrato en el plazo de **14 días naturales** sin alegar motivo ni sufrir penalización alguna (Art. 102 TRLGDCU).
2. **Excepción para Suministro de Contenido Digital (Art. 103.m TRLGDCU):** Dicho derecho no aplicará a la ejecución de contenido digital inmediato no prestado en soporte material cuando se cuente con el consentimiento expreso previo del usuario y su renuncia informada.
3. **Plazo de Devolución:** Ante cualquier pago accidental o duplicado, el reintegro total se liquidará en un plazo máximo de **14 días naturales** a través del mismo canal de pago.

---

## 6. Informe de Seguridad y Auditoría Técnica / Security Audit Report

OrientSol 4.0 incorpora defensas técnicas preventivas en línea con las recomendaciones **OWASP Top 10** y buenas prácticas de seguridad de software:

* **Sandbox WebAssembly (Zero-RCE):** El motor Python (Pyodide) se compila a WebAssembly y corre aislado en la memoria del navegador. No tiene acceso al sistema de archivos del usuario, ni a comandos de consola del sistema operativo ni a sockets de red arbitrarios.
* **Defensa Universal contra Cross-Site Scripting (XSS):** Todas las variables dinámicas, nombres de estaciones y textos renderizados se sanean mediante `escapeHtml()` y `escapeAttr()`.
* **Defensa contra Inyección de Fórmulas y CSV (CWE-1236):** Toda exportación tabular generada hacia Microsoft Excel (.xlsx) y CSV aplica la rutina preventiva `sanitizeForSpreadsheet()`, anteponiendo un apóstrofe (`'`) a cualquier celda que comience por caracteres de ejecución de comandos (`=`, `+`, `-`, `@`, `|`, `%`).
* **Seguridad por Filas (RLS) en Supabase:** La base de datos en la nube está protegida contra borrado o sobreescritura maliciosa mediante políticas restrictivas de RLS y autenticación criptográfica.
* **Operación Segura Offline:** La aplicación cuenta con capacidades completas para ejecutarse desconectada de la red, garantizando inmunidad total frente a ataques de intermediario (MITM) e indisponibilidad de servidores externos.
* **Cifrado en Tránsito:** Todas las comunicaciones de red emplean HTTPS obligatorio con cifrado TLS 1.3.
