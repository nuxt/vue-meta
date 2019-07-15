/**
 * checks if passed argument is an array
 * @param  {any}  arg - the object to check
 * @return {Boolean} - true if `arg` is an array
 */
export function isArray (arg) {
  return Array.isArray(arg)
}

export function isUndefined (arg) {
  return typeof arg === 'undefined'
}

export function isObject (arg) {
  return typeof arg === 'object'
}

export function isPureObject (arg) {
  return typeof arg === 'object' && arg !== null
}

export function isFunction (arg) {
  return typeof arg === 'function'
}

export function isString (arg) {
  return typeof arg === 'string'
}
