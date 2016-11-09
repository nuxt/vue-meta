import inject from '../server/inject'
import refresh from '../client/refresh'

/**
 * Returns an injector for server-side rendering.
 * @this {Object} - the Vue instance (a root component)
 * @return {Object} - injector
 */
export default function $meta () {
  // bind inject method to this component
  return {
    inject: inject.bind(this),
    refresh: refresh.bind(this)
  }
}
