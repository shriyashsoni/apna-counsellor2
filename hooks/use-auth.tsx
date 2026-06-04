"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth"
import { firebaseUidToUuid } from "@/lib/auth-utils"

// Detect mobile browser — popups are blocked by default on mobile
const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export interface ExtendedUser {
  id: string; // Deterministic Supabase UUID
  uid: string; // Firebase UID
  email: string | null;
  name: string;
  image: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
}

interface AuthContextType {
  user: ExtendedUser | null;
  signIn: (provider?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthContextType & { 
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
} {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mapUser = (firebaseUser: FirebaseUser | null): ExtendedUser | null => {
    if (!firebaseUser) return null;
    const uuid = firebaseUidToUuid(firebaseUser.uid);
    const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User";
    const image = firebaseUser.photoURL;
    return {
      id: uuid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      image,
      user_metadata: {
        full_name: name,
        name: name,
        avatar_url: image || undefined,
        picture: image || undefined
      }
    };
  };

  useEffect(() => {
    // On mobile: check for pending redirect result from signInWithRedirect
    if (isMobileBrowser()) {
      getRedirectResult(auth).catch((err) => {
        // Ignore errors — onAuthStateChanged will handle the result
        console.warn("[auth] Redirect result error (non-critical):", err?.code);
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const extendedUser = mapUser(firebaseUser);
        
        // Sync with server session cookie first before changing user state
        try {
          await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              uuid: extendedUser?.id,
            }),
          });
        } catch (err) {
          console.error("Failed to sync session to server:", err);
        }
        
        // Set user only after cookie has been successfully saved
        setUser(extendedUser);
      } else {
        // Clear server session cookie first
        try {
          await fetch("/api/auth/session", {
            method: "DELETE",
          });
        } catch (err) {
          console.error("Failed to clear server session:", err);
        }
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [])

  const login = async (provider: string = "google") => {
    setIsLoading(true);
    try {
      if (provider === "google") {
        const googleProvider = new GoogleAuthProvider();
        // Always ask to select account to avoid silent auto-logins with wrong account
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        
        // Use popup for all devices. signInWithRedirect is broken on iOS/Safari due to ITP.
        // As long as this is triggered by a direct user click, mobile browsers will allow the popup.
        await signInWithPopup(auth, googleProvider);
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      
      // Force trigger state sync with updated display name
      const currentUser = auth.currentUser;
      if (currentUser) {
        const extendedUser = mapUser(currentUser);
        // Sync session cookie first
        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: name,
            photoURL: currentUser.photoURL,
            uuid: extendedUser?.id,
          }),
        });
        setUser(extendedUser);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      window.location.href = '/';
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return {
    user,
    signIn: login,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
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
