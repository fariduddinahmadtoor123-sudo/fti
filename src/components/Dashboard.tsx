"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout, type AuthUser } from "@/lib/auth";
import { fetchLandingOpen, setLandingOpen } from "@/lib/settings";
import {
  SESSIONS,
  formatCountdown,
  getOverlap,
  impactFromMs,
  isSessionOpen,
  nextCoreCpiRelease,
} from "@/lib/sessions";

type NavId = "overview" | "store";

const SIGNALS = [
  {
    pair: "XAU/USD",
    bias: "BUY",
    entry: "2,364.80",
    sl: "2,358.40",
    tp1: "2,371.50",
    tp2: "2,378.20",
    score: 9.2,
    accent: "gold" as const,
  },
  {
    pair: "WTI Oil",
    bias: "SELL",
    entry: "78.42",
    sl: "79.15",
    tp1: "77.60",
    tp2: "76.90",
    score: 8.4,
    accent: "cyan" as const,
  },
  {
    pair: "EUR/USD",
    bias: "BUY",
    entry: "1.0842",
    sl: "1.0808",
    tp1: "1.0880",
    tp2: "1.0915",
    score: 7.6,
    accent: "gold" as const,
  },
  {
    pair: "BTC/USD",
    bias: "BUY",
    entry: "67,420",
    sl: "66,180",
    tp1: "68,900",
    tp2: "70,250",
    score: 8.1,
    accent: "cyan" as const,
  },
];

