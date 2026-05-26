import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client using Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // CRITICAL FIX: Only sync auth-level fields (email, name, avatar).
    // NEVER overwrite 'role' or 'interests' on login — these are controlled
    // exclusively by the Admin Team Console and must survive every login event.
    if (uuid && uid) {
      // Check if profile already exists by UUID
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .eq('id', uuid)
        .maybeSingle();

      if (existingProfile) {
        // Exists → patch ONLY auth fields, leave role/interests completely untouched
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            email: email,
            name: sessionData.name,
            avatar_url: photoURL || null,
            firebase_uid: uid,
            updated_at: new Date().toISOString(),
          })
          .eq('id', uuid);

        if (updateError) {
          console.error('Failed to update profile auth fields:', updateError.message);
        } else {
          console.log('✅ Profile auth fields updated. Role/permissions preserved:', uuid);
        }
      } else {
        // Not found by UUID → try email (self-healing for pre-assigned staff)
        const { data: emailProfile } = await supabaseAdmin
          .from('profiles')
          .select('id, role, interests')
          .ilike('email', email?.trim() || '')
          .maybeSingle();

        if (emailProfile) {
          // Found by email → align the ID with Firebase UUID, preserve role/interests
          const { error: healError } = await supabaseAdmin
            .from('profiles')
            .update({
              id: uuid,
              firebase_uid: uid,
              email: email,
              name: sessionData.name,
              avatar_url: photoURL || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', emailProfile.id);

          if (healError) {
            console.error('Self-healing ID alignment failed:', healError.message);
          } else {
            console.log('✅ Profile self-healed. ID aligned from', emailProfile.id, '→', uuid, '| Role preserved:', emailProfile.role);
          }
        } else {
          // Brand new user → insert with default student role
          const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: uuid,
              firebase_uid: uid,
              email: email,
              name: sessionData.name,
              avatar_url: photoURL || null,
              role: 'student',
              interests: {},
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error('Failed to create new profile:', insertError.message);
          } else {
            console.log('✅ New student profile created for:', email);
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
    console.error('Session creation error:', error);
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

    // 1. Look up profile by UUID
    if (sessionData.id) {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .eq('id', sessionData.id)
        .maybeSingle();
      profile = data;
    }

    // 2. Fallback: look up by email if UUID fails (covers self-healed and pre-registered staff)
    if (!profile && sessionData.email) {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .ilike('email', sessionData.email.trim())
        .maybeSingle();
      profile = data;
      if (profile) {
        console.log('[Session GET] Email fallback found profile. Email:', sessionData.email);
      }
    }

    let role = 'student';
    let permissions: string[] = [];

    if (profile) {
      role = profile.role || 'student';
      const interestsData =
        typeof profile.interests === 'string'
          ? JSON.parse(profile.interests)
          : profile.interests || {};
      permissions = interestsData?.permissions || [];
    }

    console.log(
      `[Session GET] ${sessionData.email} → role: ${role}, permissions: [${permissions.join(', ')}]`
    );

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
