import base64
import json
import time
import urllib.request
from pathlib import Path

import websocket


tabs = json.load(urllib.request.urlopen("http://127.0.0.1:9223/json/list"))
page = next(tab for tab in tabs if tab.get("type") == "page" and "v2.html" in tab.get("url", ""))
ws = websocket.create_connection(page["webSocketDebuggerUrl"], timeout=10)
counter = 0


def call(method, params=None):
    global counter
    counter += 1
    ws.send(json.dumps({"id": counter, "method": method, "params": params or {}}))
    while True:
        message = json.loads(ws.recv())
        if message.get("id") == counter:
            if "error" in message:
                raise RuntimeError(message["error"])
            return message.get("result", {})


def evaluate(expression):
    result = call("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
    return result["result"].get("value")


def screenshot(path):
    data = call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
    Path(path).write_bytes(base64.b64decode(data))


call("Page.enable")
call("Runtime.enable")
evaluate("document.querySelector('#computerButton').click(); document.querySelector('#zhihuIcon').click(); true")
time.sleep(2)

feed_state = evaluate("""
(() => {
  const win = document.querySelector('#zhihuWindow');
  const rect = win.getBoundingClientRect();
  const feed = document.querySelector('#zhihuFeed');
  const partner = document.querySelector('#partnerCard');
  return {
    windowVisible: !win.hidden,
    partnerVisible: !partner.hidden,
    feedVisible: !feed.hidden,
    windowRect: {left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom},
    viewport: {width: innerWidth, height: innerHeight},
    taskbarTop: document.querySelector('.desktop-taskbar').getBoundingClientRect().top,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    webgl: !!document.querySelector('#partnerCanvas').getContext('webgl2')
  };
})()
""")
screenshot(r"D:\co-read-game\.tmp\zhihu-doc-feed.png")

inbox_ok = evaluate("document.querySelector('[data-zhihu-view=\"inbox\"]').click(); !document.querySelector('#zhihuInbox').hidden")
profile_ok = evaluate("document.querySelector('[data-zhihu-view=\"profile\"]').click(); !document.querySelector('#zhihuProfile').hidden")
feed_ok = evaluate("document.querySelector('[data-zhihu-view=\"feed\"]').click(); !document.querySelector('#zhihuFeed').hidden")
post_ok = evaluate("document.querySelector('#readPost').click(); !document.querySelector('#zhihuPost').hidden")
screenshot(r"D:\co-read-game\.tmp\zhihu-doc-post.png")
back_ok = evaluate("document.querySelector('#postBack').click(); !document.querySelector('#zhihuFeed').hidden")

drag_start = evaluate("(() => { const r=document.querySelector('#zhihuWindow').getBoundingClientRect(); return {left:r.left,top:r.top}; })()")
drag_point = evaluate("(() => { const r=document.querySelector('.browser-tab-strip').getBoundingClientRect(); return {x:r.left+r.width*.55,y:r.top+16}; })()")
call("Input.dispatchMouseEvent", {"type": "mousePressed", "x": drag_point["x"], "y": drag_point["y"], "button": "left", "buttons": 1, "clickCount": 1})
call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": drag_point["x"] + 46, "y": drag_point["y"] + 24, "button": "left", "buttons": 1})
call("Input.dispatchMouseEvent", {"type": "mouseReleased", "x": drag_point["x"] + 46, "y": drag_point["y"] + 24, "button": "left", "buttons": 0, "clickCount": 1})
drag_end = evaluate("(() => { const r=document.querySelector('#zhihuWindow').getBoundingClientRect(); return {left:r.left,top:r.top}; })()")

call("Emulation.setDeviceMetricsOverride", {"width": 1000, "height": 700, "deviceScaleFactor": 1, "mobile": False})
time.sleep(0.3)
compact_state = evaluate("(() => { const r=document.querySelector('#zhihuWindow').getBoundingClientRect(); const t=document.querySelector('.desktop-taskbar').getBoundingClientRect(); return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,taskbarTop:t.top,viewport:{width:innerWidth,height:innerHeight},overflow:document.documentElement.scrollWidth>innerWidth}; })()")
call("Emulation.clearDeviceMetricsOverride")
time.sleep(0.3)

resources = evaluate("performance.getEntriesByType('resource').filter(r => r.name.includes('v2.') || r.name.includes('app.js') || r.name.includes('assistant3d.js')).map(r => ({name:r.name.split('/').pop(), duration:Math.round(r.duration)}))")
broken_images = evaluate("Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src)")
closed_ok = evaluate("document.querySelector('#backRoom').click(); document.querySelector('#roomScreen').hidden === false && document.querySelector('#desktopScreen').hidden === true")
print(json.dumps({"feed": feed_state, "interactions": {"inbox": inbox_ok, "profile": profile_ok, "feed": feed_ok, "post": post_ok, "postBack": back_ok, "closeToRoom": closed_ok}, "drag": {"start": drag_start, "end": drag_end, "moved": abs(drag_end["left"]-drag_start["left"]) > 20 and abs(drag_end["top"]-drag_start["top"]) > 10}, "compact": compact_state, "brokenImages": broken_images, "resources": resources}, ensure_ascii=False, indent=2))
ws.close()
