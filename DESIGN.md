---
name: Yugo Signage
description: Operator console for a self-hosted digital signage loop.
colors:
  background:       "oklch(0.15 0.022 290)"
  surface-1:        "oklch(0.20 0.028 290)"
  surface-2:        "oklch(0.24 0.034 290)"
  surface-3:        "oklch(0.18 0.024 290)"
  surface-strong:   "oklch(0.22 0.032 290 / 0.92)"
  fg:               "oklch(0.985 0.004 80)"
  fg-muted:         "oklch(0.985 0.004 80 / 0.66)"
  fg-subtle:        "oklch(0.985 0.004 80 / 0.46)"
  fg-disabled:      "oklch(0.985 0.004 80 / 0.24)"
  border:           "oklch(0.985 0.004 80 / 0.07)"
  border-strong:    "oklch(0.985 0.004 80 / 0.14)"
  accent:           "oklch(0.81 0.155 75)"
  accent-strong:    "oklch(0.74 0.165 70)"
  accent-soft:      "oklch(0.81 0.155 75 / 0.12)"
  on-accent:        "oklch(0.18 0.025 290)"
  success:          "oklch(0.78 0.12 165)"
  success-soft:     "oklch(0.78 0.12 165 / 0.13)"
  warning:          "oklch(0.80 0.15 70)"
  warning-soft:     "oklch(0.80 0.15 70 / 0.13)"
  danger:           "oklch(0.74 0.135 25)"
  danger-soft:      "oklch(0.74 0.135 25 / 0.14)"
  on-danger:        "oklch(0.20 0.04 25)"
  info:             "oklch(0.62 0.21 280)"
  info-strong:      "oklch(0.55 0.23 280)"
  info-soft:        "oklch(0.62 0.21 280 / 0.16)"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  h1:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.018em"
  h2:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  stat:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.002em"
  eyebrow:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.075em"
  meta:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "\"tnum\" 1"
rounded:
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  pill: "9999px"
spacing:
  shell-header-mobile: "3.5rem"
  shell-header-desktop: "4rem"
  row-touch: "2.75rem"
  row-desktop: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  panel:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.fg}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  badge-neutral:
    backgroundColor: "oklch(0.985 0.004 80 / 0.06)"
    textColor: "{colors.fg-muted}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.5rem"
  badge-info:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.5rem"
  nav-link-active:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 0.75rem"
    height: "2.5rem"
  nav-link-default:
    backgroundColor: "transparent"
    textColor: "{colors.fg-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 0.75rem"
    height: "2.5rem"
  nav-tab-active:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.pill}"
    height: "2rem"
    width: "3.5rem"
---

# Design System: Yugo Signage

## 1. Overview

**Creative North Star: "The Operator's Console"**

Yugo's admin is a live operations console for one technical operator running five
Smart TVs. The interface is a dark indigo control surface stitched together by a
hairline grid, with instrument-grade data in mono and a single gold filament for
the next action. It reads like a piece of broadcast hardware, not a SaaS
dashboard: the operator opens it, sees the state of the wall at a glance, makes
the change, and leaves.

Surfaces are flat. Depth comes from tonal layering (surface-1 over the body) and
1px seams between cells, not from floating cards with drop shadows. Status is
structural: a mint dot for online, a coral row for offline, a violet tab for the
current page. Color always carries meaning. Gold is punctuation reserved for the
primary path. Calm is earned through hierarchy and dark space, never through
hiding information the operator needs.

This system explicitly rejects, as named in PRODUCT.md: generic SaaS gradient
dashboards (2022 to 2025), the hero-metric template (big number, small label,
supporting stat, gradient accent), identical-card grids, glassmorphism by
default, Linear or Vercel visual cosplay, consumer-warm cream tones
(Notion-light, Stripe-marketing), crypto and AI terminal aesthetics
(neon-on-black, brutalist grids, scanlines), and corporate BI tools (circular
brand-color icons, gratuitous charts).

