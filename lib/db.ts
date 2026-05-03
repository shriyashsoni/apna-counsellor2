import { createClient } from './supabase/client'
import { createClient as createServerClient } from './supabase/server'

// Types for our database tables
export interface Profile {
  id: string
  name: string
  email: string
  image?: string
  role: 'student' | 'mentor' | 'admin'
  onboarding_complete: boolean
}

export interface College {
  id: string
  name: string
  type: string
  location: string
  city?: string
  nirf_rank?: number
  annual_fee?: string
  avg_package?: string
  image_url?: string
}

export interface Counseling {
  id: string
  name: string
  category: string
  region: string
  exam?: string
}

// Client-side DB helpers
export const db = {
  // Profiles
  async getProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    if (error) return null
    return data
  },

  // Colleges
  async listColleges(params?: { search?: string; state?: string; limit?: number }) {
    const supabase = createClient()
    let query = supabase.from('colleges').select('*')
    
    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`)
    }
    if (params?.state) {
      query = query.eq('state', params.state)
    }
    if (params?.limit) {
      query = query.limit(params.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getCollegeById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  // Counselings
  async listCounselings() {
    const supabase = createClient()
    const { data, error } = await supabase.from('counselings').select('*')
    if (error) throw error
    return data
  }
}

// Server-side DB helpers
export const serverDb = {
  async getProfile() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    if (error) return null
    return data
  }
}
