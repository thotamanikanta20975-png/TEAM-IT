# FoodRescue — Design System (Master)

Source of truth for the existing, already-shipped visual language. This documents what's live in the codebase (`src/app/globals.css`, `src/app/layout.tsx`) — it is not a proposal. New UI should extend these choices, not introduce new ones, unless there's a real gap noted below.

## Identity

Warm, human, food/social-impact aesthetic — the product should read as a food-rescue and community platform on sight, not a SaaS/fintech dashboard. This replaced an earlier dark "ops/logistics" identity (2026-08-12 redesign, see §"2026-08-13 pass" below) after judge feedback that the UI didn't visually match the project statement. Cream backgrounds, white cards, warm charcoal text, and green reserved specifically for actions/trust/success — not wallpapered across every section.

## Color tokens (`:root` in globals.css)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#faf5ec` (cream) | page background |
| `--surface` | `#ffffff` | card background |
| `--surface-2` | `#f3ebda` | nested surface, banded sections, icon chips, progress-bar tracks |
| `--text` | `#26221e` (warm charcoal) | primary text |
| `--text-dim` | `#6b6259` | secondary text |
| `--accent` | `#2f6b45` (deep forest green) | primary CTA, trust/success, **NGO role color** |
| `--accent-bright` | `#6fa84a` (leafy green) | gradient partner for `--accent` on progress/score bars, "delivered/picked up" status |
| `--accent-2` | `#e07b39` (burnt orange) | **Donor role color**, high-urgency signal |
| `--accent-3` | `#d9a441` (warm gold) | **Volunteer role color**, in-progress/matching status |
| `--danger` | `#b3432b` (warm red) | errors, suspended/cancelled/expired states — the only color reserved exclusively for "something's wrong" |
| `--border` | `#e4dac7` | all borders |
| `--radius` | `12px` | control-tier radius (buttons, inputs, badges, chips) |

Role color convention: **Donor = accent-2 (orange)** — the giving color. **NGO = accent (green)** — verified/trust. **Volunteer = accent-3 (gold)** — in motion. **Admin = neutral charcoal/border** — oversight, not a "team." Keep this mapping everywhere a role needs a color (avatars, badges, map pins, flow-diagram nodes) — **and preserve it across every theme below**, only the underlying hex values shift per theme, never which token maps to which role.

**Green is deliberately scarce.** It means "good/trusted/done" — primary buttons, NGO identity, completed status, positive progress bars. Don't reach for it as a default section background or a neutral UI color; that's what cream/white/border are for.

## Themes

Three switchable themes, all built on the same token names above — only the hex values change, so every component that already reads `var(--bg)`/`bg-text-dim`/etc. themes for free. Defined in `globals.css` as `[data-theme="…"]` blocks layered over the `:root` defaults (Harvest); applied via a `data-theme` attribute on `<html>`, set by `src/components/ThemeToggle.tsx` and persisted to `localStorage` (`src/lib/theme.ts` holds the shared key/id list — keep it in sync with `globals.css` if a theme is added/renamed).

| Theme | Mood | Notes |
|---|---|---|
| **Harvest** (default) | Bright, clean, daytime market | The palette documented above — no `data-theme` attribute needed, it *is* `:root`. |
| **Midnight** | Dark mode, premium/moody | `--accent` swaps to the brighter leafy green (`#6fa84a`) since the deep forest green doesn't have enough contrast on a dark surface — all accents are brightened versions of Harvest's. |
| **Terroir** | Deep, warm, "golden hour market" | A richer, less bright light variant — deeper tan bg, ivory (not pure white) cards, more muted/jewel-toned accents. |

**Adding a 4th theme or editing one**: add/update the `[data-theme="id"]` block in `globals.css` (must define all 11 tokens), add the id to the `THEMES` array in `src/lib/theme.ts`, and — if the change affects Midnight specifically — check whether `DonationMap.tsx`'s `DARK_ROUTE_MAP_STYLE` needs a matching update (Google Maps styles are literal hex, not CSS vars, so they can't read the token system directly).

**No flash of the wrong theme**: `layout.tsx` inlines a synchronous script in `<head>` that reads `localStorage` and sets `data-theme` before first paint — this is why `<html>` has `suppressHydrationWarning`. Don't remove either without a replacement; without the script a returning visitor with a non-default theme sees Harvest for one frame before it corrects.

## Radius system (two tiers, both deliberate)

