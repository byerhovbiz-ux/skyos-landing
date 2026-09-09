// Writes demo.html — the hero card's contents.
//
// This is the app's own stylesheet (assets/app.css, copied verbatim from
// pwa/styles.css) applied to the app's own class names and icon vectors. It
// runs in an iframe because that stylesheet styles `body`, `#app` and `*`
// globally: dropped into the landing page directly it would restyle the
// whole document. The iframe is the isolation boundary.
const fs = require('fs');
const I = JSON.parse(fs.readFileSync('.tmp-icons.json', 'utf8'));

// cloudAvatar(size) in the app takes its size as an argument, so the
// extracted template still has the placeholder in it.
const cloud = (size) => I.cloud.split('${size}').join(size);
const svg = (attrs, body) => `<svg ${attrs} fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SkyOS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- The real app stylesheet, unmodified. -->
<link rel="stylesheet" href="assets/app.css">

<style>
  /* The only additions. Everything visual above comes from app.css.

     The app sizes itself to the window; here it has to fill an iframe of the
     card's shape instead, and it is a still, so the parts that only exist to
     be interacted with are hidden rather than faked. */
  html, body { height: 100%; overflow: hidden; }
  #app { height: 100%; }

  /* Desktop layout in the app is gated on the window being 1024px wide. The
     iframe is narrower than that, so the media query never fires and the
     rail would be hidden. Forcing the two-column shell is what makes this
     the desktop app rather than the phone one. */
  .dt { display: flex; height: 100%; }
  .dt-side { flex: 0 0 309px; border-right: 1px solid rgba(14,30,44,.09); background: var(--surface); display: flex; flex-direction: column; padding: 22px 0; }
  .dt-main { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--bg-top); }

  .dt-brand { display: flex; align-items: center; gap: 10px; padding: 0 17px 24px; font-family: var(--serif); font-size: 26px; font-weight: 700; color: var(--ink); }
  .dt-head { padding: 20px 24px 0; font-size: 20px; font-weight: 600; color: var(--ink); }

  /* .transcript scrolls in the app; here it is a fixed still, bottom-aligned
     the way a real one sits at its latest message. */
  .transcript { justify-content: flex-end; overflow: hidden; padding-left: 24px; padding-right: 24px; }
  .composer { margin: 0 24px 24px; }

  /* Interactive affordances that would be lying in a still. */
  .composer .plus, .composer .mic, .composer .orb { pointer-events: none; }
  .drawer-item, .proj-row { cursor: default; }

  /* The time divider is the claim: the second answer is not in the first
     one's context any more. */
  .dt-gap { display: flex; align-items: center; gap: 12px; color: var(--ink-2); font-size: 14px; font-weight: 300; }
  .dt-gap::before, .dt-gap::after { content: ""; flex: 1; height: 1px; background: var(--soft-sky); }

  /* Matches the pill the app renders under a reply that wrote notes. */
  .dt-saved { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--surface); border: 1px solid rgba(14,30,44,.09); border-radius: 999px; color: var(--ink-2); font-size: 14px; }

  /* Last, so it beats .dt-side's own display on source order. The frame gets
     a phone-width viewport on small screens, where a 309px rail would leave
     roughly 110px for the conversation — which is the part that argues. */
  @media (max-width: 900px) {
    .dt-side { display: none; }
    .transcript { padding-left: 16px; padding-right: 16px; }
    .composer { margin: 0 16px 16px; }
  }
</style>
</head>
<body>

<div id="app" class="desk">
  <div class="dt">

    <div class="dt-side">
      <div class="dt-brand">${cloud(26)}SkyOS</div>

      <nav class="drawer-nav" style="margin-top:0">
        <span class="drawer-item"><span class="ico">${svg('width="18" height="18" viewBox="0 0 20.0337 20.0515"', I.newproj)}</span>New Project</span>
        <span class="drawer-item"><span class="ico">${svg('width="20" height="17.32" viewBox="0 0 22.4002 19.4"', I.memnav)}</span>Memory</span>
        <span class="drawer-item is-soon"><span class="ico">${svg('width="18.5" height="18.5" viewBox="0 0 20.4999 20.5"', I.integr)}</span>Integrations<span class="soon-tag">Soon</span></span>
      </nav>

      <div class="drawer-sec">Recents</div>
      <div class="proj-row active"><span class="proj-open"><span class="nm">Booking app</span></span></div>
      <div class="proj-row"><span class="proj-open"><span class="nm">Meridian redesign</span></span></div>
    </div>

    <div class="dt-main">
      <div class="dt-head">Booking app</div>

      <div class="transcript">
        <div class="msg-user-row">
          <!-- Short enough to survive the crop. The transcript is bottom-
               aligned, so a longer first message loses its own opening — and
               that opening is what the last answer refers back to. The
               project name in the header carries the rest of the setup. -->
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

      <div class="composer">
        <span class="plus">${I.plus.replace(/\$\{s\}/g, '20').replace(/\$\{\(s \* 20\.3636 \/ 20\)\.toFixed\(2\)\}/g, '20.36')}</span>
        <textarea rows="1" placeholder="Ask SkyOS" readonly tabindex="-1"></textarea>
        <span class="mic">${I.mic.replace(/\$\{s\}/g, '24').replace(/\$\{\(s \* 24\.4364 \/ 24\)\.toFixed\(2\)\}/g, '24.44')}</span>
        <span class="orb">${I.wave.replace(/\$\{s\}/g, '36')}</span>
      </div>
    </div>

  </div>
</div>

</body>
</html>
`;

fs.writeFileSync('demo.html', page);
console.log('demo.html written:', page.length, 'chars');
