import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Force WWW redirect in production for canonical consistency
  if (request.nextUrl.hostname === 'apnacounsellor.in') {
    const url = request.nextUrl.clone()
    url.hostname = 'www.apnacounsellor.in'
    
    const redirectResponse = NextResponse.redirect(url, 301)
    
    // Copy existing cookies
    request.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        domain: process.env.NODE_ENV === 'production' ? '.apnacounsellor.in' : undefined,
      })
    })
    
    return redirectResponse
  }

  // 2. Auth checks
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

  // Skip middleware logic for API routes and auth callbacks
  if (isAuthCallback || request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if session cookie exists
  const session = request.cookies.get('apna_counsellor_session')?.value
  let user = null
  
  if (session) {
    try {
      user = JSON.parse(session)
    } catch {
      // Invalid session cookie
    }
  }

  if (!user && !isAuthPage && !isPublicPage) {
    // No active session, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // Session exists, redirect away from login page to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)',
  ],
}
