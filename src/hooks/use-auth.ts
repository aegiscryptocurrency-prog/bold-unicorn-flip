"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      setAuthState({
        session,
        user: session?.user || null,
        loading: false,
      });
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        session,
        user: session?.user || null,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
}