// Renders scripts/og.html to og.png — the image link previews show.
//
//   node scripts/build-og.cjs
//
// Uses whichever Chrome or Edge is already installed, headless. Run it after
// editing og.html, then deploy; crawlers cache previews, so a changed image
// can take a while to show on a link that was already shared.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const browser = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

if (!browser) {
  console.error('No Chrome or Edge found — add its path to the list in this script.');
  process.exit(1);
}

const src = path.join(__dirname, 'og.html');
const out = path.join(__dirname, '..', 'og.png');

// Its own throwaway profile. Without one, headless Chrome reaches for the
// default profile, and if a normal Chrome window is open it can hand the job
// to that instance and exit without writing anything.
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'skyos-og-'));

try {
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    // Time for the web fonts. Without it the capture fires on load and can
    // catch Georgia standing in for Cormorant.
    '--virtual-time-budget=8000',
    `--user-data-dir=${profile}`,
    `--screenshot=${out}`,
    'file:///' + src.replace(/\\/g, '/'),
  ], { stdio: 'inherit' });
} finally {
  fs.rmSync(profile, { recursive: true, force: true });
}

console.log('og.png written');
