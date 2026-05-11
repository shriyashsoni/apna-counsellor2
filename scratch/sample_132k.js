const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const { data: colleges } = await supabase.from('colleges').select('*').range(100, 105)
  console.log('Sample Colleges:', JSON.stringify(colleges, null, 2))
}

test()
