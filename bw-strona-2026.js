/* Black Week 2026 na stronach noclegowych In The Sky i Boulevard Drobnera.
   Decyzja Piotra 19.11.2026: promocja Black Week do -30% przy rezerwacji bezpośredniej na obu obiektach,
   odliczanie do końca listopada. Rabat jest w cenach Previo; ten plik tylko zmienia komunikaty i dodaje panel.
   Wersja 4 (19.11.2026, polecenie Piotra): rabat obejmuje pobyty do końca 2027 r. (Previo: rabat do 30.12.2027; wykluczeń
   typu sylwester celowo nie pokazujemy). Na stronach voucherów: etykiety Black Week zamiast „-25%” i pop-upy voucherowe.
   Działa do 30.11.2026 23:59:59 (czas polski). Potem nic nie robi i strona wraca do zwykłych komunikatów.
   Podgląd poza terminem: ?bw=1. Ładowany przez dopisek na końcu assets/its.js (Sky) i assets/blv.js (Boulevard).
   Wersja 5 (19.11.2026, polecenie Piotra): przypięty pasek z odliczaniem na każdej stronie, szarfy Black Week na kartach
   apartamentów i pakietów, wstęgi z przyciskiem rezerwacji w treści i przed stopką, oznaczenie przycisków rezerwacji.
   Ten sam plik działa na zapleczach Sky Tower (hotel-skytower.pl, apartamenty-skytower.pl, skytower-wroclaw.pl), ładowany z /site.js. */
