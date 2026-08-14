# Personal portfolio

This repository contains the public portfolio (`apps/web`) and the local resume editor (`apps/resume-studio`).

## Local development

1. Copy each app's `.env.example` to `.env.local` and add the Supabase project URL and publishable key.
2. Run `npm install`, then `npm run dev`.
3. Open the portfolio at `http://localhost:3000` and Resume Studio at `http://localhost:3001`.

Resume Studio uses the database setup in `supabase/schema.sql`. Replace `YOUR_ADMIN_EMAIL` before running it, create that email/password user in Supabase Auth, then sign in and save the initial drafts.

GitHub Pages only deploys `apps/web`. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as GitHub Actions variables before deploying.
