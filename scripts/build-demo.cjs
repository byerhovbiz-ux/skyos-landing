// Writes the demo frames — the contents of the landing page's app cards.
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
// Two frames, because the app cannot show both at once: the memory panel is
// a modal over a blurred scrim, so opening it hides the conversation behind
// it. One frame per claim, rather than one frame pretending to make both.
//
// They run in iframes because app.css styles `body`, `#app` and `*`
// globally — inlined into the landing page they would restyle the document.
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
  // Several FIG icons reference their path data by constant name, so the
  // extracted template still carries the reference.
  let out = tpl
    .split('${SVG_CHEVRON_DOWN}').join(I.chevronD)
    .split('${SVG_SHARE}').join(I.shareD);
  out = out.split('${s}').join(s);
  for (const [from, to] of extra || []) out = out.split(from).join(to);
  return out;
};

const svg = (attrs, body) =>
  `<svg ${attrs} fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

// FIG's square 24-viewBox icons, as it draws them.
const box = (body, s) => svg(`width="${s}" height="${s}" viewBox="0 0 24 24"`, body);

// The app's icon(name, size) for its stroked set, reproduced exactly: same
// 24 viewBox, same 1.8 stroke, same joins.
const stroked = (body, size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" `
  + `stroke="currentColor" stroke-width="1.8" stroke-linecap="round" `
  + `stroke-linejoin="round">${body}</svg>`;

// FIG.memNav(n) keeps the vector's own 22.4 x 19.4 ratio rather than squaring it.
const memNav = (n) =>
  svg(`width="${n}" height="${(n * 19.4 / 22.4).toFixed(2)}" viewBox="0 0 22.4002 19.4"`, I.memnav);


// ---------------------------------------------------------------- sidebar

const sidebar = `
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
          <span class="drawer-item"><span class="ico">${memNav(20)}</span>Memory</span>
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
        <span class="foot-bug">${stroked(I.bug, 20)}</span>
      </div>
    </aside>`;

// Two headers, because the app has two and they are not the same element.
// .dt-topbar is styled only inside `min-width: 1024px`, so in the narrow
// frame it had no layout at all and its three children stacked down the left
// edge. The phone renders .topbar instead: hamburger, spacer, kebab, no
// project name. The <style> block picks one per breakpoint.
const topbar = `
      <div class="dt-topbar">
        <div class="dt-proj"><span>Booking app</span></div>
        <!-- The bar's own controls: project memory, then the project menu.
             Without them the top-right corner is empty and the card reads as
             a mockup of the app rather than the app. -->
        <div class="dt-bar-acts">
          <span class="circle-btn">${memNav(21)}</span>
          <span class="circle-btn">${sized(I.kebab, 20)}</span>
        </div>
      </div>

      <div class="topbar">
        <span class="circle-btn">${sized(I.menu, 48)}</span>
        <div class="spacer"></div>
        <span class="circle-btn">${sized(I.kebab48, 48)}</span>
      </div>`;

const composer = `
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
      </div>`;

// <button>, not <span>, because the app's hover rule for these is written
// `.actions button:hover` — as spans they were the one row of controls in the
// card that stayed dead under the pointer. tabindex keeps them out of the tab
// order, since nothing in a still is operable.
const msgActions = `
          <div class="actions">
            <button type="button" tabindex="-1">${sized(I.copy, 20)}</button>
            <button type="button" tabindex="-1">${sized(I.share, 22)}</button>
            <button type="button" tabindex="-1">${sized(I.moreDots, 20)}</button>
          </div>`;


// ------------------------------------------------------------- transcript
//
// Two ordinary turns. This card used to put its second question under a
// "two weeks later" divider — but the app renders no such divider, and four
// messages apart every assistant answers that question correctly, so it
// staged a win that wasn't one. Nothing here is a memory test; what is
// SkyOS-specific is the receipt under each reply, and the second card is
// where the notes it wrote are shown. The two are meant to be read in order.
//
// Two turns rather than one because the transcript is bottom-aligned: a
// single exchange leaves the top 60% of the card empty.

const turn = (ask, reply, saved) => `
        <div class="msg-user-row">
          <!-- Short enough to survive the crop. The transcript is bottom-
               aligned, so a longer message loses its own beginning. -->
          <div class="msg-user">${ask}</div>
        </div>

        <div class="msg-ai">
          ${cloud(30)}
          <div class="ai-text">${reply}</div>
${msgActions}
          <!-- The app's own extractionBadge(): a .mem-badge carrying
               FIG.memNav(13), silent on a turn that saved nothing. -->
          <div class="mem-badge mem-ok">${memNav(13)}Saved ${saved} to memory</div>
        </div>`;

const transcript = `
      <div class="transcript">
${turn(
  'Going with Supabase for auth instead of Clerk &mdash; Clerk got expensive at scale.',
  'This keeps the stack lean: Supabase for authentication and Stripe for payments, with no extra provider costs at launch.',
  '3 notes')}
${turn(
  'Lock the launch to before the 15th.',
  'Locked in. That gives you nine working days, and the booking flow is the only piece still unfinished.',
  '1 note')}
      </div>`;


// ----------------------------------------------------------- memory panel
//
// notesScreen() in project scope, inside deskModal()'s .dt-modal. Both are
// reproduced structurally, never restyled — the dialog geometry, the nav
// rows and every note row are app.css's. The note text is what the extractor
// writes for the exchange above, and "today" is what noteWhen() returns for
// a note saved this turn.
//
// The dialog's own back button is hidden by app.css inside .dt-modal-body,
// so .settings-nav here carries only its title — which is what the app
// actually shows in the dialog.

