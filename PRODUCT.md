# Product

## Register

product

## Users

A single technical operator managing five Smart TVs running a self-hosted digital signage loop. Both contexts are first-class:

- **Desktop sessions**: bulk media uploads, playlist composition, screen claiming, and settings from a laptop.
- **Mobile-on-site sessions**: standing in front of a TV, reassigning a playlist, checking why a screen went offline, or claiming a freshly paired display.

The job to be done is simple: keep the right content playing on the right screens with minimum friction and no surprises. Sessions are short, high-leverage, and rarely revisited the same day.

## Product Purpose

Yugo Signage is a zero-subscription digital signage admin built on free tiers (Firebase Spark and Netlify/Vercel). It manages the four things this installation needs: media, playlists, screens, and settings.

Success is invisible: TVs stay alive, content rotates, the operator opens the admin, makes the change, and closes it. The admin never demands attention it did not earn.

## Brand Personality

Three words: **reliable, calm, technical**.

Voice: precise, low-affect, expert-confident. Errors are stated clearly, without exclamation marks or apology copy. The interface should feel like a tool the operator earned, not a product being sold to them.

The visual language follows `DESIGN.md`: violet-tinted surfaces, Signal Mint for selection and focus, Action Coral for the single primary action, and a complete light/dark theme pair. Color carries status and interaction meaning; it is never decoration.

## Anti-references

The product rejects:

- Generic SaaS dashboards: gradients, glass cards, hero-metric templates, identical card grids, and modal-first interaction.
- Consumer-warm cream tones and decorative marketing layouts.
- Crypto or AI terminal aesthetics: neon-on-black, monospace everywhere, scanlines, and visual noise.
- Corporate BI density that is not earned by the operator's task.
- Per-module accent palettes. Media, Playlists, Screens, and Settings share one vocabulary.

## Design Principles

1. **Earn the chrome.** Every border, shadow, badge, and surface tint must justify its presence.
2. **Mobile is an operating surface.** Claim, reassign, and check status must work one-handed on site.
3. **Calm before density.** Use hierarchy and spacing before adding more controls.
4. **Status is structural.** Online/offline, selection, primary action, and danger are semantic states.
5. **The accent is punctuation.** Signal Mint marks selection and focus. Action Coral marks creation. Critical Red marks destruction.
6. **One structural vocabulary.** Every admin module uses the same shell, header, stat strip, toolbar, data surface, and optional inspector patterns.

## Accessibility & Inclusion

- WCAG 2.1 AA is the floor.
- Color is never the sole carrier of state; labels, icons, and shapes reinforce it.
- Reduced motion is respected. Use short state transitions only, with no bounce or parallax.
- Mobile hit targets are at least 44×44px.
- Forms have real labels, specific errors, and keyboard-complete workflows.
