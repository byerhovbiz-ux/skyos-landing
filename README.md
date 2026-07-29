# SkyOS — Early Access landing page

Static page built from the Figma frames **“Landing Page”** (1440×1024) and
**“mobile-landing-page”** (402×1128).

```
index.html        markup
styles.css        all styling (mobile-first, one breakpoint at 900px)
script.js         countdown + waitlist form
assets/
  hero-phone.png  phone mockup, exported from Figma (4096×3976, transparent)
dev-server.js     local preview only — delete before deploying
```

## Run locally

```bash
node dev-server.js       # → http://localhost:4321
```

Or drop the folder on any static host (Netlify, Vercel, Cloudflare Pages,
GitHub Pages, S3). There is no build step and no dependencies.

## Before going live

1. **`script.js` → `BETA_RELEASE`** — set the real launch timestamp (UTC).
   The countdown currently targets `2026-08-11T00:00:00Z` and ticks live;
   Figma shows a static `13 : 23 : 59`.
2. **Nothing** — the waitlist form is already live. Submissions POST to
   Kit and appear under **Subscribers** once confirmed.
3. **Fonts** — currently loaded from Google Fonts (Cormorant Garamond 700,
   Inter 300/400/500/600). Self-host if you'd rather not depend on the CDN.
4. **`assets/hero-phone.png`** is 1.3 MB. Consider a WebP/AVIF version with
   `<picture>` for production.

## Waitlist flow

Submissions POST straight from the form to **Kit** (ConvertKit) — no iframe,
no popup, no redirect. The visitor never leaves the page.

1. Visitor types an address and hits **Join Waitlist**
2. Email format is validated client-side
3. `fetch()` POSTs `{ email_address }` to
   `https://app.kit.com/forms/9739669/subscriptions`
4. HTTP 200 → success message + confetti; anything else → inline error

Kit's own `ck.5.js` and stylesheet are deliberately **not** loaded. Only the
endpoint is used, so the page keeps its own design and loads nothing extra.

### Opt-in and the welcome email

Double opt-in is **off** (Kit → form → Settings → *Auto-confirm new
subscribers*). Subscribers are confirmed the moment they submit — no
confirmation click required, so spam placement doesn't cost you signups.

The welcome email comes from a Kit **automation**: *Any form → Sequence
(SkyOS Early Access)*. It must be **Live**, not a draft, or nothing sends.

### Deliverability ⚠

Emails currently send from a `@gmail.com` address, which fails authentication
and lands in spam. The success message tells people to check spam as a
stopgap.

Proper fix, before the beta announcement:

1. Buy a domain, point it at the host
2. Kit → Settings → Email → authenticate it (SPF/DKIM DNS records)
3. Don't make the launch blast the first send from that domain — send
   something smaller first so it isn't a cold-sender volume spike
4. Clear bounces in Kit before the big send

### Changing the form

If you rebuild the form in Kit, the ID changes. Update `KIT_ENDPOINT` at the
top of section 3 in `script.js`. The field name must stay `email_address` —
that's what Kit expects.

### Limits (free plan)

10,000 subscribers, unlimited broadcasts, 1 automation. The beta announcement
is a **broadcast**, not an automation, so it doesn't consume that slot.

## Layout

| | Mobile (base) | Desktop (≥900px) |
|---|---|---|
| Structure | single centred column, phone below | two columns, phone bleeding off the left |
| Submit button | stacked under the input | inset inside the input's right edge |
| Countdown card | 80×85, white fill | 100×100, no fill |
| Headline | 44px | fluid 52 → 75px |

The phone image is positioned with percentages taken straight from the Figma
frames, so the crop holds at any width:

* mobile — image `960×838` at `(−279, −146)` inside `402×549`
* desktop — image `1165×1130` at `(−205, −46)` inside `1440×1024`

## Where this deviates from Figma (and why)

The two Figma frames disagree with each other in a few small places. Each one
is called out here so it's a decision, not a bug:

| Thing | Figma | In code |
|---|---|---|
| `:` separator colour | `#000000` desktop, `#0E1E2C` mobile | `#0E1E2C` everywhere — pure black is used nowhere else in the design |
| “Zero spam…” alignment | indented 9px past the column on desktop | flush with the column |
| Vertical placement (desktop) | content block sits 17px below centre | vertically centred, so it holds up on shorter viewports |
| Countdown card fill | none on desktop, white on mobile | kept as designed on each — worth unifying if it was unintentional |
| Divider above countdown | mobile only | kept as designed on each |

Everything else — x-positions, widths, heights, gaps, radii, colours, font
sizes and weights — matches the frames exactly at 1440px and 402px.
