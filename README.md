# Personal portfolio

This repository contains the public portfolio (`apps/web`) and the local resume editor (`apps/resume-studio`).

## Local development

1. Create `private-resume/resume.en.json` and `private-resume/resume.zh.json` locally. These ignored files are your resume source of truth.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to each app's `.env.local`.
3. Run `npm install`, then `npm run dev`.
4. Open the portfolio at `http://localhost:3000` and Resume Studio at `http://localhost:3001`.

Resume Studio saves directly to `private-resume`. Publishing requires the administrator account, copies the selected local resume through the protected draft table, and then updates `resume_published`. Run `supabase/schema.sql` after replacing its administrator email placeholder.

GitHub Pages only deploys `apps/web`. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as GitHub Actions variables before deploying.
