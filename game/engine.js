// engine.js - 回答主游戏 v2 引擎（M2/M3：共读→素材卡→卡牌对话→结算→回信 + 存档 v2）
// 查表执行：判定/台词来自 question-pack.js；状态自动存档，刷新后可「继续上次共读」。
(() => {
  const shell = () => window.CoReadV2Shell;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const SAVE_KEY = "coread-v2-save";
  const escapeHtml = (value) => String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const S = {
    stage: "boot",
    attention: 2,
    attentionMax: 2,
    inspected: new Set(),
    cards: {},
    chatLog: [],
    dialogue: null,
    settle: null,
    growth: { proficiency: {}, fans: 0, exp: 0, level: 1, patienceBonus: 0, thinkingBonus: 0, pendingChoice: null, memories: [], library: [] },
    energy: 12,
    energyMax: 12,
    totalExp: 0,
    questionQueue: [],
    questionIndex: 0
  };

  const el = (name) => shell().elements[name] || document.getElementById(name);

  // —— 存档 v2 ——
  function serialize() {
    return {
      stage: S.stage,
      attention: S.attention,
      attentionMax: S.attentionMax,
      energyMax: S.energyMax,
      energy: S.energy,
      totalExp: S.totalExp,
      questionIndex: S.questionIndex,
      questionQueue: S.questionQueue,
      cards: S.cards,
      inspected: Array.from(S.inspected),
      chatLog: S.chatLog,
      growthItems: Array.from(growthSetRef()),
      growth: S.growth,
      dlg: S.dlg ? {
        mood: S.dlg.mood, patience: S.dlg.patience, patienceMax: S.dlg.patienceMax,
        used: S.dlg.used, last: S.dlg.last, lastQuality: S.dlg.lastQuality, lastCombo: S.dlg.lastCombo, lastOutcome: S.dlg.lastOutcome,
        hits: S.dlg.hits, done: S.dlg.done,
        unlocked: S.dlg.unlocked
      } : null,
      settle: S.settle ? { stale: S.settle.stale, hitsCount: S.settle.hitsCount, leaveText: S.settle.leave.text, expGain: S.settle.expGain || 0 } : null
    };
  }

  function save() {
    if (S.stage === "boot") return;
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, stage: S.stage, state: serialize(), savedAt: Date.now() })); } catch (e) { console.log("SAVE-ERR " + e.message); }
  }

  function readSaveJSON() {
    try { return window.localStorage.getItem(SAVE_KEY); } catch (e) { return null; }
  }

  function readSave() {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      return data && data.v === 2 ? data : null;
    } catch (e) { return null; }
  }

  function hasSave() { return Boolean(readSave()); }

  function clearSave() {
    try { window.localStorage.removeItem(SAVE_KEY); } catch (e) { /* 忽略 */ }
  }

  function renderAttention() {
    const pips = el("attentionPips");
    pips.innerHTML = "";
    const usedAttention = attentionUsed();
    for (let i = 0; i < S.attentionMax; i += 1) {
      const pip = document.createElement("span");
      if (i < usedAttention) pip.className = "is-used";
      pips.append(pip);
    }
    el("attentionText").textContent = (S.attentionMax - usedAttention) + " / " + S.attentionMax;
    renderResourceHud();
  }

  function attentionUsed() {
    return Object.values(S.cards).filter((card) => !card.fromLibrary).length;
  }

  function attentionCountLabel() {
    return S.attentionMax >= 3 ? "三" : "两";
  }

  function renderResourceHud() {
    const cardCount = attentionUsed();
    const attentionLeft = Math.max(0, S.attentionMax - attentionUsed());
    const setMeter = (textId, fillId, current, max) => {
      const text = document.getElementById(textId);
      const fill = document.getElementById(fillId);
      if (text) text.textContent = max > 0 ? current + " / " + max : "—";
      if (fill) fill.style.width = (max > 0 ? Math.max(0, Math.min(100, current / max * 100)) : 0) + "%";
    };
    setMeter("hudAttention", "hudAttentionFill", attentionLeft, S.attentionMax);
    const patienceMax = S.dlg ? S.dlg.patienceMax : 0;
    setMeter("hudPatience", "hudPatienceFill", S.dlg ? S.dlg.patience : 0, patienceMax);
    const patienceChip = document.querySelector('.resource-chip[data-resource="patience"]');
    const patienceValue = S.dlg ? S.dlg.patience : 0;
    const patienceCritical = Boolean(S.dlg && patienceMax > 0 && patienceValue <= Math.max(2, Math.ceil(patienceMax * 0.25)));
    if (patienceChip) {
      patienceChip.classList.toggle("is-critical", patienceCritical);
      patienceChip.setAttribute("aria-label", S.dlg ? "耐心 " + patienceValue + " / " + patienceMax + (patienceCritical ? "，危险：再消耗几次可能结束对话" : "") : "耐心尚未开始");
    }
    const mood = document.getElementById("hudMood");
    if (mood) {
      const labels = shell().pack && shell().pack.moodLabels;
      const moodKey = S.dlg ? S.dlg.moodOrder[S.dlg.mood] : "idle";
      mood.textContent = S.dlg && labels ? (labels[moodKey] || "进行中") : "未开始";
      const moodChip = mood.closest('.resource-chip[data-resource="mood"]');
      if (moodChip) {
        moodChip.dataset.mood = moodKey;
        moodChip.setAttribute("aria-label", "求助者状态：" + mood.textContent);
      }
    }
    const cards = document.getElementById("hudCards");
    if (cards) cards.textContent = cardCount + " / " + S.attentionMax;
    const nightNumber = Math.min(S.questionIndex + 1, S.questionQueue.length || 12);
    const nightTotal = S.questionQueue.length || 12;
    const season = document.getElementById("hudSeason");
    if (season) season.textContent = "第 " + nightNumber + " 晚 / " + nightTotal;
    const exp = document.getElementById("hudExp");
    const fans = document.getElementById("hudFans");
    if (exp) exp.textContent = String(S.growth.exp || 0);
    if (fans) fans.textContent = String(S.growth.fans || 0);
    const hud = document.getElementById("resourceHud");
    if (hud) {
      const phase = S.stage || "boot";
      hud.setAttribute("aria-label", "第 " + nightNumber + " 晚状态");
      const night = document.getElementById("hudNight");
      if (night) night.textContent = "第 " + nightNumber + " 晚";
      const active = phase === "research"
        ? ["attention", "cards", "season"]
        : phase === "dialogue"
          ? ["patience", "mood", "cards", "season"]
          : phase === "settle" || phase === "letter"
            ? ["exp", "fans", "season"]
            : [];
      hud.dataset.phase = phase;
      $$(".resource-chip", hud).forEach((chip) => chip.classList.toggle("is-active", active.includes(chip.dataset.resource)));
      const phaseLabel = { boot: "准备开始", research: "共读材料 · 看证据", dialogue: "回答对话 · 看状态", settle: "本局结算 · 看入账", letter: "几天后来信 · 看结果" };
      const phaseText = document.getElementById("hudPhase");
      if (phaseText) phaseText.textContent = phaseLabel[phase] || "共读现场";
    }
  }

  function growthLevel(exp) {
    return Math.min(6, 1 + Math.floor(Math.max(0, Number(exp) || 0) / 8));
  }

  function normalizeGrowth() {
    if (!S.growth || typeof S.growth !== "object") S.growth = { proficiency: {}, fans: 0, exp: 0, level: 1, patienceBonus: 0, thinkingBonus: 0, pendingChoice: null, memories: [], library: [] };
    if (!S.growth.proficiency || typeof S.growth.proficiency !== "object") S.growth.proficiency = {};
    if (!Number.isFinite(S.growth.fans)) S.growth.fans = 0;
    if (!Number.isFinite(S.growth.exp)) S.growth.exp = 0;
    if (!Number.isFinite(S.growth.patienceBonus)) S.growth.patienceBonus = 0;
    if (!Number.isFinite(S.growth.thinkingBonus)) S.growth.thinkingBonus = 0;
    if (S.growth.pendingChoice && !Number.isFinite(S.growth.pendingChoice.level)) S.growth.pendingChoice = null;
    if (!Array.isArray(S.growth.library)) S.growth.library = [];
    S.growth.level = growthLevel(S.growth.exp);
    if (!Array.isArray(S.growth.memories)) S.growth.memories = [];
  }

  function unlockedMethodsForGrowth() {
    normalizeGrowth();
    const unlocked = ["empathy", "probe", "advice", "checklist"];
    if (S.growth.level >= 2) unlocked.push("story");
    if (S.growth.level >= 3) unlocked.push("tradeoff");
    return unlocked;
  }

  function growthChoiceOptions() {
    normalizeGrowth();
    return [
      {
        id: "focus",
        icon: "◈",
        title: "多看一份材料",
        text: S.attentionMax < 3 ? "以后每题注意力上限 +1。最多提升到 3。" : "注意力已经到上限，改为让清单方式熟练度 +2。"
      },
      {
        id: "calm",
        icon: "♥",
        title: "多留一句余地",
        text: S.growth.patienceBonus < 2 ? "以后对话开始时耐心上限 +1。最多提升两次。" : "耐心加成已经到上限，改为共情方式熟练度 +2。"
      },
      {
        id: "thinking",
        icon: "✦",
        title: "把思路练成组合",
        text: S.growth.thinkingBonus < 2 ? "触发组合时额外推进 1 格状态。最多提升两次。" : "组合加成已经到上限，改为追问方式熟练度 +2。"
      }
    ];
  }

  function applyGrowthChoice(id) {
    normalizeGrowth();
    if (id === "focus") {
      if (S.attentionMax < 3) {
        S.attentionMax += 1;
        S.attention = Math.min(3, S.attention + 1);
      }
      else S.growth.proficiency.checklist = (S.growth.proficiency.checklist || 0) + 2;
    } else if (id === "calm") {
      if (S.growth.patienceBonus < 2) S.growth.patienceBonus += 1;
      else S.growth.proficiency.empathy = (S.growth.proficiency.empathy || 0) + 2;
    } else if (id === "thinking") {
      if (S.growth.thinkingBonus < 2) S.growth.thinkingBonus += 1;
      else S.growth.proficiency.probe = (S.growth.proficiency.probe || 0) + 2;
    }
    S.growth.pendingChoice = null;
    renderAttention();
    renderGrowthHistory();
    save();
    const selected = growthChoiceOptions().find((option) => option.id === id);
    shell().toast(selected ? "成长已记录：" + selected.title : "成长已记录");
  }

  function showGrowthChoice() {
    normalizeGrowth();
    const pending = S.growth.pendingChoice;
    const overlay = document.getElementById("growthOverlay");
    const list = document.getElementById("growthChoices");
    if (!pending || !overlay || !list) return;
    const title = document.getElementById("growthChoiceTitle");
    const copy = document.getElementById("growthChoiceCopy");
    if (title) title.textContent = "伙伴默契升到 Lv." + pending.level + " · 选一张成长卡";
    if (copy) copy.textContent = "这一张会留在后面的共读里。选完后才能继续下一封求助。";
    list.innerHTML = growthChoiceOptions().map((option) =>
      '<button class="growth-choice" type="button" data-growth-choice="' + option.id + '">' +
      '<span class="growth-choice-icon" aria-hidden="true">' + option.icon + '</span>' +
      '<strong>' + option.title + '</strong><small>' + option.text + '</small></button>'
    ).join("");
    $$("[data-growth-choice]", list).forEach((button) => {
      button.addEventListener("click", () => {
        applyGrowthChoice(button.dataset.growthChoice);
        overlay.hidden = true;
      });
    });
    overlay.hidden = false;
  }

  function renderMaterials() {
    const pack = shell().pack;
    const list = el("materialList");
    list.innerHTML = "";
    pack.materials.forEach((material) => {
      const hasCard = Boolean(S.cards[material.id]);
      const locked = attentionUsed() >= S.attentionMax && !hasCard;
      const inspected = S.inspected.has(material.id);
      const qualityKey = S.cards[material.id] && S.cards[material.id].quality ? S.cards[material.id].quality.key : "";
      const card = document.createElement("article");
      card.className = "material-card" + (hasCard ? " is-selected" : "") + (qualityKey === "waste" ? " is-waste-card" : "") + (locked ? " is-locked" : "");
      card.dataset.materialId = material.id;
      card.innerHTML =
        '<div class="material-topline"><span class="source-kind">' + escapeHtml(material.kindLabel) + '</span><span class="material-date">' + escapeHtml(material.date) + '</span></div>' +
        "<h3>" + escapeHtml(material.title) + "</h3><p>" + escapeHtml(material.excerpt) + "</p>" +
        '<div class="material-meta"><span>' + escapeHtml(material.author) + '</span><span>·</span><span>' + escapeHtml(material.engagement) + "</span></div>" +
        '<div class="material-actions"><button class="text-action inspect-material" type="button">' + (S.cards[material.id] ? "查看已锁定卡" : inspected ? "再次展开" : "展开检查") + '</button><span class="pick-state">' + (qualityKey === "waste" ? "已锁定废卡：" + escapeHtml(S.cards[material.id].quality.why) : S.cards[material.id] ? "已锁定素材卡" : locked ? "注意力不够了" : "") + "</span></div>";
      const inspectButton = card.querySelector(".inspect-material");
      const openOrExplainLocked = () => {
        if (locked && !hasCard) {
          shell().toast("注意力已经用完了，先完成当前" + attentionCountLabel() + "份素材卡。");
          return;
        }
        openMaterial(material);
      };
      if (inspectButton) {
        inspectButton.addEventListener("click", (event) => {
          event.stopPropagation();
          openOrExplainLocked();
        });
      }
      card.addEventListener("click", (event) => {
        if (event.target.closest(".inspect-material")) return;
        openOrExplainLocked();
      });
      list.append(card);
    });
  }

  function tagLabel(tagId) {
    const found = shell().pack.materials.find((m) => m.kind === tagId);
    return found ? found.kindLabel : tagId;
  }

  function renderTray() {
    const tray = el("selectedMaterials");
    tray.innerHTML = "";
    const ids = Object.keys(S.cards);
    el("emptyDrop").hidden = ids.length > 0;
    el("trayCount").textContent = "新卡 " + attentionUsed() + " / " + S.attentionMax + " · 桌面 " + ids.length + " 张";
    ids.forEach((id) => {
      const cardInfo = S.cards[id];
      const material = shell().pack.materials.find((m) => m.id === id) || cardInfo.materialSnapshot;
      if (!material) return;
      const item = document.createElement("article");
      item.className = "tray-item" + (cardInfo.fromLibrary ? " is-library-card" : "") + (cardInfo.quality && cardInfo.quality.key === "waste" ? " is-waste-card" : "");
      const methodHint = methodHintForCard(material, cardInfo);
      const useHint = cardInfo.fromLibrary
        ? " · 旧卡参考：本题效果减半"
        : cardInfo.quality && cardInfo.quality.key === "waste"
        ? " · 废卡：" + escapeHtml(cardInfo.quality.why)
        : " · 推荐：" + escapeHtml(methodHint || "先根据对方状态选择");
      const sourceLabel = cardInfo.fromLibrary ? "素材库" : tagLabel(cardInfo.tag);
      item.innerHTML = "<strong>" + escapeHtml(material.kindLabel) + "</strong><span>" + escapeHtml(material.title) + "（" + cardInfo.sentenceIds.length + " 句 · 来源标「" + escapeHtml(sourceLabel) + "」）" + useHint + "</span>";
      tray.append(item);
    });
    const ready = attentionUsed() >= S.attentionMax;
    el("synthesizeButton").disabled = !ready;
    el("synthesizeButton").textContent = ready ? "素材卡就绪，去找他聊聊" : "挑好句子，去找他聊聊";
  }

  // —— 素材卡弹窗 ——
  let modalMaterial = null;
  let pickedIds = [];
  let pickedTag = null;
  let modalBound = false;
  let modalTrigger = null;

  function closeMaterialModal() {
    const modal = $("#materialModal");
    if (!modal) return;
    modal.hidden = true;
    if (modalTrigger && typeof modalTrigger.focus === "function") modalTrigger.focus();
    modalTrigger = null;
  }

  function modalFeedback(message) {
    const feedback = el("modalFeedback");
    if (!feedback) return;
    feedback.textContent = message || "";
    feedback.hidden = !message;
  }

  function modalSelectionHint(message) {
    const hint = el("modalSelectionHint");
    if (hint) hint.textContent = message || "先选和问题步骤直接相关的句子。";
  }

  function explainSentence(sentence) {
    if (sentence.type === "ad") return "提示：这句更像推广内容，放进素材卡容易变成废卡。";
    if (sentence.type === "stale") return "提示：这句来自过时信息，先核对日期，谨慎放进素材卡。";
    if (sentence.type === "fluff") return "提示：这句偏经历或闲聊，能增加语气，但不是最硬的依据。";
    return "提示：这句和问题步骤直接相关，可以作为回答依据。";
  }

  function sentenceRiskClass(sentence) {
    if (sentence.type === "ad" || sentence.type === "stale") return " is-risk-sentence";
    return "";
  }

  function focusModalControl(selector) {
    window.requestAnimationFrame(() => el(selector)?.focus());
  }

  function openMaterial(material) {
    modalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalMaterial = material;
    pickedIds = [];
    pickedTag = null;
    S.inspected.add(material.id);
    const existing = S.cards[material.id];
    if (existing) { pickedIds = existing.sentenceIds.slice(); pickedTag = existing.tag; }
    el("modalKind").textContent = material.kindLabel;
    el("modalTitle").textContent = material.title;
    el("modalLedger").innerHTML =
      '<div class="ledger-item"><span>作者 / 来源</span><strong>' + escapeHtml(material.author) + "</strong></div>" +
      '<div class="ledger-item"><span>发布时间</span><strong>' + escapeHtml(material.date) + "</strong></div>" +
      '<div class="ledger-item"><span>可信度提示</span><strong>' + escapeHtml(material.caution) + "</strong></div>";
    el("modalBodyText").innerHTML = material.body.map((p) => "<p>" + escapeHtml(p) + "</p>").join("");
    const inspectLines = shell().pack.companion && shell().pack.companion.inspectLines;
    if (inspectLines && inspectLines[material.id] && !S.cards[material.id]) shell().setAiText(inspectLines[material.id]);
    const list = el("sentenceList");
    list.innerHTML = "";
    material.sentences.forEach((sentence) => {
      const button = document.createElement("button");
      button.className = "sentence-item" + sentenceRiskClass(sentence) + (pickedIds.includes(sentence.id) ? " is-picked" : "");
      button.type = "button";
      button.disabled = Boolean(existing);
      button.dataset.sentenceId = sentence.id;
      button.textContent = sentence.text;
      if (sentence.type === "ad") button.title = "风险提示：广告或推广句，建议不要选";
      else if (sentence.type === "stale") button.title = "风险提示：过时信息，建议先核对日期";
      else if (sentence.type === "fluff") button.title = "普通提示：经历或闲聊，不能单独作为硬依据";
      else button.title = "可用提示：和问题步骤直接相关";
      button.addEventListener("click", () => {
        modalSelectionHint(explainSentence(sentence));
        const idx = pickedIds.indexOf(sentence.id);
        if (idx >= 0) pickedIds.splice(idx, 1);
        else if (pickedIds.length < 3) pickedIds.push(sentence.id);
        else { shell().toast("素材卡最多放三句，先取消一句。"); return; }
        button.classList.toggle("is-picked", pickedIds.includes(sentence.id));
        refreshModal();
      });
      list.append(button);
    });
    const tags = el("tagOptions");
    tags.innerHTML = "";
    const kindLabels = { official: "官方信息", guide: "老攻略", experience: "个人经历", asker: "提问者补充" };
    Object.keys(kindLabels).forEach((kind) => {
      const button = document.createElement("button");
      button.className = "tag-option" + (pickedTag === kind ? " is-picked" : "");
      button.type = "button";
      button.disabled = Boolean(existing);
      button.dataset.tag = kind;
      button.textContent = kindLabels[kind];
      button.addEventListener("click", () => {
        pickedTag = kind;
        $$(".tag-option", tags).forEach((b) => b.classList.toggle("is-picked", b === button));
        refreshModal();
      });
      tags.append(button);
    });
    refreshModal();
    document.getElementById("modalConfirm").textContent = existing ? "素材卡已锁定" : "做成素材卡";
    if (existing) modalFeedback("这张素材卡已经确认，按照规则不能重选。你可以查看它在后续对话中的用途。");
    else modalFeedback("");
    modalSelectionHint("");
    $("#materialModal").hidden = false;
    window.requestAnimationFrame(() => el("sentenceList").querySelector(".sentence-item")?.focus());
    shell().guide("modal", "伙伴划出了候选句：点句子挑进素材卡（最多 3 句），再给材料标来源，标错了会出废卡。", "#sentenceList");
  }

  function refreshModal() {
    el("sentenceCount").textContent = pickedIds.length + " / 3";
    $("#modalConfirm").disabled = Boolean(modalMaterial && S.cards[modalMaterial.id]);
    if (!pickedIds.length) {
      modalSelectionHint("先选和问题步骤直接相关的句子。");
      return;
    }
    if (!pickedTag) {
      modalSelectionHint("句子已选好，再标对来源，才能判断这张卡能不能用。");
      return;
    }
    const preview = calcQuality(modalMaterial, { sentenceIds: pickedIds, tag: pickedTag });
    if (preview.key === "premium") modalSelectionHint("当前组合：精华卡，适合用来推进对话。");
    else if (preview.key === "waste") modalSelectionHint("当前组合有风险：" + preview.why + "。可以取消带风险的句子再确认。");
    else modalSelectionHint("当前组合：普通卡，可以使用，但效果不会额外增强。");
  }

  function calcQuality(material, card) {
    const sents = material.sentences.filter((s) => card.sentenceIds.includes(s.id));
    if (sents.some((s) => s.type === "ad")) return { key: "waste", why: "混进了广告句" };
    if (sents.some((s) => s.type === "stale")) return { key: "waste", why: "过时句没有处理（" + material.date + " 的信息）" };
    if (card.tag !== material.kind) return { key: "waste", why: "来源标错了（其实是「" + material.kindLabel + "」）" };
    if (sents.every((s) => s.type === "dry")) return { key: "premium", why: "句句对题" };
    return { key: "normal", why: "干货里带了一两句闲话" };
  }

  function methodHintForCard(material, card) {
    const checks = shell().pack.checks || {};
    const labels = shell().pack.methods || {};
    const picked = new Set(card.sentenceIds || []);
    return Object.keys(checks).filter((methodId) => {
      const check = checks[methodId] || {};
      if (check.needSentence) return picked.has(check.needSentence);
      if (Array.isArray(check.anySentenceOf)) {
        const count = check.anySentenceOf.filter((id) => picked.has(id)).length;
        return count >= (check.minCount || 1);
      }
      return false;
    }).map((methodId) => labels[methodId] && labels[methodId].label).filter(Boolean).slice(0, 3).join(" / ");
  }

  function confirmCard() {
    if (!modalMaterial) return;
    if (S.cards[modalMaterial.id]) {
      modalFeedback("这张素材卡已经锁定，不能重新选择。请带着这次选择进入对话。");
      return;
    }
    if (!pickedIds.length) {
      modalFeedback("还没有挑候选句：至少选 1 句，再做成素材卡。");
      focusModalControl("#sentenceList .sentence-item");
      return;
    }
    if (!pickedTag) {
      modalFeedback("还没有标来源：请选择官方信息、老攻略、个人经历或提问者补充。");
      focusModalControl("#tagOptions .tag-option");
      return;
    }
    const material = modalMaterial;
    const card = { tag: pickedTag, sentenceIds: pickedIds.slice() };
    card.quality = calcQuality(material, card);
    S.cards[material.id] = card;
    closeMaterialModal();
    renderMaterials();
    renderTray();
    renderAttention();
    save();
    if (card.quality.key === "waste") shell().toast("这张素材卡已标红：结算时会判为废卡，请注意广告、过时句和来源。");
    const count = attentionUsed();
    const rl = shell().pack.companion.researchLines;
    if (count === 1) shell().setAiText(rl.firstMaterial.replace("{kind}", material.kindLabel));
    if (count >= S.attentionMax) {
      shell().setAiText(rl.bothMaterials);
      shell().guide("cards", attentionCountLabel() + "张素材卡就绪：点素材卡桌下的「去找他聊聊」，开始回答。", "#synthesizeButton");
      shell().toast(attentionCountLabel() + "份素材卡就绪：打开「回答对话」开始回复");
    }
  }

  function aiReady() {
    // 伙伴建议使用本地规则，不连接外部服务。
    return true;
  }

  function aiSuggest() {
    const D = S.dlg;
    if (!D || D.done || D.suggested) return;
    D.suggested = true;
    const preferred = D.mood === 0 ? ["empathy", "probe"] : D.mood === 1 ? ["probe", "empathy", "advice"] : ["advice", "checklist", "story", "tradeoff"];
    const methodId = preferred.concat(D.unlocked).find((id) => {
      const conf = D.pack.methods[id];
      return conf && D.unlocked.includes(id) && (D.used[id] || 0) < conf.maxPerQuestion && D.patience >= conf.cost;
    });
    if (!methodId) {
      shell().setAiText("耐心快用完了，先收尾比较好。");
      chatMsg("companion", "共读伙伴 00", "耐心快用完了，先收尾比较好。");
    } else {
      const label = D.pack.methods[methodId].label;
      const reason = methodId === "empathy" ? "先接住他的情绪" : methodId === "probe" ? "先问清楚具体情况" : "可以给一个可执行方向";
      chatMsg("companion", "共读伙伴 00", "我建议打「" + label + "」——" + reason + "。你来决定。 ");
      shell().setAiText("这是本地提示，最后还是你来定。");
    }
    renderDialogueUI();
    save();
  }

  function bindModal() {
    if (modalBound) return;
    modalBound = true;
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const modal = document.getElementById("materialModal");
        if (modal && !modal.hidden) closeMaterialModal();
      }
    });
    $("#closeMaterialModal").onclick = closeMaterialModal;
    $("#modalCancel").onclick = closeMaterialModal;
    $("#modalConfirm").onclick = confirmCard;
  }

  // —— 卡牌对话 ——
  const playerLines = {
    empathy: "第一次都这样，谁都有第一次，别怕，我们一步步来。",
    probe: "那个……学校医保的手续，你办了吗？",
    advice: "我的建议：先把医保手续办好，再按官方流程挂号。",
    story: "讲个别人的第一次——他也在大厅站了十分钟不敢动，后来发现跟着指示牌走就行。",
    checklist: "清单给你：①身份证 ②医保码 ③导诊台问科室 ④报到机报到。",
    tradeoff: "咱们把两条路的利弊摆一摆……"
  };

  function chatMsg(who, name, text, quote) {
    S.chatLog.push({ who, name, text, quote: quote || "" });
    renderChatLine(S.chatLog[S.chatLog.length - 1]);
  }

  function renderChatLine(entry) {
    const thread = el("chatThread");
    const msg = document.createElement("div");
    msg.className = "chat-msg is-" + entry.who;
    const avatar = document.createElement("span");
    avatar.className = "chat-avatar";
    avatar.textContent = entry.who === "asker" ? (shell().pack.question.askerShort || "?").slice(0, 1) : entry.who === "player" ? "你" : "00";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    const strong = document.createElement("strong");
    strong.textContent = entry.name;
    const p = document.createElement("p");
    p.textContent = entry.text;
    bubble.append(strong, p);
    if (entry.quote) {
      const q = document.createElement("p");
      q.className = "chat-quote";
      q.textContent = "「" + entry.quote + "」";
      bubble.append(q);
    }
    msg.append(avatar, bubble);
    thread.append(msg);
    thread.scrollTop = thread.scrollHeight;
  }

  function renderChatLog() {
    el("chatThread").innerHTML = "";
    S.chatLog.forEach(renderChatLine);
  }

  function dialogueGuidance(D) {
    if (D.patience <= 2 && D.mood < D.moodOrder.length - 1) return "耐心见底：优先使用 1 耐心的方式牌，别再冒险。";
    const moodKey = D.moodOrder[D.mood];
    if (moodKey === "panic") return "他还在慌：先用共情接住，再用追问问清。";
    if (moodKey === "dazed") return "他开始听懂：用追问问清细节，再给建议。";
    if (moodKey === "getting") return "他正在了解：用建议或清单把下一步讲清。";
    return "他已经踏实，可以收尾。";
  }

  function renderDialogueUI() {
    const D = S.dlg;
    if (!D) return;
    const pips = el("patiencePips");
    pips.innerHTML = "";
    for (let i = 0; i < D.patienceMax; i += 1) {
      const pip = document.createElement("span");
      if (i >= D.patience) pip.className = "is-spent";
      pips.append(pip);
    }
    el("patienceText").textContent = D.patience + " / " + D.patienceMax;
    $$("#moodPips .mood-pip").forEach((pip) => {
      const idx = D.moodOrder.indexOf(pip.dataset.mood);
      pip.classList.toggle("is-reached", idx < D.mood);
      pip.classList.toggle("is-current", idx === D.mood);
    });
    $$("#handCards .method-card").forEach((button) => {
      if (button.id === "aiSuggestButton") {
        button.disabled = D.done || D.suggested || !aiReady();
        const small = button.querySelector("small");
        if (small) small.textContent = D.suggested ? "本题已用完" : "本地提示 · 每题 1 次";
        button.title = D.suggested ? "本题的本地建议已经看过" : "伙伴会根据当前情绪给一个本地提示，不连接真实 API";
        button.setAttribute("aria-label", "00 的建议，" + (D.suggested ? "本题已用完" : "每题一次的本地提示"));
        return;
      }
      const id = button.dataset.method;
      const conf = D.pack.methods[id];
      const unlocked = D.unlocked.includes(id);
      const usedOut = (D.used[id] || 0) >= conf.maxPerQuestion;
      const tooCheap = D.patience < conf.cost;
      button.disabled = !unlocked || usedOut || tooCheap || Boolean(D.done);
      button.classList.toggle("is-locked", !unlocked);
      const small = button.querySelector("small");
      const unlockLevel = id === "story" ? 2 : id === "tradeoff" ? 3 : 1;
      if (!unlocked) small.textContent = "Lv." + unlockLevel + " 解锁";
      else if (usedOut) small.textContent = "本题已用完";
      else small.textContent = conf.cost + " 耐心 · " + conf.label;
      button.title = !unlocked
        ? "伙伴默契达到 Lv." + unlockLevel + " 后解锁「" + conf.label + "」"
        : usedOut
          ? "这张方式牌本题已经使用过"
          : tooCheap
            ? "耐心不足，暂时不能使用"
            : conf.cost + " 点耐心 · " + conf.label;
      button.setAttribute("aria-label", conf.label + "，" + button.title);
    });
    const endButton = $("#endDialogueButton");
    if (endButton) endButton.disabled = Boolean(D.done || !D.last);
    el("turnHint").textContent = D.done
      ? "对话结束 → 结算"
      : D.mood === D.moodOrder.length - 1
        ? "他踏实了。可以就此收尾 → 点击「结束对话」"
        : "思路 1 · 已打 " + Object.keys(D.used).length + " 张牌 · 耐心 " + D.patience + " / " + D.patienceMax + " · " + dialogueGuidance(D);
    if (!D.done && D.lastQuality === "waste") el("turnHint").textContent += " · 上张证据被废卡拖弱";
    if (!D.done && D.lastCombo) el("turnHint").textContent += " · 已触发「" + D.lastCombo + "」";
    if (!D.done && D.lastOutcome) el("turnHint").textContent += " · 本回合：" + D.lastOutcome;
    const evidenceNote = el("evidenceNote");
    if (evidenceNote) evidenceNote.hidden = Boolean(D.done);
    renderResourceHud();
  }

  function hasSentence(id) {
    const topicFamily = S.dlg && S.dlg.pack && S.dlg.pack.question ? S.dlg.pack.question.kicker : "";
    return Object.values(S.cards).some((card) => card.sentenceIds.includes(id) && (!card.fromLibrary || card.topicFamily === topicFamily));
  }

  function comboFor(D, methodId) {
    if (!D.last) return null;
    return (D.pack.combos || []).find((combo) => Array.isArray(combo.seq) && combo.seq[0] === D.last && combo.seq[1] === methodId) || null;
  }

  function qualityForMethod(D, methodId) {
    const check = (D.pack.checks || {})[methodId] || {};
    const targetIds = check.needSentence ? [check.needSentence] : Array.isArray(check.anySentenceOf) ? check.anySentenceOf : [];
    if (!targetIds.length) return "normal";
    const topicFamily = D.pack.question.kicker;
    const relevantCards = Object.values(S.cards).filter((card) => card.sentenceIds.some((id) => targetIds.includes(id)) && (!card.fromLibrary || card.topicFamily === topicFamily));
    if (!relevantCards.length) return "normal";
    if (relevantCards.some((card) => card.fromLibrary)) return "library";
    if (relevantCards.some((card) => card.quality && card.quality.key === "waste")) return "waste";
    if (relevantCards.some((card) => card.quality && card.quality.key === "premium")) return "premium";
    return "normal";
  }

  function comboMoodGain(combo, methodId) {
    if (!combo) return 1;
    let gain = 1;
    if (combo.effect === "advice-up") gain = 2;
    if (combo.effect === "soothe-up" && methodId === "story") gain = 2;
    if ((combo.effect === "checklist-trust" || combo.effect === "checklist-personal") && methodId === "checklist") gain = 2;
    return gain + Math.min(1, S.growth.thinkingBonus || 0);
  }

  function evalHit(methodId, forceHit) {
    if (forceHit) return true;
    const check = (S.dlg && S.dlg.pack.checks ? S.dlg.pack.checks[methodId] : null) || {};
    if (check.needSentence) return hasSentence(check.needSentence);
    if (Array.isArray(check.anySentenceOf)) return check.anySentenceOf.filter(hasSentence).length >= (check.minCount || 1);
    return false;
  }

  function quoteFor(methodId) {
    const check = (shell().pack && shell().pack.checks ? shell().pack.checks[methodId] : null) || {};
    const id = check.needSentence || (Array.isArray(check.anySentenceOf) ? check.anySentenceOf[0] : "");
    if (!id || !hasSentence(id)) return "";
    const material = shell().pack.materials.find((m) => m.sentences.some((s) => s.id === id));
    if (!material) return "";
    return material.sentences.find((s) => s.id === id).text;
  }

  function playMethod(methodId) {
    const D = S.dlg;
    if (!D || D.done) return;
    const conf = D.pack.methods[methodId];
    if (!conf) return;
    if ((D.used[methodId] || 0) >= conf.maxPerQuestion || D.patience < conf.cost) return;
    const combo = comboFor(D, methodId);
    const hit = evalHit(methodId, combo && combo.effect === "probe-hit");
    const evidenceQuality = hit ? qualityForMethod(D, methodId) : "normal";
    const baseMoodGain = hit ? comboMoodGain(combo, methodId) : 0;
    const moodGain = evidenceQuality === "library"
      ? Math.max(1, Math.floor(baseMoodGain * 0.5))
      : evidenceQuality === "premium"
      ? Math.max(1, Math.ceil(baseMoodGain * 1.5))
      : evidenceQuality === "waste"
        ? Math.floor(baseMoodGain * 0.5)
        : baseMoodGain;
    D.patience -= conf.cost;
    if (hit && evidenceQuality !== "waste" && (methodId === "empathy" || methodId === "probe")) D.patience = Math.min(D.patienceMax, D.patience + 1);
    D.used[methodId] = (D.used[methodId] || 0) + 1;
    D.growth.proficiency[methodId] = (D.growth.proficiency[methodId] || 0) + 1;
    if (hit && moodGain > 0) {
      D.mood = Math.min(D.moodOrder.length - 1, D.mood + moodGain);
      D.hits.push(methodId);
    }
    D.lastQuality = evidenceQuality;
    D.lastCombo = combo ? combo.label : "";
    D.lastOutcome = hit ? "答中" : "没接住";
    const moodKey = D.moodOrder[D.mood];
    chatMsg("player", "共读答主 · 你", playerLines[methodId], quoteFor(methodId));
    chatMsg("asker", D.pack.question.askerShort, D.pack.matrix[methodId][moodKey][hit ? "hit" : "miss"]);
    const reactions = shell().pack.companion && shell().pack.companion[hit ? "reactionHit" : "reactionMiss"];
    const pool = reactions && reactions.length ? reactions : [hit ? "问中了！" : "……没接住，换张牌试试。" ];
    shell().setAiText(pool[Math.floor(Math.random() * pool.length)]);
    D.last = methodId;
    if (combo) shell().toast("组合生效：" + combo.label);
    if (hit && evidenceQuality === "premium") shell().toast("精华卡增幅：这次回应更容易让他踏实。");
    if (hit && evidenceQuality === "library") shell().toast("旧卡参考：方向接近，但这次效果减半。");
    if (hit && evidenceQuality === "waste") shell().toast("方向虽然对了，但废卡让这次回应效果减半。");
    save();
    renderDialogueUI();
    if (D.patience <= 0) window.setTimeout(() => endDialogue("patience"), 600);
  }

  function endDialogue() {
    const D = S.dlg;
    if (!D || D.done) return;
    D.done = true;
    const hitsCount = D.hits.length;
    const steady = D.mood === D.moodOrder.length - 1;
    let leave = { text: "他默默消失了。几天后，你刷到他把同一个问题问向了别人。", fan: 0 };
    if (steady && hitsCount >= 2) leave = { text: "关注了你，说「下次还来找你」。", fan: 1 };
    else if (steady) leave = { text: "认真道谢后离开。", fan: 0 };
    else if (D.mood >= 2) leave = { text: "客气地结束对话，没有后续。", fan: 0 };
    const qualityCounts = { premium: 0, normal: 0, waste: 0 };
    let referenceCount = 0;
    Object.values(S.cards).forEach((card) => {
      if (card.fromLibrary) { referenceCount += 1; return; }
      qualityCounts[card.quality.key] += 1;
    });
    const expGain = Math.max(0, hitsCount + qualityCounts.premium * 2 - qualityCounts.waste + leave.fan);
    if (!Number.isFinite(S.growth.fans)) S.growth.fans = 0;
    if (!Number.isFinite(S.growth.exp)) S.growth.exp = 0;
    S.growth.fans += leave.fan;
    S.growth.exp += expGain;
    S.totalExp += expGain;
    const previousLevel = S.growth.level || 1;
    S.growth.level = growthLevel(S.growth.exp);
    if (S.growth.level > previousLevel) {
      S.growth.pendingChoice = { level: S.growth.level };
      shell().toast("伙伴默契提升到 Lv." + S.growth.level + " · 回信后可以选一张成长卡");
    }
    S.settle = { hitsCount, leave, expGain, qualityCounts, referenceCount, stale: qualityCounts.waste > 0 };
    S.settle.silent = leave.fan === 0 && D.mood <= 1;
    const bedroom = document.getElementById("bedroomPanel");
    if (bedroom) bedroom.classList.toggle("is-dim", S.settle.silent);
    save();
    S.stage = "settle";
    save();
    renderDialogueUI();
    showSettle();
  }

  function showSettle() {
    const D = S.dlg;
    S.stage = "settle";
    shell().setClock("23:58");
    renderResourceHud();
    renderNightTimeline("settle");
    const settleEyebrow = el("settleEyebrow");
    if (settleEyebrow) settleEyebrow.textContent = "本局结算 · 第" + (S.questionIndex + 1) + "晚";
    const timeJump = el("timeJump");
    if (timeJump) timeJump.hidden = true;
    const continueButton = $("#settleContinue");
    if (continueButton) {
      continueButton.disabled = false;
      continueButton.textContent = "等他的回信 →";
      continueButton.onclick = () => showLetter();
    }
    el("settleTitle").textContent = D.mood === D.moodOrder.length - 1 ? "他踏实下来了" : shell().pack.moodLabels[D.moodOrder[D.mood]] + "地结束了对话";
    el("settleHits").innerHTML = D.hits.length
      ? D.hits.map((id) => "<p>✔ " + escapeHtml(D.pack.methods[id].label) + "——答中了</p>").join("")
      : "<p>没有答中任何一招。</p>";
    el("settleCards").innerHTML = Object.keys(S.cards).map((id) => {
      const card = S.cards[id];
      const material = shell().pack.materials.find((m) => m.id === id) || card.materialSnapshot;
      if (!material) return "";
      const cls = card.fromLibrary ? "is-reference" : card.quality.key === "premium" ? "is-premium" : card.quality.key === "normal" ? "is-normal" : "is-waste";
      const name = card.fromLibrary ? "旧卡参考" : card.quality.key === "premium" ? "精华卡" : card.quality.key === "normal" ? "普通卡" : "废卡";
      const pickedTexts = card.sentenceIds.map((sid) => {
        const s = material.sentences.find((x) => x.id === sid);
        return "「" + (s ? s.text : "") + "」";
      }).join("");
      return "<p class=" + cls + "><strong>" + name + "</strong> " + escapeHtml(material.kindLabel) + "：" + escapeHtml(card.fromLibrary ? "来源于跨题素材库，本题效果减半" : card.quality.why) + "</p><p class=settle-sent>" + escapeHtml(pickedTexts) + "</p>";
    }).join("");
    el("settleLeave").innerHTML = "<p>" + escapeHtml(S.settle.leave.text) + "</p>" + (S.settle.leave.fan ? "<span class='settle-stamp'>+1 粉丝</span>" : "");
      const qualityCounts = { premium: 0, normal: 0, waste: 0 };
      let referenceCount = 0;
      Object.values(S.cards).forEach((c) => {
        if (c.fromLibrary) { referenceCount += 1; return; }
        qualityCounts[c.quality.key] += 1;
      });
    el("settleGains").innerHTML = "<p>本题经验 +" + (S.settle.expGain || 0) + " · 累计经验 " + S.growth.exp + " · 粉丝 " + S.growth.fans + "</p><p>新卡 精华×" + qualityCounts.premium + " 普通×" + qualityCounts.normal + " 废卡×" + qualityCounts.waste + (referenceCount ? " · 旧卡参考×" + referenceCount : "") + "</p>";
    el("settleOverlay").hidden = false;
    shell().setStage(3);
  }

  function showLetter() {
    if (S.stage === "letter") return;
    S.stage = "letter";
    shell().setClock("几天后");
    renderResourceHud();
    renderNightTimeline("letter");
    const silentLetter = { days: 3, text: "（这一夜之后，你没有等到他的回信。）几天后你刷到：他把同样的问题又问了一遍——这次，是别人在答。", result: "那条求助没能被接住。", memory: "有一条求助，我们没能接住。下一次，先把人接住再开口。" };
    const letter = S.settle.silent ? silentLetter : S.settle.stale ? shell().pack.letters.stale : shell().pack.letters.good;
    el("settleTitle").textContent = (S.settle.silent ? "没有等到回信 · " : "回信 · ") + letter.days + " 天后";
    el("settleHits").innerHTML = "<p>" + escapeHtml(letter.text) + "</p>";
    el("settleCards").innerHTML = "";
    el("settleLeave").innerHTML = "";
    const hasNextNight = S.questionIndex < S.questionQueue.length - 1;
    const finishSummary = hasNextNight ? "" : "<p class=\"season-finish\"><strong>主线完成 · " + S.questionQueue.length + " / " + S.questionQueue.length + " 晚</strong><br><small>累计经验 " + S.growth.exp + " · 粉丝 " + S.growth.fans + " · 素材库 " + S.growth.library.length + " 张</small></p>";
    el("settleGains").innerHTML = "<p>" + escapeHtml(letter.result) + "</p><p><small>已记入共读札记：" + escapeHtml(letter.memory) + "</small></p>" + finishSummary;
    const timeJump = el("timeJump");
    const timeJumpTitle = el("timeJumpTitle");
    const timeJumpCopy = el("timeJumpCopy");
    const continueButton = $("#settleContinue");
    if (timeJump) timeJump.hidden = false;
    if (timeJumpTitle) timeJumpTitle.textContent = hasNextNight
      ? (S.questionIndex === 0 ? "时间点 · 明天晚上 22:40" : "时间点 · 第" + (S.questionIndex + 2) + "晚 22:40")
      : "时间点 · 今晚主线暂时收灯";
    if (timeJumpCopy) timeJumpCopy.textContent = hasNextNight
      ? "按下后关灯，下一封求助会在下一晚来到桌面。素材库和成长会保留。"
      : "12 个夜晚的主线已经走完，可以回看共读札记和素材库。";
    if (continueButton) {
      continueButton.disabled = false;
      continueButton.textContent = hasNextNight ? "进入下一晚 →" : "回看共读札记 →";
      continueButton.onclick = hasNextNight
        ? () => nextQuestion()
        : () => {
          el("settleOverlay").hidden = true;
          shell().focusWindow("memoryWindow");
          shell().toast("主线已完成：可以回看札记和素材库。");
        };
    }
    if (window.CoReadCompanion && window.CoReadCompanion.showGrowthItem) {
      const qid = shell().pack.question.id || "guahao";
      window.CoReadCompanion.showGrowthItem(qid);
    }
    shell().setStage(4);
    recordGrowth(letter);
    save();
    showGrowthChoice();
  }

  function renderNightTimeline(phase) {
    const timeline = el("nightTimeline");
    if (!timeline) return;
    const tonight = el("timelineTonight");
    const letter = el("timelineLetter");
    const next = el("timelineNext");
    const nextLabel = el("timelineNextLabel");
    const hasNext = S.questionIndex < S.questionQueue.length - 1;
    timeline.dataset.phase = phase;
    [tonight, letter, next].forEach((node) => { if (node) node.classList.remove("is-current", "is-done", "is-ready", "is-locked"); });
    if (tonight) tonight.classList.add(phase === "settle" ? "is-current" : "is-done");
    if (letter) letter.classList.add(phase === "letter" ? "is-current" : "is-ready");
    if (next) next.classList.add(hasNext ? "is-ready" : "is-locked");
    if (nextLabel) nextLabel.textContent = hasNext ? (S.questionIndex === 0 ? "明晚" : "第" + (S.questionIndex + 2) + "晚") : "收灯";
  }

  function nextQuestion() {
    const settleOverlay = el("settleOverlay");
    if (settleOverlay) settleOverlay.hidden = true;
    S.questionIndex += 1;
    S.energy -= 1;
    if (S.questionIndex < S.questionQueue.length) {
      window.CoReadV2Pack = S.questionQueue[S.questionIndex];
      S.cards = {};
      S.inspected = new Set();
      S.chatLog = [];
      S.dlg = null;
      S.settle = null;
      S.stage = "research";
      onShellReady(true);
      shell().focusWindow("browserWindow");
      shell().toast("收到一条新求助：" + shell().pack.question.askerShort);
    } else {
      shell().toast("今晚的求助都回答完了。");
    }
  }

  function renderGrowthHistory() {
    if (!Array.isArray(S.growth.memories)) S.growth.memories = [];
    normalizeGrowth();
    const growth = $("#growthList");
    if (growth) growth.innerHTML = S.growth.memories.length
      ? S.growth.memories.map((item) => '<li><span class="growth-dot"></span><strong>第' + (item.index + 1) + '题</strong> ' + escapeHtml(item.text) + '</li>').join('')
      : '<li><span class="growth-dot empty"></span> 第一页还是空的</li>';
    const title = $("#growthTitle");
    if (title) title.textContent = "共读札记 · 伙伴默契 Lv." + S.growth.level + " · 已完成 " + S.growth.memories.length + " / " + (S.questionQueue.length || 12) + " 题";
    const progressText = $("#growthProgressText");
    const progressFill = $("#growthProgressFill");
    const levelStart = Math.min(40, Math.max(0, (S.growth.level - 1) * 8));
    const levelEnd = S.growth.level >= 6 ? 40 : S.growth.level * 8;
    const currentInLevel = Math.max(0, Math.min(levelEnd - levelStart, S.growth.exp - levelStart));
    if (progressText) progressText.textContent = S.growth.level >= 6 ? "Lv.6 已满" : currentInLevel + " / " + (levelEnd - levelStart) + " · 距离 Lv." + (S.growth.level + 1) + " 还差 " + Math.max(0, levelEnd - S.growth.exp);
    if (progressFill) progressFill.style.width = (S.growth.level >= 6 ? 100 : currentInLevel / Math.max(1, levelEnd - levelStart) * 100) + "%";
    renderLibrary();
  }

  function renderLibrary() {
    normalizeGrowth();
    const list = $("#libraryList");
    const title = $("#libraryTitle");
    if (!list || !title) return;
    title.textContent = S.growth.library.length ? "素材库 · 已留 " + S.growth.library.length + " 张" : "还没有留下可复用的卡";
    if (!S.growth.library.length) {
      list.innerHTML = '<li class="library-empty">完成一题后，精华卡和普通卡会留在这里。</li>';
      return;
    }
    const qualityLabel = { premium: "精华卡", normal: "普通卡", waste: "废卡" };
    const currentTopic = shell().pack && shell().pack.question ? shell().pack.question.kicker : "";
    list.innerHTML = S.growth.library.slice().reverse().map((item) => {
      const quality = item.quality || "normal";
      const text = (item.sentences || []).slice(0, 2).map((sentence) => "「" + sentence + "」").join(" ");
      const warning = item.kind === "guide" ? " · 注意日期" : "";
      const sameTopic = Boolean(currentTopic && item.topicFamily && item.topicFamily === currentTopic);
      const isWaste = quality === "waste";
      const relation = isWaste ? "废卡 · 不进入跨题参考" : !item.topicFamily ? "旧卡 · 先核对主题" : sameTopic ? "本题同类 · 可调用，效果减半" : "跨主题 · 仅作对照";
      const alreadyCalled = !isWaste && Object.values(S.cards).some((card) => card.fromLibrary && card.libraryId === item.id);
      const itemClass = sameTopic ? " library-same-topic" : " library-cross-topic";
      const buttonLabel = isWaste ? "废卡不可调用" : alreadyCalled ? "已在当前桌面" : sameTopic ? "调用到桌面" : "跨主题调用";
      return '<li class="library-' + quality + itemClass + '"><strong>' + escapeHtml(qualityLabel[quality] || "素材卡") + " · " + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.kindLabel || "材料") + " · " + escapeHtml(item.date || "") + warning + "</small><small class=\"library-relation\">" + escapeHtml(relation) + "</small><small>" + escapeHtml(text) + '</small><button class="library-call" type="button" data-library-id="' + escapeHtml(item.id) + '"' + (alreadyCalled || isWaste ? " disabled" : "") + '>' + buttonLabel + "</button></li>";
    }).join("");
    $$(".library-call", list).forEach((button) => button.addEventListener("click", () => callLibraryCard(button.dataset.libraryId)));
  }

  function callLibraryCard(libraryId) {
    normalizeGrowth();
    if (S.stage !== "research") {
      shell().toast("回到共读调查阶段，才能调用素材卡。");
      return;
    }
    const entry = S.growth.library.find((item) => item.id === libraryId);
    if (!entry) return;
    if (entry.quality === "waste") {
      shell().toast("废卡不能作为跨题参考；下次请去掉广告、过时句或错误来源。");
      return;
    }
    if (Object.values(S.cards).some((card) => card.fromLibrary && card.libraryId === libraryId)) return;
    const cardId = "library:" + libraryId;
    S.cards[cardId] = {
      tag: entry.kind,
      sentenceIds: Array.isArray(entry.sentenceIds) ? entry.sentenceIds.slice() : [],
      quality: { key: entry.quality || "normal", why: entry.why || "来自旧素材卡" },
      fromLibrary: true,
      libraryId: entry.id,
      topicFamily: entry.topicFamily || "",
      materialSnapshot: {
        id: cardId,
        kind: entry.kind,
        kindLabel: entry.kindLabel,
        title: entry.title,
        date: entry.date,
        sentences: (entry.sentences || []).map((text, index) => ({ id: entry.sentenceIds && entry.sentenceIds[index] ? entry.sentenceIds[index] : "library-s" + index, text }))
      }
    };
    renderTray();
    renderMaterials();
    renderAttention();
    renderLibrary();
    save();
    shell().toast("旧素材卡已放到桌面：本题只按参考效果计算。");
  }

  function recordGrowth(letter) {
    if (!Array.isArray(S.growth.memories)) S.growth.memories = [];
    const q = shell().pack.question;
    const memory = {
      index: S.questionIndex,
      id: q.id,
      title: q.title,
      text: letter.memory,
      result: letter.result,
      stale: Boolean(S.settle && S.settle.stale),
      expGain: S.settle ? S.settle.expGain || 0 : 0
    };
    const old = S.growth.memories.findIndex((item) => item.index === memory.index && item.id === memory.id);
    if (old >= 0) S.growth.memories[old] = memory;
    else S.growth.memories.push(memory);
    const pack = shell().pack;
    Object.keys(S.cards).forEach((materialId) => {
      const material = pack.materials.find((item) => item.id === materialId);
      const card = S.cards[materialId];
      if (!material || !card || card.fromLibrary) return;
      if (card.quality && card.quality.key === "waste") return;
      const libraryId = q.id + ":" + materialId;
      const entry = {
        id: libraryId,
        questionId: q.id,
        questionTitle: q.title,
        materialId,
        title: material.title,
        kind: material.kind,
        kindLabel: material.kindLabel,
        date: material.date,
        topicFamily: q.kicker,
        quality: card.quality.key,
        why: card.quality.why,
        sentenceIds: card.sentenceIds.slice(),
        sentences: card.sentenceIds.map((sid) => {
          const sentence = material.sentences.find((item) => item.id === sid);
          return sentence ? sentence.text : "";
        })
      };
      const existing = S.growth.library.findIndex((item) => item.id === libraryId);
      if (existing >= 0) S.growth.library[existing] = entry;
      else S.growth.library.push(entry);
    });
    renderGrowthHistory();
    $("#principleCard").innerHTML = "<span>长期记忆</span><p>" + escapeHtml(S.settle.stale ? "过时的信息会让人白跑一趟。先看日期，再开口。" : "先接住人，再给方法。帮一个人，就是帮一片人。") + "</p>";
  }

  function bindEndButton() {
    let endButton = $("#endDialogueButton");
    if (!endButton) {
      endButton = document.createElement("button");
      endButton.id = "endDialogueButton";
      endButton.className = "end-dialogue";
      endButton.type = "button";
      endButton.textContent = "结束对话，看看结果";
      endButton.disabled = true;
      endButton.addEventListener("click", () => endDialogue());
      el("turnHint").after(endButton);
    }
    endButton.hidden = false;
    endButton.disabled = Boolean(!S.dlg || S.dlg.done || !S.dlg.last);
  }

  function startDialogue() {
    const pack = shell().pack;
    if (attentionUsed() < S.attentionMax) { shell().toast("先在共读里做好本题需要的素材卡。"); return; }
    S.stage = "dialogue";
    shell().setClock("23:10");
    S.chatLog = [];
    S.dlg = {
      pack,
      mood: 0,
      moodOrder: pack.moodOrder,
      patienceMax: pack.question.patienceBase + 2 + Math.min(2, S.growth.patienceBonus || 0),
      patience: pack.question.patienceBase + 2 + Math.min(2, S.growth.patienceBonus || 0),
      used: {},
      suggested: false,
      last: null,
      lastQuality: "",
      lastCombo: "",
      lastOutcome: "",
      hits: [],
      done: false,
      growth: S.growth,
      unlocked: unlockedMethodsForGrowth()
    };
    chatMsg("asker", pack.question.askerShort, pack.question.opening);
    shell().setAiText("他开口了。先用共情接住他，或者追问问清细节——素材卡上的句子就是你的底气。");
    shell().guide("dialogue", "打方式牌回他：共情接情绪，追问问细节，清单给步骤。素材卡选得好，牌才打得中。", "#handCards");
    renderDialogueUI();
    bindEndButton();
    shell().focusWindow("chatWindow");
    shell().setStage(2);
    el("synthesizeButton").disabled = true;
    save();
  }

  function restoreResearch(saved) {
    S.cards = saved.cards || {};
    S.inspected = new Set(saved.inspected || []);
    if (saved.growthItems) { window.__coreadGrowthSet = new Set(saved.growthItems); (window.CoReadCompanion && window.CoReadCompanion.showGrowthItem) ? saved.growthItems.forEach((t) => window.CoReadCompanion.showGrowthItem(t)) : null; }
    onShellReady(true);
  }

  function restoreDialogue(saved) {
    S.cards = saved.cards || {};
    S.inspected = new Set(saved.inspected || []);
    if (saved.growthItems) { window.__coreadGrowthSet = new Set(saved.growthItems); (window.CoReadCompanion && window.CoReadCompanion.showGrowthItem) ? saved.growthItems.forEach((t) => window.CoReadCompanion.showGrowthItem(t)) : null; }
    S.chatLog = saved.chatLog || [];
    S.growth = saved.growth || S.growth;
    normalizeGrowth();
    renderGrowthHistory();
    const pack = shell().pack;
    S.stage = "dialogue";
    S.dlg = {
      pack,
      mood: saved.dlg.mood,
      moodOrder: pack.moodOrder,
      patienceMax: saved.dlg.patienceMax,
      patience: saved.dlg.patience,
      used: saved.dlg.used || {},
      last: saved.dlg.last,
      lastQuality: saved.dlg.lastQuality || "",
      lastCombo: saved.dlg.lastCombo || "",
      lastOutcome: saved.dlg.lastOutcome || "",
      hits: saved.dlg.hits || [],
      done: saved.dlg.done,
      growth: S.growth,
      unlocked: saved.dlg.unlocked || unlockedMethodsForGrowth()
    };
    onShellReady(true);
    S.stage = "dialogue";
    shell().setClock("23:10");
    renderChatLog();
    renderDialogueUI();
    bindEndButton();
    shell().focusWindow("chatWindow");
    shell().setStage(2);
  }

  function restoreSettle(saved, asLetter) {
    restoreDialogue(saved);
    S.settle = saved.settle && saved.settle.leave
      ? saved.settle
      : { stale: saved.settle.stale, hitsCount: saved.settle.hitsCount, expGain: saved.settle.expGain || 0, leave: { text: saved.settle.leaveText || "", fan: 0 } };
    if (asLetter) showLetter();
    else showSettle();
  }

  function defaultQuestionQueue() {
    const first = window.CoReadV2PackBase || window.CoReadV2Pack;
    return [first, window.CoReadV2PackTrain, window.CoReadV2PackRent]
      .concat(Array.isArray(window.CoReadV2Season) ? window.CoReadV2Season : [])
      .filter(Boolean)
      .slice(0, 12);
  }

  function upgradeQuestionQueue(savedQueue, savedIndex) {
    const expected = defaultQuestionQueue();
    if (savedQueue.length >= expected.length) return { queue: savedQueue, index: Math.min(savedIndex, savedQueue.length - 1) };
    const currentId = savedQueue[savedIndex] && savedQueue[savedIndex].question ? savedQueue[savedIndex].question.id : "";
    const nextIndex = expected.findIndex((pack) => pack.question && pack.question.id === currentId);
    return { queue: expected, index: nextIndex >= 0 ? nextIndex : Math.min(savedIndex, expected.length - 1) };
  }

  function resume() {
    let saved = readSave();
    if (!saved) {
      newGame();
      return;
    }
    const inner = saved.state || {};
    saved = Object.assign({}, inner, saved);
    S.attentionMax = saved.attentionMax || saved.attention || 2;
    S.attention = S.attentionMax;
    S.energyMax = saved.energyMax || S.energyMax;
    S.energy = Number.isFinite(saved.energy) ? saved.energy : Math.max(0, S.energyMax - (saved.questionIndex || 0));
    S.totalExp = Number.isFinite(saved.totalExp) ? saved.totalExp : 0;
    S.questionQueue = Array.isArray(saved.questionQueue) && saved.questionQueue.length ? saved.questionQueue : [];
    S.questionIndex = Number.isInteger(saved.questionIndex) ? Math.max(0, saved.questionIndex) : 0;
    const upgraded = upgradeQuestionQueue(S.questionQueue, S.questionIndex);
    S.questionQueue = upgraded.queue;
    S.questionIndex = upgraded.index;
    if (S.energyMax < S.questionQueue.length) {
      S.energyMax = S.questionQueue.length;
      S.energy = Math.max(0, S.energyMax - S.questionIndex);
    }
    if (S.questionQueue.length) {
      S.questionIndex = Math.min(S.questionIndex, S.questionQueue.length - 1);
      window.CoReadV2Pack = S.questionQueue[S.questionIndex];
    }
    S.growth = saved.growth || S.growth;
    if (!Array.isArray(S.growth.memories)) S.growth.memories = [];
    renderGrowthHistory();
    shell().elements.bootOverlay.hidden = true;
    if (window.CoReadCompanion) window.CoReadCompanion.start();
    if (saved.stage === "dialogue") restoreDialogue(saved);
    else if (saved.stage === "settle") restoreSettle(saved, false);
    else if (saved.stage === "letter") restoreSettle(saved, true);
    else restoreResearch(saved);
    shell().toast("已回到上次的共读进度");
  }

  function newGame() {
    if (S.stage !== "boot") return;
    onShellReady(false);
  }

  function reset() {
    clearSave();
    S.attentionMax = 2;
    S.attention = S.attentionMax;
    S.cards = {};
    S.inspected = new Set();
    S.chatLog = [];
    S.growth = { proficiency: {}, fans: 0, exp: 0, level: 1, patienceBonus: 0, thinkingBonus: 0, pendingChoice: null, memories: [], library: [] };
    S.dlg = null;
    S.settle = null;
    S.questionQueue = [];
    S.questionIndex = 0;
    S.energy = S.energyMax;
    S.totalExp = 0;
    onShellReady(false);
  }

  function onShellReady(silent) {
    S.stage = "research";
    shell().setClock("22:40");
    const pack = shell().pack;
    if (!pack) { shell().toast("文案包未加载"); return; }
    if (!S.questionQueue.length) S.questionQueue = defaultQuestionQueue();
    normalizeGrowth();
    renderGrowthHistory();
    shell().fillQuestion(pack.question);
    const seasonTotal = S.questionQueue.length || 12;
    el("researchEyebrow").textContent = "共读调查 / " + String(S.questionIndex + 1).padStart(2, "0") + " / " + String(seasonTotal).padStart(2, "0");
    el("researchTitle").textContent = "先看哪" + attentionCountLabel() + "份材料？";
    el("researchInstruction").textContent = S.growth.memories && S.growth.memories.length
      ? "上一封回信已经记进札记。注意力只够细读" + attentionCountLabel() + "份：展开材料 → 挑最多 3 句做卡 → 标对来源。"
      : "注意力只够细读" + attentionCountLabel() + "份。展开材料 → 挑最多 3 句做成素材卡 → 标对来源。";
    renderAttention();
    renderMaterials();
    renderTray();
    bindModal();
    el("synthesizeButton").onclick = startDialogue;
    const suggestButton = document.getElementById("aiSuggestButton");
    if (suggestButton) suggestButton.onclick = aiSuggest;
    $$("#handCards .method-card").forEach((button) => {
      if (button.id === "aiSuggestButton") return;
      button.onclick = () => playMethod(button.dataset.method);
    });
    shell().setStage(1);
    shell().focusWindow("browserWindow");
    // 自动滚到材料区，确保玩家看到「展开检查」按钮
    const researchSection = document.querySelector(".research-section");
    if (researchSection) researchSection.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!silent) {
      shell().toast("收到一条来自林一舟的求助");
      const computer = document.getElementById("roomComputer");
      if (computer && !computer.dataset.engineBound) {
        computer.classList.add("has-new-message");
        computer.dataset.engineBound = "1";
        computer.addEventListener("click", () => {
          computer.classList.remove("has-new-message");
          shell().focusWindow("browserWindow");
        });
      }
      shell().guide("research", "电脑收到求助了！点材料上的「展开检查」，看清作者和日期，再挑句子做成素材卡。", "#materialList");
    }
  }

  window.setInterval(save, 1500);
  window.addEventListener("beforeunload", save);

  function growthSetRef() { return window.__coreadGrowthSet || new Set(); }
  window.CoReadEngine = {
    onShellReady: () => onShellReady(false),
    resume,
    newGame,
    hasSave,
    state: S,
    playMethod,
    endDialogue,
    aiSuggest,
    readSaveJSON,
    reset,
    nextQuestion,
    evalHit,
    calcQuality
  };
})();
