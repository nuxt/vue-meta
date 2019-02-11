
export function isType(arg, type) {
  return typeof arg === type
}

export function isUndefined(arg) {
  return isType(arg, 'undefined')
}

export function isObject(arg) {
  return isType(arg, 'object')
}

export function isFunction(arg) {
  return isType(arg, 'function')
}

export function isString(arg) {
  return isType(arg, 'string')
}
