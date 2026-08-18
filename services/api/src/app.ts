import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { groupsRouter } from "./routes/groups.js";
import { windowsRouter } from "./routes/windows.js";
import { signalsRouter } from "./routes/signals.js";
import { streaksRouter, reflectionsRouter, reportsRouter, privacyRouter } from "./routes/community.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: [
        config.adminOrigin,
        config.showcaseOrigin,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
      ],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "screenless-api",
      tagline: "Phone down, friendship up.",
    });
  });

  app.use("/v1/auth", authRouter);
  app.use("/v1/groups", groupsRouter);
  app.use("/v1/windows", windowsRouter);
  app.use("/v1/signals", signalsRouter);
  app.use("/v1/streaks", streaksRouter);
  app.use("/v1/reflections", reflectionsRouter);
  app.use("/v1/reports", reportsRouter);
  app.use("/v1/privacy", privacyRouter);
  app.use("/v1/admin", adminRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "No route here." });
  });

  return app;
}
