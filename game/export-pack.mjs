// export-pack.mjs - 把挂号题文案包导出为 markdown（给队友替换/扩写用）
// 运行：node game/export-pack.mjs  →  输出 docs/挂号题文案包.md
import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
const require2 = createRequire(import.meta.url);
const { questionPack: pack, validatePack } = require2("./question-pack.js");

const errors = validatePack(pack);
if (errors.length) { console.error("文案包校验失败：", errors.join("; ")); process.exit(1); }

const q = pack.question;
const typeLabel = { dry: "干货", fluff: "废话", ad: "广告", stale: "过时" };
const L = [];
L.push("# 挂号题 · 文案包（demo 题 / 档案 02）");
L.push("");
L.push("> 由 game/question-pack.js 自动导出（node game/export-pack.mjs）。改文案请改 question-pack.js 后重新导出。");
L.push("");
L.push("## 一、求助");
L.push("- 标题：" + q.title);
L.push("- 分类：" + q.kicker);
L.push("- 描述：" + q.body);
L.push("- 求助者：" + q.askerName);
L.push("- 主锚点（隐藏）：" + q.mainAnchor);
L.push("- 副锚点（隐藏）：" + q.subAnchor);
L.push("- 开场白：" + q.opening);
L.push("- 耐心基线：" + q.patienceBase + " 格");
L.push("");
L.push("## 二、材料与候选句（玩家最多选 3 句做成素材卡）");
pack.materials.forEach((m) => {
  L.push("");
  L.push("### " + m.kindLabel + "｜" + m.title);
  L.push("- 作者/日期：" + m.author + " · " + m.date + "（" + m.engagement + "）");
  L.push("- 可信度提示：" + m.caution);
  L.push("- 全文：" + m.body.join(" "));
  L.push("- 候选句：");
  m.sentences.forEach((s) => L.push("  - [" + typeLabel[s.type] + "] " + s.text));
});
L.push("");
L.push("## 三、回答方式（数值）");
Object.entries(pack.methods).forEach(([id, m]) => {
  L.push("- " + m.label + "（" + id + "）：耐心 " + m.cost + " 格，每题至多 " + (m.maxPerQuestion > 90 ? "不限" : m.maxPerQuestion) + " 次，" + m.unlockAt + " 级解锁");
});
L.push("");
L.push("## 四、组合加成");
pack.combos.forEach((c) => L.push("- " + c.label + "：" + c.effect));
L.push("");
L.push("## 五、命中判定（查表执行）");
Object.entries(pack.checks).forEach(([id, c]) => {
  L.push("- " + id + "：" + c.note + (c.needSentence ? "（需素材卡含 " + c.needSentence + "）" : "") + (c.anySentenceOf ? "（需含 " + c.anySentenceOf.join("/") + (c.minCount ? " 至少 " + c.minCount + " 条" : "") + "）" : ""));
});
L.push("");
L.push("## 六、台词矩阵（6 方式 × 4 状态 × 命中/答偏）");
pack.moodOrder.forEach((mood) => {
  L.push("");
  L.push("### 状态：" + pack.moodLabels[mood]);
  Object.entries(pack.matrix).forEach(([id, per]) => {
    L.push("- " + pack.methods[id].label + "｜命中：" + per[mood].hit);
    L.push("- " + pack.methods[id].label + "｜答偏：" + per[mood].miss);
  });
});
L.push("");
L.push("## 七、回信（两版）");
L.push("### 好结局（" + pack.letters.good.days + " 天后）");
L.push("- 来信：" + pack.letters.good.text);
L.push("- 结果：" + pack.letters.good.result);
L.push("### 过时信息结局（" + pack.letters.stale.days + " 天后）");
L.push("- 来信：" + pack.letters.stale.text);
L.push("- 结果：" + pack.letters.stale.result);

mkdirSync(new URL("../docs/", import.meta.url), { recursive: true });
writeFileSync(new URL("../docs/挂号题文案包.md", import.meta.url), L.join("\n"), "utf8");
console.log("导出完成：docs/挂号题文案包.md");
