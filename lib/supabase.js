import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Public client (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'rae-taxi' },
});

// Server client with service role key (server-side only)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(supabaseUrl, serviceRoleKey, {
    db: { schema: 'rae-taxi' },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
