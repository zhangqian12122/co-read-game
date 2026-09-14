import { readFile, stat } from "node:fs/promises";
import { Script } from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const [html, css, js, server, v1Html, v1Css, v1Js] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
  readFile(path.join(root, "server.js"), "utf8"),
  readFile(path.join(root, "v1.html"), "utf8"),
  readFile(path.join(root, "v1.css"), "utf8"),
  readFile(path.join(root, "app-v1.js"), "utf8")
]);

new Script(js, { filename: "app.js" });
new Script(v1Js, { filename: "app-v1.js" });

const requiredHtml = [
  "browserWindow",
  "roomWindow",
  "materialList",
  "dropZone",
  "roomScene",
  "decisionModal",
  "followupModal"
];
const requiredAssets = [
  "room-stage-0-v1.png",
  "ai-character-stage-0-v1.png",
  "room-prop-books-v1.png",
  "room-prop-hospital-notes-v1.png",
  "room-prop-memory-lantern-v1.png"
];
const requiredFlow = [
  "selectMaterial",
  "setMaterialTag",
  "getTagReview",
  "openDecision",
  "chooseDecision",
  "openFollowup",
  "choosePermission",
  "bindWindowManager",
  "minimizeWindow",
  "toggleMaximizeWindow",
  "closeWindow"
];

const missing = [
  ...requiredHtml.filter((token) => !html.includes(`id=\"${token}\"`)),
  ...requiredFlow.filter((token) => !js.includes(`function ${token}`))
];

