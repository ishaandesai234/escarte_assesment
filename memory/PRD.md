# Escarté Learning Labs — PRD

## Original Problem Statement
SkillSpark → **Escarté Learning Labs** — Duolingo-style skill assessment web app for teens (10–18). Rebranded mid-build to luxury navy + beige + gold palette matching Escarté brand logo.

## Personas
- Teens 10–18 (primary users)
- Parents wanting to see kid's skills (via shared PDF)
- Schools / coaching partners (B2B)

## Core Requirements
- 6 skill categories: English, Communication, Finance, Leadership, Critical Thinking, Emotional IQ
- 7 question formats: MCQ, fill-blank, scenario, true/false, order-sentence, match-pairs, listen-pick (audio deferred)
- Foxy mascot with mood reactions (neutral, happy, cheer, sad, thinking, focused)
- Fire streak counter during quiz
- Instant feedback + explanations + confetti
- Badges for milestone/power questions
- Rule-based scored report with pros/cons, radar chart, PDF download
- Admin dashboard with users, submissions, category analytics, CSV lead export
- JWT email/password auth

## Implemented (Feb 2026)
- Full backend (FastAPI + MongoDB): auth, categories, 43 questions across 6 categories, /check answer, /submissions scoring, admin RBAC endpoints
- Full frontend (React): Landing, Login, Register, Dashboard, Quiz (with intro bubbles, streak counter, foxy reactions, confetti in brand colors), Results (radar chart + jsPDF download), Profile (trophy shelf), Admin (analytics + CSV export)
- Custom SVG Foxy mascot (sleek geometric design with gold monocle & tassel, navy scholar collar)
- FireStreak SVG animation
- Escarté serif wordmark with navy/red divider
- Luxury palette: beige #EFE7D3, navy #1A2A4F, gold #E5A934, ember red #B71C1C

## Prioritized Backlog
- P1: Listen & pick audio question format
- P1: Email delivery of PDF report (Resend/SendGrid) — user chose skip for MVP
- P1: AI-generated personalized report language (Claude/GPT via Emergent LLM key)
- P2: Admin question editor (currently seeded from code)
- P2: Parent access with separate login
- P2: Hindi language support
- P2: Streak leaderboard / weekly challenges

## Admin Credentials
admin@skillspark.com / admin123 (env-driven, seeded on startup)
