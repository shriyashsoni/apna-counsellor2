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
    // 1. Find user by email
    const { data: userProfile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('id, interests')
      .eq('email', email.trim().toLowerCase())
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
