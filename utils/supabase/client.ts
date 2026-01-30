import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a dummy client during build to avoid crashing
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              then: (cb: any) => cb({ data: [], error: null }),
            }),
            single: () => Promise.resolve({ data: null, error: null }),
            then: (cb: any) => cb({ data: [], error: null }),
          }),
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            then: (cb: any) => cb({ data: [], error: null }),
          }),
          single: () => Promise.resolve({ data: null, error: null }),
          then: (cb: any) => cb({ data: [], error: null }),
        }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
