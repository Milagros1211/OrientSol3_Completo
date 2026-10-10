import { createClient } from '@supabase/supabase-js';

const url = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const key = 'sb_publishable_z10EZMPe3-XxMCE5XqVrVA_QlcJ020t';

const supabase = createClient(url, key);

async function testUpsert() {
  const row = {
    nombre_emplazamiento: 'Albacete',
    latitud: 38.9975,
    longitud: -1.86,
    mes: 1,
    radiacion_media: 2.33,
    temp_media: 5.2
  };

  const res = await supabase
    .from('datos_mensuales')
    .upsert([row], { onConflict: 'nombre_emplazamiento,mes' })
    .select();

  console.log('Upsert res error:', res.error);
  console.log('Upsert res data:', res.data);
}

testUpsert();
