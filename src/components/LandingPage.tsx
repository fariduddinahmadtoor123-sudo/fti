"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";

const features = [
  {
    title: "On-demand multi-timeframe",
    titleUr: "M1 سے H1 تک آن ڈیمانڈ سگنلز",
    body: "کوئی بیک گراؤنڈ پولنگ نہیں — صرف آپ کے بٹن پر Twelve Data جائزہ۔",
  },
  {
    title: "Session liquidity pulse",
    titleUr: "لائیو سیشن لیکویڈیٹی اشارہ",
    body: "کنکشن اور مارکیٹ سیشن کا صاف پریویو تاکہ اندھا اندھا اندراج نہ ہو۔",
  },
  {
    title: "Real-time risk alerts",
    titleUr: "ریئل ٹائم رسک الرٹس",
    body: "BUY / SELL / WAIT کارڈز رنگوں کے ساتھ — فوری فیصلے کے لیے۔",
  },
];

export function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="landing">
      <div className="landing__orb landing__orb--a" aria-hidden />
      <div className="landing__orb landing__orb--b" aria-hidden />
      <div className="landing__grid" aria-hidden />

      <nav className="glass-nav">
        <div className="glass-nav__brand">
          <span className="brand-mark" />
          <span>Signal Board</span>
        </div>
        <div className="glass-nav__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setLoginOpen(true)}>
            Login / Sign In
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setLoginOpen(true)}>
            Get Started
          </button>
        </div>
      </nav>

      <header className="hero glass-card">
        <p className="eyebrow">Commercial Trading Intelligence</p>
        <h1 className="hero__title">
          On-Demand Signal Dashboard
          <span>تجارتی ذہانت — صرف جب آپ مانگیں</span>
        </h1>
        <p className="hero__lede">
          Twelve Data سے لائیو M5 جائزہ، اردو سمری کارڈز، اور کریڈٹ بیسڈ رسائی — آپ کے Agricart ERP سے
          بالکل الگ، ہلکا اور محفوظ۔
        </p>
        <div className="hero__cta">
          <button type="button" className="btn btn--primary btn--lg" onClick={() => setLoginOpen(true)}>
            Get Started
          </button>
          <button type="button" className="btn btn--glass btn--lg" onClick={() => setLoginOpen(true)}>
            Login / Sign In
          </button>
          <Link href="/dashboard" className="btn btn--link">
            Preview dashboard →
          </Link>
        </div>
        <div className="hero__stats">
          <div>
            <strong>10+</strong>
            <span>Symbols</span>
          </div>
          <div>
            <strong>M1–H1</strong>
            <span>Timeframes</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Background loops</span>
          </div>
        </div>
      </header>

      <section className="features" aria-labelledby="features-title">
        <div className="section-head">
          <p className="eyebrow">Feature highlights</p>
          <h2 id="features-title">Built for clarity under pressure</h2>
        </div>
        <div className="features__grid">
          {features.map((f) => (
            <article key={f.title} className="glass-card feature-card">
              <h3>{f.title}</h3>
              <p className="feature-card__ur" dir="rtl">
                {f.titleUr}
              </p>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="preview glass-card" aria-label="Signal preview">
        <div className="preview__copy" dir="rtl">
          <p className="eyebrow">Live preview</p>
          <h2>سگنل کارڈ کا گلاس موڑک پریویو</h2>
          <p>سبز = بائے، سرخ = سیل، امبر = انتظار — موبائل اور ڈیسک ٹاپ دونوں پر صاف۔</p>
        </div>
        <div className="preview__cards">
          <div className="mini-signal mini-signal--buy">مضبوط بائے</div>
          <div className="mini-signal mini-signal--wait">انتظار کریں</div>
          <div className="mini-signal mini-signal--sell">مضبوط سیل</div>
        </div>
      </section>

      <footer className="landing__footer glass-card">
        <p>Signal Board · standalone from Agricart ERP</p>
        <button type="button" className="btn btn--primary" onClick={() => setLoginOpen(true)}>
          Open login
        </button>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
