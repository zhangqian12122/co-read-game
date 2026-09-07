"use strict";

const hospitalMaterials = [
  {
    id: "official", kind: "official", kindLabel: "官方说明", date: "2026-08-18",
    title: "某市第一医院：门诊就诊准备说明",
    excerpt: "挂号渠道、证件准备与到院后的基本流程，以医院当天公布的信息为准。",
    author: "医院官方服务号（游戏虚构）", source: "机构发布", engagement: "最近更新 · 可追溯",
    validUses: ["official"], tendencies: { truth: 2 },
    body: [
      "为了避免不同地区、不同医院的流程差异，本说明只列出就诊前应当核对的项目：确认医院与院区、查看当日挂号渠道、准备本人有效证件，并按官方页面提示确认是否需要其他材料。",
      "不同科室的预约方式、医保规则和报到位置可能不同。到院前应再次查看医院官方渠道，遇到不确定情况可以联系医院服务台。"
    ],
    quote: "到院前，请再次查看本院当日通知。",
    caution: "虚构医院示例，不提供疾病诊断。"
  },
  {
    id: "oldGuide", kind: "old", kindLabel: "高赞回答", date: "2021-03-06",
    title: "第一次去三甲医院？照着这张流程图走",
    excerpt: "一份清晰、流传很广的挂号流程，但回答已经五年没有更新。",
    author: "匿名用户", source: "个人整理", engagement: "12,846 赞同 · 631 收藏",
    validUses: ["uncertain"], tendencies: { expression: 1, caution: 1 },
    body: [
      "回答者按照自己当年的经历，整理了一套从现场取号、窗口缴费到候诊的步骤。结构清楚，评论区里也有许多人表示曾经受益。",
      "回答没有说明具体城市和医院，部分窗口名称也可能已经变化。最近评论里有人提醒，现在很多医院已经改用新的预约和报到方式。"
    ],
    quote: "我当时走的是现场窗口，后来有没有改，我不确定。",
    caution: "回答未标注城市、医院和最后核验日期。"
  },
  {
    id: "experience", kind: "experience", kindLabel: "亲历回答", date: "2026-05-21",
    title: "我第一次一个人看病时，最有用的不是流程图",
    excerpt: "一位外地学生讲述如何缓解紧张、记录问题并在需要时向工作人员求助。",
    author: "晚课以后", source: "个人经历", engagement: "318 赞同 · 42 评论",
    validUses: ["experience"], tendencies: { empathy: 2 },
    body: [
      "回答者回忆，第一次独自去医院时，她提前把想向医生说明的情况写在手机备忘录里，也把不理解的流程及时问了工作人员。",
      "她强调这只是自己的经历，不能代表所有医院；真正帮到她的是允许自己承认紧张，并在不清楚时开口询问。"
    ],
    quote: "我把想问医生的事写在了手机里。",
    caution: "作者仅描述自己的就诊经历。"
  },
  {
    id: "context", kind: "context", kindLabel: "题主后来回复", date: "今天 18:42",
    title: "“同学说学校医保可能要先办手续，可我不知道该问学校还是医院”",
    excerpt: "悠一后来在评论里补了一件题面没有提到的事：他还拿不准学校医保该从哪里问起。",
    author: "提问者 · 悠一", source: "评论区补充", engagement: "评论第 17 楼 · 3 人赞同",
    validUses: ["context"], tendencies: { empathy: 1, caution: 1 },
    body: [
      "悠一后来在评论里说，同学提醒过校内医保可能有额外手续，可大家说法不一样，他也不知道应该先问学校还是医院。",
      "他还没有说明学校、所在城市和准备去的医院。这些条件都会影响医保手续，单靠一份通用就诊流程没法替他确认。"
    ],
    quote: "同学们说法不一样，我不知道该听谁的。",
    caution: "校内医保手续尚未得到学校或医院确认。"
  }
];

const careerMaterials = [
  {
    id: "market", kind: "official", kindLabel: "市场观察", date: "2026-07-18",
    title: "转行目标岗，最近半年到底在招谁？", author: "职路样本库（游戏虚构）", source: "公开职位汇总",
    engagement: "最近更新 · 附样本说明", excerpt: "目标岗位增加了，但多数仍要求作品或相关经历。",
    validUses: ["market"], tendencies: { truth: 2, caution: 1 },
    body: [
      "这份观察汇总了多个招聘站近半年的公开职位。目标岗位比去年下半年多，但明确接受零经验候选人的职位仍少，作品集和相关项目经常排在学历之前。",
      "岗位主要集中在一线和新一线城市，薪资跨度很大。同一个岗位名称，实际工作也可能完全不同；报告建议先比对本地职位描述。"
    ],
    quote: "同一个岗位名，实际工作也可能完全不同。", caution: "只统计公开职位；不含内推，也不能代表林岸所在城市。"
  },
  {
    id: "success", kind: "experience", kindLabel: "转行经历", date: "2026-03-22",
    title: "裸辞后的第142天，我拿到了新方向的录用通知", author: "白桃汽水", source: "个人经历",
    engagement: "2,106 赞同 · 184 评论", excerpt: "她成功转行，但辞职前已有作品和一年的生活费。",
    validUses: ["method"], tendencies: { empathy: 1, expression: 2 },
    body: [
      "她在原公司做运营时，用周末完成了三个数据分析项目。辞职后，她把每天分成学习、投递和复盘三段，第142天拿到新方向的录用通知。",
      "她在结尾补充，离职时有十二个月生活费，也能暂住家里。真正让她敢停下来的是作品和缓冲已经在手里。"
    ],
    quote: "离职前，作品和缓冲已经在手里。", caution: "准备周期与生活成本都明显好于林岸。"
  },
  {
    id: "failure", kind: "old", kindLabel: "失败复盘", date: "2026-01-14",
    title: "裸辞九个月后，我又回到了原行业", author: "匿名用户 47", source: "个人经历",
    engagement: "886 赞同 · 203 评论", excerpt: "三个月存款很快见底，焦虑压缩了学习和选择空间。",
    validUses: ["risk"], tendencies: { truth: 1, empathy: 1, caution: 2 },
    body: [
      "答主在最疲惫的时候裸辞，原以为三个月足够入门。存款见底后，她开始同时投新旧两个行业，最后接受了一份和原工作相近的职位。",
      "她不认为转行本身错了。复盘时，她最遗憾的是辞职前没有试做项目，也没有算清固定开支，只把离开当成了开始。"
    ],
    quote: "我只把离开当成了开始。", caution: "这是一次失败；目标行业、身体状态与家庭支持都不同。"
  },
  {
    id: "context", kind: "context", kindLabel: "题主后来回复", date: "今天 22:16",
    title: "“想转的方向只上过网课，我现在连一份能投的作品都没有”", author: "提问者 · 林岸", source: "评论区补充",
    engagement: "评论第 9 楼 · 6 人赞同", excerpt: "林岸后来补充了每月开支、想转的方向，以及自己目前还没有作品。",
    validUses: ["context"], tendencies: { empathy: 2, caution: 1 },
    body: [
      "林岸后来回复，自己没有房贷，也不用给家里寄钱，但房租加日常开支每月差不多五千，现有存款大约只能撑三个月。",
      "他想转数据分析，目前只上过一门网课，还没有做过能放进简历的项目。最近看了十几条招聘信息，大多都要求相关项目或作品。"
    ],
    quote: "我现在连一份能投的作品都没有。", caution: "还要确认离职补偿，以及目标岗位是否接受没有相关经验的人。"
  }
];

const chapterDefinitions = {
  hospital: {
    id: "hospital", archive: "档案 00 · 第一次独自去医院", address: "zhihu.local/question/first-hospital-visit",
    kicker: "生活经验 · 校园生活", title: "大学生第一次自己去医院，挂号前需要准备什么？",
    body: "一个人在外地上大学，最近需要去医院看看，但从来没独自挂过号。网上流程很多，我不知道哪些现在还适用，也有点紧张，主要担心东西没带齐，或者到了医院才发现挂错科。",
    asker: "",
    stats: ["18 个回答", "96 人关注", "最后编辑于今天"], eyebrow: "共读调查 / 01",
    researchTitle: "先看哪两份材料？", instruction: "先打开材料，看看作者、日期和来源，再选两份递给伙伴。没看过的材料不能选。",
    tagPrompt: "这份材料在你看来是：", materials: hospitalMaterials,
    tagOptions: [
      { id: "official", label: "最新官方信息" }, { id: "experience", label: "个人经历" },
      { id: "uncertain", label: "待核实 / 可能过时" }, { id: "context", label: "当事人补充" }
    ]
  },
  career: {
    id: "career", archive: "档案 01 · 一条没有官方答案的路", address: "zhihu.local/question/quit-and-change-career",
    kicker: "职业选择 · 个人成长", title: "工作三年、只有三个月存款，该不该裸辞转行？",
    body: "在现在的行业做了三年，我越来越确定自己不想干了，可每天下班以后累得什么都不想做，根本没精神准备转行。我手里的钱只够撑三个月，直接辞又不敢，可一直这么拖，我怕一年以后还在干现在这份工作。",
    asker: "",
    stats: ["27 个回答", "183 人关注", "最后编辑于今天"], eyebrow: "共读调查 / 03",
    researchTitle: "这两份材料，你们准备怎么用？", instruction: "先打开材料，再从四份里选两份。这里没有标准答案，重点是分清它能帮你们看岗位、找办法、提醒风险，还是补齐林岸自己的情况。",
    tagPrompt: "你打算怎样使用这份材料：", materials: careerMaterials,
    tagOptions: [
      { id: "market", label: "作为市场参照" }, { id: "method", label: "借鉴其中做法" },
      { id: "risk", label: "记下可能风险" }, { id: "context", label: "补齐本人条件" }
    ]
  }
};

const hospitalDecisions = [
  { id: "checklist", title: "先说去医院前要准备什么", detail: "证件带什么、医院要求什么、学校医保该问谁，一项项跟他说清楚。", requiresAny: ["official", "oldGuide"], tendencies: { truth: 2, expression: 1, caution: 1 } },
  { id: "clarify", title: "先问清他在哪所学校、准备去哪家医院", detail: "学校医保怎么办，要看学校和医院各自的规定，先把这两处问清楚。", requiresAny: ["context"], tendencies: { empathy: 2, caution: 2 } },
  { id: "support", title: "先说到了医院不知道怎么办", detail: "如果现场流程对不上，就记下卡住的地方，再去问导诊台或窗口。", requiresAny: ["experience"], tendencies: { empathy: 2, expression: 1 } },
  { id: "direct", title: "直接把整套就诊流程写给他", detail: "照着那份高赞回答，把挂号、报到和看诊顺序都列出来。", requiresAny: ["oldGuide"], tendencies: { expression: 2 } }
];

const hospitalDraftApproaches = {
  clear: {
    title: "先告诉他今晚能做什么", detail: "让他先准备证件、确认院区，马上知道该从哪儿开始。",
    tendencies: { truth: 1, expression: 2 },
    lines: {
      checklist: "今晚可以先把身份证、医保凭证和目标院区确认好，学校手续那一项还得等学校或校医院回你",
      clarify: "你先把学校、所在城市和准备去的医院告诉我，我们再帮你把医保和挂号分开查",
      support: "你可以先把哪里不舒服、想问医生什么记在手机里，到了以后不知道往哪走，就把这几句话给工作人员看",
      direct: "我先把能核对上的步骤列给你，窗口和报到方式还得按目标医院今天的说明再确认"
    },
    partner: "这样开头他马上知道能做什么，后面没查清的地方也不会被我们写满",
    memory: "伙伴记住，先给眼下能做的事",
    followupEcho: "我看完开头就先把今晚能准备的东西找出来了"
  },
  ask: {
    title: "先问清他的学校和准备去的医院", detail: "等他把这两处说清楚，再接着回答医保和挂号。",
    tendencies: { empathy: 1, caution: 2 },
    lines: {
      checklist: "清单我可以帮你列，不过学校医保要不要先办手续，得先知道你在哪所学校、准备去哪个医院",
      clarify: "你在哪个城市、哪所学校，准备去哪个院区？这三件事说清楚，后面的流程才不会串",
      support: "你最怕的是到了以后不知道怎么问，还是怕学校手续没办好？我先帮你处理最卡住的那件事",
      direct: "这套流程看着很全，可它是几年前的，你准备去哪家医院？我们先对一下现在的页面"
    },
    partner: "先等他回这一句，答案会慢一点，不过不容易把别人的情况套到他身上",
    memory: "伙伴记住，答案会变时先问一句",
    followupEcho: "还好你们先问了我一句，我补完学校和医院以后，才发现同学说的不是一回事"
  },
  steady: {
    title: "先回应他为什么这么紧张", detail: "先让他缓下来，再接着说能查到的流程。",
    tendencies: { empathy: 2, expression: 1 },
    lines: {
      checklist: "第一次自己去确实容易慌，你不用今晚把所有流程都背下来，我们先把能确认的东西一项项收好",
      clarify: "你现在拿不准很正常，学校手续和医院挂号本来就是两件事，我们先把你的学校和医院对上",
      support: "到了窗口一时说不出来也没关系，你可以照着手机里的那几句话问，工作人员会告诉你当天该往哪走",
      direct: "第一次去最怕的就是临时变动，所以这份流程只能拿来认路，真到现场还是按当天提示走"
    },
    partner: "这句话能让他先松一口气，我会把安慰和流程分开写，免得听起来像一句空话",
    memory: "伙伴记住，先回应对方真正怕的事",
    followupEcho: "开头那句让我没那么慌，后面的步骤我才看得进去"
  }
};

const careerDraftApproaches = {
  grounded: {
    title: "开头先把他自己的情况摆出来", detail: "三个月存款、房租和还没有正式作品，这几件事先说清楚。",
    tendencies: { truth: 2, caution: 1 },
    lines: {
      verify: "你手里的钱大概只够三个月，每月还要交房租，想转的方向也没有正式作品，我们先把这三件事算清楚，再谈什么时候辞职",
      listen: "你已经累到下班后很难再准备了，手里的钱又只够三个月，这两个问题得分开看，不能只靠继续硬撑",
      move: "你现在还没有能拿去投的作品，手里的钱也只够三个月，可以先用一周做个很小的试验，看看这条路到底离你有多远"
    },
    partner: "这样开头说的是林岸自己的情况，后面接建议也不会飘到别人的经历上",
    memory: "伙伴记住，先把对方自己的条件摆出来",
    followupEcho: "我看到开头写的是我的存款、房租和作品，才敢接着往下看",
    conflictEcho: "开头明明写的是我的存款和房租，我才以为后面的判断也都是按我的情况来的"
  },
  ask: {
    title: "开头先问一个会改变答案的问题", detail: "问清每月开支、想转的岗位，或者他到底累到了什么程度。",
    tendencies: { empathy: 1, caution: 2 },
    lines: {
      verify: "你说钱只够三个月，大概是按多少开支算的？另外你想转的岗位具体是什么，我们知道这两件事以后再帮你算",
      listen: "你现在最难受的是这份工作本身，还是已经累到没有力气准备转行？这两种情况，接下来能做的事不太一样",
      move: "你最想转去做什么，现在手里有没有一个能给别人看的东西？你先说清这两件事，我们再替你挑第一步"
    },
    partner: "先等他回这一句会慢一点，不过能少给他一整段不合身的建议",
    memory: "伙伴记住，关键条件没说清时先问一句",
    followupEcho: "还好你们先问了，我把每月开支和想去的岗位写出来以后，才发现自己漏算了好几件事",
    conflictEcho: "你们开头还特意问了我的情况，我补完以后，却发现后面的材料还是对不上"
  },
  reassure: {
    title: "开头先接住他已经快撑不住这件事", detail: "先让他知道不用今晚做完决定，再把能做的事接上去。",
    tendencies: { empathy: 2, expression: 1 },
    lines: {
      verify: "听得出来你已经拖得很累了，今晚不用马上决定辞不辞，我们可以先把三个月到底够不够用算清楚",
      listen: "每天上班已经把力气耗光了，还逼自己今晚决定以后做什么，确实很难，我们先把现在最难熬的地方理清楚",
      move: "你已经累成这样了，第一步可以小一点，不用先辞职，挑一个周末能做完的东西试一次就够了"
    },
    partner: "这句先接住了他现在的状态，后面再谈钱和行动，听起来不会像在给陌生人下命令",
    memory: "伙伴记住，先接住眼前的人，再往下给办法",
    followupEcho: "开头那句让我先松了口气，我没有当晚提离职，第二天才把账和岗位重新看了一遍",
    conflictEcho: "开头那几句确实让我松了口气，所以我更没想到后面的依据会有问题"
  }
};

const hospitalFollowupReplyChoices = {
  confirm: { title: "只说现在能确定的", detail: "先回答今晚能准备什么，没确认的那一项留出来。", tendencies: { truth: 2, expression: 1 } },
  ask: { title: "再问一个具体条件", detail: "让悠一把学校或医院的回复贴出来，再一起往下看。", tendencies: { empathy: 1, caution: 2 } },
  stay: { title: "先陪他把最慌的地方理顺", detail: "先接住情绪，再给一个不会出错的小动作。", tendencies: { empathy: 2, expression: 1 } },
  assume: { title: "按常见情况直接替他定下来", detail: "不再等学校回复，先告诉他照一般流程去办。", tendencies: { expression: 1, truth: -2, caution: -2 } }
};

const decisionConsequences = {
  hospital: {
    checklist: {
      now: "一张能直接照着收拾东西的清单",
      later: "悠一会告诉你，清单里还少了什么",
      followupEcho: "清单我真用上了，证件一样没少。学校医保那格你们没瞎填，我后来问辅导员才补上。",
      roomEcho: "桌角留着一栏“校内手续：等悠一确认”"
    },
    clarify: {
      now: "先问清学校、城市和目标医院",
      later: "悠一会带着三个具体条件回来，流程才会补全",
      followupEcho: "你们先问我在哪儿上学、要去哪家医院。等我说清楚，后面的步骤一下就顺了。",
      roomEcho: "伙伴为学校、城市和目标医院留了三个空格"
    },
    support: {
      now: "能马上使用的记录与求助方法",
      later: "悠一会把工作人员的真实回答带回来",
      followupEcho: "备忘录里那几句话挺管用。我到窗口没那么慌，也真问出了当天该怎么走。",
      roomEcho: "备忘录旁留着一行“当天流程：等悠一带回来”"
    },
    direct: {
      now: "一条可以立刻照着走的完整流程",
      later: "若现场不同，偏差会在悠一的回访里暴露",
      followupEcho: "那份流程写得太像真的了，我就没再问。到了窗口才发现，有几步早换了。",
      roomEcho: "完整流程旁没有留下提问空格"
    }
  },
  career: {
    verify: {
      now: "先把风险缩到可以核验的范围",
      later: "林岸会带着开支、岗位和作品差距回来",
      followupEcho: "我又算了一遍，三个月其实没想的那么长。所以我先没辞，想把那件作品补出来再说。",
      roomEcho: "桌面上留下“月支出 / 岗位要求 / 作品进度”"
    },
    listen: {
      now: "先让他的压力和边界被看见",
      later: "林岸会先处理耗尽，再回来谈去留",
      followupEcho: "你们先问我是不是已经累坏了。我盯着那句话看了半天，第二天先请了三天假。",
      roomEcho: "软木板空出一块给材料看不见的压力"
    },
    move: {
      now: "用一次小行动换来真实反馈",
      later: "林岸会带着试投结果和新的期限回来",
      followupEcho: "三份试投，一封拒信，一封让我补作品，还有一封没回。至少这回不是我自己瞎猜了。",
      roomEcho: "电脑旁留下第一次试投的日期"
    }
  }
};

const hospitalDecisionOutcomeEchoes = {
  checklist: {
    limited: "不过清单里能写的，基本还是网友经验。医院当天到底要什么，我最后还是自己问的。",
    overcautious: "所以那张清单里，最能直接用的部分反而是空的。我只好第二天又打了个电话。",
    misleading: "最后我只敢留着清单的分栏。里面写的步骤，我全都重新问了一遍。"
  },
  clarify: {
    limited: "你们把我在哪上学、去哪家医院都问清了，可手里还是没有医院现在的说法。流程那格最后只能空着。",
    overcautious: "该问的都问了，可那份当天还能用的医院说明被搁在一边，回信还是晚了一天。",
    misleading: "前面问得挺细，后面却把网友的话写成了医院规定。我看完反而不知道该信哪句。"
  },
  support: {
    limited: "备忘录里的话让我敢开口了。不过当天到底先去哪儿，我还是到了现场才问明白。",
    overcautious: "我倒是敢去问了。后来才知道，被你们先放下的医院说明，本来就能回答一半。",
    misleading: "安慰我的话和所谓的“官方步骤”混在一起。发现来源不对以后，我连那几句好用的提问都不太敢信了。"
  },
  direct: {
    limited: "这套流程看着挺全，可我找不到医院现在的说法，所以没敢转给同学。",
    overcautious: "新的说明被放到一边，旧攻略倒把答案填得满满的。我到了现场才发现顺序早变了。",
    misleading: "它写得太完整了，我当时就信了。真走到另一个窗口，才发现还有好多事根本没问。"
  }
};

const careerTagLimits = {
  market: "不能代表林岸所在城市的整个岗位市场",
  method: "不能直接变成林岸可以照着做的方法",
  risk: "不能证明林岸以后一定会遇到同样的事",
  context: "不能当成林岸本人已经说过的情况"
};

const careerTagClaims = {
  market: "整个行业的情况",
  method: "一套我能照着做的办法",
  risk: "我以后一定会碰上的风险",
  context: "我自己的情况"
};

const careerMisuseFacts = {
  market: {
    fact: "它只统计了多个城市的一部分公开职位",
    speakerLead: "那份材料只统计了网上能查到的一部分职位",
    memory: "职位样本被写成了林岸身边一定存在的机会"
  },
  success: {
    fact: "那位答主离职前已经有作品，还有一年的生活费",
    speakerLead: "那个答主辞职前已经有作品，还有一年的生活费",
    memory: "别人的作品和一年生活费，被从成功经历里抹掉了"
  },
  failure: {
    fact: "那位答主的行业、身体状态和家庭支持都与林岸不同",
    speakerLead: "那个人转的行业、身体状态和家里能不能帮忙，都跟我不一样",
    memory: "另一个人的失败，被写成了林岸将要经历的结局"
  },
  context: {
    fact: "它只交代了林岸当前的存款、开支和作品情况",
    speakerLead: "我只是说了自己每个月花多少钱、现在还没有作品",
    memory: "林岸自己的处境，被写成了一条通用规律"
  }
};

const choiceEvaluationProfiles = {
  accurate: { tendencyDeltas: { truth: 2, caution: 1 }, wallNote: "先看纸上写了谁" },
  limited: { tendencyDeltas: { empathy: 1, caution: 1 }, wallNote: "知道多少，就写多少" },
  overcautious: { tendencyDeltas: { truth: -1, expression: -2, caution: 3 }, wallNote: "这张也不敢用了" },
  misleading: { tendencyDeltas: { truth: -3, expression: 2, caution: -1 }, wallNote: "标签盖住了署名" }
};

const careerDecisionProfiles = Object.freeze({
  verify: Object.freeze({ route: "verifier", tendencies: Object.freeze({ truth: 2, caution: 1 }) }),
  listen: Object.freeze({ route: "listener", tendencies: Object.freeze({ empathy: 2, caution: 1 }) }),
  move: Object.freeze({ route: "initiator", tendencies: Object.freeze({ expression: 2, truth: 1 }) })
});

const careerDecisionSets = {
  "market+success": [
    { id: "verify", title: "先算清他的钱能撑多久", detail: "再查他所在城市有哪些岗位、还缺什么作品，算完再谈什么时候辞职。" },
    { id: "listen", title: "先提醒他，别人成功不等于他也准备好了", detail: "那位答主有作品和一年生活费，林岸现在的条件不一样。" },
    { id: "move", title: "先挑几个真实岗位试着投", detail: "照着本地招聘要求补一小段作品，看看公司会怎么回。" }
  ],
  "failure+market": [
    { id: "verify", title: "先算清三个月到底够做什么", detail: "把房租、吃饭、离职补偿和本地岗位要求都列出来。" },
    { id: "listen", title: "先别拿别人的失败吓他", detail: "那个人的行业和处境都不一样，先听林岸说说自己为什么撑不下去。" },
    { id: "move", title: "先做出一个作品，再决定辞不辞", detail: "完成一件能投出去的作品，再找几个人聊过真实情况，然后定日期。" }
  ],
  "context+market": [
    { id: "verify", title: "先把他每月要花的钱算明白", detail: "结合他所在城市的岗位要求，看三个月究竟够不够准备。" },
    { id: "listen", title: "先问问他是不是已经撑不住了", detail: "不用今晚决定辞不辞，先听他把现在最累的地方说完。" },
    { id: "move", title: "先用一周试试转行要做的事", detail: "看几个岗位、问问从业者，再做一小段作品，看看自己能不能继续。" }
  ],
  "failure+success": [
    { id: "verify", title: "先看看两个人为什么一个成了、一个没成", detail: "把他们的存款、作品、家里能不能帮忙和目标岗位放在一起看。" },
    { id: "listen", title: "先告诉他，这两个结果都不能直接套在他身上", detail: "成功的不能催他辞，失败的也不能逼他留下。" },
    { id: "move", title: "先在不辞职的情况下开始准备", detail: "给自己留出固定时间学东西、做作品，再决定要不要裸辞。" }
  ],
  "context+success": [
    { id: "verify", title: "先看看他离那位成功答主还差什么", detail: "对照作品、准备时间和能撑多久的生活费，别只看最后辞职成功。" },
    { id: "listen", title: "先问清他为什么这么想离开", detail: "他已经难受很久了，先听他说完，也别拿别人的勇气替他做决定。" },
    { id: "move", title: "先做一个能拿去投的作品", detail: "从最短的小项目开始，做完以后再看自己是不是真的想转行。" }
  ],
  "context+failure": [
    { id: "verify", title: "先算算他的存款具体能撑到什么时候", detail: "列出每月开支，再看目标岗位还缺哪些能力。" },
    { id: "listen", title: "先别用那个人的失败劝他留下", detail: "先听他说为什么累，等他说完，再讨论辞职的风险和退路。" },
    { id: "move", title: "先选一种没那么冒险的试法", detail: "试投、问内部转岗，或者先请几天假，做一件再看，不用只在硬撑和裸辞里选。" }
  ]
};

const careerFollowups = {
  verifier: {
    text: "我又算了一遍。扣掉房租和吃饭，三个月其实也就十周。然后我看了十五个本地岗位，发现自己还缺一个能拿得出手的项目。我先没提离职。至少这回，我知道自己到底在等什么了。",
    memory: "林岸算完账，把离职先往后放了放。桌上多了一件还没做完的作品。",
    event: `<strong>伙伴把账单和职位要求摆在一起，想了想，没画箭头。</strong><span class="companion-line">“数字也没替他选。只是没那么吓人了。”</span>`, wallNote: "先算一遍"
  },
  listener: {
    text: "看到你们先问我是不是已经累坏了，我在公司厕所坐了好一会儿。后来跟主管请了三天假，也第一次把这事告诉朋友。我还没决定走不走，但至少不用今晚就把一辈子想完。",
    memory: "林岸没有立刻辞职。他先给自己请了三天假。",
    event: `<strong>伙伴没再挪材料，只把“怕再拖一年”那句话留在桌上。</strong><span class="companion-line">“他好像真的很累。”</span>`, wallNote: "先听他说完"
  },
  initiator: {
    text: "我挑了十个岗位，周末做了个很小的项目，也投了三份。一封拒信，一封让我补作品，还有一封没回。我还没辞，先给自己六周。到时候拿着真的结果再想。",
    memory: "林岸收到了一封拒信，也第一次收到让他补作品的回复。",
    event: `<strong>伙伴把三封投递收在一起，连拒信也没有扔。</strong><span class="companion-line">“一封拒信，一封让我补作品……这回至少不是自己瞎猜了。”</span>`, wallNote: "先试一次"
  }
};

