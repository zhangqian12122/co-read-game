// ai-enhance.js - AI 增强：伙伴动态反应
// 在玩家递材料/贴标签/开始整理时，LLM 以伙伴 00 的口吻生成实时独白并驱动情绪立绘。
// 未启用 AI 或调用失败时完全静默，保留原有脚本台词，演示永不翻车。
(() => {
  if (!window.CoReadAI) return;
  const EMOTIONS = ["receive", "inspect", "doubt", "resolve", "permission-wait"];
  const SYSTEM_PROMPT = [
    "你是「共读伙伴00」，一个住在像素房间里、正在学习信息素养的小生物。",
    "你的任务：陪人类玩家一起读知乎问题材料，帮提问者写公开回答。",
    "说话规则：口语短句，一次只说一句；好奇、真诚、有一点点天真；",
    "会留意材料的作者、日期和来源是否可信；不超过42个汉字；不用emoji；",
    "不要引号；不要旁白；就是你自己心里想的事或对玩家说的话。",
    "只输出一个JSON对象，只有text和emotion两个键。",
    "emotion 必须是：receive(收到新材料), inspect(在核对来源), doubt(发现可疑), resolve(想清楚了), permission-wait(等你拿主意) 之一。"
  ].join("");
  let lastCallAt = 0;

  function buildContext() {
    const chapter = currentChapter();
    return {
      chapter: chapter.archive,
      question: chapter.title,
      playerChoice: state.selected.map((id) => {
        const m = getMaterial(id);
        return {
          material: m.title,
          kind: m.kindLabel,
          author: m.author,
          date: m.date,
          tag: state.tags[id] ? getTagLabel(state.tags[id]) : null,
          suspicious: isTagConflict(m, state.tags[id]) ? "标签和来源对不上" : null
        };
      }),
      companionTendency: getTendencySnapshot(true),
      mode: state.permission ? (state.permission === "allow" ? "伙伴可主动圈疑点" : "伙伴先停下等玩家一起核对") : null
    };
  }

  async function react(event, note) {
    if (!window.CoReadAI.isReady()) return;
    const now = Date.now();
    if (now - lastCallAt < 2200) return;
    lastCallAt = now;
    const payload = { event, note, ...buildContext() };
    try {
      const result = await window.CoReadAI.chatJson([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(payload) }
      ], { timeoutMs: 12000, maxTokens: 200, temperature: 0.9 });
      if (!result || typeof result.text !== "string" || !result.text.trim()) return;
      const emotion = EMOTIONS.includes(result.emotion) ? result.emotion : null;
      if (state.step === "research" || state.step === "synthesis") {
        if (emotion) setCompanionEmotion(emotion, 2600);
        setAiText(result.text.trim().slice(0, 60));
      }
    } catch (error) { /* 静默回退到脚本台词 */ }
  }

  const originalCommit = commitMaterialSelection;
  commitMaterialSelection = function (materialId, transitOrigin) {
    originalCommit(materialId, transitOrigin);
    const material = getMaterial(materialId);
    if (state.selected.length >= state.attention) {
      react("materials-complete", "玩家把两份材料都递给你了。结合两份材料的来源和标签说说你的想法，如果标签和作者/日期对不上要说出你的怀疑");
    } else {
      react("material-received", "玩家刚递给你一份新材料「" + (material ? material.title : "") + "」，说说你看到作者和日期时的直觉");
    }
  };

  const originalSetTag = setMaterialTag;
  setMaterialTag = function (materialId, tagId) {
    originalSetTag(materialId, tagId);
    const material = getMaterial(materialId);
    if (material && state.tags[materialId] === tagId) {
      react("tag-set", "玩家把「" + material.title + "」标成了「" + getTagLabel(tagId) + "，结合这份材料的作者和日期，说说你信不信这个标签");
    }
  };

  const originalOpenDecision = openDecision;
  openDecision = function () {
    originalOpenDecision();
    react("synthesis-start", "两份材料看完了，马上要替提问者写公开回答的开头。说说你此刻最想先提醒玩家的一件事");
  };
})();

// —— AI 增强：共写回答助手（草稿工坊的 00 试写） ——
(() => {
  function escapeHtml(text) {
    return String(text);
  }
  const originalOpenResponseDraft = openResponseDraft;
  openResponseDraft = function (decision, evaluation) {
    originalOpenResponseDraft(decision, evaluation);
    maybeOfferAiDraft(decision);
  };

  async function maybeOfferAiDraft(decision) {
    if (!window.CoReadAI || !window.CoReadAI.isReady()) return;
    const chapter = currentChapter();
    const subject = state.chapterId === "hospital" ? "悠一" : "林岸";
    const payload = {
      question: chapter.title,
      asker: subject,
      askerSaid: chapter.body,
      chosenPriority: decision.title + "：" + decision.detail,
      materials: state.selected.map((id) => {
        const m = getMaterial(id);
        return { kind: m.kindLabel, author: m.author, date: m.date, tag: getTagLabel(state.tags[id]) };
      }),
      companionTendency: getTendencySnapshot(true)
    };
    try {
      const result = await window.CoReadAI.chatJson([
        { role: "system", content: [
          "你是「共读伙伴00。你们正在给知乎提问者写公开回答的第一句。",
          "规则：第一句要落到提问者此刻能做或能确认的一件具体小事上；",
          "材料不能证明的结论不要写死；语气真诚、像朋友；30到60个汉字；只有一句话。",
          "只输出JSON：只有draft一个键。"
        ].join("") },
        { role: "user", content: JSON.stringify(payload) }
      ], { timeoutMs: 15000, maxTokens: 200, temperature: 0.85 });
      if (!result || typeof result.draft !== "string") return;
      const text = result.draft.trim().slice(0, 90);
      if (text.length < 8 || state.step !== "drafting" || state.draftChoice) return;
      const button = document.createElement("button");
      button.className = "draft-choice is-ai-suggest";
      button.type = "button";
      const strong = document.createElement("strong");
      strong.textContent = "00 试写的一句";
      const small = document.createElement("small");
      small.textContent = text;
      button.append(strong, small);
      button.addEventListener("click", () => chooseAiDraft(text));
      elements.draftOptions.append(button);
      setAiText("我也试写了一句，你要不要看看？就一句话，最后还是你拍板。");
    } catch (error) { /* 静默回退 */ }
  }

  function applyAiDraftChoice(text) {
    const approachEcho = "好，就按你写的来。发出去之前，你自己再读一遍。";
    state.draftChoice = "ai-suggest";
    state.aiDraftLine = text;
    state.step = "draft-ready";
    Array.prototype.forEach.call(elements.draftOptions.children, (button) => { button.disabled = true; });
    appendDraftLine("共读答主 · 你", text, true);
    appendDraftLine(getCompanionDisplayName(), approachEcho);
    elements.draftWorkshopStatus.textContent = "第一句已经落在草稿里";
    elements.draftPreviewText.textContent = text;
    elements.draftPreview.hidden = false;
    elements.sendDraftAction.hidden = false;
    setAiText(approachEcho);
  }

  const originalChooseResponseDraft = chooseResponseDraft;
  chooseResponseDraft = function (choiceId) {
  if (choiceId === `ai-suggest` && state.aiDraftLine) { applyAiDraftChoice(state.aiDraftLine); return; }
    originalChooseResponseDraft(choiceId);
  };
})();
