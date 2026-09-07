// save-system.js - 共读模式检查点存档
// 在场景入口调用 CoReadSave.capture(position)；恢复时由 app-v1.js 的 resumeGame() 重新进入场景。
// 对话进行中的小段进度不落盘（恢复后回到该场景开头），避免隐藏属性被重复累计。

(() => {
  const STORAGE_KEY = "coread-save-v1";
  const SAVE_VERSION = 1;

  const STATE_FIELDS = [
    "chapterId", "step", "notificationMode", "attention", "selected", "tags", "tagHistory", "decision", "permission",
    "companionName", "tendencies", "currentTendencies", "outcome", "route",
    "accountabilityChoice", "accountabilityAftermathChoice", "accountabilityResolution",
    "careerAccountabilityChoice", "careerAccountabilityResolution", "finalChoice",
    "draftChoice", "draftEvaluation", "hospitalFollowupReplyChoice", "hospitalFollowupClosingChoice",
    "hospitalConversationResolution", "memoryRecords", "traitEvents",
    "onboardingDismissed", "computerMessageReady", "browserUnlocked",
    "chapterTwoPermissionResolved", "autoFlaggedMaterialId", "autoFlagCopy",
    "chapterOneSnapshot", "chapterTwoSnapshot", "locked"
  ];

  // 需要原样恢复的视觉/界面状态（均为无监听器的节点或仅恢复属性的按钮）
  const SCENE_HTML_NODES = [
    "decisionPrompt", "decisionOptions", "aiSummary",
    "draftThread", "draftOptions",
    "publicComments", "publicCommentCount",
    "progressSteps"
  ];
  const SCENE_TEXT_NODES = [
    "chapterName", "systemClock", "taskbarTime", "aiSpeaker", "aiText",
    "growthTitle", "draftWorkshopStatus", "draftWorkshopTitle", "draftPreviewText",
    "followupEyebrow", "followupTitle", "followupResult", "followupAuthor", "followupText",
    "accountabilityStatus", "accountabilityTitle", "accountabilityReplyLabel", "accountabilityReactionLabel",
    "accountabilityReply", "accountabilityReaction", "permissionPrompt",
    "notificationPixel", "notificationTitle", "notificationDetail",
    "researchInstruction", "wallNote"
  ];
  const SCENE_FLAG_NODES = [
    "draftWorkshop", "draftPreview", "sendDraftAction",
    "followupPanel", "followupContinue", "publicDiscussion", "privateCompanionNote", "privateCompanionText",
    "accountabilityPanel", "accountabilityOutcome",
    "roomDialogueActions", "permissionAllow", "permissionAsk", "confirmChapterReview",
    "companionNaming", "finalConversation", "materialModal",
    "followupNotification", "onboardingGuide", "roomComputerMessage"
  ];
  const SCENE_CLASS_NODES = [
    "roomScene", "aiCharacter", "roomComputer", "autonomyFold", "shelfBook",
    "followupPanel", "accountabilityPanel", "responsePanel",
    "memoryWindow", "browserWindow", "roomWindow", "principleCard"
  ];

  function readSave() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.v !== SAVE_VERSION || !data.position || !data.state) return null;
      return data;
    } catch (error) {
      return null;
    }
  }

  function hasSave() {
    const save = readSave();
    return Boolean(save && save.state);
  }

  function saveMeta() {
    const save = readSave();
    if (!save) return null;
    const chapterLabel = save.state.chapterId === "career" ? "档案 01" : "档案 00";
    return { savedAt: save.savedAt, chapterId: save.state.chapterId, chapterLabel, position: save.position };
  }

  function clear() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (error) { /* 忽略无痕模式下的写入失败 */ }
  }

  function captureState() {
    const data = {};
    STATE_FIELDS.forEach((field) => { data[field] = state[field] === undefined ? null : state[field]; });
    data.inspected = [...state.inspected];
    data.ambientSpeechHistory = [...state.ambientSpeechHistory];
    return data;
  }

  function captureScene() {
    const scene = {};
    SCENE_HTML_NODES.forEach((id) => {
      const node = document.getElementById(id);
      scene[id] = node ? { html: node.innerHTML } : null;
    });
    SCENE_TEXT_NODES.forEach((id) => {
      const node = document.getElementById(id);
      scene[id] = node ? { text: node.textContent } : null;
    });
    SCENE_FLAG_NODES.forEach((id) => {
      const node = document.getElementById(id);
      scene[id] = node ? { hidden: node.hidden } : null;
    });
    SCENE_CLASS_NODES.forEach((id) => {
      const node = document.getElementById(id);
      scene[id] = node ? { className: node.className } : null;
    });
    const wallBoard = document.querySelector(".wall-note");
    scene.wallBoard = wallBoard ? { className: wallBoard.className } : null;
    const aiEmotion = document.getElementById("aiCharacter");
    scene.aiCharacterEmotion = aiEmotion ? { emotion: aiEmotion.dataset.emotion || "idle", baseLabel: aiEmotion.dataset.baseLabel || "" } : null;
    const continueButton = document.getElementById("followupContinue");
    if (continueButton) scene.followupContinue = { hidden: continueButton.hidden, html: continueButton.innerHTML, disabled: continueButton.disabled };
    const sendDraft = document.getElementById("sendDraftAction");
    if (sendDraft) scene.sendDraftAction = { hidden: sendDraft.hidden, disabled: sendDraft.disabled };
    return scene;
  }

  function applyScene(scene) {
    if (!scene) return;
    SCENE_HTML_NODES.forEach((id) => {
      const node = document.getElementById(id);
      if (node && scene[id] && scene[id].html !== undefined) node.innerHTML = scene[id].html;
    });
    SCENE_TEXT_NODES.forEach((id) => {
      const node = document.getElementById(id);
      if (node && scene[id] && scene[id].text !== undefined) node.textContent = scene[id].text;
    });
    SCENE_FLAG_NODES.forEach((id) => {
      const node = document.getElementById(id);
      if (node && scene[id] && scene[id].hidden !== undefined) node.hidden = scene[id].hidden;
    });
    SCENE_CLASS_NODES.forEach((id) => {
      const node = document.getElementById(id);
      if (node && scene[id] && scene[id].className) node.className = scene[id].className;
    });
    const wallBoard = document.querySelector(".wall-note");
    if (wallBoard && scene.wallBoard && scene.wallBoard.className) wallBoard.className = scene.wallBoard.className;
    const aiCharacter = document.getElementById("aiCharacter");
    if (aiCharacter && scene.aiCharacterEmotion) {
      if (scene.aiCharacterEmotion.emotion) aiCharacter.dataset.emotion = scene.aiCharacterEmotion.emotion;
      if (scene.aiCharacterEmotion.baseLabel) aiCharacter.dataset.baseLabel = scene.aiCharacterEmotion.baseLabel;
    }
    const continueButton = document.getElementById("followupContinue");
    if (continueButton && scene.followupContinue) {
      continueButton.hidden = scene.followupContinue.hidden;
      continueButton.innerHTML = scene.followupContinue.html;
      continueButton.disabled = scene.followupContinue.disabled;
    }
    const sendDraft = document.getElementById("sendDraftAction");
    if (sendDraft && scene.sendDraftAction) {
      sendDraft.hidden = scene.sendDraftAction.hidden;
      sendDraft.disabled = scene.sendDraftAction.disabled;
    }
  }

  window.CoReadSave = { capture, applyScene, readSave, hasSave, saveMeta, clear, SAVE_VERSION };
})();