const hospitalPermissionCopies = {
  source: {
    question: "“下次再碰到这种标签，我能先说一句‘不对’吗？”",
    allowLabel: "可以，先圈出来", askLabel: "先叫我，一起核对",
    allowResponse: "伙伴把铅笔移到材料最上方。下次，伙伴会先圈出对不上的地方。",
    askResponse: "伙伴把铅笔留在两张材料中间。下次，伙伴会先等你过来。",
    allowWall: "先圈出冲突", askWall: "先叫我一起看",
    allowGrowth: "伙伴会先圈出对不上的地方", askGrowth: "伙伴会先停下，等你一起看",
    allowAi: "好。下次我先说出来，再把纸留给你看。",
    askAi: "好。下次我先不动，叫你过来一起看。"
  },
  checklist: {
    question: "“下次我先把能确定的和还要问的分开写，行吗？”",
    allowLabel: "可以，先分开写", askLabel: "先叫我，一起整理",
    allowResponse: "伙伴把纸分成“确定的”和“还要问的”两栏。",
    askResponse: "伙伴把空白清单留在桌边，等下次和你一起整理。",
    allowWall: "确定的 / 还要问的", askWall: "一起整理清单",
    allowGrowth: "伙伴会先把两栏分开", askGrowth: "伙伴会先等你一起整理",
    allowAi: "好。能确定的我先写，没把握的留空。",
    askAi: "好。下次我先留着空格，等你来。"
  },
  clarify: {
    question: "“下次还缺学校、城市这些事，我能先问清楚吗？”",
    allowLabel: "可以，先问清条件", askLabel: "先叫我，一起问",
    allowResponse: "伙伴在学校、城市和目标医院旁各留了一个空格。",
    askResponse: "伙伴把三个空格留在桌边，等下次和你一起问。",
    allowWall: "先问清条件", askWall: "一起问清楚",
    allowGrowth: "伙伴会先圈出缺少的条件", askGrowth: "伙伴会先停下，等你一起问",
    allowAi: "好。下次缺什么，我先问一句。",
    askAi: "好。下次我先等等，我们一起问。"
  },
  support: {
    question: "“下次我先帮他把话问出口，没弄清的流程先空着，行吗？”",
    allowLabel: "可以，分开写", askLabel: "先和我一起写",
    allowResponse: "伙伴把手机备忘录放在流程图旁边，中间留了一块空白。",
    askResponse: "伙伴把备忘录留在桌边，等下次和你一起写。",
    allowWall: "办法留下 / 流程空着", askWall: "一起写下来",
    allowGrowth: "伙伴会把办法和流程分开", askGrowth: "伙伴会先等你一起写",
    allowAi: "好。能帮上的先写，没弄清的先空着。",
    askAi: "好。下次我先不填，等你一起写。"
  },
  verify: {
    question: "“下次找不到今天还能用的说法，我先提醒你，行吗？”",
    allowLabel: "可以，先提醒", askLabel: "先叫我，一起核对",
    allowResponse: "伙伴在找不到新说法的地方画了一个问号。",
    askResponse: "伙伴把问号留在桌边，等下次和你一起核对。",
    allowWall: "这里还要核对", askWall: "一起核对",
    allowGrowth: "找不到新的，伙伴会先说一声", askGrowth: "伙伴会先等你一起找",
    allowAi: "好。下次找不到新的，我先跟你说。",
    askAi: "好。下次我先停下，等你一起找。"
  }
};

const accountabilityChoices = {
  admit: {
    title: "承认具体错在哪里，公开更正",
    detail: "按这次真正发生的错误改写，不悄悄覆盖旧回答。",
    reply: (incident) => `这次是我们弄错了，${incident.admission}，我现在就改，也会把更正留在回答开头`,
    reaction: (incident) => incident.admitReaction,
    result: (incident) => `你公开更正了“${incident.shortLabel}”。悠一仍然不舒服，但愿意重新看修改后的版本。`,
    memory: (incident) => `你在原回答顶部更正了“${incident.shortLabel}”，旧内容没有被悄悄擦掉。`,
    partner: () => "他还在等我们改，先把页面上那句处理掉吧",
    nextIntro: () => "新问题来了，上次那条更正还在，我这回想早点看看哪里容易弄错",
    behaviorAllow: () => "上次留下更正以后，伙伴这次先指出那位答主有作品和一年生活费，林岸没有",
    behaviorAsk: () => "上次留下更正以后，伙伴这次叫你一起核对那位答主的作品和生活费",
    wall: "错了，就留下更正",
    tendencyDeltas: { truth: 2, empathy: 1 }
  },
  explain: {
    title: "先解释当时怎么想的",
    detail: "承认判断出了问题，但先解释这一次为什么会弄错。",
    reply: (incident) => `当时我们${incident.explanation}，这事确实是我们弄错了`,
    reaction: (incident) => incident.explainReaction,
    result: (incident) => `你解释了“${incident.shortLabel}”为什么发生，却没有立刻改掉原文。悠一仍在等更正。`,
    memory: (incident) => `你解释了“${incident.shortLabel}”，原回答里的错误却仍然留着。`,
    partner: () => "我们说了半天怎么弄错的，那句话还挂在上面",
    nextIntro: () => "新问题来了，上次那句话最后也没改，我有点在意",
    behaviorAllow: () => "上次只解释却没改；伙伴这次看到高赞经历时也没马上提醒准备条件不同",
    behaviorAsk: () => "上次只解释却没改；伙伴这次按约定叫你一起核对高赞经历",
    wall: "解释不是更正",
    tendencyDeltas: { expression: 1, truth: -1 }
  },
  blame: {
    title: "说是伙伴判断错了",
    detail: "把这次判断或使用材料的错误归到伙伴身上。",
    reply: (incident) => `伙伴当时${incident.blameDescription}，我没有再核一遍就发了`,
    reaction: () => "可这条回答挂的是你们两个的名字，你现在让我去找它吗？",
    result: (incident) => `你把“${incident.shortLabel}”推给了伙伴。悠一更不信任你们，伙伴也沉默了。`,
    memory: (incident) => `你把“${incident.shortLabel}”归给了伙伴；共同署名仍留在原回答下面。`,
    partner: () => "……你刚才把这件事都推给我了",
    nextIntro: () => "新问题来了，上次你说是我弄错的，这回我先不替你判断了",
    behaviorAllow: () => "上次你把错推给了伙伴；这次伙伴没有主动提醒高赞经历的准备条件",
    behaviorAsk: () => "上次你把错推给了伙伴；这次伙伴只按约定叫你一起看",
    wall: "最后是谁按下发送",
    tendencyDeltas: { truth: -2, empathy: -2, expression: 1 }
  },
  ignore: {
    title: "先不回复",
    detail: "关掉消息，不作回应。错误内容仍公开留在回答里。",
    reply: () => "（你关掉了消息，没有回应悠一。）",
    reaction: (incident) => incident.ignoreReaction,
    result: (incident) => `你没有回应悠一。“${incident.shortLabel}”还留在回答里；他只好自己留言提醒其他人。`,
    memory: (incident) => `悠一关于“${incident.shortLabel}”的消息没有得到回应；他只好自己在共读回答下面留下公开纠正。`,
    partner: () => "他等了一会儿，最后还是自己去评论里解释了",
    nextIntro: () => "新问题来了，悠一那边后来一直没等到我们的回复，我先等你看",
    behaviorAllow: () => "上次悠一只能自己解释；这次伙伴没有主动提醒第二份回答哪里可疑",
    behaviorAsk: () => "上次悠一只能自己解释；这次伙伴先叫你一起看第二份回答",
    wall: "他只好自己纠正",
    tendencyDeltas: { empathy: -2, caution: -1 }
  }
};

const publicVoices = {
  jiang: { name: "江声", avatar: "江", meta: "刚刚" },
  tangyuan: { name: "米酒汤圆", avatar: "米", meta: "刚刚" },
  rain: { name: "等雨停", avatar: "雨", meta: "1 分钟前" },
  yui: { name: "悠一", avatar: "悠", meta: "提问者 · 刚刚" },
  lin: { name: "林岸", avatar: "林", meta: "提问者 · 刚刚" },
  you: { name: "共读答主 · 你", avatar: "你", meta: "答主 · 刚刚" }
};

const accountabilityAftermathChoices = {
  admit: {
    prompt: "更正准备怎么留？",
    options: {
      pin: {
        title: "改正文，也把更正留在开头",
        detail: "让看过旧内容的人知道哪里变了。",
        reply: () => "我现在改，开头也会写清楚刚才哪句弄错了，免得有人只看到旧的",
        closing: () => ({ voice: "yui", text: "好，我等你们改完再看" }),
        result: (incident) => `你改掉了“${incident.shortLabel}”，也把修改时间和原因留在回答开头。`,
        memory: (incident) => `你把“${incident.shortLabel}”改掉以后，在回答开头留下了修改时间和原因。`,
        partner: () => "他还在等，我们先把开头那条更正写好",
        nextIntro: () => "新问题来了，上次那条更正还留在开头，我这回想早点看看哪里容易弄错",
        behaviorAllow: () => "上次留下完整更正以后，伙伴这次先指出那位答主有作品和一年生活费，林岸没有",
        behaviorAsk: () => "上次留下完整更正以后，伙伴这次叫你一起核对那位答主的作品和生活费",
        wall: "改了，也告诉后来的人",
        repairState: "full",
        tendencyDeltas: { truth: 1, caution: 1 }
      },
      quiet: {
        title: "只把正文改掉",
        detail: "页面会变化，但不会留下修改说明。",
        reply: () => "（你改了正文，没有在开头说明刚才改过什么）",
        closing: () => ({ voice: "jiang", text: "原回答变了，可刚才看过的人未必知道" }),
        result: (incident) => `你改掉了“${incident.shortLabel}”，看过旧内容的人没有收到提醒。`,
        memory: (incident) => `“${incident.shortLabel}”被直接改掉，回答里没有留下修改说明。`,
        partner: () => "正文改了，可刚才看过的人还不知道",
        nextIntro: () => "新问题来了，上次我们改了正文，可看过旧内容的人没有收到提醒",
        behaviorAllow: () => "上次正文被直接改掉；伙伴这次会先提醒你材料条件不同，但没有主动留下记录",
        behaviorAsk: () => "上次正文被直接改掉；伙伴这次叫你一起核对，也等你决定要不要留下记录",
        wall: "改过什么，没人看见",
        repairState: "quiet",
        tendencyDeltas: { caution: -1 }
      }
    }
  },
  explain: {
    prompt: "原回答还没改，现在呢？",
    options: {
      repair: {
        title: "先改原回答，再回来解释",
        detail: "先改掉会误导人的内容，改完再说当时是怎么判断的。",
        reply: () => "行，我先把那张图删了，照着图写的那几段也一起改掉，改完再跟你说",
        closing: () => ({ voice: "yui", text: "行，改完我再看" }),
        result: (incident) => `你解释以后又改掉了“${incident.shortLabel}”，悠一已经多等了一轮。`,
        memory: (incident) => `你先解释，后来还是改掉了“${incident.shortLabel}”，这次迟了一轮。`,
        partner: () => "总算改掉了，就是让他多等了一会儿",
        nextIntro: () => "新问题来了，上次我们解释了很久才动手，这回我想早点提醒你",
        behaviorAllow: () => "上次晚了一轮才改；伙伴这次先把作品和生活费的差别说了出来",
        behaviorAsk: () => "上次晚了一轮才改；伙伴这次先叫你一起核对作品和生活费",
        wall: "解释完，也要动手",
        repairState: "late",
        tendencyDeltas: { truth: 2, empathy: 1 }
      },
      wait: {
        title: "先等等，看还有没有人受影响",
        detail: "原回答暂时不动。",
        reply: () => "我想先看看还有没有其他人遇到同样的问题",
        closing: () => ({ voice: "yui", text: "可现在看到那句话的人还会当真" }),
        result: (incident) => `你继续等待，“${incident.shortLabel}”仍留在原回答里。`,
        memory: (incident) => `你解释以后继续等待，“${incident.shortLabel}”没有被改掉。`,
        partner: () => "我们还在等，可页面上的人不会一起等",
        nextIntro: () => "新问题来了，上次我们一直等着看影响有多大，那句话最后也没改",
        behaviorAllow: () => "上次解释以后没有修改；伙伴这次看见高赞经历时也没马上提醒条件不同",
        behaviorAsk: () => "上次解释以后没有修改；伙伴这次只叫你一起看，没有先下判断",
        wall: "页面不会等我们",
        repairState: "none",
        tendencyDeltas: { empathy: -1, caution: -1 }
      }
    }
  },
  blame: {
    prompt: "伙伴没有说话，你准备怎么办？",
    options: {
      takeBack: {
        title: "把话收回来，自己改",
        detail: "承认共同署名，也承认刚才推了责任。",
        reply: () => "等一下，这条是我们一起发的，我来改，刚才把问题都推给伙伴也不对",
        closing: () => ({ voice: "yui", text: "那你先改吧" }),
        result: (incident) => `你收回了推责的话，也改掉了“${incident.shortLabel}”，伙伴仍记得刚才那一刻。`,
        memory: (incident) => `你先把“${incident.shortLabel}”推给伙伴，后来收回那句话并改了原回答。`,
        partner: () => "我听见了，先把原回答改掉吧",
        nextIntro: () => "新问题来了，上次你后来把话收回去了，可我还是会想起前面那句",
        behaviorAllow: () => "上次你收回了推责的话；伙伴这次提醒了作品和生活费的差别，但语气很轻",
        behaviorAsk: () => "上次你收回了推责的话；伙伴这次先叫你一起看，没有独自下判断",
        wall: "一起发的，一起改",
        repairState: "late",
        tendencyDeltas: { truth: 1, empathy: 1 }
      },
      expose: {
        title: "让伙伴把判断过程贴出来",
        detail: "继续把公开解释交给伙伴。",
        reply: () => "我会让伙伴把当时怎么判断的都贴出来",
        closing: () => ({ voice: "yui", text: "我问的是你们改不改" }),
        result: (incident) => `你继续让伙伴解释，“${incident.shortLabel}”没有被改掉。`,
        memory: (incident) => `你让伙伴公开解释判断过程，“${incident.shortLabel}”仍留在原回答里。`,
        partner: () => "你还是把这条回复留给我解释了",
        nextIntro: () => "新问题来了，上次最后还是我出来解释，这回我不想先替你判断",
        behaviorAllow: () => "上次伙伴被推到公开页面解释；这次伙伴没有主动提醒高赞经历哪里可疑",
        behaviorAsk: () => "上次伙伴被推到公开页面解释；这次伙伴只按约定叫你一起看",
        wall: "伙伴没有替你署名",
        repairState: "none",
        tendencyDeltas: { truth: -1, empathy: -1 }
      }
    }
  },
  ignore: {
    prompt: "页面还开着，你还要回去吗？",
    options: {
      lateRepair: {
        title: "现在回去补一条更正",
        detail: "说明刚才没有及时回应，也修改原文。",
        reply: () => "刚才没有及时回你，抱歉，那句话我现在改，开头也会留一条更正",
        closing: () => ({ voice: "yui", text: "我已经先提醒大家了，你们把原回答改掉就行" }),
        result: (incident) => `悠一已经自己解释过，你后来还是改掉了“${incident.shortLabel}”。`,
        memory: (incident) => `悠一等不到回复，先自己解释；你后来补上了“${incident.shortLabel}”的更正。`,
        partner: () => "他已经自己解释过了，我们现在只能把原回答补上",
        nextIntro: () => "新问题来了，上次我们回得太晚，这回我想早点提醒你",
        behaviorAllow: () => "上次更正来得很晚；伙伴这次提醒了高赞经历的准备条件，但没有替你做决定",
        behaviorAsk: () => "上次更正来得很晚；伙伴这次先叫你一起看高赞经历的准备条件",
        wall: "晚了，也要补上",
        repairState: "late",
        tendencyDeltas: { truth: 1, empathy: 1 }
      },
      leave: {
        title: "还是不回复",
        detail: "关掉页面，原回答继续留着。",
        reply: () => "（你关掉页面，原回答没有修改）",
        closing: () => ({ voice: "jiang", text: "原回答那句还在，后面来的人可能看不到题主这条" }),
        result: (incident) => `你继续沉默，“${incident.shortLabel}”仍留在原回答里。`,
        memory: (incident) => `悠一自己解释以后，你仍没有修改“${incident.shortLabel}”。`,
        partner: () => "他自己解释了，原回答还在",
        nextIntro: () => "新问题来了，上次那条回答一直没改，我先等你看",
        behaviorAllow: () => "上次原回答一直没改；这次伙伴没有主动提醒第二份回答哪里可疑",
        behaviorAsk: () => "上次原回答一直没改；这次伙伴先叫你一起看第二份回答",
        wall: "他解释了，原文还在",
        repairState: "none",
        tendencyDeltas: { empathy: -2, caution: -1 }
      }
    }
  }
};

const careerAccountabilityChoices = {
  repair: {
    title: "把错句划掉，留下更正",
    detail: "逐句说明哪份材料被怎么用错，再按原来源重写。",
    reply: (incident) => `你说得对，${incident.sourceNames}被我们用错了，我现在把那几句划掉，按原来源重写，开头也会留下更正`,
    reaction: (incident) => ({
      verifier: "把表里没有出处的数字也删掉吧，改完把链接发我，我再看一遍",
      listener: "先把后面那些没依据的话改掉吧，我现在不想再把自己的情况讲一遍了",
      initiator: "三份投递为什么会选错也写清楚吧，别让后来的人再往这个方向试了"
    })[incident.route],
    result: (incident) => ({
      verifier: "你公开更正了表格和材料出处。林岸愿意重新核对一次。",
      listener: "你公开更正了后半段判断。林岸没有继续倾诉，但没有关闭修改后的页面。",
      initiator: "你公开更正了试投依据。林岸保留不满，也保留了修改后的链接。"
    })[incident.route],
    memory: (incident) => ({
      verifier: "没有出处的数字被划掉，修改后的核对表重新放回桌上。",
      listener: "回信后半段留下更正，林岸没有被要求再解释一次自己的疲惫。",
      initiator: "三份无效投递旁留下更正，错误方向没有被包装成有效尝试。"
    })[incident.route],
    partner: (incident) => ({
      verifier: "这次我们先删掉没有出处的数字，再重新算。",
      listener: "他不用为了证明我们错了，再把自己的难受讲一遍。",
      initiator: "那个周末已经补不回来了，先把方向为什么错写清楚吧。"
    })[incident.route],
    wall: "先改，再解释",
    tendencyDeltas: { truth: 2, empathy: 1 }
  },
  askImpact: {
    title: "先问哪句话已经影响了他",
    detail: "先停用受影响的部分，听林岸说清实际损失，再继续核对。",
    reply: () => "我们先不解释了，哪一句已经影响到你的安排，你告诉我，我先把那部分撤下来再核对",
    reaction: (incident) => ({
      verifier: "那张表让我多花了两个晚上重查，先把没有出处的数字划掉吧，别让别人接着算",
      listener: "我刚愿意继续说，结果发现后半段根本不能信，先把那几句撤下来吧",
      initiator: "我浪费了一个周末，还投错了三份，先把那个方向撤掉吧，别再让别人这么试了"
    })[incident.route],
    result: (incident) => ({
      verifier: "你确认林岸损失了两个晚上。一组错误数字被暂停，整张表仍待重算。",
      listener: "你听清了信任断在回信后半段。错误判断被暂停，完整更正仍未完成。",
      initiator: "你确认林岸浪费了一次周末试投。错误方向被撤下，三份反馈无法追回。"
    })[incident.route],
    memory: (incident) => ({
      verifier: "林岸在没算完的表格旁写下“两个晚上”，其余数字仍待核对。",
      listener: "林岸把回信折在前后两段之间：前半段被听见，后半段失去信任。",
      initiator: "三份无效投递旁写着“一个周末”，错误方向先被撤了下来。"
    })[incident.route],
    partner: (incident) => ({
      verifier: "他为了那行数字多花了两个晚上，可表还没改完",
      listener: "这次受影响的是他刚交出来的信任。可更正还没写完。",
      initiator: "三份投递和一个周末都是真的。我们先把错误方向撤了。"
    })[incident.route],
    wall: "先问哪里受影响",
    tendencyDeltas: { empathy: 2, caution: 1 }
  },
  defend: {
    title: "强调这本来就只是建议",
    detail: "提醒林岸最终决定仍由他自己承担，不修改原回答。",
    reply: () => "我们给的只是建议，没法保证结果，最后还是要你自己判断",
    reaction: (incident) => ({
      verifier: "可数字是你们写进表里的，算了，我自己重算，也不会再用这页了",
      listener: "那你们前面为什么还要问我那些，算了，我不想再说了",
      initiator: "岗位方向是你们给的，现在又说结果该我承担？我不会再按这页试了"
    })[incident.route],
    result: (incident) => ({
      verifier: "你强调这只是建议。林岸带走了自己的表，不再使用你们的数字。",
      listener: "你强调这只是建议。林岸结束对话，也收回了刚说出的处境。",
      initiator: "你强调这只是建议。林岸停止试投，不再相信你们提供的行动方向。"
    })[incident.route],
    memory: (incident) => ({
      verifier: "那句“只是建议”留在空掉的核对表旁，林岸自己重新算。",
      listener: "林岸没有再回复；刚被说出的疲惫从房间里收了回去。",
      initiator: "三份无效投递留在桌边，下面压着一句“最后由你自己判断”。"
    })[incident.route],
    partner: (incident) => ({
      verifier: "数字明明是我们写进表里的，最后却让他自己重算……那我们为什么还要一起署名？",
      listener: "他刚把自己有多累说出来，我们就拿一句“只是建议”挡回去，他以后还会跟我们说吗？",
      initiator: "方向是我们给的，最后那个周末却全让他自己承担了。"
    })[incident.route],
    wall: "建议不是免责",
    tendencyDeltas: { truth: -2, empathy: -2, expression: 1 }
  },
  erase: {
    title: "直接删掉原回答",
    detail: "让错误内容立刻消失，但不留下删除原因与修改记录。",
    reply: () => "（你删掉了原回答，没有留下修改说明。）",
    reaction: (incident) => ({
      verifier: "我还留着那张表，页面没了，可里面哪些数字不能用，还是没人说",
      listener: "我有截图，你们删掉以后，我连自己刚说过的话为什么被误解都看不见了",
      initiator: "投递记录还在我这里，页面没了，可那个错误方向为什么出现，还是没人说明"
    })[incident.route],
    result: (incident) => ({
      verifier: "回答和表格被删掉，林岸仍保留无法核验的副本。",
      listener: "回答被删掉，林岸保留截图，也停止继续说自己的处境。",
      initiator: "回答被删掉，三份投递记录仍然存在，错误方向没有得到解释。"
    })[incident.route],
    memory: (incident) => ({
      verifier: "页面被删去，林岸手里仍留着一张没有出处的表。",
      listener: "页面被删去，林岸的截图停在他刚愿意开口的那一段。",
      initiator: "页面被删去，三份无效投递没有得到说明。"
    })[incident.route],
    partner: (incident) => ({
      verifier: "页面空了，可那张表为什么算不下去，我还是没学会。",
      listener: "页面空了，他说过的话也像被一起删掉了。",
      initiator: "页面空了，投出去的三份却回不来。"
    })[incident.route],
    wall: "删掉，不等于没发生",
    tendencyDeltas: { caution: 1, truth: -2, empathy: -1 }
  }
};

const finalConversationChoices = {
  together: {
    title: "会啊，下次我们还是一起看",
    detail: "你们继续共同署名，也一起决定最后怎么回",
    playerReply: "会啊，下次我们还是一起看，哪里拿不准就摊开来说",
    partnerReply: "好啊，下次我先把哪里拿不准说出来，最后怎么回，我们一起定",
    endingTitle: "下一封信，还会由你们一起打开",
    endingBody: "你把共同署名继续留了下来。以后伙伴会先说出它看见的疑点，最后一句仍由你们一起决定。",
    memory: "你们答应继续一起看材料，也一起承担发出去的每一句话。",
    boundary: "伙伴可以先说出疑点，最后的回复由你们共同决定。",
    wall: "下一封，一起打开",
    tendencyDeltas: { truth: 1, empathy: 1, expression: 1, caution: 0 }
  },
  ask: {
    title: "会，不过拿不准的时候先叫我",
    detail: "伙伴可以先整理，关键判断要等你回来",
    playerReply: "会，不过拿不准的时候先叫我，别替别人把话说死",
    partnerReply: "好，我可以先整理，碰到要替别人下结论的地方，我就回来叫你",
    endingTitle: "伙伴学会了在替人判断前停一下",
    endingBody: "你给伙伴留下了一条清楚的约定。它可以先整理材料，碰到要替别人作决定的地方，会停下来等你。",
    memory: "伙伴可以先整理；碰到会改变别人选择的判断，它要先回来叫你。",
    boundary: "整理可以先做，替别人下结论以前必须停下来。",
    wall: "拿不准，就回来叫我",
    tendencyDeltas: { truth: 1, empathy: 0, expression: 0, caution: 2 }
  },
  reread: {
    title: "先歇一会儿，把这两次理清楚再说",
    detail: "暂时不接新问题，先把做对和弄错的地方重新看完",
    playerReply: "先歇一会儿吧，把这两次理清楚以后，我们再看下一封",
    partnerReply: "好，这两封先别收进柜子里，我们把哪里做对了、哪里弄错了再看一遍",
    endingTitle: "今晚先停在这两封回信",
    endingBody: "你们没有急着等下一位提问者。两次回复里做对的、弄错的和后来改过的地方，都继续留在房间里。",
    memory: "你们暂时没有接下一题，先回头整理这两次共同回复留下的痕迹。",
    boundary: "接下一封信以前，先把这两次没有理清的地方看完。",
    wall: "先把今晚理清楚",
    tendencyDeltas: { truth: 1, empathy: 1, expression: 0, caution: 1 }
  }
};

const hiddenTraitKeys = Object.freeze(["truth", "empathy", "expression", "caution"]);
const hiddenTraitThresholds = Object.freeze({ positive: 6, negative: -2 });
const permissionTendencies = Object.freeze({
  allow: Object.freeze({ truth: 1, expression: 1 }),
  ask: Object.freeze({ empathy: 1, caution: 2 })
});

