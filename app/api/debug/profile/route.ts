import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Debug endpoint - ONLY works in development
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Provide ?email=xxx' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, role, interests, firebase_uid, updated_at')
    .ilike('email', email.trim());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const parsed = (data || []).map((p: any) => ({
    ...p,
    interests_parsed: (() => {
      try {
        return typeof p.interests === 'string' ? JSON.parse(p.interests) : p.interests;
      } catch { return p.interests; }
    })(),
  }));

  return NextResponse.json({ count: parsed.length, profiles: parsed });
}
