import { useEffect, useState } from "react";

type ScreenName =
  | "landing"
  | "onboarding"
  | "home"
  | "live"
  | "groups"
  | "create"
  | "streaks"
  | "reflect"
  | "settings"
  | "gallery";

function route(): ScreenName {
  const hash = window.location.hash.replace("#/", "").replace("#", "");
  const known: ScreenName[] = [
    "landing",
    "onboarding",
    "home",
    "live",
    "groups",
    "create",
    "streaks",
    "reflect",
    "settings",
    "gallery",
  ];
  if (known.includes(hash as ScreenName)) return hash as ScreenName;
  return "landing";
}

export function App() {
  const [screen, setScreen] = useState<ScreenName>(route);
  useEffect(() => {
    const onHash = () => setScreen(route());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (screen === "gallery") {
    return (
      <div className="gallery">
        {(["onboarding", "home", "live", "groups", "create", "streaks", "reflect", "settings"] as const).map((s) => (
          <div className="gallery-item" key={s}>
            <Phone>{SCREEN[s]}</Phone>
            <div className="caption">{s}</div>
          </div>
        ))}
      </div>
    );
  }

  if (screen !== "landing") {
    const dark = screen === "live";
    return (
      <div className={`solo ${dark ? "dark-bg" : ""}`}>
        <Phone dark={dark}>{SCREEN[screen]}</Phone>
      </div>
    );
  }

  return (
    <div className="landing">
      <nav className="nav">
        <div className="brand">SCREENLESS</div>
        <div className="nav-links">
          <a href="#/gallery">Screens</a>
          <a href="#/live">Live room</a>
          <a href="#/streaks">Garden</a>
        </div>
      </nav>
      <div className="hero">
        <div>
          <div className="kicker">PHONE-DOWN SOCIAL · GEN Z CIRCLES</div>
          <h1>
            Phone down,
            <br />
            friendship up.
          </h1>
          <p className="lede">
            Shared screenless windows with the people you already trust. Soft signals when someone
            peeks — never a shame score. Streaks that feel like a garden, not a jail.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#/gallery">
              Walk the product
            </a>
            <a className="btn btn-ghost" href="#/home">
              Open Maya’s home
            </a>
          </div>
        </div>
        <div className="phones">
          <div className="phone-wrap">
            <Phone>{SCREEN.home}</Phone>
          </div>
          <div className="phone-wrap">
            <Phone dark>{SCREEN.live}</Phone>
          </div>
          <div className="phone-wrap">
            <Phone>{SCREEN.streaks}</Phone>
          </div>
        </div>
      </div>
      <section className="section">
        <h2>Offline as a shared ritual</h2>
        <p className="lede">
          Focus apps are usually solitary and punitive. ScreenLess is a small-group sport: you
          choose the window, you choose the apps, friends keep you honest without a leaderboard of
          failure.
        </p>
        <div className="grid-3">
          <article className="card">
            <h3>Windows, not locks</h3>
            <p>45-minute study. A walk. A hangout. Invite with a code. Late joins are welcome.</p>
          </article>
          <article className="card">
            <h3>Soft accountability</h3>
            <p>“Karan peeked at socials” — then he came back. No minute logs. No public feed.</p>
          </article>
          <article className="card">
            <h3>Signals, not dossiers</h3>
            <p>UsageStats stay on-device until they collapse into a kind: focused, peeked, dropped.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

function Phone({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="phone">
      <div className={`phone-screen ${dark ? "dark" : ""}`}>
        <div className="status">
          <span>9:41</span>
          <span>●●● LTE</span>
        </div>
        <div className="screen-body">{children}</div>
      </div>
    </div>
  );
}

function Av({ name, hue }: { name: string; hue: number }) {
  return (
    <div className="av" style={{ background: `hsl(${hue} 35% 38%)` }}>
      {name[0]}
    </div>
  );
}

const SCREEN: Record<Exclude<ScreenName, "landing" | "gallery">, JSX.Element> = {
  onboarding: (
    <>
      <div className="app-kicker">SCREENLESS</div>
      <div className="app-title">Phone down, friendship up.</div>
      <p className="muted">Turn putting the phone away into a shared ritual. Windows with your people.</p>
      <div className="paper">
        <strong>Shared windows</strong>
        <p className="muted">Study, walks, hangouts — timed together.</p>
      </div>
      <div className="paper">
        <strong>Soft accountability</strong>
        <p className="muted">A peek is a nudge, not a verdict.</p>
      </div>
      <div className="paper">
        <strong>Your rules</strong>
        <p className="muted">You pick which apps count. Signals, not logs.</p>
      </div>
    </>
  ),
  home: (
    <>
      <p className="muted">Good evening, Maya</p>
      <div className="app-title">Your window is open.</div>
      <div className="live-card">
        <div className="tiny">LIVE · NIGHT OWLS</div>
        <div className="serif" style={{ fontSize: 22, marginTop: 6 }}>
          Library lamps
        </div>
        <p className="muted" style={{ color: "rgba(244,239,228,0.75)" }}>
          27 minutes left · 3 in the room
        </p>
        <div className="avatars">
          <Av name="Maya" hue={28} />
          <Av name="Karan" hue={168} />
          <Av name="Jules" hue={42} />
        </div>
      </div>
      <div className="row">
        <div className="chip">12 day streak</div>
        <div className="chip">2 circles</div>
      </div>
      <div className="paper">
        <strong>Studio quiet hour</strong>
        <p className="muted">Jules · Night Owls · 60 min · Deep work</p>
      </div>
    </>
  ),
  live: (
    <div className="dark">
      <p className="focus">NIGHT OWLS</p>
      <div className="serif" style={{ fontSize: 26, margin: "4px 0 6px" }}>
        Library lamps
      </div>
      <p className="muted" style={{ color: "rgba(244,239,228,0.7)" }}>
        27:12 remaining · phones in the other room
      </p>
      <div style={{ marginTop: 14 }}>
        <div className="person">
          <Av name="Maya" hue={28} />
          <div>
            <div>Maya</div>
            <div className="focus">Focused</div>
          </div>
          <div style={{ marginLeft: "auto", opacity: 0.8 }}>96%</div>
        </div>
        <div className="person">
          <Av name="Karan" hue={168} />
          <div>
            <div>Karan</div>
            <div className="peek">Peeked — and came back</div>
          </div>
          <div style={{ marginLeft: "auto", opacity: 0.8 }}>81%</div>
        </div>
        <div className="person">
          <Av name="Jules" hue={42} />
          <div>
            <div>Jules</div>
            <div className="focus">Focused</div>
          </div>
          <div style={{ marginLeft: "auto", opacity: 0.8 }}>100%</div>
        </div>
      </div>
      <div className="signal">Karan peeked at socials</div>
      <div className="signal">Karan is back in the window</div>
    </div>
  ),
  groups: (
    <>
      <div className="app-title">Your circles</div>
      <p className="muted">Private by design. No public feed.</p>
      <div className="paper">
        <strong>Night Owls</strong>
        <p className="muted">Late study windows. Lamps on, phones down.</p>
        <div className="avatars">
          <Av name="Maya" hue={28} />
          <Av name="Karan" hue={168} />
          <Av name="Jules" hue={42} />
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          Invite OWL42K
        </p>
      </div>
      <div className="paper">
        <strong>Sunday Walks</strong>
        <p className="muted">No earbuds. Notice the street.</p>
        <p className="muted" style={{ marginTop: 8 }}>
          Invite WALK9M
        </p>
      </div>
    </>
  ),
  create: (
    <>
      <div className="app-title">Open a window</div>
      <p className="muted">A window is a promise with a clock.</p>
      <div className="paper">
        <div className="muted">Title</div>
        <strong>Library lamps</strong>
      </div>
      <div>
        <span className="pill on">study</span>
        <span className="pill">walk</span>
        <span className="pill">social</span>
      </div>
      <div className="paper">
        <div className="muted">Discouraged</div>
        <strong>Instagram · TikTok · YouTube · X</strong>
      </div>
      <div className="paper" style={{ background: "var(--forest)", color: "var(--cream)", textAlign: "center" }}>
        Invite Night Owls · 45 min
      </div>
    </>
  ),
  streaks: (
    <>
      <div className="app-title">Your garden</div>
      <p className="muted">Cosmetic only — nothing locked behind shame.</p>
      <div className="paper">
        <strong>12 days · personal</strong>
        <p className="muted">Longest 19</p>
      </div>
      <div className="paper">
        <strong>9 days · study</strong>
        <p className="muted">Longest 11</p>
      </div>
      <div className="paper">
        <strong>8 days · Night Owls</strong>
        <p className="muted">The circle held.</p>
      </div>
      <p className="muted" style={{ marginTop: 12 }}>
        Badges · First pane · Week garden · Unplugged walk
      </p>
    </>
  ),
  reflect: (
    <>
      <div className="app-title">Window closed.</div>
      <p className="muted">Two lines. That’s the whole ritual. How did it feel?</p>
      <div className="paper" style={{ minHeight: 88 }}>
        Quieter than I expected. Finished the chapter.
      </div>
      <div className="paper" style={{ background: "var(--forest)", color: "var(--cream)", textAlign: "center" }}>
        Keep this in the log
      </div>
    </>
  ),
  settings: (
    <>
      <div className="app-title">Privacy & consent</div>
      <p className="muted">Friends see a signal. Nobody sees a dossier.</p>
      <div className="toggle-row">
        <div>
          <strong>Social apps</strong>
          <p className="muted">Only during live windows</p>
        </div>
        <div className="switch" />
      </div>
      <div className="toggle-row">
        <div>
          <strong>Video</strong>
          <p className="muted">YouTube, Reels-likes</p>
        </div>
        <div className="switch" />
      </div>
      <div className="toggle-row">
        <div>
          <strong>Games</strong>
          <p className="muted">Off unless you opt in</p>
        </div>
        <div className="switch off" />
      </div>
      <div className="toggle-row">
        <div>
          <strong>Messaging</strong>
          <p className="muted">Never a peek by default</p>
        </div>
        <div className="switch off" />
      </div>
    </>
  ),
};