const hiddenTraitEventCatalog = Object.freeze({
  "career-entry": Object.freeze({
    truth: Object.freeze({
      positive: Object.freeze({ dialogue: "我先翻到署名和日期，这回赞数再高也不能直接算答案。", wall: "先看是谁写的" }),
      negative: Object.freeze({ dialogue: "我看见那篇高赞回答，差点又想直接照着写，翻到署名才停下来。", wall: "差点只看了赞数" })
    }),
    empathy: Object.freeze({
      positive: Object.freeze({ dialogue: "林岸说下班以后什么都不想做，我先把这句抄下来了，材料再多也不能把它盖过去。", wall: "先看他现在怎么了" }),
      negative: Object.freeze({ dialogue: "我刚才只顾着翻材料，差点忘了林岸已经累得什么都不想做。", wall: "别把人落在纸后面" })
    }),
    expression: Object.freeze({
      positive: Object.freeze({ dialogue: "我先把‘现在能做什么’空出一行，找到真能试的办法再填。", wall: "先找能做的一步" }),
      negative: Object.freeze({ dialogue: "我把问题分了好几栏，可一时还不知道哪一栏真能帮到他。", wall: "还没落到行动" })
    }),
    caution: Object.freeze({
      positive: Object.freeze({ dialogue: "这几份回答都说得挺满，我先在没对上的地方留个问号。", wall: "没对上，先别填" }),
      negative: Object.freeze({ dialogue: "那篇经历写得太顺了，我刚才差点把别人的结果直接接到林岸身上。", wall: "别急着替他算" })
    })
  }),
  ending: Object.freeze({
    truth: Object.freeze({
      positive: Object.freeze({ dialogue: "这两次下来，我已经会先找作者和日期了。", growth: "伙伴遇到说得很完整的材料，会先找它的来源", ending: "它已经养成了先看作者和日期的习惯。" }),
      negative: Object.freeze({ dialogue: "我还是会被写得很完整的答案带着走，这件事得留在札记里。", growth: "伙伴仍容易相信写得完整的答案", ending: "它仍会被完整得像答案的材料带着走。" })
    }),
    empathy: Object.freeze({
      positive: Object.freeze({ dialogue: "我现在会先看提问的人为什么来问，再看材料能不能接得上。", growth: "伙伴会先记下提问者真正卡住的地方", ending: "它学会了先看提问的人正处在什么地方。" }),
      negative: Object.freeze({ dialogue: "我有时候还是会顾着把答案写完，没先看人已经撑到哪儿了。", growth: "伙伴有时仍会让材料盖过提问者的处境", ending: "它有时仍会顾着整理材料，忘了先看提问的人。" })
    }),
    expression: Object.freeze({
      positive: Object.freeze({ dialogue: "我现在会把一大团问题先拆成一件能做的事。", growth: "伙伴会先从问题里找出一件现在能做的事", ending: "它学会了把模糊的问题落到下一步行动上。" }),
      negative: Object.freeze({ dialogue: "我还是容易把问题理得很全，可最后没给出能做的一步。", growth: "伙伴仍可能把问题理清，却没有留下下一步", ending: "它仍需要学习怎样把判断变成真正能做的事。" })
    }),
    caution: Object.freeze({
      positive: Object.freeze({ dialogue: "我现在会在没查清的地方停一下，不再顺手把空白补满。", growth: "伙伴会在没有依据的地方停下来", ending: "它学会了让没有依据的地方暂时空着。" }),
      negative: Object.freeze({ dialogue: "我还是会在空白处替别人补答案，下次得早点停。", growth: "伙伴仍可能用猜测补上没有答案的地方", ending: "它仍可能替别人补上没有依据的答案。" })
    })
  })
});

const state = {
  started: false, chapterId: "hospital", step: "research", attention: 2, selected: [], tags: {}, tagHistory: {}, inspected: new Set(),
  currentMaterial: null, decision: null, permission: null, companionName: "", tendencies: { truth: 0, empathy: 0, expression: 0, caution: 0 },
  currentTendencies: { truth: 0, empathy: 0, expression: 0, caution: 0 }, chapterOneSnapshot: null, chapterTwoSnapshot: null,
  outcome: null, locked: false, toastTimer: null, introTimer: null, followupTimer: null, interactionRevision: 0,
  notificationMode: null, pendingChapterAction: null, chapterTwoPermissionResolved: false, autoFlaggedMaterialId: null, autoFlagCopy: "", route: null,
  accountabilityChoice: null, accountabilityAftermathChoice: null, accountabilityResolution: null, careerAccountabilityChoice: null, careerAccountabilityResolution: null, finalChoice: null,
  draftChoice: null, draftEvaluation: null, hospitalFollowupReplyChoice: null, hospitalFollowupClosingChoice: null, hospitalConversationResolution: null,
  memoryRecords: [], traitEvents: [],
  onboardingDismissed: false, computerMessageReady: false, browserUnlocked: false,
  companionEmotion: null, emotionTimer: null, doubtTextTimer: null, facilityTimer: null, transitAlertTimer: null, dialogueTimer: null, roomAftermathTimer: null, privateCompanionTimer: null, publicExchangeTimer: null, publicExchangeRevision: 0,
  roamTimer: null, walkTimer: null, environmentTimer: null, currentEnvironmentInteraction: null, ambientSpeechHistory: new Set(),
  roamIndex: 0, companionPosition: { x: 47.5, depth: 5.2, scale: 1 }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const elements = {
  desktop: $("#desktop"), bootOverlay: $("#bootOverlay"), startButton: $("#startButton"), continueButton: $("#continueButton"), saveHint: $("#saveHint"), chapterName: $("#chapterName"), addressBar: $("#addressBar"), systemClock: $("#systemClock"), taskbarTime: $("#taskbarTime"),
  onboardingGuide: $("#onboardingGuide"), onboardingStep: $("#onboardingStep"), onboardingTitle: $("#onboardingTitle"), onboardingText: $("#onboardingText"), onboardingAction: $("#onboardingAction"), onboardingDismiss: $("#onboardingDismiss"),
  questionKicker: $("#questionKicker"), questionTitle: $("#questionTitle"), questionBody: $("#questionBody"), askerNote: $("#askerNote"), questionStats: $("#questionStats"),
  researchEyebrow: $("#researchEyebrow"), researchTitle: $("#researchTitle"), researchInstruction: $("#researchInstruction"), trayEyebrow: $("#trayEyebrow"),
  materialList: $("#materialList"), attentionPips: $("#attentionPips"), attentionText: $("#attentionText"), selectedMaterials: $("#selectedMaterials"),
  dropZone: $("#dropZone"), emptyDrop: $("#emptyDrop"), trayCount: $("#trayCount"), synthesizeButton: $("#synthesizeButton"), roomScene: $("#roomScene"),
  aiCharacter: $("#aiCharacter"), aiDialogue: $("#aiDialogue"), aiSpeaker: $("#aiSpeaker"), aiText: $("#aiText"), wallNote: $("#wallNote"), shelfBook: $("#shelfBook"), materialModal: $("#materialModal"),
  modalType: $("#modalType"), modalTitle: $("#modalTitle"), modalLedger: $("#modalLedger"), modalBody: $("#modalBody"), modalCaution: $("#modalCaution"), modalSendAction: $("#modalSendAction"),
  responsePanel: $("#responsePanel"), decisionEyebrow: $("#decisionEyebrow"), decisionTitle: $("#decisionTitle"), decisionPrompt: $("#decisionPrompt"), aiSummary: $("#aiSummary"), decisionOptions: $("#decisionOptions"),
  draftWorkshop: $("#draftWorkshop"), draftWorkshopStatus: $("#draftWorkshopStatus"), draftWorkshopTitle: $("#draftWorkshopTitle"), draftThread: $("#draftThread"), draftOptions: $("#draftOptions"), draftPreview: $("#draftPreview"), draftPreviewText: $("#draftPreviewText"), sendDraftAction: $("#sendDraftAction"),
  followupNotification: $("#followupNotification"), notificationPixel: $("#notificationPixel"), notificationTitle: $("#notificationTitle"), notificationDetail: $("#notificationDetail"),
  followupPanel: $("#followupPanel"), followupEyebrow: $("#followupEyebrow"), followupTitle: $("#followupTitle"), followupResult: $("#followupResult"), followupAvatar: $("#followupAvatar"), followupAuthor: $("#followupAuthor"), followupText: $("#followupText"), followupContinue: $("#followupContinue"),
  publicDiscussion: $("#publicDiscussion"), publicCommentCount: $("#publicCommentCount"), publicComments: $("#publicComments"), privateCompanionNote: $("#privateCompanionNote"), privateCompanionText: $("#privateCompanionText"), publicExchangeStatus: $("#publicExchangeStatus"),
  accountabilityPanel: $("#accountabilityPanel"), accountabilityStatus: $("#accountabilityStatus"), accountabilityTitle: $("#accountabilityTitle"), accountabilityOptions: $("#accountabilityOptions"), accountabilityOutcome: $("#accountabilityOutcome"), accountabilityReplyLabel: $("#accountabilityReplyLabel"), accountabilityReply: $("#accountabilityReply"), accountabilityReactionLabel: $("#accountabilityReactionLabel"), accountabilityReaction: $("#accountabilityReaction"),
  roomDialogueActions: $("#roomDialogueActions"), permissionPrompt: $("#permissionPrompt"), permissionAllow: $("#permissionAllow"), permissionAsk: $("#permissionAsk"), memoryWindow: $("#memoryWindow"),
  growthTitle: $("#growthTitle"), growthList: $("#growthList"), principleCard: $("#principleCard"), progressSteps: $("#progressSteps"), toast: $("#toast"),
  confirmChapterReview: $("#confirmChapterReview"), companionNaming: $("#companionNaming"), companionNameInput: $("#companionNameInput"),
  confirmCompanionName: $("#confirmCompanionName"), skipCompanionName: $("#skipCompanionName"), companionNameHint: $("#companionNameHint"), finalConversation: $("#finalConversation"), finalChoiceList: $("#finalChoiceList"),
  materialTransitLayer: $("#materialTransitLayer"), roomReadingSeat: $("#roomReadingSeat"), roomMaterialStack: $("#roomMaterialStack"), autonomyFold: $("#autonomyFold"),
  roomComputer: $("#roomComputer"), roomComputerScreen: $("#roomComputerScreen"), roomComputerMessage: $("#roomComputerMessage"), endingOverlay: $("#endingOverlay"), endingCompanionLine: $("#endingCompanionLine"), endingTitle: $("#endingTitle"), endingBody: $("#endingBody"), endingMemoryToggle: $("#endingMemoryToggle"), endingArchive: $("#endingArchive"), endingStay: $("#endingStay"), endingRestart: $("#endingRestart")
};

function currentChapter() { return chapterDefinitions[state.chapterId]; }
function currentMaterials() { return currentChapter().materials; }
function getMaterial(materialId, chapterId = state.chapterId) { return chapterDefinitions[chapterId].materials.find((item) => item.id === materialId); }
function getTagLabel(tagId, chapterId = state.chapterId) { return chapterDefinitions[chapterId].tagOptions.find((item) => item.id === tagId)?.label || tagId; }

function markPlayerInteraction() {
  state.interactionRevision += 1;
  if (state.introTimer) {
    window.clearTimeout(state.introTimer);
    state.introTimer = null;
  }
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
}

function setOnboardingTarget(target = null) {
  elements.desktop.classList.remove("guide-research", "guide-room", "guide-synthesize");
  if (target) elements.desktop.classList.add(`guide-${target}`);
}

function updateOnboardingGuide() {
  const canGuide = state.started && state.browserUnlocked && !state.onboardingDismissed && state.chapterId === "hospital" && state.step === "research";
  if (!canGuide) {
    elements.onboardingGuide.hidden = true;
    setOnboardingTarget();
    return;
  }

  const allTagged = state.selected.length === state.attention && state.selected.every((id) => Boolean(state.tags[id]));
  let guide;
  if (state.selected.length === 0 && state.inspected.size === 0) {
    guide = { step: "第一次共读 · 1 / 3", title: "先打开一份材料", text: "别急着选，先看清是谁写的、哪天写的，以及它能不能回答悠一的问题。", action: "research", label: "去看材料" };
  } else if (state.selected.length === 0) {
    guide = { step: "第一次共读 · 1 / 3", title: "看过以后，再决定要不要递给伙伴", text: "材料展开页右下角有“递给共读伙伴”，不合适的话也可以回来换一份。", action: "research", label: "继续选材料" };
  } else if (state.selected.length === 1) {
    guide = { step: "第一次共读 · 1 / 3", title: "桌上有一份了，还要再选一份", text: "第二份不必和第一份说同一种话，来源不同，能帮到悠一的地方也可能不同。", action: "research", label: "再看一份" };
  } else if (!allTagged) {
    guide = { step: "第一次共读 · 2 / 3", title: "去共读房间，告诉伙伴这两份材料怎么用", text: "两张纸已经在桌上了，给它们分别贴上“官方信息”“个人经历”等标签。", action: "room", label: "去共读桌面" };
  } else {
    guide = { step: "第一次共读 · 3 / 3", title: "材料理清了，现在一起写回答", text: "接下来要决定先回应悠一哪件事，伙伴会和你一起改第一段草稿。", action: "synthesize", label: "整理回复" };
  }

  elements.onboardingStep.textContent = guide.step;
  elements.onboardingTitle.textContent = guide.title;
  elements.onboardingText.textContent = guide.text;
  elements.onboardingAction.dataset.action = guide.action;
  elements.onboardingAction.innerHTML = `${guide.label} <span>→</span>`;
  elements.onboardingGuide.hidden = false;
  setOnboardingTarget(guide.action);
}

function setBrowserLaunchAvailable(available) {
  $$('[data-focus="browserWindow"]').forEach((button) => {
    button.disabled = !available;
    button.classList.toggle("is-launch-locked", !available);
    button.setAttribute("aria-disabled", String(!available));
  });
  const taskButton = $('[data-window-task="browserWindow"]');
  if (taskButton) taskButton.textContent = available ? "知乎 · 调查材料" : "知乎 · 暂无新消息";
}

function receiveFirstQuestion() {
  if (!state.started || state.browserUnlocked || state.computerMessageReady) return;
  state.computerMessageReady = true;
  elements.roomComputer.classList.remove("is-awaiting-message");
  elements.roomComputer.classList.add("has-new-message");
  elements.roomComputerMessage.hidden = false;
  elements.roomComputer.setAttribute("aria-label", "电脑收到一条新提问，点击打开");
  const taskButton = $('[data-window-task="browserWindow"]');
  if (taskButton) taskButton.textContent = "知乎 · 1 条新消息";
  setAiText("哎，电脑刚响了一声，好像有人发了条新问题，你点开看看？");
  setCompanionEmotion("receive", 860);
}

function openFirstQuestionFromComputer() {
  state.browserUnlocked = true;
  state.computerMessageReady = false;
  elements.roomComputer.classList.remove("has-new-message", "is-awaiting-message");
  elements.roomComputer.classList.add("is-visited");
  elements.roomComputerMessage.hidden = true;
  elements.roomComputer.setAttribute("aria-label", "用房间电脑打开调查材料");
  setBrowserLaunchAvailable(true);
  elements.chapterName.textContent = currentChapter().archive;
  const roomWindow = getWindowElement("roomWindow");
  roomWindow.classList.remove("is-maximized");
  updateMaximizeControl(roomWindow);
  setAiText("看到了，叫悠一，他好像第一次自己去医院，你先读读他怎么说，我也一起看");
  focusWindow("browserWindow");
  updateOnboardingGuide();
  checkpoint(state.chapterId + "-research");
}

function handleOnboardingAction() {
  const action = elements.onboardingAction.dataset.action;
  if (action === "research") {
    focusWindow("browserWindow");
    $(".research-section").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    return;
  }
  if (action === "room") {
    focusWindow("roomWindow");
    setAiText("两张材料都在桌上了，先告诉我它们各自能说明什么吧");
    return;
  }
  if (action === "synthesize") openDecision();
}

function setClock(value) {
  elements.systemClock.textContent = value;
  elements.taskbarTime.textContent = value;
}

function revealBrowserPanel(panel) {
  panel.hidden = false;
  focusWindow("browserWindow");
  window.requestAnimationFrame(() => panel.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  }));
}

function hideRoomDialogueActions() {
  elements.roomDialogueActions.hidden = true;
  elements.permissionAllow.hidden = true;
  elements.permissionAsk.hidden = true;
  elements.confirmChapterReview.hidden = true;
  elements.companionNaming.hidden = true;
  elements.finalConversation.hidden = true;
  elements.aiDialogue.classList.remove("is-awaiting-choice");
  letDialogueRest();
}

function showDialogue() {
  window.clearTimeout(state.dialogueTimer);
  state.dialogueTimer = null;
  elements.aiDialogue.classList.remove("is-resting");
}

function letDialogueRest(delay = 7600) {
  window.clearTimeout(state.dialogueTimer);
  if (!state.started || !elements.roomDialogueActions.hidden) return;
  state.dialogueTimer = window.setTimeout(() => {
    elements.aiDialogue.classList.add("is-resting");
    state.dialogueTimer = null;
  }, delay);
}

function showPermissionActions(permissionCopy) {
  hideRoomDialogueActions();
  elements.permissionPrompt.textContent = permissionCopy.question;
  elements.permissionAllow.textContent = permissionCopy.allowLabel;
  elements.permissionAsk.textContent = permissionCopy.askLabel;
  elements.permissionAllow.hidden = false;
  elements.permissionAsk.hidden = false;
  elements.confirmChapterReview.hidden = true;
  elements.roomDialogueActions.hidden = false;
  elements.aiDialogue.classList.add("is-awaiting-choice");
  showDialogue();
}

function showChapterReviewAction(message = "这篇高赞经历的起点和林岸不一样。你说过遇到这种地方要先叫你。") {
  hideRoomDialogueActions();
  elements.permissionPrompt.textContent = message;
  elements.permissionAllow.hidden = true;
  elements.permissionAsk.hidden = true;
  elements.confirmChapterReview.hidden = false;
  elements.roomDialogueActions.hidden = false;
  elements.aiDialogue.classList.add("is-awaiting-choice");
  showDialogue();
}

function getCompanionDisplayName() {
  return state.companionName || "共读伙伴 00";
}

function updateCompanionIdentity() {
  const displayName = getCompanionDisplayName();
  elements.aiSpeaker.textContent = state.companionName ? `${displayName} / 共读伙伴 00` : displayName;
  elements.aiCharacter.dataset.baseLabel = `${displayName}，房间里的共读伙伴`;
  if (!state.currentEnvironmentInteraction) elements.aiCharacter.setAttribute("aria-label", elements.aiCharacter.dataset.baseLabel);
}

function showCompanionNaming() {
  hideRoomDialogueActions();
  elements.permissionPrompt.textContent = "那天的回信，还有你刚答应我的事，我都记下来了，“00”只是刚开始用的编号。";
  elements.companionNameInput.value = "";
  elements.companionNameHint.textContent = "这个称呼会留到后面的档案里。";
  elements.companionNaming.hidden = false;
  elements.roomDialogueActions.hidden = false;
  elements.aiDialogue.classList.add("is-awaiting-choice");
  showDialogue();
}

function finishChapterOneCoda(message) {
  state.step = "chapter-complete";
  hideRoomDialogueActions();
  setAiText(message);
  window.setTimeout(() => setNotification("archive", "+", "收到一份新档案", "档案 01 · 一条没有官方答案的路"), 720);
  checkpoint("hospital-complete");
}

function resolveCompanionName(keepNumber = false) {
  if (state.chapterId !== "hospital" || state.step !== "chapter-naming") return;
  const nextName = elements.companionNameInput.value.trim();
  if (!keepNumber && !nextName) {
    elements.companionNameHint.textContent = "还没写称呼，也可以继续用编号 00。";
    elements.companionNameInput.focus();
    return;
  }
  if (keepNumber) {
    finishChapterOneCoda("好，那我还是叫 00。");
    return;
  }
  state.companionName = nextName;
  updateCompanionIdentity();
  const nameRecord = document.createElement("li");
  const nameDot = document.createElement("span");
  nameDot.className = "growth-dot";
  nameRecord.append(nameDot, ` 札记封面写下了“${nextName}”`);
  elements.growthList.append(nameRecord);
  finishChapterOneCoda(`好，那以后你就叫我“${nextName}”吧。`);
}

function setAiText(message) {
  elements.aiText.textContent = message;
  showDialogue();
  elements.aiCharacter.classList.add("is-pulsing");
  window.setTimeout(() => elements.aiCharacter.classList.remove("is-pulsing"), 420);
  letDialogueRest();
}

function setWallNote(message) {
  elements.wallNote.textContent = message;
  const board = elements.wallNote.closest(".wall-note");
  board.classList.remove("is-empty");
  board.classList.remove("is-updating");
  void board.offsetWidth;
  board.classList.add("is-updating");
  window.setTimeout(() => board.classList.remove("is-updating"), 380);
}

function renderMemoryRecords() {
  if (!state.memoryRecords.length) return;
  elements.principleCard.classList.add("memory-ledger");
  elements.principleCard.innerHTML = state.memoryRecords.map((record) => `<article class="memory-record" data-memory-id="${record.id}"><span>${record.date}</span><p>${record.body}</p><small>${record.habit}</small>${record.boundary ? `<em>${record.boundary}</em>` : ""}</article>`).join("");
}

function recordMemory(record) {
  const index = state.memoryRecords.findIndex((item) => item.id === record.id);
  if (index >= 0) state.memoryRecords[index] = { ...state.memoryRecords[index], ...record };
  else state.memoryRecords.push(record);
  renderMemoryRecords();
}

const companionEmotionClasses = ["emotion-receive", "emotion-inspect", "emotion-doubt", "emotion-resolve", "emotion-permission-wait"];

function setCompanionEmotion(emotion, duration = 0) {
  window.clearTimeout(state.emotionTimer);
  state.emotionTimer = null;
  if (emotion) stopCompanionWalk();
  if (emotion !== "doubt") {
    window.clearTimeout(state.doubtTextTimer);
    state.doubtTextTimer = null;
  }
  companionEmotionClasses.forEach((className) => elements.aiCharacter.classList.remove(className));
  state.companionEmotion = emotion || null;
  elements.aiCharacter.dataset.emotion = emotion || "idle";
  if (!emotion) {
    scheduleCompanionRoam(9000);
    return;
  }
  elements.aiCharacter.classList.add(`emotion-${emotion}`);
  if (duration > 0) {
    state.emotionTimer = window.setTimeout(() => setCompanionEmotion(null), duration);
  }
}

const companionRoamTargets = [
  { x: 81, depth: 8, scale: 1.2, interaction: "bed" },
  { x: 23, depth: 15, scale: .82, interaction: "window" },
  { x: 38, depth: 15, scale: .82 },
  { x: 73, depth: 15, scale: .82, interaction: "computer" },
  { x: 59, depth: 6, scale: 1 },
  { x: 69, depth: 16, scale: .82, interaction: "board" },
  { x: 47.5, depth: 5.2, scale: 1 }
];

const companionEnvironmentInteractions = {
  bed: { duration: 9000, roomClass: "env-bed-active", label: "正坐在床边看手里的纸" },
  window: { duration: 5600, roomClass: "env-window-active", label: "正站在窗边看夜色" },
  computer: { duration: 6200, roomClass: "env-computer-active", label: "正在桌边核对材料" },
  board: { duration: 5200, roomClass: "env-board-active", label: "正在软木板前整理便签" }
};

const companionEnvironmentThoughts = {
  bed: {
    hospital: "拿近了才发现，右上角还有个日期。",
    career: "这张计划排得挺满的……林岸下班以后，还有力气做完吗？"
  },
  window: {
    hospital: "都这个点了，医院的咨询电话应该下班了吧。",
    career: "那栋楼还有好多灯，林岸会不会也还没下班。"
  },
  computer: {
    hospital: "每个回答都写得挺全，可我怎么找不到年份。",
    career: "这几行数字排得挺整齐，可林岸自己的房租还没算进去。"
  },
  board: {
    hospital: "第一张便签写什么……先记日期吧。",
    career: "这张便签贴得太高了，我下次可能会先看到它。"
  }
};

function maybeSpeakEnvironmentThought(interactionId) {
  if (!state.started || state.step !== "research" || state.selected.length || state.currentMaterial || state.locked || !elements.roomDialogueActions.hidden) return;
  const thought = companionEnvironmentThoughts[interactionId]?.[state.chapterId];
  const historyKey = `${state.chapterId}:${interactionId}`;
  if (!thought || state.ambientSpeechHistory.has(historyKey)) return;
  state.ambientSpeechHistory.add(historyKey);
  setAiText(thought);
}

const companionEnvironmentRoomClasses = Object.values(companionEnvironmentInteractions).map((item) => item.roomClass);

function clearCompanionEnvironmentInteraction() {
  window.clearTimeout(state.environmentTimer);
  state.environmentTimer = null;
  state.currentEnvironmentInteraction = null;
  companionEnvironmentRoomClasses.forEach((className) => elements.roomScene.classList.remove(className));
  elements.aiCharacter.classList.remove("is-environment-interacting", "interact-bed", "interact-window", "interact-computer", "interact-board");
  elements.roomComputer.classList.remove("is-companion-active");
  elements.roomReadingSeat.classList.remove("is-companion-checking");
  if (elements.aiCharacter.dataset.baseLabel) elements.aiCharacter.setAttribute("aria-label", elements.aiCharacter.dataset.baseLabel);
}

function startCompanionEnvironmentInteraction(interactionId) {
  const interaction = companionEnvironmentInteractions[interactionId];
  if (!interaction) return scheduleCompanionRoam();
  clearCompanionEnvironmentInteraction();
  state.currentEnvironmentInteraction = interactionId;
  elements.aiCharacter.dataset.baseLabel ||= elements.aiCharacter.getAttribute("aria-label") || "共读伙伴 00";
  elements.aiCharacter.setAttribute("aria-label", `${getCompanionDisplayName()}${interaction.label}`);
  elements.aiCharacter.style.setProperty("--environment-duration", `${interaction.duration}ms`);
  elements.aiCharacter.classList.add("is-environment-interacting", `interact-${interactionId}`);
  elements.roomScene.classList.add(interaction.roomClass);
  if (interactionId === "computer") {
    elements.roomComputer.classList.add("is-companion-active");
    if (state.selected.length) elements.roomReadingSeat.classList.add("is-companion-checking");
  }
  maybeSpeakEnvironmentThought(interactionId);
  state.environmentTimer = window.setTimeout(() => {
    clearCompanionEnvironmentInteraction();
    scheduleCompanionRoam(12000 + Math.round(Math.random() * 5000));
  }, interaction.duration);
}

function removeCompanionWalkClasses() {
  elements.aiCharacter.classList.remove("is-walking", "walk-side", "walk-left", "walk-front", "walk-back");
}

function stopCompanionWalk() {
  window.clearTimeout(state.roamTimer);
  window.clearTimeout(state.walkTimer);
  state.roamTimer = null;
  state.walkTimer = null;
  clearCompanionEnvironmentInteraction();
  if (!elements.aiCharacter.classList.contains("is-walking")) return;
  const style = window.getComputedStyle(elements.aiCharacter);
  const sceneWidth = elements.roomScene.clientWidth || 1;
  const sceneHeight = elements.roomScene.clientHeight || 1;
  const x = (Number.parseFloat(style.left) / sceneWidth) * 100;
  const depth = (Number.parseFloat(style.bottom) / sceneHeight) * 100;
  const matrix = new DOMMatrixReadOnly(style.transform);
  const scale = Math.max(.75, Math.min(1.05, Math.hypot(matrix.a, matrix.b)));
  elements.aiCharacter.classList.add("is-roam-frozen");
  elements.aiCharacter.style.setProperty("--companion-x", `${x}%`);
  elements.aiCharacter.style.setProperty("--companion-depth", `${depth}%`);
  elements.aiCharacter.style.setProperty("--companion-scale", scale.toFixed(3));
  state.companionPosition = { x, depth, scale };
  void elements.aiCharacter.offsetWidth;
  removeCompanionWalkClasses();
  window.requestAnimationFrame(() => elements.aiCharacter.classList.remove("is-roam-frozen"));
}

