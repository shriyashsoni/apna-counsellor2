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
        onboarding_complete: true,
        is_visible: true
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
      try {
        await sendMentorApprovalEmail(email, name)
      } catch (emailErr) {
        console.error("Failed to send approval email, but proceeding:", emailErr)
      }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Server Action Error (approveMentor):", error)
    return { success: false, error: error.message }
  }
}

export async function suspendMentorAction(userId: string, suspend: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: suspend ? 'suspended_mentor' : 'mentor'
      })
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMentorAction(userId: string) {
  try {
    // Downgrade to student instead of deleting profile entirely to preserve auth
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'student'
      })
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function toggleMentorVisibilityAction(userId: string, isVisible: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_visible: isVisible
      })
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createBroadcastNotificationAction(title: string, message: string, type: string, link?: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .insert({
        title,
        message,
        type,
        link,
        target_group: 'all',
        is_read: false
      })

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error("Broadcast Notification Error:", error)
    return { success: false, error: error.message }
  }
}

