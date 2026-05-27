import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using URL:', supabaseUrl);
console.log('Using Key:', supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log('Testing connection to courses with Anon Key...');
  const { data, error } = await supabase.from('courses').select('id, title').limit(1);
  if (error) {
    console.error('ERROR OCCURRED:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}

testQuery();
