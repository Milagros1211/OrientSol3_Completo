import fs from 'fs';
import path from 'path';

const jsonPath = path.resolve('../transformed_import_file_rows.json');
const rows = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

let sql = `-- =========================================================================\n`;
sql += `-- OrientSol 4.0: Script de sustitución completa de datos_mensuales\n`;
sql += `-- Generado automáticamente desde 'BBDD import file.xlsx'\n`;
sql += `-- Total ciudades: 114 | Total registros mensuales: ${rows.length}\n`;
sql += `-- =========================================================================\n\n`;

sql += `-- 1. Vaciar todas las entradas anteriores\n`;
sql += `TRUNCATE TABLE datos_mensuales;\n\n`;

sql += `-- 2. Inserción de todos los 1368 registros limpios de 'BBDD import file.xlsx'\n`;
sql += `INSERT INTO datos_mensuales (nombre_emplazamiento, latitud, longitud, mes, radiacion_media, temp_media) VALUES\n`;

const valuesSql = rows.map((r, i) => {
  const safeName = r.nombre_emplazamiento.replace(/'/g, "''");
  return `('${safeName}', ${r.latitud}, ${r.longitud}, ${r.mes}, ${r.radiacion_media}, ${r.temp_media})`;
}).join(',\n');

sql += valuesSql + ';\n';

const sqlPath = path.resolve('../import_BBDD_to_supabase.sql');
fs.writeFileSync(sqlPath, sql, 'utf-8');

console.log(`Script SQL generado exitosamente en: ${sqlPath}`);
console.log(`Tamaño del archivo: ${(sql.length / 1024).toFixed(1)} KB`);
