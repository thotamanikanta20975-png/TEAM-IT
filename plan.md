# FoodRescue – Premium Food Waste Donation Platform

CSE hackathon project plan and requirements. Living document — we build step by step and update this as decisions are made. Core flow, all four dashboards, auth, AI matching engine, ImageKit, and Supabase are built and working — see §11 for what's done vs. outstanding, and `design-system/foodrescue/MASTER.md` for the UI design system.

## 1. Vision

FoodRescue is a premium, professional, startup-quality platform that reduces food wastage by intelligently coordinating the *complete journey* of surplus food — from the people/businesses who have it, to the NGOs and volunteers who get it to people in need. The goal for the hackathon is to demonstrate: smart matching technology, real-world problem solving, strong frontend design/UX, and innovation — not just a basic CRUD donation board.

## 2. Users

1. **Donor** — restaurants, hotels, businesses, individuals with surplus food
2. **NGO** — organizations that receive and distribute donated food
3. **Volunteer** — collects food from donors, delivers it to NGOs
4. **Admin** — manages users, donations, deliveries, and platform activity

## 3. Core Process Flow

```
Donor posts surplus food
   → FoodRescue's AI Matching Engine finds the best suitable NGO
   → NGO accepts the donation
   → Volunteer accepts the pickup
   → Volunteer picks up the food
   → Food is delivered to the NGO
   → Donation is marked completed
   → Platform updates social impact statistics
```

## 4. AI Matching Engine (flagship feature)

This is the platform's core "smart" feature — not a bolt-on chatbot or image tool, but the engine that actually drives the donor→NGO→volunteer journey.

For every new donation, it automatically scores and ranks candidate NGOs (and later, volunteers) using:

- **Distance** — proximity between donor, NGO, and volunteer (via Google Maps)
- **Food quantity** — donation size vs. NGO's stated capacity/current need
- **Urgency / expiry time** — how soon the food needs to be collected before it spoils
- **Availability** — NGO/volunteer currently active and able to accept
- **Reliability** — track record (past completed pickups, response time, ratings)

Implementation: a weighted scoring algorithm (deterministic, explainable, fast) — presented in the product as "AI-based smart matching." This keeps the demo reliable and fast while still being a genuinely intelligent recommendation system worth presenting to judges.

## 5. Tech Stack (decided)

- **Framework**: Next.js (App Router — UI + API routes in one codebase)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: TBD when we scaffold auth (likely NextAuth — email/password and/or Google login)
- **Maps/Location**: Google Maps API — geocoding, distance calculation, and a live map showing donor/NGO/volunteer locations
- **Smart Matching**: Rule-based weighted scoring engine (see §4) — no external LLM call required for matching itself
- **Styling**: Tailwind CSS (default assumption — confirm)
- **Deployment**: TBD (Vercel is the natural fit for Next.js; DB via Neon/Supabase/Railway)

## 6. Core Features

- [ ] Registration/login with role selection (Donor / NGO / Volunteer / Admin)
- [ ] Donor: post a surplus food donation
  - Food type/category, quantity, description
  - Pickup location (address, geocoded)
  - Expiry / best-before time (urgency indicator)
  - Photo upload
- [ ] AI Matching Engine ranks candidate NGOs (§4) the moment a donation is posted
- [ ] NGO: view AI-matched incoming donations, accept/decline
- [ ] Volunteer: view available/assigned pickups, accept, mark picked up
- [ ] Status lifecycle tracking per donation:
  `Posted → Matched → Accepted by NGO → Volunteer Assigned → Picked Up → Delivered → Completed`
  (plus `Expired` / `Cancelled` edge states)
- [ ] Notifications on status changes (in-app minimum; email optional)
- [ ] Donation history / timeline view per donation
- [ ] Social impact stats update automatically on completion (meals saved, waste diverted, people fed)

## 7. Dashboards (premium, animated, data-rich)

