import { createClient } from '@supabase/supabase-js';

const url = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const key = 'sb_publishable_REDACTED_ANON_KEY';

const supabase = createClient(url, key);

async function testDel() {
  // Let's get one real row ID
  const { data: oneRow } = await supabase.from('datos_mensuales').select('*').limit(1);
  console.log('Sample row to test delete on:', oneRow);

  if (oneRow && oneRow.length > 0) {
    const id = oneRow[0].id;
    const name = oneRow[0].nombre_emplazamiento;
    console.log(`Trying delete by id eq ${id}...`);
    const resId = await supabase.from('datos_mensuales').delete().eq('id', id).select();
    console.log('Delete by id:', resId);

    console.log(`Trying delete by nombre_emplazamiento eq '${name}'...`);
    const resName = await supabase.from('datos_mensuales').delete().eq('nombre_emplazamiento', name).select();
    console.log('Delete by name:', resName);
  }
}

testDel();
