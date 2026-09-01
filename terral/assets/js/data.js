/* ==========================================================================
   TERRAL — Datos del catálogo
   Fuente única de verdad para orígenes, productores y productos.
   Editar aquí cambia la tienda completa (inicio, catálogo, ficha, carrito).
   ========================================================================== */

window.TERRAL = window.TERRAL || {};

/* --- Configuración de la tienda ------------------------------------------ */
TERRAL.config = {
  brand: 'TERRAL',
  tagline: 'Cacao de origen · Lima',
  currency: 'S/',
  whatsapp: '51900000000',            // reemplazar por el número real
  email: 'hola@terral.pe',
  igHandle: '@terral.pe',
  address: 'Jr. Domeyer 285, Barranco · Lima',
  hours: 'Mar a Dom · 11:00 – 20:00',
  freeShippingFrom: 120,              // envío gratis en Lima desde S/ 120
  limaShipping: 12,
  ruc: '20613456789',
  legalName: 'Terral Cacao S.A.C.'
};

/* --- Orígenes -------------------------------------------------------------
   x / y son coordenadas relativas (0–100) sobre el mapa esquemático del Perú.
   -------------------------------------------------------------------------- */
TERRAL.origins = [
  {
    id: 'chachapoyas',
    name: 'Chachapoyas',
    region: 'Amazonas',
    x: 30, y: 17,
    altitude: '1 100 – 1 750 m',
    variety: 'Criollo de montaña',
    harvest: 'Abril – Agosto',
    producer: 'Asociación Kuélap Cacao',
    families: 42,
    note: 'Cacao criollo cultivado en las terrazas nubladas del Utcubamba. Fermentación de seis días en cajones de cedro, secado lento bajo techo. Da un perfil floral, de nuez fresca y panela.'
  },
  {
    id: 'condorcanqui',
    name: 'Condorcanqui',
    region: 'Amazonas',
    x: 24, y: 9,
    altitude: '220 – 600 m',
    variety: 'Nativo amazónico',
    harvest: 'Todo el año',
    producer: 'Comunidades Awajún del Cenepa',
    families: 68,
    note: 'Cacao nativo recolectado por comunidades Awajún en la cuenca del Cenepa. Bosque en pie, cero deforestación. Perfil intenso: madera húmeda, tabaco dulce y fruta negra.'
  },
  {
    id: 'jaen',
    name: 'Jaén – San Ignacio',
    region: 'Cajamarca',
    x: 22, y: 14,
    altitude: '750 – 1 300 m',
    variety: 'Criollo / Trinitario',
    harvest: 'Mayo – Septiembre',
    producer: 'Cooperativa Norandino',
    families: 130,
    note: 'Zona de frontera entre el bosque seco y la ceja de selva. Cacao trinitario de acidez cítrica marcada, con final a caramelo y cáscara de naranja.'
  },
  {
    id: 'sanmartin',
    name: 'Juanjuí',
    region: 'San Martín',
    x: 36, y: 28,
    altitude: '380 – 900 m',
    variety: 'Trinitario Huallaga',
    harvest: 'Marzo – Julio',
    producer: 'Acopagro',
    families: 210,
    note: 'Cacao del Alto Huallaga, sembrado en tierras que hace veinte años tuvieron otro destino. Cuerpo redondo, notas de pasas, miel de caña y almendra tostada.'
  },
  {
    id: 'ucayali',
    name: 'Curimaná',
    region: 'Ucayali',
    x: 52, y: 40,
    altitude: '160 – 300 m',
    variety: 'CCN-51 selecto',
    harvest: 'Todo el año',
    producer: 'Colpa de Loros',
    families: 54,
    note: 'Llanura amazónica de suelos aluviales. Grano de gran tamaño y grasa alta, ideal para pastas y coberturas. Notas de plátano maduro y nuez del Brasil.'
  },
  {
    id: 'satipo',
    name: 'Satipo – Pichanaki',
    region: 'Junín',
    x: 42, y: 53,
    altitude: '600 – 1 200 m',
    variety: 'Criollo Chanchamayo',
    harvest: 'Abril – Septiembre',
    producer: 'Familia Ríos Ashaninka',
    families: 37,
    note: 'Selva central, bajo sombra de árboles maderables y cítricos. Es el cacao más aromático de nuestra selección: flores blancas, mandarina y un fondo lácteo.'
  },
  {
    id: 'quillabamba',
    name: 'Quillabamba',
    region: 'Cusco',
    x: 44, y: 68,
    altitude: '1 000 – 1 500 m',
    variety: 'Chuncho',
    harvest: 'Mayo – Agosto',
    producer: 'Cooperativa La Convención',
    families: 96,
    note: 'El legendario cacao Chuncho del valle de La Convención, grano pequeño y de aroma denso. Especias dulces, ciruela y un amargo noble muy limpio.'
  },
  {
    id: 'piura',
    name: 'Sullana',
    region: 'Piura',
    x: 12, y: 20,
    altitude: '90 – 400 m',
    variety: 'Blanco de Piura',
    harvest: 'Marzo – Junio',
    producer: 'Asociación Norte Blanco',
    families: 28,
    note: 'El célebre cacao blanco piurano, de mazorca amarilla y grano marfil. Bajísimo amargor, notas de leche condensada, avellana y frutos secos.'
  }
];

