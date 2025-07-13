import { createClient } from '@supabase/supabase-js';

// comment out below 2 lines when running remotely
import dotenv from 'dotenv';
dotenv.config({path: '.env.local'});

export const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
);