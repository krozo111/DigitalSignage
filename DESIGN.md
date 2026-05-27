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
  button-secondary-hover:
    backgroundColor: "{colors.surface-1}"
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
  card:
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
---

# Design System: Yugo Signage

## 1. Overview

**Creative North Star: "The Operator's Console"**

Yugo's admin is a console for one technical operator running five Smart TVs. The
interface is a dark indigo workshop with a single gold filament for the next
action. It should feel like a tool the operator earned, not a product being
sold to them. Calm, low-affect, expert-confident. Closer to a piece of
broadcast hardware than a SaaS dashboard.

Density is earned through hierarchy, not stuffing. Surfaces tint, never gloss.
Color carries meaning (status, navigation, danger) and gold is reserved as
punctuation for the primary path. The interface does its job and steps out
of the way.

This system explicitly rejects, as named in PRODUCT.md: generic SaaS gradient
dashboards (2022–2025), Linear/Vercel visual cosplay, consumer-warm cream
tones (Notion-light, Stripe-marketing), crypto and AI terminal aesthetics
(neon-on-black, brutalist grids, scanlines), and corporate BI tools
(circular brand-color icons, gratuitous charts).

**Key Characteristics:**
- Dark indigo foundation (hue ~290°) with off-axis violet wash on the body.
- Three semantic accents: gold (action), mint (online/success), violet (info, current nav), coral (danger).
- OKLCH throughout. No pure `#000` or `#fff` anywhere.
- Layered surfaces, not glass. Backdrop blur is reserved for sticky bars.
- One sans family (Geist) carries every text role. Mono is reserved for codes and IDs.
- Mobile is a first-class surface, designed for thumb-reach in front of a TV.

## 2. Colors

A tinted-indigo palette with three semantic accents. The chroma is deliberately
low on neutrals (0.022–0.034 around hue 290°) so the surfaces read as warm-dark
rather than as a flat black-with-purple-stripe.

### Primary

- **Yugo Gold — `accent`** (`oklch(0.81 0.155 75)`): The single accent that
  marks the primary path. Primary buttons, focused fields, brand wordmark
  highlight, "next action" links, focus rings. Used sparingly: ≤10% of any
  given screen.
- **Gold-Hover — `accent-strong`** (`oklch(0.74 0.165 70)`): Hover and pressed
  state on primary actions. Slightly deeper, slightly hotter.

### Secondary

- **Operator Mint — `success`** (`oklch(0.78 0.12 165)`): Online status,
  positive deltas, success toasts. Paired with a glow on its dot indicator
  so "online" reads at a glance.
- **Console Violet — `info`** (`oklch(0.62 0.21 280)`): Current navigation
  state, informational callouts, anchor links inside long-form admin copy.
- **Amber Caution — `warning`** (`oklch(0.80 0.15 70)`): Screens missing a
  playlist, expiring pairing codes, soft-blocking validation.
- **Coral Stop — `danger`** (`oklch(0.74 0.135 25)`): Destructive actions,
  errors, offline alerts. Paired with `on-danger` (deep warm) for legible
  text on the saturated coral.

### Neutral

- **Indigo Foundation — `background`** (`oklch(0.15 0.022 290)`): The body.
  Augmented with two radial washes (off-axis violet top-left, distant coral
  bottom-right) that decay within 70vh so the screen has depth without
  becoming a gradient SaaS background.
- **Surface 1** (`oklch(0.20 0.028 290)`): Default container layer, cards,
  panels.
- **Surface 2** (`oklch(0.24 0.034 290)`): Sidebar, inputs, raised menus,
  toasts. Slightly more chroma so it lifts off the body.
- **Surface 3** (`oklch(0.18 0.024 290)`): Recessed layer for ranges that
  need to read "below" the page.
- **Surface Strong** (`oklch(0.22 0.032 290 / 0.92)`): Mobile sticky top bar,
  semi-translucent so the scroll underneath registers.
- **Foreground** (`oklch(0.985 0.004 80)`): Body text and primary fg. Off-white,
  warmly tinted. Three drop-offs follow: `fg-muted` (0.66α), `fg-subtle` (0.46α),
  `fg-disabled` (0.24α).
- **Borders**: `border` (0.07α), `border-strong` (0.14α). Ghost-thin by default;
  borders strengthen only at interactive boundaries (inputs, menus, dialogs).

### Named Rules

