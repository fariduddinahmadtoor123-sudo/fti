# FTI

Institutional commodity intelligence landing for Gold (XAU/USD) and Crude Oil (WTI).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Static export for Hostinger (`output: "export"`)
- Font: **Arial, sans-serif only** (no webfonts)

## Features (landing)

- English / اردو language toggle (dir + copy)
- Glassmorphic dark theme (`#050913`)
- Live Sydney / Tokyo / London / New York session grid
- Macro risk banner with traffic lights + countdown
- Sentiment gauge, winners ticker, confluence scores
- Why FTI comparison table
- Gated signal cards (blur + login)

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3461](http://127.0.0.1:3461)

## Production build

```bash
npm run build
```

Deploy the `out/` folder to the Hostinger subdomain docroot (`public_html/fti`).

## Database

See `.env.example` for Hostinger MySQL (`u262659235_fti`). Auth/DB wiring comes in a later phase.

## GitHub

`https://github.com/fariduddinahmadtoor123-sudo/fti.git`
