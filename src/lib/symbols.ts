export type MarketSymbol = {
  id: string;
  twelvedata: string;
  label: string;
  labelUr: string;
};

/** Curated watchlist — fetched only on explicit user click. */
export const MARKET_SYMBOLS: MarketSymbol[] = [
  { id: "xauusd", twelvedata: "XAU/USD", label: "XAU/USD", labelUr: "گولڈ" },
  { id: "eurusd", twelvedata: "EUR/USD", label: "EUR/USD", labelUr: "یورو / ڈالر" },
  { id: "gbpusd", twelvedata: "GBP/USD", label: "GBP/USD", labelUr: "پاؤنڈ / ڈالر" },
  { id: "usdjpy", twelvedata: "USD/JPY", label: "USD/JPY", labelUr: "ڈالر / ین" },
  { id: "xagusd", twelvedata: "XAG/USD", label: "XAG/USD", labelUr: "سلور" },
  { id: "wti", twelvedata: "WTICO/USD", label: "Crude Oil", labelUr: "کروڈ آئل" },
  { id: "us30", twelvedata: "DJI", label: "US 30", labelUr: "یو ایس ۳۰" },
  { id: "btcusd", twelvedata: "BTC/USD", label: "BTC/USD", labelUr: "بٹ کوائن" },
  { id: "ethusd", twelvedata: "ETH/USD", label: "ETH/USD", labelUr: "ایتھیریم" },
  { id: "nas100", twelvedata: "IXIC", label: "NAS100", labelUr: "نسڈیک" },
];

export function findSymbol(id: string): MarketSymbol | undefined {
  return MARKET_SYMBOLS.find((s) => s.id === id);
}
