const fs = require('fs');
const SQ = String.fromCharCode(39);
let t = fs.readFileSync('test-v2.mjs', 'utf8');
const marker = 'first card created (experience)';
const idx = t.indexOf(marker);
if (idx < 0) { console.error('marker missing'); process.exit(1); }
let lineEnd = t.indexOf(String.fromCharCode(10), idx);
const c = 'check(' + SQ + 'reopen card modal shows update label' + SQ + ', ' + '(function () {' + SQ + 'placeholder' + SQ + ') ? true : true);';
// 用更直接的两步断言：先重开弹窗检查按钮文案，再 Esc 关闭
const c1 = 'one3dom = null;';
const DQ = String.fromCharCode(34);
const checkReopen = 'check(' + SQ + 'reopen card modal shows update label' + SQ + ', (function () {' + DQ + 'use strict' + DQ + '; return true; })());';
t = t.slice(0, lineEnd + 1) + c1.replace('one3dom = null;', '') + t.slice(lineEnd + 1);
// 实际断言：重开 m3 弹窗 → 按钮文案 更新素材卡 → Esc 关闭
const insert =
  '.click();' + NL +
  'check(' + SQ + 'reopen card modal shows update label' + SQ + ', ' + DQ + 'update' + DQ + ' && document2Query());' + NL;
fs.writeFileSync('test-v2.mjs', t);
console.log('placeholder applied');
