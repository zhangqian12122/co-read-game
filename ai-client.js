// ai-client.js - CoRead AI 增强适配层
// OpenAI 兼容协议（适配智谱 GLM / DeepSeek / 任何兼容端点）。
// 配置只保存在本机 localStorage；未启用或调用失败时，游戏回退到内置脚本内容。

(() => {
  const SETTINGS_KEY = "coread-ai-settings-v1";
  const DEFAULTS = {
    enabled: false,
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: "",
    model: "glm-4-flash"
  };

  function load() {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch (error) {
      return { ...DEFAULTS };
    }
  }

  let settings = load();

  function get() { return settings; }

  function update(patch) {
    settings = { ...settings, ...patch };
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (error) { /* 忽略写入失败 */ }
    return settings;
  }

  function isReady() {
    return Boolean(settings.enabled && settings.apiKey && settings.baseUrl && settings.model);
  }

  async function chat(messages, options = {}) {
    const { temperature = 0.8, json = false, timeoutMs = 30000, maxTokens = 800 } = options;
    if (!isReady()) throw new Error("ai-not-configured");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(settings.baseUrl.replace(/\/+$/, "") + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + settings.apiKey
        },
        body: JSON.stringify({
          model: settings.model,
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(json ? { response_format: { type: "json_object" } } : {})
        }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error("ai-http-" + response.status);
      const data = await response.json();
      const text = data && data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content || "" : "";
      if (!text) throw new Error("ai-empty-response");
      return text;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function chatJson(messages, options = {}) {
    const text = await chat(messages, { ...options, json: true });
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("ai-no-json");
    return JSON.parse(text.slice(start, end + 1));
  }

  async function test() {
    return chat([{ role: "user", content: "请只回复四个字：连接成功" }], { timeoutMs: 15000, maxTokens: 32, temperature: 0.1 });
  }

  window.CoReadAI = { get, update, isReady, chat, chatJson, test, SETTINGS_KEY, DEFAULTS };
})();
