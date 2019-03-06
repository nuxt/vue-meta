import { isUndefined } from './typeof'

export function hasGlobalWindowFn() {
  try {
    return !isUndefined(window)
  } catch (e) {
    return false
  }
}

export const hasGlobalWindow = hasGlobalWindowFn()
