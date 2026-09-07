// custom-launcher.js - 「AI 换你出题」入口：回信后可粘贴新问题生成下一局
(() => {
  const shell = () => window.CoReadV2Shell;

  function ensureModal() {
    let modal = document.getElementById("customModal");
    if (modal) return modal;
    modal = document.createElement("section");
    modal.id = "customModal";
    modal.className = "modal-backdrop";
    modal.hidden = true;
    modal.innerHTML =
      '<article class="material-modal" role="dialog" aria-modal="true">' +
      '<header class="modal-header"><div><span class="eyebrow">AI 换你出题</span><h2>下一封求助，由你来写</h2></div>' +
      '<button class="close-modal" id="closeCustomModal" type="button" aria-label="关闭">×</button></header>' +
      '<p class="custom-note">粘贴一段生活类求助（租房/看病/出行/防骗…），AI 会把它变成新的共读档案：四份材料、候选句、来源与回信，全部重新生成。内容为模拟演绎。</p>' +
      '<textarea id="customQuestionInput" rows="7" placeholder="例：第一次一个人坐火车回家，怕坐过站也怕丢东西，需要准备什么？"></textarea>' +
      '<div class="custom-actions"><button class="primary-action" id="customGenerate" type="button">生成并开始</button><span id="customStatus" aria-live="polite"></span></div>' +
      "</article>";
    document.body.append(modal);
    return modal;
  }

  function wire() {
    if (!window.CoReadEngine || !window.CoReadCustom) return;
    const trigger = document.getElementById("customLaunch");
    const modal = ensureModal();
    if (trigger) {
      trigger.addEventListener("click", () => {
        modal.hidden = false;
      });
    }
    const closeBtn = modal.querySelector("#closeCustomModal");
    if (closeBtn) closeBtn.addEventListener("click", () => { modal.hidden = true; });
    const generate = modal.querySelector("#customGenerate");
    const status = modal.querySelector("#customStatus");
    const input = modal.querySelector("#customQuestionInput");
    if (!generate || !input || !status) return;
    generate.addEventListener("click", async () => {
      const text = String(input.value || "").trim();
      if (text.length < 8) { status.textContent = "问题太短了，至少一句话。"; return; }
      if (!window.CoReadAI || !window.CoReadAI.isReady()) { status.textContent = "需要先在「系统设置」开启 AI 增强。"; return; }
      generate.disabled = true;
      status.textContent = "AI 正在生成新档案（材料/候选句/回信）……约 20-40 秒";
      try {
        const pack = await window.CoReadCustom.generatePack(text);
        const err = window.CoReadCustom.validate ? window.CoReadCustom.validate(pack) : null;
        if (err) throw new Error(err);
        window.CoReadV2Pack = pack;
        modal.hidden = true;
        const boot = document.getElementById("bootOverlay");
        if (boot) boot.hidden = true;
        window.CoReadEngine.reset();
        shell().toast("新档案生成完毕，开始共读吧");
      } catch (e) {
        status.textContent = "生成失败：" + (e && e.message ? e.message : "未知错误");
      }
      generate.disabled = false;
    });
  }

  function init() {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
    else wire();
  }
  init();
})();
