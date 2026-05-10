
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findRanks() {
  const { data: ranks } = await supabase.from('ranks').select('*, colleges(name)').limit(25);
  console.log('Rank Records with College Names:');
  ranks?.forEach(r => console.log(`- ${r.colleges.name}: ${r.course_name} (${r.closing_rank})`));
}

findRanks();
