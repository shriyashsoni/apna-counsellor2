
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log('Testing Counselings...');
  const { data: counselings, error: cError } = await supabase.from('counselings').select('id, name').limit(5);
  console.log('Counselings:', counselings || cError);

  console.log('\nTesting Colleges...');
  const { data: colleges, error: colError } = await supabase.from('colleges').select('id, name, counseling_id').limit(5);
  console.log('Colleges:', colleges || colError);

  if (colleges && colleges.length > 0) {
    console.log('\nTesting Ranks for first college...');
    const { data: ranks, error: rError } = await supabase.from('ranks').select('*').eq('college_id', colleges[0].id).limit(5);
    console.log('Ranks:', ranks || rError);
  }
}

testQuery();
