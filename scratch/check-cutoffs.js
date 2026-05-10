
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCutoffs() {
  const { data: colleges } = await supabase
    .from('colleges')
    .select('id, name, cutoffs')
    .not('cutoffs', 'is', null)
    .limit(10);

  console.log('Colleges with non-null cutoffs:', colleges?.length || 0);
  if (colleges && colleges.length > 0) {
    console.log('Sample Cutoffs:', JSON.stringify(colleges[0].cutoffs, null, 2));
  }
}

checkCutoffs();
