import XLSX from 'xlsx';
import path from 'path';

const filePath = path.resolve('../BBDD import file.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets['IMPORTFILE'];
const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('Total rows:', json.length);
const headerRow = json[1];
console.log('Headers:', headerRow);

const cities = [];
for (let i = 2; i < json.length; i++) {
  const row = json[i];
  if (!row || !row[0]) continue;
  cities.push({
    nombre: String(row[0]).trim(),
    lon: Number(row[1]),
    lat: Number(row[2]),
    rad: row.slice(3, 15).map(Number),
    temp: row.slice(15, 27).map(Number)
  });
}

console.log('Total cities parsed:', cities.length);
console.log('First 3 cities:', cities.slice(0, 3));
console.log('Last 3 cities:', cities.slice(-3));
