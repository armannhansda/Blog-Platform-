import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Client for Browser/Client-Side Operations
 *
 * Use this client in React components for:
 * - Real-time subscriptions
 * - Authentication
 * - Client-side queries (limited by RLS policies)
 *
 * @example
 * import { supabase } from "@/lib/supabase/client";
 *
 * // Get current session
 * const { data: { session } } = await supabase.auth.getSession();
 *
 * // Subscribe to realtime changes
 * supabase
 *   .channel('posts')
 *   .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
 *     console.log('Change received!', payload)
 *   })
 *   .subscribe()
 */

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
