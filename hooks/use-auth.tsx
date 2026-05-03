"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface ExtendedUser extends User {
  name?: string;
  image?: string;
}

export function useAuth(): Omit<AuthContextType, 'user'> & { 
  user: ExtendedUser | null;
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

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return {
    user,
    signIn: login,
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
