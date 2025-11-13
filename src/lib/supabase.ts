import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are correctly set in your .env file
// For example:
// VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
// VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Debugging Supabase environment variables:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Loaded' : 'Not Loaded');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Loaded' : 'Not Loaded');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL (VITE_SUPABASE_URL) or Anon Key (VITE_SUPABASE_ANON_KEY) is missing. Please check your environment variables.');
  // You might want to throw an error or handle this more gracefully in a production app
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);