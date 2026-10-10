import type { ClimateDataRecord } from '@/types/climate';

export interface ClimateParseResult {
  success: boolean;
  record?: ClimateDataRecord;
  error?: string;
  warnings?: string[];
  rawFormat?: 'orientsol_json' | 'pvgis_json' | 'orientsol_vertical_csv' | 'horizontal_csv' | 'pvgis_csv';
}


/**
 * Normalizes European decimal comma into standard decimal point.
 */
function parseNum(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return NaN;
  const cleaned = String(val).trim().replace(',', '.');
  return parseFloat(cleaned);
}

/**
 * Parses climate data from a JSON string.
 * Supports OrientSol native JSON format and PVGIS monthly output JSON.
 */
export function parseClimateJSON(jsonString: string, fileName = 'documento.json'): ClimateParseResult {
  const warnings: string[] = [];

  try {
    const data = JSON.parse(jsonString);

    // 1. Detect PVGIS API JSON format
    if (data.outputs && Array.isArray(data.outputs.monthly)) {
      const monthly = data.outputs.monthly;
      if (monthly.length < 12) {
        return {
          success: false,
          error: `El JSON de PVGIS contiene solo ${monthly.length} meses (se requieren 12).`,
        };
      }

      const gdm0: number[] = [];
      const tamb: number[] = [];

      for (let i = 0; i < 12; i++) {
        const m = monthly[i];
        // H(h)_m is in kWh/m2/month or day depending on endpoint. Normalize to kWh/m2/day.
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
        const hVal = parseNum(m['H(h)_m'] ?? m['H_m'] ?? m['Gdm0']);
        // If > 35, it's likely total monthly kWh/m2 -> divide by days
        const dailyG = hVal > 35 ? hVal / daysInMonth : hVal;
        const tVal = parseNum(m['T2m'] ?? m['T_amb'] ?? m['temp'] ?? 15.0);

        gdm0.push(Number(dailyG.toFixed(3)));
        tamb.push(Number(tVal.toFixed(2)));
      }

      const lat = parseNum(data.inputs?.location?.latitude ?? 40.4168);
      const lon = parseNum(data.inputs?.location?.longitude ?? -3.7038);
      const elev = parseNum(data.inputs?.location?.elevation ?? 600);

      const record: ClimateDataRecord = {
        id: `pvgis-import-${Date.now()}`,
        source: 'file_upload',
        locationName: data.inputs?.location?.name || `PVGIS Import (${fileName})`,
        country: 'Importado',
        latitude: lat,
        longitude: lon,
        elevationM: elev,
        monthlyGdm0: gdm0,
        monthlyTemperature: tamb,
        fetchedAt: new Date().toISOString(),
        metadata: {
          rawFormat: 'pvgis_json',
          originalFile: fileName,
        },
      };

      return { success: true, record, warnings, rawFormat: 'pvgis_json' };
    }

    // 2. OrientSol native JSON format
    const locationName = data.locationName || data.name || fileName.replace(/\.[^/.]+$/, '');
    const lat = parseNum(data.latitude ?? data.lat);
    const lon = parseNum(data.longitude ?? data.lon ?? 0.0);
    const elev = parseNum(data.elevationM ?? data.elevation ?? 500);

    const gdm0Raw = data.monthlyGdm0 || data.gdm0 || data.radiation;
    const tempRaw = data.monthlyTemperature || data.monthlyTempC || data.temperatures || data.temp;

    if (!Array.isArray(gdm0Raw) || gdm0Raw.length !== 12) {
      return {
        success: false,
        error: `Se requiere un array "monthlyGdm0" con exactamente 12 valores numéricos (encontrados: ${Array.isArray(gdm0Raw) ? gdm0Raw.length : 0}).`,
      };
    }

    const gdm0 = gdm0Raw.map((v, idx) => {
      const num = parseNum(v);
      if (isNaN(num) || num < 0) {
        warnings.push(`Mes ${idx + 1}: Radiación no válida (${v}), se ajustó a 0.`);
        return 0;
      }
      return Number(num.toFixed(3));
    });

    let tamb: number[];
    if (Array.isArray(tempRaw) && tempRaw.length === 12) {
      tamb = tempRaw.map((t) => Number(parseNum(t).toFixed(2)));
    } else {
      warnings.push('No se proporcionaron 12 temperaturas mensuales; se asignó perfil estándar de 15°C.');
      tamb = [6.0, 7.5, 10.5, 13.0, 17.0, 22.0, 25.5, 25.0, 21.0, 16.0, 10.0, 6.5];
    }

    const record: ClimateDataRecord = {
      id: `json-import-${Date.now()}`,
      source: 'file_upload',
      locationName,
      country: data.country || 'Personalizado',
      latitude: isNaN(lat) ? 40.0 : lat,
      longitude: isNaN(lon) ? 0.0 : lon,
      elevationM: isNaN(elev) ? 500 : elev,
      monthlyGdm0: gdm0,
      monthlyTemperature: tamb,
      fetchedAt: new Date().toISOString(),
      metadata: {
        rawFormat: 'orientsol_json',
        originalFile: fileName,
        albedo: parseNum(data.albedo ?? 0.20),
      },
    };

    return { success: true, record, warnings, rawFormat: 'orientsol_json' };
  } catch (err: any) {
    return {
      success: false,
      error: `Error de sintaxis JSON: ${err.message}`,
    };
  }
}

