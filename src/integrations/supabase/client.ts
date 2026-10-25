import { createClient } from "@supabase/supabase-js";

// Supabase project "mntn" (eu-central-1). The publishable key is safe to ship:
// row-level security only lets visitors insert newsletter sign-ups.
export const SUPABASE_URL = "https://pgcbuflfvkfirfiyiamr.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_U-htiTtKN1lHSuuOkkz5nw_i9VBPjCo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});

export type NewsletterSignup = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};
