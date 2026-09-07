// engine.js - 回答主游戏 v2 引擎（M0：接题→共读的选材料闭环；M2 在此扩展候选句/卡牌对话）
(() => {
  const shell = () => window.CoReadV2Shell;
  const state = {
    stage: "boot",
    attention: 2,
    attentionMax: 2,
    selected: [],
    inspected: new Set()
  };

  function el(name) { return shell().elements[name]; }

  function renderAttention() {
    const pips = el("attentionPips");
    pips.innerHTML = "";
    for (let i = 0; i < state.attentionMax; i += 1) {
      const pip = document.createElement("span");
      if (i < state.selected.length) pip.className = "is-used";
      pips.append(pip);
    }
    el("attentionText").textContent = (state.attentionMax - state.selected.length) + " / " + state.attentionMax;
  }

  function renderMaterials() {
    const pack = shell().pack;
    const list = el("materialList");
    list.innerHTML = "";
    if (!pack) return;
    pack.materials.forEach((material) => {
      const selected = state.selected.includes(material.id);
      const inspected = state.inspected.has(material.id);
      const locked = state.selected.length >= state.attention && !selected;
      const card = document.createElement("article");
      card.className = "material-card" + (selected ? " is-selected" : "") + (locked ? " is-locked" : "");
      card.dataset.materialId = material.id;
      card.innerHTML =
        '<div class="material-topline"><span class="source-kind">' + material.kindLabel + "</span><span class=\"material-date\">" + material.date + "</span></div>" +
        "<h3>" + material.title + "</h3><p>" + material.excerpt + "</p>" +
        '<div class="material-meta"><span>' + material.author + "</span><span>·</span><span>" + material.engagement + "</span></div>" +
        '<div class="material-actions"><button class="text-action inspect-material" type="button">' + (inspected ? "再次查看" : "展开检查") + '</button><button class="send-action select-material" type="button"' + (locked || !inspected ? " disabled" : "") + ">" + (selected ? "已在素材桌" : locked ? "注意力不够了" : !inspected ? "先打开看看" : "递给共读伙伴") + "</button></div>";
      card.querySelector(".inspect-material").addEventListener("click", () => openMaterial(material));
      card.querySelector(".select-material").addEventListener("click", () => selectMaterial(material));
      list.append(card);
    });
  }

  function openMaterial(material) {
    state.inspected.add(material.id);
    shell().toast("已展开「" + material.title + "」——候选句挑选将在下一步接入。");
    renderMaterials();
  }

  function selectMaterial(material) {
    if (state.selected.includes(material.id)) { shell().toast("这份材料已经在素材桌上了。"); return; }
    if (state.selected.length >= state.attention) { shell().toast("注意力只够细读两份，先放回一份。"); return; }
    state.selected.push(material.id);
    shell().setAiText("这份是「" + material.kindLabel + "」。先看看署名和日期，再决定信它几分。");
    renderMaterials();
    renderAttention();
    renderTray();
    if (state.selected.length >= state.attention) {
      el("synthesizeButton").disabled = false;
      el("synthesizeButton").textContent = "素材卡就绪，去找他聊聊";
      shell().setStage(2);
    }
  }

  function renderTray() {
    const pack = shell().pack;
    const tray = el("selectedMaterials");
    tray.innerHTML = "";
    el("emptyDrop").hidden = state.selected.length > 0;
    el("trayCount").textContent = state.selected.length + " / " + state.attentionMax + " 份材料";
    state.selected.forEach((id) => {
      const material = pack.materials.find((m) => m.id === id);
      const item = document.createElement("article");
      item.className = "tray-item";
      item.innerHTML = "<strong>" + material.kindLabel + "</strong><span>" + material.title + "</span>";
      tray.append(item);
    });
  }

  function onShellReady() {
    state.stage = "research";
    const pack = shell().pack;
    if (!pack) { shell().toast("文案包未加载"); return; }
    shell().fillQuestion(pack.question);
    el("researchInstruction").textContent = "注意力只够细读两份。先打开材料看清作者和日期，再决定把哪份递给伙伴。";
    renderAttention();
    renderMaterials();
    renderTray();
    shell().setStage(1);
    shell().focusWindow("browserWindow");
    shell().toast("收到一条来自林一舟的求助");
  }

  window.CoReadEngine = { onShellReady, state };
})();
