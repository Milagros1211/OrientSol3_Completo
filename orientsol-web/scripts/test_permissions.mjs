import { createClient } from '@supabase/supabase-js';

const url = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const key = 'sb_publishable_REDACTED_ANON_KEY';

const supabase = createClient(url, key);

async function testPermissions() {
  console.log('Testing insert of a test row...');
  const testRow = {
    nombre_emplazamiento: 'TEST_PERM_ROW_TEMP',
    latitud: 0,
    longitud: 0,
    mes: 1,
    radiacion_media: 1.0,
    temp_media: 10.0
  };

  const { data: insData, error: insErr } = await supabase
    .from('datos_mensuales')
    .insert([testRow])
    .select();

  console.log('Insert error:', insErr);
  console.log('Insert result:', insData);

  if (!insErr && insData && insData.length > 0) {
    console.log('Testing delete of test row...');
    const { error: delErr } = await supabase
      .from('datos_mensuales')
      .delete()
      .eq('nombre_emplazamiento', 'TEST_PERM_ROW_TEMP');
    console.log('Delete error:', delErr);
  }
}

testPermissions();
