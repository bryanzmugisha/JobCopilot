# Job Copilot

A personal job-application cockpit — built with **Next.js 14 + Prisma + PostgreSQL**.
It finds and tracks jobs, tailors your CV summary and cover letter per role using
the Anthropic API, stores your reusable screening answers, and helps autofill
application forms.

> **Design principle: assist, never auto-submit.**
> This tool gets you to the "review and submit" step fast. *You* always read and
> submit. It never logs into LinkedIn/Indeed to submit on your behalf — that
> violates their terms and produces generic spam. Tailored beats automated.

---

## What's inside

| Pillar      | How it works                                                              |
|-------------|---------------------------------------------------------------------------|
| **Tracker** | Add jobs, move them through SAVED → TAILORED → APPLIED → INTERVIEW → OFFER |
| **Tailoring** | One click calls Claude to write a per-job summary + cover letter, using *only* facts from your profile (no fabrication) |
| **Answers** | Save stock answers (e.g. your data-entry answer) once, copy them in seconds |
| **Autofill** | A bookmarklet fills name/email/phone on forms; you review and submit      |

## Tech stack
Next.js (App Router) · TypeScript · Prisma ORM · PostgreSQL · Anthropic API.
Same family as your RestoPOS project, so it should feel familiar.

---

## Setup (about 10 minutes)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create a Postgres database** called `job_copilot` (locally, or use a free
   cloud Postgres like Neon or Supabase).
3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in `DATABASE_URL` and your `ANTHROPIC_API_KEY`
   (from https://console.anthropic.com).
4. **Create the tables and seed your profile**
   ```bash
   npm run db:push     # creates tables from schema.prisma
   npm run db:seed     # loads your profile + sample answers
   ```
5. **Run it**
   ```bash
   npm run dev         # http://localhost:3000
   ```

Open the app → check **Profile** (pre-seeded with your details) → **Add job** →
open the job → click **Tailor**.

The autofill bookmarklet lives in `public/autofill.md` with install steps.

---

## How the AI tailoring stays honest

`src/lib/anthropic.ts` sends Claude a strict system prompt: use only facts in
your profile, never invent experience, dates, metrics, or skills, and lean on
genuine transferable experience when the job asks for something you don't have.
Your API key is read on the server only and never reaches the browser.

---

## Roadmap — build these yourself to make it truly *yours*

These are deliberately left for you, so the project demonstrates *your* skills:

- [ ] **Auth** — add NextAuth so it's a real multi-user app (you've done this in RestoPOS).
- [ ] **Kanban board** — drag jobs between status columns (great React state practice).
- [ ] **Paste-a-URL import** — fetch a listing and pre-fill the description.
- [ ] **Resume export** — generate a tailored PDF per job from your profile.
- [ ] **Follow-up reminders** — surface jobs whose `followUpAt` date has passed.
- [ ] **Analytics** — Recharts dashboard: applications per week, response rate.
- [ ] **Tests** — add a couple of unit tests around the tailoring prompt builder.

Tackle them one at a time. Each one is a clean, demoable commit for your GitHub.

---

## Project structure
```
prisma/schema.prisma     data model (Profile, Answer, Job, TailoredDoc)
prisma/seed.ts           loads your real profile
src/lib/prisma.ts        database client
src/lib/anthropic.ts     Claude tailoring engine (server-only)
src/app/page.tsx         dashboard
src/app/jobs/new         add a job
src/app/jobs/[id]        job detail: tailor, status, docs, notes
src/app/profile          edit profile + manage reusable answers
src/app/api/*            REST endpoints
public/autofill*         the review-then-submit bookmarklet
```

Built as a learning project. Understand each file before you extend it — that's
what makes it honest to put your name on.
