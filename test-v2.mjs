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
  if (w.CoReadV2Shell && w.CoReadEngine && w.CoReadV2Pack) break;
  await sleep(50);
}
let failed = 0;
const check = (label, ok) => { if (!ok) failed += 1; console.log((ok ? 'PASS ' : 'FAIL ') + label); };

check('v2 scripts booted', Boolean(w.CoReadV2Shell && w.CoReadEngine && w.CoReadV2Pack));
check('boot overlay visible', !w.document.querySelector('#bootOverlay').hidden);
check('taskbar buttons built', w.document.querySelectorAll('#taskButtons .task-button').length === 4);

w.document.querySelector('#startButton').click();
await sleep(2100);

check('boot overlay hidden after start', w.document.querySelector('#bootOverlay').hidden);
check('question filled from pack', w.document.querySelector('#questionTitle').textContent.includes('挂号'));
check('stage advanced to research', w.CoReadEngine.state.stage === 'research');
check('materials rendered', w.document.querySelectorAll('#materialList .material-card').length === 4);
check('attention pips = 2', w.document.querySelectorAll('#attentionPips span').length === 2);
check('bedroom panel present', Boolean(w.document.querySelector('#bedroomPanel .room-base-art')));
check('hand cards = 6 methods', w.document.querySelectorAll('#handCards .method-card').length === 6);
check('mood pips = 4 stages', w.document.querySelectorAll('#moodPips .mood-pip').length === 4);

w.document.querySelector('#materialList .material-card .inspect-material').click();
await sleep(100);
const sendButtons = w.document.querySelectorAll('#materialList .send-action');
check('send unlocked after inspect', !sendButtons[0].disabled);
sendButtons[0].click();
await sleep(100);
check('material selected into tray', w.CoReadEngine.state.selected.length === 1);
check('tray count updated', w.document.querySelector('#trayCount').textContent.includes('1'));

console.log(failed === 0 ? 'ALL PASS' : failed + ' FAILED');
if (failed > 0) process.exit(1);

process.exit(failed > 0 ? 1 : 0);
