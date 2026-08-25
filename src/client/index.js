/**
 * dsh-conversation-nav, browser half: a floating "会话导航" (Conversation
 * Navigation) panel on the right edge of the conversation column.
 *
 * The overlay entry is registered into the frame-wide `shell.overlay` list
 * slot (root scope). It declares a session-scoped child slot `qnav.panel`;
 * the standard kit hands the entry `SessionProvider` and `renderSlot`, so the
 * overlay renders the child inside the current session's provider. The panel
 * entry (strict session scope) then reads the conversation snapshot through
 * the `useSession` standard hook, lists the user messages, and scrolls the
 * chat to the chosen message's rendered row (`[data-chat-anchor-key]`).
 *
 * On mount the panel pages the session's full history in (serial loadOlder()
 * through the sessions service face), so questions outside the initially
 * loaded tail page still appear in the list and stay jumpable.
 */
import * as React from 'react'
import styles from './styles.css'

const NS = 'dsh-conversation-nav'

const zh = {
  'panel.title': '会话导航',
  'panel.empty': '暂无提问',
  'panel.close': '关闭',
  'panel.loading': '正在加载全部提问…',
}

const en = {
  'panel.title': 'Session',
  'panel.empty': 'No questions yet',
  'panel.close': 'Close',
  'panel.loading': 'Loading all questions…',
}

export const inject = ['slots', 'locale', 'sessions']

/**
 * Page one session's history window back to its start, so the navigation list
 * covers every question rather than only the loaded tail page. Serial
 * `loadOlder()` calls until `hasMore` clears; bounded wait and round caps keep
 * a never-opening or stalled window from hanging the loop.
 * @param sessions - the client sessions service face.
 * @param sessionId - the session to fully load.
 * @returns completion of the paging loop.
 */