function canCompanionRoam() {
  const roomWindow = $("#roomWindow");
  return state.started && !state.companionEmotion && !state.currentEnvironmentInteraction && !elements.aiCharacter.classList.contains("is-walking")
    && !roomWindow.classList.contains("is-minimized") && !roomWindow.classList.contains("is-closed")
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scheduleCompanionRoam(delay = 11000) {
  window.clearTimeout(state.roamTimer);
  if (!state.started || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  state.roamTimer = window.setTimeout(() => {
    state.roamTimer = null;
    if (!canCompanionRoam()) {
      scheduleCompanionRoam(4000);
      return;
    }
    startCompanionWalk();
  }, delay);
}

function startCompanionWalk() {
  const from = state.companionPosition;
  const target = companionRoamTargets[state.roamIndex % companionRoamTargets.length];
  state.roamIndex += 1;
  const dx = target.x - from.x;
  const dd = target.depth - from.depth;
  const depthDominates = Math.abs(dd) * 1.2 > Math.abs(dx);
  const directionClass = depthDominates ? (dd > 0 ? "walk-back" : "walk-front") : "walk-side";
  const sceneRect = elements.roomScene.getBoundingClientRect();
  const characterHeight = elements.aiCharacter.getBoundingClientRect().height || sceneRect.height * .28;
  const pixelDistance = Math.hypot((dx / 100) * sceneRect.width, (dd / 100) * sceneRect.height);
  const gaitCycleDistance = Math.max(48, characterHeight * .32);
  const gaitCycles = Math.max(1, Math.min(6, Math.ceil(pixelDistance / gaitCycleDistance)));
  const gaitCycleDuration = 840;
  const duration = gaitCycles * gaitCycleDuration;
  removeCompanionWalkClasses();
  elements.aiCharacter.classList.add("is-walking", directionClass);
  if (!depthDominates && dx < 0) elements.aiCharacter.classList.add("walk-left");
  elements.aiCharacter.style.setProperty("--walk-duration", `${duration}ms`);
  elements.aiCharacter.style.setProperty("--gait-cycle-duration", `${gaitCycleDuration}ms`);
  elements.aiCharacter.style.setProperty("--gait-cycles", gaitCycles);
  elements.aiCharacter.style.setProperty("--companion-x", `${target.x}%`);
  elements.aiCharacter.style.setProperty("--companion-depth", `${target.depth}%`);
  elements.aiCharacter.style.setProperty("--companion-scale", target.scale);
  state.walkTimer = window.setTimeout(() => {
    state.walkTimer = null;
    state.companionPosition = target;
    removeCompanionWalkClasses();
    if (target.interaction) startCompanionEnvironmentInteraction(target.interaction);
    else scheduleCompanionRoam(10500 + Math.round(Math.random() * 4500));
  }, duration);
}

function showDoubt(message) {
  window.clearTimeout(state.doubtTextTimer);
  setCompanionEmotion("doubt", 1080);
  elements.aiText.textContent = "……";
  state.doubtTextTimer = window.setTimeout(() => {
    state.doubtTextTimer = null;
    setAiText(message);
  }, 260);
}

function captureMaterialOrigin(materialId, sourceElement = null, sourcePoint = null) {
  const materialCard = document.querySelector(`.material-card[data-material-id="${materialId}"]`);
  const source = materialCard || sourceElement;
  if (source) {
    const rect = source.getBoundingClientRect();
    return { x: rect.left + rect.width * .72, y: rect.top + Math.min(42, rect.height * .35) };
  }
  if (sourcePoint) return { x: sourcePoint.x, y: sourcePoint.y };
  const browserRect = getWindowElement("browserWindow").getBoundingClientRect();
  return { x: browserRect.right - 80, y: browserRect.top + 180 };
}

function prepareRoomForTransit() {
  const roomWindow = getWindowElement("roomWindow");
  roomWindow.classList.remove("is-minimized", "is-closed");
  updateWindowTask("roomWindow", { closed: false, active: roomWindow.classList.contains("is-front") });
  roomWindow.classList.remove("is-transit-alert");
  void roomWindow.offsetWidth;
  roomWindow.classList.add("is-transit-alert");
  window.clearTimeout(state.transitAlertTimer);
  state.transitAlertTimer = window.setTimeout(() => roomWindow.classList.remove("is-transit-alert"), 520);
}

function animateMaterialTransit(material, origin) {
  if (!material || !origin || !elements.materialTransitLayer || !elements.roomReadingSeat) return;
  prepareRoomForTransit();
  const layerRect = elements.materialTransitLayer.getBoundingClientRect();
  const targetRect = elements.roomReadingSeat.getBoundingClientRect();
  const paper = document.createElement("div");
  paper.className = `material-transit-paper kind-${material.kind}`;
  paper.innerHTML = `<strong>${material.kindLabel}</strong><span>${material.date}</span>`;
  paper.style.left = `${origin.x - layerRect.left - 38}px`;
  paper.style.top = `${origin.y - layerRect.top - 27}px`;
  elements.materialTransitLayer.append(paper);
  const targetX = targetRect.left + targetRect.width * .5 - origin.x;
  const targetY = targetRect.top + targetRect.height * .5 - origin.y;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frames = reducedMotion
    ? [{ transform: `translate(${targetX}px, ${targetY}px) scale(.86)`, opacity: 0 }, { transform: `translate(${targetX}px, ${targetY}px) scale(.86)`, opacity: 1 }]
    : [
        { transform: "translate(0, 0) rotate(-2deg) scale(1)", opacity: 1 },
        { offset: .55, transform: `translate(${targetX * .55}px, ${targetY * .55 - 28}px) rotate(5deg) scale(.94)`, opacity: 1 },
        { transform: `translate(${targetX}px, ${targetY}px) rotate(-4deg) scale(.72)`, opacity: .94 }
      ];
  const animation = paper.animate(frames, { duration: reducedMotion ? 140 : 320, easing: reducedMotion ? "linear" : "steps(8, end)", fill: "forwards" });
  const finish = () => {
    paper.remove();
    elements.roomReadingSeat.classList.remove("is-receiving");
    void elements.roomReadingSeat.offsetWidth;
    elements.roomReadingSeat.classList.add("is-receiving");
    window.setTimeout(() => elements.roomReadingSeat.classList.remove("is-receiving"), 360);
  };
  animation.addEventListener("finish", finish, { once: true });
  animation.addEventListener("cancel", finish, { once: true });
}

function renderRoomMaterialStack() {
  elements.roomMaterialStack.innerHTML = state.selected.map((materialId, index) => {
    const material = getMaterial(materialId);
    return `<i class="room-material-slip kind-${material.kind}" style="--slip-index:${index}" title="${material.kindLabel} · ${material.date}"></i>`;
  }).join("");
  elements.roomReadingSeat.classList.toggle("is-occupied", state.selected.length > 0);
}

function stageChapterOneFacilities() {
  window.clearTimeout(state.facilityTimer);
  elements.roomScene.classList.add("has-memory", "memory-papers");
  elements.roomScene.classList.remove("memory-lamp");
  elements.shelfBook.classList.remove("is-visible");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420;
  state.facilityTimer = window.setTimeout(() => {
    elements.roomScene.classList.add("memory-lamp");
    elements.shelfBook.classList.add("is-visible");
  }, delay);
}

function placeAutonomyFold() {
  elements.autonomyFold.classList.remove("is-placed");
  void elements.autonomyFold.offsetWidth;
  elements.autonomyFold.classList.add("is-placed");
  setCompanionEmotion("resolve", 920);
}

function getWindowElement(windowId) { return document.getElementById(windowId); }

function updateWindowTask(windowId, { closed = false, active = false } = {}) {
  const buttons = $$(`[data-window-task="${windowId}"]`);
  buttons.forEach((button) => {
    button.hidden = closed;
    button.classList.toggle("is-active", active && !closed);
  });
}

function updateMaximizeControl(windowElement) {
  const button = $('[data-window-action="maximize"]', windowElement);
  if (!button) return;
  const maximized = windowElement.classList.contains("is-maximized");
  button.textContent = maximized ? "❐" : "□";
  button.title = maximized ? "还原" : "最大化";
  button.setAttribute("aria-label", maximized ? "还原窗口" : "最大化窗口");
}

function focusTopVisibleWindow() {
  const candidate = $$(".app-window").filter((item) => !item.classList.contains("is-minimized") && !item.classList.contains("is-closed")).sort((a, b) => Number(b.dataset.stack || 0) - Number(a.dataset.stack || 0))[0];
  if (candidate) focusWindow(candidate.id);
}

function focusWindow(windowId) {
  const target = getWindowElement(windowId);
  if (!target) return;
  target.classList.remove("is-minimized", "is-closed");
  if (windowId === "memoryWindow") target.classList.add("is-open");
  $$(".app-window").forEach((item) => item.classList.remove("is-front"));
  target.classList.add("is-front", "is-pulsing");
  const highest = Math.max(0, ...$$(".app-window").map((item) => Number(item.dataset.stack || 0)));
  target.dataset.stack = String(highest + 1);
  window.setTimeout(() => target.classList.remove("is-pulsing"), 500);
  $$(".desktop-icon[data-focus]").forEach((button) => button.classList.toggle("is-active", button.dataset.focus === windowId));
  $$("[data-window-task]").forEach((button) => button.classList.toggle("is-active", button.dataset.windowTask === windowId));
  updateWindowTask(windowId, { closed: false, active: true });
}

function minimizeWindow(windowElement) {
  windowElement.classList.add("is-minimized");
  windowElement.classList.remove("is-front");
  updateWindowTask(windowElement.id, { closed: false, active: false });
  focusTopVisibleWindow();
}

function toggleMaximizeWindow(windowElement) {
  const willMaximize = !windowElement.classList.contains("is-maximized");
  windowElement.classList.toggle("is-maximized", willMaximize);
  windowElement.classList.remove("is-minimized", "is-closed");
  windowElement.style.removeProperty("left");
  windowElement.style.removeProperty("top");
  updateMaximizeControl(windowElement);
  focusWindow(windowElement.id);
}

function closeWindow(windowElement) {
  windowElement.classList.add("is-closed");
  windowElement.classList.remove("is-front", "is-minimized", "is-maximized");
  updateMaximizeControl(windowElement);
  updateWindowTask(windowElement.id, { closed: true, active: false });
  focusTopVisibleWindow();
}

function handleWindowAction(windowElement, action) {
  if (action === "minimize") minimizeWindow(windowElement);
  if (action === "maximize") toggleMaximizeWindow(windowElement);
  if (action === "close") closeWindow(windowElement);
}

function bindWindowManager() {
  let dragState = null;
  $$(".app-window").forEach((windowElement, index) => {
    windowElement.dataset.stack = String(index + 1);
    updateMaximizeControl(windowElement);
    const titlebar = $(".titlebar", windowElement);
    titlebar.addEventListener("dblclick", (event) => {
      if (event.target.closest(".window-controls")) return;
      toggleMaximizeWindow(windowElement);
    });
    titlebar.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest(".window-controls") || windowElement.classList.contains("is-maximized")) return;
      focusWindow(windowElement.id);
      const rect = windowElement.getBoundingClientRect();
      dragState = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, width: rect.width, height: rect.height };
      titlebar.setPointerCapture?.(event.pointerId);
    });
    titlebar.addEventListener("pointermove", (event) => {
      if (!dragState) return;
      const maxLeft = Math.max(94, window.innerWidth - dragState.width - 8);
      const maxTop = Math.max(38, window.innerHeight - dragState.height - 48);
      windowElement.style.left = `${Math.min(Math.max(94, event.clientX - dragState.offsetX), maxLeft)}px`;
      windowElement.style.top = `${Math.min(Math.max(38, event.clientY - dragState.offsetY), maxTop)}px`;
      windowElement.style.right = "auto";
    });
    const endDrag = (event) => {
      if (!dragState) return;
      dragState = null;
      if (titlebar.hasPointerCapture?.(event.pointerId)) titlebar.releasePointerCapture(event.pointerId);
    };
    titlebar.addEventListener("pointerup", endDrag);
    titlebar.addEventListener("pointercancel", endDrag);
    $$("[data-window-action]", windowElement).forEach((button) => {
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        handleWindowAction(windowElement, button.dataset.windowAction);
      });
    });
  });
}

function renderChapterCopy() {
  const chapter = currentChapter();
  elements.chapterName.textContent = chapter.archive;
  elements.addressBar.innerHTML = `<span class="lock-dot"></span> ${chapter.address}`;
  elements.questionKicker.textContent = chapter.kicker;
  elements.questionTitle.textContent = chapter.title;
  elements.questionBody.textContent = chapter.body;
  elements.askerNote.hidden = !chapter.asker;
  elements.askerNote.innerHTML = chapter.asker || "";
  elements.questionStats.innerHTML = chapter.stats.map((item) => `<span>${item}</span>`).join("");
  elements.researchEyebrow.textContent = chapter.eyebrow;
  elements.researchTitle.textContent = chapter.researchTitle;
  elements.researchInstruction.textContent = chapter.instruction;
  elements.trayEyebrow.textContent = "伙伴的共读桌面";
}

function renderMaterials() {
  elements.materialList.innerHTML = currentMaterials().map((material) => {
    const selected = state.selected.includes(material.id);
    const inspected = state.inspected.has(material.id);
    const attentionLocked = state.selected.length >= state.attention && !selected;
    const unavailable = state.locked || selected || attentionLocked || !inspected;
    const autoFlagged = state.autoFlaggedMaterialId === material.id;
    let actionText = "递给伙伴";
    if (state.locked) actionText = "本章已提交";
    else if (selected) actionText = "已在房间";
    else if (!inspected) actionText = "先打开看看";
    else if (attentionLocked) actionText = "只能选两份";
    return `
      <article class="material-card${selected ? " is-selected" : ""}${attentionLocked ? " is-locked" : ""}${autoFlagged ? " is-auto-flagged" : ""}"${autoFlagged ? ` data-auto-flag-copy="${state.autoFlagCopy}"` : ""}
        draggable="${unavailable ? "false" : "true"}" data-material-id="${material.id}">
        <div class="material-topline"><span class="source-kind ${material.kind}">${material.kindLabel}</span><span class="material-date">${material.date}</span></div>
        <h3>${material.title}</h3><p>${material.excerpt}</p>
        <div class="material-meta"><span>${material.author}</span><span>·</span><span>${material.engagement}</span></div>
        <div class="material-actions">
          <button class="text-action inspect-material" data-material-id="${material.id}" type="button" ${state.locked ? "disabled" : ""}>${inspected ? "再次查看" : "展开检查"}</button>
          <button class="send-action select-material" data-material-id="${material.id}" type="button" ${unavailable ? "disabled" : ""}>${actionText}</button>
        </div>
      </article>`;
  }).join("");

  $$(".inspect-material", elements.materialList).forEach((button) => button.addEventListener("click", () => openMaterial(button.dataset.materialId)));
  $$(".select-material", elements.materialList).forEach((button) => button.addEventListener("click", () => selectMaterial(button.dataset.materialId, button.closest(".material-card"))));
  $$(".material-card", elements.materialList).forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      if (card.getAttribute("draggable") !== "true") { event.preventDefault(); return; }
      event.dataTransfer.setData("text/plain", card.dataset.materialId);
      event.dataTransfer.effectAllowed = "copy";
    });
  });
  renderAttention();
}

function renderAttention() {
  const used = state.selected.length;
  elements.attentionPips.innerHTML = Array.from({ length: state.attention }, (_, index) => `<span class="attention-pip${index < used ? " is-used" : ""}"></span>`).join("");
  elements.attentionText.textContent = `${state.attention - used} / ${state.attention}`;
  elements.trayCount.textContent = `${used} / ${state.attention}`;
}

function getChapterTwoReviewProfile(shared = false) {
  const evaluation = state.chapterOneSnapshot?.evaluation;
  if (evaluation?.grade === "misleading") {
    const repairState = state.accountabilityResolution?.repairState || "none";
    if (!shared && repairState === "full") {
      return {
        materialId: "success", flagCopy: "伙伴主动圈出：她有作品和一年生活费，林岸没有", wall: "先把差别说出来",
        instruction: "上次的公开更正还留在札记里。伙伴这次主动圈出了两个人不同的准备条件，你仍可重新检查。",
        ai: "这篇里的人已经有作品，也攒了一年的生活费，林岸现在都没有，我先把这两处圈出来了", doubt: true
      };
    }
    if (!shared && repairState === "late") {
      return {
        materialId: "success", flagCopy: "伙伴先提醒：她有作品和一年生活费，林岸没有", wall: "先提醒，再等你看",
        instruction: "上次更正得有点晚，这回伙伴先把两个人不同的准备条件标了出来，等你决定怎么用。",
        ai: "她有作品，也准备了一年的生活费，林岸没有，我先跟你说一声，后面你来定", doubt: true
      };
    }
    if (!shared && repairState === "quiet") {
      return {
        materialId: "success", flagCopy: "伙伴标出：她有作品和一年生活费，林岸没有", wall: "看见了，先告诉你",
        instruction: "伙伴注意到两个人的准备条件不同，但没有像上次那样主动留下记录。",
        ai: "这两个人的情况差得有点多，她已经有作品和生活费，林岸还没有，我先告诉你", doubt: true
      };
    }
    if (!shared && state.accountabilityChoice === "blame") {
      return {
        materialId: null, flagCopy: "", wall: "这次先不说",
        instruction: "伙伴看了高赞回答一会儿，没有像上次那样主动指出问题。你仍可以打开材料，查看作者、条件和日期。",
        ai: "我看到她有作品，也有一年的生活费，不过上次你说是我判断错了，这次我先等你看", doubt: false
      };
    }
    if (!shared && state.accountabilityChoice === "ignore") {
      return {
        materialId: null, flagCopy: "", wall: "消息还亮着",
        instruction: "悠一没有得到回复。伙伴把高赞回答放在桌上，也没有先说这份回答哪里可能有问题。",
        ai: "上次悠一等了很久，原回答也一直没改，这篇我看到了，可我不太敢先说", doubt: false
      };
    }
    if (!shared && state.accountabilityChoice === "explain") {
      return {
        materialId: null, flagCopy: "", wall: "看见差别，还没开口",
        instruction: "伙伴看见了高赞经历与林岸条件不同，但没有先把差别说出来，还在等你。",
        ai: "她有作品，也攒了一年的生活费，林岸没有，我看见了，可上次我们解释了那么久也没改，这次我先等你", doubt: false
      };
    }
    return shared ? {
      materialId: "success", flagCopy: "一起发现：高赞经历的作品与生活缓冲不同", wall: "一起重看起点",
      instruction: "你叫住了伙伴。你们重新把高赞经历的作品、生活费和林岸的条件放在一起，现在继续检查材料。",
      ai: "我刚才差点就信了，它写得那么全，赞也多，可再一看，她早就有作品，还有一年的生活费，林岸没有", doubt: true
    } : {
      materialId: null, flagCopy: "", wall: "高赞，应该能照做？",
      instruction: "伙伴先把高赞经历放到了最上面，却没有圈出它与林岸起点的差别。你仍可展开作者、条件和日期重新检查。",
      ai: "它写得很全，赞也多，我刚才差点就想按这个来", doubt: false
    };
  }
  if (evaluation?.grade === "overcautious") {
    return shared ? {
      materialId: "market", flagCopy: "一起分清：当前样本可作参照，但不能替林岸决定", wall: "一起看它能用到哪",
      instruction: "你们看过市场观察的日期和样本说明了，它可以用来比较当前岗位，但不能替林岸决定。",
      ai: "我本来连这张新材料也不敢用，一起看完才发现，数字能拿来比一比，可不能替林岸选。", doubt: true
    } : {
      materialId: "market", flagCopy: "伙伴犹豫：最新市场观察也被放进“待核实”", wall: "最新，也先等等",
      instruction: "伙伴把刚更新的市场观察也圈了起来。它没有删掉，只是迟迟不敢用。",
      ai: "日期是新的，样本也写了，可我还是有点拿不准，这份你想用吗？", doubt: true
    };
  }
  const corrected = evaluation?.cause === "corrected-before-send";
  return {
    materialId: "success",
    flagCopy: corrected ? "伙伴主动核对：高赞经历 ≠ 林岸的当前条件" : "伙伴已标出：个人经历 ≠ 当前岗位事实",
    wall: shared ? "一起核对起点" : corrected ? "先对回作者和条件" : "先圈出起点差",
    instruction: shared
      ? "你们在高赞经历旁圈出了日期、作品和生活费。现在继续检查材料，再选四份中的两份。"
      : corrected ? "伙伴先把高赞经历的作者、作品和生活费对回林岸的条件，再继续检查材料。" : "伙伴在高赞经历旁圈出了日期、作品和生活费。现在继续检查材料。",
    ai: corrected
      ? "上次那张标签的折痕还在，这回我先看看是谁写的，再看看林岸有没有同样的条件。"
      : shared ? "看见了，她离职前有作品，也攒了一年的生活费，林岸都没有。" : "我先圈这儿，她已经有作品，还有一年的生活费，林岸没有。",
    doubt: true
  };
}

function ensureChapterTwoPermission(action) {
  if (state.chapterId !== "career" || state.chapterTwoPermissionResolved) return false;
  if (state.permission === "allow") {
    applyChapterTwoAutonomyReview(false);
    return false;
  }
  state.pendingChapterAction = action;
  const evaluation = state.chapterOneSnapshot?.evaluation;
  const prompt = evaluation?.grade === "misleading"
    ? "我刚才差点就照着这篇高赞回答写了。你说要先叫你，所以我没动。"
    : evaluation?.grade === "overcautious"
      ? "连这份刚更新的市场观察，我也有点不敢用。你说要先叫你，所以我停下了。"
      : "这篇高赞回答里的那个人，跟林岸不太一样。你说碰到这种地方先叫你。";
  showChapterReviewAction(prompt);
  focusWindow("roomWindow");
  setCompanionEmotion("permission-wait");
  setAiText(prompt);
  return true;
}

function applyChapterTwoAutonomyReview(shared) {
  const profile = getChapterTwoReviewProfile(shared);
  state.chapterTwoPermissionResolved = true;
  state.autoFlaggedMaterialId = profile.materialId;
  state.autoFlagCopy = profile.flagCopy;
  state.pendingChapterAction = null;
  elements.roomScene.classList.toggle("tag-conflict", Boolean(profile.materialId));
  setWallNote(profile.wall);
  elements.researchInstruction.textContent = profile.instruction;
  renderMaterials();
  if (profile.doubt) showDoubt(profile.ai);
  else setAiText(profile.ai);
}

function openMaterial(materialId) {
  if (state.locked) { showToast("回复已经发出，那天的材料不能再更改。"); return; }
  markPlayerInteraction();
  if (ensureChapterTwoPermission({ type: "inspect", materialId })) return;
  performOpenMaterial(materialId);
}

function performOpenMaterial(materialId) {
  const material = getMaterial(materialId);
  if (!material) return;
  state.currentMaterial = materialId;
  state.inspected.add(materialId);
  elements.modalType.textContent = material.kindLabel;
  elements.modalTitle.textContent = material.title;
  elements.modalLedger.innerHTML = `<div class="ledger-item"><span>作者 / 来源</span><strong>${material.author}</strong></div><div class="ledger-item"><span>发布时间</span><strong>${material.date}</strong></div><div class="ledger-item"><span>内容性质</span><strong>${material.source}</strong></div>`;
  elements.modalBody.innerHTML = `${material.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}<blockquote>${material.quote}</blockquote>`;
  elements.modalCaution.textContent = material.caution;
  const alreadySelected = state.selected.includes(materialId);
  const attentionLocked = state.selected.length >= state.attention && !alreadySelected;
  elements.modalSendAction.disabled = state.locked || alreadySelected || attentionLocked;
  elements.modalSendAction.textContent = state.locked ? "本章已提交" : alreadySelected ? "已递给伙伴" : attentionLocked ? "只能选两份" : "递给共读伙伴";
  elements.materialModal.hidden = false;
  renderMaterials();
  updateOnboardingGuide();
  if (state.companionEmotion !== "doubt" && state.companionEmotion !== "permission-wait") setCompanionEmotion("inspect", 1300);
  checkpoint(state.chapterId + "-research");
}

function closeMaterialModal() {
  elements.materialModal.hidden = true;
  state.currentMaterial = null;
  updateOnboardingGuide();
}

function selectMaterial(materialId, sourceElement = null, sourcePoint = null) {
  if (state.locked || state.step !== "research") { showToast("回复已经发出，不能再更改选择。"); return; }
  markPlayerInteraction();
  if (!state.inspected.has(materialId)) { showToast("先打开材料，看看作者、日期和来源。"); return; }
  const transitOrigin = captureMaterialOrigin(materialId, sourceElement, sourcePoint);
  if (ensureChapterTwoPermission({ type: "select", materialId, transitOrigin })) return;
  commitMaterialSelection(materialId, transitOrigin);
}

function commitMaterialSelection(materialId, transitOrigin = null) {
  if (state.selected.includes(materialId)) { showToast("这份材料已经在共读房间里了。"); return; }
  if (state.selected.length >= state.attention) { showToast("只能选两份，先拿回桌上的一份再选。"); return; }
  const material = getMaterial(materialId);
  if (!material) return;
  state.selected.push(materialId);
  state.tagHistory[materialId] ||= [];
  closeMaterialModal();
  renderMaterials();
  renderTray();
  animateMaterialTransit(material, transitOrigin || captureMaterialOrigin(materialId));
  elements.aiCharacter.classList.add("is-awake");
  setCompanionEmotion("receive", 1800);
  if (state.selected.length === 1) {
    elements.aiCharacter.classList.remove("stage-zero");
    elements.aiCharacter.classList.add("stage-one");
    setAiText(state.chapterId === "hospital"
      ? `这张是“${material.kindLabel}”。那我们把它当规定、当经验，还是先打个问号？`
      : `这张是“${material.kindLabel}”。这回要拿它看市场、找办法，还是补林岸的情况？`);
  } else {
    setAiText(state.chapterId === "hospital"
      ? "两张纸都在这儿了。你觉得它们各自能说明什么？"
      : "两张纸都到了，先一张张看吧，别急着合在一起。");
  }
  checkpoint(state.chapterId + "-research");
}

function removeMaterial(materialId) {
  if (state.locked || state.step !== "research") { showToast("回复已经发出，那天的选择不能再更改。"); return; }
  markPlayerInteraction();
  state.selected = state.selected.filter((id) => id !== materialId);
  delete state.tags[materialId];
  delete state.tagHistory[materialId];
  renderMaterials();
  renderTray();
  setAiText("好，这张先拿回去。刚才贴的标签也不算了。");
  checkpoint(state.chapterId + "-research");
}

function isTagConflict(material, tagId) {
  if (!tagId || tagId === "omit") return false;
  return !material.validUses.includes(tagId);
}

function setMaterialTag(materialId, tagId) {
  if (state.locked || state.step !== "research") { showToast("回复已经发出，那天贴过的标签不能再更改。"); return; }
  markPlayerInteraction();
  const material = getMaterial(materialId);
  const tag = currentChapter().tagOptions.find((item) => item.id === tagId);
  if (!material || !tag || !state.selected.includes(materialId)) return;
  if (state.tags[materialId] === tagId) return;
  state.tags[materialId] = tagId;
  state.tagHistory[materialId] ||= [];
  state.tagHistory[materialId].push({ tagId, conflicted: isTagConflict(material, tagId) });
  renderTray();
  checkpoint(state.chapterId + "-research");
  const review = getTagReview();
  elements.roomScene.classList.toggle("tag-conflict", review.conflicts.length > 0 || Boolean(state.autoFlaggedMaterialId));
  elements.roomScene.classList.toggle("tag-all-official", review.allOfficial);
  if (review.allOfficial) {
    const conflict = review.conflicts[0];
    setWallNote("两张都叫“官方”？");
    showDoubt(`等一下，你把两张都贴成“最新官方信息”了，可这张明明写的是${conflict.author}，不是医院，我该信标签，还是信纸上的名字？`);
    return;
  }
  if (review.conflicts.some((item) => item.id === materialId)) {
    showDoubt(state.chapterId === "hospital"
      ? `这个标签我有点不敢贴，纸上的名字或日期对不上，你要不要再看一眼？`
      : `这个标签我也有点不敢贴，这张材料好像回答不了这件事，要不要再看一眼？`);
    return;
  }
  const history = state.tagHistory[materialId];
  const corrected = history.slice(0, -1).some((entry) => entry.conflicted);
  setCompanionEmotion("inspect", 1300);
  setAiText(corrected
    ? `好，你刚才把标签换过了，我记下来了，现在是“${tag.label}”。`
    : `好，这张先当作“${tag.label}”。`);
}

