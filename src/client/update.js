// store an id to keep track of DOM updates
let batchId = null

export function triggerUpdate(vm, hookName) {
  // if an update was triggered during initialization or when an update was triggered by the
  // metaInfo watcher, set initialized to null
  // then we keep falsy value but know we need to run a triggerUpdate after initialization
  if (!vm.$root._vueMeta.initialized && (vm.$root._vueMeta.initializing || hookName === 'watcher')) {
    vm.$root._vueMeta.initialized = null
  }

  if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.paused) {
    // batch potential DOM updates to prevent extraneous re-rendering
    batchUpdate(() => vm.$meta().refresh())
  }
}

/**
 * Performs a batched update.
 *
 * @param  {(null|Number)} id - the ID of this update
 * @param  {Function} callback - the update to perform
 * @return {Number} id - a new ID
 */
export function batchUpdate(callback, timeout = 10) {
  clearTimeout(batchId)

  batchId = setTimeout(() => {
    callback()
  }, timeout)

  return batchId
}
