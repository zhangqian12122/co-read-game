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
    if (count !== 1) { failures.push(file + " #H" + index + " count=" + count); return; }
    text = text.replace(a, r);
  });
  if (failures.length) { console.error("PATCH FAILED:\n" + failures.join("\n")); process.exit(1); }
  fs.writeFileSync(file, text);
  console.log("patched " + file);
}

const EDITS = [
  [
    `<div class="system-clock" id="systemClock">21:08</div>`,
    `<button class="ai-indicator" id="aiIndicator" type="button" aria-label="打开 AI 增强设置"><i aria-hidden="true"></i><span id="aiIndicatorText">AI 增强 · 关</span></button>
      <div class="system-clock" id="systemClock">21:08</div>`
  ],
  [
    `  <script src="./save-system.js?v=20260907-1"></script>`,
    `  <script src="./ai-client.js?v=20260907-2"></script>
  <script src="./save-system.js?v=20260907-1"></script>
  <script src="./app-v1.js?v=20260907-2"></script>`
  ],
  [
    `  <link rel="stylesheet" href="./v1.css?v=20260907-1">`,
    `  <link rel="stylesheet" href="./v1.css?v=20260907-2">`
  ],
  [
    `    <button class="followup-notification" id="followupNotification" type="button" hidden>`,
    `    <section class="app-window ai-settings-window is-closed" id="aiSettingsWindow" aria-labelledby="aiSettingsTitle">
      <header class="titlebar dark-titlebar">
        <div class="titlebar-title" id="aiSettingsTitle">系统设置.exe</div>
        <div class="window-controls">
          <button class="window-control" data-window-action="minimize" type="button" aria-label="最小化系统设置" title="最小化">—</button>
          <button class="window-control" data-window-action="close" type="button" aria-label="关闭系统设置" title="关闭">×</button>
        </div>
      </header>
      <div class="ai-settings-content">
        <span class="eyebrow">AI 增强 / 实验功能</span>
        <h3>给共读伙伴接上真实的大模型</h3>
        <p class="ai-settings-note">关闭或未配置时，伙伴使用内置脚本，游戏流程完整可玩。所有配置只保存在本机浏览器。</p>
        <label class="ai-field ai-toggle-field"><input type="checkbox" id="aiEnabledToggle"><span>启用 AI 增强模式</span></label>
        <label class="ai-field"><span>接口地址（OpenAI 兼容）</span><input id="aiBaseUrl" type="text" placeholder="https://open.bigmodel.cn/api/paas/v4" autocomplete="off"></label>
        <label class="ai-field"><span>API Key</span><input id="aiApiKey" type="password" placeholder="粘贴服务商提供的密钥" autocomplete="off"></label>
        <label class="ai-field"><span>模型名</span><input id="aiModel" type="text" placeholder="glm-4-flash" autocomplete="off"></label>
        <div class="ai-settings-actions">
          <button class="secondary-action" id="aiTestButton" type="button">测试连接</button>
          <span id="aiTestResult" aria-live="polite"></span>
        </div>
        <div class="ai-preset-row">
          <span>快速填入：</span>
          <button class="text-action" data-ai-preset="zhipu" type="button">智谱 GLM</button>
          <button class="text-action" data-ai-preset="deepseek" type="button">DeepSeek</button>
        </div>
      </div>
    </section>

    <button class="followup-notification" id="followupNotification" type="button" hidden>`
  ]
];

patch("v1.html", EDITS);