/**
 * Parses climate data from a CSV or TXT file string.
 * Supports comma or semicolon delimiters, vertical and horizontal schemas.
 */
export function parseClimateCSV(csvString: string, fileName = 'documento.csv'): ClimateParseResult {
  const warnings: string[] = [];
  const lines = csvString
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      success: false,
      error: 'El archivo CSV está vacío o contiene menos de 2 líneas válidas.',
    };
  }

  // Extract metadata headers starting with #
  let locationName = fileName.replace(/\.[^/.]+$/, '');
  let lat = 40.4168;
  let lon = -3.7038;
  let elev = 600;
  let albedo = 0.20;

  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('//')) {
      const lower = line.toLowerCase();
      if (lower.includes('localidad:') || lower.includes('location:')) {
        locationName = line.split(':')[1]?.trim() || locationName;
      } else if (lower.includes('latitud:') || lower.includes('lat:')) {
        lat = parseNum(line.split(':')[1]);
      } else if (lower.includes('longitud:') || lower.includes('lon:')) {
        lon = parseNum(line.split(':')[1]);
      } else if (lower.includes('altitud:') || lower.includes('elevation:')) {
        elev = parseNum(line.split(':')[1]);
      } else if (lower.includes('albedo:')) {
        albedo = parseNum(line.split(':')[1]);
      }
    } else {
      dataLines.push(line);
    }
  }

  if (dataLines.length === 0) {
    return { success: false, error: 'No se encontraron filas de datos en el CSV tras filtrar los comentarios.' };
  }

  // Detect delimiter (, or ;)
  const sample = dataLines[0];
  const delimiter = sample.split(';').length > sample.split(',').length ? ';' : ',';

  // Format 1: Horizontal CSV (Header with 12 months, row 1 = Gdm0, row 2 = Tamb)
  if (dataLines.length >= 2 && dataLines.length <= 4) {
    const row0 = dataLines[0].split(delimiter).map((c) => c.trim().toLowerCase());
    // Check if row 0 has month headers
    const hasMonthHeaders = row0.some((col) =>
      ['ene', 'jan', '1', 'mes 1', 'enero', 'january'].some((m) => col.includes(m))
    );

    if (hasMonthHeaders || dataLines.length === 2 || dataLines.length === 3) {
      let gdm0Row: string[] = [];
      let tambRow: string[] = [];

      for (let i = 1; i < dataLines.length; i++) {
        const parts = dataLines[i].split(delimiter).map((p) => p.trim());
        const label = parts[0].toLowerCase();
        if (label.includes('rad') || label.includes('gdm0') || label.includes('g0') || label.includes('global') || i === 1) {
          if (gdm0Row.length === 0) gdm0Row = parts.slice(1);
        }
        if (label.includes('temp') || label.includes('tamb') || label.includes('t2m') || i === 2) {
          if (tambRow.length === 0) tambRow = parts.slice(1);
        }
      }

      if (gdm0Row.length >= 12) {
        const monthlyGdm0 = gdm0Row.slice(0, 12).map((val) => parseNum(val));
        const monthlyTemp = tambRow.length >= 12
          ? tambRow.slice(0, 12).map((val) => parseNum(val))
          : [6.0, 7.5, 10.5, 13.0, 17.0, 22.0, 25.5, 25.0, 21.0, 16.0, 10.0, 6.5];

        const record: ClimateDataRecord = {
          id: `csv-horizontal-${Date.now()}`,
          source: 'file_upload',
          locationName,
          country: 'Personalizado',
          latitude: isNaN(lat) ? 40.0 : lat,
          longitude: isNaN(lon) ? 0.0 : lon,
          elevationM: isNaN(elev) ? 500 : elev,
          monthlyGdm0,
          monthlyTemperature: monthlyTemp,
          fetchedAt: new Date().toISOString(),
          metadata: { rawFormat: 'horizontal_csv', originalFile: fileName, albedo },
        };
        return { success: true, record, warnings, rawFormat: 'horizontal_csv' };
      }
    }
  }

  // Format 2: Vertical CSV (12 rows, 1 per month: Mes, Gdm0, Tamb)
  // Skip header if present
  let startIndex = 0;
  const firstCols = dataLines[0].split(delimiter);
  if (isNaN(parseNum(firstCols[0])) && isNaN(parseNum(firstCols[1]))) {
    startIndex = 1;
  }

  const verticalRows = dataLines.slice(startIndex).filter((r) => r.trim().length > 0);
  if (verticalRows.length >= 12) {
    const monthlyGdm0: number[] = [];
    const monthlyTemp: number[] = [];

    for (let i = 0; i < 12; i++) {
      const parts = verticalRows[i].split(delimiter).map((p) => p.trim());
      // Expecting either [Mes, Gdm0, Tamb] or [Gdm0, Tamb]
      let gVal: number;
      let tVal: number;

      if (parts.length >= 3) {
        gVal = parseNum(parts[1]);
        tVal = parseNum(parts[2]);
      } else if (parts.length === 2) {
        gVal = parseNum(parts[0]);
        tVal = parseNum(parts[1]);
      } else {
        gVal = parseNum(parts[0]);
        tVal = 15.0;
      }

      if (isNaN(gVal) || gVal < 0) {
        warnings.push(`Fila ${i + 1}: Radiación no válida (${parts[1] ?? parts[0]}), asignado valor 3.0.`);
        gVal = 3.0;
      }
      if (isNaN(tVal)) {
        tVal = 15.0;
      }

      monthlyGdm0.push(Number(gVal.toFixed(3)));
      monthlyTemp.push(Number(tVal.toFixed(2)));
    }

    const record: ClimateDataRecord = {
      id: `csv-vertical-${Date.now()}`,
      source: 'file_upload',
      locationName,
      country: 'Personalizado',
      latitude: isNaN(lat) ? 40.0 : lat,
      longitude: isNaN(lon) ? 0.0 : lon,
      elevationM: isNaN(elev) ? 500 : elev,
      monthlyGdm0,
      monthlyTemperature: monthlyTemp,
      fetchedAt: new Date().toISOString(),
      metadata: { rawFormat: 'orientsol_vertical_csv', originalFile: fileName, albedo },
    };

    return { success: true, record, warnings, rawFormat: 'orientsol_vertical_csv' };
  }

  return {
    success: false,
    error: `No se pudieron extraer 12 meses del CSV. Se detectaron ${verticalRows.length} filas válidas. Utilice una de las plantillas descargables.`,
  };
}

