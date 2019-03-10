/**
 * checks if passed argument is an array
 * @param  {any}  arr - the object to check
 * @return {Boolean} - true if `arr` is an array
 */
export function isArray(arr) {
  return Array.isArray
    ? Array.isArray(arr)
    : Object.prototype.toString.call(arr) === '[object Array]'
}

export function isUndefined(arg) {
  return typeof arg === 'undefined'
}

export function isObject(arg) {
  return typeof arg === 'object'
}

export function isFunction(arg) {
  return typeof arg === 'function'
}

export function isString(arg) {
  return typeof arg === 'string'
}
