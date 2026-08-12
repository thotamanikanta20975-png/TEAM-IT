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

## 15. Admin Role, Management UI & Real RLS Policies (2026-08-12)

Closed the §11 follow-up ("all 8 tables have RLS enabled with zero policies") and expanded the admin dashboard from stats-only to full user/donation management.

**Schema:** added `profiles.active` (boolean, default `true`) — admin-controlled suspend/reactivate flag, doesn't affect any existing row.

**RLS (applied via Supabase MCP, all 8 tables):** every table now has real, tested policies — `private.is_admin()` (SECURITY DEFINER helper, non-exposed `private` schema) plus owner-scoped and admin-full-access policies per table. Three `BEFORE UPDATE` triggers guard privilege-escalation columns (`profiles.role`/`active`, `ngo_profiles.verified`, `volunteer_profiles.reliabilityScore`) so a non-admin can't self-promote, self-verify, or inflate their own trust score even if these tables were ever queried client-side. **Important nuance**: the guard triggers only fire when `auth.uid()` is non-null (a real Supabase-Auth JWT context) — Prisma's direct `DATABASE_URL` connection has no JWT, so it's exempt by design and stays gated by the app-layer `requireRole("ADMIN")` checks instead (same pattern as the rest of the app, see §13's resolved architecture). Verified live: direct SQL role/active toggles succeed (trusted path), and `get_advisors` shows zero `rls_enabled_no_policy` findings post-migration.

**App-layer protection:** every admin route/action still calls `requireRole("ADMIN")` (existing pattern, unchanged) — this is the real enforcement for the running app; RLS is defense-in-depth for any future client-side/Realtime Supabase usage.

**Added:**
- `src/app/dashboard/admin/donors/page.tsx`, `.../ngos/page.tsx`, `.../volunteers/page.tsx`, `.../donations/page.tsx` — full list views (suspend/reactivate any account, verify/unverify NGOs, cancel a non-terminal donation)
- `src/components/dashboard/AdminNav.tsx` — sub-nav tying the admin overview + 4 new pages together
- `setUserActive`, `unverifyNgo`, `cancelDonation` in `src/app/dashboard/admin/actions.ts` (alongside existing `verifyNgo`)
- Suspended-user handling: `requireProfile()` signs out + redirects to `/login?suspended=1` if `active=false`; sign-in itself also checks and blocks with an inline error

**Verified**: `tsc --noEmit`, `npm run lint`, `npm run build` all clean; confirmed via `curl` against the running dev server that all 5 new `/dashboard/admin/*` routes 307-redirect unauthenticated requests to `/login` (route protection live, not just compiling), and that the pre-existing donor/NGO/volunteer routes are unaffected. Full browser click-through wasn't done (no `chromium-cli` installed) — worth a manual pass once an admin account exists.

**Not done**: no UI for editing NGO capacity/service radius or deleting accounts outright (suspend was the agreed scope, not delete); donation `Cancel` is a blunt admin override (sets `CANCELLED` + status-history note), no bulk actions or filters on the donations list yet.

## 16. Full UI/UX Redesign — Warm "Food Rescue" Identity (2026-08-13)

Judge feedback: *"The UI does not visually match the project statement."* Full frontend redesign around the actual donor→NGO→volunteer→people-fed story, replacing the previous dark "ops/logistics" identity end-to-end. Backend, database, RLS, auth, matching algorithm, and ImageKit integration were **not** touched — see `design-system/foodrescue/MASTER.md` for the full token/component reference; this section is the change log.

**Foundation:**
- `src/app/globals.css` — new palette (cream `#faf5ec` bg, white cards, warm charcoal text, deep-green `#2f6b45` primary, leafy-green `#6fa84a`, burnt-orange `#e07b39`, gold `#d9a441`, new `--danger` red token), radius bumped to a two-tier 12px/rounded-2xl/rounded-3xl system, `.route-pulse` renamed/rebuilt as `.flow-pulse`.
- `src/app/layout.tsx` — fonts swapped: Chakra Petch → **Fraunces** (warm serif display), IBM Plex Sans → **Plus Jakarta Sans** (body); IBM Plex Mono kept for data/labels.
- Role color remap: Donor = orange (was amber), NGO = green (was teal), Volunteer = gold (was blue) — `dashboard/layout.tsx`'s `ROLE_STYLE`, `StatusBadge`, `StatusTimeline`, `DonationRow` urgency colors, `BarStat`/`MatchScoreBreakdown` gradients, `DonationMap`'s Google Maps style + marker/polyline colors all updated to match (map went from a dark night style to a warm cream style).
- 5 new icons (`IconLeaf`, `IconHandHeart`, `IconBike`, `IconTarget`, `IconEye`) added to `src/components/icons.tsx` in the existing hand-rolled stroke style.

**New reusable components:**
- `src/components/LifecycleTracker.tsx` — donation status stepper (done/current/upcoming nodes + red terminal banner for cancelled/expired), used on the donation detail page (6-stage) and volunteer dashboard (3-stage, with an `activeLabel` override so `VOLUNTEER_ASSIGNED` reads "On the way" while current).
- `src/components/MatchChips.tsx` — compact "92% match / Nearby / High urgency" row for list views, reading the same real `MatchScore` data as `MatchScoreBreakdown`.
- `src/lib/impact.ts` — `estimateMeals()`, a labeled (`~`-prefixed) meals-equivalent conversion for the donor dashboard's impact stat — not fake precision, a standard food-bank order-of-magnitude heuristic.
- `DonationRow` gained an optional `footer` slot (backward-compatible) so NGO's match chips and the volunteer's lifecycle tracker could reuse the existing row component instead of duplicating markup.

