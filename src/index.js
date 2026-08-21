/**
 * dsh-conversation-nav, node half.
 *
 * Deliberately empty. The conversation-navigation panel is browser UI only: it
 * reads the conversation snapshot through the session standard kit and scrolls
 * rendered chat rows; nothing here needs the host. The row exists so the
 * loader mounts the entry (which the client-modules node half scans for its
 * `dsh.client` declaration and serves the browser bundle for).
 */

/** Host plugin body — no host behavior. */
export function apply() {}
