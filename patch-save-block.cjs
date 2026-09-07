const fs = require("fs");
const D = String.fromCharCode(34);
const q = (s) => s.split("@Q@").join(D);
const text = fs.readFileSync("app-v1.js", "utf8");
const anchor = q(`function bindEvents() {`);
const count = text.split(anchor).length - 1;
if (count !== 1) { console.error("bindEvents anchor count=" + count); process.exit(1); }

const SAVE_BLOCK = `
// —— 检查点存档：场景入口自动存档，启动页可继续上次共读 ——

function checkpoint(position) {
  if (window.CoReadSave) window.CoReadSave.capture(position);
}

function handleStartButton() {
  if (window.CoReadSave && window.CoReadSave.hasSave()) {
    if (!window.confirm("开始新的共读档案会清掉上次的存档，确定吗？")) return;
    window.CoReadSave.clear();
  }
  startGame();
}

function applySavedState(data) {
  Object.keys(data).forEach((key) => {
    if (key === "inspected" || key === "ambientSpeechHistory") {
      state[key] = new Set(data[key] || []);
      return;
    }
    if (key in state) state[key] = data[key];
  });
}

function syncWindowChrome() {
  const front = $$(".app-window").find((item) => item.classList.contains("is-front"));
  $$(".desktop-icon[data-focus]").forEach((button) => {
    button.classList.toggle("is-active", Boolean(front) && button.dataset.focus === front.id);
  });
  $$("[data-window-task]").forEach((button) => {
    button.classList.toggle("is-active", Boolean(front) && button.dataset.windowTask === front.id);
  });
}

function restoreBaseScene(scene) {
  renderChapterCopy();
  renderMaterials();
  renderTray();
  renderMemoryRecords();
  updateCompanionIdentity();
  if (window.CoReadSave) window.CoReadSave.applyScene(scene);
  setBrowserLaunchAvailable(state.browserUnlocked);
  if (state.computerMessageReady) {
    const taskButton = $$("[data-window-task=browserWindow]")[0];
    if (taskButton) taskButton.textContent = "知乎 · 1 条新消息";
  }
  updateOnboardingGuide();
  syncWindowChrome();
}

function restoreRespondedScene() {
  const snapshot = state.chapterId === "hospital" ? state.chapterOneSnapshot : state.chapterTwoSnapshot;
  if (!snapshot) return;
  if (state.chapterId === "hospital") {
    setClock("16:24");
    const harmful = snapshot.evaluation.grade === "misleading";
    setNotification("followup", "!", harmful ? "悠一又发来一条消息" : "收到一条回访", harmful ? "语气似乎不太对" : "来自：悠一");
  } else {
    setClock("09:32");
    setNotification("career-followup", "信", "几周后来信", "来自：林岸");
  }
  updateProgress(3);
}

function restoreHospitalFollowup() {
  openFollowup();
  if (state.outcome && state.outcome.requiresAccountability && !state.accountabilityChoice) showAccountabilityChoices();
}

function resumeGame() {
  const save = window.CoReadSave ? window.CoReadSave.readSave() : null;
  if (!save) return;
  applySavedState(save.state || {});
  state.started = true;
  state.currentMaterial = null;
  state.pendingChapterAction = null;
  restoreBaseScene(save.scene);
  switch (save.position) {
    case "hospital-synthesis":
    case "career-synthesis":
      openDecision();
      break;
    case "hospital-drafting":
    case "career-drafting":
      openResponseDraft(getAvailableDecisions().find((item) => item.id === state.decision), state.draftEvaluation);
      break;
    case "hospital-draft-ready":
    case "career-draft-ready":
      openResponseDraft(getAvailableDecisions().find((item) => item.id === state.decision), state.draftEvaluation);
      chooseResponseDraft(state.draftChoice);
      break;
    case "hospital-responded":
    case "career-responded":
      restoreRespondedScene();
      break;
    case "hospital-followup":
      restoreHospitalFollowup();
      break;
    case "hospital-aftermath":
      showPermissionActions(hospitalPermissionCopies[state.outcome && state.outcome.permissionMode ? state.outcome.permissionMode : "source"]);
      break;
    case "hospital-naming":
      showCompanionNaming();
      break;
    case "career-followup":
      state.step = "career-followup-pending";
      openCareerFollowup();
      break;
    case "ending-conversation":
      completeSecondChapter(state.route);
      break;
    case "ending":
      showEnding();
      break;
    case "ended-room":
      focusWindow("roomWindow");
      break;
    default:
      if (state.chapterId === "hospital" && state.step === "research" && !state.browserUnlocked && !state.computerMessageReady) {
        window.clearTimeout(state.introTimer);
        state.introTimer = window.setTimeout(() => {
          state.introTimer = null;
          receiveFirstQuestion();
        }, 1400);
      }
      break;
  }
  elements.bootOverlay.hidden = true;
  elements.endingOverlay.hidden = save.position !== "ending";
  syncWindowChrome();
}

function refreshBootSaveUi() {
  if (!window.CoReadSave || !elements.continueButton) return;
  const meta = window.CoReadSave.saveMeta();
  if (!meta) return;
  const time = new Date(meta.savedAt);
  const pad = (value) => String(value).padStart(2, "0");
  elements.continueButton.hidden = false;
  if (elements.saveHint) {
    elements.saveHint.hidden = false;
    elements.saveHint.textContent = "检测到 " + meta.chapterLabel + " 的存档 · " + (time.getMonth() + 1) + "月" + time.getDate() + "日 " + pad(time.getHours()) + ":" + pad(time.getMinutes());
  }
}

`;
fs.writeFileSync("app-v1.js", text.replace(anchor, q(SAVE_BLOCK) + anchor));
console.log("patched save block");