// A project's memory, not one turn's. Showing only the three notes the badge
// just wrote left the panel two-thirds empty and implied the list is per-reply
// — it accumulates. The dates are what noteWhen() renders: relative inside a
// month, and it is the dates, not a divider, that carry the age of the thing.
//
// Newest first, which is the order notesScreen() sorts into. Three of these
// are the answers the comparison section further up quotes.
//
// SEVEN IS THE CEILING. A .note-line is 68px and the dialog's scroller is
// 618px tall at this frame size, so 54 (section) + n*68 + 67 (foot) has to
// stay under that: nine clipped the last row and the footnote in half. The
// panel scrolls in the app; in a still it just cuts.
const notes = [
  ['Auth is Supabase. Clerk was rejected because it got expensive at scale.', 'today'],
  ['Payments go through Stripe.', 'today'],
  ['No paid provider costs at launch.', 'today'],
  ['Launch is before the 15th.', 'today'],
  ['Pricing is $15 a month, annual billing only.', '4 days ago'],
  ['Cancellation is free up to 24 hours before check-in.', '6 days ago'],
  ['Room photos are capped at 8 per listing.', '26 days ago'],
];

const navRow = (label, ico, on, soon) => (soon
  ? `<span class="dt-nav-row is-soon"><span class="ico">${ico}</span>${label}<span class="soon-tag">Soon</span></span>`
  : `<span class="dt-nav-row${on ? ' active' : ''}"><span class="ico">${ico}</span>${label}</span>`);

const memoryDialog = `
    <div class="scrim scrim-blur"></div>
    <div class="dt-modal">
      <nav class="dt-modal-nav">
        <div class="dt-modal-title">Settings</div>
        ${navRow('Profile', box(I.user, 20))}
        ${navRow('Memory', memNav(20), true)}
        ${navRow('Integrations', box(I.gridInt, 20), false, true)}
        ${navRow('Library', box(I.hdd, 20))}
        ${navRow('Permissions', box(I.gear2, 20))}
        <div class="dt-nav-gap"></div>
        ${navRow('Privacy &amp; data', box(I.shield, 20))}
      </nav>

      <div class="dt-modal-body">
        <div class="screen">
          <div class="settings-nav">
            <div class="title">Memory</div>
          </div>
          <div class="settings-scroll">
            <div class="settings-section">Booking app</div>
            <div class="card settings-card">
              ${notes.map(([t, when]) => `<div class="note-line">
                <span class="note-text">${t}<span class="note-when">${when}</span></span>
                <span class="note-kebab">${sized(I.kebab, 22)}</span>
              </div>`).join('')}
            </div>
            <div class="note-foot">Decisions and details that live only in this project. Click &#8942; to edit or delete one, or just say so in chat. Notes are stored on our servers and are not end-to-end encrypted.</div>
          </div>
        </div>
        <span class="dt-modal-x">${stroked('<path d="M6 6l12 12M18 6L6 18"/>', 20)}</span>
      </div>
    </div>`;


// ------------------------------------------------------------------ shell

const page = (extraStyle, dialog) => `<!doctype html>
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

  /* .dt-shell is position:absolute against #app in the app; #app has no
     height of its own here, so give it one. */
  #app { height: 100%; position: relative; }

  /* The transcript scrolls in the app. Here it is fixed, and bottom-aligned
     the way a real one sits at its latest message. */
  .transcript { justify-content: flex-end; overflow: hidden; }

  /* The pointer reaches the frame so the app's hover states fire, but
     nothing in here does anything when clicked — so the cursor never
     promises one. */
  * { cursor: default !important; }
  textarea { pointer-events: none; }

  /* Only one of the two headers at a time. */
  .topbar { display: none; }

  /* The frame gets a phone-width viewport on small screens. Below 1024 the
     app's own desktop rules stop applying, so .dt-side and .dt-topbar fall
     back to their elements' defaults — both have to be switched off
     explicitly, and the phone's .topbar switched on in their place. A 420px
     rail would leave nothing for the conversation, which is the part that
     argues. */
  @media (max-width: 900px) {
    .dt-side, .dt-topbar { display: none; }
    .topbar { display: flex; }
    .dt-main { width: 100%; }
  }
${extraStyle}</style>
</head>
<body>

<div id="app" class="desk">
  <div class="screen dt-shell">
${sidebar}

    <div class="dt-main">
${topbar}
${transcript}
${composer}
    </div>
${dialog}
  </div>
</div>

</body>
</html>
`;

// Both animations run once on load and then sit finished, so in a still they
// are only a fade the reader may catch part-way through.
//
// The narrow block unwraps the dialog rather than shrinking it. Every
// .dt-modal rule lives behind the app's own `min-width: 1024px`, so below
// that the panel has no geometry at all — but its body is notesScreen(),
// which is the phone's Memory screen verbatim and styled by the base rules.
// Dropping the chrome around it leaves exactly what a phone shows.
const dialogStyle = `
  .scrim, .dt-modal { animation: none; }

  @media (max-width: 900px) {
    .dt-main, .scrim, .dt-modal-nav, .dt-modal-x { display: none; }
    .dt-modal { display: block; width: 100%; height: 100%; }
    .dt-modal-body { height: 100%; }
  }
`;

fs.writeFileSync('demo.html', page('', ''));
fs.writeFileSync('demo-memory.html', page(dialogStyle, memoryDialog));
console.log('demo.html + demo-memory.html written');
