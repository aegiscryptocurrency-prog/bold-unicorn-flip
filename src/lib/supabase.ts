import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner"; // Import toast for notifications
import { Database } from '@/types/supabase'; // Import the new Database type

// Correctly access client-side environment variables using import.meta.env
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

let client: ReturnType<typeof createClient<Database>>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is not set in environment variables. Please check your .env.local file.');
  toast.error("Supabase credentials missing! Please update .env.local with your Supabase URL and Anon Key.");

  // Provide a dummy client to prevent app crash, but it won't function
  client = {
    from: () => ({
      select: () => ({ data: [], error: new Error("Supabase not configured") }),
      insert: () => ({ data: [], error: new Error("Supabase not configured") }),
      update: () => ({ data: [], error: new Error("Supabase not configured") }),
      delete: () => ({ data: [], error: new Error("Supabase not configured") }),
      // Add other common methods as needed for a dummy client
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: new Error("Supabase storage not configured") }),
        getPublicUrl: () => ({ publicUrl: "https://via.placeholder.com/150?text=No+Image" }),
      }),
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error("Supabase auth not configured") }),
      // Add other common auth methods as needed for a dummy client
    },
    // Add other top-level Supabase client properties if necessary for a dummy
  } as any; // Cast to any to satisfy TypeScript for the dummy client
} else {
  client = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;