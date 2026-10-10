// The page's motion, all of it: the hero rises into place on load, and each
// chat demo plays its messages one by one once it is well in view. Nothing
// else moves on scroll: a block that rises as it scrolls in either leaves the
// page looking empty below the fold or moves where nobody is looking.
// index.html hides them before the first paint (the "motion" class) only
// where this can bring them back.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  window.skyosMotion = true;
  var each = function (selector, fn) { Array.prototype.forEach.call(document.querySelectorAll(selector), fn); };
  // Two frames later, so the hidden state is painted first and the rise shows.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { each('[data-reveal]', function (el) { el.classList.add('is-in'); }); });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-playing');
      io.unobserve(e.target);
    });
  }, { threshold: 0.35 });
  each('[data-play]', function (el) { io.observe(el); });
})();
