import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField
} from "./chunk-45IN2YCG.js";

// node_modules/spotify-audio-element/spotify-audio-element.js
var EMBED_BASE = "https://open.spotify.com";
var MATCH_SRC = /open\.spotify\.com\/(\w+)\/(\w+)/i;
var API_URL = "https://open.spotify.com/embed-podcast/iframe-api/v1";
var API_GLOBAL = "SpotifyIframeApi";
var API_GLOBAL_READY = "onSpotifyIframeApiReady";
function getTemplateHTML(attrs) {
  const iframeAttrs = {
    src: serializeIframeUrl(attrs),
    frameborder: 0,
    width: "100%",
    height: "100%",
    allow: "accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
  };
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-block;
        min-width: 160px;
        min-height: 80px;
        position: relative;
      }
      iframe {
        position: absolute;
        top: 0;
        left: 0;
      }
      :host(:not([controls])) {
        display: none !important;
      }
    </style>
    <iframe${serializeAttributes(iframeAttrs)}></iframe>
  `
  );
}
function serializeIframeUrl(attrs) {
  if (!attrs.src) return;
  const matches = attrs.src.match(MATCH_SRC);
  const type = matches && matches[1];
  const metaId = matches && matches[2];
  const params = {
    t: attrs.starttime,
    theme: attrs.theme === "dark" ? "0" : null
  };
  return `${EMBED_BASE}/embed/${type}/${metaId}?${serialize(params)}`;
}
var _loadRequested, _hasLoaded, _isInit, _isWaiting, _closeToEnded, _paused, _currentTime, _duration, _seeking;
var SpotifyAudioElement = class extends (globalThis.HTMLElement ?? class {
}) {
  constructor() {
    super(...arguments);
    __publicField(this, "loadComplete", new PublicPromise());
    __privateAdd(this, _loadRequested);
    __privateAdd(this, _hasLoaded);
    __privateAdd(this, _isInit);
    __privateAdd(this, _isWaiting, false);
    __privateAdd(this, _closeToEnded, false);
    __privateAdd(this, _paused, true);
    __privateAdd(this, _currentTime, 0);
    __privateAdd(this, _duration, NaN);
    __privateAdd(this, _seeking, false);
  }
  async load() {
    if (__privateGet(this, _loadRequested)) return;
    if (__privateGet(this, _hasLoaded)) this.loadComplete = new PublicPromise();
    __privateSet(this, _hasLoaded, true);
    await __privateSet(this, _loadRequested, Promise.resolve());
    __privateSet(this, _loadRequested, null);
    __privateSet(this, _isWaiting, false);
    __privateSet(this, _closeToEnded, false);
    __privateSet(this, _currentTime, 0);
    __privateSet(this, _duration, NaN);
    __privateSet(this, _seeking, false);
    this.dispatchEvent(new Event("emptied"));
    let oldApi = this.api;
    this.api = null;
    if (!this.src) {
      return;
    }
    this.dispatchEvent(new Event("loadstart"));
    const options = {
      t: this.startTime,
      theme: this.theme === "dark" ? "0" : null
    };
    if (__privateGet(this, _isInit)) {
      this.api = oldApi;
      this.api.iframeElement.src = serializeIframeUrl(namedNodeMapToObject(this.attributes));
    } else {
      __privateSet(this, _isInit, true);
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = getTemplateHTML(namedNodeMapToObject(this.attributes));
      }
      let iframe = this.shadowRoot.querySelector("iframe");
      const Spotify = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
      this.api = await new Promise((resolve) => Spotify.createController(iframe, options, resolve));
      this.api.iframeElement = iframe;
      this.api.addListener("ready", () => {
        this.dispatchEvent(new Event("loadedmetadata"));
        this.dispatchEvent(new Event("durationchange"));
        this.dispatchEvent(new Event("volumechange"));
      });
      this.api.addListener("playback_update", (event) => {
        if (__privateGet(this, _closeToEnded) && __privateGet(this, _paused) && (event.data.isBuffering || !event.data.isPaused)) {
          __privateSet(this, _closeToEnded, false);
          this.currentTime = 1;
          return;
        }
        if (event.data.duration / 1e3 !== __privateGet(this, _duration)) {
          __privateSet(this, _closeToEnded, false);
          __privateSet(this, _duration, event.data.duration / 1e3);
          this.dispatchEvent(new Event("durationchange"));
        }
        if (event.data.position / 1e3 !== __privateGet(this, _currentTime)) {
          __privateSet(this, _seeking, false);
          __privateSet(this, _closeToEnded, false);
          __privateSet(this, _currentTime, event.data.position / 1e3);
          this.dispatchEvent(new Event("timeupdate"));
        }
        if (!__privateGet(this, _isWaiting) && !__privateGet(this, _paused) && event.data.isPaused) {
          __privateSet(this, _paused, true);
          this.dispatchEvent(new Event("pause"));
          return;
        }
        if (__privateGet(this, _paused) && (event.data.isBuffering || !event.data.isPaused)) {
          __privateSet(this, _paused, false);
          this.dispatchEvent(new Event("play"));
          __privateSet(this, _isWaiting, event.data.isBuffering);
          if (__privateGet(this, _isWaiting)) {
            this.dispatchEvent(new Event("waiting"));
          } else {
            this.dispatchEvent(new Event("playing"));
          }
          return;
        }
        if (__privateGet(this, _isWaiting) && !event.data.isPaused) {
          __privateSet(this, _isWaiting, false);
          this.dispatchEvent(new Event("playing"));
          return;
        }
        if (!this.paused && !this.seeking && !__privateGet(this, _closeToEnded) && Math.ceil(this.currentTime) >= this.duration) {
          __privateSet(this, _closeToEnded, true);
          if (this.loop) {
            this.currentTime = 1;
            return;
          }
          if (!this.continuous) {
            this.pause();
            this.dispatchEvent(new Event("ended"));
          }
          return;
        }
      });
    }
    this.loadComplete.resolve();
    await this.loadComplete;
  }
  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attrName) {
      case "src":
      case "theme":
      case "starttime": {
        this.load();
        return;
      }
    }
  }
  async play() {
    var _a;
    __privateSet(this, _paused, false);
    __privateSet(this, _isWaiting, true);
    this.dispatchEvent(new Event("play"));
    await this.loadComplete;
    return (_a = this.api) == null ? void 0 : _a.resume();
  }
  async pause() {
    var _a;
    await this.loadComplete;
    return (_a = this.api) == null ? void 0 : _a.pause();
  }
  get paused() {
    return __privateGet(this, _paused) ?? true;
  }
  get muted() {
    return false;
  }
  get volume() {
    return 1;
  }
  get ended() {
    return Math.ceil(this.currentTime) >= this.duration;
  }
  get seeking() {
    return __privateGet(this, _seeking);
  }
  get loop() {
    return this.hasAttribute("loop");
  }
  set loop(val) {
    if (this.loop == val) return;
    this.toggleAttribute("loop", Boolean(val));
  }
  get currentTime() {
    return __privateGet(this, _currentTime);
  }
  set currentTime(val) {
    if (this.currentTime == val) return;
    __privateSet(this, _seeking, true);
    let oldTime = __privateGet(this, _currentTime);
    __privateSet(this, _currentTime, val);
    this.dispatchEvent(new Event("timeupdate"));
    __privateSet(this, _currentTime, oldTime);
    this.loadComplete.then(() => {
      var _a;
      (_a = this.api) == null ? void 0 : _a.seek(val);
    });
  }
  get duration() {
    return __privateGet(this, _duration);
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(val) {
    this.setAttribute("src", `${val}`);
  }
  get startTime() {
    return parseFloat(this.getAttribute("starttime") ?? 0);
  }
  set startTime(val) {
    if (this.startTime == val) return;
    this.setAttribute("starttime", +val);
  }
  get theme() {
    return this.getAttribute("theme");
  }
  set theme(val) {
    this.setAttribute("theme", val);
  }
  get continuous() {
    return this.hasAttribute("continuous");
  }
  set continuous(val) {
    if (this.continuous == val) return;
    this.toggleAttribute("continuous", Boolean(val));
  }
};
_loadRequested = new WeakMap();
_hasLoaded = new WeakMap();
_isInit = new WeakMap();
_isWaiting = new WeakMap();
_closeToEnded = new WeakMap();
_paused = new WeakMap();
_currentTime = new WeakMap();
_duration = new WeakMap();
_seeking = new WeakMap();
__publicField(SpotifyAudioElement, "getTemplateHTML", getTemplateHTML);
__publicField(SpotifyAudioElement, "shadowRootOptions", { mode: "open" });
__publicField(SpotifyAudioElement, "observedAttributes", [
  "controls",
  "loop",
  "src",
  "starttime",
  "continuous",
  "theme"
]);
function serializeAttributes(attrs) {
  let html = "";
  for (const key in attrs) {
    const value = attrs[key];
    if (value === "") html += ` ${key}`;
    else html += ` ${key}="${value}"`;
  }
  return html;
}
function serialize(props) {
  return String(new URLSearchParams(boolToBinary(props)));
}
function boolToBinary(props) {
  let p = {};
  for (let key in props) {
    let val = props[key];
    if (val === true || val === "") p[key] = 1;
    else if (val === false) p[key] = 0;
    else if (val != null) p[key] = val;
  }
  return p;
}
function namedNodeMapToObject(namedNodeMap) {
  let obj = {};
  for (let attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}
var loadScriptCache = {};
async function loadScript(src, globalName, readyFnName) {
  if (loadScriptCache[src]) return loadScriptCache[src];
  if (globalName && self[globalName]) {
    return Promise.resolve(self[globalName]);
  }
  return loadScriptCache[src] = new Promise(function(resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    const ready = (api) => resolve(api);
    if (readyFnName) self[readyFnName] = ready;
    script.onload = () => !readyFnName && ready();
    script.onerror = reject;
    document.head.append(script);
  });
}
var PublicPromise = class extends Promise {
  constructor(executor = () => {
  }) {
    let res, rej;
    super((resolve, reject) => {
      executor(resolve, reject);
      res = resolve;
      rej = reject;
    });
    this.resolve = res;
    this.reject = rej;
  }
};
if (globalThis.customElements && !globalThis.customElements.get("spotify-audio")) {
  globalThis.customElements.define("spotify-audio", SpotifyAudioElement);
}
var spotify_audio_element_default = SpotifyAudioElement;
export {
  spotify_audio_element_default as default
};
//# sourceMappingURL=spotify-audio-element.js.map