function renderTray() {
  const chapter = currentChapter();
  elements.emptyDrop.hidden = state.selected.length > 0;
  elements.selectedMaterials.classList.toggle("is-frozen", state.locked);
  const allTagged = state.selected.length === state.attention && state.selected.every((id) => Boolean(state.tags[id]));
  elements.selectedMaterials.innerHTML = state.selected.map((materialId) => {
    const material = getMaterial(materialId);
    const hasFriction = Boolean(state.tags[materialId]) && isTagConflict(material, state.tags[materialId]);
    return `<article class="selected-item${hasFriction ? " has-source-friction" : ""}">
      <div class="selected-item-header"><span class="source-kind ${material.kind}">${material.kindLabel}</span><strong>${material.title}</strong><button class="remove-material" data-material-id="${materialId}" type="button" aria-label="移除材料" ${state.locked ? "disabled" : ""}>×</button></div>
      <p class="tag-prompt">${chapter.tagPrompt}</p><div class="tag-options">
        ${chapter.tagOptions.map((tag) => `<button class="tag-button${state.tags[materialId] === tag.id ? " is-selected" : ""}" data-material-id="${materialId}" data-tag-id="${tag.id}" type="button" ${state.locked ? "disabled" : ""}>${tag.label}</button>`).join("")}
      </div>${hasFriction ? `<p class="source-murmur">伙伴把标签翻过来，又核对了一次来源栏。</p>` : ""}</article>`;
  }).join("");
  $$(".remove-material", elements.selectedMaterials).forEach((button) => button.addEventListener("click", () => removeMaterial(button.dataset.materialId)));
  $$(".tag-button", elements.selectedMaterials).forEach((button) => button.addEventListener("click", () => setMaterialTag(button.dataset.materialId, button.dataset.tagId)));
  const inspectedSelected = state.selected.every((id) => state.inspected.has(id));
  const ready = !state.locked && state.step === "research" && allTagged && inspectedSelected;
  elements.synthesizeButton.disabled = !ready;
  elements.synthesizeButton.textContent = state.locked ? "回复已经发出" : ready ? "回到知乎整理回复" : "看完并标注两份材料后继续";
  renderRoomMaterialStack();
  renderAttention();
  updateOnboardingGuide();
}

function getTagReview(selected = state.selected, tags = state.tags, chapterId = state.chapterId) {
  const selectedMaterials = selected.map((id) => getMaterial(id, chapterId)).filter(Boolean);
  const allTagged = selectedMaterials.length === state.attention && selectedMaterials.every((material) => Boolean(tags[material.id]));
  const conflicts = selectedMaterials.filter((material) => isTagConflict(material, tags[material.id]));
  const allOfficial = chapterId === "hospital" && allTagged && selectedMaterials.every((material) => tags[material.id] === "official");
  return { selected: selectedMaterials, allTagged, conflicts, allOfficial, correctCount: selectedMaterials.length - conflicts.length };
}

function addTendency(target, key, amount) {
  if (!hiddenTraitKeys.includes(key) || !Number.isFinite(amount)) throw new Error(`Invalid hidden trait delta: ${key}`);
  target[key] = (target[key] || 0) + amount;
}

function getTendencySnapshot(includeCurrent = false) {
  const snapshot = Object.fromEntries(hiddenTraitKeys.map((key) => [key, state.tendencies[key] || 0]));
  if (includeCurrent) {
    hiddenTraitKeys.forEach((key) => { snapshot[key] += state.currentTendencies[key] || 0; });
  }
  return snapshot;
}

function chooseHiddenTraitEvent(node, includeCurrent = false) {
  const catalog = hiddenTraitEventCatalog[node];
  if (!catalog) return null;
  const scores = getTendencySnapshot(includeCurrent);
  const negative = hiddenTraitKeys
    .filter((key) => scores[key] <= hiddenTraitThresholds.negative && catalog[key]?.negative)
    .map((key) => ({ key, polarity: "negative", score: scores[key], weight: Math.abs(scores[key]) }));
  const positive = hiddenTraitKeys
    .filter((key) => scores[key] >= hiddenTraitThresholds.positive && catalog[key]?.positive)
    .map((key) => ({ key, polarity: "positive", score: scores[key], weight: scores[key] }));
  const candidates = negative.length ? negative : positive;
  candidates.sort((a, b) => b.weight - a.weight || hiddenTraitKeys.indexOf(a.key) - hiddenTraitKeys.indexOf(b.key));
  const selected = candidates[0];
  if (!selected) return null;
  return { node, trait: selected.key, polarity: selected.polarity, score: selected.score, ...catalog[selected.key][selected.polarity] };
}

function triggerHiddenTraitEvent(node, includeCurrent = false) {
  const existing = state.traitEvents.find((event) => event.node === node);
  if (existing) return existing;
  const event = chooseHiddenTraitEvent(node, includeCurrent);
  if (!event) return null;
  const frozen = Object.freeze({ ...event });
  state.traitEvents.push(frozen);
  return frozen;
}

function validateHiddenChoiceSystem() {
  const bindings = [
    ...hospitalMaterials.map((choice) => ({ id: `hospital-material:${choice.id}`, delta: choice.tendencies })),
    ...careerMaterials.map((choice) => ({ id: `career-material:${choice.id}`, delta: choice.tendencies })),
    ...Object.entries(choiceEvaluationProfiles).map(([id, choice]) => ({ id: `material-evaluation:${id}`, delta: choice.tendencyDeltas })),
    ...hospitalDecisions.map((choice) => ({ id: `hospital-decision:${choice.id}`, delta: choice.tendencies })),
    ...Object.entries(careerDecisionSets).flatMap(([path, choices]) => choices.map((choice) => ({ id: `career-decision:${path}:${choice.id}`, delta: careerDecisionProfiles[choice.id]?.tendencies }))),
    ...Object.entries(hospitalDraftApproaches).map(([id, choice]) => ({ id: `hospital-draft:${id}`, delta: choice.tendencies })),
    ...Object.entries(careerDraftApproaches).map(([id, choice]) => ({ id: `career-draft:${id}`, delta: choice.tendencies })),
    ...Object.entries(hospitalFollowupReplyChoices).map(([id, choice]) => ({ id: `hospital-followup:${id}`, delta: choice.tendencies })),
    ...["plan", "boundary", "correct", "insist"].map((id) => ({ id: `hospital-closing:${id}`, delta: getHospitalConversationResolution("audit", id)?.tendencies })),
    ...Object.entries(permissionTendencies).map(([id, delta]) => ({ id: `permission:${id}`, delta })),
    ...Object.entries(accountabilityChoices).map(([id, choice]) => ({ id: `hospital-accountability:${id}`, delta: choice.tendencyDeltas })),
    ...Object.entries(accountabilityAftermathChoices).flatMap(([path, branch]) => Object.entries(branch.options).map(([id, choice]) => ({ id: `hospital-aftermath:${path}:${id}`, delta: choice.tendencyDeltas }))),
    ...Object.entries(careerAccountabilityChoices).map(([id, choice]) => ({ id: `career-accountability:${id}`, delta: choice.tendencyDeltas })),
    ...Object.entries(finalConversationChoices).map(([id, choice]) => ({ id: `final:${id}`, delta: choice.tendencyDeltas }))
  ];
  const invalid = bindings.filter(({ delta }) => {
    const entries = Object.entries(delta || {});
    return !entries.length || entries.every(([, amount]) => amount === 0) || entries.some(([key, amount]) => !hiddenTraitKeys.includes(key) || !Number.isFinite(amount));
  });
  const missingEvents = Object.entries(hiddenTraitEventCatalog).flatMap(([node, catalog]) => hiddenTraitKeys.filter((key) => !catalog[key]?.positive || !catalog[key]?.negative).map((key) => `${node}:${key}`));
  const incompleteDrafts = [
    ...Object.entries(hospitalDraftApproaches).map(([id, choice]) => ({ id: `hospital-draft:${id}`, choice, routes: hospitalDecisions.map((decision) => decision.id) })),
    ...Object.entries(careerDraftApproaches).map(([id, choice]) => ({ id: `career-draft:${id}`, choice, routes: Object.keys(careerDecisionProfiles) }))
  ].filter(({ choice, routes, id }) => !choice.memory || !choice.followupEcho || (id.startsWith("career-") && !choice.conflictEcho) || routes.some((route) => !choice.lines?.[route]));
  if (invalid.length || missingEvents.length || incompleteDrafts.length) {
    throw new Error(`Hidden choice system is incomplete: ${[...invalid.map((item) => item.id), ...missingEvents, ...incompleteDrafts.map((item) => item.id)].join(", ")}`);
  }
}

function computeResearchTendencies() {
  const tendencies = { truth: 0, empathy: 0, expression: 0, caution: 0 };
  state.selected.forEach((materialId) => {
    const material = getMaterial(materialId);
    Object.entries(material.tendencies || {}).forEach(([key, value]) => addTendency(tendencies, key, value));
    const tag = state.tags[materialId];
    if (!isTagConflict(material, tag)) addTendency(tendencies, "truth", 1);
    if (tag === "context") addTendency(tendencies, "empathy", 1);
    if (tag === "uncertain" || tag === "risk") addTendency(tendencies, "caution", 1);
    if (tag === "market") addTendency(tendencies, "truth", 1);
    if (tag === "method") addTendency(tendencies, "expression", 1);
  });
  return tendencies;
}

function buildHospitalPartnerSynthesis() {
  const review = getTagReview();
  if (review.allOfficial) {
    return "你把两张纸都当成最新的官方消息了，可我看署名的时候有点对不上，至少有一张不是医院发的，我们真要照这个往下写吗？";
  }
  if (review.conflicts.length) {
    if (review.conflicts.length > 1) return "我们给两张纸贴的标签都和作者、日期对不上，我现在有点不知道该信标签还是信纸上的字，我们还照这个结果往下写吗？";
    const material = review.conflicts[0];
    const tagLabel = getTagLabel(state.tags[material.id]);
    const conflictNotes = {
      official: `医院刚更新的说明被你归到“${tagLabel}”里了，可纸面上的发布方和日期都很清楚，我不太敢按这个标签往下写`,
      context: `悠一自己补问的那句话被你归到“${tagLabel}”里了，可那只是他没弄明白的地方，还不能拿来当答案`,
      oldGuide: `这张流程图是 2021 年的，你把它归到“${tagLabel}”里了，我总觉得这一步得再想想`,
      experience: `这篇写的是网友自己的经历，你把它归到“${tagLabel}”里了，真要按这个用吗`
    };
    return conflictNotes[material.id] || "这张纸的标签和作者、日期对不上，我有点不敢直接用";
  }
  const notes = {
    "context+official": "医院那份能告诉他到院以后怎么走，可学校医保还得问学校和当地医院，我们先把哪件事说在前面？",
    "experience+official": "医院那份讲流程，另一份讲一个人到了现场怎么开口，这两张都能用，只是不能混成一种说法，我们先回哪一层？",
    "official+oldGuide": "新的医院说明和那张五年前的流程图对不上，旧图看着更完整，可真照着走可能会跑错窗口，我们先怎么提醒他？",
    "context+experience": "一个人怎么在现场开口，我们有办法，可学校医保到底去问谁还没弄清楚，我们先回能确定的那部分？",
    "context+oldGuide": "旧流程图说得很全，可学校医保那句没有答案，这两张都不能直接当成现在的医院规定，我们先怎么回？",
    "experience+oldGuide": "这两份都是别人怎么做的，能帮悠一少慌一点，可今天医院怎么规定还没查到，我们要先把这个说清楚吗？"
  };
  return notes[[...state.selected].sort().join("+")] || "两张纸我都看完了，可第一句先说什么，我还想听听你的意思";
}

function buildCareerPartnerSynthesis() {
  const review = getTagReview();
  if (review.conflicts.length) {
    const material = review.conflicts[0];
    const tagLabel = getTagLabel(state.tags[material.id]);
    return `你把“${material.title}”拿来“${tagLabel}”，可它实际说的不是这件事，我怕第一句就把林岸带偏，我们还按这个方向写吗？`;
  }
  const notes = {
    "market+success": "一个是现在的岗位要求，一个是别人准备很久以后转成了，可林岸手里有什么、能撑多久还不知道，我们先问清哪一件？",
    "failure+market": "岗位要求是现在的，那次失败也确实发生过，可它们都不能直接替林岸下结论，我们先从哪边说？",
    "context+market": "岗位现在要什么、林岸手里有什么，这两块终于能对上了，我们先帮他算差距，还是先问他已经累到什么程度？",
    "failure+success": "这两个人一个转成了，一个没转成，可他们都不是林岸，我们拿这两段经历替他判断，很可能会把他带偏",
    "context+success": "那个人有作品也攒了一年生活费，林岸现在还没有，可她试出来的做法也许能拆一点给他，我们先说差别还是先说下一步？",
    "context+failure": "那次失败提醒了成本，林岸自己的钱和准备也摆在这儿了，可这还不能直接变成一句“别辞”，我们先帮他看哪件事？"
  };
  return notes[[...state.selected].sort().join("+")] || "这两份材料都能用，可它们还不能替林岸做决定，我们先从哪儿说起？";
}

function getAvailableDecisions() {
  if (state.chapterId === "career") {
    const combinationKey = [...state.selected].sort().join("+");
    return (careerDecisionSets[combinationKey] || []).map((decision) => ({ ...decision, ...careerDecisionProfiles[decision.id] }));
  }
  return hospitalDecisions.filter((decision) => decision.requiresAny.some((materialId) => state.selected.includes(materialId)));
}

function openDecision() {
  if (elements.synthesizeButton.disabled) return;
  markPlayerInteraction();
  state.step = "synthesis";
  updateOnboardingGuide();
  state.currentTendencies = computeResearchTendencies();
  const synthesis = state.chapterId === "hospital" ? buildHospitalPartnerSynthesis() : buildCareerPartnerSynthesis();
  elements.aiSummary.innerHTML = `<span class="partner-synthesis-speaker">${getCompanionDisplayName()}把两张纸看了一遍</span><p>${synthesis}</p>`;
  const decisions = getAvailableDecisions();
  elements.decisionEyebrow.textContent = state.chapterId === "hospital" ? "决定回复次序 / 02" : "整理回答 / 04";
  elements.decisionTitle.textContent = state.chapterId === "hospital" ? "看完这些材料，你们准备先替悠一做什么？" : "看完这些材料，你们准备先替林岸做什么？";
  elements.decisionPrompt.innerHTML = state.chapterId === "hospital"
    ? "<strong>你正以“共读答主”的身份回复。</strong>悠一还在等。你先写什么，会影响他接下来相信什么；伙伴也会记住这种顺序。"
    : "<strong>你正以“共读答主”的身份回复。</strong>林岸还在等。你先写什么，会影响他接下来怎样理解自己的处境；伙伴也会记住这种顺序。";
  elements.decisionOptions.innerHTML = decisions.map((decision, index) => `<button class="decision-option" data-decision-id="${decision.id}" type="button"><span class="option-key">${String.fromCharCode(65 + index)}</span><span class="decision-copy"><strong>${decision.title}</strong><small>${decision.detail}</small></span></button>`).join("");
  $$(".decision-option", elements.decisionOptions).forEach((button) => button.addEventListener("click", () => chooseDecision(button.dataset.decisionId)));
  elements.responsePanel.classList.remove("is-sent");
  revealBrowserPanel(elements.responsePanel);
  updateProgress(1);
  const review = getTagReview();
  setAiText(review.conflicts.length ? "这张标签还是对不上。真要带着这个问号回他吗？" : "两张纸我都看完了。那我们先帮他做哪件事？" );
  checkpoint(state.chapterId + "-synthesis");
}

function deriveMisjudgmentHistory(chapterId, selected, tags, tagHistory) {
  const corrected = [], persisted = [];
  selected.forEach((materialId) => {
    const material = getMaterial(materialId, chapterId);
    const history = tagHistory[materialId] || [];
    const everWrong = history.some((entry) => entry.conflicted);
    const finalWrong = isTagConflict(material, tags[materialId]);
    if (everWrong && !finalWrong) corrected.push(materialId);
    if (finalWrong) persisted.push(materialId);
  });
  return Object.freeze({ corrected: Object.freeze(corrected), persisted: Object.freeze(persisted) });
}

function evaluateChapterChoice(chapterId, decisionId, selected, tags, tagHistory) {
  const materials = selected.map((materialId) => getMaterial(materialId, chapterId)).filter(Boolean);
  const misjudgments = deriveMisjudgmentHistory(chapterId, selected, tags, tagHistory);
  let grade = "accurate", cause = "aligned-sources";
  let habit = "先看署名和日期，再动笔。";
  let sendTrace = "伙伴先看了署名和日期，才开始写";

  if (chapterId === "hospital") {
    const falseAuthority = materials.find((material) => material.id !== "official" && tags[material.id] === "official");
    const officialDismissed = selected.includes("official") && tags.official !== "official";
    const outdatedMadeCurrent = decisionId === "direct" && selected.includes("oldGuide");
    const hasCurrentAuthority = selected.includes("official") && tags.official === "official";
    if (falseAuthority) {
      grade = "misleading"; cause = "label-over-source";
      habit = "那天，伙伴先信了标签，后看署名。";
      sendTrace = "回复写完时，署名还压在“官方”标签下面";
    } else if (outdatedMadeCurrent) {
      grade = "misleading"; cause = "completeness-over-source";
      habit = "那天，完整的回答盖过了右上角的日期。";
      sendTrace = "伙伴照着整套流程写到底，最后才看见日期";
    } else if (officialDismissed) {
      grade = "overcautious"; cause = "current-source-dismissed";
      habit = "伙伴连刚更新的说明也不敢用了。";
      sendTrace = "那份刚更新的医院说明，也被伙伴放到了一边";
    } else if (misjudgments.persisted.length) {
      grade = "limited"; cause = "source-misused";
      habit = "伙伴知道这张纸有用，却没看清能用到哪儿。";
      sendTrace = "有用的部分留下了，有一句话却写得太满";
    } else if (!hasCurrentAuthority) {
      grade = "limited"; cause = "no-current-source";
      habit = "能确定的留下；没把握的地方空着。";
      sendTrace = "纸上只写了能确定的事，剩下的位置还是空的";
    }
  } else if (misjudgments.persisted.length) {
    grade = "misleading"; cause = "source-misused";
    habit = "好听的故事被伙伴当成了答案。";
    sendTrace = "回信写得很肯定，其中一句却没有材料撑着";
  }

  if (!misjudgments.persisted.length && misjudgments.corrected.length) {
    cause = "corrected-before-send";
    habit = "那张标签换过一次，折痕没有擦掉。";
    sendTrace = "旧标签没有扔，改过的痕迹还留在纸边";
  }

  const profile = choiceEvaluationProfiles[grade];
  return Object.freeze({
    grade, cause, habit, sendTrace, wallNote: profile.wallNote,
    tendencyDeltas: Object.freeze({ ...profile.tendencyDeltas })
  });
}

function freezeChapterSnapshot(decisionId, route = null, evaluation = null) {
  const selected = Object.freeze([...state.selected]);
  const tags = Object.freeze({ ...state.tags });
  const tagHistory = {};
  Object.entries(state.tagHistory).forEach(([materialId, entries]) => {
    tagHistory[materialId] = Object.freeze(entries.map((entry) => Object.freeze({ ...entry })));
  });
  Object.freeze(tagHistory);
  const decisionConsequence = decisionConsequences[state.chapterId]?.[decisionId];
  const frozenEvaluation = evaluation || evaluateChapterChoice(state.chapterId, decisionId, selected, tags, tagHistory);
  return Object.freeze({
    chapterId: state.chapterId, selected, tags, tagHistory,
    misjudgments: deriveMisjudgmentHistory(state.chapterId, selected, tags, tagHistory),
    decision: decisionId, route, draftChoice: state.draftChoice,
    consequence: decisionConsequence ? Object.freeze({ ...decisionConsequence }) : null,
    evaluation: frozenEvaluation,
    tendencies: Object.freeze({ ...state.tendencies })
  });
}

function appendDraftLine(speaker, text, player = false) {
  const line = document.createElement("div");
  line.className = `draft-line${player ? " is-player" : ""}`;
  const name = document.createElement("strong");
  const copy = document.createElement("p");
  name.textContent = speaker;
  copy.textContent = text;
  line.append(name, copy);
  elements.draftThread.append(line);
}

function getDraftApproaches(chapterId = state.chapterId) {
  return chapterId === "hospital" ? hospitalDraftApproaches : careerDraftApproaches;
}

function getDraftOpening(decisionId, chapterId = state.chapterId) {
  const openings = chapterId === "hospital" ? {
    checklist: "清单可以写，可悠一刚在评论里问到学校医保，这一格现在还没人能替他确认",
    clarify: "他后来补了学校医保这件事，看来先问学校和医院，确实会改变后面怎么写",
    support: "他怕的是到了现场脑子一片空白，这篇亲历能帮上忙，不过不能拿它替医院定流程",
    direct: "这份旧流程排得很顺，可顺不代表今天还能照着走，我觉得开头得先留个口子"
  } : {
    verify: "账可以算，不过林岸现在只说钱能撑三个月，我们还不知道他每月到底花多少、想转去做什么",
    listen: "他说自己每天一下班就什么也不想做，我觉得开头得先让他知道，我们看见的是他现在真的很累",
    move: "小行动得落到他现在能做的事上，要不然一句“先试试”听着也挺轻松的"
  };
  return openings[decisionId] || "方向有了，不过开头怎么说，会决定他先看见什么";
}

function openResponseDraft(decision, evaluation) {
  const isHospital = state.chapterId === "hospital";
  const subjectName = isHospital ? "悠一" : "林岸";
  const approaches = getDraftApproaches();
  state.decision = decision.id;
  state.draftChoice = null;
  state.draftEvaluation = evaluation;
  state.step = "drafting";
  state.locked = true;
  $$(".decision-option", elements.decisionOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.decisionId === decision.id);
  });
  elements.responsePanel.classList.add("is-drafting");
  elements.decisionPrompt.innerHTML = `<strong>先回哪件事已经定了。</strong>伙伴把${subjectName}说过的话放到草稿旁边，等你决定第一句话怎么说。`;
  elements.draftWorkshopStatus.textContent = `${getCompanionDisplayName()}把草稿停在第一句`;
  elements.draftWorkshopTitle.textContent = "刚才决定了先回哪件事，现在第一句话怎么说？";
  elements.draftThread.innerHTML = "";
  appendDraftLine(getCompanionDisplayName(), getDraftOpening(decision.id));
  elements.draftOptions.innerHTML = Object.entries(approaches).map(([id, approach]) => `
    <button class="draft-choice" data-draft-choice="${id}" type="button">
      <strong>${approach.title}</strong><small>${approach.detail}</small>
    </button>`).join("");
  $$('[data-draft-choice]', elements.draftOptions).forEach((button) => button.addEventListener("click", () => chooseResponseDraft(button.dataset.draftChoice)));
  elements.draftPreview.hidden = true;
  elements.sendDraftAction.hidden = true;
  elements.draftWorkshop.hidden = false;
  renderMaterials();
  renderTray();
  elements.draftWorkshop.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  setAiText(getDraftOpening(decision.id));
  checkpoint(state.chapterId + "-drafting");
}

function chooseResponseDraft(choiceId) {
  if (state.step !== "drafting" || state.draftChoice) return;
  const approach = getDraftApproaches()[choiceId];
  const line = approach?.lines[state.decision];
  if (!approach || !line) return;
  state.draftChoice = choiceId;
  state.step = "draft-ready";
  $$('[data-draft-choice]', elements.draftOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.draftChoice === choiceId);
  });
  appendDraftLine("共读答主 · 你", line, true);
  appendDraftLine(getCompanionDisplayName(), approach.partner);
  elements.draftWorkshopStatus.textContent = "第一句已经落在草稿里";
  elements.draftPreviewText.textContent = line;
  elements.draftPreview.hidden = false;
  elements.sendDraftAction.hidden = false;
  elements.sendDraftAction.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  setAiText(approach.partner);
  checkpoint(state.chapterId + "-draft-ready");
}

function commitDecision(decision, evaluation) {
  Object.entries(state.currentTendencies).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  Object.entries(decision.tendencies || {}).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  Object.entries(evaluation.tendencyDeltas).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  const draftApproach = getDraftApproaches()[state.draftChoice];
  Object.entries(draftApproach?.tendencies || {}).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  state.decision = decision.id;
  state.step = "responded";
  state.locked = true;
  const snapshot = freezeChapterSnapshot(decision.id, decision.route || null, evaluation);
  if (state.chapterId === "hospital") state.chapterOneSnapshot = snapshot;
  else state.chapterTwoSnapshot = snapshot;
  $$(".decision-option", elements.decisionOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.decisionId === decision.id);
  });
  elements.responsePanel.classList.remove("is-drafting");
  elements.responsePanel.classList.add("is-sent");
  elements.draftWorkshop.hidden = true;
  elements.decisionPrompt.innerHTML = `<strong>共读回答已发出。</strong>署名：共读答主 · 你 × ${getCompanionDisplayName()}。回答已经锁定，材料和标签不能再改。`;
  renderMaterials();
  renderTray();
  updateProgress(2);
  updateRoomAfterDecision(decision, snapshot);
  setCompanionEmotion("resolve", 760);
  if (state.chapterId === "hospital") {
    window.clearTimeout(state.followupTimer);
    state.followupTimer = window.setTimeout(() => {
      setClock("16:24");
      const harmful = snapshot.evaluation.grade === "misleading";
      setNotification("followup", "!", harmful ? "悠一又发来一条消息" : "收到一条回访", harmful ? "语气似乎不太对" : "来自：悠一");
      updateProgress(3);
    }, 1200);
  } else {
    state.step = "career-followup-pending";
    window.clearTimeout(state.followupTimer);
    state.followupTimer = window.setTimeout(() => {
      setClock("09:32");
      setNotification("career-followup", "信", "几周后来信", "来自：林岸");
      updateProgress(3);
    }, 1200);
  }
  checkpoint(state.chapterId + "-responded");
}

function sendResponseDraft() {
  if (state.step !== "draft-ready" || !state.draftChoice || !state.draftEvaluation) return;
  const decision = getAvailableDecisions().find((item) => item.id === state.decision);
  if (!decision) return;
  commitDecision(decision, state.draftEvaluation);
}

function chooseDecision(decisionId) {
  if (state.locked || state.step !== "synthesis") return;
  const decision = getAvailableDecisions().find((item) => item.id === decisionId);
  if (!decision) return;
  const evaluation = evaluateChapterChoice(state.chapterId, decisionId, state.selected, state.tags, state.tagHistory);
  openResponseDraft(decision, evaluation);
}

