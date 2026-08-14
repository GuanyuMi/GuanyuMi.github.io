# AGENT

## Project Rules

- This is an npm-workspaces monorepo: `apps/web` is the public GitHub Pages site; `apps/resume-studio` is a local-only editor.
- Deploy only `apps/web/dist`. Do not add resume-studio routes, assets, or authentication flows to the public site.
- Treat Supabase `resume_published` as public content and `resume_drafts` as private editor content. Keep `packages/resume-content` only as seed and fallback data.
- Keep all secrets out of the repository. Use `.env.local` locally and GitHub Actions Variables for the web build; never expose a service-role key.
- Preserve static assets and GitHub Pages compatibility. All interactive controls must work on desktop and touch devices.
- Use React, TypeScript, Tailwind, and Lucide icons where applicable. Keep changes focused and avoid unnecessary abstractions.

## Verification

- Run `npm run typecheck` after TypeScript changes.
- Run `npm run build:web` for public-site or deployment changes.
- Run `npm run build:resume` for resume-studio or print-layout changes.

## Commit Convention

- Use Conventional Commits in the format: `<type>(<scope>): <summary>`.
- Follow the existing style already established in this repo, for example: `feat(data): add initial resume data`.
- Keep the summary short, imperative, and lowercase.
- Prefer one commit per clear intent or feature slice, not one commit per file.
- A commit may touch multiple files, but all touched files should serve the same change.
- Split unrelated work into separate commits, especially across these categories:
  - `data`: changes to `resume.json`
  - `docs`: changes to `AGENT.md`, `design.md`, or other documentation
  - `ui`: page structure, components, styling, or interaction changes
  - `build`: Vite, TypeScript, npm scripts, or local tooling changes
  - `deploy`: GitHub Pages workflow or deployment configuration
- Recommended types for this project:
  - `feat`: new user-facing functionality or UI capability
  - `fix`: bug fixes or data corrections
  - `docs`: documentation-only changes
  - `chore`: maintenance work that does not change product behavior
- Example commit messages:
  - `feat(data): add initial resume data`
  - `docs(agent): define shell and commit rules`
  - `feat(ui): build glassmorphism portfolio homepage`
  - `fix(data): clean corrupted resume text`
  - `chore(deploy): add github pages workflow`
