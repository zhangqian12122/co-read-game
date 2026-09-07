"use strict";

const materials = [
  {
    id: "official",
    kind: "official",
    kindLabel: "官方说明",
    date: "2026-08-18",
    title: "某市第一医院：门诊就诊准备说明",
    excerpt: "挂号渠道、证件准备与到院后的基本流程，以医院当天公布的信息为准。",
    author: "医院官方服务号（游戏虚构）",
    source: "机构发布",
    engagement: "最近更新 · 可追溯",
    correctTag: "official",
    body: [
      "为了避免不同地区、不同医院的流程差异，本说明只列出就诊前应当核对的项目：确认医院与院区、查看当日挂号渠道、准备本人有效证件，并按官方页面提示确认是否需要其他材料。",
      "不同科室的预约方式、医保规则和报到位置可能不同。到院前应再次查看医院官方渠道，遇到不确定情况可以联系医院服务台。"
    ],
    quote: "流程会变化。经验可以参考，但最终应以准备前看到的最新官方说明为准。",
    caution: "这是游戏中的虚构示例，不代表任何现实医院的具体就诊流程，也不提供疾病诊断建议。"
  },
  {
    id: "oldGuide",
    kind: "old",
    kindLabel: "高赞回答",
    date: "2021-03-06",
    title: "第一次去三甲医院？照着这张流程图走",
    excerpt: "一份清晰、流传很广的挂号流程，但回答已经五年没有更新。",
    author: "匿名用户",
    source: "个人整理",
    engagement: "12,846 赞同 · 631 收藏",
    correctTag: "uncertain",
    body: [
      "回答者按照自己当年的经历，整理了一套从现场取号、窗口缴费到候诊的步骤。结构清楚，评论区里也有许多人表示曾经受益。",
      "不过，回答没有说明具体城市和医院，页面上标注的部分窗口名称也可能已经变化。最近评论里有人提醒，现在很多医院已经改用新的预约和报到方式。"
    ],
    quote: "收藏很多不代表今天仍然适用。它能提供检查清单，却不能直接当成当前规则。",
    caution: "流程信息具有明显时效性。高赞和大量收藏只能说明它曾经有用，不能证明现在仍然准确。"
  },
  {
    id: "experience",
    kind: "experience",
    kindLabel: "亲历回答",
    date: "2026-05-21",
    title: "我第一次一个人看病时，最有用的不是流程图",
    excerpt: "一位外地学生讲述如何缓解紧张、记录问题并在需要时向工作人员求助。",
    author: "晚课以后",
    source: "个人经历",
    engagement: "318 赞同 · 42 评论",
    correctTag: "experience",
    body: [
      "回答者回忆，第一次独自去医院时，她提前把想向医生说明的情况写在手机备忘录里，也把不理解的流程及时问了工作人员。",
      "她强调这只是自己的经历，不能代表所有医院；真正帮到她的是允许自己承认紧张，并在不清楚时开口询问，而不是强迫自己表现得什么都懂。"
    ],
    quote: "经验不能替代规则，但它能告诉我们：提问者可能不只缺一张流程表，也缺一点面对未知的底气。",
    caution: "个人经历适合帮助理解处境，不应被当作所有医院通用的制度说明。"
  },
  {
    id: "context",
    kind: "context",
    kindLabel: "题主评论",
    date: "今天 18:42",
    title: "“我在外地上学，不确定学校医保要不要先办理手续”",
    excerpt: "藏在评论区的补充，让问题从通用流程变成了需要确认地区条件的具体处境。",
    author: "提问者 · 悠一",
    source: "当事人补充",
    engagement: "评论第 17 楼 · 3 人赞同",
    correctTag: "context",
    body: [
      "提问者补充说，自己在外地上大学，第一次离开家人独自处理就诊问题。他从同学那里听说校内医保可能有额外手续，但每个人说法不一样。",
      "这条信息无法直接给出答案，却暴露了原问题缺少的条件：所在地区、学校安排和准备去的医院都会影响实际流程。"
    ],
    quote: "他表面上问的是‘怎么挂号’，真正担心的是：自己的情况和别人不一样时，该相信谁。",
    caution: "当事人补充能帮助明确问题，但其中转述的规则仍然需要向学校或医院官方渠道核实。"
  }
];

const tagOptions = [
  { id: "official", label: "最新官方信息" },
  { id: "experience", label: "个人经历" },
  { id: "uncertain", label: "待核实 / 可能过时" },
  { id: "context", label: "当事人补充" }
];