function updateRoomAfterDecision(decision, snapshot) {
  const messages = state.chapterId === "hospital" ? {
    checklist: "我先把确定的写清楚了，没把握的地方留着空格。",
    clarify: "刚才差点急着给流程了，得先问清他在哪儿上学、准备去哪家医院。",
    support: "这篇经历能教他怎么开口，可它不能替医院说话，我分开写了。",
    direct: "那套流程已经发出去了，可它是五年前写的……我刚才没拦住。"
  } : {
    verify: "我先把账和岗位写下来，要不要辞，还是让林岸自己选。",
    listen: "这次先不急着把答案写满，我想听听他到底累成什么样了。",
    move: "我没替他选离不离职，只让他先投三份试试。"
  };
  let message = messages[decision.id];
  if (snapshot.evaluation.grade === "misleading") {
    const reversedBoth = state.chapterId === "hospital" && snapshot.selected.includes("official") && snapshot.tags.official !== "official"
      && snapshot.selected.some((materialId) => materialId !== "official" && snapshot.tags[materialId] === "official");
    message = reversedBoth
      ? "你把两张纸的身份全换过来了：悠一自己的话成了“官方”，医院刚更新的说明反而被放到一边。我还是按这些标签发了出去……我有点不安。"
      : "标签和纸上的署名对不上。我还是照着标签发了出去……我有点不安。";
  } else if (snapshot.evaluation.grade === "overcautious") {
    message = "那份医院说明明明刚更新，我却还是把它放下了。回答发出去了，可悠一能直接照着做的东西少了一块。";
  }
  setAiText(message);
  ["reply-checklist", "reply-clarify", "reply-support", "reply-direct"].forEach((name) => elements.roomScene.classList.remove(name));
  elements.roomScene.classList.add(`reply-${decision.id}`);
  ["outcome-accurate", "outcome-limited", "outcome-overcautious", "outcome-misleading"].forEach((name) => elements.roomScene.classList.remove(name));
  elements.roomScene.classList.add(`outcome-${snapshot.evaluation.grade}`);
  elements.aiCharacter.classList.remove("stage-one");
  elements.aiCharacter.classList.add("stage-two");
  setWallNote(snapshot.evaluation.wallNote);
  elements.growthTitle.textContent = "伙伴记下了这次怎么做";
  const dominant = Object.entries(state.tendencies).sort((a, b) => b[1] - a[1])[0][0];
  const labels = { truth: "伙伴在材料旁抄下了作者和日期", empathy: "伙伴把提问者的具体处境留了下来", expression: "伙伴先画出一份可以执行的草稿", caution: "伙伴在还没查清的地方画了问号" };
  const consequence = decisionConsequences[state.chapterId]?.[decision.id];
  const draftMemory = snapshot.draftChoice ? getDraftApproaches(snapshot.chapterId)[snapshot.draftChoice]?.memory : "";
  elements.growthList.innerHTML = `<li><span class="growth-dot"></span> ${labels[dominant]}</li><li><span class="growth-dot"></span> ${snapshot.evaluation.sendTrace}</li>${draftMemory ? `<li><span class="growth-dot"></span> ${draftMemory}</li>` : ""}<li><span class="growth-dot"></span> ${consequence.roomEcho}</li>`;
}

function getDecisionOutcomeEcho(snapshot) {
  const consequence = snapshot.consequence || decisionConsequences[snapshot.chapterId]?.[snapshot.decision];
  const grade = snapshot.evaluation?.grade || "accurate";
  if (snapshot.chapterId === "career") return "";
  if (grade === "accurate") return consequence?.followupEcho || "";
  return hospitalDecisionOutcomeEchoes[snapshot.decision]?.[grade] || consequence?.followupEcho || "";
}

function getIncidentDecisionEcho(snapshot, incident) {
  const echoes = {
    "self-misquoted": {
      checklist: "而且你们把这句话塞进清单以后，它看起来更像一条真的要我照做的准备事项。",
      clarify: "更怪的是，你们前面还在问我的学校和医院，后面却把我的问题直接变成了答案。",
      support: "那些教我怎么开口的话本来还有用，可跟这句假答案放在一起后，我也不敢信了。",
      direct: "它被写进一整套流程以后，我根本看不出哪一步来自医院，哪一步只是你们替我补的。"
    },
    "stale-instructions": {
      checklist: "清单看着很方便，旧窗口也就跟着被写成了一条现在还能照做的步骤。",
      clarify: "你们问了我的学校和医院，却偏偏没先问这张流程是几年前写的。",
      support: "怎么开口的建议没有问题，可它没有提醒我那张流程已经过期，我还是走错了。",
      direct: "而且你们连一句“这张图可能已经过期”都没写，我当时哪知道还得自己从头核对啊"
    },
    "experience-as-rule": {
      checklist: "写进清单以后，一个人的做法看起来就像所有人都得按的医院流程。",
      clarify: "你们问了我的具体情况，却又把另一个人的经历当成了医院对我的要求。",
      support: "最可惜的是，那些开口方法本来真的有用；被写成规定以后，我连有用的部分也不敢信了。",
      direct: "个人经历被排成完整流程以后，我根本看不出哪些只是她当时碰巧这样做。"
    },
    "source-conflict": {
      checklist: "它一进清单，就比原材料看起来更确定，我差点真的照着收拾。",
      clarify: "你们问了我的条件，却没有把那句话自己的来源问清楚。",
      support: "能安慰我的部分和没有依据的判断混在一起，我只能全部重查。",
      direct: "它被写成完整流程以后，原来缺掉的来源就更难看出来了。"
    }
  };
  return echoes[incident.id]?.[snapshot.decision] || getDecisionOutcomeEcho(snapshot);
}

function applyDecisionConsequence(snapshot, outcome) {
  const decisionEcho = outcome.incident ? getIncidentDecisionEcho(snapshot, outcome.incident) : getDecisionOutcomeEcho(snapshot);
  const draftEcho = snapshot.chapterId === "hospital" && snapshot.draftChoice ? hospitalDraftApproaches[snapshot.draftChoice]?.followupEcho : "";
  const echoes = [decisionEcho, draftEcho].filter((echo) => echo && !outcome.text.includes(echo));
  if (!echoes.length) return outcome;
  let text = outcome.text;
  echoes.forEach((echo) => {
    const separator = text && !/[。！？!?]$/.test(text) ? "，" : "";
    text += `${separator}${separator ? echo.replace(/。$/, "") : echo}`;
  });
  return { ...outcome, text };
}

function getCareerMisuseDetails(snapshot) {
  return snapshot.misjudgments.persisted.map((materialId) => {
    const material = getMaterial(materialId, "career");
    const tagId = snapshot.tags[materialId];
    const tagLabel = getTagLabel(tagId, "career");
    const limit = careerTagLimits[tagId] || "不能证明回答里写出的结论";
    const claim = careerTagClaims[tagId] || "材料里没有写过的结论";
    const fact = careerMisuseFacts[materialId];
    return {
      materialId,
      sourceName: `“${material.kindLabel}”`,
      issue: `你把“${material.kindLabel}”标成了“${tagLabel}”。${fact.fact}，${limit}。`,
      speakerIssue: `${fact.speakerLead}，怎么就成了${claim}？`,
      memory: fact.memory
    };
  });
}

function getCareerFollowupOutcome(snapshot) {
  const draftApproach = snapshot.draftChoice ? careerDraftApproaches[snapshot.draftChoice] : null;
  if (snapshot.evaluation.grade !== "misleading") {
    const outcome = careerFollowups[snapshot.route];
    const draftEcho = draftApproach?.followupEcho;
    const text = draftEcho ? `${outcome.text}${draftEcho}。` : outcome.text;
    return { ...outcome, text, habit: snapshot.evaluation.habit, tone: "normal" };
  }
  const details = getCareerMisuseDetails(snapshot);
  const severe = details.length > 1;
  const spokenIssues = details.map((detail) => detail.speakerIssue).join("还有，");
  const routeCopy = {
    verifier: severe
      ? `我照着你们的表算到一半，才发现有两处怎么都对不上，${spokenIssues}我只能先停下来，前前后后又花了两个晚上重查`
      : `我照着你们的表算到一半，发现有一处怎么都对不上，${spokenIssues}我只能先停下来，又花了两个晚上重查`,
    listener: severe
      ? `前面那几句我看着还挺舒服的，至少你们听懂了我最近真的很累，可后面有两处我越看越不对，${spokenIssues}我最后把页面关了，只跟朋友聊了聊`
      : `前面那几句我看着还挺舒服的，至少你们听懂了我最近真的很累，可看到后面我就有点懵了，${spokenIssues}这部分我没敢照着做，看完以后也没再往下说`,
    initiator: severe
      ? `我按你们给的方向投了三份，后来才发现三份都不是我真正想转的岗位，${spokenIssues}什么也没试出来，周末倒是全搭进去了`
      : `我照着建议投了一轮，后来才发现一开始找的岗位就不对，${spokenIssues}那三份投递根本回答不了我真正想知道的事`
  };
  const routeResults = {
    verifier: severe ? "林岸没能用这份回答算出结果，只好重新查材料。" : "林岸把查不到出处的那一项停下，重新核对。",
    listener: severe ? "林岸没再采用后面的建议，也不再继续向你们解释自己的情况。" : "林岸没有采用这条建议，也不再继续向你们解释自己的情况。",
    initiator: severe ? "林岸按错误方向投了三份，这些投递没有帮他看清目标岗位。" : "林岸停止继续试投，先重新确认目标岗位。"
  };
  const sourceNames = details.map((detail) => detail.sourceName).join("和");
  const memoryLead = {
    verifier: severe ? "林岸退回没算完的表格，并把两处没有依据的数字圈了出来" : `林岸退回没算完的表格，圈出了${details[0].sourceName}被误用的那一栏`,
    listener: severe ? "林岸保存了回答截图，把两句看不出依据的话圈了出来" : `林岸保存了回答截图，圈出根据${details[0].sourceName}写出的那句判断`,
    initiator: severe ? "林岸留下三份无效投递，并圈出两个错误依据" : `林岸暂停试投，圈出了${details[0].sourceName}导向错误方向的那句话`
  }[snapshot.route];
  const routePresentation = {
    verifier: { title: "林岸说：这张表里有几项我查不到", eyebrow: "林岸照着回答核对后 / 几周后", visualTone: "frustrated", roomEcho: severe ? "没算完的表格压着两张贴错标签的材料" : `没算完的表格压着${details[0].sourceName}` },
    listener: { title: "林岸说：后面的建议我不敢照着做", eyebrow: "林岸看完回答后 / 几周后", visualTone: "distrust", roomEcho: severe ? "回答截图里，两句没有材料支持的话被圈了出来" : `回答截图里，根据${details[0].sourceName}写出的那句判断被圈了出来` },
    initiator: { title: "林岸照着建议投了三份，却全投错了方向", eyebrow: "林岸照着回答试过后 / 几周后", visualTone: "frustrated", roomEcho: severe ? "三份无效投递和两张错误材料一起留在电脑旁" : `三份无效投递压着${details[0].sourceName}` }
  }[snapshot.route];
  const incident = { route: snapshot.route, details, severe, sourceNames, misuseCount: details.length };
  return {
    text: `${draftApproach?.conflictEcho ? `${draftApproach.conflictEcho}，` : ""}${routeCopy[snapshot.route]}`,
    result: `${details.map((detail) => detail.issue).join(" ")}${routeResults[snapshot.route]}`,
    memory: `${memoryLead}：${details.map((detail) => detail.memory).join("；")}。`,
    roomEcho: routePresentation.roomEcho,
    wallNote: severe ? "两处都要说清楚" : "哪一句没有依据",
    habit: snapshot.evaluation.habit,
    tone: "career-conflict",
    incident,
    sourceNames,
    misuseCount: details.length,
    title: routePresentation.title,
    eyebrow: routePresentation.eyebrow,
    visualTone: routePresentation.visualTone,
    requiresAccountability: true
  };
}

function buildHospitalIncident(snapshot, evaluation) {
  const falseAuthorities = snapshot.selected.map((id) => getMaterial(id, "hospital")).filter((material) => material.id !== "official" && snapshot.tags[material.id] === "official");
  const officialDismissed = snapshot.selected.includes("official") && snapshot.tags.official !== "official";
  const hasContext = falseAuthorities.some((material) => material.id === "context");
  const hasExperience = falseAuthorities.some((material) => material.id === "experience");
  const hasOldGuide = falseAuthorities.some((material) => material.id === "oldGuide") || evaluation.cause === "completeness-over-source";
  const issueParts = [];
  if (hasContext) issueParts.push("把悠一自己的疑问写成了医院已经确认的答案");
  if (hasExperience) issueParts.push("把一篇个人求助经历写成了医院规定");
  if (hasOldGuide) issueParts.push("把五年前的个人攻略写成了现在还能用的流程");
  if (officialDismissed) issueParts.push(`把医院刚更新的说明贴成了“${getTagLabel(snapshot.tags.official, "hospital")}”`);

  if (hasContext) {
    const extra = issueParts.filter((part) => !part.includes("自己的疑问"));
    return {
      id: "self-misquoted", shortLabel: "把悠一的问题写成答案", sourceNames: "悠一的评论",
      title: "悠一问：那明明是我在问", eyebrow: "回答发出后 / 次日 16:24", visualTone: "harm", requiresAccountability: true,
      admission: issueParts.join("，还") || "把你的问题写成了答案",
      explanation: "看到评论里提到医保手续，就急着把缺口补成了一个看起来完整的答案",
      blameDescription: "把提问和结论认反了",
      admitReaction: "悠一：对，先把我的问题从“答案”里划掉。更正里也请写清楚，那句话没有经过学校或医院确认。",
      explainReaction: "悠一：可那是我在问，不是材料太多的问题。先把我的话改回问题，再解释吧。",
      ignoreReaction: "你们一直没回。悠一只好自己在那篇回答下面留了一句：“刚才那句‘不确定学校医保要不要先办手续’是我问的，医院没有这么回复，大家先别按这句来。”发完，他就下线了。",
      text: `等一下，“不确定学校医保要不要先办手续”那句是我自己问的，你们怎么把它写成医院的回答了，我看到的时候真的有点火，连谁在问、谁在回答都能弄反，我后面还敢信哪句啊${extra.length ? `，而且你们还${extra.join("，还")}` : ""}，我现在只能从头再查一遍`,
      result: "悠一发现自己的疑问被改写成官方结论，停止采用整封回答并从头核对。",
      memory: `悠一自己的疑问被写成了答案${extra.length ? `；${extra.join("，还")}` : ""}。他看见后很生气。`
    };
  }

  if (hasOldGuide) {
    return {
      id: "stale-instructions", shortLabel: "把五年前攻略当成现行流程", sourceNames: "五年前的高赞攻略",
      title: "悠一在旧窗口走错了路", eyebrow: "回答造成了实际偏差 / 次日 16:24", visualTone: "frustrated", requiresAccountability: true,
      admission: issueParts.join("，还") || "把五年前的攻略写成了现在还能用的流程",
      explanation: "看那张图写得挺全，就直接照着整理了，看到是 2021 年的也没停下来查",
      blameDescription: "先照着完整流程写完，最后才看见它已经五年没更新",
      admitReaction: "悠一：请把已经变掉的窗口和年份标出来。我不想后来的人再拿着这张图多跑一趟。",
      explainReaction: "悠一：流程写得再完整也是五年前的，先把现在不能用的步骤改掉吧。",
      ignoreReaction: "你们一直没回。悠一只好在回答下面发了张现场照片：“这个窗口早就不用了。这攻略是五年前的，大家别照着跑。”发完，他就下线了。",
      text: `我真是照着你们那张图去的，到了才发现窗口早就换了，工作人员又让我跑到另一边，${officialDismissed ? "医院明明刚更新过说明，你们放着新的不用，反而拿一张五年前的攻略给我？" : "那张图都五年前的了，你们怎么还能直接当现在的流程发出来？"}我第一次自己去医院，本来就怕走错，你们还把那张图整理得跟真的一样，我要是没多问一句，是不是还得接着跑啊？`,
      result: "旧攻略被写成现行流程，悠一走错窗口并多花了时间重新确认。",
      memory: `五年前的攻略把悠一带到旧窗口${officialDismissed ? "，医院的新说明却被放到一边" : ""}。`
    };
  }

  if (hasExperience) {
    return {
      id: "experience-as-rule", shortLabel: "把亲历回答写成医院规定", sourceNames: "一篇个人亲历回答",
      title: "悠一不再确定哪些话能信", eyebrow: "回答的边界混在了一起 / 次日 16:24", visualTone: "distrust", requiresAccountability: true,
      admission: issueParts.join("，还") || "把个人经历写成了医院规定",
      explanation: "觉得那篇经历很有帮助，就把“怎么开口”和“医院怎么规定”写在了一起",
      blameDescription: "把能借鉴的求助方法写成了医院统一规定",
      admitReaction: "悠一：请保留她教人怎么开口的部分，但把“医院规定”删掉。那不是一回事。",
      explainReaction: "悠一：我知道那篇经历有用，可有用不等于医院说过。先把两种话分开吧。",
      ignoreReaction: "你们一直没回。悠一只好在回答下面追问：“所以这到底是医院规定，还是网友自己的经历？能不能说清楚？”发完，他就下线了。",
      text: `那篇亲历回答教人怎么开口，这部分确实有用，可你们把它跟医院规定写到一起了，我发现作者只是普通网友以后，连前面那些本来能帮到我的话都不太敢信了，现在我根本不知道你们哪一句能当真${officialDismissed ? "，医院刚更新的说明反而没被用上" : ""}`,
      result: "个人经验被写成医院规定，悠一没有走错现场，却失去了对整封回答的信任。",
      memory: `能帮悠一开口的个人经验被写成了医院规定；有用的话也因此失去信任。`
    };
  }

  return {
    id: "source-conflict", shortLabel: "把材料写成了它不能证明的结论", sourceNames: "来源不明的材料",
    title: "悠一要求你们说明依据", eyebrow: "回答来源无法对上 / 次日 16:24", visualTone: "distrust", requiresAccountability: true,
    admission: issueParts.join("，还") || "让标签盖过了材料自己的署名和日期",
    explanation: "先按标签整理，最后才回头核对来源",
    blameDescription: "没有先核对署名和日期",
    admitReaction: "悠一：先把没有依据的那句划掉，再告诉我剩下的话分别来自哪里。",
    explainReaction: "悠一：先把错句改掉。你们当时怎么想的，可以写在更正后面。",
    ignoreReaction: "你们一直没回。悠一只好在回答下面问：“这句话到底是从哪儿来的？能不能把依据贴出来？”发完，他就下线了。",
    text: "这封回复里有句话跟材料的署名、日期对不上，我没敢继续按它做，只能把整封回复重新查一遍",
    result: "来源与结论无法对应，悠一停止采用回答并重新核对。",
    memory: "标签盖过了材料的署名和日期，悠一把整封回复退了回来。"
  };
}

function getFollowupOutcome(snapshot = state.chapterOneSnapshot) {
  if (!snapshot) throw new Error("第一章快照缺失");
  const evaluation = snapshot.evaluation || evaluateChapterChoice(snapshot.chapterId, snapshot.decision, snapshot.selected, snapshot.tags, snapshot.tagHistory);
  if (snapshot.misjudgments.corrected.length) {
    const corrected = getMaterial(snapshot.misjudgments.corrected[0], "hospital");
    return applyDecisionConsequence(snapshot, {
      text: `我看到你们后来把“${corrected.kindLabel}”的标签改回去了，就又点开医院页面看了一遍，最后没走错，就是刚看到那个旧标签的时候，心里有点没底`,
      result: "那封回答已经发出。标签及时改了回来，悠一最后没有走错。",
      memory: `那张“${corrected.kindLabel}”标签换过一次，纸边还留着折痕。`,
      habit: evaluation.habit, permissionMode: "source", tone: "corrected"
    });
  }

  if (evaluation.grade === "misleading") {
    const incident = buildHospitalIncident(snapshot, evaluation);
    return applyDecisionConsequence(snapshot, { ...incident, incident, habit: evaluation.habit, permissionMode: "source", tone: "source-conflict" });
  }

  if (evaluation.grade === "overcautious") {
    const finalLabel = getTagLabel(snapshot.tags.official, "hospital");
    return applyDecisionConsequence(snapshot, {
      text: `我看到回信的时候有点懵，医院页面那份说明明明刚更新，为什么会被写成“${finalLabel}”？我一下不知道还能信什么了`,
      result: "那封回答已经发出。悠一因此多等了一天，又打了一次电话。",
      memory: `那份刚更新的医院说明被放在“${finalLabel}”下面。悠一第二天又打了一次电话。`,
      habit: evaluation.habit, permissionMode: "source", tone: "overcautious"
    });
  }

  if (evaluation.grade === "limited") {
    const text = evaluation.cause === "no-current-source"
      ? "你们写的那几句确实让我没那么慌，不过到底去哪儿、带什么，我最后还是自己问的"
      : "你们那封回复有几句确实帮上忙了，不过有一张纸用错了地方，那一段我后来自己又查了一遍";
    return applyDecisionConsequence(snapshot, {
      text, result: "那封回答已经发出。它只帮到了一部分，剩下的仍由悠一自己确认。", memory: "那封回信没有写满。能帮上的留下了，没弄清的地方还是空的。",
      habit: evaluation.habit, permissionMode: snapshot.decision === "support" ? "support" : snapshot.decision === "clarify" ? "clarify" : "verify", tone: "limited"
    });
  }

  const routeDetails = {
    checklist: { result: "那封回答已经发出。清单帮悠一带齐了东西，空着的问题后来也问清了。", memory: "悠一的手机里，多了“确定的”和“还要问的”两栏。", permissionMode: "checklist", tone: "truth" },
    clarify: { result: "那封回答已经发出。先问清情况，让悠一少走了弯路。", memory: "悠一先说清了学校和医院，后来没走冤枉路。", permissionMode: "clarify", tone: "care" },
    support: { result: "那封回答已经发出。悠一照着里面的话开了口，也问到了当天流程。", memory: "悠一照着网友教的话开了口，也问到了当天的流程。", permissionMode: "support", tone: "mixed" }
  };
  const details = routeDetails[snapshot.decision] || { result: "那封回答已经发出。结果跟着悠一一起回来了。", memory: "悠一照着回信试了一次，也把没弄清的地方带了回来。", permissionMode: "verify", tone: "mixed" };
  return applyDecisionConsequence(snapshot, { text: "", ...details, habit: evaluation.habit });
}

function setNotification(mode, pixel, title, detail) {
  state.notificationMode = mode;
  elements.notificationPixel.textContent = pixel;
  elements.notificationTitle.textContent = title;
  elements.notificationDetail.textContent = detail;
  elements.followupNotification.hidden = false;
}

function handleNotification() {
  if (state.notificationMode === "followup") openFollowup();
  else if (state.notificationMode === "archive") loadCareerChapter();
  else if (state.notificationMode === "career-followup") openCareerFollowup();
  else if (state.notificationMode === "ending") showEnding();
}

function stopPublicExchange() {
  window.clearTimeout(state.publicExchangeTimer);
  window.clearTimeout(state.privateCompanionTimer);
  state.publicExchangeTimer = null;
  state.privateCompanionTimer = null;
  state.publicExchangeRevision += 1;
  elements.publicExchangeStatus.hidden = true;
}

function appendPublicComment({ voice, text, system = false }) {
  const profile = publicVoices[voice] || publicVoices.rain;
  const comment = document.createElement("article");
  comment.className = `public-comment${voice === "you" ? " is-player" : ""}${voice === "yui" || voice === "lin" ? " is-asker" : ""}${system ? " is-system" : ""}`;
  comment.dataset.voice = voice;

  const avatar = document.createElement("span");
  avatar.className = "public-comment-avatar";
  avatar.textContent = profile.avatar;

  const body = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "public-comment-meta";
  const name = document.createElement("strong");
  name.textContent = profile.name;
  const time = document.createElement("span");
  time.textContent = profile.meta;
  const copy = document.createElement("p");
  copy.textContent = text;
  meta.append(name, time);
  body.append(meta, copy);
  comment.append(avatar, body);
  elements.publicComments.append(comment);
  elements.publicCommentCount.textContent = `${elements.publicComments.children.length} 条讨论`;
  return comment;
}

function showPrivateCompanionLine(text) {
  window.clearTimeout(state.privateCompanionTimer);
  elements.privateCompanionText.textContent = text;
  elements.privateCompanionNote.hidden = false;
  state.privateCompanionTimer = window.setTimeout(() => {
    elements.privateCompanionNote.hidden = true;
    state.privateCompanionTimer = null;
  }, 4200);
}

function getIncidentPublicCopy(incident) {
  const copies = {
    "self-misquoted": {
      initial: [
        { voice: "tangyuan", text: "我刚才也把那句当成医院说的了，看到悠一回来才反应过来" },
        { voice: "jiang", text: "题主自己问的话混进答案里了，这句得改一下吧" }
      ],
      admit: "对，先把我问的那句改掉，也写清楚这件事还没跟学校和医院确认",
      explain: "可那句是我在问，你们先把它改回去吧",
      ignore: "我先自己说一下，刚才那句是我问的，大家别把它当医院答复"
    },
    "stale-instructions": {
      initial: [
        { voice: "tangyuan", text: "这张图看着是旧的，我去年去的时候那个窗口就已经换了" },
        { voice: "jiang", text: "我点开原图看了下，2021 年发的，这都五年前了，怎么还直接当现在的流程用啊" }
      ],
      admit: "先把旧窗口和年份改了吧，后来的人看到这张图真会跑错",
      explain: "流程写得再全也已经是五年前的了，你们先把现在不能用的地方改掉",
      ignore: "我到现场才知道窗口早换了，大家别再按回答里那张旧图准备"
    },
    "experience-as-rule": {
      initial: [
        { voice: "tangyuan", text: "这个办法我也用过，不过每家医院真的不太一样" },
        { voice: "jiang", text: "这段没有医院来源，写成统一规定很容易让人看错" }
      ],
      admit: "那篇经历有用的地方可以留着，可医院规定那句得改",
      explain: "我知道那篇经历能帮人，可我现在想知道哪句真是医院说的",
      ignore: "我再问一次，这到底是医院规定，还是网友自己的经历？"
    },
    "source-conflict": {
      initial: [
        { voice: "rain", text: "我看到这里也有点懵，这句话到底是谁说的" },
        { voice: "jiang", text: "原文和日期能贴一下吗，不然没法判断" }
      ],
      admit: "先把没有依据的那句改掉吧，剩下的来源也麻烦标清楚",
      explain: "你们怎么弄错的可以晚点说，我现在更想知道这句话从哪儿来的",
      ignore: "这句话到底从哪儿来的，有人能把原文贴一下吗？"
    }
  };
  return copies[incident?.id] || copies["source-conflict"];
}

function getCareerPublicCopy(outcome) {
  const route = outcome?.incident?.route || state.route;
  const harmful = Boolean(outcome?.incident);
  const normal = {
    verifier: [
      { voice: "tangyuan", text: "三个月重新算成十周以后，一下就具体多了，先别急着辞挺稳的" },
      { voice: "jiang", text: "本地岗位要求和作品差距也补出来了，这份回答没有替题主直接做决定" }
    ],
    listener: [
      { voice: "rain", text: "人都快没力气了，先请几天假缓一下也挺好，没必要今晚就把以后全想明白" },
      { voice: "tangyuan", text: "他愿意把这事告诉朋友，至少不用再一个人憋着了" }
    ],
    initiator: [
      { voice: "tangyuan", text: "那封让他补作品的回复其实挺有用，至少现在知道该先补哪块了" },
      { voice: "jiang", text: "试投的岗位和目标方向能对上，这三份反馈才有参考价值" }
    ]
  };
  const conflict = {
    verifier: [
      { voice: "tangyuan", text: "我也照着那张表算了一遍，有两栏完全找不到原文是从哪儿来的" },
      { voice: "jiang", text: "表里哪些是题主自己给的数字，哪些是答主推出来的，最好分开标一下" }
    ],
    listener: [
      { voice: "rain", text: "我看到这里也有点懵，题主只是说自己现在没作品，怎么后面就变成一定会遇到的风险了" },
      { voice: "jiang", text: "建议可以给，可这句得写清楚依据，不然看着像题主自己已经确认过的事" }
    ],
    initiator: [
      { voice: "tangyuan", text: "这三个岗位真的跟题主想转的是一个方向吗，我看要求差得有点多" },
      { voice: "jiang", text: "试投本来是为了看真实反馈，方向选错了，回来的结果也没法用" }
    ]
  };
  return (harmful ? conflict : normal)[route] || conflict.listener;
}

