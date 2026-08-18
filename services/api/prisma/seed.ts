import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient, Badge } from "@prisma/client";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

const prisma = new PrismaClient();

async function main() {
  await prisma.signal.deleteMany();
  await prisma.reflection.deleteMany();
  await prisma.windowParticipant.deleteMany();
  await prisma.window.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.trackingPreference.deleteMany();
  await prisma.report.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.featureFlag.deleteMany();
  await prisma.reflectionPrompt.deleteMany();
  await prisma.windowTemplate.deleteMany();

  const passwordHash = await bcrypt.hash("screenless", 10);

  const [admin, maya, karan, jules, nico] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@screenless.app",
        passwordHash,
        displayName: "ScreenLess Admin",
        avatarHue: 140,
        bio: "Keeps the garden tended.",
      },
    }),
    prisma.user.create({
      data: {
        email: "maya@screenless.app",
        passwordHash,
        displayName: "Maya",
        avatarHue: 28,
        bio: "Night library, analog notes.",
      },
    }),
    prisma.user.create({
      data: {
        email: "karan@screenless.app",
        passwordHash,
        displayName: "Karan",
        avatarHue: 168,
        bio: "Walks without a playlist.",
      },
    }),
    prisma.user.create({
      data: {
        email: "jules@screenless.app",
        passwordHash,
        displayName: "Jules",
        avatarHue: 42,
        bio: "Studio hours, phone in the drawer.",
      },
    }),
    prisma.user.create({
      data: {
        email: "nico@screenless.app",
        passwordHash,
        displayName: "Nico",
        avatarHue: 210,
        bio: "Self-care Sundays.",
      },
    }),
  ]);

  const nightOwls = await prisma.group.create({
    data: {
      name: "Night Owls",
      description: "Late study windows. Lamps on, phones down.",
      inviteCode: "OWL42K",
      members: {
        create: [
          { userId: maya.id, role: "OWNER" },
          { userId: karan.id, role: "MEMBER" },
          { userId: jules.id, role: "MEMBER" },
        ],
      },
    },
  });

  const sundayWalks = await prisma.group.create({
    data: {
      name: "Sunday Walks",
      description: "No earbuds. Notice the street.",
      inviteCode: "WALK9M",
      members: {
        create: [
          { userId: nico.id, role: "OWNER" },
          { userId: maya.id, role: "MEMBER" },
          { userId: karan.id, role: "MEMBER" },
        ],
      },
    },
  });

  const now = Date.now();
  const hour = 60 * 60 * 1000;

  const live = await prisma.window.create({
    data: {
      groupId: nightOwls.id,
      createdById: maya.id,
      title: "Library lamps",
      context: "STUDY",
      status: "LIVE",
      startsAt: new Date(now - 18 * 60 * 1000),
      endsAt: new Date(now + 27 * 60 * 1000),
      durationMinutes: 45,
      discouragedApps: "instagram,tiktok,youtube,x",
      participants: {
        create: [
          { userId: maya.id, status: "FOCUSED", focusedPct: 96, peekCount: 0 },
          { userId: karan.id, status: "PEEKED", focusedPct: 81, peekCount: 1 },
          { userId: jules.id, status: "FOCUSED", focusedPct: 100, peekCount: 0 },
        ],
      },
    },
  });

  await prisma.signal.createMany({
    data: [
      {
        windowId: live.id,
        userId: maya.id,
        kind: "focus",
        message: "Maya settled in",
        createdAt: new Date(now - 17 * 60 * 1000),
      },
      {
        windowId: live.id,
        userId: karan.id,
        kind: "peek",
        appCategory: "socials",
        message: "Karan peeked at socials",
        createdAt: new Date(now - 4 * 60 * 1000),
      },
      {
        windowId: live.id,
        userId: karan.id,
        kind: "return",
        message: "Karan is back in the window",
        createdAt: new Date(now - 3 * 60 * 1000),
      },
    ],
  });

  const ended = await prisma.window.create({
    data: {
      groupId: sundayWalks.id,
      createdById: nico.id,
      title: "Canal path, no earbuds",
      context: "WALK",
      status: "ENDED",
      startsAt: new Date(now - 5 * hour),
      endsAt: new Date(now - 3 * hour),
      durationMinutes: 90,
      participants: {
        create: [
          { userId: nico.id, status: "FOCUSED", focusedPct: 100, peekCount: 0 },
          { userId: maya.id, status: "FOCUSED", focusedPct: 92, peekCount: 0 },
          { userId: karan.id, status: "FOCUSED", focusedPct: 88, peekCount: 1 },
        ],
      },
    },
  });

  await prisma.window.create({
    data: {
      groupId: nightOwls.id,
      createdById: jules.id,
      title: "Studio quiet hour",
      context: "DEEP_WORK",
      status: "SCHEDULED",
      startsAt: new Date(now + 3 * hour),
      endsAt: new Date(now + 4 * hour),
      durationMinutes: 60,
      participants: {
        create: [
          { userId: jules.id, status: "JOINED" },
          { userId: maya.id, status: "JOINED" },
        ],
      },
    },
  });

  await prisma.reflection.createMany({
    data: [
      {
        windowId: ended.id,
        userId: maya.id,
        prompt: "What did the street give you back?",
        answer: "The light on the canal. I forgot phones do not record that well.",
      },
      {
        windowId: ended.id,
        userId: nico.id,
        prompt: "How did it feel?",
        answer: "Slower in a good way. We actually talked.",
      },
    ],
  });

  await prisma.streak.createMany({
    data: [
      { userId: maya.id, context: "personal", current: 12, longest: 19, lastDate: "2026-08-18" },
      { userId: karan.id, context: "personal", current: 7, longest: 14, lastDate: "2026-08-18" },
      { userId: jules.id, context: "personal", current: 21, longest: 21, lastDate: "2026-08-18" },
      { userId: nico.id, context: "personal", current: 4, longest: 9, lastDate: "2026-08-17" },
      { userId: maya.id, groupId: nightOwls.id, context: "group", current: 8, longest: 8, lastDate: "2026-08-18" },
      { userId: maya.id, context: "study", current: 9, longest: 11, lastDate: "2026-08-18" },
    ],
  });

  const badgeData = [
    { slug: "first-window", name: "First pane", description: "Finished your first screenless window.", unlockRule: "complete_1" },
    { slug: "week-garden", name: "Week garden", description: "Seven days of showing up.", unlockRule: "streak_7" },
    { slug: "soft-return", name: "Soft return", description: "Peeked, then came back without dropping.", unlockRule: "peek_return" },
    { slug: "walk-unplugged", name: "Unplugged walk", description: "Completed a walk window.", unlockRule: "context_walk" },
    { slug: "night-owl", name: "Lamp light", description: "Three late study windows in a week.", unlockRule: "study_3" },
  ];
  const badges: Badge[] = [];
  for (const b of badgeData) {
    badges.push(await prisma.badge.create({ data: b }));
  }

  await prisma.userBadge.createMany({
    data: [
      { userId: maya.id, badgeId: badges[0].id },
      { userId: maya.id, badgeId: badges[1].id },
      { userId: maya.id, badgeId: badges[3].id },
      { userId: jules.id, badgeId: badges[0].id },
      { userId: jules.id, badgeId: badges[1].id },
      { userId: jules.id, badgeId: badges[4].id },
      { userId: karan.id, badgeId: badges[0].id },
      { userId: karan.id, badgeId: badges[2].id },
    ],
  });

  await prisma.featureFlag.createMany({
    data: [
      { key: "soft_peek_copy_v2", enabled: true, description: "Gentler peek copy in the live room." },
      { key: "garden_theme", enabled: true, description: "Offline garden cosmetics." },
      { key: "group_chat_reactions", enabled: false, description: "Emoji reactions on the signal stream." },
      { key: "walk_templates", enabled: true, description: "Curated walk window templates." },
    ],
  });

  await prisma.reflectionPrompt.createMany({
    data: [
      { text: "How did it feel?", context: "any" },
      { text: "What did you get done?", context: "STUDY" },
      { text: "What did the street give you back?", context: "WALK" },
      { text: "Who felt closer after this?", context: "SOCIAL" },
      { text: "What would you protect again tomorrow?", context: "SELF_CARE" },
    ],
  });

  await prisma.windowTemplate.createMany({
    data: [
      { title: "Library lamps", context: "STUDY", durationMinutes: 45, description: "One sitting. Notes, not tabs." },
      { title: "Canal path", context: "WALK", durationMinutes: 60, description: "Phones in pockets, eyes up." },
      { title: "Kitchen hangout", context: "SOCIAL", durationMinutes: 90, description: "Cook together. No filming." },
      { title: "Studio quiet hour", context: "DEEP_WORK", durationMinutes: 60, description: "One project. Door closed." },
    ],
  });

  await prisma.report.create({
    data: {
      reporterId: maya.id,
      reportedUserId: nico.id,
      reason: "Invite spam",
      details: "Demo report so moderation has a row to review.",
      status: "OPEN",
    },
  });

  console.log("Seeded ScreenLess demo data.");
  console.log("  Admin  admin@screenless.app / screenless");
  console.log("  Maya   maya@screenless.app  / screenless");
  console.log("  Invite Night Owls: OWL42K");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