- **Donor dashboard**: active donations, history, total meals/kg donated, personal impact stats
- **NGO dashboard**: AI-matched incoming donations, accepted donations, assigned volunteers, distribution stats
- **Volunteer dashboard**: available/assigned pickups, delivery history, contribution stats
- **Admin dashboard**: platform-wide analytics (total food saved, active users, donations by status/region), user verification/moderation, map of live activity

## 8. Premium UI/UX Requirements

- [ ] Strong visual identity (brand name, logo, color palette, typography) — feels like a startup, not a student CRUD app
- [ ] Polished landing page: mission, how-it-works, impact numbers, calls to action per role
- [ ] Smooth animations/transitions (page load, status changes, dashboard widgets)
- [ ] Live map view (Google Maps) showing donor/NGO/volunteer pins and donation routes
- [ ] Real-time-ish status tracking UI (polling or websockets) for a donation in progress
- [ ] Charts/graphs for analytics (donation trends, top contributors, impact over time)
- [ ] Fully responsive/mobile-friendly (donors and volunteers likely to use on phones)
- [ ] Search/filter donations (location, food type, urgency, status)

## 9. Data Model (draft — refine at schema step)

- **User** (id, name, email, password/auth, role, phone, address, lat/lng, createdAt)
- **DonorProfile** (userId, organizationName?, type: restaurant/hotel/business/individual)
- **NGOProfile** (userId, organizationName, capacity, serviceArea, verified)
- **VolunteerProfile** (userId, vehicleType?, availability, reliabilityScore)
- **Donation** (id, donorId, foodType, quantity, unit, description, photoUrl, pickupAddress, lat/lng, expiryAt, urgency, status, matchedNgoId, assignedVolunteerId, createdAt, updatedAt)
- **StatusHistory** (id, donationId, status, changedBy, timestamp, note)
- **MatchScore** (donationId, candidateId, candidateType, score, factors JSON) — powers "why this match" explanation in UI
- **Feedback/Rating** (donationId, fromUserId, toUserId, rating, comment) — feeds reliability score
- **ImpactStats** (aggregate or computed: total meals saved, kg diverted, people fed, active donors/NGOs/volunteers)

## 10. Open Questions / Decisions Needed

- [ ] Auth approach: NextAuth (credentials + Google) vs. custom, vs. Clerk/Auth0 vs. Supabase Auth (now that Supabase is in play — see §13)
- [ ] Styling library: Tailwind CSS (default) — confirm
- [x] DB hosting: **Supabase** (MCP server connected 2026-08-11, project ref `xxdiupmhzppfqobqaane`) — still open: keep Prisma as ORM on top of Supabase Postgres, or use Supabase's client library/generated types directly?
- [ ] Google Maps API key — need to obtain and provide
- [x] Photo storage: ImageKit (connected and verified — see §12)
- [x] Deployment target: Vercel (frontend/API) + Supabase (DB) — provisionally, not yet deployed
- [x] Photo uploads: ImageKit (connected and verified)
- [ ] Notifications: in-app only, or also email (e.g., via Resend/SendGrid)?
- [ ] Brand identity: name confirmed as "FoodRescue" — landing page copy/visual direction already has a "rescue window" theme (see `src/components/marketing/`)
- [x] Auth approach: **Supabase Auth** (email/password, via `@supabase/ssr`), with `Profile` rows in Postgres (Prisma) keyed to `auth.users.id`. Email confirmation is currently ON in the Supabase project (new signups land on `/login?confirmEmail=1`).
- [x] Prisma vs. Supabase client for data: **decided — both, different jobs.** `@supabase/ssr` is used only for auth (`supabase.auth.signUp/getUser`, session cookies via `src/proxy.ts`). All actual data reads/writes (profiles, donations, etc.) go through **Prisma** with a direct `DATABASE_URL` connection, which runs as the `postgres` role and bypasses RLS. Schema migrations are applied via the Supabase MCP server (`apply_migration`), not `prisma migrate`.

## 11. Build Order (proposed)

