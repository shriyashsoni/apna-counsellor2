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
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const user = useQuery(api.users.currentUser, isAuthenticated ? {} : "skip");
  
  const login = async (provider: string = "google") => {
    await signIn(provider);
  };

  const logout = async () => {
    await signOut();
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
