const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSlugs() {
  try {
    console.log('Fetching colleges from database...');
    // We select all colleges so we can build a registry of existing slugs to guarantee uniqueness
    const { data: colleges, error } = await supabase.from('colleges').select('id, name, college_id');
    if (error) throw error;

    console.log(`Found ${colleges.length} colleges in total.`);

    const usedSlugs = new Set();
    // First, register all non-null slugs
    for (const c of colleges) {
      if (c.college_id) {
        usedSlugs.add(c.college_id);
      }
    }

    let updatedCount = 0;

    for (const college of colleges) {
      if (!college.college_id) {
        // Generate a clean slug matching the frontend's logic
        let baseSlug = (college.name || '')
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
        
        // Ensure uniqueness
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        usedSlugs.add(slug);

        console.log(`Updating "${college.name}" -> slug: "${slug}"`);
        const { error: updateError } = await supabase
          .from('colleges')
          .update({ college_id: slug })
          .eq('id', college.id);

        if (updateError) {
          console.error(`Failed to update college ${college.id} (${college.name}):`, updateError.message);
        } else {
          updatedCount++;
        }
      }
    }

    console.log(`\nSuccessfully updated ${updatedCount} colleges with generated college_id slugs.`);

  } catch (err) {
    console.error('Failed to fix slugs:', err.message);
  }
}

fixSlugs();
