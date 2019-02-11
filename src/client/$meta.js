import refresh from './refresh'

export default function _$meta(options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return function $meta() {
    return {
      refresh: refresh(options).bind(this)
    }
  }
}
