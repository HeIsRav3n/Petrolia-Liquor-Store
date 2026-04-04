import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gqgrpuuisgzmznhwbvdh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3JwdXVpc2d6bXpuaHdidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODc3ODMsImV4cCI6MjA5MDY2Mzc4M30.d6tBWYbonYkOsuGeB24z6wDpZH0Nksf72v5kpx-awYI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined as environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
