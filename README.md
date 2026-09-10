# skyos.ink — landing page

Static page, no build step, no dependencies. Deployed with the Vercel CLI; the
app itself lives separately at app.skyos.ink.

```
index.html          markup, plus the script that scales the app cards
styles.css          all page styling — mobile-first, steps at 900px and 1440px
og.png              the link preview image (generated, see below)
icons/              favicon + apple-touch-icon, copied from the PWA

demo.html           hero card: the app mid-conversation          (generated)
demo-memory.html    notes card: the project memory panel         (generated)
assets/app.css      the PWA's styles.css, copied verbatim         (generated)

scripts/
  sync-demo.cjs     copy app.css, re-extract icons, rebuild both cards
  extract-icons.cjs pull the app's own SVGs out of pwa/app.js
  build-demo.cjs    write demo.html and demo-memory.html
  og.html           source of the link preview
  build-og.cjs      render og.html to og.png with headless Chrome/Edge
serve.mjs           local preview server
```

## Preview and deploy

```bash
node serve.mjs            # http://localhost:4321
npx vercel --prod --yes   # needs `vercel login` on this machine
```

## The app cards are the app

The two cards are not screenshots or lookalikes. Each is an iframe loading the
PWA's real stylesheet against the app's real class names and icon vectors, so
hovers and layout behave as they do in the app.

They are iframes because app.css styles `body`, `#app` and `*` globally —
inlined, it would restyle this page.

**After any visual change to the PWA:**

```bash
node scripts/sync-demo.cjs
```

then look at both cards before deploying. The sync tracks styles and icons
only. If the app's *markup* changes — a new button, a renamed class, a control
that is a `<button>` in the app but a `<span>` here — build-demo.cjs has to be
updated by hand. That has been the source of every stale card so far: a hover
rule written as `.actions button:hover` never matches a span.

### Things that will bite

- **Frame sizes are load-bearing.** Each card renders the app at a real window
  size and scales it down (`data-vw` / `data-vh` on the card). The hero is
  1990×1120 because the app zooms `#app` by 1.1 at desktop widths, and at
  anything narrower the transcript gutter collapses. The memory card is
  1440×900 because the dialog is a fixed 1120×820 and a wider frame is mostly
  scrim. Change a frame size and the card's `aspect-ratio` in styles.css must
  change with it.
- **Seven notes is the ceiling.** A note row is 68px and the panel scrolls in
  the app but just cuts in a still. The count is commented in build-demo.cjs.
- **Below 1024px the app's desktop rules stop applying.** `.dt-side`,
  `.dt-topbar` and `.dt-modal` all lose their layout, so the narrow frames hide
  or unwrap them explicitly and show the phone's own `.topbar` instead.
- **The serif is declared after app.css on purpose.** app.css points at a font
  file relative to itself that does not exist here; declaring the Google face
  last makes it win the match, so that file is never requested.

## Link preview

`og.png` is what Reddit, X, Slack and iMessage show when skyos.ink is shared.
Edit `scripts/og.html`, then:

```bash
node scripts/build-og.cjs
```

The meta tags point at `https://www.skyos.ink/og.png` — `www`, because the
apex redirects there. Platforms cache previews, so a changed image can take a
while to appear on a link that was already posted.