/* --- Categorías ---------------------------------------------------------- */
TERRAL.categories = [
  { id: 'todos',    label: 'Todo' },
  { id: 'tabletas', label: 'Tabletas de origen' },
  { id: 'bombones', label: 'Bombonería' },
  { id: 'untables', label: 'Untables y pastas' },
  { id: 'derivados',label: 'Nibs y derivados' },
  { id: 'cafe',     label: 'Café de origen' },
  { id: 'cajas',    label: 'Cajas de regalo' }
];

/* --- Productos ------------------------------------------------------------
   art: paleta de la envoltura (base, banda, tinta) para el generador SVG.
   -------------------------------------------------------------------------- */
TERRAL.products = [
  /* ---------------- Tabletas de origen ---------------- */
  {
    id: 'tab-chachapoyas-70',
    name: 'Chachapoyas 70 %',
    cat: 'tabletas', origin: 'chachapoyas',
    price: 26, weight: '70 g', cacao: 70,
    notes: 'Jazmín · nuez fresca · panela',
    profile: { acidez: 55, amargor: 45, fruta: 70, tostado: 40 },
    ingredients: 'Pasta de cacao criollo de Chachapoyas, azúcar orgánica de caña, manteca de cacao.',
    desc: 'Una tableta de conchado largo que deja hablar al grano criollo del Utcubamba. Empieza floral y termina en panela caliente. Nuestra puerta de entrada al cacao fino de aroma peruano.',
    tag: 'Más vendido', art: { base: '#E6DCC8', band: '#8C4A2F', ink: '#2A211B' }
  },
  {
    id: 'tab-condorcanqui-85',
    name: 'Condorcanqui 85 %',
    cat: 'tabletas', origin: 'condorcanqui',
    price: 29, weight: '70 g', cacao: 85,
    notes: 'Madera húmeda · tabaco dulce · fruta negra',
    profile: { acidez: 35, amargor: 82, fruta: 55, tostado: 70 },
    ingredients: 'Pasta de cacao nativo amazónico, azúcar orgánica de caña.',
    desc: 'Dos ingredientes y nada más. Cacao recolectado por comunidades Awajún en bosque en pie: profundo, seco y largo. Para quien ya no busca dulzor sino carácter.',
    tag: 'Bosque en pie', art: { base: '#CFC3AB', band: '#46382F', ink: '#F4F0E8' }
  },
  {
    id: 'tab-piura-blanco-55',
    name: 'Blanco de Piura 55 %',
    cat: 'tabletas', origin: 'piura',
    price: 28, weight: '70 g', cacao: 55,
    notes: 'Avellana · leche condensada · miel',
    profile: { acidez: 30, amargor: 25, fruta: 60, tostado: 45 },
    ingredients: 'Pasta de cacao blanco de Piura, azúcar orgánica de caña, manteca de cacao.',
    desc: 'El cacao blanco piurano casi no amarga. Textura sedosa y un dulzor natural que muchos confunden con chocolate con leche, sin llevar una gota.',
    tag: 'Edición limitada', art: { base: '#F1E7D4', band: '#B99968', ink: '#2A211B' }
  },
  {
    id: 'tab-quillabamba-72',
    name: 'Chuncho de Quillabamba 72 %',
    cat: 'tabletas', origin: 'quillabamba',
    price: 32, weight: '70 g', cacao: 72,
    notes: 'Ciruela · especias dulces · cedro',
    profile: { acidez: 50, amargor: 60, fruta: 75, tostado: 55 },
    ingredients: 'Pasta de cacao Chuncho, azúcar orgánica de caña, manteca de cacao.',
    desc: 'El grano más buscado del Perú, de la variedad Chuncho de La Convención. Pequeño, escaso y de una densidad aromática que no se parece a nada.',
    tag: 'Grano raro', art: { base: '#DED2BA', band: '#6E3823', ink: '#2A211B' }
  },
  {
    id: 'tab-satipo-leche-45',
    name: 'Satipo con leche 45 %',
    cat: 'tabletas', origin: 'satipo',
    price: 24, weight: '70 g', cacao: 45,
    notes: 'Mandarina · caramelo de leche · flores blancas',
    profile: { acidez: 40, amargor: 20, fruta: 65, tostado: 35 },
    ingredients: 'Pasta de cacao de Satipo, leche entera en polvo, azúcar orgánica de caña, manteca de cacao.',
    desc: 'Chocolate con leche pensado para adultos: 45 % de cacao de la selva central, leche fresca de Junín y nada de vainillina. Cremoso pero con cuerpo.',
    art: { base: '#EADCC0', band: '#A9713F', ink: '#2A211B' }
  },
  {
    id: 'tab-sanmartin-64',
    name: 'Juanjuí 64 %',
    cat: 'tabletas', origin: 'sanmartin',
    price: 25, weight: '70 g', cacao: 64,
    notes: 'Pasas · miel de caña · almendra',
    profile: { acidez: 45, amargor: 50, fruta: 60, tostado: 65 },
    ingredients: 'Pasta de cacao del Alto Huallaga, azúcar orgánica de caña, manteca de cacao.',
    desc: 'El equilibrio de la casa. Cacao del Huallaga con un tueste medio que redondea todo: es la tableta que ponemos cuando alguien dice "no sé cuál elegir".',
    art: { base: '#E3D6BC', band: '#7A5A34', ink: '#2A211B' }
  },
  {
    id: 'tab-jaen-70-naranja',
    name: 'Jaén 70 % con naranja de Chirinos',
    cat: 'tabletas', origin: 'jaen',
    price: 27, weight: '70 g', cacao: 70,
    notes: 'Naranja confitada · caramelo · cítrico',
    profile: { acidez: 75, amargor: 50, fruta: 80, tostado: 40 },
    ingredients: 'Pasta de cacao de Jaén, azúcar orgánica de caña, manteca de cacao, cáscara de naranja confitada (7 %).',
    desc: 'La acidez cítrica natural del cacao de Jaén amplificada con cáscara de naranja confitada de Chirinos, a treinta kilómetros de la misma parcela.',
    art: { base: '#EDDCC0', band: '#C1682B', ink: '#2A211B' }
  },
  {
    id: 'tab-satipo-maras',
    name: 'Satipo 70 % con sal de Maras',
    cat: 'tabletas', origin: 'satipo',
    price: 27, weight: '70 g', cacao: 70,
    notes: 'Sal mineral · flores · cacao tostado',
    profile: { acidez: 45, amargor: 58, fruta: 62, tostado: 50 },
    ingredients: 'Pasta de cacao de Satipo, azúcar orgánica de caña, manteca de cacao, sal de Maras (0,8 %).',
    desc: 'Escamas de sal de las salineras de Maras, en Cusco, sobre el cacao más floral de nuestra selección. El contraste dura hasta el último tercio del bocado.',
    art: { base: '#E8E0CE', band: '#5E6650', ink: '#2A211B' }
  },
  {
    id: 'tab-ucayali-nibs',
    name: 'Curimaná 68 % con nibs',
    cat: 'tabletas', origin: 'ucayali',
    price: 26, weight: '70 g', cacao: 68,
    notes: 'Plátano maduro · nuez · crujiente',
    profile: { acidez: 35, amargor: 55, fruta: 55, tostado: 78 },
    ingredients: 'Pasta de cacao de Ucayali, azúcar orgánica de caña, manteca de cacao, nibs tostados (9 %).',
    desc: 'Textura antes que nada. Nibs del mismo lote incrustados en la tableta para que cada mordida truene. Ideal para acompañar café filtrado.',
    art: { base: '#DDD0B4', band: '#4A3A2A', ink: '#F4F0E8' }
  },

  /* ---------------- Bombonería ---------------- */
  {
    id: 'bomb-caja-9',
    name: 'Bombones de autor · caja de 9',
    cat: 'bombones', origin: 'satipo',
    price: 48, weight: '108 g', cacao: 65,
    notes: 'Lúcuma · aguaymanto · pisco · café',
    profile: { acidez: 50, amargor: 40, fruta: 80, tostado: 40 },
    ingredients: 'Chocolate de origen, cremas de frutas peruanas, manteca de cacao, azúcar, sin conservantes.',
    desc: 'Nueve rellenos que recorren el país: lúcuma de Huaral, aguaymanto de Cajamarca, pisco quebranta de Ica y café de Chanchamayo. Producción semanal, sin conservantes.',
    tag: 'Frescos cada semana', art: { base: '#E9DEC7', band: '#8C4A2F', ink: '#2A211B', shape: 'box' }
  },
  {
    id: 'bomb-caja-16',
    name: 'Bombones de autor · caja de 16',
    cat: 'bombones', origin: 'satipo',
    price: 82, weight: '192 g', cacao: 65,
    notes: 'Selección completa de la temporada',
    profile: { acidez: 50, amargor: 40, fruta: 80, tostado: 40 },
    ingredients: 'Chocolate de origen, cremas de frutas peruanas, manteca de cacao, azúcar, sin conservantes.',
    desc: 'La colección completa de la temporada, incluidos los tres rellenos que solo entran en la caja grande. Presentación en estuche de cartón reciclado con lámina impresa.',
    art: { base: '#E1D4BA', band: '#6E3823', ink: '#2A211B', shape: 'box' }
  },
  {
    id: 'bomb-chocotejas',
    name: 'Chocotejas de lúcuma · 6 unidades',
    cat: 'bombones', origin: 'sanmartin',
    price: 30, weight: '180 g', cacao: 60,
    notes: 'Lúcuma · manjar blanco · pecana',
    profile: { acidez: 25, amargor: 35, fruta: 70, tostado: 45 },
    ingredients: 'Chocolate 60 %, manjar blanco, pulpa de lúcuma, pecanas.',
    desc: 'La teja iqueña llevada a chocolate de origen. Manjar cocido en casa, lúcuma fresca y pecana entera en el centro.',
    art: { base: '#EFE2C6', band: '#B07A3C', ink: '#2A211B', shape: 'box' }
  },

  /* ---------------- Untables y pastas ---------------- */
  {
    id: 'unt-avellana',
    name: 'Untable de cacao y avellana',
    cat: 'untables', origin: 'ucayali',
    price: 38, weight: '220 g', cacao: 42,
    notes: 'Avellana tostada · cacao · sin aceite de palma',
    profile: { acidez: 20, amargor: 30, fruta: 40, tostado: 80 },
    ingredients: 'Avellanas (32 %), pasta de cacao de Ucayali, azúcar de caña, manteca de cacao, leche en polvo, sal.',
    desc: 'Sin aceite de palma, sin emulsionantes, sin vainillina. Solo avellana tostada y molida junto al cacao hasta quedar sedosa. Se separa un poco: eso es buena señal.',
    tag: 'Sin aceite de palma', art: { base: '#E6D8BE', band: '#7A5A34', ink: '#2A211B', shape: 'jar' }
  },
  {
    id: 'unt-pasta-100',
    name: 'Pasta de cacao 100 %',
    cat: 'untables', origin: 'quillabamba',
    price: 34, weight: '250 g', cacao: 100,
    notes: 'Cacao puro · sin azúcar',
    profile: { acidez: 45, amargor: 95, fruta: 55, tostado: 70 },
    ingredients: '100 % pasta de cacao Chuncho.',
    desc: 'Cacao molido y nada más, en bloque. Para chocolate caliente a la antigua, repostería o para quien toma su cacao sin negociar.',
    art: { base: '#D6C8AE', band: '#46382F', ink: '#F4F0E8', shape: 'jar' }
  },
  {
    id: 'unt-cacao-polvo',
    name: 'Cacao en polvo natural',
    cat: 'untables', origin: 'sanmartin',
    price: 26, weight: '200 g', cacao: 100,
    notes: 'Sin alcalinizar · repostería',
    profile: { acidez: 60, amargor: 85, fruta: 50, tostado: 60 },
    ingredients: '100 % cacao en polvo natural, 10-12 % de grasa.',
    desc: 'Prensado en frío y sin alcalinizar, así que conserva la acidez del grano. Notará la diferencia en cualquier bizcocho.',
    art: { base: '#E0D2B8', band: '#8C4A2F', ink: '#2A211B', shape: 'jar' }
  },

  /* ---------------- Nibs y derivados ---------------- */
  {
    id: 'der-nibs',
    name: 'Nibs de cacao tostados',
    cat: 'derivados', origin: 'condorcanqui',
    price: 22, weight: '200 g', cacao: 100,
    notes: 'Crujiente · amargo · tostado',
    profile: { acidez: 40, amargor: 88, fruta: 45, tostado: 90 },
    ingredients: '100 % nibs de cacao nativo tostado.',
    desc: 'Grano descascarillado y partido, tostado a 118 °C. Sobre yogur, en ensaladas o directo del frasco cuando falta algo que masticar.',
    art: { base: '#DACCB2', band: '#4A3A2A', ink: '#F4F0E8', shape: 'jar' }
  },
  {
    id: 'der-grageas-cafe',
    name: 'Grageas de café cubiertas',
    cat: 'derivados', origin: 'satipo',
    price: 20, weight: '120 g', cacao: 70,
    notes: 'Café · chocolate amargo',
    profile: { acidez: 55, amargor: 70, fruta: 40, tostado: 85 },
    ingredients: 'Granos de café arábica tostados, chocolate 70 % de origen.',
    desc: 'Grano entero de café de Chanchamayo bañado en chocolate 70 %. Dos tostados en el mismo bocado.',
    art: { base: '#E2D4BA', band: '#6E3823', ink: '#2A211B', shape: 'jar' }
  },
  {
    id: 'der-grageas-aguaymanto',
    name: 'Grageas de aguaymanto',
    cat: 'derivados', origin: 'jaen',
    price: 20, weight: '120 g', cacao: 60,
    notes: 'Aguaymanto · ácido · dulce',
    profile: { acidez: 85, amargor: 40, fruta: 90, tostado: 30 },
    ingredients: 'Aguaymanto deshidratado, chocolate 60 % de origen.',
    desc: 'Aguaymanto deshidratado al sol en Cajamarca, cubierto de chocolate 60 %. Ácido primero, dulce después.',
    art: { base: '#EFE0C2', band: '#C1682B', ink: '#2A211B', shape: 'jar' }
  },
  {
    id: 'der-cascarilla',
    name: 'Cascarilla de cacao para infusión',
    cat: 'derivados', origin: 'chachapoyas',
    price: 14, weight: '100 g', cacao: 100,
    notes: 'Infusión · sin cafeína · aromática',
    profile: { acidez: 30, amargor: 35, fruta: 55, tostado: 60 },
    ingredients: '100 % cascarilla de cacao criollo.',
    desc: 'Lo que sobra al descascarillar el grano, que resulta ser una infusión notable: aromática, sin cafeína y con el mismo perfil floral del criollo de Chachapoyas.',
    art: { base: '#E7DCC4', band: '#5E6650', ink: '#2A211B', shape: 'jar' }
  },

  /* ---------------- Café de origen ---------------- */
  {
    id: 'cafe-satipo',
    name: 'Café Satipo · lavado',
    cat: 'cafe', origin: 'satipo',
    price: 42, weight: '250 g', cacao: 0,
    notes: 'Panela · mandarina · almendra',
    profile: { acidez: 70, amargor: 40, fruta: 70, tostado: 50 },
    ingredients: '100 % café arábica, variedad Typica y Caturra. Tueste medio.',
    desc: 'Lavado y secado en cama africana, tueste medio para filtrado. De la misma zona de la que traemos el cacao más floral de la casa.',
    art: { base: '#DFD1B6', band: '#5E6650', ink: '#2A211B', shape: 'bag' }
  },
  {
    id: 'cafe-jaen-honey',
    name: 'Café Jaén · honey',
    cat: 'cafe', origin: 'jaen',
    price: 46, weight: '250 g', cacao: 0,
    notes: 'Miel · durazno · cacao',
    profile: { acidez: 60, amargor: 45, fruta: 82, tostado: 55 },
    ingredients: '100 % café arábica, variedad Bourbon. Proceso honey. Tueste medio.',
    desc: 'Proceso honey: el grano se seca con parte del mucílago, lo que le deja un dulzor de miel muy claro. Nuestro café favorito para espresso.',
    tag: 'Micro lote', art: { base: '#EADBC0', band: '#B07A3C', ink: '#2A211B', shape: 'bag' }
  },
  {
    id: 'cafe-cusco-geisha',
    name: 'Café Quillabamba · Geisha',
    cat: 'cafe', origin: 'quillabamba',
    price: 78, weight: '150 g', cacao: 0,
    notes: 'Jazmín · bergamota · durazno blanco',
    profile: { acidez: 88, amargor: 30, fruta: 92, tostado: 35 },
    ingredients: '100 % café arábica, variedad Geisha. Tueste claro.',
    desc: 'Ciento cincuenta gramos de una parcela de dos hectáreas a 1 700 metros. Tueste claro, para filtrado exclusivamente. Cuando se acaba, se acaba.',
    tag: 'Solo 40 bolsas', art: { base: '#F0E6D2', band: '#8C4A2F', ink: '#2A211B', shape: 'bag' }
  },

  /* ---------------- Cajas de regalo ---------------- */
  {
    id: 'caja-origenes-5',
    name: 'Caja Cinco Orígenes',
    cat: 'cajas', origin: 'chachapoyas',
    price: 128, weight: '350 g', cacao: 70,
    notes: 'Cinco tabletas · cinco regiones',
    profile: { acidez: 55, amargor: 60, fruta: 70, tostado: 55 },
    ingredients: 'Cinco tabletas de 70 g: Chachapoyas, Condorcanqui, Quillabamba, Piura y Juanjuí.',
    desc: 'La cata completa en una caja: cinco tabletas de cinco regiones distintas, con una lámina que explica qué buscar en cada una. El mejor primer regalo para alguien que recién empieza.',
    tag: 'Para regalar', art: { base: '#E4D8C0', band: '#46382F', ink: '#F4F0E8', shape: 'box' }
  },
  {
    id: 'caja-cata-3',
    name: 'Estuche de Cata · tres intensidades',
    cat: 'cajas', origin: 'quillabamba',
    price: 82, weight: '210 g', cacao: 72,
    notes: '55 % · 70 % · 85 %',
    profile: { acidez: 50, amargor: 65, fruta: 65, tostado: 50 },
    ingredients: 'Tres tabletas de 70 g: Piura 55 %, Chachapoyas 70 %, Condorcanqui 85 %.',
    desc: 'Tres tabletas ordenadas de menor a mayor intensidad, con ficha de cata y lápiz. Pensado para hacer la prueba en mesa, con gente y sin apuro.',
    art: { base: '#EBE0CA', band: '#8C4A2F', ink: '#2A211B', shape: 'box' }
  },
  {
    id: 'caja-corporativa',
    name: 'Caja Corporativa Terral',
    cat: 'cajas', origin: 'satipo',
    price: 165, weight: '620 g', cacao: 70,
    notes: 'Tabletas · bombones · café · personalizable',
    profile: { acidez: 55, amargor: 55, fruta: 70, tostado: 60 },
    ingredients: 'Tres tabletas, caja de 9 bombones y 250 g de café de origen. Contenido ajustable.',
    desc: 'Nuestro formato para fin de año y bienvenidas. Permite tarjeta impresa, cinta al color de la empresa y despacho a múltiples direcciones en Lima. Desde 20 unidades.',
    tag: 'Empresas', art: { base: '#DCCFB6', band: '#5E6650', ink: '#2A211B', shape: 'box' }
  }
];

