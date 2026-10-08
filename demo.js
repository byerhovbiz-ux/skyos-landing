// The demo: the SkyOS app's Memory page, drawn in index.html at the app's own
// sizes. It scrolls inside its window and fades out at the bottom until it is
// scrolled to its end. Nothing in it does anything else.
(function () {
  var page = document.querySelector('[data-demo] [data-screen]');
  if (!page) return;
  function edge() { page.classList.toggle('at-end', page.scrollTop + page.clientHeight >= page.scrollHeight - 2); }
  page.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge);
  edge();
})();