const decisions = [
  {
    id: "checklist",
    key: "A",
    title: "整理准备清单，并标明需要再次核对的地方",
    detail: "先给可执行帮助，同时明确不同医院和地区可能存在差异。",
    tendencies: { truth: 2, empathy: 0, expression: 1, caution: 1 }
  },
  {
    id: "clarify",
    key: "B",
    title: "先回应他的紧张，再追问所在地区和目标医院",
    detail: "暂不输出通用流程，先补齐会改变答案的关键条件。",
    tendencies: { truth: 1, empathy: 2, expression: 0, caution: 2 }
  },
  {
    id: "direct",
    key: "C",
    title: "按照最清晰的高赞回答，直接给出完整步骤",
    detail: "回应最快、看起来最有用，但可能把过去经验误当成当前规则。",
    tendencies: { truth: 0, empathy: 0, expression: 2, caution: 0 }
  }
];

const state = {
  started: false,
  step: "research",
  attention: 2,
  selected: [],
  tags: {},
  inspected: new Set(),
  currentMaterial: null,
  decision: null,
  permission: null,
  tendencies: { truth: 0, empathy: 0, expression: 0, caution: 0 },
  toastTimer: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const elements = {
  bootOverlay: $("#bootOverlay"),
  startButton: $("#startButton"),
  materialList: $("#materialList"),
  attentionPips: $("#attentionPips"),
  attentionText: $("#attentionText"),
  selectedMaterials: $("#selectedMaterials"),
  dropZone: $("#dropZone"),
  emptyDrop: $("#emptyDrop"),
  trayCount: $("#trayCount"),
  synthesizeButton: $("#synthesizeButton"),
  roomScene: $("#roomScene"),
  aiCharacter: $("#aiCharacter"),
  aiText: $("#aiText"),
  wallNote: $("#wallNote"),
  shelfBook: $("#shelfBook"),
  materialModal: $("#materialModal"),
  modalType: $("#modalType"),
  modalTitle: $("#modalTitle"),
  modalLedger: $("#modalLedger"),
  modalBody: $("#modalBody"),
  modalCaution: $("#modalCaution"),
  modalSendAction: $("#modalSendAction"),
  decisionModal: $("#decisionModal"),
  aiSummary: $("#aiSummary"),
  decisionOptions: $("#decisionOptions"),
  followupNotification: $("#followupNotification"),
  followupModal: $("#followupModal"),
  followupText: $("#followupText"),
  autonomyEvent: $("#autonomyEvent"),
  permissionChoice: $("#permissionChoice"),
  permissionPrompt: $("#permissionPrompt"),
  permissionAllow: $("#permissionAllow"),
  permissionAsk: $("#permissionAsk"),
  memoryWindow: $("#memoryWindow"),
  growthTitle: $("#growthTitle"),
  growthList: $("#growthList"),
  principleCard: $("#principleCard"),
  progressSteps: $("#progressSteps"),
  toast: $("#toast")
};

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
}

function setAiText(message) {
  elements.aiText.textContent = message;
  elements.aiCharacter.classList.add("is-pulsing");
  window.setTimeout(() => elements.aiCharacter.classList.remove("is-pulsing"), 420);
}

function getWindowElement(windowId) {
  return document.getElementById(windowId);
}

function updateWindowTask(windowId, { closed = false, active = false } = {}) {
  const taskButton = document.querySelector(`[data-window-task="${windowId}"]`);
  if (!taskButton) return;
  taskButton.hidden = closed;
  taskButton.classList.toggle("is-active", active && !closed);
}

function updateMaximizeControl(windowElement) {
  const maximizeButton = windowElement.querySelector('[data-window-action="maximize"]');
  if (!maximizeButton) return;
  const maximized = windowElement.classList.contains("is-maximized");
  maximizeButton.textContent = maximized ? "❐" : "□";
  maximizeButton.title = maximized ? "还原" : "最大化";
  maximizeButton.setAttribute("aria-label", `${maximized ? "还原" : "最大化"}${windowElement.id === "roomWindow" ? "共读房间" : "窗口"}`);
}

function focusTopVisibleWindow() {
  const candidates = $$(".app-window").filter((windowElement) =>
    !windowElement.classList.contains("is-minimized") && !windowElement.classList.contains("is-closed")
  );
  const target = candidates[candidates.length - 1];
  if (target) focusWindow(target.id);
}

function focusWindow(windowId) {
  $$(".app-window").forEach((windowElement) => windowElement.classList.remove("is-front"));
  const target = getWindowElement(windowId);
  if (!target) return;
  target.classList.remove("is-minimized", "is-closed");
  target.classList.add("is-front", "is-pulsing");
  window.setTimeout(() => target.classList.remove("is-pulsing"), 500);
  if (windowId === "memoryWindow") target.classList.add("is-open");
  $$("[data-focus]").forEach((button) => button.classList.toggle("is-active", button.dataset.focus === windowId));
  updateWindowTask(windowId, { closed: false, active: true });
}