if (missing.length) {
  throw new Error(`原型缺少关键节点：${missing.join(", ")}`);
}
if (!css.includes("@media (prefers-reduced-motion: reduce)")) {
  throw new Error("缺少减少动画的可访问性规则");
}
if ((html.match(/data-window-action=/g) || []).length !== 9) {
  throw new Error("三个窗口的最小化、最大化、关闭按钮不完整");
}
if (html.match(/https?:\/\//)) {
  throw new Error("原型不应依赖外部网络资源");
}
if (!css.includes(".room-scene.has-memory") || !js.includes('classList.add("has-memory")')) {
  throw new Error("房间设施成长状态未完整接线");
}
if (!html.includes("共读伙伴 00") || !html.includes("提问者 · 悠一") || /交给AI|这名学生|形成记忆|行动边界/.test(html + js)) {
  throw new Error("角色身份仍含糊，或开发机制文案仍暴露给玩家");
}
if (!css.includes(".room-scene.boundary-allow") || !css.includes(".room-scene.boundary-ask") || !js.includes("memory-${materialId.toLowerCase()}")) {
  throw new Error("材料、回复或行动选择缺少房间回声");
}
if (!js.includes('tone: "source-conflict"') || !css.includes(".autonomy-event.tone-source-conflict") || !html.includes('id="permissionPrompt"')) {
  throw new Error("来源标签误判缺少即时冲突与延迟回响");
}
if (!server.includes('"Cache-Control": "no-store') || !server.includes('rawPath === "/art-v0.2.html"') || !server.includes('rawPath === "/" || rawPath === "/v1.html"')) {
  throw new Error("独立原型入口或禁止缓存响应头缺失");
}
if (!css.includes(".room-window.is-maximized:not(.is-minimized):not(.is-closed)") || /\.app-window\.is-maximized\s*{[^}]*z-index/s.test(css)) {
  throw new Error("最大化房间会覆盖最小化状态或强制置顶");
}

const assetStats = await Promise.all(requiredAssets.map(async (file) => {
  if (!html.includes(`./assets/${file}`)) throw new Error(`美术资产未接入页面：${file}`);
  return stat(path.join(root, "assets", file));
}));
if (assetStats.some((asset) => asset.size < 1024)) {
  throw new Error("美术资产文件异常为空");
}
const readingPoseAsset = await stat(path.join(root, "assets", "ai-character-read-sequence-v2.png"));
if (readingPoseAsset.size < 1024) {
  throw new Error("v1 伙伴六帧读纸精灵图文件异常为空");
}
const bedPoseAsset = await stat(path.join(root, "assets", "ai-character-bed-sequence-v5.png"));
if (bedPoseAsset.size < 1024) {
  throw new Error("v1 伙伴六帧坐床精灵图文件异常为空");
}
const bedSeatedAsset = await stat(path.join(root, "assets", "ai-character-bed-seated-v1.png"));
if (bedSeatedAsset.size < 1024) {
  throw new Error("v1 伙伴透明坐姿精灵图文件异常为空");
}
const walkAssetFiles = ["ai-character-walk-side-v3.png", "ai-character-walk-front-v2.png", "ai-character-walk-back-v4.png"];
const walkAssets = await Promise.all(walkAssetFiles.map((file) => stat(path.join(root, "assets", file))));
if (walkAssets.some((asset) => asset.size < 1024)) {
  throw new Error("v1 伙伴四向步态精灵图文件异常为空");
}

const requiredV1Html = [
  "chapterName",
  "onboardingGuide",
  "onboardingAction",
  "onboardingDismiss",
  "notificationTitle",
  "responsePanel",
  "followupPanel",
  "followupContinue",
  "draftWorkshop",
  "draftThread",
  "sendDraftAction",
  "publicDiscussion",
  "publicComments",
  "privateCompanionNote",
  "roomDialogueActions",
  "confirmChapterReview",
  "materialTransitLayer",
  "roomReadingSeat",
  "autonomyFold",
  "roomComputer",
  "roomComputerScreen",
  "finalConversation",
  "finalChoiceList",
  "endingOverlay",
  "endingTitle",
  "endingArchive",
  "endingRestart"
];
const requiredV1Flow = [
  "markPlayerInteraction",
  "updateOnboardingGuide",
  "handleOnboardingAction",
  "freezeChapterSnapshot",
  "deriveMisjudgmentHistory",
  "getAvailableDecisions",
  "applyChapterTwoAutonomyReview",
  "loadCareerChapter",
  "getCareerFollowupOutcome",
  "openCareerFollowup",
  "renderInitialPublicDiscussion",
  "openResponseDraft",
  "chooseResponseDraft",
  "sendResponseDraft",
  "showHospitalFollowupReplyChoices",
  "chooseHospitalFollowupReply",
  "chooseHospitalFollowupClosing",
  "getCareerPublicCopy",
  "getCareerPublicExchange",
  "runCareerPublicExchange",
  "runPublicExchange",
  "chooseAccountabilityAftermath",
  "showCareerAccountabilityChoices",
  "chooseCareerAccountability",
  "continueFollowupInRoom",
  "getFirstChapterEndingEchoes",
  "completeSecondChapter",
  "showFinalConversation",
  "chooseFinalConversation",
  "showEnding",
  "renderEndingArchive",
  "setCompanionEmotion",
  "animateMaterialTransit",
  "renderRoomMaterialStack",
  "stageChapterOneFacilities",
  "placeAutonomyFold"
];
const careerCombinationKeys = [
  "market+success",
  "failure+market",
  "context+market",
  "failure+success",
  "context+success",
  "context+failure"
];
const careerDecisionBlock = v1Js.slice(v1Js.indexOf("const careerDecisionSets"), v1Js.indexOf("const careerFollowups"));
const careerDecisionCount = (careerDecisionBlock.match(/id: \"(?:verify|listen|move)\"/g) || []).length;

const missingV1 = [
  ...requiredV1Html.filter((token) => !v1Html.includes(`id=\"${token}\"`)),
  ...requiredV1Flow.filter((token) => !v1Js.includes(`function ${token}`)),
  ...careerCombinationKeys.filter((token) => !v1Js.includes(`\"${token}\"`))
];
if (missingV1.length) {
  throw new Error(`v1 缺少关键结构：${missingV1.join(", ")}`);
}
if (careerDecisionCount !== 18) {
  throw new Error(`v1 第二章动态回应数量异常：${careerDecisionCount} / 18`);
}
if (!server.includes('rawPath === "/v1.html"') || !v1Html.includes("./app-v1.js") || !v1Html.includes("./v1.css")) {
  throw new Error("v1 独立入口或资源接线缺失");
}
if (!v1Js.includes("state.introTimer") || !v1Js.includes("window.clearTimeout(state.introTimer)") || !v1Js.includes("interactionRevision !== scheduledAtRevision")) {
  throw new Error("v1 开场提示仍可能覆盖玩家即时反馈");
}
if (!v1Js.includes("Object.freeze") || !v1Js.includes("state.chapterOneSnapshot = snapshot") || !v1Js.includes("getFollowupOutcome(state.chapterOneSnapshot)")) {
  throw new Error("v1 第一章快照未冻结，或回访仍可能读取活状态");
}
if (!v1Js.includes("misjudgments.corrected") || !v1Js.includes("misjudgments.persisted") || !v1Js.includes("const finalLabel =")) {
  throw new Error("v1 未区分误判后改正、坚持误判与普通误判后果");
}
if (!v1Js.includes("if (!state.inspected.has(materialId))") || !v1Js.includes('state.locked ? "回复已经发出"') || !v1Js.includes("state.locked = true")) {
  throw new Error("v1 未强制展开检查，或回复后材料仍可修改");
}
if (!v1Js.includes('requiresAny: ["oldGuide"]') || !v1Js.includes("decision.requiresAny.some") || !v1Js.includes("careerDecisionSets[combinationKey]")) {
  throw new Error("v1 回复选项没有按已选材料动态生成");
}
if (!v1Js.includes('setNotification("archive"') || !v1Js.includes("updateProgress(4)") || !v1Css.includes(".progress-steps.is-complete")) {
  throw new Error("v1 第一章完成态、新档案通知或完成进度缺失");
}
if (!v1Js.includes('setNotification("career-followup"') || !v1Js.includes('notificationMode === "career-followup"') || !v1Js.includes("state.chapterTwoSnapshot?.route")) {
  throw new Error("v1 第二章没有通过可点击通知打开冻结路线的延迟回访");
}
const distinctHospitalFollowups = [
  ["下次我先把能确定的和还要问的分开写，行吗", "伙伴把纸分成“确定的”和“还要问的”两栏", "确定的 / 还要问的"],
  ["下次还缺学校、城市这些事，我能先问清楚吗", "伙伴在学校、城市和目标医院旁各留了一个空格", "先问清条件"],
  ["下次我先帮他把话问出口，没弄清的流程先空着，行吗", "伙伴把手机备忘录放在流程图旁边，中间留了一块空白", "办法留下 / 流程空着"]
];
if (!distinctHospitalFollowups.every((route) => route.every((copy) => v1Js.includes(copy)))) {
  throw new Error("v1 清单、追问与安抚路线缺少各自的提问、回应或墙面痕迹");
}
if (!v1Js.includes('state.permission === "allow"') || !v1Js.includes("showChapterReviewAction(prompt)") || !v1Js.includes("chapterTwoPermissionResolved")) {
  throw new Error("v1 第一章权限没有改变第二章首次调查行为");
}
if (!["route-verifier", "route-listener", "route-initiator"].every((token) => v1Js.includes(token) && v1Css.includes(`.${token}`))) {
  throw new Error("v1 三条路线缺少房间或札记回声接线");
}
if (!v1Html.includes("./v1.css?v=20260902-76") || !v1Html.includes("./app-v1.js?v=20260902-76")) {
  throw new Error("v1 视觉资源版本号未更新");
}
if (!v1Js.includes("const finalConversationChoices") || !["together", "ask", "reread"].every((choice) => v1Js.includes(`${choice}: {`)) || !v1Js.includes('state.step = "ending-conversation"') || !v1Js.includes('state.step = "ending"') || !v1Js.includes('notificationMode === "ending"')) {
  throw new Error("v1 第二章结束后缺少可回应的伙伴对话、差异化结局或可返回的完成状态");
}
if (!v1Html.includes("首个可玩版本 · 完成") || !v1Html.includes("档案 00—01 到这里结束") || !v1Js.includes("下一封信，还会由你们一起打开") || !v1Js.includes("伙伴学会了在替人判断前停一下") || !v1Js.includes("今晚先停在这两封回信")) {
  throw new Error("v1 没有明确收束范围，或三种最终选择没有形成不同结局");
}
if (!v1Js.includes('recordMemory({ id: "ending"') || !v1Css.includes(".ending-overlay") || !v1Css.includes(".final-choice-list")) {
  throw new Error("v1 最终选择没有写入札记，或缺少可见的结局与对话样式");
}
if (!v1Html.includes('id="roomComputerMessage"') || !v1Js.includes("receiveFirstQuestion()") || !v1Js.includes("openFirstQuestionFromComputer()") || !v1Js.includes("state.browserUnlocked") || !v1Css.includes(".room-computer.has-new-message")) {
  throw new Error("v1 开场没有经过房间收信、电脑未读提示与玩家主动打开提问");
}
if (!v1Html.includes('id="companionNaming"') || !v1Html.includes('id="aiSpeaker"') || v1Html.includes("尚未命名") || !v1Js.includes('state.step = "chapter-naming"') || !v1Js.includes("updateCompanionIdentity()")) {
  throw new Error("v1 伙伴命名没有在第一章行为形成后接入后续身份");
}
if (!v1Css.includes(".ai-dialogue.is-resting") || !v1Css.includes("bottom: 3.2%") || !v1Js.includes("letDialogueRest")) {
  throw new Error("v1 房间对话仍未改为可收起的底部对话栏");
}
if (!v1Html.includes("伙伴的共读桌面") || !v1Html.includes("从调查页递来的材料会留在这里") || v1Html.includes("把一份检查过的材料拖进房间") || !v1Js.includes("companionEnvironmentThoughts") || !v1Js.includes("maybeSpeakEnvironmentThought(interactionId)")) {
  throw new Error("v1 共读桌面仍被包装成拖拽玩法，或伙伴缺少环境自主观察");
}
const rewrittenDecisionPaths = [
  "先说去医院前要准备什么", "先问清他在哪所学校、准备去哪家医院", "先说到了医院不知道怎么办", "直接把整套就诊流程写给他",
  "先算清他的钱能撑多久", "先提醒他，别人成功不等于他也准备好了", "先挑几个真实岗位试着投",
  "先算清三个月到底够做什么", "先别拿别人的失败吓他", "先做出一个作品，再决定辞不辞",
  "先把他每月要花的钱算明白", "先问问他是不是已经撑不住了", "先用一周试试转行要做的事",
  "先看看两个人为什么一个成了、一个没成", "先告诉他，这两个结果都不能直接套在他身上", "先在不辞职的情况下开始准备",
  "先看看他离那位成功答主还差什么", "先问清他为什么这么想离开", "先做一个能拿去投的作品",
  "先算算他的存款具体能撑到什么时候", "先别用那个人的失败劝他留下", "先选一种没那么冒险的试法"
];
const removedDecisionJargon = ["先核对市场和缓冲", "给离职设一道门槛", "先拿到触感", "把准备搬到离职以前", "对照成功者的前置条件"];
if (!v1Js.includes("看完这些材料，你们准备先替悠一做什么") || !rewrittenDecisionPaths.every((copy) => v1Js.includes(copy)) || removedDecisionJargon.some((copy) => v1Js.includes(copy)) || !v1Js.includes("decisionConsequences") || !v1Js.includes("buildHospitalPartnerSynthesis") || !v1Js.includes("buildCareerPartnerSynthesis") || !v1Js.includes("会影响他接下来相信什么") || v1Js.includes("summary-supported") || v1Css.includes(".summary-seam") || !v1Css.includes(".partner-synthesis")) {
  throw new Error("v1 材料整理仍像系统报告，或伙伴判断没有随两章材料变化");
}
if (!v1Js.includes("validateHiddenChoiceSystem()") || !v1Js.includes('triggerHiddenTraitEvent("career-entry")') || !v1Js.includes('triggerHiddenTraitEvent("ending")') || !v1Js.includes("permissionTendencies") || !v1Js.includes("careerDraftApproaches") || !v1Js.includes("开头先把他自己的情况摆出来") || !v1Js.includes("刚才决定了先回哪件事，现在第一句话怎么说？") || !v1Js.includes("伙伴遇到说得很完整的材料，会先找它的来源")) {
  throw new Error("v1 选项没有完整接入隐藏属性，或属性事件缺少跨章与结局触发节点");
}
const delayedDecisionEchoes = [
  "清单我真用上了，证件一样没少",
  "你们先问我在哪儿上学、要去哪家医院",
  "备忘录里那几句话挺管用",
  "那份流程写得太像真的了",
  "我又算了一遍，三个月其实没想的那么长",
  "你们先问我是不是已经累坏了",
  "三份试投，一封拒信"
];
if (!delayedDecisionEchoes.every((copy) => v1Js.includes(copy)) || !v1Js.includes("applyDecisionConsequence(snapshot") || !v1Js.includes("consequence: decisionConsequence") || v1Js.includes("这次回复") || v1Js.includes("之后会回来")) {
  throw new Error("v1 有选择尚未冻结并兑现为不同的延迟后果");
}
if (!v1Js.includes("刚才那句是我问的，大家别把它当医院答复") || !v1Js.includes("题主都回来问了，答主怎么一直没回") || !v1Js.includes("他等了一会儿，最后还是自己去解释了") || v1Js.includes("是我在问，不是医院说的") || v1Js.includes("要不先放着？") || v1Js.includes("先不替你圈了")) {
  throw new Error("v1 沉默分支仍不够口语，或仍保留生硬的对照与占位表达");
}
if (!v1Js.includes("function evaluateChapterChoice") || !v1Js.includes('grade = "overcautious"') || !v1Js.includes('grade = "misleading"') || !v1Js.includes("tendencyDeltas") || !v1Js.includes("getChapterTwoReviewProfile") || !v1Js.includes("recordMemory({ id: \"hospital\"") || !v1Css.includes(".principle-card.memory-ledger")) {
  throw new Error("v1 隐藏属性、持续记忆与跨章错误习惯尚未接成同一条后果链");
}
if (!v1Js.includes("buildHospitalIncident") || !v1Js.includes("那明明是我在问") || !v1Js.includes("悠一在旧窗口走错了路") || !v1Js.includes("悠一不再确定哪些话能信") || v1Js.includes("我把回复给医院老师看时")) {
  throw new Error("v1 悠一的不同错误仍未拆成被曲解、走错路与失去信任三种具体事件");
}
if (!v1Js.includes("你们放着新的不用，反而拿一张五年前的攻略给我") || !v1Js.includes("我点开原图看了下，2021 年发的") || v1Js.includes("回答里最好把年份写出来") || v1Js.includes("那张图越完整，我越以为能从头照着走")) {
  throw new Error("v1 旧攻略分支仍把实际受害者和查证路人写成场外审核者");
}
if (!v1Js.includes("function getIncidentDecisionEcho") || !v1Js.includes("后面却把我的问题直接变成了答案") || !v1Js.includes("偏偏没先问这张流程是几年前写的") || !v1Js.includes("连有用的部分也不敢信了") || !v1Js.includes("outcome.incident ? getIncidentDecisionEcho")) {
  throw new Error("v1 不同事故仍在拼接同一段回复次序后果，或具体事故没有覆盖通用旧文案");
}
if (!v1Html.includes("以共读答主身份进入") || !v1Html.includes("回答署名：共读答主 · 你") || !v1Html.includes('id="followupResult"') || !v1Js.includes("署名：共读答主 · 你") || !v1Js.includes("医院刚更新的说明") || !v1Js.includes("reversedBoth") || !v1Css.includes(".inline-followup-panel.is-harm")) {
  throw new Error("v1 未在回答前说明玩家身份，或全反选路线没有同时呈现发出状态、双重误判与负面后果");
}
if (!v1Html.includes('id="accountabilityPanel"') || !v1Js.includes("const accountabilityChoices") || !["admit", "explain", "blame", "ignore"].every((choice) => v1Js.includes(`${choice}: {`)) || !v1Js.includes("showAccountabilityChoices") || !v1Js.includes("resolveAccountabilityChoice") || !v1Js.includes("accountabilityResolution") || !v1Css.includes(".accountability-choice.is-selected")) {
  throw new Error("v1 负面回访没有接入承认、解释、甩锅、沉默四种回应，或选择没有进入房间记忆与下一章伙伴行为");
}
if (!v1Js.includes("const publicVoices") || !v1Js.includes('name: "江声"') || !v1Js.includes('name: "米酒汤圆"') || !v1Js.includes("const accountabilityAftermathChoices") || !v1Js.includes('state.step = "followup-second-choice"') || !v1Js.includes("repairState") || !v1Css.includes(".public-comment.is-system")) {
  throw new Error("v1 公开讨论缺少固定路人声线、自动往返、二次回应或可延续的修复状态");
}
if (!v1Js.includes('name: "林岸"') || !v1Js.includes("function getCareerPublicCopy") || !v1Js.includes("function runCareerPublicExchange") || (v1Js.match(/renderInitialPublicDiscussion\(state\.outcome\)/g) || []).length !== 1 || !v1Js.includes("试投的岗位和目标方向能对上") || !v1Js.includes("直接删掉的话，刚才看过的人也不知道哪些地方错了") || !v1Css.includes('[data-voice="lin"]')) {
  throw new Error("v1 第二章正常与错误回访没有统一接入公开评论区、固定路人和林岸账号");
}
if (!v1Js.includes('const repairState = state.accountabilityResolution?.repairState') || !v1Js.includes('repairState === "full"') || !v1Js.includes('repairState === "late"') || !v1Js.includes('repairState === "quiet"')) {
  throw new Error("v1 第一章二次回应没有改变第二章伙伴的主动程度");
}
if (!v1Html.includes('id="accountabilityReactionLabel"') || !v1Js.includes("const careerMisuseFacts") || !v1Js.includes("getCareerMisuseDetails") || !v1Js.includes("const careerAccountabilityChoices") || !["repair", "askImpact", "defend", "erase"].every((choice) => v1Js.includes(`${choice}: {`)) || !v1Js.includes('tone: "career-conflict"') || !v1Js.includes("resolveCareerAccountabilityChoice") || !v1Js.includes("getFinalCompanionLine")) {
  throw new Error("v1 第二章材料误用仍未按具体来源结算，或林岸回访缺少责任回应与最终关系回声");
}
if (!v1Js.includes("林岸照着建议投了三份，却全投错了方向") || !v1Js.includes("两个晚上重查") || !v1Js.includes("林岸说：后面的建议我不敢照着做") || !v1Js.includes("我浪费了一个周末，还投错了三份") || !v1Js.includes("上次你把错留给了我，这次没有") || v1Js.includes("其中一张材料被用错了")) {
  throw new Error("v1 第二章双重误用仍被压成单一提示，或第一章关系没有进入最终房间");
}
if (!v1Js.includes("你把“${material.kindLabel}”标成了“${tagLabel}”") || !v1Js.includes("我只是说了自己每个月花多少钱、现在还没有作品") || v1Js.includes("林岸只留下了回信的前半段") || v1Js.includes("信任断在后半段") || v1Js.includes("，具体来说，") || v1Js.includes("不是市场规律")) {
  throw new Error("v1 林岸的误用回访仍把系统说明塞进角色对白，或保留无法直接理解的比喻与抽象判断");
}
if (!v1Js.includes("看那张图写得挺全，就直接照着整理了") || !v1Js.includes("行，我先把那张图删了") || !v1Js.includes("照着图写的那几段也一起改掉") || !v1Js.includes("行，改完我再看") || v1Js.includes("先被完整的流程图吸引") || v1Js.includes("哪句错了、改成了什么") || v1Js.includes("我先把原回答改了，刚才为什么会弄错")) {
  throw new Error("v1 先解释后更正的第二轮回复仍存在时态冲突或报告腔");
}
if (!v1Js.includes("每天下班以后累得什么都不想做") || !v1Js.includes("我怕一年以后还在干现在这份工作") || v1Js.includes("最后还是留在原地")) {
  throw new Error("v1 第二章题主正文仍使用场外概括，没有落到林岸的具体处境");
}
if (!v1Js.includes('asker: ""') || !v1Js.includes("elements.askerNote.hidden = !chapter.asker") || !v1Html.includes('id="askerNote" hidden') || (v1Js.match(/kindLabel: "题主后来回复"/g) || []).length !== 2 || !v1Js.includes("同学说学校医保可能要先办手续") || !v1Js.includes("连一份能投的作品都没有") || !v1Js.includes("房租加日常开支每月差不多五千") || !v1Js.includes("还要确认离职补偿，以及目标岗位是否接受没有相关经验的人") || ["我不是立刻想走，我是怕再拖一年", "我最怕的不是排队，是到了窗口", "最怕的不是暂时没收入，而是", "还缺每月开支、离职补偿", 'kindLabel: "题主补充"', 'kindLabel: "题主评论"'].some((copy) => v1Js.includes(copy) || v1Html.includes(copy))) {
  throw new Error("v1 两章题面仍重复展示题主补充，或后来回复没有提供新增条件");
}
if (["递进房间", "请先展开检查", "结果不会在这里立刻判分", "原来这次最先要做的，不是", "那共同署名算什么", "那不叫听见", "并在第二天回来"].some((copy) => v1Js.includes(copy) || v1Html.includes(copy))) {
  throw new Error("v1 仍残留机制剧透、指令腔或角色总结腔文案");
}
if (v1Js.includes("把你的提问当成了医院结论，又把刚更新的医院说明放到了一边") || !v1Css.includes(".inline-followup-panel.is-distrust") || !v1Css.includes(".inline-followup-panel.is-frustrated")) {
  throw new Error("v1 追责回复仍套用固定事故，或不同情绪没有独立视觉状态");
}
if (["承担了它不能证明的事", "医院已经确认的结论", "不能证明手续是什么", "重新核对了整份回复"].some((copy) => v1Js.includes(copy))) {
  throw new Error("v1 角色对白仍残留报告式抽象措辞");
}
if (!v1Html.includes("ai-character-sprite") || !v1Css.includes("./assets/ai-character-read-sequence-v2.png") || !v1Css.includes("companion-reading-cycle") || !v1Css.includes("companion-reading-action") || v1Css.includes("companion-idle-gesture")) {
  throw new Error("v1 伙伴没有使用六帧读纸精灵图，或仍保留整身摇摆动画");
}
if (!walkAssetFiles.every((file) => v1Css.includes(`./assets/${file}`)) || !v1Css.includes("companion-walk-cycle") || !v1Js.includes("function startCompanionWalk") || !v1Js.includes("function stopCompanionWalk")) {
  throw new Error("v1 伙伴没有接入左右、向内、向外步态和可中断的房间移动");
}
if (!v1Css.includes("animation: companion-walk-cycle var(--gait-cycle-duration) steps(1, end) var(--gait-cycles) both;") || !v1Js.includes("const pixelDistance = Math.hypot") || !v1Js.includes("Math.ceil(pixelDistance / gaitCycleDistance)") || !v1Js.includes("const duration = gaitCycles * gaitCycleDuration")) {
  throw new Error("v1 伙伴步态轮数没有按实际像素路程同步");
}
if ((v1Js.match(/scheduleCompanionRoam\(9000\)/g) || []).length < 2 || !v1Js.includes("function scheduleCompanionRoam(delay = 11000)") || !v1Js.includes("scheduleCompanionRoam(10500 + Math.round(Math.random() * 4500))")) {
  throw new Error("v1 伙伴走动间隔不足以完成一轮 7.2 秒读纸动作");
}
if (!["bed", "window", "computer", "board"].every((interaction) => v1Js.includes(`interaction: "${interaction}"`) && v1Css.includes(`env-${interaction}-active`)) || !v1Js.includes("function startCompanionEnvironmentInteraction") || !v1Js.includes("function clearCompanionEnvironmentInteraction") || !v1Html.includes("room-environment-responses") || !v1Css.includes("companion-bed-sequence")) {
  throw new Error("v1 伙伴没有接入坐床、窗边、电脑与软木板四种可中断环境互动");
}
if (v1Html.includes("environment-bed-foreground") || !v1Css.includes("ai-character-bed-sequence-v5.png") || !v1Css.includes("ai-character-bed-seated-v1.png") || !v1Css.includes("transform: translateY(4.8%)") || !v1Css.includes("left: -38%") || !v1Css.includes("transform: translateX(-23.1%) scale(.746)") || !v1Css.includes("background-position: 100% 0") || !v1Css.includes("width: 200%") || !v1Css.includes("width: 3.8%") || !v1Css.includes(".ai-character.stage-one { opacity: 1; }") || !v1Js.includes('{ x: 81, depth: 8, scale: 1.2, interaction: "bed" }')) {
  throw new Error("v1 坐床姿势没有使用统一身体锚点、床角目标或人物身后的接触阴影");
}
if (["decisionModal", "followupModal", "chapterPermissionModal", "endingModal"].some((id) => v1Html.includes(`id="${id}"`)) || !v1Js.includes("revealBrowserPanel(elements.responsePanel)") || !v1Js.includes("revealBrowserPanel(elements.followupPanel)")) {
  throw new Error("v1 比较、回信或伙伴确认仍通过突兀的全屏结算层呈现");
}
if (!v1Css.includes(".room-computer:hover") || !v1Js.includes('focusWindow("browserWindow")') || !v1Html.includes('class="wall-note is-empty"') || v1Html.includes(">资料<") || v1Html.includes("共读席")) {
  throw new Error("v1 房间环境交互仍暴露廉价功能标签");
}
const forbiddenV1PlayerCopy = [
  "档案阶段结果 / V1",
  "共读伙伴表现出",
  "选择会冻结本章材料、标签和误判历史",
  "第一章快照已经冻结",
  "普通误判也回来了",
  "没有让它被结算文字抹掉",
  "伙伴获得了先指出来源或时间冲突的权限"
];
if (forbiddenV1PlayerCopy.some((copy) => v1Html.includes(copy) || v1Js.includes(copy))) {
  throw new Error("v1 玩家界面仍暴露结算或状态实现文案");
}
const commitMaterialBlock = v1Js.slice(v1Js.indexOf("function commitMaterialSelection"), v1Js.indexOf("function removeMaterial"));
if (!commitMaterialBlock.includes("animateMaterialTransit") || commitMaterialBlock.includes('focusWindow("roomWindow")')) {
  throw new Error("v1 材料递交没有通过跨窗动画，或仍会强制把房间抢到前台");
}
if (!v1Js.includes('duration: reducedMotion ? 140 : 320') || !v1Js.includes('matchMedia("(prefers-reduced-motion: reduce)")') || !v1Css.includes(".material-transit-paper")) {
  throw new Error("v1 320ms 材料转移动画或减少动画分支缺失");
}
const companionEmotions = ["receive", "inspect", "doubt", "resolve", "permission-wait"];
if (!companionEmotions.every((emotion) => v1Css.includes(`emotion-${emotion}`)) || !v1Js.includes("companionEmotionClasses") || !v1Js.includes('elements.aiCharacter.dataset.emotion')) {
  throw new Error("v1 伙伴情绪状态缺少互斥控制或独立样式");
}
if (!v1Css.includes(".ai-character.emotion-doubt::after") || !v1Js.includes('elements.aiText.textContent = "……"') || !v1Js.includes("}, 260)")) {
  throw new Error("v1 来源冲突缺少可感知停顿或橙色灯反馈");
}
if (!v1Js.includes('classList.add("has-memory", "memory-papers")') || !v1Js.includes('classList.add("memory-lamp")') || !v1Css.includes("#roomScene.memory-papers .room-prop-books")) {
  throw new Error("v1 第一章票据、书与记忆灯未分阶段出现");
}
if (["route-board-echo", "route-desk-echo"].some((token) => v1Html.includes(token) || v1Css.includes(`.${token}`))) {
  throw new Error("v1 房间仍残留与背景画风不一致的 CSS 书本贴纸");
}
if (!v1Css.includes("left: 22.7%") || !v1Css.includes("#roomScene .room-memory-beacon.is-visible { opacity: .2; }") || v1Css.includes("0 0 19px 7px")) {
  throw new Error("v1 记忆光点仍悬浮在房间中或保留霓虹式路线光效");
}
if (!v1Html.includes('data-origin="companion"') || !v1Js.includes("window.setTimeout(placeAutonomyFold") || !v1Css.includes("@keyframes autonomy-fold-place")) {
  throw new Error("v1 结尾缺少伙伴自主放入的折页标记");
}
if (!v1Css.includes("width: 3.1%") || !v1Css.includes("width: 3.9%") || !v1Css.includes("width: 4.6%") || !v1Css.includes("width: 3%") || !v1Css.includes("grid-template-rows: 34px minmax(0, 1fr) 176px")) {
  throw new Error("v1 房间新增物件没有按原场景比例缩小，或聚焦构图比例缺失");
}
if (!v1Css.includes("filter: drop-shadow(4px 6px 0 rgba(31, 24, 27, .42))") || v1Css.includes(".room-canvas::after") || !v1Css.includes("--note-mark") || !v1Css.includes(".room-scene.memory-lamp .room-canvas::before")) {
  throw new Error("v1 原房间或人物被成长视觉误改，或成长设施缺少自身的环境光融合");
}

console.log("PASS app.js 语法可解析");
console.log(`PASS ${requiredHtml.length} 个界面节点存在`);
console.log(`PASS ${requiredFlow.length} 个核心流程函数存在`);
console.log("PASS 三个窗口均具备完整标题栏控制");
console.log(`PASS ${requiredAssets.length} 个正式美术资产已接入，设施成长状态完整`);
console.log("PASS 独立 v0.2 入口启用，响应禁止缓存");
console.log("PASS 最大化房间服从前后台层级，最小化不会被网格布局覆盖");
console.log("PASS 角色身份明确，结尾回到房间且三类选择均留下回声");
console.log("PASS 来源标签误判会触发即时质疑与差异化回访");
console.log("PASS 无外部资源依赖，包含减少动画规则");
console.log(`PASS v1 ${requiredV1Html.length} 个新增界面节点与 ${requiredV1Flow.length} 个状态流程函数存在`);
console.log("PASS v1 开场竞态取消、检查门槛、回复锁定与冻结快照结构完整");
console.log("PASS v1 误判后改正、坚持误判与普通误判均保留过程后果");
console.log(`PASS v1 第二章 4 份材料、${careerCombinationKeys.length} 种组合与 18 个动态回应已接线`);
console.log("PASS v1 第一章完成态、新档案通知、跨章权限与三路线回声已接线");
console.log("PASS v1 第二章通过可点击的几周后来信通知打开冻结路线回访");
console.log("PASS v1 320ms 跨窗材料转移、后层提示与减少动画分支已接线");
console.log("PASS v1 五种互斥伙伴情绪、冲突停顿与橙色灯已接线");
console.log("PASS v1 第一章设施分拍、三路线实体回声与自主折页已接线");
console.log("PASS v1 七种回复选择均冻结当下结果与延迟回声");
console.log("PASS v1 隐藏属性、札记事件与下一章伙伴习惯已接入持续后果");
console.log("PASS v1 多份来源错标会按材料身份分别解释，不再让悠一第三人称指认自己");
if (!v1Js.includes("hospitalDraftApproaches") || !v1Js.includes("hospitalFollowupReplyChoices") || !v1Js.includes('state.step = "followup-conversation-closing"') || !v1Js.includes("hospitalConversationResolution")) {
  throw new Error("v1 第一章缺少发送前草稿取舍、评论追问、二次回应或跨章回声");
}
if (!v1Html.includes("第一次共读的三个步骤") || !v1Css.includes(".onboarding-guide") || !v1Js.includes('title: "去共读房间，告诉伙伴这两份材料怎么用"')) {
  throw new Error("v1 开场缺少流程预告、分步任务提示或跨窗口引导");
}
if (!v1Html.includes('class="boot-scene-room"') || !v1Html.includes('class="boot-scene-character"') || !v1Html.includes("和房间里的伙伴") || !v1Css.includes(".boot-scene figcaption")) {
  throw new Error("v1 封面没有使用正式房间与伙伴美术，或缺少开场叙事层");
}

if (!v1Css.includes(".question-body { font-size: 14px; }") || !v1Css.includes(".public-comment p { font-size: 12px; }") || !v1Css.includes(".ai-dialogue > p,") || !v1Css.includes(".ending-body { font-size: 15px; }")) {
  throw new Error("v1 正文、评论、伙伴对话或结局文字仍未统一放大");
}

console.log("PASS v1 正式房间与伙伴封面、房间收信与电脑主动开题、伙伴口语整理、整体可读性放大、开场三步预告、随进度变化的跨窗口引导、六帧读纸、脚底锚定步态、不透明床边站姿、承重坐姿、自主观察、两章统一公开评论、两章发送前草稿取舍、全选项隐藏属性审计、跨章属性事件、结局属性回声、二次回应、跨章关系记忆、仅作用于新增设施的成长视觉层、三种结局与 20260902-76 资源版本已锁定");
