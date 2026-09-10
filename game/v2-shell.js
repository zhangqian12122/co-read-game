// v2-shell.js - 回答主游戏 v2 外壳：窗口管理 / 开机流 / 任务栏
// 玩法逻辑在 game/engine.js；本文件只负责"这台电脑"本身。
(() => {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const escapeHtml = (value) => String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const osRoot = $("#osRoot");
  const elements = {
    workspace: $("#workspace"),
    bedroomPanel: $("#bedroomPanel"),
    collapseBedroom: $("#collapseBedroom"),
    expandBedroom: $("#expandBedroom"),
    bootOverlay: $("#bootOverlay"),
    startButton: $("#startButton"),
    osBadgeStage: $("#osBadgeStage"),
    osBadgeTime: $("#osBadgeTime"),
    toast: $("#toast"),
    addressBar: $("#addressBar"),
    questionKicker: $("#questionKicker"),
    questionTitle: $("#questionTitle"),
    questionBody: $("#questionBody"),
    questionStats: $("#questionStats"),
    researchInstruction: $("#researchInstruction"),
    materialList: $("#materialList"),
    attentionPips: $("#attentionPips"),
    attentionText: $("#attentionText"),
    chatThread: $("#chatThread"),
    chatAskerName: $("#chatAskerName"),
    moodPips: $("#moodPips"),
    patiencePips: $("#patiencePips"),
    patienceText: $("#patienceText"),
    handCards: $("#handCards"),
    turnHint: $("#turnHint"),
    trayCount: $("#trayCount"),
    dropZone: $("#dropZone"),
    emptyDrop: $("#emptyDrop"),
    selectedMaterials: $("#selectedMaterials"),
    synthesizeButton: $("#synthesizeButton"),
    aiSpeaker: $("#aiSpeaker"),
    aiText: $("#aiText"),
    wallNote: $("#wallNote"),
    playerPresenceState: $("#playerPresenceState"),
    materialModal: null
  };

  const stageNames = ["接题", "共读", "对话", "结算", "回信"];
  let toastTimer = null;

  function toast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
  }

  function setStage(index) {
    if (elements.osBadgeStage) {
      elements.osBadgeStage.textContent = stageNames[index] || stageNames[0];
    }
    const playerStates = ["准备中", "共读中", "回答中", "看结果", "等回信"];
    if (elements.playerPresenceState) {
      elements.playerPresenceState.textContent = playerStates[index] || playerStates[0];
    }
    const presence = document.getElementById("playerPresence");
    if (presence) {
      presence.dataset.stage = stageNames[index] || stageNames[0];
      presence.classList.toggle("is-answering", index === 2);
      presence.classList.toggle("is-reading", index === 1);
    }
  }

  let storyClock = "";
  function setClock(value) {
    if (typeof value === "string" && value) storyClock = value;
    if (storyClock) {
      if (elements.osBadgeTime) elements.osBadgeTime.textContent = storyClock;
      return;
    }
    const now = new Date();
    const pad = (v) => String(v).padStart(2, "0");
    if (elements.osBadgeTime) elements.osBadgeTime.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
  }

  // —— 窗口管理 ——
  const windowIds = ["browserWindow", "chatWindow", "memoryWindow"];
  let zTop = 10;

  function getWindow(id) { return document.getElementById(id); }

  function focusWindow(id) {
    const win = getWindow(id);
    if (!win) return;
    win.classList.remove("is-minimized");
    zTop += 1;
    win.style.zIndex = String(zTop);
    $$(".app-window").forEach((item) => item.classList.toggle("is-front", item.id === id));
  }

  function minimizeWindow(id) {
    const win = getWindow(id);
    if (!win) return;
    win.classList.add("is-minimized");
    win.classList.remove("is-front");
  }

  function toggleWindow(id) {
    const win = getWindow(id);
    if (!win) return;
    if (win.classList.contains("is-minimized") || !win.classList.contains("is-front")) focusWindow(id);
    else minimizeWindow(id);
  }

  function bindWindowChrome() {
    $$(".app-window").forEach((win) => {
      const titlebar = $(".titlebar", win);
      win.addEventListener("pointerdown", () => focusWindow(win.id));
      let drag = null;
      titlebar.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || event.target.closest(".window-controls")) return;
        const rect = win.getBoundingClientRect();
        const hostRect = osRoot.getBoundingClientRect();
        drag = {
          offsetX: event.clientX - rect.left,
          offsetY: event.clientY - rect.top,
          hostLeft: hostRect.left,
          hostTop: hostRect.top
        };
        win.style.left = Math.max(0, rect.left - hostRect.left) + "px";
        win.style.top = Math.max(0, rect.top - hostRect.top) + "px";
        try { titlebar.setPointerCapture(event.pointerId); } catch (e) { /* 忽略 */ }
      });
      titlebar.addEventListener("pointermove", (event) => {
        if (!drag) return;
        const maxLeft = osRoot.clientWidth - Math.min(win.offsetWidth, osRoot.clientWidth);
        const maxTop = osRoot.clientHeight - Math.min(win.offsetHeight, osRoot.clientHeight);
        const left = Math.min(Math.max(0, event.clientX - drag.offsetX - drag.hostLeft), Math.max(0, maxLeft));
        const top = Math.min(Math.max(0, event.clientY - drag.offsetY - drag.hostTop), Math.max(0, maxTop));
        win.style.left = left + "px";
        win.style.top = top + "px";
      });
      const endDrag = () => { drag = null; };
      titlebar.addEventListener("pointerup", endDrag);
      titlebar.addEventListener("pointercancel", endDrag);
      $$("[data-win]", win).forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          if (button.dataset.win === "minimize") minimizeWindow(win.id);
          if (button.dataset.win === "close") { toast("这个软件正被使用，先最小化吧。"); minimizeWindow(win.id); }
        });
      });
    });
    $$("[data-open]").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".dock-icon").forEach((item) => item.classList.toggle("is-active", item === button));
        focusWindow(button.dataset.open);
      });
    });
  }

  function bindBedroomToggle() {
    const setCollapsed = (collapsed) => {
      osRoot.classList.toggle("is-bedroom-collapsed", collapsed);
      elements.expandBedroom.hidden = !collapsed;
      elements.collapseBedroom.setAttribute("aria-expanded", String(!collapsed));
      elements.expandBedroom.setAttribute("aria-expanded", String(collapsed));
    };
    if (window.matchMedia && window.matchMedia("(max-width: 700px)").matches) setCollapsed(true);
    elements.collapseBedroom.addEventListener("click", () => {
      setCollapsed(true);
    });
    elements.expandBedroom.addEventListener("click", () => {
      setCollapsed(false);
    });
  }

  // 旧版 AI 设置逻辑保留在历史代码中，但本页面不再挂载设置窗口或调用它。
  function aiPresetValues(name) {
    if (name === "zhipu") return { baseUrl: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4-flash" };
    if (name === "deepseek") return { baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" };
    return null;
  }

  function refreshAiIndicator() {
    const ready = Boolean(window.CoReadAI && window.CoReadAI.isReady());
    const settingsWindow = getWindow("settingsWindow");
    if (settingsWindow) settingsWindow.classList.toggle("is-ai-on", ready);
    return ready;
  }

  function bindAiSettings() {
    const settingsWindow = getWindow("settingsWindow");
    if (!settingsWindow || !window.CoReadAI) return;
    const enabledToggle = settingsWindow.querySelector("#aiEnabledToggle");
    const baseUrl = settingsWindow.querySelector("#aiBaseUrl");
    const apiKey = settingsWindow.querySelector("#aiApiKey");
    const model = settingsWindow.querySelector("#aiModel");
    const testButton = settingsWindow.querySelector("#aiTestButton");
    const testResult = settingsWindow.querySelector("#aiTestResult");
    const current = window.CoReadAI.get();
    enabledToggle.checked = current.enabled;
    baseUrl.value = current.baseUrl;
    apiKey.value = current.apiKey;
    model.value = current.model;
    const sync = () => {
      window.CoReadAI.update({ enabled: enabledToggle.checked, baseUrl: baseUrl.value.trim(), apiKey: apiKey.value.trim(), model: model.value.trim() });
      refreshAiIndicator();
    };
    enabledToggle.addEventListener("change", sync);
    baseUrl.addEventListener("change", sync);
    apiKey.addEventListener("change", sync);
    model.addEventListener("change", sync);
    $$("[data-ai-preset]", settingsWindow).forEach((button) => {
      button.addEventListener("click", () => {
        const preset = aiPresetValues(button.dataset.aiPreset);
        if (!preset) return;
        baseUrl.value = preset.baseUrl;
        model.value = preset.model;
        enabledToggle.checked = true;
        sync();
        testResult.textContent = "已填入，填上 Key 即可测试";
      });
    });
    testButton.addEventListener("click", async () => {
      sync();
      testResult.textContent = "连接中……";
      try {
        const reply = await window.CoReadAI.test();
        testResult.textContent = "连接成功：" + reply;
      } catch (error) {
        testResult.textContent = "连接失败，检查地址和 Key";
      }
    });
  }

  // —— 开机流 ——
  function startEngineFlow(attempt) {
    const engine = window.CoReadEngine;
    if (engine && typeof engine.newGame === "function") {
      engine.newGame();
      return;
    }
    if (engine && typeof engine.onShellReady === "function") {
      engine.onShellReady();
      return;
    }
    if (attempt >= 100) {
      demoArrival();
      return;
    }
    window.setTimeout(() => startEngineFlow(attempt + 1), 50);
  }

  function startShell(resumeMode) {
    elements.bootOverlay.hidden = true;
    setStage(0);
    if (window.CoReadCompanion) window.CoReadCompanion.start();
    if (resumeMode && window.CoReadEngine && window.CoReadEngine.resume) {
      window.CoReadEngine.resume();
      return;
    }
    setAiText("你来了？电脑一会儿会亮，求助来了我叫你。");
    // 新手教程（不阻塞游戏加载，盖在上面，关闭后直接玩）
    const tut = document.getElementById("tutorialOverlay");
    if (tut && !tut.dataset.shown) {
      tut.dataset.shown = "1";
      tut.hidden = false;
      const dismiss = document.getElementById("tutorialDismiss");
      if (dismiss) dismiss.addEventListener("click", () => { tut.hidden = true; });
      window.requestAnimationFrame(() => { if (dismiss && typeof dismiss.focus === "function") dismiss.focus(); });
    }
    // 首次加载时脚本可能比开机动画慢；等待引擎就绪，避免只填了问题却没有材料交互。
    window.setTimeout(() => startEngineFlow(0), 1200);
  }

  function demoArrival() {
    setStage(1);
    const pack = window.CoReadV2Pack;
    if (pack && pack.question) {
      fillQuestion(pack.question);
      if (typeof window.CoReadEngine === "undefined" || !window.CoReadEngine) toast("引擎未加载：当前为布局预览模式。");
    } else {
      toast("文案包未加载：当前为布局预览模式。");
    }
    focusWindow("browserWindow");
  }

  function fillQuestion(question) {
    elements.questionKicker.textContent = question.kicker || "生活经验";
    elements.questionTitle.textContent = question.title || "";
    elements.questionBody.textContent = question.body || "";
    elements.questionStats.innerHTML = (question.stats || []).map((s) => "<span>" + escapeHtml(s) + "</span>").join("");
    elements.addressBar.innerHTML = "<span class=\"lock-dot\"></span> " + escapeHtml(question.address || "zhihu.local/question");
    elements.chatAskerName.textContent = question.askerShort || "求助者";
  }

  function setAiText(message) {
    elements.aiText.textContent = message;
    const character = $("#aiCharacter");
    if (character) {
      character.classList.add("is-talking");
      window.setTimeout(() => character.classList.remove("is-talking"), 500);
    }
  }

  // —— 对外接口（engine 会用到） ——
  window.CoReadV2Shell = {
    elements,
    $,
    $$,
    toast,
    setStage,
    guide,
    setAiText,
    setClock,
    fillQuestion,
    focusWindow,
    minimizeWindow,
    stageNames,
    get pack() { return window.CoReadV2Pack || null; }
  };

  function bindContinueButton() {
    const continueButton = $("#continueButton");
    if (!continueButton) return;
    if (window.CoReadEngine && window.CoReadEngine.hasSave && window.CoReadEngine.hasSave()) continueButton.hidden = false;
    continueButton.addEventListener("click", () => startShell(true));
  }

  let tutStep = 0;
  function guide(key, text, targetSelector) {
    tutStep++;
    if (window.CoReadGuide) window.CoReadGuide.show(tutStep, text, targetSelector);
  }

  function refreshProgressLabel() {
    const bootProgress = document.getElementById("bootProgress");
    if (!bootProgress) return;
    try {
      const raw = window.localStorage.getItem("coread-v2-save");
      if (!raw) { bootProgress.textContent = "CO-READ OS / V2"; return; }
      const data = JSON.parse(raw);
      const stageNames = { research: "共读中", dialogue: "对话中", settle: "结算", letter: "已回信" };
      const label = stageNames[data.stage] || data.stage;
      bootProgress.textContent = "CO-READ OS / V2 · " + label;
    } catch (e) { bootProgress.textContent = "CO-READ OS / V2"; }
  }

  function initialize() {
    bindWindowChrome();
    bindBedroomToggle();
    bindContinueButton();
    refreshProgressLabel();
    elements.startButton.addEventListener("click", () => startShell(false));
    const osStart = document.getElementById("osStartButton");
    if (osStart) osStart.addEventListener("click", () => toast("共读OS · 知乎黑客松2026 参赛作品 · 由人与 AI 结对开发"));
    setClock();
    window.setInterval(setClock, 30000);
    focusWindow("browserWindow");
  }

  initialize();
})();
