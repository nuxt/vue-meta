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
  // fallback to timers if rAF not present
  const stopUpdate = window.cancelAnimationFrame || window.clearTimeout
  const startUpdate = window.requestAnimationFrame || ((cb) => window.setTimeout(cb, 0))

  // stop any existing updates
  stopUpdate(id)

  // perform an update
  return startUpdate(() => {
    id = null
    callback()
  })
}
