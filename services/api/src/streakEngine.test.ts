import { describe, expect, it } from "vitest";
import {
  applyCompletion,
  computeStreak,
  nextDate,
  participantKeptWindow,
  prevDate,
} from "./streakEngine.js";

describe("date helpers", () => {
  it("walks across month boundaries", () => {
    expect(nextDate("2026-01-31")).toBe("2026-02-01");
    expect(prevDate("2026-03-01")).toBe("2026-02-28");
  });
});

describe("computeStreak", () => {
  it("returns zeros with no completions", () => {
    expect(computeStreak([], "2026-08-18")).toEqual({
      current: 0,
      longest: 0,
      lastDate: null,
    });
  });

  it("counts consecutive days ending today", () => {
    const events = [
      { date: "2026-08-16", completed: true },
      { date: "2026-08-17", completed: true },
      { date: "2026-08-18", completed: true },
    ];
    expect(computeStreak(events, "2026-08-18")).toEqual({
      current: 3,
      longest: 3,
      lastDate: "2026-08-18",
    });
  });

  it("gives a one-day grace if today is unfinished", () => {
    const events = [
      { date: "2026-08-16", completed: true },
      { date: "2026-08-17", completed: true },
    ];
    expect(computeStreak(events, "2026-08-18").current).toBe(2);
  });

  it("resets current when a day was missed", () => {
    const events = [
      { date: "2026-08-10", completed: true },
      { date: "2026-08-11", completed: true },
      { date: "2026-08-12", completed: true },
      { date: "2026-08-18", completed: true },
    ];
    const snap = computeStreak(events, "2026-08-18");
    expect(snap.current).toBe(1);
    expect(snap.longest).toBe(3);
  });

  it("dedupes multiple windows on the same day", () => {
    const events = [
      { date: "2026-08-18", completed: true },
      { date: "2026-08-18", completed: true },
    ];
    expect(computeStreak(events, "2026-08-18").current).toBe(1);
  });
});

describe("applyCompletion", () => {
  it("starts a streak from empty", () => {
    expect(applyCompletion({ current: 0, longest: 0, lastDate: null }, "2026-08-18")).toEqual({
      current: 1,
      longest: 1,
      lastDate: "2026-08-18",
    });
  });

  it("extends yesterday", () => {
    const next = applyCompletion(
      { current: 4, longest: 6, lastDate: "2026-08-17" },
      "2026-08-18",
    );
    expect(next.current).toBe(5);
    expect(next.longest).toBe(6);
  });
});

describe("participantKeptWindow", () => {
  it("treats dropped sessions as incomplete", () => {
    expect(participantKeptWindow({ focusedPct: 99, status: "DROPPED" })).toBe(false);
  });

  it("requires 70% focused time", () => {
    expect(participantKeptWindow({ focusedPct: 69, status: "PEEKED" })).toBe(false);
    expect(participantKeptWindow({ focusedPct: 70, status: "PEEKED" })).toBe(true);
  });
});
