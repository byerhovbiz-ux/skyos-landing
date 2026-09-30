// The demo beside the headline: one decision on its way through ChatGPT,
// SkyOS and Claude, played in one card and looped.
//
// Each step is written in index.html in its finished state; this hides the
// steps and brings them back in order: the user's message, the SkyOS call
// (busy, then done), the answer word by word, and on the Memory page the
// note.
//
// It pauses while the card is off screen or the tab is hidden, and picks up
// where it stopped. Picking a step in the header shows it finished and
// pauses; the footer plays, pauses and starts again. With reduced motion it
// doesn't play by itself: it shows the last step finished.
(function () {
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var scenes = demo.querySelectorAll('.demo-scene');
  var picks = demo.querySelectorAll('[data-show]');
  var toggle = demo.querySelector('[data-toggle]');
  var replay = demo.querySelector('[data-replay]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STOP = {};
  var run = 0;            // the current playthrough; a new one ends the old
  var current = scenes.length - 1;
  var onScreen = true;
  var pageShown = !document.hidden;

  // The finished wording, kept before anything is emptied out.
  Array.prototype.forEach.call(demo.querySelectorAll('[data-step]'), function (el) {
    if (el.dataset.step === 'user' || el.dataset.step === 'answer') el.dataset.full = el.textContent;
    if (el.dataset.step === 'call') el.dataset.done = el.querySelector('[data-label]').textContent;
  });

  function steps(scene) { return scene.querySelectorAll('[data-step]'); }

  function show(i) {
    current = i;
    Array.prototype.forEach.call(scenes, function (s, j) { s.classList.toggle('is-active', i === j); });
    Array.prototype.forEach.call(picks, function (p, j) { p.setAttribute('aria-pressed', String(i === j)); });
  }

  function setCall(el, busy) {
    el.classList.toggle('is-busy', busy);
    el.querySelector('[data-label]').textContent = busy ? el.dataset.busy : el.dataset.done;
  }

  function finish(scene) {
    Array.prototype.forEach.call(steps(scene), function (el) {
      el.hidden = false;
      el.classList.remove('is-new');
      if (el.dataset.full) el.textContent = el.dataset.full;
      if (el.dataset.step === 'call') setCall(el, false);
    });
  }

  function reset(scene) {
    finish(scene);
    Array.prototype.forEach.call(steps(scene), function (el) { el.hidden = true; });
  }

  function setPaused(paused) {
    demo.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? 'Play' : 'Pause');
  }

  // A pause that counts only while the demo can be seen, and ends the
  // playthrough if a newer one has started.
  function wait(ms, id) {
    return new Promise(function (resolve, reject) {
      var left = ms;
      var last = performance.now();
      function tick(now) {
        if (id !== run) { reject(STOP); return; }
        if (onScreen && pageShown) left -= now - last;
        last = now;
        if (left <= 0) resolve(); else requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function stream(el, text, id) {
    var words = text.split(' ');
    var n = 0;
    el.textContent = '';
    el.hidden = false;
    function next() {
      if (n >= words.length) return Promise.resolve();
      n += 1;
      el.textContent = words.slice(0, n).join(' ');
      return wait(70, id).then(next);
    }
    return next();
  }

  function playStep(el, id) {
    var kind = el.dataset.step;
    if (kind === 'user') { el.hidden = false; return wait(700, id); }
    if (kind === 'call') {
      setCall(el, true);
      el.hidden = false;
      return wait(1200, id).then(function () { setCall(el, false); return wait(500, id); });
    }
    if (kind === 'answer') return stream(el, el.dataset.full, id).then(function () { return wait(400, id); });
    if (kind === 'note') {
      el.classList.add('is-new');
      el.hidden = false;
      return wait(2600, id);
    }
    return Promise.resolve();
  }

  function playScene(i, id) {
    var scene = scenes[i];
    reset(scene);
    show(i);
    return Array.prototype.reduce.call(steps(scene), function (p, el) {
      return p.then(function () { return playStep(el, id); });
    }, wait(600, id)).then(function () { return wait(i === scenes.length - 1 ? 3200 : 1600, id); });
  }

  function play(from) {
    var id = ++run;
    setPaused(false);
    var i = from;
    function loop() {
      return playScene(i, id).then(function () { i = (i + 1) % scenes.length; return loop(); });
    }
    loop().catch(function (e) { if (e !== STOP) throw e; });
  }

  function pause() {
    run += 1;
    finish(scenes[current]);
    setPaused(true);
  }

  Array.prototype.forEach.call(picks, function (pick) {
    pick.addEventListener('click', function () {
      run += 1;
      var i = Number(pick.dataset.show);
      finish(scenes[i]);
      show(i);
      setPaused(true);
    });
  });
  toggle.addEventListener('click', function () {
    if (demo.classList.contains('is-paused')) play(current); else pause();
  });
  replay.addEventListener('click', function () { play(0); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
    }).observe(demo);
  }
  document.addEventListener('visibilitychange', function () { pageShown = !document.hidden; });

  if (still) {
    Array.prototype.forEach.call(scenes, finish);
    show(scenes.length - 1);
    setPaused(true);
    return;
  }
  play(0);
})();
