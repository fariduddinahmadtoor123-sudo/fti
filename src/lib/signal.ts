export type SignalDecision = "BUY" | "SELL" | "WAIT";

export type SignalSnapshot = {
  symbol: string;
  interval: string;
  price: number;
  ema50: number;
  rsi14: number;
  decision: SignalDecision;
  titleUr: string;
  summaryUr: string;
  asOf: string;
  source: "twelvedata" | "demo";
};

export function decideSignal(price: number, ema50: number, rsi14: number): {
  decision: SignalDecision;
  titleUr: string;
  summaryUr: string;
} {
  if (price > ema50 && rsi14 > 50 && rsi14 < 70) {
    return {
      decision: "BUY",
      titleUr: "مضبوط بائے",
      summaryUr: "قیمت ۵۰ ای ایم اے سے اوپر ہے اور آر ایس آئی ۵۰ سے ۷۰ کے درمیان ہے — خریداری کا موقع۔",
    };
  }

  if (price < ema50 && rsi14 > 30 && rsi14 < 50) {
    return {
      decision: "SELL",
      titleUr: "مضبوط سیل",
      summaryUr: "قیمت ۵۰ ای ایم اے سے نیچے ہے اور آر ایس آئی ۳۰ سے ۵۰ کے درمیان ہے — فروخت کا موقع۔",
    };
  }

  return {
    decision: "WAIT",
    titleUr: "انتظار کریں",
    summaryUr: "سمت ابھی واضح نہیں۔ اضافہ تصدیق کا انتظار کریں، جلدبازی سے پرہیز کریں۔",
  };
}