(function () {
  'use strict';
  var KONIEC = Date.parse('2026-11-30T23:59:59+01:00');
  var START = Date.parse('2026-11-19T00:00:00+01:00');
  var podglad = /[?&]bw=1\b/.test(location.search);
  function aktywne() { var t = Date.now(); return podglad || (t >= START && t <= KONIEC); }
  if (!aktywne() || window.__bwStrona) return;
  window.__bwStrona = 1;

  var host = window.BW_HOST || location.hostname;
  var MARKA = (/boulevard/.test(host) || document.querySelector('a[href^="tel:+48660060800"]')) ? 'blv' : 'sky';
  var ZAP = !/inthesky|boulevard|localhost|127\.0\.0\.1/.test(host); /* zaplecza Sky Tower: wygląd jak inthesky.apartments, kroje i odcienie strony */
  var SILNIK = '#previo-booking-iframe, [id^="previo-booking-engine"]';
  var sciezka = window.BW_PATH || location.pathname;
  var naVoucherze = /voucher/i.test(sciezka); /* strony voucherów: panel i cena z bw-2026.js (16.11), tu tylko etykiety i pop-upy */

  var jez = (document.documentElement.lang || 'pl').slice(0, 2).toLowerCase();
  if (jez === 'cz') jez = 'cs';
  if (!/^(pl|en|de|cs|es)$/.test(jez)) jez = 'en';

  var T = {
    pl: { kicker: 'Black Week · tylko do 30 listopada', h: { sky: 'Black Week w Sky Tower', blv: 'Black Week nad Odrą' },
      do30: 'do -30%', opis: 'Rezerwujesz bezpośrednio, a rabat do 30% jest już w cenie w kalendarzu. Obejmuje pobyty do końca 2027 roku. Rezerwacje z rabatem przyjmujemy do 30 listopada, do 23:59.',
      cta: 'Sprawdź ceny Black Week', koniec: 'Do końca promocji', j: ['dni', 'godz.', 'min', 'sek'], pigulka: 'Black Week -30%',
      pasek: 'Black Week: do -30% przy rezerwacji bezpośredniej', ost: 'Ostatnie chwile promocji' },
    en: { kicker: 'Black Week · until 30 November only', h: { sky: 'Black Week at Sky Tower', blv: 'Black Week by the Oder' },
      do30: 'up to -30%', opis: 'Book direct and the discount of up to 30% is already included in the calendar prices. It covers stays until the end of 2027. Book by 30 November, 23:59.',
      cta: 'See Black Week prices', koniec: 'Offer ends in', j: ['days', 'hrs', 'min', 'sec'], pigulka: 'Black Week -30%',
      pasek: 'Black Week: up to -30% when you book direct', ost: 'Last moments of the offer' },
    de: { kicker: 'Black Week · nur bis 30. November', h: { sky: 'Black Week im Sky Tower', blv: 'Black Week an der Oder' },
      do30: 'bis -30%', opis: 'Direkt buchen: Der Rabatt von bis zu 30% ist bereits in den Kalenderpreisen enthalten. Er gilt für Aufenthalte bis Ende 2027. Buchbar bis 30. November, 23:59 Uhr.',
      cta: 'Black-Week-Preise ansehen', koniec: 'Angebot endet in', j: ['Tage', 'Std.', 'Min.', 'Sek.'], pigulka: 'Black Week -30%',
      pasek: 'Black Week: bis -30% bei Direktbuchung', ost: 'Letzte Momente des Angebots' },
    cs: { kicker: 'Black Week · jen do 30. listopadu', h: { sky: 'Black Week ve Sky Tower', blv: 'Black Week u Odry' },
      do30: 'až -30 %', opis: 'Při přímé rezervaci je sleva až 30 % už v cenách v kalendáři. Platí pro pobyty do konce roku 2027. Rezervujte do 30. listopadu, do 23:59.',
      cta: 'Zobrazit ceny Black Week', koniec: 'Do konce akce', j: ['dní', 'hod.', 'min', 'sek'], pigulka: 'Black Week -30 %',
      pasek: 'Black Week: až -30 % při přímé rezervaci', ost: 'Poslední chvíle akce' },
    es: { kicker: 'Black Week · solo hasta el 30 de noviembre', h: { sky: 'Black Week en Sky Tower', blv: 'Black Week junto al Oder' },
      do30: 'hasta -30%', opis: 'Reserva directa: el descuento de hasta el 30% ya está en los precios del calendario. Vale para estancias hasta finales de 2027. Reserva antes del 30 de noviembre, 23:59.',
      cta: 'Ver precios Black Week', koniec: 'La oferta termina en', j: ['días', 'h', 'min', 's'], pigulka: 'Black Week -30%',
      pasek: 'Black Week: hasta -30% al reservar directamente', ost: 'Últimos momentos de la oferta' }
  }[jez];

  var root = document.documentElement;
  root.classList.add('bw-s-on', 'bw-s-' + MARKA);

  /* ---------- 1. komunikaty o rezerwacji bezpośredniej ---------- */
  var KLUCZ = /bezpośredn|bezposredn|direct|direkt|přím|prim[aá]|rezerw|book|buch|reserv|dostępno|availab|verfügbar|dostupnost|disponib|taniej|tańsza|rabat|zniżk|discount|promocj|promoci|aktion|angebot|offer|akce|sleva|descuento/i;
  var WYKLUCZ = /min\.? ?2|sushi|kofuku|apex|dom wina|steak|buffet|marche|eyewear|fashion|purchases|zakupy|voucher|gutschein|poukaz|bono|-25/i;
  var CENA10 = /[-−–]\s?10\s?%/g;

  function kontekst(n) {
    var e = n.parentElement, i = 0;
    while (e && i < 3) {
      var t = e.textContent || '';
      if (t.length > 14 || /^(A|BUTTON|LI|P|SUMMARY|H[1-6])$/.test(e.tagName)) return t.slice(0, 260);
      e = e.parentElement; i++;
    }
    return e ? (e.textContent || '').slice(0, 260) : '';
  }
  function wPopupie(n) {
    var e = n.parentElement;
    while (e) { if (e.id === 'pop' || e.classList.contains('pop')) return true; e = e.parentElement; }
    return false;
  }
  function zmienTekst(s, popup) {
    var o = s;
    var M = {
      pl: [[/masz\s10\s?%\srabatu/gi, 'masz do 30% rabatu w Black Week'], [/(tańsza|taniej)\so\s10\s?%/gi, '$1 nawet o 30%'],
           [/[-−–]\s?10\s?%/g, T.do30], [/(Promocja|promocja)\sdo\s-30%/g, 'Black Week do -30%']],
      en: [[/get\s10\s?%\soff/gi, 'get up to 30% off'], [/10\s?%\soff/gi, 'up to 30% off'], [/[-−–]\s?10\s?%/g, T.do30],
           [/(Offer|offer|Promotion|promotion)\sup\sto\s-30%/g, 'Black Week up to -30%']],
      de: [[/10\s?%\sRabatt/gi, 'bis zu 30% Rabatt'], [/[-−–]\s?10\s?%/g, T.do30], [/(Angebot|Aktion)\sbis\s-30%/g, 'Black Week bis -30%']],
      cs: [[/slev[auy]\s10\s?%/gi, 'slevu až 30 %'], [/[-−–]\s?10\s?%/g, T.do30], [/(Akce|akce)\saž\s-30\s?%/g, 'Black Week až -30 %']],
      es: [[/10\s?%\sde\sdescuento/gi, 'hasta un 30% de descuento'], [/[-−–]\s?10\s?%/g, T.do30], [/(Promoción|promoción)\sde\shasta\s-30%/g, 'Black Week hasta -30%']]
    }[jez];
    M.forEach(function (r) { s = s.replace(r[0], r[1]); });
    /* „do do -30%” po podmianie */
    s = s.replace(/\b(do|bis|až|hasta|up to)\s+\1\s/g, '$1 ');
    return s === o ? null : s;
  }
  function przejdz(korzen) {
    var w = document.createTreeWalker(korzen, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName) || p.closest('.bw-s, .atr-deals, article .post-body, .blog-art-body')) return NodeFilter.FILTER_REJECT;
        return /10\s?%|10\s?%|-30|30\s?%/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var lista = [], n;
    while ((n = w.nextNode())) lista.push(n);
    lista.forEach(function (n) {
      var k = kontekst(n), popup = wPopupie(n);
      var maRabat10 = CENA10.test(n.nodeValue) || /10\s?%/.test(n.nodeValue); CENA10.lastIndex = 0;
      if (maRabat10) {
        var wl = n.nodeValue;
        if (WYKLUCZ.test(wl)) return;
        if (!(wl.length > 20 && KLUCZ.test(wl))) { /* krótki tekst, np. <b>-10%</b>: decyduje najbliższe otoczenie */
          if (WYKLUCZ.test(k)) return;
          if (!popup && !KLUCZ.test(k)) return;
        }
      }
      var nowy = zmienTekst(n.nodeValue, popup);
      if (nowy !== null) n.nodeValue = nowy;
    });
  }

  /* ---------- 2. oznaczenie Black Week w nagłówku ---------- */
  function naglowek() {
    var td = document.querySelector('.topbar .top-direct');
    if (td) { td.classList.add('bw-s-direct'); td.innerHTML = '<span class="bw-s-tag">Black Week</span> ' + T.do30; }
    Array.prototype.forEach.call(document.querySelectorAll('.promo-pill'), function (p) {
      if (/30/.test(p.textContent)) { p.classList.add('bw-s-pill'); p.innerHTML = '<i>Black Week</i> ' + T.do30; }
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tag.promo'), function (p) { p.classList.add('bw-s-pill'); });
  }

  /* ---------- 3. panel Black Week z odliczaniem ---------- */
  function linkRezerwacji() {
    var a = document.querySelector('.topbar a.btn-gold[href]') || document.querySelector('.topbar .top-direct');
    var h = a ? a.getAttribute('href') : '';
    if (ZAP) return '/rezerwacja/';
    if (!h || h.charAt(0) === '#') h = MARKA === 'blv' ? 'rezerwacja.html' : '/rezerwacja-online-wroclaw';
    return h;
  }
  function cyfry(klasa) {
    return '<div class="bw-s-licz ' + (klasa || '') + '" role="timer" aria-live="off" aria-label="' + T.koniec + '">' +
      T.j.map(function (j, i) { return '<span class="bw-s-c"><b data-i="' + i + '">00</b><small>' + j + '</small></span>'; }).join('') + '</div>';
  }
  function panel(wariant) {
    var d = document.createElement('section');
    d.className = 'bw-s bw-s-panel' + (wariant ? ' bw-s-' + wariant : '');
    d.setAttribute('aria-label', 'Black Week');
    d.innerHTML = '<div class="bw-s-in">' +
      '<div class="bw-s-txt"><p class="bw-s-kicker"><span class="bw-s-kropka" aria-hidden="true"></span>' + T.kicker + '</p>' +
      '<h2 class="bw-s-h">' + T.h[MARKA] + ' <em>' + T.do30 + '</em></h2>' +
      '<p class="bw-s-opis">' + T.opis + '</p></div>' +
      '<div class="bw-s-akcja"><p class="bw-s-lab">' + T.koniec + '</p>' + cyfry() +
      (wariant === 'silnik' ? '' : '<a class="bw-s-btn" href="' + linkRezerwacji() + '">' + T.cta + ' <span aria-hidden="true">→</span></a>') +
      '</div></div>';
    return d;
  }
  function wstawPanele() {
    var silnikSky = document.querySelector('.rez-frame [id^="previo-booking-engine"]');
    var silnikBlv = document.getElementById('previo-booking-iframe');
    if (silnikSky) { /* strefa poza silnikiem: nad kalendarzem rezerwacji */
      var rf = silnikSky.closest('.rez-frame');
      rf.parentNode.insertBefore(panel('silnik'), rf);
      return;
    }
    if (silnikBlv) {
      var bar = document.querySelector('.rez-frame .promo-bar');
      var p = panel('silnik');
      if (bar) { bar.parentNode.insertBefore(p, bar); bar.classList.add('bw-s-ukryj'); }
      else silnikBlv.parentNode.insertBefore(p, silnikBlv);
      return;
    }
    var hero = document.querySelector('body > section.hero, main > section.hero, body > section:first-of-type, main > section:first-of-type');
    if (hero && hero.parentNode) hero.parentNode.insertBefore(panel(/hero/.test(hero.className) ? '' : 'waski'), hero.nextSibling);
  }

  /* ---------- 4. popup wejściowy: oznaczenie i odliczanie ---------- */
  function popup() {
    var p = document.getElementById('pop');
    if (!p || p.querySelector('.bw-s-poptag')) return;
    var big = p.querySelector('.big');
    if (big) {
      var tag = document.createElement('p'); tag.className = 'bw-s-poptag'; tag.textContent = 'Black Week · ' + T.kicker.split('·')[1].trim();
      big.parentNode.insertBefore(tag, big);
      var l = document.createElement('div'); l.innerHTML = cyfry('bw-s-licz-mini'); big.parentNode.insertBefore(l.firstChild, big.nextSibling);
    }
  }


  /* ---------- 5. strefa Black Week wokół silnika: przecinające się taśmy (3D przy przewijaniu) i ramka ---------- */
  var P = {
    pl: { tasma: 'Black Week · do -30% · pobyty do końca 2027 · rezerwuj do 30.11 · ', ramka: 'Black Week · ceny z rabatem do -30% na pobyty do końca 2027',
      wejH: { sky: 'Black Week w Sky Tower', blv: 'Black Week nad Odrą' }, wejP: 'Do -30% przy rezerwacji bezpośredniej, na pobyty do końca 2027 roku. Rabat jest już w cenach. Rezerwujesz tylko do 30 listopada.',
      wejCta: 'Sprawdź wolne terminy', pozniej: 'Może później',
      wyjH: 'Zanim wyjdziesz', wyjP: 'Black Week trwa jeszcze chwilę. Do -30% za rezerwację bezpośrednią, bez prowizji pośredników.',
      wyjRezH: 'Twój rabat czeka', wyjRezP: 'Rabat Black Week do -30% jest już w cenach w kalendarzu. Wybierz daty do końca 2027 roku, zanim oferta się skończy.', wyjRezCta: 'Wracam do rezerwacji',
      ostH: 'Ostatnie godziny Black Week',
      bezT: 'Black Week trwa. Do -30% przy rezerwacji bezpośredniej.', powT: 'Wracasz w samą porę. Black Week jeszcze trwa.', pomT: 'Pomóc z terminem? Recepcja odpowie od ręki:',
      zost: 'Zostało', zamknij: 'Zamknij', toastCta: 'Zobacz ceny' },
    en: { tasma: 'Black Week · up to -30% · stays until end of 2027 · book by 30.11 · ', ramka: 'Black Week · up to -30% on stays until the end of 2027',
      wejH: { sky: 'Black Week at Sky Tower', blv: 'Black Week by the Oder' }, wejP: 'Up to -30% when you book direct, for stays until the end of 2027. The discount is already in the prices. Book by 30 November.',
      wejCta: 'Check available dates', pozniej: 'Maybe later',
      wyjH: 'Before you go', wyjP: 'Black Week is still on. Up to -30% when you book direct, with no booking fees.',
      wyjRezH: 'Your discount is waiting', wyjRezP: 'The Black Week discount of up to -30% is already in the calendar prices. Pick your dates until the end of 2027 before the offer ends.', wyjRezCta: 'Back to booking',
      ostH: 'Last hours of Black Week',
      bezT: 'Black Week is on. Up to -30% when you book direct.', powT: 'Back just in time. Black Week is still on.', pomT: 'Need help with dates? Reception will answer right away:',
      zost: 'Ends in', zamknij: 'Close', toastCta: 'See prices' },
    de: { tasma: 'Black Week · bis -30% · Aufenthalte bis Ende 2027 · buchbar bis 30.11 · ', ramka: 'Black Week · bis -30% für Aufenthalte bis Ende 2027',
      wejH: { sky: 'Black Week im Sky Tower', blv: 'Black Week an der Oder' }, wejP: 'Bis -30% bei Direktbuchung, für Aufenthalte bis Ende 2027. Der Rabatt ist schon im Preis. Buchbar bis 30. November.',
      wejCta: 'Freie Termine prüfen', pozniej: 'Vielleicht später',
      wyjH: 'Bevor Sie gehen', wyjP: 'Die Black Week läuft noch. Bis -30% bei Direktbuchung, ohne Vermittlungsgebühr.',
      wyjRezH: 'Ihr Rabatt wartet', wyjRezP: 'Der Black-Week-Rabatt von bis zu -30% ist schon in den Kalenderpreisen. Wählen Sie Daten bis Ende 2027, bevor das Angebot endet.', wyjRezCta: 'Zurück zur Buchung',
      ostH: 'Letzte Stunden der Black Week',
      bezT: 'Black Week läuft. Bis -30% bei Direktbuchung.', powT: 'Gerade rechtzeitig zurück. Die Black Week läuft noch.', pomT: 'Hilfe bei den Daten? Die Rezeption antwortet sofort:',
      zost: 'Endet in', zamknij: 'Schließen', toastCta: 'Preise ansehen' },
    cs: { tasma: 'Black Week · až -30 % · pobyty do konce 2027 · rezervujte do 30.11 · ', ramka: 'Black Week · sleva až 30 % na pobyty do konce 2027',
      wejH: { sky: 'Black Week ve Sky Tower', blv: 'Black Week u Odry' }, wejP: 'Až -30 % při přímé rezervaci, na pobyty do konce roku 2027. Sleva je už v ceně. Rezervujte do 30. listopadu.',
      wejCta: 'Zobrazit volné termíny', pozniej: 'Možná později',
      wyjH: 'Než odejdete', wyjP: 'Black Week ještě běží. Až -30 % při přímé rezervaci, bez poplatků zprostředkovatelům.',
      wyjRezH: 'Vaše sleva čeká', wyjRezP: 'Sleva Black Week až 30 % je už v cenách v kalendáři. Vyberte termín do konce roku 2027, než akce skončí.', wyjRezCta: 'Zpět k rezervaci',
      ostH: 'Poslední hodiny Black Week',
      bezT: 'Black Week běží. Až -30 % při přímé rezervaci.', powT: 'Vracíte se právě včas. Black Week ještě běží.', pomT: 'Pomoc s termínem? Recepce odpoví hned:',
      zost: 'Zbývá', zamknij: 'Zavřít', toastCta: 'Zobrazit ceny' },
    es: { tasma: 'Black Week · hasta -30% · estancias hasta finales de 2027 · reserva hasta el 30.11 · ', ramka: 'Black Week · hasta -30% en estancias hasta finales de 2027',
      wejH: { sky: 'Black Week en Sky Tower', blv: 'Black Week junto al Oder' }, wejP: 'Hasta -30% al reservar directamente, para estancias hasta finales de 2027. El descuento ya está en el precio. Reserva antes del 30 de noviembre.',
      wejCta: 'Ver fechas libres', pozniej: 'Quizá más tarde',
      wyjH: 'Antes de irte', wyjP: 'La Black Week sigue activa. Hasta -30% al reservar directamente, sin comisiones.',
      wyjRezH: 'Tu descuento te espera', wyjRezP: 'El descuento Black Week de hasta -30% ya está en los precios del calendario. Elige fechas hasta finales de 2027 antes de que termine.', wyjRezCta: 'Volver a la reserva',
      ostH: 'Últimas horas de la Black Week',
      bezT: 'La Black Week sigue. Hasta -30% al reservar directamente.', powT: 'Vuelves a tiempo. La Black Week sigue activa.', pomT: '¿Ayuda con las fechas? Recepción responde al momento:',
      zost: 'Quedan', zamknij: 'Cerrar', toastCta: 'Ver precios' }
  }[jez];
  var TEL = MARKA === 'blv' ? '+48 660 060 800' : '+48 883 81 81 85';
  var ostatnie = function () { return KONIEC - Date.now() < 864e5; };
  var naRezerwacji = function () { return !!document.querySelector(SILNIK); };
  var ruch = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  function tasma(klasa, tekst) {
    var t = Array(8).join(tekst || P.tasma);
    return '<div class="bw-s-tasma ' + klasa + '" aria-hidden="true"><div class="bw-s-tor"><span>' + t + '</span><span>' + t + '</span></div></div>';
  }
  function strefa() {
    var ifr = document.getElementById('previo-booking-iframe'), eng = ifr || document.querySelector('[id^="previo-booking-engine"]');
    var kont = eng && eng.closest('.rez-frame');
    if (!kont || kont.classList.contains('bw-s-ramka')) return;
    kont.classList.add('bw-s-ramka');
    var etyk = document.createElement('div'); etyk.className = 'bw-s-ramka-et'; etyk.innerHTML = '<i></i>' + P.ramka;
    var gora = document.createElement('div'); gora.className = 'bw-s-tasmy bw-s-tasmy-gora';
    gora.innerHTML = tasma('bw-s-t1') + tasma('bw-s-t2');
    var dol = document.createElement('div'); dol.className = 'bw-s-tasmy bw-s-tasmy-dol';
    dol.innerHTML = tasma('bw-s-t2') + tasma('bw-s-t1');
    if (ifr) { /* Boulevard: silnik w ramce iframe; ramka obejmuje panel, taśmy i kalendarz, iframe zostaje na miejscu */
      var lead = kont.querySelector('.rez-lead') || ifr;
      kont.insertBefore(gora, lead); ifr.parentNode.insertBefore(etyk, ifr); ifr.parentNode.insertBefore(dol, ifr.nextSibling);
    } else { /* Sky: taśmy nad i pod ramką kalendarza */
      eng.parentNode.insertBefore(etyk, eng);
      kont.parentNode.insertBefore(gora, kont); kont.parentNode.insertBefore(dol, kont.nextSibling);
    }
    tasmy3d([gora, dol]);
  }
  var tasmyLista = [], tasmyCzeka = false;
  function tasmy3d(nowe) {
    if (!ruch) return;
    var pierwsze = !tasmyLista.length;
    Array.prototype.push.apply(tasmyLista, nowe);
    function klatka() {
      tasmyCzeka = false;
      tasmyLista.forEach(function (s, j) {
        var i = s.classList.contains('bw-s-tasmy-dol') ? 1 : 0;
        var r = s.getBoundingClientRect(), p = ((r.top + r.height / 2) / innerHeight - .5) * 2; /* -1 u góry ekranu, 1 u dołu */
        if (p < -1.6 || p > 1.6) return;
        var a = s.children[0], b = s.children[1], z = i ? -1 : 1;
        a.style.transform = 'rotateZ(' + (-4 * z) + 'deg) rotateX(' + (p * 24).toFixed(1) + 'deg) translate3d(' + (p * -50).toFixed(0) + 'px,0,' + (Math.abs(p) * -40).toFixed(0) + 'px)';
        b.style.transform = 'rotateZ(' + (3 * z) + 'deg) rotateX(' + (p * -24).toFixed(1) + 'deg) translate3d(' + (p * 50).toFixed(0) + 'px,0,' + (Math.abs(p) * -40).toFixed(0) + 'px)';
      });
    }
    if (pierwsze) addEventListener('scroll', function () { if (!tasmyCzeka) { tasmyCzeka = true; requestAnimationFrame(klatka); } }, { passive: true });
    klatka();
  }

  /* ---------- 6. pop-upy Black Week w różnych sytuacjach (limit na sesję) ---------- */
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem('bw26-' + k); sessionStorage.setItem('bw26-' + k, v); } catch (e) { return null; } }
  var otwarty = null;
  function licznikTxt() {
    var ms = Math.max(0, KONIEC - Date.now()), d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    return P.zost + ' ' + (d ? d + ' ' + T.j[0] + ' ' : '') + h + ' ' + T.j[1] + (d ? '' : ' ' + m + ' ' + T.j[2]);
  }
  function modal(typ) {
    if (otwarty || ss('m-' + typ) || +(ss('m-ile') || 0) >= 2) return;
    if (document.querySelector('.menu.open, .drawer[aria-hidden="false"], .pop.open')) return;
    ss('m-' + typ, '1'); ss('m-ile', String(+(ss('m-ile') || 0) + 1));
    var rez = naRezerwacji() && typ === 'wyjscie';
    var h = ostatnie() ? P.ostH : typ === 'wejscie' ? P.wejH[MARKA] : rez ? P.wyjRezH : P.wyjH;
    var p = typ === 'wejscie' ? P.wejP : rez ? P.wyjRezP : P.wyjP;
    var cta = rez ? P.wyjRezCta : P.wejCta;
    var o = document.createElement('div');
    o.className = 'bw-s-mod'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Black Week');
    o.innerHTML = '<div class="bw-s-mod-box">' + tasma('bw-s-t1 bw-s-mod-tasma') +
      '<button class="bw-s-x" type="button" aria-label="' + P.zamknij + '">✕</button>' +
      '<p class="bw-s-kicker"><span class="bw-s-kropka" aria-hidden="true"></span>' + T.kicker + '</p>' +
      '<p class="bw-s-mod-pct">' + T.do30 + '</p><h2 class="bw-s-mod-h">' + h + '</h2><p class="bw-s-mod-p">' + p + '</p>' +
      cyfry('bw-s-licz-mod') +
      '<a class="bw-s-btn bw-s-mod-cta" href="' + linkRezerwacji() + '">' + cta + ' <span aria-hidden="true">→</span></a>' +
      '<button class="bw-s-pozniej" type="button">' + P.pozniej + '</button></div>';
    document.body.appendChild(o); otwarty = o; tick();
    var poprz = document.activeElement;
    requestAnimationFrame(function () { o.classList.add('bw-s-on-mod'); o.querySelector('.bw-s-mod-cta').focus({ preventScroll: true }); });
    function zamknij() { o.classList.remove('bw-s-on-mod'); setTimeout(function () { o.remove(); }, 260); otwarty = null; document.removeEventListener('keydown', esc); if (poprz && poprz.focus) try { poprz.focus({ preventScroll: true }); } catch (e) {} }
    function esc(e) { if (e.key === 'Escape') zamknij(); }
    document.addEventListener('keydown', esc);
    o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('.bw-s-x, .bw-s-pozniej')) zamknij(); });
    o.querySelector('.bw-s-mod-cta').addEventListener('click', function (e) {
      var silnik = document.querySelector(SILNIK);
      if (silnik) { e.preventDefault(); zamknij(); silnik.scrollIntoView({ behavior: ruch ? 'smooth' : 'auto', block: 'start' }); }
    });
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'bw_popup', bw_typ: typ }); } catch (e) {}
  }
  function toast(typ, tekst, zTel) {
    if (otwarty || ss('t-' + typ) || +(ss('t-ile') || 0) >= 2 || document.querySelector('.bw-s-toast')) return;
    ss('t-' + typ, '1'); ss('t-ile', String(+(ss('t-ile') || 0) + 1));
    var t = document.createElement('div'); t.className = 'bw-s-toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<button class="bw-s-x" type="button" aria-label="' + P.zamknij + '">✕</button><p class="bw-s-toast-k"><span class="bw-s-kropka" aria-hidden="true"></span>Black Week · ' + licznikTxt() + '</p><p class="bw-s-toast-t">' + tekst + '</p>' +
      (zTel ? '<a class="bw-s-toast-a" href="tel:' + TEL.replace(/\s/g, '') + '">' + TEL + '</a>' : '<a class="bw-s-toast-a" href="' + linkRezerwacji() + '">' + P.toastCta + ' →</a>');
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('bw-s-on-toast'); });
    var znik = setTimeout(zamk, 14000);
    function zamk() { clearTimeout(znik); t.classList.remove('bw-s-on-toast'); setTimeout(function () { t.remove(); }, 300); }
    t.querySelector('.bw-s-x').addEventListener('click', zamk);
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'bw_toast', bw_typ: typ }); } catch (e) {}
  }
  function popupy() {
    var rez = naRezerwacji(), start = Date.now();
    /* 1) wejście: poza stroną rezerwacji, po 8 s albo po przewinięciu 35% strony */
    if (!rez) {
      var wej = function () { if (Date.now() - start > 3000) modal('wejscie'); };
      setTimeout(wej, 8000);
      addEventListener('scroll', function f() { if (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) > .35) { removeEventListener('scroll', f); wej(); } }, { passive: true });
    }
    /* 2) próba wyjścia: kursor ucieka nad pasek kart (komputer) albo szybkie przewinięcie w górę (telefon) */
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 4 && Date.now() - start > 4000) modal('wyjscie'); });
    var ostY = scrollY, ostT = Date.now();
    addEventListener('scroll', function () {
      var t = Date.now(), dy = scrollY - ostY, dt = t - ostT;
      if (dt > 0 && dt < 350 && dy < -260 && scrollY > 500 && t - start > 6000 && innerWidth < 900) modal('wyjscie');
      ostY = scrollY; ostT = t;
    }, { passive: true });
    /* 3) powrót do karty po co najmniej 20 s */
    var ukryte = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) ukryte = Date.now();
      else if (ukryte && Date.now() - ukryte > 20000) setTimeout(function () { toast('powrot', ostatnie() ? P.ostH : P.powT); }, 900);
    });
    /* 4) bezczynność: 45 s bez ruchu; na stronie rezerwacji 70 s i propozycja pomocy recepcji */
    var bez;
    function reset() { clearTimeout(bez); bez = setTimeout(function () { if (rez) toast('pomoc', P.pomT, true); else toast('bezczynnosc', ostatnie() ? P.ostH : P.bezT); }, rez ? 70000 : 45000); }
    ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (e) { addEventListener(e, reset, { passive: true }); });
    reset();
  }

  /* ---------- 7. vouchery: Black Week zamiast „-25%” (etykiety na całej stronie) ---------- */
  var V25 = /[-−–]\s?25\s?%/;
  var VSLOWA = /voucher|bon|gutschein|poukaz|vale|prezent|gift|geschenk|dárek|regalo/i;
  function etykietyVoucherow() {
    Array.prototype.forEach.call(document.querySelectorAll('.top-voucher'), function (a) {
      if (V25.test(a.textContent)) { a.innerHTML = a.innerHTML.replace(/<b>\s*[-−–]\s?25\s?%\s*<\/b>/, '<b>Black Week</b>').replace(V25, 'Black Week'); a.classList.add('bw-s-vlab'); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('.pill, .badge, .vbadge, .voff, .tag'), function (e) {
      if (!V25.test(e.textContent)) return;
      var a = e.closest('a, section, li'), l = a && (a.matches('a[href]') ? a : a.querySelector('a[href]'));
      if (!VSLOWA.test((a ? a.textContent : '') + ' ' + (l ? l.getAttribute('href') : '') + ' ' + e.className)) return;
      e.textContent = e.textContent.replace(V25, 'Black Week'); e.classList.add('bw-s-vlab');
    });
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentElement;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName) || p.closest('.bw-s, .bw-s-mod, article .post-body, .blog-art-body')) return NodeFilter.FILTER_REJECT;
      return (V25.test(n.nodeValue) || /1\s?099\s?zł zamiast 1\s?499/.test(n.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    } }), lista = [], n;
    while ((n = w.nextNode())) lista.push(n);
    lista.forEach(function (n) {
      var v = n.nodeValue.replace(/(1\s?099\s?zł zamiast 1)(\s?)499/, '$1$2500'); /* menu Boulevard: przekreślona cena jak na stronie vouchera */
      var k = n.nodeValue + ' ' + kontekst(n) + ' ' + ((n.parentElement.closest('a[href]') || {}).href || '');
      if (V25.test(v) && VSLOWA.test(k)) v = v.replace(/\s*[-−–]\s?25\s?%/, ' Black Week').replace(/^ /, '');
      if (v !== n.nodeValue) n.nodeValue = v;
    });
    if (naVoucherze && V25.test(document.title)) document.title = document.title.replace(/\s*[-−–]\s?25\s?%/, ': Black Week');
  }

  /* ---------- 8. pop-upy na stronach voucherów (cena i przycisk z window.BW_CFG strony vouchera) ---------- */
  function popupyVoucher() {
    var C = window.BW_CFG;
    if (!C || jez !== 'pl' || C.aktywne === false) return;
    var zl = function (x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł'; };
    var cena = '<s>' + zl(C.stara) + '</s> <b>' + zl(C.nowa) + '</b>';
    var miejsce = MARKA === 'blv' ? 'nad Odrą' : 'w Sky Tower';
    var V = {
      wejH: MARKA === 'blv' ? 'Black Week na vouchery nad Odrą' : 'Black Week na vouchery w Sky Tower',
      wejP: 'Voucher na noc z jacuzzi ' + miejsce + ' w cenie Black Week. Oferta limitowana, tylko do 30 listopada.',
      wyjH: 'Zanim wyjdziesz', wyjP: 'Cena Black Week na voucher trwa do 30 listopada. Prezent kupujesz teraz, termin pobytu obdarowani wybiorą sami.',
      ostH: 'Ostatnie godziny Black Week',
      powT: 'Wracasz w samą porę. Cena Black Week na voucher jeszcze trwa.',
      bezT: 'Black Week: voucher na noc z jacuzzi ' + miejsce + ' w specjalnej cenie.',
      cta: C.cta || 'Kupuję voucher', toastCta: 'Wybieram voucher'
    };
    function kup(e) {
      if (e) e.preventDefault();
      var b = C.przycisk && document.querySelector(C.przycisk);
      if (b) { b.scrollIntoView({ behavior: ruch ? 'smooth' : 'auto', block: 'center' }); setTimeout(function () { b.click(); }, 350); }
    }
    function modalV(typ) {
      if (otwarty || ss('vm-' + typ) || +(ss('vm-ile') || 0) >= 2) return;
      if (document.querySelector('.menu.open, .drawer[aria-hidden="false"], .pop.open, .modal.open, dialog[open]')) return;
      ss('vm-' + typ, '1'); ss('vm-ile', String(+(ss('vm-ile') || 0) + 1));
      var h = ostatnie() ? V.ostH : typ === 'wejscie' ? V.wejH : V.wyjH, p = typ === 'wejscie' ? V.wejP : V.wyjP;
      var o = document.createElement('div');
      o.className = 'bw-s-mod bw-s-mod-v'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Black Week');
      o.innerHTML = '<div class="bw-s-mod-box">' + tasma('bw-s-t1 bw-s-mod-tasma', 'Black Week · voucher na noc z jacuzzi · cena limitowana · tylko do 30.11 · ') +
        '<button class="bw-s-x" type="button" aria-label="' + P.zamknij + '">✕</button>' +
        '<p class="bw-s-kicker"><span class="bw-s-kropka" aria-hidden="true"></span>Black Week · oferta limitowana do 30 listopada</p>' +
        '<p class="bw-s-mod-pct bw-s-mod-cena">' + cena + '</p><h2 class="bw-s-mod-h">' + h + '</h2><p class="bw-s-mod-p">' + p + '</p>' +
        cyfry('bw-s-licz-mod') +
        '<a class="bw-s-btn bw-s-mod-cta" href="#">' + V.cta + ' <span aria-hidden="true">→</span></a>' +
        '<button class="bw-s-pozniej" type="button">' + P.pozniej + '</button></div>';
      document.body.appendChild(o); otwarty = o; tick();
      var poprz = document.activeElement;
      requestAnimationFrame(function () { o.classList.add('bw-s-on-mod'); o.querySelector('.bw-s-mod-cta').focus({ preventScroll: true }); });
      function zamknij() { o.classList.remove('bw-s-on-mod'); setTimeout(function () { o.remove(); }, 260); otwarty = null; document.removeEventListener('keydown', esc); if (poprz && poprz.focus) try { poprz.focus({ preventScroll: true }); } catch (e) {} }
      function esc(e) { if (e.key === 'Escape') zamknij(); }
      document.addEventListener('keydown', esc);
      o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('.bw-s-x, .bw-s-pozniej')) zamknij(); });
      o.querySelector('.bw-s-mod-cta').addEventListener('click', function (e) { zamknij(); kup(e); });
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'bw_popup', bw_typ: 'voucher_' + typ }); } catch (e) {}
    }
    function toastV(typ, tekst) {
      if (otwarty || ss('vt-' + typ) || +(ss('vt-ile') || 0) >= 2 || document.querySelector('.bw-s-toast')) return;
      ss('vt-' + typ, '1'); ss('vt-ile', String(+(ss('vt-ile') || 0) + 1));
      var t = document.createElement('div'); t.className = 'bw-s-toast'; t.setAttribute('role', 'status');
      t.innerHTML = '<button class="bw-s-x" type="button" aria-label="' + P.zamknij + '">✕</button><p class="bw-s-toast-k"><span class="bw-s-kropka" aria-hidden="true"></span>Black Week · ' + licznikTxt() + '</p><p class="bw-s-toast-t">' + tekst + ' ' + cena + '</p>' +
        '<a class="bw-s-toast-a" href="#">' + V.toastCta + ' →</a>';
      document.body.appendChild(t);
      requestAnimationFrame(function () { t.classList.add('bw-s-on-toast'); });
      var znik = setTimeout(zamk, 14000);
      function zamk() { clearTimeout(znik); t.classList.remove('bw-s-on-toast'); setTimeout(function () { t.remove(); }, 300); }
      t.querySelector('.bw-s-x').addEventListener('click', zamk);
      t.querySelector('.bw-s-toast-a').addEventListener('click', function (e) { zamk(); kup(e); });
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'bw_toast', bw_typ: 'voucher_' + typ }); } catch (e) {}
    }
    var start = Date.now();
    var wej = function () { if (Date.now() - start > 3000) modalV('wejscie'); };
    setTimeout(wej, 8000);
    addEventListener('scroll', function f() { if (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) > .35) { removeEventListener('scroll', f); wej(); } }, { passive: true });
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 4 && Date.now() - start > 4000) modalV('wyjscie'); });
    var ostY = scrollY, ostT = Date.now();
    addEventListener('scroll', function () {
      var t = Date.now(), dy = scrollY - ostY, dt = t - ostT;
      if (dt > 0 && dt < 350 && dy < -260 && scrollY > 500 && t - start > 6000 && innerWidth < 900) modalV('wyjscie');
      ostY = scrollY; ostT = t;
    }, { passive: true });
    var ukryte = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) ukryte = Date.now();
      else if (ukryte && Date.now() - ukryte > 20000) setTimeout(function () { toastV('powrot', ostatnie() ? V.ostH + '.' : V.powT); }, 900);
    });
    var bez;
    function reset() { clearTimeout(bez); bez = setTimeout(function () { toastV('bezczynnosc', ostatnie() ? V.ostH + '.' : V.bezT); }, 45000); }
    ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (e) { addEventListener(e, reset, { passive: true }); });
    reset();
  }

  /* ---------- 9. wersja 5: przypięty pasek, szarfy, wstęgi z przyciskiem, oznaczenie przycisków rezerwacji ---------- */
  var W = {
    pl: { bar: 'Teraz taniej do -30% przy rezerwacji bezpośredniej', barV: 'Voucher na noc z jacuzzi w cenie Black Week', kon: 'Koniec za', cta: 'Zarezerwuj', ctaV: 'Kupuję voucher',
      szarfa: 'Black Week · do -30%', wH: 'Teraz taniej', wP: 'Rabat Black Week jest już w cenach w kalendarzu. Pobyty do końca 2027 roku, rezerwujesz do 30 listopada.', wCta: 'Zarezerwuj z rabatem Black Week' },
    en: { bar: 'Now up to -30% cheaper when you book direct', barV: 'Jacuzzi night voucher at the Black Week price', kon: 'Ends in', cta: 'Book now', ctaV: 'Buy voucher',
      szarfa: 'Black Week · up to -30%', wH: 'Now cheaper', wP: 'The Black Week discount is already in the calendar prices. Stays until the end of 2027, book by 30 November.', wCta: 'Book with the Black Week discount' },
    de: { bar: 'Jetzt bis -30% günstiger bei Direktbuchung', barV: 'Gutschein für eine Nacht mit Jacuzzi zum Black-Week-Preis', kon: 'Endet in', cta: 'Jetzt buchen', ctaV: 'Gutschein kaufen',
      szarfa: 'Black Week · bis -30%', wH: 'Jetzt günstiger', wP: 'Der Black-Week-Rabatt ist schon in den Kalenderpreisen. Aufenthalte bis Ende 2027, buchbar bis 30. November.', wCta: 'Mit Black-Week-Rabatt buchen' },
    cs: { bar: 'Teď levněji až o 30 % při přímé rezervaci', barV: 'Poukaz na noc s jacuzzi za cenu Black Week', kon: 'Konec za', cta: 'Rezervovat', ctaV: 'Koupit poukaz',
      szarfa: 'Black Week · až -30 %', wH: 'Teď levněji', wP: 'Sleva Black Week je už v cenách v kalendáři. Pobyty do konce roku 2027, rezervujte do 30. listopadu.', wCta: 'Rezervovat se slevou Black Week' },
    es: { bar: 'Ahora hasta un 30% más barato al reservar directamente', barV: 'Bono de una noche con jacuzzi a precio Black Week', kon: 'Termina en', cta: 'Reservar', ctaV: 'Comprar bono',
      szarfa: 'Black Week · hasta -30%', wH: 'Ahora más barato', wP: 'El descuento Black Week ya está en los precios del calendario. Estancias hasta finales de 2027, reserva hasta el 30 de noviembre.', wCta: 'Reservar con descuento Black Week' }
  }[jez];

  /* przypięty pasek na górze każdej strony: Black Week, odliczanie, przycisk */
  function pasek() {
    if (document.querySelector('.bw-s-bar') || !document.body) return;
    var voucherPl = naVoucherze && jez === 'pl' && window.BW_CFG && window.BW_CFG.aktywne !== false;
    var b = document.createElement('div');
    b.className = 'bw-s-bar'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Black Week');
    b.innerHTML = '<a class="bw-s-bar-in" href="' + (voucherPl ? '#' : linkRezerwacji()) + '" data-bw="pasek">' +
      '<span class="bw-s-bar-tag"><span class="bw-s-kropka" aria-hidden="true"></span>Black Week</span>' +
      '<span class="bw-s-bar-txt">' + (voucherPl ? W.barV : W.bar) + '</span>' +
      '<span class="bw-s-bar-krotki">' + T.do30 + '</span>' +
      '<span class="bw-s-bar-czas"><small>' + W.kon + '</small> <b class="bw-s-bar-l" role="timer" aria-live="off">00:00:00</b></span>' +
      '<span class="bw-s-bar-cta"><span class="bw-s-bar-ctat">' + (voucherPl ? W.ctaV : W.cta) + '</span> <span aria-hidden="true">→</span></span></a>';
    document.body.insertBefore(b, document.body.firstChild);
    root.classList.add('bw-s-bar-on');
    b.querySelector('a').addEventListener('click', function (e) {
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'bw_pasek' }); } catch (x) {}
      if (voucherPl) {
        e.preventDefault();
        var k = window.BW_CFG.przycisk && document.querySelector(window.BW_CFG.przycisk);
        if (k) { k.scrollIntoView({ behavior: ruch ? 'smooth' : 'auto', block: 'center' }); setTimeout(function () { k.click(); }, 350); }
        return;
      }
      var silnik = document.querySelector(SILNIK);
      if (silnik) { e.preventDefault(); silnik.scrollIntoView({ behavior: ruch ? 'smooth' : 'auto', block: 'start' }); }
    });
  }

  /* szarfa Black Week w rogu zdjęć apartamentów, pakietów i katalogu */
  function szarfy() {
    Array.prototype.forEach.call(document.querySelectorAll('.ap .photo, .item .gw, .plan'), function (e) {
      if (e.querySelector(':scope > .bw-s-szarfa') || e.closest('.bw-s, .bw-s-mod, .menu, footer')) return;
      var cs = getComputedStyle(e);
      if (cs.position === 'static') e.style.position = 'relative';
      if (cs.overflow === 'visible') e.style.overflow = 'hidden';
      var s = document.createElement('span'); s.className = 'bw-s-szarfa'; s.setAttribute('aria-hidden', 'true'); s.textContent = W.szarfa;
      e.appendChild(s);
    });
  }

  /* oznaczenie przycisków rezerwacji: złota plakietka „do -30%” */
  function przyciski() {
    Array.prototype.forEach.call(document.querySelectorAll('a.btn[href*="rezerwacja"], a.btn[href*="obk="], a.btn[data-previo], .stickybar a.btn'), function (a) {
      if (a.closest('.bw-s, .bw-s-bar, .bw-s-mod, .bw-s-wstega, .menu') || a.querySelector('.bw-s-btn-tag')) return;
      a.classList.add('bw-s-rez');
      if (/30\s?%/.test(a.textContent)) return;
      var t = document.createElement('span'); t.className = 'bw-s-btn-tag'; t.textContent = T.do30; a.appendChild(t);
      if (a.offsetWidth && a.scrollWidth > a.clientWidth + 1) a.removeChild(t); /* wąski przycisk (np. katalog): bez plakietki */
    });
  }

  /* wstęgi: przecinające się taśmy + nagłówek, odliczanie i przycisk; w środku strony i przed stopką */
  function wstega() {
    var s = document.createElement('section');
    s.className = 'bw-s bw-s-wstega'; s.setAttribute('aria-label', 'Black Week');
    var g = document.createElement('div'); g.className = 'bw-s-tasmy bw-s-tasmy-wstega'; g.innerHTML = tasma('bw-s-t1') + tasma('bw-s-t2');
    s.appendChild(g);
    var w = document.createElement('div'); w.className = 'bw-s-wstega-in';
    w.innerHTML = '<p class="bw-s-kicker"><span class="bw-s-kropka" aria-hidden="true"></span>' + T.kicker + '</p>' +
      '<h2 class="bw-s-wstega-h">' + W.wH + ' <em>' + T.do30 + '</em></h2><p class="bw-s-wstega-p">' + W.wP + '</p>' + cyfry('bw-s-licz-wstega') +
      '<a class="bw-s-btn" href="' + linkRezerwacji() + '" data-bw="wstega">' + W.wCta + ' <span aria-hidden="true">→</span></a>';
    s.appendChild(w);
    return s;
  }
  function wstegi() {
    if (naRezerwacji() || naVoucherze || document.querySelector('.bw-s-wstega')) return;
    var nowe = [];
    var sekcje = Array.prototype.filter.call(document.querySelectorAll('body > section, main > section, body > main > section, body > div > section'), function (x) {
      return !x.classList.contains('hero') && !x.closest('.bw-s, footer, .menu') && x.offsetHeight > 80;
    });
    var stopka = document.querySelector('body > footer, main + footer, footer.footer, footer');
    /* 1) w treści: po sekcji apartamentów (moment wyboru), inaczej w połowie strony */
    if (sekcje.length >= 4) {
      var po = document.getElementById('apartamenty') || document.getElementById('katalog') || sekcje[Math.floor(sekcje.length / 2)];
      if (po && po.parentNode && sekcje.indexOf(po) < sekcje.length - 2) { var a = wstega(); po.parentNode.insertBefore(a, po.nextSibling); nowe.push(a.firstChild); }
    }
    /* 2) przed stopką */
    if (stopka && stopka.parentNode) { var b = wstega(); b.classList.add('bw-s-wstega-dol'); stopka.parentNode.insertBefore(b, stopka); nowe.push(b.firstChild); }
    tasmy3d(nowe);
  }

  /* zaplecza: odcienie i kroje strony (granat, złoto i fonty są inne niż na inthesky.apartments) */
  function stylZaplecza() {
    if (!ZAP) return;
    root.classList.add('bw-s-zap');
    try {
      var cs = getComputedStyle(root), h = document.querySelector('h1, h2'), z = cs.getPropertyValue('--gold').trim(), n = cs.getPropertyValue('--navy').trim();
      if (z) root.style.setProperty('--bws-zloto', z);
      if (n) root.style.setProperty('--bws-tlo2', n);
      if (h) root.style.setProperty('--bws-serif', getComputedStyle(h).fontFamily);
      root.style.setProperty('--bws-sans', getComputedStyle(document.body).fontFamily);
    } catch (e) {}
  }

  /* ---------- odliczanie ---------- */
  function tick() {
    var ms = KONIEC - Date.now();
    if (ms <= 0 && !podglad) { location.reload(); return; }
    if (ms < 0) ms = 0;
    var v = [Math.floor(ms / 864e5), Math.floor(ms % 864e5 / 36e5), Math.floor(ms % 36e5 / 6e4), Math.floor(ms % 6e4 / 1e3)];
    Array.prototype.forEach.call(document.querySelectorAll('.bw-s-licz b'), function (b) {
      var x = v[+b.getAttribute('data-i')]; b.textContent = x < 10 ? '0' + x : String(x);
    });
    var dd = function (x) { return x < 10 ? '0' + x : String(x); };
    Array.prototype.forEach.call(document.querySelectorAll('.bw-s-bar-l'), function (b) {
      b.textContent = (v[0] ? v[0] + ' ' + T.j[0] + ' ' : '') + dd(v[1]) + ':' + dd(v[2]) + ':' + dd(v[3]);
    });
  }

  function start() {
    etykietyVoucherow();
    setTimeout(etykietyVoucherow, 1500);
    stylZaplecza();
    pasek();
    if (naVoucherze) { popupyVoucher(); tick(); setInterval(tick, 1000); return; }
    przejdz(document.body);
    naglowek();
    wstawPanele();
    szarfy();
    przyciski();
    wstegi();
    popup();
    if (naRezerwacji()) strefa();
    popupy();
    tick();
    setInterval(tick, 1000);
    /* treści dokładane później (lejek, pasek mobilny) */
    setTimeout(function () { przejdz(document.body); szarfy(); przyciski(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
