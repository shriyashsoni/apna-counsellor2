// Run this script to fix the duplicate profile issue for sonikrishnakumar599@gmail.com
// The user's Firebase UID maps to UUID: 5d1926d6-5d19-46d7-a000-00015d1926d6
// We need to copy the role and permissions from the admin profile to the active Firebase-linked profile

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixDuplicateProfiles() {
  const email = 'sonikrishnakumar599@gmail.com'
  
  console.log(`\n🔍 Fetching all profiles for: ${email}`)
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, role, interests, firebase_uid, updated_at')
    .ilike('email', email)

  if (error) { console.error('Failed:', error.message); return }
  
  console.log(`Found ${profiles?.length} profiles:`)
  profiles?.forEach((p: any, i: number) => {
    console.log(`  [${i}] id: ${p.id} | role: ${p.role} | firebase_uid: ${p.firebase_uid} | interests: ${JSON.stringify(p.interests)}`)
  })

  // The active profile is the one with firebase_uid set
  const activeProfile = profiles?.find((p: any) => p.firebase_uid !== null)
  // The profile with permissions is the one with admin role or non-empty permissions
  const permissionsProfile = profiles?.find((p: any) => {
    const interests = typeof p.interests === 'string' ? JSON.parse(p.interests) : p.interests || {}
    return p.role === 'admin' || (interests?.permissions && interests.permissions.length > 0)
  })

  if (!activeProfile) {
    console.log('⚠️ No active (Firebase-linked) profile found. Nothing to fix.')
    return
  }

  if (!permissionsProfile) {
    console.log('⚠️ No profile with permissions found. Assigning permissions directly...')
    // Just set the active profile to admin with permissions
    const { error: fixError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'admin',
        interests: { permissions: ['broadcast', 'email-agent'] }
      })
      .eq('id', activeProfile.id)
    
    if (fixError) console.error('Fix failed:', fixError.message)
    else console.log('✅ Permissions assigned to active profile')
    return
  }

  const permInterests = typeof permissionsProfile.interests === 'string' 
    ? JSON.parse(permissionsProfile.interests) 
    : permissionsProfile.interests || {}

  console.log(`\n🔧 Copying role "${permissionsProfile.role}" and permissions [${(permInterests?.permissions || []).join(', ')}] to active profile...`)
  
  // Copy role and interests to the active (Firebase-linked) profile
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      role: permissionsProfile.role,
      interests: permissionsProfile.interests
    })
    .eq('id', activeProfile.id)

  if (updateError) {
    console.error('❌ Failed to update active profile:', updateError.message)
    return
  }

  console.log('✅ Role and permissions copied to active profile!')

  // Delete the stale duplicate profiles (those without firebase_uid)
  const staleProfiles = profiles?.filter((p: any) => p.firebase_uid === null && p.id !== activeProfile.id)
  if (staleProfiles && staleProfiles.length > 0) {
    console.log(`\n🗑️ Deleting ${staleProfiles.length} stale duplicate profiles...`)
    for (const stale of staleProfiles) {
      const { error: delError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', stale.id)
      
      if (delError) console.error(`  ❌ Failed to delete ${stale.id}:`, delError.message)
      else console.log(`  ✅ Deleted stale profile: ${stale.id}`)
    }
  }

  console.log('\n🎉 Done! Profile is now fully fixed.')
  
  // Verify the fix
  const { data: final } = await supabaseAdmin
    .from('profiles')
    .select('id, email, role, interests, firebase_uid')
    .ilike('email', email)
  
  console.log('\n📋 Final state:')
  final?.forEach((p: any) => {
    const interests = typeof p.interests === 'string' ? JSON.parse(p.interests) : p.interests || {}
    console.log(`  id: ${p.id} | role: ${p.role} | permissions: [${(interests?.permissions || []).join(', ')}] | firebase_uid: ${p.firebase_uid}`)
  })
}

fixDuplicateProfiles().catch(console.error)
