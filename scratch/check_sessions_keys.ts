import { supabaseAdmin } from '../lib/supabase/admin'

async function checkForeignKeys() {
  const { data, error } = await supabaseAdmin.rpc('get_table_info', { table_name: 'sessions' })
  // If RPC is not available, we can try to just fetch one session and see the keys
  const { data: session } = await supabaseAdmin.from('sessions').select('*').limit(1).single()
  
  console.log('Session Keys:', session ? Object.keys(session) : 'No data')
}

checkForeignKeys()
