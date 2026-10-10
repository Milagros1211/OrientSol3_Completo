import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('../BBDD import file.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets['IMPORTFILE'];
const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

const rowsToInsert = [];

for (let i = 2; i < json.length; i++) {
  const row = json[i];
  if (!row || !row[0]) continue;

  const cityName = String(row[0]).trim();
  const lon = Number(row[1]);
  const lat = Number(row[2]);

  for (let m = 1; m <= 12; m++) {
    const rad = Number(row[2 + m]);
    const temp = Number(row[14 + m]);

    rowsToInsert.push({
      nombre_emplazamiento: cityName,
      latitud: lat,
      longitud: lon,
      mes: m,
      radiacion_media: Number(rad.toFixed(2)),
      temp_media: Number(temp.toFixed(1))
    });
  }
}

const outputPath = path.resolve('../transformed_import_file_rows.json');
fs.writeFileSync(outputPath, JSON.stringify(rowsToInsert, null, 2), 'utf-8');

console.log(`Transformación exitosa:`);
console.log(`Total ciudades: ${json.length - 2}`);
console.log(`Total registros mensuales generados: ${rowsToInsert.length}`);
console.log(`Guardado en: ${outputPath}`);
console.log(`Muestra ciudad Albacete (meses 1 a 3):`, rowsToInsert.slice(0, 3));
console.log(`Muestra última ciudad (mes 12):`, rowsToInsert[rowsToInsert.length - 1]);