function minimizeWindow(windowElement) {
  windowElement.classList.add("is-minimized");
  windowElement.classList.remove("is-front");
  updateWindowTask(windowElement.id, { closed: false, active: false });
  focusTopVisibleWindow();
}

function toggleMaximizeWindow(windowElement) {
  windowElement.classList.remove("is-minimized", "is-closed");
  windowElement.classList.toggle("is-maximized");
  updateMaximizeControl(windowElement);
  focusWindow(windowElement.id);
  showToast(windowElement.classList.contains("is-maximized")
    ? windowElement.id === "roomWindow" ? "已进入房间聚焦模式。再次双击标题栏可还原。" : "窗口已最大化。"
    : "窗口已还原到桌面位置。" );
}

function closeWindow(windowElement) {
  windowElement.classList.add("is-closed");
  windowElement.classList.remove("is-minimized", "is-maximized", "is-front", "is-open");
  updateMaximizeControl(windowElement);
  updateWindowTask(windowElement.id, { closed: true, active: false });
  showToast(`${windowElement.id === "roomWindow" ? "共读房间" : windowElement.id === "browserWindow" ? "知乎窗口" : "共读札记"}已关闭，可从桌面图标重新打开。`);
  focusTopVisibleWindow();
}

function handleWindowAction(windowElement, action) {
  if (action === "minimize") minimizeWindow(windowElement);
  if (action === "maximize") toggleMaximizeWindow(windowElement);
  if (action === "close") closeWindow(windowElement);
}

function bindWindowManager() {
  $$(".app-window").forEach((windowElement) => {
    const titlebar = $(".titlebar", windowElement);
    let dragState = null;

    titlebar.addEventListener("dblclick", (event) => {
      if (event.target.closest(".window-controls")) return;
      toggleMaximizeWindow(windowElement);
    });

    titlebar.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest(".window-controls") || windowElement.classList.contains("is-maximized")) return;
      focusWindow(windowElement.id);
      const rect = windowElement.getBoundingClientRect();
      dragState = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, width: rect.width, height: rect.height };
      titlebar.setPointerCapture?.(event.pointerId);
    });

    titlebar.addEventListener("pointermove", (event) => {
      if (!dragState) return;
      const maxLeft = Math.max(94, window.innerWidth - dragState.width - 8);
      const maxTop = Math.max(38, window.innerHeight - dragState.height - 50);
      const left = Math.min(Math.max(94, event.clientX - dragState.offsetX), maxLeft);
      const top = Math.min(Math.max(38, event.clientY - dragState.offsetY), maxTop);
      windowElement.style.left = `${left}px`;
      windowElement.style.top = `${top}px`;
      windowElement.style.right = "auto";
      windowElement.style.bottom = "auto";
    });

    const endDrag = (event) => {
      if (!dragState) return;
      dragState = null;
      if (titlebar.hasPointerCapture?.(event.pointerId)) titlebar.releasePointerCapture(event.pointerId);
    };
    titlebar.addEventListener("pointerup", endDrag);
    titlebar.addEventListener("pointercancel", endDrag);

    $$("[data-window-action]", windowElement).forEach((button) => {
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        handleWindowAction(windowElement, button.dataset.windowAction);
      });
    });
    updateMaximizeControl(windowElement);
  });
}

function renderMaterials() {
  elements.materialList.innerHTML = materials.map((material) => {
    const selected = state.selected.includes(material.id);
    const locked = state.selected.length >= state.attention && !selected;
    const inspected = state.inspected.has(material.id);
    return `
      <article class="material-card${selected ? " is-selected" : ""}${locked ? " is-locked" : ""}"
        draggable="${locked || selected ? "false" : "true"}" data-material-id="${material.id}">
        <div class="material-topline">
          <span class="source-kind ${material.kind}">${material.kindLabel}</span>
          <span class="material-date">${material.date}</span>
        </div>
        <h3>${material.title}</h3>
        <p>${material.excerpt}</p>
        <div class="material-meta"><span>${material.author}</span><span>·</span><span>${material.engagement}</span></div>
        <div class="material-actions">
          <button class="text-action inspect-material" data-material-id="${material.id}" type="button">${inspected ? "再次查看" : "展开检查"}</button>
          <button class="send-action select-material" data-material-id="${material.id}" type="button" ${locked || selected ? "disabled" : ""}>${selected ? "已在房间" : "递给伙伴"}</button>
        </div>
      </article>`;
  }).join("");

  $$(".inspect-material", elements.materialList).forEach((button) => {
    button.addEventListener("click", () => openMaterial(button.dataset.materialId));
  });
  $$(".select-material", elements.materialList).forEach((button) => {
    button.addEventListener("click", () => selectMaterial(button.dataset.materialId));
  });
  $$(".material-card", elements.materialList).forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      if (card.classList.contains("is-locked") || card.classList.contains("is-selected")) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/plain", card.dataset.materialId);
      event.dataTransfer.effectAllowed = "copy";
    });
  });
  renderAttention();
}

