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
 * The list is a merge of two sources: a full history index fetched straight
 * through the `sessions.history` RPC (so questions outside the lazily loaded
 * tail page still appear, without rendering them into the chat), and the live
 * snapshot rows. Clicking an out-of-window question pages the chat window back
 * to it on demand before scrolling.
 */
import * as React from 'react'
import styles from './styles.css'

const NS = 'dsh-conversation-nav'

const zh = {
  'panel.title': '会话导航',
  'panel.empty': '暂无提问',
  'panel.close': '关闭',
  'panel.loading': '正在加载全部提问…',
  'panel.locating': '正在定位该提问…',
}

const en = {
  'panel.title': 'Session',
  'panel.empty': 'No questions yet',
  'panel.close': 'Close',
  'panel.loading': 'Loading all questions…',
  'panel.locating': 'Locating the question…',
}

export const inject = ['slots', 'locale', 'sessions', 'connection']

/** One question indexed straight from the history RPC (seq-addressed, key-free). */
// (questions merge live snapshot rows keyed by seq; see QnavPanel)

/**
 * Page the session's full history through the raw history RPC and index every
 * user question — without touching the chat window, which keeps its lazy tail
 * page. Serial `sessions.history` calls from the tail backwards until
 * `hasMore` clears; the round cap keeps a huge or failing session bounded.
 * @param api - the shared IApiClient (ctx.connection.api).
 * @param sessionId - the session to index.
 * @returns ascending-seq questions `{ seq, text }`; `complete` false when the cap cut paging short.
 */
async function fetchAllQuestions(api, sessionId) {
  const out = []
  let beforeSeq
  for (let round = 0; round < 400; round++) {
    const { result } = await api.sessions.history({
      sessionId,
      ...(beforeSeq === undefined ? {} : { beforeSeq }),
      maxMessages: 50,
    })
    if (!result.ok) break
    for (const entry of result.value.events) {
      const ev = entry.event
      if (ev.type !== 'user/message' || ev.data?.source?.kind !== 'user') continue
      const text = messageText(ev.data.content)
      if (text !== '') out.push({ seq: ev.seq, text })
    }
    if (!result.value.hasMore) return { questions: out.sort((a, b) => a.seq - b.seq), complete: true }
    const first = result.value.events[0]?.event.seq
    if (first === undefined) break
    beforeSeq = first
  }
  return { questions: out.sort((a, b) => a.seq - b.seq), complete: false }
}

/**
 * Resolve the chat-row key for one seq-addressed question. Rows already in the
 * window resolve immediately; older ones page in through serial `loadOlder()`
 * until the target seq enters the window (on-demand, never past it).
 * @param sessions - the client sessions service face.
 * @param sessionId - the session holding the question.
 * @param seq - the question's history event seq.
 * @returns the chat node key, or undefined when the row could not be loaded.
 */
