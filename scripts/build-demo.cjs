// Writes demo.html — the contents of the hero card.
//
// This is the app itself: assets/app.css is pwa/styles.css copied verbatim,
// applied to the app's own class names and its own icon vectors, pulled out
// of app.js by extract-icons.cjs rather than redrawn.
//
// The markup mirrors what the app renders on desktop — .dt-shell wrapping a
// .dt-side and a .dt-main, the sidebar being .drawer-cloud, .drawer-scroll
// and .drawer-foot exactly as drawerBody() emits them. That matters: the
// app's desktop rules live behind `@media (min-width: 1024px)`, so as long
// as the frame is wider than that, app.css lays this out with no help. The
// <style> block below is only what a still needs and a live app doesn't.
//
// It runs in an iframe because app.css styles `body`, `#app` and `*`
// globally — inlined into the landing page it would restyle the document.
const fs = require('fs');
const I = JSON.parse(fs.readFileSync('.tmp-icons.json', 'utf8'));

// cloudAvatar(size) and mascot(size, variant) take arguments, so the
// extracted templates still carry their placeholders.
const cloud = (size) => I.cloud.split('${size}').join(size);

const mascot = (size) => I.mascotTpl
  .split('${size}').join(size)
  .split('${h}').join(Math.round(size * 226 / 342))
  .split('${CLOUD_D}').join(I.cloudD)
  .split('${fid}').join('skyCloudShadow-drawer')
  .split('${gid}').join('skyCloudGrad-drawer')
  // The drawer variant's shadow, from mascot()'s own `sh` branch.
  .split('${sh.dy}').join('13.42')
  .split('${sh.blur}').join('11.93')
  .split('${sh.matrix}').join('0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0');

const sized = (tpl, s, extra) => {
  // chevron_down's template references its path constant by name.
  let out = tpl.split('${SVG_CHEVRON_DOWN}').join(I.chevronD);
  out = out.split('${s}').join(s);
  for (const [from, to] of extra || []) out = out.split(from).join(to);
  return out;
};

