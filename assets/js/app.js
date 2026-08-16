/* ==========================================================================
   TERRAL — Lógica de la tienda
   Sin dependencias. Vanilla ES5+ para que funcione abriendo los HTML directo.
   ========================================================================== */

(function () {
  'use strict';

  var T   = window.TERRAL;
  var CFG = T.config;
  var $   = function (s, c) { return (c || document).querySelector(s); };
  var $$  = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Utilidades ---------------- */
  function money(n) {
    return CFG.currency + ' ' + n.toFixed(2);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function byId(id) {
    for (var i = 0; i < T.products.length; i++) { if (T.products[i].id === id) return T.products[i]; }
    return null;
  }
  function originOf(p) {
    for (var i = 0; i < T.origins.length; i++) { if (T.origins[i].id === p.origin) return T.origins[i]; }
    return null;
  }

  /* ---------------- Carrito (persistente) ---------------- */
  var KEY = 'terral.cart.v1';
  var cart = [];

  try {
    var raw = localStorage.getItem(KEY);
    if (raw) cart = JSON.parse(raw) || [];
  } catch (e) { cart = []; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function count() {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  }
  function subtotal() {
    return cart.reduce(function (n, l) {
      var p = byId(l.id);
      return n + (p ? p.price * l.qty : 0);
    }, 0);
  }
  function add(id, qty) {
    qty = qty || 1;
    var line = null;
    for (var i = 0; i < cart.length; i++) { if (cart[i].id === id) line = cart[i]; }
    if (line) line.qty += qty; else cart.push({ id: id, qty: qty });
    save(); renderCart();
    var p = byId(id);
    toast((p ? p.name : 'Producto') + ' · añadido al pedido');
  }
  function setQty(id, qty) {
    cart = cart.filter(function (l) {
      if (l.id !== id) return true;
      l.qty = qty;
      return qty > 0;
    });
    save(); renderCart();
  }
  function remove(id) {
    cart = cart.filter(function (l) { return l.id !== id; });
    save(); renderCart();
  }

  /* ---------------- Aviso flotante ---------------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>' + esc(msg) + '</span>';
    requestAnimationFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------------- Chasis: cabecera, menú, cajón ---------------- */
  function buildChrome() {
    var page = document.body.dataset.page || '';
    var nav = [
      { href: 'tienda.html',    label: 'Tienda',    key: 'tienda' },
      { href: 'origenes.html',  label: 'Orígenes',  key: 'origenes' },
      { href: 'nosotros.html',  label: 'Nosotros',  key: 'nosotros' },
      { href: 'mayoristas.html',label: 'Mayoristas',key: 'mayoristas' },
      { href: 'contacto.html',  label: 'Contacto',  key: 'contacto' }
    ];
    function links(items) {
      return items.map(function (i) {
        return '<a href="' + i.href + '"' + (page === i.key ? ' aria-current="page"' : '') + '>' + i.label + '</a>';
      }).join('');
    }
    var mark =
      '<a class="brandmark" href="index.html" aria-label="Terral, inicio">' +
        '<span class="brandmark__seal">' + T.seal('var(--clay)') + '</span>' +
        '<span class="brandmark__txt">' +
          '<span class="brandmark__name">TERRAL</span>' +
          '<span class="brandmark__sub">Cacao de origen · Lima</span>' +
        '</span>' +
      '</a>';

    /* Barra de anuncio */
    var ticker = document.createElement('div');
    ticker.className = 'ticker';
    ticker.innerHTML = '<span>Despacho el mismo día en Lima<i>◆</i>Envío gratis desde ' + money(CFG.freeShippingFrom) +
                       '<i>◆</i>Compra directa a ocho asociaciones de productores</span>';

    /* Cabecera */
    var hdr = document.createElement('header');
    hdr.className = 'hdr';
    hdr.innerHTML =
      '<div class="wrap hdr__in">' +
        '<nav class="hdr__nav hdr__nav--left">' + links(nav.slice(0, 3)) + '</nav>' +
        '<button class="icon-btn burger" id="jsBurger" aria-label="Abrir menú">' +
          '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" stroke-linecap="round"/></svg>' +
        '</button>' +
        mark +
        '<nav class="hdr__nav hdr__nav--right">' +
          '<span class="hdr__only-wide">' + links(nav.slice(3)) + '</span>' +
          '<button class="icon-btn" id="jsCartBtn" aria-label="Ver pedido">' +
            '<svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
            '<span class="cart-count" id="jsCartCount">0</span>' +
          '</button>' +
        '</nav>' +
      '</div>';

    /* Menú móvil */
    var mnav = document.createElement('div');
    mnav.className = 'mnav';
    mnav.id = 'jsMnav';
    mnav.innerHTML =
      '<div class="mnav__top">' +
        '<span class="brandmark__txt"><span class="brandmark__name">TERRAL</span></span>' +
        '<button class="icon-btn" id="jsMnavClose" aria-label="Cerrar menú">' +
          '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</div>' +
      '<nav class="mnav__links">' +
        nav.map(function (i, k) {
          return '<a href="' + i.href + '">' + i.label + '<span>0' + (k + 1) + '</span></a>';
        }).join('') +
      '</nav>' +
      '<div class="mnav__foot">' + esc(CFG.address) + '<br>' + esc(CFG.hours) + '</div>';

    /* Cajón de pedido */
    var scrim = document.createElement('div');
    scrim.className = 'scrim'; scrim.id = 'jsScrim';

    var drawer = document.createElement('aside');
    drawer.className = 'drawer'; drawer.id = 'jsDrawer';
    drawer.setAttribute('aria-label', 'Tu pedido');
    drawer.innerHTML =
      '<div class="drawer__head">' +
        '<h3>Tu pedido</h3>' +
        '<button class="icon-btn" id="jsDrawerClose" aria-label="Cerrar pedido">' +
          '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="drawer__body" id="jsCartBody"></div>' +
      '<div class="drawer__foot" id="jsCartFoot"></div>';

    document.body.insertBefore(drawer, document.body.firstChild);
    document.body.insertBefore(scrim, document.body.firstChild);
    document.body.insertBefore(mnav, document.body.firstChild);
    document.body.insertBefore(hdr, document.body.firstChild);
    document.body.insertBefore(ticker, document.body.firstChild);

    /* Pie */
    var ftr = document.createElement('footer');
    ftr.className = 'ftr';
    ftr.innerHTML =
      '<div class="wrap">' +
        '<div class="ftr__top">' +
          '<div class="ftr__brand">' +
            '<span class="brandmark__txt"><span class="brandmark__name">TERRAL</span>' +
            '<span class="brandmark__sub">Cacao de origen · Lima</span></span>' +
            '<p>Compramos chocolate a productores de ocho regiones del Perú y lo traemos a Lima sin intermediarios de por medio.</p>' +
            '<div class="socials">' +
              '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2Z"/></svg></a>' +
              '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A21 21 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8Z"/></svg></a>' +
              '<a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M16.5 3h-2.9v12.1a2.6 2.6 0 1 1-2-2.53V9.6a5.6 5.6 0 1 0 5 5.57V9.4a6.6 6.6 0 0 0 3.8 1.2V7.6a3.8 3.8 0 0 1-3.9-4.6Z"/></svg></a>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h4>Tienda</h4>' +
            '<ul>' +
              '<li><a href="tienda.html?cat=tabletas">Tabletas de origen</a></li>' +
              '<li><a href="tienda.html?cat=bombones">Bombonería</a></li>' +
              '<li><a href="tienda.html?cat=untables">Untables y pastas</a></li>' +
              '<li><a href="tienda.html?cat=derivados">Nibs y derivados</a></li>' +
              '<li><a href="tienda.html?cat=cafe">Café de origen</a></li>' +
              '<li><a href="tienda.html?cat=cajas">Cajas de regalo</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Casa</h4>' +
            '<ul>' +
              '<li><a href="nosotros.html">Nosotros</a></li>' +
              '<li><a href="origenes.html">Orígenes</a></li>' +
              '<li><a href="mayoristas.html">Mayoristas</a></li>' +
              '<li><a href="contacto.html">Contacto</a></li>' +
              '<li><a href="legal.html#envios">Envíos y cambios</a></li>' +
              '<li><a href="legal.html#faq">Preguntas frecuentes</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Visítanos</h4>' +
            '<ul>' +
              '<li>' + esc(CFG.address) + '</li>' +
              '<li>' + esc(CFG.hours) + '</li>' +
              '<li><a href="https://wa.me/' + CFG.whatsapp + '">WhatsApp +51 900 000 000</a></li>' +
              '<li><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></li>' +
            '</ul>' +
            '<div style="margin-top:22px">' +
              '<a class="book" href="legal.html#reclamaciones">' +
                '<svg viewBox="0 0 40 26"><rect x=".5" y=".5" width="39" height="25" rx="2" fill="none" stroke="currentColor"/><path d="M8 8h24M8 13h24M8 18h14" stroke="currentColor" stroke-width="1.4"/></svg>' +
                'Libro de reclamaciones' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ftr__bot">' +
          '<span>© ' + new Date().getFullYear() + ' ' + esc(CFG.legalName) + ' · RUC ' + esc(CFG.ruc) + ' · Lima, Perú</span>' +
          '<div class="pays"><span>Visa</span><span>Mastercard</span><span>Yape</span><span>Plin</span><span>Transferencia</span><span>Contra entrega</span></div>' +
          '<span><a href="legal.html#terminos">Términos</a> · <a href="legal.html#privacidad">Privacidad</a></span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ftr);

    /* Botón WhatsApp */
    var wa = document.createElement('a');
    wa.className = 'wa';
    wa.href = 'https://wa.me/' + CFG.whatsapp;
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Escríbenos por WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.85c0 1.9.5 3.7 1.45 5.3L2 22.5l5.5-1.6a9.8 9.8 0 0 0 4.55 1.14h.01c5.44 0 9.85-4.4 9.85-9.85C21.9 6.4 17.5 2 12.04 2Zm5.75 13.9c-.24.68-1.4 1.3-1.94 1.34-.5.05-.98.23-3.3-.7-2.78-1.1-4.54-3.95-4.68-4.13-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.25-.27.54-.34.72-.34l.52.01c.17 0 .4-.06.62.48l.85 2.06c.07.15.12.32.02.5l-.3.46-.44.48c-.14.14-.29.3-.12.58.16.28.73 1.2 1.56 1.95 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.6-.07l.87-1.01c.2-.24.37-.19.62-.1l1.77.84c.25.12.42.18.48.28.06.1.06.6-.18 1.18Z"/></svg>';
    document.body.appendChild(wa);

    /* Eventos */
    $('#jsBurger').addEventListener('click', function () { mnav.classList.add('is-open'); document.body.classList.add('no-scroll'); });
    $('#jsMnavClose').addEventListener('click', function () { mnav.classList.remove('is-open'); document.body.classList.remove('no-scroll'); });
    $('#jsCartBtn').addEventListener('click', openCart);
    $('#jsDrawerClose').addEventListener('click', closeCart);
    scrim.addEventListener('click', closeCart);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeCart();
        mnav.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      }
    });
    window.addEventListener('scroll', function () {
      hdr.classList.toggle('is-stuck', window.scrollY > 8);
    }, { passive: true });
  }

  function openCart() {
    $('#jsDrawer').classList.add('is-open');
    $('#jsScrim').classList.add('is-on');
    document.body.classList.add('no-scroll');
  }
  function closeCart() {
    var d = $('#jsDrawer'); if (!d) return;
    d.classList.remove('is-open');
    $('#jsScrim').classList.remove('is-on');
    document.body.classList.remove('no-scroll');
  }

  /* ---------------- Pintado del carrito ---------------- */
  function renderCart() {
    var badge = $('#jsCartCount');
    var body  = $('#jsCartBody');
    var foot  = $('#jsCartFoot');
    if (!badge) return;

    var n = count();
    badge.textContent = n;
    badge.classList.toggle('is-on', n > 0);

    if (!cart.length) {
      body.innerHTML =
        '<div class="empty">' +
          '<h4>Aún no hay nada aquí</h4>' +
          '<p>Empiece por una tableta de origen. Si duda, la de Chachapoyas 70 % es por donde entra casi todo el mundo.</p>' +
          '<a class="btn btn--ghost btn--sm" href="tienda.html" style="margin-top:18px">Ver el catálogo</a>' +
        '</div>';
      foot.innerHTML = '';
      return;
    }

    body.innerHTML = cart.map(function (l) {
      var p = byId(l.id); if (!p) return '';
      var o = originOf(p);
      return '' +
        '<div class="citem">' +
          '<a class="citem__media" href="producto.html?id=' + encodeURIComponent(p.id) + '">' + T.artFor(p, { label: false }) + '</a>' +
          '<div>' +
            '<a class="citem__name" href="producto.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a>' +
            '<div class="citem__meta">' + esc(o ? o.name : '') + ' · ' + esc(p.weight) + '</div>' +
            '<div class="citem__row">' +
              '<span class="qty">' +
                '<button data-dec="' + p.id + '" aria-label="Quitar uno">–</button>' +
                '<span>' + l.qty + '</span>' +
                '<button data-inc="' + p.id + '" aria-label="Añadir uno">+</button>' +
              '</span>' +
              '<span class="citem__price">' + money(p.price * l.qty) + '</span>' +
            '</div>' +
            '<button class="citem__rm" data-rm="' + p.id + '" style="margin-top:10px">Quitar</button>' +
          '</div>' +
        '</div>';
    }).join('');

    var sub = subtotal();
    var falta = Math.max(0, CFG.freeShippingFrom - sub);
    var pct = Math.min(100, (sub / CFG.freeShippingFrom) * 100);
    var ship = sub >= CFG.freeShippingFrom ? 0 : CFG.limaShipping;

    foot.innerHTML =
      (falta > 0
        ? '<div class="sumline"><span>Le faltan <b>' + money(falta) + '</b> para el envío gratis en Lima</span></div>'
        : '<div class="sumline"><span>Envío gratis en Lima aplicado</span><span>✓</span></div>') +
      '<div class="freebar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="sumline"><span>Subtotal</span><span>' + money(sub) + '</span></div>' +
      '<div class="sumline"><span>Envío estimado (Lima)</span><span>' + (ship ? money(ship) : 'Gratis') + '</span></div>' +
      '<div class="sumline sumline--total"><span>Total</span><b>' + money(sub + ship) + '</b></div>' +
      '<a class="btn btn--block" id="jsWaOrder" href="' + waLink() + '" target="_blank" rel="noopener" style="margin-top:16px">Cerrar pedido por WhatsApp</a>' +
      '<p class="form__note" style="margin-top:12px;text-align:center">También puede pagar con tarjeta, Yape o transferencia. Le enviamos el enlace al confirmar.</p>';

    $$('[data-inc]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.inc, line = cart.filter(function (l) { return l.id === id; })[0];
        setQty(id, line.qty + 1);
      });
    });
    $$('[data-dec]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.dec, line = cart.filter(function (l) { return l.id === id; })[0];
        setQty(id, line.qty - 1);
      });
    });
    $$('[data-rm]', body).forEach(function (b) {
      b.addEventListener('click', function () { remove(b.dataset.rm); });
    });
  }

  function waLink() {
    var lines = cart.map(function (l) {
      var p = byId(l.id); if (!p) return '';
      return '• ' + l.qty + ' × ' + p.name + ' (' + p.weight + ') — ' + money(p.price * l.qty);
    }).filter(Boolean);
    var msg = 'Hola Terral, quisiera hacer este pedido:\n\n' + lines.join('\n') +
              '\n\nSubtotal: ' + money(subtotal()) +
              '\n\nMi nombre es: \nDirección de entrega: \nDistrito: ';
    return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  /* ---------------- Tarjeta de producto ---------------- */
  function cardHTML(p) {
    var o = originOf(p);
    var tagCls = p.tag && /limitada|Solo|raro|Micro/i.test(p.tag) ? 'pcard__tag--clay'
               : p.tag && /bosque|palma/i.test(p.tag) ? 'pcard__tag--olive' : '';
    return '' +
      '<article class="pcard rv">' +
        '<div class="pcard__media">' +
          '<a href="producto.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + esc(p.name) + '">' + T.artFor(p) + '</a>' +
          (p.tag ? '<span class="pcard__tag ' + tagCls + '">' + esc(p.tag) + '</span>' : '') +
          '<div class="pcard__quick"><button class="btn btn--sm btn--block" data-add="' + p.id + '">Añadir · ' + money(p.price) + '</button></div>' +
        '</div>' +
        '<div class="pcard__body">' +
          '<span class="pcard__origin">' + esc(o ? o.name + ', ' + o.region : 'Perú') + '</span>' +
          '<a class="pcard__name" href="producto.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a>' +
          '<p class="pcard__notes">' + esc(p.notes) + '</p>' +
          '<div class="pcard__foot">' +
            '<span class="pcard__price">' + money(p.price) + '</span>' +
            '<span class="pcard__unit">' + esc(p.weight) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function wireAdds(scope) {
    $$('[data-add]', scope || document).forEach(function (b) {
      if (b.dataset.wired) return;
      b.dataset.wired = '1';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        add(b.dataset.add, parseInt(b.dataset.qty || '1', 10));
      });
    });
  }

  /* ---------------- Rejilla del catálogo ---------------- */
  function initShop() {
    var grid = $('#jsGrid'); if (!grid) return;
    var chipsBox = $('#jsChips'), sortSel = $('#jsSort'), originSel = $('#jsOrigin'), countEl = $('#jsCount');

    var params = new URLSearchParams(location.search);
    var state = {
      cat: params.get('cat') || 'todos',
      origin: params.get('origen') || 'todos',
      sort: 'destacados'
    };

    chipsBox.innerHTML = T.categories.map(function (c) {
      return '<button class="chip' + (c.id === state.cat ? ' is-on' : '') + '" data-cat="' + c.id + '">' + esc(c.label) + '</button>';
    }).join('');

    originSel.innerHTML = '<option value="todos">Todos los orígenes</option>' +
      T.origins.map(function (o) {
        return '<option value="' + o.id + '"' + (o.id === state.origin ? ' selected' : '') + '>' + esc(o.name + ' · ' + o.region) + '</option>';
      }).join('');

    function draw() {
      var list = T.products.filter(function (p) {
        return (state.cat === 'todos' || p.cat === state.cat) &&
               (state.origin === 'todos' || p.origin === state.origin);
      });
      if (state.sort === 'precio-asc')  list.sort(function (a, b) { return a.price - b.price; });
      if (state.sort === 'precio-desc') list.sort(function (a, b) { return b.price - a.price; });
      if (state.sort === 'intensidad')  list.sort(function (a, b) { return b.cacao - a.cacao; });
      if (state.sort === 'nombre')      list.sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });

      countEl.textContent = list.length + (list.length === 1 ? ' producto' : ' productos');
      grid.innerHTML = list.length
        ? list.map(cardHTML).join('')
        : '<div class="empty" style="grid-column:1/-1"><h4>Nada por aquí todavía</h4><p>Pruebe con otro origen o vuelva a “Todo”.</p></div>';
      wireAdds(grid);
      observe(grid);

      var url = new URL(location.href);
      state.cat === 'todos' ? url.searchParams.delete('cat') : url.searchParams.set('cat', state.cat);
      state.origin === 'todos' ? url.searchParams.delete('origen') : url.searchParams.set('origen', state.origin);
      history.replaceState(null, '', url);
    }

    chipsBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]'); if (!b) return;
      state.cat = b.dataset.cat;
      $$('.chip', chipsBox).forEach(function (c) { c.classList.toggle('is-on', c === b); });
      draw();
    });
    originSel.addEventListener('change', function () { state.origin = originSel.value; draw(); });
    sortSel.addEventListener('change', function () { state.sort = sortSel.value; draw(); });

    draw();
  }

  /* ---------------- Rejillas destacadas (inicio) ---------------- */
  function initFeatured() {
    $$('[data-feature]').forEach(function (el) {
      var ids = el.dataset.feature.split(',');
      el.innerHTML = ids.map(function (id) {
        var p = byId(id.trim());
        return p ? cardHTML(p) : '';
      }).join('');
      wireAdds(el);
    });
  }

  /* ---------------- Ficha de producto ---------------- */
  function initPDP() {
    var root = $('#jsPDP'); if (!root) return;
    var id = new URLSearchParams(location.search).get('id');
    var p = id ? byId(id) : null;
    if (!p) p = T.products[0];
    var o = originOf(p);

    document.title = p.name + ' · Terral';
    var crumb = $('#jsCrumb');
    if (crumb) crumb.innerHTML = '<a href="tienda.html">Tienda</a> <span class="muted">/</span> ' +
      '<a href="tienda.html?cat=' + p.cat + '">' + esc((T.categories.filter(function (c) { return c.id === p.cat; })[0] || {}).label || '') + '</a> ' +
      '<span class="muted">/ ' + esc(p.name) + '</span>';

    var prof = p.profile || {};
    var meter = ['acidez', 'amargor', 'fruta', 'tostado'].map(function (k) {
      return '<div class="meter__row"><span class="meter__lbl">' + k + '</span>' +
             '<span class="meter__bar"><i style="width:' + (prof[k] || 0) + '%"></i></span></div>';
    }).join('');

    root.innerHTML =
      '<div class="pdp__media">' +
        '<div class="pdp__hero">' + T.artFor(p) + '</div>' +
        '<div class="pdp__thumbs">' +
          '<div>' + T.artFor(p, { label: false }) + '</div>' +
          '<div>' + T.artFor(p) + '</div>' +
          '<div>' + T.artFor(p, { label: false }) + '</div>' +
          '<div>' + T.artFor(p) + '</div>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<p class="eyebrow">' + esc(o ? o.name + ' · ' + o.region : 'Perú') + '</p>' +
        '<h1 style="font-size:clamp(2rem,3.6vw,3rem)">' + esc(p.name) + '</h1>' +
        '<p class="lead" style="margin-top:18px">' + esc(p.desc) + '</p>' +
        '<p class="pdp__price" style="margin-top:26px">' + money(p.price) + ' <span style="font-family:var(--sans);font-size:.8rem;color:var(--text-soft)">· ' + esc(p.weight) + '</span></p>' +
        '<div class="pdp__buy">' +
          '<span class="qty"><button id="jsQtyDec" aria-label="Menos">–</button><span id="jsQty">1</span><button id="jsQtyInc" aria-label="Más">+</button></span>' +
          '<button class="btn" style="flex:1" id="jsPdpAdd">Añadir al pedido</button>' +
        '</div>' +
        '<p class="form__note">Despacho el mismo día en Lima si compra antes de la 1:00 p. m. · Envío gratis desde ' + money(CFG.freeShippingFrom) + '</p>' +
        '<div style="margin-top:34px">' +
          '<p class="eyebrow eyebrow--plain" style="margin-bottom:14px">Notas de cata</p>' +
          '<div class="wheel">' + p.notes.split('·').map(function (n) { return '<span>' + esc(n.trim()) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div style="margin-top:30px">' +
          '<p class="eyebrow eyebrow--plain" style="margin-bottom:14px">Perfil</p>' +
          '<div class="meter">' + meter + '</div>' +
        '</div>' +
        '<dl class="specs">' +
          '<div><dt>Origen</dt><dd>' + esc(o ? o.name + ', ' + o.region : '—') + '</dd></div>' +
          '<div><dt>Productor</dt><dd>' + esc(o ? o.producer : '—') + '</dd></div>' +
          '<div><dt>Altitud</dt><dd>' + esc(o ? o.altitude : '—') + '</dd></div>' +
          '<div><dt>Variedad</dt><dd>' + esc(o ? o.variety : '—') + '</dd></div>' +
          (p.cacao ? '<div><dt>Cacao</dt><dd>' + p.cacao + ' %</dd></div>' : '') +
          '<div><dt>Contenido</dt><dd>' + esc(p.weight) + '</dd></div>' +
          '<div><dt>Ingredientes</dt><dd>' + esc(p.ingredients) + '</dd></div>' +
          '<div><dt>Conservación</dt><dd>Lugar seco entre 16 y 20 °C, lejos de olores fuertes. No refrigerar.</dd></div>' +
        '</dl>' +
      '</div>';

    var qty = 1;
    $('#jsQtyInc').addEventListener('click', function () { qty++; $('#jsQty').textContent = qty; });
    $('#jsQtyDec').addEventListener('click', function () { if (qty > 1) { qty--; $('#jsQty').textContent = qty; } });
    $('#jsPdpAdd').addEventListener('click', function () { add(p.id, qty); openCart(); });

    /* Relacionados: mismo origen primero, luego misma categoría */
    var rel = T.products.filter(function (x) { return x.id !== p.id && x.origin === p.origin; })
      .concat(T.products.filter(function (x) { return x.id !== p.id && x.cat === p.cat && x.origin !== p.origin; }))
      .slice(0, 4);
    var relBox = $('#jsRelated');
    if (relBox) { relBox.innerHTML = rel.map(cardHTML).join(''); wireAdds(relBox); }

    /* Contexto del origen */
    var ob = $('#jsOriginBox');
    if (ob && o) {
      ob.innerHTML =
        '<p class="eyebrow">De dónde viene</p>' +
        '<h2>' + esc(o.name) + '</h2>' +
        '<p class="lead" style="margin-top:16px">' + esc(o.note) + '</p>' +
        '<dl class="map-card__inline" style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin:32px 0 0">' +
          '<div><dt style="font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--on-dark-soft);margin-bottom:6px">Altitud</dt><dd style="margin:0;font-family:var(--serif);font-size:1.3rem">' + esc(o.altitude) + '</dd></div>' +
          '<div><dt style="font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--on-dark-soft);margin-bottom:6px">Variedad</dt><dd style="margin:0;font-family:var(--serif);font-size:1.3rem">' + esc(o.variety) + '</dd></div>' +
          '<div><dt style="font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--on-dark-soft);margin-bottom:6px">Cosecha</dt><dd style="margin:0;font-family:var(--serif);font-size:1.3rem">' + esc(o.harvest) + '</dd></div>' +
          '<div><dt style="font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--on-dark-soft);margin-bottom:6px">Familias</dt><dd style="margin:0;font-family:var(--serif);font-size:1.3rem">' + o.families + '</dd></div>' +
        '</dl>';
    }
  }

  /* ---------------- Mapa de orígenes ---------------- */
  function initOrigins() {
    var stage = $('#jsMap'); if (!stage) return;
    var listBox = $('#jsOriginList'), card = $('#jsOriginCard');

    stage.innerHTML = T.mapSVG();
    listBox.innerHTML = T.origins.map(function (o, i) {
      return '<button class="origin-row" data-origin="' + o.id + '">' +
        '<span class="origin-row__n">' + ('0' + (i + 1)).slice(-2) + '</span>' +
        '<span class="origin-row__name">' + esc(o.name) + '<small>' + esc(o.region) + '</small></span>' +
        '<span class="origin-row__alt">' + esc(o.altitude) + '</span>' +
      '</button>';
    }).join('');

    function select(id) {
      var o = T.origins.filter(function (x) { return x.id === id; })[0];
      if (!o) return;
      $$('[data-origin]').forEach(function (el) { el.classList.toggle('is-on', el.dataset.origin === id); });
      var n = T.products.filter(function (p) { return p.origin === id; }).length;
      card.innerHTML =
        '<h3>' + esc(o.name) + ', ' + esc(o.region) + '</h3>' +
        '<p>' + esc(o.note) + '</p>' +
        '<dl>' +
          '<div><dt>Productor</dt><dd style="font-size:1rem">' + esc(o.producer) + '</dd></div>' +
          '<div><dt>Familias</dt><dd>' + o.families + '</dd></div>' +
          '<div><dt>Cosecha</dt><dd style="font-size:1rem">' + esc(o.harvest) + '</dd></div>' +
        '</dl>' +
        '<a class="link-u" href="tienda.html?origen=' + o.id + '" style="margin-top:22px">Ver ' + n + ' producto' + (n === 1 ? '' : 's') + ' de este origen →</a>';
    }

    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-origin]');
      if (el && (stage.contains(el) || listBox.contains(el))) select(el.dataset.origin);
    });
    listBox.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-origin]');
      if (el) select(el.dataset.origin);
    });
    select(T.origins[0].id);
  }

  /* ---------------- Testimonios y FAQ ---------------- */
  function initBlocks() {
    var q = $('#jsQuotes');
    if (q) {
      q.innerHTML = T.reviews.map(function (r) {
        return '<figure class="quote rv" style="margin:0">' +
          '<div class="quote__stars">' + '★'.repeat(r.stars) + '</div>' +
          '<p>«' + esc(r.text) + '»</p>' +
          '<figcaption class="quote__who">' +
            '<span class="quote__av">' + esc(r.who.charAt(0)) + '</span>' +
            '<span><b>' + esc(r.who) + '</b><small>' + esc(r.city) + '</small></span>' +
          '</figcaption>' +
        '</figure>';
      }).join('');
    }

    var f = $('#jsFaq');
    if (f) {
      f.innerHTML = T.faqs.map(function (x) {
        return '<div class="acc__item">' +
          '<button class="acc__q">' + esc(x.q) + '<i>+</i></button>' +
          '<div class="acc__a"><div>' + esc(x.a) + '</div></div>' +
        '</div>';
      }).join('');
    }

    /* Acordeones (FAQ y cualquier otro .acc del sitio) */
    $$('.acc__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.parentElement;
        var panel = $('.acc__a', item);
        var open = item.classList.toggle('is-open');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
      });
    });
  }

  /* ---------------- Revelado al hacer scroll ---------------- */
  var io;
  function observe(scope) {
    if (!('IntersectionObserver' in window)) {
      $$('.rv', scope || document).forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }
    $$('.rv', scope || document).forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Formularios de demostración ---------------- */
  function initForms() {
    $$('form[data-demo]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        toast('Recibido. Le respondemos dentro de un día hábil.');
        f.reset();
      });
    });
  }

  /* ---------------- Arranque ---------------- */
  function init() {
    buildChrome();
    renderCart();
    initFeatured();
    initShop();
    initPDP();
    initOrigins();
    initBlocks();
    initForms();
    wireAdds();
    observe();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