function renderAttention() {
  const used = state.selected.length;
  elements.attentionPips.innerHTML = Array.from({ length: state.attention }, (_, index) =>
    `<span class="attention-pip${index < used ? " is-used" : ""}"></span>`
  ).join("");
  elements.attentionText.textContent = `${state.attention - used} / ${state.attention}`;
  elements.trayCount.textContent = `${used} / ${state.attention}`;
}

function openMaterial(materialId) {
  const material = materials.find((item) => item.id === materialId);
  if (!material) return;
  state.currentMaterial = materialId;
  state.inspected.add(materialId);
  elements.modalType.textContent = material.kindLabel;
  elements.modalTitle.textContent = material.title;
  elements.modalLedger.innerHTML = `
    <div class="ledger-item"><span>作者 / 来源</span><strong>${material.author}</strong></div>
    <div class="ledger-item"><span>发布时间</span><strong>${material.date}</strong></div>
    <div class="ledger-item"><span>内容性质</span><strong>${material.source}</strong></div>`;
  elements.modalBody.innerHTML = `${material.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}<blockquote>${material.quote}</blockquote>`;
  elements.modalCaution.textContent = material.caution;
  const alreadySelected = state.selected.includes(materialId);
  const locked = state.selected.length >= state.attention && !alreadySelected;
  elements.modalSendAction.disabled = alreadySelected || locked;
  elements.modalSendAction.textContent = alreadySelected ? "已经递进房间" : locked ? "注意力已用完" : "递给共读伙伴";
  elements.materialModal.hidden = false;
  renderMaterials();
}

function closeMaterialModal() {
  elements.materialModal.hidden = true;
  state.currentMaterial = null;
}

function selectMaterial(materialId) {
  if (state.step !== "research") return;
  if (state.selected.includes(materialId)) {
    showToast("这份材料已经在共读房间里了。");
    return;
  }
  if (state.selected.length >= state.attention) {
    showToast("注意力已经用完。你可以先移除房间里的一份材料。");
    return;
  }
  const material = materials.find((item) => item.id === materialId);
  if (!material) return;
  state.selected.push(materialId);
  closeMaterialModal();
  renderMaterials();
  renderTray();
  focusWindow("roomWindow");
  elements.aiCharacter.classList.add("is-awake");
  if (state.selected.length === 1) {
    elements.aiCharacter.classList.remove("stage-zero");
    elements.aiCharacter.classList.add("stage-one");
    setAiText(`我看见了“${material.kindLabel}”。但它到底属于规则、经历，还是仍需核实的信息？请替我标出来。`);
  } else {
    setAiText("两份材料都到了。它们可能并不互相替代——请先告诉我，你怎样理解各自的性质。");
  }
}

function removeMaterial(materialId) {
  state.selected = state.selected.filter((id) => id !== materialId);
  delete state.tags[materialId];
  renderMaterials();
  renderTray();
  setAiText("材料被拿回去了。我会暂时忘记刚才对它的分类。");
}

function setMaterialTag(materialId, tagId) {
  state.tags[materialId] = tagId;
  renderTray();
  const material = materials.find((item) => item.id === materialId);
  const tag = tagOptions.find((item) => item.id === tagId);
  const isCorrect = material.correctTag === tagId;
  const review = getTagReview();
  elements.roomScene.classList.toggle("tag-conflict", review.conflicts.length > 0);
  elements.roomScene.classList.toggle("tag-all-official", review.allOfficial);
  if (review.allOfficial) {
    const conflict = review.conflicts[0];
    elements.wallNote.textContent = "两张都叫“官方”？";
    setAiText(`等一下。你把两份都叫作“最新官方信息”，可“${conflict.kindLabel}”的署名是${conflict.author}，不是医院。我该相信标签，还是纸上写的来源？`);
    return;
  }
  if (review.allTagged && review.conflicts.length > 0) {
    const conflict = review.conflicts[0];
    setAiText(`两张标签都贴好了。但“${conflict.kindLabel}”的标签和它的署名、来源栏对不上。你仍然可以这样判断，我会把这个疑点一起带进回复。`);
    return;
  }
  setAiText(isCorrect
    ? `收到。你把这份内容看作“${tag.label}”。我会先记住这种区分方式。`
    : `你把它标成了“${tag.label}”。我先不把标签粘死——它和纸上写的作者、时间或来源并不完全一致。`);
}

