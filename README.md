# demetric

A bookmarklet that converts metric quantities on the current web page to US customary units.

Click it once to convert the page. Click it again to restore the original text. Each converted value is underlined with a dotted line; hover over it to see the original.

```
Water boils at 100°C.      →  Water boils at 212°F.
a 30 cm ruler              →  a 11.8 in ruler
10 x 20 x 30 cm            →  3.94 x 7.87 x 11.8 in
between 5 and 10 metres    →  between 16.4 and 32.8 feet
a 5-kilometre race         →  a 3.11-mile race
5.5 L/100km                →  42.8 mpg
```

## Install

GitHub does not allow `javascript:` links in READMEs, so use one of these methods:

- **Drag a link.** Download [`install.html`](install.html), open it in your browser, and drag the "Demetric" link to your bookmarks bar.
- **Paste the code.** Create a new bookmark and paste the contents of [`bookmarklet.txt`](bookmarklet.txt) into its URL field.

## What it converts

| Quantity | Metric units recognized | Converted to |
| --- | --- | --- |
| Temperature | °C, ℃, degrees C, Celsius, centigrade | °F, Fahrenheit |
| Length | mm, cm, m, km, and spelled-out metre/meter forms | in or ft (by size), mi |
| Area | mm², cm², m², km², ha, square metres, hectares | sq in, sq ft, sq mi, acres |
| Volume | ml, cl, dl, L, cm³, cc, m³, litres | fl oz, qt, or gal (by size), cu in, cu ft |
| Mass | g, kg, kilos, tonnes, metric tons | oz or lb (by size), tons |
| Speed | km/h, kph, m/s | mph |
| Fuel economy | L/100km, km/L | mpg |
| Pressure | kPa, MPa, bar, hPa, mbar | psi, inHg |
| Power | kW, kilowatts | hp |
| Torque | Nm, N·m, newton-metres | lb-ft |

Abbreviated units are converted to abbreviated units, and spelled-out units to spelled-out units. Ranges and dimensions (`20–25 °C`, `3 x 4 m`, `2 to 3 litres`) are converted to a single target unit, chosen from the largest value.

Some text is deliberately left alone:

- Milligrams and micrograms, which are the normal US units for drug doses (`500 mg ibuprofen`).
- Money amounts (`$5 m budget`).
- Units that are part of a longer word or a different unit (`5G`, `5 kWh`, `A4`).
- Text inside `<script>`, `<style>`, `<textarea>`, and editable elements.

## Development

The source is [`demetric.js`](demetric.js). Building requires Node.js.

```sh
npm install
node build.js         # writes bookmarklet.txt and install.html
node test.js          # tests the source
node test.js --built  # tests the minified bookmarklet
```

To add a test case, add an `[input, expected output]` pair to the `cases` list in [`test.js`](test.js).