- **Controls** (buttons, inputs, selects, small badges/chips): `rounded-[var(--radius)]` (12px).
- **Cards/panels/sections**: `rounded-2xl` (16px) — always strictly ≥ the control radius so cards read as the "container" tier.
- **Hero-scale panels** (the landing page's signature flow card, the map section panel): `rounded-3xl` (24px).

Don't mix in the old sharp 4px/`rounded-lg` scale from the previous identity — a global sweep already converted every `rounded-lg` card to `rounded-2xl`.

## Typography

- Display: **Fraunces** (`--font-display`), weights 500/600/700, optical sizing on — warm editorial serif, headings only (`h1,h2,h3` auto-apply it globally). This is the identity's biggest deliberate departure from the old techy Chakra Petch: a serif reads food/human/editorial, not ops/logistics.
- Body: **Plus Jakarta Sans** (`--font-body`) — clean, warm-geometric, friendly.
- Mono: **IBM Plex Mono** (`--font-mono`, unchanged from before) — labels/eyebrows (`uppercase tracking-[0.14em]`), numbers (`tabular-nums`), timestamps, status badges, match-score percentages. Mono = data/precision, deliberately contrasting with the serif's warmth — this pairing is what sells the "AI matching engine" feature visually.

## Motion

- `.fade-up` + `@keyframes fade-up`: unchanged from before — opacity 0→1, translateY 14px→0, 0.7s ease, staggered via inline `animationDelay`.
- `.flow-pulse` + `@keyframes flow-travel`: a dot traveling left→right over 6s along a connector line, used on the landing-page hero's Donor→Donation→NGO→Volunteer→Impact flow diagram and available for any similar node-path visual. (Renamed from the old `.route-pulse`/3-point-pause version, which was tailored to a 3-dot route; this one is a plain 0%→100% sweep for evenly-spaced nodes.)
- `prefers-reduced-motion: reduce` is globally handled. Any `setInterval`-driven animation (like the hero's countdown ring) must check `window.matchMedia('(prefers-reduced-motion: reduce)')` manually — see `RescueWindowSignature.tsx`.
- No GSAP or animation library — CSS-only, kept light for a hackathon build.

## Components (established conventions)

- **Buttons**: primary = `bg-accent text-bg font-semibold` (green — reserve for the main action per screen), donor-context primary = `bg-accent-2`, volunteer-context primary = `bg-accent-3`, secondary = `border border-border text-text hover:border-accent`, destructive-leaning (suspend/cancel/decline) hover to `hover:border-danger`. All `rounded-[var(--radius)]`.
- **Cards/rows**: `rounded-2xl border border-border bg-surface p-{4-6}`, subtle shadow (`shadow-[0_1px_2px_rgba(38,34,30,0.04)]` or `0_1px_3px_...06`) since flat borders read weaker on a light background than they did on dark. Hover state adds `hover:border-accent` when the card is a link.
- **Inputs**: `rounded-[var(--radius)] border border-border bg-bg px-3.5 py-2.5 text-text outline-none focus-visible:border-accent` (inputs sit on `--bg`, not `--surface`, when nested inside a white card — see `NewDonationForm.tsx`).
- **Status badge** (`src/components/StatusBadge.tsx`): pill, `font-mono text-[0.68rem] uppercase`, color families: neutral (posted/cancelled), gold/accent-3 (matched/accepted/assigned — "in motion"), leafy-green/accent-bright (picked up/delivered), filled green/accent (completed), **danger/red (expired — a failure state now, not neutral)**.
- **Eyebrow label**: `font-mono text-xs uppercase tracking-[0.14em]` + a small dot (`before:h-[7px] before:w-[7px] before:rounded-full before:bg-{role-color}`) — used above every section/page heading, colored to the page's role when applicable (donor pages use `text-accent-2`, NGO `text-accent`, volunteer `text-accent-3`).
- **Icons**: hand-rolled inline SVG, `viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"` — unchanged convention, still no icon library. New additions for this identity: `IconLeaf`, `IconHandHeart`, `IconBike`, `IconTarget`, `IconEye` (see `src/components/icons.tsx`).
- **Bars/progress**: `h-2 rounded-full bg-surface-2` track + `h-full rounded-full bg-gradient-to-r from-accent-bright to-accent` fill (leafy-green → deep-green, "positive progress") — the old teal→amber gradient no longer applies since those hues were reassigned.
- **`LifecycleTracker`** (`src/components/LifecycleTracker.tsx`): reusable horizontal/vertical-responsive status stepper. Takes an ordered `stages` array (`{status, label, activeLabel?}`) and the donation's live `currentStatus`; renders done/current/upcoming nodes with a filled connector, or a red terminal banner for CANCELLED/EXPIRED. Used on the donation detail page (6-stage full lifecycle) and the volunteer dashboard (3-stage pickup lifecycle, using `activeLabel` to show "On the way" while `VOLUNTEER_ASSIGNED` is current). **Gotcha**: `donation.status` never literally holds `"DELIVERED"` — `markDelivered()` jumps straight to `COMPLETED`. Stage lists use real status values; display labels are independent (the `COMPLETED` stage's label is "Delivered").
- **`MatchChips`** (`src/components/MatchChips.tsx`): compact one-line match summary (`92% match` + qualitative chips like "Nearby"/"High urgency"/"Good quantity fit") for list rows — the lightweight sibling of `MatchScoreBreakdown` (which is the full bar-chart version for the donation detail page). Both read from the same real `MatchScore` data.

## Data viz rules for this project

- No pie/donut charts — labeled horizontal bars only.
- Every bar/number shows its value as text — never color-only.
- Hand-rolled SVG only (no Chart.js/Recharts/D3).
- The landing page's "Smart matching" section shows both the abstract weighted-factor bars *and* a concrete illustrative sample match card (92% match example) — judges should see both how the algorithm weighs factors and what a real result looks like.

## Impact estimates

`src/lib/impact.ts` — `estimateMeals(quantity, unit)` converts a donation's quantity to a meals-equivalent using a labeled `~` (tilde) estimate for non-meals units (kg/liters ≈ 2 meals per unit, a standard food-bank rule-of-thumb order of magnitude). Always display this prefixed with `~` and/or "(est.)" — never present it as an exact count. Used on the donor dashboard's "Meals rescued" stat.

## Explicitly not changed

Backend logic (Prisma schema, server actions, Supabase auth, RLS policies, the matching algorithm's weights/scoring in `src/lib/matching.ts`), ImageKit integration, route structure. This was a visual/component-layer redesign only — see `plan.md` §16 for the full change log.

## 2026-08-13 pass: dark "ops" → warm "food rescue" identity

Full rebrand triggered by hackathon judge feedback: *"The UI does not visually match the project statement."* The previous dark, sharp-radius, amber/teal/blue "logistics ops" identity was replaced end-to-end (tokens, fonts, radius, every page/dashboard) with the warm cream/green/orange/gold system documented above. Backend, database, auth, RLS, ImageKit, and the matching algorithm were untouched — this was purely `globals.css`, `layout.tsx` fonts, and every component/page's className strings and copy. See `plan.md` §16 for the full file-by-file list.