1. ~~Project scaffolding~~ ✅ Next.js + TypeScript + Tailwind. ImageKit connected & verified (§12). Supabase MCP connected & authenticated (§13).
2. ~~Database schema + migrations~~ ✅ Schema applied to Supabase (`init_foodrescue_schema` migration): `profiles`, `donor_profiles`, `ngo_profiles`, `volunteer_profiles`, `donations`, `status_history`, `match_scores`, `feedback` — all RLS-enabled. Mirrored in `prisma/schema.prisma`, generated client in `src/generated/prisma/`. `DATABASE_URL` configured in `.env.local` (2026-08-11) and connection verified (raw query + `prisma validate` + a live signup smoke test through the browser, test row cleaned up after).
   - ⚠️ Follow-up: all 8 tables have RLS **enabled with zero policies** (Supabase advisor: `rls_enabled_no_policy`, INFO level). Currently harmless — the app never queries these tables via the Supabase client/anon key, only Prisma (bypasses RLS) — but will need real policies before using Supabase Realtime or any client-side Supabase queries on these tables (e.g. for the live status-tracking UI in §8).
3. ~~Auth + role-based registration/login~~ ✅ `/signup` and `/login` pages exist and work end-to-end (Supabase Auth + Prisma profile creation verified live). `src/lib/auth.ts` has `requireProfile`/`requireRole` helpers; `src/proxy.ts` handles session refresh middleware.
4. ~~Donor flow: post donation form~~ ✅ `src/app/dashboard/donor/new/` — full form (food type, quantity/unit, description, pickup address + deadline, urgency, optional ImageKit photo), server action geocodes the address (free, no API key — see `src/lib/geocode.ts`) and triggers matching on submit.
5. ~~AI Matching Engine~~ ✅ `src/lib/matching.ts` — real weighted scoring (distance/urgency/quantity/availability/reliability, same weights as the landing page), writes `MatchScore` rows for every candidate NGO considered, not just the winner.
6. ~~NGO flow: view matches, accept~~ ✅ `src/app/dashboard/ngo/` — accept/decline on matched donations, in-progress tracking.
7. ~~Volunteer flow~~ ✅ `src/app/dashboard/volunteer/` — accept pickup, mark picked up, mark delivered.
8. ~~Status tracking + donation history UI~~ ✅ `src/app/dashboard/donations/[id]/page.tsx` — full detail page with a `StatusTimeline` stepper and a `MatchScoreBreakdown` component that visualizes the *real* per-factor match scores for the winning NGO (plus any other candidates considered) — verified live end-to-end 2026-08-12.
9. ~~Dashboards (Donor, NGO, Volunteer, Admin) with stats~~ ✅ all four built, redesigned 2026-08-12 with shared components (`StatTile`, `EmptyState`, `DonationRow`, `BarStat`) — see `design-system/foodrescue/MASTER.md`.
10. ~~Landing page + visual identity + polish~~ ✅ dark "ops/logistics" visual identity (Chakra Petch/IBM Plex, amber/teal/blue role-coded palette) — already premium-quality before the 2026-08-12 pass, which focused on bringing the dashboards up to the same bar.
11. Google Maps integration — ✅ built (`src/components/DonationMap.tsx`, night-styled, used on the donation detail page), **⚠️ needs `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`** — currently shows a graceful "add your API key" placeholder instead. Distance *scoring* already works without it (free Nominatim geocoding); the key is only for the visual map display.
12. Analytics/charts + social impact stats — ✅ admin dashboard has real stat tiles + a status-breakdown bar chart; donor dashboard has personal stats. No dedicated public "impact" page yet (landing page stats are still illustrative/static numbers, not wired to the DB).
13. Notifications — not yet built (in-app or email)
14. Testing + demo prep (seed data, demo script, pitch narrative) — not yet started

## 12. ImageKit Setup (connected — needs your credentials)

Code is wired up; nothing works until real keys are added.

**Files added:**
- `src/lib/imagekit.ts` — server-side env var accessor (throws a clear error if keys are missing)
- `src/app/api/upload-auth/route.ts` — server route that signs upload requests (private key never leaves the server)
- `src/components/ImageUploader.tsx` — reusable client upload widget (file input + progress + calls `onUploaded(url, fileId)`)
- `src/app/layout.tsx` — wrapped in `ImageKitProvider` so `<Image>`/`<Video>` components work anywhere
- `.env.example` — documents the required variables (committed)
- `.env.local` — real values go here (git-ignored, currently empty placeholders)

