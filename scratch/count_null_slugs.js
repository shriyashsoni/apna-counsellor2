const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  // Count total colleges
  const { count: total, error: err1 } = await supabase
    .from('colleges')
    .select('*', { count: 'exact', head: true });
    
  if (err1) {
    console.error('Error counting total colleges:', err1);
    return;
  }

  // Count colleges with non-null college_id
  const { count: hasSlug, error: err2 } = await supabase
    .from('colleges')
    .select('*', { count: 'exact', head: true })
    .not('college_id', 'is', null);

  if (err2) {
    console.error('Error counting colleges with slug:', err2);
    return;
  }

  console.log(`Total colleges: ${total}`);
  console.log(`Colleges with college_id: ${hasSlug}`);
  console.log(`Colleges without college_id (NULL): ${total - hasSlug}`);
}

check();