const svg = (attrs, body) =>
  `<svg ${attrs} fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

// The app's icon(name, size) for its stroked set, reproduced exactly: same
// 24 viewBox, same 1.8 stroke, same joins.
const stroked = (body, size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" `
  + `stroke="currentColor" stroke-width="1.8" stroke-linecap="round" `
  + `stroke-linejoin="round">${body}</svg>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SkyOS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- The app's stylesheet, unmodified. -->
<link rel="stylesheet" href="assets/app.css">

<style>
  /* The only additions, and each one is here because this is a still rather
     than a running app. Nothing below restyles the app's own furniture. */

  html, body { height: 100%; overflow: hidden; }
  #app { height: 100%; }

  /* .dt-shell is position:absolute against #app in the app; #app has no
     height of its own here, so give it one. */
  #app { position: relative; }

  /* The transcript scrolls in the app. Here it is fixed, and bottom-aligned
     the way a real one sits at its latest message. */
  .transcript { justify-content: flex-end; overflow: hidden; }

  /* Affordances that would be lying in a still. */
  .composer .plus, .composer .mic, .composer .orb,
  .drawer-item, .proj-row, .drawer-foot-account { cursor: default; }

  /* The time divider — the claim the card exists to make. Two weeks on, the
     answer cannot be coming from the conversation above it. */
  .dt-gap {
    display: flex; align-items: center; gap: 12px;
    color: var(--ink-2); font-size: 15px; font-weight: 300;
  }
  .dt-gap::before, .dt-gap::after {
    content: ""; flex: 1; height: 1px; background: var(--soft-sky);
  }

  /* The pill the app renders under a reply that wrote notes. */
  .dt-saved {
    align-self: flex-start; display: inline-flex; align-items: center;
    padding: 7px 14px; background: var(--surface);
    border: 1px solid var(--separator); border-radius: 999px;
    color: var(--ink-2); font-size: 15px;
  }

  /* The frame gets a phone-width viewport on small screens. Below 1024 the
     app's own desktop rules stop applying, so .dt-side falls back to an
     <aside>'s default block — it has to be hidden explicitly. A 420px rail
     would leave nothing for the conversation, which is the part that
     argues. */
  @media (max-width: 900px) {
    .dt-side { display: none; }
    .dt-main { width: 100%; }
  }
</style>
</head>
<body>

<div id="app" class="desk">
  <div class="screen dt-shell">

    <aside class="dt-side">
      <!-- Search and the rail toggle, as icon() draws them: stroked at 1.8 on
           a 24 viewBox. Their absence left the sidebar's top corner blank. -->
      <div class="dt-side-top">
        <span class="dt-side-btn">${stroked('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>', 20)}</span>
        <span class="dt-side-btn">${stroked('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>', 20)}</span>
      </div>

      <div class="drawer-cloud"><span class="cloud-float">${mascot(200)}</span></div>

      <div class="drawer-scroll">
        <div class="drawer-nav">
          <span class="drawer-item"><span class="ico">${svg('width="18" height="18" viewBox="0 0 20.0337 20.0515"', I.newproj)}</span>New Project</span>
          <span class="drawer-item"><span class="ico">${svg('width="20" height="17.32" viewBox="0 0 22.4002 19.4"', I.memnav)}</span>Memory</span>
          <span class="drawer-item is-soon"><span class="ico">${svg('width="18.5" height="18.5" viewBox="0 0 20.4999 20.5"', I.integr)}</span>Integrations<span class="soon-tag">Soon</span></span>
        </div>

        <div class="drawer-rule"></div>
        <div class="drawer-sec">Recents</div>

        <div class="proj-row active"><span class="proj-open"><span class="nm">Booking app</span></span></div>
        <div class="proj-row"><span class="proj-open"><span class="nm">Meridian redesign</span></span></div>
      </div>

      <div class="drawer-foot">
        <span class="drawer-foot-account compact">
          <div class="avatar-initials">A</div>
          <span class="who-line">Aleksander<span class="who-dot">&middot;</span><span class="who-tier">Beta</span></span>
          <span class="foot-chev">${sized(I.chevron, 18)}</span>
        </span>
      </div>
    </aside>

    <div class="dt-main">
      <div class="dt-topbar">
        <div class="dt-proj"><span>Booking app</span></div>
        <!-- The bar's own controls: project memory, then the project menu.
             Without them the top-right corner is empty and the card reads as
             a mockup of the app rather than the app. -->
        <div class="dt-bar-acts">
          <span class="circle-btn">${svg('width="21" height="18.18" viewBox="0 0 22.4002 19.4"', I.memnav)}</span>
          <span class="circle-btn">${sized(I.kebab, 20)}</span>
        </div>
      </div>

      <div class="transcript">
        <div class="msg-user-row">
          <!-- Short enough to survive the crop. The transcript is bottom-
               aligned, so a longer opening message loses its own beginning —
               and that beginning is what the last answer refers back to. -->
          <div class="msg-user">Going with Supabase for auth instead of Clerk &mdash; Clerk got expensive at scale.</div>
        </div>

        <div class="msg-ai">
          ${cloud(30)}
          <div class="ai-text">This keeps the stack lean: Supabase for authentication and Stripe for payments, with no extra provider costs at launch.</div>
          <span class="dt-saved">Saved 3 notes to memory</span>
        </div>

        <div class="dt-gap"><span>two weeks later</span></div>

        <div class="msg-user-row">
          <div class="msg-user">Remind me why we didn&rsquo;t go with Clerk</div>
        </div>

        <div class="msg-ai">
          ${cloud(30)}
          <div class="ai-text">We didn&rsquo;t go with Clerk because it got expensive at scale; you chose Supabase for auth instead.</div>
        </div>
      </div>

      <!-- .composer-wrap is what holds the bar off the edges and caps it at
           the app's reading width. Without it the composer sits flush to
           both walls, which is not what the app does. -->
      <div class="composer-wrap">
        <div class="composer">
          <span class="plus">${sized(I.plus, 20, [['${(s * 20.3636 / 20).toFixed(2)}', '20.36']])}</span>
          <textarea rows="1" placeholder="Ask SkyOS" readonly tabindex="-1"></textarea>
          <span class="mic">${sized(I.mic, 24, [['${(s * 24.4364 / 24).toFixed(2)}', '24.44']])}</span>
          <span class="orb">${sized(I.wave, 36)}</span>
        </div>
      </div>
    </div>

  </div>
</div>

</body>
</html>
`;

fs.writeFileSync('demo.html', page);
console.log('demo.html written:', page.length, 'chars');
