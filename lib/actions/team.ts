"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export interface TeamMember {
  id: string
  name: string
  email: string
  image?: string
  role: 'student' | 'mentor' | 'admin'
  permissions: string[]
}

// Fetch all team members (anyone who is an admin or has custom permissions, or mentors)
export async function getTeamMembersAction() {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, image, role, interests')
      .or('role.eq.admin,role.eq.mentor,interests->>permissions.neq.null')
      .order('name', { ascending: true })

    if (error) throw error

    const team: TeamMember[] = (profiles || []).map((p: any) => {
      const interestsData = typeof p.interests === 'string' ? JSON.parse(p.interests) : p.interests || {}
      return {
        id: p.id,
        name: p.name || p.email?.split('@')[0] || "Unknown Member",
        email: p.email || "",
        image: p.image || "",
        role: p.role,
        permissions: interestsData?.permissions || []
      }
    })

    return { success: true, team }
  } catch (error: any) {
    console.error("Failed to get team members:", error)
    return { success: false, error: error.message }
  }
}

// Add a team member by email
export async function addTeamMemberAction(email: string, role: 'mentor' | 'admin', permissions: string[]) {
  try {
    // 1. Find user by email (case-insensitive)
    const { data: userProfile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('id, interests')
      .ilike('email', email.trim())
      .single()

    if (findError || !userProfile) {
      return { success: false, error: "User with this email was not found. Please ask them to register/onboard first." }
    }

    // 2. Update their role and permissions inside interests
    const currentInterests = typeof userProfile.interests === 'string' 
      ? JSON.parse(userProfile.interests) 
      : userProfile.interests || {}
    
    const updatedInterests = {
      ...currentInterests,
      permissions
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role,
        interests: updatedInterests
      })
      .eq('id', userProfile.id)

    if (updateError) throw updateError

    revalidatePath('/admin/teams')
    return { success: true }
  } catch (error: any) {
    console.error("Failed to add team member:", error)
    return { success: false, error: error.message }
  }
}

// Update a team member's role and permissions
export async function updateTeamMemberAction(userId: string, role: 'student' | 'mentor' | 'admin', permissions: string[]) {
  try {
    // 1. Get current user's interests
    const { data: profile, error: getError } = await supabaseAdmin
      .from('profiles')
      .select('interests')
      .eq('id', userId)
      .single()

    if (getError) throw getError

    const currentInterests = typeof profile.interests === 'string' 
      ? JSON.parse(profile.interests) 
      : profile.interests || {}
    
    const updatedInterests = {
      ...currentInterests,
      permissions
    }

    // 2. Update role and permissions
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role,
        interests: updatedInterests
      })
      .eq('id', userId)

    if (updateError) throw updateError

    revalidatePath('/admin/teams')
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update team member:", error)
    return { success: false, error: error.message }
  }
}

// Remove a team member (revert back to student role and clear permissions)
export async function removeTeamMemberAction(userId: string) {
  try {
    // 1. Get current interests and strip permissions
    const { data: profile, error: getError } = await supabaseAdmin
      .from('profiles')
      .select('interests')
      .eq('id', userId)
      .single()

    if (getError) throw getError

    const currentInterests = typeof profile.interests === 'string' 
      ? JSON.parse(profile.interests) 
      : profile.interests || {}
    
    if (currentInterests.permissions) {
      delete currentInterests.permissions
    }

    // 2. Revert role to student
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'student',
        interests: currentInterests
      })
      .eq('id', userId)

    if (updateError) throw updateError

    revalidatePath('/admin/teams')
    return { success: true }
  } catch (error: any) {
    console.error("Failed to remove team member:", error)
    return { success: false, error: error.message }
  }
}

// Bypasses all client-side RLS constraints to securely verify admin console permissions
export async function checkAdminAccessAction(userId: string, email?: string) {
  try {
    if (!userId) return { success: false, role: 'student', permissions: [] }

    // 1. Try to find by UUID first
    let { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, role, interests')
      .eq('id', userId)
      .maybeSingle()

    // 2. If not found by UUID, try to find by Email (case-insensitive)
    if (!profile && email) {
      console.log(`[Auth check] User not found by UUID ${userId}. Searching by email fallback: ${email}`);
      const { data: emailProfile, error: emailError } = await supabaseAdmin
        .from('profiles')
        .select('id, role, interests')
        .ilike('email', email.trim())
        .maybeSingle()

      if (emailProfile) {
        profile = emailProfile
        console.log(`[Auth check] Found profile by email! Auto-aligning database ID from ${emailProfile.id} to ${userId} for dynamic self-healing.`);
        
        // Dynamically update the database ID to match the Firebase UUID so future direct UUID checks succeed instantly!
        const { error: alignError } = await supabaseAdmin
          .from('profiles')
          .update({ id: userId })
          .eq('id', emailProfile.id)

        if (alignError) {
          console.error(`[Auth check] Self-healing update failed:`, alignError.message);
        } else {
          console.log(`[Auth check] Database healed successfully! UUID aligned.`);
        }
      }
    }

    if (!profile) {
      console.warn(`User profile with ID ${userId} or email ${email} was not found.`);
      return { success: false, role: 'student', permissions: [] }
    }

    const interestsData = typeof profile.interests === 'string' 
      ? JSON.parse(profile.interests) 
      : profile.interests || {}
    
    return {
      success: true,
      role: profile.role || 'student',
      permissions: interestsData?.permissions || []
    }
  } catch (error: any) {
    console.error("checkAdminAccessAction error:", error)
    return { success: false, role: 'student', permissions: [] }
  }
}
