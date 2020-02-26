import { isArray, isObject } from './is-type'

export function ensureIsArray (arg, key) {
  if (!key || !isObject(arg)) {
    return isArray(arg) ? arg : []
  }

  if (!isArray(arg[key])) {
    arg[key] = []
  }
  return arg
}
