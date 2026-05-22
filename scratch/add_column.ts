import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function run() {
  const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL)
  try {
    await sql`ALTER TABLE profiles ADD COLUMN razorpay_account_id text;`
    console.log('Column added')
  } catch (e) {
    console.error('Error:', e)
  }
  process.exit()
}

run()
