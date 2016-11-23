/**
 * checks if passed argument is an array
 * @param  {any}  arr - the object to check
 * @return {Boolean} - true if `arr` is an array
 */
export default function isArray (arr) {
  return Array.isArray
    ? Array.isArray(arr)
    : Object.prototype.toString.call(arr) === '[object Array]'
}