**Pages rebuilt:**
- Landing page (`src/app/page.tsx`) — full rewrite: hero with exact brief copy ("Turn surplus food into someone's next meal") + a new signature flow visual (`RescueWindowSignature.tsx`, rebuilt as a Donor→Donation→NGO→Volunteer→Impact node diagram with a live countdown ring), 5-metric impact band, 5-step "How it works," a "Smart matching" section pairing the real weighted-factor bars with an illustrative 92%-match sample card, a 5-item "Why FoodRescue" grid, the existing roles/map/final-CTA sections restyled.
- Auth (`(auth)/layout.tsx`, `login/LoginForm.tsx`, `signup/page.tsx`) — added a two-column layout with a food-mission brand panel on desktop; fixed error/success colors (danger-red for errors, green for success — the old error color was in the slot now used for gold/volunteer).
- Donor dashboard + `NewDonationForm` — form regrouped into visual sections, urgency changed from a `<select>` to color-coded chips (Low/Medium/High/Critical), added a "Meals rescued (est.)" stat tile.
- NGO dashboard — "Recommended for you" section now shows `MatchChips` per donation (previously the match score only existed on the detail page).
- Volunteer dashboard — pickups now show the `LifecycleTracker` progress stepper inline.
- Admin dashboard + 4 sub-pages — recolored to the new system, several latent color-semantics bugs fixed along the way (suspended badges were rendering in the volunteer-gold color instead of red; "reactivate" button was orange instead of green; NGO verified/unverified badges were swapped).

**Verified:** `tsc --noEmit`, `npm run lint`, `npm run build` all clean at each major checkpoint; all routes smoke-tested against a live dev server. Also did a real visual pass — installed Playwright locally (not a project dependency, just a one-off screenshot tool) and screenshotted the landing page and login page at desktop and mobile widths. This caught two real bugs neither typecheck nor lint could: (1) the decorative blur-glow `div`s in the hero card and auth brand panel were painting *over* their own text — absolutely-positioned elements paint above static content regardless of DOM order unless given an explicit z-index, fixed with `-z-10`; (2) the hero's `.fade-up` entrance animation created a real race where the headline/CTA/signature-card could render at partial opacity on first paint — removed `fade-up` from the two hero elements entirely so the most important 3 seconds of the whole demo render at full opacity with zero animation risk. Dashboard pages (donor/NGO/volunteer/admin) were verified via typecheck/build/route-redirect only, not screenshotted — they reuse the same now-verified shared components (`DonationRow`, `StatTile`, `LifecycleTracker`, etc.) and tokens, but a manual click-through as a real logged-in user is still worth doing before the demo.

## 17. Theme Switcher — Harvest / Midnight / Terroir (2026-08-13)

Added 3 switchable themes on top of the §16 redesign, requested as a polish pass to make the product feel more premium/considered for judging.

**Design**: all 3 themes reuse the exact same token *names* (`--bg`, `--accent`, `--accent-2`, etc.) and the exact same role-color mapping (accent=NGO, accent-2=donor, accent-3=volunteer) — only the hex values differ per theme, so every component built in §16 themes automatically with zero component-level changes. **Harvest** (default) is the existing bright cream palette. **Midnight** is a real dark mode (brightened accents for contrast on a dark surface). **Terroir** is a deeper, richer light variant ("golden hour market" — muted tan bg, ivory cards, jewel-toned accents) rather than a 4th near-duplicate of Harvest.

**Implementation**:
- `src/app/globals.css` — `[data-theme="midnight"]` and `[data-theme="terroir"]` blocks layered over `:root` (Harvest).
- `src/lib/theme.ts` — shared theme id list + `localStorage` key, single source of truth for both the toggle UI and the FOUC-prevention script.
- `src/app/layout.tsx` — a synchronous inline `<script>` in `<head>` applies a saved theme *before first paint* (no flash-of-default-theme for returning visitors); `<html>` carries `suppressHydrationWarning` since the attribute is set outside React.
- `src/components/ThemeToggle.tsx` — dropdown with a color-swatch preview per theme, wired into the marketing `Nav`, the dashboard header, and both the desktop/mobile auth layout headers. Dispatches a `fr-themechange` window event on switch.
- `src/components/DonationMap.tsx` — the one place that can't theme via CSS vars (Google Maps styles need literal hex): added a `DARK_ROUTE_MAP_STYLE`, picks it when `data-theme="midnight"`, and listens for `fr-themechange` to re-style an already-mounted map live via `map.setOptions()` instead of leaving a light map stuck on a dark page.

**Verified**: `tsc`/`lint`/`build` clean. Screenshotted all 3 themes (via Playwright with a pre-seeded `localStorage` storage-state file, since the CLI screenshot tool can't script interactions) — confirmed Midnight is a genuine, legible dark mode and Terroir reads as a distinct deeper/warmer variant, not a near-duplicate of Harvest. One caught-and-accepted quirk: the `ThemeToggle`'s own label can show "Harvest" for a frame before hydration catches up and corrects to the real theme (confirmed via a `--wait-for-timeout` re-shoot) — this is normal `useSyncExternalStore` post-hydration reconciliation, affects only the small label text inside the toggle button itself (never the page's actual CSS theme, which applies pre-paint via the inline script with zero flash), and isn't worth suppressing.

---
*This plan will evolve as we build. Update checkboxes and sections as decisions are made. Next step: awaiting the user's next instruction.*
