// Run with: node build.js
// Writes bookmarklet.txt (the javascript: URL) and install.html (a draggable link).
const fs = require('fs');
const { minify } = require('terser');

(async () => {
  const src = fs.readFileSync(__dirname + '/demetric.js', 'utf8');
  const { code } = await minify(src, { compress: true, mangle: true });

  const url = 'javascript:' + encodeURIComponent(code);
  fs.writeFileSync(__dirname + '/bookmarklet.txt', url + '\n');

  fs.writeFileSync(
    __dirname + '/install.html',
    `<!doctype html>
  <meta charset="utf-8">
  <title>demetric bookmarklet</title>
  <p>Drag this link to your bookmarks bar: <a href="${url}">Demetric</a></p>
  <p>Click it on any page to convert metric units to US units. Click it again to undo.
  Hover over a converted value to see the original.</p>
  <p>Test text: 1,200 degrees centigrade; a 30 cm ruler; 42.195 km; 70 kg; 500 ml; 100 km/h; 20–25 °C.</p>
  `
  );
  console.log(`bookmarklet.txt: ${url.length} characters`);
})();