**Key Characteristics:**
- Dark indigo foundation (hue ~290°) with a faint off-axis violet body wash. No photo washes behind UI.
- Four semantic accents: gold (action), mint (online/success), violet (info, current nav), coral (danger), with amber for caution.
- OKLCH throughout. No pure `#000` or `#fff`.
- Flat surfaces joined by hairline seams. Collections are a single bordered grid of cells, not a scatter of floating cards.
- Geist Sans carries all UI text. Geist Mono carries all instrument data: counts, sizes, timestamps, IDs, pairing codes.
- Navigation is a horizontal top bar on desktop and a bottom tab bar on mobile. No side rail: content runs full width under a centered max-width.

## 2. Colors

A tinted-indigo palette with four semantic accents. Chroma stays low on neutrals
(0.022 to 0.034 around hue 290°) so surfaces read as warm-dark, not as flat
black with a purple stripe.

### Primary

- **Yugo Gold, `accent`** (`oklch(0.81 0.155 75)`): the single accent that marks the primary path. Primary buttons, focused fields, the brand wordmark highlight, the one "next action" link per screen, focus rings. Used sparingly: ≤10% of any screen.
- **Gold-Hover, `accent-strong`** (`oklch(0.74 0.165 70)`): hover and pressed state on primary actions.

### Secondary

- **Operator Mint, `success`** (`oklch(0.78 0.12 165)`): online status, positive deltas, success toasts. Its dot indicator carries a soft glow so "online" reads at a glance.
- **Console Violet, `info`** (`oklch(0.62 0.21 280)`): current navigation (sidebar active row, mobile tab indicator), informational callouts, anchor links inside long-form admin copy.
- **Amber Caution, `warning`** (`oklch(0.80 0.15 70)`): screens missing a playlist, expiring pairing codes, soft-blocking validation.
- **Coral Stop, `danger`** (`oklch(0.74 0.135 25)`): destructive actions, errors, offline rows. Paired with `on-danger` (deep warm) for legible text on the coral fill.

### Neutral

- **Indigo Foundation, `background`** (`oklch(0.15 0.022 290)`): the body, augmented with two faint radial washes (violet top-left, distant coral bottom-right) that decay within 70vh for depth without a gradient SaaS look.
- **Surface 1** (`oklch(0.20 0.028 290)`): the default raised layer. Panels and every collection cell sit here.
- **Surface 2** (`oklch(0.24 0.034 290)`): inputs, raised menus, toasts, and the hover state of an interactive cell.
- **Surface 3** (`oklch(0.18 0.024 290)`): the recessed layer for things that read "below" the page (the builder's drop area, the dashboard's onboarding disclosure).
- **Surface Strong** (`oklch(0.22 0.032 290 / 0.92)`): translucent sticky bars (mobile top bar, mobile tab bar) so scroll registers underneath.
- **Foreground** (`oklch(0.985 0.004 80)`): body and primary text. Drop-offs follow: `fg-muted` (0.66α), `fg-subtle` (0.46α), `fg-disabled` (0.24α).
- **Borders**: `border` (0.07α) is the hairline seam and default container edge; `border-strong` (0.14α) marks interactive boundaries (inputs, menus, dialogs).

### Named Rules

**The Punctuation Rule.** Yugo Gold is punctuation, never decoration. One gold cluster per screen: the next action, the focused field, or the brand moment. If gold appears on more than ~10% of a screen, the hierarchy has collapsed.

**The No-Pure-Pixel Rule.** No `#000`, no `#fff`. Every neutral carries a tiny brand chroma. The closest to black is `oklch(0.15 0.022 290)`; the closest to white is `oklch(0.985 0.004 80)`.

**The Meaning-Bearing-Color Rule.** Color names a state: online (mint), current nav (violet), action (gold), danger (coral), caution (amber). If a colored element doesn't carry one of these meanings, it's the wrong color.

## 3. Typography

**Sans:** Geist (with system-ui fallback), bound to `--font-geist-sans`.
**Mono:** Geist Mono, bound to `--font-geist-mono`.

