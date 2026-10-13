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

## Routes

- `/` — glassmorphic marketing landing + login modal  
- `/dashboard` — on-demand signal board  
- `/api/signal` — server proxy to Twelve Data  

## Deploy (recommended: Vercel + subdomain)

Next.js (API routes) should **not** be pointed at a normal Hostinger PHP document root.

**Best mapping for `signals.yourdomain.com`:**

1. Keep the app on **Vercel** (Node runtime).  
2. In Hostinger DNS for the subdomain, create a **CNAME** → `cname.vercel-dns.com` (or the target Vercel shows).  
3. In Vercel → Project → Domains → add `signals.yourdomain.com`.  
4. Set env `TWELVE_DATA_API_KEY` in Vercel.

You do **not** need to upload `.next` into Hostinger `public_html` for this setup.  
I cannot click hPanel for you — only DNS/domain linking on your side + Vercel domain attach.

### If you insist on Hostinger file hosting only
Static `output: 'export'` can fill a subdomain folder, but **`/api/signal` will not run** on plain PHP hosting. Live Twelve Data needs Node (Vercel) or Hostinger Node app hosting.

No shared database with Agricart ERP is required.

## FTI GitHub + MySQL

- GitHub origin: `https://github.com/fariduddinahmadtoor123-sudo/fti.git`
- Database: `u262659235_fti` (user `u262659235_fti_user`) — configure host/password in `.env.local`
- Isolated from Agricart ERP database

