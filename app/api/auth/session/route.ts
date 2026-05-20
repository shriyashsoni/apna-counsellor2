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
    
    // Sync/Replicate user details directly inside public.profiles in Supabase
    if (uuid) {
      const { error: syncError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: uuid,
          email: email,
          name: sessionData.name,
          image: sessionData.image,
        }, { onConflict: 'id' });
        
      if (syncError) {
        console.error('Failed to sync profile to database:', syncError);
        // Note: We log the error but still proceed to set the session cookie 
        // to avoid completely locking the user out if DB is temporarily slow.
      } else {
        console.log('Successfully synced/replicated user profile to database:', uuid);
      }
    }
    
    const cookieStore = cookies();
    
    // Set session cookie
    cookieStore.set('apna_counsellor_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    return NextResponse.json({ success: true, user: sessionData });
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  
  // Clear session cookie
  cookieStore.delete('apna_counsellor_session');
  
  return NextResponse.json({ success: true });
}
