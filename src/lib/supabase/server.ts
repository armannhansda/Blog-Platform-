import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Client for Server-Side Operations
 *
 * Use this client in Server Components, API Routes, and Server Actions for:
 * - Database queries (full access with Service Role Key)
 * - Authentication in server context
 * - Admin operations
 *
 * @example
 * import { createClient } from "@/lib/supabase/server";
 *
 * // In a Server Component or API Route
 * const supabase = await createClient();
 * const { data: users } = await supabase
 *   .from('users')
 *   .select('*');
 */

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle cookie setting in Server Component
          }
        },
        remove(name) {
          try {
            cookieStore.delete(name);
          } catch {
            // Handle cookie deletion in Server Component
          }
        },
      },
    }
  );
};
