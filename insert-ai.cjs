const fs = require('fs');
let t = fs.readFileSync('app-v1.js', 'utf8');
const block = fs.readFileSync('ai-block.tmp', 'utf8');
const anchor = 'function bindEvents() {';
if (t.split(anchor).length - 1 !== 1) { console.error('anchor fail'); process.exit(1); }
const hook = ['  refreshBootSaveUi();', '  refreshAiIndicator();', '  bindAiSettings();'].join(String.fromCharCode(10));
t = t.replace(anchor, block + anchor);
t = t.replace('  refreshBootSaveUi();', hook);
fs.writeFileSync('app-v1.js', t);
console.log('ai block inserted');
