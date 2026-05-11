import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Force WWW redirect for canonical consistency and to prevent "Sitemap is HTML" errors
  if (request.nextUrl.hostname === 'apnacounsellor.in') {
    const url = request.nextUrl.clone()
    url.hostname = 'www.apnacounsellor.in'
    return NextResponse.redirect(url, 301)
  }

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
  const isPublicPage = [
    '/', '/about', '/contact', '/privacy-policy', '/terms', '/founder', '/pricing', '/predictor', '/colleges',
    '/counselling', '/college', '/resources', '/mentors', '/mentorship',
    '/sitemap.xml', '/sitemap-index.xml', '/robots.txt', '/ads.txt'
  ].some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/college/') || 
    request.nextUrl.pathname.startsWith('/counselling/') ||
    request.nextUrl.pathname.startsWith('/sitemap-')
  )


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