async function resolveJumpKey(sessions, sessionId, seq) {
  const actx = sessions.scope(sessionId)
  const face = actx === undefined ? undefined : sessions.sessionOf(actx)
  if (face === undefined) return undefined
  const findKey = () => {
    const snap = face.getSnapshot()
    for (const key of snap.chat.order) {
      const node = snap.chat.nodes.get(key)
      // Both user-authored kinds count: turn-opening questions render as
      // 'user', mid-turn ones as 'steering' — same source.kind on the wire.
      // The event seq rides both the payload (`data.seq`) and the view-node
      // anchor (`anchorSeq`); accept either as a match.
      if (node !== undefined && (node.kind === 'user' || node.kind === 'steering')
        && (node.data?.seq === seq || node.anchorSeq === seq)) {
        return key
      }
    }
    return undefined
  }
  let key = findKey()
  for (let round = 0; key === undefined && round < 400; round++) {
    const snap = face.getSnapshot()
    if (snap.openState !== 'open' || !snap.hasMore) break
    await face.loadOlder()
    key = findKey()
  }
  return key
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
 * the session's user questions. The list merges a full history index fetched
 * straight through the history RPC (covering questions outside the lazy tail
 * page) with the live snapshot rows; clicking a question jumps to its row,
 * paging the window on demand when the row is not loaded yet.
 * @param props - standard kit (useSession, t, sessionId) plus the injected
 *   fetchAllQuestions and resolveJumpKey callbacks.
 */
function QnavPanel(props) {
  const { useSession, t, sessionId, fetchAllQuestions, resolveJumpKey } = props
  const [expanded, setExpanded] = React.useState(true)
  const [remoteQuestions, setRemoteQuestions] = React.useState([])
  const [locating, setLocating] = React.useState(false)
  const right = useCenterRight()

  // Index the full history once per session. The callback is rebuilt by the
  // slot inject factory on every render (identity-unstable), so the latest one
  // rides a ref while the effect keys on the session id only.
  const fetchRef = React.useRef(fetchAllQuestions)
  fetchRef.current = fetchAllQuestions
  const [indexing, setIndexing] = React.useState(false)
  React.useEffect(() => {
    let cancelled = false
    setRemoteQuestions([])
    setIndexing(true)
    void (async () => {
      const { questions } = await fetchRef.current()
      if (!cancelled) {
        setRemoteQuestions(questions)
        setIndexing(false)
      }
    })()
    return () => { cancelled = true }
  }, [sessionId])

  // Live rows from the chat snapshot (loaded window only). Both user-authored
  // kinds count — 'user' and mid-turn 'steering'. `order` is a stable
  // reference that changes only on structural moves; nodes are read through
  // the live store so a newly appended user message republishes.
  const liveQuestions = useSession((s) => {
    const out = []
    for (const key of s.chat.order) {
      const node = s.chat.nodes.get(key)
      if (node === undefined || (node.kind !== 'user' && node.kind !== 'steering')) continue
      const text = messageText(node.data.content)
      if (text === '') continue
      out.push({ key, seq: node.data.seq ?? node.anchorSeq, text })
    }
    return out
  }, (a, b) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i].key !== b[i].key || a[i].text !== b[i].text) return false
    }
    return true
  })

  // Merge: the remote index is the full skeleton; live rows override their seq
  // twin (they carry the jump key). Ascending seq keeps the order stable.
  const questions = React.useMemo(() => {
    const bySeq = new Map()
    for (const q of remoteQuestions) bySeq.set(q.seq, { seq: q.seq, text: q.text, key: undefined })
    for (const q of liveQuestions) bySeq.set(q.seq, { seq: q.seq, text: q.text, key: q.key })
    return [...bySeq.values()].sort((a, b) => a.seq - b.seq)
  }, [remoteQuestions, liveQuestions])

  const jump = async (item) => {
    console.debug('[qnav] jump', item)
    let key = item.key
    if (key === undefined) {
      // Row outside the loaded window: page the window back to it on demand.
      setLocating(true)
      key = await resolveJumpKey(item.seq)
      if (key === undefined) {
        console.debug('[qnav] jump: key unresolved for seq', item.seq)
        setLocating(false)
        return
      }
    }
    // Prepended rows reach the DOM one React commit after loadOlder resolves;
    // rendering many pages can take seconds, so poll generously.
    const selector = `[data-chat-anchor-key="${CSS.escape(key)}"]`
    let row = document.querySelector(selector)
    for (let waited = 0; row === null && waited < 100; waited++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      row = document.querySelector(selector)
    }
    setLocating(false)
    if (row === null) {
      console.debug('[qnav] jump: row never appeared', selector)
      return
    }
    // A freshly paged window keeps re-rendering while the smooth scroll runs,
    // which can cancel it; verify the row actually enters the viewport and
    // retry, falling back to an instant scroll.
    const inViewport = (el) => {
      const rect = el.getBoundingClientRect()
      return rect.top >= -20 && rect.top < window.innerHeight - 60
    }
    for (let attempt = 0; attempt < 6 && !inViewport(row); attempt++) {
      row.scrollIntoView({ behavior: 'smooth', block: 'start' })
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
    if (!inViewport(row)) row.scrollIntoView({ block: 'start' })
    console.debug('[qnav] jump: scrolled inViewport=', inViewport(row))
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
        locating ? React.createElement('span', { className: 'qnav-head-status' }, t('panel.locating')) : null,
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
      indexing ? React.createElement('div', { className: 'qnav-loading' }, t('panel.loading')) : null,
      questions.length === 0
        ? React.createElement('div', { className: 'qnav-empty' }, t('panel.empty'))
        : React.createElement(
          'div',
          { className: 'qnav-list' },
          questions.map((q, i) => React.createElement(
            'button',
            {
              key: q.seq,
              type: 'button',
              className: 'qnav-item',
              onClick: () => { void jump(q) },
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
      fetchAllQuestions: () => fetchAllQuestions(ctx.connection.api, sessionId),
      resolveJumpKey: (seq) => resolveJumpKey(ctx.sessions, sessionId, seq),
    }),
  }, QnavPanel))
}
