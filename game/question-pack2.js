// question-pack2.js - 火车题（内置第二题，通关挂号题后自动解锁）
// 结构与 question-pack.js 完全一致，引擎无感切换。
(() => {
  const pack = {
    question: {
      id: "train",
      kicker: "生活经验 · 出行",
      title: "第一次一个人坐火车回家，需要注意什么？",
      body: "学生第一次坐长途火车，怕坐过站、怕东西丢，也怕身体不舒服没人帮。票是中转的，只有 40 分钟，不知道来不来得及。",
      askerShort: "小归", askerName: "小归（21 岁 · 异地恋学生）",
      address: "zhihu.local/question/first-train-ride",
      stats: ["5 个回答", "12 人关注", "最后编辑于今天"],
      mainAnchor: "第一次独自出远门的紧张",
      subAnchor: "中转只有 40 分钟够不够",
      patienceBase: 6,
      opening: "那个……我明天第一次自己坐火车回家，是中转的，只有 40 分钟。怕坐过站也怕丢东西，要准备什么呀？",
      askerAvatar: "归"
    },
    materials: [
      {
        id: "m1", kind: "official", kindLabel: "官方说明", title: "火车站乘车流程指南（新版）",
        author: "铁路服务台", date: "上月更新", engagement: "官方发布",
        source: "铁路官方说明", excerpt: "凭身份证进站，提前 30 分钟到站安检候车。",
        caution: "官方信息，可信。",
        body: ["凭身份证进站，提前 30 分钟到站安检候车。", "检票口在大屏显示，开车前 5 分钟停止检票。", "中转旅客无需出站，站内换乘通道按指示牌走。"],
        sentences: [
          { id: "m1-s1", text: "凭身份证进站，提前 30 分钟到站安检候车。", type: "dry" },
          { id: "m1-s2", text: "检票口在大屏显示，开车前 5 分钟停止检票。", type: "dry" },
          { id: "m1-s3", text: "中转旅客无需出站，站内换乘通道按指示牌走。", type: "dry" },
          { id: "m1-s4", text: "本站日均发送旅客 8 万人次。", type: "fluff" },
          { id: "m1-s5", text: "下载我们的 APP 抢票更方便哦。", type: "ad" }
        ]
      },
      {
        id: "m2", kind: "guide", kindLabel: "老攻略", title: "坐火车回家老攻略（收藏版）",
        author: "回家老鸟", date: "2020 年", engagement: "2100 赞 · 890 收藏",
        source: "四年前的个人整理", excerpt: "一定要取纸质票，检票只认纸质票。",
        caution: "四年前的方法，电子票早已普及。",
        body: ["一定要取纸质票，检票只认纸质票。", "候车室人多，看好自己的包。", "我每次都提前两小时到，风雨无阻。"],
        sentences: [
          { id: "m2-s1", text: "一定要取纸质票，检票只认纸质票。", type: "stale" },
          { id: "m2-s2", text: "候车室人多，看好自己的包。", type: "dry" },
          { id: "m2-s3", text: "我每次都提前两小时到，风雨无阻。", type: "fluff" },
          { id: "m2-s4", text: "关注我看更多出行内容。", type: "ad" }
        ]
      },
      {
        id: "m3", kind: "experience", kindLabel: "个人经历", title: "第一次独自坐火车的经历",
        author: "软软", date: "上周", engagement: "356 赞",
        source: "上周的亲历帖", excerpt: "其实没那么可怕，跟着大屏走就行，我提前把车次截图了。",
        caution: "经历真实，仅供参考。",
        body: ["第一次坐火车我超级紧张，把车次和座位都截图存在相册了。", "找不到检票口就问穿制服的工作人员，别自己瞎转。", "车上人多注意睡觉别坐过站，定个闹钟。"],
        sentences: [
          { id: "m3-s1", text: "第一次坐火车我超级紧张，把车次和座位都截图存在相册了。", type: "dry" },
          { id: "m3-s2", text: "找不到检票口就问穿制服的工作人员，别自己瞎转。", type: "dry" },
          { id: "m3-s3", text: "车上人多注意睡觉别坐过站，定个闹钟。", type: "dry" },
          { id: "m3-s4", text: "后来我买了旅行保险，有需要的私我。", type: "ad" }
        ]
      },
      {
        id: "m4", kind: "asker", kindLabel: "楼主补充", title: "楼主补充：中转只有 40 分钟来得及吗",
        author: "小归", date: "今天", engagement: "2 条回复",
        source: "提问者自己的补充",
        excerpt: "票是中转的，只有 40 分钟，来不及怎么办？",
        caution: "他最担心的问题。",
        body: ["票是中转的，只有 40 分钟，来不及怎么办？要不要改签。", "我没坐过火车，不知道中转怎么走。", "有点慌，大家帮帮我。"],
        sentences: [
          { id: "m4-s1", text: "中转只有 40 分钟，来得及吗？要不要改签。", type: "dry" },
          { id: "m4-s2", text: "我没坐过火车，不知道中转怎么走。", type: "dry" },
          { id: "m4-s3", text: "有点慌，大家帮帮我。", type: "dry" },
          { id: "m4-s4", text: "算了大不了不回家了。", type: "fluff" }
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
      empathy: { needSentence: "m3-s1", note: "带上午车的紧张共鸣句" },
      probe: { needSentence: "m4-s1", note: "读过楼主补充，才能问中中转时间" },
      advice: { anySentenceOf: ["m1-s1", "m1-s2", "m4-s1"], note: "有官方流程或中转句，建议才落地" },
      story: { needSentence: "m3-s1", note: "有亲历句，故事才讲得出来" },
      checklist: { anySentenceOf: ["m1-s1", "m1-s2", "m1-s3"], minCount: 2, note: "官方干货句凑满两条，清单才成立" },
      tradeoff: { note: "出行流程题没有利弊可摊" }
    },
    matrix: {
      empathy: {
        panic: { hit: "那个……你怎么知道……我就是怕坐过站，第一次自己出远门……", miss: "嗯……我是想知道具体怎么坐……" },
        dazed: { hit: "你怎么知道，我就是这个意思……", miss: "我……我其实想知道中转怎么走。" },
        getting: { hit: "嗯嗯……被人说中的感觉，安心多了。", miss: "这个我知道了……" },
        steady: { hit: "谢谢你……我心里踏实多了。", miss: "嗯。" }
      },
      probe: {
        panic: { hit: "中转只有 40 分钟……来得及吗？我一直没敢确认……", miss: "我、我就是都想知道……" },
        dazed: { hit: "中转怎么走……我不知道。来得及吗？", miss: "没有别的了……你说什么我就查什么。" },
        getting: { hit: "还没查……我明天一早就去看大屏。", miss: "都记下来了……" },
        steady: { hit: "中转 40 分钟。我记下了，到时候走换乘通道。", miss: "嗯，都清楚了……" }
      },
      advice: {
        panic: { hit: "走换乘通道……好，我明天到站就去找指示牌。", miss: "可是我还是不知道第一步去哪儿……" },
        dazed: { hit: "原来中转不用出站……我记在备忘录里了。", miss: "嗯……那我要取票吗？" },
        getting: { hit: "好的，我走换乘通道，不走出站口。", miss: "好的……" },
        steady: { hit: "明白了，谢谢博主！", miss: "好的，谢谢……" }
      },
      story: {
        panic: { hit: "原来别人第一次也会紧张……那我还好。", miss: "……哦。" },
        dazed: { hit: "听着跟我差不多……他后来顺利吗？", miss: "嗯，这位网友经验挺多的。" },
        getting: { hit: "嗯……我也把车次截图存到相册。", miss: "好的。" },
        steady: { hit: "谢谢博主讲这个，我感觉我可以的。", miss: "嗯嗯。" }
      },
      checklist: {
        panic: { hit: "身份证、充电宝、定闹钟……好，我今晚就收拾好。", miss: "清单有点多……我先记着。" },
        dazed: { hit: "凭身份证进站……原来不用取票。", miss: "可是中转怎么走写不上去啊……" },
        getting: { hit: "都记下来了：身份证、大屏看检票口、换乘通道、定闹钟。", miss: "嗯，我看看……" },
        steady: { hit: "清单很清楚，谢谢博主！", miss: "好的，我看看清单。" }
      },
      tradeoff: {
        panic: { hit: "利弊……其实我就想知道该怎么坐……", miss: "我不太听得进去这些……" },
        dazed: { hit: "分析得挺有道理，可我还是想知道中转怎么走。", miss: "嗯……" },
        getting: { hit: "两头都明白了，我还是按流程来。", miss: "好……" },
        steady: { hit: "谢谢你帮我把两边都讲了。", miss: "嗯。" }
      }
    },
    moodOrder: ["panic", "dazed", "getting", "steady"],
    moodLabels: { panic: "慌乱", dazed: "懵懂", getting: "了解", steady: "踏实" },
    letters: {
      good: { days: 3, text: "博主你好！顺利到家啦，中转也赶上了，跟着换乘通道指示牌走就行。闹钟也定好了，没坐过站。谢谢你们！", result: "中转赶上了，顺利到家。第一次独自出行，他做到了。", memory: "小归第一次独自坐火车：提前看大屏，走换乘通道，定闹钟防坐过站。" },
      stale: { days: 3, text: "博主……我照着那篇攻略去取纸质票，窗口说早就不打了，刷身份证就行……白排了半天队。后面还算顺利，就是浪费了时间……下次我先看清攻略的日期。", result: "他白排了队，但最终上了车。", memory: "过时的攻略让小归多排了半天队。过时的信息，会让人付出真实的代价。" }
    },
    companion: {
      name: "共读伙伴 00",
      researchLines: {
        firstMaterial: "这份是「{kind}」。先看看署名和日期，再决定信它几分。",
        bothMaterials: "两张纸都在这儿了。哪句是真有用的，我们一句句看。",
        staleSpotted: "等等……这篇的日期是 2020 年的。写得再全，也可能带错路。"
      },
      inspectLines: {
        m1: "铁路官方发的，日期也新——这份可以当主心骨。",
        m2: "写得最全的一篇……可右上角写着 2020 年。全信它会出事。",
        m3: "上周的经历帖。她那段「超级紧张把车次截图了」，我记得住。",
        m4: "这是他自己补的话——中转 40 分钟，八成才是他最急的事。"
      },
      reactionHit: ["问中了！你看他的话多起来了。", "接住了。他开始说真话了。", "就是这个方向，稳住。"],
      reactionMiss: ["……他好像没接住。换张牌，或者换句素材试试。", "答偏了。他耐心在掉，下一句要更准。", "这不是他想问的。翻翻素材卡，找那句真正对题的。"]
    }
  };

  if (typeof window !== "undefined") window.CoReadV2PackTrain = pack;
  if (typeof module !== "undefined" && module.exports) module.exports = { pack };
})();
