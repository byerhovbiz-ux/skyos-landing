// One-off: pull the app's real icon markup out of pwa/app.js so the landing
// demo uses the same vectors rather than redrawn approximations.
const fs = require('fs');
const src = fs.readFileSync('C:/SkyOS app/pwa/app.js', 'utf8');

function jsonConst(name) {
  const at = src.indexOf('const ' + name + ' = "');
  if (at < 0) throw new Error('missing ' + name);
  const start = src.indexOf('"', at + ('const ' + name + ' = ').length);
  let i = start + 1;
  while (i < src.length) {
    if (src[i] === '\\') { i += 2; continue; }
    if (src[i] === '"') break;
    i++;
  }
  return JSON.parse(src.slice(start, i + 1));
}

function templateAfter(marker) {
  const at = src.indexOf(marker);
  if (at < 0) throw new Error('missing ' + marker);
  const start = src.indexOf('`', at) + 1;
  const end = src.indexOf('`', start);
  return src.slice(start, end);
}

const out = {
  newproj: jsonConst('SVG_NEWPROJ'),
  integr: jsonConst('SVG_INTEGR'),
  memnav: jsonConst('SVG_MEM_NAV'),
  plus: templateAfter('plus: (s = 20)'),
  mic: templateAfter('mic: (s = 24)'),
  wave: templateAfter('wave: (s = 36)'),
  cloud: templateAfter('function cloudAvatar'),
  // The sidebar mascot. mascot() builds its markup around CLOUD_D and two
  // ids that vary by variant, so the template comes out with placeholders
  // in it and build-demo fills them for the 'drawer' variant.
  // Anchored on the return, not on the function: the first backtick inside
  // mascot() belongs to the filter id, not the SVG.
  mascotTpl: templateAfter('return `<svg width="${size}" height="${h}" viewBox="0 0 342 226"'),
  cloudD: jsonConst('CLOUD_D'),
  chevron: templateAfter('chevron_down: (s'),
  chevronD: jsonConst('SVG_CHEVRON_DOWN'),
};

fs.writeFileSync('.tmp-icons.json', JSON.stringify(out));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length} chars`).join('\n'));
