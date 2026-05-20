const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAllSlugs() {
  console.log("🚀 Starting High-Speed Slug Fixer Agent...");
  
  try {
    // 1. Fetch all existing slugs to avoid collisions
    console.log("Fetching existing slugs to prevent duplicates...");
    const { data: existingColleges, error: fetchErr } = await supabase
      .from('colleges')
      .select('college_id')
      .not('college_id', 'is', null);

    if (fetchErr) throw fetchErr;

    const usedSlugs = new Set();
    if (existingColleges) {
      for (const c of existingColleges) {
        if (c.college_id) usedSlugs.add(c.college_id);
      }
    }
    console.log(`Loaded ${usedSlugs.size} existing slugs.`);

    const CHUNK_SIZE = 2500;
    let totalUpdated = 0;
    let hasMore = true;

    while (hasMore) {
      console.log(`\nFetching next batch of ${CHUNK_SIZE} colleges without slugs...`);
      const { data: batch, error: batchErr } = await supabase
        .from('colleges')
        .select('id, name')
        .is('college_id', null)
        .limit(CHUNK_SIZE);

      if (batchErr) {
        console.error("Error fetching batch:", batchErr.message);
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      if (!batch || batch.length === 0) {
        console.log("🎉 All colleges have been successfully updated with unique slugs!");
        hasMore = false;
        break;
      }

      console.log(`Processing ${batch.length} colleges...`);
      const updates = [];

      for (const col of batch) {
        let baseSlug = (col.name || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-');
        
        // Trim leading and trailing hyphens
        baseSlug = baseSlug.replace(/^-+|-+$/g, '');
        
        if (!baseSlug) {
          baseSlug = 'college';
        }

        let slug = baseSlug;
        let counter = 1;

        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        usedSlugs.add(slug);
        updates.push({
          id: col.id,
          name: col.name,
          college_id: slug
        });
      }

      console.log(`Upserting ${updates.length} slugs to Supabase...`);
      const { error: upsertErr } = await supabase
        .from('colleges')
        .upsert(updates);

      if (upsertErr) {
        console.error("❌ Bulk upsert failed:", upsertErr.message);
        // Fall back to smaller batch of 500
        console.log("Attempting retry with smaller chunks of 500...");
        const subChunkSize = 500;
        for (let i = 0; i < updates.length; i += subChunkSize) {
          const subChunk = updates.slice(i, i + subChunkSize);
          const { error: subErr } = await supabase.from('colleges').upsert(subChunk);
          if (subErr) {
            console.error(`❌ Failed sub-chunk upsert:`, subErr.message);
          } else {
            totalUpdated += subChunk.length;
            console.log(`Updated ${totalUpdated} colleges...`);
          }
        }
      } else {
        totalUpdated += updates.length;
        console.log(`✅ Success! Updated total: ${totalUpdated} colleges.`);
      }

      // Small break to be gentle on DB connection limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n✨ High-Speed Slug Fixer Agent Complete! Total colleges updated: ${totalUpdated}`);

  } catch (err) {
    console.error("Fatal error in slug fixer:", err);
  }
}

fixAllSlugs();
