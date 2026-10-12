import { decideSignal, type SignalSnapshot } from "@/lib/signal";

const BASE = "https://api.twelvedata.com";

type TdValueResponse = {
  value?: string;
  status?: string;
  message?: string;
  code?: number;
};

function demoSnapshot(symbol: string): SignalSnapshot {
  // Deterministic demo numbers so UI works without a key.
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const price = 2300 + (seed % 97) + 0.35;
  const ema50 = price * (seed % 2 === 0 ? 0.998 : 1.002);
  const rsi14 = 42 + (seed % 25);
  const decided = decideSignal(price, ema50, rsi14);

  return {
    symbol,
    interval: "5min",
    price: Number(price.toFixed(2)),
    ema50: Number(ema50.toFixed(2)),
    rsi14: Number(rsi14.toFixed(2)),
    ...decided,
    asOf: new Date().toISOString(),
    source: "demo",
  };
}

async function fetchIndicator(
  path: "price" | "ema" | "rsi",
  symbol: string,
  apiKey: string,
  extra: Record<string, string> = {},
): Promise<number> {
  const params = new URLSearchParams({
    symbol,
    apikey: apiKey,
    ...extra,
  });

  const res = await fetch(`${BASE}/${path}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Twelve Data HTTP ${res.status} on /${path}`);
  }

  const data = (await res.json()) as TdValueResponse;
  if (data.status === "error" || data.value == null) {
    throw new Error(data.message || `Twelve Data error on /${path}`);
  }

  const n = Number(data.value);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid numeric value from /${path}`);
  }

  return n;
}

export async function fetchSignalSnapshot(symbol: string): Promise<SignalSnapshot> {
  const apiKey = process.env.TWELVE_DATA_API_KEY?.trim();

  if (!apiKey) {
    return demoSnapshot(symbol);
  }

  const interval = "5min";

  const [price, ema50, rsi14] = await Promise.all([
    fetchIndicator("price", symbol, apiKey),
    fetchIndicator("ema", symbol, apiKey, {
      interval,
      time_period: "50",
      series_type: "close",
    }),
    fetchIndicator("rsi", symbol, apiKey, {
      interval,
      time_period: "14",
      series_type: "close",
    }),
  ]);

  const decided = decideSignal(price, ema50, rsi14);

  return {
    symbol,
    interval,
    price,
    ema50,
    rsi14,
    ...decided,
    asOf: new Date().toISOString(),
    source: "twelvedata",
  };
}
