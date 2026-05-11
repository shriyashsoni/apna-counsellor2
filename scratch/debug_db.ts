import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function test() {
  const { data: counselings } = await supabase.from('counselings').select('*').limit(10)
  console.log('Counselings:', counselings)
  
  const { data: colleges } = await supabase.from('colleges').select('id, name, counseling_id').limit(5)
  console.log('Colleges:', colleges)

  const { data: ranks } = await supabase.from('ranks').select('*').limit(5)
  console.log('Ranks:', ranks)
}

test()
