import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { publicUser, dateKey } from "../lib/codes.js";
import { applyCompletion, participantKeptWindow } from "../streakEngine.js";

export const windowsRouter = Router();
windowsRouter.use(requireAuth);

const contextEnum = z.enum(["STUDY", "SOCIAL", "SELF_CARE", "DEEP_WORK", "WALK"]);

windowsRouter.get("/", async (req, res) => {
  const mine = await prisma.windowParticipant.findMany({
    where: { userId: req.user!.id },
    include: {
      window: {
        include: {
          group: true,
          participants: { include: { user: true } },
        },
      },
    },
    orderBy: { window: { startsAt: "desc" } },
  });
  res.json({
    windows: mine.map((p) => serializeWindow(p.window)),
  });
});

windowsRouter.post("/", async (req, res) => {
  const parsed = z
    .object({
      groupId: z.string().uuid(),
      title: z.string().min(2).max(64),
      context: contextEnum,
      startsAt: z.string(),
      durationMinutes: z.number().int().min(10).max(240),
      discouragedApps: z.array(z.string()).optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Window needs a title, context, start, and duration." });
    return;
  }
  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: parsed.data.groupId, userId: req.user!.id } },
  });
  if (!member) {
    res.status(403).json({ error: "Join the circle before opening a window." });
    return;
  }
  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(startsAt.getTime() + parsed.data.durationMinutes * 60_000);
  const members = await prisma.groupMember.findMany({ where: { groupId: parsed.data.groupId } });
  const window = await prisma.window.create({
    data: {
      groupId: parsed.data.groupId,
      createdById: req.user!.id,
      title: parsed.data.title,
      context: parsed.data.context,
      startsAt,
      endsAt,
      durationMinutes: parsed.data.durationMinutes,
      discouragedApps: (parsed.data.discouragedApps ?? ["instagram", "tiktok", "youtube"]).join(","),
      status: startsAt.getTime() <= Date.now() ? "LIVE" : "SCHEDULED",
      participants: {
        create: members.map((m) => ({
          userId: m.userId,
          status: "JOINED",
        })),
      },
    },
    include: { group: true, participants: { include: { user: true } } },
  });
  res.status(201).json({ window: serializeWindow(window) });
});

windowsRouter.get("/:id", async (req, res) => {
  const window = await prisma.window.findUnique({
    where: { id: req.params.id },
    include: {
      group: true,
      participants: { include: { user: true } },
      signals: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 40 },
    },
  });
  if (!window) {
    res.status(404).json({ error: "Window not found." });
    return;
  }
  res.json({
    window: serializeWindow(window),
    signals: window.signals.map((s) => ({
      id: s.id,
      kind: s.kind,
      message: s.message,
      appCategory: s.appCategory,
      createdAt: s.createdAt,
      user: publicUser(s.user),
    })),
  });
});

windowsRouter.post("/:id/join", async (req, res) => {
  const window = await prisma.window.findUnique({ where: { id: req.params.id } });
  if (!window || window.status === "ENDED" || window.status === "CANCELLED") {
    res.status(400).json({ error: "This window is closed." });
    return;
  }
  await prisma.windowParticipant.upsert({
    where: { windowId_userId: { windowId: window.id, userId: req.user!.id } },
    update: { leftAt: null, status: "FOCUSED" },
    create: { windowId: window.id, userId: req.user!.id, status: "FOCUSED" },
  });
  res.json({ ok: true });
});

windowsRouter.post("/:id/leave", async (req, res) => {
  await prisma.windowParticipant.updateMany({
    where: { windowId: req.params.id, userId: req.user!.id },
    data: { status: "DROPPED", leftAt: new Date() },
  });
  res.json({ ok: true });
});

windowsRouter.post("/:id/end", async (req, res) => {
  const window = await prisma.window.findUnique({
    where: { id: req.params.id },
    include: { participants: true, group: true },
  });
  if (!window) {
    res.status(404).json({ error: "Window not found." });
    return;
  }
  await prisma.window.update({
    where: { id: window.id },
    data: { status: "ENDED", endsAt: new Date() },
  });

  const day = dateKey(new Date());
  for (const p of window.participants) {
    if (!participantKeptWindow(p)) continue;
    await bumpStreak(p.userId, window.groupId, window.context, day);
  }
  res.json({ ok: true });
});

async function bumpStreak(
  userId: string,
  groupId: string,
  context: string,
  day: string,
) {
  const scopes = [
    { userId, groupId: null as string | null, context: "personal" },
    { userId, groupId, context: "group" },
    { userId, groupId: null, context: context.toLowerCase() },
  ];
  for (const scope of scopes) {
    const existing = await prisma.streak.findFirst({
      where: {
        userId: scope.userId,
        groupId: scope.groupId,
        context: scope.context,
      },
    });
    const next = applyCompletion(
      {
        current: existing?.current ?? 0,
        longest: existing?.longest ?? 0,
        lastDate: existing?.lastDate ?? null,
      },
      day,
    );
    if (existing) {
      await prisma.streak.update({
        where: { id: existing.id },
        data: next,
      });
    } else {
      await prisma.streak.create({
        data: { ...scope, ...next },
      });
    }
  }
}

function serializeWindow(window: {
  id: string;
  title: string;
  context: string;
  status: string;
  startsAt: Date;
  endsAt: Date;
  durationMinutes: number;
  discouragedApps: string;
  group: { id: string; name: string; inviteCode: string };
  participants: Array<{
    status: string;
    focusedPct: number;
    peekCount: number;
    user: { id: string; displayName: string; avatarHue: number };
  }>;
}) {
  return {
    id: window.id,
    title: window.title,
    context: window.context,
    status: window.status,
    startsAt: window.startsAt,
    endsAt: window.endsAt,
    durationMinutes: window.durationMinutes,
    discouragedApps: window.discouragedApps.split(",").filter(Boolean),
    group: window.group,
    participants: window.participants.map((p) => ({
      status: p.status,
      focusedPct: p.focusedPct,
      peekCount: p.peekCount,
      user: publicUser(p.user),
    })),
  };
}
