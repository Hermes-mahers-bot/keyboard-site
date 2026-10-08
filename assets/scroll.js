/* Scroll-driven keycap: swaps a pre-rendered frame sequence as the band scrolls. */
(function () {
  var band = document.querySelector('[data-kband]');
  if (!band) return;

  var img = band.querySelector('[data-kframe]');
  var caps = Array.prototype.slice.call(band.querySelectorAll('[data-kcap]'));
  var hint = band.querySelector('[data-khint]');
  var TOTAL = parseInt(band.getAttribute('data-frames'), 10) || 40;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function url(i) {
    return 'assets/k/frames/f' + String(i).padStart(4, '0') + '.webp';
  }

  var frames = {};
  var ready = {};
  var current = 0;
  var target = 1;
  var shownCap = -1;

  function show(i) {
    if (i < 1) i = 1;
    if (i > TOTAL) i = TOTAL;
    if (i === current || !ready[i]) return;
    current = i;
    img.src = frames[i].src;
  }

  function update() {
    var travel = band.offsetHeight - window.innerHeight;
    var p = travel > 0 ? -band.getBoundingClientRect().top / travel : 1;
    p = p < 0 ? 0 : (p > 1 ? 1 : p);

    target = 1 + Math.round(p * (TOTAL - 1));
    show(target);

    var idx = Math.min(caps.length - 1, Math.floor(p * caps.length));
    if (idx !== shownCap) {
      for (var i = 0; i < caps.length; i++) caps[i].classList.toggle('on', i === idx);
      shownCap = idx;
    }
    if (hint) hint.classList.toggle('off', p > 0.02);
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }
  }

  if (reduce) {
    img.src = url(TOTAL);
    if (hint) hint.classList.remove('off');
    return;
  }

  function preload() {
    for (var i = 1; i <= TOTAL; i++) {
      (function (n) {
        var im = new Image();
        im.decoding = 'async';
        im.onload = function () {
          ready[n] = true;
          frames[n] = im;
          if (n === 1 || n === target) show(n);
        };
        im.src = url(n);
      })(i);
    }
  }

  preload();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
