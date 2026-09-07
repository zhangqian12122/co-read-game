const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");

const root = __dirname;
const url = "http://127.0.0.1:4173/?v=20260902-73";

async function inspectAndSelect(page, materialId) {
  await page.locator(`.inspect-material[data-material-id="${materialId}"]`).click();
  await page.locator("#materialModal:not([hidden])").waitFor();
  await page.locator("#modalSendAction").click();
  await page.waitForFunction(() => document.querySelector("#materialModal")?.hidden === true);
}

async function reachDraft(page, tags = { official: "official", context: "context" }) {
  await page.goto(url);
  await page.locator("#startButton").click();
  await page.locator("#roomComputer.has-new-message").waitFor();
  assert.equal(await page.locator('[data-focus="browserWindow"]').first().isDisabled(), true);
  assert.match(await page.locator('[data-window-task="browserWindow"]').innerText(), /1 条新消息/);
  assert.match(await page.locator("#chapterName").innerText(), /等待新消息/);
  await page.locator("#roomComputer").click();
  assert.match(await page.locator("#chapterName").innerText(), /第一次独自去医院/);
  await page.locator("#onboardingGuide:not([hidden])").waitFor();
  assert.match(await page.locator("#onboardingTitle").innerText(), /打开一份材料/);
  await inspectAndSelect(page, "official");
  await inspectAndSelect(page, "context");
  assert.match(await page.locator("#onboardingTitle").innerText(), /去共读房间/);
  await page.locator(`[data-material-id="official"][data-tag-id="${tags.official}"]`).evaluate((button) => button.click());
  await page.locator(`[data-material-id="context"][data-tag-id="${tags.context}"]`).evaluate((button) => button.click());
  assert.match(await page.locator("#onboardingTitle").innerText(), /一起写回答/);
  await page.locator("#synthesizeButton").evaluate((button) => button.click());
  assert.match(await page.locator("#aiSummary").innerText(), /把两张纸看了一遍/);
  assert.equal(await page.locator("#aiSummary .summary-seam").count(), 0);
  if (tags.official === "official" && tags.context === "context") {
    assert.match(await page.locator("#aiSummary").innerText(), /医院那份能告诉他|学校医保还得问/);
  } else {
    assert.match(await page.locator("#aiSummary").innerText(), /两张纸贴的标签都和作者、日期对不上/);
  }
  await page.locator('[data-decision-id="checklist"]').click();
  await page.locator("#draftWorkshop:not([hidden])").waitFor();
}

async function sendDraft(page) {
  await page.locator('[data-draft-choice="clear"]').click();
  await page.locator("#draftPreview:not([hidden])").waitFor();
  assert.match(await page.locator("#draftPreviewText").innerText(), /今晚|身份证/);
  await page.locator("#sendDraftAction").click();
  await page.locator("#followupNotification:not([hidden])").waitFor({ timeout: 3000 });
  await page.locator("#followupNotification").click();
  await page.locator("#followupPanel:not([hidden])").waitFor();
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const page = await context.newPage();

  await reachDraft(page);
  await sendDraft(page);
  assert.equal(await page.locator('[data-hospital-reply-id="confirm"]').isVisible(), true);
  await page.locator('[data-hospital-reply-id="confirm"]').click();
  await page.locator('[data-hospital-closing-id="plan"]').waitFor();
  await page.locator('[data-hospital-closing-id="plan"]').click();
  await page.getByText("带着这段对话回房间", { exact: false }).waitFor();
  assert.ok(await page.locator("#publicComments .public-comment").count() >= 8);
  assert.match(await page.locator("#followupResult").innerText(), /按顺序准备好/);
  await page.screenshot({ path: path.join(root, "e2e-first-chapter-good.png"), fullPage: true });
  await page.locator("#followupContinue").click();
  await page.locator("#permissionAllow:not([hidden])").waitFor();
  assert.match(await page.locator("#growthList").innerText(), /三步/);
  await page.locator("#permissionAllow").click();
  await page.locator("#skipCompanionName:not([hidden])").waitFor();
  await page.locator("#skipCompanionName").evaluate((button) => button.click());
  await page.locator("#followupNotification:not([hidden])").waitFor();
  await page.locator("#followupNotification").click();
  assert.match(await page.locator("#questionTitle").innerText(), /裸辞转行/);
  assert.match(await page.locator("#aiText").innerText(), /先翻到署名和日期/);
  await inspectAndSelect(page, "market");
  await inspectAndSelect(page, "success");
  await page.locator('[data-material-id="market"][data-tag-id="market"]').evaluate((button) => button.click());
  await page.locator('[data-material-id="success"][data-tag-id="method"]').evaluate((button) => button.click());
  await page.locator("#synthesizeButton").evaluate((button) => button.click());
  await page.locator('[data-decision-id="verify"]').click();
  await page.locator("#followupNotification:not([hidden])").waitFor();
  await page.locator("#followupNotification").click();
  await page.locator("#followupPanel:not([hidden])").waitFor();
  await page.locator("#followupContinue").click();
  await page.locator("#finalConversation:not([hidden])").waitFor();
  await page.locator('[data-final-choice="together"]').evaluate((button) => button.click());
  await page.locator("#endingOverlay:not([hidden])").waitFor();
  assert.match(await page.locator("#endingBody").innerText(), /先看作者和日期的习惯/);

  await reachDraft(page);
  await sendDraft(page);
  await page.locator('[data-hospital-reply-id="assume"]').click();
  await page.locator('[data-hospital-closing-id="insist"]').waitFor();
  await page.locator('[data-hospital-closing-id="insist"]').click();
  await page.getByText("带着这段对话回房间", { exact: false }).waitFor();
  assert.match(await page.locator("#followupResult").innerText(), /没有得到可靠确认/);
  assert.match(await page.locator("#publicComments").innerText(), /这个真的能之后再补吗/);
  await page.screenshot({ path: path.join(root, "e2e-first-chapter-risky.png"), fullPage: true });

  await reachDraft(page, { official: "uncertain", context: "official" });
  await sendDraft(page);
  assert.equal(await page.locator('[data-hospital-reply-id="confirm"]').count(), 0);
  assert.match(await page.locator("#followupTitle").innerText(), /悠一问|悠一/);
  await page.locator("#followupContinue").click();
  await page.locator('[data-accountability-id="admit"]').waitFor();

  console.log("PASS 两章完整流程：草稿取舍、公开讨论、跨章属性事件、结局属性回声与错误分支均可操作");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
