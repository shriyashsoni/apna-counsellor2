import { supabaseAdmin } from '../lib/supabase/admin'

async function checkSchema() {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching payments:', error)
  } else {
    console.log('Payment schema columns:', data[0] ? Object.keys(data[0]) : 'No data')
  }
}

checkSchema()
