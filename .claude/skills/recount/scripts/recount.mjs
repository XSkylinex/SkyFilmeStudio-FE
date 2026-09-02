import { readFileSync, writeFileSync } from 'node:fs';

const EN = 'src/lib/i18n/catalogue/en.ts';
const HE = 'src/lib/i18n/catalogue/he.ts';
const CLAUDE_MD = process.env.RECOUNT_CLAUDE_MD ?? 'CLAUDE.md';
const START = 'FE-15 added the i18n mechanism:';
const END = "primitive layer FE-15's migration never reached";
const HISTORIC_ANCHOR = '1,087 the night before, after';
const HISTORIC_CHAIN =
  "the canonical comparison, dialogue editing, FE-12's advisory half, FE-16's third pass and four BE-21 refusals absorbed the same evening — 109 when FE-15 closed, then the system screen, the";
const WIDTH = 100;

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const countKeys = (path) =>
  readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => /^  '[^']+':/.test(line)).length;

const en = countKeys(EN);
const he = countKeys(HE);
if (en !== he) {
  fail(`English holds ${en} keys and Hebrew ${he}; they must be equal before the count means anything`);
}
const pretty = en.toLocaleString('en-US');

const args = process.argv.slice(2);
const check = args.includes('--check');
const phrase = args.filter((arg) => !arg.startsWith('--'))[0];

let text = readFileSync(CLAUDE_MD, 'utf8');

text = text.replace(
  /<<<<<<< [^\n]*\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]*\n/g,
  (block, head) => (head.includes(START) || head.includes('keys in English') ? head : block),
);

const start = text.indexOf(START);
const end = text.indexOf(END);
if (start < 0 || end < 0 || end < start) {
  fail('the catalogue paragraph in CLAUDE.md is not where this script expects it');
}

const flat = text
  .slice(start, end)
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .join(' ');

const shape =
  /^FE-15 added the i18n mechanism: `src\/lib\/i18n\/` holds a typed catalogue of \*\*([\d,]+) keys in English and Hebrew\*\*, counted (\d{4}-\d{2}-\d{2}) after (.+?) — (.*)$/;
const match = flat.match(shape);
if (match === null) {
  fail('the catalogue paragraph no longer matches the shape this script rewrites; edit it by hand');
}
const [, recorded, , previousPhrase, chain] = match;

if (check) {
  if (recorded !== pretty) {
    fail(`CLAUDE.md says ${recorded} keys; the catalogues hold ${pretty}`);
  }
  console.log(`${pretty} keys, and CLAUDE.md agrees`);
  process.exit(0);
}

if (recorded === pretty) {
  writeFileSync(CLAUDE_MD, text);
  console.log(`${pretty} keys, unchanged; the sentence is kept as upstream wrote it`);
  process.exit(0);
}

if (phrase === undefined) {
  fail('say what moved the count, e.g. "the structure-profile form"');
}

const today = new Date().toISOString().slice(0, 10);
const nextChain =
  recorded === pretty ? chain : `${recorded} after ${previousPhrase}, ${chain}`;
let sentence = `FE-15 added the i18n mechanism: \`src/lib/i18n/\` holds a typed catalogue of **${pretty} keys in English and Hebrew**, counted ${today} after ${phrase} — ${nextChain}`;

if (!sentence.includes('the canonical comparison, dialogue editing')) {
  if (!sentence.includes(HISTORIC_ANCHOR)) {
    fail('the paragraph lost its history and the anchor to restore it after is gone; edit it by hand');
  }
  sentence = sentence.replace(HISTORIC_ANCHOR, `${HISTORIC_ANCHOR} ${HISTORIC_CHAIN}`);
}

const wrapped = [];
let line = '';
for (const word of sentence.split(' ')) {
  if (line.length > 0 && line.length + 1 + word.length > WIDTH) {
    wrapped.push(line);
    line = word;
  } else {
    line = line.length === 0 ? word : `${line} ${word}`;
  }
}
wrapped.push(line);

text = `${text.slice(0, start)}${wrapped.join('\n')}\n${text.slice(end)}`;
if (text.includes('<<<<<<<') || text.includes('>>>>>>>')) {
  console.error('other conflicts remain in CLAUDE.md; the count paragraph is resolved, the rest is yours');
}
writeFileSync(CLAUDE_MD, text);
console.log(`${pretty} keys, counted today after ${phrase}`);
