---
name: Yugo Signage
description: Operations console for a self-hosted digital signage fleet. Dense, calm, shift-proof.
colors:
  nav-surface: "#241B3E"
  nav-surface-dark: "#171130"
  midnight-violet: "#2E1F47"
  signal-mint: "#2ECFB3"
  mint-ink: "#0E7A66"
  action-coral: "#C93A26"
  coral-bright: "#F04E37"
  cleared-green: "#10B981"
  pending-amber: "#F59E0B"
  critical-red: "#DC2626"
  info-cobalt: "#2E4BF0"
  surface-app: "#F4F4F8"
  surface-card: "#FDFCFE"
  surface-sunken: "#EEEDF3"
  surface-hover: "#F0EFF5"
  surface-border: "#E5E3EC"
  surface-border-strong: "#CFCBDA"
  ink: "#1A1726"
  ink-muted: "#5A5468"
  ink-soft: "#686274"
  surface-app-dark: "#141021"
  surface-card-dark: "#1C1730"
  surface-sunken-dark: "#17122A"
  surface-hover-dark: "#251E3C"
  surface-border-dark: "#2E2745"
  surface-border-strong-dark: "#443A63"
  ink-dark: "#F5F4F8"
  ink-muted-dark: "#B9B3C6"
  ink-soft-dark: "#8A83A0"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-strong:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.06em"
  metric:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
components:
  button-primary:
    backgroundColor: "{colors.action-coral}"
    textColor: "#FFFFFF"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.coral-bright}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-hover}"
  button-affirm:
    backgroundColor: "{colors.mint-ink}"
    textColor: "#FFFFFF"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-destructive:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.critical-red}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  input-field:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "36px"
  search-global:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "34px"
    width: "min(420px, 34vw)"
  card-surface:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  badge-status:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    height: "22px"
  table-header-cell:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "36px"
  table-row:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0 12px"
    height: "52px"
  table-row-selected:
    backgroundColor: "#ECFAF6"
  nav-item:
    backgroundColor: "transparent"
    textColor: "#B4ADC6"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "36px"
  nav-item-active:
    backgroundColor: "#33285099"
    textColor: "{colors.signal-mint}"
  app-shell-sidebar:
    backgroundColor: "{colors.nav-surface}"
    textColor: "#FFFFFF"
    width: "240px"
  app-shell-topbar:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    height: "56px"
  inspector-panel:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    width: "400px"
---

# Design System: Yugo Signage

## 1. Overview

**Creative North Star: "The Duty Desk"**

This is not a product someone browses for pleasure. It is the surface an operator uses while standing in front of a Smart TV, checking whether the right content is playing and making a quick assignment from a laptop or phone. Two scenes define it: an operator at a desk under bright room lighting, reviewing the screen fleet at a glance; and the same person on site in a dim room, pairing a freshly installed display. The first scene is why light mode is the default and why data must read at counter distance. The second is why dark mode is a first-class theme, not an afterthought.

The system is built from a small number of fixed structural patterns applied identically across every module. An operator who learns Screens knows Media and Playlists without being taught. Structure carries the load; color and decoration carry almost none. Every admin screen is assembled from the same six blocks in the same order: **shell → page header → stat strip → view tabs → toolbar → data surface**, with an optional **inspector** to the right. A module does not get to invent its own header, its own KPI treatment, or its own accent color. That uniformity is the feature.

What this system explicitly rejects: the "energetic startup dashboard" the app grew out of. No decorative blobs on working surfaces, no glassmorphism, no per-module accent palettes, no `font-black` headings, no four-differently-colored KPI cards competing for attention above a table. The reference points are Linear, Stripe Dashboard, and Height: earned familiarity, high density, quiet chrome, one loud action per screen. The Yugo brand lives in the sidebar, the logo, the primary action, and the selection state. It does not live in the table.

