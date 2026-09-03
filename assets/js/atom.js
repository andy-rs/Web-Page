/* ==========================================================================
   ATOM — Interacciones
   Vanilla JS, sin dependencias. Respeta prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ----------------------------------------------------------------------
     1. Header pegajoso + barra de progreso de lectura
     ---------------------------------------------------------------------- */
  var header = $('.site-header');
  var progress = $('.progress-bar');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 12);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    var fab = $('.wa-fab');
    if (fab) fab.classList.toggle('is-visible', y > 500);

    ticking = false;
  }

  on(window, 'scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     2. Menú móvil
     ---------------------------------------------------------------------- */
  var toggle = $('.nav__toggle');
  var links = $('.nav__links');
  var backdrop = $('.nav__backdrop');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  on(toggle, 'click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  on(backdrop, 'click', function () { setMenu(false); });
  $$('.nav__links a').forEach(function (a) { on(a, 'click', function () { setMenu(false); }); });
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      if (toggle) toggle.focus();
    }
  });
  // Índices para el escalonado de la animación del menú
  $$('.nav__links li').forEach(function (li, i) { li.style.setProperty('--i', i); });

  /* ----------------------------------------------------------------------
     3. Revelado al hacer scroll
     ---------------------------------------------------------------------- */
  var revealables = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  // Escalonado automático dentro de grupos
  $$('[data-reveal-group]').forEach(function (group) {
    $$('[data-reveal]', group).forEach(function (el, i) {
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 8);
    });
  });

  /* ----------------------------------------------------------------------
     4. Contadores animados
     ---------------------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    var start = null;
    var dur = 1500;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ----------------------------------------------------------------------
     5. Acordeón FAQ (accesible)
     ---------------------------------------------------------------------- */
  $$('.faq__item').forEach(function (item) {
    var btn = $('.faq__q', item);
    var panel = $('.faq__a', item);
    if (!btn || !panel) return;

    on(btn, 'click', function () {
      var isOpen = item.classList.contains('is-open');
      // Cierra las demás del mismo grupo
      var group = item.closest('.faq');
      if (group) {
        $$('.faq__item.is-open', group).forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var ob = $('.faq__q', other);
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  /* ----------------------------------------------------------------------
     6. Carrusel de testimonios
     ---------------------------------------------------------------------- */
  $$('.testimonials').forEach(function (root) {
    var track = $('.tm-track', root);
    if (!track) return;
    var prev = $('[data-tm="prev"]', root);
    var next = $('[data-tm="next"]', root);

    function step(dir) {
      var card = $('.tm-card', track);
      var amount = card ? card.getBoundingClientRect().width + 21 : track.clientWidth * 0.8;
      track.scrollBy({ left: dir * amount, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    on(prev, 'click', function () { step(-1); });
    on(next, 'click', function () { step(1); });

    // Si todas las tarjetas caben en pantalla, las flechas no aportan nada.
    var nav = $('.tm-nav', root);
    function syncNav() {
      if (!nav) return;
      var card = $('.tm-card', track);
      // Solo tiene sentido navegar si queda oculta al menos media tarjeta.
      var threshold = card ? card.getBoundingClientRect().width / 2 : 40;
      nav.hidden = (track.scrollWidth - track.clientWidth) < threshold;
    }
    syncNav();
    on(window, 'resize', syncNav);
  });

  /* ----------------------------------------------------------------------
     7. Formulario de contacto -> WhatsApp / correo
        (el sitio es estático: no hay backend, así que el formulario
         compone un mensaje y lo abre en WhatsApp o en el correo)
     ---------------------------------------------------------------------- */
  var form = $('#contact-form');
  if (form) {
    var status = $('#form-status');

    function buildMessage(data) {
      var lines = [
        'Hola Atom, quiero más información.',
        '',
        'Nombre: ' + data.nombre,
        'Correo: ' + data.correo,
        'Perfil: ' + data.perfil,
        'Objetivo: ' + (data.objetivo || 'No especificado'),
        '',
        'Mensaje:',
        data.mensaje || '(sin mensaje adicional)'
      ];
      return lines.join('\n');
    }

    function collect() {
      return {
        nombre: (form.nombre.value || '').trim(),
        correo: (form.correo.value || '').trim(),
        perfil: form.perfil.value,
        objetivo: (form.objetivo.value || '').trim(),
        mensaje: (form.mensaje.value || '').trim()
      };
    }

    function validate(data) {
      if (!data.nombre) return 'Escribe tu nombre para continuar.';
      if (!data.correo || data.correo.indexOf('@') === -1) return 'Escribe un correo válido.';
      if (!data.perfil) return 'Cuéntanos en qué etapa estás.';
      return null;
    }

    function say(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = kind === 'error' ? '#B4232A' : 'var(--gold-700)';
    }

    /* Registra el lead antes de redirigir. Si la persona no llega a pulsar
       "enviar" dentro de WhatsApp, el contacto igual queda guardado.
       El endpoint se configura en data-lead-endpoint del formulario;
       vacío = desactivado y el formulario se comporta como siempre. */
    function saveLead(data, via) {
      var endpoint = form.getAttribute('data-lead-endpoint');
      if (!endpoint || !window.fetch) return;
      try {
        fetch(endpoint, {
          method: 'POST',
          keepalive: true,   /* sobrevive a la navegación a WhatsApp/correo */
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            nombre: data.nombre,
            correo: data.correo,
            perfil: data.perfil,
            objetivo: data.objetivo || '(no indicado)',
            mensaje: data.mensaje || '(sin mensaje adicional)',
            via: via,
            pagina: location.href,
            enviado: new Date().toISOString()
          })
        })['catch'](function () { /* nunca bloquea el flujo del usuario */ });
      } catch (e) {}
    }

    on(form, 'submit', function (e) {
      e.preventDefault();
      var data = collect();
      var error = validate(data);
      if (error) { say(error, 'error'); return; }

      saveLead(data, 'whatsapp');
      var wa = form.getAttribute('data-whatsapp');
      var url = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(buildMessage(data));
      say('Abriendo WhatsApp con tu mensaje listo para enviar…', 'ok');
      window.open(url, '_blank', 'noopener');
    });

    var mailBtn = $('#send-mail');
    on(mailBtn, 'click', function () {
      var data = collect();
      var error = validate(data);
      if (error) { say(error, 'error'); return; }
      saveLead(data, 'correo');
      var to = form.getAttribute('data-email');
      var subject = 'Consulta desde la web — ' + data.nombre;
      say('Abriendo tu cliente de correo…', 'ok');
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(buildMessage(data));
    });
  }

  /* ----------------------------------------------------------------------
     8. Imágenes ausentes -> se muestra el respaldo elegante
     ---------------------------------------------------------------------- */
  $$('img[data-fallback]').forEach(function (img) {
    function fail() {
      img.style.display = 'none';
      var fb = document.getElementById(img.getAttribute('data-fallback'));
      if (fb) fb.hidden = false;
    }
    on(img, 'error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ----------------------------------------------------------------------
     9. Año actual en el pie
     ---------------------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ----------------------------------------------------------------------
     10. Duplicado del marquee para un bucle continuo
     ---------------------------------------------------------------------- */
  $$('.marquee').forEach(function (m) {
    var track = $('.marquee__track', m);
    if (!track || track.dataset.cloned) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.dataset.cloned = '1';
    track.dataset.cloned = '1';
    m.appendChild(clone);
  });
})();
