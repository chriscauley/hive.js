import { fetchJson, useAuth, useTheme } from '@unrest/ui'

// hive used to own its colour scheme: store/config.js kept a `darkmode`
// boolean and wrote data-theme="dark"|"light". @unrest/ui defines its palette
// on <family>-<mode> selectors instead (slate-dark, indigo-light, ...), so a
// bare "dark" matched none of them and every unrest component fell back to its
// built-in light values -- which is why the nav went light. This module hands
// the whole job to @unrest/ui.

const DEFAULT_FAMILY = 'slate'

// useTheme's watch is { immediate: true }, so it fires once during setup with
// the value we just seeded. That is not a user choice and must not be PUT back
// to the server -- especially before we know who is signed in.
let syncing_enabled = false

const syncFn = (value) => {
  if (!syncing_enabled || !useAuth().isAuthenticated) return
  // Fire and forget: a failed theme save is not worth interrupting anyone for.
  fetchJson('/api/auth/settings', { method: 'PUT', body: { theme: value } }).catch(() => {})
}

// Carry the old preference over, once, so existing players keep the mode they
// had. useTheme falls back to indigo-dark on its own, which would both change
// the family and ignore anyone who had turned dark mode off.
const migrateLegacyConfig = () => {
  if (localStorage.getItem('theme')) return
  let darkmode = true
  try {
    const config = JSON.parse(localStorage.getItem('config') || '{}')
    if (typeof config.darkmode === 'boolean') darkmode = config.darkmode
  } catch {
    // Unparseable config: fall through to the dark default.
  }
  localStorage.setItem('theme', `${DEFAULT_FAMILY}-${darkmode ? 'dark' : 'light'}`)
}

export const setupTheme = () => {
  migrateLegacyConfig()
  // useTheme memoizes a single instance, and syncFn is captured on that first
  // call -- so this has to run before any component calls useTheme().
  const theme = useTheme({ syncFn })
  syncing_enabled = true
  return theme
}

// The account's theme wins over the browser's once we know who is signed in.
// syncFromServer ignores empty values and suppresses the write-back, so a user
// who has never picked one keeps their local choice instead of being reset.
export const loadServerTheme = async () => {
  if (!useAuth().isAuthenticated) return
  try {
    const data = await fetchJson('/api/auth/settings')
    if (data?.theme) useTheme().syncFromServer(data.theme)
  } catch {
    // Not signed in any more, or the endpoint is unhappy; keep the local theme.
  }
}
