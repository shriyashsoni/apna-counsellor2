import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client using Service Role Key to safely write user data
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
      id: uuid, // Mapped Supabase UUID
    };
    
    // Sync Firebase user into public.profiles in Supabase
    // Uses firebase_uid as the conflict key so the same Firebase user
    // always maps to the same profile row, even across devices.
    if (uuid && uid) {
      const { error: syncError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: uuid,
          firebase_uid: uid,          // store the raw Firebase UID
          email: email,
          name: sessionData.name,
          avatar_url: photoURL || null, // correct column name
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        
      if (syncError) {
        console.error('Failed to sync profile to database:', syncError.message);
        // Log but don't block login
      } else {
        console.log('✅ Profile synced to Supabase:', uuid);
      }
    }
    
    const cookieStore = cookies();
    
    // Set secure session cookie (1 week)
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

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('apna_counsellor_session');
  return NextResponse.json({ success: true });
}
