import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

export const streaksRouter = Router();
streaksRouter.use(requireAuth);

streaksRouter.get("/", async (req, res) => {
  const streaks = await prisma.streak.findMany({
    where: { userId: req.user!.id },
    include: { group: true },
  });
  const badges = await prisma.userBadge.findMany({
    where: { userId: req.user!.id },
    include: { badge: true },
  });
  res.json({
    streaks,
    badges: badges.map((b) => b.badge),
  });
});

export const reflectionsRouter = Router();
reflectionsRouter.use(requireAuth);

reflectionsRouter.get("/prompts", async (_req, res) => {
  const prompts = await prisma.reflectionPrompt.findMany({ where: { active: true } });
  res.json({ prompts });
});

reflectionsRouter.get("/", async (req, res) => {
  const reflections = await prisma.reflection.findMany({
    where: { userId: req.user!.id },
    include: { window: { include: { group: true } } },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  res.json({ reflections });
});

reflectionsRouter.post("/", async (req, res) => {
  const parsed = z
    .object({
      windowId: z.string().uuid(),
      prompt: z.string().min(4),
      answer: z.string().min(1).max(400),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A prompt and a short answer, that’s all." });
    return;
  }
  const reflection = await prisma.reflection.create({
    data: {
      windowId: parsed.data.windowId,
      userId: req.user!.id,
      prompt: parsed.data.prompt,
      answer: parsed.data.answer,
    },
  });
  res.status(201).json({ reflection });
});

export const reportsRouter = Router();
reportsRouter.use(requireAuth);

reportsRouter.post("/", async (req, res) => {
  const parsed = z
    .object({
      reportedUserId: z.string().uuid().optional(),
      groupId: z.string().uuid().optional(),
      reason: z.string().min(4).max(80),
      details: z.string().max(500).optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Tell us what happened." });
    return;
  }
  const report = await prisma.report.create({
    data: {
      reporterId: req.user!.id,
      ...parsed.data,
    },
  });
  res.status(201).json({ report });
});

export const privacyRouter = Router();
privacyRouter.use(requireAuth);

privacyRouter.put("/tracking", async (req, res) => {
  const parsed = z
    .object({
      prefs: z.array(
        z.object({
          category: z.string(),
          enabled: z.boolean(),
        }),
      ),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid tracking prefs." });
    return;
  }
  for (const pref of parsed.data.prefs) {
    await prisma.trackingPreference.upsert({
      where: { userId_category: { userId: req.user!.id, category: pref.category } },
      update: { enabled: pref.enabled },
      create: { userId: req.user!.id, category: pref.category, enabled: pref.enabled },
    });
  }
  const prefs = await prisma.trackingPreference.findMany({ where: { userId: req.user!.id } });
  res.json({ prefs });
});

privacyRouter.delete("/me", async (req, res) => {
  await prisma.user.delete({ where: { id: req.user!.id } });
  res.json({ ok: true });
});
