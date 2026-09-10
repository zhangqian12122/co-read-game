// question-pack-season.js - 文档要求的 12 题固定主线（第 4-12 题）
// 内容全部内置，和题包 1-3 一样只负责材料、检查表、固定对话和回信。
(() => {
  const base = window.CoReadV2Pack;
  if (!base) return;
  window.CoReadV2PackBase = base;

  const topics = [
    {
      id: "scam", kicker: "生活经验 · 防骗", title: "兼职私信让我先交培训费，靠谱吗？", askerShort: "小满", askerName: "小满（20 岁 · 大二学生）", address: "zhihu.local/question/part-time-scam",
      body: "我在群里看到一个线上兼职，对方说先交培训费才能进群接单，还一直催我今天转账。我怕错过机会，也怕是骗人的，应该怎么判断？",
      mainAnchor: "怕错过机会，又怕被人骗", subAnchor: "对方要求先交钱再给工作",
      opening: "那个……群里有人给我发兼职，说先交培训费才能进群。我怕错过，但又觉得一直催我转账不太对……这种该怎么办？",
      good: "我没有转账，先去核实了公司和招聘信息，后来发现那群确实在收各种费用。还好先问了你们。", stale: "我照着旧帖子里的联系方式交了钱，后来发现客服和招聘方都对不上。以后先核实，不再急着转。",
      materials: [
        { kind: "official", title: "人社部门求职防骗提示（近期更新）", author: "公共就业服务平台", date: "本月更新", caution: "官方提醒，适合判断招聘流程。", texts: ["正规招聘不会以培训费、押金等名义要求求职者先交钱。", "可以通过企业公示信息和官方招聘平台核验招聘方。", "遇到转账要求要保留聊天记录、收款信息和招聘页面。", "这份提示获得了很多转发。", "下载我们的求职课程，马上拿到更多机会。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "我当年找兼职的避坑帖（经验汇总）", author: "找工作记录员", date: "2021 年", caution: "经验较旧，联系方式和平台规则可能已经变化。", texts: ["先交钱再派单的兼职，通常要提高警惕。", "当年很多招聘都在论坛发布，现在平台和核验方式已经变了。", "不要只看群里的截图和好评。", "我那时吃过亏，大家一定要小心。", "关注我获取兼职群邀请。"], types: ["stale", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我没有被高薪兼职骗到的那次", author: "小树", date: "两周前", caution: "个人经历能提供线索，但不能替代核验。", texts: ["对方一说要先交培训费，我就暂停了，没有继续转账。", "我把公司全称和招聘信息拿去官方平台查，发现说法对不上。", "我还问了学校就业老师，确认正规渠道不会这样收费。", "当时我也很怕错过机会。", "想要同款防骗资料可以私信我。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：他说不交今天就没名额", author: "小满", date: "今天", caution: "提问者最在意的是催促和先交钱。", texts: ["对方说不交培训费，今天就没有名额了。", "我还没有给身份证和银行卡，但已经把学校和专业告诉他了。", "他说交钱后才会发合同和具体工作内容。", "我是不是太谨慎了？"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "internship", kicker: "生活经验 · 初入职场", title: "第一份实习合同，我应该先看哪些地方？", askerShort: "阿岚", askerName: "阿岚（21 岁 · 第一次实习）", address: "zhihu.local/question/first-internship",
      body: "我拿到第一份实习协议，对方让我今天签字，说薪资和工作时间都可以到岗后再说。我很想要这次机会，但也怕签完才发现不对。",
      mainAnchor: "第一次签协议，怕问多了丢机会", subAnchor: "薪资、时间和退出方式还没写清楚",
      opening: "我第一次找实习，对方让我今天就签，说具体工作到岗后再聊。我很想去，又怕签完才发现薪资和时间都没写清楚……我该先看什么？",
      good: "我把工作内容、补贴和退出方式都问清楚再签，虽然晚了一天，但没有留下模糊的约定。", stale: "我照着网上旧模板签了，后来才发现现在的协议格式和岗位不一样。幸好先暂停，没有直接入职。",
      materials: [
        { kind: "official", title: "实习协议常见条款说明", author: "高校就业指导中心", date: "本学期更新", caution: "学校指导材料，适合先核对基本项目。", texts: ["协议应写清实习内容、地点、时间、补贴和双方联系人。", "签字前可以把看不懂的条款带回去确认，不必当场决定。", "涉及个人信息和费用的条款要确认用途与退还方式。", "指导中心每年都会更新说明。", "购买我们的合同模板包，签约更放心。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "实习签约避坑旧帖", author: "毕业生小组", date: "2020 年", caution: "旧帖只能做线索，不能直接当现行规定。", texts: ["签协议前先看清楚工作内容和结束日期。", "以前很多岗位用纸质协议，现在也可能通过学校系统确认。", "不要只看月薪数字，要看结算时间和请假规则。", "这是我熬夜整理的全部经验。", "关注我领取可编辑合同模板。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我第一次实习先问清楚了什么", author: "晚风", date: "上个月", caution: "个人经验可参考，但每个岗位仍要单独确认。", texts: ["我先让对方把工作内容、到岗时间和补贴写进协议。", "不懂的地方我直接标出来，请学长和老师一起看。", "对方愿意解释，也给了我一天考虑时间。", "第一次签字时手心都是汗。", "我整理了一份收费清单，想看的可以私信。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：对方只发来一张模糊截图", author: "阿岚", date: "今天", caution: "关键问题是协议不完整、催促签字。", texts: ["对方只发来一张截图，没有完整协议文件。", "薪资说面议，工作时间说到岗后安排。", "他说今天不签就把名额给别人。", "我怕问太多显得不想去。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "parcel", kicker: "生活经验 · 网络安全", title: "快递理赔让我点链接，我该怎么处理？", askerShort: "小周", askerName: "小周（19 岁 · 第一次独自网购）", address: "zhihu.local/question/parcel-refund",
      body: "我刚收到一条短信，说快递丢了可以理赔，让我点链接填写银行卡。短信里的快递单号和我最近买的东西很像，我不知道该不该点。",
      mainAnchor: "怕错过理赔，又怕泄露银行卡信息", subAnchor: "短信链接和官方客服说法对不上",
      opening: "短信说我的快递丢了，要点链接才能理赔。单号看起来又像真的，我不敢点，可是错过了是不是就不能赔了？",
      good: "我没有点短信链接，而是从订单页面联系官方客服，确认包裹只是晚到了。幸好没有填银行卡。", stale: "我按旧攻略里的电话回拨过去，对方一直让我安装软件。后来我从订单页面找客服，才知道那是冒充的。",
      materials: [
        { kind: "official", title: "平台客服的理赔安全说明", author: "电商平台安全中心", date: "本月更新", caution: "官方说明，优先从订单页进入客服。", texts: ["平台理赔应从订单页面或官方 App 内发起，不要求点击陌生短信链接。", "客服不会索要短信验证码、支付密码或要求安装远程控制软件。", "可先在订单页面核对物流状态和官方客服入口。", "安全中心发布了很多防骗案例。", "下载官方安全管家，理赔更快。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "网购理赔避坑经验（旧帖）", author: "网购十年", date: "2021 年", caution: "旧帖中的电话和页面入口可能已经失效。", texts: ["不要相信短信里的理赔链接，先回到购物平台找订单。", "以前有人会通过电话核对订单，现在更应该使用平台内客服。", "遇到退款先看收款路径，不要给验证码。", "这些都是我踩过的坑。", "关注我领取理赔链接合集。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我遇到过一次假的快递理赔", author: "阿北", date: "三周前", caution: "个人经历帮助识别话术，仍需回到官方渠道核实。", texts: ["对方一直催我点链接，我就先退出短信，去订单页面看物流。", "订单页面没有理赔通知，官方客服也说包裹只是延迟。", "我把短信截图保存后举报，没有继续回复。", "当时差点就把验证码发过去了。", "想看更多案例可以加群。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：链接页面要我填身份证和银行卡", author: "小周", date: "今天", caution: "提问者已经看到高风险的个人信息索取。", texts: ["链接页面要求我填身份证号、银行卡和验证码。", "短信号码看起来像快递公司的简称。", "我还没有填写，只是打开看了一眼。", "如果不填是不是就拿不到赔偿？"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "bank", kicker: "生活经验 · 金融常识", title: "第一次办银行卡，柜员让我开很多服务怎么办？", askerShort: "小齐", askerName: "小齐（18 岁 · 第一次办卡）", address: "zhihu.local/question/first-bank-card",
      body: "我去银行办第一张银行卡，柜员推荐我开短信通知、信用卡和理财服务。我听不太懂，又怕不开就办不了卡，应该怎么问？",
      mainAnchor: "第一次办业务，怕听不懂也怕被拒绝", subAnchor: "基础办卡和额外服务没有分清",
      opening: "我第一次去银行办卡，柜员说可以一起开短信、信用卡和理财。我不知道哪些是必须的，也不好意思一直问……怎么办？",
      good: "我先确认基础办卡需要什么，再逐项问清收费和取消方式，最后只开了自己需要的服务。", stale: "我照着旧攻略准备了很多纸质材料，到了柜台才发现流程早就变了。以后先看官方清单。",
      materials: [
        { kind: "official", title: "个人银行卡业务办理提示", author: "银行营业网点", date: "本季度更新", caution: "官方业务提示，适合核对必需材料和收费。", texts: ["办理基础借记卡前可先询问身份证明、费用和账户功能。", "附加服务应说明收费、开通期限和取消方式。", "不理解的条款可以请工作人员逐项解释后再确认。", "网点会根据业务更新办理流程。", "开通本行全家桶服务，享受专属优惠。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "第一次办卡经验帖", author: "柜台排队观察员", date: "2020 年", caution: "旧经验只作参考，不要照搬旧材料清单。", texts: ["办卡前先问清楚基础账户和附加服务的区别。", "以前有些网点需要纸质复印件，现在可能现场核验。", "所有收费都要问清楚再勾选。", "我当时排了两个小时队。", "关注我获取办卡加速攻略。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我第一次办卡时问了三个问题", author: "青柠", date: "上个月", caution: "经历可以提供提问方式，具体规则以网点为准。", texts: ["我先问基础办卡必须开哪些功能，柜员说附加服务可以自己选择。", "遇到听不懂的词，我让对方换成日常说法解释。", "最后我把收费和取消方式写进备忘录再确认。", "一开始我也担心自己问得太多。", "我做了一张收费表，想要的可以私信。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：我怕不开信用卡就不能办借记卡", author: "小齐", date: "今天", caution: "最关键的是分清基础业务和可选服务。", texts: ["柜员说开信用卡以后坐地铁更方便。", "我只想办一张能收生活费的借记卡。", "我没有收入，也不知道信用卡是不是要还钱。", "我不敢直接说不想开。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "move", kicker: "生活经验 · 独立生活", title: "第一次搬家，怎么避免东西丢了又超预算？", askerShort: "小禾", askerName: "小禾（20 岁 · 第一次搬离宿舍）", address: "zhihu.local/question/first-move",
      body: "我准备从宿舍搬到校外，东西比想象中多。搬家公司报价差很多，我怕临时加价，也怕贵重物品弄丢，应该提前做什么？",
      mainAnchor: "第一次独立搬家，怕混乱和被临时加价", subAnchor: "报价、物品清单和责任没有说清楚",
      opening: "我第一次搬家，东西好多。几家搬家公司报价差很多，有一家说到现场再看，我怕最后一直加价，也怕东西弄丢……应该先做什么？",
      good: "我先列了物品清单和照片，把费用、时间和损坏责任写进确认单，现场没有再被加价。", stale: "我照着几年前的旧攻略只看了起步价，现场才发现楼层和电梯都要另收费。以后先确认总价。",
      materials: [
        { kind: "official", title: "搬家服务消费提示", author: "消费者权益服务平台", date: "本月更新", caution: "公共服务提示，适合核对报价和留证方式。", texts: ["下单前应确认搬运距离、楼层、电梯、物品数量和总价。", "贵重或易损物品应单独列清单并拍照留存。", "临时增加项目要先说明费用，双方确认后再进行。", "平台每月都会整理消费案例。", "购买搬家安心包，破损全额赔付。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "搬家避坑老帖", author: "住过十次的人", date: "2019 年", caution: "收费和平台规则可能已经变化，不能只看起步价。", texts: ["先问清楚有没有楼层费和电梯费。", "以前不少人用电话约车，现在最好保留平台订单。", "贵重物品自己随身带。", "搬家当天一定要留人在现场。", "关注我获取低价搬家电话。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我第一次搬家没有超预算", author: "南风", date: "两周前", caution: "个人经验适合参考准备清单，仍需单独确认报价。", texts: ["我先把箱子编号，每个箱子都拍照，搬完按清单核对。", "我把楼层和电梯情况提前发给搬家公司，让对方给总价。", "易碎品我自己带，减少现场扯皮。", "第一次看着十几个箱子也很慌。", "我的打包清单可以付费领取。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：对方只给起步价", author: "小禾", date: "今天", caution: "起步价不能代表最终总价。", texts: ["对方只说起步价，没有问我住几楼。", "我有一台电脑和一台显示器，担心磕碰。", "我想知道临时加价能不能拒绝。", "我已经约了明天上午搬。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "roommate", kicker: "生活经验 · 合住关系", title: "室友总忘记关空调，电费应该怎么说？", askerShort: "阿澄", askerName: "阿澄（19 岁 · 和室友合住）", address: "zhihu.local/question/roommate-bill",
      body: "我们几个室友平摊电费，但有人经常最后一个走却不关空调。直接说怕关系变差，不说又觉得每个月多花钱，怎么开口比较好？",
      mainAnchor: "想维护关系，也想把规则讲清楚", subAnchor: "费用分摊和关电习惯没有约定",
      opening: "我们合住平摊电费，但室友经常走了不关空调。我知道直接说可能有点尴尬，可是每个月都多花钱……应该怎么开口？",
      good: "我没有直接指责谁，而是提议一起写个关电和分摊规则，大家都同意先试一周。", stale: "我照着旧帖建议在群里公开点名，室友觉得被针对，后来我们重新约了更具体的规则。",
      materials: [
        { kind: "official", title: "合租消费与公共空间沟通建议", author: "校园生活指导中心", date: "本学期更新", caution: "指导建议，重点是规则和记录。", texts: ["共同费用应提前约定项目、分摊方式和结算时间。", "讨论公共问题时描述事实和影响，避免直接给人贴标签。", "可以先约定一周试行，再根据记录调整。", "中心提供免费的宿舍沟通活动。", "报名关系沟通训练营，快速解决室友矛盾。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "合租室友相处旧经验", author: "合租过来人", date: "2019 年", caution: "旧帖的室友关系和费用标准不一定适用现在。", texts: ["公共电费最好一开始就说清楚。", "以前很多人选择月底现金AA，现在可以用共同账本记录。", "遇到问题不要一直忍着。", "我当年也因为空调吵过架。", "关注我学习室友谈判话术。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我和室友把电费规则谈好了", author: "橘子汽水", date: "上个月", caution: "经历适合参考说法，不代表所有室友都能照搬。", texts: ["我先说每个月多出的金额和大家的感受，没有直接说谁不负责任。", "我们一起做了一个关电提醒和公共账本。", "试了一周后，大家发现其实比吵架容易。", "开口前我也在房间里练了好久。", "我的室友沟通模板可以私发。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：大家都说不是自己最后走的", author: "阿澄", date: "今天", caution: "问题需要从追责转为共同规则。", texts: ["大家都说自己不是最后一个离开的人。", "我们没有记录每天谁最后关空调。", "电费比上个月多了六十多元。", "我怕一提钱大家就不高兴。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "cooking", kicker: "生活经验 · 独立生活", title: "第一次自己做饭，怎么安排才不会手忙脚乱？", askerShort: "小唐", askerName: "小唐（18 岁 · 第一次离家生活）", address: "zhihu.local/question/first-cooking",
      body: "我刚开始自己住，想做饭省钱，但每次不是忘记买东西就是做到一半才发现没有工具。有没有适合新手的准备方法？",
      mainAnchor: "想照顾好自己，又怕第一次就失败", subAnchor: "采购、步骤和安全没有排好顺序",
      opening: "我想开始自己做饭，可是总是买了菜才发现没有锅，或者做到一半才想起没调料……有没有新手能照着做的准备方法？",
      good: "我先从一道菜开始，列好食材和工具，做之前把步骤写下来，第一次终于没有中途慌掉。", stale: "我照着旧视频买了已经换规格的调料，最后发现步骤和现在的灶具不一样。以后先看清器具和分量。",
      materials: [
        { kind: "official", title: "家庭厨房安全与备餐提示", author: "社区安全服务站", date: "本月更新", caution: "安全提示优先于菜谱技巧。", texts: ["开火前确认锅具、食材和调料已经摆在手边。", "使用燃气或电器后要检查关闭状态，生熟食材分开处理。", "新手可以从步骤少、分量容易控制的菜开始。", "社区每周有厨房安全讲座。", "购买我们的新手厨房套装，马上学会做饭。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "新手做饭避坑旧帖", author: "一人食记录", date: "2020 年", caution: "旧帖中的器具和用量不一定适合现在的厨房。", texts: ["做饭前先把所有材料洗切好。", "以前很多人用煤气灶，火力和现在的电器可能不同。", "第一道菜别选步骤太多的。", "我第一次把锅烧糊了。", "关注我获取一周菜谱。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我第一次做饭只做了三个准备", author: "小白开火了", date: "三周前", caution: "个人经验可以借鉴流程，具体器具仍需自行确认。", texts: ["我先把食材、锅和调料全部摆好，再开始开火。", "我只做一道最简单的菜，按步骤卡一项项完成。", "做完后马上关火并检查电源和燃气。", "第一次端上桌时特别有成就感。", "我的新手调料包链接在主页。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：我只有一个小电锅", author: "小唐", date: "今天", caution: "需要根据现有器具降低计划难度。", texts: ["我只有一个小电锅和一把菜刀。", "我不知道哪些菜适合一次做完。", "宿舍附近可以买到食材，但我不会估分量。", "我怕做不好浪费钱。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "idloss", kicker: "生活经验 · 办事流程", title: "身份证临时找不到了，出门前该先做什么？", askerShort: "小程", askerName: "小程（19 岁 · 第一次独自办事）", address: "zhihu.local/question/id-card-lost",
      body: "我明天要去参加一个需要核验身份的考试，今晚却找不到身份证了。我已经翻了房间，怕是丢在路上，应该先挂失还是先找临时证明？",
      mainAnchor: "临近重要事情，怕证件问题让自己白跑", subAnchor: "补办、临时证明和考试要求没有核对",
      opening: "我明天有个重要考试，今晚突然找不到身份证了。房间翻遍了，可能丢在路上……我现在应该先做什么，明天还能不能进场？",
      good: "我先看考试通知的证件要求，再联系主办方确认临时证明的办法，同时继续找证件，没有只靠猜。", stale: "我照着旧帖子跑去已经搬走的办证点，耽误了时间。后来我直接看官方地址并打电话确认。",
      materials: [
        { kind: "official", title: "居民身份证补办与临时证明提示", author: "政务服务平台", date: "本月更新", caution: "具体能否入场还要以考试主办方要求为准。", texts: ["证件遗失后可通过政务服务渠道查询挂失和补办方式。", "临时证明的办理地点、材料和有效期要先向官方确认。", "参加考试或乘车前应查看主办方认可的证件类型。", "平台提供线上办事指南。", "购买加急服务，最快当天拿证。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "证件丢失处理经验（旧帖）", author: "办事攻略收藏家", date: "2019 年", caution: "办事地点和线上入口可能已经变化。", texts: ["先回忆最后使用地点，再联系可能遗失的场所。", "以前很多地方需要现场排队，现在部分业务可以线上查询。", "临时证明能否使用要问主办方。", "我曾经找了三天才找到证件。", "关注我领取证件丢失清单。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我在考试前找回证件的办法", author: "小鱼", date: "上个月", caution: "个人经历只能提供排查顺序，不能替代官方确认。", texts: ["我先打电话给考试主办方，问清楚能接受哪些证件。", "再按最后一次使用顺序联系食堂、图书馆和宿舍门卫。", "同时把可能需要的照片和证明材料准备好。", "那一晚我也很慌，但按顺序做就好多了。", "我整理了找证件表格，扫码获取。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：考试通知只写了带有效证件", author: "小程", date: "今天", caution: "需要先确认“有效证件”的具体范围。", texts: ["通知只写了带有效证件，没有列具体类型。", "我记得最后一次是在图书馆刷证进门。", "现在已经晚上十点，担心联系不上工作人员。", "如果明天进不去，我可能要重考。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "club", kicker: "生活经验 · 校园生活", title: "社团让我先交费再参加活动，应该问清什么？", askerShort: "小路", askerName: "小路（18 岁 · 大一新生）", address: "zhihu.local/question/club-fee",
      body: "我想参加一个社团，对方说先交材料费和活动费才能进群，但没有给明细。我怕错过报名，又不知道该不该直接问退款。",
      mainAnchor: "想融入集体，又怕交了不清楚的钱", subAnchor: "费用用途、退费和主办方身份没有说明",
      opening: "我想进一个社团，对方让我先交材料费和活动费，说进群后才告诉具体安排。我想参加又不太放心，应该先问哪些问题？",
      good: "我先问清费用明细、活动时间和退出方式，对方不愿意说明后我就没有交钱。", stale: "我照旧帖里的方法直接进了群，后来才发现组织方式已经完全变了。以后先确认主办方和收费明细。",
      materials: [
        { kind: "official", title: "校园社团活动与收费说明", author: "学生事务中心", date: "本学期更新", caution: "学校流程优先于群聊口头承诺。", texts: ["社团收费应说明项目、金额、用途和退费规则。", "学生可以通过学校公开渠道核对社团登记和指导老师。", "活动报名信息应包含时间、地点、联系人和安全安排。", "事务中心会公布社团活动周。", "报名精品社团训练营，材料费限时优惠。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "大学社团选择经验（旧帖）", author: "学长学姐说", date: "2019 年", caution: "旧帖中社团名称和报名渠道可能已经失效。", texts: ["先看社团往期活动和公开负责人。", "以前很多社团在公告栏报名，现在可能要走线上系统。", "涉及钱的事情一定要留明细。", "选社团不要只看宣传照片。", "关注我获取热门社团名单。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我参加社团前先确认了三件事", author: "阿池", date: "两周前", caution: "经历可以帮助列问题，具体规则看学校公告。", texts: ["我先看学校社团名单，再联系指导老师确认。", "对方把材料费的用途和退费方式写成了明细。", "活动时间和安全负责人也提前发给了我。", "我以前也不好意思问钱的事情。", "我做了社团选择表，可以购买。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：对方说不交就不给进群", author: "小路", date: "今天", caution: "催促交费和拒绝说明用途是核心风险。", texts: ["对方只给了一个个人收款码。", "没有发活动明细，也没有指导老师信息。", "他说不交费就不能进群了解更多。", "我已经把姓名和学院告诉他了。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "phone", kicker: "生活经验 · 数码生活", title: "旧手机准备卖掉，怎样保护里面的资料？", askerShort: "小白", askerName: "小白（20 岁 · 第一次换手机）", address: "zhihu.local/question/old-phone",
      body: "我准备把旧手机卖掉，里面有照片、聊天记录和支付软件。我已经备份了照片，但不知道退出账号和清除数据的顺序。",
      mainAnchor: "想卖个好价钱，又怕私人资料被留下", subAnchor: "备份、退出账号和恢复出厂没有排好",
      opening: "我第一次卖旧手机，照片已经备份了，但聊天和支付软件怎么办？是直接恢复出厂，还是要先退出账号？我怕漏掉资料。",
      good: "我先备份并确认新手机能打开资料，再退出账号、关闭设备查找，最后恢复出厂并检查开机画面。", stale: "我照着旧教程只恢复了出厂设置，后来才发现设备账号还没有退出。幸好交易前检查了一遍。",
      materials: [
        { kind: "official", title: "设备回收前的数据安全指引", author: "手机厂商支持中心", date: "本月更新", caution: "按设备和系统版本核对步骤。", texts: ["回收前应备份资料并确认新设备可以正常访问。", "退出云账号、关闭设备查找和移除支付信息后再清除数据。", "恢复出厂后重新开机检查是否进入初始设置界面。", "支持中心提供换机助手。", "购买延保服务，旧机估价更高。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "旧手机出售流程旧攻略", author: "数码玩家", date: "2019 年", caution: "系统界面和账号安全选项已经变化。", texts: ["卖手机前先备份照片和联系人。", "以前的系统只要恢复出厂就可以，现在还要检查云账号。", "交易时保留验机记录。", "手机越新越值得卖。", "关注我获得高价回收链接。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我卖旧手机前做了四步检查", author: "小林", date: "上个月", caution: "个人流程可参考，账号设置以设备官方说明为准。", texts: ["我先把照片和聊天记录分别备份，再用新手机打开检查。", "退出账号后，我在账号设备列表里移除了旧手机。", "恢复出厂后重新开机，确认没有进入我的账户。", "最后我擦掉了手机壳里的快递单。", "我整理了换机清单放在主页。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：旧手机还绑定着支付软件", author: "小白", date: "今天", caution: "支付和设备账号需要优先处理。", texts: ["旧手机还能打开支付软件，但我没有尝试转账。", "我不确定退出账号后照片会不会丢。", "回收平台说今天下单估价更高。", "我想今晚就寄出去。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "bus", kicker: "生活经验 · 城市出行", title: "第一次在陌生城市转公交，怎么避免坐错？", askerShort: "小言", askerName: "小言（19 岁 · 第一次独自出远门）", address: "zhihu.local/question/city-bus",
      body: "我下周要去陌生城市参加活动，需要换乘公交和地铁。路线软件给了好几种方案，我怕坐过站、找不到换乘口，想提前准备。",
      mainAnchor: "第一次去陌生城市，怕错过重要活动", subAnchor: "换乘路线、下车提醒和备用方案不清楚",
      opening: "我下周要一个人去陌生城市，路线要换公交和地铁。我看了软件还是有点晕，怕下错站赶不上活动……应该怎么准备？",
      good: "我提前看了官方线路和站点，把换乘口、下车站和备用路线截图，还留了充足时间。", stale: "我照旧攻略去找已经改名的站点，绕了一圈才找到。以后出发前先看当天线路信息。",
      materials: [
        { kind: "official", title: "城市公共交通乘车提示", author: "城市交通服务平台", date: "本月更新", caution: "线路变动以当天官方信息为准。", texts: ["出发前确认线路、首末班时间和换乘站入口。", "大站换乘要预留步行时间，并提前设置下车提醒。", "可以保存官方线路截图和备用路线。", "交通平台会发布临时调整通知。", "开通出行会员，路线规划更快。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "陌生城市出行旧攻略", author: "旅行路线收藏", date: "2019 年", caution: "站名、入口和线路可能已经调整。", texts: ["提前看地图，记住换乘站名字。", "以前很多城市用纸质线路图，现在要注意实时调整。", "迷路时找站务人员，不要只看网友截图。", "第一次出门多留一个小时。", "关注我领取城市通票优惠。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我第一次独自换乘没有迟到", author: "圆圆", date: "三周前", caution: "个人经验帮助准备，不替代实时线路查询。", texts: ["我把去程和回程路线分别截图，还标出换乘口。", "我设置了提前两站的提醒，不确定就问站务人员。", "我给自己留了二十分钟缓冲，没有把路线排得太紧。", "第一次一个人赶路时也很紧张。", "我的旅行路线模板可以领取。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：活动要求九点前签到", author: "小言", date: "今天", caution: "需要围绕签到时间安排缓冲和备选路线。", texts: ["活动九点前签到，路线软件显示八点四十到。", "我需要换乘一次地铁和一次公交。", "我不确定下车后从哪个出口走。", "迟到可能就不能进场了。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    },
    {
      id: "laundry", kicker: "生活经验 · 日常照料", title: "第一次自己洗衣服，哪些东西不能一起洗？", askerShort: "阿野", askerName: "阿野（18 岁 · 第一次住宿舍）", address: "zhihu.local/question/first-laundry",
      body: "我刚住宿舍，准备把衣服一次性洗完，但有深色、白色和一件看起来很娇贵的外套。我怕串色或洗坏，应该怎么分？",
      mainAnchor: "想一次洗完，怕把衣服洗坏", subAnchor: "衣物标签、颜色和材质没有看清",
      opening: "我第一次自己洗衣服，深色白色还有一件外套混在一起。洗衣机马上要空了，我应该怎么分，哪些要先看标签？",
      good: "我先看洗涤标签，深浅色分开，小件和外套按材质处理，没有为了省一次水把衣服全混在一起。", stale: "我照旧攻略里的温度洗衣服，后来发现现在这件面料不能高温。以后先看衣服标签。",
      materials: [
        { kind: "official", title: "衣物洗涤标签与宿舍洗衣提示", author: "校园后勤服务中心", date: "本学期更新", caution: "衣物标签优先于通用经验。", texts: ["洗涤前查看衣物标签，深浅色和易掉色衣物分开。", "不同材质对水温、脱水和烘干要求可能不同。", "有污渍的衣物先局部处理，不要直接用力揉搓。", "后勤中心提供洗衣机使用说明。", "购买万能洗衣片，所有衣服都能洗。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "guide", title: "宿舍洗衣避坑旧攻略", author: "洗衣机旁的学长", date: "2019 年", caution: "洗衣机型号和衣物材质可能已经变化。", texts: ["白色和深色衣服最好分开洗。", "以前宿舍机器默认温度较高，现在要看标签设置。", "口袋里东西一定要拿出来。", "我把一整桶衣服洗成了灰色。", "关注我领取洗衣液优惠券。"], types: ["dry", "stale", "dry", "fluff", "ad"] },
        { kind: "experience", title: "我第一次洗衣服先做了衣物分类", author: "小雨", date: "上个月", caution: "个人经验可参考分类方式，仍要以标签为准。", texts: ["我先按颜色分，再看外套和针织衣物的标签。", "口袋逐个检查，容易掉色的衣服先单独试洗。", "洗完马上晾开，避免湿衣服闷在机器里。", "以前我也把袜子洗丢过。", "我的宿舍洗衣清单可以私信拿。"], types: ["dry", "dry", "dry", "fluff", "ad"] },
        { kind: "asker", title: "楼主补充：外套标签写着不可机洗", author: "阿野", date: "今天", caution: "标签已经给出明确限制，不能为了省事忽略。", texts: ["外套标签写着不可机洗，但我不知道该怎么处理。", "白T和黑裤子都想今晚洗完。", "宿舍洗衣机只有快洗和标准两个选项。", "我怕不洗明天没有衣服穿。"], types: ["dry", "dry", "dry", "fluff"] }
      ]
    }
  ];

  // 文档要求：每题先定标准解法，再倒推材料检查和台词。
  // 这里把后续题的主锚点、副锚点和资源压力显式写出来，避免所有题共用一套空泛反馈。
  const profiles = {
    scam: {
      patienceBase: 5,
      focus: { empathy: "怕错过机会也怕被骗", probe: "先交钱再给工作", advice: "不转账，回到官方招聘渠道核验", story: "别人也遇到过先收费的兼职", checklist: "查公司、留证据、先不转账", tradeoff: "错过一个机会和承担转账风险" },
      miss: "对方今天催转账的细节",
      checks: { empathy: ["m4-s1"], probe: ["m4-s3"], advice: ["m1-s1", "m1-s2"], story: ["m3-s2"], checklist: ["m1-s1", "m1-s2"], tradeoff: [] },
      goodResult: "他没有转账，先核实了招聘方和收费要求。", staleResult: "他被旧帖里的联系方式带偏，差点把钱交出去。",
      memoryGood: "兼职防骗：先核验招聘方，不为名额和催促转账。", memoryStale: "兼职防骗：旧联系方式和群截图不能替代核验。"
    },
    internship: {
      patienceBase: 5,
      focus: { empathy: "怕问多了就失去第一份机会", probe: "薪资、时间和退出方式", advice: "把工作内容和补贴写进协议再签", story: "别人第一次签实习协议也会紧张", checklist: "看内容、看时间、看费用、留考虑时间", tradeoff: "今天签下机会和留下模糊约定" },
      miss: "那张不完整的协议截图",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s1", "m1-s2"], story: ["m3-s1"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他把岗位内容、补贴和结束方式问清楚后再签。", staleResult: "他照着旧模板准备，发现协议格式和岗位实际对不上。",
      memoryGood: "第一份实习：不因催促当场签，先把约定写清楚。", memoryStale: "第一份实习：旧模板只能参考，当前协议要逐项核对。"
    },
    parcel: {
      patienceBase: 5,
      focus: { empathy: "怕错过理赔又怕银行卡被套走", probe: "短信链接和订单页是否一致", advice: "从订单页面联系官方客服，不点陌生链接", story: "别人也遇到过看起来很真的理赔短信", checklist: "不点链接、查订单、不给验证码、留截图", tradeoff: "尽快领到赔偿和保护账户信息" },
      miss: "链接页面索要身份证、银行卡和验证码",
      checks: { empathy: ["m4-s3"], probe: ["m4-s1"], advice: ["m1-s1", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他绕开短信链接，从订单页确认了物流，没有泄露银行卡信息。", staleResult: "他按旧帖电话回拨，差点被引导安装远程软件。",
      memoryGood: "快递理赔：回到订单页核验，不从陌生短信开始。", memoryStale: "快递理赔：旧电话和旧入口不能替代平台内客服。"
    },
    bank: {
      patienceBase: 6,
      focus: { empathy: "怕听不懂业务又怕被柜员拒绝", probe: "基础借记卡和附加服务的区别", advice: "逐项问清收费和取消方式，只开需要的服务", story: "别人第一次办卡也可以把听不懂的词问明白", checklist: "问必需项、问收费、问期限、问取消", tradeoff: "办成基础账户和被顺手开通一堆服务" },
      miss: "自己只想办借记卡的真实需求",
      checks: { empathy: ["m4-s4"], probe: ["m4-s2", "m4-s3"], advice: ["m1-s1", "m1-s2"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他先办好基础借记卡，再决定是否需要附加服务。", staleResult: "他按旧清单准备了材料，却没有问清现在的业务流程。",
      memoryGood: "第一次办卡：先分清基础业务和可选服务，再确认收费。", memoryStale: "第一次办卡：旧清单会过时，现场流程要重新核对。"
    },
    move: {
      patienceBase: 6,
      focus: { empathy: "第一次搬离宿舍的混乱和担心", probe: "起步价、楼层费和损坏责任", advice: "把物品、总价和责任写进确认单", story: "别人也能用编号和照片把搬家变得可控", checklist: "列清单、拍照片、问总价、贵重物品随身带", tradeoff: "省一点起步价和承担临时加价风险" },
      miss: "对方只报起步价却没问楼层和电梯",
      checks: { empathy: ["m4-s2"], probe: ["m4-s1", "m4-s3"], advice: ["m1-s1", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他把箱子编号并确认总价，搬完按照片和清单核对。", staleResult: "他只看旧攻略的起步价，现场才发现楼层和电梯要另收费。",
      memoryGood: "第一次搬家：总价、清单和损坏责任要在出发前说清。", memoryStale: "第一次搬家：只看起步价会把真正费用留到现场。"
    },
    roommate: {
      patienceBase: 6,
      focus: { empathy: "想省电又不想把室友关系说僵", probe: "谁在什么时候关空调、费用怎么记录", advice: "先说事实和影响，再一起试行公共规则", story: "别人也能把指责改成一周试行", checklist: "记一周、算差额、定提醒、约结算", tradeoff: "当场指出责任和先建立大家都能执行的规则" },
      miss: "大家都说自己不是最后一个离开的人",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s1", "m1-s2", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他们把关电和分摊写成一周试行规则，电费问题不再只靠猜。", staleResult: "他照旧帖在群里点名，室友先感到被针对，后来才重新约规则。",
      memoryGood: "合住沟通：先记事实，再共同试行规则，不急着点名。", memoryStale: "合住沟通：公开点名容易伤关系，旧经验不能替代共同约定。"
    },
    cooking: {
      patienceBase: 6,
      focus: { empathy: "想照顾好自己又怕第一顿就失败", probe: "小电锅和现有食材能不能完成计划", advice: "先做一道步骤少的菜，把工具和食材摆齐", story: "新手也可以靠开火前准备减少慌乱", checklist: "定一道菜、备工具、分步骤、关火检查", tradeoff: "省准备时间和承担中途缺工具的风险" },
      miss: "只有一个小电锅却想一次做很多菜",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s1", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他从一道简单的菜开始，开火前把工具、食材和步骤排好。", staleResult: "他照旧视频买了不匹配的调料和器具，做到一半才发现流程不同。",
      memoryGood: "第一次做饭：先把工具和步骤摆齐，再开火。", memoryStale: "第一次做饭：旧视频的器具和分量不一定适合现在的厨房。"
    },
    idloss: {
      patienceBase: 5,
      focus: { empathy: "明天有考试却突然找不到证件的慌张", probe: "主办方认可哪些临时证件", advice: "先看考试要求并联系主办方，再按最后使用顺序排查", story: "别人也能在慌乱时按顺序把事情拆开", checklist: "看要求、问主办方、准备证明、按路线找回", tradeoff: "马上挂失和先确认明天到底认可什么" },
      miss: "通知只写有效证件却没有列具体类型",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s2", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他先确认考试方认可的证件，再准备临时证明并按线索找证件。", staleResult: "他照旧帖跑去已经搬走的办证点，耽误了本可以用来确认信息的时间。",
      memoryGood: "证件找不到：先问主办方认可什么，再安排挂失和临时证明。", memoryStale: "证件找不到：办事地点和入口会变，旧帖子不能直接照搬。"
    },
    club: {
      patienceBase: 6,
      focus: { empathy: "想融入新集体又怕交一笔说不清的钱", probe: "费用用途、退费规则和指导老师", advice: "先核对学校登记和收费明细，不因进群催促交钱", story: "别人也能先问钱的用途而不把自己变成刺头", checklist: "查登记、要明细、问退费、留收款记录", tradeoff: "不错过活动和承担不透明收费" },
      miss: "对方只发个人收款码却不说明用途",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s1", "m1-s2"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他先核对社团登记和收费明细，没有因为“先进群”就交钱。", staleResult: "他照旧帖加入群聊，后来发现社团名称和报名方式都已经变了。",
      memoryGood: "参加社团：费用、退费和主办方身份都要先问清。", memoryStale: "参加社团：旧名单和旧渠道会失效，不能只看群里宣传。"
    },
    phone: {
      patienceBase: 6,
      focus: { empathy: "想卖掉旧手机又怕资料留在别人手里", probe: "备份、退出账号和清除数据的顺序", advice: "确认新机能打开资料后再退出账号并恢复出厂", story: "别人也会在交易前重新开机检查", checklist: "备份、退出、移除设备、恢复出厂、重启检查", tradeoff: "尽快寄出和确认资料与账号真的清干净" },
      miss: "支付软件和设备账号还绑定在旧手机上",
      checks: { empathy: ["m4-s3"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s1", "m1-s2", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他完成备份、退出账号、移除旧设备后，重新开机确认进入初始设置。", staleResult: "他只恢复了出厂设置，后来才发现设备账号还没有退出。",
      memoryGood: "出售旧手机：先备份并验收，再退出账号、清除数据、重启检查。", memoryStale: "出售旧手机：恢复出厂不等于账号已经解绑。"
    },
    bus: {
      patienceBase: 6,
      focus: { empathy: "第一次独自去陌生城市怕迟到和坐错", probe: "换乘口、下车提醒和备用路线", advice: "看当天官方线路，截图换乘口并留缓冲时间", story: "别人也会把去程、回程和出口分别标出来", checklist: "查实时线路、标换乘口、设提醒、留缓冲", tradeoff: "路线看起来最快和给临时变更留余地" },
      miss: "九点签到却把到达时间排得太紧",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s3"], advice: ["m1-s1", "m1-s2", "m1-s3"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他按当天线路重新规划，标出换乘口并留出签到前的缓冲时间。", staleResult: "他照旧攻略寻找已经改名的站点，绕路后才赶到。",
      memoryGood: "陌生城市出行：看实时线路、标换乘口，别把到达时间卡死。", memoryStale: "陌生城市出行：旧站名和旧入口可能已经变化。"
    },
    laundry: {
      patienceBase: 5,
      focus: { empathy: "想一次洗完又怕把衣服洗坏", probe: "衣物标签、颜色和材质的限制", advice: "先按标签和颜色分类，不为省一次水全混洗", story: "别人也会把口袋检查和标签放在开机前", checklist: "看标签、分深浅、查口袋、单独处理外套", tradeoff: "省一次洗衣时间和承担串色或损坏风险" },
      miss: "外套标签写着不可机洗却只剩快洗和标准",
      checks: { empathy: ["m4-s4"], probe: ["m4-s1", "m4-s2"], advice: ["m1-s1", "m1-s2"], story: ["m3-s1", "m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: [] },
      goodResult: "他先看标签，分开深浅色和不同材质，没有把不可机洗的外套塞进机器。", staleResult: "他照旧攻略设置水温，后来才发现这件面料不能高温。",
      memoryGood: "第一次洗衣：衣物标签优先，深浅色和特殊材质分开。", memoryStale: "第一次洗衣：旧攻略的温度设置不能替代衣物标签。"
    }
  };

  function makeMaterial(slot, item) {
    return {
      id: "m" + slot,
      kind: item.kind,
      kindLabel: { official: "官方说明", guide: "老攻略", experience: "个人经历", asker: "楼主补充" }[item.kind],
      title: item.title,
      author: item.author,
      date: item.date,
      engagement: slot === 1 ? "官方发布" : slot === 2 ? "经验整理" : slot === 3 ? "近期经历" : "提问者补充",
      source: item.author,
      excerpt: item.texts[0],
      caution: item.caution,
      body: item.texts,
      sentences: item.texts.map((text, index) => ({ id: "m" + slot + "-s" + (index + 1), text, type: item.types[index] || "dry" }))
    };
  }

  function makeMatrix(topic) {
    const methods = ["empathy", "probe", "advice", "story", "checklist", "tradeoff"];
    const moods = base.moodOrder || ["panic", "dazed", "getting", "steady"];
    const profile = profiles[topic.id] || {};
    const focus = profile.focus || {
      empathy: topic.mainAnchor,
      probe: topic.subAnchor,
      advice: "先核实，再行动",
      story: "别人也遇到过类似情况",
      checklist: "先把步骤一项项列出来",
      tradeoff: "选择和风险"
    };
    const hitBodies = {
      empathy: "你说得对，我最担心的就是" + focus.empathy + "。",
      probe: "原来关键是" + focus.probe + "，我先把这个问清楚。",
      advice: "好，我先" + focus.advice + "。",
      story: "听到" + focus.story + "，我没那么慌了。",
      checklist: "我把步骤记下来了：" + focus.checklist + "。",
      tradeoff: "我先比较" + focus.tradeoff + "，再决定。"
    };
    const missFocus = profile.miss || topic.subAnchor;
    const missBodies = {
      empathy: "嗯……我还是想先说清楚" + missFocus + "。",
      probe: "我有点乱，" + missFocus + "还没说清楚。",
      advice: "可是我还不知道第一步应该怎么处理" + missFocus + "。",
      story: "……我先想想，这和我现在遇到的" + missFocus + "不太一样。",
      checklist: "步骤有点多，我还没抓住" + missFocus + "最要紧的地方。",
      tradeoff: "我听到了，但关于" + missFocus + "还是有点拿不准。"
    };
    const moodLead = {
      panic: { hit: "我还是有点慌，不过", miss: "我现在有点慌，" },
      dazed: { hit: "我好像理清一点了，", miss: "我听见了，可是" },
      getting: { hit: "这样就清楚多了，", miss: "我大概明白方向，但" },
      steady: { hit: "嗯，这样我就踏实了：", miss: "我知道你的意思，不过" }
    };
    const matrix = {};
    methods.forEach((method) => {
      matrix[method] = {};
      moods.forEach((mood) => {
        const lead = moodLead[mood] || moodLead.dazed;
        matrix[method][mood] = {
          hit: lead.hit + hitBodies[method],
          miss: lead.miss + missBodies[method]
        };
      });
    });
    return matrix;
  }

  function makePack(topic) {
    const pack = JSON.parse(JSON.stringify(base));
    const profile = profiles[topic.id] || {};
    pack.question = {
      id: topic.id,
      kicker: topic.kicker,
      title: topic.title,
      body: topic.body,
      askerShort: topic.askerShort,
      askerName: topic.askerName,
      address: topic.address,
      stats: ["2 个回答", "4 人关注", "最后编辑于今天"],
      mainAnchor: topic.mainAnchor,
      subAnchor: topic.subAnchor,
      patienceBase: profile.patienceBase || 6,
      opening: topic.opening,
      askerAvatar: topic.askerShort.slice(0, 1)
    };
    pack.materials = topic.materials.map((item, index) => makeMaterial(index + 1, item));
    const checkIds = profile.checks || {
      empathy: ["m3-s1"], probe: ["m4-s1"], advice: ["m1-s1", "m4-s1"], story: ["m3-s2"], checklist: ["m1-s1", "m1-s2", "m1-s3"], tradeoff: []
    };
    pack.checks = {};
    Object.keys(pack.methods).forEach((method) => {
      const ids = checkIds[method] || [];
      const resolvedIds = ids.length ? ids : method === "tradeoff" ? ["m1-s1", "m4-s1"] : [];
      if (!resolvedIds.length) {
        pack.checks[method] = { note: "先把问题说清楚" };
      } else if (method === "checklist" || resolvedIds.length > 1) {
        pack.checks[method] = { anySentenceOf: resolvedIds, minCount: method === "checklist" ? 2 : 1, note: method === "checklist" ? "关键干货句凑满两条，清单才成立" : method === "tradeoff" ? "先把材料里的选择和风险摆开，再决定" : "相关句子足够，回应才落地" };
      } else {
        pack.checks[method] = { needSentence: resolvedIds[0], note: "读到这句，才能真正接住这一题" };
      }
    });
    pack.matrix = makeMatrix(topic);
    pack.letters = {
      good: { text: topic.good, result: profile.goodResult || "他按清楚的步骤处理了这件事。", memory: profile.memoryGood || topic.title.replace(/[？?]/g, "") + "：先核实，再行动。" },
      stale: { text: topic.stale, result: profile.staleResult || "过时信息让他多走了一步，但最后停下来重新核实。", memory: profile.memoryStale || topic.title.replace(/[？?]/g, "") + "：旧经验要先看日期。" }
    };
    const focus = profile.focus || {};
    pack.companion = Object.assign({}, pack.companion, {
      reactionHit: [
        "这次抓住了「" + topic.mainAnchor + "」，再把它落到具体步骤上。",
        "证据和他的担心对上了：" + (focus.advice || topic.subAnchor) + "。"
      ],
      reactionMiss: [
        "先别急，这题真正卡在「" + (profile.miss || topic.subAnchor) + "」。",
        "这张牌还没碰到核心，回到「" + topic.subAnchor + "」再试试。"
      ]
    }, profile.reactions || {});
    pack.archive = "主线第 4-12 题 · " + topic.askerShort;
    return pack;
  }

  window.CoReadV2Season = topics.map(makePack);
})();
