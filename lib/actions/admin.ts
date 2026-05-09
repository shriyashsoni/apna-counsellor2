"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { sendMentorApprovalEmail } from "./emails"

export async function approveMentorAction(appId: string, userId: string, email: string, name: string) {
  try {
    // 1. Update Profile Role (Service Role bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'mentor',
        verified: true,
        onboarding_complete: true
      })
      .eq('id', userId)

    if (profileError) throw profileError

    // 2. Update Application Status
    const { error: appError } = await supabaseAdmin
      .from('mentor_applications')
      .update({ status: 'approved' })
      .eq('id', appId)

    if (appError) throw appError

    // 3. Send Email
    if (email) {
      await sendMentorApprovalEmail(email, name)
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Server Action Error (approveMentor):", error)
    return { success: false, error: error.message }
  }
}
