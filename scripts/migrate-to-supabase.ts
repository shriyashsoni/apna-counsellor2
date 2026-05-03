import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// We'll use the key provided by the user. If it's a restricted key, we might need to disable RLS temporarily.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! 

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
  const basePath = 'e:/projects/apna-counsellor2/apna_counsellor/counselings_data'
  const folders = fs.readdirSync(basePath)

  console.log(`Found ${folders.length} counseling folders. Starting migration...`)

  for (const folder of folders) {
    const folderPath = path.join(basePath, folder)
    if (!fs.statSync(folderPath).isDirectory()) continue

    console.log(`\n📦 Processing: ${folder}`)

    // 1. Upsert Counseling
    const { data: counseling, error: cError } = await supabase
      .from('counselings')
      .upsert({ name: folder, category: 'General' }, { onConflict: 'name' })
      .select()
      .single()

    if (cError) {
      console.error(`❌ Error creating counseling ${folder}:`, cError.message)
      continue
    }

    const jsonPath = path.join(folderPath, 'colleges.json')
    if (fs.existsSync(jsonPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
        if (!Array.isArray(data)) continue

        console.log(`   Found ${data.length} colleges.`)

        const colleges = data.map((c: any) => ({
          name: c.name || 'Unknown College',
          type: c.type || c.category || 'Other',
          location: c.location || c.state || '',
          city: c.city || '',
          counseling_id: counseling.id,
          // Add other fields if they exist in the schema
          nirf_rank: parseInt(c.nirf_rank) || null,
          description: c.description || '',
          website: c.website || ''
        }))

        // Batch insert colleges
        const chunkSize = 50 // Smaller chunks for reliability
        for (let i = 0; i < colleges.length; i += chunkSize) {
          const chunk = colleges.slice(i, i + chunkSize)
          const { error: colError } = await supabase.from('colleges').insert(chunk)
          if (colError) {
            console.error(`   ⚠️ Error inserting chunk for ${folder}:`, colError.message)
          } else {
             process.stdout.write('.')
          }
        }
        console.log(`\n   ✅ Done with ${folder}`)
      } catch (e: any) {
        console.error(`   ❌ Failed to parse JSON for ${folder}:`, e.message)
      }
    }
  }
  console.log('\n✨ Migration Complete!')
}

migrate().catch(err => {
  console.error('Fatal Migration Error:', err)
})
