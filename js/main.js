/* Doctor Tintz — site interactions (no dependencies) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky header shadow ------------------------------------------------ */
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav ----------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  function closeMobileNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeMobileNav();
    });
  }

  /* Nav dropdowns (Locations, Contact) ----------------------------------- */
  var items = document.querySelectorAll('.nav__item');
  function closeDropdowns(except) {
    items.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var b = item.querySelector('.nav__toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  items.forEach(function (item) {
    var btn = item.querySelector('.nav__toggle');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      closeDropdowns(item);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item')) closeDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdowns();
  });

  /* Inquire modal -------------------------------------------------------- */
  var modal = document.getElementById('inquire-modal');
  var lastFocus = null;
  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    closeDropdowns();
    closeMobileNav();
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input, select, textarea');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-open-inquire]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
  document.querySelectorAll('[data-close-inquire]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  if (location.hash === '#inquire') openModal();

  /* Hero headline: per-character reveal --------------------------------- */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    var accentWords = (el.getAttribute('data-accent') || '').toLowerCase().split(',').map(function (w) { return w.trim(); });
    el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = '';
    var index = 0;
    words.forEach(function (word, wi) {
      var w = document.createElement('span');
      w.className = 'word' + (accentWords.indexOf(word.toLowerCase()) > -1 ? ' accent' : '');
      w.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (ch) {
        var c = document.createElement('span');
        c.className = 'char';
        c.textContent = ch;
        c.style.animationDelay = (0.15 + index * 0.035) + 's';
        w.appendChild(c);
        index++;
      });
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* Reveal on scroll ----------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Animated counters ---------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var duration = 1600;
    var start = null;
    function format(n) { return Math.round(n).toLocaleString('en-US'); }
    if (reduceMotion) { el.textContent = format(target); return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* FAQ: only one open at a time ---------------------------------------- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* Inquiry forms: send to the inbox via FormSubmit without leaving the page */
  document.querySelectorAll('form.js-inquiry').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : '';
    var to = form.getAttribute('data-to') || 'doctortintz@gmail.com';

    function show(msg, isError) {
      if (!status) return;
      status.textContent = msg;
      status.classList.add('is-visible');
      status.classList.toggle('is-error', !!isError);
    }

    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action');
      if (!action) return; // nothing configured; let the browser handle it
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (form.querySelector('[name="_honey"]') && form.querySelector('[name="_honey"]').value) return; // bot

      var data = new FormData(form);
      data.set('_subject', 'New inquiry: ' + (data.get('service') || 'General') + ' — ' + (data.get('name') || ''));
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }

      // Same endpoint, AJAX flavour: returns JSON instead of redirecting.
      var ajaxUrl = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      fetch(ajaxUrl, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (r) {
          var success = r.ok && (r.json.success === 'true' || r.json.success === true);
          if (!success) throw new Error(r.json.message || 'Send failed');
          form.reset();
          show('Thanks! Your inquiry was sent. We’ll get back to you within one business day.');
        })
        .catch(function () {
          // Network or endpoint problem: fall back to a normal form post, then to email.
          try { form.submit(); }
          catch (err) { show('We couldn’t send that automatically. Please email us at ' + to + '.', true); }
        })
        .finally(function () {
          if (button) { button.disabled = false; button.textContent = buttonText; }
        });
    });
  });

  /* Footer year ---------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
