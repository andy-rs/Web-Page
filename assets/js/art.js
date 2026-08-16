/* ==========================================================================
   TERRAL — Generador de imágenes de producto
   Dibuja retratos de empaque en SVG a partir de los datos del producto.
   Evita depender de fotografías externas y mantiene el sitio autocontenido.
   Sustituir por fotografía real: ver README.
   ========================================================================== */

window.TERRAL = window.TERRAL || {};

(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /* Sombreado / aclarado simple de un hex */
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.min(255, Math.max(0, (n >> 16) + amt));
    var g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
    var b = Math.min(255, Math.max(0, (n & 0xff) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* Semilla determinista a partir del id, para que un producto se vea siempre igual */
  function seedOf(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return h;
  }

  /* --- Siluetas de empaque ------------------------------------------------ */

  function bar(a, uid) {
    return '' +
      '<g>' +
      '<rect x="112" y="86" width="176" height="330" rx="4" fill="' + a.base + '"/>' +
      '<rect x="112" y="86" width="176" height="330" rx="4" fill="url(#g' + uid + ')"/>' +
      '<rect x="112" y="214" width="176" height="74" fill="' + a.band + '"/>' +
      '<rect x="112" y="86" width="10" height="330" fill="rgba(0,0,0,.07)"/>' +
      '<rect x="278" y="86" width="10" height="330" fill="rgba(255,255,255,.16)"/>' +
      '</g>';
  }

  function box(a, uid) {
    return '' +
      '<g>' +
      '<rect x="80" y="150" width="240" height="200" rx="4" fill="' + a.base + '"/>' +
      '<rect x="80" y="150" width="240" height="200" rx="4" fill="url(#g' + uid + ')"/>' +
      '<rect x="80" y="150" width="240" height="34" fill="rgba(255,255,255,.28)"/>' +
      '<rect x="184" y="150" width="32" height="200" fill="' + a.band + '" opacity=".9"/>' +
      '<rect x="80" y="232" width="240" height="42" fill="' + a.band + '"/>' +
      '</g>';
  }

  function jar(a, uid) {
    return '' +
      '<g>' +
      '<rect x="136" y="112" width="128" height="34" rx="5" fill="' + a.band + '"/>' +
      '<rect x="130" y="142" width="140" height="232" rx="14" fill="' + a.base + '"/>' +
      '<rect x="130" y="142" width="140" height="232" rx="14" fill="url(#g' + uid + ')"/>' +
      '<rect x="130" y="222" width="140" height="70" fill="' + a.band + '"/>' +
      '<rect x="140" y="152" width="12" height="212" rx="6" fill="rgba(255,255,255,.24)"/>' +
      '</g>';
  }

  function bag(a, uid) {
    return '' +
      '<g>' +
      '<path d="M124 122 h152 v260 a10 10 0 0 1 -10 10 h-132 a10 10 0 0 1 -10 -10 z" fill="' + a.base + '"/>' +
      '<path d="M124 122 h152 v260 a10 10 0 0 1 -10 10 h-132 a10 10 0 0 1 -10 -10 z" fill="url(#g' + uid + ')"/>' +
      '<rect x="118" y="104" width="164" height="20" rx="3" fill="' + a.band + '"/>' +
      '<rect x="124" y="232" width="152" height="62" fill="' + a.band + '"/>' +
      '<circle cx="200" cy="352" r="20" fill="none" stroke="' + a.band + '" stroke-width="1.6" opacity=".55"/>' +
      '</g>';
  }

  var SHAPES = { bar: bar, box: box, jar: jar, bag: bag };

  /* --- Retrato completo --------------------------------------------------- */

  /**
   * @param {Object} p        producto de TERRAL.products
   * @param {Object} [opt]    { label:false } para versiones miniatura
   * @returns {String} marcado SVG
   */
  TERRAL.artFor = function (p, opt) {
    opt = opt || {};
    var a = p.art || {};
    a = { base: a.base || '#E6DCC8', band: a.band || '#8C4A2F', ink: a.ink || '#2A211B', shape: a.shape || 'bar' };

    var uid = seedOf(p.id).toString(36).slice(0, 6);
    var origin = (TERRAL.origins || []).filter(function (o) { return o.id === p.origin; })[0];
    var originName = origin ? origin.name.toUpperCase() : '';
    var regionName = origin ? origin.region.toUpperCase() : '';
    var pct = p.cacao ? p.cacao + '%' : (p.cat === 'cafe' ? 'CAFÉ' : '');
    var draw = SHAPES[a.shape] || bar;
    var showLabel = opt.label !== false;

    /* motas de grano, deterministas */
    var seed = seedOf(p.id), specks = '';
    for (var i = 0; i < 26; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      var sx = 20 + (seed % 360);
      seed = (seed * 1103515245 + 12345) >>> 0;
      var sy = 20 + (seed % 460);
      seed = (seed * 1103515245 + 12345) >>> 0;
      var sr = 0.7 + (seed % 14) / 10;
      specks += '<circle cx="' + sx + '" cy="' + sy + '" r="' + sr.toFixed(1) + '" fill="' + a.ink + '" opacity=".05"/>';
    }

    return '' +
'<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(p.name) + '" preserveAspectRatio="xMidYMid slice">' +
  '<defs>' +
    '<linearGradient id="bg' + uid + '" x1="0" y1="0" x2="0.6" y2="1">' +
      '<stop offset="0" stop-color="' + shade(a.base, 26) + '"/>' +
      '<stop offset="1" stop-color="' + shade(a.base, -18) + '"/>' +
    '</linearGradient>' +
    '<linearGradient id="g' + uid + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#000" stop-opacity=".10"/>' +
      '<stop offset="0.42" stop-color="#fff" stop-opacity=".16"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".08"/>' +
    '</linearGradient>' +
    '<filter id="sh' + uid + '" x="-30%" y="-20%" width="160%" height="150%">' +
      '<feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#1E1815" flood-opacity=".22"/>' +
    '</filter>' +
  '</defs>' +

  '<rect width="400" height="500" fill="url(#bg' + uid + ')"/>' +
  specks +
  '<ellipse cx="200" cy="430" rx="130" ry="22" fill="#1E1815" opacity=".10"/>' +

  '<g filter="url(#sh' + uid + ')">' + draw(a, uid) + '</g>' +

  (showLabel ?
    '<g font-family="Cormorant Garamond, Georgia, serif" text-anchor="middle" fill="' + a.ink + '">' +
      '<text x="200" y="' + (a.shape === 'bar' ? 249 : a.shape === 'jar' ? 258 : a.shape === 'bag' ? 268 : 256) + '" ' +
        'font-size="26" letter-spacing="7" fill="' + (isDark(a.band) ? '#F4F0E8' : '#FFF8EC') + '">TERRAL</text>' +
      '<text x="200" y="' + (a.shape === 'bar' ? 272 : a.shape === 'jar' ? 279 : a.shape === 'bag' ? 285 : 269) + '" ' +
        'font-family="Inter, Helvetica, Arial, sans-serif" font-size="8.5" letter-spacing="3.6" ' +
        'fill="' + (isDark(a.band) ? 'rgba(244,240,232,.82)' : 'rgba(255,248,236,.9)') + '">' + esc(originName) + '</text>' +
    '</g>' +
    '<g font-family="Inter, Helvetica, Arial, sans-serif" fill="' + a.ink + '" opacity=".62">' +
      '<text x="34" y="42" font-size="9" letter-spacing="3.2">' + esc(regionName) + '</text>' +
      '<text x="366" y="42" font-size="9" letter-spacing="3.2" text-anchor="end">' + esc(pct) + '</text>' +
      '<text x="34" y="474" font-size="8" letter-spacing="3">' + esc(p.weight || '') + '</text>' +
      '<text x="366" y="474" font-size="8" letter-spacing="3" text-anchor="end">PERÚ</text>' +
    '</g>' +
    '<line x1="34" y1="52" x2="366" y2="52" stroke="' + a.ink + '" stroke-opacity=".16"/>' +
    '<line x1="34" y1="456" x2="366" y2="456" stroke="' + a.ink + '" stroke-opacity=".16"/>'
  : '') +
'</svg>';
  };

  function isDark(hex) {
    var n = parseInt(hex.slice(1), 16);
    var l = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 0xff) + 0.114 * (n & 0xff);
    return l < 150;
  }

  /* --- Sello de marca ----------------------------------------------------- */
  TERRAL.seal = function (color) {
    color = color || 'currentColor';
    return '' +
'<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<circle cx="20" cy="20" r="18.5" fill="none" stroke="' + color + '" stroke-width="1"/>' +
  '<path d="M20 8 C27 13 27 27 20 32 C13 27 13 13 20 8 Z" fill="none" stroke="' + color + '" stroke-width="1.1"/>' +
  '<line x1="20" y1="9.5" x2="20" y2="30.5" stroke="' + color + '" stroke-width="1"/>' +
  '<path d="M20 14 C22.6 15.6 22.6 18.4 20 20" fill="none" stroke="' + color + '" stroke-width=".85" opacity=".75"/>' +
  '<path d="M20 20 C17.4 21.6 17.4 24.4 20 26" fill="none" stroke="' + color + '" stroke-width=".85" opacity=".75"/>' +
'</svg>';
  };

  /* --- Mapa esquemático del Perú ------------------------------------------
     Contorno estilizado (no cartográfico) usado como soporte de los orígenes.
     ------------------------------------------------------------------------ */
  TERRAL.mapSVG = function () {
    var pins = (TERRAL.origins || []).map(function (o) {
      return '' +
        '<g class="map-pin" data-origin="' + o.id + '" transform="translate(' + o.x + ',' + o.y + ')" ' +
           'role="button" tabindex="0" aria-label="' + esc(o.name) + '">' +
          '<circle class="halo" r="3.4"/>' +
          '<circle class="dot" r="1.15"/>' +
        '</g>';
    }).join('');

    return '' +
'<svg viewBox="0 0 100 108" xmlns="http://www.w3.org/2000/svg" aria-label="Mapa de orígenes del cacao en el Perú">' +
  '<path d="M17 6 L27 3 L36 6 L41 13 L52 17 L61 15 L70 20 L76 30 L74 40 L66 47 L60 58 L57 70 L50 80 L44 92 L36 103 L27 101 L23 92 L15 78 L9 62 L7 46 L11 30 L13 16 Z" ' +
    'fill="rgba(244,240,232,.05)" stroke="rgba(244,240,232,.28)" stroke-width=".5" stroke-linejoin="round"/>' +
  '<path d="M13 16 L28 24 L38 36 L45 52 L47 70 L44 92" fill="none" stroke="rgba(185,153,104,.4)" stroke-width=".4" stroke-dasharray="1.4 1.8"/>' +
  '<text x="72" y="70" font-family="Inter, Arial, sans-serif" font-size="2.4" letter-spacing="1.1" fill="rgba(244,240,232,.36)">OCÉANO</text>' +
  '<text x="72" y="74" font-family="Inter, Arial, sans-serif" font-size="2.4" letter-spacing="1.1" fill="rgba(244,240,232,.36)">PACÍFICO</text>' +
  '<g class="map-city" transform="translate(24,74)" aria-label="Lima">' +
    '<path d="M0 -1.3 L1.3 0 L0 1.3 L-1.3 0 Z" fill="#F4F0E8"/>' +
    '<text x="3" y="1" font-family="Inter, Arial, sans-serif" font-size="2.6" letter-spacing=".8" fill="rgba(244,240,232,.8)">LIMA</text>' +
  '</g>' +
  pins +
'</svg>';
  };
})();
