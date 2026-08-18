# Local setup

You need **Node.js 20+**. Android Studio is optional unless you are running the APK.

## 1. API (required for admin)

```bash
cd services/api
cp .env.example .env   # already present in this repo as services/api/.env for the demo
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

API: [http://localhost:4000/health](http://localhost:4000/health)

Seeded login:

- Admin: `admin@screenless.app` / `screenless`
- Maya: `maya@screenless.app` / `screenless`

## 2. Jobs worker

```bash
cd services/jobs
npm install
npm run dev
```

## 3. Admin panel

```bash
cd web/admin-panel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in as the admin identity.

## 4. Product showcase (phone UI for docs)

```bash
cd web/showcase
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173) — landing  
`#/gallery` — every screen  
`#/live` — live room, isolated for screenshots

## 5. Android

Open `apps/android` in Android Studio (Koala / Ladybug+). Sync Gradle, run on an API 26+ emulator.

The app points at `http://10.0.2.2:4000/v1/` (the emulator’s alias for host localhost). For a physical device, change `API_BASE_URL` in `app/build.gradle.kts` to your machine’s LAN IP.

Usage access: Settings → Apps → Special app access → Usage access → ScreenLess. The mapper no-ops if permission is missing; the live room still works on honor + manual signals.

## Tests

```bash
cd services/api
npm test
```

Streak engine tests are the ones to read in an interview. They encode the product: peeking is not failure.

## Docker

`docker-compose.yml` wires Postgres + API + jobs + admin. Docker is optional; SQLite is the documented default so a recruiter can clone and run without a daemon.

```bash
docker compose up --build
```

Set `DATABASE_URL` to the Postgres URL and change `prisma/schema.prisma` `provider` to `postgresql` before using the compose database. The SQLite schema is the source of truth for this portfolio build.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Admin says “Unknown email” | Seed did not run. `npm run seed` in `services/api` |
| CORS error from :3000 | API `ADMIN_ORIGIN` should include `http://localhost:3000` |
| Prisma “database is not empty” | Delete `services/api/prisma/dev.db` and `db push` again |
| Android cannot reach API | Emulator needs `10.0.2.2`, not `localhost` |
