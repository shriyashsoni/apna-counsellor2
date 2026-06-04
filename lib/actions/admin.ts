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

export async function createBroadcastNotificationAction(title: string, message: string, type: string, link?: string, courseId?: string) {
  try {
    const insertData: any = {
      title,
      message,
      type,
      link,
      is_read: false
    }

    if (courseId && courseId !== 'all') {
      insertData.course_id = courseId
      insertData.target_group = 'course_subscribers'
    } else {
      insertData.target_group = 'all'
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .insert(insertData)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error("Broadcast Notification Error:", error)
    return { success: false, error: error.message }
  }
}

export async function createCourseAction(courseData: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert(courseData)
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('course_audit_logs').insert({
      action: 'course_launched',
      details: `Admin successfully deployed evergreen course: "${courseData.title}" priced at ₹${courseData.discounted_price || courseData.original_price}`
    })

    revalidatePath('/courses')
    revalidatePath('/admin/courses')
    
    return { success: true, course: data }
  } catch (error: any) {
    console.error("Course Creation Error:", error)
    return { success: false, error: error.message }
  }
}

export async function updateCourseAction(courseId: string, courseData: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .update(courseData)
      .eq('id', courseId)
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('course_audit_logs').insert({
      action: 'course_updated',
      details: `Admin successfully updated evergreen course: "${courseData.title}" priced at ₹${courseData.discounted_price || courseData.original_price}`
    })

    revalidatePath('/courses')
    revalidatePath('/admin/courses')
    revalidatePath(`/courses/${courseData.slug}`)
    
    return { success: true, course: data }
  } catch (error: any) {
    console.error("Course Update Error:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteBroadcastNotificationAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error("Delete Notification Error:", error)
    return { success: false, error: error.message }
  }
}

export async function getCourseEnrollmentsAction(courseId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('course_enrollments')
      .select(`
        id, created_at, status, payment_id, amount,
        student:student_id ( id, name, email, phone )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, enrollments: data || [] }
  } catch (error: any) {
    console.error("Fetch Enrollments Error:", error)
    return { success: false, error: error.message, enrollments: [] }
  }
}

