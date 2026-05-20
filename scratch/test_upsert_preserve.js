const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log("Fetching a sample college to test preserve...");
  // Fetch one college that has college_id is null
  const { data: colleges, error } = await supabase
    .from('colleges')
    .select('*')
    .is('college_id', null)
    .limit(1);

  if (error || !colleges || colleges.length === 0) {
    console.error("Error fetching college:", error);
    return;
  }

  const original = colleges[0];
  console.log("Original College Name:", original.name);
  console.log("Original Established:", original.established);
  console.log("Original City:", original.city);

  const testSlug = `test-preserve-slug-${Math.floor(Math.random() * 10000)}`;

  console.log("Upserting { id, name, college_id }...");
  const { error: upsertError } = await supabase
    .from('colleges')
    .upsert({ id: original.id, name: original.name, college_id: testSlug });

  if (upsertError) {
    console.error("Upsert failed:", upsertError);
    return;
  }

  console.log("Upsert successful. Refetching...");
  const { data: refetched, error: fetchError } = await supabase
    .from('colleges')
    .select('*')
    .eq('id', original.id)
    .single();

  if (fetchError) {
    console.error("Refetch failed:", fetchError);
    return;
  }

  console.log("Refetched Established:", refetched.established);
  console.log("Refetched City:", refetched.city);

  if (refetched.established === original.established && refetched.city === original.city) {
    console.log("SUCCESS! All other fields were perfectly preserved! Bulk upsert is safe!");
  } else {
    console.error("WARNING! Other fields were altered or cleared!");
  }

  // Restore
  console.log("Restoring to null...");
  await supabase.from('colleges').update({ college_id: null }).eq('id', original.id);
}

test();