**The Punctuation Rule.** Yugo Gold is punctuation, never decoration. It marks
the next action, the focused field, or the brand moment. If gold appears on
more than ~10% of a screen, the hierarchy has collapsed and the screen is
wrong.

**The No-Pure-Pixel Rule.** No `#000`, no `#fff`. Every neutral carries a
tiny brand chroma so the system never reads as flat. The closest you go to
black is `oklch(0.15 0.022 290)`; the closest to white is
`oklch(0.985 0.004 80)`.

**The Meaning-Bearing-Color Rule.** Color names a state: online (mint), current
nav (violet), action (gold), danger (coral), caution (amber). Color never
decorates. If a colored element doesn't carry one of these meanings, it's
the wrong color.

## 3. Typography

**Sans:** Geist (with system-ui fallback). Loaded via `next/font/google` and
bound to `--font-geist-sans`.
**Mono:** Geist Mono. Reserved for pairing codes, screen IDs, file paths,
anywhere literal character width matters.

**Character:** A single neutral sans does the whole job. No display-font
pairing, no serif accents. Hierarchy comes from scale and weight contrast,
not from family contrast. The scale ratio is tight (~1.125) so the type
reads as a single voice across labels, body, and headings.

### Hierarchy

Seven roles, each baking size + leading + tracking + weight so callers never
re-tune those parameters in markup (which is how drift happens):

- **Display** (600, 2rem / 32px, lh 1.1, ls -0.022em): Brand wordmark on
  standalone pages (login, register-screen, player splashes). Not used inside
  the admin shell.
- **H1** (600, 1.5rem / 24px, lh 1.2, ls -0.018em): Page titles via
  `PageHeader`.
- **H2** (600, 1.125rem / 18px, lh 1.3, ls -0.012em): Section headings,
  sidebar wordmark, modal titles.
- **Stat** (700, 2.25rem / 36px, lh 1, ls -0.025em, tabular-nums): The hero
  numeric on `StatCard`. Tabular numerics baked in so digits don't shift as
  values change.
- **Label** (500, 0.875rem / 14px, lh 1.35, ls -0.002em): UI labels, nav
  rows, buttons, body text in product UI. The workhorse.
- **Eyebrow** (600, 0.6875rem / 11px, lh 1.2, ls 0.075em, uppercase):
  Stat-card category labels and the section eyebrows above headings.
- **Meta** (400, 0.75rem / 12px, lh 1.45): Captions, helper text under
  inputs, secondary metadata.

### Named Rules

**The One Voice Rule.** A single Geist family covers the whole UI. No display
serif, no condensed accents, no second sans. If a design needs a "fancy
heading", the answer is weight + scale, not a new family.

**The Tnum Rule.** Any column of digits (counts, sizes, durations, IDs,
pairing codes) uses tabular numerics. The `.tnum` utility and the baked-in
`Stat` role both enforce it. Numbers must not shift width as they update.

**The Token-Or-Don't Rule.** Use `text-display` / `text-h1` / `text-h2` /
`text-stat` / `text-label` / `text-eyebrow` / `text-meta` in markup.
Stacking `text-sm font-medium tracking-tight` inline is forbidden; it is
how scales drift.

## 4. Elevation

Elevation is **tonal first, shadow second**. Layers are stepped in lightness
(surface-1 → surface-2 → surface-3) with a single very subtle inset highlight
(`0 1px 0 oklch(1 0 0 / 0.04) inset`) to suggest a top edge catching light.
Cast shadows appear only when an element is genuinely floating: raised stat
cards, sticky bars, dialogs, dropdowns, toasts.

### Shadow Vocabulary

- **Inset Top Edge** (`box-shadow: 0 1px 0 oklch(1 0 0 / 0.04) inset`): The
  ambient lift on every surface card. Implies the indirect lighting of the
  console.
- **Card Lift** (`box-shadow: 0 1px 0 oklch(1 0 0 / 0.04) inset, 0 8px 24px -12px oklch(0 0 0 / 0.5)`):
  Default `Card` elevation.
- **Stat Lift** (`box-shadow: 0 1px 0 oklch(1 0 0 / 0.04) inset, 0 12px 28px -16px oklch(0 0 0 / 0.6)`):
  Stat cards, deeper drop so the metric reads as a primary object.
- **Drawer Cast** (`box-shadow: 8px 0 32px -12px oklch(0 0 0 / 0.6)`):
  Mobile nav drawer, casts onto the dimmed body.
