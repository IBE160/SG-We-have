import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: You can add a function to verify the client initialization
// This would typically involve logging success or having a simple test endpoint
export const verifySupabaseClient = () => {
  if (supabase) {
    console.log("Frontend: Supabase client initialized successfully.");
    return true;
  } else {
    console.error("Frontend: Supabase client initialization FAILED.");
    return false;
  }
}
