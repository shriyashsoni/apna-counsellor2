const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  try {
    const { data: colleges } = await supabase.from('colleges').select('id, name, cutoffs').not('cutoffs', 'is', null).limit(5)
    console.log('Colleges with cutoffs:', colleges)
    
    const { count } = await supabase.from('colleges').select('*', { count: 'exact', head: true }).not('cutoffs', 'is', null)
    console.log('Total colleges with cutoffs:', count)
  } catch (e) {
    console.error(e)
  }
}

test()
