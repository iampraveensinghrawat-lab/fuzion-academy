import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amzptluvdjlhwluolufa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fRFkl6m5y3sPhusPtn5CzQ_LeKq94wI';

export const isSupabaseConfigured = Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

