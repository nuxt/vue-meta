import refresh from '../client/refresh'
import { pause, resume } from '../shared/pausing'
import inject from './inject'

export default function _$meta(options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return function $meta() {
    return {
      inject: inject(options).bind(this),
      refresh: refresh(options).bind(this),
      pause: pause.bind(this),
      resume: resume.bind(this)
    }
  }
}
