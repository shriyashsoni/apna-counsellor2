import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        domain: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? undefined : '.apnacounsellor.in',
        path: '/',
      },
    }
  )
}
