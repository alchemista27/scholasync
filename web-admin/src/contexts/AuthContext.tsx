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

        if (error) {
          if (error.code !== 'PGRST116' && !error.message?.includes('0 rows')) {
            console.error('Error fetching school logo for favicon:', error);
          }
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
    let loadingTimeoutId: number | null = null;

    // Set a timeout to stop loading if auth check takes too long
    loadingTimeoutId = window.setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2000);
    const { data } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) return;

        const currentUser = session?.user;
        setSession(session);
        setUser(currentUser ?? null);

        if (currentUser) {
          try {
            const rolePromise = supabase
              .from('user_roles')
              .select('role:roles(name)')
              .eq('user_id', currentUser.id)
              .single();
            
            const roleTimeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Role fetch timeout')), 3000)
            );
            
            const result: any = await Promise.race([rolePromise, roleTimeoutPromise]);
            if (isMounted) {
              const roleName = (result?.data as any)?.role?.name ?? null;
              setRole(roleName);
            }
          } catch (err) {
            if (isMounted) {
              setRole(null);
            }
          }
        } else {
          setRole(null);
        }
        
        // Only mark as not loading on INITIAL_SESSION event
        // This ensures we don't render before the session is fully restored
        if (isMounted && event === 'INITIAL_SESSION') {
          if (loadingTimeoutId) {
            clearTimeout(loadingTimeoutId);
            loadingTimeoutId = null;
          }
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
      }
      data?.subscription?.unsubscribe();
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