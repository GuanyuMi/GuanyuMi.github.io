# AGENT

## Project Rules

- Build a static, single-page portfolio in TypeScript with a local demo workflow first.
- Treat `resume.json` as the source of portfolio content.
- Keep the site GitHub Pages compatible: static assets only, no server runtime, no client-side routing dependency.
- Every interactive control should work on desktop and touch devices.

## Implementation Defaults

- Use `tailwind CSS + React + TypeScript`.
- Use Lucide icons.

## Shell Command Policy

- Only use the minimum shell commands needed for this project.
- Allowed read-only inspection commands:
  - `Get-Content resume.json`
  - `Get-Content AGENT.md`
  - `Get-Content design.md`
  - `Get-ChildItem -Force`
  - `git status --short`
- Allowed development commands:
  - `npm install`
  - `npm install -D`
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Allowed scope for these commands:
  - Install only dependencies required by the current frontend app.
  - Run only local Vite, TypeScript, and GitHub Pages related workflows.
  - Read or verify only files inside this repository.
- All other shell commands should be treated as disallowed unless the user explicitly asks for them.
- Do not use destructive commands such as `rm`, `del`, `Remove-Item`, `git reset --hard`, `git checkout --`, or any command that changes unrelated files.
- Do not run global installs, package manager upgrades, deployment CLIs, or arbitrary scripts unless the user explicitly requests them.

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
