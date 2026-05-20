const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log("Fetching a sample college with null college_id...");
  const { data: colleges } = await supabase
    .from('colleges')
    .select('id, name, college_id')
    .is('college_id', null)
    .limit(1);

  if (!colleges || colleges.length === 0) {
    console.log("No null-slug colleges found.");
    return;
  }

  const college = colleges[0];
  console.log("Found college:", college);

  console.log("Running a dummy update to see if Postgres trigger fires and generates a slug...");
  const { error } = await supabase
    .from('colleges')
    .update({ name: college.name })
    .eq('id', college.id);

  if (error) {
    console.error("Update error:", error);
    return;
  }

  console.log("Dummy update done. Refetching...");
  const { data: refetched } = await supabase
    .from('colleges')
    .select('id, name, college_id')
    .eq('id', college.id)
    .single();

  console.log("Refetched college:", refetched);

  if (refetched.college_id) {
    console.log("AMAZING! The Postgres trigger is ACTIVE and fired perfectly! It generated slug:", refetched.college_id);
    // Restore it to null
    await supabase.from('colleges').update({ college_id: null }).eq('id', college.id);
  } else {
    console.log("Postgres trigger did NOT fire or generate a slug.");
  }
}

test();
