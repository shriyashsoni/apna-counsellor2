const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  try {
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public')
    console.log('Tables:', data)
    
    // Alternative if information_schema is restricted
    const { data: tables2, error: err2 } = await supabase.rpc('get_tables')
    console.log('Tables RPC:', tables2)
  } catch (e) {
    console.error(e)
  }
}

test()
