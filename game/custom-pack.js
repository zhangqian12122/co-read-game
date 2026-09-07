// custom-pack.js - v2「AI 换你出题」：粘贴任意知乎风格问题，LLM 生成新题包（复用现有引擎系统）
// 生成失败/未启用 AI 时静默回退内置备用题（火车题），流程永远可玩。
(() => {
  const KIND_BY_SLOT = ["official", "guide", "experience", "asker"];
  const KIND_LABELS = { official: "官方说明", guide: "老攻略", experience: "个人经历", asker: "楼主补充" };

  function clean(value, max, fallback) {
    const text = String(value === undefined || value === null ? "" : value).trim();
    return (text || fallback).slice(0, max);
  }

  function buildMaterial(raw, slot) {
    const kind = KIND_BY_SLOT[slot];
    const label = KIND_LABELS[kind];
    const rawSentences = Array.isArray(raw && raw.sentences) ? raw.sentences : [];
    const sentences = [];
    rawSentences.slice(0, 5).forEach((s) => {
      const type = ["dry", "fluff", "ad", "stale"].includes(s && s.type) ? s.type : "dry";
      const text = clean(s && s.text, 80, "");
      if (text) sentences.push({ id: "m" + (slot + 1) + "-s" + (sentences.length + 1), text, type });
    });
    while (sentences.length < 4) {
      sentences.push({ id: "m" + (slot + 1) + "-s" + (sentences.length + 1), text: "（这段材料还需要补充内容。）", type: "dry" });
    }
    return {
      id: "m" + (slot + 1), kind, kindLabel: label,
      title: clean(raw && raw.title, 40, label + "·待补充"),
      author: clean(raw && raw.author, 16, slot === 3 ? "提问者" : "知乎用户"),
      date: clean(raw && raw.date, 12, slot === 0 ? "上月更新" : slot === 1 ? "2021 年" : "最近"),
      engagement: clean(raw && raw.engagement, 16, "32 个赞"),
      source: label, excerpt: clean(raw && raw.excerpt, 60, label + "的核心内容。"),
      caution: clean(raw && raw.caution, 50, slot === 1 ? "时间较旧，注意甄别。" : "先看作者和日期再定。"),
      body: [clean(raw && raw.excerpt, 120, label + "的核心内容。")],
      sentences
    };
  }

  function buildPack(raw, questionText, base) {
    const q = raw && typeof raw === "object" ? raw : {};
    const askerName = clean(q.askerName, 4, "小舟");
    const pack = JSON.parse(JSON.stringify(base));
    pack.question = {
      id: "custom", kicker: clean(q.kicker, 12, "生活经验 · AI 共读"),
      title: clean(q.title, 50, questionText.slice(0, 40)),
      body: clean(q.body, 180, questionText.slice(0, 160)),
      askerShort: askerName.slice(0, 1) || "小", askerName: askerName + "（AI 生成 · 模拟演绎）",
      address: "zhihu.local/question/ai-custom",
      stats: ["1 个回答", "3 人关注", "最后编辑于今天"],
      mainAnchor: clean(q.mainAnchor, 40, "第一次独立面对这件事的不安"),
      subAnchor: clean(q.subAnchor, 40, "一个容易被忽略的前置步骤"),
      patienceBase: 6,
      opening: clean(q.opening, 120, "那个……想问下……我明天就要去办这件事了，第一次自己来，有点慌。"),
      askerAvatar: askerName.slice(0, 1)
    };
    pack.archive = "AI 档案 · " + askerName + "的问题";
    pack.materials = [0, 1, 2, 3].map((slot) => buildMaterial((raw.materials || [])[slot], slot));
    if (raw.letters && raw.letters.good && raw.letters.stale) {
      pack.letters = {
        good: { days: 3, text: clean(raw.letters.good.text, 150, pack.letters.good.text), result: clean(raw.letters.good.result, 80, "事情顺利办成了。"), memory: clean(raw.letters.good.memory, 60, pack.letters.good.memory) },
        stale: { days: 3, text: clean(raw.letters.stale.text, 150, pack.letters.stale.text), result: clean(raw.letters.stale.result, 80, pack.letters.stale.result), memory: clean(raw.letters.stale.memory, 60, pack.letters.stale.memory) }
      };
    }
    return pack;
  }

  function fallbackPack(questionText) {
    return buildPack({
      kicker: "生活经验 · 出行", title: "第一次一个人坐火车回家，需要注意什么？",
      body: "学生第一次坐长途火车，怕坐过站、怕东西丢，也怕身体不舒服没人帮。",
      askerName: "小归", mainAnchor: "第一次独自出远门的紧张", subAnchor: "取票和换乘的流程",
      opening: "那个……我明天第一次自己坐火车回家，怕坐过站也怕丢东西，要准备什么呀？",
      materials: [
        { title: "火车站乘车流程指南（新版）", author: "铁路服务台", date: "上月更新", excerpt: "凭身份证进站，提前 30 分钟到站安检候车。", caution: "官方信息，可信。", sentences: [
          { text: "凭身份证进站，提前 30 分钟到站安检候车。", type: "dry" },
          { text: "检票口在大屏显示，开车前 5 分钟停止检票。", type: "dry" },
          { text: "本站日均发送旅客 8 万人次。", type: "fluff" },
          { text: "下载我们的 APP 抢票更方便哦。", type: "ad" }
        ] },
        { title: "坐火车回家老攻略（收藏版）", author: "回家老鸟", date: "2020 年", excerpt: "火车站乱，一定要把车票攥在手里，别相信扫码。", caution: "四年前的方法，电子票早已普及。", sentences: [
          { text: "一定要取纸质票，检票只认纸质票。", type: "stale" },
          { text: "候车室人多，看好自己的包。", type: "dry" },
          { text: "我每次都提前两小时到，风雨无阻。", type: "fluff" },
          { text: "关注我看更多出行内容。", type: "ad" }
        ] },
        { title: "第一次独自坐火车的经历", author: "软软", date: "上周", excerpt: "其实没那么可怕，跟着大屏走就行，我提前把车次截图了。", caution: "经历真实，仅供参考。", sentences: [
          { text: "第一次坐火车我超级紧张，把车次和座位都截图存在相册了。", type: "dry" },
          { text: "找不到检票口就问穿制服的工作人员，别自己瞎转。", type: "dry" },
          { text: "车上人多注意睡觉别坐过站，定个闹钟。", type: "dry" },
          { text: "后来我买了旅行保险，有需要的私我。", type: "ad" }
        ] },
        { title: "楼主补充：中转只有 40 分钟来得及吗", author: "小归", date: "今天", excerpt: "票是中转的，只有 40 分钟，来不及怎么办？", caution: "他最担心的问题。", sentences: [
          { text: "中转只有 40 分钟，来得及吗？要不要改签。", type: "dry" },
          { text: "我没坐过火车，不知道中转怎么走。", type: "dry" },
          { text: "有点慌，大家帮帮我。", type: "dry" },
          { text: "算了大不了不回家了。", type: "fluff" }
        ] }
      ],
      letters: {
        good: { text: "博主！顺利到家啦，中转也赶上了，跟着指示牌走就行。谢谢你们！", result: "他顺利到家。", memory: "第一次独自坐火车，他做到了。" },
        stale: { text: "博主……我照着老攻略去取纸质票，窗口说早就不打了，刷身份证就行……白排了半天队。下次我先看清攻略的日期。", result: "他白排了队，但最终上了车。", memory: "过时的攻略让他多排了半天队。" }
      }
    }, questionText, window.CoReadV2Pack);
  }

  async function generatePack(questionText) {
    const systemPrompt = [
      "你是「回答主游戏」的题目编辑。把用户粘贴的生活类求助改写成一份游戏题包 JSON。",
      "要求：material 恰好 4 份，按顺序固定为——m1 官方/权威信息、m2 过时老攻略（日期给 3 年前，含 1-2 句过时建议 type:stale）、m3 个人经历帖（有情绪共鸣句）、m4 提问者自己的补充（藏着最关键的小问题）。",
      "每份材料 4 句候选句，必须混入：1-2 句干货(type:dry)、1 句废话(type:fluff)、材料 m1 和 m3 各 1 句广告(type:ad)。",
      "另生成 letters：good（求助顺利的回信）和 stale（用了过时信息白跑一趟的回信）各一段 60 字内。",
      "所有内容为模拟演绎，不使用真实人名/机构。只输出 JSON，键：title,body,askerName,kicker,mainAnchor,subAnchor,opening,materials[{title,author,date,engagement,excerpt,caution,sentences[{text,type}]}],letters{good{...},stale{...}}。"
    ].join("");
    const raw = await window.CoReadAI.chatJson([
      { role: "system", content: systemPrompt },
      { role: "user", content: questionText.slice(0, 500) }
    ], { timeoutMs: 60000, maxTokens: 2400, temperature: 0.8 });
    return buildPack(raw, questionText, window.CoReadV2Pack);
  }

  function validateCustomPack(pack) {
    if (!pack.question.title || !pack.question.opening) return "题目/开场缺失";
    if (pack.materials.length !== 4) return "材料数量不足";
    const bad = pack.materials.find((m) => m.sentences.length < 4);
    if (bad) return bad.id + " 候选句不足";
    return null;
  }

  window.CoReadCustom = { buildPack, fallbackPack, generatePack, validateCustomPack };
})();
