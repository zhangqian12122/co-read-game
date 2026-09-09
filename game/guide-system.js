// guide-system.js - 步骤引导气泡
// 在目标元素旁边显示带编号的教学气泡，完成后自动消失并推进下一步。
(() => {
  let bubble = null;
  let highlighted = null;
  let stepNum = 0;
  let dismissed = false;

  function ensureBubble() {
    if (bubble) return bubble;
    bubble = document.createElement("div");
    bubble.className = "tut-bubble";
    bubble.innerHTML = '<span class="tut-num">1</span><span class="tut-text"></span><button class="tut-dismiss" type="button" aria-label="关闭当前引导">× 收起</button>';
    bubble.querySelector(".tut-dismiss").addEventListener("click", hide);
    document.body.append(bubble);
    return bubble;
  }

  function clearHighlight() {
    if (highlighted) {
      highlighted.classList.remove("tut-highlight");
      highlighted = null;
    }
  }

  function positionNear(el) {
    const b = ensureBubble();
    const rect = el.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    let top = rect.bottom + 12;
    let left = rect.left + rect.width / 2 - bRect.width / 2;
    if (top + bRect.height > window.innerHeight - 50) top = rect.top - bRect.height - 12;
    left = Math.max(8, Math.min(left, window.innerWidth - bRect.width - 8));
    b.style.top = top + "px";
    b.style.left = left + "px";
  }

  function show(step, text, targetSelector) {
    const b = ensureBubble();
    b.querySelector(".tut-num").textContent = step;
    b.querySelector(".tut-text").textContent = text;
    b.style.opacity = "1";
    clearHighlight();
    if (targetSelector) {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.classList.add("tut-highlight");
        highlighted = el;
        window.requestAnimationFrame(() => positionNear(el));
      }
    }
  }

  function hide() {
    clearHighlight();
    if (bubble) bubble.style.opacity = "0";
    dismissed = true;
  }

  function showOnce(key, step, text, targetSelector) {
    if (dismissed) return;
    show(step, text, targetSelector);
  }

  window.CoReadGuide = { show, showOnce, hide, clearHighlight };
})();
