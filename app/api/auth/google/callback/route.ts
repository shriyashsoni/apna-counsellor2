import { getGoogleTokens } from "@/lib/google-calendar";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!code) {
    return NextResponse.redirect(`${siteUrl}/mentor/dashboard?error=no_code`);
  }

  try {
    const tokens = await getGoogleTokens(code);
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;

    if (authError || !user) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      return NextResponse.redirect(`${siteUrl}/login`);
    }

    // Store the refresh token in the profiles table
    if (tokens.refresh_token) {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          google_refresh_token: tokens.refresh_token,
          // Optionally store other info if needed
        })
        .eq("id", user.id);

      if (error) throw error;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    return NextResponse.redirect(`${siteUrl}/mentor/dashboard?success=google_linked`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    return NextResponse.redirect(`${siteUrl}/mentor/dashboard?error=callback_failed`);
  }
}
