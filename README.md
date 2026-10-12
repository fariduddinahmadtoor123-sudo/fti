# Signal Board

Standalone **on-demand** trading signal web dashboard.  
Completely isolated from Agricart ERP / Hostinger / MT5 setups.

## Confirmed answers

1. **Viable & safe for existing projects?**  
   Yes — this repo does not touch Laravel, Filament, MySQL ERP tables, or Hostinger. Deploy it separately (e.g. Vercel).

2. **Recommended stack**  
   **Next.js (App Router) + TypeScript + Tailwind CSS** — fast to ship on Vercel, API key stays on the server via Route Handlers.

3. **Behavior**  
   - No background polling loops  
   - Fetch only when user clicks **جائزہ لیں**  
   - Default analysis interval: **M5 (5-minute)**  
   - Decision: Price vs 50 EMA + 14 RSI → BUY / SELL / WAIT (Urdu card)

## Quick start

```bash
npm install
cp .env.example .env.local
# put TWELVE_DATA_API_KEY=... into .env.local (optional for demo mode)

npm run dev
# http://127.0.0.1:3457
```

Open the app, keep **XAU/USD** selected (default), click **جائزہ لیں**.

## API

`GET /api/signal?symbol=xauusd`

Server-side proxy to Twelve Data (`/price`, `/ema`, `/rsi`).  
Includes a ~25s gate when a real API key is present to respect free-tier **8 credits/min** (3 calls per review).

## Deploy (Vercel)

1. Import this repo in Vercel  
2. Set env `TWELVE_DATA_API_KEY`  
3. Deploy  

No shared database with ERP is required.
