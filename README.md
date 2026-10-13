# FTI

نئی FTI ویب ایپ — Hostinger سب ڈومین `fti.agricart.pk` پر۔

## موجودہ حالت

صرف خوش‌آمدید صفحہ۔ پرانا Signal Board سسٹم مکمل حذف کر دیا گیا ہے۔

## ٹیکنالوجی

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- Static export (`output: "export"`) تاکہ Hostinger shared hosting پر بھی ڈیپلائے ہو سکے
- MySQL: `u262659235_fti` (Hostinger)

## لوکل چلائیں

```bash
npm install
npm run dev
```

ایپ: [http://127.0.0.1:3461](http://127.0.0.1:3461)

## پروڈکشن بلڈ

```bash
npm run build
```

`out/` فولڈر Hostinger پر `public_html/fti` (یا سب ڈومین ڈاکروٹ) میں کاپی کریں۔

## ڈیٹا بیس

`.env.example` دیکھیں۔ سرور پر `DB_HOST=localhost` استعمال کریں۔ ریموٹ کنکشن کے لیے hPanel میں IP allow کریں۔

## GitHub

`https://github.com/fariduddinahmadtoor123-sudo/fti.git`