**Status: ✅ Connected and verified (2026-08-11).** Real credentials are in `.env.local` (URL endpoint `https://ik.imagekit.io/5rinbs2sa`), and a live test upload/delete against the ImageKit API confirmed the whole pipeline works end-to-end. This will get used for donor food photos and NGO/volunteer profile images once those forms are built.

## 13. Supabase MCP Setup (added — needs your authentication)

Supabase is now the chosen database host (project ref `xxdiupmhzppfqobqaane`). An MCP server was added so Claude Code can query docs, inspect the database schema, manage branches, and debug directly against this Supabase project.

**Done:**
- `.mcp.json` created at the project root registering the `supabase` HTTP MCP server (scoped to this project)
- Supabase Agent Skills installed (`Supabase`, `Postgres Best Practices`) — symlinked into `.agents/skills/` for Claude Code to reference. Note: the automated risk scan flagged the `supabase` skill as "Medium" risk on Snyk (0 alerts on Socket) — worth a skim of `.agents/skills/supabase/` before leaning on it heavily, standard caution for any third-party skill.

**Status: ✅ Authenticated and in active use.** The MCP tools (`list_tables`, `execute_sql`, `get_advisors`, etc.) are live and were used to inspect the schema and clean up test data. `DATABASE_URL` is configured in `.env.local` (see §11 step 2) and verified working end-to-end, including a real signup through the browser.

Resolved: Prisma is the ORM for all app data access (direct `DATABASE_URL` connection); Supabase client is auth-only; schema changes go through the MCP's `apply_migration`, not `prisma migrate`. See §10.

## 14. UI Redesign Pass (2026-08-12)

Ran via the `ui-ux-pro-max` skill. The landing page and auth pages were already premium-quality going in (dark "ops/logistics" identity, custom SVG hero animation, real matching-factor visualization) — this pass focused entirely on bringing the **dashboard/app surfaces** up to that same bar, since they were plain bordered list rows with no icons, no data visualization, and a lot of duplicated markup.

**Added:**
- `design-system/foodrescue/MASTER.md` — documents the existing tokens/fonts/motion/component conventions as the source of truth going forward
- `src/components/icons.tsx` — shared line-icon set matching the app's existing hand-rolled SVG style (no new icon-library dependency)
- `src/components/dashboard/{StatTile,EmptyState,DonationRow,BarStat}.tsx` — shared primitives, applied across all four dashboards
- `src/components/StatusTimeline.tsx` — stepper visual for the donation detail page's status history
- `src/components/MatchScoreBreakdown.tsx` — **wired to real `MatchScore` data** (distance/urgency/quantity/availability/reliability per candidate NGO) — previously this data existed in the DB but was never shown anywhere in the UI; now it's a "why this match" section on the donation detail page
- Polished `src/app/dashboard/layout.tsx` header (avatar initial, role chip) and the donation form's `<select>` styling (custom chevron)
- Fixed one pre-existing lint error in `src/components/DonationMap.tsx` (synchronous `setState` in an effect) found while verifying

**Verified live** (not just build/typecheck): full donor → NGO accept → volunteer pickup → delivered flow through the actual browser UI, using temporary QA accounts created directly via the Supabase MCP (real signups were blocked by Supabase's email rate limit after a couple of attempts) — cleaned up afterward. Confirmed no console errors, no horizontal overflow at 375px, and `npm run build` / `tsc --noEmit` / `npm run lint` all pass clean.

**Not done in this pass**: no new dependencies added (kept the hand-rolled SVG/CSS approach deliberately, per the design system doc); landing page's stat numbers are still static/illustrative, not wired to real DB aggregates; Google Maps still needs an API key to show the actual map (distance scoring already works without it).

---
*This plan will evolve as we build. Update checkboxes and sections as decisions are made. Next step: awaiting the user's next instruction.*
