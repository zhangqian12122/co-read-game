// companion.js - 伙伴漫游系统（自 v1 移植适配 v2 面板）
// 伙伴会自主走动：床边看纸、窗边看夜色、电脑前坐下、软木板前整理；点地板可指挥走位，点电脑伙伴会过去坐下。
(() => {
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const els = {
    scene: document.getElementById("roomScene"),
    character: document.getElementById("aiCharacter"),
    sprite: document.querySelector("#aiCharacter .ai-character-sprite"),
    computer: document.getElementById("roomComputer"),
    computerScreen: document.getElementById("roomComputerScreen"),
    aiText: document.getElementById("aiText")
  };
  if (!els.scene || !els.character) return;

  const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const timers = { roam: null, walk: null, env: null, emotion: null };
  const pos = { x: 34, depth: 6, scale: 1 };
  let roamIndex = 0;
  let currentEnv = null;
  let lastSpot = null;
  let started = false;
  const saidLines = new Set();
  let growthSet = new Set();


  const roamTargets = [
    { x: 68, depth: 16, scale: .84, interaction: "bed" },
    { x: 16, depth: 22, scale: .78, interaction: "window" },
    { x: 40, depth: 18, scale: .8 },
    { x: 58, depth: 9, scale: .95, interaction: "computer" },
    { x: 47, depth: 5, scale: 1 },
    { x: 72, depth: 20, scale: .8, interaction: "board" },
    { x: 25, depth: 8, scale: .92, interaction: "bookshelf" },
    { x: 78, depth: 6, scale: .95 },
    { x: 12, depth: 14, scale: .85, interaction: "lamp" },
    { x: 52, depth: 22, scale: .78 },
    { x: 85, depth: 14, scale: .82, interaction: "plant" },
    { x: 35, depth: 12, scale: .88 }
  ];

  const envConf = {
    bed: { duration: 9000, roomClass: "env-bed-active", label: "正坐在床边看手里的纸" },
    window: { duration: 5600, roomClass: "env-window-active", label: "正站在窗边看夜色" },
    computer: { duration: 8000, roomClass: "env-computer-active", label: "正坐在电脑前核对材料" },
    board: { duration: 5200, roomClass: "env-board-active", label: "正在软木板前整理便签" },
    bookshelf: { duration: 7000, roomClass: "env-bookshelf-active", label: "正在书架前翻阅资料" },
    lamp: { duration: 4800, roomClass: "env-lamp-active", label: "正在台灯下画重点" },
    plant: { duration: 4500, roomClass: "env-plant-active", label: "正在给盆栽浇水" }
  };

  const thoughts = {
    bed: [
      "这张纸上的日期，我圈出来了。",
      "床边安静，适合把材料再读一遍。",
      "读第二遍才发现，有一句我昨天看漏了。",
      "床单皱了……等忙完再整理吧。",
      "这里安静得能听见翻页的声音。"
    ],
    window: [
      "都这个点了，医院的咨询电话应该下班了吧。",
      "窗外那盏灯还亮着，也有人今晚没睡。",
      "明天他要是一个人去，希望有人先陪他把路走一遍。",
      "夜色好深……每扇窗后面都是一个人的事。",
      "星星出来了。明天应该是个晴天。"
    ],
    computer: [
      "我把两份材料的要点敲在屏幕上了，你回头看看。",
      "自助机、报到机……流程对上了。",
      "屏幕比纸好翻，但纸上有笔迹。",
      "搜索结果太多了，得帮他筛一筛。",
      "我把来源和日期标在旁边了，方便核对。"
    ],
    board: [
      "第一张便签写什么……先记日期吧。",
      "便签贴得太高，下次我会先看到它。",
      "来源贴在三张纸上：谁说的、什么时候说的、能不能信。",
      "这张便签可以挪个位置，跟那张放一起。",
      "板满了……说明我们做了很多事。"
    ],
    bookshelf: [
      "书架上有本旧字典，翻翻看有没有帮助。",
      "这本书的位置放反了，我给它正一正。",
      "资料夹里还有前几天的笔记，可以对照看看。",
      "书脊上的灰尘……该擦一擦了。"
    ],
    lamp: [
      "台灯下面光线刚好，把重点句画出来。",
      "灯罩有点歪，扶正一下。",
      "灯光暖色调的，看着舒服。",
      "在灯下划线，画完这段就休息一下。"
    ],
    plant: [
      "盆栽的叶子有点黄了，该浇水了。",
      "它在长新芽……生命力的感觉。",
      "给它浇点水，明天应该精神一些。",
      "植物不会急，慢慢长。有些事也一样。"
    ]
  };

  function applyPos(p) {
    els.character.style.setProperty("--companion-x", p.x + "%");
    els.character.style.setProperty("--companion-depth", p.depth + "%");
    els.character.style.setProperty("--companion-scale", p.scale);
  }

  function removeWalkClasses() {
    els.character.classList.remove("is-walking", "walk-side", "walk-left", "walk-front", "walk-back");
  }

  function clearEnv() {
    window.clearTimeout(timers.env);
    timers.env = null;
    currentEnv = null;
    Object.keys(envConf).forEach((k) => els.scene.classList.remove(envConf[k].roomClass));
    els.character.classList.remove("is-environment-interacting", "interact-bed", "interact-window", "interact-computer", "interact-board", "interact-bookshelf", "interact-lamp", "interact-plant");
    if (els.computer) els.computer.classList.remove("is-companion-active");
    if (els.character.dataset.baseLabel) els.character.setAttribute("aria-label", els.character.dataset.baseLabel);
  }

  function setEmotion(emotion, duration) {
    window.clearTimeout(timers.emotion);
    timers.emotion = null;
    if (emotion) stopWalk();
    ["emotion-receive", "emotion-inspect", "emotion-doubt", "emotion-resolve", "emotion-permission-wait"].forEach((c) => els.character.classList.remove(c));
    if (!emotion) return;
    els.character.classList.add("emotion-" + emotion);
    if (duration > 0) timers.emotion = window.setTimeout(() => setEmotion(null), duration);
  }

  function say(text) {
    if (els.aiText) els.aiText.textContent = text;
    els.character.classList.add("is-pulsing");
    window.setTimeout(() => els.character.classList.remove("is-pulsing"), 420);
  }

  function speakFrom(spot) {
    const pool = thoughts[spot] || [];
    if (!pool.length) return;
    const unused = pool.filter((line) => !saidLines.has(line));
    const line = unused.length ? unused[Math.floor(Math.random() * unused.length)] : pool[Math.floor(Math.random() * pool.length)];
    if (!unused.length) pool.forEach((line2) => saidLines.delete(line2));
    saidLines.add(line);
    say(line);
  }

  function maybeThought(key) {
    if (!started) return;
    speakFrom(key);
  }
  function startEnv(key) {
    const conf = envConf[key];
    if (!conf) return;
    clearEnv();
    currentEnv = key;
    lastSpot = key;
    els.character.dataset.baseLabel = els.character.dataset.baseLabel || els.character.getAttribute("aria-label") || "共读伙伴 00";
    els.character.setAttribute("aria-label", "共读伙伴 00" + conf.label);
    els.character.style.setProperty("--environment-duration", conf.duration + "ms");
    els.character.classList.add("is-environment-interacting", "interact-" + key);
    els.scene.classList.add(conf.roomClass);
    if (key === "computer" && els.computer) els.computer.classList.add("is-companion-active");
    maybeThought(key);
    timers.env = window.setTimeout(() => {
      clearEnv();
    }, reduceMotion() ? 400 : conf.duration);
  }

  function stopWalk() {
    window.clearTimeout(timers.roam);
    window.clearTimeout(timers.walk);
    timers.roam = null;
    timers.walk = null;
    clearEnv();
    if (!els.character.classList.contains("is-walking")) return;
    const style = window.getComputedStyle(els.character);
    const sceneW = els.scene.clientWidth || 1;
    const sceneH = els.scene.clientHeight || 1;
    pos.x = (parseFloat(style.left) / sceneW) * 100;
    pos.depth = (parseFloat(style.bottom) / sceneH) * 100;
    let scale = 1;
    try {
      if (window.DOMMatrixReadOnly) {
        const m = new window.DOMMatrixReadOnly(style.transform);
        scale = Math.max(.72, Math.min(1.05, Math.hypot(m.a, m.b)));
      }
    } catch (e) { /* 降级用当前 scale */ }
    els.character.classList.add("is-roam-frozen");
    applyPos(pos);
    void els.character.offsetWidth;
    removeWalkClasses();
    window.requestAnimationFrame(() => els.character.classList.remove("is-roam-frozen"));
  }



  function walkTo(target, done) {
    const dx = target.x - pos.x;
    const dd = target.depth - pos.depth;
    const depthDominates = Math.abs(dd) * 1.2 > Math.abs(dx);
    const directionClass = depthDominates ? (dd > 0 ? "walk-back" : "walk-front") : "walk-side";
    const sceneRect = els.scene.getBoundingClientRect();
    const characterHeight = els.character.getBoundingClientRect().height || sceneRect.height * .3;
    const pixelDistance = Math.hypot((dx / 100) * sceneRect.width, (dd / 100) * sceneRect.height);
    const gait = Math.max(44, characterHeight * .34);
    const cycles = Math.max(1, Math.min(6, Math.ceil(pixelDistance / gait)));
    const gaitMs = 820;
    const duration = reduceMotion() ? 200 : cycles * gaitMs;
    removeWalkClasses();
    els.character.classList.add("is-walking", directionClass);
    if (!depthDominates && dx < 0) els.character.classList.add("walk-left");
    els.character.style.setProperty("--walk-duration", duration + "ms");
    els.character.style.setProperty("--gait-cycle-duration", gaitMs + "ms");
    els.character.style.setProperty("--gait-cycles", cycles);
    els.character.style.setProperty("--companion-x", target.x + "%");
    els.character.style.setProperty("--companion-depth", target.depth + "%");
    els.character.style.setProperty("--companion-scale", target.scale);
    window.clearTimeout(timers.walk);
    timers.walk = window.setTimeout(() => {
      timers.walk = null;
      pos.x = target.x; pos.depth = target.depth; pos.scale = target.scale;
      removeWalkClasses();
      if (target.interaction) startEnv(target.interaction);
      else if (typeof done === "function") done();
    }, duration + 30);
  }

  function bindRoom() {
    if (els.computer) {
      els.computer.addEventListener("click", (event) => {
        event.stopPropagation();
        stopWalk();
        walkTo({ x: 58, depth: 9, scale: .95, interaction: "computer" });
        shellSay("我就过去坐一会儿，把材料要点理一理。");
      });
    }
    els.character.addEventListener("click", () => {
    speakFrom(currentEnv || lastSpot || "bed");
  });
    els.scene.addEventListener("pointerdown", (event) => {
      if (event.target.closest("#roomComputer") || event.target.closest("#aiCharacter")) return;
      const rect = els.scene.getBoundingClientRect();
      const x = Math.min(88, Math.max(10, ((event.clientX - rect.left) / rect.width) * 100));
      const depth = Math.min(30, Math.max(3, ((rect.bottom - event.clientY) / rect.height) * 100));
      stopWalk();
      walkTo({ x, depth, scale: depth > 18 ? .8 : depth > 10 ? .9 : 1 });
    });
  }

  function shellSay(text) {
    if (window.CoReadV2Shell) window.CoReadV2Shell.setAiText(text);
    else say(text);
  }

  window.CoReadCompanion = {
    start() { started = true; applyPos(pos); bindRoom(); },
    stop() { started = false; stopWalk(); },
    setEmotion,
    say,
    walkTo,
    goToComputer() { stopWalk(); walkTo({ x: 58, depth: 9, scale: .95, interaction: "computer" }); }
  };

  function showGrowthItem(type) {
    if (growthSet.has(type)) return;
    growthSet.add(type);
    let layer = document.querySelector(".room-growth-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "room-growth-layer";
      const canvas = document.querySelector("#roomScene .room-canvas");
      if (canvas) canvas.append(layer);
    }
    const item = document.createElement("div");
    item.className = "room-growth-item growth-" + type;
    layer.append(item);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => item.classList.add("is-visible"), 200);
    });
  }

  window.CoReadCompanion.showGrowthItem = showGrowthItem;
  if (window.CoReadV2Shell) window.CoReadV2Shell.companion = window.CoReadCompanion;
})();
