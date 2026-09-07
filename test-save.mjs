import { JSDOM } from "jsdom";
process.on("uncaughtException", (e) => { console.log("PROC_ERR " + (e && e.stack ? e.stack : String(e))); });
import { readFileSync } from "fs";
import { pathToFileURL } from "url";

const html = readFileSync(new URL("./v1.html", import.meta.url), "utf8");
const fileUrl = "http://127.0.0.1:4173/v1.html";

const SAVE_KEY = "coread-save-v1";
function makeDom(savedJson) {
  const dom = new JSDOM(html, {
    url: fileUrl,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: true, media: "screen", addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } });
      window.DOMMatrixReadOnly = class { constructor() { this.a = 1; this.b = 0; } };
      window.Element.prototype.animate = function () { return { addEventListener() {}, cancel() {}, finish() {} }; };
      window.HTMLElement.prototype.scrollIntoView = function () {};
      window.confirm = () => true;
      window.confirm = () => true;
      window.addEventListener("error", (e) => { console.log("WINDOW_ERR " + (e && e.message ? e.message : String(e))); });
      if (savedJson) window.localStorage.setItem(SAVE_KEY, savedJson);
    }
  });
  return dom;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function boot(dom) {
  const w = dom.window;
  for (let i = 0; i < 200; i++) {
    if (w.CoReadSave && w.document.querySelector("#startButton") && w.eval("typeof state !== 'undefined'")) break;
    await sleep(50);
  }
  if (!w.CoReadSave) throw new Error("game scripts did not boot");
  await sleep(150);
  return w;
}

const st = (w, expr) => w.eval(expr);
const click = (w, sel) => {
  const el = w.document.querySelector(sel);
  if (!el) throw new Error("missing element: " + sel);
  el.click();
};
const readSave = (w) => JSON.parse(w.localStorage.getItem(SAVE_KEY));
const assert = (cond, label) => { if (!cond) throw new Error("ASSERT FAIL: " + label); };
export { makeDom, boot, st, click, readSave, assert, sleep };

async function playFreshChapter1(w) {
  click(w, `#startButton`);
  await sleep(500);
  click(w, `#roomComputer`);
  await sleep(300);
  click(w, `.material-card[data-material-id=official] .inspect-material`);
  click(w, `#modalSendAction`);
  click(w, `.material-card[data-material-id=context] .inspect-material`);
  click(w, `#modalSendAction`);
  await sleep(400);
  click(w, `.tag-button[data-material-id=official][data-tag-id=official]`);
  click(w, `.tag-button[data-material-id=context][data-tag-id=context]`);
  click(w, `#synthesizeButton`);
  await sleep(200);
}

const results = [];
function report(name, ok, detail) {
  results.push({ name, ok });
  console.log((ok ? `PASS ` : `FAIL `) + name + (detail ? `  -> ` + detail : ``));
}

{
  const dom = makeDom(null);
  const w = await boot(dom);
  report(`boot: no save, continue hidden`, w.document.querySelector(`#continueButton`).hidden === true);
  await playFreshChapter1(w);
  const save = readSave(w);
  report(`autosave at synthesis checkpoint`, save.position === `hospital-synthesis` && st(w, `state.step`) === `synthesis`, save.position);
  report(`chapter progress captured`, save.state.selected.length === 2 && save.state.tags.official === `official` && save.state.tags.context === `context`, JSON.stringify(save.state.tags));
  dom.window.close();
}
{
  const dom = makeDom(null);
  const w = await boot(dom);
  await playFreshChapter1(w);
  const snap1 = readSave(w);
  dom.window.close();
  const dom2 = makeDom(JSON.stringify(snap1));
  const w2 = await boot(dom2);
  report(`reload: continue button visible`, w2.document.querySelector(`#continueButton`).hidden === false);
  report(`reload: save hint shows archive label`, w2.document.querySelector(`#saveHint`).textContent.includes(`档案 00`), w2.document.querySelector(`#saveHint`).textContent);
  click(w2, `#continueButton`);
  await sleep(400);
  report(`resume: back at synthesis`, st(w2, `state.step`) === `synthesis`, st(w2, `state.step`));
  report(`resume: selected materials restored`, st(w2, `state.selected`).join(`,) === snap1.state.selected.join(`,), st(w2, `JSON.stringify(state.selected)`));
  report(`resume: tags restored`, st(w2, `state.tags.official`) === `official` && st(w2, `state.tags.context`) === `context`);
  report(`resume: decision options rendered`, w2.document.querySelectorAll(`.decision-option`).length >= 2, String(w2.document.querySelectorAll(`.decision-option`).length));
  w2.close();
}

{
  const dom = makeDom(null);
  const w = await boot(dom);
  await playFreshChapter1(w);
  click(w, `.decision-option[data-decision-id=checklist]`);
  await sleep(250);
  report(`drafting checkpoint`, readSave(w).position === `hospital-drafting` && st(w, `state.step`) === `drafting`);
  click(w, `.draft-choice`);
  await sleep(250);
  report(`draft-ready checkpoint`, readSave(w).position === `hospital-draft-ready` && st(w, `state.step`) === `draft-ready`);
  const readySave = readSave(w);
  click(w, `#sendDraftAction`);
  await sleep(1600);
  report(`responded checkpoint`, readSave(w).position === `hospital-responded` && st(w, `state.step`) === `responded`);
  report(`responded: chapter snapshot frozen`, st(w, `state.chapterOneSnapshot.decision`) === `checklist`);
  const respondedSave = readSave(w);
  dom.window.close();

  const dom2 = makeDom(JSON.stringify(readySave));
  const w2 = await boot(dom2);
  click(w2, `#continueButton`);
  await sleep(400);
  report(`resume draft-ready: draft choice restored`, st(w2, `state.step`) === `draft-ready` && st(w2, `state.draftChoice`) === readySave.state.draftChoice);
  report(`resume draft-ready: send button visible`, w2.document.querySelector(`#sendDraftAction`).hidden === false);
  w2.close();

  const dom3 = makeDom(JSON.stringify(respondedSave));
  const w3 = await boot(dom3);
  click(w3, `#continueButton`);
  await sleep(500);
  report(`resume responded: notification shown immediately`, w3.document.querySelector(`#followupNotification`).hidden === false);
  report(`resume responded: clock set to next morning`, w3.document.querySelector(`#systemClock`).textContent === `16:24`, w3.document.querySelector(`#systemClock`).textContent);
  report(`resume responded: room outcome classes restored`, w3.document.querySelector(`#roomScene`).className.includes(`reply-checklist`) && w3.document.querySelector(`#roomScene`).className.includes(`outcome-accurate`));
  click(w3, `#followupNotification`);
  await sleep(400);
  report(`followup opens after resume`, [`followup-reading`, `followup-conversation`, `followup-challenge`].includes(st(w3, `state.step`)), st(w3, `state.step`));
  report(`followup: asker reply rendered`, w3.document.querySelector(`#followupText`).textContent.length > 10);
  w3.close();
}
console.log(results.length + ` checks, ` + results.filter((r) => !r.ok).length + ` failed`);
if (results.some((r) => !r.ok)) process.exit(1);
