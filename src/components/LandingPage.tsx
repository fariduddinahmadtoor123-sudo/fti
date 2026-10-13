"use client";

import { useEffect, useMemo, useState } from "react";
import { copy, type Lang } from "@/lib/i18n";
import {
  SESSIONS,
  formatCountdown,
  getOverlap,
  impactFromMs,
  isSessionOpen,
  nextCoreCpiRelease,
  type ImpactLevel,
} from "@/lib/sessions";

const WINNERS = [
  "XAU/USD M5: +45 Pips Hit 🎯",
  "WTI M15: +32 Pips Hit 🎯",
  "EUR/USD H1: +28 Pips Hit 🎯",
  "XAU/USD M15: +61 Pips Hit 🎯",
  "WTI M5: +19 Pips Hit 🎯",
];

const SENTIMENT = [
  { pair: "XAU/USD", bulls: 68 },
  { pair: "WTI", bulls: 41 },
  { pair: "EUR/USD", bulls: 55 },
];

const CONFLUENCE = [
  {
    pair: "XAU/USD",
    score: 9.2,
    checks: { trend: true, session: true, news: true },
  },
  {
    pair: "WTI",
    score: 8.4,
    checks: { trend: true, session: true, news: false },
  },
  {
    pair: "EUR/USD",
    score: 7.6,
    checks: { trend: true, session: false, news: true },
  },
];

const GATED = [
  {
    pair: "XAU/USD",
    bias: "BUY",
    entry: "2,364.80",
    sl: "2,358.40",
    tp: "2,378.20",
    accent: "gold" as const,
  },
  {
    pair: "WTI Oil",
    bias: "SELL",
    entry: "78.42",
    sl: "79.15",
    tp: "76.90",
    accent: "cyan" as const,
  },
  {
    pair: "EUR/USD",
    bias: "BUY",
    entry: "1.0842",
    sl: "1.0808",
    tp: "1.0915",
    accent: "gold" as const,
  },
];

