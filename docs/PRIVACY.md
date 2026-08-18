# Privacy & consent

ScreenLess monitors **only what you opt into, only while a window is live**, and it **never shows friends a log**.

This is not a slogan on a settings page. It is encoded in three places:

1. Android `UsageSignalMapper` — collapses `UsageStats` / `UsageEvents` into `{focus, peek, drop}`
2. API `POST /v1/signals` — stores a sentence, not a package name timeline
3. `DELETE /v1/privacy/me` — hard delete, cascading

## What we collect

| Data | Where it lives | Who sees it |
|---|---|---|
| Email, display name, avatar hue | API | You, circle members (name + hue only) |
| Group membership | API | Circle members |
| Window metadata (title, times, discouraged categories) | API | Circle members |
| Participant aggregates (`focusedPct`, `peekCount`, status) | API | Circle members, as presence — not as a scoreboard of shame |
| Signal kind + friendly copy | API | Circle members in that window |
| Reflection answers | API | Only you in v1 (group sharing is a flag, default off) |
| Tracking category toggles | API | Only you |
| Raw `UsageEvents` | **Device only, never uploaded** | Nobody |

## What we refuse to store

- Per-app dwell time
- Notification contents
- Keystrokes, clipboard, or screenshots
- Location, even for walk windows
- A public activity feed

Walk windows are a **social contract**, not a GPS product.

## Consent surfaces

The Android client asks before touching `PACKAGE_USAGE_STATS`. The copy is in `strings.xml`:

> ScreenLess only notices the apps you mark as distracting, and only while a window is live. Friends see a warm signal — never a minute-by-minute log.

Default category toggles:

- Social: on
- Video: on
- Games: off
- Messaging: off

Messaging is off because a peek at WhatsApp during a study window is often coordination, not doomscrolling. Users can flip it.

## Retention

Demo database is local SQLite. In a production deploy:

- Signals older than 30 days after window end are eligible for deletion
- Reflections persist until the user deletes them or the account
- Audit logs for admin block actions persist for abuse review

## Account deletion

`DELETE /v1/privacy/me` removes the user row. Prisma `onDelete: Cascade` clears memberships, participations, signals, streaks, badges, notifications, and tracking prefs. Reports they filed remain, with the reporter pointer nullified in a fuller migration — the seed schema keeps the reporter for operator review of in-flight cases.

## Threat model (honest)

ScreenLess is not an E2E-encrypted messenger. The API can see signal copy. The defense is **minimization**: there is no interesting dossier to subpoena if we never stored the reel-by-reel history.

OEM quirks (Xiaomi, Oppo, etc. killing usage access) are handled by **failing closed**: no stats, no signal, window still runs on honor. We do not silently enable Accessibility just to win a metric.

## Admin access

Operators see aggregates and reports, not live UsageStats. Blocking a user is an explicit audit-logged action (`AuditLog`).
