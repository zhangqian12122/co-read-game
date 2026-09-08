// guide-system.js - 步骤引导系统
// 常驻引导条显示当前目标，目标元素加脉冲高亮。每个引导只出现一次（本次会话）。
(() => {
  let banner = null;
  let highlighted = null;
  const shown = new Set();

  function ensureBanner() {
    if (banner) return banner;
    banner = document.createElement("div");
    banner.className = "guide-banner";
    banner.innerHTML = '<span class="guide-step">?</span><span class="guide-text"></span><span class="guide-arrow">→</span>';
    document.body.append(banner);
    return banner;
  }

  function clearHighlight() {
    if (highlighted) {
      highlighted.classList.remove("guide-highlight");
      highlighted = null;
    }
  }

  function show(text, targetSelector) {
    const b = ensureBanner();
    b.querySelector(".guide-text").textContent = text;
    b.style.opacity = "1";
    b.style.pointerEvents = "auto";
    clearHighlight();
    if (targetSelector) {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.classList.add("guide-highlight");
        highlighted = el;
      }
    }
  }

  function hide() {
    clearHighlight();
    if (banner) banner.style.opacity = "0";
  }

  function showOnce(key, text, targetSelector) {
    if (shown.has(key)) return;
    shown.add(key);
    show(text, targetSelector);
  }

  window.CoReadGuide = { show, showOnce, hide, clearHighlight, shown };
})();
