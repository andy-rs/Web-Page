/* ==========================================================================
   Atom — Medición (GA4 + Microsoft Clarity + eventos de conversión)
   --------------------------------------------------------------------------
   PASO ÚNICO DE CONFIGURACIÓN: pega tus IDs abajo.

     GA4_ID      -> Google Analytics 4.  Formato: "G-XXXXXXXXXX"
                    Se obtiene en analytics.google.com → Administrar →
                    Flujos de datos → tu sitio web → "ID de medición".

     CLARITY_ID  -> Microsoft Clarity.   Formato: "abcdefghij"
                    Se obtiene en clarity.microsoft.com → Settings →
                    Setup → el código que aparece en clarity("...", "ID").

   Mientras estén vacíos, este archivo NO carga nada ni envía nada.
   El sitio funciona igual. Puedes desplegar sin miedo.
   ========================================================================== */

(function () {
  'use strict';

  var GA4_ID     = 'G-K9XE9TWLQ3';
  var CLARITY_ID = 'ycavphsjrl';

  /* ---------------------------------------------------------------- GA4 --- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var gaReady = /^G-[A-Z0-9]+$/i.test(GA4_ID);

  if (gaReady) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(g);

    gtag('js', new Date());
    gtag('config', GA4_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }

  /* ------------------------------------------------------------ Clarity --- */
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  /* --------------------------------------------------- Emisor de eventos --- */
  /* Un único punto de salida: si mañana cambias de herramienta, tocas
     solo esta función. En consola queda el rastro cuando no hay GA4. */
  function track(name, params) {
    params = params || {};
    params.page_path = location.pathname;
    if (gaReady) {
      gtag('event', name, params);
    } else if (window.console && console.debug) {
      console.debug('[atom-analytics]', name, params);
    }
    if (window.clarity) {
      try { window.clarity('event', name); } catch (e) {}
    }
  }
  window.atomTrack = track;

  /* Etiqueta legible de dónde se hizo clic, para distinguir el FAB del
     botón del hero o del footer sin tener que instrumentar uno por uno. */
  function whereIs(el) {
    if (el.closest('.wa-fab'))        return 'boton_flotante';
    if (el.closest('.site-header'))   return 'cabecera';
    if (el.closest('.site-footer') ||
        el.closest('footer'))         return 'pie';
    if (el.closest('.hero'))          return 'hero';
    if (el.closest('form'))           return 'formulario';
    return 'cuerpo';
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* --- 1. click_whatsapp ------------------------------------------- */
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href*="wa.me"]');
      if (a) {
        track('click_whatsapp', {
          ubicacion: whereIs(a),
          texto: (a.textContent || '').trim().slice(0, 60) || 'icono'
        });
        return;
      }
      var m = ev.target.closest && ev.target.closest('a[href^="mailto:"]');
      if (m) {
        track('click_email', { ubicacion: whereIs(m) });
      }
    }, true);

    /* --- 2. form_submit ---------------------------------------------- */
    var form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function () {
        track('form_submit', { via: 'whatsapp', perfil: form.perfil ? form.perfil.value : '' });
      });
      var mailBtn = document.getElementById('send-mail');
      if (mailBtn) {
        mailBtn.addEventListener('click', function () {
          track('form_submit', { via: 'correo', perfil: form.perfil ? form.perfil.value : '' });
        });
      }
    }

    /* --- 3. view_programas ------------------------------------------- */
    if (/programas\.html$/.test(location.pathname)) {
      track('view_programas', {});
    }

    /* --- 4. scroll_90 ------------------------------------------------- */
    var fired = false;
    function onScroll() {
      if (fired) return;
      var doc = document.documentElement;
      var alcance = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (alcance >= 0.9) {
        fired = true;
        track('scroll_90', {});
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();
