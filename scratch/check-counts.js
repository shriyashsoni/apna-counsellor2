
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
  const { count: cCount } = await supabase.from('colleges').select('*', { count: 'exact', head: true });
  const { count: rCount } = await supabase.from('ranks').select('*', { count: 'exact', head: true });
  const { count: csCount } = await supabase.from('counselings').select('*', { count: 'exact', head: true });

  console.log('Total Counselings:', csCount);
  console.log('Total Colleges:', cCount);
  console.log('Total Rank Records:', rCount);
}

checkCounts();
