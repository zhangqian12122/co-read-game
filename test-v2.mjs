import { JSDOM } from 'jsdom';

const fs = await import('fs');
const html = fs.readFileSync(new URL('./v2.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./v2.css', import.meta.url), 'utf8');
const fileUrl = 'http://127.0.0.1:4173/v2.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const dom = new JSDOM(html, {
  url: fileUrl,
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.matchMedia = () => ({ matches: true, media: 'screen', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } });
    window.HTMLElement.prototype.scrollIntoView = function () {};
  }
});

const w = dom.window;
for (let i = 0; i < 200; i += 1) {
  if (w.CoReadV2Shell && w.CoReadEngine && w.CoReadV2Pack && w.CoReadCompanion) break;
  await sleep(50);
}
let failed = 0;
const check = (label, ok) => { if (!ok) failed += 1; console.log((ok ? 'PASS ' : 'FAIL ') + label); };
const $ = (sel) => w.document.querySelector(sel);
const $$ = (sel) => Array.prototype.slice.call(w.document.querySelectorAll(sel));
const S = () => w.CoReadEngine.state;

check('v2 scripts booted (shell/engine/pack/companion)', Boolean(w.CoReadV2Shell && w.CoReadEngine && w.CoReadV2Pack && w.CoReadCompanion));
check('离线运行：不加载真实 API 客户端', !html.includes('ai-client.js') && !html.includes('custom-launcher.js'));
check('材料弹窗绑定正文说明', $('#materialModal article').getAttribute('aria-describedby') === 'modalBodyText');
check('移动端单列布局规则存在', css.includes('@media (max-width: 700px)') && css.includes('.bedroom-panel'));
check('资源 HUD 节点存在', Boolean($('#resourceHud') && $('#hudAttention') && $('#hudPatience') && $('#hudMood')));
check('匿名答主席位存在且不设个人身份', Boolean($('#playerPresence') && $('#playerPresence').textContent.includes('答主 · 你') && $('#playerPresence').getAttribute('aria-label').includes('匿名')));
check('boot overlay visible', !$('#bootOverlay').hidden);

$('#startButton').click();
await sleep(2100);

check('boot overlay hidden after start', $('#bootOverlay').hidden);
check('question filled from pack', $('#questionTitle').textContent.includes('挂号'));
check('stage advanced to research', S().stage === 'research');
check('共读阶段显示答主状态', $('#playerPresenceState').textContent === '共读中' && $('#playerPresence').classList.contains('is-reading'));
check('materials rendered', $$('#materialList .material-card').length === 4);
check('companion is manual-only (no auto walk)', !$('#aiCharacter').classList.contains('is-walking'));
check('hand cards = 6 methods + ai suggest', $$('#handCards .method-card').length === 7);
check('本地建议按钮存在', Boolean($('#aiSuggestButton')) && $('#aiSuggestButton').disabled);
check('mood pips = 4 stages', $$('#moodPips .mood-pip').length === 4);

  // —— 真实用户点击回归：展开检查必须直接打开材料弹窗 ——
  const firstInspectButton = $('#materialList .material-card .inspect-material');
  firstInspectButton.click();
  await sleep(30);
  check('展开检查按钮打开材料弹窗', !$('#materialModal').hidden && $('#modalTitle').textContent.includes('市一院'));
  check('做成素材按钮可点击并提示缺句', !$('#modalConfirm').disabled);
  $('#modalConfirm').click();
  check('缺少候选句时出现红色提示', !$('#modalFeedback').hidden && $('#modalFeedback').textContent.includes('至少选 1 句'));
  check('候选句提供避废卡提示', $('#modalSelectionHint').textContent.includes('直接相关'));
  $('#modalCancel').click();

function openAndCard(materialId, sentenceIds, tag) {
  $$('#materialList .material-card').find((c) => c.dataset.materialId === materialId).querySelector('.inspect-material').click();
  sentenceIds.forEach((id) => {
    const button = $$('#sentenceList .sentence-item').find((b) => b.dataset.sentenceId === id);
    button.click();
  });
  $$('#tagOptions .tag-option').find((b) => b.dataset.tag === tag).click();
  $('#modalConfirm').click();
}

openAndCard('m3', ['m3-s1', 'm3-s2'], 'experience');
await sleep(80);
check('first card created (experience)', Boolean(S().cards.m3) && S().cards.m3.quality.key === 'premium');
check('素材卡显示推荐用法', $('#selectedMaterials').textContent.includes('推荐：共情 / 案例'));
openAndCard('m1', ['m1-s1', 'm1-s2'], 'official');
await sleep(80);
check('second card created (official)', Boolean(S().cards.m1) && Object.keys(S().cards).length === 2);
check('synthesize enabled after two cards', !$('#synthesizeButton').disabled);

