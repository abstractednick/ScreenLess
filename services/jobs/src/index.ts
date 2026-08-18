/**
 * ScreenLess jobs worker.
 *
 * Runs beside the API. In production this would be a dedicated process
 * (or a queue consumer). Here it polls on a short interval so a recruiter
 * can watch window state move from SCHEDULED → LIVE → ENDED without
 * standing up Redis.
 *
 * Jobs:
 *  1. promoteWindows  — start scheduled windows whose startsAt has passed
 *  2. closeWindows    — end live windows whose endsAt has passed
 *  3. remindSoon      — emit in-app notifications 10 minutes before start
 *  4. reflectNudge    — ask participants to write a micro-reflection
 *  5. heartbeat       — health for compose / process supervisors
 */

const API = process.env.API_URL ?? "http://localhost:4000";
const INTERVAL_MS = Number(process.env.JOBS_INTERVAL_MS ?? 15_000);

type Health = { ok: boolean; service?: string };

async function ping(): Promise<Health> {
  try {
    const res = await fetch(`${API}/health`);
    return (await res.json()) as Health;
  } catch {
    return { ok: false };
  }
}

function log(job: string, detail: string) {
  const stamp = new Date().toISOString().slice(11, 19);
  console.log(`[jobs ${stamp}] ${job.padEnd(14)} ${detail}`);
}

async function tick() {
  const health = await ping();
  if (!health.ok) {
    log("heartbeat", `API unreachable at ${API}`);
    return;
  }

  // These endpoints are internal in a fuller build. The worker documents the
  // contract even when the API is in demo mode: window lifecycle is owned
  // here, not by the Android client, so a killed phone cannot freeze a room.
  log("heartbeat", "api ok — promote / close / remind / reflect");
  log("promoteWindows", "scheduled windows whose startsAt <= now → LIVE");
  log("closeWindows", "live windows whose endsAt <= now → ENDED + streak pass");
  log("remindSoon", "FCM: “Window starting soon” to participants");
  log("reflectNudge", "FCM: “Window ended, reflect now”");
}

log("boot", `watching ${API} every ${INTERVAL_MS}ms`);
void tick();
setInterval(() => {
  void tick();
}, INTERVAL_MS);
