// The demo: the SkyOS app itself, drawn in index.html from the app's own
// Dashboard and Memory pages. It shows the Dashboard, then the memory's page,
// where the note just saved from ChatGPT lights up, and loops.
//
// It pauses while the window is off screen or the tab is hidden, and picks
// up where it stopped. Picking Dashboard or Memory in the app's bar shows
// that page and stops the loop there. With reduced motion it doesn't play by
// itself: it stays on the memory's page.
(function () {
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var screens = demo.querySelectorAll('[data-screen]');
  var picks = demo.querySelectorAll('[data-show]');
  var fresh = demo.querySelector('[data-fresh]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STOP = {};
  var run = 0;            // the current loop; a new one, or a pick, ends the old
  var onScreen = true;
  var pageShown = !document.hidden;

  function show(i) {
    Array.prototype.forEach.call(screens, function (s, j) { s.classList.toggle('is-active', i === j); });
    Array.prototype.forEach.call(picks, function (p) { p.setAttribute('aria-pressed', String(Number(p.dataset.show) === i)); });
  }

  // The just-saved note's wash, from the start again.
  function lightUp() {
    fresh.classList.remove('is-new');
    void fresh.offsetWidth;
    fresh.classList.add('is-new');
  }

  // A pause that counts only while the demo can be seen, and ends the loop if
  // a newer one has started.
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

  function play() {
    var id = ++run;
    function loop() {
      show(0);
      return wait(3600, id)
        .then(function () { show(1); return wait(500, id); })
        .then(function () { lightUp(); return wait(4800, id); })
        .then(loop);
    }
    loop().catch(function (e) { if (e !== STOP) throw e; });
  }

  Array.prototype.forEach.call(picks, function (pick) {
    pick.addEventListener('click', function () {
      run += 1;
      var i = Number(pick.dataset.show);
      show(i);
      if (i === 1) lightUp();
    });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
    }).observe(demo);
  }
  document.addEventListener('visibilitychange', function () { pageShown = !document.hidden; });

  if (still) { show(1); return; }
  play();
})();
