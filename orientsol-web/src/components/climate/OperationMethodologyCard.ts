import katex from 'katex';
import { formatNum } from '@/utils/formatters';

function renderTex(expr: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(expr, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
    });
  } catch (err) {
    return `<code>${expr}</code>`;
  }
}

export type SolarOperationType =
  | 'annual'
  | 'monthly'
  | 'seasonal'
  | 'polar'
  | 'azimuthal'
  | 'horizontal'
  | 'dual'
  | 'comparative';

interface OperationData {
  badge: string;
  title: string;
  summary: string;
  inputDescription: string;
  mathProcessTitle: string;
  mathSteps: { label: string; formula: string; note?: string }[];
  outputSummary: string;
}

function getOperationData(op: SolarOperationType, isEn: boolean, latitude: number, locationName: string): OperationData {
  const latStr = `${formatNum(latitude, 2)}°`;

  switch (op) {
    case 'annual':
      return {
        badge: isEn ? 'Operation 1 • Annual Optimum' : 'Operación 1 • Óptimo Anual',
        title: isEn
          ? 'Annual Optimal Tilt Search (Fixed Slope)'
          : 'Búsqueda del Ángulo Fijo Óptimo Anual',
        summary: isEn
          ? `Calculates the single, optimal fixed inclination angle β_optimal that maximizes total solar energy captured over the entire 365-day year at ${locationName} (φ = ${latStr}).`
          : `Calcula el ángulo de inclinación fijo único β_óptimo que maximiza la captación total de radiación solar acumulada a lo largo de los 365 días del año en ${locationName} (φ = ${latStr}).`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Monthly global horizontal radiation vector ${renderTex('G_{dm}(0) \\in \\mathbb{R}^{12}')} [kWh/m²·day], latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}, ground albedo ${renderTex('\\rho_{\\text{albedo}} = 0{,}20')} and Klein characteristic day ${renderTex('n_m')}.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Vector mensual de irradiación global sobre plano horizontal ${renderTex('G_{dm}(0) \\in \\mathbb{R}^{12}')} [kWh/m²·día], latitud geográfica ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}, albedo del suelo ${renderTex('\\rho_{\\text{albedo}} = 0{,}20')} y día medio de Klein ${renderTex('n_m')}.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Horizontal Liu-Jordan Decomposition:' : '1. Descomposición Horizontal de Liu-Jordan:',
            formula: '\\begin{aligned} K_{\\text{claridad}, m} &= \\frac{G_{dm}(0)_m}{G_{0d}(\\phi_{\\text{lat}}, n_m)}, \\quad K_{\\text{difusa}, m} = 1{,}0 - 1{,}13\\, K_{\\text{claridad}, m} \\\\[2pt] D_{dm}(0)_m &= K_{\\text{difusa}, m} \\cdot G_{dm}(0)_m, \\quad B_{dm}(0)_m = G_{dm}(0)_m - D_{dm}(0)_m \\end{aligned}',
            note: isEn
              ? 'Splits global horizontal input radiation into direct beam and diffuse fractions.'
              : 'Separa la radiación horizontal de entrada en componente directa B_dm(0) y difusa D_dm(0).'
          },
          {
            label: isEn ? '2. Isotropic Transposition to 91 Tilt Angles:' : '2. Transposición Isotrópica a 91 Inclinaciones:',
            formula: '\\begin{aligned} G_{dm}(\\beta)_m &= B_{dm}(0)_m \\cdot R_b(\\phi_{\\text{lat}}, \\delta_m, \\beta) + D_{dm}(0)_m \\left( \\frac{1 + \\cos\\beta}{2} \\right) \\\\[2pt] &\\quad + G_{dm}(0)_m \\cdot \\rho_{\\text{albedo}} \\left( \\frac{1 - \\cos\\beta}{2} \\right) \\end{aligned}',
            note: isEn
              ? 'Applies Klein geometric direct beam factor R_b and isotropic sky vault diffuse transposition for β in [0°..90°].'
              : 'Aplica el factor geométrico R_b y la bóveda celeste isotrópica para cada inclinación fija β en [0°..90°].'
          },
          {
            label: isEn ? '3. Annual Energy Summation & Optimum Tilt:' : '3. Integración Anual y Búsqueda de Óptimo:',
            formula: '\\beta_{\\text{óptimo}} = \\arg\\max_{\\beta \\in [0^\\circ, 90^\\circ]} \\sum_{m=1}^{12} G_{dm}(\\beta)_m \\cdot N_{\\text{días}, m}',
            note: isEn
              ? 'Identifies the tilt angle that maximizes annual collector capture across all 12 months.'
              : 'Identifica la inclinación fija que maximiza la captación total anual ponderada por los días del mes.'
          },
          {
            label: isEn ? '4. Annual Energy Gain vs Horizontal:' : '4. Balance de Ganancia Relativa vs Horizontal:',
            formula: '\\text{Ganancia (\\%)} = \\left[ \\frac{\\sum_{m=1}^{12} G_{dm}(\\beta_{\\text{óptimo}})_m \\cdot N_{\\text{días}, m} - \\sum_{m=1}^{12} G_{dm}(0)_m \\cdot N_{\\text{días}, m}}{\\sum_{m=1}^{12} G_{dm}(0)_m \\cdot N_{\\text{días}, m}} \\right] \\times 100',
            note: isEn ? 'Yield increase obtained by tilting the surface to the optimal angle.' : 'Incremento energético obtenido al inclinar la superficie al ángulo óptimo respecto al plano horizontal.'
          }
        ],
        outputSummary: isEn
          ? 'Output: Single fixed angle β_optimal, 12 transposed monthly values, and total annual collection.'
          : 'Resultado: Ángulo óptimo anual fijo β_óptimo, irradiación mensual transpuesta y balance de ganancia.'
      };

    case 'monthly':
      return {
        badge: isEn ? 'Operation 2 • Monthly Optimum' : 'Operación 2 • Optimización Mensual',
        title: isEn
          ? 'Independent Monthly Tilt Optimization (12 Positions)'
          : 'Optimización Mensual Independiente (12 Ajustes al Año)',
        summary: isEn
          ? `Determines 12 distinct optimal tilt angles β_optimal(m), one for each individual month, adapting to seasonal solar elevation changes.`
          : `Determina 12 ángulos de inclinación óptimos independientes β_óptimo(m), uno para cada mes individual, adaptándose a la altura solar estacional.`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Monthly input radiation ${renderTex('G_{dm}(0)_m')}, latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}, and monthly declination ${renderTex('\\delta_m')}.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Radiación mensual ${renderTex('G_{dm}(0)_m')}, latitud ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)} y declinación solar mensual ${renderTex('\\delta_m')}.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Month-by-Month Maximum Search:' : '1. Búsqueda Desacoplada del Máximo Mensual:',
            formula: '\\beta_{\\text{óptimo}, m} = \\arg\\max_{\\beta \\in [0^\\circ, 90^\\circ]} G_{dm}(\\beta)_m \\qquad (m = 1, \\dots, 12)',
            note: isEn
              ? 'Each month selects its own tilt angle that maximizes daily irradiation during that specific month.'
              : 'Cada mes selecciona su propia inclinación maximizando la irradiación captada de forma independiente.'
          },
          {
            label: isEn ? '2. Solar Declination Coupling:' : '2. Relación Física con la Declinación Solar:',
            formula: '\\beta_{\\text{óptimo}, m} \\approx \\phi_{\\text{lat}} - \\delta_m',
            note: isEn
              ? 'In winter (low sun, negative declination), optimal tilt increases; in summer (high sun), optimal tilt decreases.'
              : 'En invierno (sol bajo, declinación negativa) la inclinación óptima aumenta; en verano (sol alto) disminuye.'
          },
          {
            label: isEn ? '3. Cumulative Monthly Optimized Annual Energy:' : '3. Energía Anual Acumulada con Ajuste Mensual:',
            formula: 'E_{\\text{anual, mensual}} = \\sum_{m=1}^{12} G_{dm}(\\beta_{\\text{óptimo}, m})_m \\cdot N_{\\text{días}, m}'
          }
        ],
        outputSummary: isEn
          ? 'Output: 12 specific optimal tilt angles and maximized monthly insolation profile.'
          : 'Resultado: Vector de 12 ángulos óptimos mensuales y máxima captación estacional posible en superficie fija ajustable.'
      };

    case 'seasonal':
      return {
        badge: isEn ? 'Operation 3 • Seasonal Tilt' : 'Operación 3 • Óptimo Estacional',
        title: isEn
          ? 'Seasonal Tilt Optimization (2 and 4 Changes per Year)'
          : 'Inclinación Óptima Estacional (2 y 4 Posiciones Anuales)',
        summary: isEn
          ? `Groups the 12 input months into seasonal periods S_k and computes the compromise optimal angle for each season.`
          : `Agrupa los 12 meses de entrada en bloques estacionales S_k y calcula la inclinación fija de compromiso óptima para cada periodo.`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Monthly radiation ${renderTex('G_{dm}(0)_m')}, latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}, and seasonal calendar definition.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Radiación mensual ${renderTex('G_{dm}(0)_m')}, latitud ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)} y calendario de partición estacional.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Seasonal Energy Maximization per Block:' : '1. Maximización de Energía por Bloque Estacional:',
            formula: '\\beta_{\\text{estación}, k} = \\arg\\max_{\\beta \\in [0^\\circ, 90^\\circ]} \\sum_{m \\in S_k} G_{dm}(\\beta)_m \\cdot N_{\\text{días}, m}',
            note: isEn ? 'Maximizes total energy collected during the months belonging to season S_k.' : 'Maximiza la energía acumulada durante el conjunto de meses que componen la estación S_k.'
          },
          {
            label: isEn ? '2. Bi-Annual & Quad-Annual Rules:' : '2. Reglas Canónicas Semestrales y Trimestrales:',
            formula: '\\begin{aligned} \\text{2 Posiciones (Inv / Ver):} &\\quad \\beta_{\\text{ver}} \\approx \\phi_{\\text{lat}} - 15^\\circ, \\quad \\beta_{\\text{inv}} \\approx \\phi_{\\text{lat}} + 15^\\circ \\\\[2pt] \\text{4 Posiciones (Estacionales):} &\\quad \\beta_{\\text{ver}} \\approx \\phi_{\\text{lat}} - 23{,}4^\\circ, \\quad \\beta_{\\text{inv}} \\approx \\phi_{\\text{lat}} + 23{,}4^\\circ, \\quad \\beta_{\\text{equinoccios}} \\approx \\phi_{\\text{lat}} \\end{aligned}'
          }
        ],
        outputSummary: isEn
          ? 'Output: 2 or 4 seasonal compromise angles with near-tracker performance at low maintenance cost.'
          : 'Resultado: 2 o 4 ángulos estacionales de compromiso que captan ~95% del óptimo mensual sin coste de motorización continua.'
      };

    case 'polar':
      return {
        badge: isEn ? 'Operation 4 • Polar Tracking' : 'Operación 4 • Seguidor Eje Polar',
        title: isEn
          ? 'Single-Axis Polar Solar Tracking (Equatorial Axis)'
          : 'Seguidor Solar en 1 Eje Polar (Eje Paralelo al de la Tierra)',
        summary: isEn
          ? `Tracks the sun around an axis tilted at an angle equal to the local latitude φ, following the solar hour angle ω from East to West.`
          : `Sigue al sol girando sobre un eje orientado Norte-Sur e inclinado un ángulo igual a la latitud φ, rotando de Este a Oeste con el ángulo horario solar ω.`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Monthly beam ${renderTex('B_{dm}(0)_m')} and diffuse ${renderTex('D_{dm}(0)_m')} components, latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Componentes directa ${renderTex('B_{dm}(0)_m')} y difusa ${renderTex('D_{dm}(0)_m')}, latitud geográfica ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Axis Alignment & Rotation Law:' : '1. Alineación Estructural y Ley de Giro Horario:',
            formula: '\\beta_{\\text{eje}} = \\phi_{\\text{lat}}, \\qquad \\gamma_{\\text{eje}} = 0^\\circ \\text{ (Sur astronómico)}, \\qquad \\omega(t) = 15^\\circ \\cdot (t - 12\\text{h})'
          },
          {
            label: isEn ? '2. Direct Beam Incidence Angle:' : '2. Ángulo de Incidencia sobre Superficie Polar:',
            formula: '\\cos\\theta_{\\text{incidencia}} = \\cos\\delta_m',
            note: isEn
              ? 'Incidence angle depends only on seasonal declination; diurnal cosine losses are eliminated completely.'
              : 'El ángulo de incidencia depende únicamente de la declinación estacional; las pérdidas diurnas por desalineación horaria son nulas.'
          },
          {
            label: isEn ? '3. Daily Polar Transposed Radiation:' : '3. Irradiación Diaria Transpuesta Polar:',
            formula: 'G_{dm,\\text{polar}} = B_{dm}(0)_m \\cdot R_{b,\\text{polar}}(\\phi_{\\text{lat}}, \\delta_m) + D_{dm}(0)_m \\left( \\frac{1 + \\cos\\phi_{\\text{lat}}}{2} \\right) + G_{dm}(0)_m \\cdot \\rho_{\\text{albedo}} \\left( \\frac{1 - \\cos\\phi_{\\text{lat}}}{2} \\right)'
          }
        ],
        outputSummary: isEn
          ? 'Output: Very high annual energy gain (+25% to +35% over horizontal) with simple single-axis mechanism.'
          : 'Resultado: Gran incremento de captación anual (+25% a +35% sobre plano horizontal) con un único grado de libertad mecánico.'
      };

    case 'azimuthal':
      return {
        badge: isEn ? 'Operation 5 • Azimuthal Tracking' : 'Operación 5 • Seguidor Azimutal',
        title: isEn
          ? 'Single-Axis Azimuthal Tracking (Vertical Axis)'
          : 'Seguidor Solar en 1 Eje Azimutal (Eje Vertical con Inclinación Fija)',
        summary: isEn
          ? `Rotates around a vertical axis to match the solar azimuth γ_s, maintaining a constant fixed panel slope β.`
          : `Gira alrededor de un eje vertical perpendicular al terreno siguiendo el acimut del sol γ_s, manteniendo el panel a una inclinación fija β.`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Monthly input radiation ${renderTex('G_{dm}(0)_m')}, latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}, and fixed surface tilt ${renderTex('\\beta_{\\text{fijo}}')}.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Radiación horizontal ${renderTex('G_{dm}(0)_m')}, latitud ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)} e inclinación fija seleccionada ${renderTex('\\beta_{\\text{fijo}}')}.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Azimuthal Tracking Condition:' : '1. Condición de Encaramiento Azimutal:',
            formula: '\\gamma_{\\text{panel}}(t) = \\gamma_{\\text{sol}}(t)'
          },
          {
            label: isEn ? '2. Beam Incidence Cosine with Elevation α_s:' : '2. Coseno de Incidencia con Altura Solar α_s:',
            formula: '\\cos\\theta_{\\text{incidencia}}(t) = \\sin\\alpha_s(t) \\cos\\beta_{\\text{panel}} + \\cos\\alpha_s(t) \\sin\\beta_{\\text{panel}}'
          }
        ],
        outputSummary: isEn
          ? 'Output: Significantly boosted morning and evening collection, flattening the daily power generation profile.'
          : 'Resultado: Máxima captación a primeras y últimas horas del día, ensanchando la curva de potencia diurna.'
      };

    case 'horizontal':
      return {
        badge: isEn ? 'Operation 6 • Horizontal Tracking' : 'Operación 6 • Seguidor Eje Horizontal',
        title: isEn
          ? 'Single-Axis Horizontal Tracking (East-West Axis)'
          : 'Seguidor Solar en 1 Eje Horizontal Este-Oeste',
        summary: isEn
          ? `Rotates around a horizontal ground axis oriented East-West, tilting panels North-South to follow solar meridian altitude.`
          : `Rota sobre un eje tendido horizontalmente en dirección Este-Oeste, inclinando los módulos de Norte a Sur según la elevación meridiana.`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Input radiation ${renderTex('G_{dm}(0)_m')}, latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}, and solar elevation trajectory ${renderTex('\\alpha_s(t)')}.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Radiación horizontal ${renderTex('G_{dm}(0)_m')}, latitud ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)} y trayectoria de elevación solar ${renderTex('\\alpha_s(t)')}.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Horizontal E-W Axis Alignment:' : '1. Orientación Estructural del Eje:',
            formula: '\\beta_{\\text{eje}} = 0^\\circ, \\qquad \\gamma_{\\text{eje}} = 90^\\circ \\text{ / } 270^\\circ \\text{ (Este-Oeste)}'
          },
          {
            label: isEn ? '2. Instantaneous Tilt Tracking Law:' : '2. Ley de Basculación Instantánea según Altura Solar:',
            formula: '\\beta_{\\text{seguidor}}(t) = 90^\\circ - \\alpha_s(t)'
          }
        ],
        outputSummary: isEn
          ? 'Output: Robust mechanical design especially productive in tropical and equatorial regions (φ < 25°).'
          : 'Resultado: Arquitectura mecánica de bajo coste con óptimo desempeño en latitudes tropicales y subtropicales (φ < 25°).'
      };

    case 'dual':
      return {
        badge: isEn ? 'Operation 7 • Two-Axis Tracking' : 'Operación 7 • Seguidor a Dos Ejes',
        title: isEn
          ? 'Two-Axis Full Solar Tracking (Continuous Normal Incidence)'
          : 'Seguidor Solar a Dos Ejes (Incidencia Normal Continua)',
        summary: isEn
          ? `Follows the sun continuously in both azimuth and elevation, ensuring rays strike perpendicular to the surface at every moment.`
          : `Sigue al sol de forma continua y simultánea en acimut y elevación, garantizando incidencia perpendicular exacta (θ = 0°) en todo momento.`,
        inputDescription: isEn
          ? `<strong>Input Climatology Data:</strong> Direct beam vector ${renderTex('B_{dm}(0)_m')} and diffuse vector ${renderTex('D_{dm}(0)_m')} at latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}.`
          : `<strong>Datos Climatológicos de Entrada (Input):</strong> Componente directa ${renderTex('B_{dm}(0)_m')} y difusa ${renderTex('D_{dm}(0)_m')} a latitud ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)}.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Bi-Axial Angular Tracking Law:' : '1. Ley de Seguimiento Biaxial Simultáneo:',
            formula: '\\gamma_{\\text{panel}}(t) = \\gamma_{\\text{sol}}(t), \\qquad \\beta_{\\text{panel}}(t) = 90^\\circ - \\alpha_s(t)'
          },
          {
            label: isEn ? '2. Exact Orthogonal Beam Incidence (Cosine Loss Zero):' : '2. Incidencia Ortogonal Perfecta (Pérdidas por Coseno Cero):',
            formula: '\\theta_{\\text{incidencia}} = 0^\\circ \\implies \\cos\\theta_{\\text{incidencia}} = 1{,}0'
          },
          {
            label: isEn ? '3. Maximum Theoretical Physical Limit:' : '3. Límite Físico Superior de Captación Solar:',
            formula: 'G_{dm,\\text{dos ejes}} = B_{dm}(0)_m \\cdot R_{b,\\text{normal}} + D_{dm,\\text{dos ejes}} + G_{\\text{albedo}}',
            note: isEn
              ? 'Captures 100% of available direct radiation without any geometric projection loss.'
              : 'Aprovecha el 100% de la radiación directa disponible sin penalizaciones trigonométricas de proyección oblicua.'
          }
        ],
        outputSummary: isEn
          ? 'Output: Absolute upper benchmark limit (+35% to +45% annual gain) representing ideal solar capture.'
          : 'Resultado: Techo físico ideal de captación (+35% a +45% de ganancia anual sobre el plano horizontal).'
      };

    case 'comparative':
    default:
      return {
        badge: isEn ? 'Operation 8 • Multi-Model Benchmark' : 'Operación 8 • Comparativa Global',
        title: isEn
          ? 'Comparative Multi-Topology Solar Benchmark (8 Models)'
          : 'Comparativa Global Multimodelo (8 Topologías de Captación)',
        summary: isEn
          ? `Evaluates all 8 solar orientation and tracking topologies under identical input climatology data and physics rules.`
          : `Evalúa y contrasta en paralelo las 8 configuraciones de captación bajo las mismas condiciones climatológicas y motor físico de OrientSol.`,
        inputDescription: isEn
          ? `<strong>Common Input Climatology:</strong> Identical input vector ${renderTex('G_{dm}(0) \\in \\mathbb{R}^{12}')} and latitude ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)} applied equally to all 8 technologies.`
          : `<strong>Datos Climatológicos Comunes de Entrada:</strong> Mismo vector ${renderTex('G_{dm}(0) \\in \\mathbb{R}^{12}')} y latitud ${renderTex(`\\phi_{\\text{lat}} = ${latStr}`)} inyectados a las 8 tecnologías.`,
        mathProcessTitle: isEn ? 'Mathematical Algorithm & Formulations:' : 'Procedimiento y Algoritmo Matemático:',
        mathSteps: [
          {
            label: isEn ? '1. Annual Energy Yield for Each Topology k in [1..8]:' : '1. Energía Anual Captada para Cada Topología k en [1..8]:',
            formula: 'E_{\\text{anual}, k} = \\sum_{m=1}^{12} G_{dm, k, m} \\cdot N_{\\text{días}, m}'
          },
          {
            label: isEn ? '2. Normalized Relative Percentage Gain vs Horizontal (0°):' : '2. Ganancia Porcentual Normalizada respecto a Horizontal (0°):',
            formula: '\\text{Ganancia}_k (\\%) = \\left[ \\frac{E_{\\text{anual}, k} - E_{\\text{anual}}(0^\\circ)}{E_{\\text{anual}}(0^\\circ)} \\right] \\times 100'
          }
        ],
        outputSummary: isEn
          ? 'Output: Complete ranking of all 8 topologies with energy gains, helping choose between fixed tilt and tracking.'
          : 'Resultado: Clasificación energética completa de las 8 topologías para la toma de decisiones técnico-económicas de diseño.'
      };
  }
}

/**
 * Renders the responsive methodology and input data card for the currently selected solar operation.
 */
export function renderOperationMethodologyCard(
  op: SolarOperationType,
  isEn: boolean,
  latitude: number,
  locationName: string
): HTMLElement {
  const data = getOperationData(op, isEn, latitude, locationName);
  // Operation 8 (comparative) must not display the mathematical foundation
  const showMath = op !== 'comparative';
  const container = document.createElement('div');
  container.className = 'op-methodology-card-root';

  container.innerHTML = `
    <div class="op-methodology-card">
      <!-- Header Row with badge and toggle -->
      <div class="op-methodology-header">
        <div class="op-methodology-title-wrap">
          <span class="op-methodology-badge">${data.badge}</span>
          <h4 class="op-methodology-title">${data.title}</h4>
        </div>
        ${showMath ? `<button type="button" class="btn-toggle-op-methodology" id="btn-toggle-op-methodology" title="${isEn ? 'Collapse / Expand details' : 'Plegar / Desplegar detalles'}">
          <span class="toggle-icon">−</span>
          <span class="toggle-text">${isEn ? 'Mathematical Foundation' : 'Fundamento Matemático'}</span>
        </button>` : ''}
      </div>

      <!-- Collapsible Body with auto-adjusting height -->
      <div class="op-methodology-body" id="op-methodology-body">
        <div class="op-methodology-summary">
          ${data.summary}
        </div>

        <div class="op-methodology-grid" ${showMath ? '' : 'style="grid-template-columns: 1fr;"'}>
          <!-- Column 1: Input Data Processing -->
          <div class="op-methodology-col-input">
            <div class="op-col-header">
              <span class="col-icon">📥</span>
              <strong>${isEn ? 'Input Climatology Data Treatment:' : 'Tratamiento de Data Input Climatológica:'}</strong>
            </div>
            <div class="op-input-content">
              ${data.inputDescription}
            </div>
            <div class="op-col-output">
              <span class="col-icon">🎯</span>
              <span><strong>${isEn ? 'Objective:' : 'Objetivo:'}</strong> ${data.outputSummary}</span>
            </div>
          </div>

          <!-- Column 2: Mathematical Formulations with Descriptive LaTeX Variables -->
          ${showMath ? `<div class="op-methodology-col-math">
            <div class="op-col-header">
              <span class="col-icon">📐</span>
              <strong>${data.mathProcessTitle}</strong>
            </div>
            <div class="op-math-steps-list">
              ${data.mathSteps
                .map(
                  (step) => `
                <div class="op-math-step-item">
                  <div class="op-math-step-label">${step.label}</div>
                  <div class="math-formula-box op-math-box">
                    <div style="color: var(--text-main); text-align: center; width: 100%;">
                      ${renderTex(step.formula, true)}
                    </div>
                  </div>
                  ${step.note ? `<div class="op-math-step-note">${step.note}</div>` : ''}
                </div>
              `
                )
                .join('')}
            </div>
          </div>` : ''}
        </div>
      </div>
    </div>
  `;

  // Wire interactive collapse/expand toggle
  const toggleBtn = container.querySelector<HTMLButtonElement>('#btn-toggle-op-methodology');
  const bodyEl = container.querySelector<HTMLDivElement>('#op-methodology-body');
  if (toggleBtn && bodyEl) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = bodyEl.classList.toggle('collapsed');
      const icon = toggleBtn.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = isCollapsed ? '+' : '−';
      }
    });
  }

  return container;
}