**Character:** a single neutral sans does the whole job; no display pairing, no
serif accents. Hierarchy comes from scale and weight contrast on a tight ~1.125
ratio, so the type reads as one voice across labels, headings, and body. Mono is
the instrument typeface: it appears wherever the console reports a value.

### Hierarchy

Each role bakes size, leading, tracking, and weight so callers never re-tune them in markup.

- **Display** (600, 2rem/32px, ls -0.022em): brand wordmark on standalone pages (login, register-screen, player). Not used inside the admin shell.
- **H1** (600, 1.5rem/24px, ls -0.018em): page titles via `PageHeader`.
- **H2** (600, 1.125rem/18px, ls -0.012em): section headings, panel titles, sidebar wordmark, dialog titles.
- **Stat** (700, 2.25rem/36px, tabular-nums): the hero numeric on the dashboard network readout. Tabular numerics baked in so digits don't shift.
- **Label** (500, 0.875rem/14px): UI labels, nav rows, buttons, tile titles, body text in product UI. The workhorse.
- **Eyebrow** (600, 0.6875rem/11px, ls 0.075em, uppercase): section eyebrows, panel category labels, tab labels.
- **Meta** (400, 0.75rem/12px): captions, helper text, secondary metadata.
- **Mono** (500, 0.875rem/14px, tabular-nums): all reported data.

### Named Rules

**The One Voice Rule.** A single Geist family covers the whole UI. A "fancy heading" is weight plus scale, never a new family.

**The Mono Data Rule.** Every reported value uses Geist Mono with tabular numerics: counts, file sizes, durations, relative timestamps, screen IDs, pairing codes. Mono is what makes the console read as an instrument. Prose and labels stay in sans; data is mono.

**The Token-Or-Don't Rule.** Use the scale utilities (`text-display`, `text-h1`, `text-h2`, `text-stat`, `text-label`, `text-eyebrow`, `text-meta`) plus `font-mono`. Stacking `text-sm font-medium tracking-tight` inline is forbidden; it is how scales drift. If a role is missing, add it to `globals.css`.

## 4. Elevation

Elevation is **flat-first**. Depth is built from tonal layering (the body, then
surface-1 cells, then surface-3 recesses) and 1px hairline seams between cells,
not from drop shadows on every container. A surface lifts because it is lighter
than the body and outlined by a hairline border, not because it floats. Cast
shadows are reserved for things that genuinely float above the page: dialogs,
dropdown and account menus, sticky bars, and the warm halo behind the one
primary button. The retired card-lift and stat-lift drop shadows are gone with
the floating-card pattern they served.

### Shadow Vocabulary

- **Status Glow** (`box-shadow: 0 0 8px currentColor` on a mint dot): the only "always on" glow. It makes "online" pulse softly on a dense board.
- **Primary CTA Halo** (`box-shadow: 0 1px 0 oklch(1 0 0 / 0.25) inset, 0 8px 20px -10px oklch(0.81 0.155 75 / 0.6)`): inset top edge plus a warm gold drop behind the single primary button. Earned, never decorative.
- **Menu / Dialog Cast** (`box-shadow: 0 24px 60px -20px oklch(0 0 0 / 0.7)`): account menus, dropdowns, the login auth card, modal dialogs.

### Named Rules

**The Hairline-Seam Rule.** A collection is one bordered container (`rounded-xl border border-border`) wrapping a grid whose cells are separated by 1px gaps over the border color (`grid gap-px bg-border`, cells `bg-surface-1`). The result is a single instrument panel of cells, not a scatter of independent cards.

**The Flat-Collection Rule.** Lists and grids of objects (screens, playlists, media) never use per-item drop shadows. Items are flat cells that respond to hover with a tonal lift to surface-2. Shadows are a response to floating, not a default.

## 5. Components

Every interactive component owns default, hover, focus-visible (`ring-2
ring-accent ring-offset-2 ring-offset-background`), active, disabled, and loading
states where applicable. Half-states are forbidden.