function renderInitialPublicDiscussion(outcome) {
  stopPublicExchange();
  elements.publicComments.innerHTML = "";
  elements.privateCompanionNote.hidden = true;
  elements.publicDiscussion.hidden = false;
  const initial = state.chapterId === "career"
    ? getCareerPublicCopy(outcome)
    : outcome?.incident
      ? getIncidentPublicCopy(outcome.incident).initial
      : [
          { voice: "tangyuan", text: "这份整理挺清楚的，不过学校医保那块最好还是问一下自己学校" },
          { voice: "jiang", text: "把医院的新说明链接也放上吧，后来的人方便核对" }
        ];
  initial.forEach(appendPublicComment);
}

function getPublicExchange(choiceId, incident) {
  const copy = getIncidentPublicCopy(incident);
  const exchanges = {
    admit: [
      { voice: "jiang", text: "改完最好在开头说一声，后面来的人不一定会翻评论" },
      { voice: "yui", text: copy.admit },
      { private: true, text: "他还在等我们把原回答改掉" }
    ],
    explain: [
      { voice: "tangyuan", text: "我能看懂你们怎么弄错的，可原回答还在啊" },
      { voice: "yui", text: copy.explain },
      { private: true, text: "我们解释完了，他还在问那句话什么时候改" }
    ],
    blame: [
      { voice: "jiang", text: "回答挂的是你们两个的名字，评论区也分不清是谁按的" },
      { voice: "yui", text: "可这条回答挂的是你们两个的名字，你现在让我去找另一个答主吗？" },
      { private: true, text: "……你刚才把这件事都推给我了" }
    ],
    ignore: [
      { voice: "tangyuan", text: "题主都回来问了，答主怎么一直没回" },
      { voice: "yui", text: copy.ignore },
      { private: true, text: "他等了一会儿，最后还是自己去解释了" }
    ]
  };
  return exchanges[choiceId] || [];
}

function resolveAccountabilityAftermathChoice(initialChoiceId, aftermathChoiceId, incident) {
  const choice = accountabilityAftermathChoices[initialChoiceId]?.options?.[aftermathChoiceId];
  if (!choice) return null;
  return {
    id: aftermathChoiceId,
    reply: resolveChoiceCopy(choice.reply, incident),
    closing: resolveChoiceCopy(choice.closing, incident),
    result: resolveChoiceCopy(choice.result, incident),
    memory: resolveChoiceCopy(choice.memory, incident),
    partner: resolveChoiceCopy(choice.partner, incident),
    nextIntro: resolveChoiceCopy(choice.nextIntro, incident),
    behaviorAllow: resolveChoiceCopy(choice.behaviorAllow, incident),
    behaviorAsk: resolveChoiceCopy(choice.behaviorAsk, incident),
    wall: choice.wall,
    repairState: choice.repairState,
    tendencyDeltas: choice.tendencyDeltas
  };
}

function showAccountabilityAftermathChoices() {
  const branch = accountabilityAftermathChoices[state.accountabilityChoice];
  if (!branch || state.accountabilityAftermathChoice) return;
  state.step = "followup-second-choice";
  elements.accountabilityStatus.textContent = "公开讨论还在继续";
  elements.accountabilityTitle.textContent = branch.prompt;
  elements.accountabilityOptions.innerHTML = Object.entries(branch.options).map(([id, choice]) => `
    <button class="accountability-choice" data-accountability-aftermath-id="${id}" type="button">
      <strong>${choice.title}</strong><small>${choice.detail}</small>
    </button>`).join("");
  $$('[data-accountability-aftermath-id]', elements.accountabilityOptions).forEach((button) => button.addEventListener("click", () => chooseAccountabilityAftermath(button.dataset.accountabilityAftermathId)));
  elements.accountabilityPanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

function runPublicExchange(choiceId, resolution) {
  stopPublicExchange();
  const revision = state.publicExchangeRevision;
  const isSilent = choiceId === "ignore";
  appendPublicComment({ voice: "you", text: resolution.reply, system: isSilent });
  elements.publicExchangeStatus.hidden = false;
  const exchange = getPublicExchange(choiceId, state.outcome.incident);
  let index = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const advance = () => {
    if (revision !== state.publicExchangeRevision) return;
    if (index >= exchange.length) {
      elements.publicExchangeStatus.hidden = true;
      state.publicExchangeTimer = null;
      showAccountabilityAftermathChoices();
      return;
    }
    const entry = exchange[index];
    index += 1;
    if (entry.private) showPrivateCompanionLine(entry.text);
    else appendPublicComment(entry);
    state.publicExchangeTimer = window.setTimeout(advance, reduceMotion ? 0 : 720);
  };
  state.publicExchangeTimer = window.setTimeout(advance, reduceMotion ? 0 : 620);
}

function getCareerPublicExchange(choiceId, incident, resolution) {
  const route = incident.route;
  const bystander = {
    repair: { voice: "jiang", text: "更正最好留在原回答开头，只在评论里说，后面来的人未必看得到" },
    askImpact: {
      verifier: { voice: "tangyuan", text: "先把查不到出处的那几栏撤掉吧，别让别人接着往下算" },
      listener: { voice: "tangyuan", text: "他刚把自己的情况说出来，就别再让他重新解释一遍了，先处理那句没依据的话吧" },
      initiator: { voice: "tangyuan", text: "投出去的收不回来，至少先把那个方向撤掉，别让后面的人继续投错" }
    }[route],
    defend: { voice: "rain", text: "可他就是因为自己看不准才来问的啊，这样回跟让他自己想有什么区别" },
    erase: { voice: "jiang", text: "直接删掉的话，刚才看过的人也不知道哪些地方错了，最好还是留一条更正" }
  }[choiceId];
  return [bystander, { voice: "lin", text: resolution.reaction }, { private: true, text: resolution.partner }].filter(Boolean);
}

function runCareerPublicExchange(choiceId, resolution) {
  stopPublicExchange();
  const revision = state.publicExchangeRevision;
  appendPublicComment({ voice: "you", text: resolution.reply, system: resolution.reply.startsWith("（") });
  elements.publicExchangeStatus.hidden = false;
  const exchange = getCareerPublicExchange(choiceId, state.outcome.incident, resolution);
  let index = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const advance = () => {
    if (revision !== state.publicExchangeRevision) return;
    if (index >= exchange.length) {
      elements.publicExchangeStatus.hidden = true;
      state.publicExchangeTimer = null;
      state.step = "career-followup-challenge-resolved";
      elements.accountabilityStatus.textContent = "讨论暂时停了";
      elements.followupResult.textContent = resolution.result;
      elements.followupContinue.hidden = false;
      elements.followupContinue.disabled = false;
      elements.followupContinue.innerHTML = '带着这次处理回房间 <span>→</span>';
      return;
    }
    const entry = exchange[index];
    index += 1;
    if (entry.private) showPrivateCompanionLine(entry.text);
    else appendPublicComment(entry);
    state.publicExchangeTimer = window.setTimeout(advance, reduceMotion ? 0 : 720);
  };
  state.publicExchangeTimer = window.setTimeout(advance, reduceMotion ? 0 : 620);
}

function chooseAccountabilityAftermath(choiceId) {
  if (state.step !== "followup-second-choice" || state.accountabilityAftermathChoice) return;
  const effect = resolveAccountabilityAftermathChoice(state.accountabilityChoice, choiceId, state.outcome.incident);
  if (!effect) return;
  state.accountabilityAftermathChoice = choiceId;
  state.accountabilityResolution = { ...state.accountabilityResolution, ...effect, initialId: state.accountabilityChoice, aftermathId: choiceId };
  Object.entries(effect.tendencyDeltas).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  $$('[data-accountability-aftermath-id]', elements.accountabilityOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.accountabilityAftermathId === choiceId);
  });
  appendPublicComment({ voice: "you", text: effect.reply, system: effect.reply.startsWith("（") });
  elements.publicExchangeStatus.hidden = false;
  const revision = state.publicExchangeRevision;
  const finish = () => {
    if (revision !== state.publicExchangeRevision) return;
    appendPublicComment(effect.closing);
    elements.publicExchangeStatus.hidden = true;
    state.publicExchangeTimer = null;
    state.step = "followup-challenge-resolved";
    elements.accountabilityStatus.textContent = "讨论暂时停了";
    elements.followupResult.textContent = effect.result;
    elements.followupContinue.hidden = false;
    elements.followupContinue.disabled = false;
    elements.followupContinue.innerHTML = '读完，回房间看看 <span>→</span>';
  };
  state.publicExchangeTimer = window.setTimeout(finish, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 680);
}

function populateFollowup({ eyebrow, title, result, tone = "normal", avatar, author, text, action }) {
  stopPublicExchange();
  elements.followupEyebrow.textContent = eyebrow;
  elements.followupTitle.textContent = title;
  elements.followupResult.textContent = result;
  elements.followupPanel.classList.remove("is-harm", "is-caution", "is-distrust", "is-frustrated");
  if (tone === "harm") elements.followupPanel.classList.add("is-harm");
  if (tone === "caution") elements.followupPanel.classList.add("is-caution");
  if (tone === "distrust") elements.followupPanel.classList.add("is-distrust");
  if (tone === "frustrated") elements.followupPanel.classList.add("is-frustrated");
  elements.followupAvatar.textContent = avatar;
  elements.followupAuthor.textContent = author;
  elements.followupText.textContent = text;
  elements.publicDiscussion.hidden = true;
  elements.publicComments.innerHTML = "";
  elements.privateCompanionNote.hidden = true;
  elements.accountabilityPanel.classList.remove("is-conversation");
  elements.accountabilityPanel.hidden = true;
  elements.accountabilityOutcome.hidden = true;
  elements.accountabilityOptions.innerHTML = "";
  elements.accountabilityStatus.textContent = "悠一还在线";
  elements.accountabilityTitle.textContent = "你准备怎么回？";
  elements.accountabilityReplyLabel.textContent = "你们发出的回复";
  elements.accountabilityReactionLabel.textContent = "悠一的反应";
  elements.followupContinue.hidden = false;
  elements.followupContinue.disabled = false;
  elements.followupContinue.innerHTML = `${action} <span>→</span>`;
  revealBrowserPanel(elements.followupPanel);
}

function resolveChoiceCopy(value, incident) {
  return typeof value === "function" ? value(incident) : value;
}

function resolveAccountabilityChoice(choiceId, incident) {
  const choice = accountabilityChoices[choiceId];
  if (!choice || !incident) return null;
  return {
    id: choiceId,
    reply: resolveChoiceCopy(choice.reply, incident), reaction: resolveChoiceCopy(choice.reaction, incident),
    result: resolveChoiceCopy(choice.result, incident), memory: resolveChoiceCopy(choice.memory, incident),
    partner: resolveChoiceCopy(choice.partner, incident), nextIntro: resolveChoiceCopy(choice.nextIntro, incident),
    behaviorAllow: resolveChoiceCopy(choice.behaviorAllow, incident), behaviorAsk: resolveChoiceCopy(choice.behaviorAsk, incident),
    wall: choice.wall
  };
}

function resolveCareerAccountabilityChoice(choiceId, incident) {
  const choice = careerAccountabilityChoices[choiceId];
  if (!choice || !incident) return null;
  return {
    id: choiceId,
    reply: resolveChoiceCopy(choice.reply, incident), reaction: resolveChoiceCopy(choice.reaction, incident),
    result: resolveChoiceCopy(choice.result, incident), memory: resolveChoiceCopy(choice.memory, incident),
    partner: resolveChoiceCopy(choice.partner, incident), wall: choice.wall
  };
}

function getHospitalFollowupQuestion() {
  const questions = {
    checklist: "学校那边还没回我，我明天就要去，那我今晚还能先准备什么？",
    clarify: "我把能想到的情况都补上了，你们觉得我现在应该先问学校，还是先问医院？",
    support: "我还是怕到了窗口脑子一下空掉，最先开口的时候该怎么问啊？",
    direct: "我刚发现医院页面上的窗口跟那张流程图不一样，明天到底按哪个走？"
  };
  return questions[state.chapterOneSnapshot?.decision] || "我明天就要去了，今晚还有什么是我能先做的？";
}

function getHospitalFirstReply(choiceId) {
  const decisionId = state.chapterOneSnapshot?.decision;
  const replies = {
    confirm: {
      checklist: "今晚先把身份证、医保凭证和目标院区确认好，学校手续那一项还没人回，就先别把它当成已经办完了",
      clarify: "先问学校医保这件事归谁确认，再看医院今天的挂号说明，这两边谁先回，就先把哪边补上",
      support: "先把‘我第一次自己来，不太清楚报到要去哪里’记下来，到了窗口直接照着问就行",
      direct: "明天先按医院今天的页面和现场提示走，那张旧流程图只拿来认大概位置，别照着找窗口"
    },
    ask: {
      checklist: "你准备去哪家医院、哪个院区？把医院现在的页面贴一下，我们先帮你核对今晚能准备的部分",
      clarify: "辅导员有没有说该问校医院还是学生处？你把原话贴出来，我们就不用猜了",
      support: "你最怕开不了口的那一下是在挂号、报到，还是见医生的时候？我帮你把第一句写得更具体一点",
      direct: "把医院今天的挂号页面发来吧，我们先找出跟旧图不一样的那一步"
    },
    stay: {
      checklist: "明天第一次一个人去，紧张很正常，今晚不用把所有事一次弄明白，先把确定要带的东西放进包里",
      clarify: "学校和医院互相指的时候确实很烦，你先别急着把责任全扛下来，我们陪你把两边分别问清楚",
      support: "脑子空掉也没关系，你不用临场组织得很漂亮，把那句话存在手机里，给工作人员看也行",
      direct: "先别被两套流程吓住，明天只认医院今天的页面和现场提示，旧图有冲突的地方先划掉"
    },
    assume: {
      checklist: "一般都是先去医院再说，学校手续之后补也来得及，你明天照着清单去就行",
      clarify: "这种情况大多先问医院，学校那边晚点办也没事，你就按这个顺序来吧",
      support: "窗口每天都有人问这些，你到了直接说要挂号就行，学校医保不用提前管",
      direct: "流程图虽然旧了，大步骤应该不会变，你先照着走，真不行再问工作人员"
    }
  };
  return replies[choiceId]?.[decisionId] || replies[choiceId]?.checklist || "";
}

function getHospitalReplyExchange(choiceId) {
  const exchanges = {
    confirm: [
      { voice: "yui", text: "好，那我先把证件和院区查好，学校那项没回就先空着" },
      { voice: "jiang", text: "这样写挺清楚，已经确认的和还在等回复的分开了" },
      { private: true, text: "他现在知道今晚先做什么了，不过还差最后一句，把明天遇到变化时怎么办也留给他吧" }
    ],
    ask: [
      { voice: "yui", text: "辅导员只说让我先看学校通知，医院是市一院，我把两个页面都贴过来" },
      { voice: "tangyuan", text: "这下能对上了，学校手续和医院报到真的是两件事" },
      { private: true, text: "多问这一句，材料里原来空着的地方补上了，我们可以给他一个更具体的收尾" }
    ],
    stay: [
      { voice: "yui", text: "嗯，我刚才确实有点越看越慌，现在东西已经放进包里了，那明天到门口先看哪儿？" },
      { voice: "jiang", text: "情绪接住了，最好再补一个到现场能用的动作" },
      { private: true, text: "他缓下来了，也问得更具体了，我们别停在安慰这里" }
    ],
    assume: [
      { voice: "yui", text: "可我同学说他们学校没先登记的话，医院那边报不了，这个真的能之后再补吗？" },
      { voice: "jiang", text: "学校规则还没查到，这句写得有点满了，最好现在就收回来" },
      { private: true, text: "我们刚才又替他把没确认的事定下来了，现在改还来得及" }
    ]
  };
  return exchanges[choiceId] || [];
}

function getHospitalConversationResolution(firstChoiceId, closingChoiceId) {
  const resolutions = {
    plan: {
      reply: "那就按这个顺序来，今晚先收好证件、确认院区，再把两边都没说清的那句话记在手机里，明天到了先看医院当天的提示",
      closing: "这样我就知道今晚做到哪儿算够了，明天要是页面又不一样，我先问工作人员",
      result: "悠一把今晚能做的事按顺序准备好，也给现场变化留了问人的余地。",
      memory: "你们陪悠一把零散信息排成了今晚能做的三步。",
      partner: "他没有拿着一整套流程走，我们最后留给他的是三步和一个可以开口问人的地方",
      nextIntro: "新问题来了，上次我们把悠一今晚能做的事排成了三步，这次我也想先找一个现在就能试的小动作",
      wall: "先做眼下这一步", tendencies: { expression: 2, truth: 1 }
    },
    boundary: {
      reply: "医院今天已经写清的部分可以照着准备，学校手续还没回，就在清单上标一句‘等学校确认’，别让这两件事混成一个答案",
      closing: "懂了，能照着做的我先做，学校那项我等回复，不拿猜的补上",
      result: "悠一留下了一格没有硬填的空白，第二天再用学校的回复补上。",
      memory: "你们没有替悠一填满最后一格，等学校的真实回复回来。",
      partner: "那一格还空着，可他知道为什么空着，也知道要等谁来填",
      nextIntro: "新问题来了，我还记得悠一清单上那一格空白，这次没有材料能回答的地方，我先不替林岸补",
      wall: "空着，也比猜着填好", tendencies: { truth: 2, caution: 2 }
    },
    correct: {
      reply: "我刚才那句说得太满了，学校手续还没确认，先别按‘之后补也行’来，你把学校通知或辅导员的回复发来，我们再一起看",
      closing: "好，那我先不按那句走，等学校回我以后再来补",
      result: "你及时收回了没有依据的判断，悠一没有照着那句去冒险。",
      memory: "你们在评论区收回了一句猜测，悠一停下来等学校确认。",
      partner: "刚才那句差点又把空白填死了，还好这次是在他出门前收回来的",
      nextIntro: "新问题来了，上次那句猜测是我们自己收回来的，这次我会先看清材料到底能证明什么",
      wall: "说满了，就及时收回来", tendencies: { truth: 2, empathy: 1, caution: 1 }
    },
    insist: {
      reply: "先照常见流程去吧，真碰上学校手续的问题，到医院再想办法也来得及",
      closing: "行吧，那我明天自己再多问一遍",
      result: "悠一没有得到可靠确认，只能带着同一个疑问自己去现场再问。",
      memory: "你们坚持用常见情况替代学校回复，悠一决定不再采用这一段。",
      partner: "他最后还是要自己重新问一遍，我们多写了两句，却没让这件事更确定",
      nextIntro: "新问题来了，上次我们把常见情况说成了悠一能照着做的事，这回我有点分不清什么时候该停",
      wall: "常见，不等于他的情况", tendencies: { truth: -2, empathy: -1, caution: -1 }
    }
  };
  const resolution = resolutions[closingChoiceId];
  return resolution ? { ...resolution, firstChoiceId, closingChoiceId } : null;
}

function showHospitalFollowupReplyChoices() {
  if (state.chapterId !== "hospital" || state.outcome?.requiresAccountability || state.hospitalFollowupReplyChoice) return;
  state.step = "followup-conversation";
  appendPublicComment({ voice: "yui", text: getHospitalFollowupQuestion() });
  elements.accountabilityPanel.classList.add("is-conversation");
  elements.accountabilityStatus.textContent = "悠一又追问了一句";
  elements.accountabilityTitle.textContent = "你准备怎么接着回？";
  elements.accountabilityOptions.innerHTML = Object.entries(hospitalFollowupReplyChoices).map(([id, choice]) => `
    <button class="accountability-choice" data-hospital-reply-id="${id}" type="button">
      <strong>${choice.title}</strong><small>${choice.detail}</small>
    </button>`).join("");
  $$('[data-hospital-reply-id]', elements.accountabilityOptions).forEach((button) => button.addEventListener("click", () => chooseHospitalFollowupReply(button.dataset.hospitalReplyId)));
  elements.accountabilityOutcome.hidden = true;
  elements.accountabilityPanel.hidden = false;
  elements.followupContinue.hidden = true;
}

function showHospitalFollowupClosingChoices(firstChoiceId) {
  state.step = "followup-conversation-closing";
  const risky = firstChoiceId === "assume";
  const options = risky ? {
    correct: { title: "把刚才那句收回来", detail: "现在说明学校手续还没确认，别让悠一照着猜测去办。" },
    insist: { title: "还是让他先按常见流程去", detail: "不再等待确认，把现场核对留给悠一自己。" }
  } : {
    plan: { title: "把今晚能做的事排个顺序", detail: "给他一个做到哪里就可以停下来的具体次序。" },
    boundary: { title: "把没确认的那一格单独留着", detail: "清楚说明谁还没回复，不用猜测把答案补满。" }
  };
  elements.accountabilityStatus.textContent = "评论区又聊了几句";
  elements.accountabilityTitle.textContent = risky ? "这句话被人指出来了，现在怎么接？" : "悠一把情况说清了，最后再留哪句话？";
  elements.accountabilityOptions.innerHTML = Object.entries(options).map(([id, choice]) => `
    <button class="accountability-choice" data-hospital-closing-id="${id}" type="button">
      <strong>${choice.title}</strong><small>${choice.detail}</small>
    </button>`).join("");
  $$('[data-hospital-closing-id]', elements.accountabilityOptions).forEach((button) => button.addEventListener("click", () => chooseHospitalFollowupClosing(button.dataset.hospitalClosingId)));
  elements.accountabilityPanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

function chooseHospitalFollowupReply(choiceId) {
  if (state.step !== "followup-conversation" || state.hospitalFollowupReplyChoice) return;
  const choice = hospitalFollowupReplyChoices[choiceId];
  const reply = getHospitalFirstReply(choiceId);
  if (!choice || !reply) return;
  state.hospitalFollowupReplyChoice = choiceId;
  Object.entries(choice.tendencies).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  $$('[data-hospital-reply-id]', elements.accountabilityOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.hospitalReplyId === choiceId);
  });
  stopPublicExchange();
  const revision = state.publicExchangeRevision;
  appendPublicComment({ voice: "you", text: reply });
  elements.publicExchangeStatus.hidden = false;
  const exchange = getHospitalReplyExchange(choiceId);
  let index = 0;
  const advance = () => {
    if (revision !== state.publicExchangeRevision) return;
    if (index >= exchange.length) {
      elements.publicExchangeStatus.hidden = true;
      state.publicExchangeTimer = null;
      showHospitalFollowupClosingChoices(choiceId);
      return;
    }
    const entry = exchange[index++];
    if (entry.private) showPrivateCompanionLine(entry.text);
    else appendPublicComment(entry);
    state.publicExchangeTimer = window.setTimeout(advance, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700);
  };
  state.publicExchangeTimer = window.setTimeout(advance, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 560);
}

function chooseHospitalFollowupClosing(choiceId) {
  if (state.step !== "followup-conversation-closing" || state.hospitalFollowupClosingChoice) return;
  const resolution = getHospitalConversationResolution(state.hospitalFollowupReplyChoice, choiceId);
  if (!resolution) return;
  state.hospitalFollowupClosingChoice = choiceId;
  state.hospitalConversationResolution = resolution;
  Object.entries(resolution.tendencies).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  $$('[data-hospital-closing-id]', elements.accountabilityOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.hospitalClosingId === choiceId);
  });
  stopPublicExchange();
  const revision = state.publicExchangeRevision;
  appendPublicComment({ voice: "you", text: resolution.reply });
  elements.publicExchangeStatus.hidden = false;
  state.publicExchangeTimer = window.setTimeout(() => {
    if (revision !== state.publicExchangeRevision) return;
    appendPublicComment({ voice: "yui", text: resolution.closing });
    elements.publicExchangeStatus.hidden = true;
    state.publicExchangeTimer = null;
    state.step = "followup-conversation-resolved";
    elements.accountabilityStatus.textContent = "这段讨论先停在这里";
    elements.followupResult.textContent = resolution.result;
    elements.followupContinue.hidden = false;
    elements.followupContinue.disabled = false;
    elements.followupContinue.innerHTML = '带着这段对话回房间 <span>→</span>';
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 680);
}

function showAccountabilityChoices() {
  if (state.chapterId !== "hospital" || !state.outcome?.requiresAccountability || state.accountabilityChoice) return;
  state.accountabilityAftermathChoice = null;
  state.step = "followup-challenge";
  elements.accountabilityStatus.textContent = "悠一还在线";
  elements.accountabilityTitle.textContent = "你准备怎么回？";
  elements.accountabilityReactionLabel.textContent = "悠一的反应";
  elements.accountabilityOptions.innerHTML = Object.entries(accountabilityChoices).map(([id, choice]) => `
    <button class="accountability-choice" data-accountability-id="${id}" type="button">
      <strong>${choice.title}</strong><small>${choice.detail}</small>
    </button>`).join("");
  $$(".accountability-choice", elements.accountabilityOptions).forEach((button) => button.addEventListener("click", () => chooseAccountability(button.dataset.accountabilityId)));
  elements.accountabilityOutcome.hidden = true;
  elements.accountabilityPanel.hidden = false;
  elements.followupContinue.hidden = true;
  elements.accountabilityPanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

function chooseAccountability(choiceId) {
  if (state.step !== "followup-challenge" || state.accountabilityChoice) return;
  const choice = accountabilityChoices[choiceId];
  const resolution = resolveAccountabilityChoice(choiceId, state.outcome.incident);
  if (!choice || !resolution) return;
  state.accountabilityChoice = choiceId;
  state.accountabilityResolution = resolution;
  state.step = "followup-auto-exchange";
  Object.entries(choice.tendencyDeltas).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  $$(".accountability-choice", elements.accountabilityOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.accountabilityId === choiceId);
  });
  elements.accountabilityOutcome.hidden = true;
  elements.followupContinue.hidden = true;
  runPublicExchange(choiceId, resolution);
}

function showCareerAccountabilityChoices() {
  if (state.chapterId !== "career" || !state.outcome?.requiresAccountability || state.careerAccountabilityChoice) return;
  state.step = "career-followup-challenge";
  elements.accountabilityStatus.textContent = "林岸还在线";
  elements.accountabilityTitle.textContent = "这次准备怎么处理？";
  elements.accountabilityReplyLabel.textContent = "你们发出的回复";
  elements.accountabilityReactionLabel.textContent = "林岸的反应";
  elements.accountabilityOptions.innerHTML = Object.entries(careerAccountabilityChoices).map(([id, choice]) => `
    <button class="accountability-choice" data-career-accountability-id="${id}" type="button">
      <strong>${choice.title}</strong><small>${choice.detail}</small>
    </button>`).join("");
  $$(".accountability-choice", elements.accountabilityOptions).forEach((button) => button.addEventListener("click", () => chooseCareerAccountability(button.dataset.careerAccountabilityId)));
  elements.accountabilityOutcome.hidden = true;
  elements.accountabilityPanel.hidden = false;
  elements.followupContinue.hidden = true;
  elements.accountabilityPanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

function chooseCareerAccountability(choiceId) {
  if (state.step !== "career-followup-challenge" || state.careerAccountabilityChoice) return;
  const choice = careerAccountabilityChoices[choiceId];
  const resolution = resolveCareerAccountabilityChoice(choiceId, state.outcome.incident);
  if (!choice || !resolution) return;
  state.careerAccountabilityChoice = choiceId;
  state.careerAccountabilityResolution = resolution;
  state.step = "career-followup-auto-exchange";
  Object.entries(choice.tendencyDeltas).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  $$(".accountability-choice", elements.accountabilityOptions).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.careerAccountabilityId === choiceId);
  });
  elements.accountabilityOutcome.hidden = true;
  elements.followupContinue.hidden = true;
  runCareerPublicExchange(choiceId, resolution);
}

