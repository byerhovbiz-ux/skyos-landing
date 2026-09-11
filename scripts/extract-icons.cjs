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
  kebab: templateAfter('kebabRow: (s = 22)'),
  copy: templateAfter('copy: (s'),
  share: templateAfter('share: (s'),
  moreDots: templateAfter('moreDots: (s'),
  shareD: jsonConst('SVG_SHARE'),
  // The edit button on your own message. FIG.rename draws on an 18 viewBox,
  // not 24 like the stroked set.
  rename: jsonConst("SVG_RENAME"),
  // The note row's delete, beside the same rename icon used for edit.
  trash: jsonConst("SVG_TRASH"),

  // The phone chat header: hamburger and kebab, both drawn at 48.
  menu: templateAfter("menu: (s = 48)"),
  kebab48: templateAfter("kebab: (s = 48)"),

  // The settings dialog's left-hand nav.
  user: jsonConst("SVG_USER"),
  gridInt: jsonConst("SVG_GRID_INT"),
  hdd: jsonConst("SVG_HDD"),
  gear2: jsonConst("SVG_GEAR2"),
  shield: jsonConst("SVG_SHIELD"),
  bug: '<path d="M8 7a4 4 0 0 1 8 0"/><rect x="7" y="7" width="10" height="11" rx="5"/><path d="M3 11h4M17 11h4M4 17l3-1.5M20 17l-3-1.5M4.5 6L7 7.5M19.5 6L17 7.5"/>',
};

fs.writeFileSync('.tmp-icons.json', JSON.stringify(out));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length} chars`).join('\n'));
