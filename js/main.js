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
    if (!menu || !menuToggle) return;
    menuOpen = open;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    updateNav();
  }

  function updateNav() {
    if (!nav) return;
    var solid = window.scrollY > 50 || menuOpen;
    nav.classList.toggle('is-solid', solid);
  }

  if (menuToggle) menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });

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

  /* ---------- odhalování při scrollu ---------- */

  (function initReveals() {
    if (!('IntersectionObserver' in window)) return;

    var toReveal = [];

    function add(el, delay, variant) {
      el.classList.add('reveal');
      if (variant) el.classList.add(variant);
      if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
      toReveal.push(el);
    }

    // hero: výrazný postupný nástup textů po načtení
    ['.hero__brand', '.hero__badge', '.hero__title', '.hero__sub', '.hero__cta', '.hero__micro'].forEach(function (sel, i) {
      var el = document.querySelector(sel);
      if (el) add(el, 100 + i * 130, 'reveal--hero');
    });

    // samostatné bloky
    ['.eyebrow', '.h2', '.contrast__intro', '.program__intro', '.program__outro', '.program__cta',
     '.stay__text', '.guides__story', '.price__principle', '.price__cta',
     '.deposit__intro', '.deposit__note', '.fit__outro', '.final__badge', '.final__text'
    ].forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        if (!el.classList.contains('reveal')) add(el, 0);
      });
    });

    // bloky s jemným zoomem
    ['.program__map', '.pdf__card', '.final__card', '.apply__card'].forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        if (!el.classList.contains('reveal')) add(el, 0, 'reveal--zoom');
      });
    });

    // cena: přeškrtnutá stará, nová naskočí
    var priceOld = document.querySelector('.price__old');
    var priceNew = document.querySelector('.price__new');
    var priceTerms = document.querySelector('.price__terms');
    if (priceOld) add(priceOld, 0);
    if (priceNew) add(priceNew, 140, 'reveal--pop');
    if (priceTerms) add(priceTerms, 280);

    // tabulka turista vs. dobrodruzi: zleva, šipka, zprava
    Array.prototype.forEach.call(document.querySelectorAll('.contrast__row'), function (row) {
      var tourist = row.querySelector('.contrast__cell--tourist');
      var arrow = row.querySelector('.contrast__arrow');
      var us = row.querySelector('.contrast__cell--us');
      if (tourist) add(tourist, 0, 'reveal--left');
      if (arrow) add(arrow, 140, 'reveal--zoom');
      if (us) add(us, 240, 'reveal--right');
    });

    // zastávky programu: text a fotka se sjíždějí z obou stran k lince
    Array.prototype.forEach.call(document.querySelectorAll('.stop'), function (stop) {
      var body = stop.querySelector('.stop__body');
      var img = stop.querySelector('.stop__img');
      var fromLeft = stop.classList.contains('stop--left');
      if (body) add(body, 0, fromLeft ? 'reveal--left' : 'reveal--right');
      if (img) add(img, 120, fromLeft ? 'reveal--right' : 'reveal--left');
    });

    // skupiny s odstupňovaným nástupem
    [['.trust__item', null], ['.stay__photos figure', 'reveal--zoom'], ['.guide', null],
     ['.deposit__step', null], ['.fit__card', null], ['.price__cols > div', null], ['.faq__item', null]
    ].forEach(function (pair) {
      Array.prototype.forEach.call(document.querySelectorAll(pair[0]), function (el, i) {
        add(el, (i % 5) * 100, pair[1]);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle('is-visible', en.isIntersecting);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    toReveal.forEach(function (el) { io.observe(el); });
  })();

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

  /* ---------- dotaz (zavolejte mi) ---------- */

  var dotazForm = document.getElementById('dotaz-form');
  var dotazSent = document.getElementById('dotaz-sent');

  function showDotazSent() {
    if (!dotazForm || !dotazSent) return;
    dotazForm.hidden = true;
    dotazSent.hidden = false;
  }

  if (dotazForm) dotazForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var dotaz = document.getElementById('dotaz-text').value;
    var name = document.getElementById('dotaz-name').value;
    var phone = document.getElementById('dotaz-phone').value;
    var email = document.getElementById('dotaz-email').value;
    var gdpr = document.getElementById('dotaz-gdpr').checked;
    var submitBtn = document.getElementById('dotaz-submit');

    var ok = true;
    if (!dotaz.trim()) { setErr('err-d-text', 'Napište nám dotaz, ať se na telefonát připravíme.'); ok = false; } else setErr('err-d-text');
    if (!name.trim()) { setErr('err-d-name', 'Doplňte jméno.'); ok = false; } else setErr('err-d-name');
    if (!phone.trim()) { setErr('err-d-phone', 'Doplňte telefon, bez něj se vám nedovoláme.'); ok = false; } else setErr('err-d-phone');
    if (email.trim() && !EMAIL_RE.test(email)) { setErr('err-d-email', 'Zkontrolujte e-mail, má být ve tvaru jmeno@domena.cz.'); ok = false; } else setErr('err-d-email');
    if (!gdpr) { setErr('err-d-gdpr', 'Potvrďte prosím souhlas se zpracováním údajů.'); ok = false; } else setErr('err-d-gdpr');
    if (!ok) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám…';
    setErr('err-d-submit');

    fetch(SUPABASE_URL + '/rest/v1/dotazy', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        vyprava_id: VYPRAVA_ID,
        jmeno: name.trim(),
        telefon: phone.trim(),
        email: email.trim() ? email.trim().toLowerCase() : null,
        dotaz: dotaz.trim(),
        souhlas_gdpr: gdpr
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      try { localStorage.setItem('cd-maroko-dotaz', String(Date.now())); } catch (err) {}
      showDotazSent();
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Zavolejte mi';
      setErr('err-d-submit', 'Odeslání se nepovedlo. Zkuste to prosím znovu, nebo volejte +420 702 967 187.');
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
    if (localStorage.getItem('cd-maroko-dotaz')) showDotazSent();
    if (localStorage.getItem('cd-maroko-pdf')) showPdfSent();
  } catch (err) {}

  onScroll();
})();
