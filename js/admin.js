/* Administrace: přehled přihlášek, dotazů a zájemců o program.
   Přihlášení jde přes Supabase Auth, data se čtou pod přihlášeným
   uživatelem. Kdo není v tabulce admini, nevidí přes RLS ani řádek —
   ochrana je na straně databáze, ne tady v prohlížeči. */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xpikyrtjmueeyqrpfoox.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_l9O6G5ldcwcYixVOn1Xq9w_kJjdgCsg';
  var ULOZISTE = 'cd-admin-sezeni';

  var sezeni = null;      /* { access_token, refresh_token, expires_at, email } */
  var data = { prihlasky: [], dotazy: [], zajemci_pdf: [] };
  var zalozka = 'prihlasky';
  var hledani = '';

  var el = function (id) { return document.getElementById(id); };

  /* ---------- pomůcky ---------- */

  function text(tag, trida, obsah) {
    var n = document.createElement(tag);
    if (trida) n.className = trida;
    if (obsah !== undefined && obsah !== null && obsah !== '') n.textContent = String(obsah);
    return n;
  }

  function datum(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return String(iso);
    return d.toLocaleString('cs-CZ', {
      day: 'numeric', month: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function osob(n) {
    if (n === 1) return '1 osoba';
    if (n >= 2 && n <= 4) return n + ' osoby';
    return n + ' osob';
  }

  function anoNe(v) {
    if (v === true) return 'ano';
    if (v === false) return 'ne';
    return '';
  }

  /* ---------- sezení ---------- */

  function nactiSezeni() {
    try {
      var s = JSON.parse(localStorage.getItem(ULOZISTE) || 'null');
      if (s && s.access_token && s.refresh_token) return s;
    } catch (err) {}
    return null;
  }

  function ulozSezeni(s) {
    sezeni = s;
    try {
      if (s) localStorage.setItem(ULOZISTE, JSON.stringify(s));
      else localStorage.removeItem(ULOZISTE);
    } catch (err) {}
  }

  function prihlas(email, heslo) {
    return fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: heslo })
    }).then(function (res) {
      return res.json().then(function (telo) {
        if (!res.ok) throw new Error(telo.error_description || telo.msg || 'Přihlášení se nepovedlo.');
        return {
          access_token: telo.access_token,
          refresh_token: telo.refresh_token,
          expires_at: telo.expires_at,
          email: (telo.user && telo.user.email) || email
        };
      });
    });
  }

  function obnovSezeni() {
    if (!sezeni) return Promise.reject(new Error('bez sezení'));
    return fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: sezeni.refresh_token })
    }).then(function (res) {
      if (!res.ok) throw new Error('sezení vypršelo');
      return res.json();
    }).then(function (telo) {
      ulozSezeni({
        access_token: telo.access_token,
        refresh_token: telo.refresh_token,
        expires_at: telo.expires_at,
        email: (telo.user && telo.user.email) || sezeni.email
      });
      return sezeni;
    });
  }

  function odhlas() {
    var t = sezeni && sezeni.access_token;
    ulozSezeni(null);
    data = { prihlasky: [], dotazy: [], zajemci_pdf: [] };
    if (t) {
      fetch(SUPABASE_URL + '/auth/v1/logout', {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + t }
      }).catch(function () {});
    }
    ukazPrihlaseni();
  }

  /* ---------- volání databáze ---------- */

  /* Jedno opakování po obnovení tokenu: přístupový token platí hodinu,
     takže po delší pauze první dotaz spolehlivě spadne na 401. */
  function dotaz(cesta, volby, uzObnoveno) {
    volby = volby || {};
    var hlavicky = {
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + (sezeni ? sezeni.access_token : ''),
      'Content-Type': 'application/json'
    };
    if (volby.headers) {
      for (var k in volby.headers) {
        if (Object.prototype.hasOwnProperty.call(volby.headers, k)) hlavicky[k] = volby.headers[k];
      }
    }
    return fetch(SUPABASE_URL + '/rest/v1/' + cesta, {
      method: volby.method || 'GET',
      headers: hlavicky,
      body: volby.body
    }).then(function (res) {
      if (res.status === 401 && !uzObnoveno) {
        return obnovSezeni().then(function () { return dotaz(cesta, volby, true); });
      }
      if (!res.ok) {
        return res.text().then(function (t) { throw new Error('HTTP ' + res.status + ': ' + t); });
      }
      if (res.status === 204) return null;
      return res.json();
    });
  }

  function nactiVse() {
    stav('Načítám…');
    return Promise.all([
      dotaz('prihlasky?select=*&order=created_at.desc'),
      dotaz('dotazy?select=*&order=created_at.desc'),
      dotaz('zajemci_pdf?select=*&order=created_at.desc')
    ]).then(function (v) {
      data.prihlasky = v[0] || [];
      data.dotazy = v[1] || [];
      data.zajemci_pdf = v[2] || [];
      stav('');
      vykresli();
    }).catch(function (err) {
      if (/sezení vypršelo|bez sezení/.test(err.message)) {
        odhlas();
        chyba('Přihlášení vypršelo, přihlaste se prosím znovu.');
        return;
      }
      stav('');
      chyba('Data se nepovedlo načíst: ' + err.message);
    });
  }

  /* ---------- vykreslení ---------- */

  function stav(t) {
    var n = el('admin-stav');
    n.textContent = t || '';
    n.hidden = !t;
  }

  function chyba(t) {
    var n = el('admin-chyba');
    n.textContent = t || '';
    n.hidden = !t;
  }

  function polozky(zdroj) {
    if (!hledani) return zdroj;
    var h = hledani.toLowerCase();
    return zdroj.filter(function (r) {
      for (var k in r) {
        if (!Object.prototype.hasOwnProperty.call(r, k)) continue;
        var v = r[k];
        if (v === null || v === undefined) continue;
        if (String(v).toLowerCase().indexOf(h) !== -1) return true;
      }
      return false;
    });
  }

  function radek(popisek, hodnota, trida) {
    if (hodnota === null || hodnota === undefined || hodnota === '') return null;
    var d = text('div', 'zaznam__radek' + (trida ? ' ' + trida : ''));
    d.appendChild(text('span', 'zaznam__popisek', popisek));
    d.appendChild(text('span', 'zaznam__hodnota', hodnota));
    return d;
  }

  function odkaz(popisek, href, hodnota) {
    if (!hodnota) return null;
    var d = text('div', 'zaznam__radek');
    d.appendChild(text('span', 'zaznam__popisek', popisek));
    var a = text('a', 'zaznam__hodnota zaznam__odkaz', hodnota);
    a.href = href + hodnota;
    d.appendChild(a);
    return d;
  }

  function pridej(rodic, uzel) { if (uzel) rodic.appendChild(uzel); }

  function kartaPrihlasky(r) {
    var k = text('article', 'zaznam');

    var hlava = text('header', 'zaznam__hlava');
    hlava.appendChild(text('h3', 'zaznam__nazev',
      [r.jmeno, r.prijmeni].filter(Boolean).join(' ') || '(bez jména)'));
    var znacky = text('div', 'zaznam__znacky');
    if (r.vs) znacky.appendChild(text('span', 'znacka znacka--vs', 'VS ' + r.vs));
    if (r.pocet_osob) znacky.appendChild(text('span', 'znacka', osob(r.pocet_osob)));
    if (r.stav) znacky.appendChild(text('span', 'znacka', r.stav));
    hlava.appendChild(znacky);
    k.appendChild(hlava);

    k.appendChild(text('p', 'zaznam__cas', datum(r.created_at)));

    var telo = text('div', 'zaznam__telo');
    pridej(telo, odkaz('E-mail', 'mailto:', r.email));
    pridej(telo, odkaz('Telefon', 'tel:', r.telefon));
    pridej(telo, radek('Věk', r.vek));
    pridej(telo, radek('Rok narození', r.rok_narozeni));
    pridej(telo, radek('Pohlaví', r.pohlavi));
    pridej(telo, radek('Město', r.mesto));
    pridej(telo, radek('Jede sám', anoNe(r.jede_sam)));
    pridej(telo, radek('Surfování', anoNe(r.surfovani)));
    pridej(telo, radek('Poušť', r.poust_doprava));
    pridej(telo, radek('Jazyky', r.jazyky));
    pridej(telo, radek('Těší se na', r.tesim_se_na));
    pridej(telo, radek('Zdravotní omezení', r.zdravotni_omezeni, 'zaznam__radek--citlivy'));
    pridej(telo, radek('Potravinová omezení', r.potravinova_omezeni, 'zaznam__radek--citlivy'));
    pridej(telo, radek('Obavy', r.obavy));
    pridej(telo, radek('Zpráva', r.zprava));
    pridej(telo, radek('Jak se dozvěděl', r.jak_se_dozvedel));
    pridej(telo, radek('Zdroj', r.zdroj));
    pridej(telo, radek('Interní poznámka', r.interni_poznamka));
    k.appendChild(telo);

    return k;
  }

  function kartaDotazu(r) {
    var k = text('article', 'zaznam' + (r.vyrizeno ? ' zaznam--hotovo' : ''));

    var hlava = text('header', 'zaznam__hlava');
    hlava.appendChild(text('h3', 'zaznam__nazev', r.jmeno || '(bez jména)'));
    var znacky = text('div', 'zaznam__znacky');
    znacky.appendChild(text('span', 'znacka' + (r.vyrizeno ? '' : ' znacka--ceka'),
      r.vyrizeno ? 'vyřízeno' : 'čeká'));
    hlava.appendChild(znacky);
    k.appendChild(hlava);

    k.appendChild(text('p', 'zaznam__cas', datum(r.created_at)));

    var telo = text('div', 'zaznam__telo');
    pridej(telo, odkaz('Telefon', 'tel:', r.telefon));
    pridej(telo, odkaz('E-mail', 'mailto:', r.email));
    pridej(telo, radek('Dotaz', r.dotaz));
    k.appendChild(telo);

    var tl = text('button', 'admin-btn admin-btn--male',
      r.vyrizeno ? 'Označit jako nevyřízené' : 'Označit jako vyřízené');
    tl.type = 'button';
    tl.addEventListener('click', function () {
      tl.disabled = true;
      dotaz('dotazy?id=eq.' + encodeURIComponent(r.id), {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ vyrizeno: !r.vyrizeno })
      }).then(function () {
        r.vyrizeno = !r.vyrizeno;
        chyba('');
        vykresli();
      }).catch(function (err) {
        tl.disabled = false;
        chyba('Změnu se nepovedlo uložit: ' + err.message);
      });
    });
    k.appendChild(tl);

    return k;
  }

  function kartaPdf(r) {
    var k = text('article', 'zaznam');
    var hlava = text('header', 'zaznam__hlava');
    hlava.appendChild(text('h3', 'zaznam__nazev', r.email || '(bez e-mailu)'));
    k.appendChild(hlava);
    k.appendChild(text('p', 'zaznam__cas', datum(r.created_at)));
    var telo = text('div', 'zaznam__telo');
    pridej(telo, odkaz('E-mail', 'mailto:', r.email));
    pridej(telo, radek('Program odeslán', r.odeslano_at ? datum(r.odeslano_at) : 'zatím ne'));
    k.appendChild(telo);
    return k;
  }

  function vykresli() {
    /* počty na záložkách */
    el('pocet-prihlasky').textContent = data.prihlasky.length;
    el('pocet-dotazy').textContent = data.dotazy.length;
    el('pocet-pdf').textContent = data.zajemci_pdf.length;

    var tlacitka = document.querySelectorAll('[data-zalozka]');
    for (var i = 0; i < tlacitka.length; i++) {
      var aktivni = tlacitka[i].getAttribute('data-zalozka') === zalozka;
      tlacitka[i].classList.toggle('is-active', aktivni);
      tlacitka[i].setAttribute('aria-selected', aktivni ? 'true' : 'false');
    }

    var seznam = el('admin-seznam');
    seznam.textContent = '';

    var zdroj = polozky(data[zalozka]);
    if (!zdroj.length) {
      seznam.appendChild(text('p', 'admin-prazdno',
        hledani ? 'Hledání nic nenašlo.' : 'Zatím tu nic není.'));
      return;
    }

    var tvurce = zalozka === 'prihlasky' ? kartaPrihlasky
      : zalozka === 'dotazy' ? kartaDotazu : kartaPdf;
    for (var j = 0; j < zdroj.length; j++) seznam.appendChild(tvurce(zdroj[j]));
  }

  /* ---------- obrazovky ---------- */

  function ukazPrihlaseni() {
    el('admin-login').hidden = false;
    el('admin-obsah').hidden = true;
    el('admin-kdo').textContent = '';
  }

  function ukazObsah() {
    el('admin-login').hidden = true;
    el('admin-obsah').hidden = false;
    el('admin-kdo').textContent = sezeni ? sezeni.email : '';
    nactiVse();
  }

  /* ---------- start ---------- */

  el('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    chyba('');
    var tl = el('login-submit');
    var puvodni = tl.textContent;
    tl.disabled = true;
    tl.textContent = 'Přihlašuji…';
    prihlas(el('login-email').value.trim(), el('login-heslo').value)
      .then(function (s) {
        ulozSezeni(s);
        el('login-heslo').value = '';
        ukazObsah();
      })
      .catch(function (err) { chyba(err.message); })
      .then(function () { tl.disabled = false; tl.textContent = puvodni; });
  });

  el('admin-odhlasit').addEventListener('click', odhlas);
  el('admin-obnovit').addEventListener('click', function () { chyba(''); nactiVse(); });

  el('admin-hledani').addEventListener('input', function (e) {
    hledani = e.target.value.trim();
    vykresli();
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-zalozka]');
    if (!t) return;
    zalozka = t.getAttribute('data-zalozka');
    vykresli();
  });

  sezeni = nactiSezeni();
  if (sezeni) ukazObsah(); else ukazPrihlaseni();
})();
