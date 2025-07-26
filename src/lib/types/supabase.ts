import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const supabaseURL = PUBLIC_SUPABASE_URL
export const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseURL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '' , {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);



