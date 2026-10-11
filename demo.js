// The demo: the SkyOS app's Memory page, drawn in index.html at the app's own
// sizes. Its window shows the page from the top and fades out at the bottom;
// it never scrolls by itself, so the wheel always moves the landing page. The
// fade goes only when the whole page fits in the window. Nothing in it does
// anything else.
(function () {
  var page = document.querySelector('[data-demo] [data-screen]');
  if (!page) return;
  function edge() { page.classList.toggle('at-end', page.clientHeight >= page.scrollHeight - 2); }
  window.addEventListener('resize', edge);
  edge();
})();
