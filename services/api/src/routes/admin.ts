import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/overview", async (_req, res) => {
  const [users, groups, windows, liveWindows, reports, reflections] = await Promise.all([
    prisma.user.count(),
    prisma.group.count(),
    prisma.window.count(),
    prisma.window.count({ where: { status: "LIVE" } }),
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.reflection.count(),
  ]);

  const contextCounts = await prisma.window.groupBy({
    by: ["context"],
    _count: { context: true },
  });

  const recentWindows = await prisma.window.findMany({
    orderBy: { startsAt: "desc" },
    take: 8,
    include: { group: true, _count: { select: { participants: true } } },
  });

  const topStreaks = await prisma.streak.findMany({
    where: { context: "personal" },
    orderBy: { current: "desc" },
    take: 6,
    include: { user: true },
  });

  res.json({
    stats: { users, groups, windows, liveWindows, openReports: reports, reflections },
    contextCounts: contextCounts.map((c) => ({ context: c.context, count: c._count.context })),
    recentWindows,
    topStreaks: topStreaks.map((s) => ({
      current: s.current,
      longest: s.longest,
      displayName: s.user?.displayName,
    })),
  });
});

adminRouter.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      displayName: true,
      isBlocked: true,
      createdAt: true,
      _count: { select: { memberships: true, reflections: true } },
    },
  });
  res.json({ users });
});

adminRouter.post("/users/:id/block", async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isBlocked: true },
  });
  await prisma.auditLog.create({
    data: { actor: req.user!.email, action: "block_user", target: user.id },
  });
  res.json({ user });
});

adminRouter.get("/groups", async (_req, res) => {
  const groups = await prisma.group.findMany({
    include: { _count: { select: { members: true, windows: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ groups });
});

adminRouter.get("/reports", async (_req, res) => {
  const reports = await prisma.report.findMany({
    include: { reporter: true, reportedUser: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ reports });
});

adminRouter.patch("/reports/:id", async (req, res) => {
  const parsed = z.object({ status: z.enum(["OPEN", "REVIEWED", "ACTIONED", "DISMISSED"]) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status." });
    return;
  }
  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status, reviewedAt: new Date() },
  });
  res.json({ report });
});

adminRouter.get("/flags", async (_req, res) => {
  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  res.json({ flags });
});

adminRouter.patch("/flags/:key", async (req, res) => {
  const parsed = z.object({ enabled: z.boolean() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "enabled boolean required." });
    return;
  }
  const flag = await prisma.featureFlag.update({
    where: { key: req.params.key },
    data: { enabled: parsed.data.enabled },
  });
  res.json({ flag });
});

adminRouter.get("/prompts", async (_req, res) => {
  const prompts = await prisma.reflectionPrompt.findMany();
  const templates = await prisma.windowTemplate.findMany();
  res.json({ prompts, templates });
});

adminRouter.post("/prompts", async (req, res) => {
  const parsed = z.object({ text: z.string().min(4), context: z.string().default("any") }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Prompt text required." });
    return;
  }
  const prompt = await prisma.reflectionPrompt.create({ data: parsed.data });
  res.status(201).json({ prompt });
});
