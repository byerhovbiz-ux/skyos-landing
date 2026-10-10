// The page's blocks rise into place: the hero on load, every section the
// first time it comes near the window. It starts a little before a block
// scrolls in, so the page never looks empty while it is being scrolled.
// index.html hides them before the first paint (the "motion" class) only
// where this can bring them back.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  window.skyosMotion = true;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px 15% 0px' });
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) { io.observe(el); });
})();