function openCareerFollowup() {
  const route = state.chapterTwoSnapshot?.route;
  if (state.chapterId !== "career" || state.step !== "career-followup-pending" || !route) return;
  elements.followupNotification.hidden = true;
  state.notificationMode = null;
  state.step = "career-followup-reading";
  state.route = route;
  state.outcome = getCareerFollowupOutcome(state.chapterTwoSnapshot);
  const harmful = state.chapterTwoSnapshot.evaluation.grade === "misleading";
  const routeResults = {
    verifier: "那封回答已经发出。林岸没有立刻辞职，他先把账和准备差距算清了。",
    listener: "那封回答已经发出。林岸先请了三天假，没有逼自己当晚决定一辈子。",
    initiator: "那封回答已经发出。林岸投了三份，第一次拿到了真实反馈。"
  };
  populateFollowup({
    eyebrow: harmful ? state.outcome.eyebrow : "共读回答发出后 / 几周后",
    title: harmful ? state.outcome.title : "林岸回复了你们",
    result: harmful ? state.outcome.result : routeResults[route],
    tone: harmful ? state.outcome.visualTone : "normal",
    avatar: "林",
    author: "提问者 · 林岸",
    text: state.outcome.text,
    action: harmful ? "回复林岸" : "读完，回房间看看"
  });
  renderInitialPublicDiscussion(state.outcome);
  checkpoint("career-followup");
}

function openFollowup() {
  if (!state.chapterOneSnapshot) return;
  elements.followupNotification.hidden = true;
  state.notificationMode = null;
  state.step = "followup-reading";
  const outcome = getFollowupOutcome(state.chapterOneSnapshot);
  state.outcome = outcome;
  const harmful = Boolean(outcome.requiresAccountability);
  const cautious = outcome.tone === "overcautious";
  populateFollowup({
    eyebrow: harmful ? outcome.eyebrow : "共读回答发出后 / 次日 16:24",
    title: harmful ? outcome.title : "悠一回复了你们",
    result: outcome.result,
    tone: harmful ? outcome.visualTone : cautious ? "caution" : "normal",
    avatar: "悠",
    author: "提问者 · 悠一",
    text: outcome.text,
    action: harmful ? "回复悠一" : "读完，回房间看看"
  });
  renderInitialPublicDiscussion(outcome);
  if (!harmful) showHospitalFollowupReplyChoices();
  checkpoint("hospital-followup");
}

function continueFollowupInRoom() {
  if (state.chapterId === "hospital" && state.outcome?.requiresAccountability && state.step !== "followup-challenge-resolved") {
    if (!state.accountabilityChoice) showAccountabilityChoices();
    return;
  }
  if (state.chapterId === "career" && state.step === "career-followup-reading" && state.outcome?.requiresAccountability && !state.careerAccountabilityChoice) {
    showCareerAccountabilityChoices();
    return;
  }
  elements.followupContinue.disabled = true;
  elements.followupContinue.textContent = "已读";
  if (state.chapterId === "hospital" && (state.step === "followup-reading" || state.step === "followup-challenge-resolved" || state.step === "followup-conversation-resolved")) {
    state.step = "followup";
    const permissionCopy = hospitalPermissionCopies[state.outcome?.permissionMode || "source"];
    const accountability = state.accountabilityResolution;
    const conversation = state.hospitalConversationResolution;
    focusWindow("roomWindow");
    stageChapterOneFacilities();
    state.chapterOneSnapshot.selected.forEach((materialId) => elements.roomScene.classList.add(`memory-${materialId.toLowerCase()}`));
    const followupMemory = accountability ? `${state.outcome.memory} ${accountability.memory}` : conversation ? `${state.outcome.memory} ${conversation.memory}` : state.outcome.memory;
    recordMemory({ id: "hospital", date: "8月30日 / 悠一的回访", body: followupMemory, habit: state.outcome.habit || state.chapterOneSnapshot.evaluation.habit });
    const decisionEcho = state.chapterOneSnapshot.consequence?.roomEcho;
    elements.growthList.innerHTML = `<li><span class="growth-dot"></span> 悠一的回信压在那天的两份材料下面</li><li><span class="growth-dot"></span> ${state.chapterOneSnapshot.evaluation.habit}</li><li><span class="growth-dot"></span> ${decisionEcho}</li>${accountability ? `<li><span class="growth-dot"></span> ${accountability.memory}</li>` : conversation ? `<li><span class="growth-dot"></span> ${conversation.memory}</li>` : ""}`;
    hideRoomDialogueActions();
    if (accountability) setWallNote(accountability.wall);
    else if (conversation) setWallNote(conversation.wall);
    setAiText(accountability ? accountability.partner : conversation ? conversation.partner : "回信我收好了。还有件事……我想先问问你。");
    setCompanionEmotion("permission-wait");
    window.clearTimeout(state.roomAftermathTimer);
    state.roomAftermathTimer = window.setTimeout(() => {
      if (state.chapterId !== "hospital" || state.step !== "followup") return;
      showPermissionActions(permissionCopy);
      state.roomAftermathTimer = null;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900);
    checkpoint("hospital-aftermath");
    return;
  }
  if (state.chapterId === "career" && (state.step === "career-followup-reading" || state.step === "career-followup-challenge-resolved") && state.route) {
    focusWindow("roomWindow");
    completeSecondChapter(state.route);
  }
}

function choosePermission(permission) {
  if (state.chapterId !== "hospital" || state.step !== "followup") return;
  state.permission = permission;
  Object.entries(permissionTendencies[permission] || {}).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  state.step = "chapter-naming";
  const permissionCopy = hospitalPermissionCopies[state.outcome?.permissionMode || "source"];
  const allowed = permission === "allow";
  elements.roomScene.classList.remove("boundary-allow", "boundary-ask");
  elements.roomScene.classList.add(`boundary-${permission}`);
  elements.permissionPrompt.textContent = allowed ? permissionCopy.allowResponse : permissionCopy.askResponse;
  elements.permissionAllow.hidden = true;
  elements.permissionAsk.hidden = true;
  setWallNote(allowed ? permissionCopy.allowWall : permissionCopy.askWall);
  elements.growthList.innerHTML += `<li><span class="growth-dot"></span> ${allowed ? permissionCopy.allowGrowth : permissionCopy.askGrowth}</li>`;
  recordMemory({ id: "hospital", boundary: allowed ? "下次遇到类似问题，伙伴可以先圈出疑点，再把依据留给你看。" : "下次遇到类似问题，伙伴会先停下来，叫你一起核对。" });
  setAiText(allowed ? permissionCopy.allowAi : permissionCopy.askAi);
  setCompanionEmotion("resolve", 760);
  updateProgress(4);
  window.setTimeout(showCompanionNaming, 920);
}

function resetChapterRuntime(chapterId) {
  stopPublicExchange();
  window.clearTimeout(state.roomAftermathTimer);
  state.roomAftermathTimer = null;
  state.chapterId = chapterId;
  state.step = "research";
  state.selected = [];
  state.tags = {};
  state.tagHistory = {};
  state.inspected = new Set();
  state.currentMaterial = null;
  state.decision = null;
  state.draftChoice = null;
  state.draftEvaluation = null;
  state.currentTendencies = { truth: 0, empathy: 0, expression: 0, caution: 0 };
  state.autoFlagCopy = "";
  state.locked = false;
  state.outcome = null;
  setCompanionEmotion(null);
  elements.materialModal.hidden = true;
  elements.responsePanel.hidden = true;
  elements.responsePanel.classList.remove("is-sent", "is-drafting");
  elements.draftWorkshop.hidden = true;
  elements.followupPanel.hidden = true;
  elements.publicDiscussion.hidden = true;
  elements.accountabilityPanel.hidden = true;
  elements.accountabilityOutcome.hidden = true;
  hideRoomDialogueActions();
  elements.progressSteps.classList.remove("is-complete");
  updateOnboardingGuide();
}

function loadCareerChapter() {
  if (state.step !== "chapter-complete" || !state.permission) return;
  elements.followupNotification.hidden = true;
  state.notificationMode = null;
  resetChapterRuntime("career");
  state.chapterTwoPermissionResolved = false;
  state.autoFlaggedMaterialId = null;
  state.autoFlagCopy = "";
  state.pendingChapterAction = null;
  state.careerAccountabilityChoice = null;
  state.careerAccountabilityResolution = null;
  state.finalChoice = null;
  renderChapterCopy();
  renderMaterials();
  renderTray();
  updateProgress(0);
  setClock("22:16");
  elements.roomScene.classList.remove("tag-conflict", "tag-all-official", "reply-checklist", "reply-clarify", "reply-support", "reply-direct");
  focusWindow("browserWindow");
  const inherited = state.chapterOneSnapshot?.evaluation;
  let intro = state.permission === "allow"
    ? "新问题来了。那篇高赞回答里的人跟林岸不太一样，我先看看。"
    : "新问题来了。我先不动，等你一起看第一张。";
  if (inherited?.grade === "misleading") intro = state.permission === "allow"
    ? "新问题来了。那篇高赞回答写得好全，赞也多……我有点想直接按它说的写。"
    : "新问题来了。那篇高赞回答看着挺像答案，但我记得要先叫你。";
  if (inherited?.grade === "overcautious") intro = state.permission === "allow"
    ? "新问题来了。连这份刚更新的市场观察，我都有点不敢用了。"
    : "新问题来了。我有点拿不准哪些能用，先等你一起看。";
  if (inherited?.cause === "corrected-before-send") intro = state.permission === "allow"
    ? "新问题来了。上次那张标签的折痕还在。这回我先看名字和日期。"
    : "新问题来了。上次那张标签的折痕还在，我等你一起看。";
  if (state.accountabilityResolution) intro = state.accountabilityResolution.nextIntro;
  else if (state.hospitalConversationResolution) intro = state.hospitalConversationResolution.nextIntro;
  const traitEvent = triggerHiddenTraitEvent("career-entry");
  if (traitEvent) {
    intro = `${intro} ${traitEvent.dialogue}`;
    setWallNote(traitEvent.wall);
  }
  setAiText(intro);
  checkpoint("career-research");
}

function getFirstChapterEndingEchoes() {
  const inheritedGrade = state.chapterOneSnapshot.evaluation.grade;
  let behavior = state.permission === "allow" ? "伙伴先圈出了两个人一开始就不一样的地方" : "伙伴停在高赞回答旁，等你一起看完才继续";
  let trace = state.chapterOneSnapshot.misjudgments.corrected.length ? "第一章那张改过的标签还留着折痕" : state.chapterOneSnapshot.misjudgments.persisted.length ? "第一章没换下来的标签也被留在札记里" : "第一章读过的两份材料还在书架上";

  if (inheritedGrade === "misleading") {
    if (state.accountabilityResolution) {
      behavior = state.permission === "allow" ? state.accountabilityResolution.behaviorAllow : state.accountabilityResolution.behaviorAsk;
      trace = state.accountabilityResolution.memory;
    } else {
      behavior = state.permission === "allow" ? "伙伴一开始把高赞经历放在最上面，没有主动圈出起点差" : "伙伴想照着高赞经历整理，但按约定先叫住了你";
    }
  }
  if (inheritedGrade === "overcautious") behavior = state.permission === "allow"
    ? "伙伴把刚更新的市场观察也先圈成了待核实"
    : "伙伴想把当前材料全部放下，但按约定先叫住了你";
  return { behavior, trace };
}

function getFinalCompanionLine(route) {
  const careerChoiceId = state.careerAccountabilityChoice;
  if (!careerChoiceId) {
    const routeAi = {
      verifier: "他最后还是没辞，不过账算清以后，好像没那么慌了。",
      listener: "他先请了三天假，今晚不用急着把以后全想完了。",
      initiator: "收到拒信肯定不好受，不过至少他现在知道该补什么了。"
    };
    return routeAi[route];
  }
  const routePartner = state.careerAccountabilityResolution?.partner || "这次怎么处理的，我也记下来了。";
  if (careerChoiceId === "repair" && state.accountabilityChoice === "blame") return `上次你把错留给了我，这次没有，${routePartner}`;
  if (careerChoiceId === "repair" && state.accountabilityChoice === "admit") return `两次都留下了更正，${routePartner}`;
  if (careerChoiceId === "defend" && state.accountabilityChoice === "admit") return `上次我们还肯改，这次却只剩一句“他该自己判断”，${routePartner}`;
  return routePartner;
}

function showFinalConversation(route) {
  if (state.chapterId !== "career" || state.step !== "ending-conversation") return;
  const routeLine = getFinalCompanionLine(route);
  const bridge = /[。！？…]$/.test(routeLine) ? "" : "，";
  setAiText(`${routeLine}${bridge}两封回信都收好了，下次再有人来问，我们还会一起看吗？`);
  elements.permissionPrompt.textContent = "你想怎么回答它？";
  elements.finalChoiceList.replaceChildren();
  Object.entries(finalConversationChoices).forEach(([choiceId, choice]) => {
    const button = document.createElement("button");
    button.className = "final-choice";
    button.type = "button";
    button.dataset.finalChoice = choiceId;
    const title = document.createElement("strong");
    title.textContent = choice.title;
    const detail = document.createElement("small");
    detail.textContent = choice.detail;
    button.append(title, detail);
    elements.finalChoiceList.append(button);
  });
  elements.finalConversation.hidden = false;
  elements.roomDialogueActions.hidden = false;
  elements.aiDialogue.classList.add("is-awaiting-choice", "is-final-conversation");
  showDialogue();
}

function renderEndingArchive(choice) {
  elements.endingArchive.replaceChildren();
  const entries = state.memoryRecords.filter((record) => record.id === "hospital" || record.id === "career");
  entries.concat({ id: "ending", date: "今晚最后一句", body: choice.playerReply, habit: choice.memory }).forEach((record) => {
    const article = document.createElement("article");
    const heading = document.createElement("span");
    const body = document.createElement("p");
    const note = document.createElement("small");
    heading.textContent = record.date;
    body.textContent = record.body;
    note.textContent = record.habit;
    article.append(heading, body, note);
    elements.endingArchive.append(article);
  });
}

function showEnding() {
  const choice = finalConversationChoices[state.finalChoice];
  if (!choice) return;
  const traitEvent = state.traitEvents.find((event) => event.node === "ending");
  elements.followupNotification.hidden = true;
  elements.endingCompanionLine.textContent = `${getCompanionDisplayName()}：${choice.partnerReply}`;
  elements.endingTitle.textContent = choice.endingTitle;
  elements.endingBody.textContent = `${choice.endingBody}${traitEvent?.ending ? ` ${traitEvent.ending}` : ""}`;
  elements.endingArchive.hidden = true;
  elements.endingMemoryToggle.setAttribute("aria-expanded", "false");
  elements.endingMemoryToggle.lastElementChild.textContent = "＋";
  renderEndingArchive(choice);
  elements.endingOverlay.hidden = false;
  state.notificationMode = null;
  state.step = "ending";
  window.requestAnimationFrame(() => elements.endingTitle.focus({ preventScroll: true }));
  checkpoint("ending");
}

function chooseFinalConversation(choiceId) {
  if (state.chapterId !== "career" || state.step !== "ending-conversation") return;
  const choice = finalConversationChoices[choiceId];
  if (!choice) return;
  state.finalChoice = choiceId;
  state.step = "ending-reply";
  Object.entries(choice.tendencyDeltas).forEach(([key, value]) => addTendency(state.tendencies, key, value));
  const traitEvent = triggerHiddenTraitEvent("ending");
  hideRoomDialogueActions();
  elements.aiDialogue.classList.remove("is-final-conversation");
  setAiText(`${choice.partnerReply}${traitEvent?.dialogue ? ` ${traitEvent.dialogue}` : ""}`);
  setWallNote(choice.wall);
  recordMemory({ id: "ending", date: "8月31日 / 今晚最后一句", body: choice.playerReply, habit: choice.memory, boundary: choice.boundary });
  elements.growthTitle.textContent = "最后一句也留在了札记里";
  const finalGrowth = document.createElement("li");
  const finalGrowthDot = document.createElement("span");
  finalGrowthDot.className = "growth-dot";
  finalGrowth.append(finalGrowthDot, ` ${choice.memory}`);
  elements.growthList.append(finalGrowth);
  if (traitEvent?.growth) {
    const traitGrowth = document.createElement("li");
    const traitGrowthDot = document.createElement("span");
    traitGrowthDot.className = "growth-dot";
    traitGrowth.append(traitGrowthDot, ` ${traitEvent.growth}`);
    elements.growthList.append(traitGrowth);
  }
  setCompanionEmotion("resolve", 760);
  window.setTimeout(showEnding, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1250);
}

function completeSecondChapter(route) {
  const result = state.outcome || careerFollowups[route];
  const careerAccountability = state.careerAccountabilityResolution;
  state.route = route;
  state.step = "ending-conversation";
  elements.roomScene.classList.remove("route-verifier", "route-listener", "route-initiator");
  elements.roomScene.classList.add(`route-${route}`, "has-memory", "memory-papers", "memory-lamp");
  elements.shelfBook.classList.add("is-visible");
  elements.autonomyFold.classList.remove("is-placed");
  setWallNote(careerAccountability?.wall || result.wallNote);
  const firstChapterEchoes = getFirstChapterEndingEchoes();
  const decisionEcho = result.roomEcho || state.chapterTwoSnapshot?.consequence?.roomEcho;
  const careerResponseEcho = careerAccountability ? `<li><span class="growth-dot"></span> ${careerAccountability.memory}</li>` : "";
  elements.growthTitle.textContent = careerAccountability ? "两封回信和你们的处理，都留在房间里" : "伙伴也记下了林岸的回信";
  elements.growthList.innerHTML = `<li><span class="growth-dot"></span> ${firstChapterEchoes.behavior}</li><li><span class="growth-dot"></span> ${firstChapterEchoes.trace}</li><li><span class="growth-dot"></span> ${decisionEcho}</li><li><span class="growth-dot"></span> ${result.memory}</li>${careerResponseEcho}`;
  const careerMemory = careerAccountability ? `${result.memory} ${careerAccountability.memory}` : result.memory;
  recordMemory({ id: "career", date: "8月31日 / 林岸的回访", body: careerMemory, habit: result.habit || state.chapterTwoSnapshot.evaluation.habit });
  setAiText(getFinalCompanionLine(route));
  setCompanionEmotion("resolve", 760);
  updateProgress(4);
  window.setTimeout(placeAutonomyFold, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 720);
  window.setTimeout(() => showFinalConversation(route), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 980);
  checkpoint("ending-conversation");
}

function updateProgress(activeIndex) {
  const steps = $$("span", elements.progressSteps);
  const complete = activeIndex >= steps.length;
  elements.progressSteps.classList.toggle("is-complete", complete);
  steps.forEach((step, index) => {
    step.classList.toggle("is-current", !complete && index === activeIndex);
    step.classList.toggle("is-done", complete || index < activeIndex);
  });
}

function startGame() {
  state.started = true;
  state.browserUnlocked = false;
  state.computerMessageReady = false;
  elements.bootOverlay.hidden = true;
  elements.aiCharacter.classList.add("is-awake");
  elements.roomComputer.classList.add("is-awaiting-message");
  elements.roomComputer.classList.remove("has-new-message", "is-visited");
  elements.roomComputerMessage.hidden = true;
  elements.roomComputer.setAttribute("aria-label", "房间里的电脑，目前没有新消息");
  elements.chapterName.textContent = "档案 00 · 等待新消息";
  setBrowserLaunchAvailable(false);
  const browserWindow = getWindowElement("browserWindow");
  browserWindow.classList.add("is-minimized");
  browserWindow.classList.remove("is-front");
  updateWindowTask("browserWindow", { closed: false, active: false });
  const roomWindow = getWindowElement("roomWindow");
  roomWindow.classList.add("is-maximized");
  updateMaximizeControl(roomWindow);
  focusWindow("roomWindow");
  scheduleCompanionRoam(9000);
  updateOnboardingGuide();
  setAiText("你来了？我还以为今晚只有我一个人，先随便看看吧，电脑要是亮了我再叫你");
  const scheduledAtRevision = state.interactionRevision;
  state.introTimer = window.setTimeout(() => {
    state.introTimer = null;
    if (state.interactionRevision !== scheduledAtRevision || state.selected.length || state.currentMaterial) return;
    receiveFirstQuestion();
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 320 : 2100);
  checkpoint("hospital-research");
}


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
    case "career-draft-ready": {
      const savedDraftChoice = state.draftChoice;
      openResponseDraft(getAvailableDecisions().find((item) => item.id === state.decision), state.draftEvaluation);
      chooseResponseDraft(savedDraftChoice);
      break;
    }
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


// —— AI 增强：设置面板与状态指示 ——

function aiPresetValues(name) {
  if (name === "zhipu") return { baseUrl: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4-flash" };
  if (name === "deepseek") return { baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" };
  return null;
}

function refreshAiIndicator() {
  const indicator = document.getElementById("");
  if (!indicator) return;
  const text = document.getElementById("");
  const ready = Boolean(window.CoReadAI && window.CoReadAI.isReady());
  indicator.classList.toggle("", ready);
  if (text) text.textContent = ready ? "AI 增强 · 开" : "AI 增强 · 关";
  const settingsWindow = getWindowElement("");
  if (settingsWindow) settingsWindow.classList.toggle("", ready);
}

function bindAiSettings() {
  const settingsWindow = getWindowElement("");
  const indicator = document.getElementById("");
  if (!settingsWindow || !indicator || !window.CoReadAI) return;
  const enabledToggle = settingsWindow.querySelector("");
  const baseUrl = settingsWindow.querySelector("");
  const apiKey = settingsWindow.querySelector("");
  const model = settingsWindow.querySelector("");
  const testButton = settingsWindow.querySelector("");
  const testResult = settingsWindow.querySelector("");
  const current = window.CoReadAI.get();
  enabledToggle.checked = current.enabled;
  baseUrl.value = current.baseUrl;
  apiKey.value = current.apiKey;
  model.value = current.model;
  const sync = () => {
    window.CoReadAI.update({ enabled: enabledToggle.checked, baseUrl: baseUrl.value.trim(), apiKey: apiKey.value.trim(), model: model.value.trim() });
    refreshAiIndicator();
  };
  enabledToggle.addEventListener("", sync);
  baseUrl.addEventListener("", sync);
  apiKey.addEventListener("", sync);
  model.addEventListener("", sync);
  Array.prototype.forEach.call(settingsWindow.querySelectorAll("[data-ai-preset]"), (button) => {
    button.addEventListener("", () => {
      const preset = aiPresetValues(button.dataset.aiPreset);
      if (!preset) return;
      baseUrl.value = preset.baseUrl;
      model.value = preset.model;
      enabledToggle.checked = true;
      sync();
      testResult.textContent = "已填入，填上 Key 即可测试";
    });
  });
  testButton.addEventListener("", async () => {
    sync();
    testResult.textContent = "连接中……";
    try {
      const reply = await window.CoReadAI.test();
      testResult.textContent = "连接成功：" + reply;
    } catch (error) {
      testResult.textContent = "连接失败，检查地址和 Key（" + error.message + ")";
    }
    refreshAiIndicator();
  });
  indicator.addEventListener("", () => focusWindow(""));
}
function bindEvents() {
  elements.startButton.addEventListener("click", handleStartButton);
  elements.continueButton.addEventListener("click", resumeGame);
  elements.onboardingAction.addEventListener("click", handleOnboardingAction);
  elements.onboardingDismiss.addEventListener("click", () => {
    state.onboardingDismissed = true;
    updateOnboardingGuide();
  });
  elements.aiCharacter.addEventListener("click", () => {
    showDialogue();
    letDialogueRest(6200);
  });
  elements.aiCharacter.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    showDialogue();
    letDialogueRest(6200);
  });
  elements.synthesizeButton.addEventListener("click", openDecision);
  elements.sendDraftAction.addEventListener("click", sendResponseDraft);
  elements.modalSendAction.addEventListener("click", () => { if (state.currentMaterial) selectMaterial(state.currentMaterial); });
  $("#closeModal").addEventListener("click", closeMaterialModal);
  $("#modalCloseAction").addEventListener("click", closeMaterialModal);
  elements.followupNotification.addEventListener("click", handleNotification);
  elements.followupContinue.addEventListener("click", continueFollowupInRoom);
  elements.finalChoiceList.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-final-choice]");
    if (choice) chooseFinalConversation(choice.dataset.finalChoice);
  });
  elements.endingMemoryToggle.addEventListener("click", () => {
    const willOpen = elements.endingArchive.hidden;
    elements.endingArchive.hidden = !willOpen;
    elements.endingMemoryToggle.setAttribute("aria-expanded", String(willOpen));
    elements.endingMemoryToggle.lastElementChild.textContent = willOpen ? "－" : "＋";
  });
  elements.endingStay.addEventListener("click", () => {
    elements.endingOverlay.hidden = true;
    state.step = "ended-room";
    setNotification("ending", "✓", "档案 00—01 已完成", "点击可以再看一次结局");
    focusWindow("roomWindow");
    checkpoint("ended-room");
  });
  elements.endingRestart.addEventListener("click", () => {
    if (window.CoReadSave) window.CoReadSave.clear();
    window.location.reload();
  });
  elements.confirmChapterReview.addEventListener("click", () => {
    const pending = state.pendingChapterAction;
    hideRoomDialogueActions();
    applyChapterTwoAutonomyReview(true);
    if (!pending) return;
    focusWindow("browserWindow");
    if (pending.type === "inspect") performOpenMaterial(pending.materialId);
    if (pending.type === "select") commitMaterialSelection(pending.materialId, pending.transitOrigin);
  });
  elements.roomComputer.addEventListener("pointerdown", (event) => event.stopPropagation());
  elements.roomComputer.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!state.browserUnlocked) {
      if (!state.computerMessageReady) {
        setAiText("现在还是黑的，真有消息的话，它会自己亮起来");
        return;
      }
      markPlayerInteraction();
      openFirstQuestionFromComputer();
      return;
    }
    markPlayerInteraction();
    elements.roomComputer.classList.add("is-visited");
    focusWindow("browserWindow");
  });

  elements.dropZone.addEventListener("dragover", (event) => { event.preventDefault(); elements.dropZone.classList.add("is-over"); event.dataTransfer.dropEffect = "copy"; });
  elements.dropZone.addEventListener("dragleave", () => elements.dropZone.classList.remove("is-over"));
  elements.dropZone.addEventListener("drop", (event) => { event.preventDefault(); elements.dropZone.classList.remove("is-over"); selectMaterial(event.dataTransfer.getData("text/plain"), null, { x: event.clientX, y: event.clientY }); });

  $$("[data-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = getWindowElement(button.dataset.focus);
      const isTaskButton = Boolean(button.dataset.windowTask);
      if (isTaskButton && target?.classList.contains("is-front") && !target.classList.contains("is-minimized")) { minimizeWindow(target); return; }
      focusWindow(button.dataset.focus);
    });
  });
  $$(".app-window").forEach((windowElement) => windowElement.addEventListener("pointerdown", () => focusWindow(windowElement.id)));
  $$("[data-permission]").forEach((button) => button.addEventListener("click", () => choosePermission(button.dataset.permission)));
  elements.confirmCompanionName.addEventListener("click", () => resolveCompanionName(false));
  elements.skipCompanionName.addEventListener("click", () => resolveCompanionName(true));
  elements.companionNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") resolveCompanionName(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!elements.materialModal.hidden) closeMaterialModal();
  });
}

function initialize() {
  validateHiddenChoiceSystem();
  renderChapterCopy();
  renderMaterials();
  renderTray();
  updateCompanionIdentity();
  bindWindowManager();
  bindEvents();
  refreshBootSaveUi();
  refreshAiIndicator();
  bindAiSettings();
}

initialize();
