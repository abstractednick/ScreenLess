# Architecture

ScreenLess is a **monorepo** that separates the product into four deployable pieces and one documentation plane. The split is intentional: a killed phone must not freeze a live room, and an admin action must not live inside the consumer APK.

```text
┌─────────────┐     REST / JSON + JWT      ┌──────────────────┐
│  Android    │  ─────────────────────────►│  services/api    │
│  Compose    │                            │  Express + Prisma│
│  UsageStats │  summarized signals only   └────────┬─────────┘
└─────────────┘                                     │
                                                    │ same DB
web/showcase (docs + demo)                          │
web/admin-panel  ── JWT admin role ─────────────────┤
services/jobs    ── window lifecycle + FCM fan-out ─┘
```

## Why this shape

| Constraint | Decision |
|---|---|
| Friends see warmth, not surveillance | The Android client collapses `UsageStats` into `{peek, focus, drop}` **on device**. The API stores a message, not a package timeline. |
| Window time is social, not personal | Window start/end is owned by `services/jobs`, not by the last phone still in the room. |
| Private circles only | No public feed, no discovery ranking. Invite codes are the only join path. |
| Recruiter-runnable | SQLite by default. Postgres is a compose swap, not a rewrite. |

## Modules

### `apps/android`

Kotlin, Jetpack Compose, MVVM-ready navigation, Hilt, Retrofit, Room-ready Gradle graph, WorkManager on the classpath for future FCM workers.

Package: `com.screenless.app`

Important types:

- `domain/model` — `ScreenlessWindow`, `Presence`, `SoftSignal`, `Streak`
- `data/usage/UsageSignalMapper` — the privacy boundary
- `ui/screens/*` — onboarding, home, live room, groups, create, streaks, reflection, settings

The live room is a **presence surface**, not a chat app. The signal stream is append-only and copy-edited on the server (`Karan peeked at socials`).

### `services/api`

Node.js 22, Express, TypeScript, Prisma, Zod, JWT.

Route map lives in `docs/API.md`. Domain logic that must stay honest — streak math — is a **pure module** (`src/streakEngine.ts`) with Vitest coverage. HTTP handlers call it; they do not reimplement it.

Auth model:

- Email + password (bcrypt)
- JWT in `Authorization: Bearer`
- `admin@screenless.app` is the seeded operator identity

### `services/jobs`

A long-running worker that documents the production contract:

1. `promoteWindows` — `SCHEDULED → LIVE` when `startsAt` passes
2. `closeWindows` — `LIVE → ENDED` when `endsAt` passes, then a streak pass
3. `remindSoon` — “Window starting soon”
4. `reflectNudge` — “Window ended, reflect now”

The worker is deliberately **not** inside the APK. A phone in airplane mode should not be the source of truth for whether the circle’s window is still open.

### `web/admin-panel`

Operator console: pulse stats, people, circles, reports, feature flags, reflection prompts. Forest-night visual language so it does not look like a generic SaaS dashboard.

### `web/showcase`

High-fidelity product preview used for documentation screenshots and for walking a recruiter through the Android UI without an emulator.

## Data model (compressed)

```
User ──< GroupMember >── Group
                │
                └── Window ──< WindowParticipant
                         ├── Signal          (kind + friendly copy)
                         └── Reflection      (1–2 prompts, short answers)
User ── Streak (personal | group | context)
User ── UserBadge ── Badge
User ── TrackingPreference (category toggles)
```

`focusedPct` and `peekCount` on a participant are **aggregates**. They exist so the live room can show “81%” without exposing which reel they opened.

## Privacy boundary

```
UsageEvents (on device)
        │  map packages → category
        │  drop timestamps
        ▼
kind: peek | focus | drop
        │  POST /v1/signals
        ▼
Signal.message = "Karan peeked at socials"
```

Friends never receive:

- package names
- dwell time per app
- screen-on histograms

See `docs/PRIVACY.md`.

## Streak engine

A streak is a run of **calendar days** (timezone-localized `YYYY-MM-DD`) with at least one kept window. Multiple windows on the same day do not double-count. Missing a day resets `current` and preserves `longest`.

A window is “kept” when the participant did not `DROPPED` and `focusedPct >= 70`. Peeking is allowed. Leaving is the failure mode.

This is product, not a trick: ScreenLess is anti-shame by construction.

## Feature flags

Flags are rows, not deploys.

| Key | Intent |
|---|---|
| `soft_peek_copy_v2` | Gentler live-room copy |
| `garden_theme` | Cosmetic unlocks |
| `group_chat_reactions` | Held until the tone is kind |
| `walk_templates` | Curated walk windows |

## What is intentionally unfinished

- FCM credentials and Play Console listing
- OAuth social login (the interface is ready; email is the demo path)
- Accessibility-service fallback on OEMs that starve `UsageStats`
- Redis-backed jobs (the worker polls so `docker compose` stays small)

Those are labeled in code comments rather than faked.