- **Menu Cast** (`box-shadow: 0 24px 60px -20px oklch(0 0 0 / 0.7)`): Account
  menus, dropdowns, and the login auth card.
- **Primary CTA Halo** (`box-shadow: 0 1px 0 oklch(1 0 0 / 0.25) inset, 0 8px 20px -10px oklch(0.81 0.155 75 / 0.6)`):
  Inset top-edge highlight plus a warm gold drop behind primary buttons.
  Earned, not decorative: it's the one button that's about to do the thing.
- **Sidebar Seam** (`box-shadow: 1px 0 0 oklch(1 0 0 / 0.03) inset`): A single
  pixel of highlight along the inner edge of the desktop sidebar to read as
  a panel seam under the body's top-left wash.

### Named Rules

**The Tonal-First Rule.** Reach for a lighter surface before a heavier shadow.
A card lifts because surface-1 is lighter than the body, not because it has a
big drop shadow. Shadows reinforce, they don't carry the elevation alone.

**The Earned-Halo Rule.** The gold halo behind primary buttons is reserved
for the single primary action on a screen. Two halos on the same screen mean
one of them isn't actually primary.

## 5. Components

Every interactive component owns: default, hover, focus-visible (`ring-2
ring-accent ring-offset-2 ring-offset-background`), active, disabled,
loading, and error where applicable. Half-states are forbidden.

### Buttons

- **Shape:** rounded-lg (8px) for sm/md, rounded-xl (12px) for lg.
- **Primary:** Gold background, deep-indigo text (`on-accent`), semibold,
  inset-top-edge + warm gold halo shadow. Hover swaps to `accent-strong`.
- **Secondary:** Neutral surface-2 with a border-strong outline, regular fg
  text, medium weight. Hover lifts to surface-1.
- **Danger:** Coral background, `on-danger` deep-warm text, semibold. No halo.
- **Ghost:** Transparent default, fg-muted text, hover-tint
  (`fg/[0.05]`). The lightest possible affordance, for tertiary actions
  inside dense surfaces.
- **Loading:** A spinner sits inside the button; copy stays put or shortens
  to a present-tense verb ("Saving", "Signing in"). No ellipsis suffix.

### Inputs

- **Style:** surface-2 background, `border-strong` border, rounded-lg,
  label/14px body text.
- **Focus:** Replace border with `ring-2 ring-accent` (border becomes
  transparent so the ring sits cleanly). The whole field gets a gold halo.
- **Error:** Border swaps to `border-danger/50`; error message in `text-meta
  text-danger` linked via `aria-describedby`.

### Cards

- **Corner:** rounded-xl (12px). Stat cards and primary panels share this
  radius; only buttons go smaller.
- **Background:** surface-1.
- **Border:** `border` (ghost-thin) by default; `border-strong` on hover
  when the card is itself interactive.
- **Shadow:** Card Lift (see Elevation). Hover transitions colors only,
  never shadows.
- **Internal padding:** p-6 (24px) for top-level cards, p-5 for compact.

### Stat Cards

The dashboard's hero pattern. Eyebrow label + icon-in-soft-pill (rounded-lg
7×7), large `Stat` number, optional supporting meta lines, footer link in
accent gold. Three iconTones (success, info, muted) keep status legible.
Not the "Big Number / Small Label / Gradient Accent" SaaS hero-metric
template; the eyebrow and supporting meta carry meaning, not decoration.

### Badges

Pill (rounded-full), 6 tones (neutral, accent, success, warning, danger, info)
each with a `bg-*-soft` tint, fg-color text, and a 1px inset ring (`ring-1
ring-inset ring-*/25`). Optional dot prefix; success-tone dot carries a
`shadow-[0_0_8px_currentColor]` glow because "online" should pulse softly
on a dense screens list.

### Empty States

Two variants: solid (`bg-surface-1` + ghost border) for "no data yet",
dashed (`border-2 border-dashed border-border-strong`) for "drop here" /
"add the first one". Both center a fg-disabled icon, a label-weight title,
a meta-size description (max-w-sm), and an optional action. Keyboard-
operable when interactive (Enter/Space invoke onClick).

### Navigation

- **Desktop sidebar:** surface-2 background, 256px wide (64px collapsed),
  inset right-edge seam highlight. Wordmark at top with collapse toggle.
  Account menu pinned to the bottom.
- **Mobile top bar:** 56px high, `surface-strong` (translucent) with
  backdrop-blur-md, hamburger left, wordmark center, compact account
  menu right.
