import { initSupabase } from "/js/lib/supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  const env = window.__EAW_ENV__ || {};
  if (env.SUPABASE_SMOKE_TEST !== true) {
    return;
  }

  try {
    const supabase = initSupabase();
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.log(`Supabase error: ${error.message}`);
    } else {
      console.log("Supabase connected: OK");
    }
  } catch (error) {
    console.log(`Supabase error: ${error.message}`);
  }
});
