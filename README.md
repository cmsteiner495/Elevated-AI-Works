# Elevated AI Works

Static site for Elevated AI Works.

## Supabase Setup (Local)
1. Copy `config/env.example.js` to `config/env.js` (this file is gitignored).
2. Paste your Supabase **Project URL** and **anon public key** into the `SUPABASE_URL` and `SUPABASE_ANON_KEY` values in `config/env.js`.
3. Keep the **service_role key** and any database password out of the frontend; they are server-only secrets that will be stored later using Supabase Edge Function secrets or hosting environment variables.
4. Never commit `config/env.js`, `.env`, or any other files containing secrets to version control.
