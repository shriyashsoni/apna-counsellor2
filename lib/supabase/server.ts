import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  
  let isApnaDomain = false;
  try {
    const headersList = headers();
    const host = headersList.get('host') || '';
    isApnaDomain = host.includes('apnacounsellor.in');
  } catch (e) {
    // Ignore error if headers() is called outside request context
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                domain: isApnaDomain ? '.apnacounsellor.in' : undefined,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              })
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
