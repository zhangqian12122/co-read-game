const fs = require('fs');
let t = fs.readFileSync('ai-block.tmp', 'utf8');
t = t.replace(/\("([A-Za-z0-9#\-]+),/g, '("",');
t = t.replace(/\("([A-Za-z0-9#\-]+)\)/g, '("")');
fs.writeFileSync('ai-block.tmp', t);
console.log('repaired');
