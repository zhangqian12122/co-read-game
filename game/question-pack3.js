// question-pack3.js - 租房题（内置第三题）：小满被中介逼单
(() => {
  const pack = {
    question: {
      id: "rent",
      kicker: "生活经验 · 租房",
      title: "第一次看房，中介让我今天必须交定金，怎么办？",
      body: "刚毕业来大城市工作三个月，第一次租房。昨天看了一间觉得还行，中介说房子很抢手让我今天必须交 2000 定金。我怕被坑，又怕好房子被抢走。",
      askerShort: "小满", askerName: "小满（22 岁 · 刚毕业）",
      address: "zhihu.local/question/first-rent-deposit",
      stats: ["18 个回答", "96 人关注", "最后编辑于今天"],
      mainAnchor: "第一次租房的被催促感和怕被坑",
      subAnchor: "定金和押金的区别、合同还没看",
      patienceBase: 6,
      opening: "救命……中介说这套房子很多人抢，让我今天必须交 2000 定金。可我连合同都还没看到……第一次租房完全不懂，怕被坑又怕错过，怎么办啊？",
      askerAvatar: "满"
    },
    materials: [
      {
        id: "m1", kind: "official", kindLabel: "官方说明", title: "租房定金与押金的法律区别（住建部）",
        author: "市住建局", date: "今年更新", engagement: "官方发布",
        source: "政府官方说明", excerpt: "定金有法律约束力，反悔不退；押金是保证金，退房时返还。",
        caution: "官方信息，可信。",
        body: ["定金具有法律约束力，给付方违约无权要求返还。", "押金是履约保证金，合同到期后无违约应全额退还。", "签署合同前应核实房东身份证与房产证是否一致。"],
        sentences: [
          { id: "m1-s1", text: "定金具有法律约束力，给付方违约无权要求返还。", type: "dry" },
          { id: "m1-s2", text: "签署合同前应核实房东身份证与房产证是否一致。", type: "dry" },
          { id: "m1-s3", text: "押金是履约保证金，合同到期后无违约应全额退还。", type: "dry" },
          { id: "m1-s4", text: "本市今年推出住房租赁监管服务平台。", type: "fluff" }
        ]
      },
      {
        id: "m2", kind: "guide", kindLabel: "老攻略", title: "租房避坑指南（五年经验总结）",
        author: "租房五年老鸟", date: "2019 年", engagement: "3200 赞 · 1200 收藏",
        source: "多年前的个人整理", excerpt: "中介说交定金就能锁房——千万别信，先看合同再谈。",
        caution: "部分建议过时，各地政策不同。",
        body: ["中介说交定金就能锁房——千万别信，先看合同再谈。", "定金和订金一字之差，法律效力完全不同。", "看房时一定要拍照留证据，包括家具损耗。"],
        sentences: [
          { id: "m2-s1", text: "定金和订金一字之差，法律效力完全不同。", type: "stale" },
          { id: "m2-s2", text: "看房时一定要拍照留证据，包括家具损耗。", type: "dry" },
          { id: "m2-s3", text: "中介费一般是半个月到一个月房租，可以谈。", type: "dry" },
          { id: "m2-s4", text: "我当年被坑了三千块定金，血的教训。", type: "fluff" }
        ]
      },
      {
        id: "m3", kind: "experience", kindLabel: "个人经历", title: "刚毕业被中介逼单，我是这么做的",
        author: "小鱼干", date: "两周前", engagement: "456 赞",
        source: "两周前的亲历帖", excerpt: "中介说今天不交明天就没了，我直接说我要看合同，他反而不催了。",
        caution: "经历真实，但每家中介不一样。",
        body: ["中介说今天不交明天就没了，我直接说我要先看合同，他反而不催了。", "后来发现那套房确实有问题，隔断房。", "建议大家租房前先在住建委官网查一下房源备案。"],
        sentences: [
          { id: "m3-s1", text: "中介说今天不交明天就没了，我直接说我要先看合同，他反而不催了。", type: "dry" },
          { id: "m3-s2", text: "后来发现那套房确实有问题，隔断房。", type: "dry" },
          { id: "m3-s3", text: "建议大家租房前先在住建委官网查一下房源备案。", type: "dry" },
          { id: "m3-s4", text: "租房真的要佛系，急不得。", type: "fluff" }
        ]
      },
      {
        id: "m4", kind: "asker", kindLabel: "楼主补充", title: "楼主补充：合同还没看到，中介说先交定金再看",
        author: "小满", date: "今天", engagement: "3 条回复",
        source: "提问者自己的补充",
        excerpt: "中介说合同要交了定金才能给我看，这样正常吗？",
        caution: "她最不安的地方。",
        body: ["中介说合同要交了定金才能给我看，这样正常吗？", "而且我连房东是谁都没见过，是中介代理的。"],
        sentences: [
          { id: "m4-s1", text: "中介说合同要交了定金才能给我看，这样正常吗？", type: "dry" },
          { id: "m4-s2", text: "我连房东是谁都没见过，是中介代理的。", type: "dry" },
          { id: "m4-s3", text: "第一次租房完全不懂。", type: "dry" },
          { id: "m4-s4", text: "算了可能是我太谨慎了。", type: "fluff" }
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
      empathy: { needSentence: "m3-s1", note: "带上午被逼单的共鸣句" },
      probe: { needSentence: "m4-s1", note: "读过楼主补充，才能问中「先看合同」" },
      advice: { anySentenceOf: ["m1-s1", "m1-s2", "m3-s3"], note: "有法律或核验句，建议才落地" },
      story: { needSentence: "m3-s1", note: "有亲历句，故事才讲得出来" },
      checklist: { anySentenceOf: ["m1-s1", "m1-s2", "m1-s3"], minCount: 2, note: "官方干货句凑满两条，清单才成立" },
      tradeoff: { note: "租房流程题没有利弊可摊" }
    },
    matrix: {
      empathy: {
        panic: { hit: "救命……你怎么知道……我就是怕被坑又怕错过……", miss: "嗯……我是想知道该不该交……" },
        dazed: { hit: "你怎么知道，我就是这个意思……", miss: "我……我其实想知道合同怎么看。" },
        getting: { hit: "嗯嗯……被人说中的感觉，安心多了。", miss: "这个我知道了……" },
        steady: { hit: "谢谢你……我心里踏实多了。", miss: "嗯。" }
      },
      probe: {
        panic: { hit: "合同还没看到！中介说交了定金才给看……这样正常吗？", miss: "我、我就是都想知道……" },
        dazed: { hit: "合同……还没看到。要先看合同再交钱吗？", miss: "没有别的了……你说什么我就查什么。" },
        getting: { hit: "还没看……我明天一定先要合同。", miss: "都记下来了……" },
        steady: { hit: "合同还没看。我记下了，不看合同不交钱。", miss: "嗯，都清楚了……" }
      },
      advice: {
        panic: { hit: "先看合同再交钱……好，我今天就跟他要合同。", miss: "可是我还是怕他说房子没了……" },
        dazed: { hit: "原来是这样……我记在备忘录里了。", miss: "嗯……那定金到底该不该交？" },
        getting: { hit: "好的，我不交定金，先看合同。", miss: "好的……" },
        steady: { hit: "明白了，谢谢博主！", miss: "好的，谢谢……" }
      },
      story: {
        panic: { hit: "原来别人也被逼过……后来怎么解决的？", miss: "……哦。" },
        dazed: { hit: "听着跟我差不多……那位博主最后租到了吗？", miss: "嗯，这位网友经验挺多的。" },
        getting: { hit: "嗯……我也先在官网查一下房源备案。", miss: "好的。" },
        steady: { hit: "谢谢博主讲这个，我感觉我可以的。", miss: "嗯嗯。" }
      },
      checklist: {
        panic: { hit: "核实房东、看合同、拍照……好，我今晚就做准备。", miss: "清单有点多……我先记着。" },
        dazed: { hit: "定金有法律约束力……原来不能随便交。", miss: "可是中介不会同意的啊……" },
        getting: { hit: "都记下来了：核实房东、看合同、拍照留证、不急着交定金。", miss: "嗯，我看看……" },
        steady: { hit: "清单很清楚，谢谢博主！", miss: "好的，我看看清单。" }
      },
      tradeoff: {
        panic: { hit: "利弊……其实我就想知道该不该交……", miss: "我不太听得进去这些……" },
        dazed: { hit: "分析得挺有道理，可我还是怕房子被抢。", miss: "嗯……" },
        getting: { hit: "两头都明白了，我还是先看合同。", miss: "好……" },
        steady: { hit: "谢谢你帮我把两边都讲了。", miss: "嗯。" }
      }
    },
    moodOrder: ["panic", "dazed", "getting", "steady"],
    moodLabels: { panic: "慌乱", dazed: "懵懂", getting: "了解", steady: "踏实" },
    letters: {
      good: { days: 2, text: "博主！我今天没交定金，直接找中介要了合同。后来发现那间是隔断房……幸好没交！现在在看别的房子，心里有底多了。谢谢你们！", result: "她没交定金，发现了隔断房陷阱，避免了损失。", memory: "小满第一次租房：不看合同不交钱，官网查备案。" },
      stale: { days: 2, text: "博主……我照着攻略说的去查了订金和定金的区别，结果中介说他们收的就是定金不是订金……我还是交了因为怕房子没了。后来发现合同有问题在扯皮。", result: "她交了定金，后续合同出了问题。", memory: "那篇攻略帮了倒忙——区分订金定金不够用，关键是不看合同不交钱。" }
    },
    companion: {
      name: "共读伙伴 00",
      researchLines: {
        firstMaterial: "这份是「{kind}」。先看看署名和日期，再决定信它几分。",
        bothMaterials: "两张纸都在这儿了。哪句是真有用的，我们一句句看。",
        staleSpotted: "等等……这篇的日期是 2019 年的。写得再全，也可能带错路。"
      },
      inspectLines: {
        m1: "住建局的官方说明——定金和押金的区别，这条是主心骨。",
        m2: "2019 年的攻略……订金和定金的区别现在还有用，但有些政策变了。",
        m3: "两周前的经历帖。她那句「我要先看合同，他反而不催了」，这段我记得住。",
        m4: "这是她自己补的话——合同还没看到就要交定金，这才是最不对劲的地方。"
      },
      reactionHit: ["问中了！你看她的话多起来了。", "接住了。她开始说真话了。", "就是这个方向，稳住。"],
      reactionMiss: ["……她好像没接住。换张牌试试。", "答偏了。她耐心在掉，下一句要更准。", "这不是她想问的。翻翻素材卡，找那句真正对题的。"]
    }
  };

  if (typeof window !== "undefined") window.CoReadV2PackRent = pack;
  if (typeof module !== "undefined" && module.exports) module.exports = { pack };
})();
