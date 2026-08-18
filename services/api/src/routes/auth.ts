import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { publicUser } from "../lib/codes.js";

export const authRouter = Router();

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(32).optional(),
});

authRouter.post("/register", async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Need a valid email, password, and name." });
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) {
    res.status(409).json({ error: "That email is already in a circle." });
    return;
  }
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      displayName: parsed.data.displayName ?? parsed.data.email.split("@")[0],
      avatarHue: Math.floor(Math.random() * 360),
      trackingPrefs: {
        create: [
          { category: "social", enabled: true },
          { category: "video", enabled: true },
          { category: "games", enabled: false },
          { category: "messaging", enabled: false },
        ],
      },
    },
  });
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.email === "admin@screenless.app" ? "admin" : "user",
  });
  res.status(201).json({ token, user: publicUser(user) });
});

authRouter.post("/login", async (req, res) => {
  const parsed = credentials.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email and password required." });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || user.isBlocked) {
    res.status(401).json({ error: "Unknown email or password." });
    return;
  }
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Unknown email or password." });
    return;
  }
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.email === "admin@screenless.app" ? "admin" : "user",
  });
  res.json({ token, user: publicUser(user) });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { trackingPrefs: true, badges: { include: { badge: true } } },
  });
  if (!user) {
    res.status(404).json({ error: "Account missing." });
    return;
  }
  res.json({
    user: publicUser(user),
    trackingPrefs: user.trackingPrefs,
    badges: user.badges.map((b) => ({
      slug: b.badge.slug,
      name: b.badge.name,
      description: b.badge.description,
      unlockedAt: b.unlockedAt,
    })),
  });
});

authRouter.patch("/me", requireAuth, async (req, res) => {
  const parsed = z
    .object({
      displayName: z.string().min(2).max(32).optional(),
      bio: z.string().max(160).optional(),
      timezone: z.string().optional(),
      preferredLanguage: z.string().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid profile fields." });
    return;
  }
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: parsed.data,
  });
  res.json({ user: publicUser(user) });
});
