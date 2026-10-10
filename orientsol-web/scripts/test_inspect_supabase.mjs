import { createClient } from '@supabase/supabase-js';

const url = 'https://dqdkjkcmdsolpobxfbfi.supabase.co';
const key = 'sb_publishable_z10EZMPe3-XxMCE5XqVrVA_QlcJ020t';

const supabase = createClient(url, key);

async function inspect() {
  const { data, error, count } = await supabase
    .from('datos_mensuales')
    .select('*', { count: 'exact' })
    .limit(3);

  console.log('Error:', error);
  console.log('Count:', count);
  if (data && data.length > 0) {
    console.log('Sample row columns:', Object.keys(data[0]));
    console.log('Sample row 0:', data[0]);
  }
}

inspect();
