export function pause(refresh = true) {
  this.$root._vueMetaPaused = true

  return () => resume(refresh)
}

export function resume(refresh = true) {
  this.$root._vueMetaPaused = false

  if (refresh) {
    return this.$root.$meta().refresh()
  }
}
