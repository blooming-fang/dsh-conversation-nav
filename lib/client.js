window.__ModuleLoader__.load({ id: "dsh-conversation-nav", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.js
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var React = __toESM(require("react"), 1);

// src/client/styles.css
var styles_default = "/* dsh-conversation-nav floating conversation-navigation panel.\n * `.qnav-overlay` is a fixed full-height anchor at the conversation column's\n * right edge (inline `right`, `pointer-events: none`). The trigger and the\n * panel are its children and opt back into pointer events; the column layout\n * centers them vertically.\n *\n * The panel and trigger use a fixed light palette (white background, dark\n * text) so they stay readable in both light and dark host themes.\n */\n\n.qnav-overlay {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  z-index: 30;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  justify-content: center;\n  pointer-events: none;\n}\n\n/* The trigger button: a compact vertical pill at the column's right edge. */\n.qnav-trigger {\n  pointer-events: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  width: 36px;\n  padding: 12px 0;\n  margin-right: 8px;\n  border: 1px solid rgba(127, 127, 127, 0.35);\n  border-radius: 18px;\n  background: #ffffff;\n  color: #5f6672;\n  font-size: 12px;\n  line-height: 1;\n  cursor: pointer;\n  transition:\n    color 160ms ease,\n    border-color 160ms ease,\n    transform 160ms ease;\n}\n\n.qnav-trigger:hover {\n  color: #4f6ef2;\n  border-color: rgba(127, 127, 127, 0.35);\n  transform: translateY(-1px);\n}\n\n.qnav-trigger .qnav-trigger-icon {\n  font-size: 16px;\n  line-height: 1;\n}\n\n.qnav-trigger .qnav-trigger-count {\n  font-variant-numeric: tabular-nums;\n}\n\n/* The expanded panel: a narrow card beside the column's right edge. */\n.qnav-panel {\n  pointer-events: auto;\n  display: flex;\n  flex-direction: column;\n  width: 260px;\n  max-height: min(60vh, 480px);\n  margin-right: 8px;\n  border: 1px solid rgba(127, 127, 127, 0.25);\n  border-radius: 12px;\n  background: #ffffff;\n  overflow: hidden;\n}\n\n.qnav-panel-header {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  border-bottom: 1px solid rgba(127, 127, 127, 0.25);\n  color: #1f2329;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n/* Small status caption next to the panel title (e.g. locating a question). */\n.qnav-head-status {\n  color: #8a919c;\n  font-size: 11px;\n  font-weight: 400;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.qnav-panel-close {\n  pointer-events: auto;\n  margin-left: auto;\n  border: none;\n  background: none;\n  color: #5f6672;\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 4px;\n}\n\n.qnav-panel-close:hover {\n  color: #1f2329;\n  background: rgba(0, 0, 0, 0.06);\n}\n\n.qnav-list {\n  flex: 1;\n  overflow-y: auto;\n  padding: 6px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.qnav-item {\n  pointer-events: auto;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  padding: 7px 8px;\n  border: none;\n  border-radius: 8px;\n  background: none;\n  color: #1f2329;\n  font-size: 12.5px;\n  line-height: 1.5;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 150ms ease;\n}\n\n.qnav-item:hover {\n  background: #f0f0f0;\n}\n\n.qnav-item-text {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  word-break: break-word;\n}\n\n.qnav-empty {\n  padding: 16px 12px;\n  color: #5f6672;\n  font-size: 12.5px;\n  text-align: center;\n}\n\n/* Full-history preload progress line under the panel header. */\n.qnav-loading {\n  padding: 6px 12px;\n  border-bottom: 1px solid rgba(127, 127, 127, 0.15);\n  color: #5f6672;\n  font-size: 11.5px;\n}\n\n/* Flash highlight applied to the target chat row after a jump. */\n.qnav-flash {\n  animation: qnav-flash 1.4s ease-out;\n  border-radius: 8px;\n}\n\n@keyframes qnav-flash {\n  0% { background: #4f6ef2; opacity: 0.9; }\n  100% { background: transparent; opacity: 1; }\n}\n";

// src/client/index.js
var NS = "dsh-conversation-nav";
var zh = {
  "panel.title": "\u4F1A\u8BDD\u5BFC\u822A",
  "panel.empty": "\u6682\u65E0\u63D0\u95EE",
  "panel.close": "\u5173\u95ED",
  "panel.loading": "\u6B63\u5728\u52A0\u8F7D\u5168\u90E8\u63D0\u95EE\u2026",
  "panel.locating": "\u6B63\u5728\u5B9A\u4F4D\u8BE5\u63D0\u95EE\u2026"
};
var en = {
  "panel.title": "Session",
  "panel.empty": "No questions yet",
  "panel.close": "Close",
  "panel.loading": "Loading all questions\u2026",
  "panel.locating": "Locating the question\u2026"
};
var inject = ["slots", "locale", "sessions", "connection"];
async function fetchAllQuestions(api, sessionId) {
  const out = [];
  let beforeSeq;
  for (let round = 0; round < 400; round++) {
    const { result } = await api.sessions.history({
      sessionId,
      ...beforeSeq === void 0 ? {} : { beforeSeq },
      maxMessages: 50
    });
    if (!result.ok) break;
    for (const entry of result.value.events) {
      const ev = entry.event;
      if (ev.type !== "user/message" || ev.data?.source?.kind !== "user") continue;
      const text = messageText(ev.data.content);
      if (text !== "") out.push({ seq: ev.seq, text });
    }
    if (!result.value.hasMore) return { questions: out.sort((a, b) => a.seq - b.seq), complete: true };
    const first = result.value.events[0]?.event.seq;
    if (first === void 0) break;
    beforeSeq = first;
  }
  return { questions: out.sort((a, b) => a.seq - b.seq), complete: false };
}
async function resolveJumpKey(sessions, sessionId, seq) {
  const actx = sessions.scope(sessionId);
  const face = actx === void 0 ? void 0 : sessions.sessionOf(actx);
  if (face === void 0) return void 0;
  const findKey = () => {
    const snap = face.getSnapshot();
    for (const key2 of snap.chat.order) {
      const node = snap.chat.nodes.get(key2);
      if (node !== void 0 && (node.kind === "user" || node.kind === "steering") && node.data?.seq === seq) {
        return key2;
      }
    }
    return void 0;
  };
  let key = findKey();
  for (let round = 0; key === void 0 && round < 400; round++) {
    const snap = face.getSnapshot();
    if (snap.openState !== "open" || !snap.hasMore) break;
    await face.loadOlder();
    key = findKey();
  }
  return key;
}
function messageText(content) {
  let text = "";
  for (const block of content) {
    if (block !== null && typeof block === "object" && block.type === "text" && typeof block.text === "string") {
      text += block.text;
    }
  }
  return text.trim();
}
function measureCenterRight() {
  const overlay = document.querySelector("[data-shell-overlay]");
  const frame = overlay?.parentElement ?? null;
  if (frame === null) return window.innerWidth;
  const handle = frame.querySelector('[data-side="details"]');
  if (handle instanceof HTMLElement) {
    const left = parseInt(handle.style.left, 10);
    if (Number.isFinite(left)) return left;
  }
  return frame.getBoundingClientRect().right;
}
function useCenterRight() {
  const [right, setRight] = React.useState(() => measureCenterRight());
  React.useEffect(() => {
    const measure = () => setRight(measureCenterRight());
    window.addEventListener("resize", measure);
    const overlay = document.querySelector("[data-shell-overlay]");
    const frame = overlay?.parentElement ?? null;
    let observer = null;
    if (frame !== null && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(measure);
      observer.observe(frame, {
        attributes: true,
        attributeFilter: ["style", "data-details-collapsed"]
      });
    }
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);
  return right;
}
function QnavOverlay(props) {
  const { renderSlot, SessionProvider } = props;
  return React.createElement(
    SessionProvider,
    null,
    () => React.createElement(
      "div",
      { className: "qnav-overlay", style: { pointerEvents: "none" } },
      renderSlot("qnav.panel", {})
    )
  );
}
function QnavPanel(props) {
  const { useSession, t, sessionId, fetchAllQuestions: fetchAllQuestions2, resolveJumpKey: resolveJumpKey2 } = props;
  const [expanded, setExpanded] = React.useState(true);
  const [remoteQuestions, setRemoteQuestions] = React.useState([]);
  const [locating, setLocating] = React.useState(false);
  const right = useCenterRight();
  const fetchRef = React.useRef(fetchAllQuestions2);
  fetchRef.current = fetchAllQuestions2;
  const [indexing, setIndexing] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    setRemoteQuestions([]);
    setIndexing(true);
    void (async () => {
      const { questions: questions2 } = await fetchRef.current();
      if (!cancelled) {
        setRemoteQuestions(questions2);
        setIndexing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);
  const liveQuestions = useSession((s) => {
    const out = [];
    for (const key of s.chat.order) {
      const node = s.chat.nodes.get(key);
      if (node === void 0 || node.kind !== "user" && node.kind !== "steering") continue;
      const text = messageText(node.data.content);
      if (text === "") continue;
      out.push({ key, seq: node.data.seq, text });
    }
    return out;
  }, (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].key !== b[i].key || a[i].text !== b[i].text) return false;
    }
    return true;
  });
  const questions = React.useMemo(() => {
    const bySeq = /* @__PURE__ */ new Map();
    for (const q of remoteQuestions) bySeq.set(q.seq, { seq: q.seq, text: q.text, key: void 0 });
    for (const q of liveQuestions) bySeq.set(q.seq, { seq: q.seq, text: q.text, key: q.key });
    return [...bySeq.values()].sort((a, b) => a.seq - b.seq);
  }, [remoteQuestions, liveQuestions]);
  const jump = async (item) => {
    let key = item.key;
    if (key === void 0) {
      setLocating(true);
      key = await resolveJumpKey2(item.seq);
      if (key === void 0) {
        setLocating(false);
        return;
      }
    }
    const selector = `[data-chat-anchor-key="${CSS.escape(key)}"]`;
    let row = document.querySelector(selector);
    for (let waited = 0; row === null && waited < 100; waited++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      row = document.querySelector(selector);
    }
    setLocating(false);
    if (row === null) return;
    row.scrollIntoView({ behavior: "smooth", block: "start" });
    row.classList.add("qnav-flash");
    window.setTimeout(() => row.classList.remove("qnav-flash"), 1500);
  };
  const panel = expanded ? React.createElement(
    "div",
    { className: "qnav-panel" },
    React.createElement(
      "div",
      { className: "qnav-panel-header" },
      React.createElement("span", null, t("panel.title")),
      locating ? React.createElement("span", { className: "qnav-head-status" }, t("panel.locating")) : null,
      React.createElement(
        "button",
        {
          type: "button",
          className: "qnav-panel-close",
          "aria-label": t("panel.close"),
          onClick: () => setExpanded(false)
        },
        "\xD7"
      )
    ),
    indexing ? React.createElement("div", { className: "qnav-loading" }, t("panel.loading")) : null,
    questions.length === 0 ? React.createElement("div", { className: "qnav-empty" }, t("panel.empty")) : React.createElement(
      "div",
      { className: "qnav-list" },
      questions.map((q, i) => React.createElement(
        "button",
        {
          key: q.seq,
          type: "button",
          className: "qnav-item",
          onClick: () => {
            void jump(q);
          }
        },
        React.createElement("span", { className: "qnav-item-text" }, q.text)
      ))
    )
  ) : React.createElement(
    "button",
    {
      type: "button",
      className: "qnav-trigger",
      title: t("panel.title"),
      onClick: () => setExpanded(true)
    },
    React.createElement("span", { className: "qnav-trigger-icon" }, "Q"),
    React.createElement("span", { className: "qnav-trigger-count" }, String(questions.length))
  );
  return React.createElement(
    "div",
    { className: "qnav-overlay", style: { pointerEvents: "none", right: Math.max(0, window.innerWidth - right) } },
    panel
  );
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-conversation-nav: dictionaries");
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "dsh-conversation-nav";
    style.textContent = styles_default;
    document.head.append(style);
    return () => style.remove();
  }, "dsh-conversation-nav: styles");
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dsh-conversation-nav",
    order: 40,
    locale: NS,
    children: {
      "qnav.panel": { kind: "single", scope: "session" }
    }
  }, QnavOverlay));
  ctx.slots.inject("qnav.panel", () => ctx.slots.register({
    name: "qnav.panel",
    locale: NS,
    inject: (sessionId) => ({
      fetchAllQuestions: () => fetchAllQuestions(ctx.connection.api, sessionId),
      resolveJumpKey: (seq) => resolveJumpKey(ctx.sessions, sessionId, seq)
    })
  }, QnavPanel));
}

return module.exports;
} });
