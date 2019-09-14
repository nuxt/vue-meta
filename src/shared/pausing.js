import { rootConfigKey } from './constants'

export function pause (rootVm, refresh) {
  rootVm[rootConfigKey].pausing = true

  return () => resume(rootVm, refresh)
}

export function resume (rootVm, refresh) {
  rootVm[rootConfigKey].pausing = false

  if (refresh || refresh === undefined) {
    return rootVm.$meta().refresh()
  }
}
