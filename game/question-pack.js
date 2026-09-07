// question-pack.js - 挂号题文案包（M1 完整版）
// Schema 见 ROADMAP M1；台词按林一舟语言卡：开口试探、省略号多、被帮到才小心地说谢谢博主。
(() => {
  const questionPack = {
    question: {
      id: "guahao",
      kicker: "生活经验 · 校园生活",
      title: "第一次自己去医院挂号，需要准备什么？",
      body: "从小城市到省城读大一，还没独自去过医院。最近要看病，很紧张：怕东西带不齐，怕挂错科，也怕流程走错白跑一趟。补充里有一件事想请你们看到。",
      askerShort: "林一舟",
      askerName: "林一舟（19 岁 · 大一新生）",
      address: "zhihu.local/question/first-visit-guahao",
      stats: ["3 个回答", "5 人关注", "最后编辑于今天"],
      mainAnchor: "第一次独立的紧张，怕给爸妈添麻烦",
      subAnchor: "学校医保手续可能要先办",
      patienceBase: 6,
      opening: "那个……想问下……我明天要一个人去医院挂号，是我第一次自己去。怕带不齐东西，也怕挂错科。对了……同学说学校医保好像要先办手续？有点慌，谢谢你们。",
      askerAvatar: "林"
    },
    materials: [
      {
        id: "m1", kind: "official", kindLabel: "官方说明", title: "市一院门诊挂号与就诊流程（近期更新）",
        author: "市一院门诊部", date: "上月更新", engagement: "官方发布",
        source: "医院官方说明", excerpt: "凭身份证建卡/取号，自助机或窗口均可，先报到再就诊。",
        caution: "官方发布，可信度最高。",
        body: ["为减少排队，门诊实行先报到后就诊：持身份证在自助机建卡或取号，也可到窗口办理。", "挂号后请到对应科室楼层报到机扫码报到，听取叫号。", "初诊患者建议预留充足时间，高峰期排队约 15-30 分钟。", "本院为智慧服务示范单位，连续三年获评患者满意奖项。", "来院就诊请优先选择本院互联网医院在线复诊。"],
        sentences: [
          { id: "m1-s1", text: "持身份证在自助机建卡或取号，也可到窗口办理。", type: "dry" },
          { id: "m1-s2", text: "挂号后请到对应科室楼层报到机扫码报到，听取叫号。", type: "dry" },
          { id: "m1-s3", text: "初诊患者建议预留充足时间，高峰期排队约 15-30 分钟。", type: "dry" },
          { id: "m1-s4", text: "本院为智慧服务示范单位，连续三年获评患者满意奖项。", type: "fluff" },
          { id: "m1-s5", text: "来院就诊请优先选择本院互联网医院在线复诊。", type: "ad" }
        ]
      },
      {
        id: "m2", kind: "guide", kindLabel: "老攻略", title: "省城各大医院看病全攻略（亲测整理）",
        author: "攻略老哥", date: "2021 年", engagement: "2100 赞 · 890 收藏",
        source: "五年前的个人整理", excerpt: "带好现金！很多医院窗口不支持扫码，先去一站式窗口办就诊卡。",
        caution: "写得最全，但已经是五年前的流程。",
        body: ["带足现金，窗口多半不收扫码支付，别问我怎么知道的。", "先到一站式服务窗口办就诊卡，押金 20 元记得退。", "科室楼层分散，先在大厅看平面图再上楼。", "这篇文章是我跑了五趟总结的血泪经验，看完少走弯路。", "关注我，下期讲陪诊技巧。"],
        sentences: [
          { id: "m2-s1", text: "带足现金，窗口多半不收扫码支付，别问我怎么知道的。", type: "stale" },
          { id: "m2-s2", text: "先到一站式服务窗口办就诊卡，押金 20 元记得退。", type: "stale" },
          { id: "m2-s3", text: "科室楼层分散，先在大厅看平面图再上楼。", type: "dry" },
          { id: "m2-s4", text: "这篇文章是我跑了五趟总结的血泪经验，看完少走弯路。", type: "fluff" },
          { id: "m2-s5", text: "关注我，下期讲陪诊技巧。", type: "ad" }
        ]
      },
      {
        id: "m3", kind: "experience", kindLabel: "个人经历", title: "一个人去挂号的经历和几个小建议",
        author: "软软今天也好困", date: "两周前", engagement: "356 赞",
        source: "两周前的亲历帖", excerpt: "第一次一个人去医院真的很慌，我提前把要说的症状写在备忘录里。",
        caution: "时间新、过程真实，但不代表现在的规定。",
        body: ["第一次一个人去医院，在大厅站了十分钟不敢动，后来发现其实跟着指示牌走就行。", "我把症状和想问的问题提前写在手机备忘录里，见到医生照着说，没有落下任何一件事。", "不确定挂哪科就去问导诊台，人会很好。", "其实也没什么大不了的，成年人谁没去过医院呢。", "我后来买了份保险，有需要的可以私信我。"],
        sentences: [
          { id: "m3-s1", text: "第一次一个人去医院，在大厅站了十分钟不敢动。", type: "dry" },
          { id: "m3-s2", text: "我把症状和想问的问题提前写在手机备忘录里，见到医生照着说。", type: "dry" },
          { id: "m3-s3", text: "不确定挂哪科就去问导诊台，人会很好。", type: "dry" },
          { id: "m3-s4", text: "其实也没什么大不了的，成年人谁没去过医院呢。", type: "fluff" },
          { id: "m3-s5", text: "我后来买了份保险，有需要的可以私信我。", type: "ad" }
        ]
      },
      {
        id: "m4", kind: "asker", kindLabel: "楼主补充", title: "楼主补充：学校医保的事有人了解吗",
        author: "林一舟", date: "今天", engagement: "2 条回复",
        source: "提问者自己的补充",
        excerpt: "同学说学校医保可能要先办手续才能用，不确定是不是真的，有点慌。",
        caution: "这是他最在意、也最容易被忽略的事。",
        body: ["同学说大学生的医保可能要先在学校办手续，看病的费用才能报，不确定是不是真的。", "辅导员只发过一个通知，我没细看，现在有点慌。", "也不知道明天去之前来不来得及办。", "算了，大不了先不报销了。"],
        sentences: [
          { id: "m4-s1", text: "同学说大学生的医保可能要先在学校办手续，看病的费用才能报。", type: "dry" },
          { id: "m4-s2", text: "辅导员只发过一个通知，我没细看，现在有点慌。", type: "dry" },
          { id: "m4-s3", text: "也不知道明天去之前来不来得及办。", type: "dry" },
          { id: "m4-s4", text: "算了，大不了先不报销了。", type: "fluff" }
        ]
      }
    ],
    methods: {
      empathy: { label: "共情", cost: 1, maxPerQuestion: 1, unlockAt: 1 },
      probe: { label: "追问", cost: 1, maxPerQuestion: 2, unlockAt: 1 },
      advice: { label: "建议", cost: 1, maxPerQuestion: 99, unlockAt: 1 },
      story: { label: "案例", cost: 2, maxPerQuestion: 99, unlockAt: 2 },
      checklist: { label: "清单", cost: 2, maxPerQuestion: 99, unlockAt: 2 },
      tradeoff: { label: "利弊摊开", cost: 3, maxPerQuestion: 99, unlockAt: 3 }
    },
    combos: [
      { seq: ["empathy", "probe"], label: "共情→追问", effect: "probe-hit" },
      { seq: ["probe", "advice"], label: "追问→建议", effect: "advice-up" },
      { seq: ["empathy", "story"], label: "共情→案例", effect: "soothe-up" },
      { seq: ["story", "checklist"], label: "案例→清单", effect: "checklist-trust" },
      { seq: ["probe", "checklist"], label: "追问→清单", effect: "checklist-personal" }
    ],
    checks: {
      empathy: { needSentence: "m3-s1", note: "带上午厅不敢动那句，才接得住他的紧张" },
      probe: { needSentence: "m4-s1", note: "读过楼主补充，才能问中医保手续" },
      advice: { anySentenceOf: ["m1-s1", "m1-s2", "m4-s1"], note: "有官方流程或医保句，建议才落地" },
      story: { needSentence: "m3-s1", note: "有亲历句，故事才讲得出来" },
      checklist: { anySentenceOf: ["m1-s1", "m1-s2", "m1-s3"], minCount: 2, note: "官方干货句凑满两条，清单才成立" },
      tradeoff: { note: "生活流程题没有利弊可摊，天然答偏" }
    },
    matrix: {
      empathy: {
        panic: { hit: "那个……你怎么知道……我就是怕给爸妈打电话，怕他们担心……", miss: "嗯……我是想问具体怎么弄的……" },
        dazed: { hit: "你怎么知道，我就是这个意思……", miss: "我……我其实想先知道该带什么。" },
        getting: { hit: "嗯嗯……被人说中的感觉，安心多了。", miss: "这个我知道了……" },
        steady: { hit: "谢谢你……我心里踏实多了。", miss: "嗯。" }
      },
      probe: {
        panic: { hit: "还没办！同学说要先办手续，我一直没敢去问辅导员……", miss: "我、我就是都想知道……" },
        dazed: { hit: "医保手续……还没办。要紧吗？", miss: "没有别的了……你说什么我就查什么。" },
        getting: { hit: "还没办……我明天一早就去问。", miss: "都记下来了……" },
        steady: { hit: "手续还没办。我记下了，去挂号前先办这个。", miss: "嗯，都清楚了……" }
      },
      advice: {
        panic: { hit: "先办手续再挂号……好，我明天先去学校问。", miss: "可是我还是不知道第一步去哪儿……" },
        dazed: { hit: "原来是这样……我记在备忘录里了。", miss: "嗯……那我要带现金吗？" },
        getting: { hit: "好的，我先办手续，再挂号。", miss: "好的……" },
        steady: { hit: "明白了，谢谢博主！", miss: "好的，谢谢……" }
      },
      story: {
        panic: { hit: "原来别人第一次也会在大厅不敢动……那我还好。", miss: "……哦。" },
        dazed: { hit: "听着跟我差不多……他后来顺利吗？", miss: "嗯，这位网友经验挺多的。" },
        getting: { hit: "嗯……我也把要问的写在备忘录里。", miss: "好的。" },
        steady: { hit: "谢谢博主讲这个，我感觉我可以的。", miss: "嗯嗯。" }
      },
      checklist: {
        panic: { hit: "身份证、医保码……好，我今晚就先收拾好。", miss: "清单有点多……我先记着。" },
        dazed: { hit: "先报到再就诊……原来流程是这样的。", miss: "可是医保手续写不上去啊……" },
        getting: { hit: "都记下来了：身份证、医保码、导诊台问科、报到机报到。", miss: "嗯，我看看……" },
        steady: { hit: "清单很清楚，谢谢博主！", miss: "好的，我看看清单。" }
      },
      tradeoff: {
        panic: { hit: "利弊……其实我就想知道该怎么做……", miss: "我不太听得进去这些……" },
        dazed: { hit: "分析得挺有道理，可我还是想先知道步骤。", miss: "嗯……" },
        getting: { hit: "两头我都明白了，我还是先按流程来。", miss: "好……" },
        steady: { hit: "谢谢你帮我把两边都讲了。", miss: "嗯。" }
      }
    },
    moodOrder: ["panic", "dazed", "getting", "steady"],
    moodLabels: { panic: "慌乱", dazed: "懵懂", getting: "了解", steady: "踏实" },
    letters: {
      good: {
        days: 3,
        text: "博主你好！手续办好了，号也挂上了，就是排了会儿队。见到医生之前我把要说的写在备忘录里，一句都没落下。谢谢你那晚的回复。",
        result: "手续、挂号两件事都办成了。第一次独自就医，他做到了。",
        memory: "林一舟第一次独自就医：先办手续，再挂号，备忘录里写好要说的话。"
      },
      stale: {
        days: 3,
        text: "博主……我照着那篇攻略去窗口办卡，窗口说现在都用自助机了，让我重新排队。白跑了一趟。不过医保手续我提前办好了，后面还算顺利……下次我会先看清日期的。",
        result: "他白跑一趟，但医保手续办在了前面，最终看上了病。",
        memory: "那句五年前的攻略让林一舟白跑了一趟。过时的信息，会让人付出真实的代价。"
      }
    },
    companion: {
      name: "共读伙伴 00",
      researchLines: {
        firstMaterial: "这份是「{kind}」。先看看署名和日期，再决定信它几分。",
        bothMaterials: "两张纸都在这儿了。哪句是真有用的，我们一句句看。",
        staleSpotted: "等等……这篇的日期是 2021 年的。写得再全，也可能带错路。"
      },
      inspectLines: {
        m1: "医院官方发的，日期也新——这份可以当主心骨。",
        m2: "写得最全的一篇……可右上角写着 2021 年。全信它会出事。",
        m3: "两周前的经历帖。她那段“站了十分钟不敢动”，我记得住。",
        m4: "这是他自己补的话——医保手续，八成才是他最急的事。"
      },
      reactionHit: [
        "问中了！你看他的话多起来了。",
        "接住了。他开始说真话了。",
        "就是这个方向，稳住。"
      ],
      reactionMiss: [
        "……他好像没接住。换张牌，或者换句素材试试。",
        "答偏了。他耐心在掉，下一句要更准。",
        "这不是他想问的。翻翻素材卡，找那句真正对题的。"
      ]
    }
  };

  function validatePack(pack) {
    const errors = [];
    const moodOrder = pack.moodOrder;
    if (!pack.question || !pack.question.title) errors.push("question 缺失");
    if (!Array.isArray(pack.materials) || pack.materials.length !== 4) errors.push("materials 必须为 4 份");
    pack.materials.forEach((m) => {
      if (!Array.isArray(m.sentences) || m.sentences.length < 4 || m.sentences.length > 6) errors.push(m.id + " 候选句数量须 4-6");
      m.sentences.forEach((s) => {
        if (!["dry", "fluff", "ad", "stale"].includes(s.type)) errors.push(s.id + " 句型非法");
        if (!s.text || !s.id) errors.push(m.id + " 有候选句缺 id/text");
      });
    });
    const methodIds = Object.keys(pack.methods);
    methodIds.forEach((id) => {
      const perMood = pack.matrix[id];
      if (!perMood) { errors.push("matrix 缺 " + id); return; }
      moodOrder.forEach((mood) => {
        if (!perMood[mood] || !perMood[mood].hit || !perMood[mood].miss) errors.push("matrix." + id + "." + mood + " 缺 hit/miss");
      });
    });
    if (!pack.letters || !pack.letters.good || !pack.letters.stale) errors.push("letters 缺两版回信");
    return errors;
  }

  const pack = questionPack;
  const errors = validatePack(pack);
  if (errors.length) {
    throw new Error("question-pack 校验失败: " + errors.join("; "));
  }

  if (typeof window !== "undefined") window.CoReadV2Pack = pack;
  if (typeof window !== "undefined") window.CoReadV2PackSchema = { sentenceTypes: ["dry", "fluff", "ad", "stale"], moodStages: pack.moodOrder, validatePack };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { questionPack, validatePack };
  }
})();
