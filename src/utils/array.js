/*
 * To reduce build size, this file provides simple polyfills without
 * overly excessive type checking and without modifying
 * the global Array.prototype
 * The polyfills are automatically removed in the commonjs build
 * Also, only files in client/ & shared/ should use these functions
 * files in server/ still use normal js function
 */

// this const is replaced by rollup to true for umd builds
// which means the polyfills are removed for other build formats
const polyfill = process.env.NODE_ENV === 'test'

export function findIndex (array, predicate, thisArg) {
  if (polyfill && !Array.prototype.findIndex) {
    // idx needs to be a Number, for..in returns string
    for (let idx = 0; idx < array.length; idx++) {
      if (predicate.call(thisArg, array[idx], idx, array)) {
        return idx
      }
    }
    return -1
  }
  return array.findIndex(predicate, thisArg)
}

export function toArray (arg) {
  if (polyfill && !Array.from) {
    return Array.prototype.slice.call(arg)
  }
  return Array.from(arg)
}

export function includes (array, value) {
  if (polyfill && !Array.prototype.includes) {
    for (const idx in array) {
      if (array[idx] === value) {
        return true
      }
    }

    return false
  }
  return array.includes(value)
}
