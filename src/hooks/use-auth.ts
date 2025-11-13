"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  account_type: 'collector' | 'consumer';
  description?: string;
  looking_for?: string;
  contact_links?: Array<{ type: string; value: string }>;
  home_address?: string;
  shipping_address?: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const getSessionAndProfile = async () => {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      let userProfile: Profile | null = null;
      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          userProfile = profileData;
        }
      }

      if (sessionError) {
        console.error('Error getting session:', sessionError);
      }

      setAuthState({
        session,
        user: session?.user || null,
        profile: userProfile,
        loading: false,
      });
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // When auth state changes, re-fetch profile
      getSessionAndProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
}