import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