const NAV = [
  { id: "overview" as const, label: "Overview", hint: "Signals & sessions" },
  { id: "store" as const, label: "Store Setting", hint: "Landing page on/off" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [nav, setNav] = useState<NavId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [landingOpen, setLandingOpenState] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const releaseAt = useMemo(() => nextCoreCpiRelease(), []);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.replace("/?login=1");
      return;
    }
    setUser(u);
    void fetchLandingOpen().then(setLandingOpenState);
  }, [router]);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  async function toggleLanding(next: boolean) {
    setSaving(true);
    setStatusMsg("");
    const result = await setLandingOpen(next);
    setSaving(false);
    if (!result.ok) {
      setStatusMsg(result.error || "Update failed");
      return;
    }
    const confirmed = typeof result.landingOpen === "boolean" ? result.landingOpen : next;
    setLandingOpenState(confirmed);
    setStatusMsg(
      confirmed
        ? "Server OK: Landing is PUBLIC for everyone."
        : "Server OK: Landing CLOSED. Visitors only see blank Sign In. You still see landing while logged in — use Visitor Preview to check."
    );
    if (!confirmed) {
      window.open("/?visitor=1", "_blank", "noopener,noreferrer");
    }
  }

  if (!user) {
    return (
      <div className="page-bg grid min-h-svh place-items-center px-4">
        <div className="glass glass-cyan rounded-2xl px-6 py-5 text-sm text-[var(--muted)]">
          Checking member session…
        </div>
      </div>
    );
  }

  const remainMs = now ? Math.max(0, releaseAt.getTime() - now.getTime()) : 0;
  const impact = now ? impactFromMs(remainMs) : 2;
  const overlap = now ? getOverlap(now) : { labels: [] as string[], level: "none" as const };

  return (
    <div className="page-bg min-h-svh">
      <div className="mx-auto flex min-h-svh max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 start-0 z-50 w-72 border-e border-white/10 bg-[#070d1a]/95 p-4 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold tracking-[0.18em] text-[var(--gold-soft)]">
                FTI
              </div>
              <div className="text-xs text-[var(--muted)]">Control Panel</div>
            </div>
            <button
              type="button"
              className="btn-ghost lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              Close
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`rounded-xl border px-3 py-3 text-start transition ${
                  nav === item.id
                    ? "border-[var(--border-gold)] bg-[rgba(212,175,55,0.12)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div className="text-sm font-bold">{item.label}</div>
                <div className="mt-0.5 text-xs text-[var(--muted)]">{item.hint}</div>
              </button>
            ))}

            {/* Future slots */}
            <div className="mt-3 rounded-xl border border-dashed border-white/10 px-3 py-3 text-xs text-[var(--muted)]">
              More menu items can be added here later.
            </div>
          </nav>

          <div className="mt-auto pt-8">
            <a href="/" className="btn-ghost inline-flex w-full justify-center">
              View site
            </a>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050913]/75 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-ghost lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  Menu
                </button>
                <div>
                  <div className="text-sm font-extrabold sm:text-base">Member Dashboard</div>
                  <div className="text-xs text-[var(--muted)]">
                    {landingOpen ? "Landing: PUBLIC" : "Landing: CLOSED"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm">
                  <span className="text-[var(--muted)]">Signed in · </span>
                  <strong>{user.name}</strong>
                </div>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          </header>

          <main className="flex flex-col gap-5 px-4 py-6 sm:px-6">
            {nav === "store" ? (
              <section className="glass glass-gold max-w-2xl rounded-2xl p-5 sm:p-6">
                <h1 className="m-0 text-xl font-extrabold">Store Setting</h1>
                <p className="mt-2 m-0 text-sm leading-relaxed text-[var(--muted)]">
                  Close کرنے پر عوام کو لینڈنگ کی کوئی چیز نہیں دکھے گی — صرف خالی Sign In۔ آپ لاگ
                  اِن ہیں اس لیے آپ کو لینڈنگ نظر آ سکتی ہے؛ چیک کرنے کے لیے Visitor Preview استعمال
                  کریں۔ دوبارہ لاگ اِن سے ایڈمن کو پوری سائٹ ملے گی۔
                </p>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">Landing page visibility</div>
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        Server status:{" "}
                        <strong className={landingOpen ? "text-[var(--ok)]" : "text-rose-300"}>
                          {landingOpen ? "OPEN / PUBLIC" : "CLOSED / SIGN-IN ONLY"}
                        </strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={saving}
                      onClick={() => void toggleLanding(!landingOpen)}
                    >
                      {saving
                        ? "Saving…"
                        : landingOpen
                          ? "Close landing page"
                          : "Open landing page"}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="/?visitor=1"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost inline-flex"
                  >
                    Visitor Preview (blank Sign In)
                  </a>
                  <a href="/" className="btn-ghost inline-flex">
                    Open as admin (logged in)
                  </a>
                </div>

                {statusMsg ? (
                  <p className="mt-4 mb-0 text-sm font-semibold text-[var(--cyan-soft)]">
                    {statusMsg}
                  </p>
                ) : null}
              </section>
            ) : (
              <>
                <section className="glass glass-gold rounded-2xl p-5">
                  <h1 className="m-0 text-xl font-extrabold sm:text-2xl">
                    Welcome back, {user.name.split(" ")[0]}
                  </h1>
                  <p className="mt-2 m-0 text-sm text-[var(--muted)]">
                    Live desk unlocked · role{" "}
                    <strong className="text-[var(--gold-soft)]">{user.role}</strong> ·{" "}
                    <span dir="ltr">{user.email}</span>
                  </p>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="glass glass-cyan rounded-2xl p-4 sm:p-5">
                    <div className="mb-3 flex items-end justify-between gap-2">
                      <h2 className="m-0 text-lg font-extrabold">Session Pulse</h2>
                      <span className="text-xs text-[var(--muted)]" dir="ltr">
                        {now
                          ? now.toLocaleString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              timeZoneName: "short",
                            })
                          : "--:--:--"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {SESSIONS.map((s) => {
                        const open = now ? isSessionOpen(s, now) : false;
                        return (
                          <div
                            key={s.id}
                            className={`rounded-xl border bg-white/[0.03] p-3 ${
                              open ? "session-open" : "session-closed border-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold">{s.name}</span>
                              {open ? <span className="pulse-dot" /> : null}
                            </div>
                            <div
                              className={`mt-1 text-xs font-extrabold ${
                                open ? "text-[var(--ok)]" : "text-[var(--muted)]"
                              }`}
                            >
                              {open ? "OPEN" : "CLOSED"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-3 mb-0 text-sm text-[var(--muted)]">
                      {overlap.level === "none"
                        ? "No major overlap right now."
                        : `${overlap.labels.join(" & ")} overlap · ${
                            overlap.level === "peak" ? "Peak liquidity" : "Active"
                          }`}
                    </p>
                  </div>

                  <div className="glass glass-gold rounded-2xl p-4 sm:p-5">
                    <h2 className="m-0 text-lg font-extrabold">Macro Risk</h2>
                    <p className="mt-2 mb-1 text-base font-bold text-[var(--gold-soft)]">
                      US Core CPI
                    </p>
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-center">
                      <div className="text-[0.65rem] tracking-wide text-[var(--muted)] uppercase">
                        Countdown
                      </div>
                      <div className="mt-1 font-mono text-2xl font-extrabold" dir="ltr">
                        {now ? formatCountdown(remainMs) : "--:--:--"}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`traffic-light ${impact >= 1 ? "on-1" : ""}`} />
                      <span className={`traffic-light ${impact >= 2 ? "on-2" : ""}`} />
                      <span className={`traffic-light ${impact >= 3 ? "on-3" : ""}`} />
                      <span className="text-sm font-semibold">
                        {impact === 1 ? "Low" : impact === 2 ? "Medium" : "Critical"}
                      </span>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-3">
                    <h2 className="m-0 text-lg font-extrabold">Unlocked Signal Desk</h2>
                    <p className="mt-1 m-0 text-sm text-[var(--muted)]">
                      Entry · SL · TP visible for your member session
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {SIGNALS.map((s) => (
                      <article
                        key={s.pair}
                        className={`rounded-2xl p-5 ${
                          s.accent === "gold" ? "glass glass-gold" : "glass glass-cyan"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h3 className="m-0 text-lg font-extrabold" dir="ltr">
                            {s.pair}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              s.bias === "BUY"
                                ? "bg-emerald-400/15 text-emerald-300"
                                : "bg-rose-400/15 text-rose-300"
                            }`}
                          >
                            {s.bias}
                          </span>
                        </div>
                        <dl className="m-0 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <dt className="text-[var(--muted)]">Entry</dt>
                            <dd className="m-0 font-bold" dir="ltr">
                              {s.entry}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[var(--muted)]">SL</dt>
                            <dd className="m-0 font-bold text-rose-300" dir="ltr">
                              {s.sl}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[var(--muted)]">TP1</dt>
                            <dd className="m-0 font-bold text-emerald-300" dir="ltr">
                              {s.tp1}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[var(--muted)]">TP2</dt>
                            <dd className="m-0 font-bold text-emerald-300" dir="ltr">
                              {s.tp2}
                            </dd>
                          </div>
                        </dl>
                        <div className="mt-3 text-sm">
                          Confluence{" "}
                          <strong className="text-[var(--gold-soft)]" dir="ltr">
                            {s.score.toFixed(1)}/10
                          </strong>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