### Buttons

- **Shape:** rounded-lg (8px) for sm/md, rounded-xl (12px) for lg.
- **Primary:** gold background, deep-indigo text (`on-accent`), semibold, inset-top-edge plus warm gold halo. Hover swaps to `accent-strong`.
- **Secondary:** surface-2 with a `border-strong` outline, fg text, medium weight. Hover lifts to surface-1.
- **Danger:** coral background, `on-danger` deep-warm text, semibold. No halo.
- **Ghost:** transparent, fg-muted text, hover-tint (`fg/[0.05]`). The lightest affordance, for tertiary actions in dense surfaces.
- **Loading:** an inline spinner; copy stays put or shortens to a present-tense verb ("Saving", "Connecting"). No ellipsis suffix.

### Inputs

- **Style:** surface-2 background, `border-strong` border, rounded-lg, label/14px text.
- **Focus:** border goes transparent and a `ring-2 ring-accent` plus gold halo takes over.
- **Error:** border swaps to `border-danger/50`; message in `text-meta text-danger` linked via `aria-describedby`.
- **Numeric data inputs** (durations) use `font-mono tnum`.

### Panels

The flat replacement for the old floating Card.

- **Shape:** rounded-xl (12px).
- **Background:** surface-1, with a `border border-border` hairline. Recessed sub-areas use surface-3.
- **Shadow:** none at rest (see Elevation). Depth is the border plus the tonal step off the body.
- **Padding:** p-6 (24px) for top-level panels, p-4 to p-5 for compact ones.

### Collection Grid (signature)

The dominant pattern for screens, playlists, and media. A `rounded-xl border
border-border overflow-hidden bg-border` container wraps `grid gap-px bg-border`;
each cell is `bg-surface-1` with `hover:bg-surface-2`. The 1px gaps read as
seams. Cells carry no internal border or shadow. Media cells hold a square
thumbnail plus a mono footer (size, type); screen and playlist cells hold a
title plus mono data.

### Screen Tile (signature)

A cell on the dashboard screen-wall and the Screens page. Top row: a `StatusDot`
(mint with glow for online, hollow ring for offline) plus the screen name in
label weight, with a mono relative timestamp ("now", "3h ago") right-aligned.
Below: the current playlist in meta, or a coral "No playlist assigned" row.
Online status is derived from `lastSeen` freshness (under 5 minutes), never from
the stored status field.

### Badges

Pill (rounded-full), 6 tones (neutral, accent, success, warning, danger, info),
each with a `bg-*-soft` tint, fg-color text, and a 1px inset ring. Optional dot
prefix; the success dot carries the status glow.

### Empty States

Two variants: solid (`bg-surface-1` plus hairline border) for "no data yet",
dashed (`border-2 border-dashed border-border-strong`) for "drop here / add the
first one". Both center a fg-disabled icon, a label-weight title, a meta
description, and an optional action.

There is no side rail. Navigation lives in a top bar on desktop and a bottom tab bar on mobile.

- **Top bar (all sizes):** sticky, `surface-strong` translucent with backdrop-blur, 56px on mobile and 64px on desktop. Wordmark left, account menu right. On desktop (md+) it also carries the inline nav tabs; on mobile the nav moves to the bottom tab bar and the top bar holds only wordmark and account.
- **Desktop nav tabs:** inline `NavLink` pills in the top bar, with the violet active state. Content below runs full width inside a centered max-width container (no 256px rail eating horizontal space).
- **Mobile bottom tab bar:** the primary mobile nav, replacing the old side drawer. Fixed to the bottom of the column, `surface-strong` with backdrop-blur, four equal columns of icon plus 11px label, `safe-area-inset-bottom` respected. The active tab's icon sits in a violet pill (`bg-info-soft text-info`, rounded-full, about 32x56px) with a violet label. Hit targets ≥56px.
- **Active state:** violet (`bg-info-soft text-info`), because "current navigation" is a meaning-bearing role. Never gold.

