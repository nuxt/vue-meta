import isArray from './isArray'
import { isObject } from './typeof'

export function ensureIsArray(arg, key) {
  if (isObject(arg) && key) {
    if (!isArray(arg[key])) {
      arg[key] = []
    }

    return arg
  }

  return isArray(arg) ? arg : []
}

export function ensuredPush(object, key, el) {
  ensureIsArray(object, key)

  object[key].push(el)
}
