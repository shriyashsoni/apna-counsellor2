import { createBrowserClient } from '@supabase/ssr'
import { auth } from '@/lib/firebase'
import { firebaseUidToUuid } from '@/lib/auth-utils'

// Helper to wait for Firebase auth to initialize
const waitForAuth = (): Promise<any> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export function createClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey,
    {
      cookieOptions: {
        domain: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? undefined : '.apnacounsellor.in',
        path: '/',
      },
    }
  )

  const originalAuth = client.auth

  // Shim auth methods to use Firebase Auth
  client.auth = {
    ...originalAuth,
    getUser: async (token?: string) => {
      let firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        firebaseUser = await waitForAuth();
      }
      
      if (!firebaseUser) {
        return { data: { user: null }, error: null } as any;
      }
      
      const uuid = firebaseUidToUuid(firebaseUser.uid);
      const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
      
      return {
        data: {
          user: {
            id: uuid,
            email: firebaseUser.email,
            user_metadata: {
              full_name: name,
              name: name,
              avatar_url: firebaseUser.photoURL || undefined,
              picture: firebaseUser.photoURL || undefined,
            },
            role: 'authenticated',
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          }
        },
        error: null
      } as any;
    },
    
    getSession: async () => {
      let firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        firebaseUser = await waitForAuth();
      }
      
      if (!firebaseUser) {
        return { data: { session: null }, error: null } as any;
      }
      
      const uuid = firebaseUidToUuid(firebaseUser.uid);
      const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
      
      const mappedUser = {
        id: uuid,
        email: firebaseUser.email,
        user_metadata: {
          full_name: name,
          name: name,
          avatar_url: firebaseUser.photoURL || undefined,
          picture: firebaseUser.photoURL || undefined,
        },
      };

      return {
        data: {
          session: {
            access_token: anonKey, // Pass standard, valid Supabase Anon JWT to prevent "expected three parts in JWT" error
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'firebase-mock-refresh',
            user: mappedUser,
          }
        },
        error: null
      } as any;
    },

    signOut: async () => {
      await auth.signOut();
      return { error: null } as any;
    },

    onAuthStateChange: (callback: any) => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          const uuid = firebaseUidToUuid(firebaseUser.uid);
          const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          
          const mappedUser = {
            id: uuid,
            email: firebaseUser.email,
            user_metadata: {
              full_name: name,
              name: name,
              avatar_url: firebaseUser.photoURL || undefined,
              picture: firebaseUser.photoURL || undefined,
            },
          };

          callback('SIGNED_IN', {
            access_token: anonKey, // Pass standard, valid Supabase Anon JWT
            user: mappedUser,
          });
        } else {
          callback('SIGNED_OUT', null);
        }
      });

      return {
        data: {
          subscription: {
            unsubscribe: () => unsubscribe()
          }
        }
      } as any;
    }
  } as any;

  return client;
}
