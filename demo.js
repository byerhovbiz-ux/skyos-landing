// The demo: the SkyOS app itself, drawn in index.html from the app's own
// Dashboard and Memory pages, each with the app's top bar, which scrolls away
// with the page as it does in the app. It shows the Dashboard, then the
// memory's page, and loops.
//
// It pauses while the window is off screen or the tab is hidden, and picks
// up where it stopped. Once the visitor scrolls or clicks in it, it stops
// for good and is theirs: the bar, "All memories" and "Northwind pricing"
// move between the pages, and nothing else does anything. Each page fades
// out at the bottom until it is scrolled to its end. With reduced motion it
// doesn't play by itself: it stays on the memory's page.
(function () {
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var screens = demo.querySelectorAll('[data-screen]');
  var picks = demo.querySelectorAll('[data-show]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STOP = {};
  var run = 0;            // the current loop; a new one, or a pick, ends the old
  var onScreen = true;
  var pageShown = !document.hidden;

  function show(i) {
    Array.prototype.forEach.call(screens, function (s, j) { s.classList.toggle('is-active', i === j); });
    Array.prototype.forEach.call(screens, edge);
  }

  // The fade at the bottom of a page, until it is scrolled to its end.
  function edge(s) { s.classList.toggle('at-end', s.scrollTop + s.clientHeight >= s.scrollHeight - 2); }

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
        .then(function () { show(1); return wait(5300, id); })
        .then(loop);
    }
    loop().catch(function (e) { if (e !== STOP) throw e; });
  }

  Array.prototype.forEach.call(picks, function (pick) {
    pick.addEventListener('click', function () { show(Number(pick.dataset.show)); });
  });
  // Any hand on it ends the loop, so it never switches pages under someone.
  ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (type) {
    demo.addEventListener(type, function () { run += 1; }, { passive: true });
  });
  Array.prototype.forEach.call(screens, function (s) {
    s.addEventListener('scroll', function () { edge(s); }, { passive: true });
  });
  Array.prototype.forEach.call(screens, edge);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
    }).observe(demo);
  }
  document.addEventListener('visibilitychange', function () { pageShown = !document.hidden; });

  if (still) { show(1); return; }
  play();
})();
