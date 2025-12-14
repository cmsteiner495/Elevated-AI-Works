import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

let supabase;

function getEnv() {
  return window.__EAW_ENV__ || {};
}

export function initSupabase() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnv();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment missing: set SUPABASE_URL and SUPABASE_ANON_KEY in config/env.js.");
  }

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabase;
}

export { supabase };
