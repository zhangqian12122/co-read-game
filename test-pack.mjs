// test-pack.mjs - 挂号题文案包 schema 校验（纯 Node，无 jsdom）
import { createRequire } from 'module';
const require2 = createRequire(import.meta.url);
const { questionPack: pack, validatePack } = require2('./game/question-pack.js');

let failed = 0;
const check = (label, ok) => { if (!ok) failed += 1; console.log((ok ? 'PASS ' : 'FAIL ') + label); };

check('schema validatePack 无错误', validatePack(pack).length === 0);
check('材料恰 4 份', pack.materials.length === 4);
check('候选句共 19 句', pack.materials.reduce((n, m) => n + m.sentences.length, 0) === 19);
check('四种材料性质齐全', ['official', 'guide', 'experience', 'asker'].every((k) => pack.materials.some((m) => m.kind === k)));
check('每份材料含广告句或过时句（卡质判定依赖）', pack.materials.every((m) => m.sentences.some((s) => s.type === 'ad' || s.type === 'stale' || m.id === 'm4')));
check('六种回答方式', Object.keys(pack.methods).length === 6);
check('矩阵覆盖 6 方式', Object.keys(pack.matrix).length === 6);
check('矩阵覆盖 4 状态 × hit/miss', Object.values(pack.matrix).every((per) => pack.moodOrder.every((mood) => per[mood] && per[mood].hit && per[mood].miss)));
check('五个组合', pack.combos.length === 5);
check('两版回信', Boolean(pack.letters.good && pack.letters.stale));
check('副锚点材料句存在（m4-s1 医保手续）', pack.materials.find((m) => m.id === 'm4').sentences.some((s) => s.id === 'm4-s1'));

console.log(failed === 0 ? 'ALL PASS' : failed + ' FAILED');
if (failed > 0) process.exit(1);