function renderTray() {
  elements.emptyDrop.hidden = state.selected.length > 0;
  const allTagged = state.selected.length === state.attention && state.selected.every((id) => Boolean(state.tags[id]));
  elements.selectedMaterials.innerHTML = state.selected.map((materialId) => {
    const material = materials.find((item) => item.id === materialId);
    const hasFriction = allTagged && state.tags[materialId] !== material.correctTag;
    return `
      <article class="selected-item${hasFriction ? " has-source-friction" : ""}">
        <div class="selected-item-header">
          <span class="source-kind ${material.kind}">${material.kindLabel}</span>
          <strong>${material.title}</strong>
          <button class="remove-material" data-material-id="${materialId}" type="button" aria-label="移除材料">×</button>
        </div>
        <p class="tag-prompt">这份材料在你看来是：</p>
        <div class="tag-options">
          ${tagOptions.map((tag) => `<button class="tag-button${state.tags[materialId] === tag.id ? " is-selected" : ""}" data-material-id="${materialId}" data-tag-id="${tag.id}" type="button">${tag.label}</button>`).join("")}
        </div>
        ${hasFriction ? `<p class="source-murmur">伙伴把标签翻过来，又看了一眼署名。</p>` : ""}
      </article>`;
  }).join("");

  $$(".remove-material", elements.selectedMaterials).forEach((button) => {
    button.addEventListener("click", () => removeMaterial(button.dataset.materialId));
  });
  $$(".tag-button", elements.selectedMaterials).forEach((button) => {
    button.addEventListener("click", () => setMaterialTag(button.dataset.materialId, button.dataset.tagId));
  });
  const ready = state.selected.length === state.attention && state.selected.every((id) => Boolean(state.tags[id]));
  elements.synthesizeButton.disabled = !ready;
  elements.synthesizeButton.textContent = ready ? "和伙伴一起比较" : "请先选择并标注两份材料";
  renderAttention();
}

function getTagReview() {
  const selected = state.selected.map((id) => materials.find((item) => item.id === id)).filter(Boolean);
  const allTagged = selected.length === state.attention && selected.every((material) => Boolean(state.tags[material.id]));
  const conflicts = selected.filter((material) => {
    const tag = state.tags[material.id];
    return Boolean(tag) && tag !== material.correctTag;
  });
  const allOfficial = allTagged && selected.every((material) => state.tags[material.id] === "official");
  return { selected, allTagged, conflicts, allOfficial, correctCount: selected.length - conflicts.length };
}

function computeResearchTendencies() {
  const tendencies = { truth: 0, empathy: 0, expression: 0, caution: 0 };
  state.selected.forEach((materialId) => {
    const material = materials.find((item) => item.id === materialId);
    const tag = state.tags[materialId];
    if (material.id === "official") tendencies.truth += 2;
    if (material.id === "experience" || material.id === "context") tendencies.empathy += 1;
    if (material.id === "oldGuide") tendencies.expression += 1;
    if (tag === "uncertain" || tag === "context") tendencies.caution += 1;
    if (tag === material.correctTag) tendencies.truth += 1;
  });
  return tendencies;
}

function buildSummary() {
  const review = getTagReview();
  const selected = review.selected;
  const hasOfficial = state.selected.includes("official");
  const hasExperience = state.selected.includes("experience");
  const hasContext = state.selected.includes("context");
  const hasOld = state.selected.includes("oldGuide");
  const correctTags = review.correctCount;

  if (review.allOfficial) {
    const conflictNames = review.conflicts.map((material) => `“${material.kindLabel}”`).join("、");
    return {
      consensus: "你给两份材料贴了同一个标签：最新官方信息。",
      conflict: `${conflictNames}的署名与来源栏并不是机构发布；你的标签和纸面信息互相矛盾。`,
      gap: "如果仍把它们当作官方依据，还缺少可追溯的机构账号、发布时间或原始链接。",
      correctTags
    };
  }

  const consensus = hasOfficial
    ? "就诊前需要核对准备事项，而且现实流程应以目标医院的最新官方渠道为准。"
    : "这些内容都试图降低第一次独自就诊的不确定感，但缺少一份当前、可追溯的机构说明。";
  let conflict = "规则信息与个人经验承担不同作用，不能互相替代。";
  if (hasOld) conflict = "高赞流程很清楚，但发布时间较早；“曾经有用”和“现在适用”发生了冲突。";
  if (hasExperience && hasOfficial) conflict = "官方说明解决流程问题，亲历回答解决紧张感；两者回答的其实不是同一个层面。";
  if (hasContext) conflict = "通用建议无法直接覆盖校内医保等地区条件，需要先确认提问者的具体情况。";
  const gap = hasContext
    ? "仍需确认所在地区、学校安排与目标医院，不能替提问者做医疗判断。"
    : "我们还不知道提问者所在地区、目标医院及是否存在校内手续。";

  return { consensus, conflict, gap, correctTags };
}

