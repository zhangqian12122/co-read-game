// ai-archive.js - AI 增强：档案 02 · 自选问题共读
// 玩家粘贴任意知乎风格问题，LLM 将其结构化为一份完整可玩档案（材料/标签/决定/草稿），
// 复用现有章节运行时；未启用 AI、生成失败或字段缺失时用脚本兜底，流程永远可玩。
(() => {
  if (!window.CoReadAI) return;

  const KIND_SET = ['official', 'context', 'experience', 'market'];
  const KIND_LABELS = { official: '官方信息', context: '提问者补充', experience: '个人经历', market: '行业观察' };
  const TAG_IDS = ['official', 'context', 'uncertain', 'market'];
  const TAG_LABELS = { official: '官方信息', context: '提问者背景', uncertain: '待核实信息', market: '行业现状' };

  function sanitizeTendencies(raw) {
    const out = {};
    ['truth', 'empathy', 'expression', 'caution'].forEach((key) => {
      const value = Number(raw && raw[key]);
      if (Number.isFinite(value)) out[key] = Math.max(-2, Math.min(2, Math.round(value)));
    });
    return out;
  }

  function clean(value, max, fallback) {
    const text = String(value === undefined || value === null ? "" : value).trim();
    return (text || fallback).slice(0, max);
  }

  function buildChapter(raw, questionText) {
    const title = clean(raw.title, 60, questionText.slice(0, 40));
    const askerName = clean(raw.askerName, 4, '小安');
    const materials = (Array.isArray(raw.materials) ? raw.materials : []).slice(0, 4).map((m, i) => {
      const kind = KIND_SET.includes(m && m.kind) ? m.kind : ['official', 'context', 'experience', 'market'][i % 4];
      const validUses = Array.isArray(m && m.validUses) ? m.validUses.filter((u) => TAG_IDS.includes(u)).slice(0, 2) : [];
      return {
        id: 'm' + (i + 1),
        title: clean(m && m.title, 40, '材料 ' + (i + 1)),
        excerpt: clean(m && m.excerpt, 60, '一份与问题相关的材料。'),
        author: clean(m && m.author, 16, '知乎用户'),
        date: clean(m && m.date, 12, '最近'),
        engagement: clean(m && m.engagement, 16, '32 个赞 · 6 个收藏'),
        kind,
        kindLabel: KIND_LABELS[kind],
        source: clean(m && m.source, 24, KIND_LABELS[kind]),
        body: [clean(m && m.excerpt, 120, '一份与问题相关的材料。'), clean(m && m.quote, 160, '')].filter(Boolean),
        quote: clean(m && m.quote, 120, '「这里还没有人能替提问者确认。'),
        caution: clean(m && m.caution, 60, '先看作者和日期，再决定要不要信。'),
        validUses: validUses.length ? validUses : [TAG_IDS[i % 4]],
        tendencies: sanitizeTendencies(m && m.tendencies)
      };
    });
    while (materials.length < 4) {
      const i = materials.length;
      const kind = KIND_SET[i];
      materials.push({ id: 'm' + (i + 1), title: '补充材料 ' + (i + 1), excerpt: '一份与问题相关的材料。', author: '知乎用户', date: '最近', engagement: '32 个赞 · 6 个收藏', kind, kindLabel: KIND_LABELS[kind], source: KIND_LABELS[kind], body: ['一份与问题相关的材料。'], quote: '「这里还没有人能替提问者确认。', caution: '先看作者和日期，再决定要不要信。', validUses: [TAG_IDS[i]], tendencies: {} });
    }
    const decisions = (Array.isArray(raw.decisions) ? raw.decisions : []).slice(0, 3).map((d, i) => ({
      id: 'd' + (i + 1),
      route: 'r' + (i + 1),
      title: clean(d && d.title, 26, ['先确认最重要的事', '先回应情绪', '先给一个小行动'][i]),
      detail: clean(d && d.detail, 60, '说明为什么这一步要放在最前面。'),
      requiresAny: materials.map((m) => m.id),
      tendencies: sanitizeTendencies(d && d.tendencies)
    }));
    while (decisions.length < 2) {
      const i = decisions.length;
      decisions.push({ id: 'd' + (i + 1), route: 'r' + (i + 1), title: ['先确认最重要的事', '先回应情绪', '先给一个小行动'][i], detail: '说明为什么这一步要放在最前面。', requiresAny: materials.map((m) => m.id), tendencies: {} });
    }
    const lines = {};
    decisions.forEach((d) => { lines[d.id] = '先从「' + d.title + '」说起吧。'; });
    const drafts = (Array.isArray(raw.drafts) ? raw.drafts : []).slice(0, 3).map((d, i) => ({
      id: 'draft' + (i + 1),
      title: clean(d && d.title, 16, ['按材料说话', '先接住情绪', '落到一件事'][i]),
      detail: clean(d && d.detail, 40, '按这个思路写第一句。'),
      lines: Object.assign({}, lines, d && typeof d.lines === 'object' ? d.lines : {}),
      partner: clean(d && d.partner, 50, '这个开头把材料里能确认的放在了前面。'),
      tendencies: sanitizeTendencies(d && d.tendencies),
      memory: clean(d && d.memory, 40, '伙伴记住了这个开头的写法。'),
      followupEcho: clean(d && d.followupEcho, 40, ''),
      conflictEcho: ''
    }));
    while (drafts.length < 2) {
      const i = drafts.length;
      const idLines = {};
      decisions.forEach((d) => { idLines[d.id] = '先从「' + d.title + '」说起吧。'; });
      drafts.push({ id: 'draft' + (i + 1), title: ['按材料说话', '先接住情绪', '落到一件事'][i], detail: '按这个思路写第一句。', lines: idLines, partner: '这个开头把材料里能确认的放在了前面。', tendencies: {}, memory: '伙伴记住了这个开头的写法。', followupEcho: '', conflictEcho: '' });
    }
    const openings = {};
    decisions.forEach((d) => {
      openings[d.id] = clean(raw && raw.openings && raw.openings[d.id], 50, '方向有了，第一句先说什么，决定他先看见什么。');
    });
    const roomEchoes = {};
    decisions.forEach((d) => { roomEchoes[d.id] = { roomEcho: clean(raw && raw.roomEcho, 40, '提问者的回复压在今天的两份材料上'), followupEcho: '' }; });
    return {
      archive: '档案 02 · ' + askerName + '的问题',
      address: 'zhihu.local/question/custom-archive',
      kicker: clean(raw.kicker, 16, '生活经验 · AI 共读'),
      title,
      body: clean(raw.body, 200, questionText.slice(0, 180)),
      stats: ['3 个回答', '5 人关注', '最后编辑于今天'],
      eyebrow: '共读调查 / 01',
      researchTitle: '先看哪两份材料？',
      instruction: '先打开材料，看看作者、日期和来源，再选两份递给伙伴。',
      tagPrompt: '这两份材料分别能用来做什么？',
      tagOptions: TAG_IDS.map((id) => ({ id, label: TAG_LABELS[id] })),
      materials,
      aiDecisions: decisions,
      aiDrafts: drafts,
      aiOpenings: openings,
      aiSynthesis: clean(raw.synthesis, 120, '两份材料我都看完了。有些部分能直接用，有些还得先打个问号——先回应哪件事？'),
      aiAskerName: askerName
    };
  }

  async function generateChapter(questionText) {
    const prompt = [
      '你是「共读模式」的档案编辑。把用户粘贴的知乎风格问题结构化成一份共读档案 JSON，',
      '用于教玩家练习信息素养：先核对材料来源（作者/日期/可信度），再决定怎么回答。',
      '要求：',
      '1. materials 恰好4份，kind 只能是 official(官方/权威信息)、context(提问者自己的补充)、experience(个人经历)、market(行业/市场观察)，至少覆盖3种；',
      '2. 每份材料都要有可信度差异：有的日期旧、有的作者不权威、有的其实回答不了问题；',
      '3. validUses 从 official/context/uncertain/market 里选1-2个（表示这份材料真正能当什么用）；',
      '4. decisions 恰好3个（先做什么的决定），drafts 恰好3个回答开头思路，drafts[i].lines 键=每个 decision 的 id；',
      '5. openings 键=每个 decision 的 id，值=伙伴看到该决定时的一句提醒；synthesis=伙伴看完材料后的整理(60-90字)；',
      '6. askerName=提问者化名(2-3个汉字，不用真实姓名)；全部内容为模拟演绎，不得使用真实人名或平台真实链接。',
      '只输出JSON，键：kicker,title,body,askerName,synthesis,roomEcho,materials,decisions,drafts,openings。'
    ].join('');
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: questionText.slice(0, 600) }
    ];
    const raw = await window.CoReadAI.chatJson(messages, { timeoutMs: 60000, maxTokens: 2600, temperature: 0.8 });
    return buildChapter(raw, questionText);
  }

  function validateQuestion(text) {
    const trimmed = String(text || '').trim();
    return trimmed.length >= 8 && trimmed.length <= 600 ? trimmed : null;
  }

  // —— 进入自定义档案：注入章节并复用现有运行时 ——

  function launchCustomChapter(chapter) {
    chapterDefinitions.custom = chapter;
    state.started = true;
    state.permission = state.permission || 'ask';
    state.computerMessageReady = false;
    state.browserUnlocked = false;
    resetChapterRuntime('custom');
    state.chapterTwoPermissionResolved = true;
    state.autoFlaggedMaterialId = null;
    state.autoFlagCopy = '';
    state.pendingChapterAction = null;
    decisionConsequences.custom = {};
    chapter.aiDecisions.forEach((d) => { decisionConsequences.custom[d.id] = { roomEcho: chapter.aiAskerName + '的回复压在今天的两份材料上', followupEcho: '' }; });
    renderChapterCopy();
    renderMaterials();
    renderTray();
    updateProgress(0);
    setClock('22:40');
    elements.roomScene.classList.remove('tag-conflict', 'tag-all-official');
    focusWindow('browserWindow');
    setAiText('这份新档案是你出的题。材料我扫了一眼，日期和署名都有点意思——你来定，我们先看哪两份。');
    checkpoint('custom-research');
  }

  function wireCustomArchiveUi() {
    const openButton = document.getElementById('');
    const modal = document.getElementById('');
    if (!openButton || !modal) return;
    const input = modal.querySelector('');
    const generateButton = modal.querySelector('');
    const status = modal.querySelector('');
    openButton.addEventListener('', () => {
      elements.endingOverlay.hidden = true;
      modal.hidden = false;
    });
    modal.querySelector('').addEventListener('', () => {
      modal.hidden = true;
      if (state.step === 'ending' || state.step === 'ended-room') elements.endingOverlay.hidden = false;
    });
    generateButton.addEventListener('', async () => {
      const question = validateQuestion(input.value);
      if (!question) { status.textContent = '问题太短了，至少写一句话。'; return; }
      if (!window.CoReadAI.isReady()) { status.textContent = '还没有启用 AI。去系统设置里开启并填好 Key。'; return; }
      generateButton.disabled = true;
      status.textContent = '正在生成档案（材料、标签、决定、草稿）……大约 10-30 秒';
      try {
        const chapter = await generateChapter(question);
        modal.hidden = true;
        launchCustomChapter(chapter);
      } catch (error) {
        status.textContent = '生成失败（' + error.message + '），可以再试一次。';
      }
      generateButton.disabled = false;
    });
  }

  // —— 让既有流程认识 custom 章节 ——

  const originalGetAvailableDecisions = getAvailableDecisions;
  getAvailableDecisions = function () {
    if (state.chapterId === '' && currentChapter().aiDecisions) return currentChapter().aiDecisions;
    return originalGetAvailableDecisions();
  };

  const originalGetDraftApproaches = getDraftApproaches;
  getDraftApproaches = function (chapterId) {
    if ((chapterId || state.chapterId) === '' && currentChapter().aiDrafts) return currentChapter().aiDrafts;
    return originalGetDraftApproaches(chapterId);
  };

  const originalGetDraftOpening = getDraftOpening;
  getDraftOpening = function (decisionId, chapterId) {
    if ((chapterId || state.chapterId) === '' && currentChapter().aiOpenings) {
      return currentChapter().aiOpenings[decisionId] || '方向有了，第一句先说什么，决定他先看见什么。';
    }
    return originalGetDraftOpening(decisionId, chapterId);
  };

  const originalBuildCareerSynthesis = buildCareerPartnerSynthesis;
  buildCareerPartnerSynthesis = function () {
    if (state.chapterId === '' && currentChapter().aiSynthesis) return currentChapter().aiSynthesis;
    return originalBuildCareerSynthesis();
  };

  const originalGetFinalCompanionLine = getFinalCompanionLine;
  getFinalCompanionLine = function (route) {
    if (state.chapterId === '' && !state.careerAccountabilityChoice) return '这份是你出的题。看到他的回信时，我想起你当初是怎么写的。';
    return originalGetFinalCompanionLine(route);
  };

  async function generateCustomFollowup(snapshot) {
    const chapter = chapterDefinitions.custom;
    const payload = {
      question: chapter.title,
      askerName: chapter.aiAskerName,
      materials: snapshot.selected.map((id) => {
        const m = getMaterial(id, '');
        return { title: m.title, author: m.author, date: m.date, tag: getTagLabel(snapshot.tags[id], '') };
      }),
      misusedMaterials: snapshot.misjudgments.persisted.map((id) => getMaterial(id, '').title),
      firstReplyOpening: chapter.aiDrafts.find((d) => d.id === snapshot.draftChoice) ? chapter.aiDrafts.find((d) => d.id === snapshot.draftChoice).lines[snapshot.decision] : '',
      asker: chapter.body
    };
    try {
      const result = await window.CoReadAI.chatJson([
        { role: 'system', content: [
          '你在模拟「共读模式自定义档案的次日回访。提问者读完了你们的公开回答。',
          '如果 misusedMaterials 非空：他要指出这些材料其实证明不了回答里的结论，语气困惑偏失望，并且 result 要体现他重新核对。',
          '如果 misusedMaterials 为空：他礼貌地告诉你们哪一句帮到了他、他做了什么，语气真诚。',
          '输出JSON键：text(提问者的话,60-110字),result(客观结果,30-60字),memory(伙伴记进札记的一句,30-50字),habit(一句方法总结,20字内),wallNote(墙上便签,8字内)。全部中文。'
        ].join('') },
        { role: 'user', content: JSON.stringify(payload) }
      ], { timeoutMs: 30000, maxTokens: 600, temperature: 0.8 });
      if (!result || typeof result.text !== 'string') throw new Error('bad');
      return {
        text: String(result.text).slice(0, 160),
        result: String(result.result || '').slice(0, 80),
        memory: String(result.memory || '').slice(0, 60),
        habit: String(result.habit || snapshot.evaluation.habit).slice(0, 40),
        wallNote: String(result.wallNote || '').slice(0, 12),
        tone: 'normal'
      };
    } catch (error) {
      return {
        text: '你们好，我照着回答先做了能确认的那部分，剩下的我去问了身边的人。谢谢你们认真写这么长。',
        result: '那封回答已经发出。他先做了能确认的部分，其余自己补上了。',
        memory: '伙伴记住：先做能确认的，剩下的交给提问者。',
        habit: snapshot.evaluation.habit,
        wallNote: '回信收好了',
        tone: 'normal'
      };
    }
  }

  const originalOpenCareerFollowup = openCareerFollowup;
  openCareerFollowup = function () {
    if (state.chapterId !== '') { originalOpenCareerFollowup(); return; }
    const route = state.chapterTwoSnapshot && state.chapterTwoSnapshot.route;
    if (state.chapterId !== 'custom' || state.step !== 'career-followup-pending' || !route) return;
    let chain = Promise.resolve();
    if (!state.customFollowupOutcome) {
      chain = generateCustomFollowup(state.chapterTwoSnapshot).then((outcome) => { state.customFollowupOutcome = outcome; }).catch(() => {});
    }
    chain.then(() => {
      if (state.customFollowupOutcome) {
        state.outcome = state.customFollowupOutcome;
        elements.followupNotification.hidden = true;
        state.notificationMode = null;
        state.step = 'career-followup-reading';
        state.route = route;
        populateFollowup({
          eyebrow: '共读回答发出后 / 几周后',
          title: state.chapterTwoSnapshot ? chapterDefinitions.custom.aiAskerName + '回复了你们' : '提问者回复了你们',
          result: state.outcome.result,
          tone: 'normal',
          avatar: chapterDefinitions.custom.aiAskerName.slice(0, 1),
          author: '提问者 · ' + chapterDefinitions.custom.aiAskerName,
          text: state.outcome.text,
          action: '读完，回房间看看'
        });
        renderInitialPublicDiscussion(state.outcome);
        checkpoint('custom-followup');
      }
    });
  };

  const originalUpdateRoomAfterDecision = updateRoomAfterDecision;
  updateRoomAfterDecision = function (decision, snapshot) {
    if (state.chapterId === '') {
      setAiText('回答已经发出去了。' + (snapshot.evaluation.habit || ''));
    } else {
      originalUpdateRoomAfterDecision(decision, snapshot);
    }
  };

  const originalCompleteSecondChapter = completeSecondChapter;
  completeSecondChapter = function (route) {
    if (state.chapterId !== '') { originalCompleteSecondChapter(route); return; }
    const result = state.outcome;
    state.route = route;
    state.step = 'ending-conversation';
    elements.roomScene.classList.add('has-memory', 'memory-papers', 'memory-lamp');
    elements.shelfBook.classList.add('is-visible');
    if (result && result.wallNote) setWallNote(result.wallNote);
    const firstChapterEchoes = getFirstChapterEndingEchoes();
    elements.growthTitle.textContent = '自定义档案的回信，也留在房间里';
    elements.growthList.innerHTML = '<li><span class="growth-dot"></span> ' + firstChapterEchoes.behavior + '</li><li><span class="growth-dot"></span> 这份档案是你出的题</li><li><span class="growth-dot"></span> ' + (result ? result.memory : '') + '</li>';
    recordMemory({ id: 'career', date: '档案 02 / 提问者的回访', body: result ? result.memory : '', habit: result ? result.habit : '' });
    setAiText('这份是你出的题。看到回信的时候，我想起你当初是怎么写第一句的。');
    setCompanionEmotion('resolve', 760);
    updateProgress(4);
    window.setTimeout(placeAutonomyFold, 400);
    window.setTimeout(() => showFinalConversation(route), 700);
  };

  const originalHandleNotification = handleNotification;
  handleNotification = function () {
    if (state.notificationMode === 'career-followup' && state.chapterId === '') { openCareerFollowup(); return; }
    originalHandleNotification();
  };

  function initCustomArchive() {
    wireCustomArchiveUi();
  }

  window.CoReadArchive = { generateChapter, buildChapter, launchCustomChapter, initCustomArchive };
  initCustomArchive();
})();
