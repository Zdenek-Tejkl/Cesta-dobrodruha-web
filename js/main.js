/* CA Cesta dobrodruha, landing Maroko 2026 */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xpikyrtjmueeyqrpfoox.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_l9O6G5ldcwcYixVOn1Xq9w_kJjdgCsg';
  /* slug výpravy si nese samo radio s termínem v přihlášce; tenhle je výchozí,
     když v URL ani ve formuláři termín není */
  var VYPRAVA_SLUG = 'maroko-2026';
  var VYPRAVA_ID = '79cca540-5dd4-4096-ad5a-c1c5b2290e07';
  /* platební údaje: po doplnění IBAN se u přihlášky zobrazí i QR platba */
  var PAY_IBAN = 'CZ2030300000003704398014';
  var PAY_ACCOUNT_TEXT = '3704398014/3030';

  /* texty závislé na jazyku stránky (podle atributu lang na <html>) */
  var LANG = (document.documentElement.lang || 'cs').slice(0, 2);
  var STR = {
    cs: {
      locale: 'cs-CZ', cur: ' KČ',
      vsFallback: 'SDĚLÍME TELEFONICKY',
      totalFor: function (n, castka) { return 'CELKEM ZA ' + n + ' ' + (n < 5 ? 'OSOBY' : 'OSOB') + ': ' + castka; },
      sending: 'Odesílám…',
      errTermin: 'Vyberte termín, na který se hlásíte.',
      errName: 'Doplňte jméno.',
      errVek: 'Doplňte věk.',
      errPocet: 'Doplňte počet osob, 1 až 10.',
      errPohlavi: 'Vyberte jednu z možností.',
      errPhone: 'Doplňte telefon, bez něj se vám nedovoláme.',
      errEmail: 'Doplňte e-mail, pošleme na něj smlouvu a podklady.',
      errSurf: 'Vyberte ano, nebo ne.',
      errPoust: 'Vyberte velblouda, nebo čtyřkolku.',
      errGdpr: 'Potvrďte prosím souhlas se zpracováním údajů.',
      errPodminky: 'Potvrďte prosím souhlas s obchodními podmínkami.',
      errSubmit: 'Odeslání se nepovedlo. Zkuste to prosím znovu, nebo volejte +420 702 967 187.',
      errDText: 'Napište nám dotaz, ať se na telefonát připravíme.',
      errDEmail: 'Zkontrolujte e-mail, má být ve tvaru jmeno@domena.cz.',
      errPdfEmail: 'Doplňte e-mail ve tvaru jmeno@domena.cz.',
      errPdfSubmit: 'Odeslání se nepovedlo. Zkuste to prosím znovu.'
    },
    en: {
      locale: 'en-GB', cur: ' CZK',
      vsFallback: 'WE WILL CONFIRM IT BY PHONE',
      totalFor: function (n, castka) { return 'TOTAL FOR ' + n + ' PEOPLE: ' + castka; },
      sending: 'Sending…',
      errTermin: 'Please choose the departure you are booking.',
      errName: 'Please fill in your name.',
      errVek: 'Please fill in your age.',
      errPocet: 'Please enter the number of people, 1 to 10.',
      errPohlavi: 'Please choose one of the options.',
      errPhone: 'Please fill in your phone number so we can reach you.',
      errEmail: 'Please fill in your e-mail; we will send the contract and documents there.',
      errSurf: 'Please choose yes or no.',
      errPoust: 'Please choose the camel or the quad bike.',
      errGdpr: 'Please confirm your consent to the processing of personal data.',
      errPodminky: 'Please confirm your agreement with the terms and conditions.',
      errSubmit: 'Sending failed. Please try again or call +420 702 967 187.',
      errDText: 'Please write your question so we can prepare for the call.',
      errDEmail: 'Please check the e-mail address; it should look like name@domain.com.',
      errPdfEmail: 'Please enter an e-mail address like name@domain.com.',
      errPdfSubmit: 'Sending failed. Please try again.'
    },
    uk: {
      locale: 'uk-UA', cur: ' CZK',
      vsFallback: 'ПОВІДОМИМО ТЕЛЕФОНОМ',
      totalFor: function (n, castka) { return 'РАЗОМ ЗА ' + n + ' ' + (n < 5 ? 'ОСОБИ' : 'ОСІБ') + ': ' + castka; },
      sending: 'Надсилаємо…',
      errTermin: 'Оберіть термін, на який ви записуєтесь.',
      errName: 'Вкажіть, будь ласка, імʼя та прізвище.',
      errVek: 'Вкажіть, будь ласка, вік.',
      errPocet: 'Вкажіть кількість осіб, від 1 до 10.',
      errPohlavi: 'Оберіть один із варіантів.',
      errPhone: 'Вкажіть телефон, інакше ми не зможемо вам зателефонувати.',
      errEmail: 'Вкажіть e-mail; на нього надішлемо договір і документи.',
      errSurf: 'Оберіть так або ні.',
      errPoust: 'Оберіть верблюда або квадроцикл.',
      errGdpr: 'Підтвердьте, будь ласка, згоду на обробку персональних даних.',
      errPodminky: 'Підтвердьте, будь ласка, згоду з умовами.',
      errSubmit: 'Не вдалося надіслати. Спробуйте ще раз або зателефонуйте +420 702 967 187.',
      errDText: 'Напишіть ваше запитання, щоб ми підготувалися до розмови.',
      errDEmail: 'Перевірте e-mail, він має виглядати як name@domain.com.',
      errPdfEmail: 'Вкажіть e-mail у форматі name@domain.com.',
      errPdfSubmit: 'Не вдалося надіслати. Спробуйте ще раз.'
    },
    sk: {
      locale: 'sk-SK', cur: ' KČ',
      vsFallback: 'OZNÁMIME TELEFONICKY',
      totalFor: function (n, castka) { return 'SPOLU ZA ' + n + ' ' + (n < 5 ? 'OSOBY' : 'OSÔB') + ': ' + castka; },
      sending: 'Odosielam…',
      errTermin: 'Vyberte termín, na ktorý sa hlásite.',
      errName: 'Doplňte meno.',
      errVek: 'Doplňte vek.',
      errPocet: 'Doplňte počet osôb, 1 až 10.',
      errPohlavi: 'Vyberte jednu z možností.',
      errPhone: 'Doplňte telefón, bez neho sa vám nedovoláme.',
      errEmail: 'Doplňte e-mail, pošleme naň zmluvu a podklady.',
      errSurf: 'Vyberte áno, alebo nie.',
      errPoust: 'Vyberte ťavu, alebo štvorkolku.',
      errGdpr: 'Potvrďte, prosím, súhlas so spracovaním údajov.',
      errPodminky: 'Potvrďte, prosím, súhlas s obchodnými podmienkami.',
      errSubmit: 'Odoslanie sa nepodarilo. Skúste to, prosím, znova, alebo volajte +420 702 967 187.',
      errDText: 'Napíšte nám otázku, nech sa na telefonát pripravíme.',
      errDEmail: 'Skontrolujte e-mail, má byť v tvare meno@domena.sk.',
      errPdfEmail: 'Doplňte e-mail v tvare meno@domena.sk.',
      errPdfSubmit: 'Odoslanie sa nepodarilo. Skúste to, prosím, znova.'
    }
  };
  var T = STR[LANG] || STR.cs;

  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isMobile() { return window.innerWidth < 768; }
  /* musí odpovídat breakpointu burger navigace v CSS */
  function isBurgerNav() { return window.innerWidth < 1024; }

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

  var toTop = document.getElementById('to-top');

  function updateToTop() {
    if (!toTop) return;
    toTop.hidden = window.scrollY < 600;
  }

  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  function onScroll() {
    updateNav();
    updateTrasa();
    updateBar();
    updateToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (menuOpen && !isBurgerNav()) setMenu(false);
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

  function showLeadSent(vs, zalohaKc, pocet, terminText) {
    if (!leadForm || !leadSent) return;
    pocet = pocet || 1;
    var terminEl = document.getElementById('pay-termin');
    if (terminEl) {
      terminEl.textContent = terminText || '';
      if (terminEl.parentNode) terminEl.parentNode.hidden = !terminText;
    }
    var vsEl = document.getElementById('pay-vs');
    var amountEl = document.getElementById('pay-amount');
    var totalEl = document.getElementById('pay-total');
    var accEl = document.getElementById('pay-acc');
    if (vsEl) vsEl.textContent = vs || T.vsFallback;
    if (amountEl && zalohaKc) amountEl.textContent = zalohaKc.toLocaleString(T.locale) + T.cur;
    if (accEl) accEl.textContent = PAY_ACCOUNT_TEXT;
    var total = (zalohaKc || 25000) * pocet;
    if (totalEl) {
      if (pocet > 1) {
        totalEl.textContent = T.totalFor(pocet, total.toLocaleString(T.locale) + T.cur);
        totalEl.hidden = false;
      } else {
        totalEl.hidden = true;
      }
    }
    var qrBox = document.getElementById('pay-qr');
    var qrImg = document.getElementById('pay-qr-img');
    if (qrBox && qrImg && vs && PAY_IBAN && typeof qrcode !== 'undefined') {
      try {
        var spd = 'SPD*1.0*ACC:' + PAY_IBAN + '*RN:ZDENEK TEJKL*AM:' + total + '.00*CC:CZK*X-VS:' + vs + '*MSG:REZERVACE ZAJEZDU DOBRODRUHA MAROKO';
        var qr = qrcode(0, 'M');
        qr.addData(spd);
        qr.make();
        qrImg.src = qr.createDataURL(4, 0);
        qrBox.hidden = false;
      } catch (err) {}
    }
    leadForm.hidden = true;
    leadSent.hidden = false;
  }

  function radioVal(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  function checkedVals(name, jineId) {
    var vals = Array.prototype.map.call(document.querySelectorAll('input[name="' + name + '"]:checked'), function (c) { return c.value; });
    var jine = jineId ? document.getElementById(jineId) : null;
    if (jine && jine.value.trim()) vals.push(jine.value.trim());
    return vals.join(', ');
  }

  function setErr(id, msg) {
    document.getElementById(id).textContent = msg || '';
  }

  /* popisek vybraného termínu, ať ho vidí i na potvrzovací obrazovce */
  function terminLabel() {
    var el = document.querySelector('input[name="termin"]:checked');
    var lbl = el && (el.closest ? el.closest('label') : el.parentNode);
    return lbl ? lbl.textContent.trim() : '';
  }

  /* odkazy z karet termínů na hlavní stránce nesou ?termin=slug */
  if (leadForm) {
    var terminParam = /[?&]termin=([^&#]+)/.exec(window.location.search);
    if (terminParam) {
      var terminSlug = decodeURIComponent(terminParam[1]).replace(/[^a-z0-9-]/gi, '');
      var terminRadio = terminSlug && document.querySelector('input[name="termin"][value="' + terminSlug + '"]');
      if (terminRadio) terminRadio.checked = true;
    }
  }

  if (leadForm) leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('lead-name').value;
    var phone = document.getElementById('lead-phone').value;
    var email = document.getElementById('lead-email').value;
    var note = document.getElementById('lead-note').value;
    var vek = parseInt(document.getElementById('lead-vek').value, 10);
    var pocet = parseInt(document.getElementById('lead-pocet').value, 10);
    var termin = radioVal('termin');
    var pohlavi = radioVal('pohlavi');
    var surf = radioVal('surf');
    var poust = radioVal('poust');
    var tesim = checkedVals('tesim', 'lead-tesim-jine');
    var jazyky = checkedVals('jazyk', 'lead-jazyky-jine');
    var zdravi = document.getElementById('lead-zdravi').value;
    var jidlo = document.getElementById('lead-jidlo').value;
    var obavy = document.getElementById('lead-obavy').value;
    var gdpr = document.getElementById('lead-gdpr').checked;
    var podminky = document.getElementById('lead-podminky').checked;
    var submitBtn = document.getElementById('lead-submit');

    var ok = true;
    if (!termin) { setErr('err-termin', T.errTermin); ok = false; } else setErr('err-termin');
    if (!name.trim()) { setErr('err-name', T.errName); ok = false; } else setErr('err-name');
    if (!vek || vek < 1 || vek > 120) { setErr('err-vek', T.errVek); ok = false; } else setErr('err-vek');
    if (!pocet || pocet < 1 || pocet > 10) { setErr('err-pocet', T.errPocet); ok = false; } else setErr('err-pocet');
    if (!pohlavi) { setErr('err-pohlavi', T.errPohlavi); ok = false; } else setErr('err-pohlavi');
    if (!phone.trim()) { setErr('err-phone', T.errPhone); ok = false; } else setErr('err-phone');
    if (!EMAIL_RE.test(email)) { setErr('err-email', T.errEmail); ok = false; } else setErr('err-email');
    if (!surf) { setErr('err-surf', T.errSurf); ok = false; } else setErr('err-surf');
    if (!poust) { setErr('err-poust', T.errPoust); ok = false; } else setErr('err-poust');
    if (!gdpr) { setErr('err-gdpr', T.errGdpr); ok = false; } else setErr('err-gdpr');
    if (!podminky) { setErr('err-podminky', T.errPodminky); ok = false; } else setErr('err-podminky');
    if (!ok) return;

    var parts = name.trim().split(/\s+/);
    var prijmeni = parts.length > 1 ? parts.pop() : null;
    var jmeno = parts.join(' ');

    var leadBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = T.sending;
    setErr('err-submit');

    fetch(SUPABASE_URL + '/rest/v1/rpc/podat_prihlasku', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        p_slug: termin || VYPRAVA_SLUG,
        p_jmeno: jmeno,
        p_prijmeni: prijmeni,
        p_email: email.trim(),
        p_telefon: phone.trim(),
        p_zprava: note.trim() || null,
        p_souhlas_gdpr: gdpr,
        p_souhlas_podminky: podminky,
        p_vek: vek,
        p_pohlavi: pohlavi,
        p_zdravotni: zdravi.trim() || null,
        p_potraviny: jidlo.trim() || null,
        p_surf: surf === 'ano',
        p_poust: poust,
        p_obavy: obavy.trim() || null,
        p_tesim: tesim || null,
        p_jazyky: jazyky || null,
        p_pocet_osob: pocet
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      return res.json();
    }).then(function (data) {
      var terminText = terminLabel();
      try {
        localStorage.setItem('cd-maroko-lead', JSON.stringify({
          ts: Date.now(), vs: data.vs, zaloha_kc: data.zaloha_kc, pocet: pocet, termin: terminText
        }));
      } catch (err) {}
      showLeadSent(data.vs, data.zaloha_kc, pocet, terminText);
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = leadBtnText;
      setErr('err-submit', T.errSubmit);
    });
  });

  /* dotazník pro dalšího cestujícího: vrátí prázdný formulář, platební údaje se zobrazí znovu po odeslání */
  var leadAnother = document.getElementById('lead-another');
  if (leadAnother) leadAnother.addEventListener('click', function () {
    if (!leadForm || !leadSent) return;
    leadForm.reset();
    var submitBtn = document.getElementById('lead-submit');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Chci jet'; }
    setErr('err-submit');
    leadSent.hidden = true;
    leadForm.hidden = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
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
    if (!dotaz.trim()) { setErr('err-d-text', T.errDText); ok = false; } else setErr('err-d-text');
    if (!name.trim()) { setErr('err-d-name', T.errName); ok = false; } else setErr('err-d-name');
    if (!phone.trim()) { setErr('err-d-phone', T.errPhone); ok = false; } else setErr('err-d-phone');
    if (email.trim() && !EMAIL_RE.test(email)) { setErr('err-d-email', T.errDEmail); ok = false; } else setErr('err-d-email');
    if (!gdpr) { setErr('err-d-gdpr', T.errGdpr); ok = false; } else setErr('err-d-gdpr');
    if (!ok) return;

    var dotazBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = T.sending;
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
      submitBtn.textContent = dotazBtnText;
      setErr('err-d-submit', T.errSubmit);
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
      pdfErr.textContent = T.errPdfEmail;
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
      pdfErr.textContent = T.errPdfSubmit;
    });
  });

  /* ---------- obnovení stavu ---------- */

  try {
    var savedLead = localStorage.getItem('cd-maroko-lead');
    if (savedLead) {
      var lead = {};
      try { lead = JSON.parse(savedLead) || {}; } catch (err) {}
      showLeadSent(lead.vs, lead.zaloha_kc, lead.pocet, lead.termin);
    }
    if (localStorage.getItem('cd-maroko-dotaz')) showDotazSent();
    if (localStorage.getItem('cd-maroko-pdf')) showPdfSent();
  } catch (err) {}

  onScroll();
})();
