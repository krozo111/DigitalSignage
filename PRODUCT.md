# Product

## Register

product

## Users

A single technical operator (the author) managing 5 Smart TVs running a self-hosted digital signage loop. Mixed-context use, both first-class:

- **Desktop sessions**: bulk media uploads, playlist composition, screen claiming, settings — done from a laptop in focused work mode.
- **Mobile-on-site sessions**: standing in front of a TV, reassigning playlists, checking why a screen went offline, claiming a freshly-paired display. Mobile is not a backup view; it is a primary surface.

Job to be done: keep the right content playing on the right screens, with minimum friction and no surprises. Sessions are short (1–10 min), high-leverage, and rarely revisited the same day.

## Product Purpose

Yugo is a zero-subscription digital signage admin built on free tiers (Firebase Spark, Netlify/Vercel). It exists to replace recurring SaaS costs with an owned, lightweight tool that handles the four things signage needs: media library, playlists, screens, settings.

Success is invisible: TVs stay alive, content rotates, the operator opens the admin, makes the change, closes it. The admin never demands attention it didn't earn.

## Brand Personality

Three words: **reliable, calm, technical**.

Voice: precise, low-affect, expert-confident. Closer to Linear or Vercel's admin surfaces than to consumer-warm Notion or Raycast quirky. No exclamation marks. No "Oops!" copy. Errors are stated, not apologized for.

The interface should feel like a tool the operator earned, not a product being sold to them. Gold accents are punctuation, never decoration.

## Anti-references

Explicit rejections — if the design starts drifting toward any of these, it is wrong:

- **Generic SaaS dashboard 2022–2025**: purple-to-blue gradients, glass cards by default, hero-metric template (big number / small label / supporting stat), gradient text, identical-card grids, modal-first interaction.
- **Linear/Vercel clone tropes**: the answer is the *register* (reliable + technical), not the surface details. Borrow the discipline, not the visual signature.
- **Consumer-warm cream tones**: Notion-light, Stripe-marketing cream, beige backgrounds. Yugo lives in dark, full stop.
- **Crypto/AI terminal aesthetics**: neon-on-black, monospace everywhere, brutalist grid, scanlines. Reliable, not dystopian.
- **Corporate BI tools**: PowerBI / SharePoint vibes — circular brand-color icons, gratuitous charts, dense without earning the density.

## Design Principles

1. **Earn the chrome.** Every border, shadow, badge, and surface tint must justify its presence. If removing it doesn't hurt the affordance, remove it. The admin's job is to disappear once the operator finishes the task.
2. **Mobile is not responsive scaling.** Mobile screens are the on-site flow: claim, reassign, check status. Typography, hit targets, and primary actions are designed for thumb-reach standing in front of a TV, then expanded — not the reverse.
3. **Calm before density.** Information density is earned through hierarchy (scale, weight, color), not through stuffing. White space (well, dark space) is signal too.
4. **Status is structural, not decorative.** Online/offline, primary action, danger — these are load-bearing semantics, owned by the color system. Color never decorates; it always means something.
5. **The Yugo accent is punctuation.** Gold marks the primary path through any screen: the next action, the focused field, the brand moment. Use it sparingly; saturate the wrong thing and the whole hierarchy collapses.

## Accessibility & Inclusion

- WCAG 2.1 AA as the floor, with AAA contrast where reasonable on body and form text against the dark indigo surfaces.
- Color is never the sole carrier of state. Online/offline, success/danger, current navigation — all reinforced with shape, icon, or label.
- Reduced motion: respected. Fade-in/out only, no parallax, no scroll-driven motion. Easing is exponential ease-out, no bounce.
- Mobile hit targets ≥44×44px on touch. Forms work one-handed on a phone held in front of a TV.
