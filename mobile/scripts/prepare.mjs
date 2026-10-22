// Kopioi sovelluksen (../index.html) www-kansioon ja piirtää Solmu-logosta
// kuvakkeet ja käynnistyskuvat @capacitor/assets-työkalulle.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobile = path.resolve(here, '..');
const www = path.join(mobile, 'www');
const assets = path.join(mobile, 'assets');
fs.mkdirSync(www, { recursive: true });
fs.mkdirSync(assets, { recursive: true });

fs.copyFileSync(path.resolve(mobile, '..', 'index.html'), path.join(www, 'index.html'));

const INK = '#0D1424';
const COLORS = ['#2FBF7F', '#3D7DF0', '#F07F3C', '#9B5BF0']; // juna, laiva, bussi, lento

// Solmu-merkki 100x100-koordinaatistossa
const mark = (hub = '#FFFFFF') =>
  COLORS.map((c, i) => `<path d="M58 38 V15" stroke="${c}" stroke-width="12" stroke-linecap="round" fill="none" transform="rotate(${90 * i} 50 50)"/>`).join('') +
  `<circle cx="50" cy="50" r="7.5" fill="${hub}"/>`;

// size = kuvan koko, scale = merkin osuus kuvasta, bg = taustaväri tai null (läpinäkyvä)
const svg = (size, scale, bg) => {
  const m = size * scale;
  const off = (size - m) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    (bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : '') +
    `<g transform="translate(${off} ${off}) scale(${m / 100})">${mark()}</g></svg>`;
};

const out = async (name, svgText) => {
  await sharp(Buffer.from(svgText)).png().toFile(path.join(assets, name));
  console.log('assets/' + name);
};

await out('icon-only.png', svg(1024, 0.7, INK));
await out('icon-foreground.png', svg(1024, 0.5, null)); // Androidin adaptiivisen kuvakkeen turva-alue
await out('icon-background.png', `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${INK}"/></svg>`);
await out('splash.png', svg(2732, 0.16, INK));
await out('splash-dark.png', svg(2732, 0.16, INK));
console.log('www/index.html valmis');
