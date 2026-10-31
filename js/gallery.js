/* Doctor Tintz — gallery: category tabs + lightbox (images and videos) */
(function () {
  'use strict';
  var items = window.GALLERY_ITEMS || [];
  var grid = document.getElementById('gallery-grid');
  var tabs = document.querySelectorAll('.gtabs__tab');
  var empty = document.getElementById('gallery-empty');
  if (!grid) return;

  var LABEL = { tint: 'Window Tint', wraps: 'Vinyl Wrap', ppf: 'Paint Protection Film', detailing: 'Detailing' };
  var CATS = ['all', 'tint', 'wraps', 'ppf', 'detailing'];

  /* Render cards ------------------------------------------------------- */
  items.forEach(function (it, i) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'gcard' + (it.type === 'video' ? ' gcard--video' : '');
    card.setAttribute('data-cat', it.cat);
    card.setAttribute('data-index', i);
    card.setAttribute('aria-label', (it.type === 'video' ? 'Play video: ' : 'Open photo: ') + LABEL[it.cat]);
    card.style.aspectRatio = it.w + ' / ' + it.h;
    card.innerHTML =
      '<img src="' + it.thumb + '" alt="' + LABEL[it.cat] + ' by Doctor Tintz" loading="lazy" decoding="async" width="' + it.w + '" height="' + it.h + '">' +
      '<span class="gcard__tag">' + LABEL[it.cat] + '</span>' +
      (it.type === 'video' ? '<span class="gcard__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>' : '');
    grid.appendChild(card);
  });
  var cards = Array.prototype.slice.call(grid.children);

  /* Tabs ----------------------------------------------------------------- */
  function setFilter(cat, pushHash) {
    if (CATS.indexOf(cat) < 0) cat = 'all';
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-filter') === cat;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    var shown = 0;
    cards.forEach(function (c) {
      var show = cat === 'all' || c.getAttribute('data-cat') === cat;
      c.hidden = !show;
      if (show) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (pushHash) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { setFilter(t.getAttribute('data-filter'), true); });
  });
  function fromHash() { setFilter((location.hash || '#all').slice(1), false); }
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* Lightbox ------------------------------------------------------------- */
  var box = document.getElementById('lightbox');
  if (!box) return;
  var stage = box.querySelector('.lightbox__stage');
  var caption = box.querySelector('.lightbox__caption');
  var counter = box.querySelector('.lightbox__count');
  var openIndex = -1, lastFocus = null;

  function visibleIndexes() {
    return cards.filter(function (c) { return !c.hidden; }).map(function (c) { return +c.getAttribute('data-index'); });
  }
  function render(i) {
    var it = items[i];
    openIndex = i;
    stage.innerHTML = '';
    if (it.type === 'video') {
      var v = document.createElement('video');
      v.src = it.src; v.poster = it.thumb; v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'metadata';
      stage.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = it.src; img.alt = LABEL[it.cat] + ' by Doctor Tintz';
      stage.appendChild(img);
    }
    caption.textContent = LABEL[it.cat];
    var list = visibleIndexes();
    counter.textContent = (list.indexOf(i) + 1) + ' / ' + list.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    box.hidden = false;
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    render(i);
    box.querySelector('.lightbox__close').focus();
  }
  function close() {
    if (box.hidden) return;
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { box.hidden = true; stage.innerHTML = ''; }, 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(dir) {
    var list = visibleIndexes();
    if (!list.length) return;
    var pos = list.indexOf(openIndex);
    render(list[(pos + dir + list.length) % list.length]);
  }
  cards.forEach(function (c) {
    c.addEventListener('click', function () { open(+c.getAttribute('data-index')); });
  });
  box.querySelectorAll('[data-lightbox-close]').forEach(function (el) { el.addEventListener('click', close); });
  box.querySelector('.lightbox__prev').addEventListener('click', function () { step(-1); });
  box.querySelector('.lightbox__next').addEventListener('click', function () { step(1); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  // Swipe on touch devices
  var x0 = null;
  stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
})();