/**
 * Generates sample CSV template for download.
 */
export function generateSampleCSV(): string {
  return `# OrientSol 3.0 - Plantilla de Climatología Mensual
# Localidad: Mi Instalación Solar
# Latitud: 37.3891
# Longitud: -5.9845
# Altitud: 35
# Albedo: 0.20
Mes,Gdm0_kWh_m2_dia,Temperatura_C
1,2.58,11.0
2,3.62,12.5
3,4.95,15.6
4,6.05,17.9
5,7.12,21.8
6,8.01,26.3
7,8.15,28.2
8,7.28,28.0
9,5.65,25.0
10,4.02,20.2
11,2.82,15.1
12,2.24,11.9
`;
}

/**
 * Generates sample JSON template for download.
 */
export function generateSampleJSON(): string {
  return JSON.stringify(
    {
      locationName: 'Mi Instalación Solar',
      country: 'España',
      latitude: 37.3891,
      longitude: -5.9845,
      elevationM: 35,
      albedo: 0.20,
      monthlyGdm0: [2.58, 3.62, 4.95, 6.05, 7.12, 8.01, 8.15, 7.28, 5.65, 4.02, 2.82, 2.24],
      monthlyTemperature: [11.0, 12.5, 15.6, 17.9, 21.8, 26.3, 28.2, 28.0, 25.0, 20.2, 15.1, 11.9],
      notes: 'Valores mensuales de radiación global horizontal media diaria Gdm(0) [kWh/m2/día] y temperatura media [°C]'
    },
    null,
    2
  );
}