### Dialogs

surface-2 background, border-strong outline, rounded-xl, p-6, focus-trapped,
Escape-to-cancel, first button auto-focused. Backdrop is
`bg-background/70 backdrop-blur-sm`. Reserved for genuinely modal moments
(destructive confirms, discard-unsaved-changes); inline and progressive
disclosure preferred otherwise. Native `window.confirm` and `alert` are
forbidden.

### Signature: The Pairing Code

The six-character code shown on the player and entered in the admin is rendered
in `font-mono` with tabular numerics and wide tracking, large enough to read
across a room (player) or a thumb-tap away (admin). On the dashboard it appears
in its own "Awaiting pairing" tile.

## 6. Do's and Don'ts

### Do:

- **Do** lead with the type-scale utilities (`text-h1`, `text-stat`, `text-label`, `text-eyebrow`, `text-meta`). They bake size, leading, tracking, and weight together.
- **Do** put every reported value in `font-mono` with tabular numerics: counts, sizes, durations, timestamps, IDs, codes.
- **Do** build collections as a single hairline-seam grid (one bordered container, `gap-px bg-border` cells), not a scatter of floating cards.
- **Do** keep surfaces flat at rest; reach for a lighter surface and a hairline border before any shadow.
- **Do** carry status with shape, icon, or label alongside color (mint dot vs hollow ring, not color alone).
- **Do** use semantic color tokens (`bg-accent`, `text-info`, `bg-danger-soft`), never the raw `--yugo-*` brand colors.
- **Do** keep gold rare: one primary action per screen, one focused field at a time.
- **Do** size touch targets ≥44px on mobile; the on-site flow is thumb-driven.
- **Do** use the bottom tab bar for mobile navigation, and `<details>` or inline reveals over modals.
- **Do** respect `prefers-reduced-motion`; fade transitions only, 150 to 250ms, exponential ease-out, no bounce.

### Don't:

- **Don't** use generic SaaS dashboard tropes (PRODUCT.md anti-reference): purple-to-blue gradients, glass cards by default, the hero-metric template (big number, small label, supporting stat, gradient accent), gradient text, identical-card grids, or modal-first flows.
- **Don't** give collection items per-item drop shadows or wrap each in a floating card. Flat cells, hairline seams.
- **Don't** put a photo or image wash behind the UI; it reads dated. Depth comes from tonal layering, not background imagery.
- **Don't** use a full-height side drawer for mobile navigation; it covers the screen. Use the bottom tab bar.
- **Don't** clone Linear or Vercel surfaces directly (PRODUCT.md anti-reference). Borrow the reliable-and-technical register, not the visual signature.
- **Don't** introduce consumer-warm cream tones (PRODUCT.md anti-reference): Notion-light, Stripe-marketing cream, beige. Yugo lives in dark.
- **Don't** drift into crypto / AI terminal aesthetics (PRODUCT.md anti-reference): neon-on-black, monospace everywhere, brutalist grids, scanlines. Mono is for data, not the whole UI.
- **Don't** ape corporate BI tools (PRODUCT.md anti-reference): circular brand-color icons, gratuitous charts, density without earning it.
- **Don't** use `#000` or `#fff`. Every neutral carries the brand chroma.
- **Don't** put a `border-left` or `border-right` greater than 1px as a colored stripe on a cell, list item, or callout.
- **Don't** apply `background-clip: text` with a gradient. Use a single solid color for emphasis.
- **Don't** put gold on more than one element-cluster per screen. Two golds means one isn't actually primary.
- **Don't** use em dashes or double-hyphens in UI copy. Use commas, colons, semicolons, periods, or parentheses.
- **Don't** stack ad-hoc type utilities (`text-sm font-medium tracking-tight`). Use a scale class; add the role to `globals.css` if one is missing.
- **Don't** call native `window.confirm` or `alert`. Use the in-app `ConfirmDialog`.
