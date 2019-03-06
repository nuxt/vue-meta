export function pause(refresh = true) {
  this.$root._vueMeta.paused = true

  return () => resume(refresh)
}

export function resume(refresh = true) {
  this.$root._vueMeta.paused = false

  if (refresh) {
    return this.$root.$meta().refresh()
  }
}
