import type { SignalSnapshot } from "@/lib/signal";

type Props = {
  data: (SignalSnapshot & { label?: string; labelUr?: string }) | null;
  loading?: boolean;
  errorUr?: string | null;
};

const tone: Record<string, string> = {
  BUY: "buy",
  SELL: "sell",
  WAIT: "wait",
};

export function SignalCard({ data, loading, errorUr }: Props) {
  if (loading) {
    return (
      <article className="signal-card signal-card--loading" dir="rtl">
        <p className="signal-card__eyebrow">سگنل کارڈ</p>
        <h2 className="signal-card__title">جائزہ لیا جا رہا ہے…</h2>
        <p className="signal-card__body">Twelve Data سے قیمت، ۵۰ EMA اور ۱۴ RSI منگوائی جا رہی ہے۔</p>
      </article>
    );
  }

  if (errorUr) {
    return (
      <article className="signal-card signal-card--error" dir="rtl">
        <p className="signal-card__eyebrow">خرابی</p>
        <h2 className="signal-card__title">ڈیٹا دستیاب نہیں</h2>
        <p className="signal-card__body">{errorUr}</p>
      </article>
    );
  }

  if (!data) {
    return (
      <article className="signal-card signal-card--idle" dir="rtl">
        <p className="signal-card__eyebrow">تیار</p>
        <h2 className="signal-card__title">سمبل چنیں اور جائزہ لیں</h2>
        <p className="signal-card__body">
          آن ڈیمانڈ موڈ: صرف بٹن دبانے پر درخواست جاتی ہے — پس منظر میں لوپ نہیں چلتا۔
        </p>
      </article>
    );
  }

  const kind = tone[data.decision] ?? "wait";

  return (
    <article className={`signal-card signal-card--${kind}`} dir="rtl">
      <div className="signal-card__top">
        <p className="signal-card__eyebrow">
          {data.labelUr ?? data.symbol} · M5
          {data.source === "demo" ? " · ڈیمو" : ""}
        </p>
        <span className={`signal-pill signal-pill--${kind}`}>{data.titleUr}</span>
      </div>

      <h2 className="signal-card__title">{data.titleUr}</h2>
      <p className="signal-card__body">{data.summaryUr}</p>

      <dl className="signal-metrics">
        <div>
          <dt>قیمت</dt>
          <dd>{formatNum(data.price)}</dd>
        </div>
        <div>
          <dt>۵۰ EMA</dt>
          <dd>{formatNum(data.ema50)}</dd>
        </div>
        <div>
          <dt>۱۴ RSI</dt>
          <dd>{formatNum(data.rsi14)}</dd>
        </div>
      </dl>

      <p className="signal-card__meta">
        {data.label ?? data.symbol} · اپڈیٹ: {new Date(data.asOf).toLocaleString("ur-PK")}
      </p>
    </article>
  );
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 5 });
}
