const fs = require('fs');
let t = fs.readFileSync('test-v2.mjs', 'utf8');
const SQ = String.fromCharCode(39);
const marker = 'first card created (experience)';
const idx = t.indexOf(marker);
if (idx < 0) { console.error('marker missing'); process.exit(1); }
let lineEnd = t.indexOf(String.fromCharCode(10), idx);
const c = 'check(' + SQ + 'companion inspect line spoken for m3' + SQ + ', ' + '$' + '(' + SQ + '#aiText' + SQ + ').textContent.includes(' + SQ + '主心骨' + SQ + '));';
t = t.slice(0, lineEnd + 1) + c + String.fromCharCode(10) + t.slice(lineEnd + 1);
fs.writeFileSync('test-v2.mjs', t);
console.log('inspect assertion added');
