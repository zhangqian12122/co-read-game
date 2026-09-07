const fs = require("fs");
const text = fs.readFileSync("app-v1.js", "utf8");
const needle = "startButton: $(\"startButton\"), chapterName";
console.log("count=", text.split(needle).length - 1);
const idx = text.indexOf("startButton: ");
console.log(JSON.stringify(text.slice(idx, idx + 60)));
const e3 = "  bindWindowManager();\n  bindEvents();\n}";
console.log("e3 count=", text.split(e3).length - 1);
