import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  const client = createServerClient(
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
                domain: process.env.NODE_ENV === 'production' ? '.apnacounsellor.in' : undefined,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              })
            )
          } catch {
            // Ignored
          }
        },
      },
    }
  )

  const originalAuth = client.auth

  // Shim auth methods on the server to use our session cookie
  client.auth = {
    ...originalAuth,
    getUser: async (token?: string) => {
      const sessionVal = cookieStore.get('apna_counsellor_session')?.value
      if (!sessionVal) {
        return { data: { user: null }, error: null } as any
      }

      try {
        const sessionUser = JSON.parse(sessionVal)
        return {
          data: {
            user: {
              id: sessionUser.id, // Mapped UUID
              email: sessionUser.email,
              user_metadata: {
                full_name: sessionUser.name,
                name: sessionUser.name,
                avatar_url: sessionUser.image || undefined,
                picture: sessionUser.image || undefined,
              },
              role: 'authenticated',
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            }
          },
          error: null
        } as any
      } catch {
        return { data: { user: null }, error: null } as any
      }
    },

    getSession: async () => {
      const sessionVal = cookieStore.get('apna_counsellor_session')?.value
      if (!sessionVal) {
        return { data: { session: null }, error: null } as any
      }

      try {
        const sessionUser = JSON.parse(sessionVal)
        const mappedUser = {
          id: sessionUser.id,
          email: sessionUser.email,
          user_metadata: {
            full_name: sessionUser.name,
            name: sessionUser.name,
            avatar_url: sessionUser.image || undefined,
            picture: sessionUser.image || undefined,
          },
        }

        return {
          data: {
            session: {
              access_token: 'firebase-mock-token',
              token_type: 'bearer',
              expires_in: 3600,
              refresh_token: 'firebase-mock-refresh',
              user: mappedUser,
            }
          },
          error: null
        } as any
      } catch {
        return { data: { session: null }, error: null } as any
      }
    },

    signOut: async () => {
      return { error: null } as any
    }
  } as any

  return client
}
