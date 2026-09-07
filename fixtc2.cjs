const fs = require('fs');
let t = fs.readFileSync('test-v2.mjs', 'utf8');
const SQ = String.fromCharCode(39);
const DOLLAR = String.fromCharCode(36);
const NL = String.fromCharCode(10);
const marker = 'story/tradeoff locked at start';
const idx = t.indexOf(marker);
if (idx < 0) { console.error('no marker'); process.exit(1); }
let lineEnd = t.indexOf(NL, idx);
const c1 = 'check(' + SQ + 'room computer glows new message' + SQ + ', ' + DOLLAR + '(' + SQ + '#roomComputer' + SQ + ').classList.contains(' + SQ + 'has-new-message' + SQ + '));';
const c2 = 'check(' + SQ + 'end dialogue button gated before first card' + SQ + ', ' + DOLLAR + '(' + SQ + '#endDialogueButton' + SQ + ').disabled);';
t = t.slice(0, lineEnd + 1) + c1 + NL + c2 + NL + t.slice(lineEnd + 1);
fs.writeFileSync('test-v2.mjs', t);
console.log('added 2 checks');
