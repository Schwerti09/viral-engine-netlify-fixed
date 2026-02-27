# Viral-Engine (Fullstack SaaS Starter)

Modernes Fullstack-Repo (Next.js App Router + Prisma/Postgres) für eine TikTok-orientierte „Viral-Engine“.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind (Dark Mode via `html.dark`)
- Prisma + Postgres
- JWT Auth (HttpOnly Cookie) + DB Sessions (revokable)
- Multi-Workspace (Rollen: OWNER/ADMIN/MEMBER)
- Trend-Radar, Idea Studio (KI-Stub), Analytics
- API Keys + Audit Logs
- Netlify Deploy (via `@netlify/plugin-nextjs`)

## Lokal starten

```bash
cp .env.example .env

docker compose up -d
npm i

npm run db:generate
npm run db:migrate
npm run db:seed

npm run dev
```

App: http://localhost:3000

**Demo-Login (nach Seed):**
- demo@viral.engine
- demo1234

## Deploy: GitHub → Netlify
1. Repo auf GitHub erstellen und pushen.
2. In Netlify "New site from Git" auswählen.
3. Environment Variables setzen:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - optional: `NEXT_PUBLIC_APP_URL`, Stripe Keys
4. Build: Netlify nutzt `netlify.toml` und den Next.js Plugin.

### Datenbank für Netlify
Für Serverless ist ein "serverless-friendly" Postgres sinnvoll (z.B. Neon). Wichtig: Connection Pooling.

### Prisma Migrations in Production
In CI/Netlify kannst du z.B. als Build Step ergänzen:

```bash
npx prisma migrate deploy
```

(oder als Netlify Build Plugin Hook). Für MVP reicht oft manuell.

## Wo du echte TikTok-Integration einhängst
- Trends/Discovery: `src/app/api/trends/route.ts`
- Metrics ingest: `src/app/api/analytics/overview/route.ts` + Cron/Scheduled Function

## Wo du echte KI einhängst
- `src/lib/ai.ts`

Der Stub ist deterministisch (gut für Tests). Ersetze `generateIdea()` durch OpenAI/Anthropic/local LLM.

## Security Notes (MVP)
- JWT im HttpOnly Cookie, Sessions in DB (revokable)
- Edge middleware macht nur "fast gating". Die echte Prüfung passiert serverseitig.
- API Keys werden gehasht gespeichert (SHA-256), Klartext wird nur einmal ausgegeben.

---

Built to ship. 🚀


---
[![Built with ZIP-SHIP REVOLUTION](https://img.shields.io/badge/Built%20with-ZIP--SHIP%20REVOLUTION-00F0FF?style=for-the-badge&logo=github&logoColor=black)](https://zip-ship-revolution.com?utm_source=readme_badge)
