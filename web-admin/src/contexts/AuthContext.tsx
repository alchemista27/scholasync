import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role:roles(name)')
            .eq('user_id', currentUser.id)
            .single();
          
          if (roleError && roleError.code !== 'PGRST116') { // Ignore "no rows found" error
            console.error("Error fetching user role:", roleError);
            setRole(null);
          } else {
            // Safely access the role name to prevent crashes
            setRole((roleData as any)?.role?.name ?? null);
          }
        } else {
          setRole(null);
        }
        // Set loading to false after the first auth event is processed
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    role,
    loading,
  };

  // Render children only when the initial loading is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