async function loadAllHistory(sessions, sessionId) {
  const actx = sessions.scope(sessionId)
  const face = actx === undefined ? undefined : sessions.sessionOf(actx)
  if (face === undefined) return
  // loadOlder is a no-op before the window opens; wait out the tail-page pull.
  for (let waited = 0; waited < 100 && face.getSnapshot().openState !== 'open'; waited++) {
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  for (let round = 0; round < 400; round++) {
    const snap = face.getSnapshot()
    if (snap.openState !== 'open' || !snap.hasMore) return
    const before = snap.chat.order.length
    await face.loadOlder()
    // A round that grew nothing while hasMore held means the paging stalled
    // (in-flight guard or transport failure) — stop instead of spinning.
    if (face.getSnapshot().chat.order.length === before) return
  }
}

/**
 * Extract the plain text of a user message node's content blocks.
 * @param content - `UserMessageNode['content']` blocks.
 * @returns joined text trimmed.
 */
function messageText(content) {
  let text = ''
  for (const block of content) {
    if (block !== null && typeof block === 'object' && block.type === 'text' && typeof block.text === 'string') {
      text += block.text
    }
  }
  return text.trim()
}

/**
 * Measure the conversation column's right edge in viewport px. The frame's
 * details drag handle carries an inline `left` equal to the center column's
 * right edge; when details is closed no handle exists and the center column
 * reaches the frame's right edge.
 * @returns viewport-x of the conversation column's right edge.
 */
function measureCenterRight() {
  const overlay = document.querySelector('[data-shell-overlay]')
  const frame = overlay?.parentElement ?? null
  if (frame === null) return window.innerWidth
  const handle = frame.querySelector('[data-side="details"]')
  if (handle instanceof HTMLElement) {
    const left = parseInt(handle.style.left, 10)
    if (Number.isFinite(left)) return left
  }
  return frame.getBoundingClientRect().right
}

/**
 * Track the conversation column's right edge live: window resize plus frame
 * grid/style mutations (details open/close, sidebar drags, auto-collapse).
 * @returns the current right edge in viewport px.
 */
function useCenterRight() {
  const [right, setRight] = React.useState(() => measureCenterRight())
  React.useEffect(() => {
    const measure = () => setRight(measureCenterRight())
    window.addEventListener('resize', measure)
    const overlay = document.querySelector('[data-shell-overlay]')
    const frame = overlay?.parentElement ?? null
    let observer = null
    if (frame !== null && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(measure)
      observer.observe(frame, {
        attributes: true,
        attributeFilter: ['style', 'data-details-collapsed'],
      })
    }
    return () => {
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [])
  return right
}

/**
 * The root overlay component: hosts the session provider and renders the
 * session-scoped panel slot. Without a current session nothing renders.
 * @param props - standard kit (renderSlot, SessionProvider).
 */
function QnavOverlay(props) {
  const { renderSlot, SessionProvider } = props
  return React.createElement(
    SessionProvider,
    null,
    () => React.createElement(
      'div',
      { className: 'qnav-overlay', style: { pointerEvents: 'none' } },
      renderSlot('qnav.panel', {}),
    ),
  )
}

/**
 * The session-scoped panel: the floating trigger plus the expandable list of
 * the session's user questions. Clicking a question scrolls the chat to that
 * message's row and flashes it. Mounting pages the full history in (see
 * loadAllHistory) so the list covers questions outside the loaded tail page.
 * @param props - standard kit (useSession, t, sessionId) plus the injected
 *   loadAllHistory callback.
 */
function QnavPanel(props) {
  const { useSession, t, sessionId, loadAllHistory } = props
  const [expanded, setExpanded] = React.useState(true)
  const right = useCenterRight()

  // Kick the full-history preload once per session. The callback is rebuilt by
  // the slot inject factory on every render (identity-unstable), so the latest
  // one rides a ref while the effect keys on the session id only.
  const loadRef = React.useRef(loadAllHistory)
  loadRef.current = loadAllHistory
  React.useEffect(() => {
    void loadRef.current()
  }, [sessionId])

  // True while the preload is still paging (or the user is paging manually).
  const loadingAll = useSession((s) => s.hasMore || s.loadingOlder, (a, b) => a === b)

  // Derive the ordered user-message list from the chat snapshot. `order` is a
  // stable reference that changes only on structural moves; nodes are read
  // through the live store so a newly appended user message republishes.
  const questions = useSession((s) => {
    const out = []
    for (const key of s.chat.order) {
      const node = s.chat.nodes.get(key)
      if (node === undefined || node.kind !== 'user') continue
      const text = messageText(node.data.content)
      if (text === '') continue
      out.push({ key, text })
    }
    return out
  }, (a, b) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i].key !== b[i].key || a[i].text !== b[i].text) return false
    }
    return true
  })

  const jump = (key) => {
    const row = document.querySelector(`[data-chat-anchor-key="${CSS.escape(key)}"]`)
    if (row === null) return
    row.scrollIntoView({ behavior: 'smooth', block: 'start' })
    row.classList.add('qnav-flash')
    window.setTimeout(() => row.classList.remove('qnav-flash'), 1500)
  }

  const panel = expanded
    ? React.createElement(
      'div',
      { className: 'qnav-panel' },
      React.createElement(
        'div',
        { className: 'qnav-panel-header' },
        React.createElement('span', null, t('panel.title')),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'qnav-panel-close',
            'aria-label': t('panel.close'),
            onClick: () => setExpanded(false),
          },
          '\u00d7',
        ),
      ),
      loadingAll ? React.createElement('div', { className: 'qnav-loading' }, t('panel.loading')) : null,
      questions.length === 0
        ? React.createElement('div', { className: 'qnav-empty' }, t('panel.empty'))
        : React.createElement(
          'div',
          { className: 'qnav-list' },
          questions.map((q, i) => React.createElement(
            'button',
            {
              key: q.key,
              type: 'button',
              className: 'qnav-item',
              onClick: () => jump(q.key),
            },
            React.createElement('span', { className: 'qnav-item-text' }, q.text),
          )),
        ),
    )
    : React.createElement(
      'button',
      {
        type: 'button',
        className: 'qnav-trigger',
        title: t('panel.title'),
        onClick: () => setExpanded(true),
      },
      React.createElement('span', { className: 'qnav-trigger-icon' }, 'Q'),
      React.createElement('span', { className: 'qnav-trigger-count' }, String(questions.length)),
    )

  return React.createElement(
    'div',
    { className: 'qnav-overlay', style: { pointerEvents: 'none', right: Math.max(0, window.innerWidth - right) } },
    panel,
  )
}

/**
 * Client plugin body: register the locale dictionaries, inject the stylesheet,
 * and register the overlay + panel slot entries.
 * @param ctx - client root context.
 */
export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-conversation-nav: dictionaries')

  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-conversation-nav'
    style.textContent = styles
    document.head.append(style)
    return () => style.remove()
  }, 'dsh-conversation-nav: styles')

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'dsh-conversation-nav',
    order: 40,
    locale: NS,
    children: {
      'qnav.panel': { kind: 'single', scope: 'session' },
    },
  }, QnavOverlay))

  ctx.slots.inject('qnav.panel', () => ctx.slots.register({
    name: 'qnav.panel',
    locale: NS,
    inject: (sessionId) => ({
      loadAllHistory: () => loadAllHistory(ctx.sessions, sessionId),
    }),
  }, QnavPanel))
}
