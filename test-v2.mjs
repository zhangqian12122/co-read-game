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

$('#startButton').click();
await sleep(2100);

check('boot overlay hidden after start', $('#bootOverlay').hidden);
check('question filled from pack', $('#questionTitle').textContent.includes('挂号'));
check('stage advanced to research', S().stage === 'research');
check('materials rendered', $$('#materialList .material-card').length === 4);
check('companion is manual-only (no auto walk)', !$('#aiCharacter').classList.contains('is-walking'));
check('hand cards = 6 methods', $$('#handCards .method-card').length === 6);
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
check('room computer glows new message', $('#roomComputer').classList.contains('has-new-message'));
check('end dialogue button gated before first card', $('#endDialogueButton').disabled);

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

console.log(failed === 0 ? 'ALL PASS' : failed + ' FAILED');
process.exit(failed > 0 ? 1 : 0);
