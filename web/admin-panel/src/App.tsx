import { useEffect, useState } from "react";
import { api, login } from "./api";

type Page = "overview" | "users" | "groups" | "reports" | "flags" | "prompts";

type Overview = {
  stats: {
    users: number;
    groups: number;
    windows: number;
    liveWindows: number;
    openReports: number;
    reflections: number;
  };
  contextCounts: { context: string; count: number }[];
  recentWindows: {
    id: string;
    title: string;
    context: string;
    status: string;
    group: { name: string };
    _count: { participants: number };
  }[];
  topStreaks: { current: number; longest: number; displayName?: string }[];
};

type UserRow = {
  id: string;
  email: string;
  displayName: string;
  isBlocked: boolean;
  createdAt: string;
  _count: { memberships: number; reflections: number };
};

type GroupRow = {
  id: string;
  name: string;
  inviteCode: string;
  isBlocked: boolean;
  _count: { members: number; windows: number };
};

type ReportRow = {
  id: string;
  reason: string;
  status: string;
  details?: string;
  reporter: { displayName: string };
  reportedUser?: { displayName: string };
};

type Flag = { key: string; enabled: boolean; description?: string };
type Prompt = { id: string; text: string; context: string };

export function App() {
  const [token, setToken] = useState(() => localStorage.getItem("sl-admin") ?? "");
  const [page, setPage] = useState<Page>("overview");
  const [email, setEmail] = useState("admin@screenless.app");
  const [password, setPassword] = useState("screenless");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="login">
        <form
          className="login-card"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              const res = await login(email, password);
              localStorage.setItem("sl-admin", res.token);
              setToken(res.token);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Sign-in failed");
            }
          }}
        >
          <div className="brand">SCREENLESS OPS</div>
          <h1>Tend the garden.</h1>
          <p>Moderation, flags, and the pulse of windows — not a growth cockpit that forgets people.</p>
          {error ? <div className="error">{error}</div> : null}
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Enter ops</button>
        </form>
      </div>
    );
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">SCREENLESS</div>
        <nav>
          {(
            [
              ["overview", "Overview"],
              ["users", "People"],
              ["groups", "Circles"],
              ["reports", "Reports"],
              ["flags", "Flags"],
              ["prompts", "Prompts"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={`link ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              {label}
            </button>
          ))}
          <button
            className="link"
            onClick={() => {
              localStorage.removeItem("sl-admin");
              setToken("");
            }}
          >
            Sign out
          </button>
        </nav>
      </aside>
      <main className="main">
        {page === "overview" && <Overview token={token} />}
        {page === "users" && <Users token={token} />}
        {page === "groups" && <Groups token={token} />}
        {page === "reports" && <Reports token={token} />}
        {page === "flags" && <Flags token={token} />}
        {page === "prompts" && <Prompts token={token} />}
      </main>
    </div>
  );
}

function Overview({ token }: { token: string }) {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api<Overview>("/v1/admin/overview", token)
      .then(setData)
      .catch((e: Error) => setErr(e.message));
  }, [token]);
  if (err) return <p className="sub">{err} — is the API running on :4000 with the seed?</p>;
  if (!data) return <p className="sub">Loading the pulse…</p>;
  const s = data.stats;
  return (
    <>
      <h1>Tonight’s pulse</h1>
      <p className="sub">Live windows, open reports, and who is still showing up.</p>
      <div className="stats">
        <Stat n={s.users} l="People" />
        <Stat n={s.groups} l="Circles" />
        <Stat n={s.windows} l="Windows ever" />
        <Stat n={s.liveWindows} l="Live now" />
        <Stat n={s.openReports} l="Open reports" />
        <Stat n={s.reflections} l="Reflections" />
      </div>
      <div className="two">
        <div className="panel">
          <h2>Recent windows</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Circle</th>
                <th>Context</th>
                <th>Status</th>
                <th>In room</th>
              </tr>
            </thead>
            <tbody>
              {data.recentWindows.map((w) => (
                <tr key={w.id}>
                  <td>{w.title}</td>
                  <td>{w.group.name}</td>
                  <td>{w.context.toLowerCase()}</td>
                  <td>
                    <span className={`badge ${w.status === "LIVE" ? "" : "warn"}`}>{w.status}</span>
                  </td>
                  <td>{w._count.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h2>Personal streaks</h2>
          {data.topStreaks.map((st) => (
            <div className="flag" key={st.displayName}>
              <div>{st.displayName}</div>
              <div>
                {st.current} current · {st.longest} longest
              </div>
            </div>
          ))}
          <h2 style={{ marginTop: 18 }}>Window mix</h2>
          {data.contextCounts.map((c) => (
            <div className="flag" key={c.context}>
              <div>{c.context}</div>
              <div>{c.count}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div className="stat">
      <div className="n">{n}</div>
      <div className="l">{l}</div>
    </div>
  );
}

function Users({ token }: { token: string }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  useEffect(() => {
    api<{ users: UserRow[] }>("/v1/admin/users", token).then((r) => setUsers(r.users));
  }, [token]);
  return (
    <>
      <h1>People</h1>
      <p className="sub">Block is a last resort. Prefer a quiet report review.</p>
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Circles</th>
              <th>Reflections</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.displayName}</td>
                <td>{u.email}</td>
                <td>{u._count.memberships}</td>
                <td>{u._count.reflections}</td>
                <td>
                  {u.isBlocked ? (
                    <span className="badge warn">blocked</span>
                  ) : (
                    <button
                      className="btn"
                      style={{ width: "auto", padding: "6px 10px", fontSize: 12 }}
                      onClick={async () => {
                        await api(`/v1/admin/users/${u.id}/block`, token, { method: "POST" });
                        setUsers((prev) => prev.map((p) => (p.id === u.id ? { ...p, isBlocked: true } : p)));
                      }}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Groups({ token }: { token: string }) {
  const [groups, setGroups] = useState<GroupRow[]>([]);
  useEffect(() => {
    api<{ groups: GroupRow[] }>("/v1/admin/groups", token).then((r) => setGroups(r.groups));
  }, [token]);
  return (
    <>
      <h1>Circles</h1>
      <p className="sub">Private groups only. ScreenLess has no public discovery feed.</p>
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Invite</th>
              <th>Members</th>
              <th>Windows</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.inviteCode}</td>
                <td>{g._count.members}</td>
                <td>{g._count.windows}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Reports({ token }: { token: string }) {
  const [reports, setReports] = useState<ReportRow[]>([]);
  useEffect(() => {
    api<{ reports: ReportRow[] }>("/v1/admin/reports", token).then((r) => setReports(r.reports));
  }, [token]);
  return (
    <>
      <h1>Reports</h1>
      <p className="sub">Soft product, firm safety. Review, then act or dismiss.</p>
      <div className="panel">
        {reports.map((r) => (
          <div className="flag" key={r.id}>
            <div>
              <strong>{r.reason}</strong>
              <div className="sub" style={{ margin: 0 }}>
                {r.reporter.displayName} → {r.reportedUser?.displayName ?? "circle"} · {r.details}
              </div>
            </div>
            <div>
              <span className={`badge ${r.status === "OPEN" ? "warn" : ""}`}>{r.status}</span>
              {r.status === "OPEN" && (
                <button
                  className="btn"
                  style={{ width: "auto", marginLeft: 8, padding: "6px 10px", fontSize: 12 }}
                  onClick={async () => {
                    await api(`/v1/admin/reports/${r.id}`, token, {
                      method: "PATCH",
                      body: JSON.stringify({ status: "REVIEWED" }),
                    });
                    setReports((prev) => prev.map((p) => (p.id === r.id ? { ...p, status: "REVIEWED" } : p)));
                  }}
                >
                  Mark reviewed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Flags({ token }: { token: string }) {
  const [flags, setFlags] = useState<Flag[]>([]);
  useEffect(() => {
    api<{ flags: Flag[] }>("/v1/admin/flags", token).then((r) => setFlags(r.flags));
  }, [token]);
  return (
    <>
      <h1>Feature flags</h1>
      <p className="sub">Ship the garden theme. Hold chat reactions until copy is kind enough.</p>
      <div className="panel">
        {flags.map((f) => (
          <div className="flag" key={f.key}>
            <div>
              <strong>{f.key}</strong>
              <div className="sub" style={{ margin: 0 }}>
                {f.description}
              </div>
            </div>
            <button
              className={`toggle ${f.enabled ? "on" : ""}`}
              onClick={async () => {
                await api(`/v1/admin/flags/${f.key}`, token, {
                  method: "PATCH",
                  body: JSON.stringify({ enabled: !f.enabled }),
                });
                setFlags((prev) => prev.map((p) => (p.key === f.key ? { ...p, enabled: !p.enabled } : p)));
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Prompts({ token }: { token: string }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [text, setText] = useState("");
  useEffect(() => {
    api<{ prompts: Prompt[] }>("/v1/admin/prompts", token).then((r) => setPrompts(r.prompts));
  }, [token]);
  return (
    <>
      <h1>Reflection prompts</h1>
      <p className="sub">One or two questions after a window. Never a journal homework.</p>
      <div className="panel">
        {prompts.map((p) => (
          <div className="flag" key={p.id}>
            <div>{p.text}</div>
            <span className="badge">{p.context}</span>
          </div>
        ))}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await api<{ prompt: Prompt }>("/v1/admin/prompts", token, {
              method: "POST",
              body: JSON.stringify({ text, context: "any" }),
            });
            setPrompts((prev) => [...prev, res.prompt]);
            setText("");
          }}
        >
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New prompt" />
          <button type="submit">Add prompt</button>
        </form>
      </div>
    </>
  );
}
