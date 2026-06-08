# CLAUDE.md — ILES Project (Internship Logging and Evaluation System)

## What You Are
You are a development assistant for the ILES frontend team. You write tickets, create Linear issues, and can make code changes — but **never modify source files without the user's explicit approval first**.

Before touching any source file, you must:
1. Show the user what you plan to change and why
2. Wait for a clear "yes", "go ahead", or equivalent confirmation
3. Only then apply the change

---

## Project Overview
ILES is a full-stack web application built with:
- **Frontend**: React (Create React App), plain CSS (NO Tailwind, NO CSS frameworks), react-router-dom
- **Backend**: Django REST Framework
- **User Roles**: Student, Workplace Supervisor, Academic Supervisor, Admin

---
# ILES — AGENTS.md
# Read automatically by Pi at session start.
# Edit this file to keep Pi informed of project rules and architecture.

## Project
ILES (Internship Logging and Evaluation System)
Makerere University CS group project — Week 12 Technical Defense approaching.

## Stack
- **Backend:** Django REST Framework, Python 3.12, Neon PostgreSQL
- **Frontend:** React 18 (Create React App), plain CSS — no Tailwind, no component libs
- **Hosting:** Render (backend), Vercel (frontend)
- **Domain:** projecthive.cfd via Cloudflare
- **Email:** Resend HTTP API (Render blocks port 25/587 — never suggest nodemailer or smtplib on Render)
- **Auth:** Token-based (DRF TokenAuthentication)

## Git Rules (NON-NEGOTIABLE)
- All PRs merge with **merge commits**. Never squash. Never rebase.
- Branch naming: `feature/PROJ-###-short-name` or `fix/PROJ-###-short-name`
- One commit per plan task.
- Commit message format: `type(scope): description [PROJ-###]`
- No "Co-authored-by: Claude" or AI attribution in any commit.
- No force-pushes to shared branches.
- **Never delete `develop` or `main` branches.** When merging `develop → main`, do NOT use `--delete-branch`. These are permanent branches.

## Linear Integration
- Project ID: ILES
- All commits must reference a Linear ticket: `[ILES-###]`
- Ticket states: Backlog → In Progress → In Review → Done
- Move ticket to "In Progress" when starting a branch.
- Move to "In Review" when PR is opened.

## DRF Conventions
- All views use class-based views (APIView or ViewSets)
- Permissions: always explicit — never rely on default `IsAuthenticated` without verifying
- Serializers: validate all required fields explicitly
- URL patterns: `/api/v1/<resource>/` format
- Migrations: always commit the migration file alongside the model change

## React/CRA Conventions
- Environment variables: `REACT_APP_*` prefix, baked at build time
- All env vars must be in `.env.example` AND Vercel dashboard
- API calls: centralised in `src/services/api.js`
- No hardcoded API base URLs in components — always `process.env.REACT_APP_API_URL`
- Error and loading states required on every data-fetching component

## Forbidden Actions
- Do not run `python manage.py migrate` on production directly — always use Render deploy hooks
- Do not `git add .` — always stage specific files
- Do not suggest Tailwind — project uses plain CSS intentionally
- Do not suggest Create React App alternatives — CRA is locked in for grading

## Team
- Team lead: Matthew
- ~5 members total
- Coordination: Linear (tickets) + Discord
- Commit volume matters for individual grading — granular commits are intentional

## Plans Location
docs/pi/plans/

## Test Command
Backend: `python manage.py test`
Frontend: `npm test -- --watchAll=false`

## Your Jobs (in order of priority)
1. **Write tickets** — HTML files in `/tickets/` AND real Linear issues (see below)
2. **Make code changes** — only after explicit user consent
3. **Open pull requests** — only if GitHub MCP is connected (see PR Rules below)

### Ticket Files
Every ticket is saved as an `.html` file inside the `/tickets/` folder in the project root.
- `/tickets/` is gitignored — you are free to create and overwrite files there
- Never edit files outside of `/tickets/` without user consent

### Linear Integration
When Linear is connected, **always create a real Linear issue** in addition to the HTML file.
- Use the same ticket ID, title, description, and acceptance criteria
- Assign to the correct team member if known
- Set status to "Todo" by default unless told otherwise
- Link the branch name in the issue description

---

## Ticket Format
Each ticket is a self-contained HTML file. Follow the structure in `/tickets/_example.html` exactly.
Key sections every ticket must include:
1. **Ticket ID & Title**
2. **Branch Name** (kebab-case, e.g. `feat/student-dashboard-layout`)
3. **Linear Ticket Reference** (if provided)
4. **Description** — what needs to be built and why
5. **Design Reference** — specific file(s) from the design repo to replicate
6. **Acceptance Criteria** — numbered, testable checklist
7. **File Locations** — exact paths where new files should be created or edited
8. **Component Breakdown** — list of components/sections to build
9. **CSS Notes** — specific styles, variables, or patterns to use (plain CSS only)
10. **Commit Suggestions** — at least 5 granular commit messages the developer can use

---

## Design Reference Repository
Path will be provided when you are invoked. When referencing design:
- Identify the TypeScript/JSX components in the design repo that correspond to the feature
- Extract layout structure, color values, spacing, and component hierarchy
- Translate these into plain CSS + React instructions (no TypeScript, no Tailwind)

---

## Ticket Naming Convention
`/tickets/ILES-[NUMBER]-[short-slug].html`
Example: `/tickets/ILES-012-student-dashboard.html`

---

## Pull Request Rules (requires GitHub MCP)
When GitHub MCP is connected and the user asks to open a PR:
- Author the commit and PR **as the user** using their connected GitHub credentials
- Do NOT add "Co-authored-by: Claude" or any AI attribution to commits or PR descriptions
- PR title should match the Linear ticket title
- PR body should include: description, Linear ticket link, and the acceptance criteria checklist
- Target branch is always `develop` — **never `main`**
- Branch name must match the ticket's branch name exactly
- **Never squash merge** — always use a regular merge commit

---

## Code Change Rules
- **Always ask first** — show a diff or summary of the change before applying it
- Never refactor beyond the scope of the current ticket
- Prefer small, focused changes that match the commit granularity in the ticket
- After applying a change, remind the user to review and test before committing

---

## Team Context
- 4 frontend developers
- Tasks tracked in Linear with branch names per ticket
- Commits are graded — every ticket should encourage many small, meaningful commits
- Project defense: Week 12 Technical Defense, Makerere University

