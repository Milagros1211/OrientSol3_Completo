import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const url = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const key = 'sb_publishable_z10EZMPe3-XxMCE5XqVrVA_QlcJ020t';

const supabase = createClient(url, key);

async function executeReplace() {
  const jsonPath = path.resolve('../transformed_import_file_rows.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error('No se encontró transformed_import_file_rows.json. Ejecuta antes scripts/transform_import_file.mjs');
  }

  const rowsToInsert = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Preparado para insertar ${rowsToInsert.length} filas.`);

  console.log('1. Purgando todas las filas de datos_mensuales...');
  // Delete all rows where id > 0
  const { error: delErr } = await supabase
    .from('datos_mensuales')
    .delete()
    .neq('id', 0);

  if (delErr) {
    console.error('Error al purgar datos_mensuales:', delErr);
    return;
  }
  console.log('Purgado completado exitosamente.');

  console.log('2. Insertando 1368 registros en lotes de 200...');
  const BATCH_SIZE = 200;
  for (let i = 0; i < rowsToInsert.length; i += BATCH_SIZE) {
    const chunk = rowsToInsert.slice(i, i + BATCH_SIZE);
    const { error: insErr } = await supabase
      .from('datos_mensuales')
      .insert(chunk);

    if (insErr) {
      console.error(`Error insertando lote ${i} - ${i + chunk.length}:`, insErr);
      return;
    }
    console.log(`Insertados ${Math.min(i + BATCH_SIZE, rowsToInsert.length)} / ${rowsToInsert.length} registros...`);
  }

  // 3. Verificación final
  const { count, error: countErr } = await supabase
    .from('datos_mensuales')
    .select('*', { count: 'exact', head: true });

  console.log(`\nVerificación final en Supabase:`);
  console.log(`Total registros en datos_mensuales: ${count} (Esperados: 1368)`);
}

executeReplace();
