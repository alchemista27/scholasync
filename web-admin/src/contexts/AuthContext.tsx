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

const setFavicon = (url: string) => {
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (link) {
    link.href = url;
  } else {
    link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetFavicon = async () => {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('logo_url')
          .eq('id', 1)
          .single();

        // Ignore "no rows found" (PGRST116) and "NOT_FOUND" (404) errors
        if (error && error.code !== 'PGRST116' && error.code !== 'NOT_FOUND') {
          console.error('Error fetching school logo for favicon:', error);
        } else if (data && data.logo_url) {
          setFavicon(data.logo_url);
        }
      } catch (err) {
        console.error('Unexpected error fetching favicon:', err);
      }
    };

    fetchAndSetFavicon();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) return;

        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role:roles(name)')
              .eq('user_id', currentUser.id)
              .single();
            
            // Ignore "no rows found" error (PGRST116) and "NOT_FOUND" (404)
            if (roleError && roleError.code !== 'PGRST116' && roleError.code !== 'NOT_FOUND') {
              console.error("Error fetching user role:", roleError);
              setRole(null);
            } else {
              setRole((roleData as any)?.role?.name ?? null);
            }
          } catch (err) {
            console.error("Unexpected error fetching user role:", err);
            setRole(null);
          }
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    role,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}