- **Nav link active state:** `bg-info-soft text-info ring-1 ring-info/20`
  (violet), because "current navigation" is one of the meaning-bearing
  color roles. Not gold; gold is reserved for action.
- **Hit targets:** 44px minimum on touch (`shell-row-h-touch`), 40px on
  desktop (`shell-row-h-desktop`).

### Dialogs

surface-strong background, border-strong outline, rounded-xl, p-6, focus-
trapped, Escape-to-cancel, first button auto-focused on open. Backdrop is
`bg-black/50 backdrop-blur-sm`. Reserved for genuinely modal moments
(destructive confirms, irreversible actions); inline forms always preferred.

### Signature: The Pairing Code

The four-character pairing code displayed on the player and entered in the
admin is the only place mono type shows up. It uses `font-mono`, tabular
numerics, and a size large enough to read across a room (player side) or
a thumb-tap away (admin side). The character set is constrained to avoid
0/O and 1/I/l ambiguity at the admin-entry boundary.

## 6. Do's and Don'ts

### Do:

- **Do** lead with the type-scale utility classes (`text-display`,
  `text-h1`, `text-h2`, `text-stat`, `text-label`, `text-eyebrow`,
  `text-meta`). They bake size, leading, tracking, and weight together.
- **Do** use semantic color tokens (`bg-accent`, `text-info`, `bg-danger-soft`),
  never the raw `--yugo-*` brand colors in components. The raw tokens
  are migration-only.
- **Do** carry status with **shape, icon, or label** alongside color.
  Color is never the sole carrier of state.
- **Do** layer elevation tonally first (surface-1 → surface-2 → surface-3)
  before reaching for a shadow.
- **Do** use OKLCH for every color. Reduce chroma as lightness approaches
  the extremes.
- **Do** size touch targets to ≥44×44 px on mobile surfaces. The on-site
  flow is thumb-driven, standing in front of a TV.
- **Do** prefer inline progressive disclosure over modals. Modals are a
  last resort for irreversible actions.
- **Do** keep gold rare. One primary action per screen. One focused field
  at a time.
- **Do** respect `prefers-reduced-motion`. Fade transitions only; never
  parallax or scroll-driven choreography.

### Don't:

- **Don't** use generic SaaS dashboard tropes (PRODUCT.md anti-reference):
  purple-to-blue gradients, glass cards by default, the hero-metric template
  (Big Number / Small Label / Supporting Stat / Gradient Accent), gradient
  text, identical-card grids, or modal-first flows.
- **Don't** clone Linear or Vercel surfaces directly (PRODUCT.md
  anti-reference). Borrow the discipline (reliable + technical register),
  not the visual signature.
- **Don't** introduce consumer-warm cream tones (PRODUCT.md anti-reference):
  Notion-light, Stripe-marketing cream, beige backgrounds. Yugo lives in
  dark, full stop.
- **Don't** drift into crypto / AI terminal aesthetics (PRODUCT.md
  anti-reference): neon-on-black, monospace everywhere, brutalist grids,
  scanlines. Reliable, not dystopian.
- **Don't** ape corporate BI tools (PRODUCT.md anti-reference): circular
  brand-color icons, gratuitous charts, dense without earning the density.
- **Don't** use `#000` or `#fff`. Every neutral carries the brand chroma.
- **Don't** put a `border-left` or `border-right` greater than 1px as a
  colored accent on a card, list item, or callout. Side-stripe borders are
  banned.
- **Don't** apply `background-clip: text` with a gradient. Gradient text
  is banned. Use a single solid color for emphasis.
- **Don't** glass by default. Backdrop blur is reserved for sticky bars
  attached to scrolling content.
- **Don't** put gold on more than one element-cluster per screen. If two
  things are gold, one of them isn't actually primary.
- **Don't** use em dashes ("—") or double-hyphens ("--") in UI copy. Use
  commas, colons, semicolons, periods, or parentheses.
- **Don't** stack `text-sm font-medium tracking-tight` inline. Use a
  type-scale class. If the scale is missing a role, add the role to
  `globals.css`, don't ad-hoc.
- **Don't** animate CSS layout properties (`width`, `height`, `padding`,
  `margin`). Animate `opacity`, `transform`, `color`, `background`.
- **Don't** rely on color alone for online/offline, success/danger,
  or current navigation. Always pair color with a shape, icon, or label.
