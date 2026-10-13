export type SessionId = "sydney" | "tokyo" | "london" | "newyork";

export type SessionDef = {
  id: SessionId;
  name: string;
  /** Inclusive start hour in UTC (0–23) */
  startUtc: number;
  /** Exclusive end hour in UTC (0–23), supports wrap past midnight */
  endUtc: number;
};

export const SESSIONS: SessionDef[] = [
  { id: "sydney", name: "Sydney", startUtc: 22, endUtc: 7 },
  { id: "tokyo", name: "Tokyo", startUtc: 0, endUtc: 9 },
  { id: "london", name: "London", startUtc: 8, endUtc: 17 },
  { id: "newyork", name: "New York", startUtc: 13, endUtc: 22 },
];

function hourOpen(hour: number, start: number, end: number): boolean {
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export function isSessionOpen(session: SessionDef, date = new Date()): boolean {
  return hourOpen(date.getUTCHours(), session.startUtc, session.endUtc);
}

export type OverlapInfo = {
  labels: string[];
  level: "peak" | "mild" | "none";
};

export function getOverlap(date = new Date()): OverlapInfo {
  const open = SESSIONS.filter((s) => isSessionOpen(s, date)).map((s) => s.name);
  const set = new Set(open);
  if (set.has("London") && set.has("New York")) {
    return { labels: ["London", "New York"], level: "peak" };
  }
  if (set.has("Tokyo") && set.has("London")) {
    return { labels: ["Tokyo", "London"], level: "mild" };
  }
  if (set.has("Sydney") && set.has("Tokyo")) {
    return { labels: ["Sydney", "Tokyo"], level: "mild" };
  }
  if (open.length >= 2) {
    return { labels: open, level: "mild" };
  }
  return { labels: [], level: "none" };
}

/** Demo macro event: next occurrence of Wednesday 12:30 UTC (typical CPI window). */
export function nextCoreCpiRelease(from = new Date()): Date {
  const d = new Date(from.getTime());
  d.setUTCMinutes(30, 0, 0);
  d.setUTCHours(12);
  // Advance to next Wednesday (3)
  const day = d.getUTCDay();
  let add = (3 - day + 7) % 7;
  if (add === 0 && from.getTime() >= d.getTime()) add = 7;
  d.setUTCDate(d.getUTCDate() + add);
  return d;
}

export type ImpactLevel = 1 | 2 | 3;

export function impactFromMs(ms: number): ImpactLevel {
  const hours = ms / 3_600_000;
  if (hours <= 2) return 3;
  if (hours <= 24) return 2;
  return 1;
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
