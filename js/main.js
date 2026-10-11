// Sprachumschalter und Cookie-Einwilligung für Google Analytics.
(function () {
  var GA_ID = 'G-P2SQ5C42JD';
  var LANGS = ['de', 'en', 'it'];

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* privater Modus */ }
  }

  // --- Sprache ---
  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      var on = b.getAttribute('data-set-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
  }

  var browserLang = (navigator.language || 'de').slice(0, 2);
  var lang = load('lang') || (LANGS.indexOf(browserLang) >= 0 ? browserLang : 'de');
  setLang(lang);

  // --- Google Analytics nur nach Zustimmung ---
  function startAnalytics() {
    if (window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  var banner = document.querySelector('.cookie');
  var consent = load('consent');
  if (consent === 'yes') startAnalytics();
  if (!consent && banner) banner.hidden = false;

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set-lang]');
    if (b) {
      setLang(b.getAttribute('data-set-lang'));
      save('lang', b.getAttribute('data-set-lang'));
    }
    var c = e.target.closest('[data-consent]');
    if (c) {
      var value = c.getAttribute('data-consent');
      save('consent', value);
      banner.hidden = true;
      if (value === 'yes') startAnalytics();
      else if (window.gtag) location.reload(); // Widerruf: Analytics wieder entladen
    }
    if (e.target.closest('[data-cookie-settings]')) banner.hidden = false;

    // Handy-Menü öffnen/schließen; ein Klick auf einen Menüpunkt schließt es
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu');
    if (toggle && menu) {
      var open = !!e.target.closest('.menu-toggle') && !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    }
  });
})();
