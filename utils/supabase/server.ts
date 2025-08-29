
// Define a type for the cookiesToSet parameter
interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, any>;
}
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
