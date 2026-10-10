import XLSX from 'xlsx';
import path from 'path';

const filePath = path.resolve('../BBDD import file.xlsx');
console.log('Leyendo:', filePath);
const wb = XLSX.readFile(filePath);
console.log('Hojas en el libro:', wb.SheetNames);

for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
  console.log(`\n--- Hoja: ${name} (Filas: ${json.length}) ---`);
  for (let i = 0; i < Math.min(6, json.length); i++) {
    console.log(`Fila ${i + 1}:`, json[i]);
  }
}