/* --- Testimonios --------------------------------------------------------- */
TERRAL.reviews = [
  { text: 'Pedí la Caja Cinco Orígenes para un cumpleaños y terminamos haciendo una cata de dos horas en la mesa. La lámina explicativa hizo todo el trabajo.', who: 'Rosa Delgado', city: 'Miraflores, Lima', stars: 5 },
  { text: 'Trabajo con chocolate hace nueve años y la pasta de Chuncho es la mejor que he conseguido en Lima sin importarla. Se nota que el lote está bien fermentado.', who: 'Andrés Cépeda', city: 'Pastelería · Surco', stars: 5 },
  { text: 'Compré a las once de la mañana y llegó a San Isidro a las seis de la tarde del mismo día, bien empacado y en frío. Eso en Lima no es poca cosa.', who: 'Milagros Ayala', city: 'San Isidro, Lima', stars: 5 }
];

/* --- Preguntas frecuentes ------------------------------------------------ */
TERRAL.faqs = [
  { q: '¿Ustedes fabrican el chocolate?', a: 'No. Terral selecciona, compra y distribuye. El chocolate lo hacen productores y talleres en Amazonas, Cajamarca, San Martín, Junín, Ucayali, Cusco y Piura, y cada empaque lleva el nombre de quien lo elaboró. Nuestro trabajo es catar, elegir, pagar en el momento de recoger y traerlo a Lima en buenas condiciones.' },
  { q: '¿Cómo llega el pedido a mi casa?', a: 'En Lima Metropolitana despachamos el mismo día si el pedido entra antes de la una de la tarde, con caja aislante en los meses de calor. El envío cuesta S/ 12 y es gratuito desde S/ 120. A provincias trabajamos con Olva y Shalom: entre 2 y 5 días hábiles según el destino.' },
  { q: '¿El chocolate se derrite en el camino?', a: 'De diciembre a marzo despachamos con gel refrigerante y caja térmica sin costo adicional en Lima. Si su pedido a provincia sale en esos meses, le escribimos antes para coordinar la mejor fecha. Un chocolate que se blanquea sigue siendo seguro, pero no es lo que queremos que reciba.' },
  { q: '¿Hacen regalos corporativos?', a: 'Sí, desde 20 unidades. Personalizamos tarjeta, cinta y contenido de la caja, y despachamos a varias direcciones en Lima con un solo pedido. Escríbanos con tres semanas de anticipación para fin de año.' },
  { q: '¿Puedo revender sus productos?', a: 'Tenemos lista de precios mayorista desde 12 unidades por referencia, con margen sugerido y material de exhibición. Cafeterías, tiendas de barrio y tiendas en línea son bienvenidas: escríbanos desde la página de Mayoristas.' },
  { q: '¿Qué medios de pago aceptan?', a: 'Tarjetas de crédito y débito por pasarela, transferencia bancaria, Yape y Plin. También puede cerrar el pedido por WhatsApp y pagar contra entrega en efectivo dentro de Lima Metropolitana.' }
];
