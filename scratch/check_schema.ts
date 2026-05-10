import { createClient } from '@supabase/supabase-js'

async function checkSchema() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching payments:', error)
  } else {
    console.log('Payment schema sample:', data[0] ? Object.keys(data[0]) : 'No data')
  }

  const { data: sessionData, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .limit(1)

  if (sessionError) {
    console.error('Error fetching sessions:', sessionError)
  } else {
    console.log('Session schema sample:', sessionData[0] ? Object.keys(sessionData[0]) : 'No data')
  }
}

checkSchema()
