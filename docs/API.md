# HTTP API

Base URL (local): `http://localhost:4000`

All timestamps are ISO-8601 UTC. All authenticated routes expect:

```http
Authorization: Bearer <jwt>
```

Errors are JSON: `{ "error": "human copy" }`. Copy is written for the product, not for stack traces.

---

## Health

```http
GET /health
```

```json
{ "ok": true, "service": "screenless-api", "tagline": "Phone down, friendship up." }
```

---

## Auth

### Register

```http
POST /v1/auth/register
Content-Type: application/json

{ "email": "maya@screenless.app", "password": "screenless", "displayName": "Maya" }
```

Creates default tracking preferences: social and video **on**, games and messaging **off**.

### Login

```http
POST /v1/auth/login
```

Response:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "…",
    "displayName": "Maya",
    "avatarHue": 28,
    "email": "maya@screenless.app"
  }
}
```

### Me

```http
GET  /v1/auth/me
PATCH /v1/auth/me
```

Patchable: `displayName`, `bio`, `timezone`, `preferredLanguage`.

---

## Groups (circles)

```http
GET  /v1/groups
POST /v1/groups          { "name", "description?" }
POST /v1/groups/join     { "inviteCode" }
GET  /v1/groups/:id
```

Invite codes are 6 characters from a no-ambiguity alphabet (`OWL42K`). There is no list-all-groups endpoint. That omission is the product.

---

## Windows

```http
GET  /v1/windows
POST /v1/windows
GET  /v1/windows/:id
POST /v1/windows/:id/join
POST /v1/windows/:id/leave
POST /v1/windows/:id/end
```

Create body:

```json
{
  "groupId": "<uuid>",
  "title": "Library lamps",
  "context": "STUDY",
  "startsAt": "2026-08-18T16:00:00.000Z",
  "durationMinutes": 45,
  "discouragedApps": ["instagram", "tiktok", "youtube"]
}
```

`context` ∈ `STUDY | SOCIAL | SELF_CARE | DEEP_WORK | WALK`

`status` ∈ `SCHEDULED | LIVE | ENDED | CANCELLED`

Creating a window auto-enrolls current group members as `JOINED`. Ending a window runs the streak engine for every participant who **kept** the window (`focusedPct >= 70` and not `DROPPED`).

---

## Signals

```http
POST /v1/signals
GET  /v1/signals/window/:windowId
```

Create body:

```json
{ "windowId": "<uuid>", "kind": "peek", "appCategory": "socials" }
```

`kind` ∈ `peek | return | drop | focus`

The server writes friendly copy. Clients must not send the final sentence — that keeps tone consistent:

| kind | copy |
|---|---|
| peek | `{name} peeked at {category}` |
| return | `{name} is back in the window` |
| drop | `{name} stepped out` |
| focus | `{name} settled in` |

A peek decrements `focusedPct` by 8 and increments `peekCount`. It does **not** fail the window.

---

## Streaks & badges

```http
GET /v1/streaks
```

Returns personal, contextual, and group-scoped streak rows plus unlocked badges. Computation rules: `docs/ARCHITECTURE.md` and `services/api/src/streakEngine.ts`.

---

## Reflections

```http
GET  /v1/reflections/prompts
GET  /v1/reflections
POST /v1/reflections   { "windowId", "prompt", "answer" }
```

Answers are capped at 400 characters. This is a postcard, not a diary product.

---

## Privacy

```http
PUT    /v1/privacy/tracking   { "prefs": [{ "category", "enabled" }] }
DELETE /v1/privacy/me
```

`DELETE /me` removes the user and cascades memberships, signals, and reflections.

---

## Reports

```http
POST /v1/reports  { "reportedUserId?", "groupId?", "reason", "details?" }
```

---

## Admin (operator JWT)

Seeded operator: `admin@screenless.app` / `screenless`

```http
GET   /v1/admin/overview
GET   /v1/admin/users
POST  /v1/admin/users/:id/block
GET   /v1/admin/groups
GET   /v1/admin/reports
PATCH /v1/admin/reports/:id     { "status": "REVIEWED" | "ACTIONED" | "DISMISSED" }
GET   /v1/admin/flags
PATCH /v1/admin/flags/:key      { "enabled": true }
GET   /v1/admin/prompts
POST  /v1/admin/prompts         { "text", "context" }
```

`overview` is the pulse card: counts, recent windows, top personal streaks, window-context mix.

---

## Demo identities (after `npm run seed`)

| Email | Password | Role |
|---|---|---|
| `admin@screenless.app` | `screenless` | operator |
| `maya@screenless.app` | `screenless` | Night Owls owner |
| `karan@screenless.app` | `screenless` | member |
| `jules@screenless.app` | `screenless` | member |
| `nico@screenless.app` | `screenless` | Sunday Walks owner |

Invite codes: **OWL42K** (Night Owls), **WALK9M** (Sunday Walks).
