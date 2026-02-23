"use client"

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);

        if (currentUser) {
            try {
              const { data: roleData, error } = await supabase
                .from('user_roles')
                .select('role:roles(name)')
                .eq('user_id', currentUser.id)
                .single();
              
              if (error) throw error;

              if (isMounted) {
                const roleName = (roleData as any)?.role?.name ?? null;
                setRole(roleName);
              }
            } catch (err) {
              if (isMounted) {
                console.error("Error fetching user role:", err);
                setRole(null);
              }
            }
        } else {
            setRole(null);
        }
        
        setLoading(false);
      }
    );

    // Initial session load
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
            const currentUser = session?.user ?? null;
            setSession(session);
            setUser(currentUser);
            if (currentUser) {
                try {
                    const { data: roleData, error } = await supabase
                        .from('user_roles')
                        .select('role:roles(name)')
                        .eq('user_id', currentUser.id)
                        .single();
                    
                    if (error) throw error;
        
                    if (isMounted) {
                        const roleName = (roleData as any)?.role?.name ?? null;
                        setRole(roleName);
                    }
                } catch (err) {
                    if (isMounted) {
                        console.error("Error fetching user role on initial load:", err);
                        setRole(null);
                    }
                }
            }
            setLoading(false);
        }
    };

    checkInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
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
