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
var styles_default = "/* dsh-conversation-nav floating conversation-navigation panel.\n * `.qnav-overlay` is a fixed full-height anchor at the conversation column's\n * right edge (inline `right`, `pointer-events: none`). The trigger and the\n * panel are its children and opt back into pointer events; the column layout\n * centers them vertically.\n *\n * The panel and trigger use a fixed light palette (white background, dark\n * text) so they stay readable in both light and dark host themes.\n */\n\n.qnav-overlay {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  z-index: 30;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  justify-content: center;\n  pointer-events: none;\n}\n\n/* The trigger button: a compact vertical pill at the column's right edge. */\n.qnav-trigger {\n  pointer-events: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  width: 36px;\n  padding: 12px 0;\n  margin-right: 8px;\n  border: 1px solid rgba(127, 127, 127, 0.35);\n  border-radius: 18px;\n  background: #ffffff;\n  color: #5f6672;\n  font-size: 12px;\n  line-height: 1;\n  cursor: pointer;\n  transition:\n    color 160ms ease,\n    border-color 160ms ease,\n    transform 160ms ease;\n}\n\n.qnav-trigger:hover {\n  color: #4f6ef2;\n  border-color: rgba(127, 127, 127, 0.35);\n  transform: translateY(-1px);\n}\n\n.qnav-trigger .qnav-trigger-icon {\n  font-size: 16px;\n  line-height: 1;\n}\n\n.qnav-trigger .qnav-trigger-count {\n  font-variant-numeric: tabular-nums;\n}\n\n/* The expanded panel: a narrow card beside the column's right edge. */\n.qnav-panel {\n  pointer-events: auto;\n  display: flex;\n  flex-direction: column;\n  width: 260px;\n  max-height: min(60vh, 480px);\n  margin-right: 8px;\n  border: 1px solid rgba(127, 127, 127, 0.25);\n  border-radius: 12px;\n  background: #ffffff;\n  overflow: hidden;\n}\n\n.qnav-panel-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 10px 12px;\n  border-bottom: 1px solid rgba(127, 127, 127, 0.25);\n  color: #1f2329;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qnav-panel-close {\n  pointer-events: auto;\n  border: none;\n  background: none;\n  color: #5f6672;\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 4px;\n}\n\n.qnav-panel-close:hover {\n  color: #1f2329;\n  background: rgba(0, 0, 0, 0.06);\n}\n\n.qnav-list {\n  flex: 1;\n  overflow-y: auto;\n  padding: 6px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.qnav-item {\n  pointer-events: auto;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  padding: 7px 8px;\n  border: none;\n  border-radius: 8px;\n  background: none;\n  color: #1f2329;\n  font-size: 12.5px;\n  line-height: 1.5;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 150ms ease;\n}\n\n.qnav-item:hover {\n  background: #f0f0f0;\n}\n\n.qnav-item-text {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  word-break: break-word;\n}\n\n.qnav-empty {\n  padding: 16px 12px;\n  color: #5f6672;\n  font-size: 12.5px;\n  text-align: center;\n}\n\n/* Flash highlight applied to the target chat row after a jump. */\n.qnav-flash {\n  animation: qnav-flash 1.4s ease-out;\n  border-radius: 8px;\n}\n\n@keyframes qnav-flash {\n  0% { background: #4f6ef2; opacity: 0.9; }\n  100% { background: transparent; opacity: 1; }\n}\n";

// src/client/index.js
var NS = "dsh-conversation-nav";
var zh = {
  "panel.title": "\u4F1A\u8BDD\u5BFC\u822A",
  "panel.empty": "\u6682\u65E0\u63D0\u95EE",
  "panel.close": "\u5173\u95ED"
};
var en = {
  "panel.title": "Session",
  "panel.empty": "No questions yet",
  "panel.close": "Close"
};
var inject = ["slots", "locale"];
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
  const { useSession, t } = props;
  const [expanded, setExpanded] = React.useState(true);
  const right = useCenterRight();
  const questions = useSession((s) => {
    const out = [];
    for (const key of s.chat.order) {
      const node = s.chat.nodes.get(key);
      if (node === void 0 || node.kind !== "user") continue;
      const text = messageText(node.data.content);
      if (text === "") continue;
      out.push({ key, text });
    }
    return out;
  }, (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].key !== b[i].key || a[i].text !== b[i].text) return false;
    }
    return true;
  });
  const jump = (key) => {
    const row = document.querySelector(`[data-chat-anchor-key="${CSS.escape(key)}"]`);
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
    questions.length === 0 ? React.createElement("div", { className: "qnav-empty" }, t("panel.empty")) : React.createElement(
      "div",
      { className: "qnav-list" },
      questions.map((q, i) => React.createElement(
        "button",
        {
          key: q.key,
          type: "button",
          className: "qnav-item",
          onClick: () => jump(q.key)
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
    locale: NS
  }, QnavPanel));
}

return module.exports;
} });
