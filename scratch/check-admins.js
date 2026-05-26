const { createClient } = require('@supabase/supabase-js');
require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  console.log("Supabase URL:", supabaseUrl);
  
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, name, role, interests')
      .neq('role', 'student')
      .limit(10);
      
    if (error) throw error;
    
    console.log("Staff / Mentors / Admins in Database:");
    console.log(JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error("Failed to query profiles:", err.message);
  }
}

checkAdmins();
