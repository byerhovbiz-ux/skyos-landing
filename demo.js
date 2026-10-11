// The demo: the SkyOS app's Memory page, drawn in index.html at the app's own
// sizes. It scrolls inside its window and fades out at the bottom until it is
// scrolled to its end, then hands the wheel back to the page. Nothing in it
// does anything else.
(function () {
  var page = document.querySelector('[data-demo] [data-screen]');
  if (!page) return;
  function edge() { page.classList.toggle('at-end', page.scrollTop + page.clientHeight >= page.scrollHeight - 2); }
  page.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge);
  edge();

  // A wheel the demo can't use any more (at its end and scrolling on, or at
  // its top and scrolling back) moves the page instead. Left to the browser,
  // the rest of that wheel movement stays with the demo, and the page seems
  // stuck until the mouse moves. The page glides there as a wheel scrolls it
  // anywhere else: each notch adds to where it is heading, rather than
  // jumping, until the wheel rests.
  var heading = null, rest;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  page.addEventListener('wheel', function (e) {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    var atTop = page.scrollTop <= 0;
    var atEnd = page.scrollTop + page.clientHeight >= page.scrollHeight - 1;
    if (!(e.deltaY > 0 && atEnd) && !(e.deltaY < 0 && atTop)) return;
    e.preventDefault();
    var px = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    heading = Math.max(0, Math.min(max, (heading === null ? window.scrollY : heading) + e.deltaY * px));
    window.scrollTo({ top: heading, behavior: still.matches ? 'auto' : 'smooth' });
    clearTimeout(rest);
    rest = setTimeout(function () { heading = null; }, 400);
  }, { passive: false });
})();
