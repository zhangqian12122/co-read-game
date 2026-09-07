const p = require('./game/question-pack.js').questionPack;
const out = [];
out.push('=== 开场 ===');
out.push(p.question.opening);
out.push('=== 检视台词 ===');
Object.entries(p.companion.inspectLines).forEach(([k, v]) => out.push(k + ': ' + v));
out.push('=== 命中/答偏反馈池 ===');
p.companion.reactionHit.concat(p.companion.reactionMiss).forEach((v) => out.push('- ' + v));
out.push('=== 台词矩阵 ===');
Object.entries(p.matrix).forEach(([mid, per]) => {
  Object.entries(per).forEach(([mood, v]) => {
    out.push(mid + '/' + mood + ' 命中: ' + v.hit);
    out.push(mid + '/' + mood + ' 答偏: ' + v.miss);
  });
});
out.push('=== 回信 ===');
Object.entries(p.letters).forEach(([k, v]) => out.push(k + ': ' + v.text));
require('fs').writeFileSync('lines-dump.txt', out.join('\n'), 'utf8');
console.log('exported', out.length, 'lines');
