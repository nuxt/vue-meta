import { rootConfigKey } from '../shared/constants'
import { hasGlobalWindow } from '../utils/window'

const scheduleRefresh = (hasGlobalWindow && window.requestIdleCallback) || function (cb, { timeout }) {
  return setTimeout(cb, timeout)
}
const cancelRefresh = (hasGlobalWindow && window.cancelIdleCallback) || clearTimeout

// store an id to keep track of DOM updates
let batchId = null

export function triggerUpdate ({ debounceWait }, rootVm, hookName) {
  // if an update was triggered during initialization or when an update was triggered by the
  // metaInfo watcher, set initialized to null
  // then we keep falsy value but know we need to run a triggerUpdate after initialization
  if (!rootVm[rootConfigKey].initialized && (rootVm[rootConfigKey].initializing || hookName === 'watcher')) {
    rootVm[rootConfigKey].initialized = null
  }

  if (rootVm[rootConfigKey].initialized && !rootVm[rootConfigKey].pausing) {
    // batch potential DOM updates to prevent extraneous re-rendering
    batchUpdate(() => void rootVm.$meta().refresh(), debounceWait)
  }
}

/**
 * Performs a batched update.
 *
 * @param  {(null|Number)} id - the ID of this update
 * @param  {Function} callback - the update to perform
 * @return {Number} id - a new ID
 */
export function batchUpdate (callback, timeout) {
  timeout = timeout === undefined ? 10 : timeout

  if (!timeout) {
    callback()
    return
  }

  cancelRefresh(batchId)
  batchId = scheduleRefresh(() => {
    callback()
  }, { timeout })

  return batchId
}
