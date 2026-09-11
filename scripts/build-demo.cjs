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
// <style> blocks below are only what a still or a scripted run needs and a
// live app doesn't.
//
// Two frames. demo.html is the hero, and it PLAYS: a scripted run through the
// app — a decision typed and sent, the reply with its memory receipt, the
// project's memory opened on those notes, a long conversation scrolling past,
// then a question answered from the note. Every element on screen during the
// run is the app's own markup, inserted the way the app would render it; the
// only additions are a pointer and a touch ring, which stand for the viewer's
// hand. demo-memory.html is a still of the memory panel with a fuller
// project's notes in it.
//
// They run in iframes because app.css styles `body`, `#app` and `*`
// globally — inlined into the landing page they would restyle the document.
const fs = require('fs');
const I = JSON.parse(fs.readFileSync('.tmp-icons.json', 'utf8'));

// cloudAvatar(size) and mascot(size, variant) take arguments, so the
// extracted templates still carry their placeholders.
const cloud = (size) => I.cloud.split('${size}').join(size);

// mascot()'s two variants, from its own `sh` branch. The ids differ per variant
// in the app too, and here that is load-bearing: on a phone the sidebar that
// holds the drawer mascot is display:none, and a gradient referenced from a
// hidden subtree does not paint — the empty chat's cloud would come out blank.
const SHADOW = {
  drawer: { dy: '13.42', blur: '11.93', matrix: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0' },
  main: { dy: '8', blur: '10', matrix: '0 0 0 0 0.054902 0 0 0 0 0.117647 0 0 0 0 0.172549 0 0 0 0.1 0' },
};
const mascot = (size, variant = 'drawer') => I.mascotTpl
  .split('${size}').join(size)
  .split('${h}').join(Math.round(size * 226 / 342))
  .split('${CLOUD_D}').join(I.cloudD)
  .split('${fid}').join('skyCloudShadow-' + variant)
  .split('${gid}').join('skyCloudGrad-' + variant)
  .split('${sh.dy}').join(SHADOW[variant].dy)
  .split('${sh.blur}').join(SHADOW[variant].blur)
  .split('${sh.matrix}').join(SHADOW[variant].matrix);

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

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');


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
             The first is what the pointer clicks during the run. -->
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
          <!-- "Reply", not "Ask": the app switches the placeholder once the
               conversation has an answer in it. The run resets it to "Ask"
               for its empty chat and switches it back on the first reply. -->
          <textarea rows="1" placeholder="Reply to SkyOS" readonly tabindex="-1"></textarea>
          <span class="mic">${sized(I.mic, 24, [['${(s * 24.4364 / 24).toFixed(2)}', '24.44']])}</span>
          <span class="orb">${sized(I.wave, 36)}</span>
        </div>
      </div>`;

// <button>, not <span>, because the app's hover rule for these is written
// `.actions button:hover` — as spans they were the one row of controls in the
// card that stayed dead under the pointer. tabindex keeps them out of the tab
// order, since nothing in here is operable.
const msgActions = `
          <div class="actions">
            <button type="button" tabindex="-1">${sized(I.copy, 20)}</button>
            <button type="button" tabindex="-1">${sized(I.share, 22)}</button>
            <button type="button" tabindex="-1">${sized(I.moreDots, 20)}</button>
          </div>`;

// Your own message carries a strip too — copy, share, edit — absolutely
// positioned under the bubble at opacity 0 until the row is hovered. data-tip
// is what draws the tooltip: the ::after reads the attribute, no script.
const userActions = `
          <div class="actions user-actions">
            <button type="button" tabindex="-1" data-tip="Copy message">${sized(I.copy, 20)}</button>
            <button type="button" tabindex="-1" data-tip="Share prompt">${sized(I.share, 22)}</button>
            <button type="button" tabindex="-1" data-tip="Edit message">${svg('width="20" height="20" viewBox="0 0 18 18"', I.rename)}</button>
          </div>`;


// --------------------------------------------------------------- messages
//
// The *Raw builders take HTML that is already escaped, so the same markup
// serves the static frame (real text) and the run's templates ({{TEXT}}).

const userRowRaw = (textHtml) => `
        <div class="msg-user-row">
          <div class="msg-user">${textHtml}</div>
${userActions}
        </div>`;

// The app's own extractionBadge(): a .mem-badge carrying FIG.memNav(13).
const badge = (saved) => `<div class="mem-badge mem-ok">${memNav(13)}Saved ${saved} to memory</div>`;

const aiMsgRaw = (textHtml, badgeHtml) => `
        <div class="msg-ai">
          ${cloud(30)}
          <div class="ai-text">${textHtml}</div>
${msgActions}
          ${badgeHtml}
        </div>`;

const userRow = (text) => userRowRaw(esc(text));
const aiMsg = (text, saved) => aiMsgRaw(esc(text), saved ? badge(saved) : '');


// ----------------------------------------------------------------- script
//
// What gets said. The opening decision and the closing answer carry the same
// claim the comparison section quotes ("Supabase — 5x Clerk's free-user
// ceiling"), so the page makes it once, consistently, in three places.
//
// The run's argument is LENGTH, not time. An early version put a "two weeks
// later" divider between a decision and a question about it; the app has no
// such divider, and four messages apart every assistant answers correctly. So
// the question comes after a long stretch of ordinary work, and the answer is
// the note's wording.
const S = {
  ask1: 'Going with Supabase for auth — its free tier covers 5× the users Clerk’s does.',
  reply1: 'This keeps the stack lean: Supabase for authentication and Stripe for payments, with no extra provider costs at launch.',
  askFinal: 'Why didn’t we go with Clerk?',
  replyFinal: 'Supabase’s free tier covers 5× the users Clerk’s does, so auth went to Supabase.',
};

// The long stretch. Mostly turns that decide nothing, so mostly no receipt —
// the app is silent when nothing durable was said, and a badge on every reply
// would be a claim it does not make. The one that does decide something is
// the launch date, which the memory card further down the page also holds.
const FILLER = [
  ['Lock the launch to before the 15th.', 'Locked in. That gives you nine working days, and the booking flow is the only piece still unfinished.', '1 note'],
  ['What’s left in the booking flow?', 'Picking a time slot, the confirmation screen, and the reminder the day before.'],
  ['15 or 30 minute slots?', 'Most salons book in 30-minute steps. 15 only makes the picker longer.'],
  ['Draft the confirmation text', 'Booked: haircut with Dana, Friday at 14:30. Reply C to cancel.'],
  ['How should the reminder go out?', 'By SMS the day before. It gets read, and the email stays as the receipt.'],
  ['Can one booking hold two services?', 'Yes. Stack them back to back and send one confirmation.'],
  ['What does the owner see first?', 'Today’s bookings in time order, with gaps highlighted so they can fill them.'],
  ['Any risk in guest checkout?', 'No-shows. A card on file with a small hold covers most of it.'],
];

// The static frame is the run's LAST frame: the whole conversation, pinned to
// its latest message. It is what shows with scripts off, and what someone who
// has asked their system for reduced motion gets instead of the run.
const transcript = `
      <div class="transcript pin-bottom">
${userRow(S.ask1)}
${aiMsg(S.reply1, '3 notes')}
${FILLER.map(([a, r, s]) => userRow(a) + aiMsg(r, s)).join('')}
${userRow(S.askFinal)}
${aiMsg(S.replyFinal)}
      </div>`;


// ----------------------------------------------------------- memory panel
//
// notesScreen() in project scope, inside deskModal()'s .dt-modal. Both are
// reproduced structurally, never restyled — the dialog geometry, the nav
// rows and every note row are app.css's. "today" is what noteWhen() returns
// for a note saved this turn.
//
// The dialog's own back button is hidden by app.css inside .dt-modal-body,
// so .settings-nav here carries only its title — which is what the app
// actually shows in the dialog.

// A project's memory, not one turn's. The first three are exactly what the
// opening exchange saves, and are all the run's panel shows; the still card
// shows the fuller project.
//
// SEVEN IS THE CEILING for the still. Since notes gained edit and delete
// buttons a row is 74px in the desktop dialog and 91px on a phone: seven fill
// the desktop panel exactly, and the phone frame needs 870px (data-vh-narrow
// in index.html). Nine clipped the last row and the footnote in half. The
// panel scrolls in the app; in a still it just cuts.
const notes = [
  ['Auth is Supabase: its free tier covers 5× the users Clerk’s does.', 'today'],
  ['Payments go through Stripe.', 'today'],
  ['No paid provider costs at launch.', 'today'],
  ['Launch is before the 15th.', 'today'],
  ['Pricing is $15 a month, annual billing only.', '4 days ago'],
  ['Cancellation is free up to 24 hours before check-in.', '6 days ago'],
  ['Room photos are capped at 8 per listing.', '26 days ago'],
];

const noteRows = (list) => list.map(([t, when]) => `<div class="note-line">
                <span class="note-text">${esc(t)}<span class="note-when">${when}</span></span>
                <div class="note-tools">
                  <button type="button" tabindex="-1" class="note-tool tipped" data-tip="Edit">${svg('width="18" height="18" viewBox="0 0 18 18"', I.rename)}</button>
                  <button type="button" tabindex="-1" class="note-tool note-tool-danger tipped" data-tip="Delete">${svg('width="18" height="18" viewBox="0 0 18 18"', I.trash)}</button>
                </div>
              </div>`).join('');

const navRow = (label, ico, on, soon) => (soon
  ? `<span class="dt-nav-row is-soon"><span class="ico">${ico}</span>${label}<span class="soon-tag">Soon</span></span>`
  : `<span class="dt-nav-row${on ? ' active' : ''}"><span class="ico">${ico}</span>${label}</span>`);

const memoryDialog = (list) => `
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
              ${noteRows(list)}
            </div>
            <div class="note-foot">Decisions and details that live only in this project. Edit or delete one from its row, or just say so in chat. Notes are stored on our servers and are not end-to-end encrypted.</div>
          </div>
        </div>
        <span class="dt-modal-x">${stroked('<path d="M6 6l12 12M18 6L6 18"/>', 20)}</span>
      </div>
    </div>`;

// The same notesScreen() as the phone draws it: a whole screen with its back
// button, and "Tap" where the desktop says "Click". On a phone the app swaps
// the screen in one go — there is no whole-screen transition to imitate.
const phoneNotes = (list) => `
  <div class="screen demo-notes">
    <div class="settings-nav">
      <span class="circle-btn">${stroked('<path d="M19 12H5M12 5l-7 7 7 7"/>', 20)}</span>
      <div class="title">Memory</div>
      <div style="width:48px"></div>
    </div>
    <div class="settings-scroll">
      <div class="settings-section">Booking app</div>
      <div class="card settings-card">
        ${noteRows(list)}
      </div>
      <div class="note-foot">Decisions and details that live only in this project. Edit or delete one from its row, or just say so in chat. Notes are stored on our servers and are not end-to-end encrypted.</div>
    </div>
  </div>`;


// -------------------------------------------------------------------- run
//
// Everything the run inserts, prebuilt here from the same builders as the
// static markup, so the script never writes app markup of its own.
const templates = {
  s: S,
  // emptyHtml(), plus what composer-wrap carries while a chat is empty: the
  // import slot (already dismissed for this account, so the empty slot that
  // keeps the composer from jumping) and the disclaimer.
  empty: `<div class="empty"><div class="empty-cloud">${mascot(180, 'main')}</div><div class="empty-greeting"></div></div>`,
  emptyExtras: '<div class="imp-nudge-slot"></div><p class="ai-note">SkyOS can make mistakes, including about what it remembers.</p>',
  userRow: userRowRaw('{{TEXT}}'),
  aiMsg: aiMsgRaw('{{TEXT}}', '{{BADGE}}'),
  badge: badge('{{N}}'),
  typing: `<div class="msg-ai">${cloud(30)}<div class="typing"><i></i><i></i><i></i></div></div>`,
  filler: FILLER.map(([a, r, s]) => userRow(a) + aiMsg(r, s)).join(''),
  dialog: memoryDialog(notes.slice(0, 3)),
  phoneNotes: phoneNotes(notes.slice(0, 3)),
  // The orb is the send arrow while there is text, the voice wave otherwise,
  // and the mic hides while it can send — composerHtml()'s canSend.
  arrowUp: stroked('<path d="M12 19V6M6 12l6-6 6 6"/>', 20),
  wave: sized(I.wave, 36),
  cursor: '<div class="demo-cursor" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l14.5 8.6-6.3 1.4-3.4 6.1L5 3z" fill="#0E1E2C" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/></svg></div>',
};

// Written without template literals, backslashes or dollar-brace, because it
// sits inside one here.
const runScript = `
<script>
(function () {
  var T = ${JSON.stringify(templates).replace(/</g, '\\u003c')};

  // Reduced motion gets the last frame, which is the static markup as served.
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var app = document.getElementById('app');
  var shell = document.querySelector('.dt-shell');
  var main = document.querySelector('.dt-main');
  var wrap = main.querySelector('.composer-wrap');
  var ta = wrap.querySelector('textarea');
  var mic = wrap.querySelector('.mic');
  var orb = wrap.querySelector('.orb');
  var isDesk = function () { return matchMedia('(min-width: 1024px)').matches; };

  // ---- a clock that only runs while the card can be seen.
  // Inside a frame the implicit root of an IntersectionObserver is the top
  // page's viewport, so this pauses when the card is scrolled away.
  var onScreen = !('IntersectionObserver' in window);
  if (!onScreen) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[entries.length - 1].isIntersecting;
    }, { threshold: 0.15 }).observe(document.documentElement);
  }
  function playing() { return onScreen && !document.hidden; }
  function frame() { return new Promise(function (r) { requestAnimationFrame(r); }); }
  async function wait(ms) {
    var last = performance.now();
    while (ms > 0) {
      await frame();
      var now = performance.now();
      if (playing()) ms -= Math.min(now - last, 100);
      last = now;
    }
  }
  function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  async function tween(ms, step) {
    var t = 0, last = performance.now();
    while (t < ms) {
      await frame();
      var now = performance.now();
      if (playing()) t += Math.min(now - last, 100);
      last = now;
      step(ease(Math.min(t / ms, 1)));
    }
  }

  // ---- markup helpers
  function el(markup) {
    var t = document.createElement('template');
    t.innerHTML = markup.trim();
    return t.content.firstElementChild;
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fill(tpl, key, value) { return tpl.split(key).join(value); }
  function removeAll(root, sel) { Array.prototype.forEach.call(root.querySelectorAll(sel), function (n) { n.remove(); }); }
  function transcript() { return main.querySelector('.transcript'); }
  function toBottom() { var tr = transcript(); if (tr) tr.scrollTop = tr.scrollHeight; }

  // ---- the composer, as the app drives it
  // growComposer(): measure unstacked, toggle .stacked, cap at five lines.
  var MAX_H = 148, sendOn = false;
  function grow() {
    var bar = ta.closest('.composer');
    bar.classList.remove('stacked');
    ta.style.height = 'auto';
    var cs = getComputedStyle(ta);
    var line = parseFloat(cs.lineHeight) || 29;
    var pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    bar.classList.toggle('stacked', ta.scrollHeight - pad > line * 1.6);
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, MAX_H) + 'px';
    ta.style.overflowY = ta.scrollHeight > MAX_H ? 'auto' : 'hidden';
  }
  function setSend(on) {
    if (on === sendOn) return;
    sendOn = on;
    mic.style.display = on ? 'none' : '';
    orb.innerHTML = on ? T.arrowUp : T.wave;
  }
  async function type(text) {
    for (var i = 1; i <= text.length; i++) {
      ta.value = text.slice(0, i);
      grow();
      setSend(true);
      await wait(',.?—'.indexOf(text.charAt(i - 1)) >= 0 ? 150 : 24 + Math.random() * 24);
    }
  }
  function greeting() {
    var h = new Date().getHours();
    return (h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening') + ', Aleksander';
  }

  // ---- the conversation
  function reset() {
    removeAll(document, '.scrim, .dt-modal, .demo-notes');
    shell.style.visibility = '';
    shell.classList.remove('demo-blur');
    if (cursorEl) cursorEl.classList.remove('on');
    var empty = el(T.empty);
    empty.querySelector('.empty-greeting').textContent = greeting();
    main.replaceChild(empty, main.querySelector('.transcript, .empty'));
    removeAll(wrap, '.imp-nudge-slot, .ai-note');
    wrap.insertAdjacentHTML('beforeend', T.emptyExtras);
    ta.value = '';
    ta.placeholder = 'Ask SkyOS';
    grow();
    setSend(false);
  }
  async function send(text) {
    orb.classList.add('demo-press');
    await wait(140);
    orb.classList.remove('demo-press');
    var tr = transcript();
    if (!tr) {
      // The first message: the app swaps emptyHtml() for the transcript, and
      // the empty-chat extras under the composer go with it.
      tr = el('<div class="transcript"></div>');
      main.replaceChild(tr, main.querySelector('.empty'));
      removeAll(wrap, '.imp-nudge-slot, .ai-note');
    }
    tr.insertAdjacentHTML('beforeend', fill(T.userRow, '{{TEXT}}', esc(text)));
    ta.value = '';
    grow();
    setSend(false);
    toBottom();
  }
  function typing() {
    var dots = el(T.typing);
    transcript().appendChild(dots);
    toBottom();
    return dots;
  }
  function reply(dots, text, saved) {
    // No streaming: the app waits for the whole reply and brings it in with
    // .msg-in, receipt included.
    var msg = el(fill(fill(T.aiMsg, '{{TEXT}}', esc(text)), '{{BADGE}}', saved ? fill(T.badge, '{{N}}', saved) : ''));
    msg.classList.add('msg-in');
    dots.replaceWith(msg);
    ta.placeholder = 'Reply to SkyOS';
    toBottom();
  }

  // ---- the viewer's hand
  var cursorEl = null, pos = { x: 0, y: 0 };
  function cursor() {
    if (!cursorEl) { cursorEl = el(T.cursor); document.body.appendChild(cursorEl); }
    return cursorEl;
  }
  function place(p) {
    pos = p;
    // The arrow's tip sits at (6, 4) in its 30px box.
    cursor().style.transform = 'translate(' + (p.x - 6) + 'px,' + (p.y - 4) + 'px)';
  }
  function center(node) {
    var r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  async function moveTo(p, ms) {
    var a = pos;
    await tween(ms, function (k) { place({ x: a.x + (p.x - a.x) * k, y: a.y + (p.y - a.y) * k }); });
  }
  async function click() {
    cursor().classList.add('press');
    await wait(130);
    cursor().classList.remove('press');
    await wait(90);
  }
  function tap(p) {
    var ring = el('<div class="demo-tap"></div>');
    ring.style.left = p.x + 'px';
    ring.style.top = p.y + 'px';
    document.body.appendChild(ring);
    setTimeout(function () { ring.remove(); }, 600);
  }

  // ---- opening the project's memory
  async function memoryDesk() {
    // The top bar's own memory button, which opens this dialog in the app.
    place({ x: innerWidth * 0.64, y: innerHeight * 0.74 });
    cursor().classList.add('on');
    await wait(260);
    await moveTo(center(main.querySelector('.dt-bar-acts .circle-btn')), 950);
    await click();
    shell.insertAdjacentHTML('beforeend', T.dialog);
    shell.classList.add('demo-blur');
    await wait(2900);
    await moveTo(center(shell.querySelector('.dt-modal-x')), 720);
    await click();
    var scrim = shell.querySelector('.scrim'), modal = shell.querySelector('.dt-modal');
    scrim.classList.add('closing');
    modal.classList.add('demo-closing');
    shell.classList.remove('demo-blur');
    await wait(230);
    scrim.remove();
    modal.remove();
    await moveTo({ x: innerWidth * 0.7, y: innerHeight * 0.8 }, 650);
    cursor().classList.remove('on');
  }
  async function memoryPhone() {
    // On a phone memory lives behind the drawer, several taps deep; the run
    // cuts straight to the screen, the way the app replaces one screen with
    // the next, and taps back out through the real back button.
    shell.style.visibility = 'hidden';
    app.insertAdjacentHTML('beforeend', T.phoneNotes);
    await wait(3000);
    var notes = app.querySelector('.demo-notes');
    tap(center(notes.querySelector('.settings-nav .circle-btn')));
    await wait(320);
    notes.remove();
    shell.style.visibility = '';
  }

  // ---- a long conversation going by
  async function longScroll() {
    var tr = transcript();
    tr.insertAdjacentHTML('beforeend', T.filler);
    var from = tr.scrollTop, to = tr.scrollHeight - tr.clientHeight;
    await tween(2900, function (k) { tr.scrollTop = from + (to - from) * k; });
  }

  async function run() {
    for (;;) {
      await wait(1000);
      await type(T.s.ask1);
      await wait(260);
      await send(T.s.ask1);
      var dots = typing();
      await wait(1150);
      reply(dots, T.s.reply1, '3 notes');
      await wait(1800);

      if (isDesk()) await memoryDesk(); else await memoryPhone();
      await wait(500);

      await longScroll();
      await wait(650);

      await type(T.s.askFinal);
      await wait(260);
      await send(T.s.askFinal);
      dots = typing();
      await wait(1100);
      reply(dots, T.s.replyFinal, null);
      await wait(5000);

      main.style.transition = 'opacity .35s ease';
      main.style.opacity = '0';
      await wait(380);
      reset();
      main.style.opacity = '';
      await wait(380);
      main.style.transition = '';
    }
  }

  // Synchronously, before first paint, so the finished conversation never
  // flashes up ahead of the empty chat the run starts from.
  reset();
  run();
})();
</script>`;


// ------------------------------------------------------------------ shell

const page = (extraStyle, dialog, script, shellClass = 'screen dt-shell') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SkyOS</title>
<!-- The app's stylesheet, unmodified. -->
<link rel="stylesheet" href="assets/app.css">

<!-- The serif, and AFTER app.css on purpose. app.css declares Cormorant
     Garamond from fonts/CormorantGaramond-Variable.ttf, relative to itself —
     here that is assets/fonts/, which does not exist. Every load logged a 404
     and fell back to a Google request for 500 and 700 only, so the 600 the app
     uses eleven times, the Settings title among them, rendered at 700.

     This is the same variable font over the same 300-700 weight axis. Declared
     last, its faces win the match and app.css's src is never requested. The
     sans needs nothing: the app's --sans is the system stack, so the Inter this
     used to load was never drawn. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300..700&display=swap" rel="stylesheet">

<style>
  /* The only additions. Nothing below restyles the app's own furniture. */

  html, body { height: 100%; overflow: hidden; }

  /* .dt-shell is position:absolute against #app in the app; #app has no
     height of its own here, so give it one. */
  #app { height: 100%; position: relative; }

  /* The transcript scrolls in the app; here nothing shows a scrollbar, and the
     run scrolls it by script. The static frame is pinned to its latest
     message, the way a real one sits. Only the static frame: flex-end puts
     overflow above the top, where scrollTop can never reach it. */
  .transcript { overflow: hidden; }
  .transcript.pin-bottom { justify-content: flex-end; }

  /* The pointer reaches the frame so the app's hover states fire, but
     nothing in here does anything when clicked — so the cursor never
     promises one. */
  * { cursor: default !important; }
  textarea { pointer-events: none; }

  /* The app forbids overscroll on html and body so an installed app never
     rubber-bands. In a frame the same rule keeps a scroll from chaining out to
     the landing page, so a gesture that starts on the card goes nowhere. Touch
     screens are also handled on the page side, where the frames ignore touches;
     this covers trackpads and touchscreen laptops, which keep their hovers. */
  html, body { overscroll-behavior: auto; touch-action: auto; }

  /* The Settings scrim blurs what is behind it with backdrop-filter. Inside a
     frame the page scales with a transform, software compositing (hardware
     acceleration off, some VMs and remote desktops) fills part of that
     backdrop with a mirrored copy of the chat — rows doubled, text upside
     down. Blurring the app itself draws the same picture on every compositor;
     the GPU path renders the two identically. */
  .scrim-blur { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .dt-shell > .dt-side, .dt-shell > .dt-main { transition: filter .2s ease; }
  .dt-shell.demo-blur > .dt-side, .dt-shell.demo-blur > .dt-main { filter: blur(6px); }

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
    /* On a phone the app has no .dt-main: topbar, transcript and composer are
       children of .screen, a full-height column, so the transcript's flex: 1
       is bounded and it scrolls. Wrapped in .dt-main they were not — the
       transcript grew to fit its content, never scrolled, and pushed the
       composer out of the frame. This makes .dt-main that column. */
    .dt-main { width: 100%; flex: 1; min-height: 0; display: flex; flex-direction: column; }
  }
${extraStyle}</style>
</head>
<body>

<div id="app" class="desk">
  <div class="${shellClass}">
${sidebar}

    <div class="dt-main">
${topbar}
${transcript}
${composer}
    </div>
${dialog}
  </div>
</div>
${script}
</body>
</html>
`;

