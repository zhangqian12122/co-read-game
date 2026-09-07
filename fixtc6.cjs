const fs = require('fs');
const Q = String.fromCharCode(34);
const NL = String.fromCharCode(10);
const D = 'document.getElementById(' + Q;
let t = fs.readFileSync('game/engine.js', 'utf8');

const anchor = NL + '    refreshModal();';
const idx = t.indexOf(anchor);
if (idx < 0) { console.error('a1 fail'); process.exit(1); }
const insertAt = idx + anchor.length;
const label = NL + '    ' + D + 'modalConfirm' + Q + ').textContent = existing ? ' + Q + '更新素材卡' + Q + ' : ' + Q + '做成素材卡' + Q + ';';
t = t.slice(0, insertAt) + label + t.slice(insertAt);

const a2 = '  function bindModal() {';
const idx2 = t.indexOf(a2);
if (idx2 < 0) { console.error('a2 fail'); process.exit(1); }
const esc = a2 + NL +
  '    document.addEventListener(' + Q + 'keydown' + Q + ', (event) => {' + NL +
  '      if (event.key === ' + Q + 'Escape' + Q + ') {' + NL +
  '        const modal = ' + D + 'materialModal' + Q + ');' + NL +
  '        if (modal) modal.hidden = true;' + NL +
  '      }' + NL +
  '    });';
t = t.replace(a2, esc);

fs.writeFileSync('game/engine.js', t);
console.log('esc and label wired');
