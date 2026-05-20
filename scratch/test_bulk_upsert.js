const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log("Fetching a sample college to test...");
  // Fetch one college that has college_id is null
  const { data: colleges, error } = await supabase
    .from('colleges')
    .select('id, name, state, college_id')
    .is('college_id', null)
    .limit(1);

  if (error) {
    console.error("Error fetching college:", error);
    return;
  }

  if (!colleges || colleges.length === 0) {
    console.log("No colleges found with null college_id.");
    return;
  }

  const college = colleges[0];
  console.log("Found college:", college);

  const testSlug = `test-slug-xyz-${Math.floor(Math.random() * 10000)}`;
  console.log(`Attempting upsert with id: ${college.id}, name: ${college.name} and college_id: ${testSlug}`);

  const { data: upsertResult, error: upsertError } = await supabase
    .from('colleges')
    .upsert({ id: college.id, name: college.name, college_id: testSlug })
    .select();

  if (upsertError) {
    console.error("Upsert error:", upsertError);
    return;
  }

  console.log("Upsert succeeded. Verifying other fields are preserved...");
  const { data: verified, error: verifyError } = await supabase
    .from('colleges')
    .select('id, name, state, college_id')
    .eq('id', college.id)
    .single();

  if (verifyError) {
    console.error("Verification error:", verifyError);
    return;
  }

  console.log("Verified college data after upsert:", verified);

  if (verified.name === college.name && verified.state === college.state) {
    console.log("SUCCESS! Other fields are preserved perfectly!");
  } else {
    console.error("WARNING! Other fields were altered or lost!");
  }

  // Restore college_id to null
  console.log("Restoring college_id to null...");
  await supabase.from('colleges').update({ college_id: null }).eq('id', college.id);
  console.log("Restored.");
}

test();
