
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTotalCutoffs() {
  const { count } = await supabase
    .from('colleges')
    .select('*', { count: 'exact', head: true })
    .not('cutoffs', 'is', null);

  console.log('Total Colleges with non-null cutoffs:', count);
}

checkTotalCutoffs();