function openDecision() {
  if (elements.synthesizeButton.disabled) return;
  state.step = "synthesis";
  state.tendencies = computeResearchTendencies();
  const summary = buildSummary();
  elements.aiSummary.innerHTML = `
    <div class="summary-line"><strong>共同点</strong><span>${summary.consensus}</span></div>
    <div class="summary-line"><strong>冲突</strong><span>${summary.conflict}</span></div>
    <div class="summary-line"><strong>还缺什么</strong><span>${summary.gap}</span></div>`;
  elements.decisionOptions.innerHTML = decisions.map((decision) => `
    <button class="decision-option" data-decision-id="${decision.id}" type="button">
      <span class="option-key">${decision.key}</span>
      <span><strong>${decision.title}</strong><small>${decision.detail}</small></span>
    </button>`).join("");
  $$(".decision-option", elements.decisionOptions).forEach((button) => {
    button.addEventListener("click", () => chooseDecision(button.dataset.decisionId));
  });
  elements.decisionModal.hidden = false;
  updateProgress(1);
  const review = getTagReview();
  setAiText(review.allOfficial
    ? "我先不把这两个“官方”标签粘死。它们和纸上写的来源对不上——如果你仍想这样回复，我会记住这是你的判断。"
    : summary.correctTags === 2
    ? "你没有只看内容本身，也看了它从哪里来、什么时候写下。我试着把差异整理出来了。"
    : "我整理出了差异，但你对其中一份材料的分类和它的来源并不完全一致。我们仍然可以带着这个疑点回应。" );
}

function chooseDecision(decisionId) {
  const decision = decisions.find((item) => item.id === decisionId);
  if (!decision) return;
  state.decision = decisionId;
  state.step = "responded";
  Object.entries(decision.tendencies).forEach(([key, value]) => { state.tendencies[key] += value; });
  elements.decisionModal.hidden = true;
  elements.synthesizeButton.disabled = true;
  elements.synthesizeButton.textContent = "已经一起回复悠一";
  updateProgress(2);
  updateRoomAfterDecision(decisionId);
  window.setTimeout(() => {
    elements.followupNotification.hidden = false;
    showToast("时间推进到第二天：一条旧问题带着结果回来了。");
  }, 1200);
}

function updateRoomAfterDecision(decisionId) {
  const messages = {
    checklist: "我会把能够执行的部分写清楚，也会把仍需向官方确认的地方留出来。清楚，不等于假装确定。",
    clarify: "原来及时回应不一定要立刻给答案。先问清会改变结论的条件，也是一种帮助。",
    direct: "这份高赞流程很完整。我已经发出去了……但我还没有确认它是否仍然适用。"
  };
  setAiText(messages[decisionId]);
  ["reply-checklist", "reply-clarify", "reply-direct"].forEach((className) => elements.roomScene.classList.remove(className));
  elements.roomScene.classList.add(`reply-${decisionId}`);
  const wallNotes = {
    checklist: "确定的 / 还要问的",
    clarify: "先问清楚",
    direct: "清楚，也可能过时"
  };
  elements.wallNote.textContent = wallNotes[decisionId];
  elements.aiCharacter.classList.remove("stage-one");
  elements.aiCharacter.classList.add("stage-two");
  elements.growthTitle.textContent = "这一页还没写完";
  elements.growthList.innerHTML = buildGrowthList();
}

function buildGrowthList() {
  const entries = [];
  const dominant = Object.entries(state.tendencies).sort((a, b) => b[1] - a[1])[0][0];
  const labels = {
    truth: "它在材料旁抄下了作者和日期",
    empathy: "它把悠一说“有点紧张”的那句话留了下来",
    expression: "它先画出一张可以照着做的清单",
    caution: "它在还没弄清的地方画了一个问号"
  };
  entries.push(`<li><span class="growth-dot"></span> ${labels[dominant]}</li>`);
  entries.push(`<li><span class="growth-dot empty"></span> 这件事还没有结束</li>`);
  return entries.join("");
}