// The run's furniture. The pointer and the touch ring are the viewer's hand,
// not the app. The other two are states the app gets from :active and from
// unmounting, which a script can trigger neither of.
const runStyle = `
  .demo-cursor {
    position: fixed; left: 0; top: 0; z-index: 1000;
    pointer-events: none; opacity: 0; transition: opacity .2s ease;
  }
  .demo-cursor.on { opacity: 1; }
  .demo-cursor svg {
    display: block; transform-origin: 6px 4px; transition: transform .12s ease;
    filter: drop-shadow(0 1px 2px rgba(14, 30, 44, .3));
  }
  .demo-cursor.press svg { transform: scale(.82); }

  .demo-tap {
    position: fixed; z-index: 1000; width: 46px; height: 46px; margin: -23px 0 0 -23px;
    border-radius: 50%; background: rgba(14, 30, 44, .16); pointer-events: none;
    animation: demo-tap .5s ease-out forwards;
  }
  @keyframes demo-tap { from { transform: scale(.35); opacity: 1; } to { transform: scale(1); opacity: 0; } }

  /* .composer .orb:active, which a script cannot trigger. */
  .composer .orb.demo-press { background: var(--deep-sky); transform: scale(0.96); }

  /* The dialog unmounting. The scrim has the app's own .closing fade. */
  .dt-modal.demo-closing { opacity: 0; transition: opacity .18s ease; }
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

fs.writeFileSync('demo.html', page(runStyle, '', runScript));
fs.writeFileSync('demo-memory.html', page(dialogStyle, memoryDialog(notes), '', 'screen dt-shell demo-blur'));
console.log('demo.html + demo-memory.html written');
