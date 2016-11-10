import inject from '../server/inject'
import refresh from '../client/refresh'

export default function _$meta (options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return function $meta () {
    return {
      inject: inject(options).bind(this),
      refresh: refresh(options).bind(this)
    }
  }
}
