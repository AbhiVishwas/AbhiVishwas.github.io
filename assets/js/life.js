(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var zone = document.querySelector('.pack-zone');
  var pack = document.getElementById('pack');
  var controls = document.getElementById('packcontrols');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.tcg'));
  if (!zone || !pack) return;

  function setFace(card, up) {
    var back = card.querySelector('.tcg-back');
    var front = card.querySelector('.tcg-front');
    card.classList.toggle('flipped', up);
    back.inert = up;
    back.setAttribute('aria-hidden', up ? 'true' : 'false');
    front.inert = !up;
    front.setAttribute('aria-hidden', up ? 'false' : 'true');
  }

  // Start face down
  cards.forEach(function (c) {
    setFace(c, false);
    c.querySelector('.tcg-front').setAttribute('tabindex', '-1');
  });

  function openPack() {
    if (zone.classList.contains('opened') || pack.classList.contains('ripping')) return;
    pack.classList.add('ripping');
    setTimeout(function () {
      zone.classList.add('opened');
      controls.removeAttribute('hidden');
      var first = cards[0] && cards[0].querySelector('.tcg-back');
      if (first) first.focus({ preventScroll: true });
    }, reduce ? 0 : 750);
  }

  function flip(card) {
    setFace(card, true);
    card.querySelector('.tcg-front').focus({ preventScroll: true });
  }

  pack.addEventListener('click', openPack);

  cards.forEach(function (c) {
    c.querySelector('.tcg-back').addEventListener('click', function () { flip(c); });
  });

  document.getElementById('flipall').addEventListener('click', function () {
    cards.forEach(function (c, i) {
      if (c.classList.contains('flipped')) return;
      setTimeout(function () { setFace(c, true); }, reduce ? 0 : i * 120);
    });
  });

  document.getElementById('reseal').addEventListener('click', function () {
    cards.forEach(function (c) { setFace(c, false); });
    zone.classList.remove('opened');
    pack.classList.remove('ripping');
    controls.setAttribute('hidden', '');
    pack.focus();
  });

  // Holo shimmer and tilt that follow the pointer
  cards.forEach(function (c) {
    var inner = c.querySelector('.tcg-inner');
    c.addEventListener('pointermove', function (e) {
      if (!c.classList.contains('flipped') || e.pointerType === 'touch') return;
      var r = c.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (!reduce) {
        inner.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(2) + 'deg');
        inner.style.setProperty('--rx', ((0.5 - y) * 16).toFixed(2) + 'deg');
      }
      c.classList.add('shine');
    });
    c.addEventListener('pointerleave', function () {
      inner.style.setProperty('--ry', '0deg');
      inner.style.setProperty('--rx', '0deg');
      c.classList.remove('shine');
    });
  });
})();
