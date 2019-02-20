import { pause, resume } from '../shared/pausing'
import refresh from './refresh'

export default function _$meta(options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return function $meta() {
    return {
      inject: () => {},
      refresh: refresh(options).bind(this),
      pause: pause.bind(this),
      resume: resume.bind(this)
    }
  }
}
