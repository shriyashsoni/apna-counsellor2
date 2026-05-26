import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper: parse interests JSONB safely
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
    const { uid, email, displayName, photoURL, uuid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    const sessionData = {
      uid,
      email,
      name: displayName || email?.split('@')[0] || 'User',
      image: photoURL || null,
      id: uuid,
    };

    if (uuid && uid && email) {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Check if profile already exists with this exact Firebase-derived UUID
      const { data: existingByUUIDList } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .eq('id', uuid)
        .limit(1);
        
      const existingByUUID = existingByUUIDList?.[0];

      if (existingByUUID) {
        // Profile found by UUID → only update non-permission auth fields
        await supabaseAdmin
          .from('profiles')
          .update({
            email: normalizedEmail,
            name: sessionData.name,
            avatar_url: photoURL || null,
            firebase_uid: uid,
            updated_at: new Date().toISOString(),
          })
          .eq('id', uuid);

        console.log(`✅ Login sync done. Role preserved: ${existingByUUID.role} for ${email}`);
      } else {
        // 2. Not found by UUID → search by email (covers pre-assigned or duplicate-UUID users)
        const { data: existingByEmailList } = await supabaseAdmin
          .from('profiles')
          .select('id, role, interests')
          .ilike('email', normalizedEmail)
          .limit(1);
          
        const existingByEmail = existingByEmailList?.[0];

        if (existingByEmail) {
          // Found by email → self-heal: delete old row, re-insert with correct Firebase UUID
          // (can't UPDATE primary key in PostgreSQL, so we DELETE + INSERT)
          console.log(`[Self-heal] Found profile by email for ${email}. Old ID: ${existingByEmail.id} → New: ${uuid}`);

          const { error: deleteError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', existingByEmail.id);

          if (deleteError) {
            console.error('Self-heal DELETE failed:', deleteError.message);
          } else {
            const { error: reInsertError } = await supabaseAdmin
              .from('profiles')
              .insert({
                id: uuid,
                firebase_uid: uid,
                email: normalizedEmail,
                name: sessionData.name,
                avatar_url: photoURL || null,
                role: existingByEmail.role || 'student',        // PRESERVE ROLE
                interests: existingByEmail.interests || {},      // PRESERVE PERMISSIONS
                updated_at: new Date().toISOString(),
              });

            if (reInsertError) {
              console.error('Self-heal re-INSERT failed:', reInsertError.message);
            } else {
              console.log(`✅ Self-heal complete. Role "${existingByEmail.role}" and permissions preserved for ${email}`);
            }
          }
        } else {
          // 3. Truly new user → create with default student role
          const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: uuid,
              firebase_uid: uid,
              email: normalizedEmail,
              name: sessionData.name,
              avatar_url: photoURL || null,
              role: 'student',
              interests: {},
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error('New profile insert failed:', insertError.message);
          } else {
            console.log(`✅ New student profile created for: ${email}`);
          }
        }
      }
    }

    const cookieStore = cookies();
    cookieStore.set('apna_counsellor_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, user: sessionData });
  } catch (error: any) {
    console.error('Session POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('apna_counsellor_session')?.value;

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const sessionData = JSON.parse(session);
    let profile: any = null;

    // 1. Try by UUID
    if (sessionData.id) {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .eq('id', sessionData.id)
        .limit(1);
      profile = data?.[0];
    }

    // 2. Fallback: try by email
    if (!profile && sessionData.email) {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .ilike('email', sessionData.email.trim())
        .limit(1);
      profile = data?.[0];
      if (profile) {
        console.log(`[Session GET] Email fallback matched for: ${sessionData.email} → role: ${profile.role}`);
      }
    }

    const role = profile?.role || 'student';
    const permissions = parsePermissions(profile?.interests);

    console.log(`[Session GET] ${sessionData.email} → role: "${role}", permissions: [${permissions.join(', ')}]`);

    return NextResponse.json({
      authenticated: true,
      user: { ...sessionData, role, permissions },
    });
  } catch (error: any) {
    console.error('Session GET error:', error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('apna_counsellor_session');
  return NextResponse.json({ success: true });
}
