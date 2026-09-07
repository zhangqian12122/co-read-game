const fs = require("fs");
const file = process.argv[2];
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
let bad = 0;
lines.forEach((line, i) => {
  const count = (line.match(/\x22/g) || []).length;
  if (count % 2 === 1) {
    bad += 1;
    console.log((i + 1) + ": " + line.trim().slice(0, 100));
  }
});
console.log("odd-quote-lines=" + bad);