**Key Characteristics:**
- Fixed six-block page skeleton; modules fill it, never redefine it
- Flat by default: 1px borders do the separating, shadows appear only on floating layers
- Density calibrated for a growing media catalog and screen fleet: 52px rows, 36px controls, 56px topbar
- A module's working set fits one desktop screen; scrolling is for depth, never for orientation
- Inspecting a record never blocks the list behind it
- One primary action per screen, in coral, top-right of the page header
- Selection is the loudest state in the interface, and it is mint
- Light and dark are both specified for every token; neither is a degraded mode

## 2. Colors

Two brand colors, three semantic states, and a violet-tinted neutral ramp that never goes pure grey or pure white.

### Primary

- **Yugo Midnight Violet** (`#2E1F47`): the brand anchor. Used for the sidebar family, for `ink-strong` headings on light surfaces, and nowhere else. It never appears as a button fill in the working area, never as a card background behind data.
- **Nav Surface** (`#241B3E` light theme / `#171130` dark theme): the actual sidebar fill, one step darker and cooler than Midnight Violet so it reads as chrome rather than content. In dark theme it drops below the app background so the sidebar recedes instead of glowing.

### Secondary

- **Signal Mint** (`#2ECFB3`): the interaction color. Active nav item, selected table row indicator, focus ring, progress fill, "on track" meters. This is the color that tells a user *where they are*. Because it carries selection, it is forbidden as decoration.
- **Mint Ink** (`#0E7A66`): the accessible text/fill companion for Signal Mint. Any mint that carries text (affirmative buttons like "Mark resolved", mint badges) uses Mint Ink for the text or as the fill, because `#2ECFB3` on white is 1.9:1 and fails everything.

### Tertiary

- **Action Coral** (`#C93A26`): the primary-action fill. "Upload media", "New playlist", or "Pair screen". Exactly one per screen. It is deliberately the deep coral, not the bright one: white text on `#F04E37` is 3.3:1 and fails AA.
- **Coral Bright** (`#F04E37`): hover state for Action Coral, and the brand coral in logo/illustration contexts only. Never a resting fill behind white text.

### Neutral

- **Surface App** (`#F4F4F8` / dark `#141021`): the page canvas behind everything.
- **Surface Card** (`#FDFCFE` / dark `#1C1730`): every panel, card, table body, topbar, inspector. Off-white by 2 points so it separates from pure-white browser chrome and printed output.
- **Surface Sunken** (`#EEEDF3` / dark `#17122A`): recessed strips — table headers, toolbar wells, the global search field, inactive tab tracks, metadata rows in the inspector.
- **Surface Hover** (`#F0EFF5` / dark `#251E3C`): row and control hover.
- **Surface Border** (`#E5E3EC` / dark `#2E2745`): every 1px divider and control outline.
- **Surface Border Strong** (`#CFCBDA` / dark `#443A63`): input borders on focus-adjacent states, scrollbar thumbs, dividers that must survive a dense table.
- **Ink** (`#1A1726` / dark `#F5F4F8`): primary text, table values, headings.
- **Ink Muted** (`#5A5468` / dark `#B9B3C6`): secondary values, subtitles, row metadata.
- **Ink Soft** (`#686274` / dark `#8A83A0`): column labels, placeholders, timestamps, disabled text.

### Semantic states

- **Cleared Green** (`#10B981`): resolved, complete, up to date, healthy occupancy.
- **Pending Amber** (`#F59E0B`): in progress, waiting on someone, closing soon, approaching a limit.
- **Critical Red** (`#DC2626`): overdue, failed, urgent, destructive. Distinct from Action Coral on purpose.
- **Info Cobalt** (`#2E4BF0`): neutral informational callouts and non-status categorical accents.

### Named Rules

**The One Loud Thing Rule.** A screen gets one coral fill. If a second primary action appears, it becomes a secondary button or moves into the `⋮` overflow menu. If a page needs two primary actions, the page is wrong.

