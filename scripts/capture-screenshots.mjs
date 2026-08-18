import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const OUT = path.resolve("docs/screenshots");
fs.mkdirSync(OUT, { recursive: true });

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  args: ["--hide-scrollbars", "--font-render-hinting=none"],
});

async function shot(page, name, url, opts = {}) {
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
  if (opts.wait) await page.waitForSelector(opts.wait, { timeout: 15_000 });
  if (opts.delay) await new Promise((r) => setTimeout(r, opts.delay));
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: Boolean(opts.fullPage) });
  console.log("wrote", file);
}

const page = await browser.newPage();
await shot(page, "01-landing.png", "http://localhost:5173/", { delay: 400 });
await shot(page, "02-home.png", "http://localhost:5173/#/home", { delay: 200 });
await shot(page, "03-live-room.png", "http://localhost:5173/#/live", { delay: 200 });
await shot(page, "04-streaks.png", "http://localhost:5173/#/streaks", { delay: 200 });
await shot(page, "05-create-window.png", "http://localhost:5173/#/create", { delay: 200 });
await shot(page, "06-reflection.png", "http://localhost:5173/#/reflect", { delay: 200 });
await shot(page, "07-privacy.png", "http://localhost:5173/#/settings", { delay: 200 });
await shot(page, "08-groups.png", "http://localhost:5173/#/groups", { delay: 200 });
await shot(page, "09-gallery.png", "http://localhost:5173/#/gallery", { fullPage: true, delay: 400 });

await shot(page, "10-admin-login.png", "http://localhost:3000/", { wait: "form" });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
await page.waitForSelector("form");
await page.click("button[type=submit]");
await page.waitForSelector(".stats", { timeout: 15_000 });
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: path.join(OUT, "11-admin-overview.png") });
console.log("wrote", path.join(OUT, "11-admin-overview.png"));

const nav = await page.$$("aside button.link");
// Overview, People, Circles, Reports, Flags, Prompts
if (nav[3]) {
  await nav[3].click();
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, "12-admin-reports.png") });
  console.log("wrote", path.join(OUT, "12-admin-reports.png"));
}
if (nav[4]) {
  await nav[4].click();
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, "13-admin-flags.png") });
  console.log("wrote", path.join(OUT, "13-admin-flags.png"));
}

await browser.close();
