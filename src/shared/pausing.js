export function pause (vm, refresh = true) {
  vm.$root._vueMeta.paused = true

  return () => resume(refresh)
}

export function resume (vm, refresh = true) {
  vm.$root._vueMeta.paused = false

  if (refresh) {
    return vm.$root.$meta().refresh()
  }
}
