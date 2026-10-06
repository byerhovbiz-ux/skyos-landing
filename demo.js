// The demo: the SkyOS app itself, drawn in index.html at the app's own sizes
// from its Dashboard and Memory pages, each with the app's top bar, which
// scrolls away with the page as it does in the app. It opens on the memory's
// page and stays there: the bar, "All memories" and "Northwind pricing" move
// between the pages, and nothing else does anything. Each page fades out at
// the bottom until it is scrolled to its end.
(function () {
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var screens = demo.querySelectorAll('[data-screen]');
  var picks = demo.querySelectorAll('[data-show]');

  // The fade at the bottom of a page, until it is scrolled to its end.
  function edge(s) { s.classList.toggle('at-end', s.scrollTop + s.clientHeight >= s.scrollHeight - 2); }

  function show(i) {
    Array.prototype.forEach.call(screens, function (s, j) { s.classList.toggle('is-active', i === j); });
    Array.prototype.forEach.call(screens, edge);
  }

  Array.prototype.forEach.call(picks, function (pick) {
    pick.addEventListener('click', function () { show(Number(pick.dataset.show)); });
  });
  Array.prototype.forEach.call(screens, function (s) {
    s.addEventListener('scroll', function () { edge(s); }, { passive: true });
  });
  window.addEventListener('resize', function () { Array.prototype.forEach.call(screens, edge); });
  Array.prototype.forEach.call(screens, edge);
})();
