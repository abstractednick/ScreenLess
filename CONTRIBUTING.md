# Contributing

ScreenLess is a portfolio-grade monorepo. Changes should read like product decisions, not drive-by refactors.

## Before you write code

1. Read `docs/product-screenless.md` — the original brief.
2. Read `docs/ARCHITECTURE.md` and `docs/PRIVACY.md` — the constraints.
3. If the change touches streak math, add a Vitest case. The engine is the constitution.

## Layout

| Path | Own this if… |
|---|---|
| `apps/android` | Compose screens, usage mapping, navigation |
| `services/api` | HTTP, Prisma, streak engine |
| `services/jobs` | Window lifecycle, reminder contract |
| `web/admin-panel` | Operator UX |
| `web/showcase` | Docs screenshots, recruiter walkthrough |
| `docs/` | Anything a stranger must understand without Slack |

## Rules of tone

- No public feed. Do not add one “just for growth.”
- No raw package names in API payloads.
- Peeking is not failure. Do not invert `participantKeptWindow` to punish peeks.
- Copy is part of the product. If you add an endpoint error, write it in ScreenLess voice.

## Tests

```bash
npm test --prefix services/api
```

Keep streak tests timezone-agnostic: pass `YYYY-MM-DD` keys, never `Date.now()` in assertions.

## Commits

Imperative, why-first:

`Keep peek signals from resetting personal streaks`

not

`Update streakEngine.ts`

## What not to “helpfully” add

- Infinite scroll social
- Read receipts on reflections
- Streak freezes sold as a premium perk
- Dark patterns around usage permission
