# ScreenLess: Phone-Down Social Challenges for Gen Z

ScreenLess is a native Android app that turns **putting your phone down** into a social game for small groups.

Friends create shared "screenless windows" (study sessions, deep work, walks, offline hangouts). Everyone earns streak points and soft rewards for staying off distracting apps, with gentle, real-time accountability instead of pure self-control.

This document is the high-level product, architecture, and directory layout spec so the monorepo can evolve as a single source of truth—mobile app, backend, and admin panel.

---

## 1. GitHub Description (≤ 350 characters)

ScreenLess is a Gen Z social app that turns going offline into a shared challenge. Create group "screenless windows", earn streaks for staying off distracting apps, and keep each other accountable with soft, positive nudges instead of doomscrolling.

---

## 2. Concept & User Value

### 2.1 Problem

Gen Z spends heavy time in social apps but increasingly wants tools that help set boundaries and reduce doomscrolling, without feeling like boring "productivity" apps.

Existing focus/lock apps are often:
- Solo, with no social accountability.
- Punitive or rigid instead of flexible.
- Disconnected from real friend groups.

### 2.2 ScreenLess concept

ScreenLess reframes phone-down time as:
- A shared ritual with close friends.
- A flexible, opt-in challenge (choose what counts as "off").
- A source of light social rewards and reflections.

Core idea: **"Phone down, friendship up"**—treat offline moments as social, not solitary.

---

## 3. Core Features

### 3.1 Screenless Windows

- Create time-bound "windows" (e.g., 45-minute study session, 2-hour walk, 1-hour hangout).
- Invite friends to join via link/code.
- Define which apps are considered "distracting" for this window.

### 3.2 Soft Accountability

- During a window, ScreenLess monitors app usage and basic screen activity (with consent).
- If someone opens a distracting app for too long, the group sees soft signals like "Karan peeked at socials 👀" rather than shaming metrics.

### 3.3 Streaks & Micro-Rewards

- Group streaks based on completed windows.
- Personal streaks per friend, per context (study, social, self-care).
- Unlock small cosmetic rewards (themes, badges, custom window names) instead of time-wasting features.

### 3.4 Reflections & Story Moments

- After each window, users can answer 1-2 micro prompts: "How did it feel?", "What did you get done?".
- Highlights become a lightweight log of offline wins.

### 3.5 Privacy & Control

- Users choose which apps are tracked and for which windows.
- Data aggregated as "signal" for friends (did someone stick to the window), not detailed logs.

---

## 4. Architecture Overview

ScreenLess uses a **monorepo** with clearly separated modules:

```text
screenless/
  apps/
    android/          # Native Android app (Kotlin + Jetpack Compose)
  services/
    api/              # Backend API (Node.js / Express + TypeScript)
    jobs/             # Background workers (notifications, streak maintenance)
  web/
    admin-panel/      # Web admin UI for managing communities, abuse, analytics
    showcase/         # High-fidelity product preview used for docs & demos
  docs/
    product-screenless.md
```

### 4.1 Mobile app (Android)

- Kotlin + Jetpack Compose.
- Uses modern Android architecture (MVVM).
- Integrates with backend via REST/JSON.

### 4.2 Backend API service

- Stateless HTTP API for:
  - User accounts & auth.
  - Groups & memberships.
  - Screenless windows.
  - Streak logic.
  - Notifications & messaging.

### 4.3 Background jobs service

- Handles scheduled tasks:
  - Window start/end events.
  - Daily streak checks.
  - Summary notifications.

### 4.4 Web admin panel

- Web app for:
  - Moderation (report handling, abuse detection).
  - Community stats and growth.
  - Feature flags and experiment toggles.

---

## 5. Detailed Requirements

See `docs/ARCHITECTURE.md` and `docs/API.md` for the implemented surface of this spec.

---

## 6. Tech Stack Summary

- **Mobile:** Kotlin + Jetpack Compose, Jetpack (Room, WorkManager, Navigation), FCM for push.
- **Backend:** Node.js + Express + TypeScript, Prisma, SQLite (dev) / PostgreSQL (prod), JWT.
- **Admin Panel:** Next.js + TypeScript + Tailwind.
- **Infra:** Docker Compose for Postgres-backed deploys; SQLite for zero-config local demos.
