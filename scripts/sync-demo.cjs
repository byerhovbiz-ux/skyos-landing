// Refreshes the hero card from the app.
//
// The card in the hero is not a screenshot or a lookalike: it is the app's
// own stylesheet and icon vectors, rendered in an iframe. That means it goes
// stale when the app's design changes, and this is what un-stales it.
//
//   node scripts/sync-demo.cjs
//
// Copies pwa/styles.css over assets/app.css, re-extracts the icons out of
// pwa/app.js, and rewrites demo.html. Run it after any visual change to the
// PWA, then look at the card before deploying — the app's markup can change
// too, and this only tracks styles and icons.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const APP_CSS = 'C:/SkyOS app/pwa/styles.css';
const here = (p) => path.join(__dirname, '..', p);

if (!fs.existsSync(APP_CSS)) {
  console.error('Cannot find the PWA stylesheet at ' + APP_CSS);
  console.error('Edit APP_CSS in this script if the app moved.');
  process.exit(1);
}

fs.copyFileSync(APP_CSS, here('assets/app.css'));
console.log('assets/app.css  <- pwa/styles.css');

const run = (f) => execFileSync(process.execPath, [here('scripts/' + f)], {
  cwd: here('.'), stdio: 'inherit',
});

run('extract-icons.cjs');
run('build-demo.cjs');
console.log('\nDone. Check the card at http://localhost:4321 before deploying.');
