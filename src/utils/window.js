import { isUndefined } from './is-type'

export function hasGlobalWindowFn () {
  try {
    return !isUndefined(window)
  } catch (e) {
    return false
  }
}

export const hasGlobalWindow = hasGlobalWindowFn()
