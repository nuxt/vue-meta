// fallback to timers if rAF not present
const stopUpdate = (typeof window !== 'undefined' ? window.cancelAnimationFrame : null) || clearTimeout
const startUpdate = (typeof window !== 'undefined' ? window.requestAnimationFrame : null) || ((cb) => setTimeout(cb, 0))

/**
 * Performs a batched update. Uses requestAnimationFrame to prevent
 * calling a function too many times in quick succession.
 * You need to pass it an ID (which can initially be `null`),
 * but be sure to overwrite that ID with the return value of batchUpdate.
 *
 * @param  {(null|Number)} id - the ID of this update
 * @param  {Function} callback - the update to perform
 * @return {Number} id - a new ID
 */
export default function batchUpdate (id, callback) {
  stopUpdate(id)
  return startUpdate(() => {
    id = null
    callback()
  })
}