/** Client-only clock — null until mount to avoid SSR/hydration skew on static export. */
function useNow(ms = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [loginOpen, setLoginOpen] = useState(false);
  const t = copy[lang];
  const dir = lang === "ur" ? "rtl" : "ltr";
  const now = useNow(1000);

  useEffect(() => {
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const releaseAt = useMemo(() => nextCoreCpiRelease(), []);
  const remainMs = now ? Math.max(0, releaseAt.getTime() - now.getTime()) : 0;
  const impact: ImpactLevel = now ? impactFromMs(remainMs) : 2;
  const overlap = now ? getOverlap(now) : { labels: [] as string[], level: "none" as const };

  const overlapText = !now
    ? "…"
    : overlap.level === "none"
      ? t.noOverlap
      : `${overlap.labels.join(" & ")} Overlap · ${
          overlap.level === "peak" ? t.overlapPeak : t.overlapMild
        }`;

  return (
    <div className="page-bg" dir={dir}>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050913]/70 backdrop-blur-xl">
        {/* Keep chrome LTR so language toggle stays visually top-right */}
        <div
          dir="ltr"
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
        >
          <div className="min-w-0">
            <div className="text-lg font-extrabold tracking-[0.18em] text-[var(--gold-soft)]">
              {t.brand}
            </div>
            <div className="truncate text-xs text-[var(--muted)]" dir={dir}>
              {t.tagline}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                className="btn-ghost"
                data-active={lang === "en"}
                onClick={() => setLang("en")}
              >
                {t.langEn}
              </button>
              <button
                type="button"
                className="btn-ghost"
                data-active={lang === "ur"}
                onClick={() => setLang("ur")}
              >
                {t.langUr}
              </button>
            </div>
            <button
              type="button"
              className="btn-primary !py-2 !px-3 text-sm sm:!px-4"
              onClick={() => setLoginOpen(true)}
            >
              {t.memberLogin}
            </button>
          </div>
        </div>
      </header>

      {/* Overlap warning strip */}
      <div
        className={`border-b px-4 py-2 text-center text-sm font-semibold sm:px-6 ${
          overlap.level === "peak"
            ? "border-[var(--border-gold)] bg-[rgba(212,175,55,0.12)] text-[var(--gold-soft)]"
            : overlap.level === "mild"
              ? "border-[var(--border-cyan)] bg-[rgba(34,211,238,0.1)] text-[var(--cyan-soft)]"
              : "border-white/5 bg-white/[0.03] text-[var(--muted)]"
        }`}
      >
        {overlapText}
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--cyan-soft)] uppercase">
              XAU/USD · WTI
            </p>
            <h1 className="m-0 text-[clamp(1.85rem,4.5vw,3rem)] leading-tight font-extrabold">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-[var(--muted)]">
              {t.heroSub}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setLoginOpen(true)}
              >
                {t.heroCta}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <article className="chip-3d chip-gold glass glass-gold">
              <GoldVisual />
              <h3 className="mt-3 m-0 text-base font-bold">{t.goldChip}</h3>
              <p className="mt-1 m-0 text-sm text-[var(--muted)]">Institutional long bias · confluence 9.2</p>
            </article>
            <article className="chip-3d chip-oil glass glass-cyan">
              <OilVisual />
              <h3 className="mt-3 m-0 text-base font-bold">{t.oilChip}</h3>
              <p className="mt-1 m-0 text-sm text-[var(--muted)]">Energy desk · session volume active</p>
            </article>
          </div>
        </section>

        {/* Sessions */}
        <section className="glass glass-cyan rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">{t.sessionsTitle}</h2>
              <p className="section-sub">{t.sessionsSub}</p>
            </div>
            <div className="text-xs text-[var(--muted)]" dir="ltr" suppressHydrationWarning>
              {now
                ? now.toLocaleString(lang === "ur" ? "ur-PK" : "en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZoneName: "short",
                  })
                : "--:--:--"}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SESSIONS.map((session) => {
              const open = now ? isSessionOpen(session, now) : false;
              return (
                <div
                  key={session.id}
                  className={`rounded-xl border bg-white/[0.03] p-4 ${
                    open ? "session-open" : "session-closed border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{session.name}</span>
                    {open ? <span className="pulse-dot" aria-hidden /> : null}
                  </div>
                  <div
                    className={`mt-2 text-sm font-extrabold tracking-wide ${
                      open ? "text-[var(--ok)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {open ? t.open : t.closed}
                  </div>
                  <div className="mt-1 text-xs text-[var(--muted)]" dir="ltr">
                    UTC {String(session.startUtc).padStart(2, "0")}:00–
                    {String(session.endUtc).padStart(2, "0")}:00
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Macro risk */}
        <section className="glass glass-gold rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">{t.riskTitle}</h2>
              <p className="mt-2 text-lg font-bold text-[var(--gold-soft)]">{t.riskEvent}</p>
              <p className="section-sub">{t.riskSub}</p>
            </div>
            <div className="min-w-[12rem] rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
              <div className="text-xs tracking-wide text-[var(--muted)] uppercase">
                {t.countdownLabel}
              </div>
              <div
                className="mt-1 font-mono text-2xl font-extrabold tracking-wider"
                dir="ltr"
                suppressHydrationWarning
              >
                {now ? formatCountdown(remainMs) : "--:--:--"}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2" aria-label="impact lights">
              <span className={`traffic-light ${impact >= 1 ? "on-1" : ""}`} />
              <span className={`traffic-light ${impact >= 2 ? "on-2" : ""}`} />
              <span className={`traffic-light ${impact >= 3 ? "on-3" : ""}`} />
            </div>
            <div className="text-sm font-semibold">
              {impact === 1 ? t.impactLow : impact === 2 ? t.impactMed : t.impactHigh}
            </div>
          </div>
        </section>

        {/* Winners ticker */}
        <section className="overflow-hidden rounded-2xl border border-[var(--border-cyan)] bg-black/25 py-3">
          <div className="mb-2 px-4 text-xs font-bold tracking-[0.18em] text-[var(--cyan-soft)] uppercase">
            {t.winnersTitle}
          </div>
          <div className="relative overflow-hidden">
            <div className="ticker-track px-4 text-sm font-semibold">
              {[...WINNERS, ...WINNERS].map((item, i) => (
                <span key={`${item}-${i}`} className="whitespace-nowrap text-[var(--gold-soft)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Sentiment + Confluence */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="glass glass-gold rounded-2xl p-5 sm:p-6">
            <h2 className="section-title">{t.sentimentTitle}</h2>
            <div className="mt-5 flex flex-col gap-4">
              {SENTIMENT.map((row) => (
                <div key={row.pair}>
                  <div className="mb-1 flex items-center justify-between text-sm font-bold">
                    <span dir="ltr">{row.pair}</span>
                    <span className="text-[var(--muted)]">
                      {t.bulls} {row.bulls}% · {t.bears} {100 - row.bulls}%
                    </span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300"
                      style={{ width: `${row.bulls}%` }}
                    />
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
                      style={{ width: `${100 - row.bulls}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass glass-cyan rounded-2xl p-5 sm:p-6">
            <h2 className="section-title">{t.confluenceTitle}</h2>
            <div className="mt-5 flex flex-col gap-4">
              {CONFLUENCE.map((row) => (
                <div
                  key={row.pair}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold" dir="ltr">
                      {row.pair}
                    </span>
                    <span className="text-lg font-extrabold text-[var(--gold-soft)]" dir="ltr">
                      {row.score.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="meter-fill" style={{ width: `${row.score * 10}%` }} />
                  </div>
                  <ul className="mt-3 m-0 grid list-none gap-1 p-0 text-sm text-[var(--muted)]">
                    <li>
                      {row.checks.trend ? "✓" : "✗"} {t.checkTrend}
                    </li>
                    <li>
                      {row.checks.session ? "✓" : "✗"} {t.checkSession}
                    </li>
                    <li>
                      {row.checks.news ? "✓" : "✗"} {t.checkNews}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why FTI */}
        <section className="glass glass-gold rounded-2xl p-5 sm:p-6">
          <h2 className="section-title">{t.whyTitle}</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-3 py-3 font-extrabold text-[var(--muted)]">
                    {t.whyColTraditional}
                  </th>
                  <th className="px-3 py-3 font-extrabold text-[var(--gold-soft)]">
                    {t.whyColFti}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.whyRows.map(([left, right]) => (
                  <tr key={left} className="border-b border-white/5">
                    <td className="px-3 py-3 text-[var(--muted)]">{left}</td>
                    <td className="px-3 py-3 font-semibold">{right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Gated signals */}
        <section>
          <div className="mb-5">
            <h2 className="section-title">{t.gatedTitle}</h2>
            <p className="section-sub">{t.gatedSub}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {GATED.map((card) => (
              <article
                key={card.pair}
                className={`relative overflow-hidden rounded-2xl p-5 ${
                  card.accent === "gold" ? "glass glass-gold" : "glass glass-cyan"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="m-0 text-lg font-extrabold" dir="ltr">
                    {card.pair}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      card.bias === "BUY"
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "bg-rose-400/15 text-rose-300"
                    }`}
                  >
                    {card.bias}
                  </span>
                </div>
                <div className="blur-locked space-y-2 text-sm">
                  <div>Entry: {card.entry}</div>
                  <div>SL: {card.sl}</div>
                  <div>TP: {card.tp}</div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(5,9,19,0.55)] px-4 text-center backdrop-blur-[2px]">
                  <div className="mb-2 text-2xl" aria-hidden>
                    🔒
                  </div>
                  <p className="m-0 text-sm font-semibold">{t.lockedHint}</p>
                  <button
                    type="button"
                    className="btn-primary mt-3 !py-2 text-sm"
                    onClick={() => setLoginOpen(true)}
                  >
                    {t.memberLogin}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-[var(--muted)]">
        © 2026 FTI · Institutional Commodity Intelligence
      </footer>

      {loginOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="glass glass-gold w-full max-w-md rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="m-0 text-xl font-extrabold">{t.loginTitle}</h3>
              <button type="button" className="btn-ghost" onClick={() => setLoginOpen(false)}>
                {t.loginClose}
              </button>
            </div>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setLoginOpen(false);
              }}
            >
              <label className="text-sm">
                <span className="mb-1 block text-[var(--muted)]">{t.loginEmail}</span>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 outline-none focus:border-[var(--border-cyan)]"
                  placeholder="member@fti.local"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-[var(--muted)]">{t.loginPassword}</span>
                <input
                  type="password"
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 outline-none focus:border-[var(--border-cyan)]"
                  placeholder="••••••••"
                />
              </label>
              <button type="submit" className="btn-primary mt-2">
                {t.loginSubmit}
              </button>
              <p className="m-0 text-xs text-[var(--muted)]">{t.loginNote}</p>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GoldVisual() {
  return (
    <div className="relative mx-auto h-24 w-28" aria-hidden>
      <div className="absolute inset-x-2 bottom-1 h-16 rounded-md bg-gradient-to-b from-[#f6e27a] via-[#d4af37] to-[#8a6a14] shadow-[0_12px_24px_rgba(212,175,55,0.35)]" />
      <div className="absolute inset-x-4 top-3 h-10 rounded-sm bg-gradient-to-b from-[#fff3b0] via-[#e8c547] to-[#b8891c] opacity-95" />
      <div className="absolute inset-x-6 top-1 h-3 rounded-sm bg-[#fff8d0]/80 blur-[0.5px]" />
    </div>
  );
}

function OilVisual() {
  return (
    <div className="relative mx-auto h-24 w-20" aria-hidden>
      <div className="absolute inset-x-3 top-2 h-4 rounded-t-md bg-gradient-to-b from-[#67e8f9] to-[#0e7490]" />
      <div className="absolute inset-x-1 top-6 bottom-2 rounded-xl bg-gradient-to-b from-[#164e63] via-[#0f172a] to-[#020617] border border-cyan-300/30 shadow-[0_12px_24px_rgba(34,211,238,0.25)]" />
      <div className="absolute inset-x-4 top-10 h-8 rounded-md border border-cyan-200/20 bg-cyan-300/10" />
      <div className="absolute left-1/2 top-0 h-2 w-6 -translate-x-1/2 rounded-sm bg-cyan-200/70" />
    </div>
  );
}
