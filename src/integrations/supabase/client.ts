import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawUrl.trim() !== '' &&
  rawAnonKey &&
  rawAnonKey.trim() !== '' &&
  !rawUrl.includes('placeholder')
);

// Fallback credentials to prevent createClient from throwing 'Error: supabaseUrl is required'
// when environment variables are not yet configured in local/preview environments.
const SUPABASE_URL = (rawUrl && rawUrl.trim() !== '') ? rawUrl.trim() : 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = (rawAnonKey && rawAnonKey.trim() !== '') ? rawAnonKey.trim() : 'placeholder-anon-key';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: brokeredPreviewStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
