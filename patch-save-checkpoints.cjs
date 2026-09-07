const fs = require("fs");
const D = String.fromCharCode(34);
const q = (s) => s.split("@Q@").join(D);
function patch(file, edits) {
  let text = fs.readFileSync(file, "utf8");
  const failures = [];
  edits.forEach(([anchor, replacement], index) => {
    const a = q(anchor);
    const r = q(replacement);
    const count = text.split(a).length - 1;
    if (count !== 1) {
      failures.push(file + " #E" + index + " count=" + count);
      return;
    }
    text = text.replace(a, r);
  });
  if (failures.length) {
    console.error("PATCH FAILED:\n" + failures.join("\n"));
    process.exit(1);
  }
  fs.writeFileSync(file, text);
  console.log("patched " + file);
}

const EDITS = [
  [
    `  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 320 : 2100);
}`,
    `  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 320 : 2100);
  checkpoint("hospital-research");
}`
  ],
  [
    `  setAiText("看到了，叫悠一，他好像第一次自己去医院，你先读读他怎么说，我也一起看");
  focusWindow("browserWindow");
  updateOnboardingGuide();
}`,
    `  setAiText("看到了，叫悠一，他好像第一次自己去医院，你先读读他怎么说，我也一起看");
  focusWindow("browserWindow");
  updateOnboardingGuide();
  checkpoint(state.chapterId + "-research");
}`
  ],
  [
    `  if (state.companionEmotion !== "doubt" && state.companionEmotion !== "permission-wait") setCompanionEmotion("inspect", 1300);
}`,
    `  if (state.companionEmotion !== "doubt" && state.companionEmotion !== "permission-wait") setCompanionEmotion("inspect", 1300);
  checkpoint(state.chapterId + "-research");
}`
  ],
  [
    `      : "两张纸都到了，先一张张看吧，别急着合在一起。");
  }
}`,
    `      : "两张纸都到了，先一张张看吧，别急着合在一起。");
  }
  checkpoint(state.chapterId + "-research");
}`
  ],
  [
    `  setAiText("好，这张先拿回去。刚才贴的标签也不算了。");
}`,
    `  setAiText("好，这张先拿回去。刚才贴的标签也不算了。");
  checkpoint(state.chapterId + "-research");
}`
  ],
  [
    `  state.tagHistory[materialId].push({ tagId, conflicted: isTagConflict(material, tagId) });
  renderTray();`,
    `  state.tagHistory[materialId].push({ tagId, conflicted: isTagConflict(material, tagId) });
  renderTray();
  checkpoint(state.chapterId + "-research");`
  ],
  [
    `  setAiText(review.conflicts.length ? "这张标签还是对不上。真要带着这个问号回他吗？" : "两张纸我都看完了。那我们先帮他做哪件事？" );
}`,
    `  setAiText(review.conflicts.length ? "这张标签还是对不上。真要带着这个问号回他吗？" : "两张纸我都看完了。那我们先帮他做哪件事？" );
  checkpoint(state.chapterId + "-synthesis");
}`
  ],
  [
    `  setAiText(getDraftOpening(decision.id));
}`,
    `  setAiText(getDraftOpening(decision.id));
  checkpoint(state.chapterId + "-drafting");
}`
  ],
  [
    `  setAiText(approach.partner);
}`,
    `  setAiText(approach.partner);
  checkpoint(state.chapterId + "-draft-ready");
}`
  ],
  [
    `      updateProgress(3);
    }, 1200);
  }
}`,
    `      updateProgress(3);
    }, 1200);
  }
  checkpoint(state.chapterId + "-responded");
}`
  ],
  [
    `  renderInitialPublicDiscussion(outcome);
  if (!harmful) showHospitalFollowupReplyChoices();
}`,
    `  renderInitialPublicDiscussion(outcome);
  if (!harmful) showHospitalFollowupReplyChoices();
  checkpoint("hospital-followup");
}`
  ],
  [
    `    action: harmful ? "回复林岸" : "读完，回房间看看"
  });
  renderInitialPublicDiscussion(state.outcome);
}`,
    `    action: harmful ? "回复林岸" : "读完，回房间看看"
  });
  renderInitialPublicDiscussion(state.outcome);
  checkpoint("career-followup");
}`
  ],
  [
    `      state.roomAftermathTimer = null;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900);
    return;`,
    `      state.roomAftermathTimer = null;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900);
    checkpoint("hospital-aftermath");
    return;`
  ],
  [
    `  window.setTimeout(() => setNotification("archive", "+", "收到一份新档案", "档案 01 · 一条没有官方答案的路"), 720);
}`,
    `  window.setTimeout(() => setNotification("archive", "+", "收到一份新档案", "档案 01 · 一条没有官方答案的路"), 720);
  checkpoint("hospital-complete");
}`
  ],
  [
    `  setAiText(intro);
}`,
    `  setAiText(intro);
  checkpoint("career-research");
}`
  ],
  [
    `  window.setTimeout(() => showFinalConversation(route), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 980);
}`,
    `  window.setTimeout(() => showFinalConversation(route), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 980);
  checkpoint("ending-conversation");
}`
  ],
  [
    `  window.requestAnimationFrame(() => elements.endingTitle.focus({ preventScroll: true }));
}`,
    `  window.requestAnimationFrame(() => elements.endingTitle.focus({ preventScroll: true }));
  checkpoint("ending");
}`
  ],
  [
    `    setNotification("ending", "✓", "档案 00—01 已完成", "点击可以再看一次结局");
    focusWindow("roomWindow");
  });`,
    `    setNotification("ending", "✓", "档案 00—01 已完成", "点击可以再看一次结局");
    focusWindow("roomWindow");
    checkpoint("ended-room");
  });`
  ]
];

patch("app-v1.js", EDITS);
