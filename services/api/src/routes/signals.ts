import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { publicUser } from "../lib/codes.js";

export const signalsRouter = Router();
signalsRouter.use(requireAuth);

const FRIENDLY: Record<string, (name: string, app: string) => string> = {
  peek: (name, app) => `${name} peeked at ${app}`,
  return: (name) => `${name} is back in the window`,
  drop: (name) => `${name} stepped out`,
  focus: (name) => `${name} settled in`,
};

signalsRouter.post("/", async (req, res) => {
  const parsed = z
    .object({
      windowId: z.string().uuid(),
      kind: z.enum(["peek", "return", "drop", "focus"]),
      appCategory: z.string().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Signal needs a window and kind." });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ error: "Account missing." });
    return;
  }

  const label = parsed.data.appCategory ?? "socials";
  const message = FRIENDLY[parsed.data.kind](user.displayName, label);

  const signal = await prisma.signal.create({
    data: {
      windowId: parsed.data.windowId,
      userId: user.id,
      kind: parsed.data.kind,
      appCategory: parsed.data.appCategory,
      message,
    },
  });

  const statusMap = {
    peek: "PEEKED",
    drop: "DROPPED",
    return: "FOCUSED",
    focus: "FOCUSED",
  } as const;

  await prisma.windowParticipant.updateMany({
    where: { windowId: parsed.data.windowId, userId: user.id },
    data: {
      status: statusMap[parsed.data.kind],
      peekCount: parsed.data.kind === "peek" ? { increment: 1 } : undefined,
      focusedPct:
        parsed.data.kind === "peek"
          ? { decrement: 8 }
          : parsed.data.kind === "drop"
            ? 0
            : undefined,
    },
  });

  res.status(201).json({
    signal: { ...signal, user: publicUser(user) },
  });
});

signalsRouter.get("/window/:windowId", async (req, res) => {
  const signals = await prisma.signal.findMany({
    where: { windowId: req.params.windowId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({
    signals: signals.map((s) => ({
      id: s.id,
      kind: s.kind,
      message: s.message,
      appCategory: s.appCategory,
      createdAt: s.createdAt,
      user: publicUser(s.user),
    })),
  });
});