**The Mint Is Selection Rule.** Signal Mint means "this is the thing you are on": active nav, selected row, focused field, current tab. It is never used to make a card look nicer, never as a card background, never as a decorative divider.

**The Coral Is Not Danger Rule.** Coral creates. Critical Red destroys. Destructive actions are never a solid fill: they are ghost buttons with a Critical Red border and label, so "Delete issue" can never be mistaken for "New issue" at a glance.

**The Tinted Neutral Rule.** No `#000`, no `#fff`, no `#6B7280`-family greys. Every neutral carries a trace of the violet hue. A pure Tailwind `gray-*` class in a component is a bug.

**The Status Vocabulary Rule.** Green / Amber / Red / Cobalt mean the same thing in every module, forever. A module may not repurpose amber to mean "maintenance" or cobalt to mean "level 3". Categorical dimensions (room type, category, floor) use neutral badges plus text, not new colors.

## 3. Typography

**Single family:** Plus Jakarta Sans (fallback `system-ui, -apple-system, sans-serif`).

**Character:** One well-tuned humanist sans carries the entire interface: headings, labels, table data, buttons. The system's warmth comes from the typeface's rounded terminals, not from weight extremes. Weights top out at 700 — the previous `font-extrabold`/`font-black` headings read as marketing, not as an operations tool.

Numerics in tables, metrics, currency, counts, and time columns use `font-variant-numeric: tabular-nums` so columns align down the page.

### Hierarchy

- **Display** (700, 28px, 1.2, -0.02em): the page title in the page header. One per screen.
- **Headline** (700, 20px, 1.35, -0.015em): inspector title, modal title, drawer title.
- **Title** (600, 15px, 1.45, -0.01em): section headings inside cards and inspector blocks, stat-strip figures' companion labels.
- **Metric** (700, 24px, 1.1, -0.02em, tabular): the number in a stat-strip cell. Deliberately smaller than the page title — the KPI is not the hero.
- **Body** (400, 13.5px, 1.5): table cells, descriptions, inspector values. Prose blocks cap at 70ch.
- **Body strong** (600, 13.5px): buttons, screen/media/playlist names in an identity column, tab labels.
- **Caption** (500, 12px): row metadata (room number under a name), timestamps, helper text, badge text.
- **Label** (600, 11px, 0.06em, uppercase): table column headers, sidebar section headers, inspector field labels, stat-strip captions.

### Named Rules

**The 700 Ceiling Rule.** Nothing is heavier than 700. `font-extrabold`, `font-black`, and the `universalsansbold` face are permitted in exactly two places: the login screen and the sidebar wordmark. Not in application chrome, not in headings, never in data.

**The Label Case Rule.** Uppercase + tracking is reserved for the Label role (11px). Uppercase at any other size is prohibited; it destroys the scan-ability of dense rows.

**The Two-Line Identity Rule.** Any row or card representing a person or entity shows a Body-strong primary line and a Caption secondary line ("Liam Smith" / "Room 412"). Never one concatenated line, never three lines.

## 4. Elevation

The system is flat at rest. Depth comes from tonal layering — `surface-app` behind `surface-card` behind `surface-sunken` — and from 1px borders. Shadows are a signal that something is *floating above the page*, and nothing that is part of the page floats.

Cards, tables, the stat strip, the topbar, the inspector: all flat, all separated by `surface-border`. The audit test: if a screenshot at 100% zoom shows a visible drop shadow anywhere except a modal, a dropdown, a toast, or a mobile drawer, the shadow is wrong.

### Shadow Vocabulary

- **Raised** (`box-shadow: 0 1px 2px rgba(26,23,38,0.06)`): the only shadow permitted on an in-page element, and only on hover of an interactive card. Optional.
- **Popover** (`box-shadow: 0 8px 24px -8px rgba(26,23,38,0.18), 0 2px 6px -2px rgba(26,23,38,0.08)`): dropdown menus, row `⋮` menus, the command palette, toasts, tooltips.
- **Modal** (`box-shadow: 0 24px 60px -12px rgba(26,23,38,0.30)`): modal dialogs and the mobile drawer only.

