/* CK Cesta dobrodruha, landing Maroko 2026 */
(function () {
  'use strict';

  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isMobile() { return window.innerWidth < 768; }

  /* ---------- navigace ---------- */

  var nav = document.getElementById('cd-nav');
  var menu = document.getElementById('mobile-menu');
  var menuToggle = document.getElementById('menu-toggle');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    updateNav();
  }

  function updateNav() {
    var solid = window.scrollY > 50 || menuOpen;
    nav.classList.toggle('is-solid', solid);
  }

  menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });

  Array.prototype.forEach.call(document.querySelectorAll('[data-menu-close], #mobile-menu a'), function (el) {
    el.addEventListener('click', function () { if (menuOpen) setMenu(false); });
  });

  /* ---------- trasa v programu ---------- */

  var trasaWrap = document.getElementById('trasa-wrap');
  var trasaLine = document.getElementById('trasa-line');

  function updateTrasa() {
    if (!trasaWrap || !trasaLine) return;
    var r = trasaWrap.getBoundingClientRect();
    var p = reduced ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / r.height));
    trasaLine.style.height = (p * 100).toFixed(1) + '%';
  }

  /* ---------- sticky lišta (mobil) ---------- */

  var bar = document.getElementById('sticky-bar');
  var formSection = document.getElementById('formular');

  function updateBar() {
    var show = false;
    if (isMobile() && formSection) {
      var y = window.scrollY;
      show = y > window.innerHeight * 0.7 && formSection.getBoundingClientRect().top > window.innerHeight * 0.9;
    }
    bar.hidden = !show;
  }

  function onScroll() {
    updateNav();
    updateTrasa();
    updateBar();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (menuOpen && !isMobile()) setMenu(false);
    onScroll();
  });

  /* ---------- otázky a odpovědi ---------- */

  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq__q');
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      faqItems.forEach(function (other) {
        var b = other.querySelector('.faq__q');
        b.setAttribute('aria-expanded', 'false');
        b.querySelector('.faq__ind').textContent = '+';
        other.querySelector('.faq__a').hidden = true;
      });
      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.faq__ind').textContent = '−';
        item.querySelector('.faq__a').hidden = false;
      }
    });
  });

  /* ---------- hlavní formulář ---------- */

  var leadForm = document.getElementById('lead-form');
  var leadSent = document.getElementById('lead-sent');

  function showLeadSent() {
    leadForm.hidden = true;
    leadSent.hidden = false;
  }

  function setErr(id, msg) {
    document.getElementById(id).textContent = msg || '';
  }

  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('lead-name').value;
    var phone = document.getElementById('lead-phone').value;
    var email = document.getElementById('lead-email').value;
    var note = document.getElementById('lead-note').value;
    var gdpr = document.getElementById('lead-gdpr').checked;

    var ok = true;
    if (!name.trim()) { setErr('err-name', 'Doplňte jméno.'); ok = false; } else setErr('err-name');
    if (!phone.trim()) { setErr('err-phone', 'Doplňte telefon, bez něj se vám nedovoláme.'); ok = false; } else setErr('err-phone');
    if (!EMAIL_RE.test(email)) { setErr('err-email', 'Zkontrolujte e-mail, má být ve tvaru jmeno@domena.cz.'); ok = false; } else setErr('err-email');
    if (!gdpr) { setErr('err-gdpr', 'Potvrďte prosím souhlas se zpracováním údajů.'); ok = false; } else setErr('err-gdpr');
    if (!ok) return;

    try {
      localStorage.setItem('cd-maroko-lead', JSON.stringify({
        ts: Date.now(), name: name, phone: phone, email: email, note: note, gdpr: gdpr
      }));
    } catch (err) {}
    showLeadSent();
  });

  /* ---------- program v PDF ---------- */

  var pdfForm = document.getElementById('pdf-form');
  var pdfIdle = document.getElementById('pdf-idle');
  var pdfSentBox = document.getElementById('pdf-sent');
  var pdfErr = document.getElementById('pdf-err');

  function showPdfSent() {
    pdfIdle.hidden = true;
    pdfSentBox.hidden = false;
  }

  pdfForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('pdf-email').value;
    if (!EMAIL_RE.test(email)) {
      pdfErr.textContent = 'Doplňte e-mail ve tvaru jmeno@domena.cz.';
      return;
    }
    pdfErr.textContent = '';
    try { localStorage.setItem('cd-maroko-pdf', email); } catch (err) {}
    showPdfSent();
  });

  /* ---------- obnovení stavu ---------- */

  try {
    if (localStorage.getItem('cd-maroko-lead')) showLeadSent();
    if (localStorage.getItem('cd-maroko-pdf')) showPdfSent();
  } catch (err) {}

  onScroll();
})();
