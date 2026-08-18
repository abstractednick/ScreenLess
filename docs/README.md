# Documentation index

Start with the [root README](../README.md) if you are a recruiter. This folder is the long form.

| File | Audience |
|---|---|
| [product-screenless.md](product-screenless.md) | Product / PM — original brief |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Engineers — modules and constraints |
| [API.md](API.md) | Mobile + web clients |
| [PRIVACY.md](PRIVACY.md) | Anyone asking “do friends see my Instagram?” |
| [DESIGN.md](DESIGN.md) | Anyone touching color or copy |
| [SETUP.md](SETUP.md) | First clone |
| [screenshots/](screenshots/) | Assets used in the README |

Regenerate screenshots (optional, needs local Chrome + `puppeteer-core`):

```bash
# API on :4000, admin on :3000, showcase on :5173
node scripts/capture-screenshots.mjs
```
