import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export function createScopedClient(token: string): SupabaseClient {
  return createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key', {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}
