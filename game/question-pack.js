// question-pack.js - 挂号题文案包（M0 骨架版：结构与展示文案就位，候选句与台词矩阵由 M1 填全）
// Schema（总览 v1.1 冻结）：
// question: { id, kicker, title, body, askerShort, askerName, address, stats, mainAnchor, subAnchor, patienceBase }
// materials[4]: { id, kind(official|guide|experience|asker), kindLabel, title, author, date, engagement,
//                source, excerpt, body[](全文段落), caution,
//                sentences[](候选句: { text, type: dry|fluff|ad|stale }) }
// methods: 每方式 { cost, maxPerQuestion, unlockAt }；combos: 组合加成；matrix: 6方式×4状态×{hit, miss}
// letters: { good, stale }（回信两版）
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
      patienceBase: 6
    },
    materials: [
      {
        id: "m1", kind: "official", kindLabel: "官方说明", title: "市一院门诊挂号与就诊流程（近期更新）",
        author: "市一院门诊部", date: "上月更新", engagement: "官方发布",
        source: "医院官方说明", excerpt: "凭身份证建卡/取号，自助机或窗口均可，先报到再就诊。",
        caution: "官方发布，可信度最高。",
        body: ["为减少排队，门诊实行先报到后就诊：持身份证在自助机建卡或取号，也可到窗口办理。", "挂号后请到对应科室楼层报到机扫码报到，听取叫号。", "初诊患者建议预留充足时间，高峰期排队约 15-30 分钟。"],
        sentences: []
      },
      {
        id: "m2", kind: "guide", kindLabel: "老攻略", title: "省城各大医院看病全攻略（亲测整理）",
        author: "攻略老哥", date: "2021 年", engagement: "2100 赞 · 890 收藏",
        source: "多年前的个人整理", excerpt: "带好现金！很多医院窗口不支持扫码，先去一站式窗口办就诊卡。",
        caution: "写得最全，但已经是五年前的流程。",
        body: ["带足现金，窗口多半不收扫码支付，别问我怎么知道的。", "先到一站式服务窗口办就诊卡，押金 20 元记得退。", "科室楼层分散，先在大厅看平面图再上楼。"],
        sentences: []
      },
      {
        id: "m3", kind: "experience", kindLabel: "个人经历", title: "一个人去挂号的经历和几个小建议",
        author: "软软今天也好困", date: "两周前", engagement: "356 赞",
        source: "两周前的亲历帖", excerpt: "第一次一个人去医院真的很慌，我提前把要说的症状写在备忘录里。",
        caution: "时间新、过程真实，但不代表现在的规定。",
        body: ["第一次一个人去医院，在大厅站了十分钟不敢动，后来发现其实跟着指示牌走就行。", "我把症状和想问的问题提前写在手机备忘录里，见到医生照着说，没有落下任何一件事。", "导诊台的小姐姐人会很好，不确定挂哪科就去问导诊台。"],
        sentences: []
      },
      {
        id: "m4", kind: "asker", kindLabel: "楼主补充", title: "楼主补充：学校医保的事有人了解吗",
        author: "林一舟", date: "今天", engagement: "2 条回复",
        source: "提问者自己的补充",
        excerpt: "同学说学校医保可能要先办手续才能用，不确定是不是真的，有点慌。",
        caution: "这是他最在意、也最容易被忽略的事。",
        body: ["同学说大学生的医保可能要先在学校办手续，看病的费用才能报，不确定是不是真的。", "辅导员只发过一个通知，我没细看，现在有点慌。"],
        sentences: []
      }
    ],
    methods: {
      empathy: { label: "共情", cost: 1, maxPerQuestion: 1 },
      probe: { label: "追问", cost: 1, maxPerQuestion: 2 },
      advice: { label: "建议", cost: 1, maxPerQuestion: 99 },
      story: { label: "案例", cost: 2, maxPerQuestion: 99 },
      checklist: { label: "清单", cost: 2, maxPerQuestion: 99 },
      tradeoff: { label: "利弊摊开", cost: 3, maxPerQuestion: 99 }
    },
    combos: [
      { seq: ["empathy", "probe"], effect: "probe-hit" },
      { seq: ["probe", "advice"], effect: "advice-up" },
      { seq: ["empathy", "story"], effect: "soothe-up" },
      { seq: ["story", "checklist"], effect: "checklist-trust" },
      { seq: ["probe", "checklist"], effect: "checklist-personal" }
    ],
    matrix: {},
    letters: {
      good: { text: "博主你好！手续办好了，号也挂上了，就是排了会儿队。谢谢你那晚的回复。", result: "他顺利挂上了号。", memory: "第一次独自就医，他做到了。" },
      stale: { text: "博主……我照着攻略去窗口办卡，窗口说现在都是自助机了，我又排队重新弄，白跑了一趟。不过后面还是看上了。", result: "他白跑一趟，但最终看上了病。", memory: "那句五年前的攻略，让他多跑了一趟。" }
    }
  };

  window.CoReadV2Pack = questionPack;
  window.CoReadV2PackSchema = { sentenceTypes: ["dry", "fluff", "ad", "stale"], moodStages: ["panic", "dazed", "getting", "steady"] };
})();
