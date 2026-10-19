// Run with: node test.js
const fs = require('fs');
const assert = require('assert');

// With --built, test the minified code in bookmarklet.txt instead of the source.
if (process.argv.includes('--built')) {
  const url = fs.readFileSync(__dirname + '/bookmarklet.txt', 'utf8').trim();
  eval(decodeURIComponent(url.slice('javascript:'.length)));
} else {
  eval(fs.readFileSync(__dirname + '/demetric.js', 'utf8'));
}
const convert = globalThis.demetricConvert;

function apply(text) {
  let out = '';
  let pos = 0;
  for (const h of convert(text)) {
    out += text.slice(pos, h.s) + h.r;
    pos = h.e;
  }
  return out + text.slice(pos);
}

const cases = [
  ['1,200 degrees centigrade', '2192 degrees Fahrenheit'],
  ['Water boils at 100°C.', 'Water boils at 212°F.'],
  ['It was -40 °C outside', 'It was -40 °F outside'],
  ['37 degrees Celsius', '98.6 degrees Fahrenheit'],
  ['20–25 ℃', '68–77 °F'],
  ['10 degrees C', '50 degrees F'],
  ['a 30 cm ruler', 'a 11.8 in ruler'],
  ['180 cm tall', '5.91 ft tall'],
  ['10 x 20 x 30 cm', '3.94 x 7.87 x 11.8 in'],
  ['a 5-kilometre race', 'a 3.11-mile race'],
  ['1 kilometer', '0.621 miles'],
  ['42.195 km', '26.2 mi'],
  ['8,848 m high', '29,029 ft high'],
  ['between 5 and 10 metres', 'between 16.4 and 32.8 feet'],
  ['50 m²', '538 sq ft'],
  ['100 square metres', '1076 square feet'],
  ['2 hectares', '4.94 acres'],
  ['500 ml', '16.9 fl oz'],
  ['2 litres', '2.11 quarts'],
  ['a 60 L tank', 'a 15.9 gal tank'],
  ['250 g of flour', '8.82 oz of flour'],
  ['70 kg', '154 lb'],
  ['3 tonnes', '3.31 tons'],
  ['100 km/h', '62.1 mph'],
  ['5.5 L/100km', '42.8 mpg'],
  ['220 kPa', '31.9 psi'],
  ['1013 hPa', '29.9 inHg'],
  ['150 kW', '201 hp'],
  ['400 Nm', '295 lb-ft'],
  ['1600 cc', '97.6 cu in'],
  // Things that must not change.
  ['$5 m budget', '$5 m budget'],
  ['5G network', '5G network'],
  ['5 lbs', '5 lbs'],
  ['500 mg ibuprofen', '500 mg ibuprofen'],
  ['A4 paper', 'A4 paper'],
  ['5 kWh', '5 kWh'],
  ['100°F', '100°F'],
];

let failed = 0;
for (const [input, expected] of cases) {
  const got = apply(input);
  try {
    assert.strictEqual(got, expected);
  } catch (e) {
    failed++;
    console.log(`FAIL: ${JSON.stringify(input)}\n  expected ${JSON.stringify(expected)}\n  got      ${JSON.stringify(got)}`);
  }
}
console.log(`${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
