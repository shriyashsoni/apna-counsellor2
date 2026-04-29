import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
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
  const user = useQuery(api.users.currentUser);
  
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
    isLoading: user === undefined,
    isAuthenticated: !!user
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
