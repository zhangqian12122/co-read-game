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
    if (count !== 1) { failures.push(file + " #E" + index + " count=" + count + " anchor=" + JSON.stringify(a).slice(0, 100)); return; }
    text = text.replace(a, r);
  });
  if (failures.length) { console.error("PATCH FAILED:\n" + failures.join("\n")); process.exit(1); }
  fs.writeFileSync(file, text);
  console.log("patched " + file);
}

const EDITS = [
  [
    `startButton: $("#startButton"), chapterName`,
    `startButton: $("#startButton"), continueButton: $("#continueButton"), saveHint: $("#saveHint"), chapterName`
  ],
  [
    `  elements.endingRestart.addEventListener("click", () => window.location.reload());`,
    `  elements.endingRestart.addEventListener("click", () => {
    if (window.CoReadSave) window.CoReadSave.clear();
    window.location.reload();
  });`
  ],
  [
    `  elements.startButton.addEventListener("click", startGame);`,
    `  elements.startButton.addEventListener("click", handleStartButton);`
  ],
  [
    `  bindWindowManager();
  bindEvents();
}`,
    `  bindWindowManager();
  bindEvents();
  refreshBootSaveUi();
}`
  ]
];

patch("app-v1.js", EDITS);
