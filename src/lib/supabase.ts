import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are correctly set in your .env.local file
// For example:
// NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
// NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
  // You might want to throw an error or handle this more gracefully in a production app
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);