// comment out below 2 lines when running remotely
import dotenv from 'dotenv';
dotenv.config({path: '.env.local', override: true});

import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export const supabaseURL = env.PUBLIC_SUPABASE_URL
export const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseURL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '' 
);

//console.log('Supabase URL: ', supabaseURL);
//console.log('Supabase Anon Key: ', supabaseAnonKey);
//console.log('Supabase Service Role Key: ', process.env.SUPABASE_SERVICE_ROLE_KEY);