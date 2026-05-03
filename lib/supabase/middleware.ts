import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being logged out.

  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isAuthCallback = request.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = ['/', '/about', '/contact', '/privacy-policy', '/terms', '/founder'].includes(request.nextUrl.pathname)

  // Skip getUser check for auth callback to prevent double code exchange
  if (isAuthCallback) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isAuthPage && !isPublicPage) {
    // No user, redirect to login for protected pages
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // User is logged in, redirect away from login page
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
