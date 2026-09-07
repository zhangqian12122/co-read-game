const fs = require('fs');
const NL = String.fromCharCode(10);
let t = fs.readFileSync('game/engine.js', 'utf8');
const a = '    playMethod,' + NL + '    endDialogue,' + NL + '    aiSuggest,';
if (t.split(a).length - 1 !== 1) { console.error('fail'); process.exit(1); }
t = t.replace(a, '    playMethod,' + NL + '    endDialogue,' + NL + '    aiSuggest,' + NL + '    readSaveJSON,');
fs.writeFileSync('game/engine.js', t);
console.log('exported');
