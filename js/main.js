/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'mimeta-sant-agnese',
    /* WhatsApp pubblicato da loro (Facebook, Instagram, volantini) e sulla scheda Google come link per prenotare */
    whatsapp: { number: '393513591932', message: 'Ciao! Vorrei chiedere un\'informazione.', ids: ['heroWhatsapp', 'festeWhatsapp', 'doveWhatsapp', 'barWhatsapp', 'menuWhatsapp'] },
    /* pannello Google (30/9/2026): lunedì–giovedì 10–20, venerdì 10–01, sabato 10:30–01, domenica chiuso */
    hours: {
      0: [], 1: [['10:00', '20:00']], 2: [['10:00', '20:00']], 3: [['10:00', '20:00']],
      4: [['10:00', '20:00']], 5: [['10:00', '25:00']], 6: [['10:30', '25:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "MiMeta Italian Bar: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.mangia": "Eat",
      "n.bevi": "Drink",
      "n.rilassati": "Relax",
      "n.feste": "Graduation parties",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.scrivici": "Message us on WhatsApp",
      "t.indicazioni": "Directions",
      "h.sopra": "Bar · Via Sant'Agnese 16, between Cadorna and the Cattolica",
      "h.titolo": "Eat. Drink. Relax.",
      "h.testo": "The bar with the green tables and the gilded chairs, a short walk from the Università Cattolica and Cadorna: a quick lunch, a spritz after the exam, graduation parties. Monday to Saturday; on Friday and Saturday until one in the morning.",
      "h.chi": "Andrea Zammataro, in a review on Google (in Italian: «Kind, friendly and welcoming»)",
      "h.google": "on Google, 126 reviews",
      "p.titolo": "The graduation wreath",
      "p.desc": "The glass served on the green table. Around it, two laurel branches grow from the bottom to the top and the leaves open in pairs; at the bottom the red graduation ribbon is tied; the garnish drops in, and the «BEVIMI» (drink me) tag swings on the stem, as on their old website. Three drinks from their menu: spritz, Hugo, Rossini.",
      "p.d0": "The spritz with a slice of orange: the one mentioned most in the reviews.",
      "p.d1": "The Hugo, with mint and lime.",
      "p.d2": "The Rossini, with a strawberry.",
      "p.modi": "Which drink",
      "p.nota": "We drew the wreath from their graduation party flyer, and the «BEVIMI» (drink me) tag from their old website; the three drinks come from their menu.",
      "c.mangiami": "Eat me",
      "c.bevimi": "Drink me",
      "c.rilassati": "Relax",
      "m2.titolo": "Lunch, between one lecture and the next",
      "m2.sotto": "From their menu, no frills: eat at the table or take it away.",
      "m2.panini": "Sandwiches",
      "m2.paniniT": "The MiMeta with mortadella and smoked provola; ham, prosciutto crudo, turkey, the chicken cutlet, the veal burger, the vegetarian one.",
      "m2.toastT": "The classic, tuna and basil pesto, smoked salmon and guacamole.",
      "m2.piadine": "Piadine and piadipizza",
      "m2.piadineT": "With cheese and vegetables: ham, mortadella, salami, prosciutto crudo, smoked salmon, vegetarian.",
      "m2.pizza": "Pizza by the slice and focaccia",
      "m2.pizzaT": "The margherita, the topped one; plain or filled focaccia.",
      "m2.insalate": "Salads",
      "m2.insalateT": "The MiMeta with salmon, the classic, the Mediterranean, the Caesar, the American.",
      "m2.primi": "Pasta",
      "m2.primiT": "Pasta with tomato sauce, lasagna, carbonara, soups.",
      "a.penne": "A plate of penne with grated cheese on the green table, the bread basket beside it.",
      "k.penne": "Lunch, in a customer's photo.",
      "m2.asporto": "«Discover our TAKE AWAY menu!»",
      "m2.a1": "pasta with water",
      "m2.a2": "a sandwich or a piadina with a soft drink",
      "m2.a3": "spritz and cocktails, from 10 am to 8 pm",
      "b2.titolo": "The spritz after the exam",
      "b2.sotto": "From the morning coffee to the evening aperitivo; on Friday and Saturday the night runs late.",
      "b2.spritzT": "And the Mimosa: the aperitivo classics.",
      "b2.cocktail": "Cocktails",
      "b2.cocktailT": "The MiMeta Drink, and on to the Espresso Martini, the Long Island, the Old Fashioned.",
      "b2.birra": "Beer and wine",
      "b2.birraT": "Draught beer, craft too; glasses of white, red and prosecco.",
      "b2.fresco": "Juices",
      "b2.frescoT": "Centrifuged and freshly squeezed; kombucha, soft drinks, coffee at the counter or at the table.",
      "a.spritz": "The spritz in a wine glass with a straw on the green table, crisps and the gilded chairs behind.",
      "a.margarita": "A print hanging in the room: the white drawing of a Margarita on a dark green background.",
      "a.pina": "Another print hanging in the room: the white drawing of a Piña Colada on a dark green background.",
      "k.bevi": "The spritz, in a customer's photo; and two of the cocktail prints hanging in the room.",
      "r2.titolo": "Green tables, gilded chairs",
      "r2.sotto": "The two arched niches, the white stone counter with its turquoise light, the globe lamps, the little lounge with the flowered armchairs, and the pictures on the walls.",
      "a.sala": "The room: the green tables, the gilded scroll chairs, the globe lamps, the two arched niches and the white stone counter with its warm light.",
      "k.sala": "The room, in one of their 2023 photos.",
      "a.bancone": "The white stone counter with its line of turquoise light, three stools and the arched niche with the bottles.",
      "k.bancone": "The counter and its turquoise light.",
      "a.insegna": "The petrol green MiMeta sign above the door, seen from the pavement of Via Sant'Agnese.",
      "k.insegna": "Via Sant'Agnese 16, in a customer's photo.",
      "a.tavolini": "The green tables and the gilded scroll chairs, the pictures on the walls and the three small cocktail prints.",
      "k.tavolini": "The tables, in one of their photos.",
      "a.salotto": "The little lounge: the flowered armchairs, the marble coffee table, the gilded console with the mirror and the purple lamp.",
      "k.salotto": "The little lounge, from their photos on TheFork.",
      "f.etichetta": "Graduation parties",
      "f.titolo": "For the most important milestone",
      "f.loro": "«MiMeta Italian Bar is pleased to host GRADUATION PARTIES — Write to us and book an aperitivo with friends to celebrate your most important milestone!»",
      "f.laurea": "The graduation party",
      "f.laureaT": "Sparkling wine, cocktails, crisps, piadina, pizza and nibbles, to celebrate together after the graduation.",
      "f.laureaL": "«Personalised quotes available»",
      "f.open": "The Open formulas",
      "f.openT": "Open Spritz with pizza, Open Drink, Open Gin, Open Wine: two hours, for at least 15 people. For a birthday, a graduation or just to party.",
      "f.openL": "«Organise your Open event and party with whoever you like!»",
      "f.nota": "The offers come from their 2026 flyers: what they include today, and for how many people, is up to them.",
      "d.etichetta": "Reviews",
      "d.titolo": "After the exam, on holiday, with the dog",
      "d.google": "on Google, 126 reviews",
      "d.g2a": "Google, 2 years ago",
      "d.g1m": "Google, a month ago",
      "d.g3a": "Google, 3 years ago",
      "d.nota": "From the reviews on Google, as they were written, in Italian, Spanish, French and English; cuts are marked […]. The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "On Friday and Saturday until one",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.una": "until 1 am",
      "o.chiuso": "Closed",
      "o.nota": "Hours from their Google listing (September 2026). On holidays and in summer they may change: it is best to write or call.",
      "o.mappa": "Map: MiMeta Italian Bar, Via Sant'Agnese 16, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Sant'Agnese 16, 20123 Milan, just behind the Università Cattolica",
      "o.metro": "By metro",
      "o.metrov": "M2 and M4 Sant'Ambrogio, about 350 metres away; M1 and M2 Cadorna, about 400",
      "o.tram": "By tram",
      "o.tramv": "16 and 19, Largo D'Ancona stop, about 200 metres away",
      "o.bus": "By bus",
      "o.busv": "50, Largo D'Ancona stop, about 120 metres away",
      "o.tel": "Phone",
      "o.prenota": "Booking",
      "o.prenotav": "On WhatsApp, by phone or on",
      "o.social": "Social",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.1": "Can I book?",
      "q.1r": "Yes: on WhatsApp at 351 359 1932, by phone at 02 8492 1805 or on TheFork.",
      "q.2": "Do you do take away?",
      "q.2r": "Yes, there is a take away menu: pasta, a sandwich or a piadina with a soft drink, and spritz and cocktails to go from 10 am to 8 pm.",
      "q.3": "Do you host graduation parties?",
      "q.3r": "Yes: graduation parties with personalised quotes, and the two-hour Open formulas for at least 15 people, for birthdays too. Message them on WhatsApp or call.",
      "q.4": "Can I bring my dog?",
      "q.4r": "Their old website had a «dog friendly» badge, and one customer says they put out a bowl of water for his dog. If in doubt, ask at the counter.",
      "q.5": "How late are you open?",
      "q.5r": "Monday to Thursday from 10 am to 8 pm; Friday from 10 am to 1 am and Saturday from 10:30 am to 1 am. Closed on Sunday.",
      "f2.orario": "Monday–Thursday 10 am–8 pm · Friday 10 am–1 am · Saturday 10:30 am–1 am · closed on Sunday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos of the room come from their photo shoot and from TheFork, the others from Google reviews; hours and reviews from their Google listing (September 2026), the menu from their old website and flyers. We drew the wreath with the glass ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ MIMETA ITALIAN BAR — Via Sant'Agnese 16 ══════════
     la FIRMA — «la corona di laurea»: il calice servito sul tavolino verde. Due rami d'alloro crescono dal basso fino in cima e le
     foglie spuntano a coppie, si annoda il nastro rosso, cade la guarnizione, sullo stelo oscilla il cartellino «BEVIMI». Lo stato è M
     (il bicchiere), T (0…1) e V (0 al suo posto; fino a 1 il calice esce a destra e la corona sfuma; da −1 a 0 arriva da destra il
     calice nuovo, senza corona). Senza JS e alla fine: spritz, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): il calice senza
     corona. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[80,14,480,416],"perno":{"x":323,"y":308},"via":460,"fasi":{"rami":{"t":0,"d":0.55},"fiocco":{"t":0.58,"d":0.12},"guarnizione":{"t":0.66,"d":0.14},"cartellino":{"t":0.74,"d":0.26}},"foglia":0.08,"foglie":[0.04,0.09,0.15,0.2,0.26,0.31,0.37,0.42,0.48,0.53],"tempi":{"inizio":300,"corona":4600,"servi":420,"arriva":460,"coronaV":3800},"bicchieri":[{"nome":"Spritz"},{"nome":"Hugo"},{"nome":"Rossini"}]};
  /* la corona di laurea a (M, T, V) — una sola fonte: la usa main.js (via mmt_main.cjs) e la prova (firma-prova.mjs).
     T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS .firma-attesa). */
  function creaCorona(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var corona = svg.querySelector('.corona'), rami = [].slice.call(svg.querySelectorAll('.ramo')), fiocco = svg.querySelector('.fiocco');
    var servito = svg.querySelector('.servito'), bevimi = svg.querySelector('.bevimi');
    var foglie = D.foglie.map(function (_, k) { return [].slice.call(svg.querySelectorAll('.foglia[data-k="' + k + '"]')); });
    var P = D.bicchieri.map(function (_, m) { return { guarn: svg.querySelector('.guarnizione[data-m="' + m + '"]') }; });
    function disegna(m, t, v) {
      var F = D.fasi, q = P[m];
      /* i rami crescono dal basso fino in cima; ogni coppia di foglie spunta quando il ramo la raggiunge */
      var r = fase(t, F.rami);
      rami.forEach(function (x) { x.setAttribute('stroke-dashoffset', String(r3(1 - r))); });
      foglie.forEach(function (gr, k) {
        var s = dolce(fase(t, { t: D.foglie[k], d: D.foglia }));
        gr.forEach(function (x) { x.setAttribute('transform', 'scale(' + r3(s) + ')'); });
      });
      /* il nastro rosso si annoda */
      fiocco.setAttribute('transform', 'scale(' + r3(dolce(fase(t, F.fiocco))) + ')');
      /* la guarnizione cade sul bordo */
      var g = fase(t, F.guarnizione);
      q.guarn.setAttribute('opacity', String(r3(Math.min(1, g * 3))));
      q.guarn.setAttribute('transform', 'translate(0 ' + r2(-70 * Math.pow(1 - dolce(g), 2)) + ')');
      /* il cartellino «BEVIMI» compare e oscilla fino a fermarsi */
      var c = fase(t, F.cartellino);
      bevimi.setAttribute('opacity', String(r3(Math.min(1, c * 4))));
      bevimi.setAttribute('transform', 'rotate(' + r2(24 * Math.pow(1 - c, 2) * Math.sin(5 * Math.PI * c)) + ' ' + D.perno.x + ' ' + D.perno.y + ')');
      /* col V il calice esce a destra e la corona sfuma; quello nuovo arriva da destra (la corona, a T = 0, non c'è ancora) */
      servito.setAttribute('transform', 'translate(' + r2(D.via * Math.abs(v)) + ' 0)');
      corona.setAttribute('opacity', String(v > 0 ? r3(1 - v) : 1));
    }
    var completo = !!corona && rami.length === 2 && !!fiocco && !!servito && !!bevimi && foglie.every(function (gr) { return gr.length === 4; }) && P.every(function (q) { return q.guarn; });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('corona-firma'), svgF = prendi('coronaSvg'), leggiF = prendi('coronaLeggi');
  var CORO = svgF ? creaCorona(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.coronata__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.coronata__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    CORO.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* i bicchieri nascosti tornano come nell'HTML (#257) */
    DATI.bicchieri.forEach(function (_, k) { if (k !== destinazioneF.m) CORO.disegna(k, 1, 0); });
    CORO.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta il calice senza corona */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il calice servito, senza corona */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.corona, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.corona });
  }
  /* il gesto: scegliere il bicchiere. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, il calice esce
     a destra e la corona sfuma, arriva il calice nuovo e la corona ricresce da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.coronaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && CORO && CORO.completo && BOTTONI.length === DATI.bicchieri.length) {
    try { clearTimeout(window.__attesaCorona); } catch (e) {}
    window.__corona = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__corona.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il calice servito, senza corona */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__corona.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
