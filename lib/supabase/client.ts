import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const isApnaDomain = typeof window !== 'undefined' && window.location.hostname.includes('apnacounsellor.in')

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        domain: isApnaDomain ? '.apnacounsellor.in' : undefined,
        path: '/',
      },
    }
  )
}
