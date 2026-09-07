const fs = require('fs');
const NL = String.fromCharCode(10);
const Q = String.fromCharCode(34);
let t = fs.readFileSync('test-v2.mjs', 'utf8');
const mark = 'const saveJson = w.localStorage.getItem(' + Q + 'coread-v2-save' + Q + ');';
const idx = t.indexOf(mark);
if (idx < 0) { console.error('fail'); process.exit(1); }
const lineEnd = t.indexOf(NL, idx);
t = t.slice(0, idx) + 'const saveJson = w.CoReadEngine.readSaveJSON();' + t.slice(lineEnd);
fs.writeFileSync('test-v2.mjs', t);
console.log('reader swapped');