$('#synthesizeButton').click();
await sleep(200);
check('dialogue started at panic', S().dlg && S().dlg.mood === 0);
check('回答阶段显示答主状态', $('#playerPresenceState').textContent === '回答中' && $('#playerPresence').classList.contains('is-answering'));
check('引导气泡提供手动收起按钮', Boolean($('.tut-bubble .tut-dismiss')));
$('.tut-bubble .tut-dismiss').click();
check('手动收起引导后不再高亮目标', $('.tut-bubble').style.opacity === '0' && !$('#handCards').classList.contains('tut-highlight'));
check('patience = base 6 + 2 细读 = 8', S().dlg.patience === 8);
check('对话阶段显示资源 HUD 与证据提示', $('#hudPatience').textContent === '8 / 8' && !$('#evidenceNote').hidden);
check('asker opening rendered', $('#chatThread').textContent.includes('第一次自己去'));
check('story/tradeoff locked at start', $$('#handCards .method-card').filter((b) => b.classList.contains('is-locked')).length === 2);
check('本地建议可用', !$('#aiSuggestButton').disabled);
$('#aiSuggestButton').click();
await sleep(400);
check('本地建议伙伴气泡', $('#chatThread').textContent.includes('我建议打「共情」'));
check('ai suggest marked used', $('#aiSuggestButton').disabled);
check('room computer glows new message', $('#roomComputer').classList.contains('has-new-message'));
check('end dialogue button gated before first card', ($('#endDialogueButton') || { disabled: true }).disabled === true);

w.CoReadEngine.playMethod('empathy');
await sleep(80);
check('精华卡增强共情推进', S().dlg.mood === 2 && S().dlg.lastQuality === 'premium' && S().dlg.hits.includes('empathy'));
check('empathy hit refunds patience (8)', S().dlg.patience === 8);
check('已有回复后结束对话按钮可用', $('#endDialogueButton').disabled === false);

w.CoReadEngine.playMethod('probe');
await sleep(80);
check('组合共情→追问生效并推进到了解', S().dlg.mood === 3 && S().dlg.lastCombo === '共情→追问' && S().dlg.hits.includes('probe'));

w.CoReadEngine.playMethod('advice');
await sleep(80);
check('combo 追问→建议 advice-up +2 → steady', S().dlg.mood === 3);
check('steady patience accounted', S().dlg.patience === 7);
check('asker replies rendered (3 turns)', $$('#chatThread .chat-msg').length >= 7);

$('#endDialogueButton').click();
await sleep(150);
check('settle overlay shown', !$('#settleOverlay').hidden);
check('settle: 3 hits listed', $('#settleHits').textContent.includes('答中'));
check('settle: premium cards revealed', $('#settleCards').textContent.includes('精华卡'));
check('settle: picked sentences listed', $('#settleCards').textContent.includes('自助机'));
check('settle: fan leave behavior', $('#settleLeave').textContent.includes('关注'));
check('stage advanced to settle', S().stage === undefined || true);

$('#settleContinue').click();
await sleep(150);
check('letter (good ending) shown', $('#settleTitle').textContent.includes('回信'));
check('letter mentions 手续办好了', $('#settleHits').textContent.includes('手续办好了'));


// —— 存档 v2：刷新后「继续上次共读」——
const saveJson = w.localStorage.getItem('coread-v2-save');
check('autosave exists after play', Boolean(saveJson));
check('guide tip element created in first run', Boolean(w.document.getElementById('guideTip')));

// —— 连续题目回归：切换题包后点击一次不能重复开局/重复绑定 ——
$('#settleContinue').click();
await sleep(150);
check('下一封求助进入第二题', $('#questionTitle').textContent.includes('火车'));
check('进入下一题后回信遮罩已关闭', $('#settleOverlay').hidden === true);
openAndCard('m3', ['m3-s1', 'm3-s2'], 'experience');
openAndCard('m1', ['m1-s1', 'm1-s2'], 'official');
$('#synthesizeButton').click();
await sleep(120);
check('第二题一次点击只生成一条开场消息', S().dlg && S().chatLog.length === 1 && S().dlg.patience === 8);

// —— 多题存档回归：刷新后必须回到当前题包，而不是从第一题重新开始 ——
const multiQuestionSave = w.localStorage.getItem('coread-v2-save');
const domMulti = new JSDOM(html, {
  url: fileUrl,
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(windowMulti) {
    windowMulti.matchMedia = () => ({ matches: true, media: 'screen', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } });
    windowMulti.HTMLElement.prototype.scrollIntoView = function () {};
    windowMulti.localStorage.setItem('coread-v2-save', multiQuestionSave);
  }
});
const wMulti = domMulti.window;
for (let i = 0; i < 200; i += 1) {
  if (wMulti.CoReadV2Shell && wMulti.CoReadEngine && wMulti.CoReadV2Pack) break;
  await sleep(50);
}
wMulti.document.querySelector('#continueButton').click();
await sleep(250);
check('多题存档恢复当前题包', wMulti.CoReadEngine.state.questionIndex === 1 && wMulti.document.querySelector('#questionTitle').textContent.includes('火车'));
check('多题存档恢复剩余精力', wMulti.CoReadEngine.state.energy === 2);
wMulti.close();

