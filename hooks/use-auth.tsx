"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: ExtendedUser | null;
  signIn: (provider?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthContextType & { 
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
} {
  const supabase = createClient()
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mapUser = (supabaseUser: User | null): ExtendedUser | null => {
    if (!supabaseUser) return null;
    return {
      ...supabaseUser,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
      image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    };
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapUser(session?.user ?? null))
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(mapUser(session?.user ?? null))
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const login = async (provider: any = "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return {
    user,
    signIn: login,
    signInWithEmail,
    signUpWithEmail,
    signOut: logout,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
