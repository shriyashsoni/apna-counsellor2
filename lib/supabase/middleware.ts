import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Force WWW redirect for canonical consistency
  if (request.nextUrl.hostname === 'apnacounsellor.in') {
    const url = request.nextUrl.clone()
    url.hostname = 'www.apnacounsellor.in'
    
    // Create redirect response
    const redirectResponse = NextResponse.redirect(url, 301)
    
    // IMPORTANT: Copy existing cookies to the redirect response
    // This ensures the PKCE verifier and other auth cookies are not lost
    request.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        domain: process.env.NODE_ENV === 'production' ? '.apnacounsellor.in' : undefined,
      })
    })
    
    return redirectResponse
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Apply a broader domain to cookies in production to prevent cross-subdomain issues
            const cookieOptions = {
              ...options,
              domain: process.env.NODE_ENV === 'production' ? '.apnacounsellor.in' : undefined,
              path: '/',
              sameSite: 'lax' as const,
              secure: process.env.NODE_ENV === 'production',
            }
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
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
    error: userError
  } = await supabase.auth.getUser()

  if (userError && !isPublicPage && !isAuthPage) {
    console.error("Supabase middleware error:", userError.message)
  }

  if (!user && !isAuthPage && !isPublicPage) {
    // No user, redirect to login for protected pages
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    
    // Create a new redirect response but copy the cookies from supabaseResponse
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  if (user && isAuthPage) {
    // User is logged in, redirect away from login page
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  return supabaseResponse
}

