import { rootConfigKey } from './constants'

export function pause (rootVm, refresh = true) {
  rootVm[rootConfigKey].paused = true

  return () => resume(refresh)
}

export function resume (rootVm, refresh = true) {
  rootVm[rootConfigKey].paused = false

  if (refresh) {
    return rootVm.$meta().refresh()
  }
}