In dark theme, shadows are nearly invisible against `#141021`. Floating layers there gain separation from a `surface-border-strong` 1px outline plus a lighter fill, not from a heavier shadow.

### Named Rules

**The Flat-Page Rule.** Elements in the document flow have a border, never a shadow. Elements in a portal above the document have a shadow, always.

**The No Glass Rule.** `backdrop-filter` is permitted on exactly two surfaces: the modal/drawer scrim, and the sticky topbar when content scrolls beneath it. Glass cards, glass panels, and the `.glass` utility on working surfaces are prohibited.

**The No Nesting Rule.** A card never contains another card. If content inside a card needs separation, use a `surface-sunken` inset block or a 1px divider.

## 5. Components

### App Shell

The frame every authenticated route renders inside. Fixed structure, three regions.

- **Sidebar:** 240px fixed, full height, `nav-surface`, does not scroll with content. Collapses to a 64px icon rail on a persisted user toggle. Below 1024px it stops being the primary nav — see Bottom Nav.
- **Topbar:** 56px, `surface-card`, sticky, 1px bottom border, spans the content column only (it starts to the right of the sidebar, it does not run over it).
- **Content column:** `surface-app`, `max-width: 1400px`, 24px horizontal padding (32px at ≥1280px), 24px top padding.
- **Inspector rail:** 400px, `surface-card`, 1px left border, full height of the content column, sticky. Present only when a row is selected and viewport ≥1280px.

The footer line is removed from the shell. Build/version information belongs in Settings.

**The First Screen Rule.** On a 1440×900 desktop, everything a staff member needs to orient themselves fits above the fold: page header, stat strip, view tabs, toolbar, the table header, and at least eight data rows. Scrolling reveals *more of the same list*, never a block they didn't know existed. The table itself, not the page, is what scrolls: the module's outer column is height-bound to the viewport and the `DataTable` fills the remainder, so overflow happens inside the card. The vertical budget that makes eight rows hold, and which no module may exceed:

| Block | Height | Margin below |
|---|---|---|
| Topbar | 56px | — |
| Main padding (top+bottom) | 48px | — |
| Page header | ~64px | 24px |
| Stat strip | ~80px | 16px |
| View tabs | 44px | 0 |
| Toolbar | 44px | 8px |
| Table header | 36px | — |
| Table footer | 52px | — |

That is roughly 460px of chrome on a 900px viewport, leaving ~440px — eight-plus 52px rows. The audit test: load any module at 1440×900 and count the rows. Fewer than eight means a block above the table is overweight, and the block is wrong, not the rule. Vertical padding is the first thing to cut; row height is the last.

### Navigation (Sidebar)

Grouped, labelled, and ordered by operational domain instead of one flat list of twelve.

- **Header block:** 56px tall, matching the topbar so the two align. It holds the collapse toggle and nothing else. The Yugo identity remains in the topbar and page context.
- **Section header:** Label role at 10.5px, `#7C7594`, `0.1em` tracking, 24px top padding, 8px bottom. Groups in order: `OVERVIEW`, `CONTENT OPERATIONS`, `SCREEN OPERATIONS`, then a final unlabelled group. Content operations covers Media and Playlists; screen operations covers pairing and playback status. Settings lives in the unlabelled group, separated by spacing alone. Group membership is defined once in `src/components/admin/navItems.ts`; no component hardcodes it.
- **Item:** 40px tall, 8px radius, 12px horizontal padding, 18px icon + Body-strong label, 12px gap, 4px between items.
  - *Default:* `#B4ADC6` label, `#7C7594` icon.
  - *Hover:* white label and icon, `rgba(255,255,255,0.06)` fill.
  - *Active:* Signal Mint label and icon, `#332850` fill, plus a 3px Signal Mint indicator bar flush to the left edge of the item.
