const fs = require('fs');
const Q = String.fromCharCode(34);
let t = fs.readFileSync('v2.html', 'utf8');
const anchor = '<button class="boot-button" id="startButton" type="button">开始今晚的回答 <span>→</span></button>';
if (t.split(anchor).length - 1 !== 1) { console.error('boot btn anchor fail'); process.exit(1); }
const btn = '<button class="boot-button boot-continue" id="customLaunch" type="button">AI 换你出题 · 再来一局 <span>→</span></button>';
t = t.replace(anchor, anchor + NL() + '        ' + btn);
function NL() { return String.fromCharCode(10); }
fs.writeFileSync('v2.html', t);
console.log('launch button added');
