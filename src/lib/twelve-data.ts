import { decideSignal, type SignalSnapshot } from "@/lib/signal";

const BASE = "https://api.twelvedata.com";

type Json = Record<string, unknown>;

function demoSnapshot(symbol: string): SignalSnapshot {
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

async function tdGet(path: string, params: Record<string, string>): Promise<Json> {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${BASE}/${path}?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Twelve Data HTTP ${res.status} on /${path}`);
  }
  const data = (await res.json()) as Json;
  if (data.status === "error") {
    throw new Error(String(data.message || `Twelve Data error on /${path}`));
  }
  return data;
}

function latestFromValues(data: Json, field: string): number {
  const values = data.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`Missing values for ${field}`);
  }
  const row = values[0] as Json;
  const n = Number(row[field]);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${field} value`);
  }
  return n;
}

export async function fetchSignalSnapshot(symbol: string): Promise<SignalSnapshot> {
  const apiKey = process.env.TWELVE_DATA_API_KEY?.trim();

  if (!apiKey) {
    return demoSnapshot(symbol);
  }

  const interval = "5min";

  const [priceData, emaData, rsiData] = await Promise.all([
    tdGet("price", { symbol, apikey: apiKey }),
    tdGet("ema", {
      symbol,
      interval,
      time_period: "50",
      series_type: "close",
      apikey: apiKey,
    }),
    tdGet("rsi", {
      symbol,
      interval,
      time_period: "14",
      series_type: "close",
      apikey: apiKey,
    }),
  ]);

  const price = Number(priceData.price);
  if (!Number.isFinite(price)) {
    throw new Error("Invalid price value");
  }

  const ema50 = latestFromValues(emaData, "ema");
  const rsi14 = latestFromValues(rsiData, "rsi");
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
