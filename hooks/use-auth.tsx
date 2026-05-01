import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthContextType & { login: (provider?: string) => Promise<void>, logout: () => Promise<void> } {
  const authActions = useAuthActions();
  const convexAuth = useConvexAuth();
  
  const signIn = authActions?.signIn;
  const signOut = authActions?.signOut;
  const isAuthenticated = convexAuth?.isAuthenticated || false;
  const isAuthLoading = convexAuth?.isLoading || false;

  const user = useQuery(api.users.currentUser, isAuthenticated ? {} : "skip");
  
  const login = async (provider: string = "google") => {
    if (signIn) {
      await signIn(provider, { redirectTo: "/dashboard" });
    } else {
      console.error("signIn function is not available");
    }
  };

  const logout = async () => {
    if (signOut) {
      await signOut();
    } else {
      console.error("signOut function is not available");
    }
  };

  return {
    user: user as any,
    signIn: login,
    signOut: logout,
    login,
    logout,
    isLoading: isAuthLoading || (isAuthenticated && user === undefined),
    isAuthenticated: isAuthenticated
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
