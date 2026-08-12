# FoodRescue — Design System (Master)

Source of truth for the existing, already-shipped visual language. This documents what's live in the codebase (`src/app/globals.css`, `src/app/layout.tsx`) — it is not a proposal. New UI should extend these choices, not introduce new ones, unless there's a real gap noted below.

## Identity

Dark "ops/logistics" aesthetic — the product reads as infrastructure that moves food fast, not a consumer donation form. Three role-coded accent colors (donor/NGO/volunteer) run through the whole app, from the landing page's route diagram down to status badges.

## Color tokens (`:root` in globals.css)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#10141b` | page background |
| `--surface` | `#171d27` | card/row background |
| `--surface-2` | `#1f2733` | nested surface, track backgrounds (progress bars) |
| `--text` | `#e8edf3` | primary text |
| `--text-dim` | `#8c97a8` | secondary text — verified ≥5.7:1 contrast on both `bg` and `surface`, safe for body text |
| `--accent` | `#f2a93c` (amber) | primary CTA, donor role color, urgency/attention |
| `--accent-2` | `#3fce9a` (teal) | success/completed, NGO role color |
| `--accent-3` | `#4c8dff` (blue) | info/in-transit, volunteer role color |
| `--border` | `#2a3444` | all borders |
| `--radius` | `4px` | small, sharp radius — intentional; do not switch to a rounder radius elsewhere (`rounded-lg` in Tailwind classes is used for bigger cards as a deliberate second, larger radius tier — keep that distinction: `var(--radius)` for controls/inputs/badges, `rounded-lg`/`rounded-xl` for cards/sections) |

Role color convention: **Donor = accent (amber)**, **NGO = accent-2 (teal)**, **Volunteer = accent-3 (blue)**. Keep this mapping everywhere a role needs a color (avatars, badges, map pins, timeline dots).

## Typography

- Display: **Chakra Petch** (`--font-display`), weights 500/600/700 — headings only (`h1,h2,h3` auto-apply it globally)
- Body: **IBM Plex Sans** (`--font-body`)
- Mono: **IBM Plex Mono** (`--font-mono`) — used for labels/eyebrows (`uppercase tracking-[0.14em]`), numbers (`tabular-nums`), timestamps, and status badges. Mono = data, not prose.

## Motion

- `.fade-up` + `@keyframes fade-up`: opacity 0→1, translateY 14px→0, 0.7s ease. Used with staggered `animationDelay` inline style for sequential reveals.
- `.route-pulse`: a dot traveling left→right over 5s, used on the rescue-window route line.
- `prefers-reduced-motion: reduce` is globally handled (collapses all animation/transition durations to ~0). **Any new animation must keep working under this** — CSS animations already inherit it for free; if you add a `setInterval`-driven animation (like `RescueWindowSignature` does), check `window.matchMedia('(prefers-reduced-motion: reduce)')` manually, same pattern as that component.
- Standard interactive transitions: rely on Tailwind's default `transition-opacity`/hover color changes, no explicit duration set (defaults are fine, ~150ms). Don't add GSAP or a new animation library — the CSS-only approach is deliberate and keeps the bundle light for a hackathon build.

## Components (established conventions)

- **Buttons**: primary = `bg-accent text-bg font-semibold`, secondary = `border border-border text-text hover:border-accent`, both `rounded-[var(--radius)]`, `px-{4-7} py-{2-3.5}` depending on prominence.
- **Cards/rows**: `rounded-lg border border-border bg-surface p-{4-6}`, hover state adds `hover:border-accent` when the card is a link.
- **Inputs**: `rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-text outline-none focus-visible:border-accent`. Label pattern: `<label className="flex flex-col gap-1.5 text-sm"><span className="text-text-dim">Label</span><input .../></label>`.
- **Status badge** (`src/components/StatusBadge.tsx`): pill, `font-mono text-[0.68rem] uppercase`, border+text colored by status family (neutral/amber/blue/teal).
- **Eyebrow label**: `font-mono text-xs uppercase tracking-[0.14em] text-accent` with a small dot (`before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent`) — used above every section heading.
- **Icons**: hand-rolled inline SVG, `viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"`, sized `h-6 w-6`–`h-8 w-8` depending on context. No icon library dependency (Phosphor/Lucide) — keep it that way; add new icons as inline SVG paths in `src/components/icons.tsx` in this exact stroke style so nothing looks mismatched.
- **Bars/progress** (matching-factor bars on the landing page): `h-2 rounded-full bg-surface-2` track + `h-full rounded-full bg-gradient-to-r from-accent-2 to-accent` fill, percentage in `font-mono text-sm text-text-dim`. Reused as the general "labeled bar" pattern for any 0–100 score.

## Data viz rules for this project

- No pie/donut charts (few enough categories that a labeled horizontal bar is both more accessible and more on-brand with the mono/data aesthetic already established).
- Every bar/number must show its value as text — never color-only.
- Reuse the existing SVG-hand-rolled approach (no Chart.js/Recharts/D3 dependency) — consistent with the "no new heavy deps" rule above and matches the existing `RescueWindowSignature`/landing-page SVG work.

## Known gaps this pass is closing

- Dashboard list rows (donor/NGO/volunteer) were plain, undifferentiated bordered boxes with no icons, no urgency signal, and duplicated markup per page — being consolidated into a shared `DonationRow` component.
- Admin "Donations by status" and stat tiles were plain text/numbers — no visual weight despite being the most data-dense screen in the app. Getting bar visualization + icon stat tiles.
- The `MatchScore` table has real per-factor data (distance/urgency/quantity/availability/reliability) written by `src/lib/matching.ts` for every donation, but nothing in the UI ever showed it — the landing page's "matching engine" bars are static/illustrative only. Adding a real `MatchScoreBreakdown` component on the donation detail page fixes this.
- Status history was a plain `<ol>` of badges — getting a stepper visual consistent with the landing page's route/dot language.

## Explicitly not changed

Color tokens, fonts, radius scale, the landing page's overall structure, and all backend logic (Prisma schema, server actions, Supabase auth, matching algorithm weights) — this pass is visual/component-layer only.
