import { readFile, writeFile } from 'node:fs/promises';

// ponytail: subset current headlines only; rerun after title edits, with serif fallback for new glyphs.
const translations = await readFile(new URL('../src/shared/lib/i18n.ts', import.meta.url), 'utf8');
const titles = [...translations.matchAll(/\b(?:title|latestUpdates)\s*:\s*'([^']+)'/g)].map(match => match[1]);
const characters = [...new Set(('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ,.!?·？！「」『』《》' + titles.join('')).split(''))].sort().join('');
const fontDirectory = new URL('../src/features/about/assets/fonts/', import.meta.url);
const download = async url => {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Font request failed: ${response.status}`);
  return response;
};

const [cssResponse, licenseResponse] = await Promise.all([
  download('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&display=swap&text=' + encodeURIComponent(characters)),
  download('https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/OFL.txt'),
]);
const css = await cssResponse.text();
const fontUrl = css.match(/url\((https:[^)]+)\)/)?.[1];
if (!fontUrl || new URL(fontUrl).hostname !== 'fonts.gstatic.com') throw new Error('Official font URL not found');
const font = Buffer.from(await (await download(fontUrl)).arrayBuffer());
if (font.readUInt32BE(0) !== 0x00010000) throw new Error('Expected a TrueType font');
await writeFile(new URL('news-serif.ttf', fontDirectory), font);
await writeFile(new URL('OFL.txt', fontDirectory), await licenseResponse.text());
console.log(`Updated Noto Serif SC 600: ${characters.length} characters, ${Math.round(font.length / 1024)} KB.`);
