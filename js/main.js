/* CA Cesta dobrodruha, landing Maroko 2026 */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xpikyrtjmueeyqrpfoox.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_l9O6G5ldcwcYixVOn1Xq9w_kJjdgCsg';
  var VYPRAVA_SLUG = 'maroko-2026';
  var VYPRAVA_ID = '79cca540-5dd4-4096-ad5a-c1c5b2290e07';

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
    if (!bar) return;
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

  function showLeadSent(vs, zalohaKc) {
    if (!leadForm || !leadSent) return;
    var vsEl = document.getElementById('pay-vs');
    var amountEl = document.getElementById('pay-amount');
    if (vsEl) vsEl.textContent = vs || 'SDĚLÍME TELEFONICKY';
    if (amountEl && zalohaKc) amountEl.textContent = zalohaKc.toLocaleString('cs-CZ') + ' KČ';
    leadForm.hidden = true;
    leadSent.hidden = false;
  }

  function setErr(id, msg) {
    document.getElementById(id).textContent = msg || '';
  }

  if (leadForm) leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('lead-name').value;
    var phone = document.getElementById('lead-phone').value;
    var email = document.getElementById('lead-email').value;
    var note = document.getElementById('lead-note').value;
    var gdpr = document.getElementById('lead-gdpr').checked;
    var podminky = document.getElementById('lead-podminky').checked;
    var submitBtn = document.getElementById('lead-submit');

    var ok = true;
    if (!name.trim()) { setErr('err-name', 'Doplňte jméno.'); ok = false; } else setErr('err-name');
    if (!phone.trim()) { setErr('err-phone', 'Doplňte telefon, bez něj se vám nedovoláme.'); ok = false; } else setErr('err-phone');
    if (!EMAIL_RE.test(email)) { setErr('err-email', 'Doplňte e-mail, pošleme na něj smlouvu a podklady.'); ok = false; } else setErr('err-email');
    if (!gdpr) { setErr('err-gdpr', 'Potvrďte prosím souhlas se zpracováním údajů.'); ok = false; } else setErr('err-gdpr');
    if (!podminky) { setErr('err-podminky', 'Potvrďte prosím souhlas s obchodními podmínkami.'); ok = false; } else setErr('err-podminky');
    if (!ok) return;

    var parts = name.trim().split(/\s+/);
    var prijmeni = parts.length > 1 ? parts.pop() : null;
    var jmeno = parts.join(' ');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám…';
    setErr('err-submit');

    fetch(SUPABASE_URL + '/rest/v1/rpc/podat_prihlasku', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        p_slug: VYPRAVA_SLUG,
        p_jmeno: jmeno,
        p_prijmeni: prijmeni,
        p_email: email.trim(),
        p_telefon: phone.trim(),
        p_zprava: note.trim() || null,
        p_souhlas_gdpr: gdpr,
        p_souhlas_podminky: podminky
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      return res.json();
    }).then(function (data) {
      try {
        localStorage.setItem('cd-maroko-lead', JSON.stringify({
          ts: Date.now(), vs: data.vs, zaloha_kc: data.zaloha_kc
        }));
      } catch (err) {}
      showLeadSent(data.vs, data.zaloha_kc);
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Chci jet';
      setErr('err-submit', 'Odeslání se nepovedlo. Zkuste to prosím znovu, nebo volejte +420 702 967 187.');
    });
  });

  /* ---------- program v PDF ---------- */

  var pdfForm = document.getElementById('pdf-form');
  var pdfIdle = document.getElementById('pdf-idle');
  var pdfSentBox = document.getElementById('pdf-sent');
  var pdfErr = document.getElementById('pdf-err');

  function showPdfSent() {
    if (!pdfIdle || !pdfSentBox) return;
    pdfIdle.hidden = true;
    pdfSentBox.hidden = false;
  }

  if (pdfForm) pdfForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('pdf-email').value;
    if (!EMAIL_RE.test(email)) {
      pdfErr.textContent = 'Doplňte e-mail ve tvaru jmeno@domena.cz.';
      return;
    }
    pdfErr.textContent = '';

    fetch(SUPABASE_URL + '/rest/v1/zajemci_pdf', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email: email.trim().toLowerCase(), vyprava_id: VYPRAVA_ID })
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      try { localStorage.setItem('cd-maroko-pdf', email); } catch (err) {}
      showPdfSent();
    }).catch(function () {
      pdfErr.textContent = 'Odeslání se nepovedlo. Zkuste to prosím znovu.';
    });
  });

  /* ---------- obnovení stavu ---------- */

  try {
    var savedLead = localStorage.getItem('cd-maroko-lead');
    if (savedLead) {
      var lead = {};
      try { lead = JSON.parse(savedLead) || {}; } catch (err) {}
      showLeadSent(lead.vs, lead.zaloha_kc);
    }
    if (localStorage.getItem('cd-maroko-pdf')) showPdfSent();
  } catch (err) {}

  onScroll();
})();
