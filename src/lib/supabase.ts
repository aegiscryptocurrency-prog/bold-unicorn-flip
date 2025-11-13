import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL (VITE_SUPABASE_URL) or Anon Key (VITE_SUPABASE_ANON_KEY) is missing. Please check your environment variables.');
      // In a real application, you might want to throw an error or display a user-friendly message
    }

    export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);