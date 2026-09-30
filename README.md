# skyos.ink — landing page

Static pages, no build step, no dependencies. Deployed with the Vercel CLI; the
app lives separately at app.skyos.ink and its server at api.skyos.ink.

```
index.html      the page: what SkyOS is, how it works, the Memory page drawn
privacy.html    Privacy Policy   → /privacy
terms.html      Terms of Service → /terms
styles.css      all styling — phone first, widens at 720px and 960px
tokens.css      the app's palette, copied from the app's tokens.css
contact.js      the Contact form, built on any page with a data-contact link
vercel.json     cleanUrls, so /privacy and /terms work without .html
icons/, favicon.ico   the SkyOS mark, the same files as the app
og.png          the link preview image (generated, see below)
scripts/
  og.html       source of the link preview
  build-og.cjs  renders og.html to og.png with headless Chrome/Edge
serve.mjs       local preview server
```

## Same design as the app

The colours come from `tokens.css`, a copy of the app's own. If the app's
palette changes, copy the file again. Type, buttons, corner radii and the top
bar follow the app's styles, so going from this page to app.skyos.ink changes
nothing but the content. Light only, like the app.

The drawings on the page (the conversation that moves from ChatGPT to Claude,
and the Memory page) are HTML, not screenshots. If the app's Memory page
changes shape, update `.memory` in index.html and styles.css to match.

## Every claim is checked against the app

What the page, Privacy and Terms say has to be true of the new SkyOS: what it
stores and for how long, who processes it, and what setup takes. When the app
changes any of that, change these pages in the same go.

## Contact

`contact.js` posts to `https://api.skyos.ink/contact` (the app's server,
`api/contact.ts`), which accepts only skyos.ink and www.skyos.ink, saves the
message and emails it through Resend with the sender as reply-to. Mail needs
`RESEND_API_KEY` and `FEEDBACK_TO` set on the portage-mcp project in Vercel.

## Preview and deploy

```bash
node serve.mjs                        # http://localhost:4321
npx vercel@59.15.1 --prod --yes       # needs `vercel login` on this machine
```

## Link preview

`og.png` is what Reddit, X, Slack and iMessage show when skyos.ink is shared.
Edit `scripts/og.html`, then:

```bash
node scripts/build-og.cjs
```

The meta tags point at `https://www.skyos.ink/og.png` — `www`, because the
apex redirects there. Platforms cache previews, so a changed image can take a
while to appear on a link that was already posted.

## Icons

The icons are what Google's favicon service shows for skyos.ink, and Claude
takes the SkyOS connector's icon from there. Google refreshes its copy on its
own schedule, so a changed icon takes days to reach Claude.