- **Count badge:** right-aligned pill on items carrying actionable work (unpaired screens or failed uploads). Critical Red fill + white text when urgent, otherwise `rgba(255,255,255,0.1)` fill + `#B4ADC6` text. A badge means "there is work here", never a total record count.
- **User block:** pinned to the bottom, 1px top border, 36px circular avatar (Info Cobalt fill, white initials) + name (Body-strong, white) + role (Caption, `#7C7594`) + chevron. Opens a popover with theme toggle, keyboard shortcuts, and sign out.

Theme toggle and sign out move out of the topbar into this popover.

### Bottom Nav (phone)

Below 1024px the sidebar's job splits in two: a fixed tab bar for the handful of destinations staff open every day, and the sidebar itself repurposed as a "More" sheet for everything else. This replaced an early "just add a hamburger + the same sidebar as a drawer" pass, which worked but buried daily destinations one tap behind a menu.

- **Tab bar:** fixed to the viewport bottom, `nav-surface`, 1px top border, 64px content height plus `env(safe-area-inset-bottom)`. Four pinned destinations (Home, Media, Playlists, Screens) plus a fixed fifth **More** tab. Icon above label, same active treatment as the sidebar (Signal Mint icon + label).
- **The Bottom Nav Owns Its Four Rule.** The pinned set is a product call on daily usage (Jorge's, not usage telemetry) — exactly four, no more, so every icon + label fits without truncating. A destination lives in the tab bar or in More, never both.
- **More sheet:** the same `Sidebar` component, mounted with `MORE_NAV_GROUPS` (every group with its pinned items already filtered out) instead of the full `NAV_GROUPS`. It is the existing left-anchored overlay — scrim, slide-in, focus trap — because it already behaved as a modal below 1024px; nothing new was built for it.
- **More active state:** lights up whenever the current route isn't one of the four pinned tabs, or while the sheet itself is open — even if that leaves the current page's own tab (if any) lit at the same time.
- Page content reserves bottom padding (`pb-24` below `lg:`, back to the normal 24px at `lg:` and up) so the tab bar never sits over the last row of a table or the last field of a form.

### Topbar

Context and search, not decoration.

- **Left — breadcrumb:** `Yugo › Signage › {section} › {page}`, Caption role, `ink-soft` for ancestors, `ink` Body-strong for the current page. Separators are `›` in `ink-soft`. Only the Yugo segment is a link to Home. Section drops below 1024px, the leading segments drop below 768px, and the page title always survives.
- **Center — command search:** `surface-sunken` field, 34px, 8px radius, `min(420px, 34vw)`, search icon, placeholder "Search actions…", `⌘K` kbd hint on the right. It is a trigger, not an input: clicking or pressing `⌘K` opens the command palette.
- **Right — context slot:** page-supplied status and secondary actions such as connection state or export, then the user menu. Maximum two page-supplied items; anything more belongs in the page header.

### Command Palette

The global search target. A centered overlay, 560px wide, Popover shadow, opening on `⌘K` / `Ctrl+K`.

Sections in fixed order: **Navigation** (all sidebar destinations), **Actions** (Upload media, New playlist, Pair screen), **Recent** (last visited screens and playlists, local only). Arrow keys move, `Enter` runs, `Esc` closes. Empty query shows Navigation + Actions; a query filters across the local admin catalog only.

Cross-module search against Firebase is out of scope for the initial command palette and must not be faked with a disabled field.

### Page Header

Every page opens with this block, 24px bottom margin.

- **Left:** Display title, plus a one-line Caption subtitle stating what the page is for. Both required.
- **Right:** at most one primary button (coral) plus one or two secondary buttons (ghost). When the primary action has variants, it becomes a split button: label + `▾` opening a Popover menu.
- Wraps to two rows below 640px with full-width buttons.

### Stat Strip

The replacement for rows of KPI cards. One `surface-card` container, 10px radius, 1px border, holding 3–5 equal cells separated by 1px vertical dividers, with an optional trailing widget cell (progress meter, sparkline, or period selector) at 1.5× width.

Each cell: 18px icon in `ink-soft` on a `surface-sunken` 32px rounded square, Metric value, Label caption beneath. No per-cell background color, no per-cell border, no colored left edge. Values that carry a state (overdue count, urgent count) tint the *number* only — Critical Red or Pending Amber — never the cell.

The strip is informational. It is never the primary interaction; if a number needs to be clickable it filters the table below it and shows an active filter chip in the toolbar.

### View Tabs

Scope switching directly under the stat strip: "Upcoming / All events / Drafts / Past". Underline style — Body-strong label, 12px vertical padding, 2px bottom border in Signal Mint when active, `ink-muted` label when inactive, `ink` on hover. Tabs change *which records* are shown. They never change the page's layout or its actions. Horizontally scrollable below 640px, never wrapped to two rows.

### Toolbar

One 44px row above the data surface: scoped search input (left, 280px, growing to fill on mobile), filter dropdowns (each a 36px ghost button with a `▾`, showing the selected value when active), a spacer, then the view-mode segmented control (List / Board / Calendar) right-aligned.

Active filters render as removable chips on a second line, each with an `×`, plus a "Clear all" text button when more than one is active. A filter that is applied but invisible is a bug.

### Data Table

The primary data surface. `surface-card`, 10px radius, 1px border, `overflow: hidden`, header sticky within the scroll container.

- **Header row:** 36px, `surface-sunken`, Label role in `ink-soft`, 1px bottom border. Sortable columns show a chevron on hover and a filled chevron when sorted.
- **Body row:** 52px, 1px bottom border in `surface-border`, `surface-hover` on hover, `cursor: pointer` when the row opens an inspector.
- **Selection column:** 40px, checkbox, header checkbox selects the page. Selecting rows swaps the toolbar for a bulk-action bar ("3 selected · Assign · Export · Delete") in the same 44px slot.
- **Selected row:** `#ECFAF6` fill (dark: `rgba(46,207,179,0.10)`) plus a 3px Signal Mint indicator flush to the row's left edge.
- **Identity column:** 32px initials avatar + two-line identity block.
- **Status column:** one badge, never bare text.
- **Actions column:** 48px, right-aligned `⋮` button opening a Popover menu. Row actions never render as a row of visible buttons.
- **Footer:** 52px, 1px top border, "Showing 1 to 20 of 612" in Caption/`ink-muted` on the left, pager on the right.
- **Empty state:** centered in the table body, 48px icon in `ink-soft`, Title line naming what is missing, Caption line explaining how to create the first one, and the page's primary action repeated as a button. Never "No data".
- **Loading state:** 6 skeleton rows matching the real row height and column widths. Never a centered spinner.

Below 1024px the table becomes a stacked card list: identity block, status badge top-right, two metadata lines, `⋮` menu. Never a horizontally scrolling table on a phone.

### Inspector Panel

The detail surface for a selected record. Same content in two containers: a persistent right rail at ≥1280px, and the existing `Drawer` (520px overlay, Modal shadow) below that. One component, two mounts.

**The Inspector Is Not A Dialog Rule.** In its persistent rail form the inspector is page furniture, not an overlay. It has no scrim, no backdrop blur, no `aria-modal`, no focus trap, and no shadow. Every control behind it stays clickable: staff can switch tabs, retype the search, reorder a column, or select a different row while it is open, and the panel simply reflects the new selection. Nothing about it dims or disables the list. Only the mobile `Drawer` mount is modal, and only because at that width the list is not visible anyway.

**The Selection Lives In The URL Rule.** The selected record is a route param (`/events/:id`), never component state. Three consequences, all required: the panel survives a tab switch and a filter change; a refresh or a shared link reopens the same record; and leaving the module and coming back restores it. A selection that disappears because a sibling component re-rendered is a bug. Closing the panel pops the param and returns to the bare module route.

Fixed internal order:

1. **Header:** entity id (Caption, `ink-soft`), Headline title, status badges beneath, close `×` at the far right. In the persistent rail, the affirmative action ("Assign playlist" or "Refresh pairing") sits at the header's right edge.
2. **Quick actions:** a row of up to four 32px ghost buttons with 14px icons (Assign playlist, Copy pairing code, Open player, Copy link). Overflow goes to `⋮`.
3. **Tabs:** Overview / Activity / Related. Same underline treatment as View Tabs, but 13.5px.
4. **Metadata blocks:** a Label section header, then label→value pairs in a two-column grid (label `ink-soft` Caption, value `ink` Body). Long prose fields (Description, Next action) span both columns.
5. **Timeline:** dot-and-rail activity list, newest last, each entry with actor, action, and timestamp in Caption.
6. **Footer:** pinned, 1px top border, secondary action on the left and the destructive ghost button on the right.

Opening the inspector must not shift the table's columns. At ≥1280px the content column reserves the 400px rail width when a row is selected; below 1280px it overlays.

### Buttons

- **Shape:** 8px radius, 36px height (28px for `xs` inline/table use, 40px for mobile full-width). Icon 14–16px, 6px gap.
- **Primary:** Action Coral fill, white label, Coral Bright on hover. One per screen.
- **Affirm:** Mint Ink fill, white label. For state-completing actions inside the inspector ("Mark resolved", "Confirm arrival"). Not a page-level primary.
- **Secondary:** `surface-card` fill, 1px `surface-border`, `ink` label, `surface-hover` on hover.
- **Ghost:** transparent, `ink-muted` label, `surface-hover` fill on hover. Toolbar and quick-action default.
- **Destructive:** transparent fill, 1px Critical Red border, Critical Red label; on hover a `rgba(220,38,38,0.06)` fill. Never solid.
- **Focus:** 2px Signal Mint ring at 2px offset on `:focus-visible`, on every variant.
- **Disabled:** 45% opacity, no pointer events. Never a colored disabled state.
- **Loading:** spinner replaces the icon, label stays, width does not change.

Every variant must define default, hover, focus-visible, active, disabled, and loading. Shipping four of six is not shipping.

### Badges

- **Shape:** 6px radius, 22px tall, 2px/8px padding, Caption weight 500. Pill radius only for count badges and filter chips.
- **Status variants:** tinted fill at ~8% of the semantic hue, matching-hue text at 700-level darkness, no border in light theme; in dark theme a 15% fill and a 30% border.
- **Neutral variant** for categorical values (category, room type, floor): `surface-sunken` fill, `ink-muted` text.
- A dot prefix is permitted only where the badge sits alone in a column and the label is a single word.

### Inputs

- **Shape:** 8px radius, 36px height, 12px horizontal padding, `surface-card` fill, 1px `surface-border`.
- **Focus:** border shifts to Signal Mint, plus a 2px `rgba(46,207,179,0.20)` ring. No glow, no scale.
- **Error:** border Critical Red, message beneath in Caption/Critical Red with a 14px icon. The message is specific ("Phone must include a country code"), never "Invalid input".
- **Disabled:** `surface-sunken` fill, `ink-soft` text.
- **Label:** Label role above the field, 6px gap. Placeholder is never the label.
- Selects, date fields, and textareas use the same height, radius, border, and focus treatment. A form with three different control heights is broken.

### Cards

Used for grouping, not as the default wrapper. A page's table does not sit inside a card inside a card.

- 10px radius, `surface-card` fill, 1px `surface-border`, no shadow at rest.
- 20px internal padding; 16px on mobile.
- Optional header row: Title left, Caption or ghost action right, 1px bottom border, 12px bottom margin.

### Modals and Drawers

- **Modal:** 14px radius, Modal shadow, 520px (`md`) / 700px (`lg`), scrim `rgba(26,23,38,0.45)` with 4px blur. For focused create/edit forms only.
- **Drawer:** 14px radius on the left edge, 520px, right-anchored, Modal shadow. Mobile mount for the inspector, and the detail surface below 1280px.
- Both keep the existing focus trap, `Esc` handling, and dirty-state confirmation. Do not reimplement them.
- A modal is the last resort. Inline editing, the inspector, and a popover are all preferred.

### Motion

- 160ms for hover, color, and border transitions; 220ms for panel and drawer movement; 120ms for popovers.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. No bounce, no elastic, no spring.
- Motion conveys state only: open/close, selection, loading, arrival of a toast. No entrance choreography on page load, no staggered card reveals in the working area.
- Everything respects `prefers-reduced-motion`, which the global rule already enforces.

## 6. Do's and Don'ts

### Do:

- **Do** assemble every page as shell → page header → stat strip → view tabs → toolbar → data surface → inspector, in that order, even when a block is omitted.
- **Do** put exactly one Action Coral button on a screen, in the page header, top-right.
- **Do** use Signal Mint only for selection, focus, active nav, and progress.
- **Do** use the Critical Red ghost button for every destructive action, and nothing else.
- **Do** tint every neutral toward violet; take colors from `surface-*` and `ink-*` tokens.
- **Do** give tables a 36px sunken header, 52px rows, a `⋮` overflow menu, and a "Showing X to Y of Z" footer.
- **Do** write empty states that name the missing thing and offer the action that creates it.
- **Do** render skeleton rows at the real row height while loading.
- **Do** specify light and dark values for any new token, in `src/app/globals.css` under both `:root` and `html.dark`.
- **Do** collapse the table to a stacked card list below 1024px, and the inspector to the Drawer below 1280px.
- **Do** cap headings at weight 700 and body prose at 70ch.
- **Do** keep the 3px Signal Mint edge indicator for selected rows and the active nav item — it is a state affordance, and it is the only permitted side indicator.

### Don't:

- **Don't** use `border-left` or `border-right` wider than 1px as a colored accent on cards, callouts, alerts, or list items. Colored side stripes as decoration are prohibited; the only exception is the selection/active indicator named above.
- **Don't** put decorative blob shapes on any authenticated working surface. Blobs stay on the login screen and public portals.
- **Don't** apply `.glass`, `backdrop-blur`, or translucent fills to cards, panels, headers, or the inspector.
- **Don't** ship a row of four separately-colored KPI cards. That is the hero-metric template; use the Stat Strip.
- **Don't** invent a per-module accent. Media is not "teal", Playlists are not "amber". Modules share one palette.
- **Don't** use `font-black`, `font-extrabold`, or the `universalsansbold` face outside the login screen and the sidebar wordmark.
- **Don't** use Tailwind's default `gray-*`, `slate-*`, or `zinc-*` scales, or literal `#fff` / `#000`.
- **Don't** use a solid fill for a destructive action, and don't use Action Coral to mean danger.
- **Don't** render a shadow on anything that is part of the page flow.
- **Don't** nest a card inside a card.
- **Don't** put a centered spinner where content will appear.
- **Don't** reach for a modal before checking whether the inspector, an inline edit, or a popover would do.
- **Don't** put a scrim, a blur, a focus trap or `aria-modal` on the persistent inspector rail. Opening a record must never dim or disable the list behind it.
- **Don't** hold the selected record in component state. It belongs in the route, or it will vanish on the next tab switch.
- **Don't** let a module's chrome push the first data row below the fold at 1440×900.
- **Don't** write an empty state that says "No data" or an error that says "Something went wrong".
- **Don't** horizontally scroll a table on a phone.
- **Don't** ship an interactive component with fewer than its six states (default, hover, focus-visible, active, disabled, loading).
