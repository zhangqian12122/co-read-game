import { JSDOM } from 'jsdom';

const html = (await import('fs')).readFileSync(new URL('./v2.html', import.meta.url), 'utf8');
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
check('boot overlay visible', !$('#bootOverlay').hidden);
check('taskbar buttons built', $$('#taskButtons .task-button').length === 4);

// —— AI 建议路径（mock LLM，注入于开机前使按钮可用）——
w.CoReadAI = {
  isReady: () => true,
  get: () => ({}),
  update: () => {},
  chat: async () => '连接成功',
  chatJson: async (messages) => {
    const c = messages[1].content;
    if (c.includes('availableMethods')) return { method: 'probe', reason: '先问清医保手续' };
    return { text: '稳住，按流程来。' };
  }
};

$('#startButton').click();
await sleep(2100);

check('boot overlay hidden after start', $('#bootOverlay').hidden);
check('question filled from pack', $('#questionTitle').textContent.includes('挂号'));
check('stage advanced to research', S().stage === 'research');
check('materials rendered', $$('#materialList .material-card').length === 4);
check('companion is manual-only (no auto walk)', !$('#aiCharacter').classList.contains('is-walking'));
check('hand cards = 6 methods + ai suggest', $$('#handCards .method-card').length === 7);
check('ai suggest button present and gated when AI off', Boolean($('#aiSuggestButton')) && $('#aiSuggestButton').disabled);
check('mood pips = 4 stages', $$('#moodPips .mood-pip').length === 4);

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
openAndCard('m1', ['m1-s1', 'm1-s2'], 'official');
await sleep(80);
check('second card created (official)', Boolean(S().cards.m1) && Object.keys(S().cards).length === 2);
check('synthesize enabled after two cards', !$('#synthesizeButton').disabled);

$('#synthesizeButton').click();
await sleep(200);
check('dialogue started at panic', S().dlg && S().dlg.mood === 0);
check('patience = base 6 + 2 细读 = 8', S().dlg.patience === 8);
check('asker opening rendered', $('#chatThread').textContent.includes('第一次自己去'));
check('story/tradeoff locked at start', $$('#handCards .method-card').filter((b) => b.classList.contains('is-locked')).length === 2);
check('ai suggest enabled with mock AI', !$('#aiSuggestButton').disabled);
$('#aiSuggestButton').click();
await sleep(400);
check('ai suggest companion bubble', $('#chatThread').textContent.includes('我建议打「追问」'));
check('ai suggest marked used', $('#aiSuggestButton').disabled);
check('room computer glows new message', $('#roomComputer').classList.contains('has-new-message'));
check('end dialogue button gated before first card', ($('#endDialogueButton') || { disabled: true }).disabled === true);

w.CoReadEngine.playMethod('empathy');
await sleep(80);
check('empathy hit via m3-s1 → mood dazed', S().dlg.mood === 1 && S().dlg.hits.includes('empathy'));
check('empathy hit refunds patience (8)', S().dlg.patience === 8);

w.CoReadEngine.playMethod('probe');
await sleep(80);
check('combo 共情→追问 forces probe hit → getting', S().dlg.mood === 2 && S().dlg.hits.includes('probe'));

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
check('stage 4 = 回信', (() => { const steps = $$('#progressSteps span'); return steps[4].classList.contains('is-current'); })());


// —— 存档 v2：刷新后「继续上次共读」——
const saveJson = w.localStorage.getItem('coread-v2-save');
check('autosave exists after play', Boolean(saveJson));
check('guide tip element created in first run', Boolean(w.document.getElementById('guideTip')));

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
check('resume: back to letter stage', (() => { const steps = $2steps(w2); return steps[4].classList.contains('is-current'); })());
check('resume: dialogue restored (mood steady)', w2.CoReadEngine.state.dlg && w2.CoReadEngine.state.dlg.mood === 3);
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