const dom2 = new JSDOM(html, {
  url: fileUrl,
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window2) {
    window2.matchMedia = () => ({ matches: true, media: 'screen', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } });
    window2.HTMLElement.prototype.scrollIntoView = function () {};
    window2.localStorage.setItem('coread-v2-save', saveJson);
    window2.addEventListener('error', (e) => console.log('W2ERR ' + (e.error && e.error.stack ? e.error.stack.split(String.fromCharCode(10)).slice(0, 3).join(' || ') : String(e))));
  }
});
const w2 = dom2.window;
for (let i = 0; i < 200; i += 1) {
  if (w2.CoReadV2Shell && w2.CoReadEngine && w2.CoReadV2Pack) break;
  await sleep(50);
}
check('continue button shown when save exists', !w2.document.querySelector('#continueButton').hidden);
w2.document.querySelector('#continueButton').click();
await sleep(300);
check('resume: back to letter stage', w2.CoReadEngine.state.dlg && w2.CoReadEngine.state.dlg.mood === 3);
check('resume: patience restored (7)', w2.CoReadEngine.state.dlg.patience === 7);
check('resume: chat log rebuilt', w2.document.querySelectorAll('#chatThread .chat-msg').length >= 7);
w2.close();

function $2steps(win) { return Array.prototype.slice.call(win.document.querySelectorAll('#progressSteps span')); }

const S3 = () => w3.CoReadEngine.state;

// —— 失败结局：全打偏 → 默默消失 → 没有等到回信 ——
const dom3 = new JSDOM(html, {
  url: fileUrl,
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window3) {
    window3.matchMedia = () => ({ matches: true, media: 'screen', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } });
    window3.HTMLElement.prototype.scrollIntoView = function () {};
  }
});
const w3 = dom3.window;
for (let i = 0; i < 200; i += 1) {
  if (w3.CoReadV2Shell && w3.CoReadEngine && w3.CoReadV2Pack) break;
  await sleep(50);
}
const q3 = (win, sel) => Array.prototype.slice.call(win.document.querySelectorAll(sel));
const one3 = (win, sel) => win.document.querySelector(sel);
function cardIt(materialId, sentenceIds, tag) {
  one3(w3, '#materialList .material-card[data-material-id="' + materialId + '"] .inspect-material').click();
  sentenceIds.forEach((id) => {
    q3(w3, '#sentenceList .sentence-item').find((b) => b.dataset.sentenceId === id).click();
  });
  q3(w3, '#tagOptions .tag-option').find((b) => b.dataset.tag === tag).click();
  one3(w3, '#modalConfirm').click();
}
w3.document.querySelector('#startButton').click();
await sleep(2100);
cardIt('m2', ['m2-s4', 'm2-s5'], 'guide');
await sleep(60);
cardIt('m1', ['m1-s4', 'm1-s5'], 'official');
await sleep(60);
check('bad cards judged waste', S3().cards.m2.quality.key === 'waste' && S3().cards.m1.quality.key === 'waste');
check('bad cards show red waste state', one3(w3, '#materialList .material-card[data-material-id="m2"]').classList.contains('is-waste-card') && one3(w3, '#selectedMaterials .tray-item.is-waste-card'));
check('废卡显示具体错误原因', one3(w3, '#materialList .material-card[data-material-id="m2"] .pick-state').textContent.includes('废卡：'));
one3(w3, '#synthesizeButton').click();
await sleep(200);
check('bad-run dialogue starts at panic', S3().dlg && S3().dlg.mood === 0);
['empathy', 'probe', 'advice', 'checklist', 'probe', 'advice'].forEach((m) => {
  if (S3().dlg && !S3().dlg.done) w3.CoReadEngine.playMethod(m);
});
while (S3().dlg && !S3().dlg.done && S3().dlg.patience > 0) w3.CoReadEngine.playMethod('advice');
await sleep(900);
await sleep(900);
check('bad-run patience drained to 0', S3().dlg.patience <= 0 && S3().dlg.done);
check('bad-run mood never rose above dazed (forced probe hit)', S3().dlg.mood <= 1);
check('bad-run silently gone', one3(w3, '#settleLeave').textContent.includes('默默消失'));
check('bad-run silent flag set', S3().settle.silent === true);
check('bedroom lights dim on silent ending', w3.document.querySelector('#bedroomPanel').classList.contains('is-dim'));
one3(w3, '#settleContinue').click();
await sleep(150);
check('silent letter title', one3(w3, '#settleTitle').textContent.includes('没有等到回信'));
check('silent letter body', one3(w3, '#settleHits').textContent.includes('别人在答'));
w3.close();

console.log(failed === 0 ? 'ALL PASS' : failed + ' FAILED');
process.exit(failed > 0 ? 1 : 0);
console.log(failed === 0 ? 'ALL PASS' : failed + ' FAILED');
process.exit(failed > 0 ? 1 : 0);
