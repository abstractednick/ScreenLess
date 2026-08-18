import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { inviteCode, publicUser } from "../lib/codes.js";

export const groupsRouter = Router();
groupsRouter.use(requireAuth);

groupsRouter.get("/", async (req, res) => {
  const memberships = await prisma.groupMember.findMany({
    where: { userId: req.user!.id, group: { isBlocked: false } },
    include: {
      group: {
        include: {
          members: { include: { user: true } },
          _count: { select: { windows: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });
  res.json({
    groups: memberships.map((m) => ({
      ...m.group,
      role: m.role,
      members: m.group.members.map((member) => ({
        role: member.role,
        ...publicUser(member.user),
      })),
    })),
  });
});

groupsRouter.post("/", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(48),
      description: z.string().max(200).optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Give the circle a name." });
    return;
  }
  const group = await prisma.group.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      inviteCode: inviteCode(),
      members: { create: { userId: req.user!.id, role: "OWNER" } },
    },
    include: { members: { include: { user: true } } },
  });
  res.status(201).json({ group });
});

groupsRouter.post("/join", async (req, res) => {
  const parsed = z.object({ inviteCode: z.string().min(4) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invite code required." });
    return;
  }
  const group = await prisma.group.findUnique({
    where: { inviteCode: parsed.data.inviteCode.toUpperCase() },
  });
  if (!group || group.isBlocked) {
    res.status(404).json({ error: "That invite doesn’t open a circle." });
    return;
  }
  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId: req.user!.id } },
    update: {},
    create: { groupId: group.id, userId: req.user!.id, role: "MEMBER" },
  });
  res.json({ group });
});

groupsRouter.get("/:id", async (req, res) => {
  const group = await prisma.group.findUnique({
    where: { id: req.params.id },
    include: {
      members: { include: { user: true } },
      windows: { orderBy: { startsAt: "desc" }, take: 12 },
      streaks: true,
    },
  });
  if (!group) {
    res.status(404).json({ error: "Circle not found." });
    return;
  }
  res.json({
    group: {
      ...group,
      members: group.members.map((m) => ({ role: m.role, ...publicUser(m.user) })),
    },
  });
});
