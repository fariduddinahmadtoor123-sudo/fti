"use client";

import { useState, useTransition } from "react";
import { MARKET_SYMBOLS } from "@/lib/symbols";
import type { SignalSnapshot } from "@/lib/signal";
import { SignalCard } from "@/components/SignalCard";

type ApiOk = SignalSnapshot & {
  id: string;
  label: string;
  labelUr: string;
};

export function SignalBoard() {
  const [symbolId, setSymbolId] = useState("xauusd");
  const [data, setData] = useState<ApiOk | null>(null);
  const [errorUr, setErrorUr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function runReview() {
    setErrorUr(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/signal?symbol=${encodeURIComponent(symbolId)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) {
          setData(null);
          setErrorUr(json.messageUr || "درخواست ناکام رہی۔");
          return;
        }
        setData(json as ApiOk);
      } catch {
        setData(null);
        setErrorUr("نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
      }
    });
  }

  return (
    <div className="board">
      <header className="board__hero">
        <p className="board__brand">Signal Board</p>
        <h1 className="board__headline">آن ڈیمانڈ ٹریڈنگ سگنل</h1>
        <p className="board__lede">
          Twelve Data سے صرف بٹن دبانے پر M5 جائزہ — خودکار پولنگ نہیں، موجودہ ERP سے بالکل الگ۔
        </p>
      </header>

      <section className="board__controls" aria-label="Symbol controls">
        <label className="board__label" htmlFor="symbol">
          مارکیٹ سمبل
        </label>
        <div className="board__row">
          <select
            id="symbol"
            className="board__select"
            value={symbolId}
            onChange={(e) => setSymbolId(e.target.value)}
            disabled={pending}
          >
            {MARKET_SYMBOLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {s.labelUr}
              </option>
            ))}
          </select>
          <button type="button" className="board__btn" onClick={runReview} disabled={pending}>
            {pending ? "رہا ہے…" : "جائزہ لیں"}
          </button>
        </div>
        <div className="board__chips" role="list">
          {MARKET_SYMBOLS.slice(0, 4).map((s) => (
            <button
              key={s.id}
              type="button"
              role="listitem"
              className={`board__chip ${symbolId === s.id ? "is-active" : ""}`}
              onClick={() => setSymbolId(s.id)}
              disabled={pending}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <SignalCard data={data} loading={pending} errorUr={errorUr} />
    </div>
  );
}
