import { NextResponse } from "next/server";
import { findSymbol } from "@/lib/symbols";
import { fetchSignalSnapshot } from "@/lib/twelve-data";

/** Simple process-local gate to stay under free-tier 8 req/min (3 calls/click). */
let lastFetchAt = 0;
const MIN_GAP_MS = 25_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = (searchParams.get("symbol") || "xauusd").toLowerCase();
  const market = findSymbol(id);

  if (!market) {
    return NextResponse.json({ error: "Unknown symbol." }, { status: 400 });
  }

  const now = Date.now();
  const waitMs = lastFetchAt + MIN_GAP_MS - now;
  if (lastFetchAt > 0 && waitMs > 0 && process.env.TWELVE_DATA_API_KEY) {
    return NextResponse.json(
      {
        error: "rate_limited",
        messageUr: "کریڈٹ بچانے کے لیے چند سیکنڈ انتظار کریں، پھر دوبارہ جائزہ لیں۔",
        retryAfterSec: Math.ceil(waitMs / 1000),
      },
      { status: 429 },
    );
  }

  try {
    if (process.env.TWELVE_DATA_API_KEY) {
      lastFetchAt = Date.now();
    }

    const snapshot = await fetchSignalSnapshot(market.twelvedata);
    return NextResponse.json({
      ...snapshot,
      id: market.id,
      label: market.label,
      labelUr: market.labelUr,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fetch failed";
    return NextResponse.json(
      {
        error: "upstream",
        message,
        messageUr: "ڈیٹا نہیں مل سکا۔ API کی یا سمبل چیک کریں۔",
      },
      { status: 502 },
    );
  }
}
