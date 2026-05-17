import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}&error_description=${error_description}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if this is a new user (created in the last 60 seconds)
        const isNewUser = new Date(user.created_at).getTime() > Date.now() - 60000
        
        if (isNewUser) {
          try {
            const { sendWelcomeEmail } = await import('@/lib/actions/emails')
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]
            await sendWelcomeEmail(user.email!, name)
          } catch (e) {
            console.error("Welcome email failed:", e)
          }
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let baseUrl = origin
      if (!isLocalEnv && forwardedHost) {
        baseUrl = `https://${forwardedHost}`
      }

      // Force WWW redirect if on the main domain
      if (baseUrl.includes('apnacounsellor.in') && !baseUrl.includes('www.')) {
        baseUrl = baseUrl.replace('apnacounsellor.in', 'www.apnacounsellor.in')
      }

      return NextResponse.redirect(`${baseUrl}${next}`)
    } else {
      console.error('Auth exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_error&error_description=${encodeURIComponent(exchangeError.message)}`)
    }
  }


  // fallback for cases with no code and no error params
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&error_description=No+authentication+code+was+provided+by+the+identity+provider.`)
}
