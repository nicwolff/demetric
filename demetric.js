// demetric: convert metric quantities on the current page to US customary units.
// Run once to convert; run again to restore the original text.
(function () {
  'use strict';
  const CLS = 'demetric-conv';

  // Second run: undo the previous conversion.
  if (typeof document !== 'undefined') {
    const done = document.querySelectorAll('span.' + CLS);
    if (done.length) {
      done.forEach((s) => s.replaceWith(document.createTextNode(s.dataset.orig)));
      document.body.normalize();
      return;
    }
  }

  // A number such as 5, -3.2, 1,200 or 1,200.5.
  const NUM = '[-−]?(?:\\d{1,3}(?:,\\d{3})+(?!\\d)|\\d+)(?:\\.\\d+)?|[-−]?\\.\\d+';
  // Words and symbols that join numbers in a range or dimension: "5-10", "3 x 4", "2 to 3".
  const SEP = '–|—|-|to|and|or|by|x|×';
  const LIST = '(?:' + NUM + ')(?:\\s*(?:' + SEP + ')\\s*(?:' + NUM + '))*';
  const ITEM = new RegExp('(' + NUM + ')(\\s*(?:' + SEP + ')\\s*)?', 'gi');

  // Target units: [factor per base unit, short name, singular name, plural name].
  // A null short name means the long name is always used.
  const T = {
    in: [39.3700787, 'in', 'inch', 'inches'],
    ft: [3.2808399, 'ft', 'foot', 'feet'],
    mi: [1 / 1609.344, 'mi', 'mile', 'miles'],
    sqin: [1550.0031, 'sq in', 'square inch', 'square inches'],
    sqft: [10.7639104, 'sq ft', 'square foot', 'square feet'],
    acre: [1 / 4046.8564224, null, 'acre', 'acres'],
    sqmi: [1 / 2589988.110336, 'sq mi', 'square mile', 'square miles'],
    floz: [33.8140227, 'fl oz', 'fluid ounce', 'fluid ounces'],
    qt: [1.05668821, 'qt', 'quart', 'quarts'],
    gal: [0.264172052, 'gal', 'gallon', 'gallons'],
    cuin: [61.0237441, 'cu in', 'cubic inch', 'cubic inches'],
    cuft: [0.0353146667, 'cu ft', 'cubic foot', 'cubic feet'],
    oz: [35.2739619, 'oz', 'ounce', 'ounces'],
    lb: [2.20462262, 'lb', 'pound', 'pounds'],
    ton: [0.00110231131, null, 'ton', 'tons'],
    mph: [0.621371192, 'mph', 'mile per hour', 'miles per hour'],
    mpg: [1, 'mpg', 'mile per gallon', 'miles per gallon'],
    psi: [0.145037738, 'psi', 'pound per square inch', 'pounds per square inch'],
    inhg: [0.295299831, 'inHg', 'inch of mercury', 'inches of mercury'],
    hp: [1.34102209, 'hp', 'horsepower', 'horsepower'],
    lbft: [0.737562149, 'lb-ft', 'pound-foot', 'pound-feet'],
  };

  // Choose a target unit from the largest base value in the match,
  // so that every number in a range gets the same unit.
  const len = (b) => (b < 1 ? 'in' : 'ft');
  const vol = (b) => (b < 0.95 ? 'floz' : b < 3.785 ? 'qt' : 'gal');
  const mass = (b) => (b < 0.4536 ? 'oz' : 'lb');

  // Source units: [regex source, regex flags, factor to base unit, target, style].
  // Base units: m, m², L, kg, km/h, kPa, kW, N·m. Style 's' = symbol, 'l' = spelled out.
  // 'temp' and 'fuel' are converted by formula rather than by factor.
  // Milligrams and micrograms are left alone: they are the normal US units for doses.
  const MET = 'met(?:re|er)s?';
  const SRC = [
    ['°\\s?C|º\\s?C|˚\\s?C|℃|deg(?:ree)?s?\\.?\\s?(?:c|celsius|centigrade)|celsius|centigrade', 'i', 1, 'temp', 't'],

    ['mm', '', 0.001, len, 's'],
    ['cm', '', 0.01, len, 's'],
    ['m', '', 1, len, 's'],
    ['[kK][mM]s?', '', 1000, 'mi', 's'],
    ['milli' + MET, 'i', 0.001, len, 'l'],
    ['centi' + MET, 'i', 0.01, len, 'l'],
    [MET, 'i', 1, len, 'l'],
    ['kilo' + MET, 'i', 1000, 'mi', 'l'],

    ['mm[²2]|sq\\.?\\s?mm', '', 1e-6, 'sqin', 's'],
    ['cm[²2]|sq\\.?\\s?cm', '', 1e-4, 'sqin', 's'],
    ['m[²2]|sq\\.?\\s?m|sqm', '', 1, 'sqft', 's'],
    ['km[²2]|sq\\.?\\s?km', '', 1e6, 'sqmi', 's'],
    ['ha', '', 1e4, 'acre', 's'],
    ['(?:square|sq\\.?)\\s?milli' + MET + '|milli' + MET + '\\s?squared', 'i', 1e-6, 'sqin', 'l'],
    ['(?:square|sq\\.?)\\s?centi' + MET + '|centi' + MET + '\\s?squared', 'i', 1e-4, 'sqin', 'l'],
    ['(?:square|sq\\.?)\\s?' + MET + '|' + MET + '\\s?squared', 'i', 1, 'sqft', 'l'],
    ['(?:square|sq\\.?)\\s?kilo' + MET + '|kilo' + MET + '\\s?squared', 'i', 1e6, 'sqmi', 'l'],
    ['hectares?', 'i', 1e4, 'acre', 'l'],

    ['m[lL]', '', 0.001, vol, 's'],
    ['c[lL]', '', 0.01, vol, 's'],
    ['d[lL]', '', 0.1, vol, 's'],
    ['[lL]|ltrs?', '', 1, vol, 's'],
    ['millilit(?:re|er)s?', 'i', 0.001, vol, 'l'],
    ['centilit(?:re|er)s?', 'i', 0.01, vol, 'l'],
    ['decilit(?:re|er)s?', 'i', 0.1, vol, 'l'],
    ['lit(?:re|er)s?', 'i', 1, vol, 'l'],
    ['cm[³3]|cc|ccm', '', 0.001, 'cuin', 's'],
    ['m[³3]', '', 1000, 'cuft', 's'],
    ['cubic\\s?centi' + MET, 'i', 0.001, 'cuin', 'l'],
    ['cubic\\s?' + MET, 'i', 1000, 'cuft', 'l'],

    ['g', '', 0.001, mass, 's'],
    ['[kK][gG]s?', '', 1, mass, 's'],
    ['gram(?:me)?s?', 'i', 0.001, mass, 'l'],
    ['kilo(?:gram(?:me)?)?s?', 'i', 1, mass, 'l'],
    ['tonnes?|metric\\s?tons?', 'i', 1000, 'ton', 'l'],

    ['km\\s?/\\s?h(?:r|our)?|kmph|kmh|kph', 'i', 1, 'mph', 's'],
    ['kilo' + MET + '\\s?(?:per|an|a)\\s?hour|kilo' + MET + '/hour', 'i', 1, 'mph', 'l'],
    ['m/s', '', 3.6, 'mph', 's'],
    [MET + '\\s?per\\s?second', 'i', 3.6, 'mph', 'l'],

    ['l\\s?/\\s?100\\s?km', 'i', 1, 'fuel', 's'],
    ['lit(?:re|er)s?\\s?per\\s?100\\s?(?:km|kilo' + MET + ')', 'i', 1, 'fuel', 'l'],
    ['km\\s?/\\s?l', 'i', 2.35214583, 'mpg', 's'],

    ['kPa', '', 1, 'psi', 's'],
    ['MPa', '', 1000, 'psi', 's'],
    ['bars?', '', 100, 'psi', 's'],
    ['hPa|mbar|mb', '', 0.1, 'inhg', 's'],
    ['kilopascals?', 'i', 1, 'psi', 'l'],
    ['hectopascals?|millibars?', 'i', 0.1, 'inhg', 'l'],

    ['[kK][wW]', '', 1, 'hp', 's'],
    ['kilowatts?', 'i', 1, 'hp', 'l'],

    ['N[·⋅-]?m', '', 1, 'lbft', 's'],
    ['newton[-\\s]?' + MET, 'i', 1, 'lbft', 'l'],
  ].map(([p, flags, f, t, style]) => ({
    // A number list, an optional space or hyphen, then the unit, not followed by
    // more letters. Numbers right after letters, digits, "." or "," and amounts
    // after currency symbols ("$5 m") are not matched.
    re: new RegExp(
      '(?<![\\w.,]|[$£€¥]\\s?)(' + LIST + ')(-|\\s?)(' + p + ')(?![\\w²³/])',
      'g' + flags
    ),
    f, t, style,
  }));

  function fmt(v) {
    const a = Math.abs(v);
    let n = a >= 100 ? Math.round(v) : +v.toPrecision(3);
    if (n === 0) n = 0; // drop -0
    return a >= 10000 ? n.toLocaleString('en-US') : String(n);
  }

  // Build the replacement text for one match, or return null to leave it as is.
  function render(u, m) {
    const parts = [];
    let t;
    ITEM.lastIndex = 0;
    while ((t = ITEM.exec(m[1]))) {
      parts.push([parseFloat(t[1].replace(/,/g, '').replace('−', '-')), t[2] || '']);
    }
    let conv, name;
    if (u.t === 'temp') {
      conv = (v) => (v * 9) / 5 + 32;
      name = m[3]
        .replace(/celsius|centigrade/i, 'Fahrenheit')
        .replace('℃', '°F')
        .replace(/c$/i, 'F');
    } else {
      let target;
      if (u.t === 'fuel') {
        target = 'mpg';
        conv = (v) => 235.214583 / v;
      } else {
        const maxBase = Math.max(...parts.map((p) => Math.abs(p[0] * u.f)));
        target = typeof u.t === 'function' ? u.t(maxBase) : u.t;
        conv = (v) => v * u.f * T[target][0];
      }
      const [, short, one, many] = T[target];
      const singular = m[2] === '-' || (parts.length === 1 && fmt(conv(parts[0][0])) === '1');
      name = u.style === 's' && short ? short : singular ? one : many;
    }
    let out = '';
    for (const [v, sep] of parts) {
      const c = conv(v);
      if (!isFinite(c)) return null;
      out += fmt(c) + sep;
    }
    return out + m[2] + name;
  }

  // Return the non-overlapping conversions in a string, in order.
  function convert(text) {
    const hits = [];
    for (const u of SRC) {
      u.re.lastIndex = 0;
      let m;
      while ((m = u.re.exec(text))) {
        const r = render(u, m);
        if (r !== null) hits.push({ s: m.index, e: m.index + m[0].length, o: m[0], r });
      }
    }
    // Earliest match first; at the same start, the longest match wins.
    hits.sort((a, b) => a.s - b.s || b.e - a.e);
    const out = [];
    let end = 0;
    for (const h of hits) {
      if (h.s >= end) {
        out.push(h);
        end = h.e;
      }
    }
    return out;
  }

  if (typeof document === 'undefined') {
    // Loaded outside a browser (by the tests).
    globalThis.demetricConvert = convert;
    return;
  }

  const SKIP = /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|TEMPLATE)$/;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentNode;
      if (!p || SKIP.test(p.nodeName) || p.isContentEditable || !/\d/.test(n.nodeValue)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  for (const node of nodes) {
    const text = node.nodeValue;
    const hits = convert(text);
    if (!hits.length) continue;
    const frag = document.createDocumentFragment();
    let pos = 0;
    for (const h of hits) {
      frag.append(text.slice(pos, h.s));
      const span = document.createElement('span');
      span.className = CLS;
      span.dataset.orig = h.o;
      span.title = h.o;
      span.style.textDecoration = 'underline dotted';
      span.textContent = h.r;
      frag.append(span);
      pos = h.e;
    }
    frag.append(text.slice(pos));
    node.replaceWith(frag);
  }
})();