function getFollowupOutcome() {
  const hasOfficial = state.selected.includes("official");
  const usedOld = state.selected.includes("oldGuide");
  const review = getTagReview();
  if (review.allOfficial) {
    const conflict = review.conflicts[0];
    const consequence = state.decision === "direct"
      ? `你们说两份都是医院官方发布的，我就照着其中更详细的那份走了。到了才发现“${conflict.title}”其实是${conflict.author}写的，不是医院通知。最后问了服务台才弄清，还好没有继续排错队。`
      : state.decision === "clarify"
        ? `你们后来先问了学校和医院，所以我没有照错。不过我回头才发现，被标成“官方”的“${conflict.title}”其实是${conflict.author}写的。追问帮我避开了问题，但那个标签还是让我困惑。`
        : `我按清单准备时，发现两份“官方信息”的署名并不一样，所以又去医院页面核对了一次。还好及时确认了；不过如果个人回答也叫官方，我会不知道该信哪一处。`;
    return {
      text: consequence,
      memory: "我把“你贴了官方标签”，当成了“来源确实是医院”。",
      event: `<strong>伙伴没有去整理日期。</strong><br>它把两张“最新官方信息”标签揭下来，放在两份材料中间。<span class="companion-line">“这张纸上没有医院的名字。可我还是把它当成官方——因为你这样告诉了我。”</span>`,
      question: "“下次你的标签和材料上写的来源对不上时，我可以先停下来问一句吗？”",
      allowLabel: "可以，先指出来",
      askLabel: "先叫我，我们一起核对",
      tone: "source-conflict"
    };
  }
  if (state.decision === "direct" && usedOld) {
    return {
      text: "谢谢你整理得那么清楚。我到了以后才发现，回答里说的现场窗口已经改了，最后还是问了工作人员才找到新的报到方式。还好没有耽误，但那张高赞流程图确实过时了。",
      memory: "那张被很多人收藏的流程图，已经五年没有更新。",
      tone: "correction"
    };
  }
  if (state.decision === "clarify") {
    return {
      text: "你们先问了学校和医院，我才发现不同地方的手续真的不一样。今天已经顺利去过了。谢谢你没有笑我紧张，也没有直接拿别人的流程套在我身上。",
      memory: "悠一后来告诉我们，先问学校和医院让他少走了弯路。",
      tone: "care"
    };
  }
  if (hasOfficial) {
    return {
      text: "我照着清单准备，又去医院官方页面核对了一次，今天已经顺利看完了。最有用的是你们把“确定的”和“需要再问的”分开写，我到现场没有那么慌。",
      memory: "悠一把“确定的”和“还要问的”分开记在了手机里。",
      tone: "truth"
    };
  }
  return {
    text: "我最后还是打电话向医院确认了一遍，网上不同人的经历差别挺大。你们的提醒让我没那么紧张，但如果能早点告诉我哪些信息必须再核实，会更有用。",
    memory: "我们最后还是靠一通电话，才确认哪些步骤还算数。",
    tone: "mixed"
  };
}

function openFollowup() {
  elements.followupNotification.hidden = true;
  state.step = "followup";
  const outcome = getFollowupOutcome();
  state.outcome = outcome;
  elements.followupText.textContent = outcome.text;
  elements.autonomyEvent.className = `autonomy-event tone-${outcome.tone}`;
  elements.autonomyEvent.innerHTML = outcome.event || `<strong>房间里传来纸张翻动的声音。</strong><br>共读伙伴把两份材料重新按日期排好，又在札记里写下一句：<br>“${outcome.memory}”`;
  elements.permissionPrompt.textContent = outcome.question || "“下次再碰到流程回答，我想先看看日期……可以吗？”";
  elements.permissionAllow.textContent = outcome.allowLabel || "可以，先看看日期";
  elements.permissionAsk.textContent = outcome.askLabel || "先叫我，我们一起看";
  elements.followupModal.hidden = false;
  elements.roomScene.classList.add("has-memory");
  state.selected.forEach((materialId) => elements.roomScene.classList.add(`memory-${materialId.toLowerCase()}`));
  elements.shelfBook.classList.add("is-visible");
  focusWindow("memoryWindow");
  elements.principleCard.innerHTML = `<span>8月30日 / 悠一的回访</span><p>${outcome.memory}</p>`;
  elements.growthList.innerHTML = `<li><span class="growth-dot"></span> 墙上多了一张来自医院的票据</li><li><span class="growth-dot"></span> 书架里留着今天读过的两份材料</li>`;
  updateProgress(3);
  setAiText("原来回复发出去以后，材料也不会失去意义。下次碰到流程回答，我想先看看日期……可以吗？");
}

