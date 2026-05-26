import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parsePermissions(interests: any): string[] {
  try {
    const data = typeof interests === 'string' ? JSON.parse(interests) : interests || {};
    return Array.isArray(data?.permissions) ? data.permissions : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId && !email) {
      return NextResponse.json({ role: 'student', permissions: [] });
    }

    let profile: any = null;

    // 1. Try by UUID first
    if (userId) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .eq('id', userId)
        .limit(1);

      if (!error && data && data.length > 0) {
        profile = data[0];
      }
    }

    // 2. Fallback: try by email (case-insensitive) — handles pre-created profiles with different UUIDs
    if (!profile && email) {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .ilike('email', normalizedEmail)
        .limit(1);

      if (!error && data && data.length > 0) {
        profile = data[0];
        console.log(`[check-access] Email fallback matched for: ${email} → role: ${profile.role}, profileId: ${profile.id}`);
        
        // Self-heal: if UUID doesn't match, update the profile ID to the Firebase UUID
        if (userId && profile.id !== userId) {
          console.log(`[check-access] UUID mismatch. DB has ${profile.id}, Firebase says ${userId}. Self-healing...`);
          
          // Delete old row and re-insert with correct UUID (can't update PK in Postgres)
          const preservedRole = profile.role;
          const preservedInterests = profile.interests;
          
          const { error: delErr } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', profile.id);

          if (!delErr) {
            const { error: insErr } = await supabaseAdmin
              .from('profiles')
              .insert({
                id: userId,
                email: normalizedEmail,
                role: preservedRole || 'student',
                interests: preservedInterests || {},
                updated_at: new Date().toISOString(),
              });

            if (!insErr) {
              console.log(`[check-access] ✅ Self-heal complete. UUID aligned to ${userId}, role "${preservedRole}" preserved.`);
            } else {
              console.error(`[check-access] Self-heal INSERT failed:`, insErr.message);
            }
          } else {
            console.error(`[check-access] Self-heal DELETE failed:`, delErr.message);
          }
        }
      }
    }

    if (!profile) {
      console.log(`[check-access] No profile found for userId=${userId}, email=${email}`);
      return NextResponse.json({ role: 'student', permissions: [] });
    }

    const role = profile.role || 'student';
    const permissions = parsePermissions(profile.interests);

    console.log(`[check-access] ✅ ${email} → role: "${role}", permissions: [${permissions.join(', ')}]`);

    return NextResponse.json({ role, permissions });
  } catch (error: any) {
    console.error('[check-access] Error:', error.message);
    return NextResponse.json({ role: 'student', permissions: [] }, { status: 500 });
  }
}
