const fs = require("fs");
const D = String.fromCharCode(34);
const q = (s) => s.split("@Q@").join(D);
function patch(file, edits) {
  let text = fs.readFileSync(file, "utf8");
  const failures = [];
  edits.forEach(([anchor, replacement], index) => {
    const a = q(anchor);
    const r = q(replacement);
    const count = text.split(a).length - 1;
    if (count !== 1) { failures.push(file + " #H" + index + " count=" + count + " anchor=" + JSON.stringify(a).slice(0, 100)); return; }
    text = text.replace(a, r);
  });
  if (failures.length) { console.error("PATCH FAILED:\n" + failures.join("\n")); process.exit(1); }
  fs.writeFileSync(file, text);
  console.log("patched " + file);
}

const EDITS = [
  [
    `<button class="boot-button" id="startButton" type="button">以共读答主身份进入 <span>→</span></button><small>回答署名：共读答主 · 你 × 共读伙伴 00</small>`,
    `<button class="boot-button" id="startButton" type="button">以共读答主身份进入 <span>→</span></button>
        <button class="boot-button boot-continue" id="continueButton" type="button" hidden>继续上次共读 <span>→</span></button>
        <small id="saveHint" class="boot-save-hint" hidden></small>
        <small>回答署名：共读答主 · 你 × 共读伙伴 00</small>`
  ],
  [
    `<script src="./app-v1.js?v=20260902-76"></script>`,
    `<script src="./save-system.js?v=20260907-1"></script>
  <script src="./app-v1.js?v=20260907-1"></script>`
  ],
  [
    `<link rel="stylesheet" href="./v1.css?v=20260902-76">`,
    `<link rel="stylesheet" href="./v1.css?v=20260907-1">`
  ]
];

const CSS_APPEND = `
/* —— 存档：启动页继续按钮 —— */
.boot-content .boot-continue {
  display: block;
  margin-top: 10px;
  color: #dfe9ee;
  background: transparent;
  border: 2px solid #5f7d92;
  box-shadow: 4px 4px 0 rgba(23, 62, 111, .6);
}

.boot-content .boot-continue:hover {
  box-shadow: 6px 6px 0 rgba(23, 62, 111, .6);
}

.boot-content > .boot-save-hint {
  bottom: 34px;
  color: #a9b6c9;
  font: 9px/1 var(--mono-font);
}
`;

patch("v1.html", EDITS);
fs.appendFileSync("v1.css", CSS_APPEND);
console.log("appended v1.css");
