import batchUpdate from './batchUpdate'

// store an id to keep track of DOM updates
let batchId = null

export default function triggerUpdate(vm, hookName) {
  if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.paused) {
    // batch potential DOM updates to prevent extraneous re-rendering
    batchId = batchUpdate(batchId, () => {
      vm.$meta().refresh()
      batchId = null
    })
  }
}
