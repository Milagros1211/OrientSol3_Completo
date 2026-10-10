import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const url = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const key = 'sb_publishable_z10EZMPe3-XxMCE5XqVrVA_QlcJ020t';

const supabase = createClient(url, key);

async function backup() {
  console.log('Downloading all current rows from datos_mensuales...');
  const allRows = [];
  let from = 0;
  const PAGE_SIZE = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('datos_mensuales')
      .select('*')
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  const backupPath = path.resolve('../backup_datos_mensuales_before_import.json');
  fs.writeFileSync(backupPath, JSON.stringify(allRows, null, 2), 'utf-8');
  console.log(`Backup completed: ${allRows.length} rows saved to ${backupPath}`);
}

backup();
