const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  try {
    const { data: counts } = await supabase.rpc('get_counseling_college_counts')
    if (counts) {
        console.log('Counseling Counts:', counts)
    } else {
        // Fallback: manual count
        const { data: counselings } = await supabase.from('counselings').select('id, name')
        for (const c of counselings) {
            const { count } = await supabase.from('colleges').select('*', { count: 'exact', head: true }).eq('counseling_id', c.id)
            console.log(`${c.name}: ${count}`)
        }
    }

    const { count: totalRanks } = await supabase.from('ranks').select('*', { count: 'exact', head: true })
    console.log('Total Ranks in DB:', totalRanks)

    const { data: sampleRanks } = await supabase.from('ranks').select('closing_rank, category').limit(10)
    console.log('Sample Ranks:', sampleRanks)
  } catch (e) {
    console.error(e)
  }
}

test()
