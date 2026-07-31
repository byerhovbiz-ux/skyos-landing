/* ==========================================================================
   SkyOS — Early Access landing page
   No dependencies. Loaded with `defer`.
   ========================================================================== */
(function () {
  'use strict';

  /* =======================================================================
     1. COUNTDOWN
     TODO(dev): set BETA_RELEASE to the real launch timestamp (UTC).
     The Figma design shows a static 13d : 23h : 59m — this ticks for real.
     ==================================================================== */
  var BETA_RELEASE = new Date('2026-08-11T23:59:00Z');

  var els = {
    days:  document.getElementById('cdDays'),
    hours: document.getElementById('cdHours'),
    mins:  document.getElementById('cdMins')
  };

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function renderCountdown() {
    if (!els.days || !els.hours || !els.mins) return;

    var diff = BETA_RELEASE - Date.now();
    if (diff < 0) diff = 0;

    var totalMins = Math.floor(diff / 60000);
    var days  = Math.floor(totalMins / 1440);
    var hours = Math.floor((totalMins % 1440) / 60);
    var mins  = totalMins % 60;

    els.days.textContent  = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent  = pad(mins);
  }

  renderCountdown();
  setInterval(renderCountdown, 1000); // Update every second for real-time countdown

  /* =======================================================================
     2. CONFETTI
     Self-contained canvas burst — no library, no network request.
     Skipped entirely when the user prefers reduced motion.
     ==================================================================== */
  var CONFETTI_COLORS = [
    '#0A66C2',  // brand blue
    '#3E8EDE',  // light blue
    '#A9CFF0',  // pale sky
    '#F5C24C',  // warm gold, for the pop
    '#FFFFFF'
  ];

  function burstConfetti(originEl) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var rect = originEl.getBoundingClientRect();
    var originX = rect.left + rect.width / 2;
    var originY = rect.top + rect.height / 2;

    var canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var COUNT = 90;
    var pieces = [];

    for (var i = 0; i < COUNT; i++) {
      // Fan upward and outward from the button
      var angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.9);
      var speed = 7 + Math.random() * 9;
      pieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 5,
        h: 9 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.32,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        life: 0,
        ttl: 90 + Math.random() * 45
      });
    }

    var GRAVITY = 0.32;
    var DRAG = 0.988;

    // requestAnimationFrame is paused while the tab is hidden, which would
    // otherwise leave the canvas on the page indefinitely. Guarantee removal.
    var removed = false;
    function cleanUp() {
      if (removed) return;
      removed = true;
      clearTimeout(failsafe);
      canvas.remove();
    }
    var failsafe = setTimeout(cleanUp, 6000);

    function frame() {
      if (removed) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = 0;

      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        if (p.life > p.ttl) continue;
        alive++;

        p.life++;
        p.vx *= DRAG;
        p.vy = p.vy * DRAG + GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;

        var fade = 1 - (p.life / p.ttl);
        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // scaleY fakes the flutter of a flat ribbon turning over
        ctx.scale(1, Math.abs(Math.cos(p.life * 0.12)) * 0.85 + 0.15);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (alive > 0) {
        requestAnimationFrame(frame);
      } else {
        cleanUp();
      }
    }

    requestAnimationFrame(frame);
  }

  /* =======================================================================
     3. WAITLIST FORM  →  Kit (ConvertKit)

     Posts directly from this form — no iframe, no popup, no redirect.
     The visitor stays on the page the whole time.

     This is the same endpoint Kit's own embed script targets; we skip their
     script and stylesheet so the page keeps its own design. The form ID is
     public — it only accepts subscriptions, it cannot read the list.

     IMPORTANT — Kit gives one form TWO ids, and they are not interchangeable:
       9739669  submission endpoint  (the `action` in Kit's embed code)  ← use this
       9742377  designer id          (app.kit.com/forms/designers/9742377/edit)
     Both are the "Clare form". Only the first accepts subscriptions. Kit
     answers {"status":"success"} either way, so testing the endpoint cannot
     tell them apart — always copy the id out of the embed code.

     Double opt-in is off on that form (auto-confirm on, confirmation email
     unticked), so subscribers are confirmed the moment they submit.
     ==================================================================== */
  var KIT_ENDPOINT = 'https://app.kit.com/forms/9739669/subscriptions';

  var form   = document.getElementById('waitlistForm');
  var input  = document.getElementById('email');
  var status = document.getElementById('waitlistStatus');

  if (!form || !input || !status) return;

  function setStatus(message, state) {
    status.textContent = message;
    if (state) { status.setAttribute('data-state', state); }
    else { status.removeAttribute('data-state'); }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var value = input.value.trim();

    if (!value) {
      setStatus('Please enter your email address.', 'error');
      input.focus();
      return;
    }
    if (!input.checkValidity()) {
      setStatus('That email address doesn’t look right.', 'error');
      input.focus();
      return;
    }

    var btn = form.querySelector('.waitlist__btn');
    btn.disabled = true;
    setStatus('Adding you…');

    fetch(KIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email_address: value })
    })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        form.reset();
        setStatus('You’re on the list. We’ll email you when the beta opens.', 'success');
        burstConfetti(btn);
      })
      .catch(function () {
        setStatus('Something went wrong. Try again?', 'error');
      })
      .then(function () {
        btn.disabled = false;
      });
  });

  // Clear the error as soon as the user starts fixing it
  input.addEventListener('input', function () {
    if (status.getAttribute('data-state') === 'error') setStatus('');
  });

})();
