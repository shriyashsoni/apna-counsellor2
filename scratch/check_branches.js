const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  try {
    const { data: colleges } = await supabase.from('colleges').select('id, name, branches').not('branches', 'is', null).limit(5)
    console.log('Colleges with branches:', colleges)
    
    const { count } = await supabase.from('colleges').select('*', { count: 'exact', head: true }).not('branches', 'is', null)
    console.log('Total colleges with branches:', count)
  } catch (e) {
    console.error(e)
  }
}

test()