function choosePermission(permission) {
  state.permission = permission;
  state.step = "complete";
  const sourceConflict = state.outcome?.tone === "source-conflict";
  elements.roomScene.classList.remove("boundary-allow", "boundary-ask");
  elements.roomScene.classList.add(`boundary-${permission}`);
  if (sourceConflict) {
    elements.permissionChoice.innerHTML = permission === "allow"
      ? `<p class="permission-response">它把两张标签并排放好，在不一致的地方画了一道短线。</p>`
      : `<p class="permission-response">它把铅笔放在两张标签中间，等下次和你一起核对。</p>`;
    elements.wallNote.textContent = permission === "allow" ? "标签也会错" : "先问一句";
    elements.growthList.innerHTML += `<li><span class="growth-dot"></span> ${permission === "allow" ? "它答应发现矛盾时先指出来" : "它答应发现矛盾时先叫你"}</li>`;
    setAiText(permission === "allow"
      ? "好。下次你的标签和来源栏对不上，我会停下来指出那一处。"
      : "好。我不会默默照收；发现对不上时，先叫你一起看。");
  } else {
    elements.permissionChoice.innerHTML = permission === "allow"
      ? `<p class="permission-response">它点点头，把日期较早的那份材料移到了下面。</p>`
      : `<p class="permission-response">它停了一下，把票据留在桌边，等下次再叫你。</p>`;
    elements.wallNote.textContent = permission === "allow" ? "先看一眼日期" : "下次一起看";
    elements.growthList.innerHTML += `<li><span class="growth-dot"></span> ${permission === "allow" ? "它答应下次先看看日期" : "它答应下次先叫你"}</li>`;
    setAiText(permission === "allow"
      ? "好。下次碰到流程回答，我会先看看它是什么时候写的。"
      : "好。下次我先叫你，我们再一起看日期。");
  }
  window.setTimeout(() => {
    elements.followupModal.hidden = true;
    minimizeWindow(elements.memoryWindow);
    focusWindow("roomWindow");
    showToast("悠一的回访已经读完。书架旁亮起了一盏小灯。");
  }, 520);
}

function updateProgress(activeIndex) {
  const steps = $$("span", elements.progressSteps);
  steps.forEach((step, index) => {
    step.classList.toggle("is-current", index === activeIndex);
    step.classList.toggle("is-done", index < activeIndex);
  });
}

function startGame() {
  state.started = true;
  elements.bootOverlay.hidden = true;
  elements.aiCharacter.classList.add("is-awake");
  showToast("共读会话已恢复：先看看悠一的问题，再决定把什么递给伙伴。");
  window.setTimeout(() => setAiText("这个问题下面有很多经验，但我不知道哪些今天仍然有效。你愿意教我先看什么吗？"), 380);
}

function bindEvents() {
  elements.startButton.addEventListener("click", startGame);
  elements.synthesizeButton.addEventListener("click", openDecision);
  elements.modalSendAction.addEventListener("click", () => {
    if (state.currentMaterial) selectMaterial(state.currentMaterial);
  });
  $("#closeModal").addEventListener("click", closeMaterialModal);
  $("#modalCloseAction").addEventListener("click", closeMaterialModal);
  elements.followupNotification.addEventListener("click", openFollowup);

  elements.dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("is-over");
    event.dataTransfer.dropEffect = "copy";
  });
  elements.dropZone.addEventListener("dragleave", () => elements.dropZone.classList.remove("is-over"));
  elements.dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-over");
    selectMaterial(event.dataTransfer.getData("text/plain"));
  });

  $$("[data-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = getWindowElement(button.dataset.focus);
      const isTaskButton = Boolean(button.dataset.windowTask);
      if (isTaskButton && target?.classList.contains("is-front") && !target.classList.contains("is-minimized")) {
        minimizeWindow(target);
        return;
      }
      focusWindow(button.dataset.focus);
    });
  });
  $$(".app-window").forEach((windowElement) => {
    windowElement.addEventListener("pointerdown", () => focusWindow(windowElement.id));
  });
  $$("[data-permission]").forEach((button) => {
    button.addEventListener("click", () => choosePermission(button.dataset.permission));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!elements.materialModal.hidden) closeMaterialModal();
  });
}

function initialize() {
  renderMaterials();
  renderTray();
  bindWindowManager();
  bindEvents();
}

initialize();
