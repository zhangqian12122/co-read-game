// engine.js - 回答主游戏 v2 引擎（M2/M3：共读→素材卡→卡牌对话→结算→回信 + 存档 v2）
// 查表执行：判定/台词来自 question-pack.js；状态自动存档，刷新后可「继续上次共读」。
(() => {
  const shell = () => window.CoReadV2Shell;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const SAVE_KEY = "coread-v2-save";

  const S = {
    stage: "boot",
    attention: 2,
    attentionMax: 2,
    inspected: new Set(),
    cards: {},
    chatLog: [],
    dialogue: null,
    settle: null,
    growth: { proficiency: {}, fans: 0, exp: 0 },
    energy: 3,
    energyMax: 3,
    totalExp: 0,
    questionQueue: [],
    questionIndex: 0
  };

  const el = (name) => shell().elements[name] || document.getElementById(name);

  // —— 存档 v2 ——
  function serialize() {
    return {
      stage: S.stage,
      attentionMax: S.attentionMax,
      cards: S.cards,
      inspected: Array.from(S.inspected),
      chatLog: S.chatLog,
      growthItems: Array.from(growthSetRef()),
      growth: S.growth,
      dlg: S.dlg ? {
        mood: S.dlg.mood, patience: S.dlg.patience, patienceMax: S.dlg.patienceMax,
        used: S.dlg.used, last: S.dlg.last, hits: S.dlg.hits, done: S.dlg.done,
        unlocked: S.dlg.unlocked
      } : null,
      settle: S.settle ? { stale: S.settle.stale, hitsCount: S.settle.hitsCount, leaveText: S.settle.leave.text } : null
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
    for (let i = 0; i < S.attentionMax; i += 1) {
      const pip = document.createElement("span");
      if (i < Object.keys(S.cards).length) pip.className = "is-used";
      pips.append(pip);
    }
    el("attentionText").textContent = (S.attentionMax - Object.keys(S.cards).length) + " / " + S.attentionMax;
  }

  function renderMaterials() {
    const pack = shell().pack;
    const list = el("materialList");
    list.innerHTML = "";
    pack.materials.forEach((material) => {
      const hasCard = Boolean(S.cards[material.id]);
      const locked = Object.keys(S.cards).length >= S.attention && !hasCard;
      const inspected = S.inspected.has(material.id);
      const card = document.createElement("article");
      card.className = "material-card" + (hasCard ? " is-selected" : "") + (locked ? " is-locked" : "");
      card.dataset.materialId = material.id;
      card.innerHTML =
        '<div class="material-topline"><span class="source-kind">' + material.kindLabel + '</span><span class="material-date">' + material.date + '</span></div>' +
        "<h3>" + material.title + "</h3><p>" + material.excerpt + "</p>" +
        '<div class="material-meta"><span>' + material.author + '</span><span>·</span><span>' + material.engagement + "</span></div>" +
        '<div class="material-actions"><button class="text-action inspect-material" type="button">' + (S.cards[material.id] ? "看素材卡" : inspected ? "再次展开" : "展开检查") + '</button><span class="pick-state">' + (S.cards[material.id] ? "已做成素材卡" : locked ? "注意力不够了" : "") + "</span></div>";
      card.querySelector(".inspect-material").addEventListener("click", () => openMaterial(material));
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
    el("trayCount").textContent = ids.length + " / " + S.attentionMax + " 份材料";
    ids.forEach((id) => {
      const material = shell().pack.materials.find((m) => m.id === id);
      const cardInfo = S.cards[id];
      const item = document.createElement("article");
      item.className = "tray-item";
      item.innerHTML = "<strong>" + material.kindLabel + "</strong><span>" + material.title + "（" + cardInfo.sentenceIds.length + " 句 · 来源标「" + tagLabel(cardInfo.tag) + "」）</span>";
      tray.append(item);
    });
    const ready = ids.length >= S.attention;
    el("synthesizeButton").disabled = !ready;
    el("synthesizeButton").textContent = ready ? "素材卡就绪，去找他聊聊" : "挑好句子，去找他聊聊";
  }

  // —— 素材卡弹窗 ——
  let modalMaterial = null;
  let pickedIds = [];
  let pickedTag = null;

  function openMaterial(material) {
    modalMaterial = material;
    pickedIds = [];
    pickedTag = null;
    S.inspected.add(material.id);
    const existing = S.cards[material.id];
    if (existing) { pickedIds = existing.sentenceIds.slice(); pickedTag = existing.tag; }
    el("modalKind").textContent = material.kindLabel;
    el("modalTitle").textContent = material.title;
    el("modalLedger").innerHTML =
      '<div class="ledger-item"><span>作者 / 来源</span><strong>' + material.author + "</strong></div>" +
      '<div class="ledger-item"><span>发布时间</span><strong>' + material.date + "</strong></div>" +
      '<div class="ledger-item"><span>可信度提示</span><strong>' + material.caution + "</strong></div>";
    el("modalBodyText").innerHTML = material.body.map((p) => "<p>" + p + "</p>").join("");
    const inspectLines = shell().pack.companion && shell().pack.companion.inspectLines;
    if (inspectLines && inspectLines[material.id] && !S.cards[material.id]) shell().setAiText(inspectLines[material.id]);
    const list = el("sentenceList");
    list.innerHTML = "";
    material.sentences.forEach((sentence) => {
      const button = document.createElement("button");
      button.className = "sentence-item" + (pickedIds.includes(sentence.id) ? " is-picked" : "");
      button.type = "button";
      button.dataset.sentenceId = sentence.id;
      button.textContent = sentence.text;
      button.addEventListener("click", () => {
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
    document.getElementById("modalConfirm").textContent = existing ? "更新素材卡" : "做成素材卡";
    $("#materialModal").hidden = false;
    shell().guide("modal", "伙伴划出了候选句：点句子挑进素材卡（最多 3 句），再给材料标来源，标错了会出废卡。");
  }

  function refreshModal() {
    el("sentenceCount").textContent = pickedIds.length + " / 3";
    $("#modalConfirm").disabled = !(pickedIds.length >= 1 && pickedTag);
  }

  function calcQuality(material, card) {
    const sents = material.sentences.filter((s) => card.sentenceIds.includes(s.id));
    if (sents.some((s) => s.type === "ad")) return { key: "waste", why: "混进了广告句" };
    if (sents.some((s) => s.type === "stale")) return { key: "waste", why: "过时句没有处理（" + material.date + " 的信息）" };
    if (card.tag !== material.kind) return { key: "waste", why: "来源标错了（其实是「" + material.kindLabel + "」）" };
    if (sents.every((s) => s.type === "dry")) return { key: "premium", why: "句句对题" };
    return { key: "normal", why: "干货里带了一两句闲话" };
  }

  function confirmCard() {
    if (!modalMaterial || !(pickedIds.length >= 1 && pickedTag)) return;
    const material = modalMaterial;
    const card = { tag: pickedTag, sentenceIds: pickedIds.slice() };
    card.quality = calcQuality(material, card);
    S.cards[material.id] = card;
    $("#materialModal").hidden = true;
    renderMaterials();
    renderTray();
    renderAttention();
    save();
    const count = Object.keys(S.cards).length;
    const rl = shell().pack.companion.researchLines;
    if (count === 1) shell().setAiText(rl.firstMaterial.replace("{kind}", material.kindLabel));
    if (count >= S.attention) {
      shell().setAiText(rl.bothMaterials);
      shell().guide("cards", "两张素材卡就绪：点素材卡桌下的「去找他聊聊」，开始回答。");
      shell().toast("两份素材卡就绪：打开「回答对话」开始回复");
    }
  }

  function aiReady() {
    return Boolean(window.CoReadAI && window.CoReadAI.isReady());
  }

  let aiBusy = false;
  async function aiReact(hit) {
    if (!aiReady() || aiBusy) return;
    aiBusy = true;
    try {
      const D = S.dlg;
      const payload = {
        moment: hit ? "玩家刚打出一张命中提问者的牌" : "玩家刚打出的牌没有答中",
        askerMood: D.pack.moodLabels[D.moodOrder[D.mood]],
        askerPatience: D.patience,
        question: D.pack.question.title,
        cardSummary: Object.keys(S.cards).map((id) => {
          const m = D.pack.materials.find((x) => x.id === id);
          return m.kindLabel + "(" + S.cards[id].sentenceIds.length + "句)";
        }).join("、")
      };
      const result = await window.CoReadAI.chatJson([
        { role: "system", content: "你是共读伙伴00，正在旁观主人和一位知乎提问者对话。只输出JSON：{text:一句话点评(20字内,口语,不看镜头不说教)}" },
        { role: "user", content: JSON.stringify(payload) }
      ], { timeoutMs: 10000, maxTokens: 80, temperature: 0.9 });
      if (result && typeof result.text === "string" && result.text.trim()) {
        shell().setAiText(result.text.trim().slice(0, 40));
      }
    } catch (e) { /* 静默回退随机池 */ }
    aiBusy = false;
  }

  async function aiSuggest() {
    const D = S.dlg;
    if (!D || D.done || D.suggested) return;
    if (!aiReady()) { shell().toast("先在系统设置里开启 AI 增强，00 才能给建议。"); return; }
    D.suggested = true;
    renderDialogueUI();
    const payload = {
      question: D.pack.question.title,
      askerMood: D.pack.moodLabels[D.moodOrder[D.mood]],
      patienceLeft: D.patience,
      playedCards: D.hits.concat(Object.keys(D.used).filter((id) => !D.hits.includes(id))).join("、"),
      availableMethods: D.unlocked,
      cardSummary: Object.keys(S.cards).map((id) => {
        const m = D.pack.materials.find((x) => x.id === id);
        const sents = m.sentences.filter((s) => S.cards[id].sentenceIds.includes(s.id)).map((s) => s.text).join("；");
        return m.kindLabel + "：" + sents;
      })
    };
    shell().setAiText("我想想……");
    try {
      const result = await window.CoReadAI.chatJson([
        { role: "system", content: "你是共读伙伴00。根据素材卡内容和提问者当前状态，建议主人下一步该打哪种回答方式。availableMethods 里选一个。只输出JSON：{method:方式id, reason:一句话理由(20字内,口语)}。不代主人打牌，只建议。" },
        { role: "user", content: JSON.stringify(payload) }
      ], { timeoutMs: 15000, maxTokens: 120, temperature: 0.7 });
      if (!result || !D.unlocked.includes(result.method)) throw new Error("bad");
      const label = D.pack.methods[result.method] ? D.pack.methods[result.method].label : result.method;
      chatMsg("companion", "共读伙伴 00", "我建议打「" + label + "」——" + String(result.reason || "").slice(0, 30));
      shell().setAiText("只是建议，最后还是你来定。");
    } catch (e) {
      D.suggested = false;
      shell().setAiText("……我一时也没想好，你再打一张试试。");
    }
    renderDialogueUI();
    save();
  }

  function bindModal() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const modal = document.getElementById("materialModal");
        if (modal) modal.hidden = true;
      }
    });
    $("#closeMaterialModal").addEventListener("click", () => { $("#materialModal").hidden = true; });
    $("#modalCancel").addEventListener("click", () => { $("#materialModal").hidden = true; });
    $("#modalConfirm").addEventListener("click", confirmCard);
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
      if (button.id === "aiSuggestButton") { button.disabled = D.done || D.suggested || !aiReady(); return; }
      const id = button.dataset.method;
      const conf = D.pack.methods[id];
      const unlocked = D.unlocked.includes(id);
      const usedOut = (D.used[id] || 0) >= conf.maxPerQuestion;
      const tooCheap = D.patience < conf.cost;
      button.disabled = !unlocked || usedOut || tooCheap || Boolean(D.done);
      button.classList.toggle("is-locked", !unlocked);
      const small = button.querySelector("small");
      if (!unlocked) small.textContent = "等级解锁";
      else if (usedOut) small.textContent = "本题已用完";
      else small.textContent = conf.cost + " 耐心 · " + conf.label;
    });
    el("turnHint").textContent = D.done
      ? "对话结束 → 结算"
      : D.mood === D.moodOrder.length - 1
        ? "他踏实了。可以就此收尾 → 点击「结束对话」"
        : "思路 1 · 已打 " + Object.keys(D.used).length + " 张牌 · 耐心 " + D.patience + " / " + D.patienceMax;
  }

  function hasSentence(id) {
    return Object.values(S.cards).some((card) => card.sentenceIds.includes(id));
  }

  function evalHit(methodId, forceHit) {
    if (methodId === "probe") return forceHit || hasSentence("m4-s1");
    if (methodId === "empathy") return hasSentence("m3-s1");
    if (methodId === "advice") return ["m1-s1", "m1-s2", "m4-s1"].some(hasSentence);
    if (methodId === "checklist") return ["m1-s1", "m1-s2", "m1-s3"].filter(hasSentence).length >= 2;
    return false;
  }

  function quoteFor(methodId) {
    const quoteMap = { probe: "m4-s1", empathy: "m3-s1", advice: "m1-s1", checklist: "m1-s1", story: "m3-s1", tradeoff: "" };
    const id = quoteMap[methodId];
    if (!id || !hasSentence(id)) return "";
    const material = shell().pack.materials.find((m) => m.sentences.some((s) => s.id === id));
    return material.sentences.find((s) => s.id === id).text;
  }

  function playMethod(methodId) {
    const D = S.dlg;
    if (!D || D.done) return;
    const conf = D.pack.methods[methodId];
    if (!conf) return;
    if ((D.used[methodId] || 0) >= conf.maxPerQuestion || D.patience < conf.cost) return;
    const combo = D.last === "empathy" && methodId === "probe" ? "probe-hit" : D.last === "probe" && methodId === "advice" ? "advice-up" : null;
    const hit = evalHit(methodId, combo === "probe-hit");
    D.patience -= conf.cost;
    if (hit && (methodId === "empathy" || methodId === "probe")) D.patience = Math.min(D.patienceMax, D.patience + 1);
    D.used[methodId] = (D.used[methodId] || 0) + 1;
    D.growth.proficiency[methodId] = (D.growth.proficiency[methodId] || 0) + 1;
    if (hit) {
      D.mood = Math.min(D.moodOrder.length - 1, D.mood + (combo === "advice-up" ? 2 : 1));
      D.hits.push(methodId);
    }
    const moodKey = D.moodOrder[D.mood];
    chatMsg("player", "共读答主 · 你", playerLines[methodId], quoteFor(methodId));
    chatMsg("asker", D.pack.question.askerShort, D.pack.matrix[methodId][moodKey][hit ? "hit" : "miss"]);
    const reactions = shell().pack.companion && shell().pack.companion[hit ? "reactionHit" : "reactionMiss"];
    const pool = reactions && reactions.length ? reactions : [hit ? "问中了！" : "……没接住，换张牌试试。" ];
    shell().setAiText(pool[Math.floor(Math.random() * pool.length)]);
    aiReact(hit);
    D.last = methodId;
    const endButton = $("#endDialogueButton");
    if (endButton) endButton.disabled = false;
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
    S.settle = { hitsCount, leave, stale: Object.values(S.cards).some((card) => card.quality.key === "waste") };
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
    el("settleTitle").textContent = D.mood === D.moodOrder.length - 1 ? "他踏实下来了" : shell().pack.moodLabels[D.moodOrder[D.mood]] + "地结束了对话";
    el("settleHits").innerHTML = D.hits.length
      ? D.hits.map((id) => "<p>✔ " + D.pack.methods[id].label + "——答中了</p>").join("")
      : "<p>没有答中任何一招。</p>";
    el("settleCards").innerHTML = Object.keys(S.cards).map((id) => {
      const material = shell().pack.materials.find((m) => m.id === id);
      const card = S.cards[id];
      const cls = card.quality.key === "premium" ? "is-premium" : card.quality.key === "normal" ? "is-normal" : "is-waste";
      const name = card.quality.key === "premium" ? "精华卡" : card.quality.key === "normal" ? "普通卡" : "废卡";
      const pickedTexts = card.sentenceIds.map((sid) => {
        const s = material.sentences.find((x) => x.id === sid);
        return "「" + (s ? s.text : "") + "」";
      }).join("");
      return "<p class=" + cls + "><strong>" + name + "</strong> " + material.kindLabel + "：" + card.quality.why + "</p><p class=settle-sent>" + pickedTexts + "</p>";
    }).join("");
    el("settleLeave").innerHTML = "<p>" + S.settle.leave.text + "</p>" + (S.settle.leave.fan ? "<span class='settle-stamp'>+1 粉丝</span>" : "");
      const qualityCounts = { premium: 0, normal: 0, waste: 0 };
      Object.values(S.cards).forEach((c) => { qualityCounts[c.quality.key] += 1; });
    el("settleGains").innerHTML = "<p>熟练度 +" + Object.values(D.growth.proficiency).reduce((a, b) => a + b, 0) + " · 素材卡 精华×" + qualityCounts.premium + " 普通×" + qualityCounts.normal + " 废卡×" + qualityCounts.waste + (S.settle.leave.fan ? " · 新粉丝 ×1" : "") + "</p>";
    el("settleOverlay").hidden = false;
    $("#settleContinue").onclick = () => showLetter();
    shell().setStage(3);
  }

  function showLetter() {
    if (S.stage === "letter") return;
    S.stage = "letter";
    const silentLetter = { days: 3, text: "（这一夜之后，你没有等到他的回信。）几天后你刷到：他把同样的问题又问了一遍——这次，是别人在答。", result: "那条求助没能被接住。", memory: "有一条求助，我们没能接住。下一次，先把人接住再开口。" };
    const letter = S.settle.silent ? silentLetter : S.settle.stale ? shell().pack.letters.stale : shell().pack.letters.good;
    el("settleTitle").textContent = (S.settle.silent ? "没有等到回信 · " : "回信 · ") + letter.days + " 天后";
    el("settleHits").innerHTML = "<p>" + letter.text + "</p>";
    el("settleCards").innerHTML = "";
    el("settleLeave").innerHTML = "";
    el("settleGains").innerHTML = "<p>" + letter.result + "</p><p><small>已记入共读札记：" + letter.memory + "</small></p>";
    $("#settleContinue").textContent = S.questionIndex < S.questionQueue.length - 1 ? "下一封求助 →" : "今晚的求助都回答完了";
    $("#settleContinue").onclick = () => nextQuestion();
    if (window.CoReadCompanion && window.CoReadCompanion.showGrowthItem) {
      const qid = shell().pack.question.id || "guahao";
      window.CoReadCompanion.showGrowthItem(qid);
    }
    shell().setStage(4);
    recordGrowth(letter);
    save();
  }

  function nextQuestion() {
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

  function recordGrowth(letter) {
    const growth = $("#growthList");
    growth.innerHTML = "";
    const item = document.createElement("li");
    item.innerHTML = "<span class='growth-dot'></span> " + letter.memory;
    growth.append(item);
    $("#principleCard").innerHTML = "<span>今晚的收获</span><p>" + (S.settle.stale ? "过时的信息会让人白跑一趟。先看日期，再开口。" : "先接住人，再给方法。帮一个人，就是帮一片人。") + "</p>";
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
  }

  function startDialogue() {
    const pack = shell().pack;
    if (Object.keys(S.cards).length < S.attention) { shell().toast("先在共读里做好两份素材卡。"); return; }
    S.stage = "dialogue";
    S.chatLog = [];
    S.dlg = {
      pack,
      mood: 0,
      moodOrder: pack.moodOrder,
      patienceMax: pack.question.patienceBase + 2,
      patience: pack.question.patienceBase + 2,
      used: {},
      suggested: false,
      last: null,
      hits: [],
      done: false,
      growth: S.growth,
      unlocked: ["empathy", "probe", "advice", "checklist"]
    };
    chatMsg("asker", pack.question.askerShort, pack.question.opening);
    shell().setAiText("他开口了。先用共情接住他，或者追问问清细节——素材卡上的句子就是你的底气。");
    shell().guide("dialogue", "打方式牌回他：共情接情绪，追问问细节，清单给步骤。素材卡选得好，牌才打得中。");
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
      hits: saved.dlg.hits || [],
      done: saved.dlg.done,
      growth: S.growth,
      unlocked: saved.dlg.unlocked || ["empathy", "probe", "advice", "checklist"]
    };
    onShellReady(true);
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
      : { stale: saved.settle.stale, hitsCount: saved.settle.hitsCount, leave: { text: saved.settle.leaveText || "", fan: 0 } };
    if (asLetter) showLetter();
    else showSettle();
  }

  function resume() {
    let saved = readSave();
    const inner = saved.state || {};
    saved = Object.assign({}, inner, saved);
    if (!saved) { newGame(); return; }
    S.attentionMax = saved.attentionMax || 2;
    S.growth = saved.growth || S.growth;
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
    S.cards = {};
    S.inspected = new Set();
    S.chatLog = [];
    S.growth = { proficiency: {}, fans: 0, exp: 0 };
    S.dlg = null;
    S.settle = null;
    onShellReady(false);
  }

  function onShellReady(silent) {
    S.stage = "research";
    const pack = shell().pack;
    if (!pack) { shell().toast("文案包未加载"); return; }
    if (!S.questionQueue.length) {
      S.questionQueue = [pack];
      if (window.CoReadV2PackTrain) S.questionQueue.push(window.CoReadV2PackTrain);
      if (window.CoReadV2PackRent) S.questionQueue.push(window.CoReadV2PackRent);
    }
    shell().fillQuestion(pack.question);
    el("researchInstruction").textContent = "注意力只够细读两份。展开材料 → 挑最多 3 句做成素材卡 → 标对来源。";
    renderAttention();
    renderMaterials();
    renderTray();
    bindModal();
    el("synthesizeButton").addEventListener("click", startDialogue);
    const suggestButton = document.getElementById("aiSuggestButton");
    if (suggestButton) suggestButton.addEventListener("click", aiSuggest);
    $$("#handCards .method-card").forEach((button) => button.addEventListener("click", () => playMethod(button.dataset.method)));
    shell().setStage(1);
    shell().focusWindow("browserWindow");
    if (!silent) {
      shell().toast("收到一条来自林一舟的求助");
    const computer = document.getElementById("roomComputer");
    if (computer) {
      computer.classList.add("has-new-message");
      computer.addEventListener("click", () => {
        computer.classList.remove("has-new-message");
        shell().focusWindow("browserWindow");
      });
    }
      shell().guide("research", "电脑收到求助了！点材料上的「展开检查」，看清作者和日期，再挑句子做成素材卡。");
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
