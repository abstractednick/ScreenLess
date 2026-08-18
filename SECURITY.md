# Security

If you find a vulnerability in ScreenLess, email the maintainer rather than opening a public issue with a proof of concept.

Please include:

- The module (`apps/android`, `services/api`, `web/admin-panel`)
- Impact (auth bypass, data leak across circles, admin escalation)
- A minimal reproduction

Do not submit:

- Usage-access bypasses that require OEM-specific exploits
- Social-engineering playbooks against seeded demo users

Demo credentials in this repository (`admin@screenless.app` / `screenless`) are **local-only**. Rotate `JWT_SECRET` before any shared deploy.
