/**
 * Pure streak engine.
 *
 * A streak is a run of calendar days (local date keys, YYYY-MM-DD) on which
 * the participant completed at least one window. Miss a day, reset.
 *
 * Completing multiple windows on the same day does not increment twice.
 * Future dates are ignored. The engine is timezone-agnostic: callers pass
 * already-localized date keys.
 */

export type DayCompletion = {
  date: string;
  completed: boolean;
};

export type StreakSnapshot = {
  current: number;
  longest: number;
  lastDate: string | null;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertDateKey(date: string): void {
  if (!DATE_RE.test(date)) {
    throw new Error(`Invalid date key "${date}". Expected YYYY-MM-DD.`);
  }
}

export function nextDate(date: string): string {
  assertDateKey(date);
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.toISOString().slice(0, 10);
}

export function prevDate(date: string): string {
  assertDateKey(date);
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

export function uniqueSortedCompletedDays(events: DayCompletion[]): string[] {
  const set = new Set<string>();
  for (const event of events) {
    if (!event.completed) continue;
    assertDateKey(event.date);
    set.add(event.date);
  }
  return [...set].sort();
}

/**
 * Walk completed days newest-first from `asOf` (inclusive).
 * Current streak counts consecutive days ending on asOf, or asOf-1 if
 * today has no completion yet (grace for a day still in progress).
 */
export function computeStreak(
  events: DayCompletion[],
  asOf: string,
): StreakSnapshot {
  assertDateKey(asOf);
  const days = uniqueSortedCompletedDays(events);
  if (days.length === 0) {
    return { current: 0, longest: 0, lastDate: null };
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    if (days[i] === nextDate(days[i - 1])) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  const lastDate = days[days.length - 1];
  const allowGrace = lastDate === prevDate(asOf);
  const anchored = lastDate === asOf || allowGrace;

  if (!anchored) {
    return { current: 0, longest, lastDate };
  }

  let current = 1;
  let cursor = lastDate;
  for (let i = days.length - 2; i >= 0; i -= 1) {
    if (days[i] === prevDate(cursor)) {
      current += 1;
      cursor = days[i];
    } else {
      break;
    }
  }

  return { current, longest: Math.max(longest, current), lastDate };
}

export function applyCompletion(
  snapshot: StreakSnapshot,
  completedOn: string,
): StreakSnapshot {
  assertDateKey(completedOn);
  if (snapshot.lastDate === completedOn) {
    return snapshot;
  }
  if (snapshot.lastDate && nextDate(snapshot.lastDate) === completedOn) {
    const current = snapshot.current + 1;
    return {
      current,
      longest: Math.max(snapshot.longest, current),
      lastDate: completedOn,
    };
  }
  return {
    current: 1,
    longest: Math.max(snapshot.longest, 1),
    lastDate: completedOn,
  };
}

export function participantKeptWindow(input: {
  focusedPct: number;
  status: string;
}): boolean {
  if (input.status === "DROPPED") return false;
  return input.focusedPct >= 70;
}
